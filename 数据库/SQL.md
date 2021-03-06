# MySQL 中的SQL语句

本文是常见的一些`SQL`语句的笔记。

## 语句顺序

```sql
select list               -- 所选择的列
from tbname               -- 要查询哪些表
where row_constraint      -- 行必须满足的条件
group by grouping_columns -- 结果如何分组
having group_constranint  -- 分组必须满足的条件
order by sorting_columns  -- 结果如何排序
limit count;              -- 限制结果里的行数
```

## select

`as` 别名

```sql
select concat (first_name ,' ',last_name) as name ,concat(city,', ',state) as Birthplace 
from president;
+-----------------------+-------------------------+
| name                  | Birthplace              |
+-----------------------+-------------------------+
| George Washington     | Wakefield, VA           |
```

### 返回不重复值

```sql
select distinct a,b,c from tb_name; # 记录中，abc三个字段全相同才算重复
```

### 返回条数

```sql
select * from tb_name limit 5   # 第1条起,返回 5 条
select * from tb_name limit 3,5 # 跳过3条,返回 5 条
```

### 记录排列顺序

```sql
select * from tb_name order by A asc,B desc　# 先按A升序排列，A列相同的再按B降序排列

select last_name ,first_name, death from president order by death desc,last_name asc;

# death 是死亡日期，为null的人说明没死，应该按death排序的时候排在前面的,所以要采用下列语句
# if() 是函数，如果death is null 正确，则取值0,不正确则取值1,asc升序排列，0 在 1的前面

select last_name ,first_name, death from president 
order by if(death is null,0,1) asc , death desc , last_name asc;
+------------+---------------+------------+
| last_name  | first_name    | death      |
+------------+---------------+------------+
| Bush       | George W.     | NULL       |
| Bush       | George H.W.   | NULL       |
| Carter     | James E.      | NULL       |
| Clinton    | William J.    | NULL       |
| Obama      | Barack H.     | NULL       |
| Ford       | Gerald R.     | 2006-12-26 |
| Reagan     | Ronald W.     | 2004-06-05 |
```

### 过滤数据

```sql
select * from T where A = 3;             -- 返回 A 列值为3的行
select * from T where A between 3 and 5; -- 在3和5之间
select * from T where A is not null;     -- 过滤值为NULL的行,正常数据库设计中，不允许包含NULL
select * from T where id = 10 and price < 100
select * from T where id = 10 or id =34
select * from T where (id = 10 or id =20) and price >10

select * from T where price =10 or price = 20 and star > 10     -- and 优先级高于 or
select * from T where price =10 or (price = 20 and star > 10)   -- 等价上句

-- in 和 not in 触发全表扫描，尽量少用
select * from T where id in (10,20,23);
select * from T where id not in (29,34,53);

-- in 子句
select * from T where id in (select uid in tb_name where ...);
```

### 使用通配符过滤 完全匹配 LIKE

```sql
select * from T where name like 'code%';  % 表示任意数量的字符,得到name以code开头的行
select * from T where name like '_abc';   _ 匹配任意一个字符,abc结尾的行
select * from T where name like 1000;     通配符是完全匹配,找出 name 为1000的行
```

### 使用正则表达式过滤 包含匹配 regexp 和 not regexp

```sql
select * from T where name regexp 1000;        正则是包含匹配,找出name包含1000的行
select * from T where name regexp 'jack|tom';  | 表示可选项，找出name包含jack或tom的行
select * from T where name regexp '[ABC]oop';  []表示范围 ，找出包含 Aoop,Boop,Coop 的名字

# ^在[]内表示取反,找第一个字符不为123，且第二个字符为A的名字
select * from T where name regexp '[^123]A';

select * from T where name regexp '[0-5]A';    - 表示范围,找出包含 0A,1A,2A,3A,4A,5A 的名字
select * from T WHERE name regexp '^b';        找出以b开头的名字
select * from T WHERE name regexp 'fy$';       找出以fy结尾的名字
select * from T WHERE name regexp '^.....$';   . 匹配任何单个的字符,找出5个字符的名字
select * from T where name regexp '^.{5}$';    {n} 表示重复前面的匹配，找出5个字符的名字
select * from T where name regexp '^.{5,}$';   找出5个字符以上的名字
select * from T where name regexp '^.{5,10}$'; 找出5个到10个字符的名字

# 任意以a,aa,aaaa...b,bb...c,ccc...开头的名字(这个解释好像有问题!!!以后再验证)
select * from T where name regexp '^[abc]*';

select * from T where name regexp '^.?$';      ? 等价于 {0,1}
select * from T where name regexp '^.+$';      + 等价于 {1,}
select 'abc' regexp '[0-9]';                    
```

