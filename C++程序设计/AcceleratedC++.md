# Accelerated C++ 笔记

这本书使用通过直接使用和练习代码的方式来讲解`C++`，即使`C++`是以`C`为基础的，但是我们也并不会从`C`的教学开始，而是一开始就使用高级数据结构。

我们集中注意力来解决问题，而不是专门去研究语言和库的特征。

## 第0章 开始学习C++

注释、标准头文件、作用域、名字空间、表达式、语句、字符串直接量、输出。

## 第1章 使用字符串

### 输入字符串

```c++
string name;
cout << "name:";
cin >> name;
cout << "hello" << name << endl;
```

## 第2章 循环和计数

数组从0开始计数。

## 第3章 使用批量数据

使用`vector`存储数据。

```c++
double x;
vector<double> homework;
while( cin >> x )
    homework.push_back(x);

sort( homework.begin(), homework.end() ); // 排序成非递减序列

auto mid = homework.size() / 2;
median = homework.size() % 2 == 0 ? (homework[mid] + homework[mid-1])/2 : homework[mid]; // 中位数
```

## 第4章 组织程序和数据

使用函数封装计算。

```c++
// 计算中位数
double median( vector<double> vec )
{
    auto size = vec.size();
    if( vec.empty() )
        throw domain_error( "median of an empty vector" );
    sort( vec.begin(), vec.end() );
    auto mid = size / 2;
    return ( size % 2 == 0 ) ? ( vec[mid] + vec[ mid - 1 ] ) / 2 : vec[ mid ];
}

// 将输入流中家庭作业的成绩读入到vector中
istream &read_hw( istream &in, vector<double> &hw )
{
    if( in )
    {
        hw.clear(); // 清除vector原来内容
        double x;
        while( in >> x )
            hw.push_back(x);
        in.clear(); // 清除错误标记，以使输入动作对下一个学生有效
    }
    return in;
}
```

使用结构体封装数据。

```c++
// 把一个学生所有数据放一起
struct Student_info{
    std::string name;
    double midterm_score;
    double final_score;
    std::vector<double> homework;
};

// 读入一个学生的信息
istream &read( istream &is, Student_info &s )
{
    is >> s.name >> s.midterm_score >> s.final_score;
    read_hw( is, s.homework );
    return is;
}

// 比较名字 按引用传递
bool comp_name(const Student_info &x, const Student_info &y)
{
    return x.name < y.name;
}
```

## 第5章 使用顺序容器并分析字符串

往`vector`里依次存入多个学生信息：

```c++
vector<Student_info> students;
Student_info temp;
while( read( cin, temp ) )
{
    students.push_back(temp);
}
```

处理顺序容器中的数据：

```c++
// 计算最终成绩
double grade( double m_score, double f_score, double h_score )
{
    return 0.2 * m_score + 0.4 * f_score + 0.4 * h_score;
}
double grade( double m_score, double f_score, const vector<double> &hw )
{
    if( hw.empty() )
        throw domain_error("no homework");
    return grade( m_score, f_score, median( hw ) );
}
double grade( const Student_info &s )
{
    return grade( s.midterm_score, s.final_score, s.homework );
}

// 判定不及格
bool fgrade( const Student_info &s )
{
    return grade( s ) < 60;
}

// 从 students 中去除不及格的学生，同时返回它们
vector<Student_info> extract_fails( vector<Student_info> &students )
{
    vector<Student_info> fail;
    auto iter = students.begin();

    while( iter != students.end() )
    {
        if( fgrade(*iter) )
        {
            fail.push_back(*iter);
            // 进行 erase 操作后，所有位于删除元素后面的元素的迭代器都会失效。
            // 所幸，erase 返回了一个迭代器，它指向我们刚刚删除的元素的后一个元素
            // 所以赋值给 iter 后，迭代器继续生效
            iter = students.erase(iter);
        }
        else
            ++iter;
    }
    return fail;
}
```

## 第6章 使用库算法

泛型算法是一个不属于任何特定类别容器的算法，它会根据不同的数据类型使用其对应的实现。标准库的泛型算法通常使用迭代器来处理容器里面的元素。

