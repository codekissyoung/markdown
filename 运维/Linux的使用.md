# Linux 的使用

本文是我使用`Linux`的总结，只涉及服务器日常命令操作，不涉及到开发和原理。

## ubuntu 增加 swap 空间  

#### 查看系统内 Swap 分区大小

```bash
free -mh
             total       used       free     shared    buffers     cached
Mem:          993M       677M       316M        44K        13M       375M
-/+ buffers/cache:       288M       705M
Swap:         2.4G       722M       1.7G
```

#### 创建一个 Swap 文件

```bash
sudo dd if=/dev/zero of=swapfile bs=1024 count=2000000  # 生成一个2G空字节文件
sudo mkswap -f swapfile                                 # 将这个文件转化为 swap文件
sudo swapon swapfile                                    # 启用这个swap文件
```

#### 卸载与配置

```bash
sudo swapoff swapfile      # 卸载这个 swap文件
```

如果想默认使用这个 swapfile 文件 ，则需修改`/etc/fstab`文件

```bash
/swap/swapfile /swap swap defaults 0 0
```

## 定时任务

五个`*`含义的口诀`分 时 日 月 周`，`*`代表“每”，`/`代表“隔”，`-`代表“范围”，`,` 代表离散集合。

```bash
30 21 * * * /usr/local/etc/rc.d/lighttpd restart       # 每天 21:30
45 4 1,10,22 * * /usr/local/etc/rc.d/lighttpd restart  # 每月的 1、10、22 号，在 4:45 分 执行
10 1 * * 6,0  /usr/local/etc/rc.d/lighttpd restart     # 每周六、周日，在 1:10 分执行
0,30 18-23 * * * /usr/local/etc/rc.d/lighttpd restart  # 每天的18:00-23:00，每隔30分钟执行
*/2 * * * * /home/cky/clear-log                        # 每隔 2 分钟,清理日志
```

## 字符匹配

```bash
* 代表任意字符串
？代表一个字符
[abcd...]代表从里面选字符
[1-9] [a-z] 表示范围
[!abcd] 代表除这些字符串之外
```

## 重定向

```bash
$ cp -R /usr /backup/usr.bak  2> /bak.error   错误输出重定
```

## 命令替换符

```
ls  -l  `which touch`  将 which touch 的输出作为 ls -l 的参数
```

## 压缩和解压

```bash
gzip    -d    文件：压缩为 .gz文件，不支持目录，不保留源文件，-d 为解压缩
bzip2  -k    文件：压缩为.bz2 文件，它的压缩比非常惊人，-k 会保留源文件。
bunzip2    .bz2文件：解压 .bz2 文件。
tar  -zxvf   aa.tar.gz   解压到当前文件夹
tar  -zcvf   aa.tar.gz  /etc/aa.txt   压缩文件，记得文件用全路径
zip  services.zip  /etc/services  压缩文件
zip  test.zip  /test  压缩目录 zip 是保留源文件的压缩。
uzip    压缩文件：解压文件；
```

## 文件权限

```bash
chmod  [-R]  777   /var/home/www 改变文件/目录权限 -R是递归
chown  caokaiyan   /var/home/www/aa.txt    改变文件所有者
chgrp  [-R]  admin /var/home/www/aa.txt    改变文件所有组
```

## 用户管理

```
useradd  caokaiyan  向系统添加一个用户
passwd   caokaiyan  给用户设定一个秘密
su  切换到root用户
sudo  普通用户使用root用户权限操作，一般在Debian系列linux才有
logout   注销登录
```

## 文件搜索

```
which  ls   定位到ls命令的绝对路径；提供 命令别名信息
whereis  ls 定位到ls命令的绝对路径；提供帮助文档信息
find  /etc  host    在/etc 里面查找名字带有 host 的文件
locate  host   基于linux内置文件数据库查找带有 host 名的文件，一般在找之前 updatedb 一下，更新内置数据库
file    文件：判断文件类型
```

## 网络通信命令

```bash
ping + ip地址/URL：发送数据包，看看能不能得到包的返回
ping 127.0.0.1(回环地址)：检测自己机器安装了tip/ip 协议 么
ping www.baidu.com    :发送 6000    block 大小的一个包，来测试网络连接时延
ifconfig -a    ：查看网卡信息
netstat -anp：监控网络状态，端口号，哪个进程监听的这个端口啊，等等！
traceroute  +域名/主机 IP ：追踪路由
route -n：显示本机路由表
```

## 查看硬盘分区情况

```bash
fdisk    -l    [/dev/had]硬盘分区情况
df    -h    硬盘分区的使用情况
du    -sh   /root    查看/root下所有目录大小
```

