# Linux 环境变量覆盖问题排查实战

## 核心概念

1. **配置文件优先级**: 用户级配置 > 全局配置，后加载的覆盖先加载的
2. **Shell 加载顺序**: `/etc/environment` → `/etc/profile` → `~/.bash_profile` → `~/.bashrc`
3. **运行时覆盖**: 初始化后仍可能被 `profile.d` 脚本、项目配置、父进程继承等覆盖

## 问题场景

配置文件里设置 `ENVMARK=900`，但实际生效的是 `1000`：

```bash
# 配置文件中都是 900
$ sudo grep -inr "ENVMARK" /etc/*
./bash.bashrc:72:export ENVMARK=900
./environment:2:export ENVMARK=900
./profile:34:export ENVMARK=900

$ grep -n "ENVMARK" ~/.bashrc ~/.bash_profile
/home/xuser/.bashrc:123:export ENVMARK=900
/home/xuser/.bash_profile:132:export ENVMARK=900

# 但实际值是 1000
$ echo $ENVMARK
1000
```

## 配置文件加载顺序对比

| 配置文件 | 加载时机 | 作用域 | 优先级 | 典型用途 |
|:---|:---|:---|---:|:---|
| `/etc/environment` | 系统启动时 | 全局（所有用户） | 1 | 系统级环境变量 |
| `/etc/profile` | 登录 Shell | 全局（所有用户） | 2 | PATH、全局别名 |
| `/etc/bash.bashrc` | 交互式 Shell | 全局（所有用户） | 3 | 全局交互式配置 |
| `/etc/profile.d/*.sh` | 登录 Shell | 全局（所有用户） | 4 | 模块化配置脚本 |
| `~/.bash_profile` | 登录 Shell | 当前用户 | 5 | 用户级初始化 |
| `~/.bashrc` | 交互式 Shell | 当前用户 | 6 | 用户级交互配置 |
| 项目目录配置 | 进入目录时 | 项目级 | 7 | `.env`、`.envrc` |

**覆盖规则**: 数字越大优先级越高，同级配置后加载的覆盖先加载的。

## 排查流程

### 第一步：确认用户配置
```bash
# 检查用户级配置文件
grep -n "ENVMARK" ~/.bashrc ~/.bash_profile ~/.profile 2>/dev/null

# 检查配置文件后续是否再次修改（假设第 123 行首次设置）
awk 'NR>123 && /ENVMARK/' ~/.bashrc
```

### 第二步：检查延迟加载脚本
```bash
# profile.d 脚本在 profile 之后加载
sudo grep -rn "ENVMARK" /etc/profile.d/
```

### 第三步：检查父进程继承
```bash
# 查看父进程的环境变量（可能从父 Shell 继承）
cat /proc/$PPID/environ | tr '\0' '\n' | grep ENVMARK
```

### 第四步：检查项目级配置（关键）
```bash
# 检查当前目录的环境变量文件
ls -la .env* .envrc

# 搜索项目目录配置
grep -rn "ENVMARK" /alidata/www/xproject/

# 检查是否有目录自动加载工具
which direnv
```

### 第五步：追踪变量设置点
```bash
# 启用 bash 调试，查看变量何时被修改
bash -x -c 'source ~/.bashrc; echo $ENVMARK' 2>&1 | grep ENVMARK

# 临时在 bashrc 中添加追踪
export ENVMARK=900
echo "After bashrc: ENVMARK=$ENVMARK" >&2
```

## 常见覆盖来源

| 覆盖来源 | 检查命令 | 优先级 | 典型场景 |
|:---|:---|---:|:---|
| 用户配置重复设置 | `awk 'NR>N && /VAR/' ~/.bashrc` | 高 | 配置文件多次修改 |
| `profile.d` 脚本 | `grep -r VAR /etc/profile.d/` | 高 | 软件包自动注入 |
| 项目 `.env` 文件 | `grep -r VAR .` | 最高 | 项目级覆盖 |
| direnv 自动加载 | `which direnv && cat .envrc` | 最高 | 自动环境切换 |
| 父进程继承 | `cat /proc/$PPID/environ` | 中 | SSH/tmux 会话 |
| 启动脚本 | `grep VAR /etc/rc.local` | 低 | 服务启动脚本 |

