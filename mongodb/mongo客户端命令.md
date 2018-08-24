# MongoDB 命令

## 连上MongoDB服务器

```bash
➜  ~ mongo              # 先运行 mongo shell 客户端
MongoDB shell version v3.6.3
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.6.3
# 链接到到某个具体的服务器数据库格式
> mongodb://[username:password@]host1[:port1],...[,hostN[:portN]]][/[database][?options]]

# 示例
> mongodb://admin:123456@localhost/  # 使用用户 admin 使用密码 123456 连接到本地的 MongoDB 服务
> mongodb://admin:123456@localhost/test # 顺便指定了数据库
> mongodb://example1.com:27017,example2.com:27017 # 连接 replica pair
> mongodb://localhost,localhost:27018,localhost:27019 # 连接 replica set 三台服务器
# 连接 replica set 三台服务器, 写入操作应用在主服务器 并且分布查询到从服务器
> mongodb://host1,host2,host3/?slaveOk=true
# 直接连接第一个服务器，无论是replica set一部分或者主服务器或者从服务器
> mongodb://host1,host2,host3/?connect=direct;slaveOk=true
> mongodb://localhost/?safe=true # 安全模式连接到localhost:
# 以安全模式连接到replica set，并且等待至少两个复制服务器成功写入，超时时间设置为2秒
> mongodb://host1,host2,host3/?safe=true;w=2;wtimeoutMS=2000
```

- `mongodb://` 这是固定的格式，必须要指定
- `username:password@` 可选项，如果设置，在连接数据库服务器之后，驱动都会尝试登陆这个数据库
- `host1` 必须的指定至少一个host, host1 是这个URI唯一要填写的它指定了要连接服务器的地址如果要连接复制集，请指定多个主机地址
- `portX` 可选的指定端口，如果不填，默认为27017
- `/database` 如果指定`username:password@`，连接并验证登陆指定数据库若不指定，默认打开 test 数据库
- `?options` 是连接选项如果不使用`/database`，则前面需要加上`/`所有连接选项都是键值对`name=value`，键值对之间通过 `&` 或 `;` 隔开
  - `replicaSet=name` 验证`replica set`的名称 `Impliesconnect=replicaSet`
  - `slaveOk=true|false`
    - true: 在`connect=direct`模式下，驱动会连接第一台机器，即使这台服务器不是主在`connect=replicaSet`模式下，驱动会发送所有的写请求到主并且把读取操作分布在其他从服务器
    - false: 在`connect=direct`模式下，驱动会自动找寻主服务器. 在`connect=replicaSet`模式下，驱动仅仅连接主服务器，并且所有的读写命令都连接到主服务器
  - `safe=true|false`
    - true: 在执行更新操作之后，驱动都会发送getLastError命令来确保更新成功(还要参考 wtimeoutMS).
    - false: 在每次更新之后，驱动不会发送getLastError来确保更新成功
  - `w=n` 驱动添加 { w : n } 到getLastError命令. 应用于safe=true
  - `wtimeoutMS=ms`驱动添加 { wtimeout : ms } 到 getlasterror 命令. 应用于 safe=true.
  - `fsync=true|false`
    - `true`: 驱动添加 { fsync : true } 到 getlasterror 命令.应用于 safe=true.
    - `false`: 驱动不会添加到getLastError命令中
  - `journal=true|false`如果设置为 true, 同步到 journal (在提交到数据库前写入到实体中). 应用于 safe=true
  - `connectTimeoutMS=ms`可以打开连接的时间
  - `socketTimeoutMS=ms`发送和接受sockets的时间

## 数据库操作

```bash
> show dbs;
admin   0.078GB
config  0.078GB
local   0.078GB
> db                # 当前数据库
test                # 这个是默认数据库
> use local         # 选择切换数据库 / 创建数据库
switched to db local
```

- admin： 从权限的角度来看，这是"root"数据库要是将一个用户添加到这个数据库，这个用户自动继承所有数据库的权限一些特定的服务器端命令也只能从这个数据库运行，比如列出所有的数据库或者关闭服务器
- local: 这个数据永远不会被复制，可以用来存储限于本地单台服务器的任意集合
- config: 当Mongo用于分片设置时，config数据库在内部使用，用于保存分片的相关信息

