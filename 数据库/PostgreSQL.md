# PostgreSQL



## 1. 安装

```bash
$ sudo apt-get install postgresql-client
$ sudo apt-get install postgresql
$ sudo apt-get install pgadmin3 # 图形管理界面

# xproject 数据库名
# root 用户名
$ sudo -u postgres createuser --superuser root
$ sudo -u postgres createdb -O root xproject # 创建数据库
$ sudo -u postgres psql # 用　postgres 管理用户登录
\password root  # 设置密码
\q
```

登录控制台后:

```bash
$ psql -U root -d xproject -h 127.0.0.1 -p 5432 # 登录控制台
$ psql -U root -d xproject -h 127.0.0.1 -p 5432 < run.sql # 执行sql文件
xproject=# \conninfo
You are connected to database "xproject" as user "root" on host "127.0.0.1" at port "5432".
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
```

控制台命令:

```bash
\h：查看SQL命令的解释，比如\h select。
\?：查看psql命令列表。
\l：列出所有数据库。
\c [database_name]：连接其他数据库。
\d：列出当前数据库的所有表格。
\d [table_name]：列出某一张表格的结构。
\du：列出所有用户。
\e：打开文本编辑器。
\conninfo：列出当前数据库和连接的信息。
```

## 2. 常见操作

控制台下：

```sql
xproject=# CREATE TABLE user_tbl(name varchar(255), signup_date DATE); # 创建新表
CREATE TABLE

xproject=# \d # 列出当前数据库的所有表格
 public | user_tbl | table | root
 
xproject=# \d user_tbl # 列出某一张表格的结构
 name        | character varying(255) |           |          | 
 signup_date | date                   |           |          | 

xproject=# INSERT INTO user_tbl(name, signup_date) VALUES('张三', '2013-12-22'); # # 插入数据
INSERT 0 1

xproject=# SELECT * FROM user_tbl; # 选择记录
 张三 | 2013-12-22

xproject=# UPDATE user_tbl set name = '李四' WHERE name = '张三'; # 更新数据
UPDATE 1

xproject=# DELETE FROM user_tbl WHERE name = '李四' ; # 删除记录
DELETE 1

xproject=# ALTER TABLE user_tbl ADD email VARCHAR(40); # 添加栏位
ALTER TABLE

xproject=# ALTER TABLE user_tbl ALTER COLUMN signup_date SET NOT NULL; # 更新结构
ALTER TABLE

xproject=# ALTER TABLE user_tbl RENAME COLUMN signup_date TO signup; # 更名栏位
ALTER TABLE

xproject=# \d user_tbl;
 name   | character varying(255) |           |          | 
 signup | date                   |           | not null | 
 email  | character varying(40)  |           |          | 

xproject=# ALTER TABLE user_tbl DROP COLUMN email; # 删除栏位
ALTER TABLE

xproject=# ALTER TABLE user_tbl RENAME TO backup_tbl; # 表格更名
ALTER TABLE

xproject=# \d
 public | backup_tbl | table | root

xproject=# DROP TABLE IF EXISTS backup_tbl; # 删除表格
DROP TABLE

xproject=# \d
Did not find any relations.
```

