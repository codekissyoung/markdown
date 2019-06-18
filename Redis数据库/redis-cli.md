# Redis-cli 常用命令

## 链接/关闭 Redis 服务器

```bash
redis-cli -h {host} -p {port} -a {mypasswd} 链接redis服务器
redis-cli -h {host} -p {port} {command} 链接并且执行命令
redis-cli shutdown [save|nosave] 关闭redis服务器 [生成|不生成]持久化文件

# 批量删除键
redis-cli keys "scenic_hot_list:*" | xargs redis-cli del

# 如果redis-cli没有设置成系统变量，需要指定redis-cli的完整路径  
/usr/local/redis/redis-cli keys "a*" | xargs /usr/local/redis/redis-cli del

# 如果需要访问密码
redis-cli -a password keys "a*" | xargs redis-cli -a password del

# 指定序号为 0 的数据库
redis-cli -n 0 keys "a*" | xargs redis-cli -n 0 del
```

## 与Redis Server 相关命令

```bash
127.0.0.1:6379> ping 测试到 redis server 的链接是否通畅, server 返回 pong 表示通畅

127.0.0.1:6379> CONFIG GET *                 获取所有配置
127.0.0.1:6379> CONFIG GET loglevel          获取loglevel的配置
127.0.0.1:6379> CONFIG SET loglevel "notice" 设置loglevel
```

## 多数据库

```bash
127.0.0.1:6379> SELECT 15
OK
127.0.0.1:6379[15]>
```

## 设置 KEY 相关的命令

```bash
# 增删改查
DEL KEY                  删除一个键值对，不管它的 VALUE 是什么
del key1 key2 key3       删除多个健
EXISTS key               检查给定 key 是否存在
TYPE key                 返回 key 所储存的值的类型。 string hash list set zset none 表示健不存在
object encoding key_name 查看该健的内部实现编码，一种redis类型往往有几种内部编码实现
KEYS pattern             查找所有符合给定模式( pattern)的 key
RENAME key newkey        修改 key 的名称
RENAMENX key newkey      仅当 newkey 不存在时，将 key 改名为 newkey
RANDOMKEY                从当前数据库中随机返回一个 key
dbsize                   健总数

# 过期时间
EXPIRE key seconds              为给定 key 设置过期时间
PEXPIRE key milliseconds        设置 key 的过期时间以毫秒计
EXPIREAT key timestamp          都用于为 key 设置过期时间。EXPIREAT 命令接受的时间参数是UNIX时间戳(unix timestamp)
PEXPIREAT key m-timestamp       设置 key 过期时间的时间戳(unix timestamp) 以毫秒计
PERSIST key                     移除 key 的过期时间，key 将持久保持
PTTL key                        以毫秒为单位返回 key 的剩余的过期时间。
TTL key                         以秒为单位，返回给定 key 的剩余生存时间(time to live)。-1 表示没设置, -2 健不存在

# 移动 KEY 的位置
MOVE KEY DB  将当前数据库的 key 移动到给定的数据库 db 当中

DUMP KEY                序列化给定 key ，并返回被序列化的值
```

## String 字符串相关命令

```shell
# 设置字符串
SET key value                     设置指定 key 的值
SETNX key value                   只有在 key 不存在时设置 key 的值
SETEX key seconds value           将值 value 关联到 key ，并将 key 的过期时间设为 seconds (以秒为单位)
PSETEX key milliseconds value     这个命令和 SETEX 命令相似，但它以毫秒为单位设置 key 的生存时间，
MSET key value [key value ...]    同时设置一个或多个 key-value 对
MSETNX key value [key value ...]  同时设置一个或多个 key-value 对，当且仅当所有给定 key 都不存在
SETRANGE key offset value         用 value 参数覆写给定 key 所储存的字符串值，从偏移量 offset 开始。
APPEND key value                  如果 key 已经存在并且是一个字符串，则将指定的value追加到该 key 原来值的末尾。
GETSET key value                  将给定 key 的值设为 value ，并返回 key 的旧值(old value)。

# 获取字符串
STRLEN key                        返回 key 所储存的字符串值的长度。
GET key                           获取指定 key 的值
MGET key1 [key2..]                获取所有(一个或多个)给定 key 的值
GETRANGE key start end            返回 key 中字符串值的子字符

# 字符串 Bit 相关
GETBIT key offset               对 key 所储存的字符串值，获取指定偏移量上的位(bit)。
SETBIT key offset value         对 key 所储存的字符串值，设置或清除指定偏移量上的位(bit)。

# Value 为数值
INCR key                    将 key 中储存的数字值增一
INCRBY key increment        将 key 所储存的值加上给定的增量值（increment） 。
INCRBYFLOAT key increment   将 key 所储存的值加上给定的浮点增量值（increment） 。
DECR key                    将 key 中储存的数字值减一。
DECRBY key decrement        key所储存的值减去给定的减量值（decrement） 。
```

## Hash

- hmset 健名 key1 value1 key2 value2 存hash值