```c++
// 对容器 c 产生一个迭代器，用于从尾部添加元素，要求容器要支持 push_back() 操作
back_inserter( c );

// 对容器 c 产生一个迭代器，用于从头部添加元素，要求容器支持 push_front() 操作
front_inserter( c );

// 判断两个序列是否相等，equal 假定第二个序列与第一个序列长度相等
equal( c1.begin(), c1.end(), c2.begin() );

// 从序列中查找值
find( c.begin(), c.end(), value );

// 查找符合 func 条件的元素，返回该元素的迭代器
find_if( c.begin(), c.end(), func );

// 查找 序列2 在 序列1 中的位置，如果没有找到，则返回 c1.end()
search( c1.begin(), c1.end(), c2.begin(), c2.end() );

// 使用 func 处理 c1 序列的每个元素，并且将结果添加在 c2 序列的后面
transform( c1.begin(), c1.end(), back_inserter(c2), func );

// 复制bottom中所有元素，添加到 ret 的末尾
copy( bottom.begin(), bottom.end(), back_inserter(ret) );

remove( b, e, v )               // [b,e) 删 value
remove_if( b, e, func )         // [b,e) 删 func 条件
remove_copy( b, e, r, v )       // [b,e) 删 v，结果存入 r
remove_copy_if( b, e, r, func ) // [b,e) 删 func 条件，结果存入 r

// 累加求和, 从初始值42开始，将 vec 中的各元素累加，它的返回值类型就是初始值的类型
accumulate( vec.begin() , vec.end() , 42 );
// 从空字符串开始，将 vec_str 里每一个元素链接成一个字符串
accumulate( vec_str.begin(), vec_str.end(), string(" "));

// 分组，将序列里的元素按条件 func 分为两部分，返回指向第二部分的第一个元素的迭代器
partition( vec.begin(), vec.end(), func );

// 同 partition， 但是分组后 元素 之间的相对顺序 是保留的
stable_partition( vec.begin(), vec.end(), func );
```

使用`find_if`改造算法，将句子分割为单词数组。

```c++
bool space( char c )
{
    return isspace( c );
}

bool not_space( char c )
{
    return !isspace( c );
}

vector<string> split( const string &s )
{
    vector<string> ret;

    string::size_type i = 0; // 单词的第一个字符 索引
    string::size_type j = 0; // 单词的最后一个字符索引的 后一位

    while ( i != s.size() )
    {
        // 第一个不是空白的字符，即为单词的开始
        while ( i != s.size() && space(s[i]) )
            ++i;

        // 从单词的开始处寻找，第一个空白处即为单词的结束
        j = i;
        while ( j != s.size() && not_space(s[j]) )
            ++j;

        if( i != j )
        {
            ret.push_back( s.substr( i, j - i ) );
            i = j;
        }
    }

    return ret;
}

vector<string> split1( const string &str )
{
    vector<string> ret;

    auto b_iter = str.begin();

    while( b_iter != str.end() )
    {
        // 第一个不是空白的字符，即为单词的开始，b_iter 即为单词的开始
        b_iter = find_if( b_iter, str.end(), not_space );

        // 从单词的开始处寻找，第一个空白处即为单词的结束，e_iter即为单词的结束
        auto e_iter = find_if( b_iter, str.end(), space );

        // 复制[b_iter,e_iter)中的字符
        if( b_iter != str.end() )
            ret.push_back( string( b_iter, e_iter ) );

        b_iter = e_iter;
    }
    return ret;
}
```

判断字符串是回文

```c++
bool is_palindrome( const string& s )
{
    // s.rbegin() 是 s 从逆序开始，作为第二个序列
    return equal( s.begin(), s.end(), s.rbegin() );
}
```

查找一个字符串中的所有 链接

```c++
using namespace std;
typedef string::const_iterator iter;

bool not_url_char( char c )
{
    // URL 中允许的字符
    static string url_ch = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                           "abcdefghijklmnopqrstuvwxyz-_.~!*'();:@&=+$,/?#[]";
    return find( url_ch.begin(), url_ch.end(), c ) == url_ch.end();
}
bool url_char( char c )
{
    return !not_url_char( c );
}

iter url_beg( iter b, iter e )
{
    static const string sep = "://";

    auto i = b;

    while( (i = search( i, e, sep.begin(), sep.end() ) ) != e )
    {
        auto beg = i;

        // 将 beg 往前移动, 第一个不是字母处，即是 url 的开始处
        while( beg != b && isalpha( *(beg - 1) ) )
            --beg;

        // 判断是否是一个合格的 beg 的条件
        // 1. :// 前面必须有字母
        // 2. :// 后面必须有 url 字符
        if( beg != i && i + sep.size() != e && url_char( *(i + sep.size()) ) )
            return beg;
        else
            i += sep.size();
    }
    return e;
}

iter url_end( iter b, iter e )
{
    return find_if( b, e, not_url_char );
}

// 查找出字符串里所有的 http: 链接，返回 vec
vector<string> find_urls( const string &s )
{
    vector<string> ret;
    auto b = s.begin();
    auto e = s.end();
    while( b != e )
    {
        b = url_beg( b, e );
        if( b != e )
        {
            iter after = url_end( b, e );
            ret.push_back( string( b, after ) );
            b = after;
        }
    }
    return ret;
}
```

