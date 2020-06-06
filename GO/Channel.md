# Channel

```go
type hchan struct {
    buf      unsafe.Pointer // 环形队列指针
    elemtype *_type         // 元素类型
    elemsize uint16         // 每个元素的大小
    
    dataqsiz uint           // 环形队列长度
    qcount   uint           // 剩余位置数

    sendx    uint           // 队列写入位置
    recvx    uint           // 队列读出位置
    
    recvq    waitq          // 等待读消息的 goroutine 队列
    sendq    waitq          // 等待写消息的 goroutine 队列
    
    closed   uint32         // 标识关闭状态
    lock mutex              // 互斥锁，chan不允许并发读写
}
```

##### 环形队列示意图

![](https://static.bookstack.cn/projects/GoExpertProgramming/chapter01/images/chan-01-circle_queue.png)

##### 挂载的Goroutine示意图

![](https://static.bookstack.cn/projects/GoExpertProgramming/chapter01/images/chan-02-wait_queue.png)



环形队列的剩余存储空间大小，决定了`Goroutine`读写`Channel`时，是否发生堵塞。

当剩余空间发生变化时，将会唤醒相应的阻塞状态的`Goroutine`。

由于`Channel`内部带了锁机制，所以它同时仅允许被一个`goroutine`读写。

##### 向Channel中写入数据示意图

![](https://static.bookstack.cn/projects/GoExpertProgramming/chapter01/images/chan-03-send_data.png)

to be continue : 

https://www.bookstack.cn/read/GoExpertProgramming/chapter01-1.1-chan.md