```shell
# 设置
HMSET           key field1 value1   [field2 value2 ]    同时将多个 field-value (域-值)对设置到哈希表 key 中
HINCRBY         key field increment                     为哈希表 key 中的指定字段的整数值加上增量 increment
HINCRBYFLOAT    key field increment                     为哈希表 key 中的指定字段的浮点数值加上增量 increment
HSET            key field value                         将哈希表 key 中的字段 field 的值设为 value
HSETNX          key field value                         只有在字段 field 不存在时，设置哈希表字段的值

# 获取
HEXISTS     key field                   查看哈希表 key 中，指定的字段是否存在
HGET        key field                   获取存储在哈希表中指定字段的值
HGETALL     key                         获取在哈希表中指定 key 的所有字段和值
HKEYS       key                         获取所有哈希表中的字段
HLEN        key                         获取哈希表中字段的数量
HMGET       key field1 [field2]         获取所有给定字段的值
HVALS       key                         获取哈希表中所有值

# 删除某个值
HDEL key field1 [field2]            删除一个或多个哈希表字段

HSCAN key cursor [MATCH pattern] [COUNT count] 迭代哈希表中的键值对
```

## List 列表

```shell
# 设置
LPUSH   key value1 [value2]             将一个或多个值插入到列表头部
LPUSHX  key value                       将一个值插入到已存在的列表头部
RPUSH   key value1 [value2]             在列表中添加一个或多个值
RPUSHX  key value                       为已存在的列表添加值
LINSERT key BEFORE|AFTER pivot value    在列表的元素前或者后插入元素
LSET    key index value                    通过索引设置列表元素的值
LTRIM   key start stop                    对一个列表进行修剪(trim)，就是说，让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除

# 弹出操作
LPOP    key                             移出并获取列表的第一个元素，如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止(下同)
BLPOP   key1 [key2 ] timeout            移出并获取列表的第一个元素
RPOP    key                             移除并获取列表最后一个元素
BRPOP   key1 [key2 ] timeout            移出并获取列表的最后一个元素
BRPOPLPUSH source destination timeout   从列表中弹出一个值，将弹出的元素插入到另外一个列表中并返回它
RPOPLPUSH source destination            移除列表的最后一个元素，并将该元素添加到另一个列表并返回

# 正常取值 不弹出
LRANGE key start stop                   获取列表指定范围内的元素
LINDEX key index                        通过索引获取列表中的元素
LLEN key                                获取列表长度

# 删除
LREM key count value                    移除列表元素
```

## Set 集合

```bash
# 添加
SADD key member1 [member2]      向集合添加一个或多个成员

# 集合与集合之间的操作
SDIFF                   key1 [key2]  返回给定所有集合的差集
SDIFFSTORE  destination key1 [key2]  返回给定所有集合的差集并存储在 destination 中
SINTER                  key1 [key2]  返回给定所有集合的交集
SINTERSTORE destination key1 [key2]  返回给定所有集合的交集并存储在 destination 中
SUNION                  key1 [key2]  返回所有给定集合的并集
SUNIONSTORE destination key1 [key2] 所有给定集合的并集存储在 destination 集合中
SMOVE source destination member      将 member 元素从 source 集合移动到 destination 集合

# 获取
SCARD       key            获取集合的成员数
SISMEMBER   key member     判断 member 元素是否是集合 key 的成员
SMEMBERS    key            返回集合中的所有成员
SRANDMEMBER key [count]    返回集合中一个或多个随机数

# 删除元素
SPOP        key                     移除并返回集合中的一个随机元素
SREM        key member1 [member2]   移除集合中一个或多个成员
SSCAN key cursor [MATCH pattern] [COUNT count] 迭代集合中的元素
```

## Zset (Sorted set) 有序集合

```bash
# 添加
ZADD key score1 member1 [score2 member2]  向有序集合添加一个或多个成员，或者更新已存在成员的分数
ZINCRBY key increment member 有序集合中对指定成员的分数加上增量 increment

# 获取
ZCARD               key                                 获取有序集合的成员数
ZCOUNT              key min max                         计算在有序集合中指定区间分数的成员数
ZLEXCOUNT           key min max                         在有序集合中计算指定字典区间内成员数量

ZRANGE              key start stop [WITHSCORES]         通过索引区间返回有序集合成指定区间内的成员
ZRANGEBYLEX         key min max [LIMIT offset count]    通过字典区间返回有序集合的成员
ZRANGEBYSCORE       key min max [WITHSCORES] [LIMIT]    通过分数返回有序集合指定区间内的成员

ZRANK               key member                          返回有序集合中指定成员的索引
ZREVRANGE           key start stop [WITHSCORES]         返回有序集中指定区间内的成员，通过索引，分数从高到底
ZREVRANGEBYSCORE    key max min [WITHSCORES]            返回有序集中指定分数区间内的成员，分数从高到低排序
ZREVRANK            key member                          返回有序集合中指定成员的排名，有序集成员按分数值递减(从大到小)排序
ZSCORE              key member                          返回有序集中，成员的分数值

# 集合之间操作
ZINTERSTORE destination numkeys key [key ...]  计算给定的一个或多个有序集的交集并将结果集存储在新的有序集合 key 中
ZUNIONSTORE destination numkeys key [key ...]  计算给定的一个或多个有序集的并集，并存储在新的 key 中

# 删除
ZREM key member [member ...]    移除有序集合中的一个或多个成员
ZREMRANGEBYLEX key min max      移除有序集合中给定的字典区间的所有成员
ZREMRANGEBYRANK key start stop  移除有序集合中给定的排名区间的所有成员
ZREMRANGEBYSCORE key min max    移除有序集合中给定的分数区间的所有成员

ZSCAN key cursor [MATCH pattern] [COUNT count] 迭代有序集合中的元素（包括元素成员和元素分值）
```