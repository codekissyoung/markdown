# 深入理解数据库

## sql执行顺序

`FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> UNION -> ORDER BY -> LIMIT`

- FROM 才是 SQL 语句执行的第一步，并非 SELECT 。数据库在执行 SQL 语句的第一步是将数据从硬盘加载到数据缓冲区中，以便对这些数据进行操作
- SELECT 是在大部分语句执行了之后才执行的，严格的说是在 FROM 和 GROUP BY 之后执行的。理解这一点是非常重要的，这就是你不能在 WHERE 中使用在 SELECT 中设定别名的字段作为判断条件的原因。
- 无论在语法上还是在执行顺序上， UNION 总是排在在 ORDER BY 之前。也就是说，先进行聚合，再排序。

```sql
SELECT A.x + A.y AS z
FROM A
WHERE z = 10;  # z 在此处不可用，因为SELECT是最后执行的语句！

SELECT A.x + A.y AS z
FROM A
WHERE (A.x + A.y) = 10; # 重新写一遍 z 所代表的表达式
```

```sql
select A.aaa as a,max(B.bbb) as max_b,min(C.ccc)
from A left join B as BB on A.aaa = B.xxx left join C on B.xxx = C.xxx
where A.aaa = 'xxx' and BB.xxx < 'xxx'
group by A.aaa
having count(*) > 2
order by max_b desc
limit 10
```

- 对上面这条 sql 语句的理解，我们必须按照 sql 的执行顺序来，并且要知道一个道理，先执行的语句 无法引用 后执行的语句中的内容
- 首先，是`from`最先执行，它决定了对哪些表进行引用，将其加载到内存中处理，所以，我们知道，引用了 3 张表 ，A 表是完整的记录，B 表和C表的字段对A表进行补充
- 表引用完后，我们得到的是一整张 大表 ,字段为三表字段之和,字段为` A.aaa A.xxx ... B.bbb B.xxx ...C.ccc C.xxx...` 这样子，记录的话，由于是A表的左连接,所以A表的记录全在，A表记录中 没匹配到B表C表记录 的字段，全部设置为 Null
- 拿到大表后，我们接着使用 `where`条件对大表里面记录进行筛选,由于`select`语句还未执行，所以不能使用`select`语句里面的字段别名，比如`A.aaa`就不能替换为`a`; 而`from`语句中使用的表别名 是可以引用的，因为它已经执行了，比如 `B.xxx` 可以替换为 `BB.xxx`
-　`where`筛选完后,接着 如果有按照某字段分组需求，或者聚合需求，就使用`group by`语句和`聚合函数`进行处理了
- 分组完后，如果对组还有筛选的话，就使用`having`来处理了，`having`条件是对每个分组进行筛选，在条件内的`聚合函数`的作用范围只在该分组内，比如`count(*)`就是只统计该分组内的记录个数，所以`having count(*) > 2`就是筛选出记录数大于2个的分组，再比如`having min(收入) > 1000` 就是筛选出最低收入于1000的组
- 分完组之后，就是`select`挑选数据了，用`select`挑选想要的字段，但是如果进行了`group by`的话，一定要　对除分组字段以外　的字段进行聚合，比如`max(B.bbb)` 和 `min(C.ccc)`
- `select`完数据后，记录是无序的，这时可以对记录进行排序了，`order by max_b desc`,这里就可以使用`select`语句里的别名了，因为`select`已经执行过了
- 最后`limit`选下要输出几条记录


## SQL 语言的核心是对表的引用（table references）

```sql
FROM a, b # 两个表的笛卡尔积 组成的新表
```

- 上面这句 FROM 语句的输出是一张联合表，联合了表 a 和表 b 。如果 a 表有三个字段， b 表有 5 个字段，那么这个 输出表 就有 8 个字段。这个联合表里的数据是 `a * b`，即 a 和 b 的笛卡尔积。换句话说，也就是 a 表中的每一条数据都要跟 b 表中的每一条数据配对。如果 a 表有3 条数据， b 表有 5 条数据，那么联合表就会有 15 条数据。
- FROM 输出的结果被 WHERE 语句筛选后要经过 GROUP BY 语句处理，从而形成新的输出结果。
- 从集合论（关系代数）的角度来看，一张数据库的表就是一组数据元的关系，而每个 SQL 语句会改变一种或数种关系，从而产生出新的数据元的关系,即产生新的表

## ON 条件 vs Where 条件 vs Having 条件

- ON 条件用在表的连接，比如　`from A left join B on A.xxx = B.xxx`
- Where 条件 在表的连接完成后执行，用于筛选记录 `form ... where A.xxx = xxx`
- Having 条件用在where完成筛选，并且再进行`group by`分组之后，用于对分组进行筛选，`group by xxx having count(*) > 2` 用于筛选出记录数多于２个的分组
