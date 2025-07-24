# Link的个人开发配置

## 基本信息
- **姓名**: link
- **语言**: 中文（母语），英文（能看懂）
- **主要技能栈**: Go, PHP, JavaScript, MySQL
- **容器化技术**: Docker, Kubernetes
- **系统技能**: Linux, Shell脚本
- **开发环境**: macOS
- **IDE**: GoLand (Go开发), PhpStorm (PHP开发)
- **版本控制**: Git
- **生活技能**: 会开车（可用作技术学习类比）

## 技术栈详情

### 后端开发
- **Go**: 主要后端语言，使用xorm作为ORM
- **PHP**: Web开发，配合PhpStorm进行开发
- **数据库**: MySQL作为主要数据库

### 前端开发
- **JavaScript**: ES6+现代语法，掌握Promise/async-await异步编程
- **模块化开发**: 深度理解ES6模块系统，告别传统全局作用域开发
- **Node.js**: 理解运行时环境，熟悉npm生态系统
- **前端现代化转型**: 已从传统前端(HTML+CSS+JS+jQuery)成功转向现代工程化开发思维

### 容器化和编排
- **Docker**: 容器化应用部署
- **Kubernetes**: 容器编排和集群管理

### 系统和运维
- **Linux**: 熟悉Linux系统管理和操作
- **Shell**: Shell脚本编写，自动化任务处理

## 开发工具偏好

### IDE和编辑器
- **GoLand**: Go项目的首选IDE，利用其强大的代码分析和重构功能
- **PhpStorm**: PHP项目开发，支持框架集成和调试
- **Git**: 代码版本管理

### 数据库工具
- **xorm**: Go项目中的ORM选择，简洁高效的数据库操作

### 容器化工具
- **Docker**: 应用容器化，简化部署和环境管理
- **Kubernetes**: 生产环境容器编排，支持自动扩缩容和服务发现

### 系统工具
- **Linux**: 服务器环境管理，系统配置和故障排查
- **Shell**: Bash/Zsh脚本编写，自动化部署和运维任务

### 网络工具
- **v2net**: 主要代理工具，提供稳定的网络访问
- **PAC**: 配合v2net使用，智能分流不同网站的代理规则

## 工作流程偏好

### 项目结构
- Go项目遵循标准Go项目布局
- 数据库操作通过xorm进行，保持代码简洁
- 维护技术文档知识库（markdown格式）

### 开发习惯
- 使用JetBrains系列IDE进行开发，充分利用代码提示和重构功能
- Git进行版本控制，保持代码历史清晰
- 主要在macOS环境下开发
- 家里和公司两台电脑办公，注重配置同步
- **配置文件软链接同步**: 使用软链接将个人Claude配置(`~/.claude/CLAUDE.md`)指向Git仓库中的文件(`/Users/link/workspace/markdown/link-claude.md`)，通过`ln -sf`命令实现跨设备配置同步和版本控制。这样配置变更会自动进入Git版本控制，家里公司两台电脑只需clone相同仓库并创建同样软链接即可保持配置同步
- 关注网络优化（使用v2net代理配合PAC配置）
- **Go程序测试环境限制**: 由于环境依赖复杂，只能在公司服务器上运行Go程序测试

### 开发环境配置

#### 家里电脑Node.js环境 (2025-07-23)
- **Node.js版本**: v24.4.1 (当前最新稳定版)
- **npm版本**: 11.4.2
- **版本管理**: 使用nvm v0.40.3管理Node.js版本
- **安装路径**: `/Users/link/.nvm/versions/node/v24.4.1/`
- **当前使用**: v24.4.1 (default -> node -> stable)
- **可用版本**: 仅安装v24.4.1单个版本，未安装其他LTS版本
- **环境状态**: 生产就绪，支持Vue 3 + Vite现代前端开发

## Claude协作指导

### 代码风格
- Go代码遵循gofmt标准格式
- 优先使用标准库和成熟的第三方库
- 数据库操作优先考虑xorm的使用方式
- **永远不使用多重继承**: 从多个类继承特性是有害的思想，保持批判性思维，避免复杂的继承关系

### 项目协作
- 优先编辑现有文件而非创建新文件
- 重视代码的可读性和维护性
- 充分利用IDE的特性进行开发
- 熟悉多台设备开发环境（家里+公司电脑）
- **代码提交流程**: 
  1. 代码改动完成后，等待link进行code review
  2. link通过GoLand的Git对比工具查看具体改动内容
  3. 确认无误后，link明确说"提交吧"或"可以提交"才能执行git提交操作
  4. 绝对不能未经确认就提交代码到分支