## 设计哲学

**Unix 环境变量机制的设计权衡**：

1. **灵活性 vs 可预测性**: 多层配置允许精细控制，但也导致覆盖关系复杂
2. **全局 vs 局部**: 系统级配置保证一致性，用户级配置提供定制能力
3. **显式 vs 隐式**: 配置文件显式声明，但加载顺序隐式依赖 Shell 类型（登录/交互）

**与其他语言环境管理对比**：

| 特性 | Linux Shell | Python venv | Go modules | Node.js |
|:---|:---|:---|:---|:---|
| 配置层级 | 4+ 层 | 2 层（全局/venv） | 1 层（go.mod） | 3 层（全局/项目/`.env`） |
| 覆盖规则 | 加载顺序 | 虚拟环境优先 | 单一版本 | `.env` 文件优先 |
| 隔离性 | 弱（需手动管理） | 强（完全隔离） | 中（版本锁定） | 中（`node_modules`） |
| 调试难度 | 高 | 低 | 低 | 中 |

**核心启示**: Shell 环境变量追求灵活性，代价是需要理解复杂的加载顺序；现代语言倾向于显式依赖管理。

## 实战案例解决方案

根据原问题（配置都是 900 但生效 1000），最可能的原因：

```bash
# 1. 检查项目目录配置（80% 概率）
cd /alidata/www/xproject
grep -rn "ENVMARK=1000" . --include="*.sh" --include=".env*"

# 2. 检查是否有启动脚本覆盖
ps aux | grep "xproject" | grep -v grep  # 查看进程启动命令
cat /proc/$(pgrep -f xproject)/environ | tr '\0' '\n' | grep ENVMARK

# 3. 检查 systemd 服务配置（如果是服务运行）
systemctl cat xproject.service | grep ENVMARK

# 4. 临时验证：直接在当前 Shell 设置
export ENVMARK=900
echo $ENVMARK  # 如果立即变回 1000，说明有实时监控脚本
```

## 预防措施

### 1. 统一配置管理
```bash
# 集中管理环境变量，避免分散配置
cat > ~/.env_custom <<'EOF'
export ENVMARK=900
export UENVMARK=idc
EOF

# 在 bashrc 中单点引用
echo 'source ~/.env_custom' >> ~/.bashrc
```

### 2. 配置审计脚本
```bash
#!/bin/bash
# env-audit.sh - 追踪环境变量来源

VAR_NAME="ENVMARK"

echo "=== 配置文件中的定义 ==="
grep -rn "export $VAR_NAME" /etc/{environment,profile,bash.bashrc} ~/.{bashrc,bash_profile,profile} 2>/dev/null

echo -e "\n=== profile.d 脚本 ==="
sudo grep -rn "$VAR_NAME" /etc/profile.d/ 2>/dev/null

echo -e "\n=== 当前值 ==="
echo "$VAR_NAME=${!VAR_NAME}"

echo -e "\n=== 可疑项目配置 ==="
find . -maxdepth 3 -name ".env*" -o -name ".envrc" 2>/dev/null | xargs grep -l "$VAR_NAME" 2>/dev/null
```

### 3. 使用环境隔离工具
```bash
# 推荐使用 direnv 显式管理项目环境
sudo apt install direnv
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc

# 项目根目录创建 .envrc
echo 'export ENVMARK=1000' > /alidata/www/xproject/.envrc
direnv allow .  # 显式授权
```

## 调试技巧总结

1. **自顶向下**: 先查高优先级（项目配置），再查低优先级（系统配置）
2. **二分法**: 逐步注释配置文件，定位具体覆盖点
3. **追踪法**: 使用 `bash -x` 或在配置文件中添加 `echo` 语句
4. **进程视角**: 通过 `/proc` 文件系统查看实际环境

---

**关键教训**: 环境变量被覆盖，90% 的情况是项目目录的 `.env` 文件或 `profile.d` 脚本导致的，优先排查这两个位置。
