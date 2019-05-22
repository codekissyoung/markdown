# 《C++语言导学》

这是 C++ 语言之父 `Stroustrup` 写的新书《A Tour of C++》的中文版。2015年出版的，值的一看。本文是笔记。

## 第1章 基础知识

ISO 的 C++标准定义了两种实体:

- 核心语言特性，比如内置类型以及循环等
- 标准库，比如容器(如 `vector` 和 `map`) 以及 `I/O`操作(如`<<`和 `getline ()` )。

每个C++实现都提供标准库组件，C++标准库用C++语言本身实现(仅在实现线程上下文切换这样的功能时才使用少量机器代码)。

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
Vector::Vector( std::initializer_list<double> lst )
    : elem{ new double[lst.size()]}, sz{ static_cast<int>(lst.size()) }
{
    copy( lst.begin(), lst.end(), elem ); // 从 lst 复制内容到 e1em 中
}

Vector v1 ={1,2,3,4,5}; // v1 包含 5 个元素
```

### 抽象类

**抽象类型**`abstract type`将使用者与类的实现细节完全隔离开来。为此，我们分离接口与实现，并且放弃了纯局部变量（因为我们对抽象类型的实现一无所知），必须从堆内存为对象分配空间，然后通过引用或指针的方式使用。

```c++
class Container{
    public:
        virtual double& operator[](int) = 0;    // 纯虚函数
        virtual int size() const = 0;           // 常量成员函数
        virtual ~Container(){};                 // 析构函数
};
```

上述类，纯粹是个接口。`virtual`表明函数可能在随后的派生类中被重新定义，称为**虚函数**。`Container`类的派生类负责为这个接口提供具体实现。`= 0`标明是**纯虚函数**，意味着派生类必须重新定义这个函数。含有**纯虚函数**的类称为**抽象类**`abstract class`。

```c++
void use( Container &c )
{
    const int sz = c.size();

    for( int i = 0; i != sz; ++i )
        cout << c[i] << '\n';
}
```

上述代码，`use`是在完全不知道`Container`的实现细节（不知道是哪个派生类实现了它们）的情况下使用`Container`提供的`size()`与`[]`接口的。一个常用来为其他类型提供接口的类，我们把它称为**多态类型**。

在`Container`中没有构造函数，毕竟它不需要初始化数据。另一方面，`Container`含有一个析构函数，而且该析构函数是`virtual`的，这是因为抽象类需要通过引用或指针来操纵，而当我们试图通过一个指针销毁`Container`时，我们并不清楚它的实现部分到底拥有哪些资源。

构造派生类来实现抽象类，注意派生类里面使用了具体类`Vector`:

```c++
class Vector_container : public Container
{
private:
    Vector v;
public:
    Vector_container(int s) : v(s){}  // 含有 s 个元素的 Vector
    Vector_container( std::initializer_list<double> lst ) : v{ lst } {}
    ~Vector_container(){}

    double &operator[](int i){ return v[i]; }
    int size() const { return v.size(); }
};

class List_container : public Container{
    // code ...
};
```

`use( Constainer &)`并不清楚它的实参是`Vector_container`还是`List_container`，它可以使用任何`Container`派生类的对象，它只需要知道`Container`类定义好的接口就可以了。所以，无论`List_container`的实现发生变化，或者替换成了别的派生类，`use(Container &)`这句代码都不需要重新编译。

```c++
Vector_container vec { 1,2,3,4,5 };
List_container list { 6, 7, 8, 9 };

use( vec );     // 输出 1 2 3 4 5
use( list );    // 输出 6 7 8 9
```

### 虚函数

`use(vec)`里使用`Vector_container::operator[]`,而`use(list)`里则使用`List_container`。这是如何做到的呢？

要想达到这种效果，`Container`的派生对象就必须包含一些有助于它在运行时选择正确函数的信息。常见的做法是编译器将虚函数的名字转换成函数指针表中对应的索引值，这张表就是所谓的**虚函数表**`vtbl`。每个含有虚函数的类都有它自己的`vtbl`用于辨识虚函数。

![2019-05-19 11-45-02 的屏幕截图.png](https://img.codekissyoung.com/2019/05/19/d7416228a1fa1e531a7c0731e61af0b6.png)

调用函数的实现只需要知道`Container`中`vtbl`指针的位置以及每个虚函数对应的索引就可以了。这种虚调用机制的效率非常接近普通函数调用机制，而它的空间开销包括两部分:

- 如果类包含虚函数，则该类的每个对象需要一个额外的指针
- 另外每个这样的类需要一个`vtbl`

### 类层次结构中的类

所谓**类层次结构**是指通过派生(如`: public`)创建的一组在框架中有序排列的类。

![2019-05-19 11-51-48 的屏幕截图.png](https://img.codekissyoung.com/2019/05/19/498a11c679de0b34e80bb8699a3319d1.png)

`Shape`类:

```c++
class Shape{
public:
    virtual Point center() const = 0;
    virtual void move(Point to) = 0;
    virtual void draw() const = 0;
    virtual void rotate(int angle) = 0;
    // ...
    virtual ~Shape() {}
};
```

`Circle`类：

```c++
class Circle : public Shape{
public:
    Circle(Point p, int rr);
    Point center() const { return x; }
    void move(Point to){ x = to; }
private:
    Point x;    // 圆心
    int r;      // 半径
};
```

`Smiley`笑脸类：

```c++
class Smiley : public Circle{
public:
    Smiley(Point p, int r) : Circle{p,r}, mouth(nullptr){}
    ~Smiley(){
        delete mouth;
        for(auto p : eyes)
            delete p;
    }
    void move(Point to) override;
    void draw() const override;
    void add_eye(Shape *s){
        eyes.push_back(s);
    }
    void set_mouth(Shape *s);
private:
    vector<Shape> eyes;
    Shape* mouth;
};

