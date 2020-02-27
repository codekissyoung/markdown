# SVN 忽略设置

## 忽略某文件夹下所有文件

```bash
$ svn mkdir spool
$ svn propset svn:ignore '*' spool
$ svn ci -m 'Adding "spool" and ignoring its contents.'
```

## 忽略某文件夹

```bash
$ mkdir spool
$ svn propset svn:ignore 'spool' .
$ svn ci -m 'Ignoring a directory called spool.'
```

## 忽略已经加入版本的文件夹，保持文件夹的内容

```bash
$ svn export spool spool-tmp # 先备份文件夹里内容
$ svn rm spool # 从版本剔除该文件夹
$ svn ci -m 'Removing inadvertently added directory spool'
$ mv spool-tmp spool # 恢复该文件夹 及内容
$ svn propset svn:ignore 'spool' . # 再设置忽略该文件夹
$ svn ci -m 'Ignoring a directory called "spool".'
```

## 直接写忽略文件

```bash
svn propedit svn:ignore 目录名称 # 确保 目录名称 是SVN版本控制的目录
```

- 其实`svn propset` 命令的原理也是将忽略文件写入目录  结构  里
- 设置 SVN 默认的编辑器 `export SVN_EDITOR=vim`
- 前提是/product 目录必须在 svn 版本控制下，而 test.php 文件不在 svn 版本控制
- 如果是忽略该目录下所有文件，写 `*`，支持  通配符

## 想忽略/product 目录下的 test.php 文件。

```bash
$ svn st
?     /product/test.php
$ svn propedit svn:ignore /product
# 出现编辑窗口，写入
test.php
# 保存退出
# 这时候会有一个提示：属性 svn:ignore 于 product 被设为新值
$ svn st
M        product
$ svn ci -m '忽略test.php文件' # 最后要提交 这个属性才会起作用
```
