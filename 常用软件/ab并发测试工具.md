# ab 并发测试工具

## 命令格式

```bash
$ ab -n 10 -c 10 http://www.baidu.com/
-V              查看ab版本
-k              Use HTTP KeepAlive feature
-d              Do not show percentiles served table.
-S              Do not show confidence estimators and warnings.
-g filename     Output collected data to gnuplot format file.
-e filename     Output CSV file with percentages served
```

## 参数

```bash
-n requests     全部请求数
-c concurrency  并发数
-t timelimit    最传等待回应时间
-p postfile     POST数据文件
-T content-type POST Content-type
-v verbosity    How much troubleshooting info to print
-w              Print out results in HTML tables
-i              Use HEAD instead of GET
-x attributes   String to insert as table attributes
-y attributes   String to insert as tr attributes
-z attributes   String to insert as td or th attributes
-C attribute    加入cookie, eg. Apache=1234. (repeatable)
-H attribute    加入http头, eg. Accept-Encoding: gzip
                Inserted after all normal header lines. (repeatable)
-A attribute    http验证,分隔传递用户名及密码
-P attribute    Add Basic Proxy Authentication, the attributes
                are a colon separated username and password.
```

## 返回参数解读

```bash
Benchmarking www.jb51.net (be patient)…..done
Server Software:        Microsoft-IIS/6.0
Server Hostname:        www.jb51.net
Server Port:            80
Document Path:          /
Document Length:        32639 bytes     # 文档大小
Concurrency Level:      10              # 并发数
Time taken for tests:   13.548 seconds  # 整个测试持续的时间
Complete requests:      10              # 完成的请求数量
Failed requests:        0               # 失败的请求数量
Write errors:           0
Total transferred:      331070 bytes    # 整个场景中的网络传输量
HTML transferred:       326390 bytes    # 整个场景中的HTML内容传输量
```

```bash
Requests per second:    0.74 [#/sec] (mean)      # 每秒事务数 mean 表示这是一个平均值
Time per request:       13547.775 [ms] (mean)    # 平均事务响应时间
Time per request:       1354.777 [ms] (mean ...) # 每个请求实际运行时间的平均值

# 由于对于并发请求，cpu实际上并不是同时处理的，而是按照每个请求获得的时间片逐个轮转处理的
# 所以基本上第一个Time per request时间约等于第二个Time per request时间乘以并发请求数

# 平均每秒网络上的流量，可以帮助排除是否存在网络流量过大导致响应时间延长的问题
Transfer rate:          23.86 [Kbytes/sec] received

Connection Times (ms)  # 网络上消耗的时间的分解
              min  mean[+/-sd] median   max
Connect:        1    2   0.8      2       3
Processing:  2163 3981 3420.2   2957   13540
Waiting:     1305 3204 3595.3   2096   13169
Total:       2164 3983 3420.0   2959   13541

Percentage of the requests served within a certain time (ms)
  50%   2959 # 50％的用户响应时间小于2959毫秒
  66%   3074 # 66％ 的用户响应时间小于3074毫秒
  75%   3974
  80%   4008
  90%  13541
  95%  13541
  98%  13541
  99%  13541
 100%  13541 # 最大的响应时间小于13541 毫秒
```