### 创建一个数据库并插入一些内容

```bash
> use runoob;
switched to db runoob
> db.runoob.insert({"name":"菜鸟教程"})
WriteResult({ "nInserted" : 1 })
> show dbs;
admin   0.078GB
config  0.078GB
local   0.078GB
runoob  0.078GB
```

## 集合操作

```bash
> db.createCollection(name, options) # 格式

> use test
switched to db test
> db.createCollection("product");   # 创建一个集合
{ "ok" : 1 }
> show tables;
product
system.indexes
> db.createCollection("logs",{capped:true,autoIndexId:true,size:65523,max:1000}); # 创建一个集合
{
	"note" : "the autoIndexId option is deprecated and will be removed in a future release",
	"ok" : 1
}
> show tables;
logs
product
system.indexes
> db.logs.insert({"test":"测试集合生成情况"});  # 往集合里面插入数据
WriteResult({ "nInserted" : 1 })
> show tables;
logs
product
system.indexes
```

- options 是一个 json 串
  - `capped` => `布尔` 可选 如果为 true，则创建固定集合。固定集合是指有着固定大小的集合，当达到最大值时，它会自动覆盖最早的文档。当该值为 true 时，必须指定 size 参数。
  - `autoIndexId` => `布尔`	 可选 如为 true，自动在 _id 字段创建索引。默认为 false。
  - `size` 数值 可选 为固定集合指定一个最大值 以字节计 。如果 capped 为 true，也需要指定该字段。
  - `max` 数值 可选 指定固定集合中包含文档的最大数量。

## 文档操作

```bash
> db.logs.insert({"test":"测试集合生成情况","hehe":"haha"});  # 往集合里面插入数据
```

## 更新数据

```bash
# 格式
> db.collection.update(
   <query>,
   <update>,
   {
     upsert: <boolean>,
     multi: <boolean>,
     writeConcern: <document>
   }
)

> db.col.update({'title':'MongoDB 教程'},{$set:{'title':'MongoDB'}})
> db.col.update( { "count" : { $gt : 15 } } , { $inc : { "count" : 1} },false,true );
```

- `query` : update的查询条件，类似`sql update`查询内where后面的。
- `update` : update的对象和一些更新的操作符（如`$set`,`$inc`...）等，也可以理解为sql update查询内set后面的
- `upsert` : 可选，这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入。
- `multi` : 可选，mongodb 默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。
- `writeConcern` :可选，抛出异常的级别。

```bash
# 格式
> db.collection.save(
   <document>,
   {
     writeConcern: <document>
   }
)

# 以不同的信息 再次保存 56064f89ade2f21f36b03136 来更新
> db.col.save({
    "_id" : ObjectId("56064f89ade2f21f36b03136"),
    "title" : "MongoDB",
    "description" : "MongoDB 是一个 Nosql 数据库",
    "by" : "Runoob",
    "url" : "http://www.runoob.com",
    "tags" : [
            "mongodb",
            "NoSQL"
    ],
    "likes" : 110
})
```

## 查取数据

```bash
> db.logs.find().pretty() # 查出 logs 里所有集合
{ "_id" : ObjectId("5b7abeeccb91d5ed6e8bd691"), "test" : "测试集合生成情况" }
{ "_id" : ObjectId("5b7ac295cb91d5ed6e8bd693"), "oncemore" : "再来一条" }
```

## 删除文档

```bash
# 格式
> db.collection.remove(
   <query>,
   {
     justOne: <boolean>,
     writeConcern: <document>
   }
)

> db.col.remove({'title':'MongoDB 教程'})
> db.col.remove({}) # 删除集合里所有数据
```

## 删除数据库 删除集合

```bash
> use runoob;           # 切换到要删除的数据库
switched to db runoob
> show tables;          # 显示当前数据库的集合
runoob
system.indexes
> db.runoob.drop();     # 删除指定的集合
true
> show tables;
system.indexes
> db.dropDatabase()     # 删除当前数据库
{ "dropped" : "runoob", "ok" : 1 }
```