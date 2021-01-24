# Kubernetes in Action

## 1. minikube

https://minikube.sigs.k8s.io/docs/start/

```bash
# 安装 kubectl
$ curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt   # kubectl 最新版本
$ curl -Lo kubectl https://storage.googleapis.com/kubernetes-release/release/v1.6.4/bin/linux/amd64/kubectl
$ chmod +x kubectl
$ kubectl version

# 安装 minikube
$ wget https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ chmod +x minikube-linux-amd64
$ sudo mv minikube-linux-amd64 /usr/local/bin/minikube
```

首先需要配置好代理，特别注意的是，代理的地址不能是`localhost`和`127.0.0.1`，保证minikube和它启动的VM内部都能够访问外网．`~/.kube/config` 是 Minikube 的配置文件。

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
$ minikube dashboard    # 开启仪表盘
$ minikube addons list 	# 查看开启的插件
$ minikube stop 					
$ minikube delete --all # Delete all of the minikube clusters
$ minikube ssh						　# 进入 master node
$ kubectl cluster-info  # 查看集群的信息                                     
$ kubectl get node 				# 查看节点
$ kubectl get ns        # 查看所有的namespace
$ kubectl get pods -A 		# 获取所有的pods
$ kubectl get pods -o wide # 查看所有 pod 详情
hello-minikube-6ddfcc9757-bfmnj   1/1     Running   0   93m   172.17.0.5   minikube   <none>  <none>
$ kubectl describe pod hello-minikube-6ddfcc9757-bfmnj # 查看某个pod的详情
```

```bash
$ kubectl create deployment hello-minikube --image=k8s.gcr.io/echoserver:1.4 # 部署一个pod
$ kubectl expose deployment hello-minikube --type=NodePort --port=8080 		    # 暴露到外部
```

Pod的创建和删除是非常频繁的，所以不能将它直接提供给用户，所以设计了Service（创建好后，Ip是固定的），请求到达Service后，Service确保转发给它后面的某个Pod.

```bash
$ kubectl get service # 查看所有服务，以及访问方式
NAME             TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
hello-minikube   NodePort       10.103.115.44    <none>        8080:31837/TCP   69m
$ minikube service hello-minikube # 获取 外部IP:Port 访问方式
| default   | hello-minikube |        8080 | http://192.168.99.102:31837 |
$ minikube service list 						 # 查看所有服务，以及访问方式
| default              | hello-minikube            |         8080 | http://192.168.99.102:31837 |
# 或者通过绑定到HOST本地端口，也可以访问到 Pods
$ kubectl port-forward service/hello-minikube 7080:8080 
```

## 2. Pod

Pod: 最小工作单元，每个Pod包含1~N个容器，作为一个整体被调度到一个Node上运行。所有容器共用一个网络namespace，即相同的IP和Port空间，可以使用localhost通信，共享存储。挂载Volume到Pod，等于挂载到Pod中每一个容器。

```bash
$ kubectl create -f kubia-manual.yaml 	# 通过文件创建Pod
$ kubectl get pods --show-labels 		# 列出所有Pod
$ kubectl logs -f kubia-manual -c kubia # 查看Pod的输出日志 -c 指定容器
$ kubectl port-forward kubia-manual 8888:8080 # 通过端口转发，直接映射到Pod中，方便调试
$ curl localhost:8888 # 等价于访问 PodIp:8080
$ kubectl delete pod kubia-manual # 按名称删除Pod
```

### label 标签

```bash
$ kubectl label pod kubia-manual create_method=manual # 给Pod加上标签，--overwrite 表示覆盖原有的 
$ kubectl get pod -l create_method=manual # 列出指定label=Value的Pod  
$ kubectl get pod -l env    # 列出指定label的Pod  
$ kubectl get pod -l '!env' # 列出没有env标签的的Pod, 语法有：env!=dev ; env in (pro,dev) ; env notin (pro,dev) 
$ kubectl delete pod -l create_method=manual # 删除符合标签的Pod
```

### namespace 命名空间

```dockerfile
apiVersion: v1
kind: Namespace
metadata:
  name: xys-dev
