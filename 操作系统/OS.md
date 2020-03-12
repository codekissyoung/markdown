# 动手写一个操作系统

[计算机是如何启动的？](http://www.ruanyifeng.com/blog/2013/02/booting.html)
[使用 QEMU 搭建 U-boot+Linux](https://space.bilibili.com/382223675/channel/detail?cid=92964)

## 前置要求

```bash
$ sudo apt-get install qemu
$ sudo apt-get install u-boot-tools u-boot-menu
$ sudo apt-get install gcc-arm-linux-gnueabi  # 嵌入式交叉编译工具
```

```bash
$ qemu-system-i386 --version # 查看版本
$ qemu-system-i386 -M help   # 查看支持的开发板 CPU 架构
```
