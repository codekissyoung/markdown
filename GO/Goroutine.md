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

