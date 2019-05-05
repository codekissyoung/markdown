# C++ Primer 第五版

《C++ Primer 第五版》笔记。

## 第1章 开始

### 简单的书店程序

```c++
ISBN 国际标准书号   售出册数        单价
0-201-70353-X       4           24.99
```

为了解决卖书的问题，需要编写一个程序，很显然，这个程序需要：

- 定义变量
- 进行输入和输出
- 使用数据结构保存数据
- 检测两条记录是否为同一个ISBN
- 循环处理销售档案中的每条记录

类的作者决定了在该类型上可以使用的所有操作。比如对于`Sales_item`类，我们希望有的操作为:

- `Sales_item.isbn()` 获取一本书的 isbn 编号
- 使用`>>`读取，使用`<<`输出 `Sales_item`类型的对象
- 使用`=`将一个`Sales_item`类型的对象`a`赋值给另一个`Sales_item`对象`b`
- 使用`+`将两个`Sales_item`类型的对象相加，运算的内部逻辑是将同一本书的销量加总，返回的结果是一个新的`Sales_item`对象
- 使用`+=`运算符，将一个`Sales_item`对象加到另一个同类型对象上

`Sales_item.h`头文件：

```c++
#ifndef CPP_SALES_ITEM_H
#define CPP_SALES_ITEM_H

#include <iostream>
#include <string>

class Sales_item {

private:
    std::string isbn;       // 书编号
    unsigned    units_sold; // 售出次数
    double      revenue;    // 售出总额

public:
    Sales_item() : units_sold(0),revenue(0.0) {}
    explicit Sales_item(const std::string &book) : isbn(book),units_sold(0),revenue(0.0) {}
    explicit Sales_item(std::istream &is){ is >> *this; }

    friend std::istream &operator>>(std::istream &, Sales_item &);
    friend std::ostream &operator<<(std::ostream &, const Sales_item &);
    friend bool operator==(const Sales_item &lhs, const Sales_item &rhs );

    Sales_item &operator+=(const Sales_item &rhs )
    {
        units_sold += rhs.units_sold;
        revenue += rhs.revenue;
        return *this;
    }

    double avg_price() const
    {
        if(units_sold)
            return revenue / units_sold;
        else
            return 0.0;
    }

    bool same_isbn(const Sales_item &rhs) const{
        return isbn == rhs.isbn;
    }
};

Sales_item operator+(const Sales_item &lhs, const Sales_item &rhs );
bool operator==(const Sales_item &lhs, const Sales_item &rhs );
bool operator!=(const Sales_item &lhs, const Sales_item &rhs );
std::istream &operator>>(std::istream &, Sales_item &);
std::ostream &operator<<(std::ostream &, const Sales_item &);

#endif
```

`Sales_item.cpp`文件：

```c++
#include "Sales_item.h"

#include <iostream>

using namespace std;

Sales_item operator+(const Sales_item &lhs, const Sales_item &rhs )
{
    Sales_item ret( lhs );
    ret += rhs;
    return ret;
}

bool operator==(const Sales_item &lhs, const Sales_item &rhs )
{
    return lhs.same_isbn(rhs) && lhs.units_sold == rhs.units_sold && lhs.revenue == rhs.revenue;
}

bool operator!=(const Sales_item &lhs, const Sales_item &rhs )
{
    return !( lhs == rhs );
}

istream &operator>>(std::istream &is, Sales_item &s )
{
    double price;
    is >> s.isbn >> s.units_sold >> price;
    if(is)
        s.revenue = s.units_sold * price;
    else
        s = Sales_item();
    return is;
}

ostream &operator<<(std::ostream &os, const Sales_item &s)
{
    os << s.isbn << "\t" << s.units_sold << "\t" << s.avg_price() << "\t" << s.revenue << endl;
    return os;
}
```

`main.cpp`文件:

```c++
#include "Sales_item.h"

#include <iostream>

int main( int argc, char *argv[] )
{
    using namespace std;

    Sales_item book;

    cout << "录入书籍信息：";

    while( cin >> book ){
        cout << "ISBN \t sold \t price \t revenue" << endl;
        cout << book << endl;
    }
    return EXIT_SUCCESS;
}
```

## 第2章 变量和基本类型

比特`bit`：0 或 1

字节`byte` ：可寻址的最小内存块，一般为8`bit`，计算机将每一个字节与一个数字（即内存地址 address）对应起来，如下图：

