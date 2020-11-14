# BeyondCompare 的使用

## 下载

- [下载链接](https://www.scootersoftware.com/download.php)

## Mac下永久试用

1. 在`/Applications/Beyond Compare.app/Contents/MacOS`下找到`BCompare`可执行文件，重新命名为`BCompare.real`
1. 在同目录下建立脚本`BCompare`,内容如下,赋予执行权限`chmod a+x BCompare`
1. 尝试从图标打开 BeyondCompare,如果无付费提示就是正常

```bash
#!/bin/bash
# 删除注册数据文件，用以绕过注册
rm "/Users/$(whoami)/Library/Application Support/Beyond Compare/registry.dat"
"`dirname "$0"`"/BCompare.real $@ # 使用脚本启动真正的BCompare执行文件
```

## Linux下永久试用

```bash
/bin/rm -rf /home/link/.config/bcompare/registry.dat
```