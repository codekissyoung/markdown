# C++ Primer 第五版

《C++ Primer 第五版》笔记。

## 第一章 编写一个简单的C++程序

**类型** ： 类型不仅定义了数据元素的内容，还定义了这类数据上可以进行的运算。如果一个名为v的变量的类型为T,则称“v是一个T类型的变量”。

执行完一个程序后，在UNIX上可以通过`echo $?`来获得其返回值。一般的，`0`表示程序运行正常。

C++常用的输入/输出流库是`<iostream>`，一个流就是一个字符序列，是从IO设备读出或者写入IO设备的。术语`stream 流`表达的含义是：随着时间的推移，字符是顺序生成或消耗的。

`<iostream>`中常用的对象有`cin` `cout` `cerr` `clog`，系统通常将程序运行的控制台与这些对象关联起来。因此，从`cin`中读取数据，即是从程序正在运行的控制台读取；往`cout` `cerr` `clog`写入数据时，即是往控制台写入数据。控制台会将写入的数据显示出来。

`<<`运算符左侧运算对象必须是`<ostream>`对象，右侧的运算对象是要打印的值。`<<`运算后仍然返回这个`<ostream>`对象，所以可以连续调用，比如`cout << v1 << v2;`。

`<iostream>`的对象实现都自带了一个缓冲区`buffer`，比如通过`cout`输出到控制台的数据都会在`buffer`中停留，等待`buffer`区满了再一次性显示到控制台。`cout << endl;`结束当前行，并将`buffer`中的内容强制输出到控制台。

> 在调试时添加打印语句，应该立即刷新 buffer，输出内容。否则，如果程序奔溃，打印语句可能还留在 buffer 中，从而导致关于程序崩溃位置的错误推断。

`>>`运算符的左侧运算对象必须是`<istream>`对象，右侧运算对象为一变量，它从 控制台 中读取数据，并存入右侧对象中。`>>`运算后仍然返回这个`<istream>`对象。

如果是C++内置类型，`<<` 与 `>>` 运算符已经处理好了输入与输出逻辑，如果是用户自定义的类型，那么需要自定义好（使用运算符重载）`<<`与`>>`的处理逻辑。

```c++
int value;
while( cin >> value ) { ... }
```

对于上述代码，当遇到`istream`对象作为判断条件时，其效果是检测流的状态。当流取到了整数时，状态是成功；当遇到不是整数的字符时（文件结束符，字母等），流的状态变为无效。处于无效状态的`istream`对象会使条件判定为`false`。

`istream`的读取模式是，读取用户输入，直到遇到第一个空白字符（空格，换行符，制表符），作为一次读取。多个空白字符连续的情况，只视作一个空白字符。

### 类简介

一个类定义了一个类型，以及与其关联的一组操作。C++的一个设计目标就是让用户自定义的类型（类）能够像内置类型一样使用。

```c++
class Sales_item { ... } // 定义一个类，就是定义了一个类型

int a;
Sales_item book_gone_with_wind; // 使用自定义的类型，去定义一个变量
```

类的作者决定了在该类型上可以使用的所有操作。比如对于`Sales_item`类，我们希望有的操作为:

- `book_gone_with_wind.isbn()` 获取一本书的 isbn 编号
- 使用`>>`读取，使用`<<`输出 `Sales_item`类型的对象
- 使用`=`将一个`Sales_item`类型的对象`a`赋值给另一个`Sales_item`对象`b`
- 使用`+`将两个`Sales_item`类型的对象相加，运算的内部逻辑是将同一本书的销量加总，返回的结果是一个新的`Sales_item`对象
- 使用`+=`运算符，将一个`Sales_item`对象加到另一个同类型对象上

成员函数`member function`：类的一部分，用于实现类提供的各种操作。也称方法`method`。通常使用`.`号来调用成员函数，如`book.isbn()`。`.`运算符左侧必须为该类型的对象，右侧为函数名调用。

### 术语表

