# C语法

#### 程序全局变量

- 在函数外部定义的变量即为`全局变量`，在本文件引用别的文件定义的`全局变量`(为了保持全局变量的唯一性),可以使用`extern`声明它
- `extern` 置于函数或者变量前，告诉编译器此变量和函数在其他模块（不在本文件）中寻找其定义

#### 文件全局变量

- `static` 限制 变量`head` 和函数 `func()` 只能在本文件中访问; 在其他文件中，`head` 和 `func()` 是不可见的
- 利用这点可以进行C的模块化编程: 在模块内，`static`声明模块内的私有变量和函数；同时暴露 `insert()`  `print()` 等函数作为外部使用本模块的接口

```c
// node.c
typedef struct node *Node;
static Node head;
static func(){ ... }
int insert(int val){ ... }
void print(){ ... }

// node.h
extern int insert(int val);
extern void print();
extern void destroy();
```

### 可变参数

```c
#include <stdarg.h>
int func(int a, int b, ... ){
    va_list arg_ptr;                          // 声明可变参数 arg_ptr
    void va_start( arg_ptr, b );              // 填入最后一个固定参数 b
    int    var1 = va_arg( arg_ptr, int );     // 得到第一个可变参数的值 var1
    double var2 = va_arg( arg_ptr, double );  // 得到第一个可变参数的值 var2
    void va_end( arg_ptr );                   // 清理 arg_ptr
}
/* 指定 变量数量 */
void test(int count, ...) {
    va_list args;
    va_start(args, count);
    for (int i = 0; i < count; i++)
    {
        int value = va_arg(args, int);
        printf("%d\n", value);
    }
    va_end(args);
}
/* 以 NULL 为结束标记 */
void test2(const char* s, ...) {
    printf("%s\n", s);
    va_list args;
    va_start(args, s);
    char* value;
    do
    {
        value = va_arg(args, char*);
        if (value) printf("%s\n", value);
    }
    while (value != NULL);    va_end(args);
}
/* 直接将 va_list 传递个其他可选 变量函数 */
void test3(const char* format, ...)
{
    va_list args;
    va_start(args, format);
    vprintf(format, args);
    va_end(args);
}

int main(int argc, char* argv[])
{
    test(3, 11, 22, 33);
    test2("hello", "aa", "bb", "cc", "dd", NULL);
    test3("%s, %d\n", "hello, world!", 1234);
    return EXIT_SUCCESS;
}
```

- [用法参考](https://www.cnblogs.com/edver/p/8419807.html)
- [可变参数实现](https://blog.csdn.net/smstong/article/details/50751121)


### 函数修饰符

- `extern` 默认修饰符, 于函数表  "具有外部链接的标识符",这类函数可 于任何程序  件。 于变量声明表 该变量在其他单元中定义。
- `static` 使该修饰符的函数仅在其所在编译单元 (源码 件) 中可 。还可以表示函数内的静态变量。
- `inline` 修饰符 inline 建议编译器将函数代码内联到调 处,但编译器可 主决定是否完成。通 常包含循环或递归函数不能被定义为 inline 函数。
- `static inline` 内链接函数,在当前编译单元内内联。不过 -O0 时依然是 call。
- `inline` 外连接函数,当前单元内联,外部单元为普通外连接函数 (头件中不能添加 inline 关键字)。inline 关键字只能 在函数定义处


### 给数组取别名

```c
typedef char ARRAY20[20];
ARRAY20 a1, a2, s1, s2;  // 等价于 char a1[20], a2[20], s1[20], s2[20];
```

### 给指针取别名

```c
typedef int (* PTR_TO_ARR)[4];
PTR_TO_ARR p1, p2; // 指针，指针类型为 占4个int的数组
```

### 给函数指针取别名

```c
typedef int (* PTR_TO_FUNC)(int, int);
PTR_TO_FUNC pfunc; // 声明一个指针,指向"参数为(int,int),返回值为int"的函数
```

### 给结构体取别名 这样可以少写一个struct

```c
//  原先
struct Book { ... }; // 定义结构体
struct Book bk1; // 使用结构体声明变量, c里使用结构体声明变量要struct开头(c++里不用)，可能就历史遗留问题了

// typedef 后
typedef struct Book{ ... } Book; // 定义结构Book，并且取别名也为 Book
Book bk2; // 直接使用别名声明变量

typedef struct student{ ... } Stu_st , *Stu_pst; // 同时给 结构体 和 其指针定义 别名
Stu_st stu1; // 等价于 struct student stu1
Stu_pst stu2; // 等价于 struct student* stu2  等价于 Stu_st* stu2
```

### 不能在定义 typedef 类型之前 使用这个类型

```c++
typedef struct
{
    char* item;
    NODEPTR next; // 这里不允许使用 NODEPTR
} * NODEPTR;

// 以下是正确的方法
// 1.(推荐)
typedef struct node
{
    char* item;
    struct node* next;
} *NODEPTR;
// 2. 略 不推荐
// 3. 略 不推荐
```

### typedef 与 #define 的区别

```c
// 1. define可以使用其他类型说明符对宏类型名进行扩展，但对 typedef 所定义的类型名却不能这样做
#define INTERGE int
unsigned INTERGE n;  //没问题

typedef int INTERGE;
unsigned INTERGE n;  //错误，不能在 INTERGE 前面添加 unsigned

// 2. 在连续定义几个变量的时候，typedef 能够保证定义的所有变量均为同一类型，而 #define 则无法保证
#define PTR_INT int *
PTR_INT p1, p2; // 宏替换之后: int *p1, p2;

typedef int * PTR_INT
PTR_INT p1, p2; // 都是指向int的指针
```

