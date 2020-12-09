# Linux系统编程

## 2. 基本概念

内核、`shell`、用户、用户组、单根目录层级、目录、硬链接、软链接、文件、文件 I/O 模型、程序、进程、内存映射、静态库、动态库、进程间通信`IPC`、进程间同步、信号、线程、进程组、`shell`任务控制、会话、控制终端、控制进程、伪终端、日期和时间、`C/S`架构、实时性、`/proc`文件系统。

## 3. 系统编程概念

系统调用、库函数、标准 C 语言函数库`glibc`、错误处理、可移植性。

### 外壳函数

- `glibc`封装`系统调用`成库函数，称为“外壳函数”，外壳函数通过 栈 接收参数，并且将将这些参数写入内核规定的寄存器
- 所有系统调用进入内核的方式是相同的，有个特殊的寄存器`%eax`存入系统调用编号，用以区分每个系统调用
- 外壳函数 执行一条 中断指令 `int 0x80` ，将处理器由用户态切换到核心态，并执行系统中断 `0x80` 的中断矢量所指向的代码
- 响应中断 `0x80`, 内核调用 `system_call()` 例程
  - 内核栈中保存寄存器的值
  - 检查系统调用编号的有效性
  - 索引服务例程的列表，调用对应例程,检查参数的有效性，执行例程任务，将结果状态返回给 `system_call` 例程
- 从内核栈中恢复例程的各个寄存器值，将系统调用返回值置于栈中
- 返回至外壳函数，同时将处理器切换回用户态
- 如果系统调用出错，会返回一个负值给外壳函数，C 标准库的外壳函数对该负值 取反，并且将结果拷贝至 全局变量 `errno` , 同时 以 `-1` 作为外壳函数的返回值

## 4. 通用文件 I/O 模型

I/O 通用性, 同一套系统调用可以用于所有的文件类型，包括设备文件，由内核将这些调用转化为相应的文件系统操作，或者设备驱动操作，就本质而言，内核只提供一种文件类型: 字节流序列，没有文件结束符的概念, 读取文件时，如果无数据返回，便会认为抵达文件末尾。

文件描述符、`flags`文件访问模式、`mode`新建文件权限。

```c
int open( char *pathname, int flags, [int mode]);
int fd = open( "/home/cky/testfile", O_CREAT | O_WRONLY | O_TRUNC, S_IRUSR | S_IWUSR ); // eg.
```

```bash
flags:
O_RDONLY    只读    O_WRONLY    只写    O_RDWR      可读可写
O_CLOEXEC   当exec时，自动关闭文件描述符
O_CREAT     不存在则新建    O_EXCL  文件存在则报错
O_DIRECT    关闭缓冲
O_NOATIME   不修改文件 atime
O_NOCTTY    阻止成为控制终端
O_NOFOLLOW  不要解引用软链接
O_TRUNC     截断为0
O_APPEND    追加模式
O_ASYNC     当I/O操作可用，产生signal通知进程,必须使用fcntl指定
O_SYNC      同步IO O_DSYNC 保持数据完整性
O_NONBLOCK  非阻塞

mode:
用户  : S_IRWXU(rwx) S_IRUSR(r)  S_IWUSR(w)  S_IXUSR(x)
用户组: S_IRWXG(rwx) S_IRGRP(r)  S_IWGRP(w)  S_IXGRP(x)
其他  : S_IRWXO(rwx) S_IROTH(r)  S_IWOTH(w)  S_IXOTH(x)

特殊位:
S_ISUID  0004000 set-user-ID bit
S_ISGID  0002000 set-group-ID bit (see inode(7)).
S_ISVTX  0001000 sticky bit (see inode(7)).
```

```c
ssize_t read(int fd, void *buf, size_t cnt );   // real read bytes; 0 on EOF; -1 on error
ssize_t write(int fd, void *buf, size_t cnt );  // real write bytes; -1 on error
close(int fd);                                  // 0 on success; -1 on error
```

```c
off_t lseek(int fd, off_t offset, int whence);  // new file offset; -1 on error

whence:
    SEEK_SET    文件头 0 字节处
    SEEK_CUR    当前字节处
    SEEK_END    文件结尾处
```

```c
int ioctl(int fd, int request, .../* argp */); // depends on request; -1 on error
```

## 5. 深入探究文件 I/O

```c
int fcntl(int fd, int cmd, ...); // depends on cmd; -1 on error

// eg. add O_APPEND mode
int flags = fcntl( fd, F_GETFL );
flags |= O_APPEND;
fcntl( fd, F_SETFL, flags );
```

