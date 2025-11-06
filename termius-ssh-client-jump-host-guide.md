# Termius SSH客户端完全指南：跳板机配置与实战

## 什么是Termius？

**Termius**是一款现代化的跨平台SSH客户端，支持macOS、Windows、Linux、iOS和Android。相比传统的命令行SSH，Termius提供了图形化界面、跳板机管理、密钥同步等企业级功能。

**核心优势**：
- 跨设备同步：配置在云端同步，手机/电脑无缝切换
- 可视化管理：主机列表、分组管理、连接状态一目了然
- 跳板机支持：原生支持ProxyJump，无需手动配置SSH config
- 移动端友好：手机上也能流畅操作服务器

**适用场景**：
- 企业开发：需要通过跳板机访问内网服务器
- 移动办公：手机/平板远程运维
- 多设备协同：在不同设备上管理同一批服务器

## 核心概念对比

### Termius vs SSH Config

如果你熟悉 `~/.ssh/config`，Termius的配置与之对应：

| SSH Config | Termius界面 | 说明 |
|-----------|------------|------|
| `Host` | Label | 主机别名 |
| `Hostname` | Address | 服务器IP/域名 |
| `Port` | SSH on port | SSH端口 |
| `User` | Username | 登录用户名 |
| `IdentityFile` | Key | SSH私钥 |
| `ProxyJump` | Host Chaining | 跳板机 |

### 跳板机术语

- **Host Chaining**: Termius的跳板机功能（对应SSH的ProxyJump）
- **Jump Host**: 跳板机/堡垒机，中转服务器
- **Target Host**: 目标服务器，最终要访问的机器

**连接链路**：
```
本地 → 跳板机 (Jump Host) → 目标服务器 (Target Host)
```

## 界面字段详解

### 新建主机界面

#### Address区域
- **IP or Hostname**: 服务器地址
  - 示例：`192.168.1.100` 或 `dev.example.com`

#### General区域
- **Label**: 主机显示名称（如 `开发服务器`、`生产数据库`）
- **Parent Group**: 主机分组（可选），便于管理大量服务器
- **Tags**: 标签，用于筛选和分类
- **Backspace**: 工作空间选择（企业版功能）

#### SSH配置
- **SSH on port**: SSH端口，默认22

#### Credentials (认证凭据)
- **Username**: SSH登录用户名
- **Password**: 密码登录
- **Key, Certificate, FIDO2**: SSH密钥/证书认证

#### 高级配置

**Agent Forwarding (SSH代理转发)**
- 用途：让远程服务器使用本地SSH密钥
- 场景：在跳板机上执行 `git pull` 时使用本地密钥，无需在服务器存放私钥
- ⚠️ 安全风险：远程管理员可能滥用你的密钥，慎用

**Startup Command (启动命令)**
- 登录后自动执行的命令
- 示例：`cd /var/www && ll`

**Host Chaining (跳板机设置)** ⭐核心功能
- **Direct**: 直连，不使用跳板机
- 或选择已添加的跳板机主机

**Proxy (代理服务器)**
- HTTP/SOCKS代理，用于穿透防火墙
- 区别：Proxy是应用层代理，Host Chaining是SSH层跳转

**Environment Variable (环境变量)**
- 自定义登录会话的环境变量

**Mosh (移动Shell协议)**
- 移动网络优化的SSH替代方案
- 优势：网络切换不断连（WiFi ↔ 4G）、高延迟环境流畅
- 限制：服务器需安装 `mosh-server`，使用UDP协议
- 适用：移动办公，网络不稳定时开启

## 跳板机配置实战

### 场景1：单跳板机架构

**需求**：
- 跳板机：`bastion.example.com:60022`
- 目标服务器：内网 `10.1.5.20:36000`
- 用户名：跳板机 `user1`，目标服务器 `devuser`

#### 步骤1：添加跳板机

1. 点击 `Hosts` → `New Host`
2. 填写跳板机信息：
   - **Label**: `跳板机-开发环境`
   - **Address**: `bastion.example.com`
   - **Port**: `60022`
   - **Username**: `user1`
   - **Key**: 选择SSH私钥 `~/.ssh/id_rsa`
3. 保存

#### 步骤2：添加目标服务器

1. 点击 `Hosts` → `New Host`
2. 填写目标服务器信息：
   - **Label**: `开发服务器`
   - **Address**: `10.1.5.20`
   - **Port**: `36000`
   - **Username**: `devuser`
   - **Key**: 选择SSH私钥
