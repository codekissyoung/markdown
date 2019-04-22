# GCC 编译器

本文是`GNU gcc`编译器的笔记。

## 术语

- **编译**：把高级语言书写的代码转换为机器可识别的机器指令。编译只检查高级语言的语法、函数、声明等是否正确。

- **可重定位目标文件**: 编译成的机器指令和数据存放的文件`.o`

- **链接**：将多个`.o`文件链接成可被操作系统执行的程序。`.o`往往引用了其他`xx.o`中的符号，所以不能单独直接执行。需要将这些引用所在的`.o`文件链接进来，这种操作称为重定向。链接器不检查函数所在源文件，只检查`.o`文件中定义的符号。将`.o`文件中使用的函数和其他`.o`或库文件中的相关符号合并，最后生成一个可执行的程序。

- **静态库**: `.a`文件,又称为文档文件`Archive file`。是多个`.o`文件的集合。静态库中的各个`.o`文件没有特殊的存在格式，仅仅是一个`.o`文件的集合。使用`ar`工具维护和管理静态库。

- **共享目标文件**: `*.so`文件，也是多个`.o`文件的集合。但是这些`.o`文件由编译器按照一种特殊的方式生成。对象(变量引用和函数调用)模块的各个成员的地址都是相对地址。因此在程序运行时，可动态加载库文件和执行`.so`文件。多个程序可以共享使用库中的某一个模块。

- **可执行目标文件**: 已经将所有引用到的符号的所在文件链接起来，每一个符号都已经得到了解析和重定位，每个符号都是已知的，所以可以被机器直接执行

## gcc 概述

### 文件名后缀

源文件后缀名 标识 源文件的语言,但是对编译器来说,后缀名控制着缺省设定:

- `gcc` 认为预处理后文件`.i` 是 `C` 文件,并且设定 `C` 形式的连接
- `g++` 认为 `.i` 是 `C++` 文件,并且设定 `C++`形式的连接
- `.c` : `C`源程序;预处理,编译,汇编 
- `.C` : `.cc` `.cxx`: `C++`源程序;预处理,编译,汇编
- `.m` : `Objective-C` 源程序;预处理,编译,汇编 
- `.i` : 预处理后的`C`文件;编译,汇编
- `.ii`: 预处理后的`C++`文件;编译,汇编
- `.s` : 汇编语言源程序;汇编
- `.S` : 汇编语言源程序;预处理,汇编
- `.h` : 预处理器文件; 通常不出现在命令行上
- `.o` 目标文件`Object file`与`.a` 归档库文件`Archive file`还有`.so`文件传递给连接器`ld`,在链接阶段中,所有对应于源程序的`.o`文件, `-l`库文件按命令行中的顺序传递给连接器

### 头文件作用

- 头文件可以不需要编译
- 可以查看具体的声明
- 头文件加上实现文件的o文件提交给使用者即可 ，不需要知道源代码
- `.o`文件预先编译，所以整个项目编译时，会大大提高编译的时间 
- 当一个文件`A.c`依赖于头文件`b.h`时 ，如果`b.c`编译之后形成的`b.o`文件重新编译后，`a.o`文件不需要重新编译 
- 可以极大降低手工复制，粘贴的错误几率

## 编译链接命令

### 编译成 .o 文件

```bash
gcc -E xxx.c -o xxx.i   # 生成预编译文件
gcc -S xxx.c -o xxx.s   # 生成 汇编源文件，也就是汇编代码
gcc -c xxx.c -o xxx.o   # 生成 .o 文件
```

### 打包 .o 成 .a 静态库

```bash
ar rcsU zzz.a xxx.o yyy.o
```

### 编译成 .so 动态库

```bash
gcc -shared -fPIC xxx.c -o xxx.so
```

## gcc 参数

选项必须分立给出: `-dr` 完全不同于 `-d -r`。

### 通用

- `-E` 预处理后即停止,不进行编译.预处理后的代码送往标准输出.GCC 忽略任何不需要预处理的输入文件.

- `-S` 编译后即停止,不进行汇编.对于每个输入的非汇编语言文件,输出文件是汇编语言文件.

- `-masm = [ intel | att ]` 选择`intel`或`AT&T`的汇编语法,默认输出的汇编是`AT&T`格式