```

```bash
$ kubectl get pod -n xys-dev # 列出指定命名空间的Pods
$ kubectl create -f custom-namespace.yaml # 通过yaml创建命名空间
$ kubectl delete ns xys-dev # 删除整个命名空间
$ kubectl delete pod --all # 删除所有容器，但保留命名空间
$ kubectl delete all --all # 删除本命名空间下的所有资源
```

## 3. Controller

```bash
$ kubectl scale rc kubia-rc-example --replicas=4 # 扩容or缩容
```

- ReplicaSet : 实现了Pod的多副本管理，自动被Deployment使用，所以通常也不需要手动直接使用
- Deployment : 管理Pod的多个副本
- DaemonSet : 用于每个Node最多只运行一个Pod的场景,比如`kube-proxy`
- StatefuleSet : 保证Pod每个副本，在整个生命周期中，名称是不变的
- Job: 用于运行结束就删除的应用
- Ingresses : 提供一种负载均衡方法，用于将群集外部的访问，负载到群集内部相应目的 Pod。一个外部的 Ingresses 入口可以导向许多不同的内部服务。
- Service : 管理Pod的访问。定义了外界访问一组特定Pod的方式。Service有自己的IP和端口，为Pod提供负载均衡
- Namespace : 将一个物理的Cluster划分为逻辑上的多个Cluster，不同的逻辑Cluster，资源是完全隔离的
- Secrets : 用于存储非公共信息，如令牌、证书或密码。Secrets 可以在运行时附加到 Pods，以便将敏感的配置数据可以安全地存储在集群中。
- CronJobs：提供了一种调度pod执行的方法。它们非常适合定期运行备份、报告和自动化测试等任务。
- CustomResourceDefinitions：简称 CRD 它提供了一种扩展机制，集群的操作人员和开发人员可以使用它来创建自己的资源类型。

```bash
$ minikube docker-env
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://192.168.99.100:2376"
export DOCKER_CERT_PATH="/home/cky/.minikube/certs"
export MINIKUBE_ACTIVE_DOCKERD="minikube"
```

## ４． 服务

```bash
$ kubectl get service
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP          12h
kubia-service   ClusterIP   10.110.247.72   <none>        80/TCP,443/TCP   8h
# 在指定的Pod中执行指定的命令
$ kubectl exec kubia-rs-mzjz5 -- curl -s http://10.110.247.72
$ kubectl exec -it kubia-rs-ll75w -- bash # 在指定的Pod中运行bash
root@kubia-rs-ll75w:~# curl http://kubia-service # 访问服务
```

![image-20210124151356430](https://img.codekissyoung.com/2021/01/24/c021a04de9c9a6fd35daef8d009663fe.png)

### Ingress

通过一个IP地址，公开所有服务。

![image-20210125015634842](https://img.codekissyoung.com/2021/01/25/ddb332b486496ffd7ba8a4b329faf96e.png)



![image-20210125020038562](https://img.codekissyoung.com/2021/01/25/21fc3a777daa9733656f87c424bd5ddd.png)


![](https://img.codekissyoung.com/2021/01/08/8b15efec8824c13d07f0629380fb701e.png)

![](https://img.codekissyoung.com/2021/01/10/5790a9ee7f4d349e40aa5e164abe6184.png)



[「命令式」的前 Kubernetes 时代的分布式 VS 「声明式」的基于 Kubernetes 的云原生分布式](https://www.yuque.com/office/yuque/0/2020/xlsx/788484/1605013794417-32876a80-a758-4a0d-b5c0-253a364ae4f8.xlsx?from=https%3A%2F%2Fwww.yuque.com%2Fpolaris-docs%2Fcontainer%2Fk8s-basic-overview)



![image-20210111125256735](https://img.codekissyoung.com/2021/01/11/23e1f889f725b7383441e1b1b60195e9.png)







