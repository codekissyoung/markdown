# GNU Make 项目管理

Unix 文件具有三种时间属性：`atime`(最近被读取的时间)、`ctime`(文件模式被修改的时间)、`mtime`(文件被修改的时间)。文件的时间戳指的是`mtime`。

`make`的作用是让 **将源代码转换为可执行文件** 之类的例行性工作自动化，把可执行文件到源代码的依赖关系通过`makefile`告知`make`,然后`make`会根据这些关系以及源代码文件的时间戳判断应该重新执行哪些步骤，以编译出可执行文件。

## Make 执行选项

- `make --just-print` 或者 `make -n` 打印 make 将要执行的命令，但不实际执行它们
- `make --print-data-base` 打印出所有规则和变量

## Make工作方式

- 读入主`Makefile`
- 读入被`include`的其他`Makefile`
- 初始化文件中的变量
- 推导隐晦规则, 并分析所有规则
- 为所有的目标文件创建依赖关系链
- 根据依赖关系, 决定哪些目标要重新生成
- 执行生成命令

## 格式

```makefile
target : prerequisites ...
    command;
```

- `target`： 工作目标 可以是`.o`、可执行文件、执行动作(伪目标，比如`clean`)
- `prerequisites`： 生成 `target`所需要的文件名列表
- `command`： 生成 `target`需要执行的`shell`命令,命令必须以`[tab]`开头,每条命令占一行。第一个规则之后的所有以`[Tab]`字符开始的的行，`make`都会将其给`shell`去解释执行

- **伪目标**：那些没有任何依赖，只有执行动作的目标称为**伪目标**
- **终极目标**：第一个规则的第一个目标称之为**终极目标**，有些书也称为**默认目标**

- 变量定义: 就是使用一个字符串代表一段文本串，当定义了变量以后，Makefile后续在 需要使用此文本串的地方，通过引用这个变量来实现对文本串的使用
- 文件指示: 引用其他`Makefile`;指定Makefile中有效部分; 定义一个多行命令
- Makefile指示符：指示符指明在make程序读取makefile文件过程中所要执行的一个动作，包括：
  - 读取一个文件，读取给定文件名的文件
  - 决定(通常是根据一个变量的得值)处理或者忽略Makefile中的某一特定部分
  - 定义一个多行变量
- 注释: 只有行注释`#`,如果要使用或者输出`#`字符, 需要进行转义

### 伪目标

```makefile
# all工作目标会创建一个 bash 和 一个bashbug
.PHONY: all
all: bash bashbug

# makefile 常用的标准的伪目标:
all         执行编译应用程序的所有工作
install     从已编译的二进制文件中进行应用程序的安装
clean       将产生自源代码的二进制文件删除
distclean   删除编译过程中产生的任何文件
TAGS        建立可供编辑器使用的标记表
info        从 Texinfo 源代码来创建 GNU info 文件
check       执行与应用程序相关的任何测试
```

### 实例

```makefile
# 生成 edit 程序，需要 8 个 c 文件和 3 个 h 文件
edit : main.o kbd.o command.o display.o insert.o search.o files.o utils.o
    cc main.o kbd.o command.o display.o insert.o search.o files.o utils.o -o edit

main.o : main.c defs.h
    cc -c main.c
kbd.o : kbd.c defs.h command.h
    cc -c kbd.c
command.o : command.c defs.h command.h
    cc -c command.c
display.o : display.c defs.h buffer.h
    cc -c display.c
insert.o : insert.c defs.h buffer.h
    cc -c insert.c
search.o : search.c defs.h buffer.h
    cc -c search.c
files.o : files.c defs.h buffer.h command.h
    cc -c files.c
utils.o : utils.c defs.h
    cc -c utils.c

clean :
    rm edit main.o kbd.o command.o display.o insert.o search.o files.o utils.o
```

## 变量

- 定义是直接用 `=` 赋值, 而使用该变量则是`$(var_name)`,可以简化上面的例子如下

```makefile
objects = main.o kbd.o command.o display.o insert.o search.o files.o utils.o
edit : $(objects)
    cc $(objects) -o edit
```

### 自动变量

- `$@`：工作目标
- `$^`：所有必要文件, 空格隔开, 已去重
- `$+`：同`$^`,未去重
- `$<`：第一个必要文件
- `$?`：时间戳在工作目标之后的所有必要文件, 空格隔开
- `$%`：`.a`中的`.o`文件。比如`foo.a`包含`bar.o`。`$%`是`bar.o`,`$@`是`foo.a`。当工作目标不是`.a`文件，`$%`为空。
- `$*`：工作目标的主文件名, 比如`foo.o`,`foo`就是主文件名

## make的文件搜索路径

- `make`在不指明的情况下，只会在当前目录中寻找工作目标和必要文件
- `VPATH`用于指明，寻找工作目标和必要文件的多个目录
- `vpath`用于指明，`make`去`VPATH`的某个目录中寻找什么样的文件

```makefile
VPATH = src include         # 到src 和 include 中去搜寻文件
vpath %.l %.c src           # 在src 中 只搜寻 .l 和 .c 文件
vpath %.h include           # 在include中只搜寻 .h 文件
```

## 规则

只有目标文件是 **终极目标** 的必要文件或间接必要文件的规则才会被执行，除非`make`明确指定执行这个规则，比如`make clean`。

### 显式规则 explicit rule

描述了在何种情况下如何更新一个或者多个被称为目标的文件,需要明确地给出目标文件、目标的依赖文件列表以及 更新目标文件所需要的命令。

### 模式规则 pattern rule

使用 **通配符 wildcard** 而不是明确的文件名称书写的规则。模式里的 `%` 等效于Unix shell中的 `*` 号，可以代表任意多字符，用法举例: `%,v` , `s%.o` , `wrapper_%`

