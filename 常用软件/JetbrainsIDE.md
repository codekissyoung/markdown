# JetBrains IDE 配置

本文包括`CLion` `PHPStorm` `Goland`等`IDE`的配置。

## 重新获取 30 天试用

```bash
$ rm ~/.config/JetBrains/GoLand2020.1
$ rm  ~/.java/.userPrefs/jetbrains/goland
```

## 快捷健

```bash
Ctrl Alt  s # 调出 Settings 界面
Ctrl Alt  l # 对齐选中代码
Ctrl Alt  shift  l # 选中的代码块格式化，如果没有选中代码，则默认是全局
Ctrl [+|-] # 可以将当前（光标所在位置）的方法进行展开或折叠
Shift F6 # 重命名文件夹、文件、方法、变量名等
Ctrl R # 替换文本
Ctrl Shift F # 全局查找
F2 # 快速定位错误或警告的行
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

## Goland

添加自动引入包 `goimports` 和 格式化代码 `go fmt` 工具

```bash
$ go get golang.org/x/tools/cmd/goimports    # go fmt 是自带 goimports 则需要安装
```

![](https://img.codekissyoung.com/2020/02/06/ea4011e0ab5e25cfc8302aa6ccb4c191.png)



