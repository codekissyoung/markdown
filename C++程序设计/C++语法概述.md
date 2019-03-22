# C++语法

本文主要记录下C++的常用的语法。

## 断言

```c++
static_assert( sizeof(int) >= 4, "sizeof int 小于4字节\n");
```

## 基本操作

![WX20190322-110103.png](https://i.loli.net/2019/03/22/5c945003b887d.png)

### 安全的类型转换

- bool到char
- bool到int
- char到int
- char到double
- int到double

### 不安全的类型转换

- double到int
- double到char
- double到bool
- int到char
- int到bool
- char到bool

## 表达式

### 常量

```c++
const double pi = 3.14159
```

![WX20190322-111108.png](https://i.loli.net/2019/03/22/5c94525ab0a76.png)

## 异常

为了保证检测到的错误不会被遗漏，异常处理的基本思想是把错误检测(在被调函数中完成)和错误处理(在主调函数中完成)分离。

异常提供了一条可以把各种最好的错误处理方式组合在一起的途径。它的基本思想是：如果函数发现一个自己不能处理的错误，它不是正常返回，而是抛出异常来表示错误的发生。任何一个直接或间接的函数调用者都可以捕获这一异常，并确定应该如何处理。

## 自定义类型

类型的好处：

- 表示：类型知道如何表示对象中的数据
- 运算：类型知道如何对对象进行实名运算

### 运算符重载

你可以在类或枚举对象上定义几乎所有C++运算符，这通常称为运算符重载。

重载运算符时，运算对象数目必须和原来一样。

一个重载的运算符必须作用于至少一个用户自定义类型的运算对象。

```c++
enum Month{ Jan = 1, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec }

Month operator++( Month& m )
{
    m = ( m == Dec ) ? Jan : Month( m + 1 );
    return m;
}
```