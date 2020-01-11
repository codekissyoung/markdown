# Vistual Studio Code 编辑器使用

`Vistual Studio Code`编辑器常用设置和插件。

## 常用设置

```json
{
    "editor.fontFamily": "ubuntu mono",
    "markdown.preview.fontFamily": "'Ubuntu mono', 'Droid Sans', sans-serif",
    "editor.detectIndentation": false,
    "window.titleBarStyle":"custom", // 去掉难看的系统标题栏
    "editor.fontSize": 16,  // 编辑器字体大小
    "window.zoomLevel": 1   // 系统界面缩放
}
```

## SFTP 插件

![](https://img.codekissyoung.com/2019/12/16/209499a3b68058c5b5a5d6212902c222.png)

`Cmd + shift + P` 调出控制台, 执行 `SFTP:config`命令，生成参考配置文件`.vscode/sftp.json`。

```json
{
    "name":"markdown博客",
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

## phpfmt

![](https://img.codekissyoung.com/2019/12/16/922451411336c89dd712aa550aeb5561.png)

安装好后，可以考虑将 `editor.formatOnSave` 设置为`true`。


