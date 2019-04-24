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

P 148