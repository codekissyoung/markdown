# Unix/Linux 编程实践教程

## 第 1 章 Unix 系统编程概述

在登录过程中，当用户名和密码通过验证后，内核启动 `shell进程`,然后把用户交给`shell`,shell 再去与内核交互，期间 shell 也可以帮用户启动其他程序

每个用户都有属于自己的`shell`进程，当用户注销时，内核会结束所有分配给这个用户的进程

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

    // 演示下从 /dev/tty 读取数据, 
    // Linux 会自动将 /dev/tty 重定向到一个终端窗口，因此该文件对于读取人工输入时特别有用
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

- 如何使用户输入的字符立即送到程序，而不用等待`[Enter]`? 如何使输入的字符不回显？用户操作的终端有很多参数，通过调整参数实现上述问题。

- 用户终端是分类型的(比如 VT100 终端), 类型会影响到参数调整，如何使得程序能够兼容处理各种类型的终端? 这需要学习如何控制和调整终端参数的知识。

## 第 2 章 用户、文件操作与链接帮助

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

## 第 3 章 目录与文件属性

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

`fileinfo->st_mode`是一个 16 位的二进制数，文件权限位:

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

## 第 4 章 文件系统:编写 pwd

一块磁盘被划分成多个分区，分区再切成`512Byte`大小的扇区，扇区从 0 开始编号，然后将这些扇区分为三个部分（如下图）。

