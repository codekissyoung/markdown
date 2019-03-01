# 生产环境部署Redis

## 安装

```bash
# 下载
wget http://download.redis.io/redis-stable.tar.gz
tar -xzvf redis-stable.tar.gz
cd redis-stable

# 编译安装, 默认可执行程序安装到 /usr/local/bin 目录
sudo make test && make && make install
```

## 配置生产环境

### 建立配置目录与持久化目录

```bash
sudo mkdir -p /etc/redis
sudo mkdir -p /var/redis/6379
```

### 写配置文件

1. 将源代码文件中的`redis.conf`复制到`/etc/redis`目录中，命名为`6379.conf`，修改下面几项

```bash
daemonize yes                       # 以守护进程方式运行
pidfile /var/run/redis_6379.pid     # 设置redis的PID文件位置
port 6379                           # 设置redis监听的端口号
dir /var/redis/6379                 # 设置持久化文件存放位置
```

### 配置初始化脚本

- 将redis源码目录下的 `utils` 目录中的`redis_init_script`初始化脚本拷贝到`/etc/init.d`，修改文件名为`redis_6379`
- 执行 `sudo service redis_6379 start | stop | restart` 就可以启动 | 关闭 | 重启
- 执行 `redis-cli SHUTDOWN` 也可以结束redis进程

### 开机自启设置

1. 在`/etc/init.d/redis_6379`，添加如下脚本头部

```bash
### BEGIN INIT INFO
# Provides:          redis6379
# Required-Start:    $local_fs $network
# Required-Stop:     $local_fs
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: redis6379
# Description:       penavico redis 6379
### END INIT INFO
```

1. 执行 `sudo update-rc.d redis_6379 defaults`，设置开机自启动

### 检查Redis生产环境是否成功安装

1. 执行`sudo service redis_6379 start`启动Redis, 执行 `sudo lsof -i:6379` 查看，如下图所示则启动成功

```bash
➜  ~ sudo lsof -i:6379 
COMMAND     PID USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
redis-ser 28594 root    4u  IPv4 11996856      0t0  TCP localhost:6379 (LISTEN)
```

1. 关机，重启，测试是否开机自启