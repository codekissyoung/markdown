# Go语言

是对`C`的重大改进，提供了强大的网络编程和并发编程支持，至力于做到快速编译，高效执行，易于开发。没有类和继承，通过`interface`来实现多态性。轻量级类型系统。

[Go语言官网](https://golang.google.cn/)

## 安装配置

```bash
$ wget https://dl.google.com/go/go1.13.4.linux-amd64.tar.gz  # 解压后移动到 /usr/local/go
export GOROOT=/usr/local/go
export GOPATH=~/go:~/workspace/go   # 工作区的集合
export GOBIN=~/bin                  # 放置Go可执行程序的目录
export PATH=$PATH:$GOROOT/bin:$GOBIN
```

```bash
./
src/        # 源代码目录
pkg/        # 代码包目录
bin/        # 未设置 GOBIN 时，有用
```

默认工作目录：`mkdir -p ~/go/src/hello`

```go
// hello.go
package main
import "fmt"
func main() {
	fmt.Printf("hello, world\n")
}
```

编译与运行:
```bash
$ cd $HOME/go/src/hello
$ go build
$ ./hello
hello, world
```

## 1. 基础

每个 `Go` 程序由多个 `Package` 构成，从 `main` 函数处开始运行。

```go
package main
import (
	"fmt"
	"math/rand"
)
func main() {
	fmt.Println("My favorite number is", rand.Intn(10))
}
```

一个 `Package` 里面，函数名字第一个字母大写，表示暴露给外界调用，除此之外，所有变量与函数都只在 `Package` 内部可用。

#### 声明变量

[为什么Go的变量声明顺序要和C相反?](https://blog.go-zh.org/gos-declaration-syntax)

```go
var x int, y int
var x, y int                                // 简写形式
var c, python, java bool                    // 指定类型，声明多个变量
var i, j int = 1, 2                         // 指定类型，声明多个变量 并且赋值
var c, python, java = true, false, "no!"    // 声明多个变量，类型从初始值中推导出来

// := 赋值使用在 可以从 = 号后面的 右值（表达式, 函数） 推导出 类型 的场合, 最大化 简化 代码
// 但是有个限制，由于 Go 的编译器规定 函数外的 所有语句 都要从 关键字 开始
// 所以 := 不能在函数外部使用 

c, python, java := true, false, "no!"

// 多个连续不同类型的 变量声明 可以 这样写
var (
	ToBe   bool       = false
	MaxInt uint64     = 1<<64 - 1
	z      complex128 = -5 + 12i
)
```

函数的返回值的位置，以及函数返回多个值，以及接收函数返回值的写法：

```go
func add(x, y int) int {                    // 返回一个 int
	return x + y
}

func swap(x, y string) (string, string) {   // 返回两个 string
	return y, x
}

// a b 分别接收函数返回值， := 语法表示 a, b 的类型由 编译器根据 所调函数 推导出来
a, b := swap("hello", "world")
```

函数返回值如果指定名字，还可以直接在函数内部赋值，这个设计非常实用：

```go
func my_division(sum, num int) ( quotient, remainder int ) {
	quotient  = sum / num;
	remainder = sum % num;
	return
}
a, b := my_division( 38, 10 );
fmt.Println( "38 / 10 =  ", a, ".......", b ); // 38 / 10 =   3 ....... 8
```

#### 基本类型

未初始化的类型，都会默认赋予一个“零值”。与 `C` 不同，不同基本类型之间的赋值，一定要通过显示的强制转换。没有隐式转换！！！没有隐式转换！！！没有隐式转换！！！

```go
bool                                        // 零值 为 false

string                                      // 零值 为 "" 空字符串

int  int8  int16  int32  int64
uint uint8 uint16 uint32 uint64 uintptr     // 零值为 0

byte // uint8 的别名

rune // int32 的别名 表示一个 Unicode 码点

float32 float64

complex64 complex128

// 强制类型转换
i := 42
f := float64(i)
u := uint(f)
```

#### 循环

`go` 只提供这 `for` 循环结构, 相比于 `C`, 少了个括号，其他性质一致。

- 但是，又可以去掉 前置语句 和 后置语句 当作 `while` 使用
- 还可以继续去掉 条件判断，用作 死循环

```go
sum := 0
for i := 0; i < 10; i++ {       // 正常 for
    sum += i
}

sum := 1
for sum < 1000 {                // 等价于 while( sum < 1000 )
    sum += sum
}
fmt.Println(sum)

for {                           // 死循环
    // ...
}
```

#### 分支语句

相比于 `C`, `Go` 的 `if` 去掉了括号，并且可以在 判断语句 前加一个 作用域 仅限于 `if` `else` 的简单语句。

```go
if x < 0 {                              // 正常 if
    return sqrt(-x) + "i"
}

if v := math.Pow(x, n); v < 100{        // 带 简单语句 的 if
    return true
} else {
    return false
}
```

#### switch 多分支语句

相比较 `C`，`Go` 的 `switch` 语句有以下特点：

- 自动在每个 `case` 加上了 `break`，所以命中后，只会执行一个 `case`
- `case` 的值不要求为 整数 和 常量，可以是任何 `Go` 的基本类型、表达式、函数等
- 可以在 判定变量 之前 加一个 作用域 限于 `switch` 的简单语句

```go
switch os := runtime.GOOS; os {
    case "darwin":
        fmt.Println("OS X.")
    case "linux":
        fmt.Println("Linux.")
    default:
        fmt.Printf("%s.\n", os)
}
switch today := time.Now().Weekday(); time.Saturday {
    case today + 0:
        fmt.Println("Today.")
    case today + 1:
        fmt.Println("Tomorrow.")
    case today + 2:
        fmt.Println("In two days.")
    default:
        fmt.Println("Too far away.")
}
```

没有 判定 条件的 `switch` 能将 `if - else if - else` 这样子的语句改写地更清晰：

```go
switch t := time.Now(); {
    case t.Hour() < 12:
        fmt.Println("Good morning!")
    case t.Hour() < 17:
        fmt.Println("Good afternoon.")
    default:
        fmt.Println("Good evening.")
}
```

#### defer 栈

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
var p *int;         // 声明一个 int 指针
p = &i              // p 指向 i
fmt.Println( *p );  // 通过 p 访问 i
*p = 21             // 通过 p 改变 i
```

#### 结构体

```go
// 定义结构体
type Vertex struct {
    X int
    Y int
}

fmt.Println( Vertex { 1, 2 } ) // 结构体 字面量 { 1, 2 }

// . 访问 结构体 的 字段
v := Vertex{ 4, 5 }
v.Y = 100
fmt.Println (v.X )

// 使用指针 访问 结构体 的 字段
p := &v     
p.X = 23
fmt.Println( v );
```

与`C`不同，通过指针访问结构体，仍然是 `.` ，而不是 `->`。常用的定义结构体变量的写法：

```go
v1 := Vertex {1, 2}  // 创建一个 Vertex 类型的结构体
v2 := Vertex {X: 1}  // Y:0 被隐式地赋予
v3 := Vertex {}      // X:0 Y:0
p  := &Vertex {1, 2} // 创建一个 *Vertex 类型的结构体（指针）
```

#### 数组

```go
var a [10]int
var b [2]string
b[0] = "Hello"
b[1] = "World"
primes := [6]int { 2, 3, 5, 7, 11, 13 }
```

#### 切片

切片本身不存储任何数据，它是从数组中划定的 `a[low:high]` 左开右闭区间。修改切片中的元素，会修改其底层数组中对应的元素。如果不写`low`或者`high`，则会自动取值 `0` 和 数组长度。比如 `a[:8]` 等价于 `a[0:8]`。

- 切片的长度就是它所包含的元素个数，通过 `len(s)` 获得 
- 切片的容量是从它的第一个元素开始数，到其底层数组元素末尾的个数，通过 `cap(s)` 获得
- 零值为 `nil`
- `make(切片类型， 长度[， 容量])` 创建切片
- `append(s, 元素 ... )`  当 `s` 的底层数组不足以容纳所有给定的值时，它就会分配一个更大的数组。返回的切片会指向这个新分配的数组。

```go
abc := []int{2, 3, 5, 7, 11, 13}            // 直接定义，底层实际构建了一个数组

edf := make([]int, 5)                       // [0, 0, 0, 0, 0]

primes := [6]int{2, 3, 5, 7, 11, 13}
s := primes[1:4]                            // s len=3 cap=5 [3 5 7] 从别的数组中引用

s = s[2:5]                                  // s len=3 cap=3 [7 11 13] 基于s, 重新划定范围

s = append( s, 7, 8, 9, 10, 11 )            // s len=8 cap=8 [7 11 13 7 8 9 10 11]

fmt.Println( primes )                       // [2 3 5 7 11 13] 原数组并没有改变

func printSlice( s string, x []int ) {
	fmt.Printf("%s len=%d cap=%d %v\n", s, len(x), cap(x), x)
}
```

#### For Range 操作

用于遍历 `Slice` 和 `Set`。

```go
pow := []int {1, 2, 4, 8, 16, 32, 64, 128}
for i, v := range pow {
    fmt.Printf("pow[%d] = %d\n", i, v)
}

for _, v := range pow {         // 忽略索引
    // ...
}

for i : = range pow {           // 忽略下标
    // ...    
}
```

#### 映射 \ 集合 \ Set

- 零值为 `nil`
- `make(类型)` 返回给定类型的映射，并初始化。

```go
// 地名 => 经纬度
type Vertex struct {
	Lat, Long float64
}

// 从栈上创建
var m = map[string]Vertex{
	"Bell Labs": { 40.68433, -74.39967 },
	"Google": { 37.42202, -122.08408 }
}

// 使用 make 函数，从堆上创建
var m map[string]Vertex = make( map[string]Vertex )
m["Bell Labs"] = Vertex{
    40.68433, -74.39967,
}
fmt.Println( m["Bell Labs"] )

m[key] = elem           // 修改
a = m[key]              // 获取
b, ok = m[key]          // 如果 key 在 m 中，则 ok 为 true；否则 ok 为 false, b 为零值
delete( m, key )        // 删除元素
```

#### 函数

函数也是值，也可以作为 参数 和 返回值。

```go
func compute(fn func(float64, float64) float64) float64 {
	return fn(3, 4)
}
func main() {
	hypot := func(x, y float64) float64 {
		return math.Sqrt(x*x + y*y)
	}
	fmt.Println(hypot(5, 12))
	fmt.Println(compute(hypot))
	fmt.Println(compute(math.Pow))
}
```

#### 闭包

闭包是一个函数值，它引用了其函数体之外的变量。该函数可以访问并赋予其引用的变量的值，换句话说，该函数被这些变量“绑定”在一起。

```go
func adder() func(int) int {
	sum := 0
	return func(x int) int {            // 每个返回的 函数 都绑定了 各自的 sum 变量
		sum += x
		return sum
	}
}
func main() {
	pos, neg := adder(), adder()
	for i := 0; i < 10; i++ {
		fmt.Println( pos(i), neg(-2*i))
	}
}
```

[Go看到这里](https://tour.go-zh.org/methods/1)
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

#### 类型断言

```go
var i1 I1
var ok bool
i1, ok = interface{}(v1).(I1)   // 平行赋值

// 技巧1: 如果在声明变量的同时进行赋值，那么等号左边类型可以省略
var i1, ok = interface{}(v1).(I1)

// 技巧2: 短变量声明
i1, ok := interface{}(v1).(I1)
```

#### 数组

```go
var ipv4 [4]uint8 = [4]uint8{192, 168, 0, 1}

// 技巧1: 省略变量名后面的类型
var ipv4 = [4]uint8{192, 168, 0, 1}

// 技巧2: 由编译器自己计算长度
var ipv4 = [...]uint8{192, 168, 0, 1}
```

#### 切片

```go
var ips = []string{ "192.168.0.1", "192.168.0.2", "192.168.0.3" }

ips = append(ips, "192.168.0.4");

ips = make([]string, 100);
```

#### 字典

```go
var ipSwitches = map[string]bool {}

ipSwitchs["192.168.0.1"] = true

delete(ipSwitchs, "192.168.0.1")
```

#### 函数是一等公民

```go
// 普通函数
func divide(dividend int, divisor int) (result int, err error) {
    if divisor == 0 {
        err = errors.New("division by zero")
        return
    }
    result = dividend / divisor
    return
}

// 函数作为参数
type binaryOperation func(op1 int, op2 int) (result int, err error)
func operate(op1 int, op2 int, bop binaryOperation) (result int, err error){
    if bop == nil {
        err = errors.New("invalid binary operation function");
        return
    }
    return bop(op1, op2)
}

// 方法: 与某个数据类型绑定在一起的函数

// 临时变量
type myInt int;
func (i myInt) add( another int ) myInt {
    i = i + myInt(another)
    return i
}

i1 := myInt(1)
i2 := i1.add(2)
fmt.Println(i1, i2) // 1 3

// 指针
func (i *myInt) add( another int ) myInt {
    *i = *i + myInt(another)
    return *i
}
i1 := myInt(1)
i2 := i1.add(2)
fmt.Println(i1, i2) // 3 3
```

#### 接口类型

定义一组行为，由方法表示。

```go
// 声明接口
type Talk interface {
    Hello( userName string ) string
    Talk( heard string ) ( saying string, end bool, err error )
}

// 实现了接口的 自定义类型
type myTalk string

func (talk *myTalk) Hello( userName string ) string {
    // 代码实现
}

func (talk *myTalk) Talk( heard string ) (saying string, end bool, err error) {
    // 代码实现
}
```

#### 结构体

```go
type simpleCN struct{
    name string
    talk Talk
}
```

首字母大写，包外可见，首字母小写，只在包内可见。

`{` 不能单独放在一行。

同一个文件夹下的源码文件，只能在一个包名下。

不使用`;`。

`+`用于字符串连接。

`type` 放在变量的后面。

Goroutine？是啥？从根本上将一切都并发化，用类协程的方式来处理并发单元，却又在运行时层面做了更深度的优化处理。这使得语法上的并发编程变得极为容易，无须处理回调，无须关注线程切换，仅一个关键字，简单而自然。
goroutine 类似于线程，但并非线程。可以将 goroutine 理解为一种虚拟线程。Go语言运行时会参与调度 goroutine，并将 goroutine 合理地分配到每个 CPU 中，最大限度地使用 CPU 性能。
多个 goroutine 中，Go语言使用通道（channel）进行通信，通道是一种内置的数据结构，可以让用户在不同的 goroutine 之间同步发送具有类型的消息。这让编程模型更倾向于在 goroutine 之间发送消息，而不是让多个 goroutine 争夺同一个数据的使用权。

程序可以将需要并发的环节设计为生产者模式和消费者的模式，将数据放入通道。通道另外一端的代码将这些数据进行并发计算并返回结果


搭配 channel，实现 CSP 模型。将并发单元间的数据耦合拆解开来，各司其职，这对所有纠结于内存共享、锁粒度的开发人员都是一个可期盼的解脱。若说有所不足，那就是应该有个更大的计划，将通信从进程内拓展到进程外，实现真正意义上的分布式。

如何实现高并发下的内存分配和管理就是个难题。好在 Go 选择了 tcmalloc，它本就是为并发而设计的高性能内存分配组件。使用 cache 为当前执行线程提供无锁分配，多个 central 在不同线程间平衡内存单元复用。在更高层次里，heap 则管理着大块内存，用以切分成不同等级的复用内存块。快速分配和二级内存平衡机制，让内存分配器能优秀地完成高压力下的内存管理任务。

它会竭力将对象分配在栈上，以降低垃圾回收压力，减少管理消耗，提升执行性能。可以说，除偶尔因性能问题而被迫采用对象池和自主内存管理外，我们基本无须参与内存管理操作。

因指针的存在，所以回收内存不能做收缩处理。幸好，指针运算被阻止，否则要做到精确回收都难。

### 工具链

完整的工具链对于日常开发极为重要。Go 在此做得相当不错，无论是编译、格式化、错误检查、帮助文档，还是第三方包下载、更新都有对应的工具。其功能未必完善，但起码算得上简单易用。

内置完整测试框架，其中包括单元测试、性能测试、代码覆盖率、数据竞争，以及用来调优的 pprof，这些都是保障代码能正确而稳定运行的必备利器。

除此之外，还可通过环境变量输出运行时监控信息，尤其是垃圾回收和并发调度跟踪，可进一步帮助我们改进算法，获得更佳的运行期表现。


要开发出能充分利用硬件资源的应用程序是一件很难的事情。现代计算机都拥有多个核，但是大部分编程语言都没有有效的工具让程序可以轻易利用这些资源。编程时需要写大量的线程同步代码来利用多个核，很容易导致错误。Go语言从底层原生支持并发，无须第三方库，开发人员可以很轻松地在编写程序时决定怎么使用 CPU 资源。


## go 语句、channel、同步方法





