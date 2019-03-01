# __attribute__ 机制

- GNU C 特色功能 : 设置函数属性，变量属性，类型属性

## 格式

```c
void func(int a, int b) __attribute__ ((attribute-list)); // 位于声明尾部
```

## 变量属性设置

### `aligned` 设定一个指定大小的对齐格式

```c
// 声明将强制编译器确保（尽它所能）变量类 型为struct S 或者int32_t 的变量在分配空间时采用8 字节对齐方式
struct S {
    short b[3];
} __attribute__ ((aligned (8)));
typedef int int32_t __attribute__ ((aligned (8)));
// 如果aligned 后面不紧跟一个指定的数字值，那么编译器将依据你的目标机器情况使用最大最有益的对齐方式
struct S {
    short b[3];
} __attribute__ ((aligned));
```

### `packed` 暗示了应该使用最小完整的类型 存储更加紧凑

```c
struct unpacked_struct
{
    char c;
    int i;
};
// packed_struct 类型的变量数组中的值将会紧紧的靠在一起，但内部的成员变量s 不会被pack
struct packed_struct
{
    char c;
    int  i;
    struct unpacked_struct s;
}__attribute__ ((__packed__));
```

```c
struct p {
    int a;
    char b;
    short c;
} __attribute__ ((aligned(4))) pp;

struct m {
    char a;
    int b;
    short c;
} __attribute__ ((aligned(4))) mm;

struct o {
    int a;
    char b;
    short c;
} oo;

struct x {
    int a;
    char b;
    struct p px;
    short c;
} __attribute__ ((aligned(8))) xx;

int main(){
    printf("sizeof(int)=%d,sizeof(short)=%d.sizeof(char)=%d\n",
            sizeof(int),sizeof(short),sizeof(char));
    printf("pp=%d,mm=%d \n", sizeof(pp),sizeof(mm));
    printf("oo=%d,xx=%d \n", sizeof(oo),sizeof(xx));
    return 0;
}
```

## 函数属性设置

- 函数属性可以帮助开发者把一些特性添加到函数声明中，从而可以使编译器在错误检查方面的功能更强大。

## 检查函数参数匹配

- 使编译器检查函数声明和函数实际调用参数之间的格式化字符串是否匹配
- `–Wall` 编译器来击活该功能，这是控制警告信息的一个很好的方式。下面介绍几个常见的属性参数。
- `__attribute__ format` 给被声明的函数加上类似printf或者scanf的特征
- `format (archetype, string-index, first-to-check)` archetype指定是哪种风格 scanf, strftime strfmon; string-index 指定传入函数的第几个参数是格式化字符串; first-to-check 指定从函数的第几个参数开始按上述规则进行检查。

```c
__attribute__((format(printf,m,n))) // 按照 printf 参数表格式规则对该函数的参数进行检查
__attribute__((format(scanf,m,n)))

//m=1；n=2
extern void myprint(const char *format,...) __attribute__((format(printf,1,2)));
//m=2；n=3
extern void myprint(int l，const char *format,...) 
__attribute__((format(printf,2,3)));
需要特别注意的是，如果myprint是一个函数的成员函数，那么m和n的值可有点“悬乎”了，例如：
//m=3；n=4
extern void myprint(int l，const char *format,...) __attribute__((format(printf,3,4)));

extern void myprint(const char *format,...) __attribute__((format(printf,1,2)));
void test()
{
    myprint("i=%d\n",6);
    myprint("i=%s\n",6);
    myprint("i=%s\n","abc");
    myprint("%s,%d,%d\n",1,2);
}
```

## 通知编译器函数从不返回值

- 遇到类似函数需要返回值而却不可能运行到返回值处就已经退出来的情况，该属性可以避免出现错误信息。

```c
extern void exit(int)   __attribute__((noreturn));
extern void abort(void) __attribute__((noreturn));
//name: noreturn.c     ；测试__attribute__((noreturn))
extern void myexit();
int test(int n)
{
    if ( n > 0 )
    {
            myexit();
            /* 程序不可能到达这里*/
    }
    else
            return 0;
}
// $gcc –Wall –c noreturn.c
// noreturn.c: In function `test':
// noreturn.c:12: warning: control reaches end of non-void function
```

- 警告信息也很好理解，因为你定义了一个有返回值的函数test却有可能没有返回值，程序当然不知道怎么办了！

## 资源

- [__attribute__资源](https://www.cnblogs.com/astwish/p/3460618.html)