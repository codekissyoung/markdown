# 《C++语言导学》

这是 C++ 语言之父 `Stroustrup` 写的新书《A Tour of C++》的中文版。2015年出版的，值的一看。本文是笔记。

## 第1章 基础知识

本章介绍C++的符号系统、存储与计算模型 以及 如何将代码组织成程序。

ISO 的 C++标准定义了两种实体:

- 核心语言特性，比如内置类型以及循环等
- 标准库，比如容器(如 `vector` 和 `map`) 以及 `I/O`操作(如`<<`和 `getline ()` )。

每个 C++ 实现都提供标准库组件 . 它们其实也是非常普通的 C++ 代码 。 换句话说， C++标准库可以用 C++语言本身实现(仅在实现线程上下文切换这样的功能时才使用少量机器代 码)。 这就确保 C++ 在面对绝大多数要求较高的系统编程任务时既有丰富的表达力，同时也足够高效 。

C++是一种静态类型语言，意味着在使用任何实体(如对象 、 值、名称和表达式)时， 编译器都必须清楚该实体的类型。对象的类型决定了能在该对象上执行的操作 。每个名字和每个表达式都有自己的类型，类型决定了名字和表达式所能执行的操作。

### 函数

函数的实参传递的过程与拷贝初始化非常类似，编译器负责**检查实参的类型**，并且在必要的时候**执行隐式实参类型转换**。

返回值类型和实参类型属于函数类型的一部分。 对于类成员函数来说，类名字本身也是函数类型的一部分。

```C++
double get( const vector<double> &vec，int index ); // 函数类型 double( const vector<double>&, int )
char& String::operator[] (int index );              // 函数类型 char& String::(int)
```

函数组成了计算的基本词汇表， 正如类型(包括内置类型和用户自定义类型)组成了数据的基本词汇表 。C++标准算法 ( 如 `find`、 `sort` 和 `iota`) 是程序函数化的良好开端，接下来我们就能用这些表示 通用任务或者特殊任务的函数组合出更复杂的计算模块了。

**函数重载**:如果程序中存在名字相同但实参类型不同的函数，则编译器负责为每次调用选择匹配度最高的函数。如果存在两个可供选择的函数并且它们难分优劣，则编译器认为此次调用具有二义性并报错。

```c++
void print(int);        // 接受一个整型实参
void print(double);     // 接受一个浮点型实参
void print(string);     // 接受一个字符串类型的实参

print(42);              // 调用 print(int)
print(9.65);            // 调用 print(double)
print("O is for Oigi"); // 掉用 print(string)

void print(int,double);
void print(double,int);

prlnt(O,O);             // 错误:二义性调用
```

**声明**为程序引入一个新的名字，并指定该命名实体的类型:

- 类型 `type` 定义了一组可能的值以及一组 (对象上的) 操作。
- 对象 `object` 是存放某类型值的内存空间。
- 值 `value` 是一组二进制位，具体的含义由其类型决定。
- 变量 `variable` 是一个命名的对象。

在赋值运算和算术运算中. C++编译器会在**基本类型**之间进行各种有意义的类型转换， 以便它们能够自由地组合在一起，进行混合运算。称为**算术类型转换**，它的目的是确保表达式以它的运算对象中最高的精度进行求值计算。

两种初始化方式：

```c++
double d1 = 2.3;
double d2 {3.4};    // 推荐使用，更加通用，并且能确保不会发生窄化类型转换，比如double -> int
vector<int> vec {1,2,3,4,5,6};
```

### 作用域 与 生命周期

程序内作用域划分：

- **局部作用域**：声明在函数或者`lambda`内的变量称为局部变量。局部变量的作用域从声明它的地方开始，到声明语句所在的块的末尾为止。块`block`的边界用花括号`{ }`表示。函数参数的变量也属于局部变量 。

- **类作用域**：如果一个变量定义在`class`的内 部，同时位于任何函数、`lambda`和`enum class`的外部，则我们把这个变量称为成员变量或者类成员变量。成员变量的作用域从它的声明的`{`开始，到该声明结束为止。

- **命名空间作用域**：如果一个变量定义在`namespace`的内部，同时位于任何函数、`lambda`、`class`和`enum class`的外部，则我们把这个变量称为命名空间成员变量。 它的作用域从声明它的地方开始，到命名空间结束为止 。

- **全局作用域**：声明在所有结构之外的变量称为全局变量，我们说它位于全局作用域`global namespace`中。

程序中**对象** `object`的生存期:

- 我们必须先构建(初始化)对象，然后才能使用它。
- 局部对象在作用域的末尾被销毁。
- 对于成员对象来说，它的销毁点依赖于它所属对象的销毁点。
- 对于命名空间对象来说，它的销毁点在整个程序的末尾。
- 用`new`创建的对象一直存活到`delete`销毁了它为止。

### 数组、指针与引用

略过，太熟悉了。

### 常量

C++支持两种不变性概念:

- `const`：大概的意思是"我承诺不改变这个值"。主要用于说明接口，这样在把变量传入函数时就不必担心变量会在函数内被改变了。编译器负责确认并执行`const`的承诺。
- `constexpr`：大概的意思是"在编译时求值"。 主要用于说明常量，作用是允许把数据置于只读内存中(不太可能被破坏)以及提升性能。

```c++
const int dmv = 17;
int var = 17;

constexpr double max1 = 1.4 * square( dmv ); // 如果square(17)是常量表达式 正确
constexpr double max2 = 1.4 * square( var ); // 错误，var 是变量
const double     max3 = 1.4 * square( var ); // 正确，可在运行时求值

double sum( const vector<double> & );        // sum 内不会更改 vector 任何值
```

