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
- 文件空洞并不要求占用磁盘存储区，具体处理方式与文件系统的实现有关
- offset 偏移的字节数
- whence
  - SEEK_SET 从文件头开始偏移
  - SEEK_CUR 从当前 文件偏移量处 开始偏移
  - SEEK_END 从文件尾部 开始偏移
- 返回
  - 成功：新的`当前文件偏移量`
  - 失败: -1

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