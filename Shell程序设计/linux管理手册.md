# 命令说明规则

- `[]`之间的任何内容都是可选的
- `...`表示后面的任何内容都是可以重复的
- `{}`表示由`|`隔开的各项中的一个
    ```
    命令格式: bork [-x] {on|off} filename ...

    可以匹配的命令:
    bork on /etc/passwd
    bork -x off /etc/passwd /etc/termcap
    bork off /usr/lib/tmac
    ```
- 匹配任意个字符 `*`
- 匹配一个字符`?`
- 表示当前用户主目录`~`
- 举例 : `/etc/rc*.d`可以指代`/etc/rc0.d`和`/etc/rc1.d`


# 安装软件

- 可以在更大的范围搜索
    ```shell
    ➜  ~ whereis gcc
    gcc: /usr/bin/gcc /usr/lib/gcc /usr/share/man/man1/gcc.1.gz
    ```


- 可以根据`文件索引数据库`找到任何文件

    ```shell
    ➜  ~ sudo updatedb /*先更新文件索引数据库*/
    ➜  ~ locate signal.h
    /usr/include/signal.h
    /usr/include/asm-generic/signal.h
    /usr/include/glib-2.0/gobject/gsignal.h
    ...
    ```

- 从源代码编译安装
    ```
    tar -xzvf wget-1.11.4.tar.gz /*先解压源代码包*/
    cd wget-1.11.4 /*进源代码根目录*/
    ./configure --disable-ssl --disable-nls /*根据安装说明和需要，配置编译选项*/
    make /*编译*/
    make install /*安装*/

    /*其他*/
    ./configure --help /*查看所配置选项*/
    ./configure --prefix=/usr/local/cky  /*软件安装到指定目录里*/
    ```
# shell基础
- 设置编辑模式
    ```
    ➜  ~ set -o vi
    ```

## 管道和重定向

- 每个进程都有三个流,`stdin` `stdout` `stderr`,进程不在意这三个流来自哪里，又通向哪里，它们可能链接到一个终端，一个文件，一条网络链接，或者另一个进程的流
- 每个流的命名叫做`文件描述符`，它们依次是0,1,2
- 三个流的默认指向都是终端
- `>` `<` `>>` 是重定向，能改变流的指向
    ```
    ➜  ~ echo "this is a test message" > /tmp/mymessage /*重定向输出到文件*/
    ➜  ~ mail -s "Mail test" cky < /tmp/mymessage /*使用文件里内容发送邮件*/
    ```
- 将错误输出重定向
    ```
    ➜  ~ find / -name core /*没有重定向，stdout与stderr都输出在屏幕*/
    find: ‘/boot/efi’: 权限不够
    /dev/core

    ➜  ~ find / -name core > /tmp/test_output /*只将stdout重定向到文件,stderr还是输出到了屏幕*/
    find: ‘/boot/efi’: 权限不够

    ➜  ~ find / -name core > /tmp/test_output 2> /tmp/null  /*将stderr输出到黑洞，将stdout输出到屏幕*/
    /dev/core
    ```

- 将一条命令的stdout链接到另一条命令的stdin
    ```bash
    ➜  ~ ps -ef | grep ssh                
    cky       1324  1245  0 4月27 ?       00:00:00 /usr/bin/ssh-agent /usr/bin/sogou-session /usr/bin/im-launch /usr/lib/gnome-session/run-systemd-session ubuntu-session.target
    cky       1454  1183  0 4月27 ?       00:00:00 /usr/bin/gnome-keyring-daemon --start --components ssh
    cky      32116  3823  0 18:22 pts/0    00:00:00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn ssh

    ➜  ~ cut -d: -f7 < /etc/passwd | sort -u
    /bin/bash
    /bin/false
    /bin/sync
    /usr/bin/zsh
    /usr/sbin/nologin
    ```
