# Goroutine 并发

## go 语句、channel、同步方法

示范 1 ：`main goroutin`同步阻塞等待 3 个 `doSomething goroutine` 结束：

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

范例 2：专用于`Go`通道的`Select`：

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