## 第7章 使用关联容器

关联容器提供高效的方法来让我们查找一个包含有特定值，而且有可能同时包含了附加信息的元素。我们可以用容器的一部分来进行高效的查找，这一部分通常称为**键**。比如我们跟踪学生的信息，学生名字可以作为**键**,学生的信息作为**值**。

最常见的一种关联数据结构存储了**键-值**对，这种结构每个键与一个值联系起来，并且让我们根据键值可以快速地插入和检索元素，这种结构被称为**关联数组**。C++中最常用的一种关联数组是`map`映射表。

单词计数程序：
`counters[s]`是一个整型的值，当我们循环读取一个`map`时，需要同时读取`键`和`值`。所以，库提供了**数对**`pair`这种数据类型，它保存了`first`与`second`两个元素。`map`的每一个元素都是一个数对，`first`是**键**,而`second`是**值**。上述程序中，对应的`pair`为`pair<const string, int>`。

```c++
string s;
map<string, int> counters;
while( cin >> s )
    ++counters[s];
cout << counters;
```

记录输入的单词，以及单词出现的行数:

```c++
// 声明中第二个参数是函数指针，并且默认使用函数为 split
std::map<std::string, std::vector<int>>
xref( std::istream &in, std::vector<std::string> (*)(const std::string &) = split );

map<string, vector<int>> xref( istream &in, vector<string> (*explode_words)(const string&) )
{
    string line;
    int line_number = 0;
    map<string, vector<int>> ret;

    while( getline( in, line ) )
    {
        ++line_number;
        auto words = explode_words( line );
        for( auto it = words.begin(); it != words.end(); ++it )
            ret[*it].push_back( line_number );
    }
    return ret;
}

// 测试代码
auto ret = xref( cin );
for( auto x : ret )
{
    cout << x.first << " : ";
    cout << x.second;
}
```

其他语言的关联数组可能是根据一个名为**散列表**的数据结构实现的，它很快，但是也有缺点：

- 每一种**键**类型，用户都需要提供一个散列函数，用于计算出一个适当的整数
- 一个散列表的性能对散列函数的细节要求极度敏感
- 通常找不到一个简单的方法，来按一个有用的顺序检索散列表的元素
- 键类型仅仅需要`<`运算符
- 访问一个关联容器中有特定键的元素所耗费的时间，是容器中元素总数目的对数，而不管**键**是什么
- 关联容器的元素总是根据键来排序的

C++ 的关联容器使用的是**自平衡调节树**，它比最好的散列表数据结构慢，但是它不依赖于用户设计出良好的散列函数，并且它还是自动排序，比**散列表**更加方便。

## 第8章 编写泛型函数

泛型函数的参数类型是我们事先不知道的，直到我们调用了这个函数，我们才会得知。

泛型函数接受任何**适当类型**作为参数，**适当**表明函数对参数的使用方式约束了这个参数的类型。例如，函数的参数`x`与`y`,在函数中进行了`x + y`计算，那么`x`与`y`的类型就必须支持`+`这种运算。

当某一种类型以某种特定的方式支持一个特定的操作集时，这个类型才会是一个**迭代器类型**。

**迭代器**：C++标准库的一个主要贡献是，它确立了一种算法设计思想：算法能够使用迭代器来作为算法与容器之间的“粘合剂”，从而获得数据结构的独立性。此外，算法所用到的迭代器都要求有某些操作，我们能以这些操作为基础而分解算法，这就意味着我们可以把一个容器 和 能够使用这个容器的算法匹配起来。

```c++
// 具体函数
double median( vector<double> vec )
{
    auto size = vec.size();
    if( vec.empty() )
        throw domain_error( "median of an empty vector" );
    sort( vec.begin(), vec.end() );
    auto mid = size / 2;
    return ( size % 2 == 0 ) ? ( vec[mid] + vec[ mid - 1 ] ) / 2 : vec[ mid ];
}

// 泛型函数
template <typename T>
T median( std::vector<T> v )
{
    auto size = v.size();
    if( v.empty() )
        throw std::domain_error("median of an empty vector");
    sort( v.begin(), v.end() );

    auto mid = size / 2;
    return ( size % 2 == 0 ) ? ( v[mid] + v[mid-1] ) / 2 : v[mid];
}
```

### 顺序只读访问

```c++
template <typename In, typename X>
In my_find( In begin, In end,const X &x )
{
    while( begin != end && *begin != x )
        ++begin;
    return begin;
}
```

