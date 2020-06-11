# RabbitMQ

[RabbitMQ PHP 版](https://xiaoxiami.gitbook.io/rabbitmq_into_chinese_php/ying-yong-jiao-cheng/php-ban/3-publish_subscribe.md)

## 安装

```bash
apt-get install erlang
apt-get install rabbitmq-server
rabbitmq-server -detached  # 启动 rabbitmq-server daemon
```

启动后默认端口:

```bash
4369 (epmd), 25672 (Erlang distribution)
5672, 5671 (AMQP 0-9-1 without and with TLS)
15672 (if management plugin is enabled)
61613, 61614 (if STOMP is enabled)
1883, 8883 (if MQTT is enabled)
web : 15672          # 通过浏览器访问
api_port : 5672      # amqp 协议端口
```

## rabbitmqctl Server 管理

```bash
rabbitmqctl status                    # 查看当前节点状态
rabbitmqctl stop                      # 关闭服务 连同节点上的其它应用程序一同关闭了
rabbitmqctl stop_app                  # 关闭 rabbitmq app
rabbitmqctl start_app                 # 开启 rabootmq app
rabbitmqctl list_queues               # -p 指定 vhost_name , 默认 / 
rabbitmqctl list_exchanges
rabbitmqctl list_bindings
rabbitmqctl list_connections
rabbitmqctl list_channels

rabbitmqctl add_vhost xxx           # 新建virtual_host
rabbitmqctl delete_vhost xxx        # 撤销virtual_host
rabbitmqctl reset                   # 清除所有队列
```

#### 集群

```bash
rabbitmqctl cluster_status                     # 查看集群内节点信息
rabbitmqctl join_cluster 节点@主机名             # 创建集群
```

### 插件管理

```bash
rabbitmq-plugins enable plugin-name          # 开启插件
rabbitmq-plugins disable plugin-name         # 关闭插件
rabbitmq-plugins enable rabbitmq_management  # 启用 web 管理界面插件
```

## 用户管理

```bash
rabbitmqctl add_user root root                           # 新增用户 root 密码 root
rabbitmqctl set_permissions -p / root ".*" ".*" ".*"     # 设置权限
rabbitmqctl set_user_tags root administrator             # 设置用户类型
rabbitmqctl list_users                                   # 查看用户列表
rabbitmqctl delete_user username                         # 删除用户
```

### 用户角色`Tag`:

- `administrator`：可登陆管理控制台，可查看所有的信息，并且可以对用户，策略(policy)进行操作
- `monitoring`：可登陆管理控制台，同时可以查看 rabbitmq 节点的相关信息(进程数，内存使用情况，磁盘使用情况等)
- `policymaker`：可登陆管理控制台, 同时可以对 policy 进行管理。但无法查看节点的相关信息
- `management`：仅可登陆管理控制台，无法看到节点信息，也无法对策略进行管理
- `other`：无法登陆管理控制台，通常就是普通的生产者和消费者


## 队列属性

声明一个已经存在的队列，假如参数都是一样的话，则返回这个队列。如果参数有不同的话，直接报错。

#### exclusive 私有队列

限制本队列只有一个消费者。

#### auto-delete 自动删除队列

最后一个消费者取消订阅时，队列就会自杀。

### 持久化消息

能从服务器意外崩溃后，重启之后自动恢复的消息称为，持久化消息。要做到这一点，需要保证

- 交换器是持久化的 `durable = true`
- 队列是持久化的 `durable = true`
- 投递模式是持久化的 `delivery mode = 2`

## 消息消费者

#### ack 机制

消费者订阅到队列时 ，如果使用 `auto_ack` 自动确认参数，消息进入`Server socket`开始由操作系统通过网络进行发送，`RabbitMQ-Server`就视为消息被消费了，从而在队列里删除该消息。

而不使用`auto_ack`的话，则需要消费者发送一条`ack`消息给`RabbitMQ-Server`，告知确实正确消费了消息。然后，`RabbitMQ-Server`从队列里删除该消息。

如果出现：

- `RabbitMQ-Server` 链接中断：
  - 消息被视为未消费，重新入队首进行再次投递
  
- 消费者程序有`Bug`忘记`ack`了：
  - `RabbitMQ-Server`在接收到`ack`消息之前，不会再向该消费者发送任何消息了
  - 这个机制可以用来控制应用程序消费速率
  

如果消费一条消息需要比较长时间的话，建议使用`ack`机制，这样可以防止`RabbotMQ-Server`持续不断的消息涌向消费者进程，从而导致过载。

#### reject 机制

如果某消费者进程不想再接收消息了，目前的办法是断开连接，这样消息就会发送给别的监听的消费者进程处理。

现在有了 `reject` 机制：

- 消费者进程收到一条消息后，调用`reject`命令，设置`requeue = true`参数，表示自己不处理这条命令，这样`RabbitMQ-Server`就会重新将这条消息入队，交给其他消费者进程处理
- 如果消费者进程检测到某条消息是错误消息呢？可以调用`reject`命令，设置 `requeue = false`，表示让`RabbitMQ-Server`直接丢弃该消息，如果本队列配置了死信队列的话，这丢弃的消息会堆积在死信队列，以供研发分析原因

#### nack机制