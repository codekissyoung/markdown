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