建议：

- 要想写出漂亮的程序，你不需要知道 C++ 的所有细节。
- 请关注编程技术，而非语言特性。
- 把有意义的一组操作"打包"成函数，然后给它起个好名字。
- 一个函数最好只处理一个明确的逻辑操作。
- 函数重载的适用情况是，几个函数的任务相同而处理的类型不同。
- 如果一个函数可能得在编译时求值，那么把它声明成`constexpr`
- 一条声明语句只声明一个名字。
- 定义名字时，让普通的和局部的名字短一些，特殊的和非局部的名字则可以长一点。
- 不要出现字母全是大写的名字。
- 当指明了类型名字时，建议在声明语句中使用`{}`形式的初始值列表。
- 当使用`auto`关键字时， 建议在声明语句中使用`=`进行初始化。
- 尽量避免使用未经初始化的变量，最好所有变量都经过初始化，所有自定义类型都包含默认初始化。如果你还不打算初始化一个变量，那就先别声明它。
- 建议使用`nullptr`，别再使用`0`和`NULL`。
- 代码中一目了然的事情就不要加注释。注释是用来解释编程意图的 。
- 尽量避免复杂的表达式。
- 尽量避免窄化类型转换。

## 第2章 用户自定义类型

在第一章提及都属于“内置类型”，它们更偏重于计算机底层编程。优点是能够直接有效地展现出传统计算机硬件的特性，但是并不能向程序员提供便于书写高级应用程序的高层特性。为此， C++语言在充分利用内置类型和操作的基础上，提供了 一套成熟的抽象机制。让程序员能够设计并实现他们自己的数据类型，这些类型具有恰如其分的表现形式和操作，程序员可以简单优雅地使用它们。称为**用户自定义类型**，比如类`class`、枚举`enum`、结构体`struct`。

### 结构

构建新类型的第一步通常是把所需的元素组织成一种数据结构。

`Vector`的第一个版本：

```c++
struct Vector{
    int sz;         // 元素的数量
    double *elem;   // 指向元素的指针
};
```

使用它:

```c++
// 初始化 Vector
void vector_init( Vector &v, int s ){
    v.elem = new double[s];
    v.sz = s;
}
// 读入数据 与 求和
double read_and_sum( int s ){
    Vector v;
    vector_init( v, s );
    for( int i = 0; i !=s; ++i )
        cin >> v.elem[i];
    double sum = 0;
    for( int i = 0; i != s; ++i )
        sum += v.elem[i];
    return sum;
}
```

这个版本的`Vector`与标准库`std::vector`还有很大的差距，尤其是`Vector`的使用者，还需要知道`Vector`的内部数据细节，才能使用它。

传递`struct`，访问它的成员：

```c++
void func( Vector v, Vector &rv, Vector *pv )
{
    int i1 = v.sz;      // 通过 拷贝赋值 访问
    int i2 = rv.sz;     // 通过 引用 访问
    int i3 = pv->sz;    // 通过 指针 访问
}
```

### 类

`struct`使用起来是数据与操作分离的。对于一个自定义类型来说，我们需要操作与数据结合的更加紧密：

- 自定义类型易于使用和修改
- 数据具有一致性
- 内部数据最好对用户是不可见的

最理想的做法是把类型的接口(所有代码都可使用的部分)与其实现(对外部不可访问的数据具有访问权限 )分离开来。这种机制称为**类**。

类含有一系列成员，可能是数据、函数 或者 类型。`public`定义了该类的接口，`private`则限定数据只能在类内部使用。

```c++
class Vector{
    public:
        Vector( int s ) : elem{ new double[s] }, sz{s} { } // 构建一个 Vector
        double &operator[]( int i ){ return elem[i]; }     // 通过下标访问元素
        int size(){ return sz; }
    private:
        double *elem;
        int sz;
};
```

使用:

```c++
double read_and_sum( int s )
{
    Vector v( s );
    for( int i = 0; i != v.size(); ++i )
        cin >> v[i];

    double sum = 0;
    for( int i = 0; i != size(); ++i )
        sum += v[i];

    return sum;
}
```

`class`与`struct`没有本质区别，唯一的不同是`struct`的成员默认是`public`的。

### 枚举

除了类之外，C++还提供了另一种形式简单的用户自定义类型，使得我们可以枚举一系列值。枚举类型常用于描述规模较小的整数值集合。通过使用有指代意义(且易于记忆)的枚举值名字，可以提高代码的可读性，降低出错的风险。

```c++
enum class Color{ red, blue, green };
enum class Trffic_light{ green, yellow, red };

Color col = Color::red;
Traffic_light light = Traffic_light::red;
```

默认情况下，`enum class`只定义了`=`、初始化和比较（`==`与`<`）操作。既然它也是一种用户自定义类型，那么我们也可以为它定义别的运算符。

```c++
// 前置递增运算符 ++
Traffic_light &operator++( Traffic_light &t )
{
    switch( t )
    {
        case Traffic_light::green:
            return t = Traffic_light::yello;
            break;
        case Traffic_light::yellow:
            return t = Traffic_light::red;
            break;
        case Traffic_light::red:
            return t = Traffic_light::green;
            break;
    }
}
Traffic_light next = ++light; // next 变成了 Traffic_light::green
```

建议：

- 把有关联的数据组织在一起(`struct`或者`class`)
- 在`class`中区分接口部分和实现部分
- 结构`struct`其实就是一个成员在默认情况下均为`public`的`class`
- 构造函数负责执行和简化类的初始化过程
- 用枚举类型来表示一组命名的常量，与普通`enum`相比，建议使用`enum class`
- 为了枚举类型安全易用，不妨为它定义一些操作

## 模块化