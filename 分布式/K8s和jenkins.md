# Docker 和 jenkins

```bash
$ kubectl run hello-node --image=hello-node:v1 --port=8080  # 用 hello-node 镜像启动 Pod
$ kubectl get events                                        # 查看 集群 events
$ kubectl config view                                       # 查看 kubectl 配置
```

默认情况`Pod`只能通过`Kubernetes`群集内部 IP 访问。要使`hello-node`容器从`Kubernetes`外部访问，须要使用`Kubernetes Service`暴露`Pod`

```bash
$ kubectl expose deployment hello-node --type=LoadBalancer  # 将 Pod 暴露到外部环境
$ kubectl get services                                      # 查看暴露的 service
NAME         TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
hello-node   LoadBalancer   10.106.4.218   <pending>     8080:32100/TCP   2m17s
kubernetes   ClusterIP      10.96.0.1      <none>        443/TCP          41m
$ minikube service hello-node
| default   | hello-node |             | http://192.168.99.101:32100 |
```

如果我们修改 `server.js` 代码，并且想要在集群里更新部署。操作如下：

```bash
$ vim server.js                                 # 修改 js 代码
$ docker build -t hello-node:v2 .               # 重新制作镜像
$ kubectl set image deployment/hello-node hello-node=hello-node:v2  # 更新部署
$ minikube service hello-node
|-----------|------------|-------------|-----------------------------|
| NAMESPACE |    NAME    | TARGET PORT |             URL             |
|-----------|------------|-------------|-----------------------------|
| default   | hello-node |             | http://192.168.99.101:32100 |
|-----------|------------|-------------|-----------------------------|
Opening service default/hello-node in default browser...
```

清理在集群中创建的资源:

```bash
$ kubectl delete service hello-node
$ kubectl delete deployment hello-node
```
