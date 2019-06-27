# 使用gdb调试c程序

调试器是一个程序，可以在一个严密的环境中执行另一个程序。比如，调试器可以单步跟踪和执行程序、查看变量内容、内存位置、以及指向每条语句后CPU寄存器的变化情况。也可以分析 到达程序中某个点之前 的函数调用序列。

`GDB`是 符号式 调试器，必须通过`-g`选项，在程序编译时将源代码到机器指令的信息写入到可执行文件的 符号表 中。在包含多个源代码文件的大型程序中，必须在编译每个模块的时候都使用`-g`选项。

## 启用gdb调试

```bash
$gcc -g main.c -o cky # -g 表示编译支持 gdb 调试, 并且不能带上-O 或者 -O2 优化
$gdb cky              # 调试 cky 程序
$gdb cky core         # 带上 core 文件一起调试，程序非法执行后 core dump 后产生 core 文件
$gdb cky <PID>        # 指定这个服务程序运行时的进程ID。gdb会自动attach上去，并调试他
$gdb --tui cky        # 在终端窗口上部显示一个源代码查看窗
```

## 列出源文件

```gdb
(gdb)l 1,100           # 列出1-100行
(gdb)l file:N          # 查看指定文件的第 N 行代码
(gdb)l func            # 显示特定函数源代码
(gdb)set listsize 20   # 修改 l 命令显示源码的行数
```

## 运行程序

```gdb
(gdb)r -a -b           # 等价于 cky -a -b
(gdb)start             # 重新执行程序
```

## 断点

断点要设置在某些执行语句上,避免设置在空行和注释上面，如果断点所在的行不能执行，断点就会就近执行在该行下面第一个有效语句

```gdb
(gdb)i b                 # 显示当前所有断点信息，以及它们的编号
(gdb)b                   # 将下一行设置为断点，循环、递归时很有用
(gdb)b 17                # 17行打个断点
(gdb)b func              # func 函数处打个断点
(gdb)b 12 if i == 9      # 条件中断，在12行处，当 i = 9 时中断
(gdb)b temp:10           # 在temp.c中第10行 设置断点
(gdb)b temp:func         # 在temp.c中func函数处 打个断点
(gdb)tb func             # tb 是临时断点，即用完后就会自动删除
(gdb)d 1                 # 删除编号为 3 的断点
(gdb)d [Enter]           # d + 回车 清除所有断点
(gdb)disable 2           # 禁用断点，还可以禁用范围 disable 1-3
(gdb)enable 2            # 启用断点, 还可以启用范围 enable 1-3
(gdb)condition 4 a == 30 # 修改4号中断的条件为: a = 40 时中断
```

## 单步调试

```gdb
(gdb) n                   # 单步执行,不跟踪到函数内部,Step Over
(gdb) s                   # 单步执行,追踪到函数内部,Step In
(gdb) finish              # 继续执行，直到当前函数结束并返回,Step Out
(gdb) return value        # 不继续执行函数中的语句，而是直接让函数返回 value
(gdb) until               # 继续执行，直到当前循环结束
(gdb) c                   # 程序继续运行, 直到下一个断点
(gdb) [Enter]             # 直接回车表示，重复执行上一次命令
(gdb) call func(12,32)    # 直接在调试时调用函数
```

## 查看堆栈信息

```gdb
(gdb) bt                 # 查看函数调用堆栈列表
(gdb) where              # 同上
(gdb) i s                # 同上
(gdb) f                  # 查看当前所在堆栈，还可显示当前执行代码
(gdb) i f                # 查看当前所在堆栈的 详细信息
(gdb) f 1                # 切换到 #1 号栈下
(gdb) i locals           # 打印当前栈下，所有的局部变量
(gdb) i args             # 打印当前栈下，函数传入的参数
(gdb) i registers        # 显示当前栈下，所有寄存器变量的值
```

## 查看程序变量

```gdb
(gdb) p var                # 打印变量的值
(gdb) p arr                # 打印静态数组的值 $3 = {190, 0, 0, 0, 90, 0, 0, 76}
(gdb) p *array@4           # 打印动态数组的 4 个元素
(gdb) p &var               # 打印变量的地址
(gdb) p *address           # 打印地址的数据值
(gdb) p func(5)            # 设定入参，对程序中函数进行调用，看函数返回什么
(gdb) p 'f2.c'::x          # 查看f2.c文件中全局变量x的值
(gdb) p 'f2.c'::sum::x     # 查看f2.c中sum函数中x的值

(gdb) p/x a                # x 十六进制显示，u 无符号整型
$1 = 0x65                  # f 浮点数格式显示，o 八进制格式，t 二进制格式，c 字符格式

(gdb) set variable a = 100 # 直接修改程序里变量的值
(gdb) whatis a             # 显示变量的数据类型
```

