# Goroutine 与 Channel



`Channel` 是用于发送类型化数据的管道，由其负责协程之间的通信，从而避开所有由共享内存导致的陷阱；这种通过通道进行通信的方式保证了同步性。数据在通道中进行传递：在任何给定时间，一个数据被设计为只有一个协程可以对其访问，所以不会发生数据竞争。数据的所有权（可以读写数据的能力）也因此被传递。

`Channel` 的实质是类型化消息的队列：使数据得以传输。它是先进先出（FIFO）的结构所以可以保证发送给他们的元素的顺序。

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



## 无缓冲Channel

Channel通信是同步且无缓冲的：在有接受者接收数据之前，发送不会结束。可以想象一个无缓冲的通道在没有空间来保存数据的时候：必须要一个接收者准备好接收通道的数据然后发送者可以直接把数据发送给接收者。所以通道的发送/接收操作在对方准备好之前是阻塞的：

1）对于同一个通道，发送操作（协程或者函数中的），在接收者准备好之前是阻塞的：如果ch中的数据无人接收，就无法再给通道传入其他数据：新的输入无法在通道非空的情况下传入。所以发送操作会等待 ch 再次变为可用状态：就是通道值被接收时（可以传入变量）。

2）对于同一个通道，接收操作是阻塞的（协程或函数中的），直到发送者可用：如果通道中没有数据，接收者就阻塞了。



#### 示范 1 ：`main goroutin`同步阻塞等待 3 个 `goroutine` 结束：

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

`select`可以随机`收`，也可以随机`发`

```go
func main() {
	chStr := make(chan string)
	chInt := make(chan int)
	go strWorker(chStr)
	go intWorker(chInt)
	for {
		select {
		case <-chStr:
			fmt.Println("get value from strWorker")
		case <-chInt:
			fmt.Println("get value from intWorker")
		}
		fmt.Println("one worker catched")
	}
}
func strWorker(ch chan string) {
	for i := 0; i < 10; i++ {
		time.Sleep(3 * time.Second)
		ch <- "str" + strconv.Itoa(i)
	}
}
func intWorker(ch chan int) {
	time.Sleep(5 * time.Second)
	ch <- 1
}
```



```go
func main() {
	var wg sync.WaitGroup
	a, b := make(chan int), make(chan int)

	// 接收端
	wg.Add(1)
	go func() {
		defer wg.Done()
		for {
			var name string
			var x int
			var ok bool
			// 只会从未阻塞的通道中，随机读取数据
			select {
			case x, ok = <-a:
				name = "from a : "
			case x, ok = <-b:
				name = "from b : "
			}
			if !ok {
				return // 只要有一个通道关闭，就退出
			} else {
				println(name, x)
			}
		}
	}()

	// 发送端
	wg.Add(1)
	go func() {
		defer wg.Done()
		defer close(a)
		defer close(b)
		for i := 0; i < 10; i++ {
			// 随机写入 a 或 b，每次selec只能写入一次
			select {
			case a <- i: // 写入 a
				time.Sleep(time.Second)
			case b <- i * 10: // 写入b
			}
			//time.Sleep(time.Second)
		}
	}()

	wg.Wait()
}
```



通过`break` `return` 可以跳出`select`

设置为`nil`的管道，将永远堵塞，不会再参与`select`随机选取执行

```go
func main() {
	var wg sync.WaitGroup
	a, b := make(chan int), make(chan int)

	// 接收端
	wg.Add(1)
	go func() {
		defer wg.Done()
		var x int
		var ok bool
		for {
			// 只会从未阻塞的通道中，随机读取数据
			select {
			case x, ok = <-a:
				if !ok {
					a = nil
					println("a closed")
					break // 跳出这次select
				}
				println("from a : ", x)
			case x, ok = <-b:
				if !ok {
					b = nil
					println("b closed")
					break
				}
				println("from b : ", x)
    default: // defalt 的加入，可以使 select 避免陷入阻塞，但注意不要引起没必要的空转
				println("default : no channel ready")
				time.Sleep(time.Second / 5)
			}

			if a == nil && b == nil {
				println("all closed")
				break
			}
		}
	}()

	// 发送端 a
	wg.Add(1)
	go func() {
		defer wg.Done()
		defer close(a)
		for i := 0; i < 10; i++ {
			a <- i
			time.Sleep(time.Second / 3)
		}
	}()

	// 发送端 b
	wg.Add(1)
	go func() {
		defer wg.Done()
		defer close(b)
		for i := 10; i < 20; i++ {
			b <- i
			time.Sleep(time.Second / 2)
		}
	}()

	wg.Wait()
}

```

