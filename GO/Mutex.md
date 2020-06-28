# Mutex


```go
type Mutex struct {
    state int32    // 表示互斥锁的状态，比如是否被锁定等
    sema  uint32   // 信号量，协程阻塞等待该信号量，解锁的协程释放信号量从而唤醒等待信号量的协程
}
```

![](https://static.bookstack.cn/projects/GoExpertProgramming/chapter02/images/mutex-01-structure.png)



```go
type RWMutex struct {
    w           Mutex  //用于控制多个写锁，获得写锁首先要获取该锁，如果有一个写锁在进行，那么再到来的写锁将会阻塞于此
    writerSem   uint32 //写阻塞等待的信号量，最后一个读者释放锁时会释放信号量
    readerSem   uint32 //读阻塞的协程等待的信号量，持有写锁的协程释放锁后会释放信号量
    readerCount int32  //记录读者个数
    readerWait  int32  //记录写阻塞时读者个数
}
```

通过临界区来保护共享资源

```go
var wg sync.WaitGroup
var counter int
var mu sync.Mutex

func main() {

	wg.Add(2)
	go incCounter(1)
	go incCounter(2)
	wg.Wait()

	fmt.Println("Final Counter : ", counter)
}

func incCounter(id int) {
	defer wg.Done()
	for count := 0; count < 2; count++ {
		mu.Lock() // ------------------ 临界区 ------------------
		{
			value := counter
			runtime.Gosched()
			value++
			counter = value
		}
		mu.Unlock() // ----------------------------------------
	}
}
```



## Atomic

```go
var wg sync.WaitGroup
var counter int64

func main() {

	wg.Add(2)
	go incCounter(1)
	go incCounter(2)
	wg.Wait()

	fmt.Println("Final Counter:", counter)
}

func incCounter(id int) {
	defer wg.Done()
	for count := 0; count < 2; count++ {
		atomic.AddInt64(&counter, 1) // 原子性 +1
		runtime.Gosched()            // 本Goroutine让出计算资源
	}
}
```

```go
// 通过共享变量来控制Goroutine运行
var wg sync.WaitGroup
var shutdown int64

func main() {

	wg.Add(2)
	go doWork("A")
	go doWork("B")
	time.Sleep(time.Second)
	fmt.Println("Shutdown Now")
	atomic.StoreInt64(&shutdown, 1)
	wg.Wait()
}

func doWork(name string) {
	defer wg.Done()
	for {
		fmt.Println("Doing ", name, " Work ")
		time.Sleep(250 * time.Millisecond)
		if atomic.LoadInt64(&shutdown) == 1 {
			fmt.Println("Work ", name, " Shutting Down")
			break
		}
	}
}
```

## Channel控制同步



模拟乒乓球赛

```go

var wg sync.WaitGroup

func init() {
const (
	numberGoroutines = 4
	taskLoad         = 20
)

var (
	wg sync.WaitGroup
)

func init() {
	rand.Seed(time.Now().Unix())
}

func main() {

	taskChan := make(chan string, taskLoad)

	for workerID := 0; workerID < numberGoroutines; workerID++ {
		wg.Add(1)
		go worker(taskChan, workerID)
	}

	for post := 1; post <= taskLoad; post++ {
		taskChan <- fmt.Sprintf("Task : %d", post)
	}

	close(taskChan)

	wg.Wait()
}

func worker(taskChan chan string, worker int) {
	defer wg.Done()
	for {
		task, ok := <-taskChan
		if !ok {
			fmt.Println("worker ", worker, " shutding down")
			return
		}
		fmt.Println("worker ", worker, " start task ", task)
		time.Sleep(time.Duration(rand.Int63n(100)) * time.Millisecond)
		fmt.Println("worker ", worker, " Complete task ", task)
	}
}

	rand.Seed(time.Now().UnixNano())
}

// 模拟乒乓球塞
func main() {
	court := make(chan int)

	wg.Add(1)
	go player("Link", court) // Link 准备接球
	court <- 1               // 裁判发球

	wg.Add(1)
	go player("Max", court) // Max 准备接 Link 打过来的球

	wg.Wait()
}

func player(name string, court chan int) {
	defer wg.Done()

	for {
		ball, ok := <-court
		if !ok {
			fmt.Println("Player ", name, " won")
			return
		}

		time.Sleep(time.Second / 2)
		n := rand.Intn(100)
		// 被 13 整除表示输球
		if n%13 == 0 {
			fmt.Println("Player ", name, " Missed")
			close(court)
			return
		}
		fmt.Printf("Player %s Hit %d \n", name, ball)

		ball++
		court <- ball
	}
}

```



```go

const (
	numberGoroutines = 4
	taskLoad         = 20
)

var (
	wg sync.WaitGroup
)

func init() {
	rand.Seed(time.Now().Unix())
}

func main() {

	taskChan := make(chan string, taskLoad)

	for workerID := 0; workerID < numberGoroutines; workerID++ {
		wg.Add(1)
		go worker(taskChan, workerID)
	}

	for post := 1; post <= taskLoad; post++ {
		taskChan <- fmt.Sprintf("Task : %d", post)
	}

	close(taskChan) // 关闭的通道，读取直接返回零值 ok 为 false; 未关闭，则是阻塞等待

	wg.Wait()
}

func worker(taskChan chan string, worker int) {
	defer wg.Done()
	for {
		task, ok := <-taskChan
		if !ok {
			fmt.Println("worker ", worker, " shutding down")
			return
		}
		fmt.Println("worker ", worker, " start task ", task)
		time.Sleep(time.Duration(rand.Int63n(100)) * time.Millisecond)
		fmt.Println("worker ", worker, " Complete task ", task)
	}
}
```

关闭的通道，读取它直接返回零值 `ok` 为 `false`; 未关闭，则是阻塞等待