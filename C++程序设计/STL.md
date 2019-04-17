# STL 库

本文是STL常用数据类型的笔记。

## vector

向量不仅存储数据元素，还存储元素的个数。第一个数据元素的索引号是`0`、第二个是`1`,依次类推。所有的数据元素要求为同一种数据类型。

```c++
vector<数据类型> 变量名( 元素个数 );

vector<double> vec;

vec.push_back( 4.5 );   // 添加新元素到向量中


// 遍历向量中元素
for(int i = 0; i < vec.size(); ++i)
    cout << vec[i] << endl;

```

## vector、list、string

```c++
container<T>::iterator
container<T>::const_iterator
container<T>::size_type 用来保存这个容器可能存在的最大实例长度
c.begin() 返回指向容器第一个元素的迭代器
c.end()
c.rbegin()
c.rend()
container<T> c; 声明一个容器
container<T> c(c2); 使用 c2 声明一个容器
container<T> c(n); 声明一个有 n 个元素的容器
container<T> c(n,t); 声明一个有 n 个元素的容器，每个元素为 t
container<T> c(b,e);
c = c2; 两个容器之间赋值
c.size(); 容器内元素个数
c.empty(); 用于判定 c 中是否含有元素
c.insert(d,b,e); 复制位于[b,e)区间的元素，插入到 容器 c 中 d 之前的位置
c.erase(it); 删除迭代器指向的元素，并且返回指向后一个元素的迭代器
c.erase(b,e); 删除某个区间[b,e)指向的元素,对于<list>来说，指向被删元素的迭代器会失效，对于向量和string来说，被删元素后面的迭代器都会失效
c.push_back(t); 在 c 末尾添加一个元素，这个元素就是 t

支持随机访问的容器和string类型提供如下操作
c[n]; 从容器 c 中取出位于位置 n 的字符串

迭代器操作
*it 引用迭代器指向的位置处的值
it->x 访问迭代器指向的对象的成员
++it;
it++; 迭代器自增 1 ,指向容器中的下一个元素
b == c;
b != c; 判断向量是否相等

v.reverse(n); 保留空间以保存 n 个元素
v.resize(n);

list 类型是为了高效地在容器中任何位置插入和删除元素而被优化的
l.sort();
l.sort(cmp); 使用 cmp 来排序 list 中的元素
```
