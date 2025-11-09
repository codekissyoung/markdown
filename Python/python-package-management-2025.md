# Python 包管理最佳实践（2025版）

## 学习信息

- **撰写日期**: 2025-11-09
- **Python版本**: 3.13+
- **推荐工具**: uv
- **参考资料**: uv官方文档、Python Packaging指南

---

## 核心观点

**2025年Python包管理最佳实践：使用 uv**

```
传统方式（多工具组合）：
  pip + virtualenv + pyenv + requirements.txt

现代方式（一体化）：
  uv（一个工具搞定所有）
```

---

## 一、传统工具链的问题

### 工具分散

| 工具 | 用途 | 问题 |
| :--- | :--- | :--- |
| `pip` | 包安装 | 速度慢、无依赖锁定 |
| `virtualenv` | 虚拟环境 | 需要手动激活/停用 |
| `pyenv` | Python版本管理 | 配置复杂 |
| `requirements.txt` | 依赖声明 | 无版本锁定、易冲突 |

### 传统工作流程

```bash
# 1. 安装Python版本
pyenv install 3.13.0
pyenv local 3.13.0

# 2. 创建虚拟环境
python -m venv venv
source venv/bin/activate

# 3. 安装依赖
pip install -r requirements.txt

# 4. 开发完成后导出依赖
pip freeze > requirements.txt

# 5. 离开虚拟环境
deactivate
```

**痛点**：
- 步骤繁琐，容易忘记激活环境
- `pip freeze` 包含所有传递依赖，难以维护
- 速度慢，重复下载相同的包
- 跨平台兼容性差

---

## 二、uv：现代一体化解决方案

### 什么是 uv

**uv** - Astral公司（Ruff作者）用Rust编写的超快Python包管理器

**核心特性**：
- ⚡ **极速** - 比pip快10-100倍
- 🔒 **锁定** - 自动生成lock文件，保证可重现构建
- 🎯 **一体化** - 包管理+环境管理+Python版本管理
- 🌍 **跨平台** - Windows/macOS/Linux统一体验
- 🔄 **兼容** - 完全兼容pip生态

### 安装 uv

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# macOS（Homebrew）
brew install uv

# 验证
uv --version
```

---

## 三、uv 核心命令

### 项目初始化

```bash
# 创建新项目
uv init my-project
cd my-project

# 生成的文件结构
my-project/
├── pyproject.toml    # 项目配置和依赖声明
├── README.md
└── .python-version   # 指定Python版本
```

**pyproject.toml 示例**：
```toml
[project]
name = "my-project"
version = "0.1.0"
description = "项目描述"
requires-python = ">=3.13"
dependencies = []

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

### 依赖管理

```bash
# 添加依赖
uv add requests
uv add flask pandas numpy

# 添加开发依赖
uv add --dev pytest black ruff

# 添加指定版本
uv add "django>=4.0,<5.0"

# 删除依赖
uv remove requests

# 同步依赖（根据lock文件安装）
uv sync

# 更新依赖
uv lock --upgrade
```

### Python版本管理

```bash
# 列出可用版本
uv python list

# 安装Python版本
uv python install 3.13
uv python install 3.12

# 查看已安装版本
uv python list --only-installed

# 设置项目Python版本
uv python pin 3.13

# 使用指定版本运行
uv run --python 3.12 script.py
```

### 运行脚本

```bash
# 运行Python脚本（自动激活虚拟环境）
uv run script.py
uv run python -c "print('Hello')"

# 运行命令行工具
uv run pytest
uv run black .

# 临时运行工具（不安装）
uvx black script.py
uvx ruff check .
```

### 虚拟环境

```bash
# 自动创建（uv run/add 时自动）
uv sync

# 手动创建
uv venv

# 指定目录
uv venv .venv

# 激活环境（可选，uv run不需要）
source .venv/bin/activate

# 查看环境信息
uv venv --help
```

---

## 四、实战场景

### 场景1：创建新项目

```bash
# 1. 初始化项目
cd ~/workspace
uv init web-app
cd web-app

# 2. 指定Python版本
uv python pin 3.13

# 3. 添加依赖
uv add flask flask-sqlalchemy python-dotenv

# 4. 添加开发工具
uv add --dev pytest pytest-cov black ruff

# 5. 创建入口文件
cat > app.py << 'EOF'
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(debug=True)
EOF

# 6. 运行
uv run python app.py
```

### 场景2：克隆已有项目

```bash
# 1. 克隆仓库
git clone https://github.com/user/project.git
cd project

# 2. 检查Python版本要求
cat .python-version
# 或
grep requires-python pyproject.toml

# 3. 安装依赖（自动创建虚拟环境）
uv sync

# 4. 运行项目
uv run python main.py
```

### 场景3：迁移旧项目

