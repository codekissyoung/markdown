# GCC编译特性

本文记录`gcc`编译器独有的特殊功能。

## __attribute__ 机制

用于设置函数属性，变量属性，类型属性。

```c
void func(int a, int b) __attribute__ ((attribute-list)); // 位于声明尾部
```

### 函数无返回值

遇到类似函数需要返回值而却不可能运行到返回值处就已经退出来的情况，该属性可以避免出现错误信息。

```c
int test( int n ) __attribute__((noreturn));
{
    if ( n > 0 )
        exit(1); // 这里不可能返回 int
    else
        return 0;
}
```

### 强制对齐字节大小

```c
// 采用　8 字节对齐方式
struct S {
    short b[3];
} __attribute__ ((aligned (8)));

// 依据你的目标机器情况使用最大最有益的对齐方式
struct S {
    short b[3];
} __attribute__ ((aligned));
```

### 使存储更加紧凑

```c
struct unpacked_struct
{
    char c;
    int i;
};

// 成员将会紧紧的靠在一起，但内部的成员变量　s 不会被pack
struct packed_struct
{
    char c;
    int  i;
    struct unpacked_struct s;
}__attribute__ ((__packed__));
```
