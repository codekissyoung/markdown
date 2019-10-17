# 《C标准库》

本文是《C标准库》的笔记。

## 第0章

在程序中使用函数之前，必须先对它进行声明。最简单的方法是`#include`函数的头文件（包含了相关的类型定义、宏、函数声明），使它变为翻译单元`translation unit`的一部分。

编译器将每一个翻译单元都转换成一个目标模块`.o`,链接器再将构成整个程序的所有`.o`组合起来，`C`语言的标准库也不过这样预先写好的`.o`文件。

`C`语言提供了15个标准头文件，这些头文件具备以下特征:

- 具有幂等性，多次包含相同的头文件，效果与只包含一次相同
- 相互独立，相互之间不存在依赖关系，都可以独立使用
- 和文件级别的声明等同，必须先包含头文件，然后才可以使用头文件里定义和声明的东西

## 第1章 <assert.h>

断言，如果一处断言非真，则在标准错误流输出一条适当的失败提示信息(参数的文本、源文件的名字`__FILE__`、源文本行数`__LINE__`),然后掉用`abort`函数退出。断言应该只在调试程序的时候起作用，因为它的输出对于用户来说，是天书。

```c
void assert( int expression );

#define NDEBUG    /* 在生产环境的产品，需要取消断言后编译 */
#undef  NDEBUG    /* 打开断言，默认就是打开 */
```

## 第2章 <ctype.h>

包含了几个可以用于识别和转换字符的函数。

```c
isdigit( int c );  // 是数字

islower( int c );  // 小写字母
tolower( int c );  // 转换成小写字母
isupper( int c );  // 大写字母
toupper( int c );  // 转换成大写字母

isalpha( int c );  // 大小写字母

isalnum( int c );  // 数字 + 大小写字母

iscntrl( int c );  // 控制字符

isgraph( int c );  // 不包括空格在内的所有可打印字符
isprint( int c );  // 包括空格在内的可打印字符

isspace( int c );  // 空格、换页、换行、回车、制表符
```