```bash
# 1. 备份原依赖文件
cp requirements.txt requirements.txt.bak

# 2. 初始化 uv 项目（保留现有代码）
uv init --no-readme

# 3. 从 requirements.txt 导入依赖
uv pip install -r requirements.txt

# 4. 生成 pyproject.toml
# 手动编辑 pyproject.toml，将依赖添加到 dependencies

# 5. 锁定依赖
uv lock

# 6. 测试
uv sync
uv run pytest

# 7. 提交新文件
git add pyproject.toml uv.lock
git commit -m "迁移到 uv"
```

### 场景4：多Python版本测试

```bash
# 测试Python 3.11
uv run --python 3.11 pytest

# 测试Python 3.12
uv run --python 3.12 pytest

# 测试Python 3.13
uv run --python 3.13 pytest

# 在CI中使用
# .github/workflows/test.yml
- name: Test with multiple Python versions
  run: |
    uv python install 3.11 3.12 3.13
    uv run --python 3.11 pytest
    uv run --python 3.12 pytest
    uv run --python 3.13 pytest
```

---

## 五、依赖管理最佳实践

### pyproject.toml 结构

```toml
[project]
name = "my-app"
version = "0.1.0"
description = "应用描述"
readme = "README.md"
requires-python = ">=3.13"
authors = [
    {name = "link", email = "link@example.com"}
]
dependencies = [
    # 生产依赖
    "flask>=3.0.0",
    "requests>=2.31.0",
    "pydantic>=2.0.0",
]

[project.optional-dependencies]
# 开发依赖
dev = [
    "pytest>=7.0.0",
    "pytest-cov>=4.0.0",
    "black>=23.0.0",
    "ruff>=0.1.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.ruff]
line-length = 88
target-version = "py313"

[tool.black]
line-length = 88
target-version = ["py313"]
```

### 版本约束规范

```toml
dependencies = [
    # 精确版本（不推荐，除非有特殊原因）
    "requests==2.31.0",

    # 兼容版本（推荐）
    "flask>=3.0.0,<4.0.0",

    # 简写（推荐）
    "django~=4.2.0",  # 等价于 >=4.2.0,<4.3.0

    # 最低版本
    "numpy>=1.24.0",

    # Git仓库
    "my-package @ git+https://github.com/user/repo.git@v1.0.0",

    # 本地路径
    "local-package @ file:///path/to/package",
]
```

### lock 文件管理

```bash
# 生成/更新 lock 文件
uv lock

# 升级所有依赖到兼容的最新版本
uv lock --upgrade

# 升级特定包
uv lock --upgrade-package requests

# 根据 lock 文件精确安装
uv sync

# lock 文件必须提交到版本控制
git add uv.lock
git commit -m "更新依赖"
```

---

## 六、兼容性处理

### 与 pip 兼容

```bash
# uv 提供了 pip 兼容接口
uv pip install requests
uv pip install -r requirements.txt
uv pip freeze > requirements.txt
uv pip list
uv pip show requests

# 从 requirements.txt 迁移
uv pip compile requirements.in -o requirements.txt

# 同步到虚拟环境
uv pip sync requirements.txt
```

### 与 virtualenv 兼容

```bash
# 创建传统虚拟环境
uv venv venv

# 激活（可选）
source venv/bin/activate

# 在虚拟环境中使用 pip
uv pip install requests

# 停用
deactivate
```

### 在 requirements.txt 项目中使用 uv

```bash
# 别人的项目还在用 requirements.txt
git clone old-project
cd old-project

# 方式1：直接用 uv pip
uv pip install -r requirements.txt
uv run python app.py

# 方式2：转换为现代格式
uv init --no-readme
# 手动将依赖添加到 pyproject.toml
uv sync
```

---

## 七、常见问题

### Q1: uv 和 pip 能共存吗？

**答**：可以，但不建议在同一项目中混用。

```bash
# ✅ 推荐：一个项目只用一种工具
uv add requests

# ❌ 避免：混用会导致依赖不一致
uv add flask
pip install django  # 不推荐
```

### Q2: 如何查看虚拟环境在哪里？

```bash
# 方法1：查看默认位置
ls -la .venv

# 方法2：运行时查看
uv run python -c "import sys; print(sys.prefix)"

# 方法3：检查环境变量
echo $VIRTUAL_ENV
```

### Q3: 如何清理缓存？

```bash
# 查看缓存位置
uv cache dir

# 清理缓存
uv cache clean

# 查看缓存大小
du -sh $(uv cache dir)
```

### Q4: CI/CD 中如何使用 uv？

```yaml
# GitHub Actions 示例
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install uv
        run: curl -LsSf https://astral.sh/uv/install.sh | sh

      - name: Install dependencies
        run: uv sync

      - name: Run tests
        run: uv run pytest
```

