# JetBrains IDE 配置

本文包括`CLion` `PHPStorm` `Goland`等`IDE`的配置。

## 重新获取 30 天试用

```bash
$ rm -rf .GoLand2019.1/config/eval
$ rm -rf .java/.userPrefs/jetbrains/goland
```

如果是在`Windows`下

```bash
删除目录：C:\Users\<用户>\.WebStorm2019.1\config\eval
删除文件：C:\Users\<用户>\.WebStorm2019.1\config\options\other.xml
删除注册表项：HKEY_CURRENT_USER\Software\JavaSoft\Prefs\jetbrains\webstorm
```

## 普通设置

#### 关闭单词拼写检查

如图所示，找到`Typo`，将勾选项取消掉

![](https://img.codekissyoung.com/2019/05/14/d898fd27116eb2020475e0a9b4e8dd5b.png)

#### 设置界面字体

界面一定要设置支持中文的字体，不然会界面在显示中文时，会使用方框代替

![](https://img.codekissyoung.com/2019/05/14/d7c11a4a914f991418be75cb2fb55c48.png)

```bash
fc-list :lang=zh-cn             # ubuntu上查看支持中文的字体有哪些
```

## DeployMent

`tools->deployment->configuration`

![](https://img.codekissyoung.com/2020/03/19/fdf0beff94af9453431460f394e7737d.png)
![](https://img.codekissyoung.com/2020/03/19/94852ab0ad451dbee8cbb6e8175493bb.png)
![](https://img.codekissyoung.com/2020/03/19/c787b8ee162c31e93928be98d8760c9c.png)

## Goland

```bash
cky@cky-pc:~/go/src$ tree -L 2
.
├── hello
│   ├── main.go
```

![](https://img.codekissyoung.com/2020/02/06/3b9204f67a0e36aaac6ec36f4b494e7d.png)

添加自动引入包 `goimports` 和 格式化代码 `go fmt` 工具

![](https://img.codekissyoung.com/2020/02/06/ea4011e0ab5e25cfc8302aa6ccb4c191.png)

## 快捷健

`Ctrl + Alt + shift + l`选中的代码块格式化，如果没有选中代码，则默认是全局。