## linux 环境配置

```bash
Locale    查看当前语言环境
LANG=zh_CN.UTF-8   设置当前语言 ，LANG 是环境变量
可以使用配置环境变量，而不用去修改对应的配置文件
env    列出所有的环境变量
```

## 进程管理

```bash
ps aux 查看运行的所有进程
ps e
kill  8024  通过PID杀死进程
Kill  -9  8935   强制杀死进程
killall  8323   杀死它和它的子进程
top   实时监控进程
```

在单个 shell 登录终端如何进行多个任务

```bash
ctrl + z  # 将当前执行的程序放入后台,程序是暂停的
tail -f /var/log/apache.log &  # 直接放入后台,程序是执行的
jobs -l  # 查看当前的后台任务
fg # 恢复最近的一个后台任务到前台
fg %工作号 # 恢复指定后台任务到前台
/etc/rc.local # 自启动文件，每次启动终端都会执行这个文件里面的shell脚本
nohup 命令 &  # 后台命令脱离终端运行
```

`nobody` `adm` `ftp` 等系统预设用户是不分配密码和 shell 的 一般作为进程指定用户使用 比如 nginx 指定 nobody 为运行用户
`whoami` 当前用户
`useradd caokaiyan` 向系统添加一个用户
`passwd caokaiyan` 给用户设定一个秘密
`sudo + 命令` 普通用户使用 root 用户权限操作
`usermod -l newuser1 newuser` 修改 newuser 的用户名为 newuser1
`usermod -L newuser1` 锁定账号 newuser1
`usermod -U newuser1` 解除对 newuser1 的锁定
`userdel -r username` 彻底消除一个用户,包括他的目录
`logout` 注销登录

## 用户组

类似于身份，每个用户必须有一个身份，并可以拥有多个身份
`usermod -a -G staff newuser2` 将 newuser2 添加到组 staff 中
`groups user` 查看用户属于哪几个用户组

## 目录和文件的权限

是针对`文件所有者` `用户组` `其它用户`三者设立的

/etc/passwd 系统所有用户文件

```bash
用户名：密码(x代替)：UID：GID：用户全名：home目录：shell
```

/etc/shadow 所有用户的密码(加密过后的)

/etc/group 组文件

```bash
组名：用户组密码(x代替)：GID：用户名1,用户名2
```

/etc/gshadow 组密码文件

## 给用户sudo权限

`visudo` 编辑 sudo 文件
下面是 sudo 文件的配置
`root ALL=(ALL) ALL` 这一行下面，再加入一行
`caokaiyan ALL=(ALL) ALL` 给 caokaiyan 用户跟 root 一样的 sudo 权限
`%admin ALL=(ALL) ALL` 给 admin 这个用户组跟 root 一样的 sudo 权限,admin 用户组里的成员都拥有
`%admin ALL=/sbin/mount /mnt/cdrom,/sbin/umount /mnt/cdrom`
上面命令限制 admin 用户组只能使用`/sbin/mount /mnt/cdrom`,`/sbin/umount /mnt/cdrom`两个命令
`%admin ALL=(ALL) ALL,!/usr/sbin/adduser,!/usr/sbin/useradd` `!`表示 admin 禁用的命令
建议：明文禁止 su 命令被 sudo 特权执行,原因是 `sudo su anyone`这样可以切换到任意一个 linux 用户的目录

### 查看当前在线的所有用户

```bash
$ w
06:16:14 up  5:24,  2 users,  load average: 0.02, 0.03, 0.05
USER     TTY      FROM              LOGIN@   IDLE   JCPU   PCPU WHAT
cky      pts/0    183.37.226.20    02:53   28.00s  0.98s  0.98s -zsh
root     pts/1    183.37.226.20    06:16    0.00s  0.00s  0.00s w
$ pkill -9 -t pts/1   # 强制踢出 pts/1 登录的用户
```

## `ps aux`

`USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND`

```bash
USER：该 process 属于那个使用者账号的
PID ：该 process 的号码
VSZ ：该 process 使用掉的虚拟内存量 (Kbytes)
RSS ：该 process 占用的固定的内存量 (Kbytes)
TTY ：该 process 是在那个终端机上面运作，若与终端机无关，则显示 ?，另外， tty1-tty6 是本机上面的登入者程序
若为 pts/0 等等的，则表示为由网络连接进主机的程序。
STAT：该程序目前的状态，主要的状态有
R ：该程序目前正在运作，或者是可被运作
S ：该程序目前正在睡眠当中 (可说是 idle 状态)，但可被某些讯号 (signal) 唤醒。
T ：该程序目前正在侦测或者是停止了
Z ：该程序应该已经终止，但是其父程序却无法正常的终止他，造成 zombie (疆尸) 程序的状态
+ # 后台进程
START：该 process 被触发启动的时间
TIME ：该 process 实际使用 CPU 运作的时间
COMMAND：该程序的实际指令
```

