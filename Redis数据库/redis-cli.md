# Redis-cli 常用命令

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
127.0.0.1:6379[15]>
```

## 设置 KEY 相关的命令

```bash
# 增删改查
del KEY                  删除一个键值对，不管它的 VALUE 是什么
del key1 key2 key3       删除多个健
exists key               检查给定 key 是否存在
type key                 返回 key 所储存的值的类型 string hash list set zset none 表示健不存在
object encoding key_name 查看该健的内部实现编码，一种redis类型往往有几种内部编码实现
keys pattern             查找所有符合给定模式( pattern)的 key
renamenx key newkey      仅当 newkey 不存在时，将 key 改名为 newkey
randomkey                从当前数据库中随机返回一个 key
dbsize                   健总数

# 过期时间
expire key seconds              设置 key 过期时间 s
expireat key timestamp          设置 key 过期时间点 s
pexpire key milliseconds        设置 key 过期时间 ms
pexpireat key m-timestamp       设置 key 过期时间点 ms
persist key                     永不过期
ttl key                         剩余生存时间, 单位 s, -1 表示没设置, -2 健不存在
pttl key                        同上，单位 ms                        

# 移动 KEY 的位置
move key db-name                将当前数据库的 key 移动到给定的数据库 db 当中
dump key                        序列化给定 key ，并返回被序列化的值
```

## String 字符串相关命令

```bash
# 设置字符串
set key str                     设置指定 key 的值
setnx key str                   只有在 key 不存在时设置 key 的值
setnx key seconds str           设置 key 的值 和 过期时间 s
psetnx key milliseconds str     同上 ms
mset key str [key str ...]      新增多个
msetnx key str [key str ...]    新增多个
setrange key offset str         从偏移量 offset 开始，覆盖 string 字符串写入
append key str                  追加写入到字符串后面
getset key new-str              给定key, 设置新值，返回旧值

# 获取字符串
strlen key                          给定 key，返回字符串值的长度
get key                             返回指定 key 的值
mget key1 key2 ...                  返回多个
getrange key start end              返回子字符串

# 字符串 Bit 相关
getbit key offset               获取指定偏移量上的位(bit)
setbit key offset value         设置或清除指定偏移量上的位(bit)

# Value 为数值
incr key                    将 key 中储存的数字值增一
incrby key increment        将 key 所储存的值加上给定的增量值（increment） 
incrbyfloat key increment   将 key 所储存的值加上给定的浮点增量值（increment） 
decr key                    将 key 中储存的数字值减一
decrby key decrement        key所储存的值减去给定的减量值（decrement） 
```

## Hash

```bash
# 新增 或 修改
hset            key field value
hsetnx          key field value
hmset           key field1 value1 [field2 value2 ]
hincrby         key field 2                     key.field + 2
hincrbyfloat    key field 0.8                   key.field + 0.8

# 获取
hexists     key field                   
hget        key field                   单个指定字段的值
hmget       key field1 [field2]         多个指定字段的值
hgetall     key                         获取所有健值对
hkeys       key                         所有字段
hlen        key                         字段的数量
hvals       key                         所有值

# 删除
hdel key field1 [field2]                

hscan key cursor [MATCH pattern] [COUNT count] 迭代哈希表中的键值对
```

## List 列表

```bash
# 设置
lpush   key value1 [value2]             左插
lpushx  key value                       
rpush   key value1 [value2]             右插
rpushx  key value                       
linsert key BEFORE|AFTER pivot value    在列表的元素前或者后插入元素
lset    key index value                 通过索引设置列表元素的值
ltrim   key start stop                  只保留指定区间内的元素，区间外的元素都将被删除

# 弹出操作
lpop    key                             左出，若列表为0，则阻塞到超时
blpop   key1 [key2 ] timeout            同上，指定超时时间
rpop    key                             右出
brpop   key1 [key2 ] timeout            右出，指定超时时间
rpoplpush src-key dest-key              # 从 src-key 左出，然后右入到 dest-key
brpoplpush src-key dest-key timeout     # 同上

# 正常取值 不弹出
lrange key start_idx stop_idx           # 获取 指定范围 内的元素
lindex key idx                          # 通过索引获取列表中的元素
llen key                                # 获取列表长度

# 删除
lrem key count value                    # 移除列表元素
```

## Set 集合

```bash
# 添加
sadd key member1 [member2]           # 向集合添加一个或多个成员

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