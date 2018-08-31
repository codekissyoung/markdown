# GNU Make 项目管理

- `将源代码转换成可执行文件` 的自动化
- `Make`程序读取`makefile`文件，根据它来编译程序
- 将程序各元素之间的关系告诉 `Make`, `Make` 会根据这些关系和时间戳判断应该重新进行哪些步骤，以重新产生你需要的程序
- `\\t`开头，后面的字符会被当做 commands , 传给 `subshell` 执行，如果在非命令行前面加上了`\\t`，会报错
- `#` 注释
- `\\` 是另起一行，来延续过长的文本

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

## 隐含规则

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

## 具体规则

```makefile
# 确定 vpath.c 在编译之前， lexer.c 已经存在
vpath.o : lexer.c

# 使用特殊的标记来编译 vpath.c
vpath.o : vpath.c
    $(COMPILE.c) $(RULE_FLAGS) $(OUTPUT_OPTION) $<

# 引入别的依存关系
include auto-generated-dependencies.d
```

## Make 执行选项

- `make --just-print` 打印 make 将要执行的命令，但不实际执行它们

## 两阶段执行模型

## 递归变量

## 错误提示

```bash
make: `count_words` is up to date.                # 表示目标已经是最新编译版
make: *** No rule to make target `lexer.o`.Stop   # 表示编译成lexer.o的规则没写，或者有问题
```



## 模式规则 pattern rule

- 与Bash一致的通配符匹配文件规则 : `~` `*` `?` `[...]` `[^...]`
- `~` 匹配用户主目录

## 隐含规则 implicit rule

## 后缀规则 suffix rule

## 静态模式规则 static pattern rule

## 假想工作目标

```makefile
# .PHONY 告诉 make , 该工作目标 不是一个真正的文件
.PHONY: clean
clean:
    rm -f *.o lexer.c
# all工作目标会创建一个 bash 和 一个bashbug
.PHONY: all
all: bash bashbug

.PHONY: make-documentation
make-documentation:
    df -k . | awk 'NR == 2 { printf("%d available\n",$$4)}'
    javadoc ...
```

## 标准假想工作目标

```Makefile
all         执行编译应用程序的所有工作
install     从已编译的二进制文件中进行应用程序的安装
clean       将产生自源代码的二进制文件删除
distclean   删除编译过程中产生的任何文件
TAGS        建立可供编辑器使用的标记表
info        ...
check       执行与应用程序相关的任何测试
```

## 自动变量

- `$@` 工作目标的文件名
- `$<` 第一个必要文件名
- `$?` 所有必要文件，空格隔开
- `$^` 所有必要文件(已经去重)
- `$%`
- `$*` 工作目标的主文件名

```makefile
count_words: count_words.o counter.o lexer.o -libfl
    gcc $^ -o $@
count_words.o: count_words.c
    gcc -c $^
counter.o: counter.c
    gcc -c $^
lexer.o: lexer.c
    gcc -c $^
lexer.c: lexer.l
    flex -t $< > $@
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