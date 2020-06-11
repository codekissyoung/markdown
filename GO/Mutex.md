# Mutex


```go
type Mutex struct {
    state int32 		// 表示互斥锁的状态，比如是否被锁定等
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

