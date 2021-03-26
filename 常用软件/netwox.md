# netwox

https://sourceforge.net/projects/ntwox/

```bash
$ sudo apt-get install netwox
```

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

数据链路层是OSI七层网络模型中的第2层，介于物理层与网络层之间，用来为网络层提供数据传送服务。它定义了数据传输的起始位置，并且通过一些规则来控制这些数据的传输，以保证数据传输的正确性。由于数据链路层完成以上两个独立的任务，所以相应地划分为两个子层，其含义如下：

- 介质访问控制（Media Access Control, MAC）：提供与网络适配器连接的接口。实际上，网络适配器驱动程序通常被称为MAC驱动，而网卡在工厂固化的硬件地址通常被称为MAC地址。

- 逻辑链路控制（Logical Link Control, LLC）：这个子层对经过子网传递的帧进行错误检查，并且管理子网上通信设备之间的链路。


网络体系主要分为4大类型:

- IEEE 802.3（以太网）：在大多数办公室和家庭中使用的基于线缆的网络，就是常见的有线局域网
- IEEE 802.11（无线网络）：在办公室、家庭和咖啡厅使用的无线网络技术，如Wi-Fi网络
- IEEE 802.16（WiMAX）：用于移动通信长距离无线连接的技术
- 点到点协议（PPP）：使用Modem通过电话线进行连接的技术，如通过拨号方式建立的网络连接

MAC地址拥有自己的格式。它采用十六进制数表示，共6个字节（48位），长度为48bit。

- 前24位称为组织唯一标识符（Organizationally Unique Identifier, OUI），是由IEEE注册管理机构给不同厂家分配的代码，区分了不同的厂家。
- 后24位是由厂家自己分配的，称为扩展标识符。同一个厂家生产的网卡中MAC地址后24位是不同的。

```bash
$ netwox 5 192.168.31.124  # 显示网络主机MAC地址信息
192.168.31.124	04:D4:C4:EC:C0:80

$ netwox 5 192.168.31.0/24 -u # 局域网中所有主机的MAC地址 -u显示进度
192.168.31.1	8C:53:C3:80:18:AD
192.168.31.20	00:00:00:00:00:00
192.168.31.124	04:D4:C4:EC:C0:80

$ netwox 4 8C:53:C3:80:18:AD  # 根据mac地址，显示该主机相关信息
IP address:  192.168.31.1
Hostname:    _gateway
Hostnames:   _gateway
```

构建一个Eth帧:

```bash
$ sudo netwox 32                                          
Ethernet________________________________________________________.
| 04:D4:C4:EC:C0:80->00:08:09:0A:0B:0C type:0x0000              |
|_______________________________________________________________|
# 指定地址 -a 源Mac地址 -b 目标Mac地址
$ sudo netwox 32 -a 04:D4:C4:EC:C0:80 -b 01:02:03:04:05:06
Ethernet________________________________________________________.
| 04:D4:C4:EC:C0:80->01:02:03:04:05:06 type:0x0000              |
|_______________________________________________________________|
```

每次发包，都修改Mac地址的工具:

```bash
$ sudo apt-get install macchanger      
```

### 泛洪攻击

```bash
$ sudo netwox 75
```

![image-20210323230202107](https://img.codekissyoung.com/2021/03/23/bc63b8e89b0e067ea42267323071a05a.png)





```bash
################################### Devices ###################################
# dev 设备接口名称的简单形式
# ethernet_hwtype 以太网地址或硬件类型
# real_device_name 设备接口名称的真正形式
nu dev   ethernet_hwtype   mtu   real_device_name
1  Lo0   loopback          65536 lo
2  Eth0  04:D4:C4:EC:C0:80 1500  enp4s0
3  Eth1  52:54:00:1D:C6:AC 1500  virbr0
4  Eth2  52:54:00:1D:C6:AC 1500  virbr0-nic
5  Eth3  0A:00:27:00:00:00 1500  vboxnet0
6  Eth4  00:00:00:00:00:00 1500  kvmbr0
##################################### IP ######################################
# nu 与此地址关联的设备编号
# ppp 点对点的地址
# point_to_point_with 远程端点的地址
nu ip             /netmask                    ppp point_to_point_with
1  127.0.0.1      /255.0.0.0                  0
2  192.168.31.124 /255.255.255.0              0
2  fe80::6d4:c4ff:feec:c080/64                0
6  192.168.31.20  /255.255.255.0              0
############################## ArpCache/Neighbor #############################
# IP4 ARP缓存或IP6邻居信息如下
# ethernet 计算机的以太网地址
nu ethernet          ip
2  04:D4:C4:EC:C0:80 192.168.31.124
2  04:D4:C4:EC:C0:80 fe80::6d4:c4ff:feec:c080
2  8C:53:C3:80:18:AD 192.168.31.1
2  8C:53:C3:80:18:AD fe80::8e53:c3ff:fe80:18ad
6  00:00:00:00:00:00 192.168.31.20
#################################### Routes ###################################
# 显示路由信息如下
# metric 路线度量
nu destination    /netmask         source              gateway           metric
1  127.0.0.1      /255.255.255.255 local                                      0
2  192.168.31.124 /255.255.255.255 local                                      0
6  192.168.31.20  /255.255.255.255 local                                      0
2  192.168.31.0   /255.255.255.0   192.168.31.124                           100
6  192.168.31.0   /255.255.255.0   192.168.31.20                            425
1  127.0.0.0      /255.0.0.0       127.0.0.1                                  0
2  0.0.0.0        /0.0.0.0         192.168.31.124      192.168.31.1         100
6  0.0.0.0        /0.0.0.0         192.168.31.20       192.168.31.1         20425
2  fe80::6d4:c4ff:feec:c080/128    local                                      0
2  fe80::/64                       fe80::6d4:c4ff:feec:c080                   0

```



```bash
$ netwox 2 # netwox 1 包含调试信息的输出
```





```bash
# 探测局域网中所有主机的IP地址、主机名和MAC地址信息
$ sudo netwox 3 -a 192.168.13.0/24
IP address:  192.168.13.1
Hostname:    _gateway
Hostnames:   _gateway
Eth address: D0:76:E7:6E:A8:CD

IP address:  192.168.13.7
Hostname:    unresolved
Hostnames:   unresolved
Eth address: 1C:A0:B8:7A:C2:C4
...

$ sudo netwox 3 -a blog.codekissyoung.com
IP address:  101.200.144.41
Hostname:    unresolved
Hostnames:   unresolved
Eth address: unresolved
```