- `-c` 编译或汇编源文件,但是不作连接.编译器输出对应于源文件的目标文件,缺省情况下, GCC 通过用`.o'替换源文件名后缀`.c', `.i', `.s',等等,产生目标文件名.可以使用`-o`选项选择其他名字,GCC 忽略-c 选项后面任何无法识别的输入文件

- `-pipe` 在编译过程的不同阶段间使用管道而非临时文件进行通信.这个选项在某些系统上无法 工作,因为那些系统的 汇编器不能从管道读取数据. GNU 的汇编器没有这个问题

- `-std=gnu11` 使用 `gnu11` 标准来编译

- `-pedantic` 选项能够帮助程序员发现一些不符合 `ANSI/ISO C标准` 的代码

- `-Wall` 开启所有警告错误提醒

- `-Werror` 它要求 gcc 将所有的警告当成错误进行处理, gcc 会在所有产生警告的地方停止编译

- `-Wcast-align` 当源程序中地址不需要对齐的指针指向一个地址需要对齐的变量地址时，则产生一个警告例如`char *`指向一个`int *`地址，而通常在机器中`int`是需要地址能被2或4整除的对齐地址

- `-O2` 启用编译优化,一般上生产环境的代码要使用,为了得到更小的体积，更快的代码执行速度

- `-v` 输出编译详细过程

- `-Q` 显示编译过程的统计数据和每一个函数名

- `-fpack-struct=4` 强制按照`4Byte`对齐内存,`-fpack-struct=2` 强制按照`2Byte`对齐内存,`-fpack-struct`不用对齐内存'

- `-save-temps` 保存编译过程中生成的一些列中间文件,比如 `.i` 和 `.s` 文件

### 调试相关

- `-g` 开启`gdb`调试,默认`级别2`,此时产生的调试信息包括：扩展的符号表、行号、局部或外部变量信息

- `-g3`包含`级别2`中的所有调试信息以及源代码中定义的宏

- `-p` 产生额外代码,用于输出 profile 信息,供分析程序 prof 使用

- `-pg` 产生额外代码,用于输出 profile 信息,供分析程序 gprof 使用

- `-DMACRO` 以字符串 `1` 定义 `MACRO`宏; `-DMACRO=DEFN`,以字符串`DEFN`定义 `MACRO` 宏.与源代码中`#define`指令定义的宏效果一样

- `-UMACRO` 取消对 `MACRO` 宏的定义

### 路径链接相关

- `-I./include` 在`.h`的搜索路径列表中添加 `./include`目录, 顺序: `./include`、`/usr/include` 、`/usr/local/include`

- `-lword` : 链接库文件，库文件的真实名字为：`libword.so` 或 `libword.a`,一般说来用这个方法找到的文件是库文件`.a`或`.so`。连接器方法是:扫描归档文件,寻找某些成员,这些成员的符号目前已被引用,不过还没有被定义.但是,如果连接器找到普通的目标文件,而不是库文件,就把这个目标文件按平常方式连接进来.指定 `-l` 选项和指定文件名的唯一区别是: `-l` 选项用 `lib` 和 `.a` 把 `word` 包裹起来,而且搜索一些目录( `-L`可以指定哪些目录)

- `-L./lib` 在`-l`选项的搜索路径列表中添加`./lib`目录，顺序: `./lib`、`/lib`、`/usr/lib`、`/usr/local/lib`

- `-static` 使用该选项，之后的`-l`全部强制使用`.a`

- `-rdynamic` 用来通知链接器将所有符号添加到动态符号表中,目的是能够通过使用 `dlopen` 来实现向后跟踪

- `-pthread` 与 `-lpthread` : 手册里则指出应该在编译和链接时都增加 `-pthread` 选项,编译选项中指定`-pthread` 会附加一个宏定义 `-D_REENTRANT`，该宏会导致`libc`头文件选择那些`thread-safe`的实现；链接选项中指定`-pthread` 则同`-lpthread`一样，只表示链接`POSIX thread` 库。由于`libc`用于适应`thread-safe`的宏定义可能变化，因此在编译和链接时都使用`-pthread`选项而不是传统的`-lpthread` 能够保持向后兼容，并提高命令行的一致性。

- `-fpic` 如果支持这种目标机,编译器就生成位置无关目标码.适用于共享库`shared library`

- `-fPIC` 如果支持这种目标机,编译器就输出位置无关目标码.适用于动态连接`dynamic linking`,即使分支需要大范围转移.

- 预处理器选项 ：`-Aassertion -C -dD -dM -dN -Dmacro[=defn] -E -H -idirafter dir -include file -imacros file -iprefix file -iwithprefix dir -M -MD -MM -MMD -nostdinc -P -Umacro -DMACRO`

- 汇编器选项: `-Wa,option`

- 连接器选项: `-llibrary -nostartfiles -nostdlib -static -shared -symbolic -Xlinker option -Wl,option -u symbol`

- 调试选项 `-a -dletters -fpretend-float -g -glevel -gcoff -gxcoff -gxcoff+ -gdwarf -gdwarf+ -gstabs -gstabs+ -ggdb -p -pg -save-temps -print-file-name=library -print-libgcc-file-name -print-prog-name=program`


## GCC环境变量

### gcc在编译时用到的环境变量

```bash
# 如果有多个目录，可以使用逗号隔开

# gcc和g++编译程序的搜索目录
export COMPILER_PATH=/usr/local/bin

# gcc 会读取该环境变量，然后在该目录中搜寻.h文件
export C_INCLUDE_PATH=/home/cky/hello/include

# 类似C_INCLUDE_PATH，适用于g++
export CPLUS_INCLUDE_PATH=/home/cky/hello/include

# gcc和g++在编译的链接(link)阶段查找库文件的目录列表，相当于在命令里使用-Ldir
export LIBRARY_PATH=/home/cky/hello/lib
```

