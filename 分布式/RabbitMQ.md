# RabbitMQ

[RabbitMQ Client PHP 版](https://xiaoxiami.gitbook.io/rabbitmq_into_chinese_php/ying-yong-jiao-cheng/php-ban/3-publish_subscribe.md)

## 安装

```bash
$ apt-get install erlang
$ apt-get install rabbitmq-server
$ rabbitmq-server -detached  		# 启动 rabbitmq-server daemon
```

```bash
# 默认端口:
4369 (epmd)
25672 (Erlang distribution)
5672 (AMQP 0-9-1 without TLS) amqp 协议访问
5671 (AMQP 0-9-1 with TLS) 
15672 web Http协议
```

## Server 管理

```bash
rabbitmqctl status                    # 查看当前节点状态

rabbitmqctl stop                      # 关闭服务 连同节点上的其它应用程序一同关闭了
rabbitmqctl start_app                 # 开启 rabootmq app
rabbitmqctl stop_app                  # 关闭 rabbitmq app

rabbitmqctl list_queues -p vhost      # 列出 vhost 下的队列
rabbitmqctl list_exchanges
rabbitmqctl list_bindings
rabbitmqctl list_connections
rabbitmqctl list_channels

rabbitmqctl reset                     # 清除所有队列
```

## 用户管理

```bash
rabbitmqctl list_vhosts										  # 列出vhost
rabbitmqctl add_vhost linktest      						   # 新建vhost
rabbitmqctl delete_vhost linktest   						   # 撤销vhost
rabbitmqctl list_permissions [-p {vhost}]					   #　查看 vhost 的权限

rabbitmqctl add_user {user} {pwd}                        		# 新增用户
rabbitmqctl delete_user {user}                          		# 删除用户
rabbitmqctl set_permissions [-p {vhost}] {user} ".*" ".*" ".*"	# 设置权限，RegExp : {conf} {write} {read}
rabbitmqctl set_user_tags {user} {tag}             				# 设置用户类型
rabbitmqctl list_users                                   		# 查看用户列表
rabbitmqctl list_user_permissions {user}					   # 查看某用户的所有权限
rabbitmqctl clear_permissions [-p {vhost}] {username}			# 清理权限
```

- `administrator`：拥有以下所有权限
- `monitoring`：可登陆管理控制台，同时可以查看节点的相关信息(进程数，内存使用情况，磁盘使用情况等)
- `policymaker`：可登陆管理控制台, 同时可以对 policy 进行管理。但无法查看节点的相关信息
- `management`：仅可登陆管理控制台，无法看到节点信息，也无法对策略进行管理
- `other`：普通的生产者和消费者

#### 集群

```bash
rabbitmqctl cluster_status                     # 查看集群内节点信息
rabbitmqctl join_cluster 节点@主机名            # 创建集群
```

#### 插件管理

```bash
rabbitmq-plugins enable plugin-name          # 开启插件
rabbitmq-plugins disable plugin-name         # 关闭插件
rabbitmq-plugins enable rabbitmq_management  # 启用 web 管理界面插件
```

### 队列属性

声明一个已经存在的队列，假如参数都是一样的话，则返回这个队列。如果参数有不同的话，直接报错。

exclusive 私有队列 : 限制本队列只有一个消费者。

auto-delete 自动删除队列 : 最后一个消费者取消订阅时，队列就会自动删除。

## 可靠消息投递

1. #### 发布是可靠的

使用`confirm`机制

2. #### 存储是可靠的

能从服务器意外崩溃后，重启之后自动恢复的消息称为，持久化消息。要做到这一点，需要保证

- 交换器是持久化的 `durable = true`
- 队列是持久化的 `durable = true`
- 投递模式是持久化的 `delivery mode = 2`

3. #### 消费是可靠的

##### 使用 `ack` 机制 和 `reject` 机制

消费者订阅到队列时 ，如果使用 `auto_ack` 自动确认参数，消息进入`Server socket`开始由操作系统通过网络进行发送，`RabbitMQ-Server`就视为消息被消费了，从而在队列里删除该消息。

而不使用`auto_ack`的话，则需要消费者发送一条`ack`消息给`RabbitMQ-Server`，告知确实正确消费了消息。然后，`RabbitMQ-Server`从队列里删除该消息。

如果出现：

- `RabbitMQ-Server` 链接中断：
  - 消息被视为未消费，重新入队首进行再次投递

- 消费者程序有`Bug`忘记`ack`了：
  - `RabbitMQ-Server`在接收到`ack`消息之前，不会再向该消费者发送任何消息了
  - 这个机制可以用来控制应用程序消费速率

如果消费一条消息需要比较长时间的话，建议使用`ack`机制，这样可以防止`RabbotMQ-Server`持续不断的消息涌向消费者进程，从而导致过载。

`reject` 机制：

- 消费者进程收到一条消息后，调用`reject`命令，设置`requeue = true`参数，表示自己不处理这条命令，这样`RabbitMQ-Server`就会重新将这条消息入队，交给其他消费者进程处理
- 如果消费者进程检测到某条消息是错误消息呢？可以调用`reject`命令，设置 `requeue = false`，表示让`RabbitMQ-Server`直接丢弃该消息，如果本队列配置了死信队列的话，这丢弃的消息会堆积在死信队列，以供研发分析原因

## AMQP 协议

- 是一个使用TCP提供可靠投递的应用层协议
- 使用认证机制并且提供TLS（SSL）保护。
- 当一个应用不再需要连接到AMQP代理的时候，需要优雅的释放掉AMQP连接，而不是直接将TCP连接关闭。
- 是一种二进制协议，提供客户端应用与消息中间件之间多通道、协商、异步、安全、中立和高效地交互。

从整体来看，AMQP协议可划分为两层：

传输层，基于二进制数据流传输，用于将应用程序调用的指令传回服务器，并返回结果，同时可以处理信道复用，帧处理，内容编码，心跳传输，数据传输和异常处理。传输层可以被任意传输替换，只要不改变应用可见的功能层相关协议，也可以使用相同的传输层，同时使用不同的高级协议

```
1.使用二进制数据流压缩和解压，提高效率；
2.可以处理任意大小的消息，且不做任何限制；
3.单个连接支持多个通信通道；
4.客户端和服务端基于长链接实现，且无特殊限制；
5.允许异步指令基于管道通信；
6.易扩展，基于新的需求和变化支持扩展；
7.新版本向下兼容老版本；
8.基于断言模型，异常可以快速定位修复；
9.对编程语言保持中立；
10.适应代码发展演变；

使用能够快速打包解包的二进制编码来保证数据的紧凑性。
能够处理任意大小的消息。
允许零拷贝数据传输（比如远程DMA）。
一个连接支持多个会话。
保证会话能够从网络错误、服务器失效中恢复。
为了长期存在，没有隐含的内置限制（TODO：To be long-lived，with no significant in-built limitations）。
异步传输消息。
能够很容易的处理新的和变化的需求。
高版本的AMQP规范能够兼容低版本的规范。
使用强断言模型来保证应用程序的可修复性。
保持编程语言的中立性。
适宜使用代码生成工具生成协议处理模块。
```
- 功能层: 位于协议上层主要定义了一组命令（基于功能的逻辑分类），用于应用程序调用实现自身所需的业务逻辑。例如：应用程序可以通过功能层定义队列名称，生产消息到指定队列，消费指定队列消息
```
1.保证基于模型实现的应用之间相互可以联通；
2.提供对服务质量的可靠控制；
3.命名规划，要求命名明确且保持一致；
4.允许通过协议配置服务器连接；
5.功能层命名能够简单的映射到应用程序级别的 API
6.职责单一明确，每个操作只做一件事情。

保证遵从AMQP规范的服务器实现之间能够进行互操作。
为服务质量提供显示控制。
支持所有消息中间件的功能：消息交换、文件传输、流传输、远程进程调用等。
兼容已有的消息API规范（比如Sun公司的JMS规范）。
形成一致和明确的命名。
通过AMQP协议可以完整的配置服务器线路（TODO：server wiring是啥意思？）。
使用命令符号可以很容易的映射成应用级别的API。
明确定义每一个操作只做一件事情。
```



数据类型：

- Integers（数值范围1-8， 8个字节）：用于表示大小，数量，限制等，整数类型无符号的，可以在帧内不对齐。
- Bits（统一为8个字节）：用于表示开/关值。
- Short strings：用于保存简短的文本属性，字符串个数限制为255，8个字节
- Long strings：用于保存二进制数据块。
- Field tables：包含键值对，字段值一般为字符串，整数等。

#### 概念:

- Message : 由消息头和消息体组成。消息头有属性routing-key、priority、delivery-mode等。

- Publisher/ Producer : 消息的生产者，也是一个向交换器发布消息的客户端应用程序。

 - Exchange: 交换器，用来接收生产者发送的消息并将这些消息路由给服务器中的队列。

 - Routing Key :路由关键字,exchange根据这个关键字进行消息投递。

 - Binding : 绑定，用于消息队列和交换器之间的关联。一个绑定就是基于路由键将交换器和消息队列连接起来的路由规则，所以可以将交换器理解成一个由绑定构成的路由表。

 - Queue : 消息队列，用来保存消息直到发送给消费者。它是消息的容器，也是消息的终点。一个消息可投入一个或多个队列。消息一直在队列里面，等待消费者连接到这个队列将其取走。

 - Connection : 网络连接，比如一个TCP连接。

 - Channel : 信道，多路复用连接中的一条独立的双向数据流通道。信道是建立在真实的TCP连接内地虚拟连接，AMQP 命令都是通过信道发出去的，不管是发布消息、订阅队列还是接收消息，这些动作都是通过信道完成。因为对于操作系统来说建立和销毁 TCP 都是非常昂贵的开销，所以引入了信道的概念，以复用一条 TCP 连接。

 - Consumer: 消息的消费者，表示一个从消息队列中取得消息的客户端应用程序。

 - Virtual Host :虚拟主机，表示一批交换器、消息队列和相关对象。虚拟主机是共享相同的身份认证和加密环境的独立服务器域。每个 vhost 本质上就是一个 mini 版的 RabbitMQ 服务器，拥有自己的队列、交换器、绑定和权限机制。vhost 是 AMQP 概念的基础，必须在连接时指定，RabbitMQ 默认的 vhost 是 / 。

 - Broker: 表示消息队列服务器实体。它提供一种传输服务,它的角色就是维护一条从生产者到消费者的路线，保证数据能按照指定的方式进行传输

Connection 是 RabbitMQ 的 socket 链接，它封装了 socket 协议相关部分逻辑。
ConnectionFactory 为 Connection 的制造工厂。
Channel 是我们与 RabbitMQ 打交道的最重要的一个接口，我们大部分的业务操作是在 Channel 这个接口中完成的，包括定义 Queue、定义 Exchange、绑定 Queue 与 Exchange、发布消息等。



1. AMQP Model：一个由关键实体和语义表示的逻辑框架，遵从AMQP规范的服务器必须提供这些实体和语义。为了实现本规范中定义的语义，客户端可以发送命令来控制AMQP服务器。
2. 连接（Connection）：一个网络连接，比如TCP/IP套接字连接。
3. 会话（Session）：端点之间的命名对话。在一个会话上下文中，保证“恰好传递一次”。
4. 信道（Channel）：多路复用连接中的一条独立的双向数据流通道。为会话提供物理传输介质。
5. 客户端（Client）：AMQP连接或者会话的发起者。AMQP是非对称的，客户端生产和消费消息，服务器存储和路由这些消息。
6. 服务器（Server）：接受客户端连接，实现AMQP消息队列和路由功能的进程。也称为“消息代理”。
7. 端点（Peer）：AMQP对话的任意一方。一个AMQP连接包括两个端点（一个是客户端，一个是服务器）。
8. 搭档（Partner）：当描述两个端点之间的交互过程时，使用术语“搭档”来表示“另一个”端点的简记法。比如我们定义端点A和端点B，当它们进行通信时，端点B是端点A的搭档，端点A是端点B的搭档。
9. 片段集（Assembly）：段的有序集合，形成一个逻辑工作单元。
10. 段（Segment）：帧的有序集合，形成片段集中一个完整子单元。

1. 帧（Frame）：AMQP传输的一个原子单元。一个帧是一个段中的任意分片。
2. 控制（Control）：单向指令，AMQP规范假设这些指令的传输是不可靠的。
3. 命令（Command）：需要确认的指令，AMQP规范规定这些指令的传输是可靠的。
4. 异常（Exception）：在执行一个或者多个命令时可能发生的错误状态。
5. 类（Class）：一批用来描述某种特定功能的AMQP命令或者控制。
6. 消息头（Header）：描述消息数据属性的一种特殊段。
7. 消息体（Body）：包含应用程序数据的一种特殊段。消息体段对于服务器来说完全不透明——服务器不能查看或者修改消息体。
8. 消息内容（Content）：包含在消息体段中的的消息数据。
9. 交换器（Exchange）：服务器中的实体，用来接收生产者发送的消息并将这些消息路由给服务器中的队列。
10. 交换器类型（Exchange Type）：基于不同路由语义的交换器类。
11. 消息队列（Message Queue）：一个命名实体，用来保存消息直到发送给消费者。
12. 绑定器（Binding）：消息队列和交换器之间的关联。
13. 绑定器关键字（Binding Key）：绑定的名称。一些交换器类型可能使用这个名称作为定义绑定器路由行为的模式。
14. 路由关键字（Routing Key）：一个消息头，交换器可以用这个消息头决定如何路由某条消息。
15. 持久存储（Durable）：一种服务器资源，当服务器重启时，保存的消息数据不会丢失。
16. 临时存储（Transient）：一种服务器资源，当服务器重启时，保存的消息数据会丢失。
17. 持久化（Persistent）：服务器将消息保存在可靠磁盘存储中，当服务器重启时，消息不会丢失。
18. 非持久化（Non-Persistent）：服务器将消息保存在内存中，当服务器重启时，消息可能丢失。





