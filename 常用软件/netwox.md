# netwox



https://sourceforge.net/projects/ntwox/

## 概述

安装完后文档位置：/usr/local/doc/netw539/netwox-doc_html/html/examples.html

```bash
$ netwox    
Netwox toolbox version 5.39.0. Netwib library version 5.39.0.
######################## MAIN MENU #########################
 0 - leave netwox 退出netwox工具
 3 - search tools 搜索工具，用来搜索与指定信息相关的模块
 4 - display help of one tool 显示指定模块的帮助信息
 5 - run a tool selecting parameters on command line 在命令行中输入指定模块的参数选项并运行
 6 - run a tool selecting parameters from keyboard 从键盘输入指定模块的参数选项并运行
 a + information 显示信息
 b + network protocol 显示网络协议下相关的模块
 c + application protocol 显示应用程序协议下相关的模块
 d + sniff (capture network packets) 显示与嗅探数据包相关的模块
 e + spoof (create and send packets) 显示与创建和发送数据包相关的模块
 f + record (file containing captured packets) 显示与进行数据包记录相关的模块
 g + client 显示与客户端相关的模块
 h + server 显示与服务器相关的模块
 i + ping (check if a computer if reachable) 显示与检测主机连通性相关的模块
 j + traceroute (obtain list of gateways) 显示与路由跟踪相关的模块
 k + scan (computer and port discovery) 显示与扫描计算机和端口相关的模块
 l + network audit 显示与审计相关的模块
 m + brute force (check if passwords are weak)　显示与暴力破解相关的模块
 n + remote administration　显示与远程管理相关的模块
```



显示网络适配器信息

```bash
$ netwox 169
Lo0 127.0.0.1 notether # Lo表示回环接口，它是虚拟网络适配器
Eth0 192.168.31.124 04:D4:C4:EC:C0:80 # Eth为以太网网络适配器
Eth0 fe80::6d4:c4ff:feec:c080 04:D4:C4:EC:C0:80 # 支持Ipv6的以太网网络适配器
Eth4 192.168.31.20 00:00:00:00:00:00 # 另一个Eth网络适配器
```

