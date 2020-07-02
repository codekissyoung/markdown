# Goroutine 并发

### 示范 1 ：`main goroutin`同步阻塞等待 3 个 `goroutine` 结束：

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

#### 范例 2：专用于`Go`通道的`Select`：

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



`select`可以随机`收`，也可以随机`发`



```go
package main

import (
	"sync"
	"time"
)

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



- 通过`break`可以跳出`select`
- 设置为`nil`的管道，将永远堵塞，不会再参与`select`随机选取执行

```go
package main

import (
	"sync"
	"time"
)

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











### 定时器与`Goroutine`:

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

