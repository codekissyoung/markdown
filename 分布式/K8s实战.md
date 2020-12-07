# Kubernetes in Action

## 1. 介绍

原先一个单体应用内部的多个组件，被独立出来，单独作为一个进程运行，提供服务。服务之间通过定义良好的接口`API`通信。

![](https://img.codekissyoung.com/2019/12/11/f345515efeb79c031427d85ac8a2414a.png)

微服务之间通信协议:

- `HTTP` 同步通信协议
- `AMQP` 异步通信协议，高级消息队列协议

