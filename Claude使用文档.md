# Claude Code 使用文档

## 概述
Claude Code 是 Anthropic 官方提供的 CLI 工具，帮助开发者完成各种软件工程任务。本文档记录了 Claude Code 的核心功能和使用方法。

## 核心功能

### 自动化繁琐任务

Claude Code 可以自动化处理开发中的三类繁琐任务：

#### 1. 修复代码规范问题 (Fix fiddly lint issues)
- **问题类型**: 代码风格检查工具(如ESLint、pylint、golint)发现的格式问题
- **为什么繁琐**: 通常是大量的缩进、空格、命名规范等小问题，手动修复耗时且容易遗漏
- **Claude Code解决方案**: 可以批量分析和修复这些格式问题，确保代码符合项目规范

#### 2. 解决合并冲突 (Resolve merge conflicts)
- **问题类型**: Git合并分支时，同一文件的同一部分被不同分支修改产生的冲突
- **为什么困难**: 需要理解代码逻辑和业务上下文，判断保留哪个版本或如何智能合并
- **Claude Code解决方案**: 理解代码上下文和变更意图，智能选择合并策略，避免破坏代码逻辑

#### 3. 编写发布说明 (Write release notes)
- **问题类型**: 软件新版本的功能更新、bug修复、重要变更说明
- **为什么繁琐**: 需要梳理git提交历史，理解变更内容，组织成用户友好的文档
- **Claude Code解决方案**: 分析提交记录和代码变更，自动生成结构化、可读性好的发布说明

### 使用方式

#### 开发机器单命令执行
在本地开发环境直接运行Claude Code命令来处理这些任务：
```bash
# 示例命令
claude-code fix-lint
claude-code resolve-conflicts  
claude-code generate-release-notes
```

#### CI中自动执行
集成到持续集成流水线中，每次代码提交或合并时自动运行：
```yaml
# CI配置示例
- name: Auto-fix lint issues
  run: claude-code fix-lint
  
- name: Generate release notes
  run: claude-code generate-release-notes
```

### 价值总结
通过自动化这些重复性、技术性任务，Claude Code让开发者能够：
- 专注于核心业务逻辑开发
- 减少手动处理繁琐问题的时间
- 提高代码质量和发布效率
- 降低人为错误的概率

## 企业级特性

### 灵活的部署选项

#### 1. Anthropic官方API
- **部署方式**: 直接调用Anthropic提供的云端Claude服务
- **适用场景**: 中小型团队，快速上手，无需自建基础设施
- **优势**: 
  - 部署简单，开箱即用
  - 无需维护服务器和基础设施
  - 自动获得最新功能和模型更新
  - 按需付费，成本可控

#### 2. 私有云部署 (AWS/GCP)
- **部署方式**: 在企业自己的云环境中部署Claude Code
- **支持平台**: Amazon Web Services (AWS) 和 Google Cloud Platform (GCP)
- **适用场景**: 大型企业，对数据主权、网络隔离有严格要求
- **优势**:
  - 完全控制数据流向和存储位置
  - 可定制化配置和集成
  - 满足特殊合规和安全要求
  - 与现有企业IT架构深度集成

### 企业级安全保障

#### Security (安全性)
- **数据传输加密**: 所有API调用都通过HTTPS/TLS加密传输
- **访问控制**: 
  - 细粒度的权限管理和身份验证
  - 支持SSO单点登录集成
  - 基于角色的访问控制(RBAC)
- **审计日志**: 完整记录所有操作和访问，支持安全审计和问题追溯

#### Privacy (隐私保护)
- **数据不训练**: 企业代码和数据绝不用于模型训练或改进
- **数据隔离**: 不同企业/租户的数据完全隔离，互不可见
- **本地处理**: 私有部署时数据不离开企业网络环境
- **数据生命周期管理**: 支持数据自动清理和长期保留策略

#### Compliance (合规性)
- **国际法规遵循**: 
  - GDPR (欧盟通用数据保护条例)
  - HIPAA (美国健康保险便携性和责任法案)
  - SOC2 Type II (服务组织控制审计)
- **行业认证**: 通过多项国际安全和隐私认证
- **审计支持**: 提供详细的合规报告和审计文档
- **数据本地化**: 支持数据驻留在指定地理区域

### 为什么企业需要这些特性

大型企业在选择AI开发工具时，技术能力只是基础，更关键的考量因素包括：

1. **代码安全**: 确保商业机密和核心代码不会泄露
2. **合规要求**: 满足行业监管和内部安全政策
3. **IT集成**: 能够无缝集成到现有的开发和安全基础设施
4. **专业支持**: 获得企业级技术支持和SLA保障
5. **成本控制**: 透明的定价模式和预算管理

