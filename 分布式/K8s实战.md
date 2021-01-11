# Kubernetes in Action

## minikube

https://minikube.sigs.k8s.io/docs/start/

首先需要配置好代理，特别注意的是，代理的地址不能是`localhost`和`127.0.0.1`，保证minikube和它启动的VM内部都能够访问外网．

```
❗  minikube was unable to download gcr.io/k8s-minikube/kicbase:v0.0.15-snapshot4, but successfully downloaded kicbase/stable:v0.0.15-snapshot4 as a fallback image
❗  This container is having trouble accessing https://k8s.gcr.io
```



```bash
export HTTP_PROXY="http://192.168.13.8:1081"
export HTTPS_PROXY="http://192.168.13.8:1081"
export NO_PROXY=localhost,127.0.0.1,10.96.0.0/12,192.168.99.0/24,192.168.39.0/24
```



```bash
$ minikube start --driver=virtualbox
$ minikube dashboard  # 开启仪表盘
$ minikube addons list # 查看开启的插件
$ minikube pause # Pause Kubernetes without impacting deployed applications
$ minikube stop # Halt the cluster:
$ minikube delete --all # Delete all of the minikube clusters

$ kubectl cluster-info  # 查看集群的信息                                     
Kubernetes control plane is running at https://192.168.99.102:8443
KubeDNS is running at https://192.168.99.102:8443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
$ kubectl get node # 查看节点
$ kubectl get namespace # 查看所有的namespace
$ kubectl cluster-info 
$ minikube ssh # 进入 master node
```



```bash
$ kubectl get pods -A # 获取所有的pods
$ kubectl create deployment hello-minikube --image=k8s.gcr.io/echoserver:1.4 # 部署一个pod
$ kubectl expose deployment hello-minikube --type=NodePort --port=8080 # 暴露到外部
$ kubectl get service # 查看所有服务，以及访问方式
NAME             TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
hello-minikube   NodePort       10.103.115.44    <none>        8080:31837/TCP   69m
$ minikube service hello-minikube # 获取 外部IP:Port 访问方式
|-----------|----------------|-------------|-----------------------------|
| NAMESPACE |      NAME      | TARGET PORT |             URL             |
|-----------|----------------|-------------|-----------------------------|
| default   | hello-minikube |        8080 | http://192.168.99.102:31837 |
$ minikube service list # 查看所有服务，以及访问方式
|----------------------|---------------------------|--------------|-----------------------------|
|      NAMESPACE       |           NAME            | TARGET PORT  |             URL             |
|----------------------|---------------------------|--------------|-----------------------------|
| default              | hello-minikube            |         8080 | http://192.168.99.102:31837 |
# 或者通过绑定到HOST本地端口，也可以访问到 Pods
$ kubectl port-forward service/hello-minikube 7080:8080 
```

Pod的创建和删除是非常频繁的，所以不能将它直接提供给用户，所以设计了Service（创建好后，Ip是固定的），请求到达Service后，Service确保转发给它后面的某个Pod.

```bash
$ kubectl get pods -o wide # 查看所有 pod 详情
NAME                              READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES
hello-minikube-6ddfcc9757-bfmnj   1/1     Running   0          93m   172.17.0.5   minikube   <none>           <none>
$ kubectl describe pod hello-minikube-6ddfcc9757-bfmnj # 查看某个pod的详情
```

## Pod

Pod里的容器，有哪些东西是相同的？



Cluster：计算、存储、网络资源集合

Master：Cluster的大脑，负责调度，管理Node

Node：负责管理容器的生命周期，监控并且上报容器状态

Pod: 最小工作单元，每个Pod包含1~N个容器，作为一个整体被调度到一个Node上运行。所有容器共用一个网络namespace，即相同的IP和Port空间，可以使用localhost通信，共享存储。挂载Volume到Pod，等于挂载到Pod中每一个容器。

Controller：管理Pod的生命周期，定义了Pod的部署特性，类型有:

- ReplicaSet : 实现了Pod的多副本管理，自动被Deployment使用，所以通常也不需要手动直接使用

- Deployment : 管理Pod的多个副本
- DaemonSet: 用于每个Node最多只运行一个Pod的场景
- StatefuleSet: 保证Pod每个副本，在整个生命周期中，名称是不变的
- Job: 用于运行结束就删除的应用


Ingresses : 提供一种负载均衡方法，用于将群集外部的访问，负载到群集内部相应目的 Pod。一个外部的 Ingresses 入口可以导向许多不同的内部服务。

Service : 管理Pod的访问。定义了外界访问一组特定Pod的方式。Service有自己的IP和端口，为Pod提供负载均衡

Namespace : 将一个物理的Cluster划分为逻辑上的多个Cluster，不同的逻辑Cluster，资源是完全隔离的

Secrets : 用于存储非公共信息，如令牌、证书或密码。Secrets 可以在运行时附加到 Pods，以便将敏感的配置数据可以安全地存储在集群中。

CronJobs：提供了一种调度pod执行的方法。它们非常适合定期运行备份、报告和自动化测试等任务。

CustomResourceDefinitions：简称 CRD 它提供了一种扩展机制，集群的操作人员和开发人员可以使用它来创建自己的资源类型。

```bash
$ minikube docker-env
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://192.168.99.100:2376"
export DOCKER_CERT_PATH="/home/cky/.minikube/certs"
export MINIKUBE_ACTIVE_DOCKERD="minikube"
```



![](https://img.codekissyoung.com/2021/01/08/8b15efec8824c13d07f0629380fb701e.png)

![](https://img.codekissyoung.com/2021/01/10/5790a9ee7f4d349e40aa5e164abe6184.png)



[「命令式」的前 Kubernetes 时代的分布式 VS 「声明式」的基于 Kubernetes 的云原生分布式](https://www.yuque.com/office/yuque/0/2020/xlsx/788484/1605013794417-32876a80-a758-4a0d-b5c0-253a364ae4f8.xlsx?from=https%3A%2F%2Fwww.yuque.com%2Fpolaris-docs%2Fcontainer%2Fk8s-basic-overview)



![image-20210111125256735](https://img.codekissyoung.com/2021/01/11/23e1f889f725b7383441e1b1b60195e9.png)







