# GNU Make 项目管理

> - [GNU Make Manual](http://www.gnu.org/software/make/manual/make.html#Bugs)
> - [makefile使用总结](https://www.cnblogs.com/wang_yb/p/3990952.html)
> - [Make 命令教程-阮一峰的网络日志](http://www.ruanyifeng.com/blog/2015/02/make.html)

代码变成可执行文件，叫做编译`compile`；先编译这个，还是先编译那个（即编译的安排），叫做构建`build`。

`Make`是最常用的构建工具，诞生于1977年，主要用于C语言的项目。但是实际上 ，任何只要某个文件有变化，就要重新构建的项目，都可以用Make构建。

`make`的作用是让 **将源代码转换为可执行文件** 之类的例行性工作自动化，把可执行文件到源代码的依赖关系通过`makefile`告知`make`，然后`make`会根据这些关系以及文件的时间戳判断，应该重新执行哪些步骤，用以编译出可执行文件。

## 基本概念

```makefile
target : prerequisites ...
    command;
```

- **`target`** : 目标文件、工作目标、伪目标，可以是`Object File`、也可以是可执行文件

- **`prerequisites`** : 生成 `target` 所需要的文件或者目标

- **`command`** : 生成 `target`需要执行的`shell`命令,命令必须以`[tab]`开头,每条命令占一行。第一个规则之后的所有以`[Tab]`字符开始的的行，`make`都会将其给`shell`去解释执行

- **伪目标**：那些没有任何依赖，只有执行动作的工作目标。

- **显式规则**：说明如何生成一个或多个目标文件(包括 生成的文件, 文件的依赖文件, 生成的命令)

- **隐含规则**：`make`的自动推导功能所执行的规则，基本都是`模式规则`的实例。比如，`.o`文件可由同名`.c`文件生成。

- **变量定义**：使用一个字符串代表一段文本串，当定义了变量以后，`makefile`后续在需要使用此文本串的地方，通过引用这个变量来实现对文本串的使用。

- **指示符**：`make`的一些操作命令，比如：`include`引入其他`makefile`文件；`define`定义宏等。

- **注释**: 以`#`开头，后面文本都是注释内容,如果`makefile`要使用或者输出`#`字符, 需要进行转义。

- **终极目标**：第一个规则的第一个目标称之为终极目标，有些书也称为默认目标,只有目标文件是 **终极目标** 的必要文件或间接必要文件的规则才会被执行，除非`make`明确指定执行这个规则，比如`make clean`。

`Unix`文件具有三种时间属性：`atime`最近被读取的时间、`ctime`文件模式被修改的时间、`mtime`文件被修改的时间。文件的时间戳指的是`mtime`。

## 工作方式

### 两阶段执行

- 第一阶段：读取所有的`makefile`文件，内建所有变量、明确规则和隐含规则，并建立所有目标和依赖之间的依赖关系结构链表。

- 第二阶段：根据第一阶段已经建立的依赖关系结构链表，决定哪些目标需要更新，并使用对应的规则来重建这些目标。

- **立即展开**: 在执行第一阶段时，变量和函数被展开在需要构建的结构链表的对应规则中。后文中`IMMEDIATE`表示立即展开。

- **延后展开**: 第一阶段不展开，在后续某些规则须要使用时、或者在`make`处理的第二阶段展开。后文`DEFERRED`表示延后展开。

`target`与`prerequisites` 中的函数和变量会立即展开，而命令中的变量是延后展开的。

### `make`的工作步骤：

- 依次读取环境变量`MAKEFILES`定义的`makefile`文件列表
- 读入工作目录下主`makefile`
- 读入`include`的其他`makefile`
- 查找重建所有已读取的`makefile`文件的规则
- 初始化文件中的变量，并展开需要立即展开的变量与函数，并且根据预设条件确定分支
- 推导隐含规则, 并分析所有规则，根据 终极目标 以及其他目标的依赖关系，建立依赖关系链表
- 根据依赖关系, 决定哪些目标要重新生成
- 执行除 终极目标 以外的所有目标的规则
- 执行 终极目标 所在的规则

## 环境变量

- `MAKEFILES` : `make`执行时首先将此变量作为需要读入的`makefile`文件
- `MAKEFILE_LIST` :  所有`make`加载的变量，都会被追加记录到 `MAKEFILE_LIST` 中
- `.VARIABLES` : `makefile`中所定义的所有全局变量列表、包括：空变量和make内嵌变量
- `.LIBPATTERNS` : 默认值为`lib%.so lib%.a`,因此`-lNAME`默认加载`libNAME.so`

## 变量

```makefile
# 变量定义
IMMEDIATE  = DEFERRED  # 在执行时扩展，允许递归扩展
IMMEDIATE ?= DEFERRED  # 只有在该变量为空时才设置值
IMMEDIATE := IMMEDIATE # 在定义时扩展 简单变量，立即展开

# 将值追加到变量的尾端。
# 当此前这个变量是一个简单变量(:=定义)时，是立即展开的，其他情况是延后展开
IMMEDIATE += value(DEFERRED or IMMEDIATE)

define IMMEDIATE
    DEFERRED
endef

# 使用变量 使用 $(变量名)
$(var)
```

- 请注意: `:=` 定义的变量是立即展开的，`=`定义的变量延后展开的

```makefile
OBJS2 = $(OBJS1) programC.o
OBJS1 = programA.o programB.o
all:
    @echo $(OBJS2)
# bash中执行 make, 可以看出虽然 OBJS1 是在 OBJS2 之后定义的, 但在 OBJS2中可以提前使用
$ make
programA.o programB.o programC.o
```

### 变量替换操作

```makefile
SRCS := programA.c programB.c programC.c
OBJS := $(SRCS:%.c=%.o)
all:
    @echo "SRCS: " $(SRCS)
    @echo "OBJS: " $(OBJS)

$ make
SRCS:  programA.c programB.c programC.c
OBJS:  programA.o programB.o programC.o
```

### 变量追加值

```makefile
SRCS := programA.c programB.c programC.c
SRCS += programD.c
all:
    @echo "SRCS: " $(SRCS)

$ make
SRCS:  programA.c programB.c programC.c programD.c
```

### 变量覆盖参数 override

```makefile
SRCS := programA.c programB.c programC.c
all:
    @echo "SRCS: " $(SRCS)

$ make SRCS=nothing
SRCS:  nothing

#################################################

override SRCS := programA.c programB.c programC.c
all:
    @echo "SRCS: " $(SRCS)

$ make SRCS=nothing
SRCS:  programA.c programB.c programC.c
```

### 自动变量

- `$@`：工作目标
- `$^`：所有必要文件, 空格隔开, 已去重,比如，规则为 `t: p1 p2`，那么 `$^` 就指代 `p1 p2`
- `$+`：同`$^`,未去重
- `$<`：第一个必要文件
- `$?`：时间戳在工作目标之后的所有必要文件, 空格隔开,比如，规则为 `t: p1 p2`，其中 `p2` 的时间戳比 `t` 新，`$?`就指代`p2`
- `$%`：`.a`中的`.o`文件。比如`foo.a`包含`bar.o`。`$%`是`bar.o`,`$@`是`foo.a`。当工作目标不是`.a`文件，`$%`为空
- `$*`：指代匹配符`%` 匹配的部分，比如`%`匹配`f1.txt`中的`f1`,`$*`就表示`f1`。
- `$(@D)`和`$(@F)`：`$(@D)`和`$(@F)`分别指向`$@`的目录名和文件名。比如`$@`是`src/input.c`，那么`$(@D)`的值为`src`，`$(@F)`的值为`input.c`
- `$(<D)`和`$(<F)`：`$(<D)`和`$(<F)`分别指向`$<`的目录名和文件名

```makefile
# 静态模式 + 多目标文件 + $* 的例子
# $* 分别是 big , litter
bigoutput litteroutput : %output : text.g
    generate text.g -$* > $@
```

```makefile
dest/%.txt: src/%.txt
    @[ -d dest ] || mkdir dest
    cp $< $@
```

上面代码将`src`目录下的`txt`文件，拷贝到`dest`目录下。首先判断`dest`目录是否存在，如果不存在就新建，然后`$<` 指代前置文件`src/%.txt`， `$@`指代目标文件`dest/%.txt`。

## 执行选项

- `make --debug=[a,b,v]` 输出调试信息
- `make -j` 同时运行的命令的个数，也就是多线程执行`Makefile`
- `make -n` 打印将要执行的命令，但不实际执行它们
- `make --print-data-base` 打印出所有规则和变量
- `make -w` 在编译一个目录之前和完成此目录的编译之后，给出相应的提示信息
- `make -f rules.txt` 指定make命令依据`rules.txt`文件中的规则，进行构建
- `make -r` 禁止使用任何隐含规则
- `make -R` 禁止使用任何作用于变量上的隐含规则
- `make -B` 强制所有目标都更新

## 伪目标

```makefile
# all工作目标会创建一个 bash 和 一个bashbug
.PHONY: all
all: bash bashbug
```

常用的标准的伪目标:

```makefile
all         # 执行编译应用程序的所有工作
install     # 从已编译的二进制文件中进行应用程序的安装
clean       # 将产生自源代码的二进制文件删除
distclean   # 删除编译过程中产生的任何文件
TAGS        # 建立可供编辑器使用的标记表
info        # 从 Texinfo 源代码来创建 GNU info 文件
check       # 执行与应用程序相关的任何测试
print       # 列出改变过的源文件
tar         # 把源程序打包备份. 也就是一个tar文件
dist        # 创建一个压缩文件, 一般是把tar文件压成Z文件. 或是gz文件
```

## 规则中部分依赖

```makefile
LIBS = libtest.a
foo : foo.c | $(LIBS)
    $(CC) $(CFLAGS) $(LIBS) $< -o $@
```

如果`foo`已经存在，当`foo.c`被修改以后，`foo`将被重建，但是当`libtest.a`被修改以后，不会重建`foo`。规则中`|`左边的内容被修改，需要根据规则重建，右边的被修改，不会重建。

## 规则中的通配符

```makefile
clean ：
    rm -f *.o
```

- `*`: 表示任意一个或多个字符
- `?` : 表示任意一个字符
- `[...]` : `[abcd]` 表示`a,b,c,d`中任意一个字符, `[^abcd]`表示除`a,b,c,d`以外的字符, `[0-9]`表示`0~9`中任意一个数字
- `~` : 表示用户的home目录

可直接使用在以下两种场合：

- 规则的目标文件、依赖文件列表中，`make`是立即展开通配符匹配到的值的
- 规则的命令中，其展开是在`shell`执行此命令时完成

变量与函数中是无法直接使用通配符的，需要通过`wildcard`函数来使用通配符。比如`objects = *.o`中`$(objects)`的值就是`*.o`,而不是使用空格分隔开的所有`.o`文件列表。正确写法是：`objects = $(wildcard *.o)`,代表使用空格分隔开的所有`.o`文件列表。

```makefile
objects = *.o

foo : $(objects)
    cc -o foo $(CFLAGS) $(objects)
```

上述`makefile`执行后报错 " 没有创建 *.o 文件的规则 ",原因就是规则展开后是`foo : *.o`,目录中不存在`*.o`这样一个文件，所以`make`将`*.o`当做依赖的目标文件，然而也没有`*.o`目标文件的创建规则，所以报错。

```makefile
objects := $(patsubst %.c,%.o,$(wildcard *.c))

foo : $(objects)
    cc -o foo $(objects)
```

上述`makefile`将工作目录下的所有`.c`文件进行编译，并最后链接成为一个可执行文件`foo`。

## 文件搜索路径

- `make`在不指明的情况下，只会在当前目录中寻找工作目标和必要文件
- `VPATH dir1 dir2`用于指明，寻找工作目标和必要文件的多个目录
- `vpath PATTERN dirs`用于指明，`make`去`VPATH`的某个目录中寻找什么样的文件,`%`意思是匹配一个或多个字符

```makefile
VPATH = src include         # 到src 和 include 中去搜寻文件
vpath %.l %.c src           # 在src 中 只搜寻 .l 和 .c 文件
vpath %.h include           # 在include中只搜寻 .h 文件
```

`vpath %.h include`指定的路径仅限于在`makefile`文件内容中出现的`.h`文件，并不能指定源代码文件中包含的头文件所在的路径，在`.c`源文件中所包含的头文件的搜索路径需要使用`gcc`中的`-I`命令来指定。

## 条件与判断

所有的条件语句都是立即展开的，包括`ifdef`、`ifeq`、`ifndef`、`ifneq`。

```makefile
ifeq ($(CC),gcc)
  libs=$(libs_for_gcc)
else
  libs=$(normal_libs)
endif

LIST = one two three
all:
    for i in $(LIST); do \
        echo $$i; \
    done
# 等同于
all:
    for i in one two three; do \
        echo $i; \
    done
```

## 规则中的命令行

在一个规则的命令中,`[tab] 命令行;[换行符]`交给`/bin/sh`去执行。

```makefile
foo : bar/lose
    cd bar;gobble lose > ../foo; # 整行是一个shell去执行，在执行 gobble 之前会进入 bar 目录
```

```makefile
foo : bar/lose
    cd bar;
    gobble lose > ../foo; # 是一个新shell去执行，所以当前目录不是 bar 目录
```

### 命令前缀

- 无前缀,输出执行的命令以及命令执行的结果, 出错的话停止执行
- `-` 前缀，可以忽略命令的执行错误报告,忽略错误, 继续执行,比如 `[tab]-rm -rf *.o`。
- `@` 前缀，可以关闭命令的回显输出，出错的话停止执行

### 定义命令包

命令包有点像是个函数, 将连续的相同的命令合成一条, 减少 Makefile 中的代码量, 便于以后维护。

```makefile
# 定义一个命令包
define run-yacc;
    yacc $(firstword $^)
    mv y.tab.c $@
endef

# 使用命令包
foo.c : foo.y
    $(run-yacc)
```

## 模式规则 pattern rule

使用 通配符 而不是明确的文件名称书写的规则。模式里的 `%` 等效于Unix shell中的 `*` 号，可以代表任意多字符，用法举例: `%,v` , `s%.o` , `wrapper_%`

```makefile
prog : %.c
    gcc $^ -o $@

% : %.cpp
    $(LINK.cpp) $^ $(LOADLIBES) $(LDLIBS) -o $@

% : %.sh
    cat $< > $@
    chmod a+x $@
```

### 静态模式规则

```makefile

OBJECTS = foo.o bar.o

all : $(OBJECTS)

# 将 %.o : %.c 这个模式约束为: 只能应用在 $(OBJECTS) 所列举的文件上
$(OBJECTS) : %.o : %.c
    $(CC) -c $(CFLAGS) $< -o $@
```

## 隐含规则 implicit rule

所有 **隐含规则** 都是 **模式规则** 的实例。

一个工作目标，如果找不到可以更新它的具体规则，就会使用隐含规则,`abcde.o`在没有明确的命令行生成的情况话,make自动会执行`gcc -c abcde.c -o abcde.o`

`GNU Make`对`-lfl`这种语法提供了特别的支持,它会去库搜索路径中查找，确认`libfl.a`或者`libfl.so`的存在

### 常用的隐含规则一览

```makefile
# 编译C程序 : N.o 自动由 N.c 生成
%.o : %.c
    $(CC) -c $(CPPFLAGS) $(CFLAGS) $<

# 编译C++程序 ：N.o 自动由 N.cc 生成
%.o : %.cc
    $(CXX) -c $(CPPFLAGS) $(CFLAGS) $<

# 汇编和需要预处理的汇编程序
%.o : %.s
    $(AS) $(ASFLAGS) $<

%.s : %.S
    $(CPP) $(CPPFLAGS)

# 链接单一 object 文件 ： N自动由多个N.o生成
% : %.o
    $(CC) $(LDFLAGS) $< $(LOADLIBES) $(LDLIBS)

% : %.c
    $(LINK.c) $^ $(LOADLIBES) $(LDLIBS) -o $@
```

### 隐含变量

隐含规则的命令中，使用的变量都是预定义变量，称为 隐含变量。

![WX20190221-194042.png](https://i.loli.net/2019/02/21/5c6e8e801891b.png)

常见命令隐含变量：

- `CC = gcc` : `C`编译程序, 改变`CC`变量的设定值就可以更换`C`编译器
- `CPP = $(CC) -E` ： `C`程序的预处理器
- `AS = as` ：汇编程序
- `AR = ar` ：函数库打包程序，可创建静态库文档`.a`
- `CXX = g++`: `C++`编译程序
- `RM = rm -f`

常见命令参数隐含变量：

- `ARFLAGS = rv` : `$(AR)` 命令使用的参数
- `ASFLAGS` : `$(AS)` 汇编程序使用的参数
- `CFLAGS` : `$(CC)` 使用的参数
- `CXXFLAGS` : 执行`g++`编译器时，使用的参数
- `CPPFLAGS` ：执行`$(CC) -E`时，使用的参数
- `LDFLAGS` : 链接器参数 如 `ld`
- `LOADLIBES` `LDLIBS` 包含了要链接的程序库列表

常见组合起来的隐含变量：

- `COMPILE.c = $(CC) $(CFLAGS) $(CPPFLAGS) $(TARGET_ARCH) -c`
- `OUTPUT_OPTION = -o $@`
- `LINK.o = $(CC) $(LDFLAGS) $(TARGET_ARCH)`

直接修改这些内置变量要特别小心,比如`make CPPFLAGS=-DDEBUG`就会将在makefile里定义的`CPPFLAGS = -I include`覆盖掉

## 函数

### 函数格式

```makefile
# 函数调用
$(function-name arg1[,argn])
```

在规则中通配符会被自动展开，但在变量的定义和函数引用时，通配符将失效。这种情况下如果需要通配符有效，就需要使用函数`$(wildcard PATTERN...)`。它被展开为已经存在的、使用空格分开的、匹配此模式的所有文件列表。如果不存在任何符合此模式的文件，函数会忽略模式字符并返回空。

```makefile
# 首先使用 wildcard 获取工作目录下的 .c 文件列表
# 之后将列表中所有文件名的后缀 .c 替换为 .o,就可以得到在当前目录可生成的 .o 文件列表
objects := $(patsubst %.c,%.o,$(wildcard *.c))

foo : $(objects)
    cc -o foo $(objects)
```

```makefile
src = $(wildcard *.c ./sub/*.c)   # 扩展通配符,把 ./ 和 ./sub/ 下的所有后缀是c的文件全部展开
dir = $(notdir $(src))            # 去除路径, 把展开的文件去除掉路径信息
obj = $(patsubst %.c,%.o,$(dir) ) # 替换通配符, patsubst把$(dir)中的变量符合后缀是.c的全部替换成.o

.PHONY = all
all:
 @echo $(src)       # 输出 a.c b.c ./sub/sa.c ./sub/sb.c
 @echo $(dir)       # 输出 a.c b.c sa.c sb.c
 @echo $(obj)       # 输出 a.o b.o sa.o sb.o
 @echo "end"
```

### 常用函数

```makefile
# filter 把text当做一系列被空格隔开的单词，与pattern比较后，会返回相符者
$(filter pattern ...,text)
eg.
files = foo.elc bar.o lose.o
$(filter %.o,$(files)) : %.o:%.c
    $(CC) -c $(CFLAGS) $< -o $@

$(filter %.o %.a,program.c program.o program.a)

# 与filter相反，返回不符合者
$(filter-out pattern ...,text)

# 从text里找string,找到了就返回string,未找到就返回空值
$(findstring string...,text)

# 不具通配符能力的搜索和替换函数
$(subst search-string,replace-string,text)
$(subst .c,.o,$(sources)) # 将sources中的.c替换为.o

# 具备通配符能力的搜索和替换函数,此次的通配符只包含一个%,与text的整个值进行匹配
$(patsubst search-pattern,replace-pattern,text)
eg. $(patsubst %.c,%.o,programA.c programB.c)

# 去掉 <string> 字符串中开头和结尾的空字符,返回被去掉空格的字符串值
$(strip <string>)

# 返回text中单词的数量
$(words text)

# 返回text中第n个单词
$(words n,text)

# 取字符串 <text> 中的第一个单词
$(firstword <text>)
eg. $(firstword aa bb cc dd) # aa

# 返回从start(含)到end(含)的单词
$(wordlist start,end,text)
eg. $(wordlist 1,3,aa bb cc dd) # aa bb cc

# 排序list参数，并且去重,返回按字典排序的不重复单词列表，以空格作为分割符
$(sort list)

# 使用subshell执行命令 它的作用就是执行一个shell命令, 并将shell命令的结果作为函数的返回
$(shell command)

# 支持通配符函数，匹配字符包括 ~、*、？、[...]和[^...]
$(wildcard pattern...)
sources = $(wildcard *.c *.h)

# 返回list中每个单词的目录部分
$(dir list...)
eg. $(dir /home/a.c ./bb.c ../c.c d.c) # /home/ ./ ../ ./

# 返回文件路径中的文件名部分
$(notdir name...)
eg. $(notdir /home/a.c ./bb.c ../c.c d.c) # a.c bb.c c.c d.c

# 返回参数中每个单词的后缀
$(suffix name...)
eg. $(suffix /home/a.c ./b.o ../c.a d) # .c .o .a

# 返回参数中每个单词不含后缀的部分
$(basename name...)
eg. $(basename /home/a.c ./b.o ../c.a /home/.d .e) # /home/a ./b ../c /home/

# 加后缀
$(addsuffix suffix,name...)
eg. $(addsuffix .c,/home/a b ./c.o ../d.c) # /home/a.c b.c ./c.o.c ../d.c.c

# 加前缀
$(addprefix prefix,name...)
eg. $(addprefix test_,/home/a.c b.c ./d.c) # test_/home/a.c test_b.c test_./d.c

# 链接 把prefix-list的第一个参数与suffix-list的第一个参数接在一起，以此类推
$(join prefix-list,suffix-list)
eg. $(join a b c d,1 2 3 4) # a1 b2 c3 d4

# foreach 函数 $(foreach <var>,<list>,<text>)
targets := a b c d
objects := $(foreach i,$(targets),$(i).o)
all:
    @echo $(targets)
    @echo $(objects)
# bash 中执行 make
$ make
a b c d
a.o b.o c.o d.o

# if 函数 $(if <condition>,<then-part>,<else-part>)
val := a
objects := $(if $(val),$(val).o,nothing)
no-objects := $(if $(no-val),$(val).o,nothing)
all:
    @echo $(objects)
    @echo $(no-objects)
# bash 中执行 make
$ make
a.o
nothing

# call 创建新的参数化函数 $(call <expression>,<parm1>,<parm2>,<parm3>...)

log = "====debug====" $(1) "====end===="
all:
    @echo $(call log,"正在 Make")

# bash 中执行 make
$ make
====debug==== 正在 Make ====end====

# 产生一个致命错误,输出错误信息, 停止Makefile的运行 $(error <text ...>)
all:
    $(error there is an error!)
    @echo "这里不会执行!"
# bash 中执行 make
$ make
Makefile:2: *** there is an error!.  Stop.

# 输出警告信息, Makefile继续运行 $(warning <text ...>)
all:
    $(warning there is an warning!)
    @echo "这里会执行!"
$ make
Makefile:2: there is an warning!
这里会执行!

```

## 参考实例

```makefile
CC       = g++
CPPFLAGS = -Wall -g -pedantic
BIN      = main
OBJS     = main.o error.o func.o

$(BIN):$(OBJS)
    $(CC) $(CPPFLAGS) $^ -lpthread -o $@

%.o : %.c
    $(CC) $(CPPFLAGS) -c $< -o $@

.PHONY : clean
clean:
    rm -f *.o $(BIN)
```

### 包含其他makefile文件

`make`处理指示符`include`时，将暂停对当前文件的读取，而转去读取`include`指定的文件列表。直到完成所有这些文件以后再回过头继续读取当前文件。如果指示符`include`指定的文件不是绝对路径而且当前目录下也不存在此文件。`make`将根据文件名试图在以下几个目录下查找:

- 首先，查找使 用命令行选项`-I`或者`--include-dir`指定的目录，如果找到指定的文件，则使用这个文件
- 否则依此搜索以下几个目录: `/usr/gnu/include`、`/usr/local/include`和`/usr/include`

```makefile
include xxx.mk yyy.mk
```

格式`A(M)`表示档案文件`.a`的成员`M`。

`$`在`makefile`中有特殊含义，表示变量或者函数的引用，如果规则中需要`$`字符，则需要书写为`$$`

## 查看C文件的依赖关系

写 `Makefile` 的时候, 需要确定每个目标的依赖关系.`GNU`提供一个机制可以查看`C`代码文件依赖那些文件, 这样我们在写 `Makefile` 目标的时候就不用打开C源码来看其依赖那些文件了.
比如, 下面命令显示内核源码中 `virt/kvm/kvm_main.c` 中的依赖关系

```bash
$ cd virt/kvm/
$ gcc -MM kvm_main.c
kvm_main.o: kvm_main.c iodev.h coalesced_mmio.h async_pf.h
# 上句就可以加到 Makefile 中作为编译 kvm_main.o 的依赖关系
```

## make的递归执行

进入子目录（那个子目录下有`makefile`文件），然后执行`make`命令。

```makefile
subsystem:
    cd subdir && $(MAKE);

# 等价于
subsystem:
    $(MAKE) -C subdir;
```

父`makefile`中将变量传递给子`makefile`:

```makefile
# 父makefile
export VARIABLE;   # export 后，子makefile就能访问到该变量了
unexport VARIABLE; # 不希望将一个变量传递给子makefile

export; # 不带任何参数，则表示将父makefile中的所有变量都传递给子makefile
```

`MAKELEVEL`环境变量是`make`递归调用的深度，最上一级是`0`。子`makefile`则是`1`,孙子`makefile`是`2`，以此类推。

```makefile
.PHONY : test
test :
    @echo "makelevel : $(MAKELEVEL)";
```

## 嵌套 Makefile 之间传递参数

```makefile
# Makefile 内容
export VALUE1 := export.c    <-- 用了 export, 此变量能够传递到 ./other/Makefile 中
VALUE2 := no-export.c        <-- 此变量不能传递到 ./other/Makefile 中

all:
    @echo "主 Makefile begin"
    @cd ./other && make
    @echo "主 Makefile end"
```

```makefile
# ./other/Makefile 内容
other-all:
    @echo "other makefile begin"
    @echo "VALUE1: " $(VALUE1)
    @echo "VALUE2: " $(VALUE2)
    @echo "other makefile end"
```

执行 `make`

```bash
$ make
主 Makefile begin
make[1]: Entering directory '/path/to/test/makefile/other'
other makefile begin
VALUE1:  export.c        <-- VALUE1 传递成功
VALUE2:                  <-- VALUE2 传递失败
other makefile end
make[1]: Leaving directory `/path/to/test/makefile/other'
主 Makefile end
```