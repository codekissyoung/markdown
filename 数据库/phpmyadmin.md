# phpMyAdmin 教程

平时使用`phpMyAdmin`的一些技巧积累。

## config.inc.php 配置

把`config.inc.php.sample`改为`config.inc.php`,然后修改下列选项

```php
$cfg['AllowArbitraryServer'] = true; // 允许在界面上 选择服务器
$cfg['Servers'][$i]['host'] = '10.10.61.57';
$cfg['blowfish_secret'] = 'abcdefghijklmnopqrstuvwxyz111111';

// 修改这个参数需要在 php.ini 设置 session.gc_maxlifetime = 86400 或者更大值
$cfg['LoginCookieValidity'] = 86400; // 保持session一天
```

## themes 主题安装

首先到官网去下载主题: [phpmyadmin主题](https://www.phpmyadmin.net/themes/)，下载主题后解压压缩包，会得到一个文件夹，将它复制到phpmyadmin程序目录中的themes/文件夹里即可。

## 允许 MySQL 远程连接

默认情况下，mysql 只允许本地登录，如果要开启远程连接，则需要修改 `/etc/mysql/my.conf` 文件

```mysql
bind-address = 127.0.0.1 修改为
bind-address = 0.0.0.0
```

为需要远程登录的用户赋予权限

```sql
1. 新建用户远程连接mysql数据库
允许任何ip地址的电脑用 admin 和 123456 来访问这个 mysql server,注意admin账户不一定要存在。
mysql> grant all on *.* to admin@'%' identified by '123456' with grant option;
mysql> flush privileges;

2. 或者支持root用户允许远程连接mysql数据库
mysql> grant all privileges on *.* to 'root'@'%' identified by '123456' with grant option;
mysql> flush privileges;
```

查看系统用户

```sql
mysql> use mysql;
Database changed

mysql> select user,host from user;
+------------------+--------------+
| user             | host         |
+------------------+--------------+
| root             | %            |
| root             | 127.0.0.1    |
| root             | ::1          |
| root             | iz252e1zy6zz |
| debian-sys-maint | localhost    |
+------------------+--------------+
```

重启Mysql服务器, `sudo service mysql restart`

## mysqlshow 客户端

```bash
bash> mysqlshow -options args

options :
-h：MySQL服务器的ip地址或主机名；
-u：连接MySQL服务器的用户名；
-p：连接MySQL服务器的密码；
--count：显示每个数据表中数据的行数；
-k：显示数据表的索引；
-t：显示数据表的类型；
-i：显示数据表的额外信息。

args :
数据库信息：指定要显示的数据库信息，可以是一个数据库名，或者是数据库名和表名，或者是数据库名、表名和列名。
```

## mysqlimport 客户端

```bash
bash> mysqlimport -options args

options:
-D：导入数据前清空表；
-f：出现错误时继续处理剩余的操作；
-h：MySQL服务器的ip地址或主机名；
-u：连接MySQL服务器的用户名；
-p：连接MySQL服务器的密码
--fields-terminated-by  文件中字段之间的分隔符
--columns   要加载文件到表的字段名
--local ：从本地客户端读入输入文件。

args:
数据库名：指定要导入的数据库名称
文本文件：包含特定格式文本文件

例子:
mysqlimport -h172.16.145.125 -uroot -p \
--fields-terminated-by='|' --columns='user_id,user_name,user_age,user_addr' --local \
db_name '/home/ocetl/tmp_user_info.txt'
```

## mysqldump 客户端

```bash
# 导出数据库mydb_dbname到文件
mysqldump -hlocalhost -uroot -p mydb > \var\www\mydb.sql
# 只导出一个表
mysqldump -hlocalhost -uroot -p mydb mytable > \var\www\mydb_mytable.sql
# 只导出数据结构
mysqldump -hlocalhost -uroot -p mydb --add-drop-table > \var\www\mydb.sql
```

### 自动备份数据库的脚本

```bash
#!/bin/sh
today=`date +%Y%m%d`
filename=${today}_fleamarket_backup.sql
mysqldump -uroot -pCky951010 fleamarket > ./fleamarket-back-up/${filename}
```

## 将文件里的数据导入到数据库

### 导出纯数据文本

```sql
-- 导出到txt文件
mysql> select name,age,city,salary into outfile "c:/out.txt" lines terminated by "\n" from person;
```

### 导入纯数据文本

```sql
-- load data 默认各列的值以制表符分割 各行末尾是 \n , NULL 值表示为 \N
$ mysql --local-infile practice_db 开启 load data 读取(某些版本需要) 
mysql> LOAD DATA LOCAL INFILE "D:/mysql.txt" INTO TABLE my_table;
```

### 导入SQL文件

```sql
$ mysql practice_db < insert_data.sql
mysql> source insert_data.sql
```

## phpmyadmin添加外键约束

### 条件

- InnoDB引擎
- 必须建立索引
- 父键必须是主键,子键列所有数据都在父键列中能找到

### 操作路径

- `结构` -> `Relation New(关联视图)`

### 数据填写

- `限制名称(任意写)` `子键字段` `外键约束数据库` `父表` `父键字段` 分别设置为相应的约束即可

- `ON DELETE`,`ON UPDATE` 各选项属性说明：
  - `RESTRICT` ：如果子表中有匹配的记录,则不允许对父表对应候选键进行update/delete操作  
  - `CASCADE` ： 在父表上update/delete记录时，同步update/delete掉子表的匹配记录
  - `SET NULL` ：在父表上update/delete记录时，将子表上匹配记录的列设为null，要注意子表的外键列不能为`not null`
  - `NO ACTION`：如果子表中有匹配的记录,则不允许对父表对应候选键进行update/delete操作 (同 restrict )
