### 变长结构体

- [零长度数组的妙用](http://elkpi.com/topics/zero-length-arrays.html)


#### 静态局部变量

- 在函数内部使用`static`关键字声明，只有在定义它的函数内部才能访问到
- 在函数调用完毕 `return` 后，静态局部变量并不会被销毁，而是保持其值; 下次调用该函数时,静态局部变量仍然可以被访问

```c
void trystat(void){
    int fade = 1;
    static int stay = 2; // 静态局部变量
    printf("fade = %d , stay = %d \n",fade++,stay++);
}
```

### 全局变量

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

#### 作用域

- 块作用域

```c
int a = 5;
{
    int a = 10;
    printf("%f\n",a); // 10
}
printf("%f \n",a); // 5
```

- 变量同名屏蔽

```c
int a = 10; // 全局变量
int func(){
    int a = 20 ; // 局部变量，屏蔽全局变量
}
int func2(){
    printf('%d',a); // 函数内部可以直接使用全局变量
}
```

- `return` 语句不可返回指向栈内存的指针 , 因为该内存在函数体结束时被自动销毁`return ;`表示函数的结束

```c
char *Func ( void )
{
    char str[30];
    return str; // 错误
}
```

## 常量

- `const` 可以修饰变量、函数的参数、返回值(修饰返回值好像没什么实际用处)表示对应的内存只读
- `#define` 给出的是立即数，宏是在预编译时进行替换，有若干个拷贝，没有类型

```c
#define M 3
const int N       = 5;            // N 只读
const int    a[5] = {1,2,3,4,5};  // 数组只读
const int *p;    // 指针指向的对象只读
int const *p;    // 同上
int* const p;    // 指针本身的地址不能变，但其指向的对象的值可变
const int* const p; // 指针本身的地址不能变，其指向的对象只读
void Fun ( const int i ); // 告诉编译器，i 在函数体中 的值不能改变，从而防止了一些无意的修改
const int Fun( void );     // 返回值不可 被改变
extern const int i;      // 引用在另一个文件中  const 只读变量
void display( const int array[], int limit ); // array 指向的值是不能变的
void display( const int *array, int limit );  // array 指向的值是不能变的
char *strcat( char *, const char* ); // 第一个参数在函数内可以被修改，第二个参数只读
```

## 算术运算/运算符/表达式

- `左值` : 指向内存位置的表达式被称为左值（lvalue）表达式左值可以出现在赋值号的左边或右边
- `右值` ：存储在内存中某些地址的数值右值是不能对其进行赋值的表达式，也就是说，右值可以出现在赋值号的右边，但不能出现在赋值号的左边

### >> 右移操作符

- 有符号数的右移
- 右移一位就等于除以2，但是这里需要加一个条件，这里指的是正数而对于有符号整数，且其值为负数时，在C99标准中对于其右移操作的结果的规定是implementation-defined.
- 在Linux上的GCC实现中，有符号数的右移操作的实现为使用符号位作为补充位因此-1的右移操作仍然为0xFFFFFFFF这导致了死循环

```c
#include <stdio.h>
int main( int argc, char* argv[] )
{
    int a = 0xFFFFFFFF;
    printf("%d , %ld",a >> 31,sizeof(a)); // -1 , 4
    return 0;
}
```

### 回调函数

```c
// 定义
void populate_array(int *array, size_t arraySize, int (*getNextValue)(void));
int getNextRandomValue(void);
// 调用
populate_array(myarray, 10, getNextRandomValue);
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

- [用法参考](https://www.cnblogs.com/edver/p/8419807.html)
- [可变参数实现](https://blog.csdn.net/smstong/article/details/50751121)

### 函数类型 与 函数指针类型

```c
void test() { printf("%s\n", __func__); }

typedef void(func_t)(); // 函数类型
typedef void(*func_ptr_t)(); // 函数指针类型

int main(int argc, char* argv[])
{
    func_t* func = test;     // 使用函数类型 声明一个指针变量
    func_ptr_t func2 = test; // 使用函数指针类型 声明一个指针变量
    void (*func3)(); // 声明 个包含函数原型的函数指针变量
    func3 = test;

    func();
    func2();
    func3();

    return EXIT_SUCCESS;
}
```

### gcc  持嵌套函数扩展

```c
typedef void(*func_t)();
func_t test()
{
    void func1(){
        printf("%s\n", __func__);
    }
    return func1;
}
int main(int argc, char* argv[])
{
    test()();
    return EXIT_SUCCESS;
}
```

- 内层函数可以 "读写" 外层函数的参数和变量,外层变量必须在内嵌函数之前定义

```c
#define pp() ({ \
    printf("%s: x = %d(%p), y = %d(%p), s = %s(%p);\n", __func__, x, &x, y, &y, s, s); \
})
void test2(int x, char *s){
    int y = 88;
    pp();
    void func1()
    {
        y++;
        x++;
        pp();
    }
    func1();
    x++;
    func1();
    pp();
}
int main (int argc, char * argv[])
{
    test2(1234, "abc");
    return EXIT_SUCCESS;
}
// test2: x = 1234(0xbffff7d4), y = 88(0xbffff7d8), s = abc(0x4ad3);
// func1: x = 1235(0xbffff7d4), y = 89(0xbffff7d8), s = abc(0x4ad3);
// func1: x = 1237(0xbffff7d4), y = 90(0xbffff7d8), s = abc(0x4ad3);
// test2: x = 1237(0xbffff7d4), y = 90(0xbffff7d8), s = abc(0x4ad3);
```

### 函数修饰符

- `extern` 默认修饰符, 于函数表  "具有外部链接的标识符",这类函数可 于任何程序  件。 于变量声明表 该变量在其他单元中定义。
- `static` 使该修饰符的函数仅在其所在编译单元 (源码 件) 中可 。还可以表示函数内的静态变量。
- `inline` 修饰符 inline 建议编译器将函数代码内联到调 处,但编译器可 主决定是否完成。通 常包含循环或递归函数不能被定义为 inline 函数。
- `static inline` 内链接函数,在当前编译单元内内联。不过 -O0 时依然是 call。
- `inline` 外连接函数,当前单元内联,外部单元为普通外连接函数 (头件中不能添加 inline 关键字)。inline 关键字只能 在函数定义处


## typedef 给数据类型取别名

### 给int char float 等取别名

```c
// 比如定义一个叫 REAL 的浮点类型，在目标平台一上，让它表示最高精度的类型为：
typedef long double REAL;

// 在不支持 long double 的平台二上，改为：
typedef double REAL;

// 在连 double 都不支持的平台三上，改为：
typedef float REAL;

// 当跨平台时，只要改下 typedef 本身就行，不用对其他源码做任何修改甚至可以通过预处理器识别不同平台，自动 typedef
```

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

### 二进制文件与文本文件区别

- 文本文件与二进制文件的区别是逻辑上的
  - 文本文件是基于字符编码的文件，常见有ASCII编码(定长编码)，UNICODE编码,UTF-8(非定长的编码)
  - 二进制文件是基于值编码的文件，你可以根据具体应用，指定某个值是什么意思（可以看作是自定义编码），是变长编码的，因为是值编码嘛，多少个比特代表一个值，完全由你决定
- BMP文件例子：其头部是较为固定长度的文件头信息，前2字节用来记录文件为BMP格式，接下来的8个字节用来记录文件长度，再接下来的4字节用来记录bmp文件头的长度