### Q5: 如何导出 requirements.txt（给不用uv的人）？

```bash
# 导出精确版本
uv pip freeze > requirements.txt

# 或者从 pyproject.toml 生成
uv export --format requirements-txt > requirements.txt
```

---

## 八、性能对比

### 安装速度测试

安装 Flask + 50个依赖包：

| 工具 | 时间 | 相对速度 |
| :--- | :--- | :--- |
| pip | 45s | 1x |
| poetry | 35s | 1.3x |
| uv | 2s | **22x** |

### 磁盘占用

10个项目，每个100个依赖：

| 工具 | 磁盘占用 | 说明 |
| :--- | :--- | :--- |
| pip (venv) | 约5GB | 每个项目完整复制 |
| uv | 约600MB | 全局缓存+硬链接 |

---

## 九、迁移指南

### 从 pip + requirements.txt

```bash
# 1. 创建 pyproject.toml
uv init --no-readme

# 2. 安装现有依赖
uv pip install -r requirements.txt

# 3. 手动整理依赖到 pyproject.toml
# 只添加直接依赖，不要包含传递依赖

# 4. 锁定依赖
uv lock

# 5. 测试
uv sync
uv run pytest

# 6. 删除旧文件（可选）
rm requirements.txt
rm -rf venv
```

### 从 poetry

```bash
# 1. 导出依赖
poetry export -f requirements.txt -o requirements.txt

# 2. 初始化 uv
uv init --no-readme

# 3. 安装依赖
uv pip install -r requirements.txt

# 4. 手动迁移 pyproject.toml 配置
# poetry 的 pyproject.toml 格式和 uv 兼容

# 5. 锁定
uv lock

# 6. 清理
rm poetry.lock requirements.txt
rm -rf .venv
```

### 从 pipenv

```bash
# 1. 导出依赖
pipenv requirements > requirements.txt

# 2. 初始化 uv
uv init --no-readme

# 3. 安装依赖
uv pip install -r requirements.txt

# 4. 整理到 pyproject.toml

# 5. 锁定
uv lock

# 6. 清理
rm Pipfile Pipfile.lock requirements.txt
```

---

## 十、快速参考

### 常用命令速查表

```bash
# 项目初始化
uv init [name]                    # 创建新项目
uv init --no-readme              # 在现有目录初始化

# Python 版本
uv python install 3.13           # 安装Python 3.13
uv python pin 3.13               # 锁定项目版本
uv python list                   # 列出可用版本

# 依赖管理
uv add <package>                 # 添加生产依赖
uv add --dev <package>           # 添加开发依赖
uv remove <package>              # 删除依赖
uv sync                          # 同步依赖
uv lock                          # 更新lock文件
uv lock --upgrade                # 升级所有依赖

# 运行
uv run <script>                  # 运行脚本
uv run python <file>             # 运行Python文件
uvx <tool>                       # 临时运行工具

# 虚拟环境
uv venv                          # 创建虚拟环境
uv venv .venv                    # 指定目录

# pip 兼容
uv pip install <package>         # pip风格安装
uv pip install -r requirements.txt
uv pip freeze                    # 导出依赖
uv pip list                      # 列出已安装包

# 缓存管理
uv cache dir                     # 查看缓存目录
uv cache clean                   # 清理缓存
```

### 文件说明

```
项目目录结构：
  ├── pyproject.toml         # 项目配置和直接依赖
  ├── uv.lock                # 锁定所有依赖的精确版本
  ├── .python-version        # 指定Python版本
  ├── .venv/                 # 虚拟环境（不提交到git）
  ├── src/                   # 源代码
  └── tests/                 # 测试代码

.gitignore 配置：
  .venv/
  __pycache__/
  *.pyc
  .pytest_cache/

必须提交：
  pyproject.toml
  uv.lock
  .python-version
```

---

## 十一、学习建议

### 初学者路线

```
第1周：基础使用
  - uv init / uv add / uv run
  - 创建简单项目

第2周：实战项目
  - 完整项目从头搭建
  - 依赖管理和版本控制

第3周：高级特性
  - 多Python版本测试
  - CI/CD 集成
  - 性能优化
```

### 核心原则

1. **新项目优先用 uv** - 速度快、体验好
2. **旧项目逐步迁移** - 不要激进，稳定为主
3. **团队协作看规范** - 统一工具，避免混用
4. **遇到问题查文档** - uv 文档非常完善

---

## 参考资源

- uv 官方文档：https://docs.astral.sh/uv/
- Python 打包指南：https://packaging.python.org/
- pyproject.toml 规范：https://peps.python.org/pep-0621/
- uv GitHub：https://github.com/astral-sh/uv

---

*最后更新: 2025-11-09*
