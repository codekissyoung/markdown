# GNU Make 项目管理

- `将源代码转换成可执行文件` 的自动化
- `Make`程序读取`makefile`文件，根据它来编译程序
- 将程序各元素之间的关系告诉 `Make`, `Make` 会根据这些关系和时间戳判断应该重新进行哪些步骤，以重新产生你需要的程序
- `[tab]`开头，后面的字符会被当做 commands , 传给 `subshell` 执行，如果在非命令行前面加上了`[tab]`，会报错
- `#` 注释
- `反斜杠 \\` 是另起一行,来延续过长的文本,注意它后面不能有空格

## 例子

- 生成`edit`程序需要8个c文件和3个h文件

```makefile
edit : main.o kbd.o command.o display.o insert.o search.o files.o utils.o
    cc -o edit main.o kbd.o command.o display.o insert.o search.o files.o utils.o
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

## 使用变量

- 定义是直接用 `=` 赋值, 而使用该变量则是`$(var_name)`,可以简化上面的例子如下

```makefile
objects = main.o kbd.o command.o display.o insert.o search.o files.o utils.o

edit : $(objects)
    cc $(objects) -o edit
# 中间的省略 缩减篇幅 ...
clean:
    rm edit $(objects)
```

### 自动变量

- `$@` 工作目标
- `$<` 第一个必要文件名
- `$?` 时间戳在工作目标之后的所有必要文件, 空格隔开
- `$+` 所有必要文件, 空格隔开, 未去重
- `$^` 所有必要文件, 空格隔开, 已去重
- `$%`
- `$*` 工作目标的主文件名, 比如 foo.o, foo 就是主文件名

```makefile
count_words: count_words.o counter.o lexer.o -libfl
    gcc $^ -o $@
# 中间的省略 缩减篇幅 ...
lexer.c: lexer.l
    flex -t $< > $@
```

### 内置的变量

```makefile
# 内置规则
%.o : %.c
    $(COMPILE.c) $(OUTPUT_OPTION) $<
```

- `COMPILE.c`就是内置变量,其中 : `COMPILE.c = $(CC) $(CFLAGS) $(CPPFLAGS) $(TARGET_ARCH) -c`, 它也是其他内置变量构成的
- `OUTPUT_OPTION = -o $@`
- `CC = gcc`, 也就是说，改变`CC`变量的设定值就可以更换 C 编译器，改变`CFLAGS` `CPPFLAGS` 就可以更换编译选项
- 直接修改这些内置变量要特别小心,比如`make CPPFLAGS=-DDEBUG`就会将在makefile里定义的`CPPFLAGS = -I include`覆盖掉，推荐做法如下: 

```makefile
INCLUDES = -I include
COMPILE.c = $(CC) $(CFLAGS) $(INCLUDES) $(CPPFLAGS) $(TARGET_ARCH) -c
```

## 隐含规则

- 一个工作目标，如果找不到可以更新它的具体规则，就会使用隐含规则
- `abcde.o`在没有明确的命令行生成的情况话,make自动会执行`gcc -c abcde.c -o abcde.o`命令，称为隐含命令,所以简化上面例子如下:
- 通过 `.PHONY` 特殊目标将`clean`目标声明为伪目标。避免当磁盘上存在一个名为`clean`文件时,目标`clean`所在规则的命令无法执行
- 在命令行之前使用 `-`,意思是忽略命令`rm`的执行错误

```makefile
objects = main.o kbd.o command.o display.o insert.o search.o files.o utils.o

edit : $(objects)
    cc -o edit $(objects)

main.o : defs.h
kbd.o : defs.h command.h
command.o : defs.h command.h
display.o : defs.h buffer.h
insert.o : defs.h buffer.h
search.o : defs.h buffer.h
files.o : defs.h buffer.h command.h
utils.o : defs.h

.PHONY : clean
clean :
    -rm edit $(objects)
```

### 伪目标

```makefile
# all工作目标会创建一个 bash 和 一个bashbug
.PHONY: all
all: bash bashbug

