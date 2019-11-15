# 有品位的C代码

C 固然是我喜欢的语言，但是它的灵活性，导致可以使用它写出各种难以理解的代码（个人觉得是糟粕），导致代码的可读性不好、还伴有难以发现的 BUG 。使用一门语言，并不需要理解和使用它的全部，聪明的人都会挑选出它的一个子集作为自己的心头所爱。本文所写的就是我自己的心头所爱。

## 预处理器篇

要时刻记住的是：预处理器做的事情，仅仅是字符替换，它没有任何语义上的理解和处理。并且使用它的时候要特别小心，考虑周全，当然能不用预处理就最好不用。

```c
#define max(A,B) ((A) > (B) ? (A) : (B))
```

## lvalue、rvalue、地址与变量名

### 变量名

```c
int a;
```

当看到上面一句代码时，首先会想到什么？

我会想到一块“空间”，空间名字是`a`，大小是`4`（由`int`推知）。它是一大块已编号空间的一部分。它有编号地址，可以由`&a`运算得出。

由“名字”可以唯一确定一块空间，由“地址+大小”也可以唯一确定一块空间，两者是等价的。

### 左值

```c
a = 10;
```

看到上面代码时，我会想到，这操作是将 `10` 这个数字，放到`a`空间中。此时 `a` 是`lvalue`（左值）。

### 右值

```c
b = a;
```

看到上面代码时，我会想到，这操作是将`a`空间里的东西`10`放到`b`空间里。此时，`a`是`rvalue`（右值）。

同样是`a`这个名字：
- 在`=`左边时，它的含义是一块具体的“空间”，可以往里面存“东西”
- 在`=`右边时，它的含义却是这块空间里的“东西”

### 地址

那么，思考下，如果我想要将`a`的“地址”存到`b`空间里面呢？首先，我们要考虑的问题是：

- 多大的空间才能存下“地址”呢？ （8个字节）
- 如何才能获得这样的空间呢？ （`long`、`void*`、`int*`、`char*`、`short*`都能声明8个字节的空间）

```c
void* b;     // 思考下与 int* 声明的不同
b = &a;
```

看到上面代码，我就会想到，声明了`b`空间，往里面存放了`a`空间的地址。

```c
int* c;

c = b;
b = 10;
```

看上面代码，再思考下同一个名字`b`，作为`lvalue`与`rvalue`时的不同。执行后，`c`空间也存放了`a`空间的地址。

假如由于某种情况，名字`a`不能使用了，或者空间根本就没有名字（`malloc`操作获得的空间）。而`b`与`c`空间里，存下了`a`空间的“地址”, 那么可不可以通过“名字”`c`来操作空间`a`呢。

首先，`c` 名字已经代表了`c`空间，`&c` 代表了地址，那么我们就用 `*c` 代表 `a`空间。

```c
int d;
*c = 100;           // 往 a 空间存入 100
d  = *c;            // 将 a 空间的东西 存入 d 空间
```

回顾下：

> 由“名字”可以唯一确定一块空间，由“地址+大小”也可以唯一确定一块空间，两者是等价的。

上述讨论，只涉及到了“地址”，那么“大小”是如何确定的呢？答案就在`b`空间与`c`空间的声明上：

```c
void* b;
int*  c;
```

`long`、`void*`、`int*`、`char*`、`short*`每种声明都能拿到一个`8`字节的空间，都能刚好存下一个“地址”，唯一不同的是:不同类型声明确定了该“地址”空间的“大小”。而“地址 + 大小”唯一指定了一块空间。

当然，有了“地址”后，我们也可以强制指定一个“大小”，用来锁定某块空间。比如 `(int*)b` ，强制按照`4`字节来使用`b`空间里的“地址”。

上面提到，有的空间没有“名字”，这是通过`malloc`调用获得的：

```c
malloc(4);      // 获取 4 个字节的空间,返回一个 地址
```

通过上述讨论，我们已经知道如何来间接使用这块“匿名空间”。

```c
int* p = malloc(4); // p 存了 该匿名空间的地址

*p    = 1000;       // 将 1000 存入该空间
int h = *p;         // h = 1000
```

### 二重指针

现在，我们来思考这样一种情况，`b`空间存了`a`空间地址，`c`空间存了`b`空间的地址。

```c
int a  = 10;
int *b = &a;
int *c = &b;
```

根据上面我们关于“空间”的讨论，有：

```
int h = **c;    // 等价于 h = a;   最终 h = 10
**c   = 100;    // 等价于 a = 100; 最终 a = 100
```

```c
int d  = 10;
int *e = NULL;

e  = *c;        // 等价与 e = b;  最终 e 存了 a 的地址
*c = &d;        // 等价与 b = &d; 最终 b 存了 d 的地址
```

### 思考

思考下，下面程序的输出：

