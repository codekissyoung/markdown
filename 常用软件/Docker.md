# Docker

Docker的基础知识、命令。

## 1. 安装与配置

```bash
$ sudo apt-get install linux-image-extra-$(uname -r) linux-image-extra-virtual # 使用 aufs 存储
$ sudo apt-get install apt-transport-https ca-certificates software-properties-common curl
$ sudo apt-get install docker-ce
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
$ sudo systemctl enable docker

$ docker version
$ docker info
$ sudo usermod -aG docker $USER # 免 sudo 执行 docker

$ dockerd -D -H tcp://127.0.0.1:2376 # 监听socket端口，而不是sock文件
$ journalctl -u docker.service       # 查看服务日志
```

默认配置文件在 `/etc/default/docker`　

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

## 2. 基础

```bash
$ docker run hello-world                               
Hello from Docker!
This message shows that your installation appears to be working correctly.
To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.
To try something more ambitious, you can run an Ubuntu container with:
    docker run -it ubuntu bash
```

```bash
$ docker run -itd ubuntu /bin/bash
# -t 为容器分配一个伪终端
# -i 开启容器的 STDIN
# -d Daemon
$ docker exec -it 容器ID /bin/bash # 进入容器
```

创建了一个新容器，该容器拥有自己的网络IP地址以及一个和宿主机通信的桥接网络接口．如果容器内1号进程（启动进程）停止运行了，那么容器也会随着退出。

```bash
root@3798a98859f9:~# hostname
3798a98859f9
root@3798a98859f9:~# cat /etc/hosts
127.0.0.1	localhost
172.17.0.3	3798a98859f9
root@3798a98859f9:~# ps aux
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.0   4108  3288 pts/0    Ss+  04:42   0:00 /bin/bash
```

## 3. 容器管理

### 3.1 运行容器

```bash
# 格式: docker run [options] IMAGE [COMMAND] [ARG]

# 1. 退出后停止运行
$ docker run -it ubuntu:18.04 /bin/bash # 起一个容器，并进入它的终端界面
root@7f62c7880035:~# exit               # 退出容器，容器也直接停止了

# 2. 作为 Daemon 运行
$ docker run -d ubuntu:18.04 /bin/sh -c "while true; do echo hello world; sleep 1; done"
$ docker exec -it 容器ID /bin/bash # 附着到一个容器上,连接到容器的shell

# 常用参数
$ docker run -p [host-port]:[container-port] # 端口映射
$ docker run -v [host-dir]:[container-dir]:[rw|ro] # 存储映射
$ docker run -e VAR="xxxx" # 指定容器环境变量
$ docker run --restart=always # 自动重启
$ docker run --restart=on-failure:5 # 退出代码非 0 时才重启，重启尝试次数为５次
```

### 3.2 管理容器

```bash
$ docker ps -a              # 查看所有容器

$ docker start 容器ID       # 重新启动已经停止的容器
$ docker stop  容器ID       # 停止容器

$ docker stats # 查看所有正在运行的容器的状态
$ docker top 容器ID         # 查看容器内进程
$ docker logs -ft 容器ID    # 容器日志
$ docker events [OPTIONS]   # 系统事件
$ docker inspect 容器ID     # 查看容器的详细状态
$ docker inspect mysql01 --format '{{.NetworkSettings.IPAddress}}'
172.17.0.2
$ ifconfig # 容器和宿主机有一个虚拟网卡，所以可以通信
docker0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
$ ping 172.17.0.2                                           
PING 172.17.0.2 (172.17.0.2) 56(84) bytes of data.
64 bytes from 172.17.0.2: icmp_seq=1 ttl=64 time=0.027 ms

## 销毁
$ docker rm 容器ID                 # 删除一个容器
$ docker container prune           # 将所有 exit 状态的容器清除
$ docker rm $(docker ps -aq)       # 删除所有容器

# 其他
$ docker cp data.txt test:/tmp/    # 复制文件到容器内部
$ docker port mysql01									# 查看容器端口映射情况
$ docker kill -s <signal> <container> # 向容器内发信号
$ docker diff <container>						# 查看容器读写层的改动

$ docker export -o ubuntu18.04.c.tar.gz 容器ID # 导出一个容器
$ docker import ubuntu18.04.tar.gz - link/ubuntu18.v1 # 导入一个容器
```

### 3.3 容器启动案例

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

### 3.4 容器应用栈例子

```bash
$ docker pull ubuntu
$ docker pull django
$ docker pull haproxy
$ docker pull redis
```

## 4. 镜像管理

镜像是文件系统叠加而成：

- 底层是 bootfs (引导文件系统)，但是当启动后 bootfs 会被卸载，以节省更多内存空间，恩就是个工具人。