## group  by  / 聚合函数 / having 的使用

```sql
CREATE TABLE `salary`
( `id` BIGINT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `dept` VARCHAR(255) NOT NULL ,
`salary` INT NOT NULL , `edlevel` INT NOT NULL , `hiredate` DATE NOT NULL , PRIMARY KEY (`id`))
ENGINE = InnoDB COMMENT = '薪水练习表';

insert into salary values (1,"zhangshang","develop",2000,3,'2009-10-11');
insert into salary values (2,"lishi","develop",2500,3,'2009-10-01');
insert into salary values (3,"wangwu","design",2600,5,'2010-10-02');
insert into salary values (4,"maliu","design",2300,4,'2010-10-03');
insert into salary values (5,"maqi","design",2100,4,'2010-10-06');
insert into salary values (6,"zhaoba","sales",3000,5,'2010-10-05');
insert into salary values (7,"qianjiu","sales",3100,7,'2010-10-07');
insert into salary values (8,"shunshi","sales",3500,7,'2010-10-06');
```

#### 聚合函数

```sql

avg()   对一列数据求平均数
min()   对一列数据求最小值
count() 对一列数据计数
sum()   对一列数据求和
max()   对一列数据求最大值
```

#### 数据库示例

```sql
-- 想得到每个部门的最高薪水
select dept,max(salary) as max_salary from salary group by dept;
+---------+------------+
| dept    | max_salary |
+---------+------------+
| design  |       2600 |
| develop |       2500 |
| sales   |       3500 |
+---------+------------+

-- 想得到每个部门，每个职称等级的最高薪水
select dept,edlevel,max(salary) as max_salary from salary group by dept,edlevel;
+---------+---------+------------+
| dept    | edlevel | max_salary |
+---------+---------+------------+
| design  |       4 |       2300 |
| design  |       5 |       2600 |
| develop |       3 |       2500 |
| sales   |       5 |       3000 |
| sales   |       7 |       3500 |
+---------+---------+------------+

-- 职称等级 大于３的每个部门的最高薪水
-- SQL 的执行是，先过滤，再分组，所以先 where 再 group by
select dept,edlevel,max(salary) as max_salary from salary where edlevel > 3 group by dept,edlevel;
+--------+---------+------------+
| dept   | edlevel | max_salary |
+--------+---------+------------+
| design |       4 |       2300 |
| design |       5 |       2600 |
| sales  |       5 |       3000 |
| sales  |       7 |       3500 |
+--------+---------+------------+

-- 寻找雇员数超过2个的部门的最高和最低薪水
-- having 是　group by 分组后，对每个组内执行的筛选, count(*) > 2 表示筛选出记录个数多于２个的组
-- where 和 having 可以一起用，先进行where过滤，再进行having过滤
select dept,max(salary),min(salary) from salary group by dept having count(*) > 2;
+--------+-------------+-------------+
| dept   | max(salary) | min(salary) |
+--------+-------------+-------------+
| design |        2600 |        2100 |
| sales  |        3500 |        3000 |
+--------+-------------+-------------+

-- 寻找雇员平均工资大于3000的部门的最高和最低薪水，还是 having 和聚合函数的使用
select dept,max(salary),min(salary) from salary group by dept having avg(salary) > 3000;
+-------+-------------+-------------+
| dept  | max(salary) | min(salary) |
+-------+-------------+-------------+
| sales |        3500 |        3000 |
+-------+-------------+-------------+

-- 想知道 每个部门薪水最高的那个人是谁 ,加个 name ,然并卵
-- 暂时未想出，可能根本没有这样的一条语句，暂时只能想到通过指定部门，
-- 使用多条sql语句查出每个部门最高薪水的那个人
```

## 子查询

```sql
select * from T where order_num in (select order_num from ordertimes where pro_id = 'TNT2');

# 查询每个用户的订单数
select cust_name, (select count(*) from orders where orders.cust_id = customers.cust_id)
as order_num from customers;

# ANY 只要大于等于子查询返回一个值就好，ALL是大于子查询返回的所有值
select * from goods where price >= ANY (select price from goods where type = "超级本");

select * from goods where price　exists (select price from goods_detail where type = "超级本");
```

## 多表链接

