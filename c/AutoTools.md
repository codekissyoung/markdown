# AutoTools

## 准备 configure.ac 文件

1. 使用 `autoscan` 命令生成参考文件 `configure.scan` 如下
    ```autoscan
    #                                               -*- Autoconf -*-
    # Process this file with autoconf to produce a configure script.

    AC_PREREQ([2.69])
    AC_INIT([FULL-PACKAGE-NAME], [VERSION], [BUG-REPORT-ADDRESS])
    AC_CONFIG_SRCDIR([server.c])
    AC_CONFIG_HEADERS([config.h])

    # Checks for programs.
    AC_PROG_CC

    # Checks for libraries.

    # Checks for header files.
    AC_CHECK_HEADERS([arpa/inet.h netinet/in.h stdlib.h string.h sys/param.h sys/socket.h unistd.h])

    # Checks for typedefs, structures, and compiler characteristics.
    AC_TYPE_PID_T

    # Checks for library functions.
    AC_FUNC_FORK
    AC_CHECK_FUNCS([memset socket])

    AC_CONFIG_FILES([Makefile])
    AC_OUTPUT
    ```
1. 将 `configure.scan` 改为 `configure.ac` 如下
    ```autoscan
    AC_PREREQ([2.69])
    AC_INIT(daemon, 1.0, 1162097842@qq.com)
    AM_INIT_AUTOMAKE(daemon,1.0)
    AC_CONFIG_SRCDIR([server.c])
    AC_CONFIG_HEADERS([config.h])

    # Checks for programs.
    AC_PROG_CC

    # Checks for libraries.

    # Checks for header files.
    AC_CHECK_HEADERS([arpa/inet.h netinet/in.h stdlib.h string.h sys/param.h sys/socket.h unistd.h])

    # Checks for typedefs, structures, and compiler characteristics.
    AC_TYPE_PID_T

    # Checks for library functions.
    AC_FUNC_FORK
    AC_CHECK_FUNCS([memset socket])

    AC_CONFIG_FILES([Makefile])
    AC_OUTPUT
    ```

- 需要更改的点:`AC_INIT` `AM_INIT_AUTOMAKE` 和`AC_CONFIG_FILES`

```
（1）以“#”号开始的行均为注释行。
（2）AC_PREREQ 宏声明本文要求的autoconf版本, 如本例中的版本 2.59。
（3）AC_INIT 宏用来定义软件的名称、版本等信息、作者的E-mail等。
（4）AM_INIT_AUTOMAKE是通过手动添加的, 它是automake所必备的宏, FULL-PACKAGE-NAME是软件名称,VERSION是软件版本号。
（5）AC_CONFIG_SCRDIR 宏用来侦测所指定的源码文件是否存在, 来确定源码目录的有效性.。此处为当前目录下main.c。
（6）AC_CONFIG_HEADER 宏用于生成config.h文件，以便autoheader命令使用。
（7）AC_PROG_CC用来指定编译器，如果不指定，默认gcc。
（8）AC_OUTPUT 用来设定 configure 所要产生的文件，如果是makefile，configure 会把它检查出来的结果带入makefile.in文件产生合适的makefile。使用Automake时，还需要一些其他的参数，这些额外的宏用aclocal工具产生。
（9）AC_CONFIG_FILES宏用于生成相应的Makefile文件。
```

## 准备 Makefile.am 文件

```Makefile
AUTOMAKE_OPTIONS=foreign
bin_PROGRAMS=daemon
daemon_SOURCES=server.c
```

## 执行构建过程

```bash
➜  daemon git:(master) ✗ aclocal && autoconf && autoheader && libtoolize --automake --copy --debug --force && automake --add-missing
configure.ac:3: warning: AM_INIT_AUTOMAKE: two- and three-arguments forms are deprecated.  For more info, see:
configure.ac:3: http://www.gnu.org/software/automake/manual/automake.html#Modernize-AM_005fINIT_005fAUTOMAKE-invocation
configure.ac:8: installing './compile'
configure.ac:3: installing './install-sh'
configure.ac:3: installing './missing'
Makefile.am: installing './depcomp'
```

## 生产 Makefile

```bash
➜  daemon git:(master) ✗ configure --prefix=/home/cky/bin
```

## 编译

```bash
➜  daemon git:(master) make
make  all-am
make[1]: Entering directory '/home/cky/workspace/C/daemon'
gcc -DHAVE_CONFIG_H -I.     -g -O2 -MT server.o -MD -MP -MF .deps/server.Tpo -c -o server.o server.c
mv -f .deps/server.Tpo .deps/server.Po
gcc  -g -O2   -o daemon server.o  
make[1]: Leaving directory '/home/cky/workspace/C/daemon'
```

## 安装到 prefix 指定的目录

```bash
➜  daemon git:(master) make install
make[1]: Entering directory '/home/cky/workspace/C/daemon'
 /bin/mkdir -p '/home/cky/bin'
  /usr/bin/install -c daemon '/home/cky/bin'
make[1]: Nothing to be done for 'install-data-am'.
make[1]: Leaving directory '/home/cky/workspace/C/daemon'
```

## 清理已经编译成功的文件

```bash
➜  daemon git:(master) make clean
test -z "daemon" || rm -f daemon
rm -f *.o
```

## 卸载已经安装到指定目录的文件

```bash
➜  daemon git:(master) make uninstall
 ( cd '/home/cky/bin' && rm -f daemon )
```
