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



## Q1 OKR

MQ 集群迁移

MQ / Metrics / Redis 组件代码迁移到 phpcommon 库

Go 消费者后台管理系统

Redis 组件优化 (多次Ping / RedisHelper内部调用Util/Redis / 更多命令支持 / 文档)



MQ 组件优化：

MQ Server : 连接数优化（15000+优化到500+），链接数监控，堆积消息告警到个人

生产者：amqp库升级，连接断开后自动重新链接，发送消息确认机制，自动重发，发送消息数监控

消费者：信号机制实现平滑重启，异常崩溃后秒级重启，告警到个人，保活监控，消费消息数监控，延迟消费监控

功能性：延迟队列，大容量队列