```makefile
prog : %.c
    gcc $^ -o $@

% : %.cpp
    $(LINK.cpp) $^ $(LOADLIBES) $(LDLIBS) -o $@

% : %.sh
    cat $< > $@
    chmod a+x $@
```

#### 静态模式规则

```makefile
# 将 %.o : %.c 这个模式约束为: 只能应用在 $(OBJECTS) 所列举的文件上
$(OBJECTS) : %.o : %.c
    $(CC) -c $(CFLAGS) $< -o $@
```

### 隐含规则 implicit rule

它是make根据此类目标文件的命名(典型的是文件名的后缀)而自动推导出来的规则。make根据目标文件的名字，自动产生目标的依赖文件并使用默认的命令来对目标进行更新。

所有 **隐含规则** 都是 **模式规则** 的实例。

一个工作目标，如果找不到可以更新它的具体规则，就会使用隐含规则,`abcde.o`在没有明确的命令行生成的情况话,make自动会执行`gcc -c abcde.c -o abcde.o`

在命令行之前使用 `-`,意思是忽略命令的执行错误，比如`-rm`

GNU Make对`-lfl`这种语法提供了特别的支持,它会去库搜索路径中查找，确认`libfl.a`或者`libfl.so`的存在

- 如何从一个`.c`文件编译出一个 `.o` 文件

```makefile
%.o : %.c
    $(COMPILE.c) $(OUTPUT_OPTIION) $<
```

- 如何从`.c`文件编译出一个不具拓展名的文件

```makefile
% : %.c
    $(LINK.c) $^ $(LOADLIBES) $(LDLIBS) -o $@
```

### 内置的变量

![WX20190221-194042.png](https://i.loli.net/2019/02/21/5c6e8e801891b.png)

- `CC = gcc`, 也就是说，改变`CC`变量的设定值就可以更换 C 编译器，改变`CFLAGS` `CPPFLAGS` 就可以更换编译选项
- `COMPILE.c = $(CC) $(CFLAGS) $(CPPFLAGS) $(TARGET_ARCH) -c`
- `OUTPUT_OPTION = -o $@`
- `LINK.o = $(CC) $(LDFLAGS) $(TARGET_ARCH)`, `LDFLAGS`用来保存链接选项（比如`-L`选项），`LOADLIBES`和`LDLIBS`包含了要链接的程序库列表
- 直接修改这些内置变量要特别小心,比如`make CPPFLAGS=-DDEBUG`就会将在makefile里定义的`CPPFLAGS = -I include`覆盖掉，推荐做法如下:

### makefile文件包含

`make`处理指示符`include`时，将暂停对当前文件的读取，而转去读取`include`指定的文件列表。直到完成所有这些文件以后再回过头继续读取当前文件。如果指示符`include`指定的文件不是绝对路径而且当前目录下也不存在此文件。`make`将根据文件名试图在以下几个目录下查找:

1. 首先，查找使 用命令行选项`-I`或者`--include-dir`指定的目录，如果找到指定的文件，则使用这个文件
1. 否则依此搜索以下几个目录: `/usr/gnu/include`、`/usr/local/include`和`/usr/include`

```makefile
include xxx.mk yyy.mk
```

## 函数

### 函数格式

```makefile
#函数定义



# 函数调用
$(function-name arg1[,argn])
```

- `Rule`中，通配符会被自动展开。但在变量的定义和函数引用时，通配符将失效。这种情况下如果需要通配符有效，就需要使用函数`$(wildcard PATTERN...)`。它被展开为已经存在的、使用空格分开的、匹配此模式的所有文件列表。如果不存在任何符合此模式的文件，函数会忽略模式字符并返回空。

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

```makefile
# 字符串函数

# filter 把text当做一系列被空格隔开的单词，与pattern比较后，会返回相符者
$(filter pattern ...,text)

# 与filter相反，返回不符合者
$(filter-out pattern ...,text)

# 从text里找string,找到了就返回string,未找到就返回空值
$(findstring string...,text)

# 不具通配符能力的搜索和替换函数
$(subst search-string,replace-string,text)
$(subst .c,.o,$(sources)) # 将sources中的.c替换为.o

# 具备通配符能力的搜索和替换函数,此次的通配符只包含一个%,与text的整个值进行匹配
$(patsubst search-pattern,replace-pattern,text)

# 返回text中单词的数量
$(words text)

# 返回text中第n个单词
$(words n,text)

# 返回从start(含)到end(含)的单词
$(wordlist start,end,text)

# 排序list参数，并且去重,返回按字典排序的不重复单词列表，以空格作为分割符
$(sort list)

# 使用subshell执行命令
$(shell command)

# 支持通配符函数，匹配字符包括 ~、*、？、[...]和[^...]
$(wildcard pattern...)
sources = $(wildcard *.c *.h)

# 返回list中每个单词的目录部分
$(dir list...)

# 返回文件路径中的文件名部分
$(notdir name...)

# 返回参数中每个单词的后缀
$(suffix name...)

# 返回参数中每个单词不含后缀的部分
$(basename name...)

# 加后缀
$(addsuffix suffix,name...)

# 加前缀
$(addprefix prefix,name...)

# 链接 把prefix-list的第一个参数与suffix-list的第一个参数接在一起，以此类推
$(join prefix-list,suffix-list)
```

## 参考实例

```makefile
CC=g++
CPPFLAGS=-Wall -g -pedantic
BIN=main
OBJS=main.o error.o func.o

$(BIN):$(OBJS)
    $(CC) $(CPPFLAGS) $^ -lpthread -o $@

%.o:%.c
    $(CC) $(CPPFLAGS) -c $< -o $@

.PHONY:clean
clean:
    rm -f *.o $(BIN)
```