# C/C++开发

本文记录的是编译链接中各个工具的使用。

- [C与C++编译过程-阮一峰的网络日志](http://www.ruanyifeng.com/blog/2014/11/compiler.html)

## C版本

![C版本](https://i.loli.net/2018/11/08/5be3b953d5f5a.png)

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
sudo apt-get install gcc gdb make autoconf automake libtool build-essential flex bison
```

- `as` 是GNU下的汇编工具
- `ld` 是GNU下的链接工具
- `ar` 是GNU下的`.o`文件的归档工具，用于制作静态库`.a`
- `Lex`是一种生成扫描器的工具。扫描器是一种识别文本中的词汇模式的程序。`flex`是ubuntu中的版本。
- `Yacc` 代表 `Yet Another Compiler Compiler`。`Yacc` 的 GNU 版叫做 `Bison`。它是一种工具，将任何一种编程语言的所有语法翻译成针对此种语言的 `Yacc` 语法解析器。

- **链接**: 将多`.o`文件，或者`.o`文件和库文件链接成为可被操作系统执行的可执行程序。链接器不 检查函数所在的源文件，只检查所有`.o`文件中的定义的符号。将`.o`文件中使用的函数和其它`.o`或者库文件中的相关符号进行合并，最后生成一个可执行的程序。`ld`是GNU 的链接器。

- **静态库**: 又称为文档文件`Archive File`。它是多个`.o`文件的集合。Linux中静态库文件的后缀为`.a`。静态库中的各个成员`.o`文件没有特殊的存在格式，仅仅是一个`.o`文件的集合。使用`ar`工具维护和管理静态库。

- **共享库**: 也是多个`.o`文件的集合，但是这些`.o`文件时有编译器按照一种特殊的方式生成。对象 模块的各个成员的地址(变量引用和函数调用)都是相对地址。因此在程序运行时，可动态加载库文件和执行共享的模块(多个程序可以共享使用库中的某一个模块)。