### 顺序只写迭代器

`back_inserter(c)`生成的就是一个只写迭代器。

```c++
// 测试顺序只写访问
template <typename In, typename Out>
Out my_copy( In begin, In end, Out dest )
{
    while( begin != end )
        *dest++ = *begin++;  // 要求 dest 是一个可写的迭代器，才可以进行本操作
    return dest;
}

vector<int> vec = { 344, 55, 43, 90, 78, 67 };
vector<int> vec2 = { 1, 2, 3 };

my_copy( vec.begin(), vec.end(), back_inserter(vec2) );
```

### 顺序读-写访问迭代器

必须支持：

- `*it` 读写
- `++it` 和 `it++`，但不用支持`--it`和`it--`
- `it == j` 和 `it != j`，`it`的类型与`j`一样
- `it->member`作为`(*it).member`的一个替代名

```c++
// 测试顺序读写访问, 将[beg,end)区间的所有等于 x 的元素替换成 y
template <typename For, typename X>
void my_replace( For beg, For end, const X &x, const X &y )
{
    while( beg != end )
    {
        if( *beg == x )
            *beg = y;
        ++beg;
    }
}
vector<int> vec = { 344, 55, 43, 90, 78, 67, 77, 43, 79 };
my_replace( vec.begin(), vec.end(), 43, 89 );
```

### 可逆访问迭代器

有时候函数需要按逆向顺序访问一个容器的元素。也就是迭代器要支持`--`以及`++`运算。

```c++
// 可逆访问例子
template <typename Bi>
void my_reverse( Bi begin, Bi end )
{
    while( begin != end )
    {
        --end;
        if( begin != end )
            swap( *begin++, *end );
    }
}
```

### 随机访问迭代器

如果`p`与`q`是随机访问迭代器，`n`是整数的话，那么要满足以下操作：

- `p + n` `p - n` 以及 `n + p` `p - q`
- `p[n]` 与 `*(p + n )`等价
- `p < q`，`p > q` 以及 `p >= q`

```c++
// 随机访问迭代器
template <typename Ran, class X>
bool my_binary_search( Ran begin, Ran end, const X &x )
{
    while ( begin < end )
    {
        Ran mid = begin + ( end - begin ) / 2;
        if( *mid > x )
            end = mid;
        else if( *mid < x )
            begin = mid + 1;
        else
            return true;
    }
    return false;
}
```

### 输入输出流迭代器

```c++
vector<int> v;
// 从标准输入中读整数值，并把它们添加到 v 中
copy( istream_iterator<int>(cin), istream_iterator<int>(), back_inserter(v) );

// 将整个向量复制到标准输出，也即是输出 v 的元素的，两个元素间以空格分隔
copy( v.begin(), v.end(), ostream_iterator<int>(cout, " ") );
```

### 用迭代器来提高适应性

```c++
// 使用输出迭代器改造，获得更大的适应性
template <typename Out>
void split( const std::string &str, Out out )
{
    auto i = str.begin();
    while( i != str.end() )
    {
        i = std::find_if( i, str.end(), not_space );
        auto j = std::find_if( i, str.end(), space );
        if( i != str.end() )
            *out++ = std::string( i, j );

        i = j;
    }
}

string str = "you are a nice people";
list<string> list_str;
split( str, back_inserter(list_str) );
vector<string> vec_str;
split( str, back_inserter(vec_str) );

// 直接链接到输出
string s;
while( getline(cin, s) )
    split(s,ostream_iterator<string>(cout, ", "));
```

## 第9章 定义新类型

从第4章的利用结构体封装数据开始，我们开始进行向能够像**内置类型**一样使用的**自定义类型**的改造。

常量对象不能调用声明为`const`的常量成员函数。一个程序即使未创建或任何常量对象，它还是有可能在函数调用过程中，创建许多对常量对象的引用。对于常量引用来说，也是不可以调用非常量成员函数的。

```c++
struct Student_info{
    std::string name;
    double midterm_score;
    double final_score;
    std::vector<double> homework;

    std::istream &read( std::istream& );
    double grade() const;
};

istream &Student_info::read( std::istream &is )
{
    is >> name >> midterm_score >> final_score;
    read_hw( is, homework );
    return is;
}

double Student_info::grade() const  // 常量成员函数
{
    return ::grade( midterm_score, final_score, homework );
}
```

至此，`Student_info`类型的用户不再直接操作`name`等内部成员，而是通过`read`等成员函数的方式。但是却没有禁止客户端直接操作。因为`struct`的默认成员缺省都是`public`的。

