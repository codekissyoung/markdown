# 有品位的C代码

C 固然是我喜欢的语言，但是它的灵活性，导致可以使用它写出各种难以理解的代码（个人觉得是糟粕），导致代码的可读性不好、还伴有难以发现的 BUG 。使用一门语言，并不需要理解和使用它的全部，聪明的人都会挑选出它的一个子集作为自己的心头所爱。本文所写的就是我自己的心头所爱。

## 预处理器篇

要时刻记住的是：预处理器做的事情，仅仅是字符替换，它没有任何语义上的理解和处理。并且使用它的时候要特别小心，考虑周全，当然能不用预处理就最好不用。

```c
#define max(A,B) ((A) > (B) ? (A) : (B))
```

## 数据篇

#### 绝不使用 unsigned 作运算

思考下，为何 c 的值是 0 ?

```c
unsigned int a = 9;
int b = -4;
int c = a / b;
printf("c: %d\n", c); // 0
```

算术运算中，如果混入了 `unsigned` 操作数，则式子中所有操作数都要先转化成`unsigned`数，然后再运算，经常引入一些很难以察觉的 BUG。

## 算术运算

思考下，为何 `a != ~b` ?

```c
unsigned char a = 0;
unsigned char b = 0xFF;

if( a == ~b )
    printf("a == ~b\n");	
else
    printf("a != ~b\n"); // 这句被打印
```

使用`~`运算，千万要注意字位数，在32位以上计算机中，表达式在运行时，将`unsigned char`型的变量自动转换成了`unsigned int`型变量，即`~b = 0xFFFFFF00`,而`a = 0x00000000`，所以不相等，大坑！


## 声明篇

#### 定义类型

在 C 程序中，只使用简单的基本类型 和 `typedef` 定义出来的类型 去声明变量（注意，这里强调不要再使用`* () []`等直接原生的方式声明变量了）。另外，在命名上指针要加上`PTR`后缀，并且大写，这样使整个程序可读性好。

```c
typedef char *String;               // 字符串类型
typedef int *INT_PTR;               // int 类型指针
typedef char CHAR_20_ARR[20];       // 包含20个char元素的数组类型
typedef char (* CHAR_4_PTR)[4];     // 指向包含4个char元素的数组的指针 类型
typedef int (* FUNC_PTR)(int, int); // 函数指针

String p, lineptr[100]; // 
INT_PTR arr[3];         // 等价于 int *arr[3]; 表示有 3 个int指针的数组
CHAR_20_ARR a1, a2, a3; // 等价于 char a1[20];char a2[20];char a3[20];
CHAR_4_PTR p2;          // 等价于 char (*p2)[4];指向 包含 4 个char元素的数组
CHAR_4_PTR arr[3];      // 包含 3 个指针，指针指向 包含 4 个char元素的数组
```

#### 为结构体定义类型

```c
typedef struct node
{
    char *item;
    struct node *next; // 注意这里只能使用已扫描的 struct node，不能使用 NODE_PTR
} NODE, *NODE_PTR;
```

## 函数篇

#### 使用 typedef 简化声明

下面是 `signal` 函数的声明，整个代码看起来一团糟，要理解它还需要费脑力，没有任何的好处。

```c
void ( *signal( int, void(*)(int) ) )( int ); 
```

如果我们使用 `typedef` 简化下，就能得到一个很清晰的代码，只需要结合一点点函数指针声明的理解，就知道`singal`函数的 返回值 以及 参数。

```c
typedef void (*HANDLER)( int );
HANDLER signal(int, HANDLER);
```

## 指针篇

#### 先取值 再移动

对于`*p++`这种写法的代码在 C 程序里非常常见，几乎都成了一种常识。

```c
// 将指针 t 指向的字符串复制到指针 s 指向的内存区域
void strcpy( char *s, char *t )
{
    while( *s++ = *t++ )
        ;
}
```

## 错误处理

```c
// dbg.h
#include <stdio.h>
#include <errno.h>
#include <string.h>

#ifdef NDEBUG
    #define debug(M, ...)
#else
    #define debug(M, ...) fprintf(stderr, "DEBUG %s:%d: " M "\n", __FILE__, __LINE__, ##__VA_ARGS__)
#endif

#define  error_str() (errno == 0 ? "None" : strerror(errno))
#define log_err(M, ...) \
fprintf(stderr, "[ERROR] (%s:%d: errno: %s) " M "\n", __FILE__, __LINE__,  error_str(), ##__VA_ARGS__)
#define log_warn(M, ...) \
fprintf(stderr, "[WARN] (%s:%d: errno: %s) " M "\n", __FILE__, __LINE__,  error_str(), ##__VA_ARGS__)
#define log_info(M, ...) \
fprintf(stderr, "[INFO] (%s:%d) " M "\n", __FILE__, __LINE__, ##__VA_ARGS__)

#define check(A, M, ...) \
if(!(A)) { log_err(M, ##__VA_ARGS__); errno=0; goto error; }

#define check_mem(A) check((A), "Out of memory.")

#define check_debug(A, M, ...) if(!(A)) { debug(M, ##__VA_ARGS__); errno=0; goto error; }
#define sentinel(M, ...)  { log_err(M, ##__VA_ARGS__); errno=0; goto error; }
```

## 傻逼代码

以前看到这样的一些代码，我觉得很厉害，能理解它们的人都非常强。现在我觉得，这些代码就是傻逼，花时间去理解这样代码的人都是浪费时间，走了弯路。事实上，你不需要理解下面任何一句代码，但你仍然可以是一个很好的 C 程序员，并且写出很棒的 C 程序。

```c
int ( *func )( int * );
```

```c
int ( *func[5] )( int * );
```

```c
char ( *( *x() )[] )( );
```

```c
void ( *b[10] )( void(*)() );
```

```c
double (*)()( *e )[9];
```