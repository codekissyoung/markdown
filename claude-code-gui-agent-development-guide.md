# Claude Code 架构解析与 GUI Agent 开发指南

> 学习日期：2025-12-03
> 参考资料：Anthropic 官方文档、Claude Agent SDK、Claudia 开源项目
> 前置知识：TypeScript/Node.js、进程间通信、Claude API 基础
> 目标：理解 Claude Code 架构，为开发自定义 GUI Agent 做准备

## 一、背景：Anthropic 收购 Bun

2025年11月，Anthropic 宣布收购 JavaScript 运行时 Bun，以加速 Claude Code 发展。

### 关键数据

| 指标 | 数据 |
|:-----|:-----|
| Claude Code 年化收入 | 6个月达到 10亿美元 |
| Bun 月下载量 | 700万+ |
| Bun GitHub Stars | 82,000+ |
| Claude Code 正式发布 | 2025年5月 |

### 收购逻辑

- Claude Code 本身就是用 Bun 构建的（native installer 由 Bun 驱动）
- AI 编程工具需要快速执行环境
- Bun 团队和 Anthropic 已经密切合作多月

**本质**：AI 编程赛道竞争已经进入基础设施层面。

---

## 二、Agentic 能力来源分析

Claude Code 的 Agentic 能力由**模型**和**客户端**共同提供，缺一不可。

### 模型提供

- 代码理解和生成能力
- 推理能力（决定下一步做什么）
- 工具调用意图（"我需要读这个文件"）

### CLI 客户端提供

- **工具定义**：告诉模型有哪些工具可用（Read、Edit、Bash、Grep...）
- **执行层**：实际操作文件系统、运行命令
- **循环机制**：模型调用工具 → 执行 → 结果返回 → 模型继续思考 → 再调用...
- **上下文管理**：维护对话历史、项目上下文
- **权限控制**：哪些命令自动批准、哪些需要确认

### 类比理解

```
模型 = 大脑（思考、决策）
CLI  = 身体（手脚、执行动作）
```

- 单独的 Claude API 调用：只能聊天，无法操作电脑
- 单独的 CLI 框架：没有智能，不知道该做什么

---

## 三、Claude Agent SDK 真相

GitHub 仓库 `anthropics/claude-agent-sdk-typescript` 看起来像是开源项目，但实际上...

### 仓库结构

```
claude-agent-sdk-typescript/
├── CHANGELOG.md
├── LICENSE.md      # 专有许可证，非 MIT/Apache
└── README.md       # 只有使用说明
```

**GitHub 仓库是空壳，没有源代码！**

### npm 包内容

安装 `@anthropic-ai/claude-agent-sdk` 后：

```
node_modules/@anthropic-ai/claude-agent-sdk/
├── cli.js              # 10.4 MB，混淆的主程序
├── sdk.mjs             # 15255 行，混淆的 SDK 代码
├── sdk.d.ts            # 可读，API 接口类型定义
├── sdk-tools.d.ts      # 可读，工具输入参数定义
├── tree-sitter*.wasm   # 代码解析器
└── vendor/
    └── ripgrep/        # 内置搜索工具
```

### 混淆代码的彩蛋

```javascript
// sdk.mjs 开头
// Want to see the unminified source? We're hiring!
// https://job-boards.greenhouse.io/anthropic/jobs/4816199008
```

### 可见 vs 不可见

| 你能看到的 | 你看不到的（混淆） |
|:----------|:------------------|
| 工具参数定义 (sdk-tools.d.ts) | System Prompt（核心提示词） |
| API 接口类型 (sdk.d.ts) | 工具的具体实现逻辑 |
| Hook 事件类型 | Agent 循环/上下文管理 |
| MCP 集成接口 | 权限控制细节 |

---

## 四、工具定义（从 sdk-tools.d.ts 提取）

Claude Code 的完整工具列表：

| 工具名 | 用途 |
|:------|:-----|
| `Bash` | 执行命令 |
| `BashOutput` | 读取后台命令输出 |
| `FileRead` (Read) | 读取文件 |
| `FileEdit` (Edit) | 编辑文件 |
| `FileWrite` (Write) | 写入文件 |
| `Glob` | 文件模式匹配 |
| `Grep` | 内容搜索 |
| `Agent` (Task) | 启动子 Agent |
| `TodoWrite` | 任务管理 |
| `WebFetch` | 网页抓取 |
| `WebSearch` | 网页搜索 |
| `AskUserQuestion` | 向用户提问 |
| `NotebookEdit` | Jupyter 编辑 |
| `KillShell` | 终止后台进程 |
| `ExitPlanMode` | 退出计划模式 |
| `ListMcpResources` | 列出 MCP 资源 |
| `ReadMcpResource` | 读取 MCP 资源 |

---

## 五、GUI Agent 开发：两条路线

### 路线 A：使用 Claude Agent SDK（黑盒调用）

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk'

