# MongoDB 命令

## 连上MongoDB服务器

```bash
mongo                      # 运行 mongo shell 客户端 链接的默认服务器
mongo 101.200.144.41:10246 # 链接到远程的mongod服务器
mongo --nodb               # 启动 mongo shell 而不连接到任何服务器

> mongodb://[username:password@]host1[:port1],...[,hostN[:portN]]][/[database][?options]]
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

## 关闭服务器

```bash
> use admin;           # 先切换到 admin
> db.shutdownServer(); # 关闭服务器
```

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

## 集合

### 创建集合

```bash
> db.createCollection(name, options)  # 格式
> show tables;                        # 查看数据库中有哪些集合
> db.createCollection("product");     # 创建一个集合
> db.createCollection("logs",{capped:true,autoIndexId:true,size:65523,max:1000}); # 创建一个集合

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

### 删除数据库 删除集合

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

## 文档

### 新增文档

```bash
> db.logs.insert({"test":"测试集合生成情况","hehe":"haha"});  # 往集合里面插入文档
```

### 查询文档

```bash
> db.logs.find().pretty() # 查出 logs 里所有集合
{ "_id" : ObjectId("5b7abeeccb91d5ed6e8bd691"), "test" : "测试集合生成情况" }
{ "_id" : ObjectId("5b7ac295cb91d5ed6e8bd693"), "oncemore" : "再来一条" }

> db.col.find({"name":"菜鸟教程"}).pretty()   # 类似条件 where name = "菜鸟教程"
> db.col.find({"likes":{$lt:50}}).pretty()    # where likes < 50
> db.col.find({"likes":{$gt:50}}).pretty()    # where likes > 50
> db.col.find({"likes":{$lte:50}}).pretty()   # where likes <= 50
> db.col.find({"likes":{$gte:50}}).pretty()   # where likes >= 50
> db.col.find({"likes":{$ne:50}}).pretty()    # where likes != 50

> db.col.find({title:/教/})  # 查询 title 包含"教"字的文档
> db.col.find({title:/^教/}) # 查询 title 字段以"教"字开头的文档
> db.col.find({title:/教$/}) # 查询 titl e字段以"教"字结尾的文档
> db.col.find({"key1":"value1", "key2":"value2"}).pretty() # where key1 = value1 and key2 = value2
> db.col.find({likes : {$lt :200, $gt : 100}}).pretty()    # where likes > 100 AND  likes < 200;

> db.col.find({"title" : {$type : 'string'}}); # 如果想获取 "col" 集合中 title 为 String类型 的数据

> db.col.find({},{"title":1,_id:0}); # 取集合中所有文档中的 title 字段, _id = 0 则表示不取 _id 字段

> db.col.find({},{"title":1,_id:0}).limit(1).skip(1) # 从第一条开始，跳过1条，取一条

> db.col.find( { $or: [ {"key1": "value1"}, {"key2":"value2"} ] } ).pretty() # or 链接

# 混合使用 'where likes > 50 AND (name = '菜鸟教程' OR title = 'MongoDB 教程')
> db.col.find({"likes": {$gt:50}, $or: [{"name": "菜鸟教程"},{"title": "MongoDB 教程"}]}).pretty();

> db.imooc_collection.find().count(); # 计算集合里有多少个文档

# 按 x 字段排序，跳过 3 条，取 2 条
> db.imooc_collection.find().skip(3).limit(2).sort({x:1});
```

### 查询聚合数据

```bash
#  select by_user as _id, count(*) as num_tutorial from mycol group by by_user
> db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : 1}}}])

# 计算总和
> db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : "$likes"}}}])

# 计算平均值
db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}])

# 获取集合中所有文档对应值得最小值
db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$min : "$likes"}}}])

# 获取集合中所有文档对应值得最大值
db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$max : "$likes"}}}])

# 在结果文档中插入值到一个数组中
db.mycol.aggregate([{$group : {_id : "$by_user", url : {$push: "$url"}}}])

# 在结果文档中插入值到一个数组中，但不创建副本
db.mycol.aggregate([{$group : {_id : "$by_user", url : {$addToSet : "$url"}}}])

# 根据资源文档的排序获取第一个文档数据
db.mycol.aggregate([{$group : {_id : "$by_user", first_url : {$first : "$url"}}}])

# 根据资源文档的排序获取最后一个文档数据
db.mycol.aggregate([{$group : {_id : "$by_user", last_url : {$last : "$url"}}}])
```

### 查询管道