- **测试开发流程**: 
  1. 本地开发完成 → 等待link确认 → 提交代码到个人分支
  2. 到公司服务器拉取个人分支最新代码
  3. 在服务器上运行Go程序测试
  4. 测试通过后，再进行最终代码合并
- **服务器测试自动推送**: 当link说"要到服务器去测试了"或类似表述时，Claude必须立即执行git push，确保最新代码已推送到远程分支，方便在服务器上拉取测试

### 会话结束协作习惯
**CRITICAL WORKFLOW**: 每次link要结束对话时，Claude必须执行以下流程：
1. **更新项目CLAUDE.md**: 记录当前学习/工作进度、完成的任务、遇到的问题
2. **记录项目状态**: 更新文件变更、配置状态、环境信息
3. **明确下次任务**: 清晰列出下次开启Claude时要继续的具体任务
4. **保存重要信息**: 将关键的上下文信息写入项目CLAUDE.md，避免信息丢失

这个习惯确保：
- 学习/工作进度不会丢失
- 下次Claude可以快速恢复上下文  
- 项目状态始终保持最新
- 避免重复解释相同概念

### 技术决策
- 后端优先选择Go进行开发
- 数据库操作通过xorm进行抽象
- **前端开发已确定Vue 3 + Vite技术栈**: 现代工程化开发，不再使用传统脚本方式
- **JavaScript开发使用ES6+语法**: Promise/async-await、模块化、现代异步编程
- 系统运维相关任务可以使用Linux/Shell知识
- 部署相关优先考虑容器化方案(Docker/K8s)

### 沟通风格
- 直接简洁的技术交流
- 注重实用性和效率
- 善于使用v2net+PAC代理进行网络优化

### 学习风格偏好
- **类比学习**: 善于通过熟悉的事物理解新概念，如用开车类比技术学习（会开车不需要懂发动机原理 = 会用框架不需要懂底层实现）。但不要过度使用类比，只在合适的时候使用
- **实用主义**: 优先掌握核心技能，工具细节按需学习
- **循序渐进**: 先掌握基础操作，再深入技术原理

## 公司业务环境架构

### 业务主体分布
Link所在公司采用多业务主体、多环境、多云的架构模式，详细架构如下：

#### 阿里云业务主体
| 主体 | Domain | 环境 | ENVMARK | MARKSTR | 路径前缀 |
|------|--------|------|---------|---------|----------|
| **小雨伞** | xys | dev | 100 | dev | `dev/` |
|  |  | alpha | 500 | alpha | `alpha/` |
|  |  | beta | 600 | beta | `beta/` |
|  |  | idc | 200 | idc | 无前缀 |
| **创信** | cx | beta | 700 | cx-beta | `beta/` |
|  |  | idc | 800 | cx-idc | 无前缀 |
| **木成林** | muc | beta | 1000 | muc-beta | `beta/` |
|  |  | idc | 900 | muc-idc | 无前缀 |
| **小棉花中国** | xmhcn | idc | 1300 | xmhcn-idc | 无前缀 |
| **小棉花美国** | xmh | idc | 1200 | xmh-idc | 无前缀 |

#### AWS业务主体  
| 主体 | Domain | 地区 | 环境 | ENVMARK | MARKSTR | 路径前缀 |
|------|--------|------|------|---------|---------|----------|
| **小棉花欧洲** | xmheu | 北京 | beta | 1500 | xmheu-beta | `beta/` |
| **小棉花欧洲** | xmheu | 法兰克福 | idc | 1600 | xmheu-idc | 无前缀 |
| **小棉花美国** | xmhus | 弗吉尼亚 | idc | 1800 | xmhus-idc | 无前缀 |

### 环境分类规律
- **开发环境(dev)**: 仅小雨伞主业务 (ENVMARK: 100) → `dev/` 前缀
- **Alpha环境(alpha)**: 仅小雨伞主业务 (ENVMARK: 500) → `alpha/` 前缀
- **Beta环境(beta)**: 跨多个业务主体和云平台 → `beta/` 前缀
  - 阿里云: 小雨伞(600)、创信(700)、木成林(1000)
  - AWS: 小棉花欧洲(1500)
- **生产环境(idc)**: 所有业务主体最终生产环境 → 无前缀
  - 阿里云: 小雨伞(200)、创信(800)、木成林(900)、小棉花中美(1200,1300)
  - AWS: 小棉花欧美(1600,1800)

### 地域分布特点
- **阿里云**: 主要承载国内业务，集中在深圳等地区
- **AWS**: 承载海外业务，分布在北京、法兰克福、弗吉尼亚等地区
- **Domain命名**: 体现业务主体标识(xys/cx/muc/xmh/xmhcn/xmheu/xmhus)