// 本质上是启动混淆的 cli.js 子进程
for await (const msg of query({
  prompt: "帮我修 bug",
  options: {
    tools: { type: 'preset', preset: 'claude_code' },
    systemPrompt: { type: 'preset', preset: 'claude_code' },
    cwd: '/path/to/project',

    // 权限回调 - GUI 关键入口
    canUseTool: async (toolName, input, options) => {
      const userApproved = await showPermissionDialog(toolName, input)
      return userApproved
        ? { behavior: 'allow', updatedInput: input }
        : { behavior: 'deny', message: '用户拒绝' }
    }
  }
})) {
  renderToGUI(msg)
}
```

**优点**：获得完整 Claude Code 能力
**缺点**：依赖 Anthropic，无法定制核心逻辑

### 路线 B：自己实现 Agent（白盒构建）

```typescript
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

// 自己定义工具
const tools = [
  { name: "read_file", description: "读取文件", input_schema: {...} },
  { name: "edit_file", description: "编辑文件", input_schema: {...} },
  { name: "run_bash", description: "执行命令", input_schema: {...} },
]

// 自己写 Agent 循环
while (true) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    tools,
    messages,
    system: "你的自定义 system prompt"
  })

  if (response.stop_reason === 'end_turn') break

  // 自己处理工具调用
  // 自己管理上下文
  // 自己实现权限控制
}
```

**优点**：完全控制，可以做 GUI，可以魔改任何逻辑
**缺点**：需要自己造轮子

### 路线对比

| 场景 | 推荐方案 |
|:----|:--------|
| 快速包装 GUI | SDK + Electron/Tauri |
| 做差异化产品 | 自己实现 + Claude API |
| 学习 Agent 原理 | 自己实现 |

---

## 六、SDK 核心 API

从 `sdk.d.ts` 提取的关键接口：

### Options 配置

```typescript
type Options = {
  // 工具配置
  tools?: string[] | { type: 'preset'; preset: 'claude_code' };
  allowedTools?: string[];
  disallowedTools?: string[];

  // 提示词配置
  systemPrompt?: string | {
    type: 'preset';
    preset: 'claude_code';
    append?: string
  };

  // 权限配置
  permissionMode?: 'default' | 'acceptEdits' | 'bypassPermissions' | 'plan';
  canUseTool?: CanUseTool;  // 权限回调函数

  // 执行配置
  cwd?: string;
  maxTurns?: number;
  maxBudgetUsd?: number;

  // MCP 服务器
  mcpServers?: Record<string, McpServerConfig>;

  // 钩子
  hooks?: Partial<Record<HookEvent, HookCallbackMatcher[]>>;

  // Agent 定义
  agents?: Record<string, AgentDefinition>;
}
```

### Hook 事件

```typescript
const HOOK_EVENTS = [
  'PreToolUse',       // 工具执行前
  'PostToolUse',      // 工具执行后
  'PostToolUseFailure', // 工具执行失败
  'Notification',     // 通知
  'UserPromptSubmit', // 用户提交 prompt
  'SessionStart',     // 会话开始
  'SessionEnd',       // 会话结束
  'Stop',             // 停止
  'SubagentStart',    // 子 Agent 启动
  'SubagentStop',     // 子 Agent 停止
  'PreCompact',       // 压缩前
  'PermissionRequest' // 权限请求
]
```

### 消息类型

```typescript
type SDKMessage =
  | SDKAssistantMessage    // 助手消息
  | SDKUserMessage         // 用户消息
  | SDKResultMessage       // 执行结果
  | SDKSystemMessage       // 系统消息
  | SDKPartialAssistantMessage // 流式消息
  | SDKToolProgressMessage // 工具进度
  | SDKAuthStatusMessage   // 认证状态