## `pstree`

以树形查看进程以及进程间的关系
`-p` 同时显示进程的`pid`
`-u` 同时显示该进程的用户

`ps axjf` 树状形式查看所有进程
`PPID PID PGID SID TTY TPGID STAT UID TIME COMMAND`

### 按 16 进制 对照查看文件

```bash
$ od -ax shell
0000000   #   !   /   b   i   n   /   s   h  nl   e   c   h   o  sp   "
           2123    622f    6e69    732f    0a68    6365    6f68    2220
0000020   s   h   e   l   l   "  nl
           6873    6c65    226c    000a
```

## 主机扫描

### fping

- `fping -As -c3 192.168.1.1 192.168.1.74 192.168.1.20`
- `fping -Aes -c3 -g 101.200.144.0/24` 查看某个网段的所有 ip 情况

```bash
Usage: fping [options] [targets...]
   -a  显示可ping通的目标
   -A  将目标以ip地址的形式显示
   -c  ping每个目标的次数
   -e 显示返回数据包所费时间
   -f file  read list of targets from a file
   -g 可指定目标的开始和结束IP， 或者提供ip的子网掩码,例如
      fping -g 192.168.1.0 192.168.1.255
      fping -g 192.168.1.0/24
   -s 打印最后的统计数据
   -u 显示不可到达的目标
```

### Hping

Hping 是一个命令行下使用的 TCP/IP 数据包组装/分析工具，其命令模式很像 Unix 下的 ping 命令，但是它不是只能发送 ICMP 回应请求，它还可以支持 TCP、UDP、ICMP 和 RAW-IP 协议，它有一个路由跟踪模式，能够在两个相互包含的通道之间传送文件。Hping 常被用于检测网络和主机

## 路由扫描

查询一个主机到另一个主机的经过的路由的跳数，以及数据延迟情况

### traceroute

```bash
➜  ~ sudo traceroute -n www.imooc.com     # 默认使用的是 UDP 包探测
traceroute to www.imooc.com (117.121.101.41), 30 hops max, 60 byte packets
 1  192.168.1.1  0.412 ms  0.387 ms  0.474 ms
 2  100.64.0.1  2.877 ms  2.883 ms  2.890 ms
 3  59.38.106.217  2.976 ms  4.156 ms  4.136 ms
 4  183.56.65.38  5.283 ms 183.56.65.46  7.128 ms 183.56.65.26  4.038 ms
 5  202.97.65.61  37.725 ms 202.97.65.101  40.245 ms  40.238 ms
 8  220.181.17.122  46.704 ms  46.658 ms  45.458 ms
10  117.121.99.82  34.239 ms  35.550 ms  34.105 ms

➜  ~ sudo traceroute -T -p80 -n www.imooc.com    # 使用 TCP 包去探测
traceroute to www.imooc.com (117.121.101.41), 30 hops max, 60 byte packets
 1  192.168.1.1  0.349 ms  0.355 ms  0.450 ms
 2  100.64.0.1  3.588 ms  3.594 ms  3.583 ms
 6  220.181.177.70  39.335 ms * 220.181.177.222  39.058 ms
 8  220.181.17.122  41.121 ms  38.737 ms  38.723 ms
10  117.121.99.82  34.264 ms  34.250 ms  35.086 ms
12  117.121.101.41  39.074 ms  37.898 ms  37.915 ms

➜  ~ sudo traceroute -In www.imooc.com           # 使用 ICMP 包去探测
traceroute to www.imooc.com (117.121.101.41), 30 hops max, 60 byte packets
 1  192.168.1.1  0.283 ms  0.384 ms  0.489 ms
 2  100.64.0.1  2.278 ms  2.305 ms  2.687 ms
 3  59.38.106.217  2.597 ms  3.358 ms  3.713 ms
 4  183.56.65.46  6.884 ms  6.906 ms  6.934 ms
 5  202.97.65.97  37.570 ms  37.834 ms  38.564 ms
 8  220.181.17.122  49.967 ms  49.849 ms  49.212 ms
```

### mtr

能测试出主机到每个路由间的连通性