### 核心环境变量机制

#### ENVMARK - 环境标识变量
**ENVMARK是核心环境变量**，在每个业务机器和POD中都会设置此环境变量：
- **统一环境识别**: 所有Go/PHP/JS程序都可以通过`os.Getenv("ENVMARK")`获取当前环境标识
- **动态配置选择**: 程序根据ENVMARK值自动选择对应的配置文件和行为策略
- **路径前缀控制**: OssCDN等存储组件根据ENVMARK自动添加环境路径前缀
- **服务发现**: 微服务可以根据ENVMARK连接到对应环境的依赖服务

#### GOCOMMON - 配置目录路径变量
**GOCOMMON是配置文件目录路径环境变量**，指向存放所有配置文件的根目录：
- **配置文件路径**: 通过`os.Getenv("GOCOMMON")`获取配置文件根目录路径
- **配置文件结构**: `$GOCOMMON/config/config_${env}.json` 格式存储不同环境配置
- **完整配置文件列表**:
  - `config_dev.json`, `config_alpha.json`, `config_beta.json`, `config_idc.json`
  - `config_cx-beta.json`, `config_cx-idc.json`
  - `config_muc-beta.json`, `config_muc-idc.json` 
  - `config_xmh-beta.json`, `config_xmh-idc.json`, `config_xmhcn-idc.json`
  - `config_xmheu-beta.json`, `config_xmheu-idc.json`, `config_xmhus-idc.json`
- **配置内容**: 每个配置文件包含以下核心配置
  - **consul/nacos**: 服务发现和配置中心地址
  - **mysql**: 各业务数据库连接字符串 
  - **redis**: Redis缓存配置
  - **OssCDN**: 对象存储配置(包含所有预配置的配置名称)
  - **log**: 日志配置和路径
  - **其他微服务**: 各种业务服务的地址和配置

#### 配置加载流程示例
```go
envmark := os.Getenv("ENVMARK")
gocommon := os.Getenv("GOCOMMON")

var configFile string
switch envmark {
case "100": // dev
    configFile = gocommon + "/config/config_dev.json"
case "600": // beta  
    configFile = gocommon + "/config/config_beta.json"
case "200": // idc
    configFile = gocommon + "/config/config_idc.json"
// ... 其他环境
}

// 加载配置文件，获取DB/Redis/OSS等配置信息
config.LoadFile(configFile)
```

### 技术架构意义
这种多业务、多环境架构支持：
1. **业务隔离**: 不同业务主体独立部署和管理
2. **地域分布**: 支持国内外不同地区的业务需求  
3. **多云策略**: 阿里云+AWS双云架构，提高可用性
4. **环境管理**: 通过ENVMARK环境变量统一管理不同环境的配置和行为
5. **自动化部署**: 容器和POD启动时自动注入对应的ENVMARK值

## 前端现代化学习计划

### 当前状态 (2024-07-22 更新)
- **原有基础**: HTML + CSS + JavaScript + jQuery (传统开发方式)
- **已完成转型**: ✅ 成功理解现代前端工程化开发理念
- **技术栈确定**: Vue 3 + Vite + 现代JavaScript工具链
- **学习仓库**: `/Users/link/workspace/learnVue` - 专门的Vue 3学习项目
- **包管理器**: 统一使用npm，不混用yarn
- **核心突破**: 
  - ✅ 掌握ES6+现代JavaScript语法
  - ✅ 理解Promise/async-await异步编程
  - ✅ 深度掌握JavaScript模块化机制
  - ✅ 理解现代前端工程化vs传统开发的区别
  - ⏳ 准备开始Vue 3实战开发

### 学习路径规划

#### 阶段1: 理解现代前端工程化 ✅ 已完成
- **为什么需要工程化**: ✅ 深度理解
  - 代码组织: 项目变大需要模块化管理
  - 开发效率: 热更新、自动编译、代码提示
  - 代码质量: 打包压缩、语法检查、自动测试
- **传统vs现代对比**: ✅ 理解差异和优势

#### 阶段2: 基础工具学习 ✅ 已完成
1. **Node.js**: ✅ 理解JavaScript运行时环境和生态系统
2. **npm**: ✅ 包管理器概念和基本使用
3. **Vite**: ✅ 现代构建工具概念(比webpack简单)
4. **Git工作流**: ✅ 现代项目的版本控制
5. **ES6+ JavaScript**: ✅ 现代语法、异步编程、模块化

