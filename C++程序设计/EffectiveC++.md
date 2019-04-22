# 《Effective C++》第三版

《Effective C++》第三版的学习笔记。

## 术语

每个函数的声明揭示其签名式`signature`，也就是参数和返回类型。一个函数的签名等同于该函数的类型。`std::size_t numDigits(int number)`的签名为`std::size_t (int)`,也就是说该函数获得一个`int`,返回一个`std::size_t`。

**初始化**：是“给予对象初值”的过程。对于自定义对象类型，初始化由构造函数完成。`default构造函数`要求不带任何参数，即要么不带参数，要么参数都有默认值。

```c++
class A{
    public:
        A(); // 默认构造函数
};
class B{
    public:
        explict B( int x = 0, bool b = true ); // 默认构造函数
        explict B( int x );
};
class C{
    public:
        explict C( int x ); // 不是默认构造函数
};
```

`explict`被用来声明，不能进行隐式类型转换，但还是可以显示转换的。

```c++
void doSomething( B object );

B obj1;
doSomething( obj1 );
doSomething( 28 );    // 错误，explict控制不能进行隐式类型转换
doSomething( B(28) ); // 可以，显示类型转换成功
```

**copy构造函数**：以别的同类型对象作为参数，初始化本对象。

```c++
class Widget{
    public:
        Widget( const Widget& rhs );            // copy 构造函数
        Widget& operator=( const Widget& rhs ); // 重载赋值运算符
};

Widget doSomething( Widget wid );

Widget w1;       // 调用 default 构造函数
Widget w2( w1 ); // 调用 copy 构造函数
Widget w3 = w2;  // 调用 copy 构造函数
w1 = w3;         // 调用 = 重载运算符
doSomething( w1 ); // pass-by-value 一律调用 copy 构造函数 
```

### 参数命名习惯

- 参数名：`lhs`代表`left-hand-side`,而`rhs`代表`right-hand-side`。
- 参数名：指向某变量的指针，`Widget *pw;` `Airplane *pa`。
- 参数名：某变量的引用，`Widget &ra = wid;` `Airplane &ra = air;`。

## 1 让自己习惯C++

### 01 将C++视为语言联邦

次语言：

- C：程序块，语句，预处理，内置数据类型，数组，指针；C语言的局限：没有模板，没有异常，没有重载
- C with Classes：classes，封装，继承，多态，虚函数（动态绑定）
- Template C++：泛型编程
- STL：是个template程序库，容器（containers）、迭代器（iterators）、算法（algorithms）以及函数对象（function objects）,STL有自己特殊的办事方式，你必须遵守它。

迭代器和函数对象都是在C指针之上塑造出来的。

C++的编程守则视情况而变化，取决于你使用C++的哪一部分。

### 02 尽量以 const、enum、inline 取代 #define

尽量使用 编译器 而不是 预处理器 实现功能。预处理器中的常量是不会进入到符号表的`symbol table`，调试追踪起来比较麻烦。

```c++
#define ASPECT_RATIO 1.653
// 替换为
const double AspectRatio = 1.653;

#define AUTHOR_NAME "Scott Meyers"
// 替换为
const char* const authorName = "Scott Meyers"; // .cpp 内
const std::string authorName("Scott Meyers");  // .cpp 内，推荐做法

// 限制作用域的常量
class CostEstimate{
    static const double FudgeFactor; // 常量声明，static 指明内存只保留一份
}; // .h 内
const double CostEstimate::FudgeFactor = 1.35; // 定义，.cpp内

// enum hack 式使用常量
class GamePlayer{
    enum{ NumTurns = 5 };
    int scores[NumTurns];
};
```

取一个`const`变量的地址是合法的，取一个`enum`的地址不合法，取一个`#define`的地址通常也不合法。

```c++
#define CALL_WITH_MAX(a, b) (a) > (b) ? (a) : (b)
// 替换为
template<typename T>
inline T &callWithMax( const T &a, const T &b ) // T 类型不确定，所以 pass-by-reference 更合适
{
    return a > b ? a : b;
}
```

`inline`替换宏实现的函数，拥有宏的效率，以及一般函数的所有可预料行为 和 类型安全检查。

### 03 尽可能使用 const

`const`可以用在任何作用域的对象、函数参数、函数返回类型、成员函数本身上，它可以帮助编译器检查出错误的用法。

