# Docker

## 1. 安装与配置

```bash
$ sudo apt-get install linux-image-extra-virtual       
$ sudo apt-get install apt-transport-https ca-certificates software-properties-common
$ sudo apt-get install docker.io
$ sudo systemctl daemon-reload    # 重启 daemon
$ sudo systemctl restart docker   # 重启 docker daemon
$ sudo systemctl enable docker    # 开机启动 docker
$ docker version
$ docker info
$ sudo usermod -aG docker $USER      # 免 sudo 执行 docker
$ dockerd -D -H tcp://127.0.0.1:2376 # 监听socket端口，而不是sock文件
$ journalctl -u docker.service       # 查看服务日志
```

配置加速器 /etc/docker/daemon.json

```json
{
    "registry-mirrors":[
        "https://registry.docker-cn.com",
        "https://reg-mirror.qiniu.com",
        "https://x39d1d5v.mirror.aliyuncs.com"
    ],
    "debug":true,
    "hosts":["tcp://127.0.0.1:2376"]
}
```

## 2. 镜像管理

```bash
$ docker images -a # 查看本地的镜像
$ docker pull [OPTIONS] NAME[:TAG]  # 从远程库拉取镜像到本地
$ docker push [OPTIONS] NAME:[:TAG] # 推送库到远程仓库
$ docker image prune -f	 # 清理无用的镜像
$ docker rmi 镜像ID/名字	# 删除镜像
$ docker save -o ubuntu_18.04.tar.gz ubuntu:18.04	# 导出镜像到本地文件
$ docker load -i ubuntu_18.04.tar.gz # 导入本地镜像文件
$ docker history [OPTIONS] CONTAINER # 查看镜像构建历史

# 1. 将容器固化为一个新的镜像（临时做法）
$ docker commit -m"commit msg" -a"link" 容器ID link/ubuntu:18.04.v1
$ docker tag 9f8af246f7c6 link/ubuntu:dev   # 设置一下 tag，tag 就是 IMAGE ID 方便易于记忆的
$ docker history image_id     				# 查看一个Image的构建历史

# 2. 从当前文件夹下 Dockerfile 构建镜像（官方推荐做法）
$ docker build -t="link/ubuntu.v1" ./ 
```

## 3. 容器管理

### 3.1 运行容器

```bash
# 格式: docker run [options] IMAGE [COMMAND] [ARG]
# -t 在新容器内指定一个伪终端或终端
# -i 允许你对容器内的标准 IO 进行交互

# 1. 作为 shell 运行
$ docker run ubuntu:18.04 /bin/echo "hello 18.04"

# 2. 退出后停止运行
$ docker run -it ubuntu:18.04 /bin/bash # 起一个容器，并进入它的终端界面
root@7f62c7880035:~# exit               # 退出容器，容器也直接停止了

# 3. 作为 Daemon 运行
$ docker run -d ubuntu:18.04 /bin/sh -c "while true; do echo hello world; sleep 1; done"
$ docker exec -it 容器ID /bin/bash # 附着到一个容器上,连接到容器的shell
$ docker run -p [host-port]:[container-port] # 端口映射
$ docker run -v [host-dir]:[container-dir]:[rw|ro] # 存储映射
$ docker run -e VAR="xxxx" # 指定容器环境变量
$ docker run --restart=always 				# 自动重启
$ docker run --restart=on-failure:5 # 退出代码非０时才重启，重启尝试次数为５次
```

### 3.2 管理容器

```bash
$ docker ps -a 							 # 查看所有状态的容器
$ docker stats 						   # 查看所有正在运行的容器的状态
$ docker logs -ft 容器ID   # 查看 logs
$ docker events [OPTIONS] 	# 查看实时系统事件
$ docker top 容器ID 				  # 查看容器内进程
$ docker inspect 容器ID     # 查看容器的详细状态
$ docker stop 容器ID        # 停止容器
$ docker start 容器ID       # 重新启动已经停止的容器

## 销毁
$ docker rm 容器ID                 # 删除一个容器
$ docker container prune            			# 将所有 exit 状态的容器清除
$ docker rm $(docker ps -aq)        			# 删除所有容器

# 其他
$ docker cp data.txt test:/tmp/ # 复制文件到容器内部
$ docker container port test # 查看容器端口映射情况
$ docker export -o ubuntu18.04.c.tar.gz 容器ID # 导出一个容器
$ docker import ubuntu18.04.tar.gz - link/ubuntu18.v1 # 导入一个容器
```

如果容器内 `PID = 1` 号进程停止运行了，那么容器也会随着退出。

### 3.4 容器启动案例

```bash
# 启动一个数据库
$ docker run -d -p 3306:3306 -v ~/mysqldata:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=123456 --restart=always --name db01 mysql:5.6
```

```bash
$ docker volume create -d local test
$ docker run -d -P --mount type=bind,source=/webapp,destination=/opt/webapp training/webapp python app.py
$ docker run -d -P -v /webapp:/opt/webapp training/webapp python app.py 
```

### 3.5 容器应用栈例子

```bash
$ docker pull ubuntu
$ docker pull django
$ docker pull haproxy
$ docker pull redis
```



## 4. Dockerfile

### 4.1 Nginx例子

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

## 5. 容器互联

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