- `$project`：修改输入文档的结构。可以用来重命名、增加或删除域，也可以用于创建计算结果以及嵌套文档。
- `$match`：用于过滤数据，只输出符合条件的文档。`$match`使用`MongoDB`的标准查询操作。
- `$limit`：用来限制 MongoDB 聚合管道返回的文档数。
- `$skip`：在聚合管道中跳过指定数量的文档，并返回余下的文档。
- `$unwind`：将文档中的某一个数组类型字段拆分成多条，每条包含数组中的一个值。
- `$group`：将集合中的文档分组，可用于统计结果。
- `$sort`：将输入文档排序后输出。
- `$geoNear`：输出接近某一地理位置的有序文档。

```bash
# 这样的话结果中就只还有tilte和author字段了
db.article.aggregate(
    { $project : {
        _id : 0 ,
        title : 1 ,
        author : 1
    }});

# $match用于获取分数大于70小于或等于90记录，然后将符合条件的记录送到下一阶段$group管道操作符进行处理
db.articles.aggregate( [
                        { $match : { score : { $gt : 70, $lte : 90 } } },
                        { $group: { _id: null, count: { $sum: 1 } } }
                       ] );

# 经过$skip管道操作符处理后，前五个文档被"过滤"掉
db.article.aggregate({ $skip : 5 });

# 按日、按月、按年、按周、按小时、按分钟聚合
db.getCollection('m_msg_tb').aggregate(
[
    {$match:{m_id:10001,mark_time:{$gt:new Date(2017,8,0)}}},
    {$group: {
       _id: {$dayOfMonth:'$mark_time'},
        pv: {$sum: 1}
        }
    },
    {$sort: {"_id": 1}}
])
#  $dayOfYear: 返回该日期是这一年的第几天（全年 366 天）。
#  $dayOfMonth: 返回该日期是这一个月的第几天（1到31）。
#  $dayOfWeek: 返回的是这个周的星期几（1：星期日，7：星期六）。
#  $year: 返回该日期的年份部分。
#  $month： 返回该日期的月份部分（ 1 到 12）。
#  $week： 返回该日期是所在年的第几个星期（ 0 到 53）。
#  $hour： 返回该日期的小时部分。
#  $minute: 返回该日期的分钟部分。
#  $second: 返回该日期的秒部分（以0到59之间的数字形式返回日期的第二部分，但可以是60来计算闰秒）。
#  $millisecond：返回该日期的毫秒部分（ 0 到 999）。
#  $dateToString： { $dateToString: { format: , date: } }。
```

### 更新文档

```bash
# 格式
> db.collection.update(
   <query>,     # 要查找的记录 条件查询
   <update>,    # 要更新成的数据
   upsert: <boolean>,
   multi: <boolean>,
   writeConcern: <document>
)

> db.imooc_collection.update({x:1},{x:999}); # 更新整条文档
> db.col.update( {'title':'MongoDB 教程'},{$set:{'title':'MongoDB'}}); # 只更新 title 字段
> db.col.update( { "count" : { $gt : 15 } } , { $inc : { "count" : 1} }, false , true ); # 更新找到的多条数据
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

### 删除文档

```bash
# 格式
> db.collection.remove(
   <query>,
   justOne: <boolean>,
   writeConcern: <document>
)

> db.col.remove({'title':'MongoDB 教程'})
> db.col.remove({})                       # 删除col集合里所有文档
```

## 索引

- 好处：加快索引相关的查询
- 缺陷: 增加磁盘空间消耗，降低写入性能

```bash
> db.imooc_collection.getIndexes();                  # 获取当前集合所有索引

> db.collection.createIndex( keys, options )         # 格式
> db.col.createIndex( {"title":1} );                 # 按 title 字段建立正序索引
> db.col.createIndex( {"title":1,"description":-1} ) # 按 title 字段建立正序索引 然再按 description 倒序

> db.values.createIndex({open: 1, close: 1}, {background: true});
> db.values.createIndex({name: 1}, {unique: true});  # 唯一索引，name字段相同的值只能允许有一个
> db.values.createIndex({name:1},{sparse:true});     # 不为不存在该字段的 文档 创建索引

