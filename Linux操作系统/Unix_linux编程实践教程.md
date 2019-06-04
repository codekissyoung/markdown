# Unix/Linux编程实践教程

本文是《Unix-Linux编程实践教程》一书的笔记。主要记录对我有用的代码，以及原理的解释，罗嗦的总结性的东西就不记了。

## 第1章 Unix系统编程概述

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

**文件位置指针**: 进程打开文件,会保存一个指针用来记录当前读写文件的位置,当两个进程同时打开同一个文件时，这时会有两个指针，两个进程对文件的操作不会互相干扰

`read`与`write` 会改变一个文件的当前读/写位置:

- 读文件: 从指针当前位置，读取指定的字节，然后移动指针，指向未被读取的字节
- 写文件: 从指针当前位置，写入指定字节，然后移动指针，指向写入后的位置

```c++
int fd = open( char *name, int how ); // how : O_RDONLY只读 O_WRONLY只写 O_RDWR可读可写

// read 从文件fd中读取数据，buf 存放读取到的数据的缓冲区，一般为一个定长数组, num 为定长数组大小
ssize_t numread = read( int fd, void *buf , size_t num)

// 向fd写入数据，buf是写入文件的准备数据，num 要写入的字节数，result 实际写入的字节数
ssize_t result = write(int fd, void *buf, size_t num)

// close 关闭进程和文件fd之间的链接
int result = close(int fd)

// creat 创建新文件，filename 文件名 带路径，mode 设置文件的访问权限
int fd = creat( char *filename, mode_t mode)

// dist 可为负数，表明向前移动文件位置指针
// base : SEEK_SET 文件的开始, SEEK_CUR 当前位置, SEEK_END 文件结尾
off_t oldpos = lseek(int fd, off_t dist, int base);
```

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

编写`cp`命令:

```c++
#define BUFFSIZE 10

// usage: cp source-file target-file
int main( int argc, char *argv[] )
{
    int in_fd;          // 源文件描述符
    int out_fd;         // 目标文件描述符
    char buf[BUFFSIZE]; // 读取到的字节的缓存区

    in_fd  = open( argv[1], O_RDONLY );
    out_fd = creat( argv[2], 0644 );

    int r_byte_num; // 实际读取到的字节数
    int w_byte_num; // 实际存入的字节数
    while ( ( r_byte_num = read( in_fd, buf, BUFFSIZE )) > 0 ){
        w_byte_num = write( out_fd, buf, r_byte_num );
        cout << w_byte_num << " byte copied!" << endl;
    }

    close(in_fd);
    close(out_fd);

    return EXIT_SUCCESS;
}
```

### 内核缓冲

每次系统调用都会导致用户模式切换到内核模式，以执行内核代码，这种切换的效率是很低的，所以尽量减少程序中系统调用的次数，可以提高程序运行效率。

通常程序可以通过缓冲技术来减少系统调用的次数，比如一次性取大量文件数据放入程序的缓冲区，然后程序的操作都从缓冲区取数据，只有缓冲区满或者空时，才使用系统调用。

内核使用缓冲来提高对磁盘的访问效率:

- 内核将磁盘上的数据块复制到`内核缓冲区`，进程读取磁盘数据时，内核一般不直接读磁盘，而是将`内核缓冲区`的数据复制到`进程缓冲区`中
- 当进程所要求的数据不在`内核缓冲区`时，内核会把相应的`数据块读取请求`放入`内核请求队列`中，然后将进程挂起，接着为其他进程服务，一段时间后，当内核把相应的数据块从磁盘读取到`内核缓冲区`后，再唤起被挂起的进程，将数据从`内核缓冲区`复制到`进程缓冲区`
- `read()`系统调用实质是将`内核缓冲区`的数据复制到`进程缓冲区`
- `write()`系统调用的实质是将`进程缓冲区`数据复制到`内核缓冲区`
- `内核缓冲区`的数据写入磁盘也不是立即写入，而是积累到一定数量后，一次性写入磁盘
- 并不是所有的`write()`操作都能实质改变磁盘的数据。比如出现突然断电情况，内核来不及把内核缓冲区的数据写到磁盘上，这些更新的数据就会丢失。

### 处理系统调用的错误

系统调用出错时（`open()`无法打开文件，`read()`无法读取文件，`lseek()`无法指定指针位置），会将全局变量 `errno`的值设为相应的错误码，然后返回 `-1`。

所以，一旦检测系统调用到返回`-1`，则立即检查全局变量 `errno`（错误的类型），然后做相应处理。

```c
#include <errno.h>
extern int errno;

if( (fd = open( "file1", O_RDONLY )) == -1 )
{
    if( errno == ENOENT )
        printf("there is no such file!");
    else if( errno == EINTR )
        printf( "interrupted while opening file!" );
}
```

## 第3章 目录与文件属性

