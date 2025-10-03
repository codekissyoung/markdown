# iTerm2 Hotkey Window 配置指南

## 什么是 Hotkey Window？

Hotkey Window 是 iTerm2 的**快捷键唤起窗口**功能，可以通过快捷键（如 F12）快速显示/隐藏终端窗口。类似下拉式控制台，适合频繁使用终端但不想常驻显示的场景。

## 核心配置步骤

### 1. 创建 Hotkey Window Profile

**Settings → Profiles → Hotkey Window**

- 左侧选择 `Hotkey Window` 配置文件
- 如果没有，点击左下角 `+` 创建新 Profile，命名为 `Hotkey Window`

### 2. 绑定快捷键

**Settings → Keys → Hotkey**

- 点击 `Create a Dedicated Hotkey Window...`
- 或找到已存在的 Hotkey Window 配置
- 绑定快捷键为 **F12**（或其他自定义按键）
- 配置关联的 Profile 为 `Hotkey Window`

### 3. 关闭动画效果（关键优化）

**Settings → Keys → Hotkey → Configure Hotkey Window**

- 找到并**取消勾选** `Animate showing and hiding`
- 这样按 F12 时窗口会**立即出现/隐藏**，无下拉动画延迟

## 窗口样式配置

### 下拉式效果设置

**Settings → Profiles → Hotkey Window → Window**

推荐配置：
- **Style**: `Full-Width Top of Screen` （全宽顶部）
- **Screen**: `Screen with Cursor` （跟随光标屏幕）
- **Space**: `All Spaces` （所有空间可用）

### 透明度与背景

**Settings → Profiles → Hotkey Window → Window**

- **Transparency**: 建议设置为 10-30% 透明度
- **Blur**: 可启用背景模糊增强视觉效果
- **Keep background colors opaque**: 勾选保持文本清晰度

### 窗口高度调整

**Settings → Profiles → Hotkey Window → Window**

- **Rows**: 设置终端行数（默认 25，可调整为 30-40 适应下拉样式）
- **Columns**: 设置列数（默认 80，全宽模式下自动调整）

## 实际使用技巧

### 快速唤起/隐藏
```
按 F12 → 窗口立即出现（无动画）
再按 F12 → 窗口立即隐藏
```

### 多显示器支持
- `Screen with Cursor` 模式：窗口会出现在当前光标所在的显示器
- `Main Screen` 模式：窗口固定在主显示器

### 工作流程优化
1. **常驻后台**: Hotkey Window 保持运行，进程不中断
2. **快速切换**: 不需要 Cmd+Tab 在应用间切换
3. **屏幕利用**: 需要时出现，不用时自动隐藏节省空间

## 配置对比

### 有动画 vs 无动画

| 配置 | 动画效果 | 响应速度 | 适用场景 |
|------|---------|---------|---------|
| 启用动画 | 下拉滑出效果 | 延迟 200-300ms | 视觉体验优先 |
| **关闭动画** | **瞬间出现** | **即时响应** | **效率优先** ✅ |

### Profile 类型对比

| 类型 | 使用方式 | 典型场景 |
|------|---------|---------|
| Default Profile | Cmd+N 新建窗口 | 标准终端操作 |
| **Hotkey Window** | **F12 快捷键** | **快速命令执行** |

## 常见问题

### Q1: F12 按键无反应？
**解决方法**:
- 检查系统快捷键是否占用：系统偏好设置 → 键盘 → 快捷键
- macOS 可能将 F12 映射为 Dashboard 或其他功能
- 更换其他快捷键如 `Option + Space` 或 `Ctrl + ~`

### Q2: 窗口出现位置不对？
**解决方法**:
- Settings → Profiles → Hotkey Window → Window → Screen
- 选择 `Screen with Cursor` 跟随光标显示器
- 或选择固定的显示器编号

### Q3: 动画设置在哪里？
**正确路径**:
- **Settings → Keys → Hotkey** （不是 Profiles → Window）
- 在 Hotkey 配置区域找到 `Animate showing and hiding` 选项

### Q4: 透明度太高看不清文字？
**解决方法**:
- Settings → Profiles → Hotkey Window → Window
- 勾选 `Keep background colors opaque` 保持文本背景不透明
- 降低 Transparency 滑块的透明度值

## 高级配置

### 自动隐藏设置
**Settings → Keys → Hotkey → Configure**
- `Auto-hide when focus is lost`: 失去焦点时自动隐藏
- `Floating window`: 窗口悬浮在所有应用之上

### 快捷键组合方案
```
F12              → 主要 Hotkey Window
Option + F12     → 第二个 Hotkey Window（不同 Profile）
Ctrl + `         → 第三个备用配置
```

### 不同场景的 Profile
1. **开发环境**: 绑定特定项目目录，自动 cd 到工作空间
2. **服务器连接**: 预置 SSH 连接命令
3. **监控窗口**: 显示系统资源监控（htop、iostat）

## 对比传统终端

**传统 iTerm2 窗口**:
- 通过 Dock 或 Cmd+Tab 切换
- 占用屏幕空间
- 需要手动管理窗口位置

**Hotkey Window**:
- ✅ 一键唤起/隐藏
- ✅ 不占用 Dock 空间
- ✅ 自动定位到屏幕顶部
- ✅ 后台保持运行状态
- ✅ 无动画即时响应

## 实用场景

### 开发调试
```bash
# 快速执行 git 命令
F12 → git status → F12

# 快速查看日志
F12 → tail -f app.log → F12（自动隐藏但进程继续运行）
```

### 快速编译
```bash
F12 → npm run build → F12
# 编译完成后查看结果再按 F12
```

### 系统管理
```bash
F12 → ps aux | grep node → F12
F12 → docker ps → F12
```

## 总结

iTerm2 Hotkey Window 的核心价值：
- 🚀 **极速访问** - F12 瞬间唤起终端
- ⚡ **零延迟** - 关闭动画配置实现即时响应
- 🎯 **专注工作** - 不需要时自动隐藏，保持桌面整洁
- 💼 **效率优先** - 适合需要频繁使用终端但不想常驻的开发者

**最佳实践配置**:
1. 快捷键: **F12**
2. 样式: **Full-Width Top of Screen**
3. 动画: **关闭** ✅
4. 透明度: **20%** + 背景模糊
5. 自动隐藏: **启用**

记住这套配置，让终端操作效率翻倍！

---
*记录时间: 2025-10-03*
*适用版本: iTerm2 3.5+*
*系统平台: macOS*
