# Vistual Studio Code 编辑器使用

## SFTP 插件

- 作者: `liximomo`
- `Cmd + shift + P` 调出控制台, 执行 `SFTP:config`命令，生成参考配置文件
- `.vscode/sftp.json` 配置参考

```json
{
    "protocol": "sftp",
    "host": "101.200.144.41",
    "username": "username",
    "password": "password",
    "uploadOnSave": true,
    "remotePath": "/home/cky/workspace/blog/md"
}
```