![WX20190325-152726.png](https://i.loli.net/2019/03/25/5c9882ef045d9.png)

数据从某个内存地址开始存储，数据的类型决定了所占的比特数，以及该如何解释这些比特的内容。比如上图中，如果736424处存的变量是`float`（以32bit存储），那么这个`float`占用了4个字节，它的实际值依赖于该机器是如何存储浮点数。如果736424处存的变量类型是`unsigned char`，并且该机器使用`ISO-Latin-1`字符集，则该位置处的字节表示一个分号`;`。

在算术表达式中不要使用`char`或`bool`，只有在存放字符或布尔值时才使用它们。因为类型`char`在一些机器上是有符号的，而在另一些上是无符号的，如果使用`char`进行运算，容易出现不符合我们计算预期的问题。如果你需要使用一个不大的整数，那么明确指定它的类型是`signed char`或者`unsigned char`。

### 无符号类型的转换

当我们赋给无符号类型一个超出它表示范围的值时，结果是初始值对 无符号类型表示数值的总数 取模后的余数。例如，8bit大小的`unsigned char`可以表示[0,255]（共256个值）区间的值。那么把`-1`赋值给`unsigned char`的实际结果，即 `-1 % 256 = 255`。最终结果是255。

给带符号类型赋值一个超出它表示范围的的值时，结果是未定义的`undefined`，此时，程序可能继续工作，可能奔溃，也可能产生垃圾数据。

当一个算术表达式中，既有`signed`，又有`unsigned`值时，`signed`类型会被转换成`unsigned`类型。

```c++
unsigned u = 10;
int i = -42;
cout << i + i << endl; // -84
cout << u + i << endl; // int占32位，4294967246
```

PS：切勿混用 带符号类型 和 无符号类型

**对象`object`**：通常情况下，是指一块能存储数据并具有某种类型的内存空间。我们在使用这个词时，并不严格区分是 自定义类 还是 内置类型，也不区分是否命名或是否只读。

**初始化**: C++ 中，初始化 与 赋值是完全不同的操作。初始化不是赋值的一种。初始化的含义是创建变量时，赋予其一个初始值。

- 定义于函数体内的内置类型的对象如果没有初始化，则其值未定义。
- 如果是自定义类型的对象，如果没有显式初始化，则其值由自定义类型调用自身的默认构造函数确定。

**赋值**: 含义是，把对象的当前值擦除，然后以一个新值来代替。

**声明`declaration`**：使得对象的名字为程序所知，一个文件如果想使用 在别处定义的对象名字，就必须包含对那个名字的声明。

**定义`definition`**： 负责创建与对象名字关联的实体，定义会申请存储空间、也可能为变量赋予一个初始值。

PS：变量能且只能被定义一次，但是可以在多个地方被声明，即声明多次。

声明与定义是C++分离式编译机制（将程序划分为可被独立编译的多个源文件）的基础。每个源文件自身的对象都**定义**自身文件中，需使用到别的源文件中定义的对象时，只需在本文件的开头**声明**一下即可。

### 作用域 scope

程序中使用到的名字（标识符）不论在程序的哪个位置，都会指向一个特定的实体：变量、函数以及类型。然而，同一个名字如果出现在不同的位置（作用域），也可能指向的是不同的实体。

**全局作用域`global scope`**：全局作用域内声明的名字，在整个程序范围内可用。

**块作用域`block scope`**：`block scope`声明的变量，从声明到所在块`block`结束可用。

PS: 作用域是嵌套在一起的，里层的名字会屏蔽外层的同名变量。如果函数有可能用到某全局变量，则不宜在函数内再定义一个同名的局部变量。

### 复合类型

C++ 中的复合类型指的是：引用 和 指针。复合类型的定义以其他类型为基础。

**引用`reference`**：为对象起了另外一个名字，是对象的别名，实现了对其他对象的间接访问。定义引用时，程序把引用和它指向的值绑定（bind）在一起。

一旦初始化完成，引用将和它指向的对象一直绑定在一起。引用无法重新绑定到另外一个对象，所以引用必须初始化。

```c++
int ival        = 1024;
int &refVal     = ival;   // 正常用法，refVal 与 ival 指向同一块内存，指向同一个对象
int &refVal3    = refVal; // refVal3 与 refVal 、ival 互为别名
int &refVal4    = 10;     // cannot bind non-const lvalue reference of type ‘int&’ to an rvalue of type ‘int’
double &refVal5 = ival;   // cannot bind non-const lvalue reference of type ‘double&’ to an rvalue of ‘double’
const int cval  = 10;
int &refCval    = cval;   // binding reference of type ‘int&’ to ‘const int’ discards qualifiers
```

PS: 引用并非对象，它只是为一个已经存在的对象所起的另外一个名字。

**指针`pointer`**：是指向（point to）另外一种类型的复合类型，也实现了对其他对象的间接访问。

- `pointer`实际存储的是它所指向的对象的内存地址，指针本身就是一个对象，允许对指针赋值和拷贝。
- 在指针的生命周期内，它可以先后指向几个不同的对象。指针无须在定义时初始化。未初始化的的指针，拥有一个不确定的值。

**某些符号有多重含义**：像`&`与`*`这样的符号，既能用作表达式里的运算符，也能作为声明的一部分出现，符号的上下文决定了符号的意义。在不同的上下文中，虽然是同一个符号，但是由于含义截然不同，所以我们完全可以把它当做不同的符号来看待。

```c++
int i = 42;
int &r = i;   // & 紧随着类型名出现，是声明的一部分，所以 r 是一个引用
int *p;       // * 紧随着类型名出现，是声明的一部分，所以 p 是一个指针
p = &i;       // & 出现在表达式中，是一个取地址符
*p = i;       // * 出现在表达式中，是一个解引用符
int &r2 = *p; // & 是声明的一部分，r2是引用，*是一个解引用符
```

指针的常用例子:

```c++
int ival        = 42;       // ival
int *p          = &ival;    // p is pointer to ival
int *p2         = p;        // p2 equals p
int &refIval    = ival;     // refIval is reference to ival
int *pref       = &refIval; // pref is pointer to ival, because refIval equals ival
double *dp      = &ival;    // cannot convert ‘int*’ to ‘double*’ in initialization
int &refp       = p;        // invalid conversion from ‘int*’ to ‘int’
                            // cannot bind rvalue ‘(int)p’ to ‘int&’
int *np         = nullptr;  // 空指针
```

PS：不能定义指针的引用。
PS2：建议初始化所有指针。

### 指向指针的指针 与 指向指针的引用

```c++
// 指针的指针
int ival    = 1024;
int *pi     = &ival;
int **ppi   = &pi;
cout << ival << *pi << **ppi << endl;

// 指针的引用
int *p;       // int pointer p
int i   = 42; // variable i
int *&r = p;  // reference to pointer p
r       = &i; // 修改 r 的值，即等价于修改指针 p 的值
*r      = 0;  // 对 r 解引用，即等价于对 p 解引用，结果是修改 i 的值
```

### 常量对象

一个常量对象必须初始化，一旦初始化其值就不能再改变。

```c++
const int i = get_size(); // 正确：运行时初始化
const int j = 42;         // 正确：编译时初始化
const int k;              // 错误：未初始化
```

默认情况下，`const`对象被设定为仅在本文件内有效。当多个文件出现了同名的`const`对象时，其实等同于在不同文件中分别定义了独立的变量。

如果我们不希望编译器为每个文件分别生成独立的变量，那么我们可以只在一个文件中定义`const`对象（必须在定义之前添加`extern`关键字），而在其他文件中将包含该常量对象声明的头文件引入，即可以实现在多个源文件中使用同一份常量对象的目的了。

```c++
// file1.cc
extern const int bufSize = 1024;

// file_1.h
extern const int bufSize;
```

常量引用的使用范例：

```c++
int i         = 42;
double dval   = 3.14;

int &r1       = i; // 正常使用引用
r1 = 43;

const int &r2 = i;
r2 = 44;        // error: assignment of read-only reference ‘r2’

// 常量引用可以直接指向字面量，而普通引用却不可以
const int &r3 = 45;
const int &r4 = r2 * 2;
int &r5       = r2 * 2;// error: cannot bind non-const lvalue reference of type ‘int&’ to an rvalue of type ‘int’

// int 的常量引用可以指向 double 类型，为什么？
const int &r6 = dval;
int &r7 = dval;// error: cannot bind non-const lvalue reference of type ‘int&’ to an rvalue of type ‘int’
```

**临时变量`temporary`**：所谓的临时变量，就是编译器需要一个空间来暂存表达式的求值结果，这个空间是一个未命名的对象，就是临时变量。

上面的范例中，`r2 * 2`就产生了一个临时变量，常量引用因为可以保证不会改变这个临时变量的值，所以可以用来绑定临时变量，而普通引用`r5`则不能绑定到该临时变量。

`r6`之所以可以绑定，也是因为这个原因，相当于执行了下面两句：

```c++
const int temp = dval; // 隐式转换 double -> int
const int &ri = temp;  // 常量引用绑定到临时变量上了
```

常量与指针的范例:

```c++
double dval         = 3.14;
const double pi     = 3.14;

double *ptr         = &pi; // error: invalid conversion from ‘const double*’ to ‘double*’

const double *cptr  = &pi;
*cptr               = 42; // error: assignment of read-only location ‘* cptr’

cptr                = &dval;
*cptr               = 42; // error: assignment of read-only location ‘* cptr’

int errNumb         = 0;
int *const curErr   = &errNumb; // curErr 永远指向 errNumb,并且可以通过 curErr 修改 errNumb
```

使用更加强力的`constexpr`，让编译器去验证：即将声明的变量一定是一个常量，而且必须用常量表达式初始化，它所修饰的变量一定是编译期可求值的。

```c++
constexpr int sz = size(); // 只有当 size() 在编译时能返回一个常量，才编译正确
```

`constexpr`是一种强有力的约束，更好的保证程序的正确语义不被破坏。编译器在编译期间对`constexpr`的代码会进行非常大的优化，比如将用到`constexpr`表达式的地方，都替换成最终结果等。

### 类型别名

类型别名是一个名字，它是某种类型的同义词。常用于简化复合类型。

```c++
typedef double wages;  // wages 是 double类型 的别名
using SI = Sales_item; // SI 是 Sales_item类型 的别名
typedef char *pstring; // pstring 是 char * 的别名
```

### 编译器自动推断类型

```c++
auto item = val1 + val2; // 编译器自动推断 item 的类型
```

```c++
decltype(f()) sum = x; // 函数f的返回类型就是sum的类型

const int ci = 0, &cj = ci;
decltype( ci ) x = 0; // x 的类型为 const int
decltype( cj ) y = x; // y 的类型为 const int&，y绑定到变量x
decltype( cj ) z;     // 错误，z 是引用 必须初始化
```

编译器实际不调用函数f，而是取f的返回类型作为 sum 的类型。

## 第3章 字符串 向量 和 数组

### 命名空间

```c++
using namespace std;
using namespace::name;
```

PS：位于头文件的代码，不应该使用`using`声明。这是因为，头文件中的代码会拷贝内容到所有引用它的文件中，可能不经意间引起名字冲突。

### 直接初始化 和 拷贝初始化

如果使用`=`初始化一个变量，执行的就是 **拷贝初始化**，编译器将右侧的初始值拷贝到新创建的对象中。

```c++
string s;           // 默认初始化，s是一个空字符串
string s1 = "hiya"; // 拷贝初始化，s1是字符串字面量的一个副本
string s2("hiya");  // 直接初始化
string s3(10, 'c'); // 直接初始化，s3内容为 ccccccccc
string s4 = string(10, 'd'); // 拷贝初始化，会创建一个临时对象用于拷贝
```

一个类要规定好初始化其对象的方式，还要通过成员方法、运算符重载等方式定义能在对象上执行的操作。

### 使用C++版本的C标准库头文件

```c++
#include <cctype> // in C++，推荐使用这个
#include <ctype.h> // in C
```

`<cctype>`与`<ctype.h>`的内容是一样的，在`<cctype>`中的定义的名字都在`std::`中，而`<ctype.h>`则不是。

### Range for语句

```c++
for( auto x : 序列 ){
    // x 为序列中每个元素的副本
}

for( auto &y : 序列 ){
    // y 依次是序列中每个元素的引用，对 y 的操作，就是对序列的操作
}
```

### 使用下标处理序列

```c++
string s = "some thing";
for ( decltype( s.size() ) index = 0; index != s.size() && !isspace(s[index]); ++index )
{
    s[index] = toupper( s[index] ); // 将当前字符改写成大写形式
}

// "some thing" => "SOME thing"
```

### 标准库类型 vector

`vector`表示对象的集合，集合中所有对象的类型都相同。集合中每个对象都有一个数字索引与之对应。因为`vector`容纳着其他对象，所以也称为容器。

`vector`的本质是一个 **类模板 `class template`**，程序员可以编写类，编译器也可以生成类，模板可以看成是程序员编写的，给编译器生成类的一份说明。编译器根据模板创建类的过程 称为 **实例化`instantiation`**。当使用模板时，程序员需要提供信息，用于指示编译器应把类实例化成何种类型。

```c++
vector<int> ivec;              // 指示 实例化成 int 类型
vector<Sales_item> Sales_vec;  // 指示 实例化成 Sales_item 类型
vector< vector<string> > file; // 该向量的元素 也是 向量
```

`vector`是模板，不是类型。编译器根据模板`vector`生成了三种类型：`vector<int>`、`vector<Sales_item>` 和 `vector< vector<string> >`类型。


```c++
vector<int> ivec { 3, 4, 5, 6, 7}; // 列表初始化
vector<int> ivec2( ivec );         // 使用ivec初始化ivec2
vector<int> ivec3 = ivec;          // 把ivec的元素拷贝给ivec3
```

如果`vector`对象中元素的类型不支持默认初始化，那么`vector`的初始化必须提供初始的元素值。

```c++
vector<int> v1( 10, 1 ); // 10个元素，每个元素都是1
vector<int> v2{ 10, 1 }; // 两个元素, 10 和 1
```

在循环体内部，如果有向 `vector` 对象添加元素的操作，则要求不能使用`for( auto x : vec )`循环。

`vector`的下标只能用于去访问已经存在的元素，如果用下标的形式去访问一个不存在的元素，这种错误不会被编译器发现，而是在运行时会产生一个不可预知的值，可能会导致 **缓冲区溢出`buffer overflow`** 错误。当然，使用下标为`vector`添加新元素也是不可行的。

### 迭代器介绍

迭代器用于访问容器中的元素。标准库中定义的容器都支持使用迭代器。类似于指针，迭代器提供了对对象（容器中的元素）的间接访问。

对迭代器的理解：我们认定某个类型是迭代器，是因为这个类型支持一组操作，这组操作能够访问到容器里的元素，并且能够递增、递减遍历每一个元素。每个容器都定义了一个迭代器类型，名为`iterator`，该类型支持迭代器概念规定的一组操作。

```c++
auto b = vec.begin(); // 返回指向第一个元素的迭代器
auto e = vec.end();   // 返回指向尾后元素(最后一个元素的"下一个位置")的迭代器
```

PS：如果容器为空的话，begin与end返回的是同一个迭代器，即尾后迭代器。

![WX20190326-194958.png](https://i.loli.net/2019/03/26/5c9a11f884bb4.png)

```c++
string s("some thing");
if( s.begin() != s.end() ) // 确保 s 非空
{
    auto it = s.begin();   // it 指向 s 的第一个字符
    *it = toupper(*it);    // 将当前字符改写成大写形式
}

for( auto it = s.begin(); it != s.end() && !isspace(*it); ++it )
    *it = toupper(*it);
```

在遍历的时候，使用`!=`而非`<`，为什么？

因为在标准库的容器中，所有的容器都定义了`==`与`!=`运算符的操作，而大多数都没有定义`<`操作。所以，使用`!=`能够在标准库提供的所有容器上都有效。建议养成使用迭代器和`!=`的习惯，这样就不用太在意用的到底是哪种容器。

`begin()`与`end()`返回的是迭代器，如果是对象是常量，则返回`const_iterator`，否则返回`iterator`类型的迭代器。

```c++
vector<int>::iterator it = vec.begin();         // it 能读写 vector<int> 的元素
vector<int>::const_iterator it2 = vec.cbegin(); // 只能使用it2读取元素，不能写元素
```

与`for( auto x : vec )`类似的，在使用迭代器操作容器内元素时，如果容器内元素的个数发生变化（比如调用了`vec.push_back()`），会使容器的的迭代器失效。

PS：凡是使用了迭代器的循环体，都不要向迭代器所属的容器添加或删除元素。

使用迭代器完成的二分搜索：

```c++
auto beg = text.begin(); // 起始元素
auto end = text.end();   // 尾元素的下一个位置
auto mid = text.begin() + (end - beg) / 2; // 中间元素

while( mid != end && *mid != target ) // 当还有元素未检查到，并且中间元素不是要找的元素
{
    if( target < *mid )
        end = mid;               // 新的尾部检查元素
    else
        beg = mid + 1;           // 新的起始检查元素

    mid = beg + (end - beg) / 2; // 新的中间元素
}
```

### 数组

`vector`与`string`迭代器支持的运算，数组的指针全都支持。例如`++`、`--`改变指针指向的元素，遍历数组中的元素。当然，这需要先获得指向数组第一个元素的指针，类似于`vec.begin()`操作。而`vec.end()`操作，则可以用`int *e = &arr[ sizeof(arr) ]` 代替，即获得最后一个元素的下一个位置。

为了让指针的使用更加简单和安全，C++为数组提供了`begin( arr )`与`end( arr )`函数：

```c++
int ia[] = { 0, 1, 2, 34, 45, 42, 45, 56, 12 };
int *beg = begin( ia ); // 获取指向首元素的指针
int *end = end( ia );   // 获取指向尾元素下一个位置的指针
vector<int> ivec( begin( ia ), end( ia ) );  // 使用数组初始化 vecotr
```

## 第4章 表达式

C++提供了一套丰富的运算符，并且定义了运算符作用于内置类型时所执行的操作。

### 运算符重载

运算符作用于类类型时，由程序员指定上述运算符所要执行的操作，称之为 **重载运算符**。使用重载运算符时，运算对象的类型和返回值的类型，都是由该运算符定义；但是运算对象的个数、运算符的优先级和结合律都是无法改变的。

### 类型转换

一般情况下，二元运算符要求两个运算对象的类型相同。当两个运算对象的类型不同时，编译器会尝试将它们转换成同一种类型。比如，整型转换为浮点数型。

```c++
double slope = static_cast<double>(j) / i;  // 强制转换为 double 类型
const char *pc;
char *p = const_cast<char*>(pc);            // 去掉 pc 的const 属性
```

PS：强制类型转换干扰了正常的类型检查，强烈建议避免使用强制类型转换。

### 左值与右值

当对象用作右值时，用的是对象的值（内容）；当对象用作左值时，用的是对象在内存中的位置，这个位置要求是可以写入的。

### 结合律与优先级

括号无视优先级和结合律。

## 第5章 语句

### try语句块和异常处理

异常是在运行时的反常行为，这些行为超出了函数正常功能的范围。典型的异常包括失去数据库连接、意外的的输入等。

检测出异常的代码，无须知道如何处理异常、只需发出某种信号以表明程序遇到了故障。通常也会设计专门的异常处理代码。

C++的异常处理包括：

- `throw`语句用于检测出异常的代码，用来通知发生异常。
- `try-catch` 语句块则用来捕获并处理异常。
- 一套异常类，用于在`throw`和`catch`之间传递异常信息。

```c++
try{
    // 正常代码
}catch( 异常声明1 ){
    // 处理异常
}catch( runtime_error err ){
    // 处理异常
}
```

**异常安全**：异常中断了程序的正常流程。异常发生时，调用者请求的一部分计算可能已经完成了，另一部分尚未完成。这就有可能导致部分资源未能够正常释放。那些在异常发生期间正确执行了清理工作的代码，被称为是**异常安全**的代码。这就要求我们必须时刻清楚异常何时会发生，异常发生后程序应如何确保对象有效、资源无泄漏、程序处于合理的状态。

## 第6章 函数

函数是一个命名了的代码块，我们通过调用函数执行相应代码。函数可以有0个或多个参数，并且通常只返回一个结果。可以重载函数，也就是说，同一个函数名字可以对应几个不同的函数。

### 函数传值与函数返回

- **按值传递** ：调用处，初始值拷贝到函数变量中使用，函数内对变量的改动不会影响到初始值。
- **按指针传递** ：本质也是按值传递，拷贝的是指针的值，拷贝后两个指针是不同的指针。两个指针都可以间接地访问它所指的对象。
- **按引用传递** ：初始值的名字与引用的名字绑定到同一个对象，对引用的操作，即是对初始值对象的操作。

PS：将函数内不会改变其值的形参，定义成常量引用，而不是普通引用。

### 返回数组的函数

由于数组不能被拷贝，所以函数只能返回数组的指针或引用。定义一个返回数组的指针或引用的函数，是比较繁琐的：

```c++
int arr[10];   // arr 是含有10个整型元素的数组
int *p1[10];   // p1 是一个含有10个整型指针元素的数组
int (*p2)[10]; // p2 是一个指针，它指向含有10个整型元素的数组
```

根据上述分析，函数定义一般为`返回类型 函数名( 函数参数 )`, 所以一个返回10个整型元素的数组的指针的函数定义为：

```c++
int (*)[10] func( int a ) { }      // 想当然的 错误写法

int (*func(int a))[10] { }         // 正确的函数定义，却非常怪异的写法


typedef int (*pArr)[10];           // 使用 typedef 或 using 简化后，可以更加清晰的定义这个函数
// 或 using pArr = int (*)[10];
pArr func(int a) { }               // 清晰而正确的定义

auto func1( int a ) -> int(*)[10] { } // 使用后置返回类型，也可以比较清晰的定义这个函数
```

PS：函数内不要返回局部对象的引用或指针。

### 内联函数 与 constexpr函数

`constexpr`是指能用于常量表达式的函数。它表明函数遵守几项约定：函数的返回类型及所有形参的类型都是字面值类型，并且函数体中必须有且仅有一条`return`语句。

```c++
inline const string& shorterString( const string &s1, const string &s2 )
{
    return s1.size() <= s2.size() ? s1 : s2;
}

constexpr int new_sz() { return 42; }
constexpr int foo = new_sz();
```

PS：内联函数与`constexpr`函数需要定义在`.h`文件中。

### 重载函数匹配

当几个重载函数的形参数量相等，以及某些形参的类型可以由其他类型转换得来时，调用哪个重载函数的规则如下：

1. 先确定候选函数集合，要求是：函数名一样，函数声明在调用处可见。
2. 函数的参数个数相等，参数的类型要相同，至少要能转换成声明中参数的类型
3. 找到最佳匹配函数：每个实参的匹配都不劣于其他可行函数，且至少有一个优于其他；若找不到最佳匹配则报二义性错误

为了确定最佳匹配，实参类型到形参类型的转换划分为几个等级：精确匹配>const转换>类型提升>算术类型或指针转换>类类型转换

### 函数指针

函数指针指向的是函数，它指向某种特定类型。函数的类型由它的返回类型和形参类型共同决定，与函数名无关。

```c++
bool lengthCompare( const string& , const string & );
// 函数类型为 bool(const string&, const string&)
```

想要声明一个可以指向该函数的指针，只需要将函数名替换成指针就行。

```c++
bool (*pf)( const string&, const string&);
```

当我们将函数名作为参数使用时，该函数名会自动地装换成 函数指针。当我们想使用指针调用函数时，也无须解引用。

```c++
bool b1 = pf("hello","goodbye");
bool b2 = (*pf)("hello","goodbye");
bool b3 = lengthCompare("hello","goodbye");
```

重载函数的指针：指针类型必须与重载函数中的某一个精确匹配。

### 返回指向函数的指针

```c++
using F = int(int*, int);
using PF = int(*)(int*, int);
PF f1( int );
F* f1( int );
auto f1( int ) -> int(*)(int*, int); // 尾置返回类型
```

## 第7章 类

类基本思想是**数据抽象**和**封装**。**数据抽象**是依赖于**接口**和**实现**的分离编程技术。**接口**指的是用户在该类上能执行的操作；**实现**则包括类的数据成员、负责接口实现的函数体以及定义类所需的各种私有函数。

对于类来说，使用它的人称为用户，构建它的人称为设计者。当我们设计类的接口时，应该考虑如何才能使得类更易于使用；当我们使用类时，不应该顾及类的实现原理。

### 常量成员函数

```c++
std::string isbn() const { return this->bookNo; }
```

PS：常量对象，以及常量对象的引用和指针都只能调用常量成员函数。

### 构造函数

只有当类没有声明任何构造函数时，编译器才会自动地生成**默认构造函数**。默认构造函数按照以下规则初始化类的数据成员：

- 如果类内的成员有初始值，用它来初始化成员
- 如果未提供初始值，则使用该数据类型的默认初始化，比如`string`的默认初始化就是空字符串。

`Sales_data() = default;`的含义是：我们希望这个构造函数的行为，完全等同于编译器为类生成的默认构造函数。

### 拷贝、赋值和析构

除了定义类的对象如何初始化之外，类还需要控制拷贝、赋值和销毁对象时发生的行为。

- 拷贝：初始化变量、以值的方式传递或返回一个对象。
- 赋值：当使用赋值运算符时，将一个对象赋值给另一个同类型对象时。
- 析构：当对象不再存在时，执行析构函数。比如一个局部对象会在创建它的块结束时被销毁。

### 访问控制与封装

- `public` 整个程序内可访问
- `private` 只在本类内可访问
- `protected` 

`class`与`struct`定义类的唯一区别就是，默认访问权限不同：`struct`默认是`public`,`class`默认是`private`。

### 友元声明

在类内，将外部函数声明为友元，则在该函数内部能直接使用类的`private`数据成员。

```c++
class Sales_data
{
    friend Sales_data add( const Sales_data &, const Sales_data & );
}
```

`Sales_data`类例子：

```c++
// Sales_data.h
// ------------------------------------- Sales_data class ------------------------------------- //
class Sales_data
{
    friend Sales_data add( const Sales_data &, const Sales_data & );
    friend std::ostream &print( std::ostream &, const Sales_data & );
    friend std::istream &read( std::istream &, Sales_data & );

public:
    Sales_data() = default;
    explicit Sales_data( const std::string &s ) : bookNo(s) { }
    explicit Sales_data( std::istream &is ) { read( is, *this); }
    Sales_data( const std::string &s, unsigned n, double p ) : bookNo(s), units_sold(n), revenue(p*n) { }

    std::string isbn() const { return bookNo; }

    Sales_data &combine( const Sales_data & );

    double avg_price() const;

private:
    std::string bookNo;         // 书名
    unsigned units_sold = 0;    // 售出数量
    double revenue = 0.0;       // 总收入
};

Sales_data add( const Sales_data &, const Sales_data & );
std::ostream &print( std::ostream &, const Sales_data & );
std::istream &read( std::istream &, Sales_data & );

// Sales_data.cpp
using namespace std;

double Sales_data::avg_price() const 
{
    if( units_sold )
        return revenue / units_sold;
    else
        return 0;
}

Sales_data &Sales_data::combine( const Sales_data &rhs )
{
    units_sold += rhs.units_sold;
    revenue += rhs.revenue;
    return *this;
}

istream &read( istream &is, Sales_data &item )
{
    double price = 0;
    is >> item.bookNo >> item.units_sold >> price;
    item.revenue = price * item.units_sold;
    return is;
}

ostream &print( ostream &os, const Sales_data &item )
{
    os << "isbn: " << item.isbn()
       << " sold: " << item.units_sold
       << " revenue: " << item.revenue
       << " avg_price: " << item.avg_price();
    return os;
}

Sales_data add( const Sales_data &lhs, const Sales_data &rhs )
{
    Sales_data sum = lhs;// 默认情况下，拷贝对象的数据成员
    sum.combine( rhs );
    return sum;
}
```

### 构造函数初始化

```c++
// 直接初始化成员
ConstRef::ConstRef( int a, int b) : height(a), width(b) { }

// 先初始化再赋值
ConstRef::ConstRef( int a, int b)
{
    height = a;
    width  = b;
}
```

前者直接初始化数据成员，效率高; 后者先初始化（height与width的值是未定义的），然后再赋值。推荐养成使用前者的习惯。

### 委托构造函数（C++11）

```c++
class Sales_data{
public:
    Sales_data( std::string s, unsigned cnt, double price ):
        bookNo(s), units_sold(cnt), revenue( cnt * price) { }

    // 以下所有构造函数都委托给其他构造函数完成初始化
    Sales_data() : Sales_data("", 0, 0) { }
    Sales_data(std::string s) : Sales_data(s, 0, 0) { }
    Sales_data(std::istream &is) : Sales_data() { read(is, *this); }
};
```

### 转换构造函数

内置类型之间存在了几种自动转换规则，那么内置类型与类类型之间也存在了自动转换规则。

```c++
// 内置类型自动在赋值时转换成类类型
class Sales_data{
public:
    Sales_data( const std::string &s ) : bookNo(s) { }
};

Sales_data s1 = "my_book";
```

对于参数只有一个的构造函数，这种转换是隐式的、自动的，通过在构造函数前加上`explict`声明，则可以要求这种转换必须进行显式强制转换，才会调用该转换构造函数。

### 类的静态成员

有的时候类需要它的一些成员与类本身直接相关，而不是与类的各个对象保持关联。比如银行账户类需要一个数据成员来表示当前利率，利率与类关联，而不是与每个银行账户对象关联，一旦利率浮动，我们希望所有的对象都能立即使用新值。

```c++
class Account{
public:
    void calculate(){ amount += amount * interestRate; }
    static double rate() { return interestRate; }
    static void rate(double);
private:
    std::string owner;
    double amount;
    static double interestRate;
    static double initRate();
};

void Account::rate(double newRate) {
    interestRate = newRate;
}
```

## 第8章 IO库

## 第9章 顺序容器

## 第10章 泛型算法

## 第11章 关联容器

## 第12章 动态内存

## 第13章 拷贝控制

## 第14章 重载运算与类型转换

## 第15章 面向对象程序设计

## 第16章 模板与泛型编程

## 第17章 标准库特殊设施

## 第18章 用于大型程序的工具

## 第19章 特殊工具与技术

## 附录A 标准库