- 第二层是 rootfs ，是操作系统层（裁剪版Debian或Ubuntu），永远处于只读状态
- 往上可以继续叠加更多的文件系统
- 最顶层是一个可读可写的文件系统，Docker中运行的程序就是在这个读写层执行的

Docker使用的是一种联合加载技术（union mount），文件系统一层叠一层，从最顶部往下，同名文件会被遮盖，最终从外面看起来是一个文件系统。

```bash
可写容器
-----------------------|
Apache 镜像
-----------------------|
emacs 镜像
-----------------------|
基础 Ubuntu 镜像 rootfs
-----------------------|
引导文件系统 bootfs
-----------------------|
容器组 命名空间 设备映射
-----------------------|
宿主内核
-----------------------|
```

在生产环境中，通常是将代码、运行时依赖、以及系统的需求打包进镜像里。而数据库凭证和其他的敏感信息的配置文件通常在运行时添加，而非打包进镜像中。

### 4.1 本地操作

```bash
# 1. 基于已有容器构建
$ docker commit -m"commit msg" -a"author link" 容器ID link/ubuntu:18.04.v1

# 2. 从当前文件夹下 Dockerfile 构建镜像（官方推荐做法）
$ docker build -t="link/ubuntu.v1" ./ 

$ docker images -a # 查看本地的镜像
$ docker tag 镜像ID link/ubuntu:dev   # 给 Image 打上 tag
$ docker inspect link/sample:latest -f '{{.Config.Cmd}}' # 查看Image的情况
$ docker history imageId # 查看一个Image的构建历史

$ docker save -o ubuntu_18.04.tar.gz ubuntu:18.04	# 将镜像导出
$ docker load -i ubuntu_18.04.tar.gz # 导入

$ docker rmi 镜像ID	# 删除镜像
$ docker image prune -f	 # 清理无用的镜像
```

### 4.2 远程操作

```bash
$ docker pull NAME[:TAG]  # 从远程库拉取镜像到本地
$ docker push NAME:[:TAG] # 推送库到远程仓库
$ docker pull registry.hub.docker.com/ubuntu:18.04  # 拉取镜像，这里用的是完整的路径
$ docker pull hub.c.163.com/public/ubuntu:18.04     # 拉取镜像，这里用的是完整的路径
pull 参数:
--registry-mirror=proxy_url 指定代理服务器
```

### 4.3 Ubuntu镜像

安装些常用命令

```bash
apt-get update
apt install net-tools # ifconfig
apt install iputils-ping # ping 命令
apt-get install iproute2 # ip 命令
apt-get install libterm-readkey-perl 
```

## 5. Dockerfile

Dockerfile 定义镜像，镜像运行成为容器，可以说 Dockerfile 就是镜像的源代码，编译后成了镜像，运行后就成了容器。

```dockerfile
FROM ubuntu:18.04 																		# 指定基于的镜像
MAINTAINER link "1162097842@qq.com" 						# 写入作者信息
ENV CREATED_AT 2020-12-25 													# 设置环境变量
# RUN 命令在容器里会使用 /bin/sh -c 执行命令
RUN apt-get update && apt-get install -y nginx # 每条 RUN 命令会创建一个新镜像层
RUN echo 'Hi, I am your container' > /var/www/html/index.html
EXPOSE 80 # 暴露 80 端口
ENTRYPOINT ["/usr/sbin/nginx"] 

# docker run -it  link/test -g "daemon off;"
# 最终在容器中执行的命令为 /usr/sbin/nginx -g "daemon off;"
```

构建会在 Docker Daemon 中执行。构建前，构建进程会将全部内容发送到守护进程。大多情况下，应该将一个空目录作为构建上下文环境，并将 Dockerfile 文件放在该目录下。可以通过`.dockerignore`排除不需要的文件和目录。

```bash
$ docker build -t link/ubuntu:0.6 ./ 						# 从本目录下的 Dockerfile 开始构建镜像
Status: Downloaded newer image for ubuntu:18.04
 ---> c3c304cb4f22 (stepID) # 每条命令都会产生执行步骤 ID

# 如果结果不符合预期，可以通过 stepID 进入容器，调试正确后，然后退出修改 Dockerfile
$ docker run -it stepID /bin/bash

# 删除 cache，再次构建
$ docker build --no-cache -t link/ubuntu:0.7 ./

# 运行自定义镜像
$ docker run -itd -p 80:80 --name test7 link/ubuntu:0.7 nginx -g "daemon off;" 

$ curl localhost:80
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

### 6.2 常用指令

```dockerfile
# 指定容器内部，程序运行的工作目录
# 设置工作目录后，RUN、CMD、ENTRYPOINT、ADD、COPY 等命令都会在该目录下执行
WORKDIR <路径>