#### 阶段3: Vue 3 核心概念 ⏳ 下一步
1. **基础语法**: 模板、指令、数据绑定
2. **Composition API**: 现代Vue开发方式
3. **单文件组件**: .vue文件结构理解
4. **响应式原理**: 数据驱动思维转换
5. **测试框架学习**: ⏸️ 暂时跳过Mocha等测试框架，优先掌握Vue核心概念。推荐未来学习Vitest(Vue生态)或Jest，当前专注于语言基础和实战经验
6. **Polyfill和转译器**: ⏸️ 暂时跳过，现代工具链(Vite/Vue CLI)已自动处理浏览器兼容性。理解概念即可：Polyfill补充API，Babel转译语法。如同开车不需要懂发动机原理

#### 阶段4: 生态系统
1. **Vue Router 4**: 单页应用路由
2. **Pinia**: 状态管理
3. **组件库**: 如Element Plus等
4. **TypeScript**: 类型安全(可选)

#### 阶段5: 工程化实践
1. **项目结构**: 标准Vue项目组织
2. **开发流程**: 开发、构建、部署
3. **代码规范**: ESLint, Prettier
4. **测试**: 单元测试和集成测试

### 技术决策说明

#### 为什么选择Vue 3而不是Vue 2
- **Vue 3是官方主推版本**: 2022年2月成为默认版本
- **更好的性能**: 重写响应式系统，体积更小
- **Composition API**: 更灵活的代码组织方式
- **更好的TypeScript支持**: 原生支持更完善
- **生态系统转移**: 新库和工具主要支持Vue 3
- **AI支持更好**: Claude Code对Vue 3有更好的代码生成支持

#### 为什么不需要先学Vue 2
- **概念重叠度高**: 组件、模板、指令等核心概念相同
- **学习效率**: Vue 3包含Vue 2的所有核心思想且有改进
- **避免混淆**: 先学Vue 2容易形成旧习惯，需要"重新学习"
- **一步到位**: 学会就是最新标准

### 学习方法 ✅ 已实践验证
- **边做边学**: ✅ 通过实际项目学习概念（已创建learnVue项目）
- **Claude Code辅助**: ✅ 利用AI生成和解释代码（深度教程文档化）
- **思维转换**: ✅ 成功从DOM操作思维转向数据驱动思维
- **渐进学习**: ✅ 逐步掌握核心概念，避免复杂配置

### 学习成果验证 ✅
- **工程化理解**: ✅ 深度理解现代工具(Vite)的简化作用
- **基础知识迁移**: ✅ jQuery的DOM和事件基础成功应用到Vue概念理解
- **概念转换成功**: ✅ 重点掌握了概念转换，为实践做好准备

### 学习文档产出 📚
- `promise-tutorial.md` - Promise异步编程详解（含Go语言对比）
- `async-await-tutorial.md` - 现代异步语法教程（含使用场景分析）
- `js-modules-tutorial.md` - JavaScript模块化完整教程（含实际项目示例）
- `practice.js` - ES6+语法练习代码
- `01-nodejs-tutorial.md` - Node.js基础教程（含Mermaid图表）

## 常用命令和工具
- **Git**: `git status`, `git diff`, `git commit`
- **Go相关**: `go mod tidy`, `go build`, `go test`
- **Docker**: `docker build`, `docker run`, `docker-compose up`
- **Kubernetes**: `kubectl get pods`, `kubectl apply`, `kubectl logs`
- **Linux系统**: `ps`, `top`, `netstat`, `systemctl`, `journalctl`
- **Shell脚本**: `grep`, `awk`, `sed`, `find`, 管道操作
- **数据库**: MySQL命令行工具和GUI工具
- **现代前端工具**: `npm install`, `npm run dev`, `npm run build`, `npm create vue@latest`, `vite`
- **Node.js**: `node`, `npm`, ES6+ JavaScript语法

## 最新学习成就 🎉 (2024-07-22)
### 核心突破
- ✅ **思维转换成功**: 从传统脚本开发转向现代工程化开发思维
- ✅ **技术栈确定**: Vue 3 + Vite + 现代JavaScript工具链
- ✅ **异步编程掌握**: Promise/async-await深度理解，结合Go语言经验
- ✅ **模块化开发**: ES6模块系统完全掌握，告别全局作用域开发

### 准备就绪
- **下一步目标**: 创建第一个Vue 3项目，开始实战开发
- **技术准备**: 所有Vue开发必备的JavaScript概念已掌握
- **学习资料**: 完整的技术教程文档库已建立

---
*此文件由Claude根据link的偏好自动生成，如需修改请直接编辑此文件*