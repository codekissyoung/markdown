# MySQL 使用军规

## 核心军规

- 别在mysql里做运算,像 md5() Rand()等函数完全没必要用！运算的部分移动到程序端。
- 单库不要超过300-400个表，单表int类型不要超过1000W条记录，含char的不要超过500W条。
- 保持表的身段苗条：单表1G体积，500W 进行估算，如果是纯int字段不要超过50个，含char 则不要超过20个。字段上限为 20-50个。
- 平衡好范式和冗余:效率优先，减小代码复杂度优先，可以适当冗余！
- 拒绝3B:Big SQL,Big Transaction(大事务) ,Big Batch(大批量)

## 字段类军规

- `TINYINT(1Byte) SMALLINT(2B) MEDIUMINT(3B) INT(4B)、 BIGINT(8B) FLOAT(4B) DOUBLE(8B) DECIMAL(M,D)`
- 数字索引优于字符索引：用无符号INT存储IP，而非`CHAR(15)`
- 优先使用`ENUM`或`SET`：值已知，且有限！ENUM占用1字节，转为数值运算,SET视节点定，最多占用8字节，比较时需要加'单引号(即使是数值)`sex enum('F','M') COMMENT '性别'`
- 避免使用`NULL`字段,很难进行查询优化，NULL列加索引，需要额外空间，含NULL复合索引无效
- 少用并拆分TEXT/BLOB

## 索引类军规

- 谨慎合理添加索引,索引的影响：加快查询，减慢更新，插入，索引并不是越多越好,结合核心SQL优先考虑覆盖索引：比如，如果根据"商品编号"查询的Sql很多，那么给它加个索引是合适的,再如：给性别加索引是不合适的。索引最好不要超过字段数的20%。
- 字符字段必须建前缀索引 `pinyin varchar(100) COMMENT '小区拼音',KEY 'idx_pinyin' ('pinyin'(8))`
- 不在在索引列进行数学运算或凼数运算
- 尽量不要用外键，使用程序进行约束！外键可节省开发量，比如不用写更新冗余字段的代码了！有额外开销,逐行操作,可‘到达’其它表，意味着锁,高并发容易死锁
- 自增列或全局ID做INNODB主键

## SQL类军规

- 大SQL vs 多个简单sql,5000+ QPS的高并发中，1秒大SQL意味着？可能一条大SQL就把整个数据库堵死!!!
- 保持事务/DB连接短小精悍
  - 事务/连接 使用原则：即开即用，用完即关
  - 不事务无关操作放到事务外面, 减少锁资源的占用
  - 不破坏一致性前提下，使用多个短事务代替长事务
- 线上OLTP系统（线下库另论）少用 SP/TRIG/FUNC
  - 尽可能少用存储过程
  - 尽可能少用触发器
  - 减用使用MySQL凼数对结果进行处理,由客户端程序负责
- 尽量不用SELECT * ，叧取需要数据列
  - 更安全的设计：减少表变化带来的影响
  - 为使用covering index提供可能性
  - Select/JOIN减少硬盘临时表生成，特别是有TEXT/BLOB时

- 改写OR为IN()，OR效率：O(n)，IN 效率：O(Log n)
- 避免负向查询 NOT、 !=、 <>、 !<、 !>、 NOT EXISTS、 NOT IN、NOT LIKE等
- 避免 % 前缀模糊查询 B+ Tree，使用不了索引，导致全表扫描

```sql
MySQL> select * from post WHERE title like '北京%' ;298 rows in set (0.01 sec)
MySQL> select * from post WHERE title like '%北京%' ;572 rows in set (3.27 sec)
```

- `COUNT(*)`的资源开销大，尽量别用少用
- 计数统计
  - 实时统计：用`memcache`，双向更新，凌晨跑基准
  - 非实时统计：尽量用单独统计表，定期重算

- 高效分页

```sql
Select * from table limit 10000,10; # limit 偏移量越大，越慢 , 改为
Select * from table WHERE id>=23423 limit 11;
```

## 数据库自动化运维