- && 与 ||
    ```
    ➜  workspace ls -alh && cat /tmp/t2 /*前一个命令执行成功，后面的命令才会执行*/
    总用量 28K
    drwxr-xr-x  7 cky cky 4.0K 4月  27 14:53 .
    drwxr-xr-x 32 cky cky 4.0K 4月  28 20:27 ..
    drwxr-xr-x  8 cky cky 4.0K 2月  22 22:24 blog
    ...
    hello world


    ➜  workspace ls -alh || cat /tmp/t2 /*前一个命令执行失败，后面的命令才会执行*/
    总用量 28K
    drwxr-xr-x  7 cky cky 4.0K 4月  27 14:53 .
    drwxr-xr-x 32 cky cky 4.0K 4月  28 20:27 ..
    drwxr-xr-x  8 cky cky 4.0K 2月  22 22:24 blog
    drwxr-xr-x  3 cky cky 4.0K 4月  27 12:07 cky
    drwxr-xr-x 26 cky cky 4.0K 4月  27 21:26 linux
    drwxr-xr-x  3 cky cky 4.0K 4月  20 18:59 note
    drwxr-xr-x  3 cky cky 4.0K 4月  14 16:28 sudoku
    ```

# 变量和引用
- 不要在变量两边留空白，否则shell会把变量当做命令
    ```
    ➜  ~ etcdir='/etc'
    ➜  ~ echo $etcdir
    /etc
    ```
- 使用`{}`拓展变量
    ```
    ➜  ~ rev=8
    ➜  ~ echo "the ${rev}th version of config.conf"
    the 8th version of config.conf
    ```

- `''`与`""`的区别 : `''`是不解析`{}$*?`的
    ```
    ➜  ~ myname="codekissyoung"
    ➜  ~ echo "i am ${myname}"
    i am codekissyoung
    ➜  ~ echo 'i am ${myname}'
    i am ${myname}
    ➜  ~ echo "there was `wc -l /etc/passwd` lines in passwd file" /* `` 可以被解析，它的意思是把里面的字符串执行，返回结果*/
    there was 45 /etc/passwd lines in passwd file
    ```


- 环境变量
    ```
    ➜  ~ export abc=123 /*声明一个环境变量*/
    ➜  ~ env /*输出所有环境变量*/
    XDG_SEAT_PATH=/org/freedesktop/DisplayManager/Seat0
    XDG_CONFIG_DIRS=/etc/xdg/xdg-ubuntu:/etc/xdg
    LC_TELEPHONE=zh_CN.UTF-8
    LANG=zh_CN.UTF-8
    DISPLAY=:0
    SHLVL=2
    LOGNAME=cky
    LANGUAGE=zh_CN:zh:en_US:en
    INVOCATION_ID=d1774be268ce4fcc816f39a929989c7f
    MANDATORY_PATH=/usr/share/gconf/ubuntu.mandatory.path
    PWD=/home/cky
    ... /*省略部分代码*/
    abc=123
    ```
用户登录终端时设置的那些环境变量都在`~/profile`和`~/.bash_profile`里，而像`PWD`这样的环境变量，由shell自动维护

# bash 脚本编程

- read
    ```shell
    #!/bin/bash
    # -n 消除了通常的换行符
    echo -n "enter your name:"
    read user_name
    # 判断user_name是否为空，注意if等指令与其他字符相邻，中间要加空格
    if [ -n "$user_name" ];then
    	echo $user_name;
    	exit 0
    else
    	echo "you do not enter username"
    	exit 1
    fi
    ```

- 命令行参数
    ```shell
    #!/bin/bash
    echo "脚本名字:$0"
    echo "第一个参数:$1"
    echo "总共的参数个数:$#"
    echo "全部参数:$*"

    ```
    ```shell
    ➜  shell ./params aa bb cc
    脚本名字:./params
    第一个参数:aa
    总共的参数个数:3
    全部参数:aa bb cc
    ```