```c
int dup(int oldfd);             // new fd; -1 on error
int dup2(int oldfd, int newfd); // new fd; -1 on error
int dup3(int oldfd, int newfd, int flags); // new fd; -1 on error
```

![](https://img.codekissyoung.com/2019/10/28/272aa9e92430e17189092d3ddf4626e5.png)

现象 1:进程 A 中`fd=1`和`fd=20`指向同一个文件打开表记录，这种情况可能是`dup` `dup2` `fcntl`调用后生成的。

现象 2: 进程 A 与进程 B 的`fd=2`文件描述符指向同一个文件打开表记录，这种情况可能是 `A` 与 `B`为父子进程，继承而来的文件描述符。

现象 3: 文件打开表中`0`与`86`号记录指向同一个`i-node`表记录`1976`，这种情况可能是`A`与`B`进程打开同一个文件产生的。

#### 指定位置读写

```c
// 在指定offset处读入，并且不改变文件偏移量
ssize_t pread(int fd, void *buf, size_t cnt, off_t offset); // read bytes cnt; 0 on EOF; -1 on error

ssize_t pwrite(int fd, void *buf, size_t cnt, off_t offset); // write bytes cnt; -1 on error
```

#### 分散输入与集中输出

```c
struct iovec{
    void *iov_base;
    size_t iov_len;
};
// 依次读入到 多个缓冲区
ssize_t readv(int fd, struct iovec *iov, int iovcnt ); // read bytes cnt; 0 on EOF; -1 on error
// 依次从多个缓冲区 写入到文件
ssize_t writev(int fd, struct iovec *iov, int iovcnt );// write bytes cnt; -1 on error
```

#### 指定位置分散输入与集中输出

```c
ssize_t preadv(int fd, struct iovec *iov, int iovcnt, off_t offset);
ssize_t pwritev(int fd, struct iovec *iov, int iovcnt, off_t offset);
```

#### 截断文件到指定长度

```c
int truncate(char *pathname, off_t length );// 0 on success; -1 on error
int ftruncate(int fd, off_t length);        // 0 on success; -1 on error
```

#### 创建临时文件

```c
int mkstemp(char *template); // return fd on success; -1 on error
FILE *tmpfile(void);        // return file pointer ; NULL on error

// eg.
int fd = mkstemp("/tmp/somestringXXXXXX"); // XXXXXX 为必须的格式
```

## 6. 进程

```c
pid_t getpid(void);     // return pid of caller
pid_t getppid(void);    // get pid of caller's parent
```

![](https://img.codekissyoung.com/2019/10/28/9f6db6f1d7e327e3a0e987c4c6386c08.png)

#### 进程环境

```c
char *getenv(char *name);   // return pointer to string; NULL for no such variable
char *putenv(char *string); // str fmt: name=value; 0 on success; NULL on error
int setenv(char *name, char *value, int overwrite); // 0 on success;-1 on error
int unsetenv(char *name);                           // 0 on success;-1 on error
int clearenv(void);         // clear all env variable; 0 on success; Null for error
```

#### 非局部跳转

```c
int setjmp(jmp_buf env);
void longjmp(jmp_buf env, int val);
```

## 7. 内存分配

```c
int brk(void *end_data_segment);    // return 0 on success; -1 on error
int sbrk(intptr_t increment);       // return previous program break on success; -1 on error
```

```c
void *malloc(size_t size);  // return pointer to allocated memory; NULL on error
void *calloc(size_t item_cnt, size_t size); // same above
void *realloc(void *ptr, size_t size);      // same above
void free(void *ptr);
```

## 8. 用户和组

密码文件`/etc/passwd`、`shadow`密码文件`/etc/shadow`、组文件`/etc/group`。

从`/etc/passwd`中获取信息的函数:

```c
struct passwd{
   char *pw_name;
   char *pw_passwd;
   uid_t pw_uid;
   gid_t pw_gid;
   char *pw_gecos; // comment user information
   char *pw_dir;   // initial working directory
   char *pw_shell; // login shell
}
struct passwd *getpwnam(char *name);
struct passwd *getpwuid(uid_t uid);
```

从`/etc/group`中获取信息的函数:

```c
struct group{
    char *gr_name;
    char *gr_passwd;
    gid_t gr_gid;
    char **gr_mem; //group members
}
struct group *getgrnam(char *name);
struct group *getgrgid(gid_t gid);
```

遍历密码文件和组文件中所有记录:

```c
struct passwd *getpwent(void); // get one record;NULL on error
void setpwent(void);    // back to start
void endpwent(void);    // close pwd file

struct passwd *pwd;
while((pwd = getpwent()) != NULL)
    printf("%-8s % 5ld\n", pwd->pw_name, (long)pwd->pw_uid);
endpwent();
```

从`/etc/shadow`文件中获取记录:

```c
struct spwd{
    char *sp_namp;  // login name
    char *sp_pwdp;  // encrypt password
    long sp_lstchg; // Time for last passwd change
    long sp_min;    // min number of days between password changes
    long sp_max;    // max number of days before change required
    long sp_warn;   // number of days .. warn user
    long sp_inact;  // number of days after expiration that account locked
    long sp_expire; // Date when account expires
    unsigned long sp_flag;  // reserved for future use
}
struct spwd *getspnam(char *name);  // return pointer on success;NULL on error
struct spwd *getspent(void);        // return pointer on success;NULL on error
void setspent(void);
void endspent(void);
```

加密和用户认证:

```c
char *crypt(char *key, char *salt); // return crypted string;NULL on error
```

要求用户输入密码:

```c
char *getpass(char *prompt);    // return pointer ;NULL on error
```

## 9. 进程凭证

一个进程，使用某个用户账号，执行某个程序，进程的`uid gid`就是该用户的。而进程拥有的权限（文件权限、特殊系统调用权限、信号权限等）还需要看`euid egid` `set-user-id` 辅助 ID 等，结合在一起判断。

通常`euid`就是`uid`，但是如果`exe`文件设置了`suid`位的话，那么`euid`就会使用`exe`文件的所属用户`uid`。`passwd`命令需要超级用户才可执行，但是普通用户执行`passwd`，由于设置了`suid`的缘故，所以`euid`会变成`root`，所以可以执行该命令。

```bash
7351604 -rwsr-xr-x  1 root root     59K 8月  21 18:25 passwd
```

```c
uid_t getuid(void);
uid_t geteuid(void);
gid_t getgid(void);
gid_t getegid(void);

int setuid(uid_t uid);
int setgid(gid_t gid);
int seteuid(uid_t euid);
int setegid(gid_t egid);

int setreuid(uid_t ruid, uid_t euid); // 同时修改 uid 和 euid
int setregid(gid_t rgid, gid_t egid); // 同时修改 gid 和 egid

int getresuid(uid_t *ruid, uid_t *euid, uid_t *suid);
int getresgid(gid_t *rgid, gid_t *egid, gid_t *sgid);

int setresuid(uid_t ruid, uid_t euid, uid_t suid);
int setresgid(gid_t rgid, gid_t egid, gid_t sgid);
```

修改和获取文件系统 ID：

```c
int setfsuid(uid_t fsuid);
int setfsgid(gid_t fsgid);
```

获取和修改辅助组 ID：

```c
int getgroups(int gidsetsize, gid_t grouplist[]); // ;-1 on error
int setgroups(size_t gidsetsize, gid_t *grouplist);
int initgroups(char *user, gid_t group);
```

![](https://img.codekissyoung.com/2019/10/28/9b622d885c648577b8d5544b2be1f757.png)

## 10. 时间

### 日历时间

```c
struct timeval{
    time_t tv_sec;
    suseconds_t tv_usec;
};
struct tm{
    int tm_sec;
    int tm_min;
    int tm_hour;
    int tm_mday;
    int tm_mon;
    int tm_year;
    int tm_wday;
    int tm_yday;
    int tm_isdst;
};
int gettimeofday(struct timeval *tv, struct timezone *tz);
time_t time(time_t *timep); // 返回时间戳; -1 on error
char *ctime(time_t *timestamp); // 转化成可打印字符串
struct tm *gmtime(time_t *timep);
struct tm *localtime(time_t *timep);
time_t mktime(struct tm *timeptr);
char *asctime(struct tm *timptr); // 转化位可打印字符
size_t strftime(char *outstr, size_t maxsize, char *format); // 精确控制打印格式
char *strptime(char *str, char *format, struct tm *timeptr); // 字符串 -> 时间
char *currTime(char *format); // 当前时间
char *setlocale(int category, char *locale); // 设置地区
int settimeofday(struct timeval *tv, struct timezone *tz); // 更新系统时钟
int adjtime(struct timeval *delta, struct timeval *olddelta); // 调整时钟
```

### 程序时间

```c
struct tms{
    clock_t tms_utime;
    clock_t tms_stime;  // system CPU time
    clock_t tms_cutime;
    clock_t tms_cstime; // system CPU time
};
clock_t times(struct tms *buf);
clock_t clock(void); // return total CPU time used by calling process measured in
```

最大的用处就是用来测量程序运行时间。

## 11. 系统限制和选项

一个进程能同时支持多少打开文件？`int`类型变量可存储最大值是多少？

```c
long sysconf(int name);
long pathconf(char *pathname, int name);
long fpathconf(int fd, int name);
```

![](https://img.codekissyoung.com/2019/10/28/d51dda51f64a7dc611ee6582fcfa6d6f.png)
![](https://img.codekissyoung.com/2019/10/28/310d1823eaad220c69b0c1d5cadebff3.png)

## 12. 系统和进程信息

`/proc`文件系统的由来,获取与进程有关的信息`/proc/PID`。

```c
$ cat /proc/1/status
```

## 13. 文件 I/O 缓冲

### 标准 IO 缓冲

```c
int setvbuf(FILE *stream, char *buf, int mode, size_t size); // 设置标准IO的缓冲区
mode:
    _IONBF : 不进行缓冲，立即调用read()和write
    _IOLBF : 行缓冲，对于output,遇见\n则调用write;对于input,则每次读取一行数据
    _IOFBF : 全缓冲，调用read()与write()设置的size就是缓冲区的大小
int setbuf(FILE *stream, char *buf); // 设置标准IO缓冲区
int setbuffer(FILE *stream, char *buf, size_t size); // 设置标准IO缓冲区
int fflush(); // 强制刷新 IO 缓冲区
```

### 内核缓冲

```c
int fdatasync( int fd ); // 强制将数据从内核缓冲区写到磁盘，不强制更新元数据（文件权限、大小、访问时间等）
int fsync( int fd ); // 即写入数据，也写入元数据到磁盘
void sync(void);    // 强制刷新进程中所有内核缓冲区的数据到磁盘
```

![](https://img.codekissyoung.com/2019/10/29/27830aba0f03d75d60c5018623bc36ea.png)

```c
int fileno(FILE *stream);           // 给定文件流，返回文件描述符
FILE *fdopen(int fd, char *mode);   // 将文件描述符 转化成 文件流
```

## 14. 系统编程概念

### EXT2 文件系统

![](https://img.codekissyoung.com/2019/10/29/4786f2264e08eb70dd97531c1f66ecc5.png)
![](https://img.codekissyoung.com/2019/10/29/8d134537711bca62c70e3d2c80bfb4c6.png)

### 虚拟文件系统

![](https://img.codekissyoung.com/2019/10/29/b156ab33135408cc6e1764ce3a309baa.png)

`VFS`系统为上层程序定义了一套通用接口（`open()`、`read()`、`write()`等），同时底层文件系统都会提供`VFS`接口的实现。除了个别文件系统，比如`FAT`不支持`symlink()`操作，会告知上层`VFS`，`VFS`再去通知应用程序。

### 挂载文件系统

```c
int mount(char *source, char *target, char *fstype, long mountflags, void *data);
int umount(char *target);
int umount2(char *target, int flags);
```

## 15. 文件属性

查看一个文件的“元数据”：

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
    struct timespec st_atime; // 访问时间
    struct timespec st_mtime; // 修改时间
    struct timespec st_ctime; // 创建时间
    blksize_t st_blksize;     // best IO block size
    blkcnt_t st_blocks;       // number of disk blocks allocated
}
int stat(char *pathname, struct stat *statbuf);
int lstat(char *pathname, struct stat *statbuf); // 针对符号链接自身
int fstat(int fd, struct stat *statbuf);
int fstatat(int fd, char *pathname, struct stat *buf, int flag);
```

判断文件类型：

```c
S_ISREG( st_mode )  // 普通文件
S_ISDIR( st_mode )  // 目录
S_ISCHR( st_mode )  // 字符特殊文件
S_ISBLK( st_mode )  // 块特殊文件
S_ISFIFO( st_mode ) // 管道
S_ISLINK( st_mode ) // 符号链接
S_ISSOCK( st_mode ) // socket

S_TYPEISMQ( struct stat * )  // 消息队列
S_TYPEISSEM( struct stat * ) // 信号量
S_TYPEISSHM( struct stat * ) // 共享存储对象
```

改变文件时间戳：

```c
struct utimbuf{
    time_t actime;
    time_t modtime;
};

struct timespec{
    time_t tv_sec;
    long tv_nsec;
};
int utime(char *pathname, struct utimbuf *buf);
int utimes(char *pathname, struct timeval tv[2]);// 微秒级别
int futimes(int fd, struct timeval tv[2]);
int lutimes(int char *pathname, struct timeval tv[2]);
int utimensat(int dirfd,char *pathname, struct timespec times[2], int flags);
int futimens(int fd, struct timespec times[2]);
```

改变文件属主：

```c
int chown(char *pathname, uid_t owner, gid_t group);
int lchown(char *pathname, uid_t owner, gid_t group);
int fchown(int fd, uid_t owner, gid_t group);
```

检查对文件的访问权限：

```c
int access(char *pathname, int mode);
int faccessat( int fd,  char *pathname, int mode, int flag );
```

设置文件创建掩码:

```c
mode_t umask(mode_t mask);
```

更改文件权限:

```c
int chmod(char *pathname, mode_t mode);
int fchmod(int fd, mode_t mode);
```

## 16. 拓展属性

操控文件拓展属性的调用：

```c
int setxattr(char *pathname, char *name, void *value);
int lsetxattr(char *pathname, char *name, void *value);
int fsetxattr(int fd, char *name, void *value, size_t size, int flags);

ssize_t getxattr(char *pathname, char *name, void *value, size_t size);
ssize_t lgetxattr(char *pathname, char *name, void *value, size_t size);
ssize_t fgetxattr(int fd, char *name, void *value, size_t size);

int removexattr(char *pathname, char *name);
int lremovexattr(char *pathname, char *name);
int fremovexattr(int fd, char *name);

size_t listxattr(char *pathname, char *list, size_t size);
size_t llistxattr(char *pathname, char *list, size_t size);
size_t flistxattr(int fd, char *list, size_t size);
```

## 17. 访问控制列表

![](https://img.codekissyoung.com/2019/10/29/635eb935ba9eccb53a9df56ba1549ec7.png)

## 18. 目录和链接

### 硬链接

![](https://img.codekissyoung.com/2019/10/29/9399b45156a3927d75815acbd97ccaad.png)

### 软链接

![](https://img.codekissyoung.com/2019/10/29/83ef53acc4fa12c53c64a6a4e57b0b7a.png)

```c
int link(char *existpath,  char *newpath );
int linkat(int efd,  char *existpath, int nfd,  char *newpath, int flag );
int unlink(char *pathname );
int unlinkat(int fd,  char *pathname, int flag );
int remove(char *pathname ); // 解除对一个文件或者目录的链接
```

对文件重命名

```c
int rename(char *oldname,  char *newname );
int renameat(int oldfd,  char *oldname, int newfd,  char *newname );
```

创建符号链接

```c
int symlink(char *actualpath,  char *sympath );
int symlinkat(char *actualpah, int fd,  char *sympath );
```

打开符号链接本身，读取它本身的内容

```c
ssize_t readlink(char *restrict pathname, char *restrict buf, size_t bufsize );
ssize_t readlinkat(int fd,  char *restrict pathname, char *restrict buf, size_t bufsize );
```

创建/删除目录

```c
int mkdir(char *pathname, mode_t mode ); // 创建目录
int mkdirat(int fd,  char *pathname, mode_t mode );
int rmdir(char *pathname ); // 删除目录
```

读目录

```c
DIR *opendir(char *pathname ); // 打开目录
DIR *fdopendir(int fd );
struct dirent *readdir(DIR *dp ); // 获取当前目录信息
void rewinddir( DIR *dp ); // 让readdir读取的目录流回到起点
int closedir( DIR *dp );    // 关闭目录读取流
long telldir( DIR *dp );
void seekdir( DIR *dp, long loc );
int dirfd(DIR *dirp); // 返回目录流的文件描述符;-1 on error
```

修改进程当前工作目录

```c
int chdir(char *pathname ); // 改变当前目录
int fchdir(int fd );
char *getcwd( char *buf, size_t size ); // 获取当前工作目录
```

遍历目录树,并使用自定义函数处理每一个文件:

```c
int nftw(char *dirpath,
        int (*func)(char *pathname, struct stat *statbuf, int typeflag, struct FTW *ftwbuf),
        int nopenfd,
        int flags );
```

修改进程根目录（运行该进程的目录）：

```c
int chroot(char *pathname);
```

从相对路径获取绝对路径:

```c
char *realpath(char *pathname, char *resolved_path);
char *dirname(char *pathname);  // 获取目录路径
char *basename(char *pathname); // 获取路径里最后的文件名
```

## 19. 监控文件事件

Linux 提供`inotify`机制用于监控文件事件。

![](https://img.codekissyoung.com/2019/10/29/375e644ee54fd9e226c1e180c3f1d29e.png)

```c
int inotify_init(void);
int inotify_add_watch(int fd,char *pathname, uint32_t mask);
int inotify_rm_watch(int fd,uint32_t wd);
```

![](https://img.codekissyoung.com/2019/10/29/8417c3fb2723c4136cedf6ca8ea9ca40.png)
![](https://img.codekissyoung.com/2019/10/29/4bd912608b08dcf4830b354289408f05.png)

## 20. 信号: 基本概念

- 也称为软件中断
- 内核、其他进程、进程自身都可以向进程发送信号
- 发送信号情况: Ctrl + C 、子进程终止、进程设定的定时器到期、进程尝试访问无效的内存地址
- 收到信号的进程采取: 1. 忽略信号 2. 被信号杀死 3. 挂起，等待新信号唤醒

![](https://img.codekissyoung.com/2019/10/29/c12318f057d8a9ca502dca73d33b40c2.png)
![](https://img.codekissyoung.com/2019/10/29/abd18fc9500b82268abe01b891d7f362.png)

### signal 信号机制

现在已经不推荐使用`signal`信号机制了，因为有更好的`sigaction`机制。

```c
void (*signal(int sig, void ( *handler)(int)))(int);
void handler(int sig){

}

int kill(pid_t pid, int sig);       // 向进程发送信号
int raise(int sig);                 // 进程向自身发送信号
int killpg(pid_t pgrp, int sig);    // 向某一进程组的所有成员发送一个信号
char *strsignal(int sig);           // 获取信号的字符串说明
void psignal(int sig, char *msg);   // 向stderr发送错误报告
```

![](https://img.codekissyoung.com/2019/10/29/590b69d73656fa1bf3e6760109a2825e.png)

信号集,表示一组不同的信号：

```c
sigset_t; // 信号集
int sigemptyset(sigset_t *set); // 初始化信号集
int sigfillset(sigset_t *set);
int sigaddset(sigset_t *set, int sig); // 添加信号
int sigdelset(sigset_t *set, int sig); // 删除信号
int sigismember(sigset_t *set, int sig); // 是否信号集成员
int sigandset(sigset_t *set, sigset_t *left, sigset_t *right);
int sigorset(sigset_t *set, sigset_t *left, sigset_t *right);
int sigisemptyset(sigset_t *set);
```

信号掩码，阻塞信号传递，直到解除为止：

```c
int sigprocmask(int how, const sigset_t *set, sigset_t *oldset);
how:
    SIG_BLOCK       添加到掩码集合中
    SIG_UNBLOCK     从掩码集合中
    SIG_SETMASK     设置掩码集合
```

被屏蔽后的信号，一直处于等待状态，下面函数可以查询到它们：

```c
int sigpending(sigset_t *set);
```

使用`signal`处理信号，同一类型的信号在阻塞时到达 `N` 个，但是只通知进程 `1` 次，使用`sigaction`则可以进行更加细致的控制。

### sigaction 可靠信号机制

```c
struct sigaction{
    void (*sa_handler)(int);
    sigset_t sa_mask;
    int sa_flags;
    void (*sa_restorer)(void);
};
int sigaction(int sig, struct sigaction *act, struct sigaction *oldact);
int pause(void); // 暂停程序的执行,直到接收到信号
```

## 21. 信号处理器函数

```c
void abort(void);
int sigaltstack(stack_t *sigstack, stack_t *old_sigstack);
```

## 22. 信号：高级特性

`Abort`信号到达时，就会产生核心转储文件`core`，将它调入`gdb`中，就可以查看信号到达时，程序代码和数据的状态。

```c
$ ulimit -c unlimited       # 开启 core 文件
```

`SIGKILL`和`SIGSTOP`被设计为默认行为，无法用`signal`和`sigaction`修改，无法阻塞。这样我们可以通过这两个信号来杀死一个失控的进程。

![](https://img.codekissyoung.com/2019/10/29/047bfee3c0db42b8df2bf5e34d7db7c6.png)

## 23. 定时器与休眠

## 24. 进程的创建

![](https://img.codekissyoung.com/2019/10/29/f94d854b5835af3771e01b1d7904d504.png)

```c
pid_t fork(void); // pid of child on parent process; 0 on child on child process; -1 on error
pid_t vfork(void);
```

## 25. 进程的终止

```c
void _exit(int status); // 系统调用
void exit(int status);  // 库函数
void atexit(void (*func)(void); // 注册退出时自动调用的函数
int  on_exit(void (*func)(int,void*),void *arg); // 同上
```

## 26. 监控子进程

```c
pid_t wait(int *status); // 阻塞等待任一子进程终止
pid_t waitpid(pid_t pid, int *status, int options); // 等待指定pid的子进程退出
pid_t waitid(idtype_t idtype, int_d id, siginfo_t *infop, int options);
pid_t wait3(int *status, int options, struct rusage *rusage);
pid_t wait4(pid_t pid,int *status,int options,struct rusage *rusage);
```

## 27. 新程序的执行

```c
int execve(char *pathname, char *argv[], char *envp[]);
int execle(char *pathname, char *arg,);
int execlp(char *pathname, char *arg, (char *)NULL);
int execvp(char *pathname, char *argv[]);
int execv (char *pathname, char *argv[]);
int execl (char *pathname, char *arg, (char *)NULL);
int system(char *command);  // 执行 shell 命令
```

## 28. 程序创建和程序执行

### 程序记账

```c
int acct(char *acctfile);
```

### 系统调用 clone

`clone()`在子进程创建期间进行精确控制，它主要用于线程库的实现。

```c
int clone(int (*func)(void*), void *child_stack, int flags, void *func_arg, ...);// -1 on error
```

### exec 和 fork 对进程属性的影响

![](https://img.codekissyoung.com/2019/10/30/482b26e204ea017c90a3f1e76efa8508.png)
![](https://img.codekissyoung.com/2019/10/30/19cde51fd7cefed488dc030467982b2d.png)
![](https://img.codekissyoung.com/2019/10/30/b0c659c7d8430e4e2d8bbcb91254645e.png)
![](https://img.codekissyoung.com/2019/10/30/0a4f7174df14e8be6b81a7130cdf2587.png)

## 29. 线程：介绍

## 30. 线程同步

## 31. 线程安全和每线程存储

线程安全函数：可同时被多个线程并发安全调用，称之为线程安全函数。

可重入函数：避免对全局变量和静态变量的使用，只使用局部栈，保证每个`caller`调用时不会互相产生影响。

```c
pthread_once_t once_var = PTHREAD_ONCE_INIT;
int pthread_once(pthread_once_t *once_control, void(*init)(void)); // 一次性初始化
void init(void) { }
```

### 线程特有数据 API

```c
int pthread_key_create(pthread_key_t *key, void(*destructor)(void*));
int pthread_setspecific(pthread_key_t key, void *value);
void *pthread_getspecific(pthread_key_t key);
```

![](https://img.codekissyoung.com/2019/10/31/d1c9f53c10764dd2aa05ce6294720909.png)

## 32. 线程取消

```c
int pthread_cancel(pthread_t thread);
int pthread_setcancelstate(int state, int *oldstate);
int pthread_setcanceltype(int type, int *oldtype);
int pthread_testcancel(void);

// 线程可以设置退出时的清理函数 使用宏实现的
void pthread_cleanup_push(void (*rtn)(void*), void *arg);
void pthread_cleanup_pop(int execute);
```

## 33. 线程：更多细节

信号模型时基于进程设计的，比`Pthreads`早几十年，所以两者之间存在一些明显的冲突，最好就是避免同时使用两者。

```c
int pthread_sigmask(int how, sigset_t *set, sigset_t *oldset);
int pthread_kill(pthread_t thread, int sig);
int pthread_sigqueue(pthread_t thread, int sig, union sigval value);
int sigwait(sigset_t *set, int *sig);
```

## 34. 进程组、会话和作业控制

进程组和会话是为支持`shell`作业控制而定义的抽象概念。

![](https://img.codekissyoung.com/2019/10/31/e1b23666422d9855f3d6b18409dfc40e.png)

```c
pid_t getpgrp(void); // 进程组id
int   setpgid(pid_t pid, pid_t pgid); // 修改某个进程的进程组id
pid_t getsid(pid_t pid); // 会话id
pid_t setsid(void); // 新建一个会话
char *ctermid(char *ttyname); // 返回表示控制终端的路径名
pid_t tcgetpgrp(int fd);    // 获取前台进程组 id
int   tcsetpgrp(int fd, pid_t pgid); // 修改一个终端的前台进程组
```

## 35. 进程优先级和调度

```c
int getpriority(int which, id_t who);
int setpriority(int which, id_t who, int prio);
```

### 实时进程调用 API

```c
#include <sched.h>
int sched_get_priority_min(int policy);
int sched_get_priority_max(int policy);
int sched_setscheduler(pid_t pid, int policy, struct sched_param *param); // 修改调度策略和优先级
int sched_setparam(); // 只修改调度策略
int sched_getscheduler(pid_t pid); // 获取调度策略
int sched_getparam(pid_t pid, struct shced_param *param); // 获取优先级
int sched_yield(void); // 自愿释放CPU
int sched_rr_get_interval(pid_t pid, struct timespec *tp); // 时间片
```

## 36. 进程资源

每个进程都会消耗打开文件、内存、CPU 时间等资源，可以设置消耗这类资源的一个上限

```c
int getrusage(int who, struct rusage *res_usage); // 返回进程用掉的资源的统计信息
int getrlimit(int resource, struct rlimit *rlim); // 返回进程的资源使用限制
int setrlimit(int resource, struct rlimit *rlim); // 设置资源使用限制
```

## 37. DAEMON 守护进程

## 38. 编写安全的特权程序

## 39. Linux 能力

## 40. 登录记账

## 41. 共享库基础

## 42. 共享库高级特性

## 43. 进程间通信简介

![](https://img.codekissyoung.com/2019/10/31/10c231c3d28b421a92446a04ac1a315c.png)
![](https://img.codekissyoung.com/2019/10/31/46ff0695cf6b4783484accd04b374a5f.png)
![](https://img.codekissyoung.com/2019/10/31/130600ff61102c7fe61da523e7111856.png)

## 44. 管道和 FIFO

管道其实是一个在内核内存中维护的缓冲器。

管道用于在相关进程间通信，而`FIFO`是管道的变种，用于在任意进程之间通信。

```c
int pipe(int fields[2]);
```

![](https://img.codekissyoung.com/2019/10/31/c5f645be12774ab9e46c057ccb71339e.png)

### 有名管道 FIFO

```c
int mkfifo(char *pathname, mode_t mode);
```

## 45. System V IPC 介绍

## 46. System V 消息队列

## 47. System V 信号量

## 48. System V 共享内存

## 49. 内存映射

- 系统调用 `mmap()` 创建内存映射
- 1. 文件映射: 文件部分区域 映射到 进程的虚拟内存 , 这样对该虚拟内存的操作就会转化为对相应文件区域的操作, 映射页面会按需自动从文件中加载
- 2. 匿名映射: 没有文件与 进程的虚拟内存对应，映射页面的内容会被初始化为 0
- 共享内存实现 1. 两个进程对同一文件的相同部分加以映射
- 共享内存实现 2. fork() 创建的子进程 继承 父进程的映射，从而父进程与子进程共享
- 创建映射传入的标志参数: 标志为私有，则进程对映射内容的修改 对于其他进程是不可见的；标志为共享 则是可见的
- 内存映射用途: 1. 初始化文本段 2. 内存分配(内存内容填充 0) 3. 文件 I/O(即映射内存 I/O) 4. 进程间通信(共享映射通信)

## 50. 虚拟内存操作

## 51. POSIX IPC 介绍

## 52. POSIX 消息队列

消息队列: 用于在进程间交换数据包

## 53. POSIX 信号量

信号量: 用于同步进程动作

## 54. POSIX 共享内存

共享内存: 多个进程共享一块内存

## 55. 文件加锁

文件锁定: 防止其他进程读取或者更新内容, 允许进程对文件的部分区域加以锁定

56. SOCKET 介绍

套接字: 不同主机上运行的进程之间传递数据

## 57. SOCKET : Unix Domain

## 58. SOCKET : TCP/IP 网络基础

## 59. SOCKET : Internet Domain

## 60. SOCKET : 服务器设计

## 61. SOCKET : 高级主题

## 62. 终端

## 63. 其他备选的 I/O 模型

都是为了解决一个问题：同时检查多个文件描述符，看它们是否准备好了执行`I/O`操作。

`Libevent`是这样的一个软件层，它提供了检查文件描述符 IO 事件的抽象，它底层能够识别并应用`select()`、`poll()`、`信号驱动IO`、`epoll`、`Solaris的/dev/pull`和`BSD的kqueue`接口。

#### select 系统调用

```c
#include <sys/select.h>
// return ready fd; 0 on timeout; -1 on error
int select(int nfds, fd_set *readfds, fd_set *writefds, fd_set *exceptfds, struct timeval *timeout);

void FD_ZERO(fd_set *fdset);
void FD_SET(int fd, fd_set *fdset); // 将 fd 添加到 fdset 中
void FD_CLR(int fd, fd_set *fdset); // 将 fd 从 fdset 中移除
int  FD_ISSET(int fd, fd_set *fdset);
```

## 64. 伪终端
