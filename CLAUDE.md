# CLAUDE.md - Technical Documentation Repository

## Repository Overview

This is a comprehensive technical documentation repository containing personal study notes and references across multiple programming languages, technologies, and computer science topics. The repository is structured as a knowledge base with approximately 140 markdown files organized into 22 main topic areas.

## Repository Structure

```
/Users/link/workspace/markdown/
├── .git/                     # Git repository metadata
├── .gitignore               # Git ignore file (ignores .vscode, .idea)
├── CPP程序设计/             # C++ Programming (11 files)
├── C程序设计/               # C Programming (9 files) 
├── GO/                      # Go Language (10 files)
├── MongoDB数据库/           # MongoDB Database (4 files)
├── Redis数据库/             # Redis Database (8 files)
├── private/                 # Private notes
├── 分布式/                  # Distributed Systems (15 files)
├── 前端/                    # Frontend Development
│   ├── htmlcss/            # HTML/CSS (10 files)
│   ├── js/                 # JavaScript (12 files)
│   └── 协议架构优化性能/    # Protocols & Performance (5 files)
├── 工作/                    # Work-related (3 files)
├── 常用软件/                # Common Software Tools (12 files)
├── 操作系统/                # Operating Systems (10 files)
├── 数据库/                  # Database Systems (16 files)
├── 杂类/                    # Miscellaneous (7 files)
├── 游戏开发/                # Game Development (6 files)
├── 第零层/                  # Low-level Systems (7 files)
├── 算法/                    # Algorithms & Data Structures (12 files)
├── 网络/                    # Networking (8 files)
└── 语言设计/                # Language Design (5 files)
```

## Content Categories

### Programming Languages
- **C/C++**: Comprehensive notes on C and C++ programming, including advanced topics like STL, design patterns, and best practices
- **Go**: Go language fundamentals, channels, functions, standard library, testing, and design patterns
- **JavaScript**: Core JS concepts, OOP, modules, DOM manipulation, jQuery
- **Erlang/Lua/Scheme**: Additional language references

### Systems & Infrastructure
- **Operating Systems**: CSAPP, Linux system programming, processes, threads, file systems
- **Networking**: TCP/IP, HTTP/HTTPS, network layers (physical, link, network, transport, application)
- **Distributed Systems**: Microservices, Kubernetes, Docker, high availability, fault tolerance
- **Databases**: MySQL, PostgreSQL, SQLite, MongoDB, Redis, optimization, indexing

### Tools & Technologies
- **Development Tools**: Git, Docker, Nginx, Apache, CMake, GDB
- **Build Systems**: Make, AutoTools, modern build systems
- **Performance**: Web optimization, concurrent testing, profiling

### Computer Science Fundamentals
- **Algorithms**: Sorting, data structures (AVL trees, B-trees, hash tables, linked lists)
- **Low-level Systems**: Assembly language (16-bit, 32-bit, 64-bit), computer hardware, encoding
- **Game Development**: Server architecture, networking, frameworks

## Key Features

### Documentation Style
- **Language**: Primarily Chinese with some English technical terms
- **Format**: Markdown files with code examples, diagrams, and detailed explanations
- **Scope**: Personal study notes ranging from beginner to advanced topics

### Repository Characteristics
- **Size**: ~13MB total
- **File Count**: ~140 markdown files
- **No Build System**: Pure documentation repository with no executable code
- **Version Control**: Git repository with clean working directory

## Working with This Repository

### Prerequisites
- No special software required beyond a markdown viewer
- Git for version control
- Text editor that supports Chinese characters and markdown

### Navigation Tips
1. **By Topic**: Browse directories by technology or subject area
2. **By Language**: Most content is in Chinese - use translation tools if needed
3. **Cross-References**: Many files reference related concepts across directories

### Content Guidelines
- All files are markdown (.md) format
- Code examples are properly formatted with syntax highlighting
- Chinese file and directory names are used throughout
- Technical terms often include both Chinese and English

### Git Workflow
- Repository is on `master` branch
- Working directory is clean
- Standard git operations apply
- No special build or deployment processes needed

## Special Considerations

### Character Encoding
- Repository uses Chinese characters in file and directory names
- Ensure your editor supports UTF-8 encoding
- Some systems may need locale configuration for proper display

### No Build Process
- This is a documentation-only repository
- No package.json, Makefile, or other build configuration
- Content can be viewed directly or processed with static site generators

### Content Updates
- Files appear to be actively maintained (recent commits)
- Content covers both foundational and current technologies
- Some files may contain personal opinions and experiences

## Recommended Workflow for Claude

1. **Reading Files**: Use the Read tool for accessing specific documentation
2. **Searching**: Use Grep tool to find specific topics or code examples
3. **Navigation**: Use LS and Glob tools to explore directory structure
4. **Modifications**: Only edit existing files if explicitly requested - avoid creating new files unnecessarily

## Common Tasks

### Finding Information
```bash
# Search for specific topics
grep -r "keyword" /Users/link/workspace/markdown/

# Find files by topic area
ls /Users/link/workspace/markdown/[topic]/
```

### Content Analysis
- Files contain practical examples and implementations
- Many include interview questions and best practices
- Cross-references between related topics are common

This repository serves as a comprehensive technical reference covering the full stack of computer science and software engineering topics, from low-level systems programming to high-level application architecture.

## 当前学习/工作进度 (2025-07-30)

### 正在进行的任务
- **Claude Code官方文档学习**: 正在阅读和理解Claude Code使用手册
- **技术文档编写**: 创建《Claude使用文档.md》记录学习成果
- **已完成内容**:
  - ✅ 自动化任务功能详解 (修复lint、解决冲突、编写发布说明)
  - ✅ 企业级特性分析 (部署选项、安全保障、合规性)
  - ✅ **Sub Agent代理系统学习** (2025-07-30)
    - 掌握Claude Code中的sub agent概念和架构
    - 成功使用`/agents`命令创建progress-tracker代理
    - 理解代理系统的工作原理和实际应用场景
    - 学会通过Task tool调用专业代理处理特定任务

### 学习重点
- **Claude Code核心功能**: 理解AI辅助开发的实际应用场景
- **企业级AI工具**: 学习大型企业如何安全地集成AI开发工具
- **技术文档写作**: 将复杂技术概念转化为清晰的中文文档

### 下次继续任务
- 继续阅读Claude Code手册其他章节
- 完善《Claude使用文档.md》内容
- 根据link的问题深入解释技术细节

### 项目状态
- **文档位置**: `/Users/link/workspace/markdown/Claude使用文档.md`
- **Git状态**: 本地修改未提交 (等待link确认)
- **学习仓库**: 个人博客markdown知识库