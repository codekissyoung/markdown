# 《C++ Primer Plus 6th》

《C++ Primer Plus 第六版》 的学习笔记。

## 第1章 预备知识

C++在C的基础上增加了以类为代表的`OOP`编程、以及基于`模板`的泛型编程。

`OOP`强调数据，设计出与问题本质相对应的数据格式（即自定义数据类型），它与内置类型的使用是一样的。

- 对象、类、封装、数据隐藏、接口、多态、继承
- 多态:
- 继承: 复用代码、通过对基类进行派生，产生更加契合问题的派生类，派生类继承基类已有的功能
- `OOP`的本质就是设计并且拓展自己的数据类型，让设计的类型与现实数据相匹配

泛型编程：强调独立于特定的数据类型，创建出独立于类型的代码

## 第2章 开始学习C++

**声明变量**: 声明指明了变量的 名称 及 类型，但并不分配内存空间。

**定义变量**: 为变量分配内存空间。

如果`a.cpp`需要使用`b.cpp`中定义的`全局变量`，则必须使用`extern`声明它，表明它是来自于其他文件的`全局变量`。更一般的做法是，由`b.h`提供`全局变量`的声明，`a.cpp`只需要`#include b.h`即可以使用`b.cpp`中定义的全局变量。

```c++
// b.cpp
extern const double PI = 3.14159;
// b.h
extern double PI;

// a.cpp
#include "b.h"
cout << PI << endl;
```

## 第3章 处理数据

运算符的 `优先级` 与 `结合性`:

- `优先级` 指示了先进行什么运算，后进行什么运算
- `结合性` 指示了运算符在`优先级`相同的情况下，是从左往右开始运算，还是从右往左开始运算

C++中有11种整形 与 3种浮点型，不同的数值类型进行运算时，计算机自动为它们进行类型转换后，再运算。

类型转换存在3种问题：

- 精度损失 `double -> float`
- 小数部分丢失 `double -> int`
- 数值错误 `long -> short`, 通常只复制`long`的低位字节

使用`{}`初始化列表进行变量的初始化，可以防止变量的窄化`narrowing`。

强制类型转换:

```c++
(typeName) value;  // C 与 C++ 都适用
typeName( value ); // 只有C++支持
```

字符通过其数值编码来表示，`IO`系统决定了编码是被解释为字符还是数字。

## 第4章 复合类型

### 数组

数组关键点：元素的类型，数组名，数组中的元素个数。

```c++
typeName arrayName[arraySize];
```

C 风格字符串中，处理字符串的函数是根据空字符`\\0`的位置，而不是字符数组的长度来处理。计算存储字符串的所需的最短数组时，不要忘记结尾的`\\0`字符需要占一个元素。

### 结构

结构将多个不同类型的值存储在一个数据对象中，使用`.`返回其中成员。声明一个结构类型，即是声明了一种新类型。

### 枚举

`enum`提供了另一种创建符号常量的方式，这种方式可以代替`const`。枚举也是声明了新类型。

```c++
enum spectrum { red, orange, yellow = 8, green, blue };
spectrum band; // 使用 spectrum 类型 声明一个变量，该类型只有 5 个能取的值
band = blue;   // 赋值
```

### 指针与动态内存

指针本身只指出了对象存储的起始地址，而没有指出其类型（类似`void *`指针），通过声明指针的类型，就可以让编译器知晓该如何使用 起始地址 访问 存储对象。

`new`运算符是在程序运行时为数据对象申请内存，它返回申请到的内存的地址，可以将这个地址赋给一个指针。之后，只能使用该指针来访问这块内存。

```c++
int *pt   = new int;
short *ps = new short[500];

delete pt;
delete[] ps;
```

- 不要使用`delete`来释放不是`new`分配的内存。
- 不要使用`delete`是否同一块内存两次。
- `delete[]` 用于释放`new[]` 生成的数组
- 对空指针`nullptr`使用`delete`是安全的

C++将数组名解释为一个内存地址。多数情况下，解释为数组的第一个元素的地址。是一个地址常量。但如果对数组名取地址，则得到的是整个数组的地址。地址的值虽然一样，但它们的类型不一样。

```c++
short tell[10];
// tell 等价于 &tell[0]; 是一个 2 字节内存块的地址
// &tell 是一个 20字节内存块的地址
short (*pas)[20] = &tell; // pas 是一个指针，指向 20 字节的内存块
```

### 变量的生存期

自动存储：变量在函数调用时产生，在函数返回时销毁。

静态存储：函数外定义的全局变量，以及函数内使用`static`声明的静态变量

动态存储：`new`与`delete`管理的堆内存池。

### 类型组合

数组、结构和指针，可以各种方式组合它们。

## 第5章 循环和关系表达式

略

## 第6章 分支语句与逻辑运算符

略

## 第7章 函数——C++的编程模块

C++函数参数按值传递，这意味着将数值传递给函数，而后函数将其赋给一个新变量，用于函数内部使用。将一个内存地址(指针)传递给函数，也是按值传递，只不过函数内部可以通过该内存地址，修改函数外部的值。

如果函数的定义中，将函数的参数声明为引用，则 新变量名 与 函数外部变量名 绑定的是同一个数据对象。

```c++
void swap( int a, int b );    // 按值传递
void swap2( int *a, int *b ); // 按值传递
void swap3( int &a, int &b ); // 按引用传递

int c = 5, d = 6;
swap( c, d );
swap2( &c, &d );
swap( c, d );   // 推荐使用，程序更加清晰，优雅
```

### 设计处理数组的函数

```c++
int sum_arr( int arr[], int n );  // 传入数组首地址，以及数组大小

// begin 指向要处理的起始位置，end 指向要处理最后元素的后面一个位置
int sum_arr( int *begin, int *end ){
    const int *pt;
    int total = 0;
    for( pt = begin; pt != end; pt++ )
        total = total + *pt;
    return total;
}
int sum = sum_arr( arr, arr + sizeof(arr) / sizeof(int) );

// 处理二维数组
int sum( int (*ar2)[4], int size );
int sum( int arr[][4], int size ); // 与上式等价，列数固定 4 列，行数为 size

```

**函数处理C风格字符串** : C风格字符串 与 常规char数组之间的区别是：字符串内部有内置的结束字符`\\0`,这意味着不必传字符串长度到函数。

```c++
unsigned int c_in_str( const char *str, char ch ){
    unsigned int count = 0;
    while( *str ){              // 字符串最后一个字符是\0, false
        if( *str == ch )
            ++count;
        ++str;
    }
    return count;
}
```

