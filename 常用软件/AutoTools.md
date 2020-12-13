# AutoTools

本文记录了GNU编译工具`autoscan`、`automake`等工具的使用。

## 1. 准备 configure.ac 文件

使用 `autoscan` 命令生成参考文件 `configure.scan`，然后将 `configure.scan` 改为 `configure.ac` 如下

```bash
AC_PREREQ([2.69])                            # autoconf版本
AC_INIT(daemon, 1.0, 1162097842@qq.com)      # 需修改，定义软件的名称、版本等信息、作者的E-mail等
AM_INIT_AUTOMAKE                             # 主动添加
AC_CONFIG_SRCDIR([server.c])                 # 用来侦测所指定的源码文件是否存在
AC_CONFIG_HEADERS([config.h])                # 宏用于生成config.h文件，以便autoheader命令使用
AC_PROG_CC                                   # 指定编译器，默认gcc
AC_CHECK_HEADERS([arpa/inet.h netinet/in.h stdlib.h string.h sys/param.h sys/socket.h unistd.h])
AC_TYPE_PID_T
AC_FUNC_FORK
AC_CHECK_FUNCS([memset socket])
AC_CONFIG_FILES([Makefile])                   # 用于生成相应的Makefile文件
AC_OUTPUT
```

## 2. 准备 Makefile.am 文件

```Makefile
AUTOMAKE_OPTIONS=foreign
bin_PROGRAMS=daemon
daemon_SOURCES=server.c
```

## 3. 执行构建过程

```bash
aclocal && autoconf && autoheader && libtoolize --automake --copy --debug --force && automake --add-missing
```

## 4. 生产 Makefile

```bash
configure --prefix=/home/cky        # 实际会安装到 /home/cky/bin 目录
```

## 5. 编译

```bash
make
```

安装到 prefix 指定的目录：

```bash
make install
```

清理已经编译成功的文件：

```bash
make clean
```

卸载已经安装到指定目录的文件：

```bash
make uninstall
```
