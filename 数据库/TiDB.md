# TiDB

[RocksDB](https://rocksdb.org.cn/doc.html)
[存储引擎原理：LSM](https://www.tuicool.com/articles/qqQV7za)
[LSM树 和 TSM存储引擎 简介](https://blog.csdn.net/cymm_liu/article/details/88344215)

## 如何存储数据

数据以什么样的形式存储到磁盘？

`TiKV`选择了`Key-Value`模型，`Key` `Value`都是`Byte`数组，组成了`Key-Value-Pair`作为实际存储的对象。

```bash
key               | Value                      |
-------- -------- | -------- -------- -------- |
00000000 00000010 | 10100100 01000010 00100000 |
00000000 00000011 | 10100100 01000010 00100000 |
00000000 00000100 | 10100100 01000010 00100000 |
00000000 00000101 | 10100100 01000010 00100000 |
```

`Key`的二进制表达出的位置，就是该`Key-Value-Pair`存储的起始位置。

所以，`TiKV`存储的数据，实际上是按照`Key`的二进制有序存储的。

所以，如果我们知道了一个具体的`Key`，就可以`Seek`到该`Key`的所在位置，从而读取`Key-Value-Pair`来取得`Value`；并且，还可以通过`Next()`方式，递增地顺序获取大于该`Key`的`Key-Value`。

`TiKV`采用了单机的`RocksDB`实现上述`Key-Value`存储方式，我们可以将数据快速地存储在磁盘上。

### Raft协议

- `Leader`选举
- 成员变更
- 日志复制

`TiKV`实现了`Raft`协议，将数据复制到多台机器，以防单机失效。数据的写入是通过 `Raft` 这一层的接口写入，而不是直接写 `RocksDB`。

![](https://img.codekissyoung.com/2020/01/07/2ee7e4f2d47669f4e1355bdd96f86a94.png)

### Region

假设只有一份完整的`Key-Value-Pair`数据，整个数据量非常大，不可能存储在一台机器上，那么该如何将一份完整数据切分成多个片段呢？

- 按照 `Key` 做 `Hash`，根据 `Hash` 值选择对应的存储节点
- 分 `Range`，某一段连续的 `Key` 都保存在一个存储节点

`TiKV`采用的是分`Range`的做法，整个数据集分成多段后，每一段称为一个`Region`。

```bash
| Region-001: 0000,000,000 ~ 1000,000,000 |
| Region-002: 1000,000,000 ~ 2000,000,000 |
| Region-003: 2000,000,000 ~ 3000,000,000 |
...
```

### 整体架构

![](https://img.codekissyoung.com/2020/01/07/ad20957a40a455425008621758b80ce6.png)

说明：

- 以 `Region` 为单位，将数据 **均匀** 存储在集群中所有的节点中，同一个`Region`至少 3 份，切必须存储在不同节点
- 同一个`Region`的多个`Replica`副本组成一个`Raft Group`，也就是通过`Raft`来保持数据的复制和一致性
- 一个`Raft Group`中
  - 某个`Replica`作为`Leader`，所有数据的`Read`和`Write`都只能通过`Leader`
  - 其他的`Replica`作为`Follower`，只能被动地接收来自`Leader`的同步数据
- 上述所有实现，对于客户端是透明的，整套系统提供了一个统一的访问接口（某个组件实现），能通过任意一个`Key` 就能查询到这个`Key` 在哪个`Region`中，以及这个`Region`的`Leader Replica`目前在哪个节点上。

### MVCC

`MVCC` :  多版本控制。

两个`Client` 同时去修改一个 `Key` 的 `Value`，正常情况都是加锁，强行要求依次修改。但是，在分布式场景下，可能会带来性能以及死锁问题。

`TiKV` 的 `MVCC` 实现是通过在 `Key` 后面添加 `Version` 来实现:

```bash
Key1-Version3 -> Value
Key1-Version2 -> Value
Key1-Version1 -> Value
……
Key2-Version4 -> Value
Key2-Version3 -> Value
Key2-Version2 -> Value
Key2-Version1 -> Value
……
KeyN-Version2 -> Value
KeyN-Version1 -> Value
```

### 事务

`TiKV` 的事务采用的是 `Percolator` 模型。

`TiKV` 的事务采用乐观锁，事务的执行过程中，不会检测写写冲突，只有在提交过程中，才会做冲突检测，冲突的双方中比较早完成提交的会写入成功，另一方会尝试重新执行整个事务。

- 业务的写入冲突不严重的情况下，这种模型性能会很好，比如随机更新表中某一行的数据，并且表很大。
- 如果业务的写入冲突严重，性能就会很差，举一个极端的例子，就是计数器，多个客户端同时修改少量行，导致冲突严重的，造成大量的无效重试。

## 关系模型到`Key-Value`模型的映射

如何在 `KV` 结构上保存 `Table`?
如何在 `KV` 结构上运行 `SQL` 语句?

```sql
CREATE TABLE User {
	ID int,
	Name varchar(20),
	Role varchar(20),
	Age int,
	PRIMARY KEY (ID),
	Key idxAge (age)
};
```

对于一个 `Table` 来说，需要存储的数据包括三部分:

- 表的元信息
- `Table`中的`Record`记录
- 索引数据

操作：

- `Insert` : 将 `Record` 写入 `KV`，并且建立好索引数据

- `Update` : 将 `Record` 更新的同时，更新索引数据

- `Delete` : 删除 `Record` 的同时，将索引也删除

- `Select`:
  - 点查
  - 范围查

```sql
select name from user where id=1;                       # 点查
select name from user where age > 30 and age < 35;      # 范围查
```

`TiDB`支持 `Primary Index` 、`Secondary Index`、 `Unique Index` 和 `Unique Index`。

### TiDB 实现

每个表`Table`分配一个`TableID`(集群内唯一 `int64`)
每一行`Record`分配一个`RowID`(表内唯一 `int64`)

```sql
Key: tablePrefix{$tableID}_recordPrefix{$rowID}
Value: [col1, col2, col3, col4]
```

这就实现了：每条`Record`记录的`Key`是唯一的。

每个索引分配一个 `IndexID` (表内唯一`int64`)

`Unique Index:`

```sql
Key: tablePrefix{tableID}_indexPrefixSep{indexID}_indexedColumnsValue
Value: rowID
```

非`Unique Index`

```sql
Key: tablePrefix{tableID}_indexPrefixSep{indexID}_indexedColumnsValue_{rowID}
Value: null
```

这就实现了：索引中的每行数据构造出唯一的 `Key`

### 整体架构

![](https://img.codekissyoung.com/2020/01/07/b39d265048f01b4bc6cbcf6c3cfab96e.png)

`TiDB Servers` 这一层，这一层的节点都是无状态的节点，本身并不存储数据，节点之间完全对等。负责处理用户请求，执行 `SQL` 运算逻辑。

### SQL运算

将 `SQL` 查询映射为对 `KV` 的查询，再通过 `KV` 接口获取对应的数据，最后执行各种计算。

```bash
Select count(*) from user where name="TiDB";
```

- 构造出 Key Range：一个表中所有的 RowID 都在 [0, MaxInt64) 这个范围内，那么我们用 0 和 MaxInt64 根据 Row 的 Key 编码规则，就能构造出一个 [StartKey, EndKey) 的左闭右开区间
- 扫描 Key Range：根据上面构造出的 Key Range，读取 TiKV 中的数据
- 过滤数据：对于读到的每一行数据，计算 name="TiDB" 这个表达式，如果为真，则向上返回这一行，否则丢弃这一行数据
- 计算 Count：对符合要求的每一行，累计到 Count 值上面

这个方案肯定是可以 Work 的，但是并不能 Work 的很好，原因是显而易见的：

- 在扫描数据的时候，每一行都要通过 KV 操作同 TiKV 中读取出来，至少有一次 RPC 开销，如果需要扫描的数据很多，那么这个开销会非常大
- 并不是所有的行都有用，如果不满足条件，其实可以不读取出来
- 符合要求的行的值并没有什么意义，实际上这里只需要有几行数据这个信息就行

如何避免上述缺点：

- 首先我们需要将计算尽量靠近存储节点，以避免大量的 RPC 调用
- 将 Filter 也下推到存储节点进行计算，这样只需要返回有效的行，避免无意义的网络传输
- 将聚合函数、GroupBy 也下推到存储节点，进行预聚合，每个节点只需要返回一个 Count 值即可
- 由 tidb-server 将 Count 值 Sum 起来

![](https://img.codekissyoung.com/2020/01/07/ceac02cef174ec94a250c892237ec485.png)

### SQL层架构

![](https://img.codekissyoung.com/2020/01/07/fd9d335ac125228ebcc37f7002474871.png)

用户的 SQL 请求会直接或者通过 Load Balancer 发送到 tidb-server，tidb-server 会解析 MySQL Protocol Packet，获取请求内容，然后做语法解析、查询计划制定和优化、执行查询计划获取和处理数据。数据全部存储在 TiKV 集群中，所以在这个过程中 tidb-server 需要和 tikv-server 交互，获取数据。最后 tidb-server 需要将查询结果返回给用户。

## 调度

`TiKV-Node` 向 `PD` 汇报的信息：

- 总磁盘容量
- 可用磁盘容量
- 承载的 `Region` 数量
- 数据写入速度
- 发送/接受的 `Snapshot` 数量（`Replica` 之间可能会通过 `Snapshot` 同步数据）
- 是否过载
- 标签信息（标签是具备层级关系的一系列 Tag）

每个 `Raft Group` 的 `Leader` 会定期向 PD 汇报信息:

- Leader 的位置
- Followers 的位置
- 掉线 Replica 的个数
- 数据写入/读取的速度