- 函数和局部变量
    ```bash
    #!/bin/bash
    function localizer {
    	echo "全局变量的a是${a}"
        #声明局部变量
    	local a="local a"
    	echo "局部变量a是$a"
    }

    a="global a"

    #调用函数
    localizer
    echo "调用完函数后的a是$a"
    ```

    ```
    ➜  shell ./localizer
    全局变量的a是global a
    局部变量a是local a
    调用完函数后的a是global a
    ```

- 控制流程
    ```bash
    #!/bin/bash
    a=10
    b=10
    if [ $a == $b ] && [ -n $a ]
    then
       echo "a 等于 b"
    elif [ $a -gt $b ]
    then
       echo "a 大于 b"
    elif [ $a -lt $b ]
    then
       echo "a 小于 b"
    else
       echo "没有符合的条件"
    fi
    ```

    ```bash
    /bin/test命令,[]是调用test命令的一种快捷方式
    x -eq y : x=y
    x -ne y : x!=y
    x -lt y : x<y
    x -le y : x<=y
    x -gt y : x>y
    x -ge y : x>=y
    -n x : x 不为空
    -z x : x 为空
    -d file : file是目录
    -e file : file存在
    -f file : file存在且是普通文件
    -s file : file存在且不为空
    -r file : 用户有file文件的读权限
    -w file : 用户有file文件的写权限
    file1 -nt file2 : file1比file2新
    file1 -ot file2 : file1比file2旧
    ```

- case 语句
    ```bash
    #!/bin/bash
    a=1
    case $a in
    0)
    echo "就是0嘛"
    ;;
    1)
    echo "就是1嘛"
    echo "再输出一句"
    ;;
    *)
    echo "就是其他嘛"
    ;;
    esac
    ```

- for 循环，in后面是一个模式，它能匹配当前目录下能够匹配的文件列表，实际上，任何以空白分割的对象列表，包括一个变量的内容，都可以充当`for...in`语句的主体

    ```bash
    #!/bin/bash
    for script in *
    do
    	echo $script
    done
    ```

    ```
    ➜  shell ./while
    case
    ifelse
    localizer
    params
    perl
    python
    read
    while
    ```

- while

    ```bash
    #!/bin/bash
    exec 0<$1
    counter=1
    while read line
    do
    	echo "$counter : $line"
    	counter=`expr $counter + 1`
    done
    ```

    `exec 0<$1`将标准输入变成第一个参数，所以第一个参数必须是文件，否则会出错
    `read line`就是读取文件里的一行数据，进行处理,加上`while`就是依次读取了
    `expr $counter + 1` 是shell的算术处理方法

- 数组和算术
    - shell里`+`只是一个普通的字符，没有任何其他含义
    - shell里数组基本没啥用


# 正则表达式
- 正则表达式要区分于shell的通配符匹配
- 普通字符匹配
    ```
    i am codekissyoung
    ```
- 特殊字符匹配
    ```
    . 匹配任何字符
    [chars] 匹配任何给定字符集里面的字符
    [^chars] 匹配给定字符集之外的字符
    ^ 匹配行首
    $ 匹配行尾
    \w 匹配[A-Za-z0=9]
    \s 匹配空白 [\f\t\n\r]
    \d 匹配数组 [0-9]
    | 匹配左边或者右边的任何一个
    (expr) 限定范围，元素成组,从而可以捕获到匹配
    ```

- 数量匹配
    ```
    ? 匹配前面元素的 0 个或者 1个
    * 任意个
    + 1个或者多个
    {n} n 个
    {min,} min 个以上
    {min,max} min 到 max 之间个
    ```
- 示例
    ```
    i am (codekissyoung|caokaiyan)\.
    匹配：i am codekissyoung. 和 i am caokaiyan.
    (i am (codekissyoung|caokaiyan)\.){1,2}
    匹配：i am codekissyoung. 和 i am caokaiyan. 和 i am codekissyoung.i am caokaiyan. 和 i am codekissyoung.i am codekissyoung. 等
    ```