void Smiley::draw(){
    Circle::draw();     // 复用基类的 draw 代码
    for( auto p : eyes )
        p -> draw();
    mouth -> draw();
}
```

层次结构的益处：

- **结构继承**: 派生类对象可以用在任何需要基类对象的地方。也就是说，基类看起来像是派生类的接口一样。`Container`和`Shape`就是很好的例子，这样的类通常是抽象类。
- **实现继承**: 基类负责提供可以简化派生类实现的函数或数据。`Smiley`使用`Circle`的构造函数和`Circle::draw()`就是例子,这样的基类通常含有数据成员和构造函数 。

使用:

```c++
enum class Kind{ circle, triangle, smiley };
Shape *read_shape( istream& is ){
    switch( k )
    {
        case Kind::circle:
            return new Circle(p, r);
        case Kind::triangle:
            return new Triangle{p1,p2,p3}
        case Kind::smiley:
            // read p, r, e1, e2 from istream
            Smiley *ps = new Smiley{p,r};
            ps -> add_eyes(e1);
            ps -> add_eyes(e2);
            ps -> set_mouth(m);
            return ps;
    }
}
Shape *ps {read_shape(cin)};
if( Smiley *p = dynamic_cast<Smiley*>(ps)){
    // 使用 dynamic_cast 运算符询问这个 Shape 是一种 Smiley 吗? "
}
```

如果`dynamic_cast`的参数(此处是`ps`)所指对象的类型与期望的类型(此处是`Smiley`)或者期望类型的派生类不符,则`dynamic_cast`返回的结果是`nullptr`。

### 资源泄漏

上述代码存在**资源泄漏**的问题:

- 使用者可能忘记用`delete`释放`read_shape()`返回的指针
- `Shape`指针容器的拥有者可能无法用`delete`释放指针所指的对象

函数返回一个指向堆内存的**裸指针**是非常危险的,推荐使用`unique_ptr`代替。

```c++
unique_ptr<Shape> read_shape( istream &is ){
    switch(k){
        case Kind::circle:
            return unique_ptr<Shape> { new Circle{p,r} };
    }
}
```

将`Shape`对象的指针给到`unique_ptr`，函数返回的是`unique_ptr`。客户端代码用的也是`unique_ptr`对象，当`unique_ptr`离开作用域时，它会自动释放掉`Shape`指针指向的对象。

### 拷贝与移动

对象之间拷贝的默认含义是逐成员地复制。

```c++
void bad_copy( Vector v1 ){
    Vector v2 = v1;
    v1[0] = 2;      // v2[0] 现在也是 2 了
    v2[1] = 3;      // v1[1] 现在也是 3 了
}
```

上述代码执行后:

![2019-05-20 00-16-38 的屏幕截图.png](https://img.codekissyoung.com/2019/05/20/8637cb844bba31218fdda4e53c2e798e.png)

上述代码明显不符合我们对`Vector`拷贝操作的期望。我们需要通过自定义**拷贝构造函数**与**拷贝赋值运算符**来自定义对象的拷贝操作：

```c++
class Vector{
private:
    double *elem;
    int sz;
public:
    // ...
    Vector( const Vector &s );            // 拷贝构造函数
    Vector &operator=( const Vector &a ); // 拷贝赋值运算符
};

Vector::Vector(const Vector& a ) : elem{ new double{a.sz} }, sz{ a.sz }
{
    for( int i = 0; i != sz; ++ i ) // 一个一个复制元素到新容器
        elem[i] = a.elem[i];
}

Vector &Vector::operator=( const Vector &a )
{
    double *p = new double[a.sz];
    for( int i = 0; i != a.sz; ++i )
        p[i] = al.elem[i];
    double[] elem;
    elem = p;
    sz = a.sz;
    return *this;
}
```

![拷贝构造函数 拷贝赋值运算符](https://img.codekissyoung.com/2019/05/20/f7fe9139fd0e6851bf687851e0be536e.png)

### 移动容器

对于大容量的容器来说，拷贝过程有可能性能内存耗费巨大。

```c++
Vector operator+( const Vector& a, const Vector &b )
{
    Vector res( a.size() );
    for( int i  = 0; i != a.size(); ++i )
        res[i] = a[i] + b[i];
    return res;
}
```

上述代码中，`return res;`将函数结果返回给调用者，如果`size()`非常大，这样拷贝的性能会很差，比如执行`Vector r = x + y + z;`时，就拷贝了两次内存。对于这样情况，我们希望不拷贝，而是移动`move`这块内存，供调用者使用。移动构造函数允许对象从一个作用域简单便捷地移动到另一个作用域 。

```c++
class Vector{
    Vector( Vector &&a );            // 移动构造函数
    Vector &operator=( Vector &&a ); // 移动赋值运算符
}