Claude Code通过这些企业级特性，让大型企业可以放心地将AI融入核心开发流程，在提升效率的同时保持安全合规。

## 身份和访问管理 (IAM)

### 认证方式

Claude Code支持多种认证方式，满足不同使用场景的需求：

#### 1. Anthropic API Console
- **适用用户**: 个人开发者和小型团队
- **使用方式**: 直接使用Anthropic官方API进行认证
- **特点**: 配置简单，登录后即可使用所有功能

#### 2. Amazon Bedrock
- **适用用户**: 使用AWS云服务的企业
- **使用方式**: 通过AWS Bedrock服务访问Claude能力
- **特点**: 与AWS生态深度集成，利用现有AWS账户和权限体系

#### 3. Google Vertex AI  
- **适用用户**: 使用Google Cloud的企业
- **使用方式**: 通过Google Cloud Vertex AI平台访问
- **特点**: 融入Google Cloud AI/ML工具链，统一管理

### 权限控制系统

Claude Code提供细粒度的权限管理，让用户精确控制AI助手的操作权限：

#### 权限模式
- **`default`**: 首次使用工具时提示用户确认 (推荐个人用户)
- **`acceptEdits`**: 自动接受文件编辑权限 (适合信任环境)
- **`plan`**: 仅允许分析，不执行实际操作 (适合审查模式)
- **`bypassPermissions`**: 跳过所有权限检查 (仅限完全可信环境)

#### 工具级别权限
可以针对特定工具设置不同的权限级别：
- **读取权限**: 允许查看文件内容和系统信息
- **执行权限**: 允许运行命令和脚本
- **修改权限**: 允许编辑文件和配置

### 企业级用户管理

#### 集中化策略管理
- **统一配置**: 企业IT管理员可以为所有用户设置统一的安全策略
- **层级权限**: 支持部门级、项目级、个人级的权限继承和覆盖
- **策略模板**: 提供常用的权限配置模板，快速部署

#### 凭证安全管理
- **安全存储**: 在macOS Keychain中加密保存API密钥和认证信息
- **自动刷新**: 支持访问令牌的自动续期，无需手动维护
- **多账户支持**: 可以同时管理多个不同服务的认证凭证

### 个人用户使用建议

对于个人开发者来说，IAM配置非常简单：

1. **登录即用**: 通过Anthropic API Console登录后直接使用
2. **默认安全**: 系统使用合理的默认权限设置，平衡安全性和易用性
3. **按需确认**: 重要操作时会提示确认，避免意外修改

不需要复杂的企业级配置，Claude Code会以个人用户模式安全稳定地运行。

## 多API工具链配置实战 🚀

### 背景和动机

在深度使用Claude进行开发工作时，遇到了一个重要挑战：**晚8点后官方API的token限制问题**。对于高频使用Claude进行框架BUG排查和技术学习的工作模式，单一API渠道成为了效率瓶颈。通过配置多个Claude兼容API，成功解决了这个问题，实现了24小时不间断的AI辅助开发。

### 工具链配置过程

#### 1. 环境变量配置

配置了三套API环境变量，实现多渠道切换：

```bash
# ~/.zshrc 配置
# 官方Claude API
export ANTHROPIC_API_KEY="sk-ant-xxx"

# Claude-Kimi兼容API  
export CLAUDE_KIMI_API_KEY="your_kimi_key"
export CLAUDE_KIMI_BASE_URL="https://api.moonshot.cn/v1"

# Claude-GLM兼容API
export CLAUDE_GLM_API_KEY="your_glm_key" 
export CLAUDE_GLM_BASE_URL="https://open.bigmodel.cn/api/paas/v4"
```

#### 2. Function配置文件

创建了三个独立的function配置文件，用于快速切换API：

**`~/.claude/functions-official.json`** (官方API)
```json
{
  "claudeApiKey": "$ANTHROPIC_API_KEY",
  "baseUrl": "https://api.anthropic.com",
  "model": "claude-3-5-sonnet-20241022"
}
```

**`~/.claude/functions-kimi.json`** (Kimi兼容)
```json
{
  "claudeApiKey": "$CLAUDE_KIMI_API_KEY", 
  "baseUrl": "$CLAUDE_KIMI_BASE_URL",
  "model": "moonshot-v1-32k"
}
```

**`~/.claude/functions-glm.json`** (GLM兼容)
```json
{
  "claudeApiKey": "$CLAUDE_GLM_API_KEY",
  "baseUrl": "$CLAUDE_GLM_BASE_URL", 
  "model": "glm-4-plus"
}
```

