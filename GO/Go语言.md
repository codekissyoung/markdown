# Go语言

`CSP`（`communicating sequential processes` 顺序通信进程）：进程是一组中间没有共享状态的平行运行的处理过程，进程间使用 `Pipe` 进行通信和控制同步．

拥有：类型系统 自动垃圾回收 `Package`系统 函数作为一等公民 词法作用域 系统调用接口 只读`utf-8`字符串

放弃：隐式数据转换，类系统，运算符重载，默认参数，继承，泛函数，异常，宏，函数修饰，线程局部存储．

[Go语言官网](https://golang.google.cn/)
[Go代码包文档](http://godoc.org)
[搜索Go语言项目](https://gowalker.org/)
[Go语言入门教程](http://c.biancheng.net/golang/)
[Go靠谱书推荐](https://www.zhihu.com/question/30461290)

## 基础

标识符`identifiers` 与 关键字`keywords`

变量 与 常量

运算符`operators` 和 分隔符`delimiters`

表达式

简单语句

控制结构

#### 类型系统

动态语言 or 静态语言
强类型 or 弱类型
基本数据类型: 基本类型 + 支持的运算符操作
自定义数据类型: 包括类型 + 支持的运算符操作 

#### 抽象特性

是否支持函数特性：

- 函数
- 匿名函数
- 高阶函数
- 闭包

是否支持面向对象：

多态：如何支持多态

接口：是否支持接口，以及接口实现模式

#### 元编程特性

泛型：是否支持

反射：是否支持

#### 运行和跨平台特性

编译模式：编译成机器码? 编译成中间代码？解释器执行？
运行模式：由OS加载？由虚拟机加载？由解释器加载？
内存管理：支持垃圾回收？
并发支持：原生支持？库支持？
跨平台支持：支持的平台？
交叉编译：是否支持？

#### 语言的软实力

库：标准库 和 第三方库 是否丰富、好用、高效
框架：是否有非常出众的框架
兼容性：语言规范是否经常变动，语言新版本向前兼容性
语言影响力：是否有商业公司支持，社区活跃性，是否著名项目

#### 变量

```go
var x int, y int
var x, y int                                // 简写形式
var i, j int = 1, 2                         // 指定类型 赋值
var c, python, java = true, false, "no!"    // 从初始值中推导出 类型
c, python, java := true, false, "no!"       // 等价上句，类型推导 赋值　
var (                                       // 多个不同类型变量
	ToBe   bool       = false
	MaxInt uint64     = 1 << 64 - 1
	z      complex128 = -5 + 12i
)
```

`:=` 限制只在函数内使用，用在可以从右值（表达式, 函数） 推导出 变量类型 的场合

变量的生存周期：

- 包一级声明的变量，生存期和整个程序运行周期一致
- 局部变量，从该变量声明开始，到该变量不再被引用，被自动回收后结束

所有变量都是由 `Go` 编译器决定存储在 `heap` 或是 `stack`，这个称为“变量逃逸分析” 。所以 `Go` 函数是可以返回局部变量的，因为 `Go` 编译器会将它存储在 `heap` 上，这点和 `C` 语言有很大的区别 ^_^

```bash
$ go run -gcflags "-m -l" cky.go        # 变量逃逸分析
```

- `-m` 表示进行内存分配分析
- `-l` 表示避免程序内联，也就是避免进行程序优化

### 作用域

```go
x := "hello!"

for _, x := range x {
    x := x + 'A' - 'a'
    fmt.Printf("%c", x)
}

for i := 0; i < len(x); i++ {
    x := x[i]
    if x != '!' {
        x := x + 'A' - 'a'
        fmt.Printf("%c", x)
    }
}
```

#### 分支语句

```go
if x < 0 {
    return sqrt(-x) + "i"
}

// 带一个作用域为 if 块的前置语句
if v := math.Pow(x, n); v < 100 {
    return true
} else {
    return false
}
```

#### 多分支 switch 

```go
// 1. 可以前置一个作用域为 switch 块的 前置语句
switch today := time.Now().Weekday(); time.Saturday {
    case today + 0:             // 2. 只要求为可求值的表达式、函数、基本类型
        fmt.Println("Today.")   // 3. 自动 break
    case today + 1:
        fmt.Println("Tomorrow.")
    default:
        fmt.Println("Too far away.")
}

// 多个 case 要放在一起的时候
var a = "mum"
switch a {
    case "mum", "daddy":
        fmt.Println("family")
}
```

```go
// 分支表达式 语法
switch t := time.Now(); {
    case t.Hour() < 12:
        fmt.Println("Good morning!")
    case t.Hour() < 17:
        fmt.Println("Good afternoon.")
    default:
        fmt.Println("Good evening.")
}
```

#### Loop 循环

```go
sum := 0
for i := 0; i < 10; i++ {       // 正常 for
    sum += i
}

for sum < 1000 {                // 等价于 C 的 while( sum < 1000 )
    sum += sum
}

for {                           // 死循环
    // ...
}
```

#### goto 语句

与`C`语言保持一致，用来集中处理重复错误，或者直接跳出内层循环，都比较方便。

```go
for x := 0; x < 10; x++ {
    for y := 0; y < 10; y++ {
        if y == 2 {
            goto breakHere // 跳转到标签
        }
    }
}
return // 手动返回, 避免执行进入标签

breakHere:
    fmt.Println("done")
```

#### defer 栈

用于推迟语句到 **函数退出前**，使用在释放资源语句上，还蛮合适的 ^_^

```go
func main() {
		defer fmt.Printf("nice to meet you \n")     // 函数退出前 执行
		defer fmt.Printf("world ")                  // 函数退出前 执行
		fmt.Printf("hello ")
}
// hello world nice to meet you 
```

#### 指针

`Go` 指针 最大的特点就是取消了 指针运算，其他方面和 `C` 差不多。

```go
i := 42             // 普通变量
var p *int;         // 声明 int 指针
p = &i              // p 指向 i
*p = 21             // 通过 p 改变 i
fmt.Println( *p );  // 通过 p 访问 i
```

### 接口

```go
type Talk interface {       // 新接口 Talk
    Hello( userName string ) string
    Talk( heard string ) ( saying string, end bool, err error )
}

type myTalk string          // 新类型 myTalk
func (talk *myTalk) Hello( userName string ) string {
    // ...
}
func (talk *myTalk) Talk( heard string ) (saying string, end bool, err error) {
    // ...
}
// 实现了 Hello() 和 Talk() 两个函数后，myTalk 类型自动成为了 Talk 接口的实现
```

```go
func producer(header string, channel chan<- string) {
    for {
        channel <- fmt.Sprintf("%s: %v", header, rand.Int31())
        time.Sleep(time.Second)
    }
}
func customer(channel <-chan string) {
    for{
        message := <-channel    // 从通道中取出数据, 此处会阻塞直到信道中返回数据
        fmt.Println(message)
    }
}
func main() {
    channel := make(chan string)    // 创建一个字符串类型的通道
    
    go producer("cat", channel)     // 创建producer()函数的并发goroutine
    go producer("dog", channel)     // 创建producer()函数的并发goroutine
    
    customer(channel)               // 数据消费函数
}
```
