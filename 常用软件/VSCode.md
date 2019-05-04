# Vistual Studio Code 编辑器使用

`Vistual Studio Code`编辑器常用设置和插件。

## 常用设置

```json
{
    "editor.fontFamily": "ubuntu mono",
    "markdown.preview.fontFamily": "'Ubuntu mono', 'Droid Sans', sans-serif",
    "editor.detectIndentation": false,
    "editor.fontSize": 16,  // 调整编辑器字体大小
    "window.zoomLevel": 1   // 调整系统界面大小
}
```

## SFTP 插件

- 作者: `liximomo`
- `Cmd + shift + P` 调出控制台, 执行 `SFTP:config`命令，生成参考配置文件
- `.vscode/sftp.json` 配置参考

```json
{
    "protocol": "sftp",
    "host": "101.200.144.41",
    "username": "cky",
    "port": 22,
    "interactiveAuth": true,
    "remotePath": "/home/cky/workspace/markdown",
    "uploadOnSave": true,
    "privateKeyPath": "/Users/iqingyi/.ssh/id_rsa",
    "watcher": {
        "files": "**/*",
        "autoUpload": true,
        "autoDelete": true
    },
    "ignore": [
        ".vscode",
        ".git",
        ".DS_Store"
    ]
}
```

## Better Align 对齐插件