Vector::Vector( Vector && a )
    : elem{ a.elem },   // 从 a 中 夺取元素
      sz{ a.sz }{
    a.elem = nullptr;   // 现在 a 中已经没有元素了
    a.sze = 0;
}
```

基于上述定义，编译器将选择**移动构造函数**来执行从函数中移出返回值的任务。这意味着`r=x+y+z`不需要再拷贝`Vector`，只是移动它就足够了。

`&&`的意思是"右值引用"，我们可以给该引用绑定一个右值。右值大致上就是我们无法为其赋值的值，比如函数调用返回的一个整数就是右值。 进一步，右值引用的含义就是引用了一个别人无法赋值的内容，所以我们可以安全地"窃取"它的值。`Vector`的`operator+()`运算符的局部变量`res`就是一个例子。

当右值引用被用作初始值或者赋值操作的右侧运算对象时，程序将使用移动操作。

`C++11`提供了`std::move`函数来将`左值`转换为`右值`,`move`不会真的移动什么，而是负责返回我们能移动的函数实参的`右值引用`。从而让我们的客户端的赋值调用能够使用`移动构造函数`或者`移动赋值运算符`，而不是`拷贝构造函数`或`拷贝赋值运算符`,从而提高性能。

```c++
Vector f(){
    Vector x(1000);
    Vector y(1000);
    Vector z(1000);

    z = x;              // 使用 拷贝赋值运算符, 性能低
    Y = std::move(x);   // 使用 移动赋值运算符，性能高，x 使用后，内容就变为空了
    return z;           // 由于 Vector 有提供移动赋值运算符，所以这里还是使用它
}
```

`x`使用后，内容就变为空了:

![2019-05-20 00-55-33 的屏幕截图.png](https://img.codekissyoung.com/2019/05/20/edaa5922688c732d2eae26f78de66753.png)

### 构建一个类的基本操作

如果类的析构函数执行了某些特定的任务，比如释放堆内存或者释放锁，则该类也应该实现所有的构造函数:

```c++
class X{
public:
    X( Sometype );              // 普通的构造函数：创建一个对象
    X();                        // 默认构造函数
    X( const X & );             // 拷贝构造函数
    X( X && );                  // 移动构造函数
    X &operator=( const X & );  // 拷贝赋值运算符: 清空目标对象并拷贝
    X &operator=( X && );       // 移动赋值运算符: 清空目标对象并移动
    ~X();                       // 析构函数: 清空资源
};
```

在下面 5 种情况下，对象会被移动或拷贝 :

- 被赋值给其他对象
- 作为对象初始值
- 作为函数的实参
- 作为函数的返回值
- 作为异常

以上所述构造函数，除`普通构造函数`外，都有默认实现，如果希望显示地使用编译器提供的默认实现，可以使用`= default`标记。

只使用显式"类型转换"，使用`explicit`声明:

```c++
class Vector{
public:
    explicit Vector( int s ); // 禁止 int 到 Vector 的隐式类型转换
};

Vector v1(7);   // OK : v1 含 有 7 个元 素
Vector v2 = 7;  // 错误: 禁止 ìnt 到 Vector 的 隐式类型转换
```

### 资源管理

```c++
std::vector<thread> my_threads;
Vector inlt(int n)
{
    thread t{ heartbeat };          // 同时运行 heartbeat ( 在 它 自 己 的 线程上 )
    my_threads.push_back(move(t));  // 把 t 移动到 my_threads

    // ... 初始化其他部分

    Vector vec(n);
    for(int i=O; i < vec.size(); ++i )
        vec[i] = 777;

    return vec;                     // 把 vec 移动到 init() 之外
}