- 捕获
每个`()`里面内容的匹配称为捕获，是实现正则表达式的内部机理，不做过于深入

- 贪心 懒惰 和 灾难性的回溯
简单的说，贪心就是尽量多匹配几个字符，懒惰就是尽量少匹配几个

# Python 脚本
- 缩行代表逻辑块
    ```python
    #!/usr/bin/python
    #coding=utf-8
    import sys
    a = sys.argv[1]
    if a == "1":
    	print 'a is one'
    	print 'if 汉子'
    else:
    	print 'a is ',a
    	print "else"
    print "after if else"
    ```
# 引导过程
1. 从MBR读取引导程序 boot loader
1. 加载初始化内核
1. 检测和配置设备
1. 创建内核进程 init 进程 PID 为 1
1. 单用户模式下 管理员还可干预
1. 执行系统启动初始化脚本

# 引导PC
1. PC通电后，是从执行保存在ROM中的代码开始的，在专门为Unix设计的机器中，这种代码可能就是硬件
1. 而在PC上，这种代码通常就叫做 BIOS (Basic Input Output System)
1. 实际上PC有几个层面上的BIOS, 本身一个,显卡一个,SCSI卡一个,网卡一个
1. BIOS 通常让用户选择从什么设备进行引导.比如"从DVD光驱引导,尝试从USB设备引导,尝试从硬盘引导,用PXE从网络引导"
1. BIOS 一旦确定从哪个设备引导系统，就会尝试加载设备上开头的 `512字节` 信息，这个数据段就称为MBR(Master Boot Record) 主引导记录, 它记录了要到哪个分区下面加载内核的 "bootloader (引导加载程序)"
1. 最后由 "bootloader" 去引导加载内核


# 初始化内核
- 内核 `/vmlinuz` 或者 `/boot/vmlinuz` , 系统引导的第一项目录就是将这个程序载入内存执行
1. ROM 首先运行的是bootloader，再由它安排载入内核
- 内核探测程序再运行，判断出物理内存总量，划分给内核多少，留给用户程序多少
- 再接着就是配置硬件，系统检测各种物理硬件，记录信息，并配置好

# 创建内核进程
- 自发进程，不是用 `fork` 创建的
- 内核进程都带 `[]` 括号 , `[kworker/0]` 后面的数字说明它在哪颗处理器运行
```
➜  blog git:(master) ✗ sudo ps -aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.0 205360  7596 ?        Ss   11:36   0:02 /sbin/init splash
root         2  0.0  0.0      0     0 ?        S    11:36   0:00 [kthreadd]
root         4  0.0  0.0      0     0 ?        S<   11:36   0:00 [kworker/0:0H]
root         6  0.0  0.0      0     0 ?        S    11:36   0:00 [ksoftirqd/0]
root         7  0.0  0.0      0     0 ?        S    11:36   0:12 [rcu_sched]
root         8  0.0  0.0      0     0 ?        S    11:36   0:00 [rcu_bh]
root         9  0.0  0.0      0     0 ?        S    11:36   0:00 [migration/0]
root        10  0.0  0.0      0     0 ?        S<   11:36   0:00 [lru-add-drain]
...
systemd+   661  0.0  0.0 129796  4508 ?        Ssl  11:36   0:00 /lib/systemd/systemd-timesyncd
root       777  0.0  0.1 1094332 11332 ?       Ssl  11:37   0:00 /usr/sbin/repowerd
root       785  0.0  0.0  32872  2984 ?        Ss   11:37   0:00 /usr/sbin/cron -f
root       787  0.0  0.1 422808  9256 ?        Ssl  11:37   0:00 /usr/sbin/ModemManager
root       842  0.0  0.0   4388  1304 ?        Ss   11:37   0:00 /usr/sbin/acpid
syslog     847  0.0  0.0 256416  3336 ?        Ssl  11:37   0:00 /usr/sbin/rsyslogd -n
root       848  0.0  0.0  46652  4700 ?        Ss   11:37   0:00 /lib/systemd/systemd-logind
whoopsie   850  0.0  0.2 390876 16516 ?        Ssl  11:37   0:00 /usr/bin/whoopsie -f
root       853  0.0  0.1 177300  9104 ?        Ssl  11:37   0:01 /usr/sbin/thermald --no-daemon --dbus-enable
```