```

---

## 七、开源参考：Claudia

### 项目信息

| 项目 | 信息 |
|:----|:-----|
| 名称 | Claudia (内部代号 opcode) |
| GitHub | [getAsterisk/claudia](https://github.com/getAsterisk/claudia) |
| 官网 | [claudia.so](https://claudia.so/) |
| 许可证 | AGPL（开源） |
| 开发者 | Asterisk（YC 孵化公司） |

### 技术栈

```
┌─────────────────────────────────────┐
│  前端: React 18 + TypeScript        │
│        Vite 6 + Tailwind + shadcn   │
│        Bun 包管理                    │
├─────────────────────────────────────┤
│  后端: Rust + Tauri 2               │
│        SQLite 本地数据库             │
├─────────────────────────────────────┤
│  底层: Claude Code CLI              │
│        (用户自行安装)                │
└─────────────────────────────────────┘
```

### 核心功能

- 项目/会话管理：浏览 `~/.claude/projects/`
- 自定义 Agent：创建带自定义 prompt 的 Agent
- 用量分析：API 成本、Token 消耗统计
- MCP 服务器管理：GUI 配置 MCP
- 时间线/检查点：会话版本控制
- CLAUDE.md 编辑器：Markdown 实时预览

### 架构特点

Claudia **没有使用 Claude Agent SDK**，而是直接调用 Claude Code CLI：

1. 启动 CLI 作为子进程
2. 通过 stdin/stdout 进行通信
3. 解析 CLI 的 JSON 输出
4. 渲染到 GUI

---

## 八、进程间通信原理

Claudia 的实现原理是经典的**父子进程通信**：

### 架构图

```
┌─────────────────────────────────────────────────┐
│  Claudia (父进程)                                │
│                                                 │
│  ┌─────────────┐      ┌─────────────────────┐   │
│  │  GUI 界面   │ ←──→ │  进程管理器          │   │
│  │  用户交互   │      │  stdin/stdout 管道   │   │
│  └─────────────┘      └──────────┬──────────┘   │
│                                  │              │
└──────────────────────────────────┼──────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │         pipe                │
                    │    stdin ↓     ↑ stdout     │
                    │         ↓     ↑             │
              ┌─────┴─────────────────────────────┴─────┐
              │  Claude Code CLI (子进程)               │
              │                                        │
              │  - 接收 prompt (stdin)                  │
              │  - 调用 Claude API                      │
              │  - 执行工具 (Bash/Read/Edit...)         │
              │  - 输出 JSON 事件流 (stdout)            │
              └────────────────────────────────────────┘
```

### 数据流

```
用户输入 "帮我修 bug"
    │
    ▼
GUI 写入子进程 stdin
    │
    ▼
Claude Code CLI 处理
    │
    ▼
CLI stdout 输出: {"type":"assistant","content":"我来看看..."}
    │
    ▼
GUI 读取并解析 JSON
    │
    ▼
渲染到界面
```

### CLI 支持的模式

```bash
# 非交互模式，直接传入 prompt
claude -p "帮我分析 src/auth.ts"

# 输出 JSON 格式（机器可读）
claude -p "修复这个 bug" --output-format json

# 流式输出
claude -p "重构代码" --output-format stream-json

# 恢复会话
claude --resume <session-id>
```

### 代码示例

```typescript
import { spawn } from 'child_process'

function runClaudeCode(prompt: string) {
  const process = spawn('claude', [
    '-p', prompt,
    '--output-format', 'stream-json'
  ])

  process.stdout.on('data', (chunk) => {
    const event = JSON.parse(chunk)
    if (event.type === 'assistant') {
      renderMessage(event.content)
    } else if (event.type === 'tool_use') {
      showToolExecution(event)
    }
  })

  process.stderr.on('data', (data) => {
    console.error('Error:', data.toString())
  })
}
```

---

## 九、SDK vs CLI 调用对比

| 对比项 | SDK 方式 | CLI 方式 |
|:------|:--------|:--------|
| 接口 | `query()` 函数 | `spawn('claude')` |
| 通信 | 结构化消息流 | JSON 文本流 |
| 权限控制 | `canUseTool` 回调 | 需要额外实现 |
| 依赖 | npm 包 | 系统安装的 CLI |
| 灵活性 | 高（钩子丰富） | 低（只能解析输出） |
| 稳定性 | 跟随 SDK 版本 | 跟随用户 CLI 版本 |

---

## 十、开发建议

### 推荐技术栈

| 层级 | 技术选型 | 理由 |
|:----|:--------|:-----|
| GUI 框架 | Tauri 2 | Rust 后端，轻量高效 |
| 前端 | React + TypeScript | 生态成熟 |
| UI 组件 | shadcn/ui | 可定制性强 |
| 构建工具 | Vite + Bun | 快 |
| 本地存储 | SQLite | 简单可靠 |

### 核心功能优先级

1. **基础对话**：prompt 输入 → 消息渲染
2. **权限弹窗**：工具执行确认
3. **会话管理**：历史记录、恢复会话
4. **项目切换**：多项目支持
5. **用量统计**：成本监控

### 开发路线图

```
Phase 1: MVP
├── 基础对话界面
├── Claude Code CLI 集成
└── 简单权限确认

Phase 2: 增强
├── 会话持久化
├── MCP 服务器配置
└── 自定义 Agent

Phase 3: 高级
├── 多项目管理
├── 用量分析
└── 插件系统
```

---

## 十一、参考资源

### 官方文档

- [Claude Agent SDK 文档](https://docs.claude.com/en/api/agent-sdk/overview)
- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)

### 开源项目

- [Claudia GitHub](https://github.com/getAsterisk/claudia)
- [Claude Agent SDK TypeScript](https://github.com/anthropics/claude-agent-sdk-typescript)
- [Claude Agent SDK Python](https://github.com/anthropics/claude-agent-sdk-python)

### 相关博客

- [Claudia 使用体验](https://apidog.com/blog/claudia-the-gui-for-claude-code/)
- [Claude Agent SDK 教程](https://www.datacamp.com/tutorial/how-to-use-claude-agent-sdk)

---

*博客撰写日期：2025-12-03*
*基于与 Claude Code 的对话整理*
