# Go语言

`CSP`（`communicating sequential processes` 顺序通信进程）：进程是一组中间没有共享状态的平行运行的处理过程，进程间使用 `Pipe` 进行通信和控制同步．

拥有：类型系统 自动垃圾回收 `Package`系统 函数作为一等公民 词法作用域 系统调用接口 只读`utf-8`字符串

放弃：隐式数据转换，类系统，运算符重载，默认参数，继承，泛函数，异常，宏，函数修饰，线程局部存储．

[Go语言官网](https://golang.google.cn/)
[Go代码包文档](http://godoc.org)
[搜索Go语言项目](https://gowalker.org/)
[Go语言入门教程](http://c.biancheng.net/golang/)

## 基础

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

#### 为 结构体 绑定 方法

`Go` 没有类，也没有对象，但是 `object.func()` 这样的方式，又很具有表达力．所以 `Go` 采用了＂为结构体绑定方法＂这一设计．

方法可以理解为一个特别的函数，该函数的默认入参是：当前结构体变量，为了和其他入参区分开，结构体入参位置在 函数名 前面 ^_^

```go
type Vertex struct {
	X, Y float64
}
func ( v Vertex ) Abs() float64 { // 入参是 普通结构体变量, 是当前结构体的副本
	return math.Sqrt( v.X * v.X + v.Y * v.Y)
}
func ( v *Vertex ) Scale(f float64) { // 入参 是 结构体指针，方法内部可直接修改 当前结构体
	v.X *= f
	v.Y *= f
}
// 等价的函数实现:
func Abs( v Vertex ) float64 {
	return math.Sqrt( v.X * v.X + v.Y * v.Y )
}
func Scale( v *Vertex, f float64 ) {
	v.X *= f
	v.Y *= f
}
func main() {
	v := Vertex{3, 4}
	v.Scale( 2 )
	fmt.Println( v ) 			// { 6, 8 }
}
```

```go
func main() {
    v := Vertex{ 3, 4 }
    fmt.Println( v.Abs() )		// 5
	Scale( &v, 10 )
	fmt.Println(Abs(v))         // 50
}
```

通过 `Scale( &v, 10 )` 我能明确知道，`v` 是通过指针传递的，`Scale()` 内部是可以直接修改 `v` 

而通过 `v.Scale( 2 )` 我在不知道 `Scale` 的 声明/实现 的情况下，无法确认 `Scale()` 会不会直接修改 `v`

再看下 结构体指针 调用方法的情况：

```go
v := Vertex{3, 4}
p := &v
Scale( v, 10 )	    // cannot use v (type Vertex) as type *Vertex in argument to Scale
Scale( &v, 10 )     // ok
Scale( p, 10 )      // ok
v.Scale( 10 )       // ok
(&v).Scale( 10 )    // ok
p.Scale( 10 )       // ok
fmt.Println( v, p )
```

对于 `Scale( v, 10 )` ，会因为　＂函数参数类型检查不一致＂ 而报错

但是对于 `v.Scale( 10 )` `(&v).Scale( 10 )` `p.Scale( 10 )` 在 `Go` 语言中都是正确的调用写法，并且`Go`内部将它们视为相同的操作，是等价的 ^_^

再来观察下:

```go
func main() {
	v := Vertex{3, 4}
    p := &v
    fmt.Println( Abs(v) )  // 5
	fmt.Println( Abs(&v) ) // cannot use &v (type *Vertex) as type Vertex in argument to Abs
	fmt.Println( Abs(p) )  // cannot use p (type *Vertex) as type Vertex in argument to Abs
	fmt.Println( v.Abs() )   // 5
	fmt.Println( (*p).Abs() )// 5
	fmt.Println( p.Abs() )   // 5
}
```

对于 `Abs( &v )` `Abs( p )` 会因为　＂函数参数类型检查不一致＂ 而报错

而`v.Abs()` `(*p).Abs()` `p.Abs()` 在 `Go` 语言中都是正确的调用写法，并且`Go`内部将它们视为相同的操作，是等价的 ^_^

PS: 这种为了方便而牺牲 "一致性" 和 ＂类型检查＂ 的做法是 **利大于弊** 的么？

### 接口

[Go靠谱书推荐](https://www.zhihu.com/question/30461290)

```go
package main
import (
        "fmt"
        "math/rand"
        "time"
)

func producer(header string, channel chan<- string) {
     for {
            channel <- fmt.Sprintf("%s: %v", header, rand.Int31())
            time.Sleep(time.Second)
        }
}

func customer(channel <-chan string) {
     for {
            message := <-channel    // 从通道中取出数据, 此处会阻塞直到信道中返回数据
            fmt.Println(message)
        }
}

func main() {
    // 创建一个字符串类型的通道
    channel := make(chan string)
    // 创建producer()函数的并发goroutine
    go producer("cat", channel)
    go producer("dog", channel)
    // 数据消费函数
    customer(channel)
}
```

#### 接口类型

定义一组行为，由方法表示。

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


只有 package 名称为 main 的包可以包含 main 函数
一个可执行程序 有且仅有 一个 main 包

通过 type 关键字来进行结构(struct)或接口(interface)的声明
通过 func 关键字来进行函数的声明

可见性规则

Go语言中，使用 大小写 来决定该 常量、变量、类型、接口、结构、函数是否可以被外部包所调用：根据约定，函数名首字母 小写 即为private

首字母大写，包外可见，首字母小写，只在包内可见。

`{` 不能单独放在一行。

同一个文件夹下的源码文件，只能在一个包名下。

`type` 放在变量的后面。

Goroutine？是啥？从根本上将一切都并发化，用类协程的方式来处理并发单元，却又在运行时层面做了更深度的优化处理。这使得语法上的并发编程变得极为容易，无须处理回调，无须关注线程切换，仅一个关键字，简单而自然。
goroutine 类似于线程，但并非线程。可以将 goroutine 理解为一种虚拟线程。Go语言运行时会参与调度 goroutine，并将 goroutine 合理地分配到每个 CPU 中，最大限度地使用 CPU 性能。
多个 goroutine 中，Go语言使用通道（channel）进行通信，通道是一种内置的数据结构，可以让用户在不同的 goroutine 之间同步发送具有类型的消息。这让编程模型更倾向于在 goroutine 之间发送消息，而不是让多个 goroutine 争夺同一个数据的使用权。

程序可以将需要并发的环节设计为生产者模式和消费者的模式，将数据放入通道。通道另外一端的代码将这些数据进行并发计算并返回结果

搭配 channel，实现 CSP 模型。将并发单元间的数据耦合拆解开来，各司其职，这对所有纠结于内存共享、锁粒度的开发人员都是一个可期盼的解脱。若说有所不足，那就是应该有个更大的计划，将通信从进程内拓展到进程外，实现真正意义上的分布式。

如何实现高并发下的内存分配和管理就是个难题。好在 Go 选择了 tcmalloc，它本就是为并发而设计的高性能内存分配组件。使用 cache 为当前执行线程提供无锁分配，多个 central 在不同线程间平衡内存单元复用。在更高层次里，heap 则管理着大块内存，用以切分成不同等级的复用内存块。快速分配和二级内存平衡机制，让内存分配器能优秀地完成高压力下的内存管理任务。

它会竭力将对象分配在栈上，以降低垃圾回收压力，减少管理消耗，提升执行性能。可以说，除偶尔因性能问题而被迫采用对象池和自主内存管理外，我们基本无须参与内存管理操作。

因指针的存在，所以回收内存不能做收缩处理。幸好，指针运算被阻止，否则要做到精确回收都难。


## go 语句、channel、同步方法

