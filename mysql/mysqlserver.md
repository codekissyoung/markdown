# MySQL Server

## 服务器的SQL模式

- `STRICT_ALL_TABLES` 和 `STRICT_TRANS_TABLES` 严格模式
- `TRADITIONAL` 模式
- `ANSI_QUOTES` 模式, 把 `"` 识别为一个标识符引用字符串
- `PIPES_AS_CONCAT` 把 `||` 当成标准的SQL字符串连接运算符
- `ANSI` 组合模式
- `mysqld --sal-mode="STRICT_ALL_TABLES,ANSI_QUOTES"` 在服务器启动时开启模式

```sql
mysql> set sql_mode = 'TRADITIONAL'; -- 修改本次会话为特定的 sql mode
mysql> set GLOBAL sql_mode = "TRADITIONAL"; -- 修改全局的的 sql mode,需要SUPER权限
mysql> select @@SESSION.sql_mode; -- 查看当前链接的 sql mode
mysql> select @@GLOBAL.sql_mode; -- 查看全局的 sql mode
```

## 字符集和排序规则

- 系统变量`character-set-server` 和 `collation-server`设置默认字符集和排序规则
- 默认我们应该选择`utf8mb4`字符集，以及`utf8mb4_general_ci`排序规则

```sql
-- charset 是某个字符集合的名字
-- collation 是排序规则的名字，选择的排序规则必须要字符集合支持
mysql> show character set; -- 展示系统可用的字符集
mysql> show collaction; -- 展示可用的排序规则
mysql> create database db_name character set charset collate collation;
mysql> create table tb_name (...) character set charset collate collation;
mysql> c char(10) character set charset collate collation;
```

## 存储引擎

- `InnoDB` 支持外键，支持事务
- `MyISAM` 主要的非事务处理存储引擎
- `mysql> show ENGINES;`

### InnoDB引擎

#### 优点

- 表在执行提交和回滚操作时是事务安全的，还可以通过`savepoint`实现部分回滚
- 在系统奔溃后可以自动恢复
- 外键和引用完整性支持，包括级联删除和更新
- 基于行级别的锁定和多版本化，在执行同时包含有检索和更新操作的组合条件查询时，可以表现出很好的并发性能
- 支持全文搜索和`FULLTEXT`索引

## 表的磁盘存储方式

- `.frm`文件保存表的格式和定义
- `InnoDB` 引擎还保存`.ibd`文件，保存数据和索引
- `MyISAM` 的 `.MYD` 保存数据 `.MYI`保存索引

## 表分区

```sql
CREATE TABLE log_partition(
    dt datetime not null,
    info varchar(100) not null,
    INDEX(dt)
)PARTITION by RANGE(year(dt))(
    PARTITION p0 VALUES less than (2010),
    PARTITION p1 VALUES less than (2011),
    PARTITION p2 VALUES less than (2012),
    PARTITION p3 VALUES less than (2013),
    PARTITION pmax VALUES less than MAXVALUE
);
```

## 索引

```sql
mysql> alter table tb_name add index index_name (index_columns);
mysql> alter table tb_name add unique index_name (index_columns);
mysql> alter table tb_name add primary key (index_columns);
mysql> alter table tb_name add fulltext index_name (index_columns);
mysql> alter table tb_name add spatial index_name (index_columns);
```