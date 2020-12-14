# Docker原理

Docker 技术将应用 程序代码 / 运行时库 / 系统工具 等依赖全部被打包成了一个镜像。通过 Docker Engine 运行该镜像，产生的进程就是容器。所有的 Docker 容器共享同一个 Kernel。

镜像采用了分层文件系统，所有的镜像共享相同的文件层，因此占用的磁盘小，也有利于网络下载。

每个容器的 文件系统 / 网络 / CPU / 内存 资源都是隔离开的。



## 1. 基础技术

### 1.1 Linux Namespace

隔离一系列的系统资源：PID / UserID / Network

```go
clone()　新进程
unshare() 将某进程移出Namespace
setns()　将某进程移入Namespace
```

UTS Namespace : 隔离 node name 和 domain name，每个 Namespace 有自己的 hostname.

