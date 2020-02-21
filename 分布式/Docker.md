# Docker

![](https://img.codekissyoung.com/2019/12/11/8fc3e024ef6ccd87fecbc06bb6e61683.png)

## 安装

[Ubuntu Docker 安装](https://www.runoob.com/docker/ubuntu-docker-install.html)

```bash
$ sudo apt-get install docker.io
$ sudo docker version
Client: Docker Engine - Community
 Version:           19.03.6
Server: Docker Engine - Community
 Engine:
  Version:          19.03.6
```

#### 配置加速器

用自己账号登录阿里云，获取专用的加速地址，新建 `/etc/docker/daemon.json`，写入：

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
$ sudo systemctl start docker     # 启动docker
$ sudo systemctl enable docker    # 设置开机启动docker
```

```bash
$ sudo docker version             # 查看版本
$ sudo docker info                # 查看配置信息，能看到 Registry Mirrors
$ docker images                   # 列出本地所有镜像
$ docker                          # 查看所有的命令选项
$ docker command --help           # 查看 command 的具体用法
$ docker ps -a                    # 查看所有的容器
$ docker ps                       # 查看当前正在运行的容器
$ docker stats                    # 查看所有容器的运行状态
```

## 从 Image 起一个容器

#### 拉取一个 Image 到 本地

```bash
$ docker pull ubuntu                    # 从 Registry 拉取一个 Image 到 本地
Using default tag: latest
latest: Pulling from library/ubuntu
Digest: sha256:8d31dad0c58f552e890d68bbfb735588b6b820a46e459672d96e585871acc110
Status: Downloaded newer image for ubuntu:latest
docker.io/library/ubuntu:latest

$ docker images                         # 查看本地的 Images
REPOSITORY                            TAG                 IMAGE ID            CREATED             SIZE
alpine                                3.10                af341ccd2df8        3 weeks ago         5.56MB
ubuntu                                18.04               ccc6e87d482b        5 weeks ago         64.2MB
ubuntu                                latest              ccc6e87d482b        5 weeks ago         64.2MB
hello-world                           latest              fce289e99eb9        13 months ago       1.84kB
```

#### 运行简单命令

用容器执行一条命令，如果本机没有该`image`，则去`Registry`仓库拉取。

```bash
# 格式: docker run [image] [command ...]
$ docker run ubuntu:18.04 /bin/echo "hello 18.04"
Unable to find image 'ubuntu:18.04' locally
18.04: Pulling from library/ubuntu
5c939e3a4d10: Pull complete
...
Digest: sha256:8d31dad0c58f552e890d68bbfb735588b6b820a46e459672d96e585871acc110
Status: Downloaded newer image for ubuntu:18.04
hello 18.04
```

自动重启：

```bash
$ docker run --restart=always  --name web -d centos /bin/sh -c "echo helloworld"

# 退出代码非０时才重启,重启次数为５次
$ docker run --restart=on-failure:5 --name web -d ubuntu /bin/bash
```

#### 运行一个交互界面

从 `image` 起一个容器，并进入它的终端界面：

- `-t` 在新容器内指定一个伪终端或终端
- `-i` 允许你对容器内的标准 IO 进行交互

```bash
$ docker run -it ubuntu:18.04 /bin/bash
root@7f62c7880035:/# echo hello world
hello world
root@7f62c7880035:/# cat /proc/version
Linux version 5.3.0-40-generic (buildd@lcy01-amd64-024) (gcc version 7.4.0 (Ubuntu 7.4.0-1ubuntu1~18.04.1))
root@7f62c7880035:/# ls
bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
root@7f62c7880035:~# exit             # 退出容器，容器也直接停止了
```

#### 作为 Daemon 运行

从 `Image` 以 `Daemon`方式起一个容器，通过`docker ps`查看正在运行的容器，`docker logs [ID]` 查看容器的输出日志：

```bash
$  docker run -d ubuntu:18.04 /bin/sh -c "while true; do echo hello world; sleep 1; done"
e73ae1b938698305f05c743d51c2dbe6d9512ab0d931dd1420f5a4b2d67d1bfa
$ docker ps
CONTAINER ID        IMAGE          COMMAND            CREATED       STATUS       PORTS NAMES
e73ae1b93869        ubuntu:18.04   "/bin/sh -c 'wh"   9 seconds ago Up 7 seconds       naughty_swanson
$ docker logs e73ae1b93869
$ docker logs naughty_swanson # 作用同上
hello world
hello world
...
$ docker stop naughty_swanson # 停止容器
```

```bash
$ docker run -p 3306:3306                       # 端口映射
$ docker run -v /home/mysql/data:/var/lib/mysql # 存储卷映射
$ docker run -e VAR="xxxx"                      # 指定容器环境变量
```

## 容器管理

#### 正在运行的容器的状态

```bash
$ docker stats
```

![](https://img.codekissyoung.com/2020/02/20/9599bb46887537199bebf2a54a1ca89d.png)

#### 所有容器

可以查看所有的容器，如果大量使用`docker run`命令，会生成大量的容器实例。

![](https://img.codekissyoung.com/2020/02/20/ee7f6c07ea92e6874ce6f30759f81e7d.png)

#### 操作实例

```bash
$ docker start container_ID               # 重新启动已经停止的容器
$ docker stop container_ID                # 停止容器
$ docker attach container_ID              # 附着到一个容器上,连接到容器的shell
$ docker exec -it container_ID /bin/bash  # 附着到一个容器上,连接到容器的shell
$ docker logs -ft container_ID            # -f 输出容器内部的标准输出 -t 显示时间
$ docker top containerID                  # 查看容器内进程
$ docker inspect containerID              # 查看容器的详细状态
$ docker rm container_ID                  # 删除一个容器
$ docker rm $(docker ps -a -q)            # 删除所有容器
$ docker container prune                  # 将所有 exit 状态的容器清除
```

一个例子：

```bash
$ docker run -it --name ubuntu-test ubuntu /bin/bash      # 命名为 ubuntu-test
root@739fc49ac687:/# ls
bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
root@739fc49ac687:/# exit
exit              # 注意这时，实例已经退出了，状态为 Exit(0)

$ docker start ubuntu-test   # 再次将这个实例运行起来，注意此时是没有交互界面的，与 run -d 效果一致
ubuntu-test

$ docker attach ubuntu-test  # attach 到这个实例
root@739fc49ac687:/#
$ docker attach ubuntu-test
root@739fc49ac687:/# echo "hello attach"
hello attach
root@739fc49ac687:/# exit
exit            # 这时 实例又退出了
```

在交互式进入容器之后，如果直接`exit`，容器就结束了，可以通过`Ctrl+P+Q`三个健退出。这样容器还是保持运行的，然后通过`docker attach containerID`又可以连接进入容器。

> 容器是否退出，是根据容器内 `PID = 1` 号进程是否处于运行状态来决定的

有没有一种能够进入容器，执行命令后`exit`，不会导致容器也退出的方法？

```bash
$ docker start ubuntu-test   # 再次将这个实例运行起来
ubuntu-test

$ docker exec -it ubuntu-test /bin/bash
root@739fc49ac687:/# exit
exit

$ docker ps                   # 查看 ubuntu-test 还再运行
CONTAINER ID    IMAGE   COMMAND       CREATED         STATUS        PORTS   NAMES
739fc49ac687    ubuntu  "/bin/bash"   10 minutes ago  Up 13 seconds         ubuntu-test
```

一个`Web App`应用案例：

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
2020-02-20T09:35:38.040175400Z  * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
2020-02-20T09:40:19.881122971Z 172.17.0.1 - - [20/Feb/2020 09:40:19] "GET / HTTP/1.1" 200 -
2020-02-20T09:40:19.881904743Z Traceback (most recent call last):
2020-02-20T09:40:19.881958622Z   File "/usr/lib/python2.7/SocketServer.py", line 295, in _h
...

$ docker top 05941fb95b13
UID   PID    PPID   C   STIME   TTY   TIME      CMD
root  26706  26678  0   17:35   ?     00:00:00  python app.py
```

一个数据库案例：

```bash
$ sudo docker pull mysql:5.6        # 获取一个 Mysql 5.6 的镜像

# 将刚刚下载的镜像跑起来
$ sudo docker run -p 3306:3306 --name mymysql -v /home/mysql/data:/var/lib/mysql \
$ -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.6
```

## 构建自定义镜像 Image

先在一个空目录`docker/`下，创建一个`Dockerfile`：

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

```bash
$ docker build -t link/ubuntu:18.04 ./   # 创建自己的 image
Sending build context to Docker daemon  2.048kB
Step 1/8 : FROM ubuntu:18.04
 ---> ccc6e87d482b
Step 2/8 : MAINTAINER link "link@muchenglin.com"
 ---> Running in bf5ebc6277f5
...

$ docker images
REPOSITORY                            TAG                 IMAGE ID            CREATED             SIZE
link/ubuntu                           18.04               bbbf90351c17        21 seconds ago      64.6MB

$ docker run -it link/ubuntu:18.04 /bin/bash # 用自己的镜像 创建实例
root@865b8d0334a0:~# cd /home/
root@865b8d0334a0:/home# mkdir link
root@865b8d0334a0:/home/link# su link
...
root@865b8d0334a0:~# exit
```

如何从一个实例中，创建一个 `Image` 呢，接上文：

```bash
$ docker commit -m"add user link" -a"link" 865b8d0334a0 link/ubuntu:18.04.v1
$ docker images
REPOSITORY                            TAG                 IMAGE ID            CREATED             SIZE
link/ubuntu                           18.04.v1            9f8af246f7c6        10 seconds ago      64.6MB
link/ubuntu                           18.04               bbbf90351c17        7 minutes ago       64.6MB

$ docker tag 9f8af246f7c6 link/ubuntu:dev   # 设置一下 tag，tag 就是 IMAGE ID 方便易于记忆的

$ docker images
REPOSITORY                            TAG                 IMAGE ID            CREATED             SIZE
link/ubuntu                           18.04.v1            9f8af246f7c6        9 minutes ago       64.6MB
link/ubuntu                           dev                 9f8af246f7c6        9 minutes ago       64.6MB
link/ubuntu                           18.04               bbbf90351c17        7 minutes ago       64.6MB

$ docker rmi link/ubuntu:18.04.v1         # 删除本地镜像
Untagged: link/ubuntu:18.04.v1
```

```bash
$ docker history image_id     # 查看一个Image的构建历史

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
$ docker build -t link/ubuntu:0.6 .
$ docker run -itd -P --name test7 link/ubuntu:0.6 nginx -g "daemon off;"
$ curl localhost:32776
Hi, I am your container
```

#### 单步调试 Dockerfile

- 通过每步返回的 step_id 进入容器,调试正确后,退出修改 Dockerfile

```bash
$ docker run -it step_return_id /bin/bash
$ docker build --no-cache -t="codekissyoung/static_web" # 取消构建缓存
```
