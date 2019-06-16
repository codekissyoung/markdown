# 《C标准库》

本文是《C标准库》的笔记。

## 第0章

在程序中使用函数之前，必须先对它进行声明。最简单的方法是`#include`函数的头文件（包含了相关的类型定义、宏、函数声明），使它变为翻译单元`translation unit`的一部分。

编译器将每一个翻译单元都转换成一个目标模块`.o`,链接器再将构成整个程序的所有`.o`组合起来，`C`语言的标准库也不过这样预先写好的`.o`文件。

`C`语言提供了15个标准头文件，这些头文件具备以下特征:

- 具有幂等性，多次包含相同的头文件，效果与只包含一次相同
- 相互独立，相互之间不存在依赖关系，都可以独立使用
- 和文件级别的声明等同，必须先包含头文件，然后才可以使用头文件里定义和声明的东西

![命名空间](https://img.codekissyoung.com/2019/06/16/837a8ebd8b3d5acd5a33f53d5f5e7c41.png)

如上述图中，左边的命名 会 覆盖 右边的命名。

## 第1章 <assert.h>

断言，如果一处断言非真，则在标准错误流输出一条适当的失败提示信息(参数的文本、源文件的名字`__FILE__`、源文本行数`__LINE__`),然后掉用`abort`函数退出。断言应该只在调试程序的时候起作用，因为它的输出对于用户来说，是天书。

```c
void assert( int expression );

#define NDEBUG    /* 在生产环境的产品，需要取消断言后编译 */
#undef  NDEBUG    /* 打开断言，默认就是打开 */
```

## 第2章 <ctype.h>

包含了几个可以用于识别和转换字符的函数。

```c
isdigit( int c );  // 是数字

islower( int c );  // 小写字母
tolower( int c );  // 转换成小写字母
isupper( int c );  // 大写字母
toupper( int c );  // 转换成大写字母

isalpha( int c );  // 大小写字母

isalnum( int c );  // 数字 + 大小写字母

iscntrl( int c );  // 控制字符

isgraph( int c );  // 不包括空格在内的所有可打印字符
isprint( int c );  // 包括空格在内的可打印字符

isspace( int c );  // 空格、换页、换行、回车、制表符
```

![ctype函数关系](https://img.codekissyoung.com/2019/06/16/a8484c31cd17accad0d782ef902f4188.png)

## 第3章 <errno.h>

```c
errno; // 全局变量，标准库调用失败后，会设置它的值，用于指明发生了何种错误
```

## 第4章 <float.h>

```c
// 一堆宏，一般不写复杂的程序用不上
```

## 第5章 <limits.h>

```c
CHAR_BIT   // 除位域之外，最小对象的位数 8
SCHAR_MIN  // signed char 对象的最小值 -127
SCHAR_MAX  // signed char 对象的最大值 +127
```

## 第6章 <locale.h>

区域设置。

```c
struct lconv;   // 数字值的格式
LC_ALL
LC_COLLATE
LC_CTYPE
LC_NUMERIC

char *setlocale( int category, const char *locale );
struct lconv *localeconv( void );  // 数字格式习惯查询
```

## 第7章 <math.h>

数学库。

```c
double acos( double x );   // 计算 x 的三角反余弦函数主值。如果参数不在[-1,+1]范围内，则发生定义域错误。
floor( double x );         // 获取不大于 x 的最大整数
ceil( double x );          // 获取不小于 x 的最小整数
fabs( double x );          // 获取 x 的绝对值
double pow( double x, double y ); // 计算 x 的 y次幂
double sqrt( double x );          // 求 x 的平方根
// ...
```

## 第8章 <setjmp.h>

如果一下子能跳出多个函数调用，而不是一层层返回，把控制权交给更早的函数调用的某个地方，通常是处理严重错误的最好方式。

```c
jmp_buf; // 数组类型，适合存储恢复一个调用环境所需的信息

int setjmp( jmp_buf env ); // 将它的调用环境保存在它的 jmp_buf 类型的参数中

void longjmp( jmp_buf env, int val ); // 使用相应的 jmp_buf 参数来恢复程序的相同调用中宏 setjmp的最近一次调用保存的环境
```

## 第9章 <signal.h>

为了处理各种各样的信号，声明了一个类型和两个函数，并定义了几个宏。

```c
sig_atomic_t // 声明为这种类型的对象，可以作为一个原子实体被访问，即使有异步中断发生的时候也是如此
SIG_DFL      // 收到信号后，采取默认动作
SIG_ERR      // 
SIG_IGN      // 忽略该信号

signal( int sig, void (*func)(int) ); // 设置 如何处理 sig 信号

int raise( int sig ); // 把信号sig送给正在执行的程序
```

## 第10章 <stdarg.h>

可变参数列表。

```c
va_list

va_start

va_arg

va_end
```

## 第11章 <stddef.h>

```c
ptrdiff_t 两个指针相减的结果类型
size_t    是 sizeof 操作符的结果的无符号整数类型
wchar_t   最大扩展字符集中所有成员的不同编码值
NULL      展开为实现定义的空指针常量
```

## 第12章 <stdio.h>

输入输出函数。

```c++
```

## 第13章 <stdlib.h>

定义了那些没有明显归属的宏和函数。

```c
```

## 第14章 <string.h>

对`C-style`字符串的操作。

## 第15章 <time.h>

显示时间的相关操作。
