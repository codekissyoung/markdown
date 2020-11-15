# Goroutine 与 Channel

## Goroutine生命周期

- 不会引发`pannic`
- 所有的`defer()`正常执行

```go
exit := make(chan struct{})
go func() {
    defer close(exit)
    func() {
        defer func() {
            println("b", recover() == nil)
        }()
        func() {
            runtime.Goexit() // 主动退出
        }()
    }()
}()
<-exit
```



## Channel

`Channel` 是用于发送类型化数据的管道，由其负责协程之间的通信，从而避开所有由共享内存导致的陷阱；这种通过通道进行通信的方式保证了同步性。数据在通道中进行传递：在任何给定时间，一个数据被设计为只有一个协程可以对其访问，所以不会发生数据竞争。数据的所有权（可以读写数据的能力）也因此被传递。

`Channel` 的实质是类型化消息的队列：使数据得以传输。它是 FIFO 结构所以可以保证发送给他们的元素的顺序。

`Channel` 是第一类对象：可以存储在变量中，作为函数的参数传递，从函数返回以及通过通道发送它们自身。另外它们是类型化的，允许类型检查。

```go
ch := make(chan float64)　// 创建通道
defer close(ch) 					　// 关闭通道

ch <- int1   				// 流向通道（发送）
int2 = <- ch 				// 从通道流出（接收）
<- ch 									// 单独调用获取通道的（下一个）值，当前值会被丢弃
if <- ch != 1000 { 	// 取出值，然后和 1000 比较
}

// 带判断通道是否关闭的循环读取
for {
    v, ok := <-ch
    if !ok {
        break
    }
    process(v)
}

// 使用 range 则会自动检测通道是否关闭 
for input := range ch {
  	process(input)
}
```

只有在当需要告诉接收者不会再提供新的值的时候，才需要关闭通道。只有发送者需要关闭通道，接收者永远不会需要。

### 将通道限定为单向的

一般用这个限定通道方向来获得更严谨的逻辑，并且这个限定是不可逆的。

```go 
c := make(chan int)
var send chan<- int = c // 限定为只写
var recv <-chan int = c // 限定为只读

close(send) 							 // 只能close发送端
```

## 无缓冲Channel

一个无缓冲的通道在没有空间来保存数据的时候：必须要一个接收者准备好接收通道的数据然后发送者可以直接把数据发送给接收者。所以通道的发送/接收操作在对方准备好之前是阻塞的：

1. 对于同一个通道，发送操作（协程或者函数中的），在接收者准备好之前是阻塞的：如果ch中的数据无人接收，就无法再给通道传入其他数据：新的输入无法在通道非空的情况下传入。所以发送操作会等待 ch 再次变为可用状态：就是通道值被接收时（可以传入变量）。
1. 对于同一个通道，接收操作是阻塞的（协程或函数中的），直到发送者可用：如果通道中没有数据，接收者就阻塞了。



```go
func main() {
    var wg sync.WaitGroup
    wg.Add(3)
    go doSomething(1, &wg)
    go doSomething(2, &wg)
    go doSomething(3, &wg)
    wg.Wait()
}
func doSomething(id int, wg *sync.WaitGroup) {
    defer wg.Done()
    log.Printf("before do job:(%d) \n", id)
    time.Sleep(3 * time.Second)
    log.Printf("after do job:(%d) \n", id)
}
```

## Select

`select`可以随机`收`，也可以随机`发`，在任何一个 case 中执行 `break` 或者 `return`，select 就结束了。

`select` 做的就是：选择处理列出的多个通信情况中的一个。

- 如果都阻塞了，会等待直到其中一个可以处理
- 如果多个可以处理，随机选择一个
- 如果没有通道操作可以处理并且写了 `default` 语句，它就会执行：`default` 永远是可运行的（这就是准备好了，可以执行）。
> 设置为`nil`的管道，将永远堵塞，不会再参与`select`随机选取执行。

```go
a, b := make(chan int), make(chan int)
go func() {　// 接收端
    for {
        var name string
        var x int
        var ok bool
        select { // 从准备好数据的通道中，随机选取一条进行读取
            case x, ok = <-a:
            name = "from a : "
            
            case x, ok = <-b:
            name = "from b : "
            if !ok {
                b = nil
										println("b closed")
                break // 跳出这次select
            }
            
            // defalt 的加入，可以使 select 避免陷入阻塞，但注意不要引起没必要的空转
            default: 
            println("default : no channel ready")
            time.Sleep(time.Second / 5)
        }
        if !ok {
            return
        }
        println(name, x)
    }
}()

// 发送端
go func() {
    for i := 0; i < 10; i++ {
        select { // 随机写入 a 或 b，每次selec只能写入一次
            case a <- i:
            time.Sleep(time.Second)
            case b <- i * 10:
            time.Sleep(time.Second)
        }
    }
}()
```

## 超时器与间时器

```go
tick := time.Tick(3 * time.Second) // 每隔 3s，向通道中发送数据
boom := time.After(10 * time.Second) // 在10s后，向通道中发送数据
for {
    select {
    case <-tick:
        fmt.Println("tick.")
    case <-boom:
        fmt.Println("BOOM!")
        return
    default:
        fmt.Println("    .")
        time.Sleep(time.Second)
    }
}
```

