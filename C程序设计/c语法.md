# C 语法

## 数据类型

### 整数

- `bool`: 8 位整数,在c99标准中`stdbool.h` 中定义了 `bool / true / false` 宏便于使用
- `stdint.h` 定义了 `uint64_t` , `int64_t` 等在任何操作系统上，位数更加准确的类型,还定义了大小限制
- `char c = 'a';`字符常量,默认是 个`int` 整数,但编译器可以决定将其解释为`char`或`int`
- `stdint`定义了后缀表示常数的常量类型，`56U` 表示 `unsigned int`, `76LL`表示 `76` 类型是`long long`

### 浮点数

- 存储 : 正负号 + 小数部分 + 指数部分
- 计算出现舍入错误的原因: 缺少足够的小数位来完成正确的运算

### 枚举

- 可以代替宏定义常量使用

```c
enum color { black, red = 5　};
enum color b = black;
enum color r = red;
printf("black = %d red = %d", b, r　); // 0 5
```

### 数组

#### 初始化

```c
int a[3]   = {10,9};
int a[]    = {11, 7, 6};
int arr[]  = { 0, 89, [5] = 212, 11 };
int z[][2] = {
    { 1, 1 },
    { 2, 1 },
    { 3, 1 },
};

int count = sizeof(arr) / sizeof(arr[0]);

int *p_int = &arr[6];   // 返回 int* 类型指针,指向 标序号元素
p_int = arr;            // 数组名是指向数组首地址的常量指针 指针之间赋值

int oxen[4] = {1,2,3,4};
int yaks[4];
yaks = oxen;            // error : assignment to expression with array type
```

- c中数组是连续的内存区域，是固定长度的 , 对于 c 的数组，未赋值的元素一律取 0
- 数组名`arr`在程序编译时，会替换成数组的首地址,也就是说在最后的可执行文件中，数组变量并不存在; 所有讨论数组名`arr`能不能指向别的值并没有意义
- 指针变量`p_int`在程序编译完成后，在内存是有实体的，有自己的内存存储空间(一般是固定8个字节),该空间首地址即为该指针本身的地址; 而存储的值即为它指向的内存地址，这个值是可以重新赋予的，也就是所谓的将指针指向别的变量
- C 程序里实际上只有一种类型的指针,这个指针取多少个内存字节、如何解释这块内存，全靠编译器在编译时根据代码里 强制转换(cast) 或者 预先声明好的类型来生成汇编代码的
- C 不会对数组下标索引进 范围检查,编码时需要注意过界检查
- c 不允许数组作为一个单元赋值给另一个数组

#### 多维数组

- 多维只是概念上的，实际存储上还是线性连续的

```c
int a[3][4] = {
    {0, 1, 2, 3} ,   /*  初始化索引号为 0 的行 */
    {4, 5, 6, 7} ,   /*  初始化索引号为 1 的行 */
    {8, 9, 10, 11}   /*  初始化索引号为 2 的行 */
};

// 在函数定义时对形参数组可以指定每一维的长度，也可省去第一维的长度因此，以下写法都是合法的
int MA(int a[3][10])
int MA(int a[][10])

// pt指向的是一个包含4个int类型的一维数组
void func(int pt[][4]);
void func(int (*pt)[4]); //等价上句

// 声明一个指向多维数组的指针，只能省略最左边括号中的值
int sum4d(int ar[][12][20][30],int rows);
int sum4d(int (*ar)[12][20][30],int rows); // 等价上句,ar指向一个 12 x 20 x 30 的int数组
```

#### 字符串

- 字符串是以字符 `\\0` (ASSIC码是 \\000) 结尾的char类型数组, 系统检测到该字符时,就认为字符串已经结束了
- `"string"` 双引号的字符串写法，编译器会在字符`g`后面自动补上`\\0`

```c
// 编译器自动将这些字符一个一个放入到 words 数组中
char words[100] = "i am string in array";

// 编译器自动将这些字符一个一个放入到 auto_words 数组中, 并且数组的大小会自动计算出来
char auto_words[] = "i am created in auto size";

// 编译器将 字符串 标量处的 内存地址 赋值给指针 str, 对于 str 指向处的值，你可以使用，但不可以修改，即只读的！
char *str = "something is pointing at me";
```

#### 字符数组

```c
char c[] = {'c', ' ','p','r','o','g','r','a','m','\0'};
char c[] = "C program"; // 等价上句

// 二维数组 存放 字符数组
char names[6][50] = {"马超","关平","赵云","张飞","关羽","刘备"};
for (int i = 0; i < 6; i++)
    printf("悍将名称：%s\n",names[i]);
```

- 字符char与字符串区别 : `"s"` 等价于 `s` `\\0`  两个字符连起来

```c
char ch  = "A";     //错误
char ch  = 'A';     //正确
char *ch = "A";     //正确
char *ch = 'ch';    //错误
```

##### 数组字符串与指针字符串的区别

- 字符常量MSG存储在静态存储区
- ar数组则是开辟一块内存，将MSG拷贝至该内存处
- 而指针则是直接指向MSG的内存地址

