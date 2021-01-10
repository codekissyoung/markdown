# Kubernetes in Action

Cluster：计算、存储、网络资源集合

Master：Cluster的大脑，负责调度，管理Node

Node：负责管理容器的生命周期，监控并且上报容器状态

Pod: 最小工作单元，每个Pod包含1~N个容器，作为一个整体被调度到一个Node上运行。所有容器共用一个网络namespace，即相同的IP和Port空间，可以使用localhost通信，共享存储。挂载Volume到Pod，等于挂载到Pod中每一个容器。

Controller：管理Pod的生命周期，定义了Pod的部署特性，类型有:

- Deployment : 管理Pod的多个副本
- ReplicaSet : 实现了Pod的多副本管理，自动被Deployment使用，所以通常也不需要手动直接使用
- DaemonSet: 用于每个Node最多只运行一个Pod的场景
- StatefuleSet: 保证Pod每个副本，在整个生命周期中，名称是不变的
- Job: 用于运行结束就删除的应用

Service: 管理Pod的访问。定义了外界访问一组特定Pod的方式。Service有自己的IP和端口，为Pod提供负载均衡

Namespace: 将一个物理的Cluster划分为逻辑上的多个Cluster，不同的逻辑Cluster，资源是完全隔离的

```bash
$ kubectl get namespace
$ kubectl cluster-info # 查看集群的信息
$ minikube ssh 					 # 进入 master node
$ kubectl get nodes    # 列出集群节点
$ kubectl get services # 列出Services
NAME       STATUS   ROLES                  AGE   VERSION
minikube   Ready    control-plane,master   17m   v1.20.0
$ kubectl describe node minikube # 打印节点的状态 CPU 和内存数据系统数据、系统信息、运行容器　
$ minikube docker-env
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://192.168.99.100:2376"
export DOCKER_CERT_PATH="/home/cky/.minikube/certs"
export MINIKUBE_ACTIVE_DOCKERD="minikube"
```



![](https://img.codekissyoung.com/2021/01/08/8b15efec8824c13d07f0629380fb701e.png)

![](https://img.codekissyoung.com/2021/01/10/5790a9ee7f4d349e40aa5e164abe6184.png)

```
$ minikube start                                                                                    
😄  Ubuntu 18.04 上的 minikube v1.16.0
✨  Automatically selected the docker driver. Other choices: virtualbox, none
👍  Starting control plane node minikube in cluster minikube
🚜  Pulling base image ...
❗  minikube was unable to download gcr.io/k8s-minikube/kicbase:v0.0.15-snapshot4, but successfully downloaded kicbase/stable:v0.0.15-snapshot4 as a fallback image
🔥  Creating docker container (CPUs=2, Memory=8000MB) ...
❗  This container is having trouble accessing https://k8s.gcr.io
💡  To pull new external images, you may need to configure a proxy: https://minikube.sigs.k8s.io/docs/reference/networking/proxy/
🐳  正在 Docker 20.10.0 中准备 Kubernetes v1.20.0…
    ▪ Generating certificates and keys ...
    ▪ Booting up control plane ...
    ▪ Configuring RBAC rules ...
🔎  Verifying Kubernetes components...
🌟  Enabled addons: storage-provisioner, default-storageclass
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```