`*"pizza"`中，C++将`"pizza"`解释为其第一个元素的地址，因此使用`*`运算符将得到第一个元素的值，即字符`p`。同理`"taco"[2]`解释为第3个字符的值，即`z`。

**函数处理结构**: 像处理内置类型那样来处理结构，可以将结构作为参数传递，也可以从函数内返回一个结构，这些都是按值传递。当然，如果结构体较大，最好是传递结构体的指针，或者使用引用来传递，这样可以提高程序运行效率。

**函数处理对象**: 对象与结构类似，例如可以相互赋值，可以直接传递给函数。

### 函数的递归掉用

```c++
void recurs( argumentlist ){
    statements1;
    if( test )
        recurs( argumentlist );
    statements2;
}
```

上述为一般递归调用函数的模板。通常将递归调用放在`if`语句中，当`test`最终为`false`时，停止递归调用，依次返回调用链条上的所有结果。

假设上述递归执行了5次，那么`statements1`将在每次`recurs`调用之前调用，共 5次，而`statements2`将在最后一次`recurs`调用（其中包括执行`statements2`）结束返回后依次调用，共执行5次，调用顺序与`statements1`相反。

### 指向函数的指针

函数也有地址。函数的地址是存储其机器语言代码的内存首地址。如果将函数A的地址传递给函数B,则在函数B中可以通过这个地址调用A。这意味着，我们可以在不同情况下，给B函数传递不同函数的地址，这样操作可以非常灵活的实现某些功能。

那么我们该用什么参数来接收这个函数地址呢？答案是 函数指针。需要注意的是，要将该地址解释为函数调用时，必须知道其函数类型。也即是该函数指针的类型。

C++中函数名与函数地址的作用相同。函数名的值即是函数的内存地址，传递函数的名称作为参数。

```c++
double pam( int );   // 函数原型
double (*pf)( int ); // pf 就是 pam 的函数指针

void estimate( int lines, double (*pf)(int) ){
    double h = (*pf)( lines ); // 使用函数指针 调用函数
    // double h = pf( lines ); // 与上式等价，由于历史原因，对于函数调用 *pf 等价于 pf
}
estimate( 7, pam );            // 调用函数，将 pam 作为值传入

const double *get_max( const double *a, int b );       // 函数原型
const double *get_min( const double *a, int b );       // 函数原型
typedef const double *(*p_fun)( const double *, int ); // 使用 typedef 简化， p_fun 现在是 该函数指针 的类型了

p_fun p1 = get_max;                     // 声明 该函数指针类型的变量
p_fun pa[3] = { get_max, p1, get_min }; // 声明 该函数指针的数组

p_fun (*pd)[3] = &pa;                   // 想想看 &pa 的类型是什么？
```

例题:

结构`applicant`与函数原型如下，请声明:

- 指向 `f1()` 与 `f2()` 的指针 `p1` 与 `p2`
- 一个名为`ap`的数组，它包含5个类型与`p1`相同的指针
- 一个名为`pa`的指针，它指向的数组包含10个类型与`p2`相同的指针

```c++
struct applicant{
    char name[30];
    int credit_ratings[3];
};

void f1( applicant *a );
const char *f2( const applicant *a1, const applicant *a2 );
```

答案如下:

```c++
int main( int argc, char *argv[] )
{
    typedef void ( *Point_Type_f1 )( applicant * );
    typedef const char *( *Point_Type_f2 )( const applicant *, const applicant * );

    Point_Type_f1 p1;
    Point_Type_f2 p2;

    Point_Type_f1 ap[5];
    Point_Type_f2 (*pa)[10];

    return EXIT_SUCCESS;
}
```

## 第8章 函数探幽

### 内联函数

通常的做法是将内联函数的定义放在`.h`文件中，并在函数定义前面加上`inline`:

```c++
inline double square( double x ) { return x * x; } // a.h
```

### 默认参数

可以只在函数原型中，声明默认参数即可。

```c++
char *left( const char *, int n = 1 );

char *left( const char *str, int n ){ ... }
```

### 引用变量

引用变量的主要用途是作为函数的形参，通过引用，函数内部使用的是传递进来的参数的原始数据，而不是拷贝出来的副本。引入引用主要为了结构与类，减少拷贝，提升性能。

引用在声明的时候，就必须初始化并绑定一个变量:

```c++
int rats;
int &rodents = rats; // 声明引用变量 rodents

void swap( int &a, int &b ) // 引用变量作为 形参
{
    int temp;
    temp = a;
    a = b;
    b = temp;
}
```

常规变量 与 `const` 变量都可以视为左值，因为可以通过地址访问它们。但常规变量属于可修改的左值，`const`变量属于不可修改的左值。

```c++
double refcube( const double &ra ) { return ra * ra * ra; }
double side = 3.0;
double *pd  = &side;
double &rd  = side;
double lens[4] = { 1.0, 2.0, 3.0, 4.0 };

double c1 = refcube( side );        // ra is side
double c2 = refcube( lens[2] );     // ra is lens[2]
double c3 = refcube( rd );          // ra is rd is side
double c4 = refcube( *pd );         // ra is *pd is side
double c5 = refcube( 7.0 );         // ra is 临时变量 的引用
double c6 = refcube( side + 10.0 ); // ra is 临时变量 的引用
```

应尽可能使用 `const`

- `const` 可以避免函数无意中修改数据
- `const` 让函数可以处理`const`与非`const`变量，否则将只能接受非`const`数据
- `const` 使函数能够正确生成并使用临时变量

使用引用需注意，在函数中不要返回局部数据的引用。

什么时候应该使用引用？什么时候应该使用指针？什么时候按值传递呢？

- 如果数据很小，如内置类型或小型结构，如果不需要修改传递的值，使用按值传递
- 如果需要修改参数值，则使用指针。
- 如果数据是数组，指针是唯一选择。
- 如果是较大的结构，则使用引用，或者是指针，提高效率。
- 如果数据对象是类对象，则标准方式，就是按引用传递。

### 函数重载

编译器在函数调用时，根据函数的实际参数的特征，去查找匹配对应的重载函数。通过函数重载来设计一系列函数，它们名称相同，完成相同的工作，但是使用不同的参数列表。

```c++
void print( const char *, int );
void print( double, int );
void print( int, int );
void print( const char * );
```

重载引用参数:

```c++
void staff( double & rs );          // matches modifiable lvalue
void staff( const double & rcs );   // matches rvalue, const lvalue

void stove( double & rl );          // matches modifiable lvalue
void stove( const double & r2 );    // matches const lvalue
void stove( double && r3 );         // matches rvalue

double x = 55.5;
const double y = 32.0;

stove( x );     // call stove( double & )
stove( y );     // call stove( const double & )
stove( x + y ); // call stove( double && )
```

对于引用参数来说，有三种实参：`modifiable lvalue`、`const lvalue`、`rvalue`，当重载函数只有两个时，匹配情况如`staff()`，当有3个时，匹配情况如`stove()`。假如没有定义`stove( double && )`,则`stove( x + y )`将调用`stove( const double & )`。

### 函数模板

函数模板是通用的函数描述，模板使用泛型来定义函数。编译时，编译器根据函数调用处使用的具体类型(`int` `double` 自定义类型等)，生成一个使用该具体类型的函数，而后调用处的函数就使用该编译器生成的具体类型函数。

在开发中，模板的定义直接写在`.h`中。最终编译后的代码，不包含任何模板，只包含为程序生成的实际调用到的函数。

```c++
// 普通模板
template <typename T>
void swap( T &a, T &b ){
    T temp;
    // ...
}

// 模板的重载
template<typename T>
void swap( T *a, T *b, int n );

// 具体化模板
struct job {
    char name[40];
    double salary;
};
template<> void swap( job &, job & );
```

对于函数重载、函数模板、函数模板重载，C++编译器需要使用一个优先级策略，来决定最终为调用方，生成和使用哪一个函数定义：

- 第一步：创建候选函数列表，包括与被调用函数同名的函数以及模板函数
- 第二步：创建可行函数列表，这些函数的参数数目要与被调用方一致，参数类型的话，可以有隐式转换
- 第三步：确定最佳的可行函数，如果有，则使用它，无则报错

```c++
may( 'B' ); // 函数调用

// 候选函数列表
void  may( int );                           # 1
float may( float, float = 3 );              # 2
void  may( char );                          # 3
char *may( const char * );                  # 4
char  may( const char & );                  # 5
template<typename T> void may( const T & ); # 6
template<typename T> void may( T * );       # 7
```

对上述代码，先判断可行函数列表：参数数目一致，且类型能够隐式转换成功。`#4` 与 `#7` 中`char`是无法自动转换为指针类型的，所以排除掉。

接下来确定最佳可行函数，从最佳到最差的顺序：

1. 完全匹配，常规函数 优于 模板
2. 提升转换，比如 `char` `short` 转换为 `int`
3. 标准转换，比如 `int` 转换为 `char`，`long`转换为`double`
4. 用户自定义转换，比如类声明中定义的转换

所以，`#1`(提升转换) 优于 `#2`(标准转换)。`#3` `#5` `#6` 是完全匹配的，都优于 `#1` 和 `#2`。`#3` 与 `#5` 优于 `#6`，因为 `#6` 是模板。

`decltype`类型推断:

```c++
template<typename T1, typename T2>
void ft( T1 x, T2 y )
{
    decltype( x + y ) xpy = x + y;
}

double x = 5.5;
double y = 7.0;
double rx = x;
const double *pd;
long indeed( int );

decltype(x) w;           // w is type double
decltype(rx) u = y;      // u is type double &
decltype(pd) v;          // v is type double *
decltype( indeed(3) ) m; // m is type long
```

后置返回类型:

```c++
auto ft( int x, float y ) -> double; // 函数返回 double 类型

template<typename T1, typename T2>
auto gt( T1 x, T2 y ) -> decltype(x + y)
{
    return x + y;
}
```

## 第9章 内存模型与名字空间

一个项目通常如下组织:

```c++
main.cpp            // 主文件，程序入口
a.h                 // a 头文件
a.cpp               // a 的定义
b.h                 // b 的头文件
b.cpp               // b 的定义
```

通常是将`a.cpp` `b.cpp` 以及`main.cpp`分别单独编译成`a.o` `b.o` `main.o`临时文件，然后再链接在一起。

一般放在`.h`中的内容：

- 函数原型
- 使用`#define`与`const`声明的符号常量
- 结构声明
- 类声明
- 模板定义
- 内联函数

由于使用了多个源代码文件，这里就出现了不同文件的 变量 与 函数 的生存周期、作用域 和 链接性问题。

作用域`scope`：描述了 名称 在文件的多大范围内可见，例如：函数A内的变量只在函数A内可以使用；函数定义之前声明的变量可在所有函数中使用。

链接性`linkage`：描述了 名称 在不同 翻译单元 之间的共享，链接性为 外部的 可以在文件间共享，链接性为 内部的 则只能在当前文件内的函数中使用。

对于变量来说，存在 3 种情况:

```c++
// a.cpp
extern int global   = 1000; // 静态变量，外部链接性，即其他文件也能访问
static int one_file = 50;   // 静态变量，内部链接性，即只能在本文件使用
const int const_int = 60;   // 由于const的副作用，这是静态变量，内部链接性

void funct( int n )
{
    int a = 0;              // 内部变量，无链接性，出作用域销毁
    static int count = 0;   // 静态变量，无链接性，只在本函数内有效
}
```

对于函数来说，存在 2 种情况:

```c++
void out_func( int a );     // 外部链接性，其他文件也能访问
static void inter_func();   // 内部链接性，只能在本文件访问
```

C++如何查找函数的定义呢？假设在程序的某个文件中调用一个函数：

1. 如果该文件中，函数声明指出该函数是`static`的，则编译器只在本文件查找该函数定义
1. 否则编译器将在所有程序文件中查找
1. 如果找到两个定义，则报错重复定义
1. 如果程序文件中没有找到，则继续在库中搜索

这意味着，如果定义了一个与库函数同名的函数，则编译器将使用程序员自定义的版本，而不是库函数。

C++ 存储数据的方案:

- 自动存储：函数定义里的变量，代码块中的变量，随着代码块执行创建，代码块结束则销毁
- 静态存储：函数定义之外的全局变量，函数中使用`static`声明的，它们在程序的运行期都存在。C++中区分了 3 种静态类型。
- 线程存储：使用`thread_local`声明，其生命周期与所属线程一样长
- 动态存储：程序运行时，使用`new`动态申请的内存将一直存在，直到使用`delete`释放。通常也称为自由存储（`free store`）或堆内存(`heap`)

**单定义原则**：变量可以在多个地方声明，但只能有一次定义。