```c
// 数组字符串和指针字符串的区别
#define MSG "I am special"
printf("MSG : %p \n",MSG); // 字面量存储的位置 MSG : 0x555de31918b6

char ar[] = MSG;
printf("ar : %p \n",ar);   // 数组存储的位置 ar : 0x7ffe8fe15160
ar[5] = 's';               // 正确，因为是拷贝的的副本，可以随意更改

char *pt = MSG;
printf("pt : %p \n",pt);   // 指针指向的位置 pt : 0x555de31918b6
pt[5] = 's';               // 编译错误，不能更改字符串字面量存储处的值


char *name; // 不分配空间
scanf("%s",name); // 编译错误，未初始化指针

char name[18]; // 先分配好空间，然后将输入的字符串拷贝到该空间
scanf("%s",name);
```

- 字符串数组：指针指向的内存地址是不规则的，会根据字符串的大小而变化，数组元素之间的内存地址是规则的

```c
const char *pointer_str[5] = {
    "str",
    "string2 ,sdfadfsfssdfasfsa",
    "string3 hdhdhdh",
    "xxixixixi",
    "codsdadfsssss"
};
for(int k = 0;k < 5;k++)
    printf("pointer_str[%d] : %p : %s \n",k,pointer_str[k],pointer_str[k]);
// 运行结果 ：
// pointer_str[0] : 0x401930 : str
// pointer_str[1] : 0x401934 : string2 ,sdfadfsfssdfasfsa
// pointer_str[2] : 0x40194f : string3 hdhdhdh
...

// 每个数组元素之间相差 40 个字节
char array_str[5][40] = {
    "sdfaiisisis",
    "xixixiix sss",
    "hahah",
    "codekissyoung"
};
for(int p = 0;p < 5;p++)
    printf("array_str[%d] : %p : %s \n",p,array_str[p],array_str[p]);
// 运行结果：
// array_str[0] : 0x7ffc689c84b0 : sdfaiisisis
// array_str[1] : 0x7ffc689c84d8 : xixixiix sss
// array_str[2] : 0x7ffc689c8500 : hahah
...
```

#### 数组越界

- gcc编译器只会给出警告,然后继续编译，越界处的值是随机的
- 为了防止数组出现越界的情况，使用符号常量申明数组是很有必要的

```c
int main(int argc, char *argv[])
{
    int i;
    int a[10];
    // i = 10 时，数组是越界的，在某些编译器下，a[10]处的内存地址正好是 i 的地址，所以 i 会被赋值为0; 程序死循环
    for(i = 0; i <= 10; i++)
        a[i] = 0;
    return 0;
}
```

#### 变长数组 VLA

变长数组的变不是可以修改已经创建的数组的大小变长数组一旦创建，它的大小是保持不变的变指的是，在创建数组时，可以使用变量指定数组的维度

```c
// rows　和　cols 必须在 ar 前面
int sum2d(int rows, int cols, int ar[rows][cols]){
    int r;
    int c;
    int tot = 0;
    for(r = 0;r < rows;r++){
        for(c = 0;c < cols;c++){
            tot += ar[r][c];
        }
    }
    return tot;
}
```

#### 指针数组

```c
int *point_arr[10];
```

#### 函数指针数组

```c
int ( *func_arr[10] )( int, int );
```

## 结构体

- 在 网络协议中 ,通信控制,嵌入式系统,驱动开发 等地方，我们传送的不是简单的字节流(char 型数组),而是多种数据组合起来的一个整体，其表现形式是一个结构体
- 空结构体：一个字节大小，不可能造出 没有任何容量的容器吧
- C语言中的结构体并不能直接进行强制类型转换，只有结构体的指针可以进行强制类型转换
- 和数组不同的是,结构名并不是结构的地址

```c
struct Books
{
   char  title[50];
   char  author[50];
   char  subject[100];
   int   book_id;
};

struct Books b1, b2; // 使用结构体类型 声明变量

typedef struct Simple{
    int a;
    char b;
    double c;
} Simple;

Simple u1, u2[20], *u3;

// 此结构体的声明包含了指向自己类型的指针
struct NODE
{
    char string[100];
    struct NODE *next_node;
};

typedef struct Student {
    char *name,
    int age
} std, *pstd; //定义结构体struct Student,取别名为 std,指针别名为 pstd

std  st1      = {"codekissyoung",21};  // 定义一个std结构体变量
pstd pst1     = &st1;                  // 定义一个std结构体指针,指向st1
st1.name      = "hello li";            // 结构体访问单个元素
pst->name;                             // 通过结构体指针访问单个元素

struct book library[10]; // book结构的数组
library[2].title;        // 使用结构数组内的变量

// 嵌套结构
struct names{
    char first[10];
    char last[10];
};
struct guy{
    struct names handle; // 嵌套结构
    char favfood[10];
    char job[10];
    float income;
};
struct guy fellow = {
    // 初始化代码
};
printf("%s\n",fellow.names.first); // 使用嵌套结构内变量

struct guy fellow[2] = {
    {
        {"code","kissyoung"},
        "abcdefg",
        "editor",
        1000
    },
    {
        // ...
    }
};
struct guy *him; // 指向guy结构的指针
him = &fellow[0]; // 该指针指向结构数组的第一个元素
printf(" %s %s %s\n",him->income,(*him).income,him->handle.last); // 两种方法使用数组内的元素

// 使用指针向函数传递结构 有const 保证函数不会修改结构的内容，如果需要修改则不用const
double sum(const struct funds *money){ ... }
double sum(const struct funds money[],int n){ ... } // 等价上句

// 结构中的字符数组和字符指针
struct names{
    char first[20];
    char last[20];
};
// vs
struct names{
    char *first;
    char *last;
}; // 在输入数据到　first 中时会有问题，因为该指针根本没有指向的内存地址以及它的大小
```

