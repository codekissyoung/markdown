# Go语言

`Go` 是为了解决 多核 和 网络化环境 下的复杂的编程问题而开发的语言．

`communicating sequential processes` 简称 `CSP` 顺序通信进程．在 `CSP` 中，程序是一组中间没有共享状态的平行运行的处理过程，它们之间使用 `Pipe` 进行通信和控制同步．

拥有：类型系统，自动垃圾回收，`Package`系统， 函数作为一等公民，词法作用域，系统调用接口，只读`utf-8`字符串．

放弃：隐式数据转换，类系统，运算符重载，默认参数，继承，泛函数，异常，宏，函数修饰，线程局部存储．

[Go语言官网](https://golang.google.cn/)
[Go代码包文档](http://godoc.org)
[搜索Go语言项目](https://gowalker.org/)

## 安装配置

```bash
$ wget https://dl.google.com/go/go1.13.4.linux-amd64.tar.gz  # 解压后移动到 /usr/local/go
export GOROOT=/usr/local/go
export GOPATH=~/go                  # 工作区
＂export GOBIN=~/bin                # go install 保存的可执行文件路径
export PATH=$PATH:$GOROOT/bin:$GOBIN
```

```go
package main
import "fmt"
import "math/rand"
func main() {
    fmt.Printf("hello, world\n")
    fmt.Println("My favorite number is", rand.Intn(10))
}
```

```bash
$ cd $HOME/go/src/hello
$ go build
$ tree
.                       # 工作区
├── bin
├── pkg
└── src                 # src 目录下，一个子目录 就是一个项目
    └── hello           # hellworld 项目
        ├── hello       # 可执行文件
        └── hello.go    # hello world 命令源码文件
$ ./hello
hello, world
```

## 1. 基础

#### 声明变量

```go
var x int, y int
var x, y int                                // 简写形式
var i, j int = 1, 2                         // 指定类型 赋值
var c, python, java = true, false, "no!"    // 从初始值中推导出 类型
c, python, java := true, false, "no!"       // 等价上句，类型推导 赋值　
var (                                       // 多个不同类型变量
	ToBe   bool       = false
	MaxInt uint64     = 1<<64 - 1
	z      complex128 = -5 + 12i
)
```

变量的生存周期：对于包一级声明的变量，生存期和整个程序运行周期一致．对于局部变量，从该变量声明开始，到该变量不再被引用，被自动回收后结束．

无论是 `var` 还是 `new` 声明，都是由 `Go` 编译器自动选择将变量存储在＂栈＂还是＂堆＂．

PS : `:=` 用在可以从右值（表达式, 函数） 推导出 类型 的场合，但由于 Go 的编译器规定 函数外的 所有语句 都要从 关键字 开始，所以 `:=` 不能在函数外使用

## 函数返回值

```go
func add(x, y int) int { // 返回一个 int
	return x + y
}

func swap(x, y string) (string, string) { // 返回两个 string
	return y, x
}

a, b := swap("hello", "world") // a b 分别接收函数返回值
```

如果给返回值命名，则可以直接在函数内部赋值，作为返回．非常好用的设计 ^_^

```go
func my_division(sum, num int) ( quotient int, remainder int ) {
	quotient  = sum / num;
	remainder = sum % num;
	return
}
a, b := my_division( 38, 10 );
fmt.Println( "38 / 10 =  ", a, ".......", b ); // 38 / 10 =   3 ....... 8
```

和 C 语言有很大的不同，返回 函数 中局部变量的地址是安全的 o_o，局部变量不在栈内存？！！

```go
func main() {
    var p = f() 
    fmt.Println( *p )
}
func f() *int {
    var v = 1 
    return &v
}
```

#### 基本类型

初始化的变量，默认为所属类型的“零值”。

不同基本类型的变量之间的赋值，要通过**显示强制转换**，没有隐式转换 ^_^

```go
bool   // 零值 false
string // 零值 ""
int  int8  int16  int32  int64 uint uint8/byte uint16 uint32 uint64 uintptr // 零值 0
rune // int32 的别名 表示一个 Unicode 码点
float32 float64             // 浮点数
complex64 complex128        // 复数

array struct string         // 其他值类型

slice map chan              // 应用类型

interface                   // 接口类型

func()                      // 函数类型
```

#### 分支语句

相比于 `C`, `Go` 的 `if` 去掉了括号，可以在 判断语句 前加一个 作用域 仅限于 分支内 语句。

```go
if x < 0 { // 正常 if
    return sqrt(-x) + "i"
}

if v := math.Pow(x, n); v < 100 { // 带 语句 的 if
    return true
} else {
    return false
}
```

#### 多分支 switch 

相比较 `C`，`Go` 的 `switch` 语句有以下特点：

- 匹配的 `case` 执行完后，自动`break`，不需要手动 `break` ^_^
- 可以前置一个 作用域 限于 `switch` 的简单语句
- `case` 后只要求是一个**可求值**的表达式，所以可以是基本类型、表达式、函数等

```go
switch os := runtime.GOOS; os {
    case "darwin":
        fmt.Println("OS X.")
    default:
        fmt.Printf("%s.\n", os)
}
switch today := time.Now().Weekday(); time.Saturday {
    case today + 0:
        fmt.Println("Today.")
    case today + 1:
        fmt.Println("Tomorrow.")
    default:
        fmt.Println("Too far away.")
}
```

`switch` 还有一种没有 "判定变量" 的变形用法，它根据表达式求值是否为 `true` 来执行相应 `case`．这种用法能将 `if - else if - else` 这样子的语句改写地更清晰 ^_^

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

#### 循环

`go` 只提供 `for` 这一个关键字, 相比于 `C`, 少了个括号，但是 `for`的使用有三种变形：

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

#### 结构体

```go
type Vertex struct { // 定义
    X int
    Y int
}

v := Vertex{ 4, 5 }             // 结构体 变量
v2 := Vertex {X: 1}             // Y 成员为 零值
v3 := Vertex {}                 // X 与 Y 都是 零值  
fmt.Println( Vertex { 1, 2 } )  // 字面量
v.Y = 100                       // 访问 成员

p := &v                         // 指向结构体 指针     
p.X = 23                        // 指针 访问 成员

p := &Vertex {1, 2}            // 指针 直接指向 字面量
```

PS: 变量 与 指针 都是通过 `.` 访问结构体成员，这样设计是 好？还是不好？

#### 数组

```go
var a [10]int
var b [2]string
b[0] = "Hello"
b[1] = "World"
primes := [6]int { 2, 3, 5, 7, 11, 13 }
```

#### 切片 Slice

切片是从数组中划定的 `a[low:high]` 左开右闭区间，本身不存储任何数据。修改切片中的元素，等价于修改底层数组中对应的元素。

如果不写`low`或者`high`，则会自动取值 `0` 和 数组长度。比如 `a[:8]` 等价于 `a[0:8]`。

- 切片零值： `nil`
- 切片长度：包含的元素个数，`len(s)` 获得 
- 切片容量：从第一个元素开始数，到其底层数组元素末尾的个数，`cap(s)` 获得
- `make(切片类型， 长度[， 容量])` 创建切片
- `append(s, 元素 ... )` 往切片追加值 

```go
abc := []int{2, 3, 5, 7, 11, 13}            // 直接定义，底层实际构建了一个数组

edf := make([]int, 5)                       // [0, 0, 0, 0, 0]

primes := [6]int{2, 3, 5, 7, 11, 13}        // 数组

s := primes[1:4]                            // s len=3 cap=5 [3 5 7] 从数组中划定 切片

s = s[2:5]                                  // s len=3 cap=3 [7 11 13] 基于s, 重新划定范围

s = append( s, 7, 8, 9, 10, 11 )            // s len=8 cap=8 [7 11 13 7 8 9 10 11]

fmt.Println( primes )                       // [2 3 5 7 11 13] 原数组并没有改变

func printSlice( s string, x []int ) {
	fmt.Printf("%s len=%d cap=%d %v\n", s, len(x), cap(x), x)
}
```

PS：当切片的底层数组大小不足，容不下追加的值时，`Go`底层会分配一个更大的数组，然后将数据复制一份到新数组上。最后，返回的是新数组上的切片 ^_^

#### Map

- 零值为 `nil`
- `make(类型)` 返回给定类型的映射，并初始化。

```go
type Vertex struct {
	Lat, Long float64
}

m := map [string] Vertex{                           // from stack
    "Bell Labs": { 40.68433, -74.39967 },
    "Google": { 37.42202, -122.08408 },
}

m := make( map[string]Vertex )                      // from heap
m["Bell Labs"] = Vertex{ 40.68433, -74.39967 }

m[key] = elem           // 修改
a = m[key]              // 获取
b, ok = m[key]          // 如果 key 在 m 中，则 ok 为 true；否则 ok 为 false, b 为零值
delete( m, key )        // 删除元素
```

#### 遍历 For Range

用于遍历 `Array` `Slice` 和 `Map`。

```go
pow := []int {1, 2, 4, 8, 16, 32, 64, 128}
for i, v := range pow {                 // 依次将下标 和 值 复制 给 i 和 v
    fmt.Printf("pow[%d] = %d\n", i, v)
}
for _, v := range pow { ... }           // 不复制 下标
for i, _ := range pow { ... }           // 不复制 值
for i := range pow { ... }              // 不复制 值，简写版
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

#### 闭包 后续再补充

闭包是一个函数，它引用了其函数体之外的变量。该函数可以访问并赋予其引用的变量的值，换句话说，该函数被这些变量“绑定”在一起。

```go
func adder() func(int) int {
	sum := 0
	return func(x int) int { // 每个返回的 函数 都绑定了 各自的 sum 变量
		sum += x             // 主动捕获了外部的 sum，绑定到了 return 的 func 上
		return sum
	}
}
func main() {
	pos, neg := adder(), adder()
	for i := 0; i < 10; i++ {
		fmt.Println( pos(i), neg( -2 * i ))
	}
}
```

闭包实现 斐波纳契数列 

```go 
func fibonacci() func() int {
	n1, n2, cnt := 0, 1, 0
	return func() int {
		cnt ++;
		switch cnt {
			case 1:
				return n1
			case 2:
				return n2
			default:
				sum := n1 + n2
				n1, n2 = n2, sum 
				return sum
		}
	}
}
func main() {
	f := fibonacci()
	for i := 0; i < 10; i++ {
		fmt.Println(f())
	}
}
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

只有 package 名称为 main 的包可以包含 main 函数
一个可执行程序 有且仅有 一个 main 包

通过 type 关键字来进行结构(struct)或接口(interface)的声明
通过 func 关键字来进行函数的声明

可见性规则

Go语言中，使用 大小写 来决定该 常量、变量、类型、接口、结构、函数是否可以被外部包所调用：根据约定，函数名首字母 小写 即为private

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

## go 命令

```bash
$ go get：获取远程包（需 提前安装 git或hg）
$ go run：直接运行程序
$ go build：测试编译，检查是否有编译错误
$ go fmt：格式化源码（部分IDE在保存时自动调用）
$ go install：编译包文件并编译整个程序
$ go test：运行测试文件
$ go doc：查看文档
```