> db.imooc.dropIndex("normal_index"); # 删除 normal_index 索引
```

- `background` Boolean 建索引过程会阻塞其它数据库操作，background可指定以后台方式创建索引，即增加 "background" 可选参数。 "background" 默认值为false。
- `unique Boolean` 建立的索引是否唯一。指定为true创建唯一索引。默认值为false.
- `name string` 索引的名称。如果未指定，MongoDB的通过连接索引的字段名和排序顺序生成一个索引名称。
- `sparse Boolean` 对文档中不存在的字段数据不启用索引；这个参数需要特别注意，如果设置为true的话，在索引字段中不会查询出不包含对应字段的文档.。默认值为 false.
- `expireAfterSeconds integer` 指定一个以秒为单位的数值，完成 TTL设定，设定集合的生存时间。
- `v index version`索引的版本号。默认的索引版本取决于mongod创建索引时运行的版本。
- `weights document`索引权重值，数值在 1 到 99,999 之间，表示该索引相对于其他索引字段的得分权重。
- `default_language string`对于文本索引，该参数决定了停用词及词干和词器的规则的列表。 默认为英语
- `language_override string` 对于文本索引，该参数指定了包含在文档中的字段名，语言覆盖默认的language，默认值为 language.

### _id 索引

- 每个插入的文档，MongoDb都会自动生成唯一的 _id 字段
- 默认自动在 _id 创建索引

### 单键索引

- 对集合中的某个键创建索引,值为一个单一的值 例如字符串，数字，日期

### 多键索引

- 值具有多个记录，比如数组

### 复合索引

```bash
> db.imooc.createIndex({x:1,num:1});  # 在使用 x 和 num 一起查询时，就可以使用这个索引了
```

### 过期索引

- 在一段时间后会过期的索引，过期后对应的数据也会被删除
- 适合存储一些在一段时间之后会失效的数据，比如用户的登录信息，存储的日志等
- 存储在过期索引字段的值必须是指定的时间类型,ISODate 或者 ISODate数组，不能使用时间戳，否则不能被自动删除
- 如果指定了ISODate数组，则按照最小的时间进行删除
- 过期索引不能是复合索引
- 删除时间不精确，删除过程是后台程序每 60s 跑一次，并且删除也需要一些时间，所以存在误差

```bash
> db.imooc.createIndex({x:1},{expireAfterSeconds:10});

> db.imooc.createIndex({time:1},{expireAfterSeconds:30});
> db.imooc.insert({time:new Date()}); # 这条文档会在 30s 后自动删除
```

### 全文索引

- 对字符串与字符串数组创建全文可搜索的索引

```bash
db.articles.createIndex({title:"text"});
db.articles.createIndex({title:"text",content:"text"});
db.articles.createIndex({"$**":"text"});  # 对集合中所有字段创建一个大的全文索引

# 利用全文索引进行查询
db.articles.find({$text:{$search:"coffee"}});
db.articles.find({$text:{$search:"aa bb cc"}});     # 查找多个关键字 用空格分开
db.articles.find({$text:{$search:"aa bb -cc"}});    # 查找多个关键字 用空格分开，-cc 表示不包含 cc
db.articles.find({$text:{$search:"\"aa\" \"bb\" \"cc\""}}); # 查询同时包含 aa bb cc 的文章
```

- 全文索引相识度

```bash
# 查询 并且按照 相识度排序
> db.imooc.find({$text:{$search:"aa bb"}},{score:{$meta:"textScore"}}).sort({score:{$meta:"textScore"}});
```

- 全文索引限制
  - 每次查询只能指定一个 $text 查询
  - $text查询不能出现在$nor查询
  - 查询中如果包含了$text, hint 不再起作用
  - 目前不支持中文

### 地理位置索引

- 将一些点的位置存储在MongoDB中，创建索引后可以按照位置来查找其他的点
- `2d`索引:用于存储和查找平面上的点，`2dsphere`索引，用于存储和查找球面上的点
- 举例： 1.查找距离某个点一定距离内的点 2.查找包含在某区域内的点
- 限制 经度: [-180,180] ,纬度 : [-90,90]

```bash
> db.user_location.createIndex({"w":"2d"});
> db.user_location.insert({"w":[1,1]});

> db.user_location.find({w:{$near:[1,1]}}); # 返回 100 个距离 [1,1] 最近的点
> db.user_location.find({w:{$near:[1,1],$maxDistance:10}}); # 返回距离 [1,1] 距离10以内的点

> db.location.find({w:{$geoWithin:{$box:[[0,0],[3,3]]}}}); # 查询在矩形内的点
> db.location.find({w:{$geoWithin:{$center:[[0,0],5]}}});  # 查询圆心为 0,0 半径为5的圆内的点
> db.location.find({w:{$geoWithin:{$polygon:[[0,0],[1,1],[0,1]]}}}); # 查询多边形内的点
> db.runCommand({
  geoNear:<collection>,
  near:[x,y]
  minDistance: # 对 2d 无效
  maxDistance:
  num:
});
```

- `2dsphere` 球面地理位置索引

### 查询索引构建情况

- `mongostat -h 127.0.0.1:12027` 查看mongod服务运行情况

### profile 启用慢查询

```bash
> db.getProfilingStatus();
```

### 日志

```bash
verbose = vvvvv # 记录日志的级别
```

### explain 分析 特定查询执行情况

```bash
> db.imooc.find({x:1}).explain();
```