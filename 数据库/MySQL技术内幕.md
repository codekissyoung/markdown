# MySQL技术内幕里的SQL搜集

## 1.MySQL教程

```sql
-- count(*)统计查询到的行数, count(列名)只会统计所有非NULL值的数目
mysql> select count(*),count(email),count(expiration) from member;
-- 结果是 102 , 80, 96

-- count 和 distinct 一起使用，可以统计出查询结果里有多少个 不同的 非NULL值
-- 下面这句含义：查出美国有多少个不同的州曾经诞生过总统
mysql> select count(distinct state) from president;

-- 查询班里 男生和女生 各是多少
mysql> select count(*) from student where sex = 'f';
mysql> select count(*) from student where sex = 'm';

-- 使用 group by ，它可以统计出某一列里不同值分别出现过多少次
mysql> select sex,count(*) from student group by sex;
-- 查询每个州诞生的总统数
mysql> select state,count(*) from president group by state;
-- 查询一年每个月分别有多少位总统出生
mysql> select month(birth) as month, monthname(birth) as name, count(*) as count
mysql> from president group by name order by month;

-- having 子句，对group by之后的分组进行过滤
-- 查询出诞生过两位总统以上的州
mysql> select state,count(*) as count from president group by state having count >= 2;

-- 使用各种聚合函数 统计每场考试的最低分，最高分，总参考人数，平均分等等
mysql> select event_id,min(score),max(score),max(score) - min(score) + 1 as span,sum(score) as total,
mysql> avg(score) as average,count(score) as count from score group by event_id;

-- 使用 with rollup 子句 还可以针对每一列的结果，获得一个汇总行
-- 这样我们就可以知道 所有考试里的最低分，最高分，平均分 等
mysql> select event_id,min(score),max(score),max(score) - min(score) + 1 as span,sum(score) as total,
mysql> avg(score) as average,count(score) as count from score group by event_id with rollup;

-- 使用链接操作(join)从多个表里检索信息,对于两个表里字段名不同，可以直接用
-- from + inner join 子句引用多张表
-- on 指定了表之间的链接条件
mysql> select student_id, date, score, category from grade_event inner join score
mysql> on grade_event.event_id = score.event_id where date = '2012-09-01';

mysql> select student.name, grade_event.date, score.score, grade_event.category from grade_event
mysql> inner join score inner join student on grade_event.event_id = score.event_id and
mysql> score.student_id = student.student_id where grade_event.date = '2012-09-23';

-- 先执行多表链接,才执行 group by，所以可以看成对链接后的大表进行分组
mysql> select grade_event.date,student.sex,count(score.score) as count,avg(score.score) as average
mysql> from grade_event inner join score inner join student on grade_event.event_id = score.event_id
mysql> and score.student_id = student.student_id group by grade_event.date,student.sex;

-- 在期末计算每个学生的总成绩
mysql> select student.student_id,student.name,sum(score.score) as total, count(score.score) as n from
mysql> grade_event inner join score inner join student on grade_event.event_id = score.event_id
mysql> and score.student_id = student.student_id group by score.student_id order by total;

-- 查询学生的缺席次数
mysql> select s.student_id,s.name,count(a.date) as absences from student as s inner join absence as a
mysql> on s.student_id = a.student_id group by s.student_id;

-- 对于没有缺席的学生(absence缺席表没有记录) inner join 是无法统计的；
-- 使用 left join 保留 student表 (作为左表) 的全部记录，这样就保留了没有缺席的学生，缺席次数一栏count结果就是 0
mysql> select s.student_id,s.name,count(a.date) as absences from student as s left join absence as a
mysql> on s.student_id = a.student_id group by s.student_id;

-- 可以将某个表 与 其自身链接起来，比如确定某位总统与另一位总统出生在同一个城市
mysql> select p1.city,p1.last_name from president as p1 inner join president as p2 on p1.city
mysql> = p2.city where (p1.last_name <> p2.last_name) order by state,city,last_name;

-- 使用子查询 找出全勤的学生
mysql> select * from student where student_id not in (select student_id from absence);

-- 删除语句，删除出身于 OH 的总统
mysql> delete from president where state = 'OH';

-- 更新语句
mysql> update member set email='aab@cc.com',street='York St',city='Anytown' where last_name = 'York';
```