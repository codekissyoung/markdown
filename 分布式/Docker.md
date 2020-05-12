# Docker 教程

![](http://img.codekissyoung.com/2019/12/11/8fc3e024ef6ccd87fecbc06bb6e61683.png)

## 安装与配置

```bash
$ sudo apt-get install docker.io
$ sudo docker version               
$ sudo docker info 			# 展示安装配置等详细信息
```

#### 配置加速器

`/etc/docker/daemon.json` ：

```bash
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
$ sudo systemctl enable docker    # 设置开机启动docker
```

## Images

```bash
$ docker pull ubuntu              # 从 Registry 拉取一个 Image 到 本地
$ docker images                   # 查看本地的 Images
```

## Containers

### 作为 command 运行

```bash
# 格式: docker run [image] [command ...]
$ docker run ubuntu:18.04 /bin/echo "hello 18.04"
```

### 作为 shell 运行

```bash
$ docker run -it ubuntu:18.04 /bin/bash # 起一个容器，并进入它的终端界面
root@7f62c7880035:/# cat /proc/version
Linux version 5.3.0-40-generic (buildd@lcy01-amd64-024) (gcc version 7.4.0 (Ubuntu 7.4.0-1ubuntu1~18.04.1))
root@7f62c7880035:/# ls
bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
root@7f62c7880035:~# exit               # 退出容器，容器也直接停止了
```

- `-t` 在新容器内指定一个伪终端或终端
- `-i` 允许你对容器内的标准 IO 进行交互

### 作为 Daemon 运行

```bash
# 以 Daemon 方式起一个容器
$ docker run -d ubuntu:18.04 /bin/sh -c "while true; do echo hello world; sleep 1; done"
$ docker ps                                     # 查看运行状态的容器
$ docker ps -a                                  # 查看所有状态的容器
$ docker logs e73ae1b93869                      # 查看 logs
$ docker stop e73ae1b93869                      # 停止容器
$ docker run -p 3306:3306                       # 端口映射
$ docker run -v /home/mysql/data:/var/lib/mysql # 存储卷映射
$ docker run -e VAR="xxxx"                      # 指定容器环境变量
$ docker run --restart=always  --name web -d centos /bin/sh -c "echo helloworld"    # 自动重启
# 退出代码非０时才重启，重启尝试次数为５次
$ docker run --restart=on-failure:5 --name web -d ubuntu /bin/bash 
$ docker stats                                  # 查看所有正在运行的容器的状态
```

#### 操作实例

```bash
$ docker start 容器ID                # 重新启动已经停止的容器
$ docker stop 容器ID                 # 停止容器
$ docker exec -it 容器ID /bin/bash   # 附着到一个容器上,连接到容器的shell
$ docker logs -ft 容器ID             # -f 输出容器内部的标准输出 -t 显示时间
$ docker top 容器ID                  # 查看容器内进程
$ docker inspect 容器ID              # 查看容器的详细状态
$ docker rm 容器ID                   # 删除一个容器
$ docker rm $(docker ps -aq)        # 删除所有容器
$ docker container prune            # 将所有 exit 状态的容器清除
```

如果容器内 `PID = 1` 号进程停止运行了，那么容器也会随着退出。

#### 一个WebApp应用案例

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
2020-02-20T09:35:38.040175400Z Running on http://0.0.0.0:5000/ (Press CTRL+C to 
...

$ docker top 05941fb95b13
UID   PID    PPID   C   STIME   TTY   TIME      CMD
root  26706  26678  0   17:35   ?     00:00:00  python app.py
```

#### 一个数据库案例

```bash
$ sudo docker pull mysql:5.6        # 获取一个 Mysql 5.6 的镜像

# 将刚刚下载的镜像跑起来
$ sudo docker run -p 3306:3306 --name mymysql -v /home/mysql/data:/var/lib/mysql \
$ -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.6
```

## Dockerfile

构建`Nginx`的简单例子：

```dockerfile
FROM ubuntu:18.04
MAINTAINER link "1162097842@qq.com"
RUN apt-get update
RUN apt-get install -y nginx
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

如何从一个实例中，创建一个 `Image` 呢，接上文：

```bash
$ docker commit -m"add user link" -a"link" 容器ID link/ubuntu:18.04.v1
$ docker tag 9f8af246f7c6 link/ubuntu:dev   # 设置一下 tag，tag 就是 IMAGE ID 方便易于记忆的
$ docker history image_id     # 查看一个Image的构建历史
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