auto v = init( 10000 );             // 启动 heartbeat, 初始化 v
```

在很多情况下，用`Vector`和`thread`这样的资源句柄比用指针效果要好。事实上，以`unique_ptr`为代表的"智能指针"本身就是资源句柄。

我们使用标准库`vector`存放`thread`，我们替换掉程序中的`new` 和`delete`一样，将指针转化为资源句柄。将得到更简单也更易维护的代码，而且没什么额外的开销。特别是我们能实现**强资源安全**，换句话说，对于一般概念上的资源，这种方法都可以消除资源泄漏的风险。比如存放内存的`vector`、存放系统线程的`thread` 和 存放文件句柄的`fstream`。

资源是指任何具有`获取→使用→(显式或隐式)释放`模式的东西，比如`内存`、`锁` 、`套接字`、 `文件句柄`和`线程句柄`等。一个好的资源管理系统应该能够处理全部资惊类型。

PS: 让所有资源都在某个作用域内有所归属，并且在作用域结束的地方默认地释放资源。在`C++`中，这被称为`RAlI( Resource Acquisition ls Initialization` **资源获取即初始化**， 它与错误处理一道组成了异常机制。 我们使用**移动构造函数**或者"智能指针"把资源从一个作用域移动到另一个作用域，使用"共享指针"分享资源的所有权。

### 删除类的默认操作

对于处在层次结构中的类来说，使用默认的拷贝或移动操作常常意味着风险 : 因为只给出一个基类的指针 . 我们无法了解派生类有什么样的成员，当然也就不知道该如何操作它们。因此，最好的做法是删除默认的拷贝和移动操作。

```c++
class Shape{
public:
    Shape( const Shape& ) = delete;             // 没有拷贝操作
    Shape &operator=( const Shape& ) = delete;  // 没有拷贝操作

    Shape( Shape && ) = delete;                 // 没有移动操作
    Shape &operator=( Shape && ) = delete;      // 没有移动操作
    ~Shape();
}
```

建议：

- 具体类是最简单的类。与复杂类或者普通数据结构相比，请优先选择使用具体类。使用具体类表示简单的概念以及性能要求较高的组件
- 定义一个构造函数来处理对象的初始化操作
- 只有当函数确实需要直接访问类的成员变量部分时，才把它作为成员函数
- 定义运算符的目的主要是模仿和借鉴它的经典用法
- 把对称的运算符( `<` `>` `>=` `<=`)定义成非成员函数
- 如果成员函数不会改变对象的状态，则应该把它声明成`const`的
- 如果类的构造函数获取了资源.那么需要使用析构函数释放这些资源
- 避免 `裸new` 和 `裸delete` 操作
- 使用资源句柄和`RAII`管理资源
- 如果类是一个容器，给它一个初始值列表构造函数
- 如果需要把接口和实现完全分离开来，则使用抽象类作为接口
- 使用指针和引用访问多态对象
- 抽象类通常元需构造函数,含有虚函数的类应该同时包含一个虚的析构函数
- 使用类的层次结构表示具有继承层次结构的一组概念
- 在规模较大的类层次结构中使用`override`显式地指明函数覆盖
- 当设计类的层次结构时，注意区分实现继承和接口继承
- 当类层次结构漫游不可避免时记得使用`dynamic_cast`
- 如果想在无法转换到目标类时报错，则令`dynamic_cast`作用于引用类型
- 如果认为即使无法转换到目标类也可以接受，则令`dynamic_cast`作用于指针类型
- 为了 防止忘掉用`delete`销毁用`new`创建的对象，建议使用`unique_ptr`或者`shared_ptr`
- 如果默认的拷贝操作不适合当前类，记得重新定义一个或者干脆禁止使用它
- 用传值的方式返回容器，**移动**而非拷贝容器以提高效率
- 函数参数中，对于容量较大的操作对象，使用`const`引用参数类型
- 如果类含有析构函数，则该类很可能需要自定义或者删除移动和拷贝操作，尽量让对象的构造、拷贝、移动和析构操作在掌控之中
- 设计构造函数 、 赋值运算符和析构函数时应该全盘考虑，使之成为一体
- 如果默认的构造函数、赋值运算符和析构函数符合要求，则让编译器负责生成它们，用户没必要再定义一遍
- 默认情况下，把接受单参数的构造函数声明成`explicit`的
- 如果类含有指针或引用类型的成员，则它需要一个`析构函数`以及非默认的拷贝操作
- 如果一个类被用作资源句柄，则需要为它提供构造函数、析构函数和非默认的拷贝操作

## 第5章 模板

### 参数化类型

模板是一种编译时的机制，因此与"手工编码"相比，并不会产生任何额外的运行时开销。对于我们之前使用的`double`类型的向量，只要将其改为`template`并且用一个形参替换掉特定类型`double`，就能泛化为任意类型的向量。

模板提供了以下功能:

- 把类型（以及数值和模板）作为实参传递而不损失任何信息的能力。这为内联提供了很多便利，而现有的实现可以很好地利用这一点
- 延迟的类型检查(在模板实例化时执行)。这意味着程序可以把多个上下文的有用信息捏合在一起。
- 把常量值作为实参传递的能力，也就是在编译时计算的能力。

```c++
template<typename T>
class Vector{
private:
    T *elem;        // 指向含有 sz 个 T 类型元素的数组
    int sz;
public:
    explicit Vector( int s );
    ~Vector() { delete[] elem; }

    T &operator[]( int i );
    const T &operator[]( int i ) const;
};

template<typename T>
Vector<T>::Vector( int s )
{
    elem = new T[s];
    sz = s;
}

template<typename T>
const T &Vector<T>::operator[]( int i ) const
{
    return elem[i];
}

Vector<char> vc(200);      // 含有 200 个字符的向量
Vector<string> vs(17);     // 含有 17 个字符串的向量
Vector<list<int>> vli(45); // 含有 45 个 整 数 列 表的向量
```

使`Vector`支持循环:

```c++
// 普通 for 循环
for( int i = 0; i != vs.size(); ++i )
    cout << v[i] << endl;

// for : 循环 需要为之重载适当的 begin() 与 end() 函数
template<typename T>
T *begin( Vector<T> &x )
{
    return x.size() ? &x[0] : nullptr;      // 指向首元素 或 nullptr
}

template<typename T>
T *end( Vector<T> &x )
{
    return begin(x) + x.size();             // 指向尾后元素
}

// 所以我们可以如下使用 for : 循环
for( auto &x : vs )
    cout << s << "\n";
```

除了类型参数外，模板也可以接受普通的值参数,但只有常量表达式能用于模板的值参数:

```c++
template<typename T, int N>
struct Buffer{
    using value_type = T;
    constexpr int size() { return N; }
    T[N];
};

Buffer<char,1024> glob; // 全局的字符缓冲区(静态分配)

void fct(){
    Buffer<int,10> buf; // 局部的整数缓冲区 (在栈上)
}
```

### 函数模板

模板很重要的用途是参数化标准库中的类型和算法。

```c++
// 这里的 sum() 可以看作是标准库 accumulate() 的简化版本
template<typename Container, typename Value>
Value sum( const Container &c, Value v ){
    for( auto x : c )
        v += x;
    return v;
}
```

任意`Container`只要支持`range for`所需的`begin()`和`end()`，我们就能调用`sum()`，唯一要求是：容器内元素必须能被加到实参`Value`上。显然标准库`vector`、`list`和`map`都满足条件。我们认为`sum()`的泛化能力包含两个维度:存储元素的数据结构(容器)以及容器中元素的类型。

**规范**`regular`的类型: 如果某种类型的特点和使用方式与`int`或`vector`非常像，我们就说这种类型是规范的。规范类型的对象应该:

- 能以默认的方式构造
- 能以构造函数或赋值运算符的方式拷贝,当然要确保拷贝之后源对象和目标对象相互独立且等价
- 能用`==`和`!=`进行比较
- 即使用在复杂的程序结构中也不会出错

`string`是一种典型的规范类型，并且它和`int`一样是有序的`ordered`，这意味着两个字符串可以用 `<` `<=` `>` `>=` 等运算符进行合适的语义比较。

### 函数对象

**函数对象**`functor`: 可以像调用函数一样使用对象,`operator()`的函数实现了这一调用方式。

**谓词**`predicate`: 是调用时返回`true`或`false`的对象。

函数对象常用作谓词，精妙之处在于它们附带着准备与之进行比较的值，我们无需为每个值(或者每种类型)单独编写函数，更不必把值保存在让人厌倦的全局变量中。可携带数据和高效这两个特性使得我们经常使用函数对象作为算法的参数。

```c++
template<typename T>
class Less_than{
const T val;
public:
    Less_than( const T &v ) : val(v) {}
    bool operator()(const T &x) const { return x < val; }
}

template<typename C, typename P>
int count( const C &c, P pred )  // 统计容器C中 符合 pred 条件的元素个数
{
    int cnt = 0;
    for( const auto &x : c )
        if( pred(x) )
            ++cnt;
    return cnt;
}

Less_than<int> lti {42};
Less_than<string> lts {"codekissyoung"};
Vector<int> vec { 12, 33, 54, 56, 78 };
Vector<string> lst { "hello", "nice", "to", "meet", "you" };

cout << "number of values less than 42 : " << count( vec, lti ) << endl;
cout << "number of values less than codekissyoung : " << count( lst, lts ) << endl;
```

### lambda 表达式

上述`Less_than`的定义与使用是分离的，明明是简单的操作，写起来却有些罗嗦。`lambda`表达式能够现场生成一个**函数对象**,能够将上述代码变得更简单便捷。

```c++
cout << "number of values less than 42 : "
     << count( vec, []( int a ){ return a < 42; } ) << endl;

cout << "number of values less than codekissyoung : "
     << count( lst, []( const string &s ){ return s < string("codekissyoung");} ) << endl;
```

表达式`[]( int a ){ return a < 42; }`就是`lambda`。

在来看一个例子，`for_all`用于将某个操作应用于容器的每个元素:

```c++
template<typename C, typename Oper>
void for_all( C &c, Oper op )
{
    for( auto &x : c )
        op( *x );
}

vector<unique_ptr<Shape>> v;
while( cin )
    v.push_back( read_shape(cin) );
for_all( v, []( Shape &s ){ s.draw(); } );
for_all( v, []( Shaep &s ){ s.rotate(45); } );
```

### 可变参数模板

定义模板时可以令其接受任意数量、任意类型的实参，这样的模板称为**可变参数模板**。

```c++
void func(){ }; // do nothing
template<typename T, typename ... Tail>
void func( T head, Tail ... tail )
{
    g( head );      // 对 head 进行操作
    func( tail ... );  // 再次处理 tail
}

template<typename T>
void g( T x ){
    cout << x << " ";
}

func( 1, 2, 3, "hello" ); // 输出 1 2 3 hello
```

### 别名

有时候,我们应该为类型或模板引人一个同义词,比如标准库中的`using size_t = unsigned int;`。`size_t`的实际类型依赖于具体实现.在另外一个实现中`size_t`可能变成`unsigned long`, 而使用别名`size_t`，程序员就能写出易于移植的代码。

```c++
template<typename T>
class Vector{
public:
    using value_type = T;
};
```

事实上 ，每个标准库容器都提供了`value_type`作为其值类型的名字，这样我们编写的代码就能在任何一个服从这种规范的容器上工作了。

绑定某些或全部模板实参， 我们就能使用别名机制定义新的模板:

```c++
template<typename Key, typename Value>
class Map{ //... }

template<typename Value>
using String_map = Map<string,Value>;

String_map<int> m;    // m 实际是一个 Map<string,int>
```

建议:

- 用模板来表达那些些可以作用于多种数据类型的算法
- 用模板实现容器
- 用模板提升代码的抽象水平
- 定义模板时，最好先设计和调试出 一个非模板版本，然后再通过添加参数进行泛化
- 模板是类型安全的，但是对类型的检查很晚才开始
- 模板可以无损地传递参数类型
- 用函数模板推断类模板参数类型
- 把函数对象作为算法的参数
- 如果只在某处需要一个简单的函数对象，不妨使用`lambda`表达式
- 不能把虚成员函数定义成模板成员函数
- 利用模板别名来简化表示方式并隐藏细节
- 当函数参数的类型和数量都无法确定时，使用可变参数模板
- 不要用可变参数模板处理同类型的参数,而应该使用初始值列表
- 使用模板时要确保它的定义(不仅是声明)位于作用域内，所以模板的定义通常放`.h`文件
- 模板不存在分离式编译:用到模板的地方都应该用`#include`包含模板的定义

## 第6章 标准库 概览

所有的C++实现都提供标准库接口。当然，除了标准库组件外，大多数C++实现还提供图形接口、Web接口、数据库接口等。类似地，大多数应用程序开发环境还会提供"基础库"，以提供企业级或工业级的"标准"开发和运行环境。

标准库提供的工具和方法可以分为如下几类:

- 运行时语言支持(例如，对资源分配和运行时类型信息的支持)
- C标准库(进行了非常小的修改，以便尽量减少与类型系统的冲突)
- 字符串(包括对国际字符和本地化的支持)
- 对正则表达式匹配的支持
- `I/O`流，这是一个可扩展的输入输出框架，用户可向其中添加自己设计的类型、流、缓冲策略、区域设定和字符集
- 容器(如 `vector` 和 `map`) 和算法(如`find()`、`sort()` 和 `merge()`), 习惯上称这个框架为标准模板库`STL`，用户可向其中添加自己定义的容器和算法。
- 对数值计算的支持(例如标准数学函数 、复数、支持算术运算的向量以及随机数发生器)
- 对并发程序设计的支持，包括`thread`和锁机制,在此基础上，用户就能够以库的形式添加新的并发模型。
- 支持模极元程序设计的工具(如**类型特性**)、 `STL`风格的泛型程序设计(如`pair`) 和通用程序设计(如`clock`)
- 用于资源管理的**智能指针** (如`unlque_ptr`和`shared_ptr`) 和 垃圾回收器接口
- 特殊用途容器，例如`array` `bitset` 和`tuple`

`using namespace std;`将命名空间`std`中的所有名字都暴露到了全局命名空间中，一般来说这并不是一个好的编程习惯。

建议:

- 不要重新发明轮子，应该使用库
- 当有多种选择时，优先选择标准库而不是其他库
- 不要认为标准库在任何情况下都是理想之选
- 当使用标准库工具和方法时，记得用`#include`包含相应的头文件
- 记住，标准库工具和方法都定义在命名空间`std`中

## 第7章 字符串和正则表达式

`string`和`regex` 都支持`Unicode`。

`string`的`+`操作符: 可以将一个`string`、一个字符串字面值常量、 一个`C`风格字符串或是一个字符连接到一个`string`上。由于标准库`string`定义了一个移动构造函数，因此，即使是以传值方式而不是传引用方式返回一个很长的`string`也会很高效。

```c++
string compose( const string &name, const string &domain )
{
    return name + '@' + domain;     // + 操作符
}
auto addr = compose("1162097842", "qq.com");

auto addr += '\n'; // 追加换行      // += 操作符

string name = "codekissyoung";

string s = name.substr( 8, 5 );     // 截取操作，s = young
name.replace( 8, 5, "me" );         // 替换操作，name = codekissme
name[0] = toupper(name[0]);         // 下标操作, name = Codekissme
if( name == name2 )                 // 字符串比较
if( name == "zhangjian" )           // 和字符串字面值常量比较
name.c_str();                       // 返回只读的 C 风格的字符串
```

### 标准库 string 的实现

在当前的`string`实现版本中，通常会使用**短字符串优化技术**。即短字符串会直接保存在`string`对象内部，而长字符串则保存在堆内存中。

```c++
string s1 {"Annemarie"};
string s2 {"Annemarie Stroustrup"}
```

上述代码的内存布局:

![内存布局](https://img.codekissyoung.com/2019/05/22/aba90838b000f55493f2bdb9ddcbf2a3.png)

当一个`string`由短变长(或相反)时，它的表示(存储)形式会相应地调整。

**短字符串优化技术**被采用的一个原因是，在多线程实现中，内存分配操作的代价相对较高; 而且，当程序中使用大量长度不一的字符串时， 会产生内存碎片问题。

为了处理多字符集，标准库定义了一个通用的字符串模板`basic_string`,`string` 实际上是此模板用字符类型`char`实例化的一个别名。

```c++
template<typename Char>
class basic_string{
    // ... Char 类型的字符串
};

// 标准库string也不过是使用下句代码生成的
using string = basic_string<char>;

// 假定我们有一个日文字符类型, 则可以使用这句生成 Jstring 模板类
using Jstring = basic_string<Jchar>;
```

### 正则表达式

在`<regex>` 中，标准库定义了`std::regex`类及其支持函数，提供对正则表达式的支持。

- `regex_match()` 将正则表达式与一个(已知长度的)字符串进行匹配
- `regex_search()` 在一个(任意长的)数据流中搜索与正则表达式匹配的字符串
- `regex_replace()` 在一个(任意长的)数据流中搜索与正则表达式匹配的字符串并将其替换
- `regex_iterator` 遍历匹配结果和子匹配
- `regex_token_iterator` 遍历未匹配部分

```c++

ifstream in("file.txt");
if( !in )
    cerr << "no file\n";

regex pat {R"(\w{2}\s*\d{5}(-\d{4})?)"}; // 正则表达式

int lineno = 0;
for( string line; getline( in, line ); )
{
    ++lineno;
    smatch matches; // 匹配的结果保存在这里
    if( regex_search( line, matches, pat ) )
    {
        cout << lineno << ": " << matches[0] << '\n'; // 完整匹配
        if( 1 < matches.size() && matches[1].matched )
            cout << "\t: " << matches[1] << '\n';     // 子匹配
    }
}
```

上例中读取一个文件，在其中查找美国邮政编码，如`TX77845`和`DC 20500-0001`, `smatch`是一个保存`regex`匹配结果的容器。在本例中`matches[O]`对应整个模式而`matches[1]`对应可选的四个数字的子模式。

正则表达式的语法和语义的设计目标是使之能编译成可高效运行的自动机, 这个编译过程是由`regex`类型在运行时完成的。

![WX20190522-124601.png](https://img.codekissyoung.com/2019/05/22/9d726fc56128785feb80f90a3c8d2d8a.png)

![WX20190522-124756.png](https://img.codekissyoung.com/2019/05/22/ca3a1e5fbba63d5aeebe9c4f15c06234.png)

![WX20190522-124954.png](https://img.codekissyoung.com/2019/05/22/ebab44e37b94c964872e1228a0764a72.png)

```c++
bool is_identifier( const string &s )
{
    regex pat {R"[_[:alpha:]]\w*"};
    return regex_match(s, pat);
}
```

在一个正则表达式中，被括号限定的部分形成一个`group`**子模式**,用`sub_match`来表示。如果你需要用括号但又不想定义一个子模式，则应使用`(?`而不是`(`,例如：

```c++
(\s|:|,)*(\d*)      // 空白符、冒号、或逗号，后接一个数，其中有两个分组
(?:\s|:|,)*(\d*)    // 只有(\d*)一个分组
```

![WX20190522-125638.png](https://img.codekissyoung.com/2019/05/22/1bd10b9f9a3726c7895e28237cb38299.png)

最后一个模式对于`XML`文件的解析很有用。它可以查找标签起始和结束的标记。注意，对标签起始和结束间的子模式，这里使用了**非贪心匹配(懒惰匹配)** `.*?`,而不是贪心匹配`.*`。如果对第一个子模式采用贪心匹配策略，则会将第一个`<`与最后一个`>`配对。这结果也许不是程序员所期望的。

正则中的迭代器:

定义一个`regex_iterator`来遍历一个流(字符序列)，在其中查找给定模式:

```c++
string input = "aa as; asd ++e-asdf asdfg";
regex pat {R"(\s+(\w+))"};
for ( sregex_iterator p( input.begin(), input.end(), pat ); p != sregex_iterator{}; ++p )
    cout << (*p)[1] << '\n';
```

建议：

- 优先选择`string`操作而不是`C`风格的字符串函数
- 使用`string`声明变量和成员而不是将它作为基类
- 返回`string`应采用传值方式，依赖移动语义
- 当需要范围检查时，应使用`at()`而不是迭代器或`[]`
- 当需要优化性能时，应使用迭代器或`[]`而不是`at()`
- 只有迫不得已时，才使用`c_str()`获得一个`string`的`C`风格字符串表示
- 可用`basic_string`构造任意类型字符的字符串
- 默认的正则表达式符号表示是`ECMAScript`中所用的表示法
- 用`?`让匹配采取“懒惰”策略

## 第8章 I/O 流

`I/O`流库提供了文本和数值的输入输出功能，这种输入输出是带缓冲的，可以是格式化的，也可以是未格式化的。

`ostream`类:

![WX20190522-140300.png](https://img.codekissyoung.com/2019/05/22/6b99f82df3b6a2fd089d3abc06e5e5f9.png)

`istream`类：

![WX20190522-140312.png](https://img.codekissyoung.com/2019/05/22/4bcd3249f5a6a5301849e68ef0447270.png)

### IO 状态

每个`iostream`都有状态，我们可以检查此状态来判断流操作是否成功。

```c++
vector<int> res;
int i;
while( cin >> i )
    res.push_back(i);
```

一个读取整数序列的例子,该序列可能包含`{`与`}`:

```c++
vector<int> res;
while( cin )
{
    for( int i; cin >> i; ){
        res.push_back(i);
    }
    if( cin.eof() )
    {
        // 一切顺利，到达文件尾
    }
    else if( cin.fail() ) // 读取失败，尝试修复
    {
        cin.clear();      // 将 cin 状态修复为 good
        char ch;
        if( cin >> ch )
        {
            switch(ch)
            {
                case '{':
                case '}':
                    break;                             // 可以修复
                default:
                    cin.setstate( ios_base::failbit ); // 无法修复，恢复错误状态
            }
        }
    }
}
```

## 第9章 容器

### vector

一个典型的`vector`实现会包含一个句柄，保存指向首元素的指针，还会包含一个指向尾元素之后位置的指针以及一个指向所分配空间之后位置的指针，还会包含一个分配器`alloc`, `vector`通过它为自己的元素分配内存空间。默认的分配器使用`new`和`delete`分配和释放内存。

![WX20190522-142304.png](https://img.codekissyoung.com/2019/05/22/668aea54f080ed7065a387732db5fde7.png)

类似所有标准库容器，`vector`是某种类型`T`的元素的容器，即`vector<T>`。几乎任何类型都可以作为元素类型:内置数值类型(`char` `int` `double`)、用户自定义类型(`string`、`Entry`、`list<int>` `Matrix<double，2>`) 以及指针类型( `const char *`, `Shape *` 和 `double *` )。当你插入一个新元素时，它的值被拷贝到容器中。例如，当你将一个整型值`7`存入容器，结果元素确实就是一个值为`7`的整型对象，而不是指向某个包含`7`的对象的引用或指针。

如果你有一个类层次结构依赖`virtual`函数获得多态性，就不应在容器中直接保存对象，而应保存对象的指针或智能指针，例如:

```c++
vector<Shape> vs;               // 不正确一一空间不足以容纳 Circle 或 Smiley
vector<Shape*> vps;             // 好一些
vector<unique_ptr<Shape>> vups; // 正确
```

### list

如果希望在一个序列中添加、 删除元素而无需移动其他元素， 则应使用`list`。

![WX20190522-143703.png](https://img.codekissyoung.com/2019/05/22/dd556711649722a45bfd8b65423e2cb7.png)

### map

编写程序在一个(名字，数值)对列表中查找给定名字是一项很烦人的工作。而且，除非列表很短，否则顺序搜索是非常低效的。标准库提供了一个名为`map`的搜索树(红黑树)：

![WX20190522-143908.png](https://img.codekissyoung.com/2019/05/22/c33e2e9cd149ab129a8f4656923c01db.png)

### unorder_map

搜索`map`的时间代价是`O(log(n))`, `n`是`map`中的元素数目。通常情况下，这样的性能非常好。考虑一个包含100万个元素的`map`，我们只需执行`20`次比较和间接寻址操作即可找到元素。

不过，在很多情况下，我们还可以做得更好，那就是使用哈希查找，而不是使用基于某种序函数的比较操作(如`<`)。标准库哈希容器都被称为"元序"容器，因为它们不需要一个序函数:

![WX20190522-144419.png](https://img.codekissyoung.com/2019/05/22/9914c7e99faf0e658a0132a474699ea0.png)

容器参考表：

![WX20190522-144622.png](https://img.codekissyoung.com/2019/05/22/c8162e35a70e6c82c74f174a949f4e2d.png)

建议：

- 一个标准库容器定义了一个序列
- 标准库容器是资源句柄
- 将`vector`作为你的默认容器
- 对于简单的容器遍历，使用`range for`循环或一对首尾迭代器
- 使用`reverse()`避免指向元素的指针或迭代器失效
- 使用容器及其`push_back()`和`resize()`操作，而不是使用数组和`realloc()`操作
- 调整`vector`大小后，不要再使用旧迭代器
- 不要假定`[]`有范围检查功能,如果你需要确保范围检查，使用`at()`
- 向容器插入元素时，元素是被拷贝进容器的
- 如果要保持元素的多态行为，在容器中保存指针而非对象

## 第10章 算法

单纯一个数据结构是没太大用处的，比如一个孤立的链表或者数组。 为了使用一个数据结构，我们还需要能对其进行基本访问的操作，如添加和删除元素的操作。 而且，我们很少仅仅将对象保存在容器中了事，而是需要对它们进行排序、打印、抽取子集、删除元素、搜索对象等更复杂的操作。因此，标准库除了提供最常用的容器类型之外，还为这些容器提供了最常用的算法。

标准库算法都描述为元素(左闭右开)序列上的操作。 一个序列`sequence`由一对迭代器表示，它们分别指向首元素和尾后位置:

![WX20190522-151718.png](https://img.codekissyoung.com/2019/05/22/8fb707422f1c5f21e077ec441aeb4091.png)

## 第11章 实用工具

## 第12章 数值计算

## 第13章 并发

## 第14章 历史和兼容性

C++ 的设计目的是为程序的组织提供`Simula` 的特性，同时为系统程序设计提供`C`的效率和灵活性。`Simula`是C++抽象机制的最初来源。类的概念(以及派生类和虚函数的概念)也是从`Simula`借鉴而来的。不过，模板和异常则是稍晚引入C++的，灵感的来源也不同。

大事件年表：

- 1979，类、派生类、公有/私有访问控制、构造函数、析构函数、带实参检查的函数声明。最初的库支持非抢占的并发任务和随机数发生器。
- 1984，虚函数、函数重载、运算符重载、引用、以及`I/O`流和复数库
- 1985，多任务（非抢占调度）特性
- 1991，使用模板的泛型编程，基于异常的错误处理，资源管理理念“资源获取即初始化”`RAIT`的提出
- 1997，命名空间、`dynamic_cast`、`STL`标准库
- 2003，正则表达式、无序容器（哈希表）和资源管理指针
- 2009，统一初始化、移动语义、可变模板参数、`lambda`表达式、类型别名、一种适合并发的内存模型。标准库增加了线程、锁机制。
- 2013，第一个完整的`C++11`实现出现

回顾往事，我认为引人构造函数和析构函数是最重要的。 用当时的术语来说"一个构造函数为成员函数创建了执行环境，而析构函数则完成了相反的工作"。这是 C++ 资源管理策略的根源(导致了对异常的需求 )，也是许多技术使用户代码更简洁、更清晰的关键。我没有听说过(到现在也没有)当时有其他语言支持能执行普通代码的多重构造函数。而析构函数则是C++ 新发明 的特性。

因为当时很多 C 程序员似乎已经接受 : 真正重要的是彻底的灵活性和仔细地人工打造程序的每个细节。而当时我的观点是(现在也是):我们从语言和工具获得的每一点帮助都很重要，我们正在创建的系统的内在复杂性总是处于我们所能表达的边缘。

模板：

在设计**模板**的过程中，我被迫在灵活性、效率和提早类型检查之间做出决断。那时没人知道如何同时实现这三点，也没人知道如何与`C`风格代码竞争高要求的系统应用开发任务。我觉得应该选择前两个性质。回顾往事，我认为这个选择是正确的，模板类型检查尚未有完善的方案，对它的探索一直在进行中。

异常：

异常的设计则关注异常的多级传播、将任意信息传递给一个异常处理程序，以及异常和资源管理的融合(使用带析构函数的局部对象来表示和释放资源， 我笨拙地称之为"资源获取即初始化")等问题。

C++11新增语言特性：

- 用`{}`进行统一、通用的初始化
- 从初始化器进行类型推断
- 防止类型窄化
- 有保证的推广的常量表达式：`constexpr`
- `range for`语句
- 空指针关键字:`nullptr`
- 有作用域的强类型的`enum class`
- 编译时断言：`static_assert`
- `{}`列表到`std::initializer_list`的语言层的映射
- 右值引用，移动语义
- 以`>>`结束嵌套模板参数，中间不需要空格了
- `lambda`表达式
- 可变参数模板
- 类型和模板别名
- `Unicode`支持
- `long long`整数类型
- 对齐控制`alignas`和`alignof`
- 在声明中将一个表达式的类型作为类型使用的能力，即类型推断:`decltype`
- 裸字符串字面常量
- 推广的`POD  (Plain Old Data)`,简单旧数据
- 推广的`union`
- 局部类作为模板参数
- 后缀返回类型语法
- 属性语法 和 两种标准属性 `carries_dependency` 和 `noreturn`
- 防止异常传播: `noexcept` 说明符,在表达式中检测`throw`的可能性
- C99 特性：拓展的整数类型，即可选的长整数类型的规则；窄、宽字符串的链接；`__STDC__HOSTED__`；`_Pragma(X)`；可变参数宏 和 空参数宏
- 名为`__func__`的字符串保存当前函数的名字
- `inline`命名空间
- 委托构造函数
- 类内成员初始化器
- 默认控制：`default` 和 `delete`
- 显示转换运算符`explicit`
- 用户自定义字面值常量
- `template`实例化的更显式的控制：`extern template`
- 函数模板的默认模板参数
- 继承构造函数
- 覆盖控制：`override` 和 `final`
- 内存模型
- 线程局部存储:`thread_local`

标准库组件：

- 容器的`initializer_list`构造函数
- 容器的移动语义
- 单向链表：`forward_list`
- 哈希容器：`unordered_map`、`unordered_multimap` `unordered_set` 和 `unordered_multiset`
- 资源管理指针：`unique_ptr` `shared_ptr` `weak_ptr`
- 并发支持：`thread`、互斥对象、锁、条件变量
- 高层并发支持：`packaged_thread` `future` `promise` `async()`
- `tuple`
- `regex`正则表达式
- 随机数:`uniform_int_distribution` `normal_distribution` `random_engine`
- 整数类型名：`int16_t`、`uint32_t`、`int_fast64_t`
- 定长且连续存储的顺序容器：`array`
- 拷贝和重新抛出异常
- 用错误码报告错误：`system_error`
- 容器的`emplace()`操作
- `constexpr`函数更广泛的使用
- `noexcept`函数的系统使用
- 改进的函数适配器`function`和`bind()`
- `string`到数值的转换
- 有作用域的分配器
- 类型萃取，如`is_integral` 和 `is_base_of`
- 时间工具：`duration` 和 `time_point`
- 编译时有理数运算：`ratio`
- 结束一个进程：`quick_exit`
- 更多算法,`move()` `copy_if` `is_sortof()`
- 垃圾回收`ABI`
- 底层并发支持