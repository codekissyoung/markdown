# Unix/Linux 编程实践教程

## 第 3 章 目录与文件属性

`fileinfo->st_mode`是一个 16 位的二进制数，文件权限位:

![](http://img.codekissyoung.com/2019/06/04/86c5b9a550cccacf4bc19d494503b303.png)

`set-user-ID`（`SUID`）位告诉内核: 运行这个文件时，认为是这个权限拥有者在运行这个程序,用户使用`passwd`命令可以修改`/etc/passwd`中自身的密码，就是这个原因。
显示特征是：`user`权限中的`s`标志。

```bash
537557 -rwsr-xr-x 1 root root 63K 3月  23 02:32 /usr/bin/passwd
```

`set-group-ID`位与`set-user-ID`作用类似，只是用户换成了组。`group`权限中的`x`被替换成`s`,即设置了`set-group-ID`

`sticky`位对于目录来说，设置了它，则在该目录里的文件只能被创建者删除。

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

    if( S_ISDIR(mode) ) str[0]  = 'd';
    if( S_ISCHR(mode) ) str[0]  = 'c';
    if( S_ISBLK(mode) ) str[0]  = 'b';
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

创建一个新文件，文件系统该如何存储:

1. 找到一个空`i-node`节点，存储属性信息
1. 存储实际数据
1. 存储数据的块序列号到`i-node`节点
1. save `i-node` number and filename to dir-file

![创建一个新文件](http://img.codekissyoung.com/2019/06/05/4d29857bebcee145268018e97cd0ede3.png)

`硬连接`的存储秘密 : `i-节点号`才是文件的唯一标识，在`目录`表中，出现同一`i-节点号`对应两个以上不同名字的，这些文件名互为`硬链接`，也就是同一个文件的多个名字。文件是一个 `i-节点` 和一些数据块的结合，链接是对`i-节点`的引用。文件没有文件名，链接有名字，对一个文件可以 创建任意多的链接。内核记录了一个文件的链接数。

读取一个文件的过程:

1. 在目录中寻找文件名，然后找到对应的`i-node`节点号
1. 定位到`i-node`节点，然后找到文件实际内容存储所在的块序号
1. 访问实际的数据块，通过系统调用`read()`依次读取数据块上内容，不断的将字节从磁盘复制到内核缓冲区，进而到达用户空间

![读取文件](http://img.codekissyoung.com/2019/06/05/d3d89bf8fa0ee7321c07fe2ba9e52ac2.png)

固定长度的`i-node`节点，如何跟踪大文件？答案是，使用`i-node`最后空间存储一个数据块的序号，该序号对应的数据存储区域里存的不是数据，而是文件接下来的存储序号，这个块称为间接块。

如果间接块也饱和了，那就继续使用这种方式构造下一个间接块，称为二级间接块。

![利用间接块存储大文件](http://img.codekissyoung.com/2019/06/05/958321519181a1c2b4d94246a4196caf.png)

目录树的两种视图:

![目录树的两种视图](http://img.codekissyoung.com/2019/06/05/43a3f1b6d04dbd346b6dbac886a62afa.png)

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

![树的嫁接](http://img.codekissyoung.com/2019/06/06/4069a55725ec3b10d4a3d1c4326daf36.png)

不同文件系统的`i-node`节点号会重复。所以，无法在不同文件系统使用`link`与`rename`，即不允许跨设备创建硬链接。软链接 `符号链接` : 通过名字引用文件，而不是`i-节点号`。

![i-node节点号](http://img.codekissyoung.com/2019/06/06/be65f228fdabee4ed2ae7a7b218389ed.png)

只能向上回溯到当前文件系统的根（不能跨文件系统）的`pwd`命令:

```c++
ino_t get_inode( const char * );
void printpathto( ino_t );
void inum_to_name( ino_t , char *, int );

int main( int argc, char *argv[] ){
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

![磁盘文件与终端文件的区别](http://img.codekissyoung.com/2019/06/06/a528e51f3a95656ee57b162f095f68f2.png)

### 磁盘链接的属性

- 缓冲默认是写入是带缓冲的，通过`O_SYNC`位，去关闭缓冲，使得立即写入到磁盘
- 自动添加模式,若干进程，写入同一个文件时，文件指针自动移动到末尾，`O_APPEND`, 原子操作

![磁盘链接的属性](http://img.codekissyoung.com/2019/06/07/14ecda9e0ceddfc4ab01f4be212c8667.png)

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

![终端链接的属性](http://img.codekissyoung.com/2019/06/07/5091fecfe57f6a62e64e28ebf95fce23.png)

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

![设置操作](http://img.codekissyoung.com/2019/06/07/b385951ff83b5cd136baba943b1b3a95.png)

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

![单人弹球游戏](http://img.codekissyoung.com/2019/06/07/7993560f82766dd0545c95e368d697f0.png)

### 屏幕编程 curses 库

![curses库](http://img.codekissyoung.com/2019/06/07/7e194ebf33489907cc4acfc9ceee41a5.png)

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

![真实屏幕 与 虚拟屏幕](http://img.codekissyoung.com/2019/06/07/37b850b973e93bebefcf0ad594a84026.png)

### 时钟编程

![时间](http://img.codekissyoung.com/2019/06/10/e7b00f454553271e1d919d78edcc43f2.png)

每个进程都有三个时间，`ITIMER_REAL` 真实世界的时间、`ITIMER_VIRTUAL` 进程在用户态运行的时间、`ITIMER_PROF`。

![三个时钟](http://img.codekissyoung.com/2019/06/10/ad0e1b0c11d23e3b4734601c51cc5676.png)

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

![sa_flags](http://img.codekissyoung.com/2019/06/10/71c0ed1a325d2ac5652a48b74275befd.png)

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

![进程在内存中](http://img.codekissyoung.com/2019/06/12/3f0a8a4b5231492c8e121cc10ae4f32d.png)

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

![shell时间轴](http://img.codekissyoung.com/2019/06/13/0577449ebe7a9eef653c41cdc3d07816.png)

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

![fork](http://img.codekissyoung.com/2019/06/15/8ed98ab56903a0eab107e0d2ee49dc97.png)

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

![父进程可以等待子进程结束](http://img.codekissyoung.com/2019/06/15/be42c11edbd68c04110009cb7586f084.png)

父进程调用`wait`,内核挂起父进程直到子进程结束。子进程调用`exit`结束，内核唤醒父进程，并传入子进程的运行数据等信息。

![父子进程执行流程](http://img.codekissyoung.com/2019/06/15/acc95361b1360d43b8fdf2bbaf73c049.png)

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

![shell实现流程](http://img.codekissyoung.com/2019/06/15/752075880b24d4af17f8f55eb57c60ad.png)

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

![函数调用和程序调用](http://img.codekissyoung.com/2019/06/15/f7fd50156c99f436717ba780f1c2f9c3.png)

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

## 第 9 章 shell

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

![environ环境变量的问题](http://img.codekissyoung.com/2019/06/15/5520ffa6adafe8f092655508fc6b3c00.png)

## 
