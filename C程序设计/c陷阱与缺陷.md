# C 陷阱与缺陷 笔记

## 在某些编译器下可能产生死循环的一段代码

```c
int main(int argc, char *argv[])
{
    int i;
    int a[10];
    for(i = 0; i <= 10; i++)
        a[i] = 0;
    return 0;
}
```

## 8进制写法

```c
    int a = 015;      // 为了对齐，添加了一个0,却引入了Bug
    int b = 123;
    printf("%d\n",a); // 13
    printf("%d\n",b); // 123
```

## 字符与字符串

- `"\n"` 与 `'\n'`
- `char *slash = '/';`
- `printf('\n');` 会产生难以预料的错误