# 将从构建目录中的文件/目录，复制到新的一层的镜像内的<目标路径>
# 如果原路径是个 URL，那么会下载好文件后，再放入
ADD <源路径> <目标路径>
ADD package.json /usr/src/app/
ADD hom?.txt /mydir/

# 设置容器内环境变量
ENV VERSION=1.0 DEBUG=on NAME="Happy Feet"

# 指定可以指定一或多条元数据
LABEL version="1.0" description="这是一个Web服务器" by="IT笔录"

# 指定传递给构建运行时的变量
# docker build --build-arg site=itiblu.com -t itbilu/test .
ARG site
ARG build_user=IT笔录

# 开放监听端口
EXPOSE <port> [<port>...]

# 用于设置停止容器所要发送的系统调用信号
STOPSIGNAL signal

# 数据卷映射
# 让我们可以将源代码、数据或其它内容添加到镜像中，而又不并提交到镜像中，并使我们可以多个容器间共享这些内容
VOLUME ["/data"]

# 指定当前用户
USER apache

# 在容器启动时所要执行的命令，在 docker run 中指定命令，可以覆盖本句
CMD command param1 param2

# 给容器配置一个可执行程序。也就是说，每次使用镜像创建容器时，通过 ENTRYPOINT 指定的程序都会被设置为默认程序。
# 而 docker run 命令中指定的任何参数，都会被当做参数再次传递给 ENTRYPOINT
ENTRYPOINT command param1 param2
```

通过在开发机器上手工构建镜像，然后再推送到镜像仓库，之后再从仓库中拉取镜像到生产环境宿主机中。这样做虽然可以，但更好的做法是：使用 CI/CD 系统，在应用程序代码或Dockfile文件发生变更时，自动构建新镜像。

## 6. 容器互联

容器如何连接到一起，以及如果是在不同的宿主机上，如何连接在一起提供服务?

如果是在生产环境，还需要配合上更复杂的服务发现机制。

如何去访问一个容器内的应用?

如果应用在Docker容器内部运行，该如何以一种相对安全的方式取连接或发现所依赖的应用服务?

在网络上，该如何加固这些运行在 Docker 容器内部的应用?



### 6.1 桥接网络

```bash
$ docker network create app # 创建一个 brige 网络

$ docker network ls # 查看
NETWORK ID     NAME                        DRIVER    SCOPE
b57758027b03   app                         bridge    local

$ docker run -itd --name web --net app ubuntu /bin/bash
$ docker run -itd --name db1 --net app ubuntu /bin/bash

$ docker exec -it web /bin/bash   # 和 db1 可以相互 ping通
root@00f61db4e4e1:/# ping db1
PING db1 (172.19.0.3) 56(84) bytes of data.
64 bytes from db1.link-test-net (172.19.0.3): icmp_seq=1 ttl=64 time=0.113 ms
64 bytes from db1.link-test-net (172.19.0.3): icmp_seq=2 ttl=64 time=0.122 ms
```

### 6.2 overlay网络

## 7. 容器编排 Orchestration

### 7.1 Docker Compose

一个 Python 写的工具，通过`yaml`格式的配置文件，来批量启动容器。

服务 (service) ：一个应用的容器，实际上可以包括若干运行相同镜像的容器实例。

项目 (project) ：由一组关联的应用容器组成的一个完整业务单元，在 docker-compose.yml 文件中定义。

```bash
# docker-compose 命令都需要在项目目录下执行
$ docker-compose build # 构建（重新构建）项目中的服务容器
$ docker-compose up 		# 启动项目， -d 在后台运行
$ docker-compose ps 		# 列出服务
        Name                      Command               State           Ports         
--------------------------------------------------------------------------------------
learncompose_redis_1   docker-entrypoint.sh redis ...   Up      6379/tcp              
learncompose_web_1     python app.py                    Up      0.0.0.0:5000->5000/tcp

$ docker-compose stop # 停止服务
Stopping learncompose_redis_1 ... done
Stopping learncompose_web_1   ... done

$ docker-compose start # 启动已经存在的服务容器
$ docker-compose down # 停用移除所有容器以及网络相关
$ docker-compose rm   # #删除所有（停止状态的）服务容器
$ docker-compose logs # 查看服务容器的输出
$ docker-compose pull # 拉取服务依赖的镜像
$ docker-compose restart # 重启项目中的服务
$ docker-compose run ubuntu ping docker.com # 在指定服务上执行一个命令
$ docker-compose scale web=3 db=2 # 设置指定服务运行的容器个数
```

### 7.2 Consul