参数 argument、赋值 assignment、程序块 block、缓冲区 buffer、内置类型 built-in type、字符串字面量 string literal、类 class

类类型 class type、注释 comment、条件 condition、花括号 curly brace、数据结构 data struture、编辑-编译-调试 edit-compile-debug

文件结束符 end-of-file、表达式 expression、for 语句 for statement、函数 function、头文件 header、初始化 initialize、库类型 library type

操纵符 manipulater（如 std::endl）、成员函数 member function、形参列表 parameter list、返回类型 return type、源文件 source type、标准错误输出流 standard error

标准输入流 standard input、标准输出 stardard output、标准库 standard library、语句 statement、未初始化变量 uninitialized variable、 变量 variable

## 第二章 变量和基本类型

![WX20190325-152354.png](https://i.loli.net/2019/03/25/5c988226c546d.png)

比特 bit：0 或 1

字节 byte ：可寻址的最小内存块，一般为8`bit`，计算机将每一个字节与一个数字（即内存地址 address）对应起来，如下图：

![WX20190325-152726.png](https://i.loli.net/2019/03/25/5c9882ef045d9.png)

数据从某个内存地址开始存储，数据的类型决定了所占的比特数，以及该如何解释这些比特的内容。比如上图中，如果736424处存的变量是`float`（以32bit存储），那么这个`float`占用了4个字节，它的实际值依赖于该机器是如何存储浮点数。如果736424处存的变量类型是`unsigned char`，并且该机器使用`ISO-Latin-1`字符集，则该位置处的字节表示一个分号`;`。

在算术表达式中不要使用`char`或`bool`，只有在存放字符或布尔值时才使用它们。因为类型`char`在一些机器上是有符号的，而在另一些上是无符号的，如果使用`char`进行运算，容易出现不符合我们计算预期的问题。如果你需要使用一个不大的整数，那么明确指定它的类型是`signed char`或者`unsigned char`。

### 类型转换

当我们赋给无符号类型一个超出它表示范围的值时，结果是初始值对 无符号类型表示数值的总数 取模后的余数。例如，8bit大小的`unsigned char`可以表示[0,255]（共256个值）区间的值。那么把`-1`赋值给`unsigned char`的实际结果，即 `-1 % 256 = 255`。最终结果是255。

给带符号类型赋值一个超出它表示范围的的值时，结果是未定义的`undefined`，此时，程序可能继续工作，可能奔溃，也可能产生垃圾数据。

当一个算术表达式中，既有`signed`，又有`unsigned`值时，`signed`类型会被转换成`unsigned`类型。

```c++
unsigned u = 10;
int i = -42;
cout << i + i << endl; // -84
cout << u + i << endl; // int占32位，4294967246
```

> 切勿混用 带符号类型 和 无符号类型

### 何为对象？

对象 object：通常情况下，是指一块能存储数据并具有某种类型的内存空间。我们在使用这个词时，并不严格区分是 自定义类 还是 内置类型，也不区分是否命名或是否只读。

### 初始化 与 赋值

C++ 中，初始化 与 赋值是完全不同的操作。初始化不是赋值的一种。初始化的含义是创建变量时，赋予其一个初始值。而赋值的含义是，把对象的当前值擦除，然后以一个新值来代替。

### 声明 与 定义

声明 declaration：使得对象的名字为程序所知，一个文件如果想使用 在别处定义的对象名字，就必须包含对那个名字的声明。

定义 definition： 负责创建与对象名字关联的实体，定义会申请存储空间、也可能为变量赋予一个初始值。

> 变量能且只能被定义一次，但是可以在多个地方被声明，即声明多次。

声明与定义的存在支持了 C++的 分离式编译机制 separate compilation，该机制将程序划分为多个源文件，每个文件可被独立编译。每个文件的对象名字都 **定义** 在自己的文件中，如果需要使用到别的文件的定义，则在本文件的开头 **声明** 一下即可。

### 标识符 与 关键字

![WX20190325-163651.png](https://i.loli.net/2019/03/25/5c989336abf31.png)

### 作用域 scope

全局作用域 global scope：一旦声明，在整个程序范围内可用。

块作用域 block scope：从声明到所在 块 block 结束可用。

作用域 是 嵌套在一起的，里层的对象 会 屏蔽 外层的同名对象。

### 复合类型

C++ 中的复合类型指的是：引用 和 指针。复合类型的定义以其他类型为基础。

引用 reference：为对象起了另外一个名字，是对象的别名。定义引用时，程序把引用和它指向的值 **绑定 bind** 在一起，一旦初始化完成，引用将和它指向的对象一直绑定在一起。

引用无法重新绑定到另外一个对象，所以引用必须初始化。

```c++
int ival = 1024;
int &refVal = ival; // refVal 指向 ival，是 ival 的另一个名字
```

> 引用并非对象，它只是为一个已经存在的对象所起的另外一个名字。

因为引用本身不是一个对象，所以不能定义引用的引用。

指针 pointer：是指向（point to）另外一种类型的复合类型，它实际存储的是它所指向的对象的 内存地址。指针本身就是一个对象，允许对指针赋值 和 拷贝，在指针的生命周期内，它可以先后指向几个不同的对象。指针无须在定义时初始化。未初始化的的指针，拥有一个不确定的值。

```c++
int ival = 42;
int *p = &ival; // p存放变量 ival 的地址，俗称：p是指向ival的指针
cout << *p;     // 由解引用符 * 得到所指对象的值

// 空指针
int *p1 = nullptr;
```

因为引用不是对象，没有实际地址。所以不能定义指向引用的指针。

> **某些符号有多重含义**
> 像 & 与 * 这样的符号，既能用作表达式里的运算符，也能作为声明的一部分出现，符号的上下文决定了符号的意义。在不同的上下文中，虽然是同一个符号，但是由于含义截然不同，所以我们完全可以把它当做不同的符号来看待。

```c++
int i = 42;
int &r = i;   // & 紧随着类型名出现，是声明的一部分，所以 r 是一个引用
int *p;       // * 紧随着类型名出现，是声明的一部分，所以 p 是一个指针
p = &i;       // & 出现在表达式中，是一个取地址符
*p = i;       // * 出现在表达式中，是一个解引用符
int &r2 = *p; // & 是声明的一部分，r2是引用，*是一个解引用符
```

### const 变量

一个常量对象必须初始化，一旦初始化其值就不能再改变。

默认情况下，const 对象被设定为仅在本文件内有效。当多个文件出现了同名的const变量时，其实等同于在不同文件中分别定义了独立的变量。

如果我们不希望编译器为每个文件分别生成独立的变量，那么我们可以只在一个文件中定义const，而在其他多个文件中声明并使用它。

```c++
// file1.cc
extern const int bufSize = 1024;

// file_1.h
extern const int bufSize;
```

> 如果要在多个文件之间共享 const 对象，则必须在变量的定义之前添加 extern 关键字。

如果一个对象的引用被声明为`const`，那么将无法通过该引用去修改对象的值。

```c++
int i = 42;
int &r1 = i;
const int &r2 = i;
r1 = 0;   // 正确
r2 = 10;  // 错误，r2 是一个常量引用
```

### constexpr

C++11新规定，变量声明为`constexpr`，表示由编译器来验证变量的值，是否是一个常量表达式。

```c++
constexpr int sz = size(); // 只有当 size() 在编译时能返回一个常量，才编译正确
```

### 类型别名

类型别名是一个名字，它是某种类型的同义词。常用于简化复合类型。

```c++
typedef double wages;  // wages 是 double类型 的别名
using SI = Sales_item; // SI 是 Sales_item类型 的别名
typedef char *pstring; // pstring 是 char * 的别名
```

### auto 关键字

```c++
auto item = val1 + val2; // 编译器自动推断 item 的类型
```

### decltype 类型指示符

为了从表达式的类型推断出要定义的变量的类型，但是不想用该表达式的值初始化变量。

```c++
decltype(f()) sum = x; // sum 的类型就是函数f的返回类型

const int ci = 0, &cj = ci;
decltype( ci ) x = 0; // x 的类型为 const int
decltype( cj ) y = x; // y 的类型为 const int&，y绑定到变量x
decltype( cj ) z;     // 错误，z 是引用 必须初始化
```

编译器实际不调用函数 f，而是使用当调用发生时，f的返回类型作为 sum 的类型。

### 术语

地址 address、别名声明 alias declaration、算术类型 arithmetic type、数组 array、基本类型 base type、绑定 bind、类成员 class member

复合类型 compound type、常量指针 const pointer 它指向的值永不改变、常量引用 const reference 指向常量的引用、常量表达式 const expression 能在编译时获得结果

constexpr 代表一条常量表达式、转换 conversion 一种类型的值转变为另一种类型、数据成员 data member、声明 declaration、声明符 declarator

默认初始化 default initialization、定义 definition、转义序列 escape sequence、头文件保护符 header guard、标识符 identifier

类内初始值 in-class initializer、列表初始化 list initialization、不可打印字符 nonprintable character、空指针 null pointer、 预处理器 preprocessor

分离式编译 separate compilation、类型别名 type alias、类型检查 type checking、类型说明符 type specifier

## 第三章 字符串 向量 和 数组

### using 声明

```c++
using namespace std;
```

位于头文件的代码，不应该使用`using`声明。这是因为，头文件中的代码会拷贝内容到所有引用它的文件中，可能不经意间引起名字冲突。

### 直接初始化 和 拷贝初始化

如果使用`=`初始化一个变量，执行的就是 **拷贝初始化**，编译器将右侧的初始值拷贝到新创建的对象中。

```c++
string s1 = "hiya"; // 拷贝初始化
string s2("hiya");  // 直接初始化
string s3(10, 'c'); // 直接初始化，s3内容为 ccccccccc
```

### 对象

一个类要规定好初始化其对象的方式，还要通过成员方法、运算符重载等方式定义能在对象上执行的操作。

![WX20190326-165723.png](https://i.loli.net/2019/03/26/5c99e98cdc3ee.png)

`cin >> str;`中`string`对象会自动忽略开头的空白字符，并从第一个真正的字符开始读起，直到遇见下一处空白为止。

> str.size() 返回的类型 string::size_type 类型，很明显是`unsigned`类型，假如有一`int`负值 `n`，那么`str.size() < n`的判定可能为`true`,因为`signed`类型与`unsigned`类型进行比较，`signed`类型会转换成`unsigned`类型，即一个较大的正数。

### 使用C++版本的C标准库头文件

```c++
#include <cctype> // in C++，推荐使用这个
#include <ctype.h> // in C
```

`<cctype>`与`<ctype.h>`的内容是一样的，在`<cctype>`中的定义的名字都在`std::`中，而`<ctype.h>`则不是。

![WX20190326-172237.png](https://i.loli.net/2019/03/26/5c99ef7b19f5b.png)

### Range for语句

```c++
for( auto x : 序列 )
{
    // x 为序列中每个元素的副本
}

for( auto &y : 序列 )
{
    // y 依次是序列中每个元素的引用，对 y 的操作，就是对序列的操作
}
```

### 使用下标处理序列

```c++
for ( decltype( s.size() ) index = 0; index != s.size() && !isspace(s[index]); ++index )
{
    s[index] = toupper( s[index] ); // 将当前字符改写成大写形式
}

// "some thing" => "SOME thing"
```

### 标准库类型 vector

`vector`表示对象的集合，集合中所有对象的类型都相同。集合中每个对象都有一个数字索引与之对应。因为`vector`容纳着其他对象，所以也称为容器。

`vector`的本质是一个 **类模板 class template**，程序员可以编写类，编译器也可以生成类，模板可以看成是程序员编写的，给编译器生成类的一份说明。编译器根据模板创建类的过程 称为 **实例化 instantiation**。当使用模板时，程序员需要提供信息，用于指示编译器应把类实例化成何种类型。

```c++
vector<int> ivec;              // 指示 实例化成 int 类型
vector<Sales_item> Sales_vec;  // 指示 实例化成 Sales_item 类型
vector< vector<string> > file; // 该向量的元素 也是 向量
```

`vector`是模板，不是类型。编译器根据模板`vector`生成了三种类型：`vector<int>`、`vector<Sales_item>` 和 `vector< vector<string> >`类型。

![WX20190326-181822.png](https://i.loli.net/2019/03/26/5c99fc8227ca9.png)

```c++
vector<int> ivec { 3, 4, 5, 6, 7}; // 列表初始化
vector<int> ivec2( ivec ); // 把ivec的元素拷贝给ivec2
vector<int> ivec3 = ivec;  // 把ivec的元素拷贝给ivec3
```

如果`vector`对象中元素的类型不支持默认初始化，那么`vector`的初始化必须提供初始的元素值。

```c++
vector<int> v1( 10, 1 ); // 10个元素，每个元素都是1
vector<int> v2{ 10, 1 }; // 两个元素, 10 和 1
```

![WX20190326-191607.png](https://i.loli.net/2019/03/26/5c9a0a0db94f0.png)

在循环体内部，如果有向 `vector` 对象添加元素的操作，则要求不能使用`for( auto x : vec )`循环。

`vector`的下标只能用于去访问已经存在的元素，如果用下标的形式去访问一个不存在的元素，这种错误不会被编译器发现，而是在运行时会产生一个不可预知的值，可能会导致 **缓冲区溢出 buffer overflow** 错误。当然，使用下标为`vector`添加新元素也是不可行的。

### 迭代器介绍

迭代器用于访问容器中的元素。标准库中定义的容器都支持使用迭代器。类似于指针，迭代器提供了对对象（容器中的元素）的间接访问。

```c++
auto b = vec.begin(); // begin() 返回指向第一个元素的迭代器
auto e = vec.end();   // end() 返回最后一个元素的"下一个位置"的迭代器
```

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

对迭代器的理解：我们认定某个类型是迭代器，是因为这个类型支持一组操作，这组操作能够访问到容器里的元素，并且能够递增、递减遍历每一个元素。每个容器都定义了一个迭代器类型，名为`iterator`，该类型支持迭代器概念规定的一组操作。

```c++
vector<int>::iterator it; // it 能读写 vector<int> 的元素
string::iterator it2;     // it2 能读写 string 对象中的字符

// 还有一个 const_iterator，表示只能读元素，不能写元素
vector<int>::const_iterator it3;
string::const_iterator it4;
```

`begin()`与`end()`返回的是迭代器，如果是对象是常量，则返回`const_iterator`，否则返回`iterator`类型的迭代器。

> **某些对vector对象的操作会使迭代器失效**
> 与`for( auto x : vec )`类似的，在使用迭代器操作容器内元素时，如果容器内元素的个数发生变化（比如调用了`vec.push_back()`），会使容器的的迭代器失效。
> 谨记：凡是使用了迭代器的循环体，都不要向迭代器所属的容器添加元素。

所有标准库容器都提供`++`、`==`与`!=`运算，`string`与`vector`提供更多额外的运算。

![WX20190326-204340.png](https://i.loli.net/2019/03/26/5c9a1e9aa6315.png)

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

### 指针也是迭代器

`vector`与`string`迭代器支持的运算，数组的指针全都支持。例如`++`、`--`改变指针指向的元素，遍历数组中的元素。当然，这需要先获得指向数组第一个元素的指针，类似于`vec.begin()`操作。而`vec.end()`操作，则可以用`int *e = &arr[ sizeof(arr) ]` 代替，即获得最后一个元素的下一个位置。

为了让指针的使用更加简单和安全，C++为数组提供了`begin( arr )`与`end( arr )`函数：

```c++
int ia[] = { 0, 1, 2, 34, 45, 42, 45, 56, 12 };
int *beg = begin( ia ); // 获取指向首元素的指针
int *end = end( ia );   // 获取指向尾元素下一个位置的指针
vector<int> ivec( begin( ia ), end( ia ) );  // 使用数组初始化 vecotr
```

缓冲区溢出 buffer overflow、C-style string、class template、compiler extension 编译器拓展、container 容器、

index 索引、instantiation 实例化、iterator 迭代器、迭代器运算 iterator arithmetic

off-the-end iterator 尾后迭代器、pointer arithmetic 指针运算

direct initialization 直接初始化、copy initialization 拷贝初始化、、值初始化 value initailization 

## 第4章 表达式

C++提供了一套丰富的运算符，并且定义了运算符作用于内置类型时所执行的操作。作用于类类型时，由程序员指定上述运算符所要执行的操作，称之为 **重载运算符**。使用重载运算符时，运算对象的类型和返回值的类型，都是由该运算符定义；但是运算对象的个数、运算符的优先级和结合律都是无法改变的。

**一元运算符**、**二元运算符**、**三元运算符**、函数调用可以看做特殊的运算符，它对运算对象的个数没有限制。

下面这种混合使用解引用和递增运算符的做法，在C++与C中是非常广泛的，要习惯这种写法。

```c++
cout << *pbeg++ << endl; // 输出当前值，并将pbeg向后移动一位
```

## 第5章 语句

异常是在运行时的反常行为，这些行为超出了函数正常功能的范围。

典型的异常包括失去数据库连接、意外的的输入等。

检测出异常的代码，无须知道如何处理异常、只需发出某种信号以表明程序遇到了故障。通常也会设计专门的异常处理代码。

`throw`语句用于检测出异常的代码，用来通知发生异常。`try-catch` 语句块则用来捕获并处理异常。一套异常类，用于在`throw`和`catch`之间传递异常信息。

```c++
try{
    // 正常代码
}catch( 异常声明1 )
{
    // 处理异常
}catch( 异常声明2 )
{
    // 处理异常
}
```

> **异常安全**
> 异常中断了程序的正常流程。异常发生时，调用者请求的一部分计算可能已经完成了，另一部分尚未完成。
> 这就有可能导致部分资源未能够正常释放。
> 那些在异常发生期间正确执行了“清理”工作的代码，被称为是 **异常安全** 的代码。这就要求我们必须时刻清楚异常何时会发生，异常发生后程序应如何确保对象有效、资源无泄漏、程序处于合理的状态。

![WX20190327-150443.png](https://i.loli.net/2019/03/27/5c9b20ae60d91.png)

## 第六章 函数

![WX20190327-153903.png](https://i.loli.net/2019/03/27/5c9b28bfcfd6c.png)

切记，不要返回局部对象的引用或指针。

### inline 内联函数

```c++
inline const string& shorterString( const string &s1, const string &s2 )
{
    return s1.size() <= s2.size() ? s1 : s2;
}
```

### constexpr 函数

constexpr 是指能用于常量表达式的函数。它表明函数遵守几项约定：函数的返回类型及所有形参的类型都是字面值类型，并且函数体中必须有且仅有一条`return`语句。

```c++
constexpr int new_sz
{
    return 42;
}
constexpr int foo = new_sz();
```

> 内联函数 与 constexpr 函数需要定义在`.h`文件中。

### 调试手段assert 和 NDEBUG 预处理变量

```c++
assert( expr ); // 如果 expr 为假，则输出出错信息，并停止程序运行；为真，则忽略
```

如果`#define NDEBUG`，则`assert`什么也不做。默认状态下没有定义`NDEBUG`，此时`assert`将执行运行时检查。

```bash
$CC -D NDEBUG main.c -o main      # 编译时，指定关闭运行时检查
```

条件编译

```c++
void print( const int ia[], size_t size )
{
    #ifndef NDEBUG
        cerr << __func__ << ": array size is " << size << endl;
    #endif
}
```

### 重载函数匹配

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