默认情况下，全局变量的链接性都是外部的，但是使用`const`定义的全局变量，会将链接性修改为内部的。可以使用`extern`强制将链接性修改为外部的。因此有两种对全局常量的使用方式

第一种：默认内部链接性，每个`.cpp`文件都有一份相同的常量定义，而不是共享一份常量

```c++
// const.h
const double Pi = 3.14159;
// a.cpp
#include "const.h"
// b.cpp
#include "const.h"
```

第二种：声明使用强制使用外部链接性，定义只放在一个`.cpp`文件

```c++
// const.h
extern const double Pi;
// const.cpp
#include "const.h"
const double Pi = 3.14159;
// a.cpp
#include "const.h"
```

**volatile** 阻止程序优化:

在编译过程中，如果编译器发现程序在近几条语句中多次使用了某个变量，则编译器会进行优化：将这个值缓存到寄存器中，这样程序就不用多次访问内存取得该值。这种优化的假设前提是，两次取用内存之间，该内存处的值时不变的。但是如果这个变量所在的内存 如果是 某个硬件地址（比如串口），硬件会改变其值；或者 该变量所在的内存是 共享内存，有其他进程 或者 线程会修改 该内存处的值。那么这种编译器的优化，会导致该变量值不一致。当前程序应该使用内存处的值，而不是寄存器缓存的值。对变量声明为 `volatile` 就是为了避免这种优化，让对该变量的读取始终使用内存处的值。

**mutable** 结构内可变变量:

```c++
struct data
{
    char name[30];
    mutable int access;
};

const data veep = { "codekissyoung", 0 };

strcpy( veep.name, "zhangjian" ); // not allowed
veep.access ++; // allowed
```

**语言链接性**:

链接程序要求每个不同的函数要有不同的符号名。在C语言中，一个名称只能对应一个函数，所以C语言的编译器可能将`spiff`这样的函数名，设置其符号名为`_spiff`，称为C语言的链接性。

在C++语言中，由于函数重载、函数模板的存在。对于`spiff(int)`，符号名为`_spiff_i`，而`spiff(double,double)`的符号名为：`_spiff_d_d`,称为C++语言链接性。

假设在 C++中要使用由 C编译器 编译出来的库：

```C++
spiff( 22 ); // from C library
```

它在C库中符号名为`_spiff`，但是对于C++链接程序来说，C++的查找约定是`_spiff_i`,为了解决这个问题，我们需要在函数原型中指出要使用的约定：

```c++
extern "C" void spiff( int ); // 使用 C 的编译约定
```

## 第10章 对象和类

定义一个类，就是实现了一种数据类型，它完成了三项工作:

- 决定了数据对象需要的内存大小
- 决定了如何解释内存中的`bit`数据
- 决定了数据对象可以使用的运算符和方法

对于内置类型来说，这些信息都内置在编译器中。而自定义数据类型，则需要程序员自己提供这些信息。这为我们带来了根据需要实际定制的新数据类型的强大功能和灵活性。

此外，`class` 将 数据存储 以及 操纵数据 的方法组合成了一个整体。

声明:

```c++
// stock.h
class Stock
{
private:
    std::string company; // 持有公司名称
    long shares;         // 股票数量
    double share_val;    // 每股价格
    double total_val;    // 持股总价格

    void set_tot(){ total_val = shares * share_val; }

public:
    Stock();
    Stock( std::string co, long n = 0 , double pr = 0.0 );
    ~Stock();

    void buy( long num, double price );  // 买入
    void sell( long num, double price ); // 卖出
    void update( double price );         // 更新股价
    void show() const;                   // 显示

    // 获取总股价更高的那个对象
    const Stock& topval( const Stock& s ) const;
};
```

定义:

```c++
// stock.cpp
// 默认构造函数定义
Stock::Stock() : company{"unknow company"}, shares{0}, share_val{0}, total_val{0}{ }

// 普通构造函数定义
Stock::Stock( string co, long n, double pr ) : company{ std::move(co) }, shares{n}, share_val{pr}, total_val{0}
{
    if( n < 0 )
    {
        cout << "Number of shares can not be negative " << company  << " shares set to 0 \n";
        shares = 0;
    }

    set_tot();
}

// 析构函数，对象被销毁时调用
Stock::~Stock()
{
   cout << company << " ~Stock() called" << endl;
}


void Stock::buy( long num, double price )
{
    if( num < 0 )
    {
        cout << "购买不能为 0 " << endl;
    }
    else
    {
        shares += num;
        share_val = price;
        set_tot();
    }
}

void Stock::sell( long num, double price )
{
    if( num < 0)
        cout << "售出不能为 0 " << endl ;
    else if( num > shares )
        cout << "存量不够" << endl;
    else
    {
        shares -= num;
        share_val = price;
        set_tot();
    }
}

void Stock::update( double price )
{
    share_val = price;
    set_tot();
}

void Stock::show() const
{
    cout << "公司: " << company << "\t"
         << "持有: " << shares << "\t"
         << "股价: $" << share_val << "\t"
         << "总值: $" << total_val << endl;
}

// this 指针
const Stock &Stock::topval( const Stock &s ) const
{
    if ( s.total_val > total_val )
        return s;
    else
        return *this;
}
```

使用:

```c++
// main.cpp
vector<Stock> my_stocks;

Stock baidu { "baidu", 189, 23.24 };
Stock sina  { "Sina", 190, 54.32 };
Stock sohu  { "Sohu", 342, 10.32 };
Stock ali   { "ali", 1000, 382.23 };

my_stocks.push_back( baidu );
my_stocks.push_back( sina );
my_stocks.push_back( sohu );
my_stocks.push_back( ali );

for( auto &x : my_stocks )
{
    x.show();
}
```

## 第11章 使用类

**运算符重载**: 运算符重载使得操作对象更美观，更优雅。
**友元函数**: 通过在类内部声明 某函数 为本类的友元函数，则该函数可以使用类内部的`private`数据。