![文件系统](https://img.codekissyoung.com/2019/06/05/2f92f4319bd4f07a6b7b092133824cbc.png)

如果创建了一个新文件，文件系统该如何存储:

1. 存储属性，找到一个空`i-node`节点
1. 存储实际数据
1. 在`i-node`节点记录上述实际存储数据的块序列编号
1. 添加`i-node`节点序号，以及新文件名到 目录文件

![创建一个新文件](https://img.codekissyoung.com/2019/06/05/4d29857bebcee145268018e97cd0ede3.png)

`硬连接`的存储秘密 : `i-节点号`才是文件的唯一标识，在`目录`表中，出现同一`i-节点号`对应两个以上不同名字的，这些文件名互为`硬链接`，也就是同一个文件的多个名字。文件是一个 `i-节点` 和一些数据块的结合，链接是对`i-节点`的引用。文件没有文件名，链接有名字，对一个文件可以 创建任意多的链接。内核记录了一个文件的链接数。

读取一个文件的过程:

1. 在目录中寻找文件名，然后找到对应的`i-node`节点号
1. 定位到`i-node`节点，然后找到文件实际内容存储所在的块序号
1. 访问实际的数据块，通过系统调用`read()`依次读取数据块上内容，不断的将字节从磁盘复制到内核缓冲区，进而到达用户空间

![读取文件](https://img.codekissyoung.com/2019/06/05/d3d89bf8fa0ee7321c07fe2ba9e52ac2.png)

固定长度的`i-node`节点，如何跟踪大文件？答案是，使用`i-node`最后空间存储一个数据块的序号，该序号对应的数据存储区域里存的不是数据，而是文件接下来的存储序号，这个块称为间接块。

如果间接块也饱和了，那就继续使用这种方式构造下一个间接块，称为二级间接块。

![利用间接块存储大文件](https://img.codekissyoung.com/2019/06/05/958321519181a1c2b4d94246a4196caf.png)

目录树的两种视图:

![目录树的两种视图](https://img.codekissyoung.com/2019/06/05/43a3f1b6d04dbd346b6dbac886a62afa.png)

常用 API:

```c++
int result = mkdir( char *pathname, mode_t mode );        // 创建新目录
int result = rmdir( const char *path );                   // 删除目录
int result = unlink( const char *path );                  // 删除一个文件，i-node链接数减一
int result = link( const char *origin, const char *new ); // 创建一个硬链接,i-node链接数加一
int result = rename( const char *from, const char *to );  // 重命名一个链接，或移动到新目录
int result = chdir( const char *path );                   // 改变所调用进程的当前目录
```

`Linux`的每个分区有自己的文件系统树，`Linux`提供一种方法将这些树整合成一棵更大的树。

其中一个文件系统被命名为根文件系统，这棵树的顶端是整个树真正的根。其他的文件系统都是附加到根文件系统的某个子目录上，这个过程称为**挂载**。在内部，内核将根文件系统的一个目录作为指针，指向另一个文件系统的根，这样两个文件系统就联系起来了。

![树的嫁接](https://img.codekissyoung.com/2019/06/06/4069a55725ec3b10d4a3d1c4326daf36.png)

不同文件系统的`i-node`节点号会重复。所以，无法在不同文件系统使用`link`与`rename`，即不允许跨设备创建硬链接。软链接 `符号链接` : 通过名字引用文件，而不是`i-节点号`。

![i-node节点号](https://img.codekissyoung.com/2019/06/06/be65f228fdabee4ed2ae7a7b218389ed.png)

只能向上回溯到当前文件系统的根（不能跨文件系统）的`pwd`命令:

```c++
ino_t get_inode( const char * );
void printpathto( ino_t );
void inum_to_name( ino_t , char *, int );

int main( int argc, char *argv[] )
{
    printpathto( get_inode(".") );
    cout << endl;
}

void printpathto( ino_t this_inode ){

    ino_t my_inode;
    char its_name[BUFSIZ];

    if( get_inode("..") != this_inode ){
        chdir( ".." );
        inum_to_name( this_inode, its_name, BUFSIZ );
        my_inode = get_inode( "." );
        printpathto( my_inode );
        cout << "/" << its_name;
    }
}

ino_t get_inode( const char *fname ){
    struct stat info;
    stat( fname, &info );
    return info.st_ino;
}

void inum_to_name( ino_t inode_to_find, char *namebuf, int buflen ){
    DIR *dir_ptr;
    struct dirent *direntp;
    dir_ptr = opendir( "." );

    while ( ( direntp = readdir( dir_ptr ) ) != NULL ){
        if( direntp->d_ino == inode_to_find ){
            strncpy( namebuf, direntp->d_name, buflen );
            namebuf[buflen - 1] = '\0';
            closedir( dir_ptr );
            return ;
        }
    }
    return;
}
```

## 第 5 章 链接控制:学习 stty

### 设备如同文件

对`Linux`来说，声卡、终端、鼠标、磁盘文件是同一种对象。每个设备都被当作一个文件，拥有文件名、节点号、文件所有者、权限位以及最近修改时间。通常表示设备的文件，位于`/dev`目录下。

从磁带中读取数据:

```c++
int fd = open( "/dev/tape", O_RDONLY );
lseek( fd, (long)4096, SEEK_SET );
n = read( fd, buf, buflen );
close( fd );
```

终端就像文件。传统定义的终端是“键盘和显示单元”，实际包含的设备包括了打印机、键盘、一个串行接口的显示器或是一个调制解调器。而现在`telnet`和`ssh`窗口也被认为是一个终端。终端最重要的功能就是接受来自用户的输入，以及输出信息给用户。

```c++
➜  ~ git:(master) ✗ tty         // 查看当前终端对应的文件
/dev/pts/2
➜  ~ git:(master) ✗ who > /dev/pts/2
work     pts/2        2019-06-06 08:19 (61.141.250.115)
```

磁盘文件与终端文件的区别:

![磁盘文件与终端文件的区别](https://img.codekissyoung.com/2019/06/06/a528e51f3a95656ee57b162f095f68f2.png)

### 磁盘链接的属性

- 缓冲，默认是写入是带缓冲的，通过`O_SYNC`位，去关闭缓冲，使得立即写入到磁盘
- 自动添加模式,若干进程，写入同一个文件时，文件指针自动移动到 末尾，`O_APPEND`, 原子操作

![磁盘链接的属性](https://img.codekissyoung.com/2019/06/07/14ecda9e0ceddfc4ab01f4be212c8667.png)

```c++
int s  = fcntl( fd, F_GETFL ); // get flags
result = fcntl( fd, F_SETFL, s | O_SYNC ); // set SYNC bit set flags
```

```c++
int result = fcntl( int fd, int cmd );
int result = fcntl( int fd, int cmd, long arg );
int result = fcntl( int fd, int cmd, struct flock *lockp );

// open 第二个参数，用于设定 读写磁盘 属性
open( filepath, O_WRONLY | O_APPEND | O_SYNC );
O_CREAT 如果文件不存在，则创建它
O_TRUNC 如果文件存在，则长度清零
O_EXCL 防止两个进程创建 同名 文件
```

### 终端链接的属性

终端输入:

- 进程在用户输入`return`后，才接收数据，说明终端输入被 缓存了
- 用户输入在到达程序时，被终端转换过
- 程序输出到达屏幕时，被终端转换过

![终端链接的属性](https://img.codekissyoung.com/2019/06/07/5091fecfe57f6a62e64e28ebf95fce23.png)

查看终端链接属性:

```bash
➜  ~ stty --all
speed 38400 baud; rows 63; columns 116; line = 0;
intr = ^C; quit = ^\; erase = ^?; kill = ^U; eof = ^D; eol = <undef>; eol2 = <undef>; swtch = <undef>; start = ^Q;
stop = ^S; susp = ^Z; rprnt = ^R; werase = ^W; lnext = ^V; discard = ^O; min = 1; time = 0;
-parenb -parodd -cmspar cs8 -hupcl -cstopb cread -clocal -crtscts
-ignbrk -brkint -ignpar -parmrk -inpck -istrip -inlcr -igncr icrnl ixon -ixoff -iuclc -ixany -imaxbel iutf8
opost -olcuc -ocrnl onlcr -onocr -onlret -ofill -ofdel nl0 cr0 tab0 bs0 vt0 ff0
isig icanon iexten echo echoe echok -echonl -noflsh -xcase -tostop -echoprt echoctl echoke -flusho -extproc
```

终端链接设置:

- 输入: 处理从 终端 到 程序 的字符
- 输出: 处理从 程序 到 终端 的字符
- 控制: 字符如何被表示--位的个数、奇偶性、停止位
- 本地: 如何处理来自驱动程序内部的字符

如何设置:

```c++
struct termios attribs;
tcgetattr( fd, &settings );             // 获取设置
settings.c_lflag |= ECHO;               // 修改设置
tcsetattr( fd, TCSANOW, &settings );    // 写回设置
```

![设置操作](https://img.codekissyoung.com/2019/06/07/b385951ff83b5cd136baba943b1b3a95.png)

### 其他设备链接编程: ioctl

比如 CD 刻录机，可擦写的 CD，不同的刻录速度等。

```c++
int result = ioctl( int fd, int operation [, arg ...] );
```

## 第 6 章 为用户编程:终端控制与信号

用户程序:

- 立即响应键盘事件
- 有限的输入集
- 输入的超时
- 屏蔽`Ctrl + C`

终端模式小结:

- 规范模式:字符有缓冲，按下`return`键才将数据发送给程序，中间有转换，有基本的编辑功能: 删除字符、终止命令
- 非规范模式: 有转换，但是不再缓冲数据，所以没有编辑功能
- `raw`模式，所有处理都被关闭，驱动程序将输入直接传递给程序。

进程如何处理信号:

- 默认处理

```c++
signal( SIGINT, SIG_DFL );
```

- 忽略

```c++
signal( SIGINT, SIG_IGN );
```

- 调用自定义函数处理

```c++
signal( signum, func_name );
```

设置 无缓冲、无回显、非阻塞的示例程序,也包含了信号处理部分:

```c++
#define QUESTION "Do you want another transaction"

int get_response( const char *question, int try_num = 3 );
int get_enable_char( const char *str ); // 获得指定的字符之一
void set_crmode();                      // 无缓冲，一次输入一个字符，就发送到程序
void set_noecho_mode();                 // 无回显
void set_nodelay_mode();                // 非阻塞
void ctrl_c_handler( int );             // 处理 Ctrl + C 信号
void init_terminal();                   // 初始化 终端程序
void restore_terminal();                // 恢复终端程序

// 原始属性
termios original_mode = {};
int original_flags = 0;

int main( int argc, char *argv[] )
{
    init_terminal();

    signal( SIGINT, ctrl_c_handler );
    signal( SIGQUIT, SIG_IGN );

    set_crmode();
    set_noecho_mode();
    set_nodelay_mode();

    int response = get_response( QUESTION );

    restore_terminal();

    return response;
}

void init_terminal(){
    tcgetattr( STDIN_FILENO, &original_mode );
    original_flags = fcntl( STDIN_FILENO, F_GETFL );
}

void restore_terminal(){
    tcsetattr( STDIN_FILENO, TCSANOW, &original_mode );
    fcntl( STDIN_FILENO, F_SETFL, original_flags );
}

void ctrl_c_handler( int sig_num ){
    cout << "\n" << sig_num << " signal called " << endl;
    restore_terminal();
    exit( EXIT_FAILURE );
}

int get_response( const char *question, int try_num ){
    cout << question << "?(Y/N)";
    fflush( stdout );

    char input;
    while ( true ){
        sleep( 2 );
        switch( input = tolower( get_enable_char( "YyNn" ) ) )
        {
            case 'y':
                return 0;

            case 'n':
                return 2;

            case EOF:
                if( --try_num > 0 ){
                    cout << "\n try num left " << try_num << " : ";
                    break;
                }else{
                    cout << endl;
                    return 1;
                }
        }
    }
}

int get_enable_char( const char *str ){
    int c;
    // 跳过无用的 输入字符
    while ( ( c = getchar() ) != EOF && strchr( str, c ) == nullptr )
    {
        continue;
    }
    return c;
}

void set_crmode()
{
    termios ttystate;

    tcgetattr( STDIN_FILENO, &ttystate );

    ttystate.c_lflag &= ~ICANON; // no buffering
    ttystate.c_cc[VMIN] = 1;     // get 1 char at a time

    tcsetattr( STDIN_FILENO, TCSANOW, &ttystate );
}

void set_noecho_mode(){
    termios ttystate;

    tcgetattr( STDIN_FILENO, &ttystate );

    ttystate.c_lflag &= ~ECHO; // no echo

    tcsetattr( STDIN_FILENO, TCSANOW, &ttystate );
}

// 非阻塞输入，就是 getchar() 如果没读到数据，就直接返回了，不会等待用户输入了
void set_nodelay_mode(){
    int termflags;
    termflags = fcntl( STDIN_FILENO, F_GETFL );
    termflags |= O_NDELAY;
    fcntl( STDIN_FILENO, F_SETFL, termflags );
}
```

## 第 7 章 事件驱动编程:编写一个游戏

一个基于字符终端的单人弹球游戏:

- 空间: 游戏必须在计算机屏幕特定位置画像
- 时间: 影像以不同速度在屏幕移动
- 中断: 程序在移动影像的同时，用户还可以在任意时刻输入，程序如何响应中断?
- 同时处理: 程序如何同时做多件事情?

![单人弹球游戏](https://img.codekissyoung.com/2019/06/07/7993560f82766dd0545c95e368d697f0.png)

### 屏幕编程 curses 库

![curses库](https://img.codekissyoung.com/2019/06/07/7e194ebf33489907cc4acfc9ceee41a5.png)

```bash
sudo apt-get install libncurses5-dev libncursesw5 # 安装 curses 库
```

```c++
initscr();   // 初始化 curses 库 与 tty
endwin();    // 关闭 curses 并重置 tty
refresh();   //
move( r,c ); // 移动光标到 (r, c)位置
addstr( s ); // 当前位置画 字符串
addch( c );  // 当前位置画 字符
clear();     // 清屏
standout();  // 反色模式
standend();  // 关闭 反色模式
```

真实屏幕 与 虚拟屏幕: `move` 与 `addstr` 等函数只在 虚拟屏幕（一个数组） 上工作，`refresh` 比较 两个屏幕的差异，向真实屏幕发送，能让它跟 虚拟屏幕 一致的 控制码 和 字符。

![真实屏幕 与 虚拟屏幕](https://img.codekissyoung.com/2019/06/07/37b850b973e93bebefcf0ad594a84026.png)

### 时钟编程

![时间](https://img.codekissyoung.com/2019/06/10/e7b00f454553271e1d919d78edcc43f2.png)

每个进程都有三个时间，`ITIMER_REAL` 真实世界的时间、`ITIMER_VIRTUAL` 进程在用户态运行的时间、`ITIMER_PROF`。

![三个时钟](https://img.codekissyoung.com/2019/06/10/ad0e1b0c11d23e3b4734601c51cc5676.png)

计时器是内核的一种机制，通过这种机制，内核在一定时间之后向进程发送`SIGALRM`信号，`alarm()`系统调用在特定的实际秒数后，内核发送`SIGALRM`信号。`setitimer`系统调用精度更高，并且还能设置以固定的时间间隔发送信号。

```c++
void countdown( int a );        // 处理时钟信号
int set_ticker( int n_msecs );  // 设置间隔调用时钟

int main( int argc, char *argv[] )
{
    signal( SIGALRM, countdown ); // 处理时钟信号

    if( set_ticker( 500 ) == -1 ){
        perror("set_ticker");
    }else{
        while ( true ){
            pause(); // or do something else
        }
    }
    return 0;
}

void countdown( int a ){
    static int num = 10;
    printf( "%d .. ", num-- );
    fflush( stdout );
    if( num < 0 ){
        printf("DONE!\n");
        exit(0);
    }
}

int set_ticker( int n_msecs ){

    long n_sec = n_msecs / 1000;
    long n_usecs = ( n_msecs % 1000 ) * 100L;

    itimerval new_timeset;

    // time to next timer expiration
    new_timeset.it_value.tv_sec = n_sec;
    new_timeset.it_value.tv_usec = n_usecs;

    // 间隔调用时间
    new_timeset.it_interval.tv_sec = n_sec;
    new_timeset.it_interval.tv_usec = n_usecs;

    return setitimer( ITIMER_REAL, &new_timeset, NULL );
}
```

### 处理多个信号

使用`signal()`函数面临的问题:

- 处理函数每次使用后，需要重新设置么？就像捕鼠器抓到老鼠后，需要被重新设置一样？
- 如果 `SIGY` 信号在进程处理 `SIGX` 信号时到达，会发生什么？
- 在进程处理 `SIGX` 信号时, 第二个、第三个 `SIGX` 信号又到达了，会发生什么？
- 如果信号到来时，程序正在处理`getchar`或`read`之类的输入而阻塞，会发生什么？

```c++
#define INPUTLEN 100

void inthandler( int s ); // 处理 Ctrl + C 信号
void quithandler( int s); // 处理 Ctrl + \ 信号

int main( int argc, char *argv[] )
{
    char input[INPUTLEN];
    int nchars;

    signal( SIGINT, inthandler );
    signal( SIGQUIT, quithandler );

    do{
        cout << "type a message: ";
        nchars = read( STDIN_FILENO, input, ( INPUTLEN -1 ) );
        if( nchars == -1 ){
            perror("read returned an error");
        } else {
            input[nchars] = '\0';
            printf("you typed: %s", input );
        }
    }while( strncmp( input, "quit", 4 ) != 0 );

    return 0;
}

void inthandler( int s ){
    printf("Received signal %d .. waiting\n", s );
    sleep(2);
    printf("Leaving inthandler\n");
}

void quithandler( int s){
    printf("Received signal %d .. waiting\n", s );
    sleep(2);
    printf("Leaving quithandler\n");
}
```

上述信号处理机制的弱点:

- 不知道信号被发送的原因，只知道 是 某信号
- 处理函数中不能安全地 阻塞其他 信号，比如想让程序在处理`SIGINT`时，忽略`SIGQUIT`

```c++
void inthandler( int s ){
    void ( *prev_qhandler )();
    prev_qhandler = signal( SIGQUIT, SIG_IGN ); // 忽略 SIGQUIT 信号

    // 处理 SIGINT 信号

    signal( SIGQUIT, prev_qhandler ); // 恢复 SIGQUIT 信号
}
```

### sigaction 机制

后面出现了`sigaction`库（POSIX 模型）解决了上述问题。

```c++
int result = sigaction( int signum, const struct sigaction *action, struct sigaction *prevaction );
struct sigaction{
    // 二者选其一 使用
    void (*sa_handler)();       // SIG_DFL, SIG_IGN, or function
    void (*sa_sigaction)( int, siginfo_t *, void *); // sigaction handler

    sigset_t sa_mask; // 指定哪些信号要被阻塞
    int sa_flags;     // 如下图
}
int result = sigprocmask( int how, const sigset_t *sigs, sigset_t *prev ); // 修改信号 mask
```

![sa_flags](https://img.codekissyoung.com/2019/06/10/71c0ed1a325d2ac5652a48b74275befd.png)

使用例子:

```c++
#define INPUTLEN 100

void inthandler( int s ){
    printf("Received signal %d .. waiting\n", s );
    sleep(2);
    printf("Leaving inthandler\n");
}

int main( int argc, char *argv[] )
{
    struct sigaction newhandler = {};
    sigset_t blocked;
    char x[INPUTLEN];

    newhandler.sa_handler = inthandler;
    newhandler.sa_flags = SA_RESETHAND | SA_RESTART; // 第二个 Ctrl + C 将会杀死进程
    sigemptyset( &blocked );
    sigaddset( &blocked, SIGQUIT );
    newhandler.sa_mask = blocked;

    if( sigaction( SIGINT, &newhandler, NULL ) ==  -1 )
    {
        perror("sigaction");
    }else{
        while(true){
            fgets( x, INPUTLEN, stdin );
            printf("input: %s", x );
        }
    }

    return 0;
}
```

阻塞信号:

- 在处理一个信号时，通过设置`struct sigaction`中的`sa_mask`成员位
- 通过`sigprocmask`设置当前进程需要阻塞的信号
- 通过`sigsetops`来添加和删除信号

```c++
sigemptyset( sigset_t *setp ); // 清除 setp 列表中所有信号
sigfillset( sigset_t *setp );  // 添加所有信号，到 setp 指向的列表
sigaddset( sigset_t *setp, int signum );
sigdelset( sigset_t *setp, int signum );
```

暂时阻塞用户信号例子:

```c++
sigset_t sigs, prevsigs;
sigemptyset( &sigs );
sigaddset( &sigs, SIGINT );
sigaddset( &sigs, SIGQUIT );

sigprocmask( SIG_BLOCK, &sigs, &prevsigs );  // 阻塞 SIGINT 与 SIGQUIT 信号

// ... do something

sigprocmask( SIG_SET, *prevsigs, NULL );     // 恢复 之前的 设置
```

一个利用间隔定时器 以及 信号 产生动画效果的 弹球，还能通过 用户 输入 改变 球的速度:

```c++
#define MESSAGE "O"
#define BLANK   " "

void move_msg( int n );
int set_ticker( int n_msecs );

int row;   // 当前行
int col;   // 当前列
int x_dir; // x轴方向
int y_dir; // y轴方向

int main( int argc, char *argv[] )
{
    initscr();
    crmode();
    noecho();
    clear();

    int delay  = 200;

    row = 0, col = 0, x_dir = +1, y_dir = +1;

    move( row, col );
    addstr( MESSAGE );

    signal( SIGALRM, move_msg );

    set_ticker( delay );

    while ( true )
    {
        int ndelay = 0;

        int c = getch();

        if( c == 'q' )
            break;

        switch ( c )
        {
            case ' ':
                x_dir = -x_dir;
                break;
            case 'f':
                if( delay > 2 )
                    ndelay = delay / 2;
                break;
            case 's':
                ndelay = delay * 2;
                break;
        }
        if( ndelay > 0 )
            set_ticker( delay = ndelay );
    }

    endwin();
    return 0;
}

void move_msg( int n ){
    signal( SIGALRM, move_msg ); // reset, just in case

    move( row, col );
    addstr( BLANK );

    col += x_dir;
    row += y_dir;

    move( row, col );
    addstr( MESSAGE );

    move( LINES - 1, 0 );
    refresh();

    if( x_dir == -1 && col <= 0 )
        x_dir = 1;
    else if( x_dir == 1 && col + strlen(MESSAGE) >= (unsigned int)COLS )
        x_dir = -1;

    if( y_dir == -1 && row <= 0 )
        y_dir = 1;
    else if( y_dir == 1 && row >= LINES - 1 )
        y_dir = -1;
}

int set_ticker( int n_msecs ){
    long n_sec   = n_msecs / 1000;
    long n_usecs = ( n_msecs % 1000 ) * 100;

    itimerval new_timeset = {};

    // time to next timer expiration
    new_timeset.it_value.tv_sec = n_sec;
    new_timeset.it_value.tv_usec = n_usecs;

    // 间隔调用时间
    new_timeset.it_interval.tv_sec = n_sec;
    new_timeset.it_interval.tv_usec = n_usecs;

    return setitimer( ITIMER_REAL, &new_timeset, nullptr );
}
```

## 第 8 章 进程和程序: 编写命令解释器 sh

一个程序是存储在文件中的机器指令序列，运行一个程序意味着把它装载到内存，然后让 CPU 逐条执行这些指令。

系统把内存看作由页面构成的数组，将进程分割到不同的页面:

![进程在内存中](https://img.codekissyoung.com/2019/06/12/3f0a8a4b5231492c8e121cc10ae4f32d.png)

查看系统中运行的程序的两个命令:

```bash
ps auxf
ps alxf
pstree -aph
```

`shell`程序的功能:

- 运行其他程序，`shell`可看作是程序启动器
- 管理输入与输出，包括`<` `>` `|` 等重定向与管道的功能
- 可编程，可以编写`shell`脚本，提供变量与控制语句

`shell`的主循环执行下面 4 步:

- 等待用户输入程序名 `a.out`
- 建立一个新进程来运行 `a.out`
- `shell`将`a.out`文件从磁盘加载到新进程
- `shell`等待程序运行结束

```bash
while( ! end_of_input ){
    get command;
    excute command;
    wait for command to finish;
}
```

![shell时间轴](https://img.codekissyoung.com/2019/06/13/0577449ebe7a9eef653c41cdc3d07816.png)

一个程序如何运行另一个程序？利用`execvp`系统调用:

```c++
main(){
    char *arglist[3];

    arglist[0] = "ls";
    arglist[1] = "-l";
    arglist[2] = NULL; // 最后一个元素必须是 NULL

    execvp( "ls", arglist );
}
```

### fork 创建新进程

```c++
pid_t result = fork( void );
pid_t result = wait( int *statusptr );
```

进程调用`fork`,然后内核中的`fork`代码执行:

- 分配新内存块 和 内核数据结构
- 复制原来的进程到新的进程
- 向运行进程集添加新的进程
- 将控制返回给两个进程

当一个进程调用`fork`之后，就有两个二进制代码相同的进程。而且它们都运行到相同的地方。但是每个进程都可以开始它们自己的旅程。

![fork](https://img.codekissyoung.com/2019/06/15/8ed98ab56903a0eab107e0d2ee49dc97.png)

最简单的`fork`调用例子:

```c++
int fork_rv;
printf("Before: my pid is %d\n", getpid());
fork_rv = fork();
if( fork_rv == -1 ){
    perror("fork");
    exit(1);
}else if( fork_rv == 0 ){
    printf("child process, pid : %d\n", getpid());
}else{
    printf("parent process, pid : %d\n", getpid());
}
return 0;
```

父进程可以等待子进程结束吗？

![父进程可以等待子进程结束](https://img.codekissyoung.com/2019/06/15/be42c11edbd68c04110009cb7586f084.png)

父进程调用`wait`,内核挂起父进程直到子进程结束。子进程调用`exit`结束，内核唤醒父进程，并传入子进程的运行数据等信息。

![父子进程执行流程](https://img.codekissyoung.com/2019/06/15/acc95361b1360d43b8fdf2bbaf73c049.png)

父进程在`wait`处阻塞，然后在子进程退出后，继续运行。`wait`还会返回调用`exit`的子进程的`pid`,它的目的之一就是通知父进程：哪个子进程运行结束了，是如何结束的。

最简单的`wait`例子:

```c++
void child_code( int delay );
void parent_code( int childpid );

int main( int argc, char *argv[] )
{
    printf("Before: my pid is %d\n", getpid());
    int fork_rv = fork();
    if( fork_rv == -1 ){
        perror("fork");
        exit(1);
    }
    else if( fork_rv == 0 )
        child_code( 30 );
    else
        parent_code( fork_rv );

    return 0;
}

void child_code( int delay ){
    printf("child %d here, will sleep for %d second\n", getpid(), delay );
    sleep( delay );
    printf("child done. about to exit\n");
    exit( 0 );
}

void parent_code( int childpid ){
    int child_status = 0;
    int high_8, low_7, bit_7 = 0;

    int wait_rv = wait( &child_status );
    printf("done wating for %d. Wait returned: %d\n", childpid, wait_rv );

    high_8 = child_status >> 8;
    low_7  = child_status & 0x7F;
    bit_7  = child_status & 0x80;

    printf("status: exit = %d, sig = %d, core = %d\n", high_8, low_7, bit_7 );
}
```

所以，`shell`的实现流程如下:

![shell实现流程](https://img.codekissyoung.com/2019/06/15/752075880b24d4af17f8f55eb57c60ad.png)

```c++
char *makestring( char *buf );
void excute( char *arglist[] );
void parent_code( int childpid );

#define MAXARGS 20
#define ARGLEN 100

int main( int argc, char *argv[] )
{
    char *arglist[MAXARGS + 1] = {};
    int numargs = 0;
    char argbuff[ARGLEN];
    while ( numargs < MAXARGS ){
        printf("Arg[%d] ", numargs);
        fgets(argbuff, ARGLEN, stdin);
        if(  *argbuff != '\n' ){
            arglist[numargs++] = makestring( argbuff );
        }else{
            if( numargs > 0 ){
                arglist[numargs] = nullptr;
                excute( arglist );
                numargs = 0;
            }
        }
    }
    return 0;
}

char *makestring( char *buf ){
    char *cp;
    buf[strlen(buf) - 1] = '\0';
    cp = (char *)malloc( strlen(buf) + 1 );
    if( cp == nullptr ){
        fprintf(stderr, "no memory");
        exit(1);
    }
    strcpy( cp, buf );
    return cp;
}

void excute( char *arglist[] ){
    int pid = fork();
    if( pid == -1 ){
        perror("fork failed!");
        exit(1);
    }else if( pid == 0 ){
        execvp( arglist[0], arglist );
        perror("execvp failed");
        exit(1);
    }else{
        parent_code( pid );
    }
}

void parent_code( int childpid ){
    int child_status = 0;
    int high_8, low_7, bit_7 = 0;

    int wait_rv = wait( &child_status );
    printf("done wating for %d. Wait returned: %d\n", childpid, wait_rv );

    high_8 = child_status >> 8;
    low_7  = child_status & 0x7F;
    bit_7  = child_status & 0x80;

    printf("status: exit = %d, sig = %d, core = %d\n", high_8, low_7, bit_7 );
}
```

上述程序的问题: 按下`Ctrl + C` 会将父进程 与 子进程一起杀死。原因是: 键盘信号发给所有链接的进程，父子进程都链接到终端，当`Ctrl + C`按下时，`ttr`驱动告诉内核向由这个终端控制的所有进程发送`SIGINT`信号。

解决方案是，让父进程忽略`Ctrl + C`信号:

```c++
signal( SIGINT, SIG_IGN ); // 让父进程 忽略 Ctrl + C 信号
parent_code( pid );
```

### 用进程编程

对于函数是`call/return`,而对于父子进程之间是`execvp/exit`。能否将这种通过 参数和返回值 在 拥有私有数据的 函数间 通信的模式，拓展到程序之间？

![函数调用和程序调用](https://img.codekissyoung.com/2019/06/15/f7fd50156c99f436717ba780f1c2f9c3.png)

事实就是: `Unix` 程序常常设计成一组子程序，而不是一个带有很多函数的大程序。

由`exec`传递的参数必须是字符串，所以进程间通信的参数类型必须为字符串，这种基于文本的程序接口类型天然支持跨平台。

`exit`是`fork`的逆操作:

- 刷新所有流
- 调用由 `atexit` 与 `on_exit` 注册的函数
- 执行当前系统定义的其他与`exit`相关的操作
- 调用`_exit`, 它是一个内核操作，处理所有分配给这个进程的内存，关闭所有这个进程打开的文件，释放所有内核用来管理和维护这个进程的数据结构
  - 关闭所有文件描述符 和 目录描述符
  - 将该进程的`PID`置为`init`进程的`PID`
  - 如果父进程调用`wait`或`waitpid`来等待子进程结束，则通知父进程
  - 向父进程发送`SIGCHLD`

## 第 9 章 可编程的 shell、shell 变量和环境:编写自己的 shell

```bash
#!/bin/bash
BOOK=$HOME/phonebook.data
echo "find what name in phonebook";
read NAME

if grep $NAME $BOOK > /tmp/pb.tmp
then
    echo "Entries for " $NAME
    cat /tmp/pb.tmp
else
    echo "No entries for " $NAME
fi
rm /tmp/pb.tmp
```

上述脚本包含:

- 变量
- 用户输入
- 控制
- 环境，比如`$HOME`

![environ环境变量的问题](https://img.codekissyoung.com/2019/06/15/5520ffa6adafe8f092655508fc6b3c00.png)

## 第 10 章 I/O 重定向和管道

## 第 11 章 链接到近端或远端的进程:服务器与 Socket

## 第 12 章 链接和协议:编写 Web 服务器

## 第 13 章 基于数据报(Datagram)的编程:编写许可证服务器

## 第 14 章 线程机制: 并发函数的使用

## 第 15 章 进程间通信 IPC
