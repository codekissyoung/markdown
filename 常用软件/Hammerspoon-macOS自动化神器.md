# Hammerspoon - macOS 自动化神器

## 什么是 Hammerspoon？

Hammerspoon 是一款强大的 **macOS 自动化工具**，通过编写 Lua 脚本控制 macOS 的一切操作。它基于 macOS Accessibility API，可以实现窗口管理、应用切换、快捷键绑定等自动化功能。

**核心特点：**
- 🆓 完全免费开源 (GitHub 10k+ stars)
- 💻 Lua 脚本配置，程序员友好
- ⚡ 系统级控制，功能强大
- 🔧 高度可定制，完全掌控

## 快速开始

### 安装

```bash
brew install --cask hammerspoon
```

### 基础配置

配置文件位置：`~/.hammerspoon/init.lua`

**最简配置示例：**
```lua
-- 加载 IPC 模块(允许命令行控制)
hs.ipc.cliInstall()

-- 配置加载提示
hs.alert.show("Hammerspoon 配置已加载")
```

### 重载配置

配置修改后需要重新加载：
1. 点击菜单栏 Hammerspoon 图标 → "Reload Config"
2. 或命令行执行：`hs -c "hs.reload()"`
3. 或重启 Hammerspoon：`killall Hammerspoon && open -a Hammerspoon`

## 核心功能实现

### 1. 应用快速切换

**痛点：** macOS 没有原生的快捷键快速切换到指定应用，需要 Cmd+Tab 多次切换或鼠标点击。

**解决方案：** 一键直达常用应用

```lua
-- F9 聚焦 Chrome
hs.hotkey.bind({}, "F9", function()
    hs.application.launchOrFocus("Google Chrome")
end)

-- F7 聚焦微信
hs.hotkey.bind({}, "F7", function()
    hs.application.launchOrFocus("WeChat")
end)

-- F8 聚焦微信开发者工具
hs.hotkey.bind({}, "F8", function()
    hs.application.launchOrFocus("wechatwebdevtools")
end)
```

**效果：**
- 按 F9 → Chrome 立刻切换到前台
- 按 F7 → 微信立刻切换到前台
- 无需 Cmd+Tab 查找应用

**技巧：** 如何找到应用的正确名称？
```bash
# 方法1: 查看正在运行的应用
osascript -e 'tell application "System Events" to get name of every process whose background only is false'

# 方法2: 查看 Applications 文件夹
ls /Applications/ | grep -i "关键词"
```

### 2. 窗口管理

**痛点：** macOS 原生没有快捷键分屏功能，需要鼠标拖拽窗口。

**解决方案：** 快捷键实现精确窗口布局

```lua
-- 左半屏
hs.hotkey.bind({"cmd", "ctrl"}, "Left", function()
    local win = hs.window.focusedWindow()
    win:moveToUnit({0, 0, 0.5, 1})
end)

-- 右半屏
hs.hotkey.bind({"cmd", "ctrl"}, "Right", function()
    local win = hs.window.focusedWindow()
    win:moveToUnit({0.5, 0, 0.5, 1})
end)

-- 全屏
hs.hotkey.bind({"cmd", "ctrl"}, "F", function()
    local win = hs.window.focusedWindow()
    win:moveToUnit({0, 0, 1, 1})
end)

-- 上半屏
hs.hotkey.bind({"cmd", "ctrl"}, "Up", function()
    local win = hs.window.focusedWindow()
    win:moveToUnit({0, 0, 1, 0.5})
end)

-- 下半屏
hs.hotkey.bind({"cmd", "ctrl"}, "Down", function()
    local win = hs.window.focusedWindow()
    win:moveToUnit({0, 0.5, 1, 0.5})
end)
```

**moveToUnit 参数说明：**
```lua
win:moveToUnit({x, y, width, height})
-- x, y: 窗口左上角位置 (0-1 相对屏幕)
-- width, height: 窗口宽高 (0-1 相对屏幕)

-- 示例
{0, 0, 0.5, 1}     -- 左半屏 (x=0, y=0, 宽50%, 高100%)
{0.5, 0, 0.5, 1}   -- 右半屏 (x=50%, y=0, 宽50%, 高100%)
{0, 0, 1, 1}       -- 全屏 (x=0, y=0, 宽100%, 高100%)
{0.25, 0.25, 0.5, 0.5} -- 居中半屏 (x=25%, y=25%, 宽50%, 高50%)
```

### 3. 多显示器支持

**双屏场景：** 快速在主屏和副屏间移动窗口