![ctype函数关系](https://img.codekissyoung.com/2019/06/16/a8484c31cd17accad0d782ef902f4188.png)

## 第3章 <errno.h>

```c
errno; // 全局变量，标准库调用失败后，会设置它的值，用于指明发生了何种错误
```

## 第4章 <float.h>

```c
// 一堆宏，一般不写复杂的程序用不上
```

## 第5章 <limits.h>

```c
CHAR_BIT   // 除位域之外，最小对象的位数 8
SCHAR_MIN  // signed char 对象的最小值 -127
SCHAR_MAX  // signed char 对象的最大值 +127
```

## 第6章 <locale.h>

区域设置。

```c
struct lconv;   // 数字值的格式
LC_ALL
LC_COLLATE
LC_CTYPE
LC_NUMERIC

char *setlocale( int category, const char *locale );
struct lconv *localeconv( void );  // 数字格式习惯查询
```

## 第7章 <math.h>

数学库。

```c
double acos( double x );   // 计算 x 的三角反余弦函数主值。如果参数不在[-1,+1]范围内，则发生定义域错误。
floor( double x );         // 获取不大于 x 的最大整数
ceil( double x );          // 获取不小于 x 的最小整数
fabs( double x );          // 获取 x 的绝对值
double pow( double x, double y ); // 计算 x 的 y次幂
double sqrt( double x );          // 求 x 的平方根
// ...
```

## 第8章 <setjmp.h>

如果一下子能跳出多个函数调用，而不是一层层返回，把控制权交给更早的函数调用的某个地方，通常是处理严重错误的最好方式。

```c
jmp_buf; // 数组类型，适合存储恢复一个调用环境所需的信息

int setjmp( jmp_buf env ); // 将它的调用环境保存在它的 jmp_buf 类型的参数中

// 使用相应的 jmp_buf 参数来恢复程序的相同调用中宏 setjmp的最近一次调用保存的环境
void longjmp( jmp_buf env, int val );
```

## 第9章 <signal.h>

为了处理各种各样的信号，声明了一个类型和两个函数，并定义了几个宏。

```c
sig_atomic_t // 声明为这种类型的对象，可以作为一个原子实体被访问，即使有异步中断发生的时候也是如此
SIG_DFL      // 收到信号后，采取默认动作
SIG_ERR      //
SIG_IGN      // 忽略该信号

signal( int sig, void (*func)(int) ); // 设置 如何处理 sig 信号

int raise( int sig ); // 把信号sig送给正在执行的程序
```

## 第10章 <stdarg.h>

可变参数列表。

```c
va_list

va_start

va_arg

va_end
```

## 第11章 <stddef.h>

```c
ptrdiff_t 两个指针相减的结果类型
size_t    是 sizeof 操作符的结果的无符号整数类型
wchar_t   最大扩展字符集中所有成员的不同编码值
NULL      展开为实现定义的空指针常量
```

## 第12章 <stdio.h>

主要讨论:

- C标准库实现的抽象 输入、输出模块
- 读出和写入原始数据的低级函数
- 在格式规范控制下，打印和扫描数据的高级函数

进入UNIX时代后，所有的文本流都采用了标准内部格式，每一行以`\n`终止。内核中的外设的驱动程序，负责将外设的原本的输入格式，处理成标准内部格式；输出时，则执行相反操作。

使用`ioctl()`系统调用，还可以用来自定义驱动程序的操作，使用它来设置或者测试一个具体设备的各种参数。

**文件描述符**：打开文件，内核将维护该文件的控制数据维护在自己内部，并且分配给进程一个小整数，用于指明该打开的文件。该小整数称为文件描述符。

为简化多数程序的运行，现代`Unix shell`为每个进程都分配了3个文件描述符:`0`、`1`、`2`。标准库将它们包装成了，标准输入流`stdin`、标准输出流`stdout`、标准错误流`stderr`。

Unix的IO实现隐藏了非常多的繁琐细节，这些细节封装在`ioctl`和设备处理程序中，从而给了进程一个统一而简单的IO输入输出环境。

![流的状态](https://img.codekissyoung.com/2019/06/17/b07733e382f421f4af47eb8b23d318ff.png)

```c++
// 类型
size_t
FILE // 一个对象类型，记录控制流需要的所有信息，包括它的文件定位符、指向相关缓冲的指针
     // 记录读写错误的指示符、记录文件是否结束的结束符
fpos_t // 对象类型，唯一指定文件中的每一个位置所需的所有信息

// 宏定义
BUFSIZ   // 缓冲大小
EOF      // 文件结束

POPEN_MAX    // 可以同时打开的文件数目最大值
FILENAME_MAX // 文件名长度最大值

// fseek 的第三个参数
SEEK_CUR
SEEK_END
SEEK_SET

// FILE* 类型的指针
stderr
stdin
stdout

// 对文件的操作
int remove( const char *filename );
int rename( const char *old, const char *new );
FILE *tmpfile( void );
char *tmpnam( char *s );

int fclose( FILE *stream );
int fflush( FILE *stream );
FILE *fopen( const char *filename, const char *mode ); // mode : r、w、a、r+、w+、a+
FILE *freopen( const char *filename, const char *mode, FILE *stream );

// 设置缓冲大小
void setbuf(FILE *stream, char *buf);
void setvbuf(FILE *stream, char *buf, int mode, size_t size);

fprintf(FILE *stream, const char *format, ...); // 格式化输出
fscanf(FILE *stream, const char *format, ...);  // 格式化输入

int sprintf(char *s, const char *format, ...);      // 写入字符串 s
int sscanf(const char *s, const char *format, ...); // 从字符串 s 读取

fgetc(FILE *stream);            // 读取一个字符
fputc(char c, FILE *stream);    // 输出一个字符
int ungetc( int c, FILE *stream); // 退回一个字符到 流中

fgets(char *s, int n, FILE *stream); // 从流中读取 n - 1 个字符，存入 s 中
fputs(const char *s, FILE *stream);  // 从流中将 s 写入 流中

int getchar(void);       // 从 stdin 中读取一个字符
int putchar(int c);      // 向 stdout 中输出一个字符
char *gets(char *s);     // 从 stdin 中读取一行
int puts(const char *s); // 向 stdout 中写入 s,并在结尾加上 \n

size_t fread(void *ptr, size_t size, size_t nmemb, FILE *stream);
size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *stream);

int fgetpos(FILE *stream, fpos_t *pos);       // 获取文件定位符
int fsetpos(FILE *stream, const fpos_t *pos); // 设置文件定位符

int fseek( FILE *stream, long int offset, int whence); // 设置文件定位符

long int ftell(FILE *stream); // 获取流的文件定位符的当前值

void rewind(FILE *stream);    // 将文件定位符设置在文件起始位置

void clearerr(FILE *stream);  // 清空流的文件结束符 和 错误指示符

int feof(FILE *stream);     // 测试 流的文件结束符是否存在，存在则说明到达文件末尾
int ferror(FILE *stream);   // 测试 流的错误指示符是否存在，存在则说明文件出错

void perror(const char *s); // 向 stderr 中输出一条错误信息
```

## 第13章 <stdlib.h>

定义了那些没有明显归属的宏和函数。

```c
```

## 第14章 <string.h>

对`C-style`字符串的操作。

```c
// 将数字字符串转换为整形
int atoi( char s[] )
{
    int i,n;
    n = 0;
    for( i = 0; s[i] >= '0' && s[i] <= '9'; ++i )
        n = 10 * n + ( s[i] - '0' );
    return n;
}

// 把字符c转换为小写形式，只对ASCII字符集有效
int lower( int c )
{
    if( c >= 'A' && C <= 'z' )
        return c + 'a' - 'A';
    else
        return c;
}
```

## 第15章 <time.h>

显示时间的相关操作。


# C 函数API

本文记录所有我用到的C函数。

## 格式化输入

```c
int scanf( const char *format, ... );
int fscanf( FILE *stream, const char *format, ... );
int sscanf( const char *s, const char *format, ... );
```

## 从文件流里取一个字符

```c
int fgetc( FILE *stream );
int getc( FILE *stream );
int getchar();
```

## 从文件流里 读取一个字符串

```c
char *fgets( char *s, int n, FILE *stream );
char *gets( char *s );
```

## 当前文件流位置相关

```c
fgetpos(); 获取文件流当前读写位置
fsetpos(); 设置文件流当前读写位置
ftell(); 返回文件流当前读写位置的偏移 值
rewind(); 重置文件流里的读写位置
freopen(); 重新使用一个文件流
setvbuf();设置文件流的缓冲机制
```

## 删除文件或者目录

```c
remove();
```

## 文件流错误

```c
extern int errno;
// 测试一个文件流的错误标识
int ferror( FILE *stream );
// 测试一个文件流的 末尾标识
int feof( FILE *stream );
// 清除文件流的末尾标识 和 错误标识
void clearerr( FILE *stream );
// 查看文件流使用的是哪个文件描述符
int fileno( FILE *stream );
// 在一个打开的文件描述符上，创建一个新的文件流
FILE *fdopen( int fildes, const char *mode );
```

## 文件状态维护

```c
int chmod( const char *path, mode_t mode );
int chown( const char *path, uid_t owner, gid_t group);
int unlink( const char *path ); // 删除一个文件
int link( const char *path1, const char *path2 ); // 创建一个硬连接
int symlink( const char *path1, const char *path2 ); // 创建一个软连接
```

## 目录

```c
// 创建目录
int mkdir( const char *path, mode_t mode );
// 删除目录
int rmdir( const char *path );
// 改变当前工作目录
int chdir( const char *path );
// 获取当前工作目录
char *getcwd( char *buf, size_t size );
```

## 扫描目录

```c
// 打开目录 建立一个目录流
DIR *opendir( const char *name );
// 返回一个指针 ，它保存着目录流里下一个目录项的有关资料
struct dirent *readdir( DIR *dirp );
// 记录着目录流里的当前位置
long int telldir( DIR *dirp );
// 设置目录流dirp的目录项指针
void seekdir( DIR *dirp, long int loc );
// 关闭并且释放一个目录流
int closedir( DIR *dirp );
```

## 内存操作函数

```c
void *malloc( size_t size );          // 返回值：分配成功返回分配内存块的首地址，失败返回NULL
void *calloc( int num, size_t size ); // num为分配内存块的个数，size为分配内存块的大小

void free(void *ptr);                 // 释放申请到的内存,ptr为malloc或calloc等内存分配函数返回的内存指针

// dest为目标内存区，src为源内存区，n为需要拷贝的字节数
// 返回值: 指向dest的指针
// 缺点: 未考虑内存重叠情况
void *memcpy(void *dest, void *src, size_t n);

// 相比memcpy：当dest与src重叠时，仍能正确处理，但是src内容会被改变
// 当dest与src重叠时，仍能正确处理，但是src内容会被改变 推荐使用
void *memmove(void *dest, void *src, size_t n);

// memset是按字节为单位对buffer指向的内存赋值
void *memset(void *buffer, int c, size_t n);

int a[5];
// 00000011 00000011 00000011 00000011
memset(a, 3, 5 * sizeof(int) );

// 00000000 00000000 00000000 00000000
memset(a, 0, 5 * sizeof(int));


// 比较两个内存空间的字符,n为要比较的字符数
int memcmp(const void *buf1, const void *buf2, size_t n);
- 返回值
  - 当buf1 > buf2时，返回 > 0
  - 当buf1 = buf2时，返回 = 0
  - 当buf1 < buf2时，返回 < 0

// 在内存中查找字符, 返回指向ptr指向的内存块中value值第一次出现位置的指针,如果没有找到value值，则该函数返回NULL
const void * memchr ( const void * ptr, int value, size_t num );

// 举例
char *pch;
char str[] = "Example string";
pch = (char*)memchr (str, 'p', strlen(str));
```

## 字符串相关函数

```c
char* strncpy(char * s1,const char * s2,size_t n); // 拷贝, n 最大值
char* strncat(char * s1,const char * s2,size_t n); // 拼接, n 最大值
int strncmp(const char *s1,const char *s2,size_t n); // 比较 n 前几个字符串

// 字符串中查找字符c
int* strchr(const char *s,char c);
int* strrchr(const char *s,char c);

// s1 包含　s2　中任意字符
char* strpbrk(const char *s1,const char *s2);

// s1包含s2
char* strstr(const char *s1,const char * s2);

// 字符串长度
size_t strlen(const char *s);

strcat(s,t); // 将字符串 t 链接到 s 的后面
```

## 申请内存

```c
// 返回值：分配成功返回分配内存块的首地址，失败返回NULL
void *malloc( size_t size );

// num为分配内存块的个数，size为分配内存块的大小
void *calloc( int num, size_t size );
```

- 区别
  - malloc一次只能申请一个内存区，calloc一次可以申请多个内存区
  - malloc不会对分配的内存初始化，calloc会初始化为0

## 释放申请到的内存

```c
// ptr为malloc或calloc等内存分配函数返回的内存指针
void free(void *ptr);
```

## 拷贝内存内容

```c
// dest为目标内存区，src为源内存区，n为需要拷贝的字节数
// 返回值: 指向dest的指针
// 缺点: 未考虑内存重叠情况
void *memcpy(void *dest, void *src, size_t n);

// 相比memcpy：当dest与src重叠时，仍能正确处理，但是src内容会被改变
// 当dest与src重叠时，仍能正确处理，但是src内容会被改变 推荐使用
void *memmove(void *dest, void *src, size_t n);

// 函数实现
void *memmove(void *dest, void *src, size_t n)
{
    char *ret = char *dest;
    char *dest_t;
    char *src_t;
    if((unsigned char *dest <= unsigned char *src) || (unsigned char *dest >= unsigned char *src + n))
    {
        dest_t = char *dest;
        src_t = char *src;
        while(n--)
        {
            *dest_t++ = *src_t++; //正向拷贝
        }
    }
    else
    {
        dest_t = char *dest + n - 1;
        src_t = char *src + n - 1;
        while(n--)
        {
            *dest_t-- = *src_t--; //反向拷贝
        }
    }
    return ret;
}
```

## 初始化指定内存空间

```c
// memset是按字节为单位对buffer指向的内存赋值
void *memset(void *buffer, int c, size_t n);

int a[5];

// 00000011 00000011 00000011 00000011
memset(a, 3, 5 * sizeof(int) );

// 00000000 00000000 00000000 00000000
memset(a, 0, 5 * sizeof(int));
```

## 比较两个内存空间的字符

```c
// n为要比较的字符数
int memcmp(const void *buf1, const void *buf2, size_t n);
- 返回值
  - 当buf1 > buf2时，返回 > 0
  - 当buf1 = buf2时，返回 = 0
  - 当buf1 < buf2时，返回 < 0
```

## 在内存中查找字符

```c
// 返回指向ptr指向的内存块中value值第一次出现位置的指针,如果没有找到value值，则该函数返回NULL
const void * memchr ( const void * ptr, int value, size_t num );

// 举例
char *pch;
char str[] = "Example string";
pch = (char*)memchr (str, 'p', strlen(str));
```


## 标准库

### stdio标准输入/输出流

- 各个操作系统底层对文件的操作都是不一样的，如windows 的 ntfs 和linux 的 ext3 ！
- stdio.h 屏蔽了这种不同，使用了流来管理文件
- stdin 输入流,默认指向键盘
- stdout 输出流,默认指向屏幕
- stderr 错误输出流，默认输入也是屏幕
- 输入输出重定向：`<` 是输入 `>` 是输出 `>>`是追加输出 `2>`是错误输出重定向 `2>>`错误输出重定向追加输出
- c程序从流中获取数据，或者将数据输出到流中
- c程序将输入视为一个外来字节的流，getchar() 函数将每个字节解释为一个字符编码scanf()函数将以同样的方式看待输入，但在其转换 说明符的指导下，该函数可以将字符转换为数值如果scanf 读取失败，它会将数据还给字节流
- 如果输入的是文件，检测到文件末尾时，scanf 和 getchar 都返回 EOF 值
- 如果是键盘输入，能用 `Ctrl + D` 或者 `Ctrl + z` 来模拟从键盘模拟文件结束条件

```c
#define    EOF    （-1）    // 这个判断流到达末尾的标志符
#include <stdio.h>
int main(){
  char ch;
  while((ch=getchar()) != EOF )  //getchar 是从输入流中读取一个字符
  putchar(ch);    //输出一个字符
  return 0;
}
```

```c
/*先用 scanf 读取数字，失败的话，再用 getchar 读取处理*/
int get_int(void)
{
    int input;
    char ch;
    while(scanf("%d",&input)!=1){
        while((ch = getchar())!= '\n'){
            putchar (ch); //剔除错误的输入
        }
        printf("is not an integer .\n please enter an integer value !");
    }
    return input ;
}
```

### 输入函数/输出函数

- 输入也是先放在缓冲区,代码读取缓冲区内容的条件: 1.遇见换行符 2.缓冲区满了
- 所有输出的内容都是先存放到缓冲区，再由缓冲区一次性输出到屏幕缓冲区内容刷新发送到屏幕的条件：1.缓冲区满 2.换行符 3.遇见输入命令/代码

```c
scanf("%s",&name); 读取缓存中的字符串，会在空白 ，\t,\n 处停止读取！
scanf("%d,%d",&grade,&age); //表示 期望我们以： 3,12 这样的形式输入
prinf("%d %s %p",10,"caokaiyan",point);//point 是一个指针
```
