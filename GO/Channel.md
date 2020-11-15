# Channel

### 性质

- 向已经关闭的通道发送数据,会引发`panic`
- `close`已经关闭的`channel`或值为`nil`的`channel`，会引发`panic`
- 从已关闭接收数据，返回已缓冲数据或零值
- 无论收发，`nil`通道都会阻塞

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

##### 挂载的`Goroutine`示意图

![](https://static.bookstack.cn/projects/GoExpertProgramming/chapter01/images/chan-02-wait_queue.png)



环形队列的剩余存储空间大小，决定了`Goroutine`读写`Channel`时，是否发生堵塞。

当剩余空间发生变化时，将会唤醒相应的阻塞状态的`Goroutine`。

由于`Channel`内部带了锁机制，所以它同时仅允许被一个`goroutine`读写。

##### 向Channel中写入数据示意图

![](https://static.bookstack.cn/projects/GoExpertProgramming/chapter01/images/chan-03-send_data.png)

##### 从Channel中读取数据

![](https://static.bookstack.cn/projects/GoExpertProgramming/chapter01/images/chan-04-recieve_data.png)

#### 关闭Channel

以下两种情况，会报`panic`

- 关闭值为nil的channel
- 关闭已经被关闭的channel

关闭channel时:

- 会把recvq中的G全部唤醒，本该写入G的数据位置为`nil`
- sendq中的G全部会`panic`，即向已经关闭的channel写数据会`panic`



## Select

```go
type scase struct {
    c           *hchan 						// 当前case语句所操作的channel指针
    kind        uint16 						// 类型，分为读channel、写channel和default
    elem        unsafe.Pointer // 读出/写入channel的数据存放地址(缓冲区地址)
}
```