```c++
class Time
{
private:
    int hours;
    int minutes;
public:
    Time operator+( const Time &t ) const; // 成员函数重载运算符 +
    friend std::ostream &operator<<( std::ostream &os, const Time &t );
    friend Time operator+( const Time &t1, const Time &t2 ); // 非成员函数的运算符重载 +
};

// T1 = T2 + T3 转换为 T1 = T2.operator+( T3 ); 也就是说，只有当本对象 处于 T2 位置时才会触发调用
Time Time::operator+( const Time &t ) const
{
    Time sum;
    sum.minutes = minutes + t.minutes;
    sum.hours = hours + t.hours + sum.minutes / 60;
    sum.minutes %= 60;
    return sum;
}

// T1 = T2 + T3; 转换为 T1 = operator+( T2, T3 );
Time operator+( const Time &t1, const Time &t2 )
{
    Time sum;
    sum.minutes = t1.minutes + t2.minutes;
    sum.hours = t1.hours + t2.hours + sum.minutes / 60;
    sum.minutes %= 60;
    return sum;
}

std::ostream &operator<<( std::ostream &os, const Time &t )
{
    os << t.hours << " hours, " << t.minutes << " minutes"; // 能直接使用 t 的私有数据了
    return os;
}
```

重载限制:

- 重载后的运算符必须至少有一个操作数是用户定义的类型，这将防止用户为内置类型重载运算符
- 使用运算符时，不能违反原来的语法规则，即运算符要求的操作数 以及 优先级、结合性都不变
- 只能重载C++已有的部分运算符,不包括`sizeof`、`.`、`::`、`?:`、`const_cast`等
- `=`、`()`、`[]`、`->`只能使用成员运算符重载
- 对于同一个运算符来说，成员函数运算符重载 与 非成员函数运输符重载 必须 2 选 1,对于某些运算符来说，成员函数运算符重载是唯一选择;而有些运算符，使用 非成员函数运算符重载 + 友元声明 配合起来使用，效果会更好，比如上述 `+`、`<<` 等。

### 类的自动装换 和 强制类型装换

对于`String bean = "pinto";`这句代码，`"pinto"`是C风格字符串，类型是`char *`,由于`String`类定义了`String( char * )`，便能够这样写了，底层默认执行`String( char * )`构造函数，看起来就像是`"pinto"`自动转换成了`String`类型一样。

```c++
class Stonewt
{
private:
    enum{ Lbs_per_stn = 14 };
    int stone = 0;
    double pds_left = 0.0;
    double pounds = 0.0;

public:
    Stonewt() = default;
    explicit Stonewt( double lbs );
    ~Stonewt() = default;
    explicit operator int() const;
    explicit operator double() const;
};

// 当 对象 = double类型; 时，自动调用
Stonewt::Stonewt( double lbs )
{
    stone = int(lbs) / Lbs_per_stn;
    pds_left = int(lbs) % Lbs_per_stn + lbs - int(lbs);
    pounds = lbs;
}

// 当对象作为 int 时，自动调用本函数
Stonewt::operator int() const
{
    return lround( pounds );
}

// 当对象作为 double 时，自动调用本函数
Stonewt::operator double() const
{
    return pounds;
}
```

C++允许指定在类和内置类型之间进行转换:

- 只有一个参数的构造函数，用于将类型与该参数相同的值转换为 类类型，例如，将 `double` 值赋值给 `Stonewt` 对象时，接受 `double` 参数的 `Stonewt` 类构造函数将自动被调用。
- 通过转换函数`operator typeName();`,将类对象赋值给`typeName`变量时，或将类强制转换为`typeName`变量时，该转换函数自动被调用
- 当不希望编译器进行隐式的`对象 -> 内置类型` 或 `内置类型 -> 对象`的转换的话，则使用`explicit`声明它。

## 第12章 类和动态内存分配

为了让程序在运行时决定内存分配，而不是在编译时确定，我们需要在类中使用`new`与`delete`控制内存分配。遗憾的是，这将会带来一些新的编程问题，现在就看看如何处理这些问题。

C++自动为类提供以下成员函数：

- 默认构造函数
- 默认析构函数
- 复制构造函数，用于初始化过程中，原型为`Class_name(const Class_name &)`
- 赋值运算符，将一个对象赋值给另一个对象时，自动调用
- 取地址运算符`&`，默认返回this指针的地址
- 移动构造函数(C++11)
- 移动赋值运算符(C++11)

默认的复制构造函数的作用是：逐个复制非静态成员的值到新对象，也称为浅拷贝。浅拷贝带来的问题是，对于在类内使用`new`申请的动态内存，浅拷贝只复制了该内存的指针，而没有开辟新的动态内存空间，所有两个对象的指针成员指向的是同一块内存。

默认赋值运算符也是同样的问题。

复制构造函数的调用时机，一般来说，在涉及到按值传递的时候，都会调用：

```c++
// motto is StringBad object
StringBad ditto( motto );
StringBad metoo = motto;
StringBad also = StringBad(motto);
StringBad *pStringBad = new StringBad( motto );
```

赋值运算符 与 复制构造函数类似，但是有一些区别:

- 复制构造函数是使用旧对象**新生成**对象时调用，所以不需要清理新对象中的动态内存，而赋值运算符是两个已经生成的对象之间的赋值，所以被赋值的对象应该先清理`delete`它里面的动态内存，再申请新内存去存储拷贝过来的值。

- 第二，赋值运算符应该避免给对象自身赋值，这非常重要，因为上述原因，很可能清除对象的动态内存，所以我们应该先判断此次赋值操作是否为自身赋值，如果是，直接返回对象本身，不要做任何多余操作。

- 复制构造函数不需要返回任何数据，而赋值运算符需要返回对象的引用`return *this;`。

多个构造函数只对应一个析构函数，所以使用`new`声明，与使用`new[]`申请的内存，在析构函数中必须使用对应的`delete`与`delete[]`，对于同一个变量，在不同的构造函数中，不允许即使用`new`声明，又使用`new[]`声明。

函数或方法返回对象的方式:

```c++
// 拷贝方式返回 s1 或 s2, 这将调用 复制构造函数
StringBad Max( const StringBad &s1, const StringBad &s2 );

// 返回 s1 或 s2 的常量引用(因为入参是const), 不需要调用 复制构造函数，效率更高
const StringBad &Max( const StringBad &s1, const StringBad &s2 );

// 返回非常量引用
ostream &operator<<( ostream &os, const StringBad &st );

// 返回常量对象, 为了避免出现 if( str1 + str2 = "something" ) 能编译成功
const StringBad StringBad::operator+( const StringBad &s1, const StringBad &s2 );

```

使用指向对象的指针:

```c++
Class_name *p_class = new Class_name(value); // 调用构造函数 Class_name(Type_name value);
Class_name *ptr     = new Class_name;        // 调用默认构造函数

delete p_class; // 使用delete后，才调用 Class_name 的析构函数
delete ptr;
```

如果`Class_new`内部也使用了`new`与`delete`申请动态内存的话，那么上述代码就在两个层次上使用了动态内存。以`StringBad`举例:

