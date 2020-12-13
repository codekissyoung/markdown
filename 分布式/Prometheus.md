# Prometheus

监控系统`Prometheus`的相关知识。

[使用 prometheus_client_php 为 Prometheus 提供数据](https://blog.csdn.net/JackLiu16/article/details/80381210)
[使用 prometheus_client_php 对接 prometheus 监控系统](https://16bh.github.io/2017/07/25/prometheus-on-php/)
[Prometheus 简单使用及 exporter 开发，使用 prometheus_client_php](https://segmentfault.com/a/1190000021314370)
[使用 Prometheus 针对自己的服务器采集自定义的参数](https://segmentfault.com/a/1190000021164508?utm_source=tag-newest)
[从零搭建 Prometheus 监控报警系统 PushGateWay 方式](https://www.cnblogs.com/chenqionghe/p/10494868.html)

## 安装

```bash
$ sudo apt-get install prometheus
$ prometheus --version
```

## 数据类型

**metric** 指标：由`(metric-name, lable sets)`组成，`metric-name`表示指标含义，`lable sets`细化分类，格式如下：

```bash
<metric name>{<label name>=<label value>, ...}

api_http_requests_total{method="POST", handler="/messages"} 
http_request_status{code='200',content_path='/api/path', environment='produment'} 23
http_request_status{code='200',content_path='/api/path2', environment='produment'} 34
```

一个指标，就代表了一个时间序列。

时间序列中的每一个点称为一个**样本**`sample`。

样本由`(metric, timestamp, value)`组成，其中`timestamp`精确到毫秒，`Value`范围为`folat64`。

## 指标类型

`Prometheus Server` 中并没有 “指标类型” 的概念，所有的这些指标统一视为无类型的时间序列。

**指标类型**是由各个`Prometheus Client`提出来区分的。

#### Counter 计数器类型

特征：`Value` 大小只增不减

可用的`GO Client API`参考:

```go
Inc()           // 将 counter 值加1.
Add(float64)    // 将指定值加到 counter 值上，如果指定值 < 0 会 panic.
```

可用的`PromQL`参考:

```go
rate(http_requests_total[5m])   // 通过 rate() 函数获取 HTTP 请求量的增长率
topk(10, http_requests_total)   // 查询当前系统中，访问量前10的HTTP地址
```

#### Guage 仪表盘类型

特征：`Value`可以任意变化，通常用于像温度或者内存使用率这种指标数据

可用的`PromQL`参考:

```go
dalta(cpu_temp_celsius{host="zeus"}[2h]) // 计算 CPU 温度在两小时内的差异

// 基于简单线性回归的方式，对样本数据的变化趋势做出预测
// 基于 2 小时的样本数据，来预测主机可用磁盘空间在 4 个小时之后的剩余情况
predict_linear(node_filesystem_free{job="node"}[2h], 4 * 3600) < 0
```

#### Summary 摘要类型

```go
// 含义：这 12 次 http 请求中有 50% 的请求响应时间是 3.052404983s
http_requests_latency_seconds_summary{path="/",method="GET",code="200",quantile="0.5",} 3.052404983
// 含义：这 12 次 http 请求中有 90% 的请求响应时间是 8.003261666s
http_requests_latency_seconds_summary{path="/",method="GET",code="200",quantile="0.9",} 8.003261666
// 含义：这12次 http 请求的总响应时间为 51.029495508s
http_requests_latency_seconds_summary_sum{path="/",method="GET",code="200",} 51.029495508
// 含义：当前一共发生了 12 次 http 请求
http_requests_latency_seconds_summary_count{path="/",method="GET",code="200",} 12.0
```

#### Histogram 直方图类型

特征：关注`Value`的分布情况

以`API`接口的响应时间为例，希望知道

`0~10ms` `10~20ms` `20~30ms` `30~40ms` `40~50ms` 之间响应的请求数，这样就可以知道系统是平均的慢还是极个别请求的慢。

```go
// 在总共2次请求当中。http 请求响应时间 <=0.005 秒 的请求次数为0
http_requests_latency_seconds_histogram_bucket{path="/",method="GET",code="200",le="0.005",} 0.0
// 在总共2次请求当中。http 请求响应时间 <=0.01 秒 的请求次数为0
http_requests_latency_seconds_histogram_bucket{path="/",method="GET",code="200",le="0.01",} 0.0
// 在总共2次请求当中。http 请求响应时间 <=0.025 秒 的请求次数为0
http_requests_latency_seconds_histogram_bucket{path="/",method="GET",code="200",le="0.025",} 0.0
http_requests_latency_seconds_histogram_bucket{path="/",method="GET",code="200",le="0.05",} 0.0
http_requests_latency_seconds_histogram_bucket{path="/",method="GET",code="200",le="0.075",} 0.0
http_requests_latency_seconds_histogram_bucket{path="/",method="GET",code="200",le="0.1",} 0.0
http_requests_latency_seconds_histogram_bucket{path="/",method="GET",code="200",le="0.25",} 0.0
http_requests_latency_seconds_histogram_bucket{path="/",method="GET",code="200",le="0.5",} 0.0
http_requests_latency_seconds_histogram_bucket{path="/",method="GET",code="200",le="0.75",} 0.0
http_requests_latency_seconds_histogram_bucket{path="/",method="GET",code="200",le="1.0",} 0.0
http_requests_latency_seconds_histogram_bucket{path="/",method="GET",code="200",le="2.5",} 0.0
http_requests_latency_seconds_histogram_bucket{path="/",method="GET",code="200",le="5.0",} 0.0
http_requests_latency_seconds_histogram_bucket{path="/",method="GET",code="200",le="7.5",} 2.0
// 在总共2次请求当中。http 请求响应时间 <=10 秒 的请求次数为 2
http_requests_latency_seconds_histogram_bucket{path="/",method="GET",code="200",le="10.0",} 2.0
http_requests_latency_seconds_histogram_bucket{path="/",method="GET",code="200",le="+Inf",} 2.0
// 实际含义： 发生的2次 http 请求总的响应时间为 13.107670803000001 秒
http_requests_latency_seconds_histogram_sum{path="/",method="GET",code="200",} 13.1076708
// 实际含义： 当前一共发生了 2 次 http 请求
http_requests_latency_seconds_histogram_count{path="/",method="GET",code="200",} 2.0
```

总结一下，实际上一个确定的`metric`它就是一个时间序列：

- 如果这时间序列是一直递增的，那就是`counter`
- 如果有增有减，那就是`Guage`
- 如果关注一个大概的情况，比如总数、大部分统计到的`Value`的平均值是多少？那就用`PromQL`算这个时间序列的`Summary`
- 如果关注的是一个它的所有`Value`值的一个直方分布图，那也用`PromQL`去查询，算这个时间序列的`Histogram`

纯粹是`Client`为了根据不同的目的查询，区分出来的 “指标类型”。

## PromQL

### 匹配标签

#### 完全匹配

```bash
http_requests_total{instance="localhost:9090"}  # 完全匹配 
http_requests_total{instance!="localhost:80"}   # 完全排除
```

#### 正则匹配

```bash
http_requests_total{environment=~"staging|testing|development"} # 正则匹配
http_requests_total{environment!~"product"}                     # 正则排除
```

### 函数

```bash
sum(http_requests_total)      # 求多个时间序列的瞬时和
avg(http_requests_total)      # 求多个时间序列的平均值
rate(http_requests_total[5m]) # 求增长率
topk(10, http_requests_total) # 访问量前 10 的 HTTP 地址
delta(cpu_temp_celsius[2h])   # delta = value_now - value_2_hour_ago
predict_linear(node_filesystem_free{mountpoint="/"}[1h],4 * 3600) # 磁盘在4 hour之后的剩余
```

### 分组聚合计算

```bash
# 按照主机查询各个主机的CPU使用率
sum(sum(irate(node_cpu{mode!='idle'}[5m]))  / sum(irate(node_cpu[5m]))) by (instance)
```
