# MySQL和MariaDB管理

## 深入理解数据库概念

- MySQL 是 `C/S` 架构，服务器程序`mysqld`,多线程

- MySQL 支持远程访问，访问控制，安全套接字层协议加密的链接 (SSL)

- 服务器控制并发顺序，客户端可以同时发送请求给服务器，由服务器来决定这些请求被执行的顺序

- 远程登录，不是只有数据库所在的那台服务器才可以登录MySQL,而是任意在什么地方，只要联网就能通过客户端访问远程服务端的数据

## 登录

```bash
mysql -hlocalhost -uroot -p951010
```

## 管理用户

```sql
-- 创建一个可以从服务器本地登录服务器的用户
-- localhost 换成 * , 则是允许用户在任意机器远程登录
mysql> create user 'cky'@'localhost' identified by 'password1234';

-- 将 practice_db 数据库的所有权限赋给 cky 用户
mysql> grant ALL PRIVILEGES on `practice_db`.* to 'cky'@'localhost';

-- all 表示所有权限，也可指定部分权限
mysql> grant SELECT, INSERT, UPDATE, REFERENCES, DELETE, CREATE, DROP, ALTER, INDEX,
mysql> CREATE VIEW, SHOW VIEW ON `practice_db`.* TO 'cky'@'localhost';

-- 查看当前用户权限
mysql > show grants;
+---------------------------------------------------------------------+
| Grants for root@localhost                                           |
+---------------------------------------------------------------------+
| GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION |
| GRANT PROXY ON ''@'' TO 'root'@'localhost' WITH GRANT OPTION        |
+---------------------------------------------------------------------+
```

## 管理数据库

```sql
-- 列出当前服务器所有数据
mysql> show databases;

-- 切换到指定数据库
mysql> use db_name;

-- 查看某个数据库的创建消息
mysql> show create database db_name;

-- 查查运行状态
mysql> show status;
mysql> show errors;
mysql> show warnings;
mysql> select user(),now(),version(),database();

-- 查看编码
-- Character_set_client 客户端使用的编码
-- Character_set_connection 数据库连接使用的编码
-- Character_set_results 返回结果使用的编码
mysql> show variables like %character_set_%;
mysql> set character_set_client = utf8; -- 设置编码
mysql> set names utf8; -- 设置所有编码为utf8

-- 选则一个数据库后，执行一个sql文件
mysql> source /var/www/mysql.sql;
-- 导入数据到mydb2库
mysql -hlocalhost -uroot -pCky951010 mydb2 < \var\www\mydb2.sql;
```

## 管理数据表

### 字段的数据类型

- 整数型 `int(11)` `bigint(20)` `tinyint(4)`
- 字符串型 `char(12)` 定长字符串 `varchar(255)`
- `enum('male','famale')` enum 是单选
- `set('football','basketball','ball')` set 是多选
- 查询集合数据,ccc字段是 set 类型，查询含有 a 的记录
- `float(M,D) double(M,D) decimal(M,D)`小数型, M 是有效位数，D是小数位数
- `datetime("2015-3-28 11:11:11") timestamp(2038年之前)` 时间型
- 添加纪录时，默认article_time 为当前时间，更新时也是
- 字段约束 `primary key， unique， not null， auto_increment， unsigned， default 10， zerofill`
- 注释 `comment "我是注释"`

```sql
select * from set111 where find_in_set('a',ccc) > 0;
create table test (article_time timestamp default current_timestamp on update current_timestamp)；
```

### 创建数据表

```sql
create [temporary]  table [if not exists] table_name
（
    [字段名 字段类型 字段约束 注释]，
    [字段名 字段类型 字段约束 注释]
    ...
);

create tabel article (article_id int(10) primary key );
create tabel article (article_id int(10),[...],primary key(article_id));

primary key (article_id , time); # 组合主键

create table article (...owner SMALLINT UNSIGNED NOT NULL REFERENCES person(id)); # 外键
foreign key (article_id) references main_table_name (category) [On update][On delete]; # 外键

# 主表主键更新时，会报冲突，表示你主表的主键是不允许更新的
foreign key (article_id) references main_table_name(category) On update restrict;

# 在删除主表的记录时，将与该记录有关的从表记录的那个foreign字段设置为 null
foreign key (article_id) references main_table_name(category) On update On delete set null;
# 删主表记录时，将从表记录(与主表记录有关的)也删除
on delete cascade

# 给表设定数据库引擎和编码
create table article (...)ENGINE = InnoDB DEfAULT CHARSET = utf8 default character set utf8;

# 给字段设定校对集
nikename varchar(25) character set utf8

show tables; # 列出表
desc table_name; # 查看表结构
show create table tb_name; # 查看创建表的语句

drop [temporary] table [if exists] table_name [, table_name];# 删除表
```