- `StringBad`内部使用了`new`为存储`str`字符串申请了堆内存
- 在调用端`new StringBad`操作，为存储`StringBad`本身申请了堆内存，存储了`str`指针、`len`成员，`num_strings`则是独立存储在静态变量区的。

当不需要对象时，在调用处也必须使用`delete`去释放`Class_name`对象本身，`Class_name`本身释放时，也会调用自身的析构函数去释放`str`指针指向的内存。

`StringBad`例子:

```c++
// StringBad.h
class StringBad
{
    private:
        char *str;                  // 指向string实际存储的char数组
        int len = 0;                // char数组长度
        static int num_strings;     // StringBad 类构造的对象的个数

    public:
        StringBad();                         // 默认构造函数
        ~StringBad();                        // 析构函数
        StringBad( const char *s );          // 构造函数,不使用 explicit,因为这个隐式转换很常见和方便
        StringBad( const StringBad &st );    // 复制构造函数
        int length() const { return len; }

        StringBad &operator=( const StringBad &st );
        StringBad &operator=( const char * );
        char &operator[]( int i );
        const char &operator[]( int i ) const;

        friend bool operator<( const StringBad &st, const StringBad &st2 );
        friend bool operator>( const StringBad &st, const StringBad &st2 );
        friend bool operator==( const StringBad &st, const StringBad &st2 );
        friend std::ostream &operator<<(std::ostream &os, const StringBad &st );
        friend std::istream &operator>>(std::istream &is, StringBad &st);

        static int HowMany(){ return num_strings; }
};

std::ostream &operator<<( std::ostream &os, const StringBad &st );
std::istream &operator>>( std::istream &is, StringBad &st );

bool operator<( const StringBad &st, const StringBad &st2 );
bool operator>( const StringBad &st, const StringBad &st2 );
bool operator==( const StringBad &st, const StringBad &st2 );
```

```c++
// StringBad.cpp
int StringBad::num_strings = 0; // 必须在此处初始化，而不是在声明处

StringBad::StringBad() : len{0}
{
    str = new char[1];
    str[0] = '\0';
    ++num_strings;
}

StringBad::~StringBad()
{
    cout << --num_strings << " StringBad object left" << endl;
    delete[] str;
}

StringBad::StringBad( const char *s )
{
    len = strlen( s );
    str = new char[len + 1];
    strcpy( str, s );
    ++num_strings;
}

StringBad::StringBad( const StringBad &st ){
    ++num_strings;
    len = st.len;
    str = new char[len + 1];
    strcpy( str, st.str );
}

// assign StringBad to StringBad
StringBad &StringBad::operator=( const StringBad &st ){
    if( this == &st )
        return *this;
    delete[] str;

    len = st.len;
    str = new char[len + 1];
    strcpy(str, st.str);
    return *this;
}

// assign C-Style-string to StringBad
StringBad &StringBad::operator=(const char *s ) {
    delete[] str;
    len = strlen(s);
    str = new char[len + 1];
    strcpy( str, s );
    return *this;
}

// read-write char access for StringBad
char &StringBad::operator[](int i) {
    return str[i];
}

// 在重载时，C++区分const与non-const特征标，所以这里提供一个仅供 const StringBad 对象使用的版本
const char &StringBad::operator[](int i) const {
    return str[i];
}

bool operator<( const StringBad &st1, const StringBad &st2 ) {
    return strcmp(st1.str, st2.str ) < 0 ;
}

bool operator>( const StringBad &st1, const StringBad &st2 ){
    return st2 < st1;
}

bool operator==( const StringBad &st1, const StringBad &st2 ){
    return 0 == strcmp( st1.str, st2.str );
}

istream &operator>>( istream &is, StringBad &st ){
    char temp[80];
    is.get( temp, 80 );
    if( is )
        st = temp;
    while( is && is.get() != '\n' )
        continue;
    return is;
}

ostream &operator<<( ostream &os, const StringBad &st )
{
    os << st.str;
    return os;
}
```



### 定位new技术

```c++
const int BUF = 1024;

class JustTesting{
private:
    string words;
    int number;
public:
    JustTesting( const string &s = "Just Testing", int n = 0 ) : words{s}, number{n} {
        cout << "constructed" << endl;
    }
    ~JustTesting() { cout << words << " ~JustTesting" << endl; }

    void show() const{
        cout << words << ", " << number << endl;
    }
};

int main( int argc, char *argv[] )
{
    char *Buffer = new char[BUFSIZ];

    JustTesting *pc1 = new (Buffer) JustTesting;
    JustTesting *pc2 = new JustTesting( "Heap1", 20 );
    JustTesting *pc3 = new (Buffer + sizeof(JustTesting)) JustTesting( "Bad Idea", 6 );
    JustTesting *pc4 = new JustTesting( "Heap2", 10 );

    cout << (void *)Buffer << endl;
    cout << pc1 << endl;
    cout << pc3 << endl;
    cout << pc2 << endl;
    cout << pc4 << endl;

    delete pc2;
    delete pc4;

    delete[] Buffer;

    return EXIT_SUCCESS;
}
```

上述代码中，使用定位`new`从`Buffer`中为对象分配内存，需要注意的点:

- `pc3` 如果从`Buffer`开始申请，会覆盖掉`pc1`
- 定位`new`申请的内存，不能使用`delete`去删除，否则会发生运行时错误

该技术能用到的地方有:写内存池、垃圾收集、以及调试。

## 第13章 类继承

继承是一种很好的代码重用的技术。

公有`public`派生：

- 基类的公有成员将成为派生类的公有成员
- 基类的私有部分也将成为派生类的一部分，但是**只能通过基类的public和protect方法访问**
- 派生类对象存储了基类的数据成员
- 派生类对象可以使用基类的方法

创建派生类对象之前，一定会先创建基类对象，派生类的构造函数必须调用基类的构造函数，如果未能显式调用，则编译器会使用基类的默认构造函数。

派生类构造函数要点：

- 首先创建基类对象
- 派生类构造函数必须调用一个基类构造函数，可以通过成员初始化列表指定要使用的基类构造函数，并将数据传递给基类构造函数
- 派生类构造函数应该初始化派生类新增的数据成员
- 派生类对象过期时，首先会调用派生类的析构函数，然后再调用基类的析构函数

