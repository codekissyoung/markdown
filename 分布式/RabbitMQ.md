# RabbitMQ

[RabbitMQ PHP 版](https://xiaoxiami.gitbook.io/rabbitmq_into_chinese_php/ying-yong-jiao-cheng/php-ban/3-publish_subscribe.md)

## 基础

```bash
$ sudo apt-get install erlang
$ sudo apt-get install rabbitmq-server
```

```bash
$ sudo rabbitmq-server -detached            # 启动 rabbitmq-server daemon
$ sudo rabbitmqctl cluster_status           # 查看集群状态
$ sudo rabbitmqctl status                   # 查看当前节点状态
$ sudo rabbitmqctl stop                     # 关闭服务 连同节点上的其它应用程序一同关闭了
$ sudo rabbitmqctl stop_app                 # 关闭服务 只关闭rabbitmq节点
$ sudo rabbitmq-plugins enable plugin-name  # 开启插件
$ sudo rabbitmq-plugins disable plugin-name # 关闭插件
$ sudo rabbitmq-plugins enable rabbitmq_management   # 启用 web 管理界面插件
```

默认端口:

```bash
4369 (epmd), 25672 (Erlang distribution)
5672, 5671 (AMQP 0-9-1 without and with TLS)
15672 (if management plugin is enabled)
61613, 61614 (if STOMP is enabled)
1883, 8883 (if MQTT is enabled)
web : 15672                         # 通过浏览器访问
api_port : 5672
```

添加 `root` 管理用户：

```bash
$ sudo rabbitmqctl add_user username password               # 新增用户
$ sudo rabbitmqctl delete_user username                     # 删除用户
$ sudo rabbitmqctl list_users                               # 查看用户列表
$ sudo rabbitmqctl set_user_tags User Tag [Tag2 ...]        # 设定角色

link3@link3:~$ sudo rabbitmqctl add_user root root
Creating user "root"
link3@link3:~$ sudo rabbitmqctl set_permissions -p / root ".*" ".*" ".*"
Setting permissions for user "root" in vhost "/"
link3@link3:~$ sudo rabbitmqctl set_user_tags root administrator
Setting tags for user "root" to [administrator]
```

用户角色`Tag`:

- `administrator`：可登陆管理控制台，可查看所有的信息，并且可以对用户，策略(policy)进行操作
- `monitoring`：可登陆管理控制台，同时可以查看 rabbitmq 节点的相关信息(进程数，内存使用情况，磁盘使用情况等)
- `policymaker`：可登陆管理控制台, 同时可以对 policy 进行管理。但无法查看节点的相关信息
- `management`：仅可登陆管理控制台，无法看到节点信息，也无法对策略进行管理
- `other`：无法登陆管理控制台，通常就是普通的生产者和消费者

```bash
$ sudo rabbitmqctl add_vhost xxx                               # 新建virtual_host
$ rabbitmqctl delete_vhost xxx                                   # 撤销virtual_host
```

```bash
$ sudo rabbitmqctl reset            # 清除所有队列
```

#### 查看服务器信息

```bash
$ sudo rabbitmqctl list_queues          # 默认会查看 / 下的队列, -p vhost_name 指定
$ sudo rabbitmqctl list_exchanges
$ sudo rabbitmqctl list_bindings
$ sudo rabbitmqctl list_connections
$ sudo rabbitmqctl list_channels
```

#### 集群

```bash
$ sudo rabbitmqctl cluster_status                       # 查看集群内节点信息
$ sudo rabbitmqctl join_cluster 节点@主机名             # 创建集群
```

##

`Message` : `{ Label, payload }` , `Broker` 根据 `Label` 将 `Message` 分发给不同的 `Consumer`。

交换器类型:

fanout

direct

topic

headers

```bash
<?php
return [
    'vendor' => [
        'path' => '../vendor'
    ],
    'rabbitmq' => [
        'host' => '127.0.0.1',
        'port' => '5672',
        'login' => 'guest',
        'password' => 'guest',
        'vhost' => '/'
    ]
];
```

```bash
$config = require "../config.php";
require_once $config['vendor']['path'] . '/autoload.php';

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

$connection = new AMQPStreamConnection(
                                $config['rabbitmq']['host'],
                                $config['rabbitmq']['port'],
                                $config['rabbitmq']['login'],
                                $config['rabbitmq']['password'],
                                $config['rabbitmq']['vhost'] );
$channel = $connection->channel();

$channel -> exchange_declare( 'link.logs', 'fanout', false, false, false);
$channel -> queue_declare('error', false, true, false, false);
$channel -> queue_bind('error', 'link.logs');

$data = implode(' ', array_slice($argv, 1));
if(empty($data))
    $data = "Hello World!............fuk";

// delivery 持久化
$msg = new AMQPMessage($data, ['delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT] );

$channel->basic_publish( $msg, 'link.logs' );
echo " [x] Sent ", $data, "\n";
$channel->close();
$connection->close();
```

```php
$config = require "../config.php";

require_once $config['vendor']['path'] . '/autoload.php';

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

$connection = new AMQPStreamConnection(
                                    $config['rabbitmq']['host'],
                                    $config['rabbitmq']['port'],
                                    $config['rabbitmq']['login'],
                                    $config['rabbitmq']['password'],
                                    $config['rabbitmq']['vhost'] );
$channel = $connection->channel();

$channel -> exchange_declare('link.logs', 'fanout', false, false, false);

list($queue_name, , ) = $channel -> queue_declare("", false, false, true, false );

/*
$channel->queue_declare('task_queue', false, true, false, false);

echo ' [*] Waiting for messages. To exit press CTRL+C', "\n";

$callback = function($msg) {
  echo " [x] Received ", $msg->body, "\n";
  sleep(substr_count($msg->body, '.'));
  echo " [x] Done", "\n";
  $msg->delivery_info['channel']->basic_ack($msg->delivery_info['delivery_tag']);
};

$channel->basic_qos(null, 1, null);
$channel->basic_consume('task_queue', '', false, false, false, false, $callback);

while(count($channel->callbacks)) {
    $channel->wait();
}


*/

var_dump($queue_name);
$channel->close();
$connection->close();

```