## 定时器

```go
tick := time.Tick(3 * time.Second)
boom := time.After(10 * time.Second)
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

### runtime.Goexit()退出协程

- 立即中止当前`goroutine`
- 不会引发`pannic`
- 所有的`defer()`正常执行

```go
exit := make(chan struct{})

go func() {
    defer close(exit)
    defer println("a")

    func() {
        defer func() {
            println("b", recover() == nil)
        }()

        func() {
            println("c")
            runtime.Goexit()
            println("c done.")
        }()
        println("b done. ")
    }()
    println("a done")
}()

<-exit
```



## Feature 模式 并行执行

```go
func main() {
	// 下面两句 并行执行
	retCh := AsyncService()
	otherTask()

	// 等待 第一句的结果
	fmt.Println(<-retCh)
	time.Sleep(time.Second)
}

// 50 ms 执行完的一个Service
func service() string {
	time.Sleep(time.Millisecond * 50)
	return "Done"
}

// 100ms 执行完的一个 Task
func otherTask() {
	fmt.Println("otherTask start")
	time.Sleep(time.Millisecond * 100)
	fmt.Println("otherTask done.")
}

// 使用协程将它包装成一个异步操作
func AsyncService() chan string {
	retCh := make(chan string, 1) // 思考下，有 buffer 和 无buffer 的区别 ?
	fmt.Println("Async Service Goroutine Start")
	go func() {
		fmt.Println("service start.")
		ret := service()
		retCh <- ret // 如果是无 buffer ,则主调函数未取数据之前，回阻塞在此
		fmt.Println("service end.")
	}()
	return retCh
}
```

### 带有超时机制的并行调用

```go
func main() {
	// 下面两句 并行执行
	retCh := AsyncService()
	otherTask()

	// 等待 第一句的结果，并且有超时机制
	select {
	case ret := <-retCh:
		fmt.Println("get from retCh : ", ret)
	case <-time.After(time.Millisecond * 200): // 200 ms 超时
		fmt.Println("time out")
	}

	time.Sleep(time.Second)
}

// 50 ms 执行完的一个Service
func service() string {
	time.Sleep(time.Millisecond * 100) // 修改这里，改变服务运行时间，验证超时
	return "Done"
}

// 100ms 执行完的一个 Task
func otherTask() {
	fmt.Println("otherTask start")
	time.Sleep(time.Millisecond * 100)
	fmt.Println("otherTask done.")
}

// 使用协程将它包装成一个异步操作
func AsyncService() chan string {
	retCh := make(chan string) // 思考下，有 buffer 和 无buffer 的区别 ?
	fmt.Println("Async Service Goroutine Start")
	go func() {
		fmt.Println("service start.")
		ret := service()
		retCh <- ret // 如果是无 buffer ,则主调函数未取数据之前，回阻塞在此
		fmt.Println("service end.")
	}()
	return retCh
}
```

### 优雅的关闭Channel

**The Channel Closing Principle**

1. 不要从接收端关闭 channel
1. 不要关闭有多个并发发送者的channel
1. sender是唯一 或者是channel最后一个活跃的sender，那么你应该在sender的goroutine关闭channel，从而通知 receivers 已经没有值可以读了

维持这些原则保证了:

- 永远不会发生向一个已经关闭的channel发送值(会导致panic)
- 关闭一个已经关闭的channel(会导致panic)

> Golang甚至禁止关闭 receive-only 类型的channel

#### 情况1: 一个 sender 多个 receiver 

这种情况下，直接在 sender 处，关闭就好

#### 情况2：多个 sender 一个 receiver

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

#### 情况3：多个 sender 多个 receiver

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

#### 通道工厂模式

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