所以我们使用`class`以及`public:` `private`等标识符，用于访问权限控制。

由于不能直接访问`Student_info`内部成员了，但是又有这种需求，这时候可以提供**存取器函数**，用于对内部部分成员的访问。

```c++
class Student_info{
    private:
        std::string name;
        double midterm_score;
        double final_score;
        std::vector<double> homework;

    public:
        std::istream &read( std::istream& );
        double grade() const;
        std::string get_name() const { return name; } // 存取器函数
};

bool comp_name(const Student_info &x, const Student_info &y)
{
    return x.get_name() < y.get_name();
}
```

我们再来考虑初始化的问题，要想像**内置类型**一样使用**自定义类型**声明变量：

```c++
Student_info stu;           // 一个空的 Student_info 对象
Student_info stu_2(cin);    // 从 cin 读取数据，初始化 s2
```

那么我们就需要为类声明**构造函数**，用于对象的初始化。

```c++
class Student_info{
    public:
    Student_info();     // 用于构造一个空的对象
    Student_info(std::istream &); // 用于从 is 流中构造一个对象
};
```

我们希望初始化数据以表示我们还没有读取到记录：`homework`是一个空向量，`name`为空字符串，`midterm_score`和`final_score`为0，那么我们的默认构造函数的实现如下：

```c++
// name与homework这两个成员的初始化工作，分别由string和vector的缺省构造函数完成，这是隐式的
Student_info::Student_info() : midterm_info(0), final_score(0) {}
Student_info::Student_info( istream &is ) { read(is); }
```

创建一个新的类对象需要的操作：

- 分配内存以保存这个对象
- 按照构造函数初始化程序列表，对对象进行初始化
- 执行构造函数的函数体

```c++
vector<Student_info> students;
Student_info record;

while ( record.read( cin ) )
    students.push_back( record );

sort( students.begin(), students.end(), comp_name );

for( auto x : students )
    cout << x.get_name();
```

## 第10章 管理内存和低级数据结构

```c++
new T;
new T(args);
delete p;
new T[n];
delete[] p;
```

## 第11章 定义抽象数据类型

至此，`Student_info`还有许多不足之处，比如如何对`Student_info`对象进行复制、赋值以及销毁该对象？我们通过对`vector`类的一个仿写`Vec`来学习这些操作。

默认的复制构造函数默认是浅层赋值：
![2019-04-28 01-23-41 的屏幕截图.png](https://i.loli.net/2019/04/28/5cc4902dcd54c.png)

我们使用自定义的复制构造函数进行深层赋值：
![2019-04-28 01-24-04 的屏幕截图.png](https://i.loli.net/2019/04/28/5cc49041413ee.png)

### 赋值不是初始化

在使用`=`为一个变量赋一个初始值时，复制构造函数被调用；而在两个已经存在的对象，进行赋值操作，则调用`operator=`赋值操作符。`operator=`总是需要删除左操作对象里的旧数据，而初始化没有这步操作。确切的说，初始化包括创建一个新的对象的同时给它一个初始的值。

下面操作会发生初始化：

- 声明一个变量
- 在一个函数的入口处用到函数参数的时候
- 函数返回中使用函数返回值的时候
- 在构造初始化的时候

赋值运算符只有在使用`=`运算符的时候才会被调用：

```c++
string url_ch = "~./?:@=&$-.+";     // 初始化
string spaces( url_ch.size(), ' '); // 初始化
string y;                           // 初始化
y = url_ch;                         // 赋值
```

### 三位一体规则

在编写一个管理资源的类时，应该特别注意对**复制构造函数**、**赋值运算符**、**析构函数**的控制。如果类需要自定义一个**析构函数**，那么它同时也需要自定义**复制构造函数**、**赋值运算符**。

```c++
T::T();
T::~T();
T::T(const T&);
T::operator=(const T&);
```

### 预分配内存

举个例子，先申请10个元素的内存，如果用完了，那么重新申请`10 x 2`个元素的内存，将原先的10个元素复制到新生成的内存上，释放旧的内存。每次存储元素的内存不够了，都是按照`x2`的扩容方式重新申请内存扩容。

![WX20190428-105510.png](https://i.loli.net/2019/04/28/5cc5171ecf8e5.png)

## 第12章 使类对象像一个数值一样工作

## 第13章 使用继承与动态绑定

前面几章，我们已经探讨了如何建立自己的自定义数据类型。现在，我们继续探讨自定义类型的继承与动态绑定。

P256页

## 第14章 近乎自动地管理内存

## 第15章 再探字符图形

## 第16章 今后如何学习C++

练习！