# 制作文档
.PHONY: make-documentation
make-documentation:
    df -k . | awk 'NR == 2 { printf("%d available\n",$$4)}'
    javadoc ...

# 在执行编译之前 打印一些信息
.PHONY : build_msg
build_msg :
    @printf "#\n# Building $(Program)\n#\n"
```

- makefile 常用的标准的伪目标

```Makefile
all         执行编译应用程序的所有工作
install     从已编译的二进制文件中进行应用程序的安装
clean       将产生自源代码的二进制文件删除
distclean   删除编译过程中产生的任何文件
TAGS        建立可供编辑器使用的标记表
info        从 Texinfo 源代码来创建 GNU info 文件
check       执行与应用程序相关的任何测试
```

### 一个不好的makefile书写方式

```makefile
objects = main.o kbd.o command.o display.o insert.o search.o files.o utils.o

edit : $(objects)
    cc -o edit $(objects)

$(objects) : defs.h
kbd.o command.o files.o : command.h
display.o insert.o search.o files.o : buffer.h

.PHONY : clean
clean :
    -rm edit $(objects)
```

- 这个makefile把依赖相同文件的目标合并了,一个规则中含有多个目标文件,这样导致规则定义不明了,比较混乱,后期维护将会是一件非常痛苦的事情
- 书写规则建议的方式是:单目标,多依赖。就是说尽量要做到一个规则中只存在一个目标文件,可有多个依赖文件。尽量避免使用多目标,单依赖的方式。

## 模式规则

- 模式里的 `%` 等效于Unix shell中的 `*` 号，可以代表任意多字符，用法举例: `%,v` , `s%.o` , `wrapper_%`

```makefile
prog : %.c
    gcc $^ -o $@
%.o : common.h

% : %.mod
    $(COMPILE.mod) -o $@ -e $@ $^

% : %.cpp
    $(LINK.cpp) $^ $(LOADLIBES) $(LDLIBS) -o $@

% : %.sh
    cat $< > $@
    chmod a+x $@
```

### 内置规则

- 内置规则 都是 模式规则 的实例

```makefile
# 内置规则1 : 如何从一个 .c 文件编译出一个 .o 文件
%.o : %.c
    $(COMPILE.c) $(OUTPUT_OPTION) $<

# 内置规则2 : 如何从一个 .l 文件产生一个 .c 文件
%.c : %.l
    @$(RM) $@
    $(LEX.l) $< > $@

# 内置规则3 : 如何从 .c 文件 产出一个 不具有扩展名的 文件
% : %.c
    $(LINK.c) $^ $(LOADLIBES) $(LDLIBS) -o $@
```

## 静态模式规则

- 只能用于 特定的工作目标上

```makefile
# 将 %.o : %.c 这个模式约束为: 只能应用在 $(OBJECTS) 所列举的文件上
$(OBJECTS) : %.o : %.c
    $(CC) -c $(CFLAGS) $< -o $@
```

## VPATH 与 vpath

- `make`在不指明的情况下，只会在当前目录中寻找工作目标和必要文件
- `VPATH`用于指明，寻找工作目标和必要文件的多个目录
- `vpath`用于指明，`make`去`VPATH`的某个目录中寻找什么样的文件

```makefile
VPATH = src include         # 到src 和 include 中去搜寻文件
vpath %.l %.c src           # 在src 中 只搜寻 .l 和 .c 文件
vpath %.h include           # 在include中只搜寻 .h 文件
```

## Make 执行选项

- `make --just-print` 或者 `make -n` 打印 make 将要执行的命令，但不实际执行它们
- `make --print-data-base` 打印出所有内置的以及写在makefile的默认规则和变量

## 两阶段执行模型

## 递归变量

## 错误提示

```bash
make: `count_words` is up to date.                # 表示目标已经是最新编译版
make: *** No rule to make target `lexer.o`.Stop   # 表示编译成lexer.o的规则没写，或者有问题
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