使用`ldd ./可执行程序名`将看到可执行程序在执行时连接动态库的过程。

### 程序运行时用到的环境变量

```bash
# 程序运行时查找动态链接库(.so文件)的目录列表
export LD_LIBRARY_PATH=/home/cky/hello/lib

# 在LD_PRELOAD(参考man ld.so的LD_PRELOAD部分)中定义的动态链接库会在其他动态链接库之前被加载
# 因此会覆盖其他链接库里定义的同名符号（函数变量等）
export LD_PRELOAD=/usr/lib/libtsocks.so
```

### Debian动态链接库搜索路径

Debian中如果修改`LD_LIBRARY_PATH`没有用，可修改`/etc/ld.so.conf`或`/etc/ld.so.conf.d/*.conf`，将库目录作为一行加入以上的`conf`文件中，然后运行`ldconfig`命令即可。

```bash
$ vi /etc/ld.so.conf.d/my.conf # 添加下面两句

/usr/local/lib
/path/to/your/shared/lib/directory

$ ldconfig
```

## 库链接时搜索路径的顺序

### 静态库

1. `ld`会先搜索`GCC`命令中`-L`指定的目录
1. 再搜索gcc的环境变量`LIBRARY_PATH`
1. 再搜索目录 `/lib` `/usr/lib` `/usr/local/lib`

#### 动态库

1. 编译目标代码时 `-L` 指定的目录
1. 环境变量 `LD_LIBRARY_PATH` 指定的动态库搜索路径
1. 配置文件 `/etc/ld.so.conf` 中指定的动态库搜索路径
1. 默认的动态库搜索路径`/lib`
1. 默认的动态库搜索路径`/usr/lib`

### 同时使用动态库和静态库

场景：写一个`Nginx`模块，使用`MySQL`的C客户端接口库`libmysqlclient`，当然`mysqlclient`还引用了其他的库，比如`libm`, `libz`, `libcrypto`等等。对于使用`mysqlclient`的代码来说，需要关心的只是`mysqlclient`引用到的动态库。大部分情况下，不是每台机器都安装有`libmysqlclient`，所以我想把这个库静态链接到`Nginx`模块中，但又不想把`mysqlclient`引用的其他库也静态的链接进来。

简单地使用`-static`显得有些暴力，因为他会把命令行中`-static`后面的所有`-l`指明的库都静态链接，更主要的是，有些库可能并没有提供静态库`.a`，而只提供了动态库`.so`。这样的话，使用`-static`就会造成链接错误。

`-Wl,option` 将选项 option 传递给链接器。`-Wl,-Bstatic`告诉链接器，对接下来的`-l`选项使用静态链接。`-Wl,-Bdynamic` 告诉链接器对接下来的`-l`选项使用动态链接

```bash
# 修改前
CORE_LIBS="$CORE_LIBS -L/usr/lib64/mysql -lmysqlclient -lz -lcrypt -lnsl -lm -L/usr/lib64 -lssl"

# 修改后
CORE_LIBS="$CORE_LIBS -L/usr/lib64/mysql -Wl,-Bstatic -lmysqlclient \
-Wl,-Bdynamic -lz -lcrypt -lnsl -lm -L/usr/lib64 -lssl"
```

### 头文件的搜索路径顺序

1. 从`-Idir`开始
1. 然后找gcc的环境变量`C_INCLUDE_PATH` `CPLUS_INCLUDE_PATH` `OBJC_INCLUDE_PATH`
1. 再找默认目录

```bash
/usr/include
/usr/local/include
/usr/lib/gcc-lib/i386-linux/2.95.2/include
/usr/lib/gcc-lib/i386-linux/2.95.2/../../../../include/g++-3
/usr/lib/gcc-lib/i386-linux/2.95.2/../../../../i386-linux/include
```

1. 如果装有gcc,并且有给定的`prefix`的话，则是找：

```c
/usr/include
prefix/include
prefix/xxx-xxx-xxx-gnulibc/include
prefix/lib/gcc-lib/xxxx-xxx-xxx-gnulibc/2.8.1/include
```

### 利用Linux系统上已有的开发库

- 查看库文件提供了哪些调用，可以用`nm`命令自己查看库文件提供了哪些调用
- 通过头文件查看函数的定义

## 动态链接库

- [LINUX下动态链接库的使用-dlopen dlsym dlclose dlerror](http://blog.csdn.net/jernymy/article/details/6903683)
- [gcc/g++ 链接库的编译与链接](http://blog.csdn.net/surgewong/article/details/39236707)
- [crontab读取环境变量方法](https://www.cnblogs.com/simplelogic/p/3287911.html)
