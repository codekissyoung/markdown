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

## strings.h

- 从BSD系UNIX系统继承而来，里面定义了一些字符串函数，如bzero等。这些函数曾经是posix标准的一部分，但是在POSIX.1-2001标准里面，这些函数被标记为了遗留函数而不推荐使用。在POSIX.1-2008标准里已经没有这些函数了。如下：

- 这两个头文件都在linux的/usr/include目录下面，后者比前者多了一个s，一般使用以string.h（没有s）的为主，那strings.h（有s）什么时候使用呢？打开这个头文件，可以看见区别如下：所以，一般使用前者就可以了

```c
/* We don't need and should not read this file if <string.h> was already
read. The one exception being that if __USE_BSD isn't defined, then
these aren't defined in string.h, so we need to define them here. */
int bcmp(const void *, const void *, size_t); /* 用memcmp替代 */
void bcopy(const void *, void *, size_t); /* 用memcpy, memmove替代 */
void bzero(void *, size_t); /* 用memset替代 */
int ffs(int); /* string.h 中有 */
char *index(const char *, int); /* 用strchr替代 */
char *rindex(const char *, int); /* 用strrchr替代 */
int strcasecmp(const char *, const char *); /* string.h 中有 */
int strncasecmp(const char *, const char *, size_t); /* string.h 中有 */
```
