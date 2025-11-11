# 大模型推理演进史：从 Chain-of-Thought 到 AI Agent（2020-2025）

> 一场关于"如何让AI学会思考"的技术革命史

## 引言：为什么要研究这段历史？

最近在调研 Claude Code、Goose、Crush 这些 AI Agent 工具时，发现它们都有个共同特点：**会"规划"然后"执行"**。这让我很好奇：AI 什么时候学会了像人一样先思考、再行动？

顺藤摸瓜，发现了一段波澜壮阔的技术演进史。短短5年（2020-2025），大模型从"傻瓜式问答"进化到"会思考的 Agent"，背后是一系列开创性论文的推动。这篇文章梳理这段历史，帮你快速建立全局认知。

**适合人群**：
- 想理解 AI Agent 底层原理的开发者
- 对 Prompt Engineering 感兴趣的从业者
- 好奇"AI 如何思考"的技术爱好者

---

## 第一幕：史前时代（2020-2021）

### GPT-3 的震撼登场

2020年，OpenAI 发布 GPT-3（175B 参数），第一次证明了一个惊人的事实：

> **大模型 + 少量示例 = 超越微调模型**

这在当时是颠覆性的。传统方法需要为每个任务收集数据、训练模型；而 GPT-3 只需要在提示词里给几个例子（Few-shot Learning），就能完成新任务。

**提示词工程萌芽**：

```
例子1: 输入A → 输出B
例子2: 输入C → 输出D
现在请回答: 输入E → ?
```

这种方法简单粗暴，但有个致命问题：**复杂推理任务表现很差**。

数学题错误率高达 80% 以上，因为模型只会"pattern matching"（模式匹配），不会"真正思考"。

---

### RAG：第一次突破静态知识限制

同年5月，Meta 发布了一篇重要论文，开创了 **RAG（Retrieval-Augmented Generation）** 范式。

**📄 论文**：[Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)
**发表时间**：2020年5月
**核心思想**：模型不知道的，就去外部检索

```
用户提问: 巴黎现在有多少人口？
  ↓
系统检索 Wikipedia
  ↓
找到: "巴黎人口 213 万（2023年数据）"
  ↓
模型基于检索结果回答
```

**意义**：解决了大模型"知识过时"和"无法访问实时信息"的问题。这为后来的 Agent（如 ReAct）奠定了基础。

---

### 2021：探索期

这一年主要在探索各种提示词模式：
- 示例数量重要吗？（是的）
- 示例质量重要吗？（更重要）
- 示例顺序重要吗？（非常重要）

但核心问题仍未解决：**如何让模型在复杂推理任务上不犯傻？**

---

## 第二幕：推理革命三部曲（2022）

### 第一部：Few-shot CoT - 示例推理的诞生

