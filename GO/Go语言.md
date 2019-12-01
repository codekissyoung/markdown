# Go语言

是对`C`的重大改进，提供了强大的网络编程和并发编程支持，至力于做到快速编译，高效执行，易于开发。没有类和继承，通过`interface`来实现多态性。轻量级类型系统。

## 安装配置

[Go语言官网](https://golang.google.cn/)

```bash
$ wget https://dl.google.com/go/go1.13.4.linux-amd64.tar.gz
# 解压后移动到 /usr/local/go

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

## 基本

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

## go 语句、channel、同步方法