```c++
class TableTennisPlayer{
private:
    string firstname;   //
    string lastname;    //
    bool hasTable;      // 是否有球桌?
public:
    TableTennisPlayer(const string &fn, const string &ln, bool ht = false ) :
        firstname{fn},lastname{ln},hasTable{ht} { }
    void name() const{
        cout << lastname << "," << firstname << endl;
    };
    bool HasTable() {return hasTable;}
    void ResetTable(bool v ) {hasTable = v;};
};

class RatePlayer : public TableTennisPlayer{
private:
    unsigned int rating; // 参与比赛次数
public:
    explicit RatePlayer(unsigned int, const string &fn = "none", const string &ln = "none", bool ht = false ) :
        TableTennisPlayer(fn, ln, ht), rating{r} { }

    RatePlayer(unsigned int r, const TableTennisPlayer &tp ) :
        TableTennisPlayer(tp), rating{r} { }

    unsigned int Rating() const { return rating; }

    void ResetRating(unsigned int r ){ rating = r; }
};
```

派生类与基类之间的关系：

- 派生类对象可以使用基类的非`private`方法
- 基类指针可以在 **不进行显式类型转换** 的情况下，指向派生类对象，但是该指针只能调用基类方法
- 基类引用可以在 **不进行显式类型转换** 的情况下，引用派生类对象，但是该引用只能调用基类方法
- 不可以将基类对象以及指针，赋值给派生类的引用 或者 指针

```c++
void show( const TableTennisPlayer &tp )
{
    tp.name();
    if( tp.HasTable() )
        cout << "has table" << endl;
    else
        cout << "no table" << endl;
}

TableTennisPlayer cao { "kaiyan", "cao", false };
RatePlayer zhan { 123, "jian", "zhang", true };

show( cao );
show( zhan );
```

派生类与基类之间的特殊关系是基于C++继承的底层模型的。

对于同一个方法，如果我们希望它在基类与派生类中的行为是不同的。即方法的行为取决于调用该方法的对象。这称为**多态**。实现多态:

- 在派生类中重新定义基类中的方法
- 使用虚方法

```c++
class Brass{
private:
    std::string fullName;   // 客户姓名
    long acctNum;           // 账号
    double balance;         // 资金结余
public:
    Brass( string s, long an, double bal ) : fullName{std::move(s)}, acctNum{an}, balance{bal} { }
    virtual ~Brass() = default;

    // 存款
    void Deposit( double amt ){
        balance += amt;
        cout << fullName << " 存入 " << amt << " 余额：" << balance << endl;
    }

    // 提现
    virtual void Withdraw( double amt ){
        if( amt <= balance )
        {
            balance -= amt;
            cout << fullName << " 取出 " << amt << " 余额：" << balance << endl;
        }else{
            cout << "您的余额不足" << endl;
        }
    }

    virtual void ViewAcct() const{
        cout << "姓名: " << fullName << endl;
        cout << "账号: " << acctNum << endl;
        cout << "余额: " << balance << endl;
    }

    double Balance() const{
        return balance;
    }
};

class BrassPlus : public Brass{
private:
    double maxLoan;     // 贷款上限
    double rate;        // 贷款费率
    double owesBank;    // 欠款金额
public:
    BrassPlus(const string &s, long an, double bal, double ml, double r ) :
        Brass{s,an,bal}, maxLoan{ml}, rate{r}, owesBank{0.0} { }

    BrassPlus(const Brass &ba, double ml, double r ) :
        Brass{ba}, maxLoan{ml}, rate{r}, owesBank{0.0} { }

    void ViewAcct() const override{
        Brass::ViewAcct();
        cout << "贷款上限：" << maxLoan << endl;
        cout << "贷款费率: " << rate << endl;
        cout << "欠款金额: " << owesBank << endl;
    }

    void Withdraw( double amt ) override{
        if( amt <= Balance() )
        {
            Brass::Withdraw( amt );
        }
        else if( amt <= Balance() + maxLoan - owesBank )
        {
            double advance = amt - Balance();

            owesBank += advance * (1.0 + rate);

            Deposit( advance );

            Brass::Withdraw( amt );
        }
        else
        {
            cout << "贷款金额超额" << endl;
        }
    }

    void ResetMax( double m ) { maxLoan = m; }
    void ResetRate( double r ) { rate = r; }
    void ResetOwes() { owesBank = 0; }
};
```

多态的体现:

```c++
Brass cao ("codekissyoung", 38123, 4000.0 );
BrassPlus zhan ("zhangjian", 38124, 5000.0, 10000.0, 0.04 );

Brass* accout_list[2];

accout_list[0] = &cao;
accout_list[1] = &zhan;

for( int i = 0; i < 2; ++i ){
    accout_list[i]->ViewAcct(); // 这句就是 多态的 体现，Brass基类的指针，能够根据情况分别调用 基类 与 派生类的实现
    cout << endl;
}
```

### 动态绑定 虚函数的实现

通常情况下，C++不允许 A 类型的指针 指向 B 类型的对象，也允许 A 类型的引用 与 B 类型的对象绑定在一起。

但是对于 A 与 B 是继承关系的 类 来说, 基类的指针与引用是可以指向或绑定到派生类的:

```c++
BrassPlus zhan ("zhangjian", 38124, 5000.0, 10000.0, 0.04 );

Brass *pb = &zhan;
Brass &rb = zhan;
```

考虑下面代码：

```c++
BrassPlus zhan ("zhangjian", 38124, 5000.0, 10000.0, 0.04 );

Brass *pz = &zhan;

pz -> ViewAcct(); // 调用 Brass 的实现，还是调用 BrassPlus 的实现？
```

指针`pz`在编译时类型 已知 且 固定，若`ViewAcct()`未声明为`virtual`则 编译器 采用**静态编译**，与`Brass`指针绑定的方法就是`Brass::ViewAcct()`,所以这种情况，即便原始对象为`BrassPlus`,但使用`Brass`类型指针调用，实际执行的代码也是`Brass`的实现。

如果`ViewAcct()`被声明为`virtual`虚函数呢？我们先来看看虚函数的原理与实现：

编译器在处理虚函数：

- 给每个对象添加一个隐藏成员`*vtpl`，它指向了一个数组，数组的成员是 函数地址（称为**虚函数表**）
- 只有 虚函数 的函数地址才会 存入该虚函数表
- 如果派生类中，重新实现了该虚函数，则新实现函数的地址 会 存入 派生类对象的 虚函数表中，如果派生类未实现，则存入基类的 虚函数实现 地址
- 注意，无论类中包含几个虚函数，对象都只有一个隐藏成员，只是不同 对象 的该隐藏成员指向的 虚函数表 的大小不同而已

