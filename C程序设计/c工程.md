# C工程

## 源代码分开编译

- [慕课网 解释.h文件作用 和 分开编译的意义](https://www.imooc.com/video/6205)
- 分开编译主要目的是缩减编译时间

## 程序与操作系统的沟通

- [return 0的含义](https://www.imooc.com/video/6207)
- `echo $?` 输出上一个程序退出码，0表示成功，其他数值表示异常;
- shell里 `程序1 && 程序2`, 当程序1的退出码为 0 时，程序2才会执行
- [`main(argc,char *argv[])` 参数的含义](https://www.imooc.com/video/6208)

## C 程序的内存管理

- [操作系统的内存分配](https://www.imooc.com/video/7860)

## 模块化: 创建只在linux本文件内可以访问的变量和函数

```c
static char *USERNAME = "codekissyoung"; // 只在本文件可以访问
static void check_name(){ } // 只在本文件可以访问
extern void show_name() // 暴露给外部文件调用的函数
{
    check_name();
    printf("%s",USERNAME);
}
```