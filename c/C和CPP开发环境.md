# C和CPP开发环境

## C版本

![42684152.png](https://i.loli.net/2018/11/08/5be3b953d5f5a.png)

## 检查C的开发环境

```bash
uname -a                # 检测 linux 内核版本
lsb_release -a          # 查看发行版本
gcc -v                  # 检查 gcc 版本
gdb -v                  # 检查 gdb 版本
make -v                 # 检查 make 版本
autoconf --version      # 检查 autoconf 版本
automake --version      # 检查 automake 版本
libtoolize --version    # 检查 libtool 版本
```

## 安装开发环境

```bash
sudo apt-get install gcc gdb make autoconf automake libtool build-essential
```

## gcc

- **可重定位目标文件** `*.o` 编译成的机器指令和数据，因为它往往引用了其他 `xx.o` 中的符号，所以不能单独直接执行，需要将这些引用所在的文件链接进来，这种操作称为重定向

- **共享目标文件** `*.so` 特殊的 `*.o` 文件，程序运行时候才动态加载到内存中运行

- **可执行目标文件** 已经将所有引用到的符号的所在文件链接起来，每一个符号都已经得到了解析和重定位，每个符号都是已知的，所以可以被机器直接执行

- `-I/home/hello/include`添加`.h`文件的搜寻目录,顺序: `/home/hello/include` > `/usr/include` > `/usr/local/include`

- `-L/home/hello/lib`添加`.so`文件的搜寻目录, 顺序: `/home/hello/lib` > `/lib` > `/usr/lib` > `/usr/local/lib`

- `-lword` 表示链接`libword.so`,`lib`和`.so`可以省去

- `-static` 表示强制使用静态链接库，也就是`libword.a`，gcc 在链接时优先使用动态链接库，只有当动态链接库不存在时才考虑使用静态链接库

- `-g` 开启gdb调试,默认的级别是2,此时产生的调试信息包括：扩展的符号表、行号、局部或外部变量信息, `-g3`包含级别2中的所有调试信息以及源代码中定义的宏

- `-p` `-pg` 会将剖析（Profiling）信息加入到最终生成的二进制代码中剖析信息对于找出程序的性能瓶颈很有帮助，是协助Linux程序员开发出高性能程序的有力工具

- `-save-temps` 保存编译过程中生成的一些列中间文件,比如 .i 和 .s 文件

- `-Wall` 开启所有警告错误提醒, `-Werror` 它要求 gcc 将所有的警告当成错误进行处理, gcc 会在所有产生警告的地方停止编译

- `-Wcast-align` 当源程序中地址不需要对齐的指针指向一个地址需要对齐的变量地址时，则产生一个警告例如`char *`指向一个`int *`地址，而通常在机器中`int`是需要地址能被2或4整除的对齐地址

- `-std=gnu11` 使用 `gnu11` 标准来编译

- `-pedantic` 选项能够帮助程序员发现一些不符合 `ANSI/ISO C标准` 的代码

- `-O2` 启用编译优化,一般上生产环境的代码要使用,为了得到更小的体积，更快的代码执行速度

- `-v` 输出 gcc 工作的详细过程

- `-Q` 显示编译过程的统计数据和每一个函数名

- `-DMACRO` 以字符串 1 定义 MACRO 宏; `-DMACRO=DEFN`,以字符串"DEFN"定义 MACRO 宏.与源代码中#define指令定义的宏效果一样

- `-UMACRO` 取消对 MACRO 宏的定义

- `-rdynamic` 用来通知链接器将所有符号添加到动态符号表中,目的是能够通过使用 dlopen 来实现向后跟踪

- `-fpack-struct=4` 强制按照`4Byte`对齐内存,`-fpack-struct=2` 强制按照`2Byte`对齐内存,`-fpack-struct`不用对齐内存

- `-pthread` 与 `-lpthread` : gcc手册里则指出应该在编译和链接时都增加 `-pthread` 选项,编译选项中指定 -pthread 会附加一个宏定义 -D_REENTRANT，该宏会导致 libc 头文件选择那些thread-safe的实现；链接选项中指定 -pthread 则同 -lpthread 一样，只表示链接 POSIX thread 库。由于 libc 用于适应 thread-safe 的宏定义可能变化，因此在编译和链接时都使用 -pthread 选项而不是传统的 -lpthread 能够保持向后兼容，并提高命令行的一致性。

### 编译成 .o 文件

```bash
gcc -E xxx.c -o xxx.i   # 生成预编译文件
gcc -S xxx.c -o xxx.s   # 生成 汇编源文件，也就是汇编代码
gcc -c xxx.c -o xxx.o   # 生成 .o 文件
```

### 打包 .o 成 .a 静态库

```bash
ar rcs zzz.a xxx.o yyy.o
```

### 编译成 .so 动态库

```bash
gcc -shared -fPIC xxx.c -o xxx.so
```

### 在所使用的shell中设置gcc环境变量

```shell
# 如果有多个目录，可以使用逗号隔开
export LIBRARY_PATH=/home/cky/hello/lib         # gcc会读取该环境变量，然后在该目录中搜寻静态库
export LD_LIBRARY_PATH=/home/cky/hello/lib      # gcc会读取该环境变量，然后在该目录中搜寻动态库
export C_INCLUDE_PATH=/home/cky/hello/include   # gcc会读取该环境变量，然后在该目录中搜寻.h文件
export TMPDIR=/home/cky/hello/tmp               # 临时文件所使用的目录
export CC=gcc                                   # 用来指定c编译器
export CXX=g++                                  # 用来指定cpp的编译器
export LIBS
export CFLAGS
```

### 库链接时搜索路径顺序

#### 静态库

- ld会先搜索GCC命令中-L指定的目录
- 再搜索gcc的环境变量`LIBRARY_PATH`
- 再搜索目录 /lib /usr/lib /usr/local/lib

#### 动态库

- 编译目标代码时-L指定的目录
- 环境变量`LD_LIBRARY_PATH`指定的动态库搜索路径
- 配置文件/etc/ld.so.conf中指定的动态库搜索路径
- 默认的动态库搜索路径/lib
- 默认的动态库搜索路径/usr/lib

```bash
gcc -I/home/hello/include -L/home/hello/lib -lword  hello.c -o hello  
```

### 同时使用动态库和静态库

- 场景:写一个Nginx模块，使用MySQL的C客户端接口库libmysqlclient，当然mysqlclient还引用了其他的库，比如libm, libz, libcrypto等等。对于使用mysqlclient的代码来说，需要关心的只是mysqlclient引用到的动态库。大部分情况下，不是每台机器都安装有libmysqlclient，所以我想把这个库静态链接到Nginx模块中，但又不想把mysqlclient引用的其他库也静态的链接进来。
- 简单地使用-static显得有些暴力，因为他会把命令行中`-static`后面的所有`-l`指明的库都静态链接，更主要的是，有些库可能并没有提供静态库（.a），而只提供了动态库（.so）。这样的话，使用-static就会造成链接错误。
- `-Wl,-Bstatic` `-Wl,-Bdynamic` 是gcc的特殊选项，它会将选项的参数传递给链接器，作为链接器的选项
- `-Wl,-Bstatic` 告诉链接器使用`-Bstatic`选项，该选项是告诉链接器，对接下来的`-l`选项使用静态链接
- `-Wl,-Bdynamic` 就是告诉链接器对接下来的`-l`选项使用动态链接

```bash
# 修改前
CORE_LIBS="$CORE_LIBS -L/usr/lib64/mysql -lmysqlclient -lz -lcrypt -lnsl -lm -L/usr/lib64 -lssl"

# 修改后
CORE_LIBS="$CORE_LIBS -L/usr/lib64/mysql -Wl,-Bstatic -lmysqlclient \
-Wl,-Bdynamic -lz -lcrypt -lnsl -lm -L/usr/lib64 -lssl"
```