- 强有力的监控系统，不仅能做到监控报警，还能做到对于预期故障能自动处理等，比如zabbix
- 自动审核系统，这个主要是涉及到SQL审核，表结构设计，字符集等，线上线下保持一致，
- 性能分析系统，主要是涉及慢查询日志的收集，归类，主动推送至DBA&开发人员等；
- 数据库容量分析系统，涉及到OS层容量，数据库性能变化，调整压力等；
- 备份还原系统，这是最基本的，最后的救命稻草；
- 管理系统， 从mysql安装到统一配置、调整，只需要从页面搞定；
- 中间层这块不多说，有实力并且有业务需求的才会做的有意义；以上几点国内没有公司一一做完整的
- 综上，可以先从单台MySQL了解其原理，以python，shell为辅助，开发周边工具等；

## 触发器

- 触发器（trigger）是个特殊的存储过程，它的执行不是由程序调用，也不是手工启动，而是由事件来触发，比如当对一个表进行操作（ insert，delete， update）时就会激活它执行。触发器经常用于加强数据的完整性约束和业务规则等。 触发器可以从 DBA_TRIGGERS ，USER_TRIGGERS 数据字典中查到。触发器有一个非常好的特性就是:触发器可以禁止或回滚违反引用完整性的更改，从而取消所尝试的数据修改。

- 触发器的优点
  - 触发器的"自动性",对程序员来说，触发器是看不到的，但是他的确做事情了，如果不用触发器的话，你更新了user表的name字段时，你还要写代码去更新其他表里面的冗余字段，我举例子，只是一张表，如果是几张表都有冗余字段呢，你的代码是不是要写很多呢，看上去是不是很不爽呢。
  - 触发器的数据完整性,触发器有回滚性，就是你要更新五张表的数据，不会出现更新了二个张表，而另外三张表没有更新。但是如果是用php代码去写的话，就有可能出现这种情况的，比如你更新了二张表的数据，这个时候，数据库挂掉了。你就郁闷了，有的更新了，有的没更新。这样页面显示不一致了，变有bug了。

## 前缀索引

```sql
-- 该语句查询访问量排前十的城市及它的访问量.假定 city 字段是很长的字符串.
mysql> select count(*) as cnt, city from my_table group by city order by cnt desc limit 10;

-- group by 的内容变成了 left(city, 3) 当然,该语句查询了的结果可能和前面不一样. 
-- left 的第二个参数越长,肯定越准确.多试几次,索引选择性最高的数值.
mysql> select count(*) as cnt, left(city, 3) as pref from my_table 
mysql> group by city order by cnt desc limit 10;

```

- 索引的选择性是指不重复的索引列数和数据表的记录总数的比值.索引的选择性越高则查询效率越高.因为它可以让 MySQL 在查找时过滤掉更多的行
- 唯一索引的选择性是 1, 这是最好的索引选择性,性能也是最好的.

- 计算方式可能是: `select count(distinct city) / count(*) from my_table;`

```sql
-- 找出最高选择性的办法:
select count(distinct left(city, 3)) / count(*) as sel3,
count(distinct left(city, 4)) / count(*) as sel4 ,
count(distinct left(city, 5)) / count(*) as sel5 ,
count(distinct left(city, 6)) / count(*) as sel6 ,
count(distinct left(city, 7)) / count(*) as sel7 ,
from my_table

-- 看出,从 sel7 开始,上升的幅度已经很少了,如果再往后增成 8, 9 一样.
-- 所以,选择 7 即可.有些时候为了效率考虑,可以选择更低的 5, 6
sel3   sel4   sel5   sel6   sel7
0.0239 0.0293 0.0305 0.0309 0.0310

-- 我们就可以创建前缀索引
mysql> alter table my_table add key(city(7));

```

- 前缀索引的缺点是, MySQL 无法使用前缀索引做 order by, group by.

## 解决mysql瓶颈：

- mysql 集群：
- msyql 负载均衡：将select 语句发送到从数据库，将其他语句发送到主数据库！
- mysql 主数据库：master     mysql  从数据库：slave
- sql 语句分析：select 语句是最多的！
- msyql 数据同步：mysql 内置的解决方案：复制技术。环形复制。
- 如果数据量特别大： 数据量大于 10 亿 就得利用 Mysql优化技术了！

## 请问加个数据表前缀有什么好处？

- 因为一个网站可能会加载不同的模块, 比如一个网站上同时加载 discuz 论坛和 webim 聊天到一个数据库里面, 不同的前缀就会把他们区分开来, 而且避免数据表重复