### 结构体内存对齐

```c
struct Test
{
    char a;
    double b;
    char c;
};
// 0x7ffd1a3ee510 0x7ffd1a3ee518 0x7ffd1a3ee520 sizeof : 24
struct Test
{
    double b;
    char a;
    char c;
};
// 0x7ffc76f5e660 0x7ffc76f5e668 0x7ffc76f5e669 sizeof : 16
```

#### 位域

```c
struct bit_field
{
    int a:4;  //占用4个二进制位;
    int  :0;  //空位域,自动置0;
    int b:4;  //占用4个二进制位,从下一个存储单元开始存放;
    int c:4;  //占用4个二进制位;
    int d:5;  //占用5个二进制位,剩余的4个bit不够存储4个bit的数据,从下一个存储单元开始存放;
    int  :0;  //空位域,自动置0;
    int e:4;  //占用4个二进制位,从这个存储单元开始存放;
};

struct bit_field bt1;
bt1.a = 3;
bt1.b = 4;
bt1.c = 5;
bt1.d = 6;
bt1.e = 2;
```

### 变长结构体

- [零长度数组的妙用](http://elkpi.com/topics/zero-length-arrays.html)

### 联合体

- 在 union 中 所有的 数据成员 共用一个空间，同一个时间只能储存其中一个数据成员，所有的数据成员具有相同的起始数据地址
- union 使用最大的的长度来储存所有成员，所以只能一个时间，存一个！

```c
union Data
{
    int i;
    float f;
    char  str[20];
};
union Data d1;
strcpy( d1.str, "codekissyoung" );
```

## 变量

### 声明和定义

- 声明: 只告知编译器该变量的存在,不分配内存空间;
- 定义: 不但告知编译器该变量的存在,而且还分配内存空间
- 多个定义是错误的，多个声明是可以的
- 没有定义就把声明当定义,最后都是以定义为准

```c
int a;  // 声明
extern int max(int a,int b); // 在别的源文件定义的 max 函数，如果想在本文件使用它，则使用 extern 声明它

int a = 10; // 定义
int max(int a,int b){ ... } // 定义
```

### 局部变量

#### 自动局部变量

- 在函数内部声明与使用的变量，随着函数的调用而创建，随着函数的返回而回收消失

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

### | 或运算

### & 与运算

### ^ 异或运算

## 控制流

## 函数

- 函数是完成特定功能的一段代码的集合，它接受参数，返回计算后的值
- 函数传值调用 ： 函数接受主调方的变量作为参数，拷贝出一份副本，在函数内部只操作该副本，所以不会修改到主调方的变量
- 函数传地址调用 ： 函数接受主调方给出的内存地址(指针/数组名)，复制出一份地址的副本，函数内部操作该地址副本，与主调方操作该内存地址，效果是一样的；所以函数会直接修改到主调方的变量

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

### 参数从右往左 栈,且由调 者负责参数 栈和清理

```c
int main(int argc, char* argv[])
{
    int a() {
        printf("a\n");
        return 1;
    }
    char* s() {
        printf("s\n");
        return "abc";
    }
    printf("call: %d, %s\n", a(), s());
    return EXIT_SUCCESS;
}
// s
// a
// call: 1, abc
```

### 复制传递

- C 语 中所有对象,包括指针本 都是 "复制传值" 传递,我们可以通过传递 "指针的指针" 来实现传 出参数
- 注意: 别返回 test 中的栈变量

```c
void test(int** x)
{
    int* p = malloc(sizeof(int));
    *p = 123;
    *x = p;
}
int main(int argc, char* argv[])
{
    int* p;
    test(&p);
    printf("%d\n", *p);
    free(p);
    return EXIT_SUCCESS;
}
```

### 函数修饰符

- `extern` 默认修饰符, 于函数表  "具有外部链接的标识符",这类函数可 于任何程序  件。 于变量声明表 该变量在其他单元中定义。
- `static` 使该修饰符的函数仅在其所在编译单元 (源码 件) 中可 。还可以表示函数内的静态变量。
- `inline` 修饰符 inline 建议编译器将函数代码内联到调 处,但编译器可 主决定是否完成。通 常包含循环或递归函数不能被定义为 inline 函数。
- `static inline` 内链接函数,在当前编译单元内内联。不过 -O0 时依然是 call。
- `inline` 外连接函数,当前单元内联,外部单元为普通外连接函数 (头件中不能添加 inline 关键字)。inline 关键字只能 在函数定义处

## 基本输入/输出

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
