# CentOS 7
## 安装docker
sudo yum udpate;
sudo yum install docker;
## 启动docker
sudo systemctl start docker;
## 设置开机启动docker
sudo systemctl enable docker;
## 查看docker信息
sudo docker info;
# 容器
## 建立一个容器并进入
sudo docker run [--name container_name] -i -t centos /bin/bash;
-i 保证容器中STDIN是开启的
-t 为创建的容器分配一个伪tty终端　
centos 是镜像名称
/bin/bash;是伪终端shell
[--name container_name] 为容器命名
## 退出容器
exit;
## 查看当前已经建立的容器
docker ps -a
```
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                      PORTS               NAMES
e069dcbebc17        centos              "/bin/bash"         19 seconds ago      Exited (0) 11 seconds ago                       determined_ramanujan
823b3a0b13f2        centos              "/bin/bash"         10 hours ago        Exited (0) 10 hours ago                         compassionate_swartz
```
## 重新启动已经停止的容器
sudo docker start [container_name|container_ID];
## 附着到一个容器上(连接到容器的shell)
sudo docker attach [container_name|container_ID];
## 建立守护式容器
docker run --name container_name -d centos /bin/sh -c "while true;do echo hello world;sleep 1;done;"
-d 放入后台运行;
-c 在容器里面执行命令;
## 查看容器日志
docker logs [-ft] container_name;
-f 输出最后几条日志;
-t 在每条日志前显示时间;
## 查看容器内进程
docker top container_name;
## 在docker内部启动新进程
docker exec -d daemon_dave touch /etc/new_config_file　＃直接执行命令
docker exec -t -i daemon_dave /bin/bash #进入容器,再自己去执行命令
## 停止容器
docker stop [container_name|container_ID];
## 容器被关闭时自动重启
docker run --restart=always --name daemon_dave -d centos /bin/sh -c "..."
--restart=on-failure:5 退出代码非０时才重启,重启次数为５次
## 查看容器的详细状态
docker inspect container_name;
## 删除一个容器
docker rm container_name;
## 删除所有容器
docker rm \`docker ps -a -q\`
# 镜像
## 列出镜像
docker images;
## 构建自己的镜像:DockerFile
### Docker Hub(类似于Git Hub的平台)注册账号
### 登录Docker Hub
docker login;
```
[root@iZ252e1zy6zZ ~]# docker login
Username: codekissyoung
Password:
Email: cky951010@163.com
WARNING: login credentials saved in /root/.docker/config.json
Login Succeeded
```
### 通过commit创建自己的镜像
docker commit container_ID codekissyoung/daemon_dave;
docker commit -m"提交信息：msg" --author="codekissyoung" container_ID codekissyoung/image_name:image_tag;
### 通过Dockerfile创建镜像
docker build -t="codekissyoung/static_web:v1" ./
docker build -t="codekissyoung/static_web:v2" git@github.com:codekissyoung/docker_web
* 假设这个git仓库下有Dockerfile文件
### 单步调试Dockerfile
docker run -t -i step_return_id /bin/bash;
* 通过每步返回的step_id进入容器,调试正确后,退出修改Dockerfile
### 取消构建缓存
docker build --no-cache -t="codekissyoung/static_web"
* build会缓存之前成功的步骤,如果不需要可以去除
### 查看一个镜像的构建历史
docker history image_id;
### 从一个新创建的镜像构建容器
docker run -d -p 80 --name=nginx2 codekissyoung/nginx:v1 nginx -g "daemon off;";
### 查看容器的80端口映射到本地哪个端口
docker port container_name 80;
```
[root@iZ252e1zy6zZ static_web]# docker port ddeed87650a3 80;
0.0.0.0:32773
```
### 访问docker容器
curl localhost:32773
```
[root@iZ252e1zy6zZ static_web]# curl localhost:32773
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```
### 将镜像发布到Docker　Hub上
docker push codekissyoung/nginx:v1;

#在测试中使用docker
#Docker vs Rocket
* Docker 是封闭的,标准是由Docker公司来定的
* Rocket 是开放的,各个组织可以参与制定标准