```c++
char greeting[] = "Hello";

char *p = greeting;             // non-const pointer, non-const data
const char *p = greeting;       // non-const pointer, const data
char* const p = greeting;       // const pointer, non-const data
const char* const p = greeting; // const pointer, const data
```

STL迭代器以指针为根据塑造出来，所以迭代器的作用就像`T*`指针，声明迭代器为`const`就类似声明指针为`const`一样。

```c++
using namespace std;
vector<int> vec;

const vector<int>::iterator iter = vec.begin(); // 类似 T* const iter
*iter = 10; // ok, non-const data
++iter;     // error, const pointer

vector<int>::const_iterator c_iter = vec.begin(); // 类似 const T *c_iter
*c_iter = 10; // error, const data
++c_iter;     // ok, non-const pointer
```

让函数返回一个常量值，可以降低因调用方失误而造成的意外，而又不至于放弃安全性和高效性。

```c++
class Rational{ ... };
const Rational operator*( const Rational &lhs, const Rational &rhs );

Rational a, b, c;

if( a * b = c ){   // 原意是 ==，因为 a * b 的返回值为 const, 所以编译器可以帮助发现此错误
    // ...
}
```

#### const 用在成员函数上

### 04 确定对象使用前已被初始化

永远在使用对象之前，将它初始化。对于自定义类型，确保**每一个构造函数**都将对象的**每一个成员**初始化了。

```c++
int x = 0;                              // 对 int 手工初始化
const char *text = "A C-style String";  // 对指针  手工初始化
double d;
std::cin >> d;                          // 以读取 input stream 的方式完成初始化
```

## 2 构造/析构/赋值运算

### 05 了解C++默默地生成并调用了哪些函数

### 06 若不想使用编译器自动生成的函数，就该明确拒绝

### 07 为多态基类的析构函数声明为 virtual

### 08 别让异常逃离析构函数

### 09 绝不在构造和析构过程中调用 virtual 函数

### 10 让 `operator=` 返回 `reference to *this`

### 11 在 `operator=` 中处理“自我赋值”

### 12 copy all parts of an object

## 3 资源管理

### 13 以对象管理资源

### 14 在资源管理类中小心 coping 行为

### 15 在资源管理类中提供 对原始资源的访问接口

### 16 成对使用new与delete时要采取相同形式

### 17 以独立语句将 “newed对象” 置入智能指针

## 4 设计与声明

### 18 让接口容易被正确使用，不易被误用

### 19 设计class犹如设计type

### 20 使用pass-by-reference替换pass-by-value

### 21 必须返回一个对象时，不要返回试图返回它的引用

### 22 将成员变量声明为 private

### 23 以non-member、non-friend替换member函数

### 24 若所有参数都需要类型转换，则应采用non-member函数

### 25 考虑写出一个不抛出异常的 swap 函数

## 5 实现

### 26 尽可能将变量定义延后

### 27 尽量少做类型转换

### 28 避免返回 handles 指向对象内部成员

### 29 为“异常安全”而努力是值得的

### 30 彻底了解inline

### 31 将文件间的编译依赖关系降至最低

## 6 继承与面向对象设计

### 32 确定你的public继承塑造出“is-a”关系

### 33 避免遮掩继承而来的名称

### 34 区分接口继承和实现继承

### 35 考虑virtual函数以外的其他选择

### 36 绝不重新定义继承而来的non-virtual函数

### 37 绝不重新定义继承而来的缺省参数值

### 38 通过组合构建出“has-a”

### 39 小心使用private继承

### 40 小心使用多重继承

## 7 模板与泛型编程

### 41 了解隐式接口和编译期多态

### 42 了解typename的双重含义

### 43 学习处理模板化基类内的名称

### 44 将与参数无关的代码抽离templates

### 45 运用成员函数模板接受所有兼容类型

### 46 需要类型转换时，为模板定义非成员函数

### 47 请使用 traits classes 表现类型信息

### 48 认识template元编程

## 8 定制 new 和 delete

### 49 了解 new-handler 的行为

### 50 了解 new 与 delete 的合理替换时机

### 51 编写 new 与 delete 时，需固守常规

### 52 写了 placement new 也要写 placement delete

## 9 杂项讨论

### 53 不要忽视编译器的警告

### 54 熟悉包括TR1在内的标准程序库

### 55 熟悉Boost