```c
void func( void *p )
{
    printf("&p: %p\n", &p);                     // &p: 0x7fffc19d00c8
    printf(" p: %p\n", p);                      //  p: 0x7fffc19d00f0
    printf("*p: %p\n", *(long*)p);              // *p: 0x558f5b130260
    printf("**P: %ld\n", **(int**)p);           // **P: 10
    printf("**p: %d\n", *(int*)(*(long*)p) );   // **p: 10
}
int main(int argc, char *argv[])
{
    int *a = (int*)malloc(4);
    *a = 10;
    func( &a );
    printf("&a: %p\n", &a); // &a: 0x7fffc19d00f0
    printf(" a: %p\n", a);  //  a: 0x558f5b130260
    printf("*a: %d\n", *a); // *a: 10
    return 0;
}
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

```c
char ch  = 'a';
char *cp = &ch;
```

对于上述两个变量的表达式如下，圆形粗体线代表了表达式执行后的返回值，方框粗体则表示作为左值时，表达式标示的位置。

| 表达式 | 左值 | 右值 |
| :------: | :----: | :----: |
| `ch` | ![](https://img.codekissyoung.com/2019/11/15/f42fe19d42234f67fd0cf590fd41d162.png) | ![](https://img.codekissyoung.com/2019/11/15/5a1be89e1c93ad69a52142451ec33abe.png) |
| `&ch` | 非法 | ![](https://img.codekissyoung.com/2019/11/15/ac209a2cc8cf3701f6c256026f31b007.png) |
| `cp` |![](https://img.codekissyoung.com/2019/11/15/a9c8e95f121106cb1b999571f21eef57.png)|![](https://img.codekissyoung.com/2019/11/15/70e2a246e30b558b8e5570e5cd9d513c.png)|
| `&cp`|非法|![](https://img.codekissyoung.com/2019/11/15/02368464b1237071a9d06bc25102e250.png)
|`*cp + 1`|非法|![](https://img.codekissyoung.com/2019/11/15/4754fa131e4095cdcddbd07dabfc897d.png)|
|`*(cp+1)`|![](https://img.codekissyoung.com/2019/11/15/76838fae3d52f6200242f2eca7bbbf09.png)|![](https://img.codekissyoung.com/2019/11/15/c56ad0d3ef218bbce5a29845f3359353.png)|
|`++cp`|非法|![](https://img.codekissyoung.com/2019/11/15/1a3fe2f7f5a6ebc7f94304882893c07f.png)|
|`cp++`|非法|![](https://img.codekissyoung.com/2019/11/15/84d0abdc65c515a84988705201383d3f.png)|
|`*++cp`|![](https://img.codekissyoung.com/2019/11/15/e0b5ac02036b45243b02fe55a72653bb.png)|![](https://img.codekissyoung.com/2019/11/15/44969dc83eec3ff76fb88c2f1a13270b.png)|
|`*cp++`|![](https://img.codekissyoung.com/2019/11/15/a9db6395e3a52e9e56d9bf17020e6dca.png)|![](https://img.codekissyoung.com/2019/11/15/19918762e496f351768aca2d21e6895f.png)|
|`(*cp)++`|非法|![](https://img.codekissyoung.com/2019/11/15/f3e4bbcc2f7944035b4f619981c5fdc4.png)|
|`++*cp`|非法|![](https://img.codekissyoung.com/2019/11/15/f3e4bbcc2f7944035b4f619981c5fdc4.png)|
|`++*++cp`|非法|![](https://img.codekissyoung.com/2019/11/15/a1e61115d649e424efd0de5cf02a6763.png)|
|`++*cp++`|非法|![](https://img.codekissyoung.com/2019/11/15/6d8436cd2e4e7390be9daa06d1b80e96.png)|

通过上表，对于`*cp++`这样的表达式，首先它作为“左值”和“右值”，都是对`cp`指针的当前指向位置进行操作，操作完毕后，再将指向位置移动一位。所以非常经常被用来编写出简短的代码：

```c
size_t strlen(char *string){
    int length = 0;
    while( *string++ != '\0' )
        length++;
    return length;
}
void strcpy( char *s, char *t )
{
    while( *s++ = *t++ )
        ;
}
```

## 结构体

```c
typedef struct{
    int a;
    short b[2];
} Ex2;
typedef struct EX{
    int  a;
    char b[3];
    Ex2  c;
    struct EX *d;
}
Ex   x = { 10, "Hi", { 5, {-1, 25} }, 0 };
Ex *px = &x;
Ex   y;
x.d    = &y;
```

![](https://img.codekissyoung.com/2019/11/15/05ccb1c7b2348be391e65aab35d77454.png)

| 表达式 | 左值 | 右值 |
| :----: | :--: | :--: |
| `px` | ![](https://img.codekissyoung.com/2019/11/15/96e1910043dc8b48e68619e4a58b1517.png) | ![](https://img.codekissyoung.com/2019/11/15/47ca71d4dc26e50df65c4c45fd784d98.png) |
|`*px`| x所在空间|![](https://img.codekissyoung.com/2019/11/15/97ecddd63301c9e9f02560a2a4d7e7a0.png)|
|`px->a`    | `a`所在空间 |![](https://img.codekissyoung.com/2019/11/15/a269271354023dc276f38a15e6e3bcca.png)|
|`&px->a`|非法|![](https://img.codekissyoung.com/2019/11/15/471a461abb366acef5270c147aab09e7.png)|
|`px->b`|非法|![](https://img.codekissyoung.com/2019/11/15/f23ad920ed4f7089182513f03f298f06.png)|
|`px->b[1]`| `i`所在空间 | ![](https://img.codekissyoung.com/2019/11/15/72251174c03d4136ff7292c863f65a59.png) | 
|`px->c`| `c`所在空间 | ![](https://img.codekissyoung.com/2019/11/15/d919f19666749b2ca4f7a429481b362f.png) |
|`px->c.a`|`5`所在空间|![](https://img.codekissyoung.com/2019/11/15/f86ff0dc3bd90a3f5b5a4301c2d075b9.png)|
|`*px->c.b` `px->c.b[0]`|`-1`所在空间|![](https://img.codekissyoung.com/2019/11/15/77984dc8f90da954bba4966a535d8bfd.png)|
|`px->d`|![](https://img.codekissyoung.com/2019/11/15/39255dc2652186c7710ac35429d79db0.png)| `&y` |
|`*px->d`| y所在空间 | ![](https://img.codekissyoung.com/2019/11/15/d183581b7e5a4a9857d35c78bd02f318.png) |
|`px->d->c.b[1]`|空间|![](https://img.codekissyoung.com/2019/11/15/192a56c48bb73f521a9a472102ecdf89.png)|

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