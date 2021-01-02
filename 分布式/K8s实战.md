# Kubernetes in Action

Cluster：计算、存储、网络资源集合

Master：Cluster的大脑，负责调度，管理Node

Node：负责管理容器的生命周期，监控并且上报容器状态

Pod: 最小工作单元，每个Pod包含1~N个容器，作为一个整体被调度到一个Node上运行。所有容器共用一个网络namespace，即相同的IP和Port空间，可以使用localhost通信，共享存储。挂载Volume到Pod，等于挂载到Pod中每一个容器。

Controller：管理Pod的生命周期，定义了Pod的部署特性，类型有:

- Deployment : 管理Pod的多个副本
- ReplicaSet : 实现了Pod的多副本管理，自动被Deployment使用，所以通常也不需要手动直接使用
- DaemonSet: 用于每个Node最多只运行一个Pod的场景
- StatefuleSet: 保证Pod每个副本，在整个生命周期中，名称是不变的
- Job: 用于运行结束就删除的应用

Service: 管理Pod的访问。定义了外界访问一组特定Pod的方式。Service有自己的IP和端口，为Pod提供负载均衡

Namespace: 将一个物理的Cluster划分为逻辑上的多个Cluster，不同的逻辑Cluster，资源是完全隔离的

```bash
$ kubectl get namespace
```

