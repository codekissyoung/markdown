# Docker K8s 和 jenkins

[K8s 官方文档](https://kubernetes.io/zh/docs/tutorials/kubernetes-basics/)

https://kubernetes.io/docs/tutorials/hello-minikube/

## Docker

![](https://img.codekissyoung.com/2019/12/11/8fc3e024ef6ccd87fecbc06bb6e61683.png)

```bash
$ sudo systemctl start docker         # 启动docker
$ sudo systemctl enable docker        # 设置开机启动docker
$ sudo docker info                    # 查看docker信息
```

```bash
$ sudo docker run [--name container_name] -i -t image-name /bin/bash  # 启动一个容器
-i 保证容器中 STDIN 是开启的
-t 为创建的容器分配一个伪tty终端　
centos 是镜像名称
/bin/bash是伪终端shell

$ docker run --name 取名 -d centos /bin/bash -c "echo hello world"
-d 放入后台运行;
-c 在容器里面执行命令;

$ exit                                                    # 在容器里执行, 退出容器
$ sudo docker ps -a                                       # 查看当前已经建立的容器
$ sudo docker start [container_name|container_ID]         # 重新启动已经停止的容器
$ sudo docker attach [container_name|container_ID]        # 附着到一个容器上,连接到容器的shell
$ sudo docker logs -ft container_name                     # -f 输出最后几条日志 -t 在每条日志前显示时间
$ sudo docker top container_name                                # 查看容器内进程
$ sudo docker exec -d daemon_dave touch /etc/new_config_file    # 直接执行命令
$ sudo docker exec -t -i daemon_dave /bin/bash                  # 进入容器,再自己去执行命令
$ sudo docker stop [container_name|container_ID]                # 停止容器
$ sudo docker inspect container_name                            # 查看容器的详细状态
$ sudo docker rm container_name                                 # 删除一个容器
$ sudo docker rm $(docker ps -a -q)                             # 删除所有容器
$ sudo docker image ls                                          # 列出本地所有镜像
```

## 容器被关闭时自动重启

docker run --restart=always --name daemon_dave -d centos /bin/sh -c "..."
--restart=on-failure:5 退出代码非０时才重启,重启次数为５次

## 构建自己的镜像:DockerFile

### Docker Hub(类似于 Git Hub 的平台)注册账号

### 登录 Docker Hub

```bash
[root@iZ252e1zy6zZ ~]# docker login
Username: codekissyoung
Password:
Email: cky951010@163.com
WARNING: login credentials saved in /root/.docker/config.json
Login Succeeded
```

### 通过 commit 创建自己的镜像

docker commit container_ID codekissyoung/daemon_dave;
docker commit -m"提交信息：msg" --author="codekissyoung" container_ID codekissyoung/image_name:image_tag;

### 通过 Dockerfile 创建镜像

docker build -t="codekissyoung/static_web:v1" ./
docker build -t="codekissyoung/static_web:v2" git@github.com:codekissyoung/docker_web

- 假设这个 git 仓库下有 Dockerfile 文件

### 单步调试 Dockerfile

docker run -t -i step_return_id /bin/bash;

- 通过每步返回的 step_id 进入容器,调试正确后,退出修改 Dockerfile

### 取消构建缓存

docker build --no-cache -t="codekissyoung/static_web"

- build 会缓存之前成功的步骤,如果不需要可以去除

### 查看一个镜像的构建历史

docker history image_id;

### 从一个新创建的镜像构建容器

docker run -d -p 80 --name=nginx2 codekissyoung/nginx:v1 nginx -g "daemon off;";

### 查看容器的 80 端口映射到本地哪个端口

docker port container_name 80;

```
[root@iZ252e1zy6zZ static_web]# docker port ddeed87650a3 80;
0.0.0.0:32773
```

### 访问 docker 容器

curl localhost:32773

### 将镜像发布到 Docker 　 Hub 上

docker push codekissyoung/nginx:v1;

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

## MiniKube

#### 安装 kubectl

```bash
$ curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt   # kubectl 最新版本
$ curl -Lo kubectl https://storage.googleapis.com/kubernetes-release/release/v1.6.4/bin/linux/amd64/kubectl
$ chmod +x kubectl
$ kubectl version
```

#### 安装 minikube

```bash
$ wget https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ chmod +x minikube-linux-amd64
$ sudo mv minikube-linux-amd64 /usr/local/bin/minikube
$ minikube version
```

#### 运行 minikube

`~/.kube/config` 是 `Minikube`的环境。

```bash
$ minikube start
$ kubectl cluster-info      # 查看 cluster 信息
```

搞个 `nodejs` 应用:

```js
// node/server.js
var http = require("http");
var handleRequest = function(request, response) {
  console.log("Received request for URL: " + request.url);
  response.writeHead(200);
  response.end("Hello World!");
};
var www = http.createServer(handleRequest);
www.listen(8080);
```

使用 `node server.js` 运行，在本机 `localhost:8080` 中测试下是否可以访问到。

应用测试好后，我们将它制作成一个 `docker` 镜像, `Dockerfile` 参考如下:

```bash
FROM node:8.10.0
EXPOSE 8080
COPY server.js .
CMD node server.js
```

```bash
$ eval $(minikube docker-env)               # 设置一些 minikube docker 制作的一些环境变量
$ docker build -t hello-node:v1 .           # 开始制作 镜像
$ docker image ls                           # 制作好之后，可以查看到
REPOSITORY    TAG                 IMAGE ID            CREATED             SIZE
hello-node    v1                  498598a928c6        8 minutes ago       673MB
```

```bash
$ kubectl run hello-node --image=hello-node:v1 --port=8080  # 使用 hello-node 镜像，启动一个 Pod
$ kubectl get deployments                                   # 查看 Pod 的部署情况
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
hello-node   1/1     1            1           91s
$ kubectl get pods                                          # 查看 Pod
NAME                          READY   STATUS    RESTARTS   AGE
hello-node-587b55f6f4-tdcq7   1/1     Running   0          109s
$ kubectl get events                                        # 查看 集群 events
$ kubectl config view                                       # 查看 kubectl 配置
```

默认情况，`Pod`只能通过`Kubernetes`群集内部 IP 访问。要使`hello-node`容器从`Kubernetes`虚拟网络外部访问，须要使用`Kubernetes Service`暴露`Pod`

```bash
$ kubectl expose deployment hello-node --type=LoadBalancer  # 将 Pod 暴露到外部环境
$ kubectl get services                                      # 查看暴露的 service
NAME         TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
hello-node   LoadBalancer   10.106.4.218   <pending>     8080:32100/TCP   2m17s
kubernetes   ClusterIP      10.96.0.1      <none>        443/TCP          41m
$ minikube service hello-node
|-----------|------------|-------------|-----------------------------|
| NAMESPACE |    NAME    | TARGET PORT |             URL             |
|-----------|------------|-------------|-----------------------------|
| default   | hello-node |             | http://192.168.99.101:32100 |
|-----------|------------|-------------|-----------------------------|
🎉  Opening service default/hello-node in default browser...
```

如果我们修改 `server.js` 代码，并且想要在集群里更新部署。操作如下：

```bash
$ vim server.js                                 # 修改 js 代码
$ docker build -t hello-node:v2 .               # 重新制作镜像
$ docker image ls
REPOSITORY                                TAG                 IMAGE ID            CREATED             SIZE
hello-node                                v2                  9d626dfcd396        15 seconds ago      673MB
hello-node                                v1                  498598a928c6        24 minutes ago      673MB
$ kubectl set image deployment/hello-node hello-node=hello-node:v2  # 更新部署
$ minikube service hello-node
|-----------|------------|-------------|-----------------------------|
| NAMESPACE |    NAME    | TARGET PORT |             URL             |
|-----------|------------|-------------|-----------------------------|
| default   | hello-node |             | http://192.168.99.101:32100 |
|-----------|------------|-------------|-----------------------------|
🎉  Opening service default/hello-node in default browser...
```

清理在集群中创建的资源:

```bash
$ kubectl delete service hello-node
$ kubectl delete deployment hello-node
$ minikube stop
```