3. 展开高级设置
4. 点击 **Host Chaining** → 选择 `跳板机-开发环境`
5. 保存

#### 步骤3：连接

点击 `开发服务器`，Termius会自动：
1. 先连接跳板机 `bastion.example.com:60022`
2. 通过跳板机跳转到 `10.1.5.20:36000`

### 场景2：JumpServer新版本格式

**特殊格式**：JumpServer使用 `User link@xuser@192.168.0.30` 格式，用户名包含资产信息。

**配置**：
- **Address**: `39.108.154.89`
- **Port**: `60022`
- **Username**: `link@xuser@192.168.0.30`
- **Host Chaining**: Direct（不需要额外跳板机）

**说明**：
- JumpServer新版本在用户名中嵌入了目标服务器信息
- Termius直连JumpServer，由JumpServer内部转发到目标机器

### 场景3：多级跳转（跳板链）

**需求**：
```
本地 → 公网跳板机A → 内网跳板机B → 目标服务器C
```

#### 配置步骤

1. **跳板机A（公网）**
   - Label: `公网跳板机`
   - Address: `public-bastion.com:2222`
   - Host Chaining: Direct

2. **跳板机B（内网）**
   - Label: `内网跳板机`
   - Address: `10.0.1.100:22`
   - Host Chaining: 选择 `公网跳板机`

3. **目标服务器C**
   - Label: `生产数据库`
   - Address: `10.10.5.200:22`
   - Host Chaining: 选择 `内网跳板机`

**连接链路**：Termius会自动建立三级跳转链路。

## 实用技巧

### 1. 主机分组管理

**场景**：管理几十台服务器，按环境/项目分类

**操作**：
1. 创建分组：`Hosts` → 右键 → `New Group`
2. 分组命名：`开发环境`、`测试环境`、`生产环境`
3. 拖拽主机到分组，或在 `Parent Group` 中选择

### 2. 密钥统一管理

**场景**：多台服务器使用同一个SSH密钥

**操作**：
1. `Keychain` → 导入密钥
2. 添加主机时，在 `Key` 字段选择已导入的密钥
3. 密钥修改后，所有使用该密钥的主机自动更新

### 3. 快速复制主机配置

**场景**：配置相似的服务器（如Kubernetes节点）

**操作**：
1. 右键已配置的主机
2. `Duplicate` 复制主机
3. 修改 Address 和 Label

### 4. 端口转发（Port Forwarding）

**场景**：访问目标服务器上的Web服务（如MySQL、Redis）

**操作**：
1. 连接目标服务器
2. 右上角 `···` → `Port Forwarding`
3. 添加转发规则：
   - Local: `localhost:3307`
   - Remote: `127.0.0.1:3306`
4. 本地通过 `localhost:3307` 访问远程MySQL

### 5. SFTP文件传输

**场景**：上传/下载文件

**操作**：
1. 连接服务器后，点击右上角 `SFTP` 图标
2. 可视化浏览远程文件
3. 拖拽上传/下载文件

### 6. 会话录制

**场景**：记录操作日志，用于审计或复盘

**操作**：
1. 连接服务器
2. `···` → `Start Recording`
3. 操作完成后 `Stop Recording`
4. 在 `Recordings` 中回放

### 7. 自定义主题

**场景**：长时间盯屏，保护视力

**操作**：
1. `Settings` → `Appearance`
2. 选择主题：Light、Dark、Ocean等
3. 或自定义颜色方案

## 对比其他SSH客户端

| 功能 | Termius | iTerm2 + SSH Config | SecureCRT |
|-----|---------|---------------------|-----------|
| 跨平台 | ✅ 全平台 | ❌ 仅macOS | ✅ Win/Mac/Linux |
| 移动端 | ✅ iOS/Android | ❌ | ❌ |
| 跳板机配置 | 图形化，简单 | 需手写config | 图形化 |
| 密钥同步 | 云端同步 | 手动管理 | 手动管理 |
| SFTP | ✅ 内置 | 需额外工具 | ✅ 内置 |
| 端口转发 | 图形化配置 | 命令行参数 | 图形化配置 |
| 价格 | 免费版受限，$10/月订阅 | 免费 | 付费 $99 |

**推荐场景**：
- **Termius**：移动办公、多设备同步、团队协作
- **iTerm2 + SSH Config**：纯macOS用户，习惯命令行
- **SecureCRT**：企业环境，需要审计和会话管理

## 常见问题