#### 3. 快速切换命令

配置了shell别名，实现一键切换：

```bash
# ~/.zshrc
alias claude-official='export CLAUDE_CONFIG=~/.claude/functions-official.json'
alias claude-kimi='export CLAUDE_CONFIG=~/.claude/functions-kimi.json'  
alias claude-glm='export CLAUDE_CONFIG=~/.claude/functions-glm.json'
```

### 三个API能力对比分析

#### 实际测试发现

通过实际使用对比，发现了重要的能力差异：

| API类型 | 代码理解 | 技术问题解答 | 复杂推理 | 中文支持 | 稳定性 |
|---------|----------|--------------|----------|----------|--------|
| **Claude官方** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Claude-GLM** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Claude-Kimi** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

#### 关键发现 💡

**Claude-GLM能力显著优于Claude-Kimi**：
- **代码分析深度**: GLM能更好地理解复杂的代码结构和框架机制
- **技术问题诊断**: 对BUG排查和系统性问题分析更准确
- **架构理解**: 能够把握大型项目的整体架构和模块关系
- **中文技术表达**: 专业术语使用更准确，技术文档写作质量更高

### 优化后的使用策略

#### 时间段分配策略

**白天(8:00-20:00)**: 官方Claude API
- 处理复杂的架构设计问题
- 深度代码审查和重构建议
- 关键技术决策讨论

**晚间(20:00-24:00)**: Claude-GLM API  
- 框架BUG排查和问题诊断
- 技术文档编写和学习笔记
- 代码实现和优化建议

**深夜/凌晨**: Claude-Kimi API
- 简单的代码查询和语法问题
- 基础概念学习和答疑
- 轻量级的开发任务

#### 问题类型分配策略

**优先使用官方Claude**:
- 复杂的架构设计和系统分析
- 多文件、多模块的代码重构
- 性能优化和安全审查
- 关键业务逻辑的实现

**使用Claude-GLM**:
- 框架相关问题排查（xorm、gin等）
- 数据库设计和优化建议  
- Go/PHP/JavaScript技术问题
- 技术文档和学习笔记编写

**使用Claude-Kimi**:
- 简单的语法和概念查询
- 基础功能实现
- 工具使用和配置问题
- 轻量级的代码片段生成

### 重大突破价值

#### 1. 解决token限制瓶颈
- **24小时不间断**: 彻底解决晚8点后的token限制问题
- **工作连续性**: 深夜也能继续进行复杂的技术分析
- **学习不中断**: 支持长时间的深度学习和探索

#### 2. 匹配工作模式
- **框架BUG排查**: 高频的xorm、gin框架问题都有合适的API支持
- **技术文档编写**: GLM在中文技术文档方面表现优秀  
- **多层次需求**: 不同复杂度的问题有对应的最佳API选择

#### 3. 成本效益优化
- **智能分流**: 复杂问题用官方API，常规问题用替代API
- **资源最大化**: 充分利用不同API的优势特性
- **效率提升**: 避免因API限制导致的工作中断

### 配置最佳实践

#### 1. 环境隔离
```bash
# 每个项目可以设置独立的API配置
cd ~/workspace/project1
echo "export CLAUDE_CONFIG=~/.claude/functions-glm.json" > .claude-env

cd ~/workspace/project2  
echo "export CLAUDE_CONFIG=~/.claude/functions-official.json" > .claude-env
```

#### 2. 自动切换脚本
```bash
#!/bin/bash
# auto-switch-claude.sh
current_hour=$(date +%H)

if [ $current_hour -ge 20 ] || [ $current_hour -lt 8 ]; then
    export CLAUDE_CONFIG=~/.claude/functions-glm.json
    echo "Switched to Claude-GLM (evening/night mode)"
else
    export CLAUDE_CONFIG=~/.claude/functions-official.json  
    echo "Using official Claude API (daytime mode)"
fi
```

#### 3. 监控和日志
```bash
# 记录API使用情况
echo "$(date): Using $(basename $CLAUDE_CONFIG)" >> ~/.claude/api-usage.log
```

### 对高频Claude用户的价值

这套多API工具链配置对于像link这样高频使用Claude进行技术工作的开发者具有重大价值：

1. **工作效率倍增**: 消除了token限制对工作节奏的影响
2. **技术深度保障**: 复杂问题仍有官方API的高质量支持
3. **成本控制优化**: 根据问题复杂度智能选择API，避免资源浪费
4. **适应工作习惯**: 支持深夜加班和不同时段的工作强度变化

这不仅仅是技术配置的优化，更是**工作方式的升级**，让AI真正成为24小时不间断的开发伙伴。

---

*文档持续更新中...*