## 查看内存数据

`x`命令输出的每一行首先都是内存的起始地址，后面是取符号表的对应变量名称。

```gdb
(gdb) x/nfu [address]

# n : 需要显示多少个内存单位
# f : 格式, i 表示汇编指令，s 表示字符串
# u : 内存单位。b： 1字节；h：2字节；w：4字节；g：8字节；

(gdb) x/8w 0x0804843b   # 从该地址开始，显示 8 个 4 字节的内存内容
(gdb) x/8i 0x0804843b   # 显示 8 行汇编指令
(gdb) x/s  0x0804843b   # 从该地址开始，显示后面的字符串


char msg[100] = "hello world!\n";
char *cPtr = msg + 6;

(gdb) x/s msg           # 显示字符串 msg
0x7fffffffdeb0:	"hello world!\n"
(gdb) x/15xb msg        # 以16进制显示msg前15字符
0x7fffffffdeb0:	0x68	0x65	0x6c	0x6c	0x6f	0x20	0x77	0x6f
0x7fffffffdeb8:	0x72	0x6c	0x64	0x21	0x0a	0x00	0x00
(gdb) x/2xw msg         # 以16进制表示两个32位的字
0x7fffffffdeb0:	0x6c6c6568	0x6f77206f
(gdb) x/s cPtr          # 显示开始于cPtr指针处的字符串
0x7fffffffdeb6:	"world!\n"
(gdb) x/8cb cPtr        # 显示8个十进制字符码，附带对应的字符值
0x7fffffffdeb6: 119 'w' 111 'o' 114 'r' 108 'l' 100 'd' 33 '!' 10 '\n' 0 '\000'
(gdb) x/a &cPtr         # 以16进制显示 cPtr 指针的值
0x7fffffffdea8:	0x7fffffffdeb6
(gdb) x/tw &cPtr        # 以2进制显示 cPtr 指针的值
0x7fffffffdea8:	11111111111111111101111010110110
```

## 反汇编调试

汇编级别的单步调试，对于分析指针和寻址非常有用。

```gdb
(gdb) set disassembly-flavor intel          # 设置反汇编格式为 intel汇编
(gdb) disass main                           # 反汇编 main 函数
Dump of assembler code for function main:
   0x00005555555546a4 <+0>:	push   rbp
   0x00005555555546a5 <+1>:	mov    rbp,rsp
   0x00005555555546a8 <+4>:	sub    rsp,0x20
   0x00005555555546ac <+8>:	mov    DWORD PTR [rbp-0x14],edi
   0x00005555555546af <+11>:	mov    QWORD PTR [rbp-0x20],rsi
   0x00005555555546b3 <+15>:	mov    DWORD PTR [rbp-0xc],0x1000
   ...
End of assembler dump.

(gdb) b *0x00005555555546c9             # 在指定地址处打断点
Breakpoint 3 at 0x5555555546c9: file hello.c, line 12.

(gdb) si                                # 汇编级单步执行
0x00005555555546d6	13		printf( "%d\n", c );
(gdb) ni                                # 汇编级单步执行
0x00005555555546d8	13		printf( "%d\n", c );
```

## 查看进程信息

```gdb
(gdb) i proc status                 # 查看进程一般信息
(gdb) i proc stat                   # 同上，不同展示面板
process 19832
Process: 19832
Exec file: hello
State: t
Parent process: 18319
Process group: 19832
Session id: 13458
TTY: 34816
TTY owner process group: 18319
...

(gdb) i proc mappings               # 查看进程的内存映射信息
process 19832
Mapped address spaces:

          Start Addr           End Addr       Size     Offset objfile
      0x555555554000     0x555555555000     0x1000        0x0 /home/cky/workspace/C/gdb/hello
      0x555555754000     0x555555755000     0x1000        0x0 /home/cky/workspace/C/gdb/hello
      0x555555755000     0x555555756000     0x1000     0x1000 /home/cky/workspace/C/gdb/hello
      0x7ffff79e4000     0x7ffff7bcb000   0x1e7000        0x0 /lib/x86_64-linux-gnu/libc-2.27.so
      0x7ffff7bcb000     0x7ffff7dcb000   0x200000   0x1e7000 /lib/x86_64-linux-gnu/libc-2.27.so
      0x7ffff7dcb000     0x7ffff7dcf000     0x4000   0x1e7000 /lib/x86_64-linux-gnu/libc-2.27.so
      0x7ffff7dcf000     0x7ffff7dd1000     0x2000   0x1eb000 /lib/x86_64-linux-gnu/libc-2.27.so
      0x7ffff7dd1000     0x7ffff7dd5000     0x4000        0x0
      0x7ffff7dd5000     0x7ffff7dfc000    0x27000        0x0 /lib/x86_64-linux-gnu/ld-2.27.so
      0x7ffff7feb000     0x7ffff7fed000     0x2000        0x0
      0x7ffff7ff7000     0x7ffff7ffa000     0x3000        0x0 [vvar]
      ...
```

