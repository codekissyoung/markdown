# Unix/Linux编程实践教程

本文是《Unix-Linux编程实践教程》一书的笔记。主要记录对我有用的代码，以及原理的解释，罗嗦的总结性的东西就不记了。

## 第1章 Unix系统编程概述

内核为程序提供服务:

- 系统内存空间
- 用户内存空间
- 程序如果要从键盘得到数据，必须向内核发出请求
- 系统调用

系统资源:

- 处理器
- 输入与输出 : 程序中所有输入输出的数据都需要流经内核，集中处理和管理
- 进程管理 : 每个进程都有自己的资源 内存 打开的文件
- 内存 : 进程向内核申请内存，不需要时释放内存
- 设备 : 磁带机 光驱 鼠标 扫描仪 的操作方式各不相同，内核屏蔽这种差异，向上层提供一致的接口
- 计时器
- 进程间通信 : 内核提供的服使进程间可以通信
- 网络

登录、运行与注销:

- 在登录过程中，当用户名和密码通过验证后，内核启动 `shell进程`,然后把用户交给`shell`,shell再去与内核交互，期间shell也可以帮用户启动其他程序
- 每个用户都有属于自己的`shell`进程
- 当用户注销时，内核会结束所有分配给这个用户的进程
- 通过shell启动的进程都是shell的子进程，但是我们可以编写能够脱离shell的进程

文件操作:

- `linux` 并不提供 **恢复** 删除文件功能，原因是一个多用户系统，当一个文件被删除后，它所占用的存储空间可能立即分配给其他用户的文件

从系统角度看`linux`:

- 从宏观的角度看，系统可能由很多程序，很多计算机系统相互连接而成
- 通信: 进程 如何 与其他进程 交换信息?
- 协作: 如何协调多个进程，使它们没有冲突的访问共享资源?
- 网络: 处于不同计算机的程序，如何通过网络连接到一起？

拷贝`stdin`输入流到`stdout`输出流程序:

```c++
int main( int argc, char *argv[] )
{
    int c;
    while ( ( c = getchar() ) != EOF )
        putchar( c );
    return EXIT_SUCCESS;
}
```

第一个版本的`more`程序:

```c++
#define PAGELEN 3       // 一页显示行数
#define LINELEN 512     // 一行显示字符数

// 读取用户输入的一个字符，返回一个指令
// q -> 0:              退出
// [space] -> PAGELEN: 下一页
// [Enter] -> 1:       下一行
int see_more();

// 从 fp(标准输入流、文件流等) 中读取数据
void do_more( FILE *fp );

int main( int argc, char *argv[] )
{
    // 程序无参数，则从输入流读取数据
    if( argc == 1 )
    {
        do_more( stdin );
    }
    // 有参数，则默认参数为 文件名，依次显示文件内数据
    else
    {
        for( int i = 1; i < argc; ++i )
        {
            FILE *fp = fopen( argv[i], "r" );
            do_more( fp );
            fclose( fp );
        }
    }
    return EXIT_SUCCESS;
}

int see_more() {
    int c;
    printf("see more?");

    // 演示下从 /dev/tty 读取数据, Linux 会自动将 /dev/tty 重定向到一个终端窗口，因此该文件对于读取人工输入时特别有用
    FILE *fp_tty = fopen( "/dev/tty", "r" );
    if( fp_tty == nullptr )
        exit( 1 );

    while ( ( c = getc( fp_tty ) ) != EOF ) {
        switch (c) {
            case 'q':
                return 0;
            case ' ':
                return PAGELEN;
            case '\n':
                return 1;
            default:
                continue;
        }
    }
    fclose(fp_tty);
    return 0;
}

void do_more( FILE *fp ){

    char line[LINELEN];
    int num_of_lines = 0;

    while ( fgets( line, LINELEN, fp ) ){

        if( fputs( line, stdout ) == EOF )
            exit(1);
        else
            ++num_of_lines;

        // 每输出固定行，就询问一下用户，下一步操作: 退出？下一行？下一页？
        if( num_of_lines == PAGELEN ){
            int reply = see_more();
            if( reply == 0 )
                break;
            else
                num_of_lines -= reply;
        }
    }
}
```

`more`程序待解决的问题:

- 终端如何反白显示文字？
- 如何使用户输入的字符立即送到程序，而不用等待`[Enter]`? 如何使输入的字符不回显？用户操作的终端有很多参数，通过调整参数实现上述问题。
- 用户终端是分类型的(比如 VT100终端), 类型会影响到参数调整，如何使得程序能够兼容处理各种类型的终端? 这需要学习如何控制和调整终端参数的知识。

## 第2章 用户、文件操作与链接帮助

**文件描述符**: `open`系统调用在进程和文件之间建立一条链接，这条链接被称为文件描述符,同时打开多个文件，它们的文件描述符不同;同一个文件被多次打开，对应的文件描述符也不同