```lua
-- Cmd+Ctrl+1: 移动窗口到主屏
hs.hotkey.bind({"cmd", "ctrl"}, "1", function()
    local win = hs.window.focusedWindow()
    win:moveToScreen(hs.screen.primaryScreen())
end)

-- Cmd+Ctrl+2: 移动窗口到副屏
hs.hotkey.bind({"cmd", "ctrl"}, "2", function()
    local win = hs.window.focusedWindow()
    local screens = hs.screen.allScreens()
    if #screens >= 2 then
        win:moveToScreen(screens[2])
    end
end)
```

### 4. 一键工作区布局

**场景：** 开发时需要固定的应用布局（IDE + 浏览器 + 终端）

```lua
-- Cmd+Shift+W: 开发工作区布局
hs.hotkey.bind({"cmd", "shift"}, "W", function()
    -- 主屏: GoLand 全屏
    local goland = hs.application.launchOrFocus("GoLand")
    if goland then
        local win = goland:mainWindow()
        win:moveToScreen(hs.screen.primaryScreen())
        win:moveToUnit({0, 0, 1, 1})
    end

    -- 副屏左半: Chrome
    hs.timer.doAfter(0.5, function()
        local chrome = hs.application.launchOrFocus("Google Chrome")
        if chrome then
            local win = chrome:mainWindow()
            local screens = hs.screen.allScreens()
            if #screens >= 2 then
                win:moveToScreen(screens[2])
                win:moveToUnit({0, 0, 0.5, 1})
            end
        end
    end)

    -- 副屏右半: iTerm
    hs.timer.doAfter(1, function()
        local iterm = hs.application.launchOrFocus("iTerm2")
        if iterm then
            local win = iterm:mainWindow()
            local screens = hs.screen.allScreens()
            if #screens >= 2 then
                win:moveToScreen(screens[2])
                win:moveToUnit({0.5, 0, 0.5, 1})
            end
        end
    end)

    hs.alert.show("开发工作区已就绪")
end)
```

## 高级技巧

### 1. 网络环境自动化

**场景：** 公司网络和家里网络自动切换代理配置

```lua
-- WiFi 变化监听
wifiWatcher = nil
function ssidChangedCallback()
    local ssid = hs.wifi.currentNetwork()
    if ssid == "公司WiFi名称" then
        -- 启动代理
        hs.execute("networksetup -setwebproxy Wi-Fi 127.0.0.1 1081")
        hs.alert.show("已启用公司代理")
    else
        -- 关闭代理
        hs.execute("networksetup -setwebproxystate Wi-Fi off")
        hs.alert.show("已关闭代理")
    end
end

wifiWatcher = hs.wifi.watcher.new(ssidChangedCallback)
wifiWatcher:start()
```

### 2. 剪贴板历史管理

**场景：** 记录剪贴板历史，快速查找之前复制的内容

```lua
-- 剪贴板历史记录
clipboardHistory = {}
clipboardWatcher = nil

function clipboardChanged()
    local content = hs.pasteboard.getContents()
    if content then
        table.insert(clipboardHistory, 1, content)
        -- 保留最近 20 条
        if #clipboardHistory > 20 then
            table.remove(clipboardHistory)
        end
    end
end

clipboardWatcher = hs.pasteboard.watcher.new(clipboardChanged)
clipboardWatcher:start()

-- Cmd+Shift+V: 显示剪贴板历史
hs.hotkey.bind({"cmd", "shift"}, "V", function()
    local chooser = hs.chooser.new(function(choice)
        if choice then
            hs.pasteboard.setContents(choice.text)
            hs.eventtap.keyStroke({"cmd"}, "V")
        end
    end)

    local choices = {}
    for i, content in ipairs(clipboardHistory) do
        table.insert(choices, {
            text = content,
            subText = "剪贴板历史 " .. i
        })
    end

    chooser:choices(choices)
    chooser:show()
end)
```

### 3. 咖啡因模式（防止休眠）

**场景：** 看日志、跑测试时需要屏幕常亮

```lua
-- 咖啡因模式开关
caffeine = hs.caffeinate.new()
caffeineEnabled = false

hs.hotkey.bind({"cmd", "shift"}, "C", function()
    if caffeineEnabled then
        caffeine:stop()
        caffeineEnabled = false
        hs.alert.show("咖啡因模式: 关闭")
    else
        caffeine:start()
        caffeineEnabled = true
        hs.alert.show("咖啡因模式: 开启")
    end
end)
```

### 4. 定时提醒

**场景：** 番茄工作法，每 25 分钟休息提醒