### 更新表

```sql
-- 修改表字段属性
alter table table_name +　新的字符集和校对规则;

-- 改变表明里的字段
alter table table_name change 旧字段名+新字段名 + 新字段的属性;

-- 添加字段
alter table table_name add 字段名 + 字段属性  after/before 字段名;

-- 删除字段
alter table 表名 drop 字段名;

-- 修改表的名字
rename table  old_table_name to new_name , old_table_name2 to new_name2;

-- 添加一个外键
Alter table tbl_name add foreign key (class_id) references main_tbl_name(class_id) on delete set null;

-- 删除外键
Alter table tbl_name drop foreign_key_name;
```

## 免密码登录

```bash
➜  ~ cat /home/cky/.my.cnf
[client]
host=localhost
user='root'
password='Cky951010'
➜  ~ chmod 400 .my.cnf
```

## 导入数据

```bash
mysql -hlocalhost -uroot -p mydb2 < \var\www\mydb2.sql
```

## 改变 my.ini 文件

```sql
memory_limit=128M;
upload_max_filesize= 2M ; /*增大限制大小*/
post_max_size=8M ;
character-set-server = utf8;
```

## 管理mysql日志

```sql
显示日志
mysql＞show binary logs;
mysql＞show master logs;
删除日志
PURGE MASTER LOGS TO 'mysql-bin.000035';
手动删除10天前的mysql binlog日志
mysql＞PURGE MASTER LOGS BEFORE DATE_SUB(CURRENT_DATE, INTERVAL 10 DAY);
```

### mysql 日志管理

```bash
-- 版本 5.7.13
cat /etc/mysql/mysql.conf.d/mysqld.cnf

# 所有sql操作语句都会被纪录下来
general_log_file = /var/log/mysql/mysql.log
general_log = 1
# 纪录mysql运行错误
log_error = /var/log/mysql/error.log
＃ 慢查询日志
log_slow_queries = /var/log/mysql/mysql-slow.log
# 超过2s
long_query_time  2
```

## 查看mysql参数

```sql
mysql＞show variables like '%max%';
```

## 字符函数

```sql
char_lenngth() 返回的字符的长度
length() 返回字节长度
min(birth)　最小值
max(birth)　最大值
avg(birth)    平均值
count(＊)       符合条件的记录的个数
sum（ｃｏｌｕｍｅ）　该列的和
now()
curdate()
curtime()
adddate('2007-02-02', interval 31 day)
SELECT VERSION()　当前版本
CURRENT_DATE　当前时间常数
```

## 数据目录位置

- `数据目录`是`mysqld`所有数据库信息存放的地方
- `数据目录`里面存了数据库文件，pid文件，日志文件，des秘钥文件，ssl证书等
- `mysqld --verbose --help | grep datadir` 查看`数据目录`的路径

- `/etc/mysql/my.cnf`里配置`数据目录`路径

```my.ini
[mysqld]
datadir=/var/lib/mysql
```

- 通过sql查询得出`数据目录`的位置

```sql
mysql> show variables like 'datadir';
% mysqladmin variables;
```

- `数据目录`的权限

```bash
➜  lib ls -alhi /var/lib | grep mysql
 794095 drwx------ 10 mysql   mysql   4.0K 7月  20 19:47 mysql
 794099 drwx------  2 mysql   mysql   4.0K 12月  6  2016 mysql-files
1048592 drwx------  2 mysql   mysql   4.0K 12月 11  2016 mysql-keyring
1048597 drwxr-xr-x  2 root    root    4.0K 10月 24  2016 mysql-upgrade
```

- `db.opt`数据库文件，`.frm`表格式文件，`.ibd`数据和索引文件