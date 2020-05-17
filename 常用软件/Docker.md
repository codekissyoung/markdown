# Docker

![](http://img.codekissyoung.com/2019/12/11/8fc3e024ef6ccd87fecbc06bb6e61683.png)

## 安装与配置

```bash
$ sudo apt-get install linux-image-extra-virtual       
$ sudo apt-get install apt-transport-https ca-certificates software-properties-common
$ sudo apt-get install docker.io
$ sudo usermod -aG docker $USER		# 免 sudo 执行 docker
$ docker version               
$ docker info
```

### 配置加速器

```json
// /etc/docker/daemon.json
{
  "registry-mirrors":[
    "https://registry.docker-cn.com",
    "https://reg-mirror.qiniu.com",
    "https://x39d1d5v.mirror.aliyuncs.com"
  ]
}
```

```bash
$ sudo systemctl daemon-reload    # 重启 daemon
$ sudo systemctl restart docker   # 重启 docker daemon
$ sudo systemctl enable docker    # 开机启动 docker
```

### 服务端管理

```bash
$ dockerd -D -H tcp://127.0.0.1:2376
$ journalctl -u docker.service 			# 查看服务日志
```



```json
// /etc/docker/daemon.json
{
	"debug":true,
    "hosts":["tcp://127.0.0.1:2376"]
}
```

## 镜像管理

```bash
$ docker images                   # 查看本地的 Images
$ docker pull ubuntu              # 从 Registry 拉取一个 Image 到 本地
$ docker image prune -f			  # 清理无用的镜像
$ docker rmi 镜像ID/名字		   # 删除镜像
$ docker save -o ubuntu_18.04.tar.gz ubuntu:18.04	# 导出镜像到本地文件
$ docker load -i ubuntu_18.04.tar.gz 				# 导入本地镜像文件
```

### 将容器打包成镜像

```bash
$ docker commit -m"commit msg" -a"link" 容器ID link/ubuntu:18.04.v1
$ docker tag 9f8af246f7c6 link/ubuntu:dev   # 设置一下 tag，tag 就是 IMAGE ID 方便易于记忆的
$ docker history image_id     				# 查看一个Image的构建历史
```

### 利用Dockerfile创建镜像

```bash
$ docker build -t link/ubuntu.v1 .
```



## 容器管理

### 作为 command 运行

```bash
# 格式: docker run [image] [command ...]
$ docker run ubuntu:18.04 /bin/echo "hello 18.04"
```

### 作为 shell 运行

```bash
$ docker run -it ubuntu:18.04 /bin/bash # 起一个容器，并进入它的终端界面
root@7f62c7880035:/# cat /proc/version
root@7f62c7880035:/# ls
root@7f62c7880035:~# exit               # 退出容器，容器也直接停止了
```

- `-t` 在新容器内指定一个伪终端或终端
- `-i` 允许你对容器内的标准 IO 进行交互

### 作为 Daemon 运行

```bash
$ docker run -d ubuntu:18.04 /bin/sh -c "while true; do echo hello world; sleep 1; done"
$ docker run -p 3306:3306                       # 端口映射
$ docker run -v /home/mysql/data:/var/lib/mysql # 存储卷映射
$ docker run -e VAR="xxxx"                      # 指定容器环境变量
$ docker run --restart=always  --name web -d centos /bin/sh -c "echo helloworld"    # 自动重启
# 退出代码非０时才重启，重启尝试次数为５次
$ docker run --restart=on-failure:5 --name web -d ubuntu /bin/bash 
```

### 查看容器

```bash
# 查看
$ docker ps                                     # 查看运行状态的容器
$ docker ps -a                                  # 查看所有状态的容器
$ docker stats                                  # 查看所有正在运行的容器的状态
$ docker logs -ft e73ae1b93869                  # 查看 logs
$ docker top e73ae1b93869          				# 查看容器内进程
$ docker inspect e73ae1b93869              		# 查看容器的详细状态

## 停止
$ docker stop e73ae1b93869                      # 停止容器

## 再启动
$ docker start e73ae1b93869                		# 重新启动已经停止的容器
$ docker exec -it e73ae1b93869 /bin/bash   		# 附着到一个容器上,连接到容器的shell

## 销毁
$ docker rm e73ae1b93869                   		# 删除一个容器
$ docker container prune            			# 将所有 exit 状态的容器清除
$ docker rm $(docker ps -aq)        			# 删除所有容器
```

### 其他容器命令

```bash
$ docker cp data.txt test:/tmp/ # 复制文件到容器内部
$ docker container port test # 查看容器端口映射情况
$ docker export -o ubuntu18.04.c.tar.gz 容器ID			# 导出一个容器
$ docker import ubuntu18.04.tar.gz - link/ubuntu18.v1    # 导入一个容器
```

如果容器内 `PID = 1` 号进程停止运行了，那么容器也会随着退出。

#### WebApp应用案例

```bash
$ docker pull training/webapp
$ docker run -d -P training/webapp python app.py              # -P 主机随机端口
$ docker run -d -p 4000:5000 training/webapp python app.py    # -p 指定主机端口
$ docker ps
CONTAINER ID  IMAGE           COMMAND         CREATED       STATUS        PORTS
05941fb95b13  training/webapp "python app.py" 4 seconds ago Up 3 seconds  0.0.0.0:4000->5000/tcp
51c8abb1e411  training/webapp "python app.py" 2 minutes ago Up 2 minutes  0.0.0.0:32807->5000/tcp

$ curl localhost:4000
Hello world!%

$ docker logs -ft 05941fb95b13
2020-02-20T09:35:38.040175400Z Running on http://0.0.0.0:5000/

$ docker top 05941fb95b13
UID   PID    PPID   C   STIME   TTY   TIME      CMD
root  26706  26678  0   17:35   ?     00:00:00  python app.py
```

#### 数据库案例

```bash
$ docker pull mysql:5.6        # 获取一个 Mysql 5.6 的镜像
$ docker run -p 3306:3306 -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.6
```



## 数据卷

```bash
$ docker volume create -d local test
$ docker run -d -P --mount type=bind,source=/webapp,destination=/opt/webapp training/webapp python app.py
$ docker run -d -P -v /webapp:/opt/webapp training/webapp python app.py 
```



## Dockerfile

### Nginx例子

```dockerfile
FROM ubuntu:18.04
MAINTAINER link "1162097842@qq.com"
RUN apt-get update && apt-get install -y nginx
RUN echo 'Hi, I am your container' > /var/www/html/index.html
EXPOSE 80
```

```bash
$ docker build -t link/ubuntu:0.6 ./
Status: Downloaded newer image for ubuntu:18.04
 ---> c3c304cb4f22 (stepID)
$ docker run -it setpID /bin/bash # 通过stepID进入容器, 调试正确后,退出修改 Dockerfile
$ docker build --no-cache -t link/ubuntu:0.6 ./ # 取消构建cache
$ docker run -itd -P --name test7 link/ubuntu:0.6 nginx -g "daemon off;" # 运行自定义镜像
$ curl localhost:32776
Hi, I am your container
```



#### Dockerfile 参考

```dockerfile
FROM ubuntu:18.04
MAINTAINER link "link@muchenglin.com"

RUN /bin/echo "root:Link_123456" | chpasswd
RUN useradd link
RUN /bin/echo "link:Link_123456" | chpasswd

EXPOSE 22
EXPOSE 80

CMD /usr/sbin/sshd -D
```

## 容器互联

```bash
$ ip a show # 查看 ip 地址，没有 ifconfig 情况下使用
```

```bash
$ docker network create -d bridge link-test-net   # 创建新网络
ba8f1ed449a4bb927418c5a632760a624979dc0791ec0230c874fe222cc03c8c
$ docker network ls # 查看网络
NETWORK ID          NAME                        DRIVER              SCOPE
99a9441d083e        bridge                      bridge              local
7d62ec3cf6e9        host                        host                local
ba8f1ed449a4        link-test-net               bridge              local

$ docker run -itd --name web --network link-test-net link/ubuntu:dev /bin/bash
$ docker run -itd --name db1 --network link-test-net link/ubuntu:dev /bin/bash

$ docker exec -it web /bin/bash   # 和 db1 可以相互 ping通
root@00f61db4e4e1:/# ping db1
PING db1 (172.19.0.3) 56(84) bytes of data.
64 bytes from db1.link-test-net (172.19.0.3): icmp_seq=1 ttl=64 time=0.113 ms
64 bytes from db1.link-test-net (172.19.0.3): icmp_seq=2 ttl=64 time=0.122 ms
```