## 线程

可以在 `pthread_create` 处设置断点，当线程创建时会生成提示信息。

```gdb
(gdb) c
Continuing.
[New Thread 0xb7e78b70 (LWP 2933)]

(gdb) i threads         # 查看所有线程列表
(gdb) where             # 显示当前线程调用堆栈
(gdb) thread 1          # 切换线程
```

## 调试多进程

```gdb
(gdb) set follow-fork-mode child        # 设置调试子进程
```

## 观察点

观察点 `watchpoint` 用于监视变量的读写操作。观察点可以设置在表达式上。观察点类似于断点，但没有绑定到指定代码行。

观察点最常见的用途是观察程序 "何时" 会修改某个变量。当一个被观察的变量的值改变时，`GDB`会暂停程序，并显示变量的旧值和新值，以及下一行要执行的代码。

设置局部变量的观察点之前，必须先执行程序，直到程序流进入该变量的作用域才行。

```gdb
(gdb) watch expression   # 当表达式的值改变时，GDB暂停程序的运行
(gdb) rwatch expression  # 当程序读取 此表达式的 值时，GDB暂停程序的运行
(gdb) awatch expression  # 当程序读取或修改 和此表达式相关 的任何对象时
(gdb) watch i == 99      # 当 i = 99 时，程序暂停运行

eg.
(gdb) b 11               # 先在要设置观察点的局部区域内打一个断点
Breakpoint 1 at 0x735: file hello.c, line 11.
(gdb) r                  # 运行程序
Starting program: /home/cky/workspace/C/gdb/hello
Breakpoint 1, main (argc=1, argv=0x7fffffffe008) at hello.c:12
12	    int *iPtr = &a;

(gdb) watch a            # 设置观察点

(gdb) c                  # 继续执行代码，直到观察点的变量发生改变
Continuing.
Hardware watchpoint 2: a
Old value = 4096
New value = 4097
main (argc=1, argv=0x7fffffffe008) at hello.c:14
14	    puts( "This is the statement following ++ *iPtr." );

(gdb) rwatch b           # 设置读观察点
Hardware read watchpoint 3: b

(gdb) i b                # 查看下断点、观察点设置情况
Num     Type            Disp Enb Address            What
1       breakpoint      keep y   0x0000555555554735 in main at hello.c:11
	breakpoint already hit 1 time
2       hw watchpoint   keep y                      a
	breakpoint already hit 1 time
3       read watchpoint keep y                      b

(gdb) c                  # 继续执行代码，直到读观察点变量被读取时，程序停止执行
Continuing.
This is the statement following ++ *iPtr.
Hardware read watchpoint 3: b
Value = 8192
0x0000555555554761 in main (argc=1, argv=0x7fffffffe008) at hello.c:15
15	    printf( "a = %d; b = %d.\n", a, b );
```

## 自动显示变量

```bash
(gdb) display sum        # 跟踪显示 sum 变量
1: sum = -1747168440
(gdb) display input      # 跟踪显示 input 变量
2: input = "hello"
(gdb) n                  # 每次程序执行后停下来，都会输出监视的变量的值
26	            sum = sum * 10 + input[i] - '0';
1: sum = -1868769330
2: input = "hello"
(gdb) undisplay 2        # 取消对跟踪号为 2 (input)的变量的跟踪显示
```

## 源代码 / 反汇编代码 / 寄存器变量窗口

- `(gdb) layout src` 显示源代码窗口
- `(gdb) layout asm` 显示反汇编窗口
- `(gdb) layout regs` 显示源代码/反汇编和CPU寄存器窗口
- `(gdb) layout split` 显示源代码和反汇编窗口
- `(gdb) ctrl + L` 刷新窗口

