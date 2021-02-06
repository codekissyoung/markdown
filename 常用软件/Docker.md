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
$ docker info 												 # 重要，打印了很多关键信息
$ docker login docker.io 			   # 登录 dockerhub, 认证信息位置: ~/.docker/config.json
$ sudo usermod -aG docker $USER # 免 sudo 执行 docker
$ dockerd -D -H tcp://127.0.0.1:2376 # 监听socket端口，而不是sock文件
$ journalctl -u docker.service       # 查看服务日志
```

/etc/docker/daemon.json

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
$ docker run -itd ubuntu /bin/bash
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

### 3.1 docker run

```bash
# 格式: docker run [参数] IMAGE [启动命令] [ARG]
# -t 为容器分配一个伪终端
# -i 开启容器的STDIN
# -d 非交互式启动
# --rm 退出后即删除容器
# --name 指定名字

# 1. 退出后停止运行
$ docker run -it ubuntu:18.04 /bin/bash # 起一个容器，并进入它的终端界面
root@7f62c7880035:~# exit               # 退出容器，容器也直接停止了

# 2. 作为 Daemon 运行
$ docker run -d ubuntu:18.04 /bin/sh -c "while true; do echo hello world; sleep 1; done"
$ docker exec -it 容器ID /bin/bash # 附着到一个容器上,连接到容器的shell
$ docker run --restart=always # 自动重启
$ docker run --restart=on-failure:5 # 退出代码非 0 时才重启，重启尝试次数为５次
```

### 3.2 必会操作

```bash
$ docker run -p [宿主端口]:[容器端口] # 端口映射 -P 动态绑定宿主机端口
$ docker run -v [宿主路径]:[容器路径]:[rw|ro] # 挂载目录
$ docker run -e VAR_NAME="xxxx" -e BBB="bbb" # 指定容器环境变量

$ docker run -d -p 3306:3306 -v ~/mysqldata:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=123456 --restart=always --name db01 mysql:5.6
$ docker run -d -P -v /webapp:/opt/webapp codekissyoung/webapp python app.py 
```

### 3.2 管理容器

```bash
$ docker ps -a             # 查看所有容器
$ docker start 容器ID       # 重新启动已经停止的容器
$ docker stop  容器ID       # 停止容器
$ docker stats 									# 查看所有正在运行的容器的状态
$ docker top 容器ID         # 查看容器内进程
$ docker logs -ft 容器ID    # 容器日志
$ docker events [OPTIONS]  # 系统事件
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
$ docker rm $(docker ps -aq)       # 删除所有退出容器

$ docker cp data.txt test:/tmp/ # 复制文件到容器内部
$ docker port mysql01 # 查看容器端口映射情况
$ docker kill -s <signal> <container> # 向容器内发信号
$ docker diff <container> # 查看容器读写层的改动

$ docker export -o ubuntu18.04.c.tar.gz 容器ID # 导出一个容器
$ docker import ubuntu18.04.tar.gz - link/ubuntu18.v1 # 导入一个容器
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
# 1. 基于已有容器构建镜像
$ docker commit -p -m"commit msg" -a"author link" 容器ID link/ubuntu:18.04.v1

# 2. 从当前文件夹下 Dockerfile 构建镜像（官方推荐做法）
$ docker build -t="link/ubuntu.v1" ./ 

$ docker images -a # 查看本地的镜像
$ docker tag 镜像ID docker.io/codekissyoung/ubuntu:v1.1.2   # 给 Image 打上 tag
$ docker inspect link/sample:latest -f '{{.Config.Cmd}}' # 查看Image的情况
$ docker history 镜像ID # 查看一个Image的构建历史

$ docker save 镜像ID > ubuntu_18.04.tar.gz 	# 将镜像导出,会抹去tag信息
$ docker load < ubuntu_18.04.tar.gz # 导入

$ docker rmi -f 镜像ID # 删除（会删除这个imageID的不同tag的所有镜像）
$ docker image prune -f	 # 清理无用的镜像
```

### 4.2 远程操作

```bash
$ docker pull registry.hub.docker.com/ubuntu:18.04  # 拉取镜像，这里用的是完整的路径
$ docker push hub.c.163.com/public/ubuntu:18.04     # 推送镜像，这里用的是完整的路径
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

```bash
# docker build -t codekissyoung/nginx:latest ./ 构建命令
# docker run -it codekissyoung/nginx:latest -g "daemon off;"
# 最终在容器中执行的命令为 /usr/sbin/nginx -g "daemon off;"

FROM ubuntu:18.04 # 基础镜像 
MAINTAINER link "1162097842@qq.com" # 写入作者信息
ENV CREATED_AT 2020-12-25 # 设置环境变量
USER link # 指定进程用户
# 设置工作目录后，RUN、CMD、ENTRYPOINT、ADD、COPY 等命令都会在该目录下执行
WORKDIR /usr/share/nginx/html # 指定工作目录
RUN apt-get update && apt-get install -y nginx # 使用/bin/sh -c执行命令，会创建新镜像层
ADD index.html /var/www/index.html # 把当前目录文件复制到镜像里
EXPOSE 80 # 暴露 80 端口
ENTRYPOINT ["/usr/sbin/nginx"] # 指定镜像默认的启动命令
```