取消耗时很长的同步调用

```go
ch := make(chan error, 1) // 缓冲大小设置为 1 是必要的，可以避免协程死锁以及确保超时的通道可以被垃圾回收
go func() { ch <- client.Call("Service.Method", args, &reply) } ()
select {
case resp := <-ch
    // use resp and reply
case <-time.After(timeoutNs):
    // call timed out
    break
}
```







## 优雅的关闭Channel

**The Channel Closing Principle**

1. 不要从接收端关闭 channel
1. 不要关闭有多个并发发送者的channel
1. sender是唯一 或者是channel最后一个活跃的sender，那么你应该在sender的goroutine关闭channel，从而通知 receivers 已经没有值可以读了

维持这些原则保证了:

- 永远不会发生向一个已经关闭的channel发送值(会导致panic)
- 关闭一个已经关闭的channel(会导致panic)

- Golang甚至禁止关闭 receive-only 类型的channel

#### 一发多收

这种情况下，直接在 sender 处，关闭就好

#### 多发一收

```go
func main() {
	rand.Seed(time.Now().UnixNano())
	log.SetFlags(0)
	const MaxRandomNumber = 1000
	const NumSenders = 10

	dataCh := make(chan int, 100)
	stopCh := make(chan struct{}) // 额外的一个Channel

	// senders
	for i := 0; i < NumSenders; i++ {
		go func() {
			for {
				value := rand.Intn(MaxRandomNumber)
				select {
				case <-stopCh:
					fmt.Println("got from stop, returned")
					return
				case dataCh <- value:
				}
			}
		}()
	}
	// one receiver
	go func() {
		for value := range dataCh {
			if value == MaxRandomNumber-1 {
				fmt.Println("close stopCh")
				close(stopCh) // 这个命令让所有的sender都 return 了
				fmt.Println("receiver returned")
				return // 自己再退出，这样就没有引用 dataCh 和 stopCh 的 Goroutine 了
			}
		}
	}()
	time.Sleep(1000 * time.Second)
}
```

#### 多发多收

通过一个主持人`moderator`携程，可以优雅的退出所有使用到 dataChan 的协程，从而将Channel回收

```go
func main() {
	const (
		MaxRandomNumber = 100000
		NumSenders      = 20
		NumReceivers    = 10
	)

	dataCh := make(chan int, 100) // senders 写入 receviers 接收
	stopCh := make(chan struct{}) // senders 与 receviers 监听, 收到后退出协程
	// moderator 监听，senders 与 receviers 都可以写入
	// 收到后，关闭所有 senders 和 receviers
	toStop := make(chan string, 1)

	// moderator
	go func() {
		<-toStop
		close(stopCh)
	}()

	// senders
	for i := 0; i < NumSenders; i++ {
		go func(id string) {
			for {
				value := rand.Intn(MaxRandomNumber)
				if value == 0 {
					select {
					case toStop <- "sender#" + id:
					default:
					}
					return
				}
				select {
				case <-stopCh:
					return
				default:
				}

				select {
				case <-stopCh:
					return
				case dataCh <- value:
				}
			}
		}(strconv.Itoa(i))
	}

	// receivers
	for i := 0; i < NumReceivers; i++ {
		go func(id string) {
			for {
				select {
				case <-stopCh:
					return
				default:
				}

				select {
				case <-stopCh:
					return
				case value := <-dataCh:
					if value == MaxRandomNumber-1 {
						select {
						case toStop <- "receiver#" + id:
						default:
						}
						return
					}
				}
			}
		}(strconv.Itoa(i))
	}

	time.Sleep(1000 * time.Second)
}
```

## 通道工厂模式

不将通道作为参数传递给协程，而用函数来生成一个通道并返回（工厂角色）；函数内有个匿名函数被协程调用。

```go
func main() {
	stream := pump()
	go suck(stream)
	time.Sleep(1e9)
}

func pump() chan int {
	ch := make(chan int)
	go func() {
		for i := 0; ; i++ {
			ch <- i
		}
	}()
	return ch
}

func suck(ch chan int) {
	for {
		fmt.Println(<-ch)
	}
}
```

## Feature 模式

```go
func main() {
    retCh := AsyncService() // 下面两句 并行执行
    otherTask()
    
    select { // 等待 第一句的结果，并且有超时机制
        case ret := <-retCh:
        fmt.Println("get from retCh : ", ret)
        case <-time.After(time.Millisecond * 200): // 200 ms 超时
        fmt.Println("time out")
    }
}

func service() string {
	time.Sleep(time.Millisecond * 50) // 50 ms 执行完的一个Service
	return "Done"
}

func AsyncService() chan string { // 使用协程将它包装成一个异步操作
	retCh := make(chan string, 1) // 思考下，有 buffer 和 无buffer 的区别 ?
	go func() {
		ret := service()
		retCh <- ret // 如果是无 buffer ,则主调函数未取数据之前，回阻塞在此
	}()
	return retCh
}

func otherTask() {
	time.Sleep(time.Millisecond * 100) // 100ms 执行完的一个 Task
}
```


