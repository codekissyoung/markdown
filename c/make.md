# GNU Make 项目管理

- `将源代码转换成可执行文件` 的自动化
- `Make`程序读取`makefile`文件，根据它来编译程序
- 将程序各元素之间的关系告诉 `Make`, `Make` 会根据这些关系和时间戳判断应该重新进行哪些步骤，以重新产生你需要的程序
- `\\t`开头，后面的字符会被当做 commands , 传给 `subshell` 执行，如果在非命令行前面加上了`\\t`，会报错
- `#` 注释
- `\\` 是另起一行，来延续过长的文本

## 默认规则 default rule

```makefile
target ...: file1 file2 ...
    command1
    command2
    ...
```

- 例子
    ```makefile
    foo.o:foo.c foo.h
        gcc -c foo.c

    lexer.c: lexer.l
        flex -t lexer.l > lexer.c

    count_words:count_words.o lexer.o -lfl
        gcc count_words.o lexer.o -lfl -o count_words
    ```
  - `-lfl` : `make`对`-l<NAME>`语法提供了支持, 指示`make`去系统库优先搜索`libNAME.so`,然后再搜索`libNAME.a`
  - 然后 `gcc` 将系统程序库`libNAME.so`链接进`count_words`

## Make 执行选项

- `make --just-print` 打印 make 将要执行的命令，但不实际执行它们

## 两阶段执行模型 two phase execution model

## 递归变量 recursive variable

## 错误提示

```bash
make: `count_words` is up to date.  表示目标已经是最新编译版
make: *** No rule to make target `lexer.o`.Stop   表示编译成lexer.o的规则没写，或者有问题
```

## 具体规则 explicit rule

```makefile
# 确定 vpath.c 在编译之前， lexer.c 已经存在
vpath.o : lexer.c

# 使用特殊的标记来编译 vpath.c
vpath.o : vpath.c
    $(COMPILE.c) $(RULE_FLAGS) $(OUTPUT_OPTION) $<

# 引入别的依存关系
include auto-generated-dependencies.d
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

## 变量

- 单字符可以不用 `()` `{}` 去解引用

```makefile
$(variable-name)
```

## 自动变量

- `$@` 工作目标的文件名
- `$<` 第一个必要文件名
- `$?` 所有必要文件，空格隔开
- `$^` 所有必要文件(已经去重)
- `$%`
- `$*` 工作目标的主文件名

```makefile
# 替换成自动变量的例子
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
# 定义变量
CC=g++
CPPFLAGS=-Wall -g -pedantic
BIN=main
OBJS=main.o error.o func.o

# 书写构建规则
$(BIN):$(OBJS)
    $(CC) $(CPPFLAGS) $^ -lpthread -o $@

%.o:%.c
    $(CC) $(CPPFLAGS) -c $< -o $@

.PHONY:clean
clean:
    rm -f *.o $(BIN)
```