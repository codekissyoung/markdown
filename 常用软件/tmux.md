# Tmux

## 安装

- `sudo apt-get install tmux`

## 基础使用

- `tmux attach-session -t session_name` 选择 tmux
- `tmux new-session -s session-name` 新建 tmux
- `tmux kill-session -t session-name` 删除 tmux
- `tmux ls` 显示已有 tmux 会话

## 横向和纵向分割窗口

- `Ctrl b %` 纵向分割
- `Ctrl b "` 横向分割
- `Ctrl b 方向健` 进入该窗口
- `exit` 命令直接关掉该窗口

## 返回主 shell

- `Ctrl b d`

## 功能

1. 窗格可以自由移动和调整大小，或直接利用四个预设布局之一。
1. 可在多个缓冲区进行复制和粘贴。
1. 可通过交互式菜单来选择窗口、会话及客户端。
1. 支持跨窗口搜索。
1. 支持自动及手动锁定窗口

## 资源

- [Tmux 使用初体验](http://blog.chinaunix.net/uid-26285146-id-3252286.html)
- [如何使用 Tmux 提高终端环境下的效率](http://os.51cto.com/art/201410/453671.htm)