## 修改变量的值

```gdb
(gdb) i locals
i = 11
sum = 0
(gdb) set var sum=10000     # 直接修改程序里当前栈下的变量的值
(gdb) i locals
i = 1
sum = 10000
(gdb) p result[2]=33        # 或者直接让 p 执行表达式来改变程序里变量的值
(gdb) p printf("result[2]=%d",result[2]) # p 命令直接执行表达式
```

## gdb 设置环境变量

```c
(gdb)set $i=0
(gdb)p my_print[$i++]
$37 = 101 'e'
(gdb)回车
$38 = 108 'l'
(gdb)回车
$39 = 111 'o'
```

## 传递信号给调试程序

```bash
(gdb)handle SIGPIPE nostop  # 设置 SIGPIPE 信号不发送给调试程序，也不停止调试程序
(gdb)handle SIGPIPE stop    # 设置 接收到 SIGPIPE 信号时，停止程序的执行，并且显示一条已接收到信号的消息
(gdb)handle SIGPIPE print   # 设置接收到信号时，显示一条消息
(gdb)handle SIGPIPE noprint # 和上一条相反
(gdb)handle SIGPIPE pass    # 将信号发送给程序，运行调试程序对信号进行处理
(gdb)handle SIGPIPE nopass  # 不发送信号给调试程序，并且停止调试程序运行
(gdb)handle SIGPIPE stop print # 例子

(gdb)signal 2               # 发送信号给调试程序命令
continuing with signal SIGINT(2)
```

## 强制调用函数

```bash
(gdb)call func(arg1,arg2)
```

## 强制函数返回

- 程序调试断点在某个函数内，并且该函数还有语句没执行完，可以使用return命令强制函数忽略未执行的语句，并返回return命令的值

```bash
(gdb)return 54321 # 让sum函数立即返回 54321
Make sum return now(y or n) y
```

## 绑定已经运行的进程

```bash
➜  2018-05 git:(master) ✗ sudo gdb main 29955 # 使用了管理员权限才执行成功的，
[sudo] cky 的密码：
Type "apropos word" to search for commands related to "word"...
Reading symbols from main...done.
Attaching to program: /home/cky/workspace/C/2018-05/main, process 29955
Reading symbols from /lib/x86_64-linux-gnu/libc.so.6...done
Reading symbols from /usr/lib/debug//lib/x86_64-linux-gnu/libc-2.23.so...done.

Reading symbols from /lib64/ld-linux-x86-64.so.2...done.
Reading symbols from /usr/lib/debug//lib/x86_64-linux-gnu/ld-2.23.so...done.
0x00007f6eb14342f0 in __nanosleep_nocancel () at ../sysdeps/unix/syscall-template.S:84
84	../sysdeps/unix/syscall-template.S: 没有那个文件或目录.
(gdb) bt
#0  0x00007f6eb14342f0 in __nanosleep_nocancel () at ../sysdeps/unix/syscall-template.S:84
#1  0x00007f6eb143425a in __sleep (seconds=0) at ../sysdeps/posix/sleep.c:55
#2  0x00000000004006ff in main (ac=1, av=0x7ffd2c4a9728) at main.c:66
(gdb) bt
#0  0x00007f6eb14342f0 in __nanosleep_nocancel () at ../sysdeps/unix/syscall-template.S:84
#1  0x00007f6eb143425a in __sleep (seconds=0) at ../sysdeps/posix/sleep.c:55
#2  0x00000000004006ff in main (ac=1, av=0x7ffd2c4a9728) at main.c:66
(gdb) f 2
#2  0x00000000004006ff in main (ac=1, av=0x7ffd2c4a9728) at main.c:66
66	        sleep(1);
(gdb) p i
$1 = 11

(gdb)detach # 离开进程，进而让进程继续执行
(gdb)kill   # 终止这个进程
```

## 调试多进程 ( GDB > V7.0 )

