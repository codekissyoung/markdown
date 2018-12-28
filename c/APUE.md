# Unix环境高级编程

- `Ctrl + D`输入文件结束符(控制字符)`^D`，模拟文件结束情况，比如`fgets()`等函数收到文件结束符，就返回`NULL`

## 内核用于所有I/O的数据结构

> 内核使用3种数据结构表示打开的文件

- 每个进程都有一张`打开文件描述符表`，该表的每一条记录的结构为:
  1. 文件描述符标志 close_on_exec
  1. 指向一个文件表项的指针

- 内核为所有打开文件维持一张`文件表`，每个记录包含:
  1. 文件状态标志
  1. 当前文件偏移量
  1. 指向该文件 v 节点表的指针

- 每个打开文件/设备都有一个`v-node`结构，这个结构的内容有:
  1. 文件类型
  1. 对此文件进行各种操作的函数的指针
  1. 该文件的i节点,i节点内部包含了文件所有者，文件长度，指向文件实际数据块在磁盘上所在位置的指针等

- 一个进程打开两个文件

![WX20181204-162658.png](https://i.loli.net/2018/12/04/5c063aa9c2a30.png)

- 两个进程打开同一个文件

![WX20181204-162945.png](https://i.loli.net/2018/12/04/5c063b0e36962.png)

> 打开该文件的每个进程都获得各自的一个文件表项，但对于一个给定的文件只有唯一的一个`v节点表项`

- 现在对I/O操作进行一个说明
  - 在完成每个write后，文件表项中的cur_file_offset立即增加所写入的字节数，如果该偏移量的值超过文件长度，则i节点表项中的当前文件长度设置为偏移量的长度，也就是文件加长了
  - 以O_APPEND标志打开文件，该标志被设置到文件表项的文件状态标志中，每次进行写入时，文件表项中的cur_file_offset会被设置为当前文章长度。这就使得每次写入数据都是追加到文件末尾的
  - 一个文件用 lseek 定位到文件尾端，对应的数据结构的修改就是，文件表项中的cur_file_offset被设置为当前文件长度,lseek只修改当前文件偏移量，不进行任何io操作
  - 多个文件描述符可以指向同一个文件表项，dup函数可以实现;fork后也会出现这种情况,此时父进程、子进程各自的那个文件描述符共享同一个文件表项

## 文件类型

- 普通文件，包括纯文本文件以及二进制文件，在内核看了它们没有区别，读出来都是字节流
- 目录文件 directory file,包含其他文件的名字，以及指向这些文件有关信息的指针
- 块特殊文件 block special file,提供对设备(磁盘)带缓冲的访问，每次访问以固定长度为单位进行
- 字符特殊文件 character special file 提供对设备不带缓冲的访问，每次访问长度可变，系统中的设备要么是块特殊文件，要么是字符特殊文件
- FIFO 命名管道 用于进程间通信
- socket 套接字 用于进程间的网络通信，也可用在一台主机上进程之间的通信
- 符号链接 symbolic link 这种文件指向另一个文件

## 一个进程关联的ID

- 当前进程的实际用户是谁
  - 实际用户ID
  - 实际组ID
- 用于文件访问权限检查
  - 有效用户ID
  - 有效组ID
  - 附属组ID
- 由exec函数保存,是有效用户ID与有效组ID的副本
  - 保存的设置用户ID
  - 保存的设置组ID

## 文件系统

- 一块磁盘分成多个分区，每一个分区可以包含一个文件系统

![WX20181205-150455.png](https://i.loli.net/2018/12/05/5c0778ca2effd.png)

- 两个目录块中的项指向同一个i节点，每个i节点都有一个链接计数，它减到0时，文件才被删除
- 符号链接的文件类型是 S_IFLNK, 内核知道这是一个符号链接
- i节点包含了文件有关的所有信息：文件类型，文件访问权限位，文件长度，指向文件数据块的指针集合等

![WX20181205-150747.png](https://i.loli.net/2018/12/05/5c077952109ae.png)

- 创建新目录 testdir 之后，文件系统结构的生成与变化

![WX20181205-151559.png](https://i.loli.net/2018/12/05/5c077b410745e.png)

## 符号链接

- 硬链接要求链接与文件位于同一文件系统中
- 只有超级用户才能创建指向目录的硬链接

## 标准IO

- `流 stream` 标准IO库打开一个文件时，这个流与这个文件相关联
- ASCII字符集，一个字符使用一个字节存储，国际字符集，一个字符用多个字节存储
- `流的定向 stream orientation`决定了读写字符是使用单字节模式，还是多字节模式
- `fopen`返回一个`FILE`指针，这个指针包含了管理该文件对应的流的所有信息(文件描述符，指向缓冲区的指针，缓冲区的长度，当前在缓冲区中的字符数以及出错标志)
- `strin` `stdout` `stderr`三个标准流

### 标准IO带来的缓冲

- 全缓冲:填满IO缓冲区后，才进行实际的I/O操作

- 行缓冲:在输入和输出中遇到换行符时，标准IO库执行IO操作，有两个限制如下
  1. 缓冲区被填满，不管有没有遇到换行符，都执行实际的IO操作
  1. 任何时候，只要通过标准IO库从 (a)不带缓冲的流 (b)行缓冲的流 中读取数据时，就会先输出输出流的缓冲数据

- 不带缓冲:标准I/O库不对字符进程缓冲存储，例如`fputs`函数，`stderr`流设置为不带缓冲的