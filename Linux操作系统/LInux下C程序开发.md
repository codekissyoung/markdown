# Linux下C程序开发

本文记录我在 `Linux` 下开发 `C` 程序用到的知识。


## 匿名半双工管道

```c
#define PIPE_BUF 255
int main( int argc, char *argv[] )
{
    int fd[2];
    pipe( fd ); // 创建匿名半双工管道
    pid_t pid = fork();
    if( pid > 0 ) 
    {   
        close( fd[0] ); // 父进程关闭 读出端
        write( fd[1] , "hello my son \n ",14);
        exit(0);
    }   
    else
    {   
        close( fd[1] ); // 子进程关闭 写入端
        char buf[ PIPE_BUF ];
        int len = read( fd[0], buf, PIPE_BUF );

        write( STDOUT_FILENO, buf, len );
        exit(0);
    }   
}
```
- 数据只能在一个方向移动
- 只能在有公共祖先的进程间通信，比如父子进程，兄弟进程
- `fd[2]`是一个文件描述符数组，`fd[0]`是读出端，`fd[1]`是写入端

## FIFO 有名管道 (进程通信代码并没有达到预期的效果)

```c
#include <sys/types.h>
#include <sys/stat.h>
int mkfifo(const char *filename, mode_t mode); # 创建有名管道
```
```c
#define BUFES PIPE_BUF

int main( int argc, char* argv[] )
{
    int fd; 
    int len = 0;
    char buf[BUFES];

    if( ( fd = open( "/home/cky/workspace/C/IPC/fifo1", O_RDONLY ) ) < 0 ) 
    {   
        perror("open error\n");
        exit(1);
    }   

    while( ( len = read( fd, buf, BUFES ) ) > 0 ) 
    {   
        printf("read info from fifo1 : %s\n", buf );
    }   
    printf("hehe");
    close( fd );
    return 0;
}
```
```c
#define BUFES 256

int main( int argc, char* argv[] )
{
    int fd;
    int n,i;
    char buf[BUFES];
    time_t tp;

    printf("I am %d \n", getpid() );

    if( ( fd == open( "/home/cky/workspace/C/IPC/fifo1",O_WRONLY) ) < 0 )
    {
        perror("open");
        exit(1);
    }
    for( i = 0; i < 10; i++ )
    {
        time( &tp );
        n = sprintf( buf, "write info : %d sends %s", getpid(), ctime(&tp) );

        if( write( fd, buf, n + 1 ) < 0 )
        {
            perror("write error\n");
            close( fd );
            exit(1);
        }
        sleep( 3 );
    }
    close( fd );
    exit(0);
}
```
- 可以用于不相关的进程之间
- [参考](https://www.cnblogs.com/fangshenghui/p/4039805.html)

## System V IPC / POSIX IPC

- 基于系统内核
- IPC 对象 : 消息队列 , 信号量 , 共享存储器
- `ipcs -a` 查看系统内IPC的状态
- 缺陷: 不使用通用的文件系统 , 缺少资源回收机制, IPC 对象创建然后退出时, 没有被自动回收

## 共享内存

```c
#include <sys/shm.h>
int shmget( key_t key, size_t size, int flag ); // 创建一块共享内存区
int shmctl( int shm_id, int cmd, struct shmid_ds *buf ); // 对共享内存段进行多种操作
void *shmat( int shm_id, const void *addr, int flag ); // 将一个存在的共享内存段连接到本进程空间
int  shmdt( void *addr ); // 当对共享内存段操作结束时，调用本函数将指定的共享内存段从当前进程空间中脱离出去
```

```c
int main( int argc, char* argv[] )
{
    int shm_id;
    char* shm_buf;

    shm_id = atoi( argv[1] );

    if( (shm_buf = shmat( shm_id, 0, 0 ) ) < (char *)0 )
    {   
        perror( "shmat");
        exit(1);
    }   

    printf( "segment attachted at %p \n", shm_buf );
    system( "ipcs -m" );

    sleep( 3 );

    if( shmdt(shm_buf) < 0 ) 
    {   
        perror("shmdt error\n");
        exit(1);
    }   

    printf( "Segment detached \n" );
    system( "ipcs -m" );

    exit( 0 );
}
```
- 内核通过分页机制，将一段内存同时分配给不同的进程
- 共享内存只提供数据的传送，进程之间的读写操作互斥的控制还需要其他辅助工具

## 信号量
```c
#include <sys/shm.h>
int semget( key_t key, int nsems, int flag ); // 创建一个信号量集ID
int semop( int semid, struct sembuf semoparray[], size_t nops ); // 操作一个信号量集
int semctl( int sem_id, int semnu, int cmd [, union semun arg]); // 信号量的专属操作函数
```
- 信号量是一种外部资源的标识，用于判断资源是否可用，负责数据操作的互斥 同步等功能
- 请求一个使用信号量来表示的资源时，信号量的值大于 0 表明可用，等于 0 表明无可用资源
- 原理：数据操作锁，本身不具有数据交换的功能，而是通过控制其他的通信资源，来实现进程间通信

## 消息队列
- 消息队列：一个消息的链接表，由内核进行维护及存储
- 在消息队列中，可以随意根据特定的数据类型来检索消息

```c
#include <sys/msg.h>
int msgget( key_t key, int flags ); // 创建或者打开一个队列
int msgctl( int msqid, int cmd, struct msqid_ds* buf ); // 在队列上做多种操作
int msgsnd( int msqid, const void* prt, size_t nbytes, int flags ); // 将一个新的消息写入消息队列
ssize_t msgrcv( int msqid ,void* prt, size_t nbytes, long type, int flag ); // 从消息队列中读取消息
```

# SOCK_STREAM
- 表示面向连接的数据传输方式数据 可以准确无误地到达另一台计算机，如果损坏或丢失，可以重新发送，但效率相对较慢常见的 http 协议就使用 SOCK_STREAM 传输数据，因为要确保数据的正确性，否则网页不能正常解析

# SOCK_DGRAM
- 表示无连接的数据传输方式 计算机只管传输数据，不作数据校验，如果数据在传输中损坏，或者没有到达另一台计算机，是没有办法补救的也就是说，数据错了就错了，无法重传因为 SOCK_DGRAM 所做的校验工作少，所以效率比 SOCK_STREAM 高

# AF_INET
- 表示 IPv4 地址，例如 `127.0.0.1`

# AF_INET6
- 表示 IPv6 地址，例如 `1030::C9B4:FF12:48AA:1A2B`

# IPPROTO_TCP
- TCP 传输协议

# IPPTOTO_UDP
- UDP 传输协议

```c
int tcp_socket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP); // TCP 套接字
int udp_socket = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);  // UDP 套接字
```

# 链接
```c
int connect(int sock, struct sockaddr *serv_addr, socklen_t addrlen);
```

```c
struct sockaddr
{
    //地址族，2字节
    unsigned short sa_family;
    //存放地址和端口，14字节
    char sa_data[14];
}

struct sockaddr_in
{
    //地址族
    short int sin_family;
    //端口号(使用网络字节序)
    unsigned short int sin_port;
    //地址
    struct in_addr sin_addr;
    //8字节数组，全为0，该字节数组的作用只是为了让两种数据结构大小相同而保留的空字节
    unsigned char sin_zero[8]
}
```

## Socket 通信简单过程

当客户端和服务器使用TCP协议进行通信时，客户端封装一个请求对象req，将请求对象req序列化成字节数组，然后通过套接字socket将字节数组发送到服务器，服务器通过套接字socket读取到字节数组，再反序列化成请求对象req，进行处理，处理完毕后，生成一个响应对应res，将响应对象res序列化成字节数组，然后通过套接字将自己数组发送给客户端，客户端通过套接字socket读取到自己数组，再反序列化成响应对象。

通信框架往往可以将序列化的过程隐藏起来，我们所看到的现象就是上图所示，请求对象req和响应对象res在客户端和服务器之间跑来跑去。

也许你觉得这个过程还是挺简单的，很好理解，但是实际上背后发生的一系列事件超出了你们中大多数人的想象。通信的真实过程要比上面的这张图复杂太多。你也许会问，我们需要了解的那么深入么，直接拿来用不就可以了么？

在互联网技术服务行业工作多年的经验告诉我，如果你对底层机制不了解，你就会不明白为什么对套接字socket的读写会出现各种奇奇乖乖的问题，为什么有时会阻塞，有时又不阻塞，有时候还报错，为什么会有粘包半包问题，NIO具体又是什么，它是什么特别新鲜的技术么？对于这些问题的理解都需要你了解底层机制。

## Socket 细节过程

![640.gif](https://i.loli.net/2018/12/07/5c0a0fd543c3f.gif)

我们平时用到的套接字其实只是一个引用(一个对象ID)，这个套接字对象实际上是放在操作系统内核中。这个套接字对象内部有两个重要的缓冲结构，一个是读缓冲(read buffer)，一个是写缓冲(write buffer)，它们都是有限大小的数组结构。

当我们对客户端的socket写入字节数组时(序列化后的请求消息对象req)，是将字节数组拷贝到内核区套接字对象的write buffer中，内核网络模块会有单独的线程负责不停地将write buffer的数据拷贝到网卡硬件，网卡硬件再将数据送到网线，经过一些列路由器交换机，最终送达服务器的网卡硬件中。

同样，服务器内核的网络模块也会有单独的线程不停地将收到的数据拷贝到套接字的read buffer中等待用户层来读取。最终服务器的用户进程通过socket引用的read方法将read buffer中的数据拷贝到用户程序内存中进行反序列化成请求对象进行处理。然后服务器将处理后的响应对象走一个相反的流程发送给客户端，这里就不再具体描述。

### 阻塞

我们注意到write buffer空间都是有限的，所以如果应用程序往套接字里写的太快，这个空间是会满的。一旦满了，写操作就会阻塞，直到这个空间有足够的位置腾出来。不过有了NIO(非阻塞IO)，写操作也可以不阻塞，能写多少是多少，通过返回值来确定到底写进去多少，那些没有写进去的内容用户程序会缓存起来，后续会继续重试写入。

同样我们也注意到read buffer的内容可能会是空的。这样套接字的读操作(一般是读一个定长的字节数组)也会阻塞，直到read buffer中有了足够的内容(填充满字节数组)才会返回。有了NIO，就可以有多少读多少，无须阻塞了。读不够的，后续会继续尝试读取。

### ack

那上面这张图就展现了套接字的全部过程么？显然不是，数据的确认过程(ack)就完全没有展现。比如当写缓冲的内容拷贝到网卡后，是不会立即从写缓冲中将这些拷贝的内容移除的，而要等待对方的ack过来之后才会移除。如果网络状况不好，ack迟迟不过来，写缓冲很快就会满的。

### 包头

细心的同学可能注意到图中的消息req被拷贝到网卡的时候变成了大写的REQ，这是为什么呢？因为这两个东西已经不是完全一样的了。内核的网络模块会将缓冲区的消息进行分块传输，如果缓冲区的内容太大，是会被拆分成多个独立的小消息包的。并且还要在每个消息包上附加上一些额外的头信息，比如源网卡地址和目标网卡地址、消息的序号等信息，到了接收端需要对这些消息包进行重新排序组装去头后才会扔进读缓冲中。这些复杂的细节过程就非常难以在动画上予以呈现了。

### 速率

还有个问题那就是如果读缓冲满了怎么办，网卡收到了对方的消息要怎么处理？一般的做法就是丢弃掉不给对方ack，对方如果发现ack迟迟没有来，就会重发消息。那缓冲为什么会满？是因为消息接收方处理的慢而发送方生产的消息太快了，这时候tcp协议就会有个动态窗口调整算法来限制发送方的发送速率，使得收发效率趋于匹配。如果是udp协议的话，消息一丢那就彻底丢了。

# linux c 系统调用列表

## 进程控制

```c
fork    创建一个新进程
clone   按指定条件创建子进程
execve  运行可执行文件
exit    中止进程
_exit   立即中止当前进程
getdtablesize   进程所能打开的最大文件数
getpgid     获取指定进程组标识号
setpgid     设置指定进程组标志号
getpgrp     获取当前进程组标识号
setpgrp     设置当前进程组标志号
getpid  获取进程标识号
getppid     获取父进程标识号
getpriority     获取调度优先级
setpriority     设置调度优先级
modify_ldt  读写进程的本地描述表
nanosleep   使进程睡眠指定的时间
nice    改变分时进程的优先级
pause   挂起进程，等待信号
personality     设置进程运行域
prctl   对进程进行特定操作
ptrace  进程跟踪
sched_get_priority_max  取得静态优先级的上限
sched_get_priority_min  取得静态优先级的下限
sched_getparam  取得进程的调度参数
sched_getscheduler  取得指定进程的调度策略
sched_rr_get_interval   取得按RR算法调度的实时进程的时间片长度
sched_setparam  设置进程的调度参数
sched_setscheduler  设置指定进程的调度策略和参数
sched_yield     进程主动让出处理器,并将自己等候调度队列队尾
vfork   创建一个子进程，以供执行新程序，常与execve等同时使用
wait    等待子进程终止
wait3   参见wait
waitpid     等待指定子进程终止
wait4   参见waitpid
capget  获取进程权限
capset  设置进程权限
getsid  获取会晤标识号
setsid  设置会晤标识号
```

## 文件系统控制

```c
1、文件读写操作
fcntl   文件控制
open    打开文件
creat   创建新文件
close   关闭文件描述字
read    读文件
write   写文件
readv   从文件读入数据到缓冲数组中
writev  将缓冲数组里的数据写入文件
pread   对文件随机读
pwrite  对文件随机写
lseek   移动文件指针
_llseek     在64位地址空间里移动文件指针
dup     复制已打开的文件描述字
dup2    按指定条件复制文件描述字
flock   文件加/解锁
poll    I/O多路转换
truncate    截断文件
ftruncate   参见truncate
umask   设置文件权限掩码
fsync   把文件在内存中的部分写回磁盘

access  确定文件的可存取性
chdir   改变当前工作目录
fchdir  参见chdir
chmod   改变文件方式
fchmod  参见chmod
chown   改变文件的属主或用户组
fchown  参见chown
lchown  参见chown
chroot  改变根目录
stat    取文件状态信息
lstat   参见stat
fstat   参见stat
statfs  取文件系统信息
fstatfs     参见statfs
readdir     读取目录项
getdents    读取目录项
mkdir   创建目录
mknod   创建索引节点
rmdir   删除目录
rename  文件改名
link    创建链接
symlink     创建符号链接
unlink  删除链接
readlink    读符号链接的值
mount   安装文件系统
umount  卸下文件系统
ustat   取文件系统信息
utime   改变文件的访问修改时间
utimes  参见utime
quotactl    控制磁盘配额
```

## 系统控制

```c
ioctl   I/O总控制函数
_sysctl     读/写系统参数
acct    启用或禁止进程记账
getrlimit   获取系统资源上限
setrlimit   设置系统资源上限
getrusage   获取系统资源使用情况
uselib  选择要使用的二进制函数库
ioperm  设置端口I/O权限
iopl    改变进程I/O权限级别
outb    低级端口操作
reboot  重新启动
swapon  打开交换文件和设备
swapoff     关闭交换文件和设备
bdflush     控制bdflush守护进程
sysfs   取核心支持的文件系统类型
sysinfo     取得系统信息
adjtimex    调整系统时钟
alarm   设置进程的闹钟
getitimer   获取计时器值
setitimer   设置计时器值
gettimeofday    取时间和时区
settimeofday    设置时间和时区
stime   设置系统日期和时间
time    取得系统时间
times   取进程运行时间
uname   获取当前UNIX系统的名称、版本和主机等信息
vhangup     挂起当前终端
nfsservctl  对NFS守护进程进行控制
vm86    进入模拟8086模式
create_module   创建可装载的模块项
delete_module   删除可装载的模块项
init_module     初始化模块
query_module    查询模块信息
*get_kernel_syms    取得核心符号,已被query_module代替
```

## 内存控制

```c
brk     改变数据段空间的分配
sbrk    参见brk
mlock   内存页面加锁
munlock     内存页面解锁
mlockall    调用进程所有内存页面加锁
munlockall  调用进程所有内存页面解锁
mmap    映射虚拟内存页
munmap  去除内存页映射
mremap  重新映射虚拟内存地址
msync   将映射内存中的数据写回磁盘
mprotect    设置内存映像保护
getpagesize     获取页面大小
sync    将内存缓冲区数据写回硬盘
cacheflush  将指定缓冲区中的内容写回磁盘
```

## 网络管理

```c
getdomainname   取域名
setdomainname   设置域名
gethostid   获取主机标识号
sethostid   设置主机标识号
gethostname     获取本主机名称
sethostname     设置主机名称
```

## socket通信

```c
socketcall  socket系统调用
socket  建立socket
bind    绑定socket到端口
connect     连接远程主机
accept  响应socket连接请求
send    通过socket发送信息
sendto  发送UDP信息
sendmsg     参见send
recv    通过socket接收信息
recvfrom    接收UDP信息
recvmsg     参见recv
listen  监听socket端口
select  对多路同步I/O进行轮询
shutdown    关闭socket上的连接
getsockname     取得本地socket名字
getpeername     获取通信对方的socket名字
getsockopt  取端口设置
setsockopt  设置端口参数
sendfile    在文件或端口间传输数据
socketpair  创建一对已联接的无名socket
```

## 用户管理

```c
getuid  获取用户标识号
setuid  设置用户标志号
getgid  获取组标识号
setgid  设置组标志号
getegid     获取有效组标识号
setegid     设置有效组标识号
geteuid     获取有效用户标识号
seteuid     设置有效用户标识号
setregid    分别设置真实和有效的的组标识号
setreuid    分别设置真实和有效的用户标识号
getresgid   分别获取真实的,有效的和保存过的组标识号
setresgid   分别设置真实的,有效的和保存过的组标识号
getresuid   分别获取真实的,有效的和保存过的用户标识号
setresuid   分别设置真实的,有效的和保存过的用户标识号
setfsgid    设置文件系统检查时使用的组标识号
setfsuid    设置文件系统检查时使用的用户标识号
getgroups   获取后补组标志清单
setgroups   设置后补组标志清单
```

## 进程间通信

```c
ipc     进程间通信总控制调用
1、信号
sigaction   设置对指定信号的处理方法
sigprocmask     根据参数对信号集中的信号执行阻塞/解除阻塞等操作
sigpending  为指定的被阻塞信号设置队列
sigsuspend  挂起进程等待特定信号
signal  参见signal
kill    向进程或进程组发信号
*sigblock   向被阻塞信号掩码中添加信号,已被sigprocmask代替
*siggetmask     取得现有阻塞信号掩码,已被sigprocmask代替
*sigsetmask     用给定信号掩码替换现有阻塞信号掩码,已被sigprocmask代替
*sigmask    将给定的信号转化为掩码,已被sigprocmask代替
*sigpause   作用同sigsuspend,已被sigsuspend代替
sigvec  为兼容BSD而设的信号处理函数,作用类似sigaction
ssetmask    ANSI C的信号处理函数,作用类似sigaction


2、消息
msgctl  消息控制操作
msgget  获取消息队列
msgsnd  发消息
msgrcv  取消息


3、管道
pipe    创建管道


4、信号量
semctl  信号量控制
semget  获取一组信号量
semop   信号量操作


5、共享内存
shmctl  控制共享内存
shmget  获取共享内存
shmat   连接共享内存
shmdt   拆卸共享内存
```

## 系统时间

```c
time_t time( time_t *calptr );
```

- return
  - 成功 返回时间值
  - 失败 -1

```c
int clock_gettime( clockid_t clock_id, struct timespec *tsp );
int clock_settime( clockid_t clock_id, const struct timespec *tsp );
int gettimeofday( struct timeval *restrict tp, void *restrict tzp );
struct tm *gmtime( const time_t *calptr );
struct tm *localtime( const time_t *calptr );
time_t mktime( struct tm*tmptr );
size_t strftime( char *restrict buf, size_t maxsize,
                const char *restrict format, const struct tm *restrict tmptr );
size_t strftime_l( char *restrict buf, size_t maxsize,
                const char *restrict format, const struct tm *restrict tmptr, locale_t locale );
```

![WX20181210-195314.png](https://i.loli.net/2018/12/10/5c0e53e570c5b.png)

# 设备文件
- linux将设备也抽象成文件 : 文件包含数据，具有属性，通过目录中的名字被标识，可以从一个设备文件中读数据，也可以写数据
- 每个设备都被当做一个文件 : 有一个文件名，一个`i-node`,一个文件所有者，一个权限位的集合 和 最近修改时间
- 通常表示设备的文件存放在 `/dev` 目录中
- 设备文件支持所有文件相关的系统调用 : `open` `read` `write` `lseek` `close` `stat`
```c
# 从磁带读取数据
int fd = open("/dev/tape",O_RDONLY);
lseek(fd,(long)4096,SEEK_SET);
n = read(fd,buf,buflen);
close(fd);
```
- 但是也要考虑实际情况: `/dev/mouse`不支持所有`write`系统调用，终端`/dev/pts/3`支持`read`和`write`,但不支持`lseek`
- `tty` 命令 : 打印用户所在终端对应的 设备文件名
```bash
➜  ~ tty
/dev/pts/6
➜  ~ who > /dev/pts/6
cky      pts/0        2018-04-11 10:24 (183.15.176.171)
zj       pts/1        2017-08-12 19:16 (tmux(21653).%1)
cky      pts/2        2018-01-12 16:59 (tmux(8156).%0)
cky      pts/3        2018-04-11 10:24 (183.15.176.171)
cky      pts/4        2018-04-11 10:58 (183.15.176.171)
➜  pts ls -alhi /dev/pts
总用量 0
 1 drwxr-xr-x  2 root  root       0 12月 12  2016 .
 2 drwxr-xr-x 19 root  root    4.8K 4月  17  2017 ..
 3 crw--w----  1 cky   tty  136,  0 4月  11 14:42 0
 4 crw--w----  1 zj    tty  136,  1 8月  12  2017 1
14 crw--w----  1 zj    tty  136, 11 4月  11 14:47 11
 5 crw--w----  1 cky   tty  136,  2 4月  10 14:43 2
 6 crw--w----  1 cky   tty  136,  3 4月  11 10:58 3
 7 crw--w----  1 cky   tty  136,  4 4月  11 11:00 4
 8 crw--w----  1 meizi tty  136,  5 8月  19  2017 5
 9 crw--w----  1 cky   tty  136,  6 4月  11 14:58 6
11 crw--w----  1 zj    tty  136,  8 8月  11  2017 8
12 crw--w----  1 zj    tty  136,  9 10月  8  2017 9
 2 c---------  1 root  root   5,  2 12月 12  2016 ptmx
```

- 设备文件是链接,设备的`i-node`存的是指向内核子程序的指针，而不是文件的属性和存储列表，从终端进行数据传输的代码是在设备进程表中编号为`136`的子程序,该子程序接受一个整形参数，在`/dev/pts/2`中参数是2,`136`和`2`被称为主设备号和从设备号, 主设备号 确定处理该设备实际的子程序，从设备号则作为参数传入该子程序

- 设备文件的权限位 : 写权限意味着允许向设备发送数据。读权限就是从设备获得数据

- 目录并不能区分哪些文件名 是 磁盘文件 和 设备文件。文件类型的区别提醒在`i-node`上。文件的类型被记录在`i-node`的`stat`成员变量`st_mode`中
    - 磁盘文件的`i-节点`包含指向数据块的指针列表
    - 设备文件的`i-节点`包含指向内核中设备驱动器的指针 ，主设备号用于告知从设备中读取数据的那部分代码的位置

- `read()`工作: 内核首先找到文件描述符的`i-node`,判断该文件的类型。
    - 如果是磁盘文件，则访问块分配表来读取数据。
    - 如果是设备文件，则调用该设备驱动程序的`read`部分来读取数据。

- 磁盘文件的连接 与 终端的链接不同
    - 磁盘文件的链接有缓冲区，从进程到磁盘的字节先被缓冲到内核缓冲区，然后才从内核被发送出去。
    ```c
    // 关闭磁盘缓冲
    #include <fcntl.h>
    int s = fcntl(fd,F_GETFL); // 获取设置
    s |= O_SYNC;  // 修改设置
    result = fcntl(fd, F_SYNC, s); // 存储设置

    // 设置自动添加模式
    s = fcntl(fd,F_GETFL);
    s |= O_APPEND;
    result = fcntl(fd,F_SETFL,s);
    ```
    - 终端文件具有回显，波特率，编辑和换行会话,进程和外部设备间的数据流，需要经过内核子程序集合的处理，这个集合称为`终端驱动程序`或者`tty驱动程序`，驱动程序包含很多控制设备操作的设置，进程可以读，修改和重置这些驱动程序

```bash
➜  ~ stty --all   # 用于读取和修改终端驱动程序的设置
speed 9600 baud; rows 108; columns 131; line = 0;
intr = ^C; quit = ^\; erase = ^?; kill = ^U; eof = ^D; eol = M-^?; eol2 = M-^?; swtch = <undef>; start = ^Q; stop = ^S; susp = ^Z;
rprnt = ^R; werase = ^W; lnext = ^V; discard = ^O; min = 1; time = 0;
-parenb -parodd -cmspar cs8 -hupcl -cstopb cread -clocal -crtscts
-ignbrk -brkint -ignpar -parmrk -inpck -istrip -inlcr -igncr icrnl ixon -ixoff -iuclc ixany imaxbel -iutf8
opost -olcuc -ocrnl onlcr -onocr -onlret -ofill -ofdel nl0 cr0 tab0 bs0 vt0 ff0
isig icanon iexten echo echoe -echok -echonl -noflsh -xcase -tostop -echoprt echoctl echoke -flusho -


$ stty srase X      # 将删除键改为 X
$ stty - echo       # 关闭按键回显，这样输密码就看不到了
$ stty erase @ echo # 将删除键设置为 @ , 同时开启回显模式
```

# 编写终端驱动程序 : 关于设置
- 输入: 处理从终端到进程的数据
- 输出: 处理从进程到终端的数据
- 控制: 字符如何被表示 : 位的个数 位的奇偶性 停止位
- 本地: **驱动程序如何处理来自驱动程序内部的字符**

# 改变终端驱动程序的设置
```c
#include <termios.h>
struct termios attribs;
tcgetattr(fd, &setting);    // 从驱动程序获得属性
setting.c_lflag |= ECHO;    // 修改属性
tcsetattr( fd, TCSANOW, &settings ); // 把属性写回驱动程序
```

# 非阻塞输入
- 当调用`read()`或者`getchar()`从文件描述符中读取输入时，这些调用通常都会一直等待用户输入，程序被`阻塞`在这个地方，直到用户输入完成，或者检测到了文件末尾。
- 使用`fcntl()`或者`open()`时为文件描述符设置成`非阻塞输入nonblock input`,在非阻塞状态下，`read()`调用
    - 如果能获得输入，则获得输入并返回获得的字符个数；
    - 如果没有输入字符，则`read()`返回0
- 非阻塞操作的内部实现: 每个文件都有一块保存未读取数据的地方，如果文件描述符设置了`O_NDELAY`位，并且那块空间是空的，`read()`调用返回0.

# 终端驱动程序产生信号
- 用户输入`Ctrl + C`, `终端驱动程序`收到字符，匹配`VINTR`和`ISIG`字符被开启，驱动程序调用信号系统，信号系统发送`SIGINT`到进程，进程收到`SIGINT`,进程消亡

# 处理信号
- 忽略信号 `signal( SIGINT, SIG_IGN )` 设置为 忽略中断信号
- 设置信号处理函数 `signal( SIGINT, ctrl_c_handler_func )`, 当信号发生时，调用`ctrl_c_handler_func`函数进行处理


# 基本概念

- 每个进程都有一个父进程
- 当父进程调用fork函数创建一个子进程而不调用wait函数时,一个僵尸进程就产生了
- fork这个函数的特别之处在于一次调用，两次返回，一次返回到父进程中，一次返回到子进程中

```c
为了充分的利用资源,系统还对进程区分了不同的状态.将进程分为新建,运行,阻塞,就绪和完成五个状态.
新建表示进程正在被创建
运行是进程正在运行
阻塞是进程正在等待某一个事件发生
就绪是表示系统正在等待CPU来执行命令
完成表示进程已经结束了系统正在回收资源
```

## 进程终止

- main return 等同于调用 `exit( main() )`
- 调用 exit,它会调用各种终止处理程序，然后关闭所有标准IO流
- 调用 _exit 或 _Exit，为进程提供一种无需运行终止处理程序或信号处理程序，直接终止的方法，对标准IO流是否冲洗，取决于实现
- 最后一个线程从其启动例程返回 return，该进程则以终止状态 0 返回
- 最后一个线程调用pthread_exit, 进程以终止状态 0 返回
- 异常终止
  - 调用 abort，产生`SIGABRT`信号，是下一种异常终止的一种特例
  - 接到一个 信号时，信号可由进程自身(比如调用abort函数)、其他进程或者内核产生，例如，进程引用地址空间之外的存储单元，或者除以0内核就会为该进程产生相应的信号
  - 最后一个线程对取消(cancellation)请求做出响应，默认情况下，取消以延迟方式发生，一个线程要求取消另一个线程，若干时间后，目标线程终止。

- 不管进程如何终止，最后都会执行内核中的同一段代码，这段代码为相应的进程关闭所有打开的描述符，释放它所使用的存储器

```c
#include <stdlib.h>
void exit( int status ); // 执行一些清理处理，然后返回内核
void _Exit( int status ); // 立即进入内核
#include <unistd.h>
void _exit( int status ); // 立即进入内核
```

- `exit()`总是执行一个标准IO库的清理关闭操作，对于所有打开流调用fclose函数，这造成输出缓冲中的所有数据都被冲洗到文件/终端控制台上

## 终止处理程序

```c
// 注册一个终止处理程序(函数)，在exit调用时，自动先执行终止处理程序
int atexit( void (*func)(void) );
```

![WX20181211-112904.png](https://i.loli.net/2018/12/11/5c0f2fae31dcc.png)

## 进程环境变量

```c
extern char **environ; // 全局环境变量
char *getenv( const char *name );
int putenv( char *str );
int setenv( const char *name, const char *value, int rewrite );
int unsetenv( const char *name );
```

![WX20181211-113641.png](https://i.loli.net/2018/12/11/5c0f30e16a177.png)

## 存储空间动态分配

```c
void *malloc( size_t size );
void *calloc( size_t nobj, size_t size ); // 为指定长度的对象分配存储空间
void *realloc( void *ptr, size_t new_size ); // 从新分配存储空间
void free( void *ptr ); // 释放已经分配的内存
```

## setjmp 和 longjmp

```c
#include <setjmp.h>
int setjmp( jmp_buf env ); // 在希望返回的位置使用
void longjmp( jmp_buf env, int val ); // 跳转时使用
```

- 在调用 longjmp 后，自动变量，全局变量，寄存器变量，静态变量的不同情况

## 进程资源限制

```c
int getrlimit( int resource, struct rlimit *rlptr );
int setrlimit( int resource, const struct rlimit *rlptr );
struct rlimit{
    rlim_t rlim_cur;
    rlim_t rlim_max;
}
```

## 进程ID

- 0 号进程为调度进程，也称为交换进程，是内核的一部分
- 1 号进程为init进程，在自举过程中由内核调用，读取`/etc/rc*` `/etc/inittab` `/etc/init.d`中的配置，并且将系统引导到一个状态，init进程绝不会终止，它是一个普通的用户进程(与内核中的交换进程不同),但是它以超级用户特权运行

```c
pid_t getpid(void);  // 获取当前进程 ID
pid_t getppid(void); // 获取当前进程的 父进程ID
uid_t getuid(void);  // 当前进程的 用户ID
uid_t geteuid(void); // 当前进程的 有效用户ID
gid_t getgid(void);  // 当前进程的 组ID
gid_t getegid(void); // 当前进程的 有效组ID
```

## 改变进程所有者

```c
int setuid(uid_t uid);
int seteuid(uid_t uid);
int setgid(gid_t gid);
int setegid(gid_t gid);
```

![WX20181217-155417.png](https://i.loli.net/2018/12/17/5c175671be494.png)

## 创建新进程

- 子进程与父进程只共享正文段，两者的数据空间，堆和栈是独立的，子进程拿到的是副本
- fork后，子进程先执行还是父进程先执行是不确定的，即使父进程使自己休眠 2s,让子进程先执行，但并不能保证 2s 就已经足够
- 可以使用信号使父进程与子进程同步
- 子进程与父进程的文件共享: fork时，父进程的所有打开的文件描述符都被复制到子进程中，父进程和子进程每个相同的打开描述符共享一个文件表项
- 父进程与子进程共享同一个文件偏移量

![WX20181211-193510.png](https://i.loli.net/2018/12/11/5c0fa12438993.png)

- 在网络服务器编程中，fork后，父进程与子进程各种关闭它们不需要使用的文件描述符，这样就避免了干扰对方使用的文件描述符

- 除打开文件之外，父进程的很多其他属性也由子进程继承
  - 实际用户ID 实际组ID 有效用户ID 有效组ID
  - 附属组ID 进程组ID 会话ID 控制终端 设置用户ID标志 和 设置组标志
  - 当前工作目录 根目录 文件模式创建屏蔽字
  - 信号屏蔽和安排 对任一打开文件描述符的执行时关闭(close-on-exec)标志
  - 环境 连接的共享存储段 存储映像 资源限制

- 父进程与子进程区别如下
  - fork的返回值不同
  - 进程ID不同
  - 这两个进程的父进程ID不同
  - 子进程的tms_utime tms_stime tms_cutime tms_ustime 的值设置为0
  - 子进程不继承父进程设置的文件锁
  - 子进程的未处理闹钟被清除
  - 子进程的未处理信号集设置为空集

## 打印内存地址

```c
int a;
printf("address : %p \n", &a);
```

## 普通的创建一个进程

```c
pid_t pid = fork();
if(pid < 0){
    printf("fork 出错");
} else if ( pid == 0) {
    printf("-------child porcess %d start ----------\n",getpid());
    execl("hello","a",NULL);
    printf("-------child porcess %d end ----------\n",getpid());
} else {
    printf(" 父进程 ");
    sleep(3);
}
```

## vfork

- vfork创建新进程，该新进程的目的就是exec一个新程序，vfork不将父进程的地址空间完全复制到子进程中，因此它比fork效率高
- vfork保证子进程先运行，在它调用exec或exit之后，父进程才可能被调度运行

```c
int stack = 1;
int *heap = (int *) malloc(sizeof(int));
*heap = 100;
// 进程中数据
printf("before vfork : global : %d , stack : %d , *heap : %d \n",global ,stack ,*heap);
pid_t pid = vfork();
if(pid < 0)
{
    printf("vfork error");
}
else if(pid == 0)
{
    printf("thread process %d start\n",getpid());
    global ++ ;
    stack ++;
    (*heap) ++ ;
    printf("after vfork in thread : global : %d , stack : %d , *heap : %d \n",global ,stack ,*heap);
    printf("thread process %d end\n",getpid());
    exit(0);
}
else
{
    printf("in process : global : %d , stack : %d , *heap : %d \n",global ,stack ,*heap);
}
```

## 获取子程序结束信息

- 不管进程是如何退出的，我们都希望终止进程能够通知其父进程，它是如何终止的
- 当进程终止时，内核向其父进程发送`SIGCHLD`信号，这是个异步事件
  - 父进程可以选择忽略该信号
  - 也可以设置一个处理该信号的函数
  - 或者采取系统默认动作
- 在父进程调用`wait`时
  - 如果其所有子进程都还在运行，则阻塞
  - 如果有一个子进程已终止，正等待父进程获取其终止状态，则wait取得该子进程的终止状态立即返回
  - 如果它没有任何子进程，则立即出错返回

```c
#include <sys/wait.h>
pid_t wait(int *statloc);
pid_t waitpid( pid_t pid, int *statloc, int options );
int waitid( idtype_t idtype, id_t id, siginfo_t *infop, int options );
#include <sys/types.h>
#include <sys/wait.h>
#include <sys/time.h>
#include <sys/source.h>
pid_t wait3(int *statloc,int options,struct rusage *rusage);
pid_t wait4(pid_t pid,int *statloc,int options,struct rusage *rusage);
```

![WX20181212-111214.png](https://i.loli.net/2018/12/12/5c107cb8812fb.png)

## 僵尸进程

```c
pid_t pid = fork();
if(pid < 0)
{

}
else if(pid == 0)
{
    printf("the child process %d start \n", getpid());
    sleep(3);
    printf("the child process %d end \n", getpid());
    // 子进程退出了，父进程还在运行，并且没有调用 wait 清理子进程，则子进程就成了zombie
    exit(0);
}
else
{
    sleep(30);
    if(wait(NULL) == -1){
        perror("fail to wait");
    }
    printf("the parent process %d end \n", getpid());
    exit(0);
}
```

- 如果子进程先于父进程退出， 同时父进程又没有调用wait/waitpid，则该子进程将成为僵尸进程。

## 输出进程统计信息

- 进程统计信息都储存在rusage这个统计资源结构体内

## 调试多进程

## 设置跟踪流

```c
(gdb)set follow-fork-mode [parent|child]
(gdb)set detach-on-fork [on|off]
```

## 使用gdb的attach命令

## 在进程中运行shell命令

```c
#include <stdlib.h>
int system(const char * cmdstring);
```

# 进程
- 每个进程都有一个父进程
- 当子进程终止时，父进程会得到通知并能取得子进程的退出状态

## 进程组
- 每个进程也属于一个进程组
- 每个进程组都有一个进程组号，该号等于该进程组组长的PID号
- 一个进程只能为它自己或子进程设置进程组ID号
- Shell上的一条命令形成一个进程组
- 进程组的生命周期到组中最后一个进程终止, 或加入其他进程组为止。

## 会话期
- 一次登录形成一个会话。一个会话可包含多个进程组，但只能有一个前台进程组。
- 对话期(session)是一个或多个进程组的集合
- `setsid()` 函数可以建立一个新Session，但要求执行它进程不是一个进程组的组长，如果该进程是一个进程组的组长，此函数返回错误
1. 此进程变成该 Session 的首进程
1. 此进程变成一个 新进程组 的 组长进程
1. 此进程没有控制终端，如果在调用 setsid 前，该进程有控制终端，那么与该终端的联系被解除
1. 为了**保证执行进程不是组长**这一点，我们先调用fork()然后exit()，此时只有子进程在运行，

## 控制终端
- 会话的领头进程打开一个终端之后, 该终端就成为该会话的控制终端 (SVR4/Linux)
- 与控制终端建立连接的 会话领头进程 称为控制进程 (session leader)
- 一个会话只能有一个控制终端
- 产生在控制终端上的 输入 和 信号 将发送给 **会话的前台进程组中的所有进程**
- 终端上的连接断开时 (比如网络断开或 Modem 断开), 挂起信号将发送到控制进程(session leader)

##  内核守护进程
```bash
# ps aux
Init                        系统守护进程，他的进程ID是1，负责启动各运行层次的特定服务
Keventd                     为在内核中运行计划执行的函数提供上下文
Kswapd                      页面调出守护进程将脏页面低速写到磁盘上，从而使这写页面在需要时仍可回收使用
portmap                     端口映射守护进程
syslogd                     可由操作人员将系统信息记录到日志的任何程序使用
inetd                       侦听系统网络接口，以便取得来自网络的各种网络请求
nfsd lockd rpciod           提供网络文件系统的支持
cron                        指定的日期和时间执行指定的命令
```

![WX20181217-163152.png](https://i.loli.net/2018/12/17/5c175f05917c3.png)

## 通知内核哪一个进程组是前台进程组

```c
pid_t tcgetpgrp( int fd );
int tcsetpgrp(int fd, pid_t pgrpid);
pid_t tcgetsid(int fd);
```

- linux内核中对进程和线程的实现是不加区分的
- 一个进程中的每个线程都有自己的运行环境上下文，包括线程ID , 一组寄存器 ，堆栈 ，信号屏蔽字
- 进程的所有资源都被线程共享,包括可执行程序代码，全局变量，堆空间，栈空间，文件描述符
- 进程只是用来分配资源的实体，而真正负责执行的是线程
- 单进程可以看作是只有一个线程的进程

## 相关代码

```c
#include <pthread.h>
pthread_t pthread_self(void); // 得到一个线程的线程ID
int pthreat_equal(pthread_t tid1,pthread_t tid2); // 两个线程相等？ 是 则返回 0
int pthread_create( 
    pthread_t *restrict tidp, const pthread_attr_t *restrict attr,
    void *(*start_rtn)(void *),void *restrict arg); //创建一个线程

void pthread_exit( void *rval_ptr ); // 线程退出
int pthread_join( pthread_t thread, void **rval_ptr );// 获得某线程的退出状态
int pthread_cancel(pthread_t tid); // 取消同一进程中的其他线程

// 线程可以设置退出时的清理函数 使用宏实现的
void pthread_cleanup_push(void (*rtn)(void*), void *arg);
void pthread_cleanup_pop(int execute);
```

# 信号基础
- 信号通信是一种典型的异步通信
- 信号又称为软件中断,一个进程一但收到信号，就会打断原来的执行流程来处理该信号
- 任何一个进程都可以发送和接收信号

- 查看支持的信号
```bash
$ kill -l
HUP INT QUIT ILL TRAP ABRT BUS FPE KILL USR1 SEGV USR2 PIPE
ALRM TERM STKFLT CHLD CONT STOP TSTP TTIN TTOU URG XCPU XFSZ
VTALRM PROF WINCH POLL PWR SYS
```

# 产生信号
- 按下某些终端键，比如`ctrl + C`产生INT信号,`ctrl + \`产生QUIT信号,这个信号会产生core文件
- 进程调用`kill(2)`函数，发送信号给另一个进程
- 进程调用`kill(1)`命令，发送信号给另一个进程
- 内核检测到某种软件条件发生时
- 硬件异常，首先是硬件检测到，然后通知内核，内核再向当前进程发送适当的信号

# 处理信号
- 忽略它
- 注册一个信号处理函数，单接到这个信号时按函数写的进行处理
- 执行该信号的系统默认处理


# 信号的副作用
- 重入

# POSIX 使用sigaction代替signal
- `sigaction(int signum,const struct sigaction *action, struct sigaction *prevaction)`
    - signum 要处理的信号
    - action 指针，指向描述操作的结构
    - prevaction 指针，指向描述被替换操作的结构

```c
struct sigaction{
    void (*sa_handler)(); // 与 sa_sigaction 二选一,这个就是使用旧的处理机制
    void (*sa_sigaction)(int,siginfo_t *,void *); // 传送给函数的不只是编号，还包括信号产生的原因和条件结构体
    sigset_t sa_mask; // 处理一个消息时是否要阻塞其他信号，其中的位指定哪些信号被阻塞
    int sa_flags; // 如何处理多个信号：SA_RESETHAND 捕鼠器模式 SA_NODEFER SA_RESTART SA_SIGINFO
}
```

# 信号相关资源
- https://blog.csdn.net/wwt18811707971/article/details/52672063
- signal用于安装不可靠信号
- linux现在用sigaction实现sigaction用于安装可靠信号，当然也可以安装不可靠信号并且可以附带更多的信息。**这个还不懂**


## 命令行入参处理

- `int getopt(int argc, char * const argv[], const char * optstring)`
- `a:b:cd::e`，这就是一个选项字符串。对应到命令行就是-a ,-b ,-c ,-d, -e 。冒号又是什么呢？
- 冒号表示参数，一个冒号就表示这个选项后面必须带有参数（没有带参数会报错哦），但是这个参数可以和选项连在一起写，也可以用空格隔开，比如`-a123` 和`-a 123`（中间有空格） 都表示`123`是`-a`的参数；
- 两个冒号的就表示这个选项的参数是可选的，即可以有参数，也可以没有参数，但要注意有参数时，参数与选项之间 **不能有空格**

```c
#include <unistd.h>
extern char *optarg; // 选项的参数指针  
extern int optind;   // 下一次调用getopt的时，从optind存储的位置处重新开始检查选项。
extern int opterr;   // 当opterr=0时，getopt不向stderr输出错误信息。  
extern int optopt;   // 当命令行选项字符不包括在optstring中或者选项缺少必要的参数时，该选项存储在optopt中，getopt返回 ?
int getopt(int argc,char * const argv[ ],const char * optstring);
```

## mmap 系统调用

- 建立一段可以被两个以上进程读写的内存，一个进程对该内存进行的修改也可以被其他进程看见
- 用在文件处理，使磁盘文件的全部内容看起来就像是在内存一样，通过更新这内存就可以更新文件了
- mmap 创建一个指向一段内存区域的指针，该内存区域 与 通过 **文件描述符** 访问的文件的内容关联

```c
#include <sys/mman.h>
void *mmap( void *addr, size_t len, int prot, int flags, int fildes, off_t off );
// 把内存段的某个部分 或者 整段中的修改 写回被映射的文件中
int msync( void *addr, size_t len, int flags );
// 释放内存段
int munmap( void *addr, size_t len );
```

## 错误处理

```c
void perror(const char *msg);  // 打印错误信息
char *strerror( int errnum);   // 将给定错误号 转换为 错误字符串
```

# 文件IO

- `文件描述符`: 进程要操作文件，需要通过内核系统调用，在进程和文件之间建立一条连接，这个连接用一个数字指代，这个数字就是文件描述符
- 每个打开文件都有一个`当前文件偏移量`，值是从文件开始处计算的字节数，读写操作都是从`当前文件偏移量`处开始;对于同一个文件，多个进程同时打开，有不同的文件描述符，不同的文件描述符就有不同的`当前文件偏移量`

## 打开或创建一个文件

```c
int open( const char *path, int flags, mode_t mode);

// 等价于 open( path, O_WRONLY | O_CREAT | O_TRUNC, mode );
int creat( const char *path, mode_t mode );
/*
    openat 是POSIX.1新增函数，主要为了解决两个问题
    1. 同一进程中的不同线程共享相同的当前工作目录，要让这些线程在同一时间工作在不同的目录中，
    所以开发了openat，让线程可以使用相对路径名打开目录中的文件，而不再只能打开当前工作目录
    2. 避免 time-of-check-to-time-of-use 错误：如果有两个基于文件的函数调用，第二个调
    用依赖第一个调用的结果，那么程序是脆弱的，因为两个调用并不是原子操作，两个函数调用之间文
    件可能变了，这样就导致第一个调用的结果不再有效，使得程序最终的结果是错误的。
*/
int openat( int fd, const char *path, int flags, mode_t mode );
```

- flags 文件状态标志,掩码参数 取值如下
  - O_RDONLY 只读
  - O_WRONLY 只写
  - O_RDWR   可读可写
  - O_APPEND 每次写时，都追加到文件的尾端
  - O_EXEC   只执行打开
  - O_SEARCH 只搜索打开，应用于目录
  - O_CREAT  文件不存在就创建
  - O_EXCL   如果同时指定了O_CREAT,而文件已经存在，则报错
  - O_DIRECT 无缓冲的 输入或者输出
  - O_NOATIME 不要修改文件最近访问时间
  - O_NOCTTY  如果 path 是终端(/dev/tty)的话，不要让它成为控制终端
  - O_NOFOLLOW 如果path是软连接，则报错
  - O_NONBLOCK 如果path是一个FIFO,块文件，字符文件，设置它们的I/O操作为 `非阻塞方式`
  - O_TRUNC  如果文件存在，且是可写打开，则将其长度截断为0
  - O_SYNC   每次write都要等待物理I/O操作完成,文件数据和文件属性同步写入磁盘
  - O_DSYNC  每次write都要等待物理I/O操作完成,文件数据立刻写入磁盘，而文件属性可以随后写入
  - O_RSYNC  read操作等待，直至所有对文件的同一部分挂起的写操作都完成
  - O_ASYNC  当 IO 操作可行时，产生信号 通知进程
  - O_TTY_INIT 打开一个还未打开的终端设备，设置非标准 termios 参数值

- mode 参数，创建了文件才起作用，用于表示创建的文件的权限
  - 比如如果我们输入一个0664，表示的就是0000 000 110 110 100，等价于 `-rw-rw-r--`
  - 比如我想设置一个 `-rwsr-xr-x` 的权限，先变成二进制，就是`0000 100 111 101 101`，然后变成八进制，04755，这样直接设置就好了

```c
S_IRUSR 用户读权限  / S_IWUSR 用户写权限 / S_IXUSR 用户执行权限
S_IRGRP 用户组读权限 / S_IWGRP 用户组写权限  / S_IXUSR 用户组执行权限
S_IROTH 其他人读权限 / S_IWOTH 其他人写权限 / S_IXOTH 其他人执行权限
```

![WX20181205-164229.png](https://i.loli.net/2018/12/05/5c078f8482a5e.png)

- fd 参数
  - path 是绝对路径，则fd参数被忽略，openat 与 open 函数一致
  - path 是相对路径，fd参数指出相对路径在文件系统中的开始地址，fd参数通过打开相对路径名所在目录来获取
  - path 是相对路径，fd参数具有特殊值AT_FDCWD,这种情况下，路径名在当前工作目录获取

- return
  - 若出错返回 -1
  - 成功返回`文件描述符`

## 关闭一个已打开文件

```c
int close( int fd );
```

- 关闭一个文件会释放该进程加在该文件上的所有记录锁
- 当一个进程终止时，内核自动关闭它所有的打开文件。
- return
  - 若出错返回 -1
  - 成功返回 0

## 如何改变一个文件的当前 读 / 写 位置

```c
off_t lseek( int fd, off_t offset, int whence );
```

- 当打开一个文件时，`当前文件偏移量`默认为0,但如果指定了O_APPEND,则是文件末尾
- `read` `write`调用时，`当前文件偏移量`也跟着增加，增加的大小就是读取或者写入的字节数
- 如果文件描述符指向的是一个管道，FIFO或者网络套接字，则`lseek`返回-1,errno设置为`ESPIPE`
- lseek仅仅用来设置`当前文件偏移量`，并不引起任何I/O操作，然后该偏移量用于下一个读、写操作
- 文件偏移量可以设置为大于文件的当前长度，这种情况下的下一次写操作将加长该文件，并在文件中构成一个**文件空洞**，空洞中没有写过的字节都被读为 0
- 文件空洞并不要求占用磁盘存储区，具体处理方式取决于文件系统的实现
- offset 偏移的字节数
- whence
  - SEEK_SET 从文件头开始偏移
  - SEEK_CUR 从当前 文件偏移量处 开始偏移
  - SEEK_END 从文件尾部 开始偏移
- 返回
  - 成功：新的`当前文件偏移量`
  - 失败: -1

在UNIX/Linux文件操作中，文件位移量可以大于文件的当前长度，在这种情况下，对该文件的下一次写将延长该文件，并在文件中构成一个空洞，这一点是允许的。位于文件中但没有写过的字节都被设为0，用read读取空洞部分读出的数据是0。

空洞文件作用很大，例如迅雷下载文件，在未下载完成时就已经占据了全部文件大小的空间，这时候就是空洞文件。下载时如果没有空洞文件，多线程下载时文件就都只能从一个地方写入，这就不是多线程了。如果有了空洞文件，可以从不同的地址写入，就完成了多线程的优势任务。

```c
du -k ./        # 查看文件的实际磁盘占用
$ ls -alhi
2765543 -rw-rw----  1 cky cky  19G 10月 25 12:25 file2.hole
2765542 -rw-rw----  1 cky cky   42 10月 25 11:56 file.hole

cky@cky-pc:~/workspace/C/APUE$ du -alh .
4.0K	./file.hole
8.0K	./file2.hole
```

## 从文件中读数据

```c
ssize_t read( int fd, void *buffer, size_t nbytes );
```

- 从终端设备读时，通常一次最多读一行，但这是可以设置选项改变的
- 从网络读时，网络中的缓冲机制可能造成返回值小于所要求的读的字节数
- 从管道、FIFO读时，如果管道中包含的字节少于所需的数量，则read只返回实际可用的字节数
- 从某些面向记录的设备(磁带)读时，一次最多返回一个记录
- 当一个信号造成中断，而已经读了部分数据时，读操作从文件的`当前偏移量`处开始，在成功返回之前，该偏移量将增加实际读到的字节数

- buffer : 可以是数组 : `char buffer[20]` 或是结构体变量 `struct utmp buffer`
- nbytes  :  一般就计算出 buffer 字节数 `sizeof(buffer)`
- 返回
  - 成功：返回读到的字节数,0则表示达到文件末尾
  - 失败: -1

## 往文件中写数据

```c
ssize_t write( fd, void *buffer, size_t nbytes );
```

- buffer : 可以是数组 : `char buffer[20]` 或是结构体变量 `struct utmp buffer`
- nbytes:  一般就计算出 buffer 的大小 `sizeof(buffer)`
- 返回
  - 成功：返回读到的字节数,0则表示达到文件末尾
  - 失败: -1

## 原子性执行 "定位到文件某个位置 + 读出/写入"

```c
ssize_t pread(int fd, void *buf, size_t count, off_t offset);
ssize_t pwrite(int fd, const void *buf, size_t count, off_t offset);  
```

- `pread`相当于调用`lseek`后再调用`read`,但是`pread`是原子操作,并且`pread`不更新当前文件偏移量

## 复制一个现有的文件描述符

```c
int dup( int fd );
int dup2( int fd, int fd2 );
```

- dup2可用fd2参数指定新描述符的值
  - 如果fd2已经打开
    - 如果 fd 等于 fd2,则返回 fd2，并且不关闭fd2
    - 如果 fd 不等于 fd2,关闭fd2,清除其 FD_CLOEXEC(执行时关闭) 文件描述符标志

- dup 与 dup2 返回的新文件描述符，与参数 fd 共用一个 文件表项

![WX20181204-170526.png](https://i.loli.net/2018/12/04/5c06436909fd1.png)

- 返回值
  - 成功 dup返回当前可用文件描述符中的最小值,dup2返回fd2指定的值
  - 出错 -1

## 缓冲区同步到磁盘

```c
int fsync( int fd );
int fdatasync( int fd );
void sync( void );
```

- sync 将修改过的块缓冲写入队列，然后就返回，并不等待实际写磁盘操作结束,通常`系统守护进程update`周期性调用sync函数(30s)
- fsync 函数只对由文件描述符fd指定的一个文件起作用，并且等待磁盘操作结束才返回,一般数据库程序用的比较多
- fdatasync 类似于 fsync ，但它只同步文件的数据部分，不同步文件属性
- 返回
  - 成功 0
  - 失败 -1

## 改变已经打开文件的属性

```c
int fcntl( int fd, int cmd, ... )

fcntl( fd, F_DUPFD, 0 ); // 等效于 dup( fd );

close( fd2 );
fcntl( fd, F_DUPFD, fd2 ); // 等效于 dup( fd, fd2 ); 但 dup2 是原子操作
```

- cmd = F_DUPFD，复制文件描述符fd,返回新文件描述符，该描述符有自己的一套文件描述符标志，其 FD_CLOEXEC 文件描述符标志被清除，表示该描述符在 exec 时仍然有效
- cmd = F_DUPFD_CLOEXEC 复制文件描述符，设置与新描述符关联的 FD_CLOEXEC 文件描述符的值，返回新文件描述符

- cmd = F_GETFD 获得`文件描述符标志`
- cmd = F_SETFD 设置`文件描述符标志`，新标志值按第3个参数设置
- cmd = F_GETFL 返回`文件状态标志`,即 `O_RDONLY` `O_RDWR` 这种，(O_RDONLY O_WRONLY O_RDWR O_EXEC O_SEARCH 由于历史原因并不各占一位,因此需要用屏蔽字 O_ACCMODE 取得方式位，然后再一一去比较)
- cmd = F_SETFL 设置`文件状态标志`，第3个参数作为新值，可以更改的几个标志位 `O_APPEND` `O_NONBLOCK` `O_SYNC` `O_DSYNC` `O_RSYNC` `O_FSYNC` `O_ASYNC`，一般会将原值取出，与新要设置的值做 `|` 操作，然后再存回去

- cmd = F_GETOWN 获取当前接收 SIGIO 和 SIGURG 信号的进程ID或进程组ID
- cmd = F_SETOWN 设置接收 SIGIO 和 SIGURG 信号的进程ID或者进程组ID,第3个参数为正值则为进程ID，为负数则为进程组ID

- 获得/设置记录锁 cmd = F_GETLK / F_SETLK / F_SETLKW

- 返回
  - 正确，与命令参数的使用有关
  - 错误, -1

- 举例

```c
    int val = fcntl( atoi( argv[1] ), F_GETFL, 0 );

    if( val < 0 )
    {
        perror("error");
        exit(errno);
    }
    switch( val & O_ACCMODE )
    {
        case O_RDONLY:
            printf("read only");
            break;
        case O_WRONLY:
            printf("write only");
            break;
        case O_RDWR:
            printf("read write");
            break;
        default:
            printf("unknow acess mode");
    }
    if( val & O_APPEND )
        printf(",append");
    if( val & O_NONBLOCK )
        printf(",nonblock");
    if( val & O_SYNC )
        printf(",synchronous writes");
    if( val & O_FSYNC )
        printf(",synchronous writes");
// a.out 是编译后的文件
// a.out 0 < /dev/tty       read only
// a.out 1 > temp.foo       write only
// a.out 2 2>>temp.foo      write only,append
// a.out 5 5<>temp.foo      read write
// 5<>temp.foo 表示在文件描述符5上打开temp.foo以供读写

// 设置文件状态标志函数
void set_fl( int fd, int flags )
{
    int val = fcntl( fd, F_GETFL, 0);
    if( val < 0 )
    {
        perror("error");
        exit(errno);
    }

    val |= flags;

    if( fcntl( fd, F_SETFL, val ) < 0 )
    {
        perror("error");
        exit(errno);
    }
}
```

## IO操作杂物箱

```c
#include <unistd.h>
#include <sys/ioctl.h>
int ioctl( int fd, int request, ... );
```

- 不能用上述其他函数操作的，基本上都通过ioctl支持操作
- 终端IO是ioctl用的最多的地方,通常还要求另外的设备专用头文件,比如`<termios.h>`
- request 指定在 fd 上执行控制操作
- ... 根据 request 的参数来 填入的不定参数

## 设置流的定向

```c
#include <stdio.h>
#include <wchar.h>
int fwide( FILE *fp, int mode );
```

- 流是多字节宽定向的 返回正值；是单字节则返回负值，0表示未定向
- mode
  - 填入正值，试图将流设置为宽定向的
  - 填入负值，试图将流设置为单字节
  - 填入0, 试图清除流的定向

## 更改标准输入输出流的缓冲类型

```c
void setbuf( FILE *restrict fp, char *restrict buf );
void setvbuf( FILE *restrict fd, char *restrict buf, int mode, size_t size );
```

![WX20181207-173836.png](https://i.loli.net/2018/12/07/5c0a3fb995c41.png)

## 强制冲洗一个流

```c
int fflush( FILE *fp ); // 1. 出错返回 EOF 2. fp 为NULL会冲洗进程内所有输入输出流
```

## 打开一个标准IO流

```c
FILE *fopen( const char *restrict pathname, const char *restrict type );

// 在指定流上打开指定文件
FILE *freopen( const char *restrict pathname, const char *restrict type, FILE *restrict fp );

// 将文件描述符对应的文件，对应返回一个标准IO流
FILE *fdopen( int fd, const char *type );
// 出错返回NULL
```

![WX20181207-194004.png](https://i.loli.net/2018/12/07/5c0a5c48404d7.png)
![WX20181207-194240.png](https://i.loli.net/2018/12/07/5c0a5cdb7bbb5.png)

## 关闭一个打开的流

```c
int fclose( FILE *fp );
```

## 从流里一次读取一个字符

```c
int getc( FILE *fp );
int fgetc( FILE *fp );
int getchar( void ); // 等同于 getc( stdin );

// 三个函数不管是出错或者到达文件尾端，都返回EOF,所以为了区分，用下面两个函数
int ferror( FILE *fp );
int feof( FILE *fp );

// FILE 维护了两个标志，出错标志，文件结束标志
int clearerr( FILE *fp ); // 两个标志清0
```

## 将读出的数据压回流内

```c
int ungetc( int c, FILE *fp ); // 出错返回 EOF
```

## 将一个字符输出到流

```c
int putc( int c, FILE *fp );
int fputc( int c, FILE *fp );
int putchar( int c ); // 等同于 putc( int c, stdout );
```

## 从流里读取一行

```c
char *fgets( char *restrict buf, int n, FILE *restrict fp );
char *gets( char *buf ); // 从stdin中读取
```

## 输出一行

```c
int fputs( const char *restrict str, FILE *restrict fp );
int puts( const char *str ); // 输出到 stdout
```

## 二进制IO

```c
size_t fread( void *restrict ptr, size_t size, size_t nobi, FILE *restrict fp );
size_t fwrite( const void *restrict ptr, size_t size, size_t nobj, FILE *restrict fp );
```

- 在网络异构系统通信时，两个系统中，对于结构体中的成员的偏移量可能随编译程序和系统的不同而不同
- 用来存储多字节整数和浮点值的二进制格式在不同的系统里也可能不同
- 不同系统之间交换二进制数据的实际解决方法是使用互认的规范格式

## 定位流中的位置

```c
long ftell( FILE *fp );
off_t ftello( FILE *fp );
int fseek( FILE *fp, long offset, int whence );
int fseeko( FILE *fp, off_t offset, int whence );
void rewind( FILE *fp );

int fgetpos( FILE *restrict fp, fpos_t *restrict pos );
int fsetpos( FILE *fp, const fpos_t *pos );
```

## 格式化输出

```c
int printf(const char *format, ...); //输出到标准输出
int fprintf(FILE *stream, const char *format, ...); //输出到文件
int dprintf( int fd, const char *restrict format, ... );
int sprintf(char *str, const char *format, ...);    //输出到字符串str中
int snprintf(char *str, size_t size, const char *format, ...); //按size大小输出到字符串str中

// 以下函数功能与上面的一一对应相同，只是在函数调用时，把上面的 ... 
// 对应的一个个变量用va_list调用所替代。在函数调用前 ap 要通过va_start()宏来动态获取
#include <stdarg.h>
int vprintf(const char *format, va_list ap);
int vfprintf(FILE *stream, const char *format, va_list ap);
int vdprintf( int fd, const char *restrict format, va_list arg );
int vsprintf(char *str, const char *format, va_list ap);
int vsnprintf(char *str, size_t size, const char *format, va_list ap);
```

## 格式化输入

```c
int scanf(const char *restrict format, ... );
int fscanf( FILE *restrict fp, const char *restrict format, ... );
int sscanf( const char *restrict buf, const char *restrict format, ...);
```

## 从流中获取文件描述符

```c
int fileno( FILE *fp );
```

## 创建临时文件、目录

```c
char *tmpnam( char *ptr ); // 返回指向唯一路径名的指针
FILE *tmpfile( void );
char *mkdtemp( char *template ); // 返回指向目录名的指针
int mkstemp( char *template ); // 返回文件描述符
```

## 内存流IO

```c
FILE *fmemopen( void *restrict buf, size_t size, const char *restrict type );
FILE *open_memstream( char **bufp, size_t *sizep ); //面向字节流
FILE *open_wmemstream( wchar_t **bufp, size_t *sizep ); // 面向宽字节
```

- 没有底层文件，所有IO都是通过在缓冲区与主存之间来回传送字节流来完成的
- buf 指向缓冲区开始的位置
- size 缓冲区字节数
- type 控制如何使用内存流 `r` `w` `a`

## 系统数据文件和信息

```c
struct passwd *getpwuid( uid_t uid );
struct passwd *getpwnam( const char *name );
struct passwd *getpwent( void );
void setpwent( void );
void endpwent( void );

#include <shadow.h>
struct spwd *getspnam( const char *name );
struct spwd *getspent( void );
void setspent( void );
void endspent( void );

#include <grp.h>
struct group *getgrgid( gid_t gid );
struct group *getgrnam( const char *name );
struct group *getgrent( void );
void setgrent( void );
void endgrent( void );
```

![WX20181210-192737.png](https://i.loli.net/2018/12/10/5c0e4dc43c906.png)


# Linux / Unix 文件系统

## 资源

- [理解inode](http://www.ruanyifeng.com/blog/2011/12/inode.html)
- [linux索引inode详解](https://blog.csdn.net/dmzing/article/details/52398303)

# 文件系统

`linux`文件系统的一些概念和操作。

## 文件的信息结构

```c
#include <sys/stat.h>
int stat( const char *restrict pathname, struct stat *restrict buf );
int fstat( int fd, struct stat *buf );
int lstat( const char *restrict pathname, struct stat *restrict buf );
int fstatat( int fd, const char *restrict pathname, struct stat *restrict buf, int flag );
```

- pathname 路径
- fd 文件描述符
- lstat 返回该符号链接本身的有关信息
- fstatat 为一个相对于当前打开目录(fd指向)的路径名返回文件统计信息。
  - flag 设置为AT_SYMLINK_NOFOLLOW时，返回符号链接本身的信息
  - flag 设置为AT_FDCWD时，如果pathname是一个相对路径，则计算相对于当前目录的pathname参数，如果是一个绝对路径，就使用该路径作为pathname
- struct stat 结构， 用于接收文件的结构

```c
struct stat{
    mode_t st_mode;           // 文件类型
    ino_t  st_ino;            // i-node 节点号
    dev_t  st_dev;            // 设备号
    dev_t  st_rdev;           // 特别设备的设备号
    nlink_t  st_nlink;        // 链接数
    uid_t st_uid;             // 用户ID
    gid_t st_gid;             // 用户组ID
    off_t st_size;            // 文件的字节数
    struct timespec st_atime; // 访问时间
    struct timespec st_mtime; // 修改时间
    struct timespec st_ctime; // 创建时间
    blksize_t st_blksize;     // best IO block size
    blkcnt_t st_blocks;       // number of disk blocks allocated
}
```

- st_mode 包含文件类型信息，使用宏确定文件类型

```c
S_ISREG( st_mode )  // 普通文件
S_ISDIR( st_mode )  // 目录
S_ISCHR( st_mode )  // 字符特殊文件
S_ISBLK( st_mode )  // 块特殊文件
S_ISFIFO( st_mode ) // 管道
S_ISLINK( st_mode ) // 符号链接
S_ISSOCK( st_mode ) // socket
```

- IPC 对象的类型

```c
S_TYPEISMQ( struct stat * )  // 消息队列
S_TYPEISSEM( struct stat * ) // 信号量
S_TYPEISSHM( struct stat * ) // 共享存储对象
```

## 测试文件的权限

```c
int access( const char *pathname, int mode );
int faccessat( int fd, const char *pathname, int mode, int flag );
```

- mode
  - R_OK 测试 pathname 是否可读
  - W_OK 测试可写
  - X_OK 测试可执行
- flag 设置为 AT_EACCESS,则检查用的是进程的有效用户ID和有效组ID,而不是实际用户ID
- return
  - 错误 -1
  - 成功 0

## 创建文件时，掩码设置

```c
mode_t umask( mode_t cmask );
```

- 文件权限有 `set-user-ID位`,`set-group-ID位`,`sticky位` 加上 9 个权限位，在创建的时候由`int creat(path,0766)`和`umask( 022 )`两者确定
- `umask( 022 )` 设置`新建文件掩码`,目的为屏蔽新建文件的某些权限，例如：要防止程序创建出能被同组用户和其他用户修改的文件，掩码就是`022`(八进制) 即 `000 010 010`( 二进制 )，取反就是`111 101 101`, 与 `0766` 即 `000 111 110 110` 进行 `&` 运算得到 `000 111 100 100` 即 `--- rwx r-- r--` 就是新建文件的最终权限
- `chmod( path, mod )` 可以直接修改文件的权限，并且不受`新建文件掩码`影响

## 更改现有文件的访问权限

```c
#include <sys/stat.h>
int chmod( const char *pathname, mode_t mode );
int fchmod( int fd, mode_t mode );
int fchmodat( int fd, const char *pathname, mode_t mode, int flag );
```

- mode

```c
S_ISUID 执行时设置用户ID / S_ISGID 执行时设置组ID / S_ISVTX 粘着位
S_IRUSR 用户读权限  / S_IWUSR 用户写权限 / S_IXUSR 用户执行权限 / S_RWXU 用户可读可写可执行
S_IRGRP 用户组读权限 / S_IWGRP 用户组写权限  / S_IXUSR 用户组执行权限 / S_IRWXG 组员可读可写可执行
S_IROTH 其他人读权限 / S_IWOTH 其他人写权限 / S_IXOTH 其他人执行权限 / S_IRWXO 其他人可读可写可执行
```

- flag 取值为 AT_SYMLINK_NOFOLLOW 时，fchmodat 不解析符号链接
- 只有root可以设置粘着位，目录设置了粘着位后，只有满足三个条件之一的才可以删除目录下的文件，第一，拥有文件权限 第二，拥有此目录权限 第三，是root用户

## 更改用户ID和组ID

```c
int chown( const char *pathname, uid_t owner, gid_t group );
int fchown( int fd, uid_t owner, git_t group );
int fchownat( int fd, const char *pathname, uid_t owner, gid_t group, int flag );
int lchown( const char *pathname, uid_t owner, gid_t group );
```

## 文件截断

```c
int truncate( const char *pathname, off_t length );
int ftruncate( int fd, off_t length );
```

- 将一个现有文件长度截断为 length 个字节

## 创建链接

```c
int link( const char *existpath, const char *newpath );
int linkat( int efd, const char *existpath, int nfd, const char *newpath, int flag );
```

## 删除链接

```c
int unlink( const char *pathname );
int unlinkat( int fd, const char *pathname, int flag );
int remove( const char *pathname ); // 解除对一个文件或者目录的链接
```

- 当链接计数达到 0 时，该文件的内容才可被删除
- 当还有进程正在使用该文件时，该文件即使计数为0也不会立刻删除，而是等到所有使用它的进程退出后，才删除。利用这个特性，进程如果需要临时文件，可以creat后立刻unlink,这样进程即使崩溃，这个临时文件也不会遗留下来

## 对文件重命名

```c
int rename( const char *oldname, const char *newname );
int renameat( int oldfd, const char *oldname, int newfd, const char *newname );
```

## 创建符号链接

```c
int symlink( const char *actualpath, const char *sympath );
int symlinkat( const char *actualpah, int fd, const char *sympath );
```

## 打开符号链接本身，读取它本身的内容

```c
ssize_t readlink( const char *restrict pathname, char *restrict buf, size_t bufsize );
ssize_t readlinkat( int fd, const char *restrict pathname, char *restrict buf, size_t bufsize );
```

## 修改文件访问时间和修改时间

```c
int futimens( int fd, const struct timespec times[2] );
int utimensat( int fd, const char *path, const struct timespec times[2], int flag );
int utimes( const char *pathname, const struct timeval times[2] );
```

## 创建/删除目录

```c
int mkdir( const char *pathname, mode_t mode );
int mkdirat( int fd, const char *pathname, mode_t mode );
int rmdir( const char *pathname );
```

## 读目录

```c
DIR *opendir( const char *pathname );
DIR *fdopendir( int fd );
struct dirent *readdir( DIR *dp );
void rewinddir( DIR *dp );
int closedir( DIR *dp );
long telldir( DIR *dp );
void seekdir( DIR *dp, long loc );
```

## 修改进程当前工作目录

```c
int chdir( const char *pathname );
int fchdir( int fd );

char *getcwd( char *buf, size_t size ); // 获取当前工作目录
```

# 目录系统调用

`linux`的文件系统繁多，针对文件的系统的目录操作各不相同，所以需要一套标准系统调用来兼容各种文件系统。

## 概述

- 目录: 特殊的文件，内容是文件和子目录的名字
- 每个目录包含两个特殊的项目: `.` 和 `..`
- `open` `read` `close`这些函数，可以把一个目录当做文件来打开，但是这并不是很好的方法，因为 linux目录类型非常多，例如`Apple HFS` `ISO9660` `VFAT` `NFS`等，如果以`read`来读，则需要了解不同类型目录各自的结构细节
- `int mkdir(const char *path, mode_t mode);` 创建目录，在创建时设置权限需要使用`umask(0)`取消权限掩码限制，否则只能使用系统默认属性创建
- `DIR* opendir( const char* path )` 打开目录 `path`
- `struct dirent * readdir( DIR* dir )` 获取一次当前目录中的文件信息
- `int remove(char * filename);` 删除指定文件或者空目录
- `int rmdir(const char *pathname);` 删除空目录
- `int unlink(const char *pathname);` 删除文件
- `int  closedir(DIR * dir);` 关闭之前打开的dir目录
- `int rename(const char *oldname, const char *newwname) ;` 文件或者目录更换名字
- `char *getcwd(char *buf, size_t size);` 得到当前目录的完整路径
- `int chdir(const char *pathname);` 改变当前目录
- 由于删除目录比较麻烦需要遍历挨个删除，可以使用`system("rm -rf /dir")`

```c
struct __dirstream  
{  
    void *__fd; /* `struct hurd_fd' pointer for descriptor.   */  
    char *__data; /* Directory block.   */  
    int __entry_data; /* Entry number `__data' corresponds to.   */  
    char *__ptr; /* Current pointer into the block.   */  
    int __entry_ptr; /* Entry number `__ptr' corresponds to.   */  
    size_t __allocation; /* Space allocated for the block.   */  
    size_t __size; /* Total valid data in the block.   */  
    __libc_lock_define (, __lock) /* Mutex lock for this structure.   */  
};
typedef struct __dirstream DIR;

struct dirent  
{  
    long d_ino; /* inode number 索引节点号 */  
    off_t d_off; /* offset to this dirent 在目录文件中的偏移 */  
    unsigned short d_reclen; /* length of this d_name 文件名长 */  
    unsigned char d_type; /* the type of d_name 文件类型 */  
    char d_name [NAME_MAX+1]; /* file name (null-terminated) 文件名，最长255字符 */  
}

# d_type 定义
enum  
{   
    DT_UNKNOWN = 0,   
    # define DT_UNKNOWN DT_UNKNOWN //未知文件  
    DT_FIFO = 1,   
    # define DT_FIFO DT_FIFO //FIFO有名管道文件  
    DT_CHR = 2,   
    # define DT_CHR DT_CHR //字符设备文件  
    DT_DIR = 4,   
    # define DT_DIR DT_DIR //目录文件  
    DT_BLK = 6,   
    # define DT_BLK DT_BLK //块设备文件  
    DT_REG = 8,   
    # define DT_REG DT_REG //普通文件  
    DT_LNK = 10,   
    # define DT_LNK DT_LNK //链接文件  
    DT_SOCK = 12,   
    # define DT_SOCK DT_SOCK //socket文件  
    DT_WHT = 14   
    # define DT_WHT DT_WHT //whiteout-base文件  
};   
```

# 文件类型和许可权限
- 使用了16位二进制数来存储文件类型和许可权限信息
- 分别是: 文件类型(四位),`set-user-ID位`,`set-group-ID位`,`sticky位`,所有者权限(3位),所有组权限(3位),其他人权限(3位)
- 可执行文件的`set-user-ID位`可以设置为1,意思是运行该程序的时候，认为是由文件所有者在运行这个程序,比如`-rwsr-xr-x 1 root root 54256 5月  17  2017 /usr/bin/passwd` 的所有者是root,用户运行`passwd`设置自己密码时，`passwd`的运行用户实际是`root`,所以能修改密码文件`-rw-r--r-- 1 root root 1848 10月 13 11:35 /etc/passwd`
- `set-group-ID位`设置程序运行时，是否使用程序本身所属的用户组，设置为1 : 意思是用户运行程序时，就像是程序所属组里的某个用户在运行程序一样
- `sticky位`也称为`粘着位`
    - 对于可执行文件来说，设置了`sticky位`就意味着该可执行程序即使没在运行，也需要被放置在`交换空间`中；
    - 对于目录来说，`sticky位`的含义则是：该目录下谁都可以创建文件，但是文件只能被文件的所有者删除

# 设置文件类型和许可权限

- 文件类型是在创建文件时就确立的，一经创建，无法修改
- `set-user-ID位`,`set-group-ID位`,`sticky位` 和9个权限位，在创建的时候由`int creat(path,0766)`和`umask( 022 )`两者确定
- `umask( 022 )` 设置`新建文件掩码`,目的为屏蔽新建文件的某些权限，例如：要防止程序创建出能同时被同组用户和其他用户修改的文件，掩码就是`022`(八进制) 即 `000 010 010`( 二进制 )，取反就是`111 101 101`, 与 `0766` 即 `000 111 110 110` 进行 `&` 运算得到 `000 111 100 100` 即 `--- rwx r-- r--` 就是新建文件的最终权限
- `chmod(path,mod)` 可以直接修改文件的权限，并且不受`新建文件掩码`影响


```c
#include <sys/types.h>
#include <sys/stat.h>
// 取得文件信息
int stat(const char *pathname, struct stat *buf);
int fstat (int fd,struct stat *buf);
 // lstat函数类似于stat,但是当命名的文件是一个符号连接时,lstat返回该符号连接的有关信息,而不是由该符号连接引用的文件的信息
int lstat(const char *pathname, struct stat *buf);

struct stat
{
    mode_t    st_mode;    文件类型，文件权限
    ino_t     st_ino;        i节点号
    dev_t    st_dev;        
    dev_t    st_rdev;    设备文件序号
    nlink_t    st_nlink;    链接
    uid_t    st_uid;
    gid_t     st_gid;        用户ID
    off_t    st_size;    文件大小,此字段只对普通文件、目录文件和符号连接有意义。
    time_t    st_atime;    最后存取时间
    time_t    st_mtime;    文件内容的最后修改时间
    time_t    st_ctime;    文件状态的最后修改时间
    long    st_blksize;    
    long     st_blocks;
};
```

# 判断文件权限
```c
#include <unistd.h>
// mode 说 明 : R_OK 测试读许可权 W_OK 测试写许可权 X_OK 测试执行许可权 F_OK 测试文件是否存在
int access (const char *name, int mode) ;
```

# 修改文件权限
```c
#include <sys/types.h>
#include <sys/stat.h>
int chmod(const char *pathname, mode_t mode);
int fchmod(int fd, mode_t mode);
```

# 更改文件的用户 ID和组ID
```c
#include <sys/types.h>
#include <unistd.h>
int chown(const char *pathname,uid_t owner,gid_t group);
int fchown(int fd, uid_t owner, gid_t group);
int lchown(const char *pathname, uid_t owner, gid_t group);
```

# 创建一个硬连接
```c
#include <unistd.h>
// 只有超级用户进程可以创建指向一个目录的新连接
int link(const char＊oldpath, const char *newpath) ;
```

# 创建一个软连接
```c
#include <unistd.h>
int symlink(const char *oldpath, const char *sympath) ;
// 因为open函数跟随符号连接,所以需要有一种方法打开该连接本身,并读该连接中的名字
int readlink(const char ＊pathname, char ＊buf, int bufsize) ;
```

# 文件时间
- 文件时间: 最后修改时间 最后访问时间 属性最后修改时间
- 当文件被操作时，内核会自动地修改这些时间
- 可以通过系统调用来修改 最后修改时间 和 最后访问时间
```c
#include <sys/time.h>
#include <utime.h>
#include <sys/types.h>
int utime( char* path, struct utimbuf *new_time );
```


# Linux 时间编程

- 在执行流中加入时延
- 调度一个将来要做的任务

# sleep() 原理

- 每个进程都有一个私有的闹钟 `alarm clock`, 这个闹钟是一个定时器，设置为 一定秒数后，时钟发送一个信号 `SIGALRM`到进程
- 除非为`SIGALRM`设置了处理函数`handler`, 否则信号将杀死这个进程
- `sleep()`实现 ： 1. 为`SIGALRM`设置`handler`，`handler`设置为唤醒程序 2. 调用 `alarm( seconds )`，设置一个超时调用时间 3. 调用`pause()`暂停程序
- `alarm()`用来设置信号SIGALRM在经过参数seconds指定的秒数后传送给目前的进程。如果参数seconds为0，则之前设置的闹钟会被取消，并将剩下的时间返回。要注意的是，一个进程只能有一个闹钟时间，如果在调用alarm之前已设置过闹钟时间，则任何以前的闹钟时间都被新值所代替

# 更高精度的计时器

- `usleep( n )` 将当前进程挂起 n 微秒，或者直到有一个不能忽略的信号到达。

# 三种计时器

- ITIMER_REAL : 真实系统走过的时间，就如同手表记录的时间，不管进程工作在 用户态 还是 核心态，用了多少处理器时间 它都记录，这个计时器用尽，发送`SIGALRM`信号到进程
- ITIMER_VIRTUAL : 只有进程在 用户态 运行时才计时, 计时器用尽，发送 `SIGVTALRM` 信号
- ITIMER_PROF : 这个计时器 在进程 运行于用户态 或者 由于系统调用进入核心态，两种情况都计时

- `int setitimer(int which, const struct itimerval *new_value, struct itimerval *old_value);` 用来实现延时和定时的功能
- settimer工作机制是，先对it_value倒计时, 当it_value为零时触发信号，然后重置为it_interval，每间隔 it_interval 触发信号
- 假如it_value为0是不会触发信号的，所以要能触发信号，it_value得大于0；如果it_interval为零，只会延时，不会定时（也就是说只会触发一次信号)。
- old_value参数，通常用不上，设置为NULL，它是用来存储上一次setitimer调用时设置的new_value值。

```c
struct itimerval {
    struct timeval it_interval; /* next value */  
    struct timeval it_value;    /* current value */  
};  
  
struct timeval {  
    time_t      tv_sec;         /* seconds */  
    suseconds_t tv_usec;        /* microseconds */  
};  
```
```c
#include <stdio.h>
#include <sys/time.h>
#include <signal.h>
#include <stdlib.h>
#include <unistd.h>

void countdown( int );
int set_ticker( int );

int main( int argc, char *argv[] )
{
    signal( SIGALRM, countdown );
    if( set_ticker( 500 ) == -1 ) 
        perror("set_ticker");
    else
        while( 1 )
        {
            printf("do something else\n");
            pause();
        }
    return 0;
}

void countdown( int signum )
{
    static int num = 10;
    printf( "signal catched %d .. ", num-- );
    fflush( stdout );
    if( num < 0 )
    {
        printf( "Done!\n" );
        exit( 0 );
    }
}

int set_ticker( int n_msecs )
{
    struct itimerval new_timeset;
    long n_sec   = n_msecs / 1000;
    long n_usecs = ( n_msecs % 1000 ) * 1000L;

    new_timeset.it_interval.tv_sec  = new_timeset.it_value.tv_sec  = n_sec;
    new_timeset.it_interval.tv_usec = new_timeset.it_value.tv_usec = n_usecs;

    return setitimer( ITIMER_REAL, &new_timeset, NULL );
}
```

# 一个硬件时钟的脉冲是计算机里唯一需要的时钟

- 如何使用一个时钟实现 一个进程的私有计时器为 5s 的同时，又设置另一个进程的 私有计时器为 12s呢？
    - 答案 : 每个进程设置自己的计数时间，比如 5s , 12s, 内核在运行过每一个时间片( 比如 500us )后，为所有的计数器做递减，5s - 500us, 12s - 500us, 当 5s 被减到0时，就发送`SIGALRM`信号给这个进程，然后等到 12s 也被减为 0 时，也相应的发送信号。