**目录**: 一种特殊的文件，它的内容是文件和目录的名字。每个目录包含`.`和`..`两个特殊的项。目录的内容不是单纯的文本，而是一定的数据结构（因文件系统而异），所以直接使用`open`打开会乱码，所以标准提供了一整套兼容所有格式的操作目录的方法。

```c++
DIR *opendir( dirname ); // 打开目录
struct dirent *direntp = readdir( DIR* dir_ptr); //  读取目录里面的内容
int result = stat(char *fname, struct stat *fileinfo); //  得到文件的各项属性
int result = chmod( char *path, mode_t mode ); // 设置文件的权限 mode 如 0744
int chown( char *path, uid_t owner, gid_t group ); // 设置文件的所有者 与 所有组
int utime( char *path, struct utimbuf *newtimes); // 修改文件最后修改时间 与 访问时间
int rename( char *old_path, char *new_path ); // 修改文件名，或者移动文件位置
```

`fileinfo->st_mode`是一个16位的二进制数，文件权限位:

![文件权限位](https://img.codekissyoung.com/2019/06/04/86c5b9a550cccacf4bc19d494503b303.png)

`set-user-ID`（`SUID`）位告诉内核: 运行这个文件时，认为是这个权限拥有者在运行这个程序,用户使用`passwd`命令可以修改`/etc/passwd`中自身的密码，就是这个原因。`user`权限中的`s`标志。

```bash
537557 -rwsr-xr-x 1 root root 63K 3月  23 02:32 /usr/bin/passwd
6554251 -rw-r--r-- 1 root root 2.9K 5月  11 00:32 /etc/passwd
```

`set-group-ID`位与`set-user-ID`作用类似，只是用户换成了组。`group`权限中的`x`被替换成`s`,即设置了`set-group-ID`

`sticky`位对于目录来说，设置了它，则在该目录里的文件只能被创建者删除。`other`权限中的`t`标志:

```bash
4194305 drwxrwxrwt 25 root root 4.0K 6月   5 00:26  .
```

编写`ls`命令:

```c++

void do_ls( const char *dirname );
void show_file_info( const char *filename );
char* mode_to_letters( int mode );

// -rwxrwxr-x 1  cky  cky  1.5M     2019-06-05 00:16:35  main
int main( int argc, char *argv[] )
{
    if( argc == 1 )
        do_ls( "." );
    else
        while ( --argc ){
            do_ls( *++argv );
        }

    return EXIT_SUCCESS;
}

void do_ls( const char * dirname ) {
    DIR *dir_ptr;
    struct dirent *dir_data;

    dir_ptr = opendir( dirname );

    while ( (dir_data = readdir(dir_ptr)) != nullptr ){
        show_file_info( dir_data->d_name );
    }

    closedir(dir_ptr);
}

void show_file_info( const char *filename ){
    struct stat info;
    stat( filename, &info );

    cout << mode_to_letters( info.st_mode ); // 权限

    cout << " " << info.st_nlink << " ";     // lnode 数
    cout << " " << getgrgid(info.st_gid) -> gr_name << " ";  // 用户组名
    cout << " " << getpwuid(info.st_uid) -> pw_name << " ";  // 用户名

    // 小数显示 文件大小
    cout << " " << setiosflags( ios::fixed ) << setprecision( 1 );
    if( info.st_size >= 1024 * 1024 * 1024 ){
        cout << info.st_size / (1024.0 * 1024.0 * 1024.0)  << "G\t";
    }else if( info.st_size < 1024 * 1024 * 1024 && info.st_size >= 1024 * 1024 ) {
        cout << info.st_size / (1024.0 * 1024.0)  << "M\t";
    }else if(info.st_size < 1024 * 1024 ){
        cout << info.st_size / 1024.0 << "K\t";
    }

    char time_str[30];
    strftime( time_str, 30, "%Y-%m-%d %H:%M:%S", localtime( &info.st_mtime ) );

    cout << " " << time_str << " ";

    cout << " " << filename << endl;
}

char* mode_to_letters( int mode ){
    char *str = new char[11];
    strcpy( str, "----------" );
    str[10] = '\0';

    if( S_ISDIR(mode) ) str[0] = 'd';
    if( S_ISCHR(mode) ) str[0] = 'c';
    if( S_ISBLK(mode) ) str[0] = 'b';

    if( mode & S_IRUSR ) str[1] = 'r';
    if( mode & S_IWUSR ) str[2] = 'w';
    if( mode & S_IXUSR ) str[3] = 'x';

    if( mode & S_IRGRP ) str[4] = 'r';
    if( mode & S_IWGRP ) str[5] = 'w';
    if( mode & S_IXGRP ) str[6] = 'x';

    if( mode & S_IROTH ) str[7] = 'r';
    if( mode & S_IWOTH ) str[8] = 'w';
    if( mode & S_IXOTH ) str[9] = 'x';
    return str;
}
```

## 第4章 文件系统:编写pwd
