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

```C++
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

```C++
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

```C++
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

```C++
struct Vector{
    int sz;         // 元素的数量
    double *elem;   // 指向元素的指针
};
```

使用它:

```C++
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

```C++
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

```C++
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

```C++
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

```C++
enum class Color{ red, blue, green };
enum class Trffic_light{ green, yellow, red };

Color col = Color::red;
Traffic_light light = Traffic_light::red;
```

默认情况下，`enum class`只定义了`=`、初始化和比较（`==`与`<`）操作。既然它也是一种用户自定义类型，那么我们也可以为它定义别的运算符。

```C++
// 前置递增运算符 ++
Traffic_light &operator++( Traffic_light &t ){
    switch( t ){
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

## 第3章 模块化

### 声明与定义

一个 C++ 程序可能包含许多独立开发的部分，例如函数、用户自定义类型、类层次和模板等。因此构建 C++ 程序的关键就是清晰地定义这些组成部分之间的交互关系。第一步也是最重要的一步是把某个部分的接口和实现分离开来。

C++ 使用声明来描述接口，指定了使用某个函数或某种类型所需的所有内容。函数的定义位于"其他某处"。

声明：

```C++
// Vector.h
double sqrt(double);

class Vector{
    public:
        Vector( int s );
        double &operator[](int i);
        int size();
    private:
        double *elem;
        int sz;
};
```

定义：

```C++
// Vector.cpp
#include "Vector.h" // 为了帮助编译器确保一致性，.cpp 文件同样应该包含提供其接口的 .h 文件

Vector::Vector(int s) : elem{ new double[s] }, sz{s} {
}

double &Vector::operator[](int i){
    return elem[i];
}

int Vector::size(){
    return sz;
}
```

### 分离编译

C++ 支持一种名为分离编译的概念，用户代码只能看见所用类型和函数的声明，它们的定义则放置在分离的源文件里，并被分别编译。这种机制有助于将一个程序组织成一组半独立的代码片段。其优点是编译时间减到最少，并且强制要求程序中逻辑独立的部分分离开来(从而将发生错误的几率降到最低)。 库通常是一组分别编译的代码片段(如函数)的集合 。

```C++
#include "Vector.h"         // 获得 Vector 的接口
#include <cmath>            // 获得标准数学函数接口
```

### 命名空间

C++ 还提供了一种称为命名空间`namespace`的机制，一方面表达某些声明是属于一个整体的，另一方面表明它们的名字不会与其他命名空间中的名字冲突。

```C++
namespace My_code{
    // code ....
}

using namespace std;
```

### 错误处理

错误处理是一个略显繁杂的主题，它的内容和影响都远远超越了语言特性的层面，而应归结为程序设计技术和工具的范畴。

大多数 C++ 的成分都致力于设计并实现优雅而高效的抽象模型(例如用户自定义类型以及基于这些自定义类型的算法)。 这种模块化和抽象机制 (特别是库的使用)的一个重要影响就是运行时错误的捕获位置与错误处理的位置被分离开来。

以`Vector`举例,当我们试图访问某个越界的元素时，应该做什么呢?

- `Vector` 的作者并不知道使用者在面临这种情况时希望如何处理(通常情况下，`Vector`的作者甚至不知道 向量被用在何种程序场景中)。
- `Vector` 的使用者不能保证每次都检测到问题(如果他们能做到的话，越界访问也就不会发生了)。

因此**最佳的解决方案**是由`Vector`的实现者负责检测可能的越界访问并通知使用者，然后`Vector`的使用者可以采取适当的应对措施。这即是C++异常处理机制。

类的设计者检测并抛出异常:

```C++
double &Vector::operator[]( int i )
{
    if( i < 0 || size() <= i)
        throw out_of_range{"Vector::operator[]"};
    return elem[i];
}
```

类的使用者捕获并处理异常:

```C++
try{
    v.[v.size()] = 7;
}catch( out_of_range ){
    // fix out_of_range here!
}
```

声明一个永远不会抛出异常的函数:

```C++
void user( int sz ) noexcept {
    // code ...
}
```

一旦真的发生了错误，函数`user()`还是会抛出异常，此时标准库函数`terminate()`立即终止当前程序的执行 。

### 不变式

在上面的定义中，`operator[]()` 作用于`Vector`的对象,并且只在`Vector`的成员有"合理"的值时才有意义。特别是，我们说过"elem指向一个含有sz个 double型元素的数组"，但这只是注释中的说明而已。 对于类来说，这样一条假定某事为真的声明称为**不变式**。建立类的不变式是构造函数的任务,(从而成员函数可以依赖于该不变式)，它的另一个作用是确保当成员函数退出时不变式仍然成立。

上述的`Vcetor`的构造函数明显欠缺考虑，对于`Vector(-27)`这样的错误调用，破坏了不变式。修正如下:

```C++
Vector::Vector( int s )
{
    if( s < 0 )
        throw length_error{};
    elem = new double[s];
    sz = s;
}
```

不变式的概念是设计类的关键，而前置条件也在设计函数的过程中起到类似的作用。不变式能够:

- 帮助我们准确地理解想要什么
- 强制我们具体而明确地描述设计，而这有助于确保代码正确(在调试和测试之后 )。

不变式的概念是C++中由构造函数和析构函数支撑的资源管理概念的基础。

### 静态断言

程序异常负责报告运行时发生的错误。 如果我们能在编译时发现错误,显然效果更好。通过断言，我们也能对其他一些编译时可知的属性做一些简单检查，并以编译器错误消息的形式报告所发现的问题。

```c++
static_assert(4<=sizeof(int), "integers are too small"); // 检查整数肉尺寸
```

`static_assert(A,S)`的作用是当`A`不为`true`时把`s`作为一条编译器错误信息输出 。最重要的用途是为泛型编程中作为形参的类型设置断言。

对于运行时检查的断言，使用异常。

建议：

- 注意把声明(用作接口) 和定义(用作实现)区别开来
- 头文件的作用是描述接口和强调逻辑结构
- 如果源文件实现了头文件当中的函数，则应该把头文件`#include`至源文件中
- 不要在头文件中定义非内联函数
- 不要在头文件中使用`using`指令
- 当无法完成既定的任务时，记得抛出一个异常
- 在设计阶段就想好错误处理的策略
- 用专门设计的用户自定义类型作为异常类型,而非内置类型
- 如果你的函数不抛出异常，那么把它声明成`noexcept`
- 让构造函数建立不变式，不满足就抛出异常
- 围绕不变式设计你的错误处理策略
- 能在编译时检查的问题尽量在编译时检查，使用`static_assert`

## 第4章 类

### 具体类

具体类的基本思想是它们的行为"就像内置类型一样"。

- 一个复数类型和一个无穷精度整数与内置的`int`非常相像，当然它们有自己的语义和操作集合
- `vector` 和 `string` 也很像内置的数组，只不过在可操作性上更胜一筹

具体类型的典型定义特征是，它的成员变量是其定义的一部分。比如`vector`的成员变量有`sz`与`elem`。这种成员变量出现在具体类的每一个对象中。

具体类允许:

- 把具体类型的对象置于栈、静态分配的内存或者其他对象中
- 直接引用对象
- 创建对象后立即进行完整的初始化，使用构造函数
- 拷贝对象

具体类型可以将其成员变量的主要部分放置在自由存储(堆)中 ，然后通过存储在类对象内部的成员访问它们。`vector`和`string`的机理正是如此，我们可以把它们看成是带有精致接口的资源管理器。

一个具体类型`complex`:

```c++
class complex{
private:
    double re, im;
public:
    complex(double r, double i) : re{r}, im{i} {}
    complex(double r) : re{r}, im{0} {}
    complex() : re{0}, im{0} {}

    double real() const { return re; }
    void real( double d ) { re = d; }
    complex &operator+=( complex z ){
        re += z.re;
        im += z.im;
        return *this;
    }
};
```

无需实参就可以调用的构造函数称为默认构造函数,`complex()`是`complex`类的默认构造函数。通过定义默认构造函数，可以有效防止该类型的对象未初始化。

编译器自动地把计算`complex`值的**重载运算符**的运算转换成对应的函数调用，例如`c!=b`意味着`operator!=(c,b)`， 而`1/a` 意味着`operator/(complex{1},a)`。

**容器**：是指一个包含若干元素的对象，因为`Vector`的对象都是容器，所以我们称`Vector`是一种容器类型。

上述的`Vector`存在了一个缺陷，它使用 `new`分配了元素，但是从来没有释放这些元素。因此,我们迫切需要一种机制以确保构造函数分配的内存一定会被销毁.这种机制就叫做析构函数。析构函数使用`delete`运算符释放该空间以达到清理资掘的目的。这一切都无需`Vector`的使用者干预，他们只需要像对待普通的内置类型变量那样创建和使用`Vector`对象就可以了。

```c++
class Vector{
    public:
        ~Vector(){ delete[] elem; }  // 析构函数 : 释放资源
};
```

至此，`Vector` 与 `int` 和 `char` 等内置类型遵循同样的命名、作用域、分配空间、生命周期等规则。

构造函数负责为元素分配空间并正确地初始化`Vector`成员，析构函数则负责释放空间。这就是所谓的数据句柄模型`handle-to-data model`，常用来管理在对象生命周期中大小会发生变化的数据。 在构造函数中获取资源，然后在析构函数中释放它们，这种技术称为资源获取即初始化`Resource Acquisition Is Initialization , RAIT`，它使得我们避免使用"裸new操作";换句话说，该技术可以防止在普通代码中分配内存，而是将分配操作隐藏在行为良好的抽象的实现内部。同样，也应该避免"裸 delete 操作"。避免裸 new 和裸 delete 可以使我们的代码远离各种潜在风险，避免资源泄漏。

两种较好的将元素存入容器中的途径：

- 初始值列表构造函数`initializer-list constructor`: 使用元素列表进行初始化
- `push_back()`: 在序列的末尾添加一个新元素

```c++
class Vector{
    public:
        Vector( std::initializer_list<double> );
        void push_back(double);  // 可用于添加任意数量的元素
};

Vector read( istream &is )
{
    Vector v;
    for( double d; is >> d; )
        v.push_back( d );
    return v;
}
```

用于定义初始值列表构造函数的`std::initializer_list`是一种标准库类型，编译器可以辨识它:当我们使用列表时，如`{1,2,3,4}`，编译器会创建一个 `initializer_list`类型的对象并将其提供给程序。

```c++
Vector::Vector( std::initializer_list<double> lst ) : elem{ new double[lst.size()]}, sz{ static_cast<int>(lst.size()) }
{
    copy( lst.begin(), lst.end(), elem ); // 从 lst 复制内容到 e1em 中
}

Vector v1 ={1,2,3,4,5}; // v1 包含 5 个元素
```

### 抽象类

### 类层次结构中的类

// P48