```lua
-- 番茄计时器
pomodoroTimer = nil

function startPomodoro()
    hs.alert.show("番茄钟开始 - 25分钟专注时间")

    pomodoroTimer = hs.timer.doAfter(25 * 60, function()
        hs.alert.show("番茄钟结束 - 该休息了！", 5)
        hs.notify.new({
            title = "番茄钟",
            informativeText = "25分钟专注时间结束，休息5分钟吧！"
        }):send()
    end)
end

-- Cmd+Shift+P: 开始番茄钟
hs.hotkey.bind({"cmd", "shift"}, "P", function()
    if pomodoroTimer then
        pomodoroTimer:stop()
        pomodoroTimer = nil
        hs.alert.show("番茄钟已取消")
    else
        startPomodoro()
    end
end)
```

## 实战配置案例

### 开发者完整配置

```lua
-- ~/.hammerspoon/init.lua

-- ============= 基础设置 =============
hs.ipc.cliInstall()
hs.alert.show("Hammerspoon 配置已加载")

-- ============= 应用快速切换 =============
-- F7: 微信
hs.hotkey.bind({}, "F7", function()
    hs.application.launchOrFocus("WeChat")
end)

-- F8: 微信开发者工具
hs.hotkey.bind({}, "F8", function()
    hs.application.launchOrFocus("wechatwebdevtools")
end)

-- F9: Chrome
hs.hotkey.bind({}, "F9", function()
    hs.application.launchOrFocus("Google Chrome")
end)

-- F10: GoLand
hs.hotkey.bind({}, "F10", function()
    hs.application.launchOrFocus("GoLand")
end)

-- ============= 窗口管理 =============
-- 左半屏
hs.hotkey.bind({"cmd", "ctrl"}, "Left", function()
    local win = hs.window.focusedWindow()
    win:moveToUnit({0, 0, 0.5, 1})
end)

-- 右半屏
hs.hotkey.bind({"cmd", "ctrl"}, "Right", function()
    local win = hs.window.focusedWindow()
    win:moveToUnit({0.5, 0, 0.5, 1})
end)

-- 全屏
hs.hotkey.bind({"cmd", "ctrl"}, "F", function()
    local win = hs.window.focusedWindow()
    win:moveToUnit({0, 0, 1, 1})
end)

-- ============= 多显示器支持 =============
-- 移动到主屏
hs.hotkey.bind({"cmd", "ctrl"}, "1", function()
    local win = hs.window.focusedWindow()
    win:moveToScreen(hs.screen.primaryScreen())
end)

-- 移动到副屏
hs.hotkey.bind({"cmd", "ctrl"}, "2", function()
    local win = hs.window.focusedWindow()
    local screens = hs.screen.allScreens()
    if #screens >= 2 then
        win:moveToScreen(screens[2])
    end
end)

-- ============= 工作区布局 =============
-- 开发工作区
hs.hotkey.bind({"cmd", "shift"}, "W", function()
    -- 主屏: GoLand 全屏
    local goland = hs.application.launchOrFocus("GoLand")
    if goland then
        local win = goland:mainWindow()
        win:moveToScreen(hs.screen.primaryScreen())
        win:moveToUnit({0, 0, 1, 1})
    end

    -- 副屏: Chrome 左 + iTerm 右
    hs.timer.doAfter(0.5, function()
        local chrome = hs.application.launchOrFocus("Google Chrome")
        if chrome then
            local win = chrome:mainWindow()
            local screens = hs.screen.allScreens()
            if #screens >= 2 then
                win:moveToScreen(screens[2])
                win:moveToUnit({0, 0, 0.5, 1})
            end
        end
    end)

    hs.timer.doAfter(1, function()
        local iterm = hs.application.launchOrFocus("iTerm2")
        if iterm then
            local win = iterm:mainWindow()
            local screens = hs.screen.allScreens()
            if #screens >= 2 then
                win:moveToScreen(screens[2])
                win:moveToUnit({0.5, 0, 0.5, 1})
            end
        end
    end)

    hs.alert.show("开发工作区已就绪")
end)
```

## 实用技巧总结

### 快捷键设计原则

**1. F 键区域：** 应用快速切换
- F7-F11: 常用应用（微信、开发工具、浏览器、IDE）
- F12: 保留给 iTerm2 Hotkey Window

**2. Cmd+Ctrl：** 窗口管理
- 方向键: 窗口分屏（左/右/上/下）
- F: 全屏
- 数字键: 多显示器切换

**3. Cmd+Shift：** 高级功能
- W: 工作区布局
- C: 咖啡因模式
- P: 番茄钟

### 常见问题

#### Q1: 快捷键不生效？
**解决方法：**
1. 检查辅助功能权限：系统设置 → 隐私与安全性 → 辅助功能 → 勾选 Hammerspoon
2. 检查快捷键是否被系统占用：系统设置 → 键盘 → 键盘快捷键
3. 重新加载配置：点击菜单栏 Hammerspoon → Reload Config

#### Q2: 应用名称不对无法启动？
**解决方法：**
```bash
# 查看正在运行的应用名称
osascript -e 'tell application "System Events" to get name of every process'

# 查看 Applications 目录
ls /Applications/ | grep "关键词"
```

