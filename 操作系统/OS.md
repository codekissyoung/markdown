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

## Bochs

下载最新的`Bochs`源代码包，安装参考如下：

```bash
$ sudo apt-get install build-essential
$ sudo apt-get install g++
$ sudo apt-get install xorg-dev
$ sudo aptitude install libgtk2.0-dev
$ ./configure --enable-debugger --enable-disasm
$ make
$ sudo make install
$ bochs -h
$ whereis bochs
$ whereis bximage
```

通过`bximage`交互式制作一个启动软盘：

```bash
$ bximage
========================================================================
                                bximage
  Disk Image Creation / Conversion / Resize and Commit Tool for Bochs
         $Id: bximage.cc 13481 2018-03-30 21:04:04Z vruppert $
========================================================================

1. Create new floppy or hard disk image
2. Convert hard disk image to other format (mode)
3. Resize hard disk image
4. Commit 'undoable' redolog to base image
5. Disk image info

0. Quit

Please choose one [0] 1

Create image

Do you want to create a floppy disk image or a hard disk image?
Please type hd or fd. [hd] fd

Choose the size of floppy disk image to create.
Please type 160k, 180k, 320k, 360k, 720k, 1.2M, 1.44M, 1.68M, 1.72M, or 2.88M.
 [1.44M]

What should be the name of the image?
[a.img] linkOS.img

Creating floppy image 'linkOS.img' with 2880 sectors

The following line should appear in your bochsrc:
  floppya: image="linkOS.img", status=inserted
```