构建会在 Docker Daemon 中执行。构建前，构建进程会将全部内容发送到守护进程。大多情况下，应该将一个空目录作为构建上下文环境，并将 Dockerfile 文件放在该目录下。可以通过`.dockerignore`排除不需要的文件和目录。

```bash
$ docker build -t link/ubuntu:0.6 ./ 						# 从本目录下的 Dockerfile 开始构建镜像
Status: Downloaded newer image for ubuntu:18.04
 ---> c3c304cb4f22 (stepID) # 每条命令都会产生执行步骤 ID
# 如果结果不符合预期，可以通过 stepID 进入容器，调试正确后，然后退出修改 Dockerfile
$ docker run -it stepID /bin/bash
$ docker build --no-cache -t link/ubuntu:0.7 ./ # 删除 cache，再次构建
$ docker run -itd -p 80:80 link/ubuntu:0.7 nginx -g "daemon off;" # 运行自定义镜像 
$ curl localhost:80
Hi, I am your container
```

```bash
FROM ubuntu:18.04
MAINTAINER link "link@muchenglin.com"
RUN /bin/echo "root:Link_123456" | chpasswd
RUN useradd link
RUN /bin/echo "link:Link_123456" | chpasswd
EXPOSE 22
EXPOSE 80
CMD /usr/sbin/sshd -D
```

### 常用指令

```dockerfile
# 将从构建目录中的文件/目录，复制到新的一层的镜像内的<目标路径> 如果原路径是个 URL，那么会下载好文件后，再放入
ADD <源路径> <目标路径>
ADD package.json /usr/src/app/
ADD hom?.txt /mydir/

# 指定可以指定一或多条元数据
LABEL version="1.0" description="这是一个Web服务器" by="IT笔录"

# 指定传递给构建运行时的变量
# docker build --build-arg site=itiblu.com -t itbilu/test .
ARG build_user=IT笔录

EXPOSE <port> [<port>...] # 开放监听端口
STOPSIGNAL signal # 用于设置停止容器所要发送的系统调用信号
# 数据卷映射 让我们可以将源代码、数据或其它内容添加到镜像中，而又不并提交到镜像中，并使我们可以多个容器间共享这些内容
VOLUME ["/data"]

# 在容器启动时所要执行的命令，在 docker run 中指定命令，可以覆盖本句
CMD command param1 param2

# 给容器配置一个可执行程序。通过 ENTRYPOINT 指定的程序都会被设置为默认启动程序
# 而 docker run 命令中指定的任何参数，都会被当做参数再次传递给 ENTRYPOINT
ENTRYPOINT command param1 param2
```

一般的做法是使用 CI/CD 系统，在应用程序代码或`Dockfile`文件发生变更时，自动构建新镜像。

## 6. 网络模型

容器如何连接到一起，以及如果是在不同的宿主机上，如何连接在一起提供服务?

如果是在生产环境，还需要配合上更复杂的服务发现机制。

如何去访问一个容器内的应用?

如果应用在Docker容器内部运行，该如何以一种相对安全的方式取连接或发现所依赖的应用服务?

在网络上，该如何加固这些运行在 Docker 容器内部的应用?

### 6.1 NAT (默认)

```bash
# 宿主机虚拟出来的网卡设备
docker0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
        inet6 fe80::42:29ff:fec5:5b7c  prefixlen 64  scopeid 0x20<link>
        ether 02:42:29:c5:5b:7c  txqueuelen 0  (以太网)

# 容器内部虚拟出来的网络设备
root@bcc67cde6a84:~# ip addr
18: eth0@if19: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 02:42:ac:11:00:04 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.4/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
```

### 6.2 None 不需要网络设备

业务需求不对外提供网络服务，只用到CPU和内存、磁盘资源去跑一些任务，比如转码之类的。

```bash
$ docker run -it --rm --net=none myalpine /bin/sh
```

### 6.3 Host 与宿主机共享网络

```bash
$ docker run -it --rm --net=host codekissyoung/kubia
root@cky-pc:~# ifconfig
docker0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
        inet6 fe80::42:29ff:fec5:5b7c  prefixlen 64  scopeid 0x20<link>
        ether 02:42:29:c5:5b:7c  txqueuelen 0  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2304  bytes 457121 (457.1 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

enp4s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.31.124  netmask 255.255.255.0  broadcast 192.168.31.255
        inet6 fe80::e06f:1aaa:46c9:9e83  prefixlen 64  scopeid 0x20<link>
        ether 04:d4:c4:ec:c0:80  txqueuelen 1000  (Ethernet)
        RX packets 8041841  bytes 10743985972 (10.7 GB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2916158  bytes 232114377 (232.1 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
```

### 6.4 联合网络 容器共享网络空间

```bash
$ docker run -it --net=container:d6742df234rf linkos:latest /bin/bash
```

### 6.5 桥接网络

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

