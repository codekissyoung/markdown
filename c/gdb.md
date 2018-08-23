# 使用gdb调试c程序

## 启用gdb调试

```bash
$gcc -g main.c -o cky # -g 表示编译支持 gdb 调试, 并且不能带上`-O`或者`-O2`优化
$gdb cky              # 调试 cky 程序
$gdb cky core         # 带上 core 文件一起调试，程序非法执行后 core dump 后产生 core 文件
$gdb cky <PID>        # 指定这个服务程序运行时的进程ID。gdb会自动attach上去，并调试他。program应该在PATH环境变量中搜索得到。
```

## 列出源文件

```bash
(gdb)l 1,100           # 列出1-100行
(gdb)l file:N          # 查看指定文件的第 N 行代码
```

## 运行调试程序

```bash
(gdb)r -a -b           # 等价于 cky -a -b
(gdb)start             # 重新执行程序
(gdb)s + 回车           # Step 执行下一行代码
(gdb)回车               # 直接回车表示，重复上一次命令
(gdb)finish            # 让程序运行到当前函数返回为止
(gdb)until             # 让程序运行到当前循环结束为止
(gdb)bt                # 查看当前运行的文件和行
(gdb)c                 # 程序继续运行至 下一个 调试点处
```

## 断点

```c
(gdb)i break             # 显示当前所有断点信息
(gdb)b 17                # 17行 打个断点
(gdb)b func              # func函数处 打个断点
(gdb)b 12 if i==9        # 在12行处，当i=9时，打个断点
(gdb)b temp:10           # 在temp.c中第10行 设置断点
(gdb)b temp:func         # 在temp.c中func函数处 打个断点
(gdb)d b 1               # 删除1号断点
(gdb)d [Enter]           # d + 回车 清除所有断点
```

## 观察点

- watchpoint只能在程序启动后设置，先在main那下个断点，让程序启动后暂停在main函数处, 然后给`n`变量下个watchpoint
- 每次`n`的值有变化的时候，程序都会停下,进入Debug,并且告诉你 n 的值的变化

```bash
(gdb) watch n
Hardware watchpoint 2: n

(gdb) n // 执行下一个语句
63	    int n = 10;

(gdb) n
Hardware watchpoint 2: n
Old value = 0
New value = 10
main (ac=1, av=0x7fffffffe088) at main.c:64
64	    n++; // 即将要执行的语句

(gdb) n
Hardware watchpoint 2: n
Old value = 10
New value = 11
main (ac=1, av=0x7fffffffe088) at main.c:65
65	    n--;

(gdb) c
Continuing.
Hardware watchpoint 2: n
Old value = 11
New value = 10
main (ac=1, av=0x7fffffffe088) at main.c:66
66	    n += 100;

(gdb) c
Continuing.
Hardware watchpoint 2: n
Old value = 10
New value = 110
main (ac=1, av=0x7fffffffe088) at main.c:68
68	    int             len = sizeof(struct utmp);
```

- 断点要设置在某些执行语句上,避免设置在空行和注释上面，如果断点所在的行不能执行，断点就会就近执行在该行下面第一个有效语句

## 查看程序内变量的值

```bash
(gdb)info locals         # 查看当前作用域内，所有局部变量的值
(gdb)p var               # 打印变量的值
(gdb)p &var              # 打印变量的地址
(gdb)p *address          # 打印地址的数据值
(gdb)p func(5)           # 设定入参，对程序中函数进行调用，看函数返回什么
(gdb)p a                 # 查看当前作用域a的值
(gdb)p 'f2.c'::x         # 查看f2.c文件中全局变量x的值
(gdb)p 'f2.c'::sum::x    # 查看f2.c中sum函数中x的值
(gdb)i registers         # 显示寄存器变量

(gdb)p arr               # 打印静态数组的值
$3 = {190, 0, 0, 0, 90, 0, 0, 76}

(gdb) p *array@len       # 打印动态数组的值

(gdb) p/a i              # a 按十六进制格式显示变量。 x 按十六进制格式显示变量。u 按十六进制格式显示无符号整型。
$22 = 0x65               # f 按浮点数格式显示变量。 o 按八进制格式显示变量。t 按二进制格式显示变量。c 按字符格式显示变量。
```

## 查看当前栈下所有变量

```bash
(gdb) bt
#0  add_range (low=1, high=10) at main.c:6
#1  0x00000000004005fc in main (argc=1, argv=0x7fffffffe088) at main.c:15

(gdb) i locals           # 打印当前栈下，所有的局部变量
i = -134225560
sum = 32767

(gdb) f 1                # 切换到 #1 号栈下
#1  0x00000000004005fc in main (argc=1, argv=0x7fffffffe088) at main.c:15
15	    result[0] = add_range(1, 10);

(gdb) i locals           # 打印当前栈(#1) 下 所有局部变量
result = {1, 0, 0, 0, 1, 0}
```

## 查看内存

```bash
(gdb) p input
$28 = "54321"
(gdb) x/7b input         # 打印指定内存的内容，7是表示7个单位，单位是b,表示一个字节,(h表示双字节,w表示4字节,g表示8字节)
                         # 从input ,char数组第一个字节开始，连续打印7个字节，第六个字节开始就是越界数据了
0x7fffffffdf90: 53	52	51	50	49	48	0
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
Reading symbols from /lib/x86_64-linux-gnu/libc.so.6...Reading symbols from /usr/lib/debug//lib/x86_64-linux-gnu/libc-2.23.so...done.
done.
Reading symbols from /lib64/ld-linux-x86-64.so.2...Reading symbols from /usr/lib/debug//lib/x86_64-linux-gnu/ld-2.23.so...done.
done.
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