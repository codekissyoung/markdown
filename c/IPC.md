# 匿名半双工管道
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

# FIFO 有名管道 (进程通信代码并没有达到预期的效果)
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

# System V IPC / POSIX IPC
- 基于系统内核
- IPC 对象 : 消息队列 , 信号量 , 共享存储器
- `ipcs -a` 查看系统内IPC的状态
- 缺陷: 不使用通用的文件系统 , 缺少资源回收机制, IPC 对象创建然后退出时, 没有被自动回收

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