原理图示如下：

```c++
class Scientist{
    char name[40];
public:
    virtual void show_name();
    virtual void show_all();
};

class Physicist : public Scientist{
    char field[40];
public:
    void show_all(); // redefined
    virtual void show_field();
};
```

![虚函数的原理](https://img.codekissyoung.com/2019/05/27/96bd6555c0b9fd246b3112e69111e76b.png)

PS: 基类中使用`virtual`声明方法，则该方法在所有派生类中的都是`virtual`的
PS: 如果要在派生类中重新定义基类的方法，通常应将基类方法声明为虚的。这样，程序将根据实际的对象类型，而不是 引用 或 指针的类型来选择方法版本

虚函数还需要注意的点：

- 构造函数不能是虚函数。创建派生类对象，使用的是派生类的构造函数，然后由它使用基类的一个构造函数。这是不同于虚函数的一套继承机制。

- 基类的析构函数应当声明为`virtual`

- 如果基类声明`virtual`的方法有多个重载版本，则应该在派生类中重新定义该方法所有的重载版本

`protected`访问控制：

- 对于数据成员，派生类能直接访问基类的`protected`数据成员
- 对于成员方法，派生类能通过基类名字调用其`protected`成员方法。它能够声明让派生类能够访问，而公众不能访问的基类的内部函数。

### 纯抽象类 ABC

假设现在要构造一个`Ellipse`（椭圆）类和一个`Circle`（圆）类，如果两者是`is-a`的关系，则派生会显得笨拙：

- 圆 只需要 一个半径 就可以描述大小，而椭圆需要 长半轴 和 短半轴
- 其他问题...等等

但是圆与椭圆又有非常多的共性。所以，我们提出一种方案，将它们的共性抽象出来，放到一个纯抽象类`BaseEllipse`中，然后从该类派生出`Circle`与`Ellipse`类。这样就可以使用`BaseEllipse`的指针，同时管理`Circle`与`Ellipse`对象。

```c++
class BaseEllipse{
public:
    void move( int nx, int ny ) { x = nx; y = ny; }
    virtual double Area() const = 0; // 纯虚函数
};
```

要成为`ABC`,必须至少包含一个纯虚函数（`= 0`声明），纯抽象类不能用来创建对象。

### 继承 与 类动态内存分配

如果在类内，使用了`new`与`delete`申请并管理了堆内存，并且重新定义了赋值运算符与拷贝构造函数。那么派生类的实现将有哪些问题呢?

如果派生类中不再使用`new`:

- 对于析构函数，派生类使用默认生成的析构函数，不执行任何操作，之后自动调用基类的析构函数，正是我们想要的
- 对于拷贝构造函数，派生类使用默认生成的拷贝构造函数，对于派生类中新数据成员执行成员复制，然后再调用基类的拷贝构造函数，对继承自基类的数据成员进行复制，正是我们想要的
- 对于赋值运算符，与拷贝构造函数类似，也是我们想要的

如果派生类中使用了`new`:

- 对于析构函数，派生类必须自己去`delete`自己的数据成员，然后再调用基类的析构函数去释放积累中的堆内存数据
- 拷贝构造函数也需要派生类自己显式定义
- 赋值运算符 也一样

```c++
// 析构函数
Base::~Base(){
    delete[] label;
}
Child::~Child(){
    delete[] style;
}

// 拷贝构造函数
Base::Base( const Base &bs ){
    label = new char[strlen(bs.label) + 1];
    strcpy( label, bs.label );
    rating = bs.rating;
}
Child::Child( const Child &cd )
    : Base( cd )                   // 这步非常重要，初始化列表中调用基类的拷贝构造函数
{
    style = new char[strlen(cd.style) + 1];
    strcpy( style, cd.style );
}

// 赋值运算符
Base &Base::operator=( const Base &bs ){
    if( this == &bs )
        return *this;
    delete[] label;
    label = new char[strlen(bs.label) + 1];
    strcpy( label, bs.label );
    rating = bs.rating;
    return *this;
}
Child &Child::operator=( const Child &cd ){
    if( this == &cd )
        return *this;
    Base::operator=( cd );  // 这步非常重要，显式调用基类的赋值运算符，复制基类中的数据
    delete[] style;
    style = new char[strlen(cd.style) + 1];
    strcpy(style,cd.style);
    return *this;
}
```

友元函数并非成员函数，所以不具有继承性，基类有基类的友元函数，派生类有派生类的友元函数。在派生类的友元函数中，可以将派生类的引用和指针转换为基类的引用和指针，从而复用基类的友元函数。

成员函数属性表:

![成员函数属性表](https://img.codekissyoung.com/2019/05/27/856803e250774c1b9b268110ed42b1c2.png)

可以将派生类对象的地址赋值给基类指针么（或派生类对象绑定到基类引用）？反过来呢？

- 可以，多态的基本操作（向上转换）
- 使用 强制类型转换、`dynamic_cast`等强制类型转换，可以实现（即向下转换），但是使用这样的指针（或引用）并不一定安全。

可以将派生类对象赋值给基类对象么？反过来呢？

- 可以，并且是使用基类的`operator=`进行赋值，派生类中新增的数据成员不会传递给基类对象
- 当且仅当派生类定义了 参数为基类引用(唯一) 的构造函数 或 以基类为参数的赋值运算符时，才会发生`派生对象 = 基类对象;`这样的赋值操作

假设定义了一个函数，它的参数为 基类对象（按值传递）。该函数可以接收 派生类对象 么？

- 可以，但是会调用基类的 复制构造函数 生成一个 新的 基类对象作为实际入参，该对象的成员对应于 派生对象 的基类部分。

假设定义了一个函数，它的参数为 基类对象的引用，该函数可以接收 派生类对象 么？

- 可以，多态类型的基本操作。按引用传递对象（而不是按值），既可以从 虚函数的多态 机制中收益，又可以节省内存 和 提升效率，加上`const`还可以保护原始数据。

## 第14章 C++的代码重用

### 包含对象成员的类

### 私有继承

### 从多个基类继承

### 类模板

## 第15章 友元、异常和其他

### 友元类与友元成员函数

### 异常

### RTTI 运行时类型识别

## 第16章 string类与标准模板库

### string类

### 智能指针模板类

### 标准模板库

### 泛型编程

### 函数对象

### 算法

## 第17章 输入 输出和文件

## 第18章 探讨C++新标准