```c++
// how : `O_RDONLY`只读 `O_WRONLY` 只写 `O_RDWR` 可读可写
int fd = open( char *name, int how );

// read 从文件fd中读取数据，buf 存放读取到的数据的缓冲区，一般为一个定长数组, num 为定长数组大小
ssize_t numread = read( int fd, void *buf , size_t num)

// 向fd写入数据，buf是写入文件的准备数据，num 要写入的字节数，result 实际写入的字节数
ssize_t result = write(int fd, void *buf, size_t num)

// close 关闭进程和文件fd之间的链接
int result = close(int fd)

// creat 创建新文件，filename 文件名 带路径，mode 设置文件的访问权限
int fd = creat( char *filename, mode_t mode)
```

改变一个文件的当前读/写位置

- 进程打开文件，建立链接fd,会保存一个指针用来记录当前读写文件的位置
  - 读文件 ： 从文件开始处，读取指定的字节，然后移动指针，指向未被读取的字节
  - 写文件 : 从文件开始处写入指定字节，然后移动指针，指向写入后的位置
- 当两个进程同时打开同一个文件时，这时会有两个指针，两个进程对文件的操作不会互相干扰

lseek 修改一个链接 fd 的位置指针

- `off_t oldpos = lseek(int fd, off_t dist, int base)`
- dist 移动的字节数，可以为负
- base : `SEEK_SET` 文件的开始, `SEEK_CUR` 当前位置, `SEEK_END` 文件结尾

编写`who`命令:

```c++
void show_info( utmp *u ){
    if( u -> ut_type != USER_PROCESS )  // users only
        return;

    cout << u->ut_name << "\t";
    cout << u->ut_line << "\t";

    // 这里处理时间，类型转换是很麻烦
    char time_str[50];
    time_t time_num = u->ut_time;
    strftime( time_str, 50, "%Y-%m-%d %H:%M:%S", localtime( &time_num ) );
    printf( "%s ", time_str );

    cout << "(" << u->ut_host << ")" << endl;
}

int main( int argc, char *argv[] )
{
    utmp current_record = {};

    int utmpfd;
    int reclen = sizeof(current_record);

    if( ( utmpfd = open( UTMP_FILE, O_RDONLY ) ) == -1 ){
        perror( UTMP_FILE "Error" );
        exit(1);
    }

    while ( read( utmpfd, &current_record, reclen ) == reclen )
    {
        show_info( &current_record );
    }

    close( utmpfd );

    return EXIT_SUCCESS;
}
```

### 内核缓冲

- 内核使用缓冲来提高对磁盘的访问效率
- 内核将磁盘上的数据块复制到`内核缓冲区`，进程读取磁盘数据时，内核一般不直接读磁盘，而是将`内核缓冲区`的数据复制到`进程缓冲区`中
- 当进程所要求的数据不在`内核缓冲区`时，内核会把相应的`数据块读取请求`放入`内核请求队列`中，然后将进程挂起，接着为其他进程服务，一段时间后，当内核把相应的数据块从磁盘读取到`内核缓冲区`后，再唤起被挂起的进程，将数据从`内核缓冲区`复制到`进程缓冲区`
- `read()`系统调用实质是将`内核缓冲区`的数据复制到`进程缓冲区`
- `write()`系统调用的实质是将`进程缓冲区`数据复制到`内核缓冲区`
- `内核缓冲区`的数据写入磁盘也不是立即写入，而是积累到一定数量后，一次性写入磁盘
- 并不是所有的`write()`操作都能实质改变磁盘的数据。比如出现突然断电情况，内核来不及把内核缓冲区的数据写到磁盘上，这些更新的数据就会丢失。

### 处理系统调用的错误

- `open()`无法打开文件，`read()`无法读取文件，`lseek()`无法指定指针位置...等等系统调用，都返回 `-1`
- `-1` 就表示系统调用中出了问题，所以调用者每次都需要检查返回值，一旦检测到错误，就必须做出相应处理
- 错误种类: `全局变量errno` 用于指明错误的类型, 程序中任何地方都可以访问到这个变量

```c
#include <errno.h>
extern int errno;

if( (fd = open( "file1", O_RDONLY )) == -1 )
{
    if( errno == ENOENT )
        printf("there is no such file!");
    else if( errno == EINTR )
        printf( "interrupted while opening file!" );
    ...
}
```

- 显示错误信息 `perror("can not open file");`




## 第 3 章 目录与文件属性

- `DIR *opendir( dirname )`打开目录
- `struct dirent *direntp = readdir( DIR* dir_ptr)` 读取目录里面的内容
- `int result = stat(char *fname, struct stat *bufp)` 得到文件的各项属性
