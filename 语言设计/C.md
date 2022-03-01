## C 设计目标

`编译简单` `直接操作内存` `编译产生少量的机器码` `不需要任何运行环境支持便能运行`

## 特征

`值拷贝方式传递参数` 值可以是一个地址(指针)

`静态` 在使用变量时需要声明变量类型

`弱类型` 类型间可以有隐式转换

`自定义数据类型` 不同的变量类型可以用`struct`组合在一起

`类型别名` `typedef` 定义类型的别名

`变量作用域`

`递归`

`编译预处理`

下面我们从一些常见的编程需求，来考察`C`的表达能力。

## 交换两个变量的内容

```c
a = 1;
b = 2;
swap( a, b ); // 能交换成功么？
```

```c
void swap(int x, int y)
{
  int tmp = x;
  x = y;
  y = tmp;
}
```

`值拷贝传参` 导致要实现交换`a` `b` ，函数的参数就必须是 `a` `b` 的地址，然后函数内部通过地址，来交换 `a` `b` 的值。参考如下：

```c
void swap(int* x, int* y)
{
  int tmp = *x;
  *x = *y;
  *y = tmp;
}
```

`静态语言` 导致`swap`就只能处理`int`类型，用来处理`float` `double`等类型的函数，整个逻辑是一样的。

### 交换任意相同类型的两个变量

```c
void swap(void* x, void* y, size_t size)
{
     char tmp[size];
     memcpy(tmp, y, size);
     memcpy(y, x, size);
     memcpy(x, tmp, size);
}
```

`void*` 将 `int` 类型抽象掉了，没了类型，我们需要知道该变量的所占空间大小，所以入参多了`size_t`。

但这种方式，虽然一定程度上实现了`泛型`，但是将调用变复杂了，变量的`size`交给了调用者去确认。

### 从数组中搜索一个数

`int`版本

```c
int search(int a[], size_t size, int target) {
  for(int i=0; i<size; i++)
  {
    if (a[i] == target) {
        return i; // 找到返回数组下标
    }
  }
  return -1; // 找不到
}
```

`泛型`版本

```c
int search(void* a, size_t size, void* target, size_t elem_size, int(*cmp)(void*, void*) )
{
  for(int i = 0; i < size; i++) {
    if ( cmp((unsigned char *)a + elem_size * i, target) == 0 ) {
      return i;
    }
  }
  return -1;
}
```

`泛型`化的过程中，可以发现`target`的大小要自己传入，`==`对比符号不能使用，而是需要实现`cmp`来代替比较操作。参考的`cmp*`函数实现如下：

```c
int int_cmp(int* x, int* y)
{
  return *x - *y;
}

int string_cmp(char* x, char* y){
  return strcmp(x, y);
}

typedef struct _account {
  char name[10];
  char id[20];
} Account;
int account_cmp(Account* x, Account* y) {
  int n = strcmp(x->name, y->name);
  if (n != 0) return n;
  return strcmp(x->id, y->id);
}
```

### 从堆、栈、哈希表、树、图中搜索一个数

以`c`的抽象能力，还是打 `gg` 吧。

## 小结

- 一个通用的算法，需要对所处理的数据的数据类型进行适配。但在适配数据类型的过程中，`C` 只能使用 `void*` 或 `宏替换`的方式，这两种方式导致了类型过于宽松，并带来很多其它问题。

- 适配数据类型，需要 `C` 在泛型中加入一个类型的`size`，这是因为我们识别不了被泛型后的数据类型，而 `C` **没有运行时的类型识别**，所以，只能将这个工作抛给调用泛型算法的程序员来做了。

- 算法其实是在操作`Data Structure` (`DS`)，而`data`则是放到`DS`中的，所以，真正的泛型除了适配`data`外，还要适配`DS`。这就导致设计一个泛型算法就比较难。比如：

  - `容器`的内存的分配和释放，不同的`data`可能有非常不一样的内存`alloc`和`release`模型
  - `data`之间的`copy`，要把它存进来我需要有一个`copy`，这其中又涉及到是深拷贝，还是浅拷贝

- 在实现泛型算法的时候，你会发现自己在纠结哪些东西应该抛给调用者处理，哪些又是可以封装起来。如何平衡和选择，并没有定论，也不好解决。

`针对底层指令控制` `资源占用小` `运行快` 是`C`的长处，但是，在编程这个世界中，更多的编程工作是解决业务上的问题，而不是计算机的问题，所以，我们需要更为贴近业务、更为抽象的语言。