#### Q3: moveToUnit 坐标理解？
**坐标系统：**
- 左上角为 (0, 0)
- 右下角为 (1, 1)
- {x, y, width, height} 都是 0-1 之间的比例值

#### Q4: 如何调试 Lua 脚本？
**调试方法：**
```lua
-- 方法1: 使用 hs.alert 显示变量
hs.alert.show("变量值: " .. tostring(变量))

-- 方法2: 使用 print 输出到 Console
print("调试信息: " .. 变量)
-- 查看 Console: Hammerspoon 菜单 → Console

-- 方法3: 使用 hs.inspect 查看复杂对象
hs.alert.show(hs.inspect(对象))
```

## 对比其他工具

### Hammerspoon vs Raycast

| 特性 | Hammerspoon | Raycast |
|------|------------|---------|
| 价格 | 免费开源 | 免费 + Pro ($8/月) |
| 配置方式 | Lua 脚本 | 图形界面 |
| 学习曲线 | 陡峭（需要编程） | 平缓（开箱即用） |
| 灵活性 | 极高（完全控制） | 中等（预设功能） |
| 窗口管理 | ✅ 精确控制 | ✅ 基础功能 |
| 应用切换 | ✅ 自定义快捷键 | ✅ 搜索启动 |
| 剪贴板历史 | ✅ 需要自己写 | ✅ 内置 |
| 扩展生态 | Lua 脚本 | Extensions 商店 |

**选择建议：**
- **程序员/喜欢折腾** → Hammerspoon（完全掌控，无限可能）
- **追求效率/开箱即用** → Raycast（功能丰富，体验好）
- **可以共存** → Hammerspoon 管理窗口/快捷键，Raycast 做全局搜索

### Hammerspoon vs Keyboard Maestro

| 特性 | Hammerspoon | Keyboard Maestro |
|------|------------|------------------|
| 价格 | 免费 | $36 |
| 配置方式 | Lua 脚本 | 图形界面拖拽 |
| 复杂逻辑 | ✅ 编程实现 | ✅ 可视化流程 |
| 学习成本 | 高（需要编程） | 中（学习界面操作） |
| 社区资源 | GitHub/论坛 | 官方文档 + 社区 |

**选择建议：**
- **有编程基础** → Hammerspoon（免费 + 灵活）
- **非技术用户** → Keyboard Maestro（直观 + 强大）

## 技术原理

### 底层机制

**1. Accessibility API**
- Hammerspoon 基于 macOS Accessibility API
- 通过 API 监听键盘/鼠标事件
- 控制应用窗口位置、大小、焦点

**2. Lua 桥接**
- 核心用 Objective-C 编写
- 暴露 Lua API 供用户配置
- 运行时解释执行 Lua 脚本

**3. 执行流程**
```
按快捷键
→ Hammerspoon 拦截键盘事件 (Accessibility API)
→ 执行对应 Lua 函数
→ 调用 macOS API (NSWorkspace/NSApplication)
→ 控制应用/窗口
```

### 权限要求

**为什么需要辅助功能权限？**
- macOS 安全机制：控制其他应用必须获得授权
- Accessibility API 属于敏感权限
- 类似 iTerm2 Hotkey Window 也需要此权限

**授权位置：**
系统设置 → 隐私与安全性 → 辅助功能 → 勾选 Hammerspoon

## 总结

### 核心优势
- 🎯 **精确控制** - Lua 脚本实现任意复杂逻辑
- ⚡ **效率提升** - 一键完成重复操作
- 🆓 **完全免费** - 开源软件，无任何限制
- 🔧 **高度定制** - 根据个人工作流定制

### 适用人群
- ✅ 开发者（有编程基础）
- ✅ 效率控（追求极致效率）
- ✅ 双屏/多屏用户（窗口管理需求强）
- ✅ 喜欢折腾的 Mac 用户

### 学习建议
1. **从简单开始** - 先配置应用快速切换，体验效果
2. **逐步深入** - 再学习窗口管理、多显示器支持
3. **参考文档** - [官方文档](https://www.hammerspoon.org/docs/)
4. **社区资源** - GitHub 搜索 "hammerspoon config" 查看他人配置

### 最佳实践
- **配置文件版本控制** - 将 `~/.hammerspoon/` 加入 Git 管理
- **模块化组织** - 复杂配置拆分为多个 `.lua` 文件
- **注释清晰** - 为每个功能添加注释，方便后续维护
- **定期备份** - 定期备份配置文件，避免丢失

---
*记录时间: 2025-10-03*
*适用版本: Hammerspoon 1.0.0+*
*系统平台: macOS*