**📄 论文**：[Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
**作者**：Wei et al. (Google Research)
**发表时间**：2022年1月

**核心发现**：给模型看**带推理过程的示例**，它就学会了推理！

#### 对比实验

**传统 Few-shot（只有答案）**：

```
Q: Roger 有 5 个网球。他又买了 2 罐，每罐 3 个球。他现在有多少球？
A: 11 个 ✅

Q: 餐厅有 23 个苹果，用了 20 个，又买了 6 个。有多少个？
A: 9 个 ❌（模型经常答错）
```

**Few-shot CoT（带推理过程）**：

```
Q: Roger 有 5 个网球。他又买了 2 罐，每罐 3 个球。他现在有多少球？
A: Roger 开始有 5 个球。
   2 罐 × 3 球/罐 = 6 个球。
   5 + 6 = 11 个球。
   答案是 11 个 ✅

Q: 餐厅有 23 个苹果，用了 20 个，又买了 6 个。有多少个？
A: 餐厅开始有 23 个苹果。
   用了 20 个后，剩下 23 - 20 = 3 个。
   又买了 6 个，最终 3 + 6 = 9 个。
   答案是 9 个 ✅
```

#### 震撼数据

在 GSM8K 数学数据集上（PaLM 540B 模型）：

| 方法 | 准确率 |
|------|--------|
| 标准 Few-shot | 17.9% |
| Few-shot CoT | **58.1%** |

**提升了 40 个百分点！**

#### 为什么有效？

类比人类思考：

- **传统提示**：就像老师只告诉你答案，你死记硬背
- **CoT 提示**：老师讲解解题步骤，你理解了思路

模型学会了"展开思维链"（Chain of Thought），而不是直接跳到答案。

**局限性**：需要手写示例，每个任务都要设计不同的推理示例，太费劲。

---

### 第二部：Zero-shot CoT - 一句咒语的魔法

**📄 论文**：[Large Language Models are Zero-Shot Reasoners](https://arxiv.org/abs/2205.11916)
**作者**：Kojima et al. (Google Research)
**发表时间**：2022年5月

这篇论文堪称 Prompt Engineering 的里程碑。

#### 核心发现

只需在问题后面加一句话：

```
"Let's think step by step"
```

模型的推理能力就大幅提升！

#### 实验数据（text-davinci-002 模型）

| 数据集 | 标准提示 | + "Let's think step by step" | 提升 |
|--------|---------|------------------------------|------|
| MultiArith | 17.7% | **78.7%** | +344% |
| GSM8K | 10.4% | **40.7%** | +291% |

**不需要任何示例，只需要一句话！**

#### 为什么这么神奇？

论文作者的解释：

> 大模型内部已经具备推理能力，只是需要一个"触发器"来激活它。

类比：

- **Few-shot CoT**：老师手把手教你解题
- **Zero-shot CoT**：老师说"你自己想清楚再答"

后者更接近人类的自主思考。

#### 其他有效的提示词

论文测试了多种变体：

- "Let's solve this problem by splitting it into steps" ✅
- "Let's think about this logically" ✅
- "First, let's think step by step" ✅
- "Let's break down this problem" ✅

但 **"Let's think step by step"** 效果最稳定。

#### 局限性

虽然简单通用，但存在三个问题：

1. **计算错误**：推理过程中算错数
2. **遗漏步骤**：跳过关键环节
3. **语义误解**：理解错问题意图

这为下一篇论文（Plan-and-Solve）留下了改进空间。

---

### 第三部：Least-to-Most - 从简单到复杂的智慧

**📄 论文**：[Least-to-Most Prompting Enables Complex Reasoning in Large Language Models](https://arxiv.org/abs/2205.10625)
**作者**：Zhou et al. (Google Research)
**发表时间**：2022年5月

**核心思想**：把复杂问题拆成最简单的子问题，逐步解决。

#### 两阶段提示

**阶段1：分解问题**

```
Q: 解方程 3(x+5) - 2(x-1) = 15

分解步骤:
1. 展开括号
2. 合并同类项
3. 解方程
```

**阶段2：逐步求解**

```
步骤1: 3(x+5) = 3x + 15, -2(x-1) = -2x + 2
步骤2: 3x + 15 - 2x + 2 = x + 17
步骤3: x + 17 = 15 → x = -2
```

#### 效果

在 SCAN 组合泛化任务上：

| 方法 | 准确率 |
|------|--------|
| Few-shot CoT | 16% |
| Least-to-Most | **99.7%** |

**为什么效果这么好？**

CoT 可能直接跳到复杂步骤；Least-to-Most 强制从最简单的开始，逐步积累。

---

## 第三幕：分支技术爆发（2022-2023）

### ReAct：推理与行动的完美结合（Agent 的理论基础）

**📄 论文**：[ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
**作者**：Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, Yuan Cao
**机构**：Princeton University + Google Brain
**发表时间**：2022年10月
**项目页面**：https://react-lm.github.io/
**GitHub**：https://github.com/ofirpress/react

这篇论文**奠定了现代 AI Agent 的理论基础**，堪称 AI Agent 领域的里程碑！

#### 核心思想：推理 + 行动

**之前的局限**：
- **纯推理（CoT）**：只思考，不能获取外部信息
- **纯行动**：只会调用工具，不会反思
- **问题**：无法解决需要推理 + 信息的复合任务

**ReAct 解决方案**：
```
Thought → Action → Observation → Thought → Action → ...
   ↓         ↓           ↓         ↓         ↓
 思考    调用工具    获取结果    反思      继续
```

#### 实际案例

### 复杂问答任务

**问题**："巴黎埃菲尔铁塔的建造者去世时，法国人口是多少？"

**CoT 方式**（纯推理）：
```
"法国人口大概是6000万..." ❌（纯猜测，经常出现幻觉）
```

**ReAct 方式**（推理+行动）：
```
Thought 1: 我需要找埃菲尔铁塔的建造者
Action 1: Search[埃菲尔铁塔建造者]
Observation 1: 居斯塔夫·埃菲尔（1832-1923）

Thought 2: 现在我需要找他去世时法国的人口
Action 2: Search[法国1923年人口]
Observation 2: 3910万

Thought 3: 我已经得到答案了
Final Answer: 1923年时法国人口约3910万 ✅
```

#### 实验结果

### 问答任务（HotpotQA）
| 方法 | 准确率 | 效果 |
|------|--------|------|
| 纯 CoT | 29% | 经常编造答案 |
| ReAct | **60%** | 减少50%幻觉 |

### 交互任务（ALFWorld）
| 方法 | 成功率 | 训练数据需求 |
|------|--------|-------------|
| 模仿学习 | 31% | 需要大量演示 |
| 强化学习 | 45% | 需要百万次训练 |
| ReAct（1-2个示例） | **79%** | 极少样本 |

**震撼结果**：只需要1-2个ReAct示例，就超越了需要百万次训练的强化学习方法！

#### 技术创新点

### 1. 交替推理模式
```
不是：先推理 → 再行动（两阶段）
而是：推理 → 行动 → 反思 → 行动（循环）
```

### 2. 任务分解能力
```
复杂问题 → 多个简单步骤
每个步骤：思考 + 验证 + 调整
```

### 3. 错误恢复机制
```
行动失败 → 重新思考 → 调整行动策略
```

#### 对现代 AI Agent 的影响

### Claude Code 工作流程
```
用户: "重构这个函数"
  ↓
Thought: 我需要先查看函数内容
Action: read_file("utils.js")
Observation: [函数代码]
  ↓
Thought: 发现代码重复，需要提取公共函数
Action: edit_file("utils.js", ...)
Observation: 修改成功
  ↓
Thought: 需要运行测试验证
Action: run_tests()
Observation: 所有测试通过 ✅
```

### 其他 Agent 工具都是 ReAct 架构
- **Goose**：ReAct + MCP（Model Context Protocol）
- **Crush**：ReAct + LSP（Language Server Protocol）
- **Cursor/Windsurf**：代码编辑器的 ReAct 实现
- **OpenAI Code Interpreter**：ReAct 在 Python 环境中的应用

#### ReAct 解决的核心问题

### 1. 消除"知识幻觉"
- **传统问题**：大模型经常"编造"事实
- **ReAct 解决**：通过外部检索验证每个信息

### 2. 统一推理框架
- **之前**：推理模型 ≠ 交互代理，是两个独立领域
- **ReAct 之后**：统一了推理能力和行动能力

### 3. 少样本学习能力
- **突破**：只需要1-2个ReAct示例
- **效果**：模型就能学会完整的工作流程

#### ReAct 的深远意义

### 理论贡献
1. **首次统一**推理和行动两个概念
2. **建立**了现代 AI Agent 的基础架构
3. **证明**了少样本学习的强大威力

### 实践贡献
1. **影响**了一整代 AI 工具的设计
2. **催生**了 Claude Code、Goose 等现代 Agent
3. **开创**了"思维-行动-观察"的工作模式

### 产业贡献
1. **从"聊天伙伴"进化到"行动代理"**
2. **让 AI 能真正解决实际工作问题**
3. **奠定了人机协作的新范式**

**一句话总结**：ReAct 论文让大模型从"只会说书"进化到了"能干活"，这是 AI Agent 发展史上的关键转折点！

---

### Plan-and-Solve：Zero-shot CoT 的升级版

**📄 论文**：[Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models](https://arxiv.org/abs/2305.04091)
**作者**：Wang et al. (新加坡管理大学)
**发表时间**：2023年5月

#### 解决的问题

Zero-shot CoT 存在三个缺陷：

1. 计算错误
2. 跳过步骤
3. 语义理解错误

#### 改进方案

**提示词升级**：

```
旧版（Zero-shot CoT）:
"Let's think step by step"

新版（Plan-and-Solve）:
"Let's first understand the problem and devise a plan to solve it.
Then, let's carry out the plan step by step."

增强版（PS+）:
"Let's devise a plan by extracting relevant variables and numerals,
calculate intermediate results,
and pay attention to calculation and common sense."
```

#### 实验对比

**GSM8K 数学推理（text-davinci-002）**：

| 方法 | 准确率 |
|------|--------|
| Zero-shot CoT | 40.7% |
| Plan-and-Solve | 45.2% |
| **PS+** | **51.3%** |

**MultiArith 数学题（text-davinci-002）**：

| 方法 | 准确率 |
|------|--------|
| Zero-shot CoT | 78.7% |
| Plan-and-Solve | 81.5% |
| **PS+** | **84.6%** |

#### 为什么有效？

**类比**：

- Zero-shot CoT：徒步旅行，边走边想下一步
- Plan-and-Solve：出发前先看地图规划路线

**结构化思维**明显优于**线性思维**。

---

### Tree of Thoughts（ToT）：树状搜索推理

**📄 论文**：[Tree of Thoughts: Deliberate Problem Solving with Large Language Models](https://arxiv.org/abs/2305.10601)
**作者**：Yao et al. (Princeton & Google DeepMind)
**发表时间**：2023年5月
**GitHub**：https://github.com/princeton-nlp/tree-of-thought-llm

#### 核心思想

CoT 是线性的（一条推理链），ToT 是树状的（可以探索多条路径，还能回溯）。

#### 工作流程

```
问题：24点游戏 - 用 4, 5, 6, 10 凑出 24

        问题
         ↓
    ┌────┼────┐
    ↓    ↓    ↓
  6-4  10-6  4+5
  =2   =4    =9
    ↓    ↓    ↓
  2×5  4×5  无解
  =10  =20
   ❌   ↓
      20+4
      =24 ✅
```

**关键能力**：

1. **分支探索**：尝试多个可能性
2. **自我评估**：判断每条路径的质量
3. **剪枝优化**：放弃明显错误的路径
4. **回溯修正**：走不通就返回重新选择

#### 实验结果

**Game of 24（GPT-4）**：

| 方法 | 成功率 |
|------|--------|
| CoT | 4% |
| ToT | **74%** |

**提升了 18 倍！**

#### 代价

每个问题需要多次 API 调用（探索每个分支），成本和时间都增加。适合需要高准确率的场景。

---

### Graph of Thoughts（GoT）：图推理

**📄 论文**：[Graph of Thoughts: Solving Elaborate Problems with Large Language Models](https://arxiv.org/abs/2308.09687)
**作者**：Besta et al. (ETH Zurich & NVIDIA)
**发表时间**：2023年8月

#### 进化链

```
CoT:  A → B → C → D         (线性)
ToT:  A → B → D             (树状)
      ↓   ↓
      C   E
GoT:  A ⇄ B → D             (图状，可循环/合并)
      ↓ ↗   ↓
      C ← → E
```

#### 关键能力

1. **节点合并**：多个推理结果可以合并
2. **循环推理**：可以回到之前的状态重新思考
3. **非线性思维**：更接近人类的发散思维

#### 应用场景

- 文章排序（多篇文章需要合并信息）
- 复杂规划（多个目标相互影响）

---

### Reflexion：从错误中学习

**📄 论文**：[Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)
**作者**：Shinn et al. (Northeastern & MIT & Archimedes)
**发表时间**：2023年3月
**GitHub**：https://github.com/noahshinn/reflexion

#### 核心思想

**语言强化学习**：用自然语言反思失败，而不是调整模型参数。

#### 工作流程

```
尝试1 → 失败（写了有bug的代码）
  ↓
反思（Reflection）:
"我犯了什么错？边界条件没考虑，数组越界了"
  ↓
记忆（Episodic Memory）:
[将反思存入短期记忆]
  ↓
尝试2 → 成功（加上边界检查）
```

#### 实验结果

**HumanEval 代码生成**：

| 方法 | Pass@1 |
|------|--------|
| GPT-4 | 67.0% |
| GPT-4 + CoT | 73.2% |
| GPT-4 + Reflexion | **88.0%** |

**提升了 21 个百分点！**

#### 对开发者的启示

现代 AI Agent（如 Claude Code）的错误自修复能力，就是基于 Reflexion 思想：

```
写代码 → 运行测试 → 失败 → 分析错误 → 修复 → 成功
```

---

### Self-RAG：自主决策何时检索

**📄 论文**：[Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection](https://arxiv.org/abs/2310.11511)
**作者**：Asai et al. (华盛顿大学 & AI2 & IBM)
**发表时间**：2023年10月

#### 传统 RAG 的问题

所有问题都去检索，浪费时间和资源。

#### Self-RAG 的创新

模型自己决定：

1. **需要检索吗？**（简单问题不需要）
2. **检索结果相关吗？**（过滤无关信息）
3. **答案有支撑吗？**（检查是否胡编）
4. **答案有用吗？**（最终质量评估）

#### Reflection Tokens

引入特殊标记：

```
[Retrieve] → 是否需要检索
[IsRel] → 检索结果是否相关
[IsSup] → 答案是否有支撑
[IsUse] → 答案是否有用
```

模型学会**自我批判**和**质量控制**。

---

### Chain-of-Verification（CoVe）：四步验证法

**📄 论文**：[Chain-of-Verification Reduces Hallucination in Large Language Models](https://arxiv.org/abs/2309.11495)
**作者**：Dhuliawala et al. (Meta AI)
**发表时间**：2023年9月

#### 工作流程

```
1. 生成初始答案
2. 规划验证问题（"我说的对吗？"）
3. 独立回答验证问题（避免偏见）
4. 根据验证结果修订答案
```

#### 示例

```
Q: 法国的首都是哪里？

初始答案: 巴黎

验证问题:
- 法国的官方首都在宪法中如何规定？
- 巴黎是什么时候成为法国首都的？

验证答案:
- 法国宪法未明确规定首都，但巴黎是事实上的首都
- 987年巴黎成为法兰西王国首都

最终答案: 巴黎（自987年起成为法国事实上的首都）
```

#### 效果

在列表生成任务上，幻觉（hallucination）减少 **60%**。

---

## 第四幕：范式转变（2024-2025）

### 从提示词工程到内置推理

**重大转折**：模型不再需要提示词，直接具备内置推理能力！

---

### OpenAI O1/O3 系列（2024.09）

**核心特点**：

- 内部自动进行多步推理（invisible CoT）
- 推理过程消耗 tokens：几千到几万
- 数学竞赛级别能力

**代价**：

- 速度慢（推理时间长）
- 成本高（tokens 消耗大）

**适用场景**：复杂推理任务（数学、编程、科学问题）

---

### Anthropic Claude 3.7 Sonnet（2025.01）

**创新点**：

- **Extended Thinking** 模式（可见的思考过程）
- 推理深度可调节
- 平衡速度和准确率

**与 O1 的区别**：

- O1：黑盒推理（看不见）
- Claude 3.7：透明推理（可见）

---

### DeepSeek R1（2025.01）

**突破性进展**：

- 开源推理模型
- 纯 RL（强化学习）训练，无需标注推理过程
- 成本是 O1 的 **1/10**

**意义**：

证明了"模型可以自己学会推理"，不需要人类手写推理示例。

---

### 2025 推理模型爆发

- **Search-o1**：推理 + 搜索
- **QwQ-32B**：通义千问推理版本
- **Llama 4**：Meta 推理模型

**趋势**：推理能力成为大模型的**标配**。

---

## 第五幕：演进规律总结

### 五个阶段

```
阶段1（2020-2021）：发现能力
→ 大模型有推理潜力，但需要示例

阶段2（2022.01-2022.05）：启发推理
→ Few-shot CoT / Zero-shot CoT

阶段3（2022.10-2023）：结构化优化
→ Plan-and-Solve / ToT / GoT

阶段4（2022.10-2024）：工具整合
→ ReAct / Self-RAG / Reflexion

阶段5（2024-2025）：内置推理
→ O1 / Claude 3.7 / DeepSeek R1
```

---

### 对比图谱

| 技术 | 准确率 | 成本 | 速度 | 通用性 |
|------|--------|------|------|--------|
| Few-shot CoT | ⭐⭐⭐⭐ | 高（示例占空间） | 快 | ❌ 需定制 |
| Zero-shot CoT | ⭐⭐⭐ | 低 | 快 | ✅ 通用 |
| Plan-and-Solve | ⭐⭐⭐⭐ | 低 | 快 | ✅ 通用 |
| ReAct | ⭐⭐⭐⭐ | 中（多次调用） | 中 | ✅ 通用 |
| ToT | ⭐⭐⭐⭐⭐ | 很高（树搜索） | 慢 | ✅ 通用 |
| O1/R1 | ⭐⭐⭐⭐⭐ | 高（内部推理） | 慢 | ✅ 通用 |

---

### 演进逻辑

1. **从"教"到"激发"**：Few-shot → Zero-shot
2. **从"线性"到"结构化"**：CoT → Plan-and-Solve
3. **从"思考"到"行动"**：CoT → ReAct
4. **从"单路径"到"多路径"**：CoT → ToT → GoT
5. **从"提示词"到"内置能力"**：Zero-shot CoT → O1

**终极目标**：模型自主推理，人类只需描述问题。

---

## 第六幕：对实际开发的影响

### AI Agent 的理论基础

**Claude Code / Goose / Crush 的工作流**：

```
1. 理解任务（Zero-shot CoT）
   ↓
2. 制定计划（Plan-and-Solve）
   ↓
3. 循环执行:
   - Thought（推理）
   - Action（调用工具）
   - Observation（获取结果）
   ↓
4. 自我反思（Reflexion）
   ↓
5. 验证修正（CoVe）
```

**所有技术都用上了！**

---

### Prompt Engineering 的未来

**2022-2023**：手工设计提示词（艺术）
**2024-2025**：模型内置推理（自动化）
**未来**：？

可能方向：

- 高层次意图描述（"帮我优化性能"，模型自己决定用什么方法）
- 多模态推理（图像 + 文本 + 代码联合推理）
- 记忆增强推理（长期记忆 + 规划）

---

### 技术选型建议

**简单任务**（FAQ、分类）：

```
Zero-shot CoT 足够
```

**中等任务**（数据分析、代码审查）：

```
Plan-and-Solve 或 ReAct
```

**复杂任务**（数学证明、复杂规划）：

```
ToT 或 推理模型（O1/DeepSeek R1）
```

**需要外部工具**（搜索、API 调用）：

```
ReAct + Self-RAG
```

---

## 尾声：未来展望

### 已解决的问题

✅ 大模型具备推理能力
✅ 可以自主规划和执行
✅ 能够自我反思和修正
✅ 可以调用外部工具

### 未解决的问题

❓ 推理速度慢（O1 单次推理可能数分钟）
❓ 成本高（推理消耗大量 tokens）
❓ 长期记忆缺失（无法跨会话学习）
❓ 多智能体协作（多个 Agent 如何配合？）

### 正在探索的方向

- **推理蒸馏**：将 O1 的推理能力蒸馏到小模型
- **混合推理**：快速推理 + 深度推理结合
- **记忆架构**：长期记忆 + 短期记忆
- **多模态推理**：文本 + 图像 + 视频联合推理

---

## 附录：核心论文清单

| 时间 | 论文 | arXiv | 关键贡献 |
|------|------|-------|----------|
| 2020.05 | Retrieval-Augmented Generation | [2005.11401](https://arxiv.org/abs/2005.11401) | RAG 范式 |
| 2022.01 | Chain-of-Thought Prompting | [2201.11903](https://arxiv.org/abs/2201.11903) | Few-shot CoT |
| 2022.05 | Least-to-Most Prompting | [2205.10625](https://arxiv.org/abs/2205.10625) | 分解推理 |
| 2022.05 | Zero-Shot Reasoners | [2205.11916](https://arxiv.org/abs/2205.11916) | Zero-shot CoT |
| 2022.10 | ReAct | [2210.03629](https://arxiv.org/abs/2210.03629) | 推理+行动 |
| 2023.03 | Reflexion | [2303.11366](https://arxiv.org/abs/2303.11366) | 语言强化学习 |
| 2023.05 | Plan-and-Solve | [2305.04091](https://arxiv.org/abs/2305.04091) | 规划+执行 |
| 2023.05 | Tree of Thoughts | [2305.10601](https://arxiv.org/abs/2305.10601) | 树搜索推理 |
| 2023.08 | Graph of Thoughts | [2308.09687](https://arxiv.org/abs/2308.09687) | 图推理 |
| 2023.09 | Chain-of-Verification | [2309.11495](https://arxiv.org/abs/2309.11495) | 验证减少幻觉 |
| 2023.10 | Self-RAG | [2310.11511](https://arxiv.org/abs/2310.11511) | 自主检索 |

---

## 参考资源

- **Prompt Engineering Guide**: https://www.promptingguide.ai/
- **Learn Prompting**: https://learnprompting.org/
- **OpenAI Cookbook**: https://cookbook.openai.com/
- **Anthropic Prompt Engineering**: https://docs.anthropic.com/claude/docs/prompt-engineering

---

**最后更新**：2025年11月
**作者**：Link
**仓库**：workspace/markdown

> 这段历史还在继续书写，期待下一个突破！
