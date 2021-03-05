# LinkPC网络



电信 Router : 192.168.1.1 (网关)

小米 Router : 192.168.31.1 (网关)

```
本机 : 
IP :      191.168.31.124/24 ( enp4s0 有线网卡IP )
Gateway : 192.168.31.1
DNS IP :  
hostname : ckp-pc
```



查看本机网关 Gateway ：

```bash
# 查看本机网关的方法
$ route -n # 以0.0.0.0开始的行的Gateway是默认网关      
目标            网关            子网掩码        标志  跃点   引用  使用 接口
0.0.0.0         192.168.31.1    0.0.0.0         UG    100    0        0 enp4s0
169.254.0.0     0.0.0.0         255.255.0.0     U     1000   0        0 enp4s0
192.168.31.0    0.0.0.0         255.255.255.0   U     100    0        0 enp4s0

$ ip route show
default via 192.168.31.1 dev enp4s0 proto static metric 100 
169.254.0.0/16 dev enp4s0 scope link metric 1000 
192.168.31.0/24 dev enp4s0 proto kernel scope link src 192.168.31.124 metric 100 

$ netstat -rn  # 以0.0.0.0开始的行的Gateway是默认网关
Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
0.0.0.0         192.168.31.1    0.0.0.0         UG        0 0          0 enp4s0
169.254.0.0     0.0.0.0         255.255.0.0     U         0 0          0 enp4s0
192.168.31.0    0.0.0.0         255.255.255.0   U         0 0          0 enp4s0

$ traceroute www.baidu.com       
traceroute to www.baidu.com (14.215.177.38), 30 hops max, 60 byte packets
 1  _gateway (192.168.31.1)  0.389 ms  0.460 ms  0.524 ms
 2  192.168.1.1 (192.168.1.1)  0.792 ms  1.669 ms  0.974 ms

$ vim /etc/network/interfaces   # Debian/Ubuntu Linux
$ vim /etc/sysconfig/network-scripts/ifcfg-eth0 # Redhat
```

查看本机 DNS Ip

```bash
$ cat /etc/resolv.conf 
# Run "systemd-resolve --status" to see details about the uplink DNS servers currently in use.

# Third party programs must not access this file directly, but only through the
# symlink at /etc/resolv.conf. To manage man:resolv.conf(5) in a different way,
# replace this symlink by a static file or a different symlink.
#
# See man:systemd-resolved.service(8) for details about the supported modes of
# operation for /etc/resolv.conf.

nameserver 119.29.29.29
options edns0
```





配置一台Server只需要设置下面的几个参数 :

```bash
IP
NetMask
Gateway
DNS IP
hostname
```









```bash
$ sudo dmesg | grep -in eth # 确认内核加载了网卡
665:[    1.115165] r8169 0000:04:00.0 eth0: RTL8168h/8111h, 04:d4:c4:ec:c0:80, XID 541, IRQ 127
666:[    1.115166] r8169 0000:04:00.0 eth0: jumbo features [frames: 9200 bytes, tx checksumming: ko]
667:[    1.115665] r8169 0000:04:00.0 enp4s0: renamed from eth0
921:[    4.684383] Bluetooth: BNEP (Ethernet Emulation) ver 1.3

$ sudo lspci | grep -i ethernet # 列出网卡设备的信息
04:00.0 Ethernet controller: Realtek Semiconductor Co., Ltd. RTL8111/8168/8411 PCI Express Gigabit Ethernet 

$ sudo ifconfig enp4s0 192.168.32.10 # 给网卡设置一个Ip
```



```bash
/etc/services    # 协议名 （HTTP FTP SSH） 与　默认端口对应表
/etc/protocols   # IP 数据包协议相关定义数据
/etc/resolv.conf # DNS IP地址
```





