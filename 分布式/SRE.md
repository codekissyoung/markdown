# SRE

`SRE` 全称 `Site Reliability Engineer`，目标是“创造软件系统来维护系统运行” 来代替 “人工操作”。

职责：可用性改进、延迟优化、性能优化、效率优化、变更管理、监控、紧急事务处理、容量规划与管理。

## SRE 视角

#### 硬件基础

物理服务器：`machine` 代表具体的硬件 或 虚拟机
软件服务器：`server` 代表一个对外提供服务的服务端软件

```bash
10台服务器 -> 机柜 Rack -> 机柜排 Row -> 集群 Cluster -> 数据中心 Datacenter -> 园区 Campus
```

数据中心内的物理服务器都需要能够互相进行网络通信，其中核心技术是用`Clos`连接方式将几百台交换机连接起来，创建了一个非常快的虚拟网络交换机`Jupiter`。这个交换机有几万个虚拟端口，提供了`1.3Pb/s`的服务器交叉带宽。

数据中心与数据中心之间，由一套全球覆盖的骨干网`B4`连接起来。`B4`是基于 `SDN` 网络技术，使用 `OpenFlow` 标准协议构建的，可以在一定区域内提供海量带宽，同时可以利用动态带宽管理优化网络连接，最大化平均带宽。

#### 集群管理

有了硬件集群，这基础之上开发了一个分布式集群操作系统`Borg`，负责集群层面管理任务的编排工作。

![](http://img.codekissyoung.com/2020/01/21/f0700dab99989223efa6d7b05f901785.png)

#### 数据存储

需要有一套存储系统向用户提供一套简单易用、可靠的集群存储服务。

![](http://img.codekissyoung.com/2020/01/21/d767341ed7d4d74ac3b2d277d621ebc2.png)

`D`是底层存储服务，`Colossus`（`GFS`改进版）建立了一个覆盖整个集群的文件系统。提供操作接口，同时还支持复制与加密功能。
`Bigtable`是一个`NoSQL`数据库，是一个松散存储的、分布式的、有顺序的、持久化的多维映射表。以`RowKey + ColummnKey + Timestamp`作为索引，值是按原始字节存储的。支持“最终一致”的跨数据中心复制模型。
`Spanner`提供`SQL`接口以及满足一致性要求的全球数据库。

#### 网络

数据中心内部使用基于`OpenFlow`协议的软件定义网络`SDN`，由`Bandwidth Enforcer BwE`宽带控制器 负责管理所有可用宽带。

为了用户在使用服务时，给用户指派距离最近、有空余容量的数据中心，开发了`GSLB`全球负载均衡系统：

- 利用地理位置信息进行 DNS 解析，指派地理位置最近的数据中心
- 在用户服务层面进行负载均衡，例如`YouTube`和`Google Maps`
- 在远程调用`RPC`层面进行负载均衡

每个服务的管理者在配置文件中给服务起一个名称，同时指定一系列的 `BNS`地址以及需要的`QPS`支持。然后，`GSLB`就会自动将用户流量导向到合适的位置。

#### 分布式锁

`Chubby`提供分布式集群锁服务，使用`Paxos`协议来提供分布式一致性。

#### 监控与报警系统

数据中心部署了多个`Borgmon`监控程序，定期从监控对象抓取 监控指标`Metric`。这些监控指标可以用来触发报警，也可以存储起来用来生成图表以供观看。

#### 底层软件基础设施

每个`Server`都内置一个`HTTP`服务，提供一些调试信息和统计信息。

所有`Server`使用`RPC`通信（开源版本为`gRPC`），有时候一个程序内部函数调用也会使用`RPC`实现，为未来重构为多个组件并行的架构做准备。`GSLB`提供了`RPC`调用的负载均衡支持。

`gRPC`的传输格式为`Protocol Buffer` 简写为 `Protobuf`。

拥抱风险

略过

服务质量目标

略过

减少琐事

略过

## 分布式系统的监控

监控 `Monitoring` : 收集、处理、汇总，并且显示关于某个系统的实时量化数据，例如：请求的数量和类型、错误的数量和类型、处理用时、应用服务器存活时间。

白盒监控 `white-box monitoring`: 依靠系统内部暴露的一些性能指标进行监控。包括日志分析、`Java`虚拟机提供的监控接口、或者一个列出内部统计数据的`HTTP`接口进行监控。

黑盒监控 `black-box monitoring`: 通过测试某种外部用户可见的系统行为进行监控。

监控台页面 `Dashboard`: 提供服务核心指标一览服务的`Web`程序，提供过滤`filter`、选择`selector`功能，同时也可以显示相应团队的一些信息，包括目前工单数量、高优先级的`Bug`列表、目前`on call`工程师和最近的发布生产等。

警报 告警 `alert`: 发向某个地址（工单系统、E-mail 地址、企业微信、短信）的一个通知。

根源问题 `root cause`:

节点或者机器 `node` `machine`: 物理机、虚拟机、或者容器内运行的某个实例

推送 `push`:
