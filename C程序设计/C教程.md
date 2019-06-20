# C教程

如何从实用的角度，去看待，去使用C语言编写出一个有用的程序呢？本文尝试写出这么一个教程。

## 安装C开发环境

```bash
sudo apt-get install gcc gdb make cmake autoconf automake libtool build-essential flex bison
```

## C 语言提供的数据结构

数字　：整数`int`　和　浮点数 `double`
字符　: 单个字符　`char`

字符串　: 以`\\0`结尾的 `char`数组

```c
// 编译器自动将这些字符一个一个放入到 words 数组中
char words[100] = "i am string in array";

// 编译器自动将这些字符一个一个放入到 auto_words 数组中, 并且数组的大小会自动计算出来
char auto_words[] = "i am created in auto size";

// 编译器将 字符串 标量处的 内存地址 赋值给指针 str, 对于 str 指向处的值，你可以使用，但不可以修改，即只读的！
char *str = "something is pointing at me";
```

数组:

```c
int a[3]   = { 10, 9 };
int a[]    = { 11, 7, 6};
int arr[]  = { 0, 89, [5] = 212, 11 };
int z[][2] = {
    { 1, 1 },
    { 2, 1 },
    { 3, 1 },
};

int count = sizeof(arr) / sizeof(arr[0]);
```

枚举 :

```c
enum color { black, red = 5};
enum color b = black;
enum color r = red;
printf("black = %d red = %d", b, r); // 0 5
```

结构体 :

```c
// 下面这个定义是最好的，一下子就定义了 struct Book 结构体, Book 类型别名， 指向Book的指针类型
typedef struct Book
{
    char  title[50];
    char  author[50];
    char  subject[100];
    int   book_id;
    struct Book *next_book; // 指向本结构体类型的指针
}Book, *pBook;

struct Book my_love = { "my love mary", "jack", "pure love", 123123 }; // 使用结构体类型 声明变量
pBook  pb = &my_love;

printf("title: %s, author: %s \n", my_love.title, pb->author );

Book library[10];
strcpy( library[2].title, "second book" );
```
