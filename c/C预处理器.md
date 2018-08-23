# C 预处理器

- 提供字符串替换
- 提供头文件`(*.h)`包含
- 通用代码模板的扩展
- 宏最好只用于命名常量，并为一些适当的结构提供简洁的记法
- 千万别用c预处理器修改语言的基础结构
- 空格带来的影响

```c
#define a(y) a_expanded(y)
a(x);// 被拓展为 a_expanded(x)
// 区别于
#define a (y) a_expanded(y)
a(x); // 被拓展为　(y) a_expanded(y)(x)
```

## 预编译处理函数

- 函数的定义放 `.c` 文件，函数的声明放 `.h` 文件
- 如果要使用某个 `.c` 文件中定义的函数，只需要 `#include` 这个 `.c` 文件对应的 `.h` 文件
- `.h` 文件的作用：被别人拷贝。编译链接的时候不需要管 `.h` 文件

```c
#define MAX_ARRAY_LENGTH 20M
#undef  FILE_SIZE
#define FILE_SIZE 42

#ifndef MESSAGE
   #define MESSAGE "You wish!"
#endif

#define DEBUG 1
#ifdef DEBUG
#define debug(a,b) printf(#a"\n",b)
#else
#define debug(a,b) ;
#endif

/* 字符串常量化运算符（#） */
#define message_for(a, b)  printf(#a " and " #b " : We love you!\n")
message_for(Carole, Debra); // Carole and Debra: We love you!

/* 标记粘贴运算符（##） */
#define tokenpaster(n) printf ("token" #n " = %d", token##n)
tokenpaster(34); // printf ("token34 = %d", token34);

/* 模拟函数 */
#define square(x) ((x) * (x))
#define MAX(x,y) ((x) > (y) ? (x) : (y))
```


## C预处理器

### 常用指令

- `#define` 定义宏
- `#include` 包含一个源代码文件
- `#undef` 取消已定义的宏
- `#ifdef` 如果宏已经定义，则返回真
- `#ifndef` 如果宏没有定义，则返回真
- `#if` 如果给定条件为真，则编译下面代码
- `#else`
- `#elif` 如果前面的 `#if` 给定条件不为真，当前条件为真，则编译下面代码
- `#endif` 结束一个 `#if` `#else` 条件编译块
- `#error` 当遇到标准错误时，输出错误消息
- `#pragma` 使用标准化方法，向编译器发布特殊的命令到编译器中

### 预定义宏

- ANSI C 定义了许多宏。在编程中您可以使用这些宏，但是不能直接修改这些预定义的宏。

```c
#include <stdio.h>
main()
{
   printf("File :%s\n", __FILE__ ); // 当前日期，一个以 "MMM DD YYYY" 格式表示的字符常量。
   printf("Date :%s\n", __DATE__ ); // 当前时间，一个以 "HH:MM:SS" 格式表示的字符常量。
   printf("Time :%s\n", __TIME__ ); // 这会包含当前文件名，一个字符串常量。
   printf("Line :%d\n", __LINE__ ); // 这会包含当前行号，一个十进制常量。
   printf("ANSI :%d\n", __STDC__ ); // 当编译器以 ANSI 标准编译时，则定义为 1。
}
// File :test.c
// Date :Jun 2 2012
// Time :03:36:24
// Line :8
// ANSI :1
```