# 进程组成部分 (内核的内部数据结构记录的)
- 进程地址空间映射
- 当前状态(睡眠 停止 可运行)
- 进程优先级
- 进程已用资源信息
- 进程打开的文件和网络端口信息
- 进程的信号掩码 (一个记录 确定要封锁哪些信号)
- 进程的属主

# PID

# PPID
- linux 没有提供创建新进程去运行某个特定程序的系统调用，现有进程必须克隆自身去创建一个新进程，克隆出的进程能够把它正在运行的那个程序替换成另一个不同程序
- 新进程的 PPID 就是那个克隆自身的进程的PID, 它可以用来回溯进程的来源(是一个shell还是另一个程序)

# UID 和 EUID
- 进程的所属用户  和  有效所属用户

# GID 和 EGID
- 进程的用户组ID 和 有效用户组ID

# 进程的生命周期
- 进程 A 调用 `fork` 来复制自身,得到进程 B , 对于 A 进程 fork 返回 B 的PID,对于B 进程 fork 返回 0
- `fork`之后 , B 进程可以调用 `exec`族 函数 , 来执行新的程序, 这些调用能改变 B 进程的 .text (程序正文)，并把内存段重置为预先定义的初始状态
- 除了内核在初始化时创建的几个内核进程, 其余的进程都是 `init` 进程的子进程
- B 进程调用 `_exit` 例程来通知内核 结束进程 , A 进程必须调用 wait 来确认 B 的结束, 但是如果 A 进程已经早于 B 进程结束的话，B 进程就成了孤儿进程, 则由 `init` 来成为B的父进程 , 调用`wait`来清理

# 信号
- 信号是进程级的中断请求
- 作为一种通信手段，进程之间可以发送信号
- 当输入`Ctrl + C` `Ctrl + z`时，可以由终端驱动程序发送信号去终止/中断/挂起进程
- 可以由管理员 使用 kill 发送信号来达到各种效果
- 当进程出错，比如`0作除数`,可以由进程来发送信号
- 可以由内核发送信号，通知一个进程 "有受关注的条件"出现，比如子进程死亡，或者I/O通道上有数据
- 进程收到信号后，可以调用自身已经写好的处理这个信号的例程来处理
- 当然，如果没有写处理例程的话，内核就会代表该进程采取默认措施，比如有些信号会终止进程
- 有些信号就会产生 core 文件 (内存转储文件 core dump), 就是将当时进程的内存状态保存下来， core 理解为内存 ，是旧词沿用下来的含义
- 为了防止收到信号，进程也可以选择 ignore 或者 block 某些信号，
- `kill -l` 可以查看有哪些信号
    ```
    ➜  blog git:(master) kill -l
    HUP INT QUIT ILL TRAP ABRT BUS FPE KILL USR1 SEGV USR2 PIPE ALRM TERM STKFLT CHLD CONT STOP TSTP TTIN TTOU URG XCPU XFSZ VTALRM PROF WINCH POLL PWR SYS
    ```
- KILL 不可以Block(封锁),它直接在内核层面终止进程
- INT 中断 `Ctrl + C`发送的信号
- TERM 软件终止 进程清除自己的状态并且退出
- HUP 挂起
- QUIT 退出
- `kill [-signal] PID` 给某个进程发送信号 , 如 `kill -9 20395`

# 进程的状态
- Runnable 可运行 进程已经准备好运行了
- Sleeping 睡眠 ， 进程在等待某些资源
- Zombie , 进程试图消亡
- Stopped , 进程被挂起 不允许执行


