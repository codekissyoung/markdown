# Docker K8s 和 jenkins

## Docker

```bash
$ sudo apt-get install -y docker.io     # 安装 docker
```

#### 配置镜像加速器

用自己账号登录阿里云，获取专用的加速地址。然后`sudo vim /etc/docker/daemon.json`，填入下面内容。

```bash
{
    "registry-mirrors" : ["https://x39d1d5v.mirror.aliyuncs.com"]
}
```

```bash
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
```

```bash
$ sudo docker pull mysql:5.6        # 获取一个 Mysql 5.6 的镜像

# 将刚刚下载的镜像跑起来
$ sudo docker run -p 3306:3306 --name mymysql -v /home/mysql/data:/var/lib/mysql \
$ -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.6
```

```bash
$ sudo docker version        # 查看版本
$ sudo docker pull image     # 从仓库中拉取 image 到本地
$ sudo docker image ls       # 查看本地存在的镜像
$ sudo docker rmi image      # 删除已经下载到本地的镜像
$ sudo docker run -p 3306:3306                       # 端口映射
$ sudo docker run -v /home/mysql/data:/var/lib/mysql # 存储卷映射
$ sudo docker run -e VAR="xxxx"                      # 指定容器环境变量
$ sudo docker ps -a                                  # 查看已经运行的容器，包含 container-id
$ sudo docker exec -it container-id /bin/bash        # 进入容器内部
$ sudo exit                                          # 退出容器
$ sudo docker logs -f container-id                   # 查看容器日志
$ sudo docker stop container-id                      # 停止容器
$ sudo docker run container-id                       # 将停止的容器，再次开启
$ sudo docker rm container-id                        # 彻底删除一个容器
$ sudo docker login                                  # 登录仓库
```

```bash
$ sudo docker build -t xxxx:1.0  -f dockerfile       # 构建镜像
$ sudo docker tag mysql:5.6 myregistry/mymysql:1.0   # 镜像打 tag
$ sudo docker push myregistry/mysql:1.0              # 镜像推送到仓库
```

`dockerfile`的语法：

```bash
FROM ubuntu:16.04

```

## K8s

```bash
$ Kubectl create -f test.yaml
```


















