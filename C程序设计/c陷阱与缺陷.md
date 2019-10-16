# 《C陷阱与缺陷》笔记

```c
void ( *signal( int, void(*)(int) ) )(int);// signal 函数的声明

//　使用typedef简化
typedef void (*HANDLER)(int);
HANDLER signal(int, HANDLER);
```