```sql
# 内连接 性能更快 通过 on 条件先将两张表连起来
select vend_name ,prod_name,prod_price from vendors as v inner join products as p 
on v.vend_id = p.vend_id;

# 自连接，比使用子查询更快
select p1.id,p1.name from products as p1,products as p2 where p1.id = p2.id and p2.id = '1213';

# 左链接 customers表的全部数据
select c.name,o.id from customers as c left join orders as o on c.id = o.cust_id;

# 带聚合函数的连接 ,查询每位顾客的订单数(没有订单的就是0)
select customers.name,count(orders.id) as orders_num from customers left join orders 
on customers.id = orders.cust_id group by customers.name;
```

## 联合查询 union

- 将两个单独select语句查询到的结果放置到一个单一的查询结果中,必须是相同数量且顺序相同的列，并且数据类型类似，才能使用 Union 将结果集并到一起,结果集的字段名，取第一条select语句的，也可以使用 as 自己定别名！
- 与union all 的区别：union all 不会移除两个查询的重复值
- web项目中经常会碰到整站搜索的问题，即客户希望在网站的搜索框中输入一个词语，然后在整个网站中只要包含这个词的页面都要出现在搜索结果中。由于一个web项目不可能用一张表就全部搞定的，所以这里一般都是要用union联合搜索来解决整个问题的。

```sql
select vend_id,prod_id,prod_price from products where prod_price <= 5

union select vend_id,prod_id,prod_price from products where vend_id in (1001,1002) order by vend_id;

select * from (SELECT id,subject FROM article WHERE subject LIKE '%图片%') as t1

union all select * from (SELECT id,class_name FROM web_class WHERE class_name LIKE '%图片%') as t2

union select * from (SELECT id,subject FROM article WHERE subject LIKE '%图片%') as t3;
```

## 插入数据

```sql
# 插入多行数据
insert into student2 (student_id, sdudent_name, class_name, area)
values (11, 'zhang5', 'ios0208', 'hunan'),
(12, 'zhang6', 'php0318', 'beijing'),
(13, 'zhang7', 'java0307', 'tianjin');

replace into table_name (字段，字段) values (值，值); # 在发生唯一索引冲突时，插入自动变成替换

# 蠕虫复制
insert into table_name (字段，字段) select (字段，字段) from table_name2 [where 条件];
```

## 更新数据

```sql
update table_name set 字段 = 值,字段 = 值,字段 = 值 ... where 条件;
```

- UPDATE和REPLACE基本类似，但是它们之间有两点不同。
  - UPDATE在没有匹配记录时什么都不做，而REPLACE在有重复记录时更新，在没有重复记录时插入。
  - UPDATE可以选择性地更新记录的一部分字段。而REPLACE在发现有重复记录时就将这条记录彻底删除，再插入新的记录。也就是说，将所有的字段都更新了

## 删除数据

```sql
delete from table_name where ... ;
```

## 算术运算

```bash
加　减　乘　除　整除　求余
select 1+1,2-1,4*5,6/4,7 div 2,7%2;
+-----+-----+-----+--------+---------+------+
| 1+1 | 2-1 | 4*5 | 6/4    | 7 div 2 | 7%2  |
+-----+-----+-----+--------+---------+------+
|   2 |   1 |  20 | 1.5000 |       3 |    1 |
+-----+-----+-----+--------+---------+------+
1 row in set (0.00 sec)
```

### 比较运算

```bash
select 1 < 2; # 数值比较
+-------+
| 1 < 2 |
+-------+
|     1 |
+-------+
1 row in set (0.00 sec)

select '1750-1-1' < '1750-2-1'; # 日期比较
+-------------------------+
| '1750-1-1' < '1750-2-1' |
+-------------------------+
|                       1 |
+-------------------------+
1 row in set (0.00 sec)

select '1750-1-1' > '1750-2-1';
+-------------------------+
| '1750-1-1' > '1750-2-1' |
+-------------------------+
|                       0 |
+-------------------------+
1 row in set (0.00 sec)
```

### NULL 值的比较 只能使用 is null 和　is not null 来判断一个字段是不是null值

```bash
# null 与任何值的比较都是null, 没有任何意义
select null < 0,null = 0, null != 0,null > 0,null = null,null != null;
+----------+----------+-----------+----------+-------------+--------------+
| null < 0 | null = 0 | null != 0 | null > 0 | null = null | null != null |
+----------+----------+-----------+----------+-------------+--------------+
|     NULL |     NULL |      NULL |     NULL |        NULL |         NULL |
+----------+----------+-----------+----------+-------------+--------------+
1 row in set (0.00 sec)
```

