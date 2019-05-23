# 《C++ Primer Plus 6th》

《C++ Primer Plus 第六版》 的学习笔记。

## 第1章 预备知识

C语言：数据 + 算法 = 程序

OOP: 强调数据，设计出与问题本质相对应的数据格式

- OOP：对象 类 封装 数据隐藏 多态 和 继承
- 多态: 可以为运算符和函数创建多个定义，通过编程上下文来确定使用哪个定义
- 继承: 能够让你使用旧类派生出新类
- OOP的本质就是设计并且拓展自己的数据类型，让设计的类型与现实数据相匹配

泛型编程：强调独立于特定的数据类型，创建出独立于类型的代码

## 第2章 开始学习C++

`函数声明`描述了 函数 与 调用方 之间的接口，指明了 `返回类型` 与 `调用参数列表`。

对象的长处：不用了解对象的内部情况，只需要知道它的`接口`，即可以使用它。

同一个运算符号，在不同的上下文中，作用于不同的对象上，具有不同的含义与表现，即`运算符重载`。

使用一个变量之前必须声明，声明指明了变量的名称以及它的类型，但并不分配内存空间。

变量的定义为变量分配了内存空间。如果`a.cpp`需要使用`b.cpp`中定义的`全局变量`，则必须使用`extern`声明它，表明它是来自于其他文件的`全局变量`。更一般的做法是，由`b.h`提供`全局变量`的声明，`a.cpp`只需要`#include b.h`即可以使用`b.cpp`中定义的全局变量。

```c++
// b.cpp
const double PI = 3.14159;
// b.h
extern double PI;
// a.cpp
#include "b.h"
cout << PI << endl;
```

函数格式

```c++
// a.h
type functionname( argumentlist ); // 函数声明
// a.cpp
#include "a.h"
type functionname( argumentlist ) { } // 函数定义
// b.cpp
#include "a.h"
type a = functionname( b, c, d ); // 函数调用
```

## 第3章 处理数据

OOP的本质是设计并拓展自己的数据类型，自定义数据类型 与 内置类型的使用是一样的。

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

![WX20190418-155340.png](https://i.loli.net/2019/04/18/5cb82d46a23ac.png)

### 枚举

`enum`提供了另一种创建符号常量的方式，这种方式可以代替`const`。枚举也是声明了新类型。

```c++
enum spectrum { red, orange, yellow = 8, green, blue };
spectrum band; // 使用 spectrum 类型 声明一个变量，该类型只有 5 个能取的值
band = blue;   // 赋值
```

### 指针与动态内存

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

## 第5章 循环和关系表达式

略

## 第6章 分支语句与逻辑运算符

略

## 第7章 函数 C++的编程模块

传递参数：C++通常按值传递，这意味着将数值传递给函数，而后函数将其赋给一个新变量，用于函数内部使用。将一个内存地址(指针)传递给函数，也是按值传递，只不过函数内部可以通过该内存地址，修改函数外部的值。

如果函数的定义中，将函数的参数声明为引用，则 新变量名 与 函数外部变量名 绑定的是同一个数据对象。

```c++
void swap( int a, int b );    // 按值传递，变量副本
void swap2( int *a, int *b ); // 按值传递，要求值时一个地址
void swap3( int &a, int &b ); // 按引用传递，变量副本 与 外部变量执行同一个数据对象

int c = 5, d = 6;
swap( c, d );
swap2( &c, &d );
swap( c, d );   // 推荐使用，程序更加清晰，优雅
```

### 函数与数组

```c++
int sum_arr( int arr[], int n ); // 传入数组首地址，以及数组大小

int arr[] = { 1, 2, 3, 4, 5 };
int sum = sum_arr( arr, sizeof(arr) / sizeof(int) );
```

使用数组区间的函数：

```c++
// begin 指向要处理的起始位置，end 指向要处理最后元素的后面一个位置
int sum_arr( int *begin, int *end )
{
    const int *pt;
    int total = 0;
    for( pt = begin; pt != end; pt++ )
        total = total + *pt;
    return total;
}

int sum = sum_arr( arr, arr + sizeof(arr) / sizeof(int) );
```

函数与二维数组:

```c++
int sum( int (*ar2)[4], int size );
int sum( int arr[][4], int size ); // 与上式等价，列数固定 4 列，行数为 size
```

**函数与C风格字符串** : C风格字符串 与 常规char数组之间的区别是：字符串内部有内置的结束字符`\\0`,这意味着不必传字符串长度到函数。

**函数与结构**: 像处理内置类型那样来处理结构，可以将结构作为参数传递，也可以从函数内返回一个结构，这些都是按值传递。当然，如果结构体较大，最好是传递结构体的指针，或者使用引用来传递，这样可以提高程序运行效率。

**函数与对象**: 对象与结构类似，例如可以相互赋值，可以直接传递给函数。

### 函数指针

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
estimate( 7, pam ); // 调用函数，将 pam 作为值传入

const double *get_max( const double *a, int b );       // 函数原型
const double *get_min( const double *a, int b );       // 函数原型
typedef const double *(*p_fun)( const double *, int ); // 使用 typedef 简化， p_fun 现在是 该函数指针 的类型了

p_fun p1 = get_max;                     // 声明 该函数指针类型的变量
p_fun pa[3] = { get_max, p1, get_min }; // 声明 该函数指针的数组

p_fun (*pd)[3] = &pa;                   // 想想看 &pa 的类型是什么？
```

## 第8章 函数探幽

### 内联函数

通常的做法是将内联函数的定义放在`.h`文件中，并在函数定义前面加上`inline`:

```c++
inline double square( double x ) { return x * x; } // a.h
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

### 默认参数

可以只在函数原型中，声明默认参数即可。

```c++
char *left( const char *, int n = 1 );

char *left( const char *str, int n ){ ... }
```

### 函数重载

通过函数重载来设计一系列函数，它们名称相同，完成相同的工作，但是使用不同的参数列表。

```c++
void print( const char *, int );
void print( double, int );
void print( int, int );
void print( const char * );
```

编译器在函数调用时，根据函数的实际参数的特征，去查找匹配对应的重载函数。

### 函数模板

如果需要将同一算法应用在不同参数类型上，可以使用模板。

在开发中，模板的定义直接写在`.h`中。最终编译后的代码，不包含任何模板，只包含为程序生成的实际调用到的函数。

```c++
template <typename AnyType>
void swap( AnyType &a, AnyType &b )
{
    AnyType temp;
    temp = a;
    a = b;
    b = temp;
}
```

为特定类型提供具体化的模板定义：

```c++
struct job {
    char name[40];
    double salary;
    int floor;
};

// 正常函数
void swap( job &, job & );

// 模板函数
template <typename T>
void swap( T &, T & );

// 具体化模板函数
template<> void swap( job &, job & );
```

对于函数重载、函数模板、函数模板重载，C++编译器需要使用一个优先级策略，来决定最终为调用方，生成和使用哪一个函数定义：

- 第一步：创建候选函数列表，包括与被调用函数同名的函数以及模板函数
- 第二步：创建可行函数列表，这些函数的参数数目要与被调用方一致，参数类型的话，可以有隐式转换
- 第三步：确定最佳的可行函数，如果有，则使用它，无则报错

```c++
may( 'B' ); // 函数调用

// 候选函数列表
void may( int );                            # 1
float may( float, float = 3 );              # 2
void may( char );                           # 3
char *may( const char * );                  # 4
char may( const char & );                   # 5
template<typename T> void may( const T & ); # 6
template<typename T> void may( T * );       # 7
```

对上述代码，先判断可行函数列表：参数数目一致，且类型能够隐式转换成功。#4 与 #7 中`char`是无法自动转换为指针类型的，所以排除掉。

接下来确定最佳可行函数，从最佳到最差的顺序：

1. 完全匹配，常规函数 优于 模板
2. 提升转换，比如 `char` `short` 转换为 `int`
3. 标准转换，比如 `int` 转换为 `char`，`long`转换为`double`
4. 用户自定义转换，比如类声明中定义的转换

所以，#1(提升转换) 优于 #2(标准转换)。#3 #5 #6 是完全匹配的，都优于 #1 和 #2。#3 与 #5 优于 #6，因为 #6 是模板。

### decltype 类型推断

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

decltype(x) w;      // w is type double
decltype(rx) u = y; // u is type double &
decltype(pd) v;     // v is type double *
decltype( indeed(3) ) m; // m is type long
```

### 后置返回类型

```c++
auto ft( int x, float y ) -> double; // 函数返回 double 类型

template<typename T1, typename T2>
auto gt( T1 x, T2 y ) -> decltype(x + y)
{
    return x + y;
}
```

## 第9章 内存模型与名字空间

### 源文件分开单独编译

一般放在头文件中的内容：

- 函数原型
- 使用`#define`与`const`声明的符号常量
- 结构声明
- 类声明
- 模板定义
- 内联函数

### 变量的生存周期、作用域 和 链接性

C++ 中使用 4 中方案来存储数据:

- 自动：函数定义里的变量，代码块中的变量，随着代码块执行创建，代码块结束则销毁
- 静态：函数定义之外的全局变量，函数中使用`static`声明的，它们在程序的运行期都存在。C++中区分了 3 种静态类型。
- 线程：使用`thread_local`声明，其生命周期与所属线程一样长
- 动态：程序运行时，使用`new`动态申请，使用`delete`释放的变量。

作用域`scope`：描述了 名称 在文件的多大范围内可见，例如：函数A内的变量只在函数A内可以使用；函数定义之前声明的变量可在所有函数中使用。

链接性`linkage`：描述了 名称 在不同 翻译单元 之间的共享，链接性为 外部的 可以在文件间共享，链接性为 内部的 则只能在当前文件内的函数中使用。

### 静态持续变量

```c++
// a.cpp
int global          = 1000; // 静态变量，外部链接性，即其他文件也能访问
static int one_file = 50;   // 静态变量，内部链接性，即只能在本文件使用

void funct( int n )
{
    static int count = 0;   // 静态变量，无链接性，只在本函数内有效
}
```

单定义原则：变量只能有一次定义。

### volatile

在编译过程中，如果编译器发现程序在近几条语句中多次使用了某个变量，则编译器会进行优化：将这个值缓存到寄存器中，这样程序就不用多次访问内存取得该值。这种优化的假设前提是，两次取用内存之间，该内存处的值时不变的。但是如果这个变量所在的内存 如果是 某个硬件地址（比如串口），硬件会改变其值；或者 该变量所在的内存是 共享内存，有其他进程 或者 线程会修改 该内存处的值。那么这种编译器的优化，会导致该变量值不一致。当前程序应该使用内存处的值，而不是寄存器缓存的值。对变量声明为 `volatile` 就是为了避免这种优化，让对该变量的读取始终使用内存处的值。

### mutable 结构内可变变量

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

### const 对链接性的影响

默认情况下，全局变量的链接性都是外部的，但是使用`const`定义的全局变量，会将链接性修改为内部的。可以使用`extern`强制将链接性修改为外部的。因此有两种对全局常量的使用方式

第一种：默认内部链接性，每个`.cpp`文件都有一份相同的常量定义，而不是共享一份常量。

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

### 函数的链接性

函数默认都是外部链接性，但是可以使用`static`声明，将链接性改为内部的。

```c++
static int private_func( double x );
```

C++如何查找函数的定义呢？

假设在程序的某个文件中调用一个函数：如果该文件中，函数声明指出该函数是`static`的，则编译器只在本文件查找该函数定义，否则编译器将在所有程序文件中查找。如果找到两个定义，则报错重复定义。如果程序文件中没有找到，则继续在库中搜索。这意味着，如果定义了一个与库函数同名的函数，则编译器将使用程序员自定义的版本，而不是库函数。

### 语言链接性

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

### 存储方案 和 动态分配

```c++
float *p_fees = new float[20];
```

由`new`分配的80个字节将一直保留在内存内，直到使用`delete`删除。但是，当包含该声明的语句块结束时，`p_fees`指针将消失。如果希望另一个函数能够使用这80字节，则必须将该指针传递给该函数。如果该指针被声明为一个全局变量，并拥有外部链接性，则代码中任意地方都可以通过该指针来使用这块内存。

## 第10章 对象和类

### 类声明

```c++
// stock.h
class Stock
{
    private:
        // data member 声明
    public:
        // 方法声明
};
```

### 类的构造 和 析构函数

类构造函数专门用于，在创建对象时，将初始值赋给对象的数据成员。

```c++
// stock.cpp
Stock::Stock() // 默认构造函数定义
{
    company = "no name";
    shares = 0;
    share_val = 0.0;
}

Stock::Stock( const string &co, long n, double pr ) // 构造函数定义
{
    // ...
}

Stock::~Stock() // 析构函数，对象被销毁时调用
{
    cout << "Bye" << endl;
}

Stock food = Stock( "World Cabbage", 250, 1.25 );
```

### this 指针

```c++
const Stock &Stock::topval( const Stock &s ) const
{
    if( s.total_val > this->total_val )
        return s;
    else
        return *this;
}
```

### 作用域内枚举

```c++
enum class t_shirt { Small, Medium, Large, Xlarge };
t_shirt Floyd = t_shirt::Large;
```

## 第11章 使用类

### 运算符重载

运算符重载使得操作对象更美观，更优雅。

```c++
class Time
{
    public:
        Time operator+( const Time &t ) const; // 通过成员函数 重载运算符 +
};

// T1 = T2 + T3 转换为 T1 = T2.operator+( T3 );
Time Time::operator+( const Time &t ) const
{
    Time sum;
    sum.minutes = minutes + t.minutes;
    sum.hours = hours + t.hours + sum.minutes / 60;
    sum.minutes %= 60;
    return sum;
}
```

`+`运算符左侧的对象是调用方，右边的对象是作为参数被传递到`operator+`方法里的对象。

### 友元

通过在类内部声明 某函数 为本类的友元函数，则该函数可以使用类内部的私有数据。

```c++
class Time
{
    public:
        friend Time operator*( double m, const Time &t ) { return t * m; }
        friend std::ostream &operator<<( std::ostream &os, const Time &t );
};

std::ostream &operator<<( std::ostream &os, const Time &t )
{
    os << t.hours << " hours, " << t.minutes << " minutes"; // 能直接使用 t 的私有数据了
    return os;
}
```

### 非成员函数的运算符重载

```c++
class Time
{
    public:
        // T1 = T2 + T3; 转换为 T1 = operator+( T2, T3 );
        friend Time operator+( const Time &t1, const Time &t2 );
};

Time operator+( const Time &t1, const Time &t2 )
{
    Time sum;
    sum.minutes = t1.minutes + t2.minutes;
    sum.hours = t1.hours + t2.hours + sum.minutes / 60;
    sum.minutes %= 60;
    return sum;
}
```

### 类的自动装换 和 强制类型装换

```c++
class Stonewt
{
    private:
        enum{ Lbs_per_stn = 14 };
        int stone;
        double pds_left;
        double pounds;

    public:
        Stonewt( double lbs );
        operator int() const;
        operator double() const;
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
    return int ( pounds + 0.5 );
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

## 第12章 类和动态内存分配

C++自动为类提供以下成员函数：

- 默认构造函数
- 默认析构函数
- 复制构造函数，用于初始化过程中，原型为`Class_name(const Class_name &)`
- 赋值运算符，将一个对象赋值给另一个对象时，自动调用
- 地址运算符，默认返回this指针的地址
- 移动构造函数(C++11)
- 移动赋值运算符(C++11)

### 复制构造函数

复制构造函数的调用时机，一般来说，在涉及到按值传递的时候，都会调用：

```c++
// motto is StringBad object
StringBad ditto( motto );
StringBad metoo = motto;
StringBad also = StringBad(motto);
StringBad *pStringBad = new StringBad( motto );
```

默认的复制构造函数的作用是：逐个复制非静态成员的值到新对象，也称为浅拷贝。

浅拷贝带来的问题：

- 指针成员的问题，如果只是复制指针，那么两个对象的该指针成员将会指向同一块内存。

### StringBad 类实例

```c++
// StringBad.h
class StringBad
{
    private:
        char *str;
        int len;
        static int num_strings;

    public:
        StringBad( const char *s );       // 构造函数
        StringBad();                      // 默认构造函数
        StringBad( const StringBad &st ); // 复制构造函数
        ~StringBad();                     // 析构函数

        StringBad &operator=( const StringBad &st );
        StringBad &operator=( const char * );
        char &operator[]( int i );
        const char &operator[]( int i ) const;

        friend bool operator<( const StringBad &st, const StringBad &st2 );
        friend bool operator>( const StringBad &st, const StringBad &st2 );
        friend std::ostream &operator<<(std::ostream &os, const StringBad &st );
        friend std::istream &operator>>(std::istream &is, StringBad &st);

        static int HowMany(){ return num_strings; }
};

std::ostream &operator<<( std::ostream &os, const StringBad &st );
std::istream &operator>>(std::istream &is, StringBad &st);
bool operator<( const StringBad &st, const StringBad &st2 );
bool operator>( const StringBad &st, const StringBad &st2 );

// StringBad.cpp

using namespace std;

int StringBad::num_strings = 0;

StringBad::StringBad()
{
    len = 0;
    str = new char[1];
    str[0] = '\0';
    ++num_strings;
    cout << num_strings << " : " << str << " object created" << endl;
}

StringBad::StringBad( const char *s )
{
    len = strlen( s );
    str = new char[len + 1];
    strcpy( str, s );
    ++num_strings;

    cout << num_strings << " : " << str << " object created" << endl;
}

StringBad::StringBad( const StringBad &st ){
    ++num_strings;
    len = st.len;
    str = new char[len + 1];
    strcpy( str, st.str );
    cout << num_strings << " object copyed" << endl;
}

// assign StringBad to StringBad
StringBad &StringBad::operator=( const StringBad &st ){
    cout << "= operator run" << endl;
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

// read-only char access for const StringBad
const char& StringBad::operator[](int i) const {
    return str[i];
}

bool operator<( const StringBad &st1, const StringBad &st2 ) {
    return strcmp(st1.str, st2.str ) < 0 ;
}

bool operator>( const StringBad &st1, const StringBad &st2 ){
    return st2 < st1;
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

### 在构造函数中动态申请内存注意事项

- 多个构造函数只对应一个析构函数，所以使用`new`声明，与使用`new[]`申请的内存，在析构函数中必须使用对应的`delete`与`delete[]`，对于同一个变量，在不同的构造函数中，不允许即使用`new`声明，又使用`new[]`声明。

- 必须定义复制构造函数，通过深度复制将一个对象初始化为另一个对象

- 还需要重载`=`运算符，通过深度复制将一个对象复制给另一个对象

### 使用指向对象的指针

```c++
Class_name *p_class = new Class_name(value); // 调用构造函数 Class_name(Type_name value);
Class_name *ptr     = new Class_name;        // 调用默认构造函数

delete p_class; // 使用delete后，才调用 Class_name 的析构函数
```

## 第13章 类继承

```c++
// 公有继承
class A : public B { }

// 派生类的构造函数 需要使用 成员初始化列表来调用 基类构造函数
A::A( type a, type b ) : B( a, b ) { }
```

派生类对象可以使用基类对象的`public`方法。

基类的指针和引用可以直接指向或引用派生类对象，但是该指针和引用只能使用在 基类 中有声明的方法。

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