```bash
➜  ~ mtr -r www.imooc.com
Start: 2018-08-15T00:14:50+0800

HOST: cky                         Loss%   Snt   Last   Avg  Best  Wrst StDev
  1.|-- _gateway                   0.0%    10    0.3   0.7   0.3   3.0   0.8
  2.|-- 100.64.0.1                 0.0%    10    1.7   1.7   1.2   2.2   0.3
  3.|-- 237.106.38.59.broad.fs.gd  0.0%    10    1.9   1.9   1.5   2.3   0.2
  4.|-- 183.56.65.82              80.0%    10    2.4   2.3   2.3   2.4   0.0
  5.|-- 202.97.65.205              0.0%    10   34.3  35.2  33.5  37.2   1.4
  6.|-- 220.181.16.58             40.0%    10   33.9  39.4  33.8  65.8  12.9
  7.|-- ???                       100.0    10    0.0   0.0   0.0   0.0   0.0
  8.|-- 220.181.17.122             0.0%    10   41.8  53.2  41.8  70.2   7.4
  9.|-- ???                       100.0    10    0.0   0.0   0.0   0.0   0.0
 10.|-- 117.121.99.82              0.0%    10   34.0  34.0  33.5  34.3   0.3
 11.|-- ???                       100.0    10    0.0   0.0   0.0   0.0   0.0
```

## 批量主机服务扫描

### nmap

### ncat

```
/bin    /sbin    /usr/bin    /usr/sbin    /usr/local/bin  存放命令的文件
/opt    安装的大应用程序文件
/tmp    临时文件
/lost+found 系统修复过程中恢复的文件
/dev    设备文件目录
/dev/cdrom        光驱设备
/dev/fd0    软驱

/etc/lilo.conf    启动引导程序文件
/etc/grub.conf     多系统引导时，配置文件
/etc/inittab    控制启动模式（图形/文本登录）
/etc/fstab    文件系统配置
/etc/profile    增加环境变量等的配置文件 如PATH 如配置javaEE 开发环境
/etc/ftp*    ftp 的配置文件
/etc/resolv.conf    dns域名服务器的配置文件
/etc/passwd    系统能识别的用户清单，纯文本显示加密了的口令，普通用户可读
/etc/shadow    超级用户才能读，用于保护加密口令的安全，隐藏口令
/etc/group    放置所有组名的地方
/etc/sysconfig/network-scripts/ifcfg-etho    ip地址的配置文件
/etc/hosts    类似于window  host 文件的，可以配置 pms.com 映射到本地127.0.0.1地址

/lib    系统所用的库，如 c 程序库
/usr/lib/    应用程序使用的库文件如 mysql的api
/usr/sbin    系统管理的命令
/usr/bin    几乎所有的命令程序
/usr/include    c语言的头文件
/usr/local    本地安装的软件
/usr/doc    /usr/share/doc    帮助文档
/usr/share    共享文件和数据
/usr/src/linux-2.4.20-8/    linux 源代码

/var/www    apache 的文档目录
/var/lib    系统运行时随时改变的文件
/var/local    /usr/local程序的可变数据
/var/log    日志文件
/var/spool    邮件，新闻等队列的脱机目录
/var/tmp    临时文件
/root/.bash_profile    root 用户配置环境变量的文件
/home/username/.bash_profile    username 用户配置环境变量的文件
```

### 查看磁盘分区使用状况

`-a` 显示所有文件系统
`-h` 以 1024 计算
`-T` 磁盘类型
`-t` 显示指定类型文件系统的磁盘分区
`-x` 不显示指定类型文件系统的磁盘分区

```
➜  ~ df -aTH
文件系统       类型      容量  已用  可用 已用% 挂载点
/dev/xvda1     ext4       22G  8.9G   12G   45% /
devtmpfs       devtmpfs  513M     0  513M    0% /dev
tmpfs          tmpfs     521M     0  521M    0% /dev/shm
tmpfs          tmpfs     521M   53M  469M   11% /run
tmpfs          tmpfs     521M     0  521M    0% /sys/fs/cgroup
tmpfs          tmpfs     105M     0  105M    0% /run/user/1000
```

主分区：最多只能有 4 个
扩展分区：

> - 最多只能一个
> - 主分区加拓展分区最多有 4 个
> - 不能写入数据,只能包含逻辑分区

逻辑分区

主要目的是写入特定文件系统，首先将分区指定区域分成等大小的储存块,再将分区中另一指定区域做成文件分配表，目录表，它们纪录了该分区下所有文件实际存储的块以及用于文件管理。

使用分区

linux: 分区 -----> 格式化 -----> 取个设备文件名 ---> 挂载

### 批量安装日志

安装完系统后，在`root`的 home 目录下
`/root/install.log` 储存了安装在系统中的软件包及其版本信息
`/root/install.log.syslog` 储存了安装过程中留下的事件纪录
`/root/anaconda-ks.cfg` 以 Kickstart 配置文件的格式纪录安装过程中设置的选项信息