- [gdb调试多进程多线程](https://blog.csdn.net/flowing_wind/article/details/80553778)

| follow-fork-mode |  detach-on-fork |  说明 |
| ---------------- | --------------- |------ |
| parent | on  | 只调试主进程 GDB默认 |
| child  | on  | 只调试子进程 |
| parent | off  | 同时调试两个进程，gdb跟主进程，子进程停在fork位置 |
| child  | off  | 同时调试两个进程，gdb跟子进程，主进程停在fork位置 |

```bash
(gdb)set follow-fork-mode child
(gdb)set detach-on-fork off
(gdb)info inferiors        # 查询正在调试的进程
(gdb)inferior Num          # 切换进程
```

## 调试器查看自身状态信息

```gdb
(gdb) help show             # 查看 show 命令支持显示的内容
(gdb) show logging          # 查看 gdb 日志情况
(gdb) set logging on        # 开启 gdb 调试日志
```

## gdb 初始化文件 .gdbinit

```shell
set charset UTF-8

# 保存历史命令
set history filename ./.gdb_history
set history save on

# 记录执行gdb的过程
set logging file ./.log.txt
set logging on

# 退出时不显示提示信息
set confirm off

# 打印数组的索引下标
set print array-indexes on

# 每行打印一个结构体成员
set print pretty on

# 自定义命令 qdp : 退出并保留断点
define qbp
save breakpoints ./.gdb_bp
quit
end

# 自定义命令 ldp : 加载历史工作断点
define lbp
source ./.gdb_bp
end
```

- 放在 `/home/用户1/.gdbinit`, 该用户调用 gdb 时自动执行 `.gdbinit` 文件

## core (内核转储文件)

- 内核转储的最大好处是能够保存问题发生时的状态。
- 只要有可执行文件和内核转储，就可以知道进程当时的状态。
- 只要获取内核转储，那么即使没有复现环境，也能调试。
- 查看内核转储是否有效
- 永久生效 : `/etc/profile` 里面添加 `ulimit -c unlimited`

```bash
// -c 表示内核转储文件的大小限制，现在显示为零，表示不能用。
$ ulimit -c
0
// 可以改为1G
$ ulimit -c 1073741824
// 也可以改为无限制
$ ulimit -c unlimited
```

一个例子:

```c
#include <stdio.h>
#include <stdlib.h>
void test()
{
    char *s = "abc";
    *s = 'x'; // 这里有错，会导致段错误，产生core文件
}
int main( int argc, char *argv[] )
{
    test();
    return EXIT_SUCCESS;
}
```

```gdb
$ gcc core.c -g -o test_core
$ ./test_core
[1]    20704 segmentation fault (core dumped)  ./test_core

$ ls
core  core.c  test_core

$ sudo gdb test_core core # core与程序一起加载

Reading symbols from test_core...done.
[New LWP 20704]
Core was generated by `./test_core'.
Program terminated with signal SIGSEGV, Segmentation fault.
#0  0x000055f2d0cb160d in test () at core.c:7
7		*s = 'x';       # 这里其实已经告诉我们出错的位置了

(gdb) where         # 查看错误发生时堆栈
#0  0x000055f2d0cb160d in test () at core.c:7
#1  0x000055f2d0cb162c in main (argc=1, argv=0x7ffcd6c45568) at core.c:12

(gdb) p s           # 打印 s 变量的值
$1 = 0x55f2d0cb16c4 "abc"

(gdb) info files    # 查看可执行文件的内容，找到变量内存地址对应的区域
Symbols from "/home/cky/workspace/C/core/test_core".
Local core dump file:
	`/home/cky/workspace/C/core/core', file type elf64-x86-64.
	0x000055f2d0cb1000 - 0x000055f2d0cb2000 is load1
    ...
Local exec file:
	`/home/cky/workspace/C/core/test_core', file type elf64-x86-64.
    ...
	0x000055f2d0cb1238 - 0x000055f2d0cb1254 is .interp
	0x000055f2d0cb1274 - 0x000055f2d0cb1298 is .note.gnu.build-id
	0x000055f2d0cb1298 - 0x000055f2d0cb12b4 is .gnu.hash
	0x000055f2d0cb12b8 - 0x000055f2d0cb1348 is .dynsym
	0x000055f2d0cb1348 - 0x000055f2d0cb13c5 is .dynstr
	0x000055f2d0cb13c6 - 0x000055f2d0cb13d2 is .gnu.version
	0x000055f2d0cb14b8 - 0x000055f2d0cb14cf is .init
	0x000055f2d0cb14d0 - 0x000055f2d0cb14e0 is .plt
	0x000055f2d0cb14f0 - 0x000055f2d0cb16b2 is .text
	0x000055f2d0cb16b4 - 0x000055f2d0cb16bd is .fini

    # 0x55f2d0cb16c4 地址所属的是 .rodata，不允许修改
	0x000055f2d0cb16c0 - 0x000055f2d0cb16c8 is .rodata 
    ...
```