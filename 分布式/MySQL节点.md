# MySQL 节点

参考 [Ubuntu 装机指南](https://blog.codekissyoung.com/Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/Ubuntu)，获得一个干净的`Server`后，下面可以将这个`Server`做成`MySQL`节点。

## 制作Mysql节点

### 1. 安装

```bash
$ sudo apt-get install mysql-server mysql-client        # 安装
$ mysqld --version      # 确认版本
mysqld  Ver 5.7.28-0ubuntu0.18.04.4 for Linux on x86_64 ((Ubuntu))
$ pgrep -a mysql        # 确认进程运行
2247 /usr/sbin/mysqld --daemonize --pid-file=/run/mysqld/mysqld.pid
$ sudo netstat -natp    # 查看监听的端口
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      2247/mysqld     
$ sudo lsof -i:3306     # 查看 3306 端口的占用情况
COMMAND  PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
mysqld  2247 mysql   30u  IPv4  26625      0t0  TCP localhost:mysql (LISTEN)
$ link@mysql-db-1:~$ sudo dpkg -S mysql | grep conf     # 查看软件包安装后的所有文件清单
```

### 2. 远程登录

```bash
$ sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf

bind-address = 0.0.0.0 # 修改为本句

$ netstat -natp          # 确认下
tcp6       0      0 :::3306                 :::*                    LISTEN      -     
```

### 3. 安全设置

```bash
$ sudo mysql_secure_installation
New password:                           # 随便填，因为没效果 
Re-enter new password:                  # 随便填，因为没效果
Remove anonymous users?                 # y 移除匿名用户
Disallow root login remotely?           # y 不给 root 远程登录权限
Remove test database and access to it?  # 删除 test 库
```

新装的`MySQL 5.7 Server`的`root`用户并不是密码校验登录，而是限定 `linux` 的 `root` 用户才可以登录本机的 `mysql-server`:

```bash
$ sudo mysql            # 直接就可以登录了
```

查看字符集和排序:

```bash
mysql> show character set like '%utf%';
+---------+------------------+--------------------+--------+
| Charset | Description      | Default collation  | Maxlen |
+---------+------------------+--------------------+--------+
| utf8    | UTF-8 Unicode    | utf8_general_ci    |      3 |
| utf8mb4 | UTF-8 Unicode    | utf8mb4_general_ci |      4 |
| utf16   | UTF-16 Unicode   | utf16_general_ci   |      4 |
| utf16le | UTF-16LE Unicode | utf16le_general_ci |      4 |
| utf32   | UTF-32 Unicode   | utf32_general_ci   |      4 |
+---------+------------------+--------------------+--------+
```

### 4. 创建一个数据库 xproject 

```bash
mysql> create database xproject default charset utf8mb4 collate utf8mb4_general_ci;
```
PS: 使用 `utf8mb4` 和 `utf8mb4_general_ci`，避免一切诡异编码问题 ^_^

### 5. 创建用户 xuser 来管理 xproject 数据库

```bash
mysql> create user 'xuser'@'%' identified by 'Pass123456';
Query OK, 0 rows affected (0.01 sec)

mysql> grant all privileges on `xproject`.* to 'xuser'@'%';
Query OK, 0 rows affected (0.00 sec)

mysql> flush privileges;
Query OK, 0 rows affected (0.01 sec)
```

### 6. 在PC上验证

```bash
$ mysql -h192.168.13.3 -uxuser -p
```

## 修改root用户

新安装的`mysql-server`的默认用户信息都在`/etc/mysql/debian.cnf`文件里：

```mysql
[client]
host = localhost
user = debian-sys-maint
password = XUWKDk4UdNhiF5XC
socket = /var/run/mysqld/mysqld.sock
[mysql_upgrade]
host = localhost
user = debian-sys-maint
password = XUWKDk4UdNhiF5XC
socket = /var/run/mysqld/mysqld.sock
```

然后我们再来设置`root`用户：

```bash
mysql -udebian-sys-maint -pXUWKDk4UdNhiF5XC     # 通过默认账户进入 MySQL
mysql> select host,user,plugin,authentication_string from mysql.user;
+-----------+------------------+-----------------------+------------------------+
| host      | user             | plugin                | authentication_string  |
+-----------+------------------+-----------------------+------------------------+
| localhost | root             | auth_socket           |                        |
```

如果你确实是想用`mysql`的`root`用户，使用密码方式验证登录的话，那么执行：

```bash
mysql> update user set authentication_string = PASSWORD('你的密码'),
mysql> plugin = 'mysql_native_password' where user = 'root';
mysql> flush privileges;
```