# nice 和 renice 影响调度优先级
- `nice -n 5 ~/bin/longtask` 将谦让度设置为 5 , 即让其他进程优先执行
- `renice -5 8809` 将谦让值设置为 -5 , 即抢占执行
- `renice 5 -u cky` 将cky的程序的谦让度设置为5


# ps 监视进程
- `ps aux` 了解正在系统上运行的所有进程的全貌
- `ps lax` 长模式 ，显示了 PPID 谦让值 NI 进程正在等待的资源

# top 监视进程


# /proc 文件系统
- ps 和 top 都是从 /proc 目录里面读取的进程状态信息, 内核把有关系统状态的各种信息都写在这个目录里面了
- 可以通过向 /proc 下适当文件写入数据来修改某些参数
```
➜  ~ cat /proc/version
Linux version 4.10.0-21-generic (buildd@lgw01-12) (gcc version 6.3.0 20170406 (Ubuntu 6.3.0-12ubuntu2) ) #23-Ubuntu SMP Fri Apr 28 16:14:22 UTC 2017
```

# strace 追踪某个进程的信号和系统调用
```c
➜  ~ sudo strace -p 7777
[sudo] cky 的密码：
strace: Process 7777 attached
restart_syscall(<... resuming interrupted poll ...>) = 0
recvmsg(30, 0x7ffc38c36be0, 0)          = -1 EAGAIN (Resource temporarily unavailable)
write(41, "!", 1)                       = 1
write(41, "!", 1)                       = 1
recvmsg(18, 0x7ffc38c36ba0, 0)          = -1 EAGAIN (Resource temporarily unavailable)
recvmsg(30, 0x7ffc38c36bb0, 0)          = -1 EAGAIN (Resource temporarily unavailable)
poll([{fd=18, events=POLLIN}, {fd=19, events=POLLIN}, {fd=23, events=POLLIN}, {fd=30, events=POLLIN}, {fd=33, events=POLLIN}, {fd=40, events=POLLIN}], 6, 0) = 1 ([{fd=40, revents=POLLIN}])
recvmsg(30, 0x7ffc38c36be0, 0)          = -1 EAGAIN (Resource temporarily unavailable)
read(40, "!!", 2)                       = 2
recvmsg(18, 0x7ffc38c36ba0, 0)          = -1 EAGAIN (Resource temporarily unavailable)
recvmsg(30, 0x7ffc38c36bb0, 0)          = -1 EAGAIN (Resource temporarily unavailable)
poll([{fd=18, events=POLLIN}, {fd=19, events=POLLIN}, {fd=23, events=POLLIN}, {fd=30, events=POLLIN}, {fd=33, events=POLLIN}, {fd=40, events=POLLIN}], 6, 0) = 0 (Timeout)
recvmsg(30, 0x7ffc38c36be0, 0)          = -1 EAGAIN (Resource temporarily unavailable)
recvmsg(18, 0x7ffc38c36ba0, 0)          = -1 EAGAIN (Resource temporarily unavailable)
recvmsg(30, 0x7ffc38c36bb0, 0)          = -1 EAGAIN (Resource temporarily unavailable)
poll([{fd=18, events=POLLIN}, {fd=19, events=POLLIN}, {fd=23, events=POLLIN}, {fd=30, events=POLLIN}, {fd=33, events=POLLIN}, {fd=40, events=POLLIN}], 6, 499) = 0 (Timeout)
recvmsg(30, 0x7ffc38c36be0, 0)          = -1 EAGAIN (Resource temporarily unavailable)
write(41, "!", 1)                       = 1
write(41, "!", 1)                       = 1
```

# 挂载和卸载文件系统

文件树,文件系统并不是一回事儿,每个设备的文件系统都可能不太一样，但是它们都可以挂载在文件树上，通过通用的文件树来访问它们

```
sudo mount /dev/hda4 /users /* 将设备hda4挂载在 /users目录上 */
```