## 日期处理

- `date`类型的计算

```sql
-- date 类型
select * from grade_event where date = '2012-10-11';

select * from president where death >= '1970-01-01' and death < '1980-01-01';

-- 3月29出生的总统
select * from president where Month(birth) = 3 and dayofmonth(birth) = 29;

-- 今日出生的总统
select * from president where Month(birth) = Month(CURDATE())
and dayofmonth(birth) = dayofmonth(CURDATE());

-- 算哪位总统活的最久, timestampdiff 函数，返回单位为年，计算： death - birth
select first_name, TIMESTAMPDIFF(YEAR,birth,death) as age from president
where death is not NULL order by age desc limit 1;

-- 计算新日期
select DATE_ADD('1970-01-01',INTERVAL 10 YEAR); -- 1980-01-01
select DATE_SUB('1970-01-01',INTERVAL 10 YEAR); -- 1960-01-01

-- 将日期转化为天数，计算出成员资格到期天数小于 60 天的, expiration 为过期时间字段
select * from member where (to_days(expiration) - to_days(curdate())) < 60;
select * from member where timestampdiff(DAY,curdate(),expiration) < 60; -- 等价上句
select * from member where expiration < DATE_ADD(CURDATE(),INTERVAL 60 DAY);
```

- `datetime`类型

```sql
-- datetime 比较大小问题
select * from t1 
where unix_timestamp(time1) > unix_timestamp('2011-03-03 17:39:05') 
and unix_timestamp(time1) < unix_timestamp('2011-03-03 17:39:52');

time1 between '2011-03-03 17:39:05' and '2011-03-03 17:39:52';

-- 时间格式化函数
-- %Y 年, 数字, 4 位
-- %m 月, 数字(01……12)
-- %d 月份中的天数, 数字(00……31)
-- %H 小时(00……23)
-- %i 分钟, 数字(00……59)
-- %s 秒(00……59)
DATE_FORMA T(date, format);
```

## multiQuery将多条SQL语句批量执行

```php
$mysqli = new MySQLi( "ip", "username", "password", "db_name" );

function msectime()
{
    list($msec, $sec) = explode(' ', microtime());
    return $msectime =  (float)sprintf('%.0f', (floatval($msec) + floatval($sec)) * 1000);
}
/*
$sqls = "select title from qy_route limit 10;";
$sqls.= "select name from qy_user where name != '' limit 10;";
$sqls.= "select sname from qy_scenic_location order by id desc limit 10;";
*/

$test_num = 3000;

$start_time = msectime();
$size = 1;
$multi_sql = '';
for( $page = 0; $page <= $test_num; $page++)
{
    $offset = $page * $size;
    $multi_sql .= "select sname from qy_scenic_location limit $offset,$size;";
}
if( $mysqli -> multi_query( $multi_sql ) )
{/*{{{*/
    while( TRUE )
    {
        // 检查中间某条sql是否执行错误
        if( $mysqli -> errno !== 0 )
        {
            echo "errno : $mysqli->errno , error: $mysqli->error \n";
        }

        $result = $mysqli -> store_result();

        // select 语句执行后的结果集
        if( $result instanceof mysqli_result )
        {
            $row = $result -> fetch_all( MYSQLI_ASSOC );
        }
        // 对于insert update delete 这样的查询, store_result 返回的永远是false, 而不管是否查询成功
        else
        {
            // do nothing
        }

        // 如果没有结果集了，就退出while
        if( !$mysqli -> more_results() )
            break;

        // 继续取下一个结果集
        $mysqli -> next_result();
    }
}/*}}}*/
else
    echo "ERROR".$mysqli->errno."---".$mysqli->error;

$end_time = msectime();
$multi_query_time = $end_time - $start_time;

echo "// ===================== query ==================================== //\n";

$start_time = msectime();
$size = 1;
for( $page = 0; $page <= $test_num; $page++)
{
    $offset = $page * $size;
    $sql = "select sname from qy_scenic_location limit $offset,$size;";
    $result = $mysqli -> query( $sql );
    $row = $result -> fetch_all( MYSQLI_ASSOC );
    $result -> close();
    // var_dump($row);
}
$end_time = msectime();
$query_time = $end_time - $start_time;

echo "query执行时间 $query_time / multi_query执行时间 $multi_query_time =  ". $query_time / $multi_query_time . "\n";

$mysqli -> close();
```