### Q1：跳板机配置后连接失败

**排查步骤**：
1. 测试跳板机是否能单独连接
2. 检查目标服务器地址是否正确（内网IP）
3. 确认跳板机能访问目标服务器（在跳板机上 `ssh devuser@10.1.5.20`）
4. 查看 Termius 日志：`···` → `Logs`

### Q2：密钥认证失败

**解决方案**：
1. 确认公钥已添加到服务器 `~/.ssh/authorized_keys`
2. 检查私钥格式（Termius支持RSA、Ed25519）
3. 尝试密码登录，排查密钥问题
4. 查看服务器日志：`sudo tail -f /var/log/auth.log`

### Q3：JumpServer用户名格式错误

**错误示例**：
```
User: user@asset@10.1.5.20  # ❌ 可能被解析为邮箱
```

**正确配置**：
- Termius中直接填写完整用户名字符串
- 不要手动分隔，JumpServer会自动解析

### Q4：多跳板机连接慢

**优化方案**：
1. 启用 SSH 连接复用（ControlMaster）
2. 减少跳转层级，合并跳板机
3. 检查网络延迟：`ping` 测试各节点
4. 使用 Mosh 协议（需服务器支持）

### Q5：云同步安全吗？

**安全机制**：
- 私钥加密存储，使用主密码保护
- 端到端加密传输
- 支持本地存储模式（不上传云端）

**企业建议**：
- 使用本地存储模式
- 或使用企业自建同步服务（企业版功能）

## 安全最佳实践

### 1. 密钥管理

⚠️ **私钥保护**
- 设置强主密码（Master Password）
- 定期轮换SSH密钥
- 删除不再使用的密钥

⚠️ **权限控制**
- 使用不同密钥访问不同环境（开发/生产分离）
- 避免使用root账户，使用sudo提权

### 2. 跳板机安全

⚠️ **堡垒机配置**
- 启用双因素认证（2FA）
- 限制跳板机的出站访问（白名单）
- 定期审计跳板机日志

⚠️ **Agent Forwarding风险**
- 仅在信任的服务器上启用
- 使用完立即断开连接
- 考虑使用 `ProxyCommand` 替代

### 3. 数据保护

⚠️ **会话安全**
- 关闭自动重连功能（防止未授权访问）
- 设置会话超时时间
- 不在公共场所使用移动端连接生产服务器

⚠️ **本地缓存**
- 定期清理连接历史
- 卸载应用前清除数据
- 不在不可信设备上登录

## 高级配置示例

### SSH Config导入

Termius支持导入现有的 `~/.ssh/config`：

**操作**：
1. `Hosts` → `Import`
2. 选择 SSH Config 文件
3. Termius自动解析并创建主机

**注意**：
- ProxyJump会转换为Host Chaining
- Include指令可能需要手动处理

### 批量导出配置

**场景**：迁移到新设备或备份配置

**操作**：
1. `Settings` → `Export`
2. 选择导出格式（JSON/SSH Config）
3. 保存文件，在新设备导入

### 团队共享（企业版）

**功能**：
- 共享主机配置（不包含密钥）
- 团队成员权限管理
- 审计日志

**适用**：开发团队统一服务器配置

## 命令行对照表

### 常用SSH命令与Termius操作对应

| SSH命令 | Termius操作 |
|---------|-------------|
| `ssh user@host` | 点击主机连接 |
| `ssh -i ~/.ssh/key user@host` | 主机配置中选择Key |
| `ssh -p 2222 user@host` | Port字段填2222 |
| `ssh -J jump user@target` | Host Chaining选择跳板机 |
| `ssh -L 3307:localhost:3306 user@host` | Port Forwarding配置 |
| `scp file user@host:/path` | SFTP拖拽上传 |
| `ssh-add ~/.ssh/key` | Keychain导入密钥 |

## 总结

**Termius适合你吗？**

✅ **推荐使用**：
- 需要移动办公（手机/平板运维）
- 管理大量服务器（分组/标签）
- 多设备协同（配置同步）
- 跳板机架构（图形化配置）

❌ **不推荐**：
- 纯命令行爱好者
- 仅偶尔使用SSH
- 预算有限（免费版功能受限）

**核心价值**：
- 降低SSH配置门槛
- 跨平台统一体验
- 企业级安全和审计

掌握Termius的跳板机配置，让复杂的SSH跳转变得简单！

---
*记录时间: 2025-11-06*
*测试版本: Termius 9.x*
*官方网站: https://termius.com*
