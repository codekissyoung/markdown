# Ubuntu装机指南

`Ubuntu 18.04` 作为示范机，U 盘装机软件 `LinuxLive USB Creator`。

## Ubuntu20.04

### 1. 更换软件源

修改 `/etc/apt/sources.list` 为如下内容:

```bash
deb http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
```

### 2. 更换 DNS

换到`DNSPod`的 `PublicDNS` [官方指南](https://support.dnspod.cn/Kb/showarticle/tsid/240/#link2)，`Ubuntu18`的设置操作与指南里不同。

```bash
$ systemd-resolve --status          # 查看当前使用的 DNS Server
$ sudo vim /etc/systemd/resolved.conf
[Resolve]
DNS=119.29.29.29 182.254.116.116    # 换成DNSPod
$ sudo systemctl restart systemd-resolved.service # 重启服务
```

### 3. 设置 vim

```bash
$ sudo update-alternatives --config editor                # 默认编辑设置为vim
```

```bash
set nu                        " 设置行号
set hlsearch                  " 高亮查找项
set incsearch                 " 查找跟随
set ignorecase                " 查找时忽略大小写
set fdm=marker                " 设定标记折叠
set autoindent                " 设置自动缩进
set tabstop=4                 " 设置tab为4个空格
set softtabstop=4
set shiftwidth=4
set expandtab                 " tab => space
set list                      " 显示空格和tab
set listchars=tab:>-,trail:-  " 显示空格和tab的格式
syntax on                     " 语法高亮
set tabpagemax=15             " 设置最大打开的标签页数
```

### 4. 免密登录

```bash
$ scp .ssh/id_rsa.pub link@192.168.1.181:/home/link/id_rsa.pub  # PC 机执行
# 登录虚拟机，然后执行下面两句
$ ssh-keygen  # 每复制一个虚拟机，公私钥就得重置下，保证每台机器都不同
$ cat id_rsa.pub >> .ssh/authorized_keys # 公私钥的重置，不影响 authorized_keys 的值
$ chmod 600 .ssh/authorized_keys
```

```bash
$ sudo visudo # 设置执行 sudo 命令不需要输入密码
%sudo   ALL=(ALL:ALL) NOPASSWD:ALL
```

### 5. 设置时区sudo apt-get install -y bind9 bind9-host dnsutils bind9-doc

```bash
$ sudo apt-get install ntpdate  # 安装时间同步工具
$ sudo ntpdate cn.pool.ntp.org  # 同步时间
$ sudo hwclock --systohc        # 将同步后时间写入硬件

$ sudo tzselect   # 选择亚洲Asia，继续选择中国China，最后选择北京Beijing

# 将下面这句加入到 ~/.profile
TZ='Asia/Shanghai'; export TZ
$ date                          # 查看时间
```

### 6. 设置语言

```bash
$ sudo apt-get install -y language-pack-zh-hans # 安装中文简体语言包
$ locale -a                                     # 查看已安装的语言包

# 将下面这句写入到 ~/.bashrc 只给当前用户修改下环境变量，不需要全局
export LANG="zh_CN.utf8"

$ date #　重启后，查看下时间，就知道中文和时区已经配置好了
2020年 01月 02日 星期四 23:41:23 CST
```

### 7. 设置 hostname

```bash
$ sudo vim /etc/cloud/cloud.cfg     # 将 hostname 设置为可修改状态

preserve_hostname: true             # 修改一句

$ hostnamectl set-hostname link1    # 设置新 hostname，重启确认
```

### 8. 设置静态 IP

首先，我们需要确认下本网段内，哪些私有`IP`已经被使用了，以及网关地址。

```bash
的，所以我们需要修改下，启动后：$ sudo nmap -sP 192.168.13.0/24 # 先嗅探下，找出本网段中没有被使用过的私有 IP 地址
$ route -n                      # 找出网关地址
```

找到一个未使用的`IP` 比如 `192.168.0.10`，我们就可以开始设置了。`Ubuntu 18.04`使用了新软件`netplan`来管理`IP`。

```bash
$ sudo vim /etc/netplan/50-cloud-init.yaml        # yaml 文件名可能有不同
```

设置如下，`yaml`文件千万要注意格式:

```yaml
network:
  ethernets:
    enp0s3:
      addresses: [192.168.0.10/24]
      gateway4: 192.168.0.1
      dhcp4: no
  version: 2
```

```bash
$ sudo netplan apply    # 重启下网络，如果是 ssh 链接，那么执行后会掉线
$ ifconfig              # 确认下是否已经修改
```

## 复制多个Ubuntu

在制作完一个干净的`Ubuntu 18.04 Server`后，我们完全可以以它作为源，复制出多个`Server`用于实验。这里利用的是`Virtual Box`的 “链接复制”，复制快速，节省磁盘。要注意重新生成网卡的`MAC`地址。

![](https://img.codekissyoung.com/2020/01/03/684bc8654a94444a0fffcd12a11bdfa0.png)

复制完后的`Server`，它们的公私钥、`hostname` 和 `ip` 是一毛一样的，所以我们需要修改下，启动后：

```bash
$ ssh link@192.168.0.10 # 副本与源Server一毛一样，所以直接ssh登录副本

# SSH 登录副本后
$ ssh-keygen                                  # 重新生成公私钥
$ sudo hostnamectl set-hostname link1         # 设置新的 hostname
$ sudo vim /etc/netplan/50-cloud-init.yaml    # 修改静态 IP

addresses: [192.168.0.11/24, ]                # 修改行

$ sudo netplan apply                          # 应用生效，执行后 SSH 应该已经掉线了 ^_^

# 新开终端后
$ ssh link@192.168.0.11                       # 使用新 IP 免密登录 link1 Server
```

服务器都设置好后，使用“无界面启动”模式启动，然后使用`ssh link@192.168.0.*`登录。

### 确认MAC地址和product_uuid唯一

```bash
$ ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DEFAULT group default qlen 1000
    link/ether 08:00:27:36:3a:1a brd ff:ff:ff:ff:ff:ff
$ sudo cat /sys/class/dmi/id/product_uuid
BCCB5FF1-CA27-D040-BDA8-2D5310CF481F
```

## 私网DNS

```bash
sudo apt-get install -y bind9 bind9-host dnsutils bind9-doc
sudo netstat -tulnp | grep named # 检查是否在运行
nslookup www.qq.com # 查看该域名的DNS信息
```

## 安装服务端基础开发软件

```bash
sudo apt-get install -y apt-transport-https
sudo apt-get install -y vim git aptitude zsh tree tmux lnav
sudo apt-get install -y bash-builtins bash-completion bash-doc bash-static
sudo apt-get install -y rar unrar p7zip zip unzip          # 压缩

# 安装 c++ 开发环境
sudo apt-get install -y gcc gdb make autoconf automake libtool build-essential flex bison cmake
sudo apt-get install -y linux-headers-$(uname -r)
sudo apt-get install -y automake autoconf libtool pkg-config intltool checkinstall

# 修复因为依赖问题，安装失败的软件
apt --fix-broken install
```

```bash
git config --global core.quotepath false                # git 中文正确显示
git config --global core.editor vim                     # 默认编辑器 vim
git config --global user.name "link"                    # git username
git config --global user.email "link@muchenglin.com"    # git email
```



```bash
#!/bin/bash

lsb_release -a
cat /etc/issue
uname -a

# 安装调试软件 insight 的依赖
sudo apt-get install autoconf autogen texinfo zlib1g-dev tcl-dev tk-dev mesa-common-dev
sudo apt-get install libjpeg-dev libtogl-dev python-dev
sudo apt-get install flex bison itcl3 itk3 iwidgets4

sudo apt-get install lnav                       # 安装终端看访问日志的神器 lnav观看 [服务器端]
sudo apt-get install bless                      # 查看二进制，客户端软件
```

## 快捷键

```bash
alt + F2                # 运行一个命令
Super + L               # 锁屏,离开工作
Ctrl + Alt + T          # 开启终端
Super + tab             # 切换 App
Shift + Ctrl + Print    # 区域截图到剪贴板
Shift + Print           # 区域截图到 图片 目录
Ctrl + shift + A        # 带画笔的截图（Flameshot提供）
F5                      # 刷新
```

## 设置软件运行时语言环境

`Locale` 是软件在运行时的语言环境, 它包括语言`Language`, 地域`Territory`和字符集`Codeset`:

- `sudo vim /etc/enviroment` 添加 `LANG="zh_CN.UTF-8"`
- `sudo locale-gen`
- `sudo vim /etc/default/locale` 添加 `LANG=zh_CN.UTF-8`

`gnome-session-properties` 设置开机自动运行软件

```php
# 安装 Tab 栏目显示 CPU 和 内存使用率 工具
sudo add-apt-repository ppa:fossfreedom/indicator-sysmonitor
sudo apt-get update
sudo apt-get install indicator-sysmonitor   # 安装好后，Preferences 设置下开机运行就好
nohup indicator-sysmonitor &                # 手动启动
```

安装 `Swoole` :

```bash
sudo apt-get install libmcrypt-dev libiconv-hook-dev libxml2-dev libmysqlclient-dev libcurl4-openssl-dev
sudo apt-get install libjpeg8-dev libpng-dev libfreetype6-dev
sudo apt install php-pear
sudo apt install php7.2-dev     # 这里要确定自己安装的版本号
sudo pecl install swoole
```

需要将`extension=swoole.so`添加到`php.ini`文件(通过`phpinfo()`确认路径)中，开启`Swoole`拓展。

然后重启`php-fpm`:

```bash
sudo systemctl restart php7.2-fpm.service
sudo systemctl restart nginx.service
```

```bash
# apt-get 命令
apt-cache search keyword        搜寻软件
apt-cache show package          软件包信息
apt-get install package         安装软件
apt-get remove package          删除软件
apt-get --purge remove package  彻底删除
```

#### 更强大的 aptitude

```bash
# aptitude 更强大的的 apt-get 命令
sudo apt-get install aptitude           安装aptitude
sudo aptitude                           打开软件包字符操作界面
sudo aptitude search package            搜索
sudo aptitude install package           安装软件
sudo aptitude remove package            删除软件
sudo aptitude purge package             彻底删除 连配置一起删除
sudo aptitude update                    更新软件源
sudo aptitude upgrade                   更新软件
```

#### 使用第三方源 安装软件

```bash
sudo add-apt-repository ppa:ppsspp/stable    添加ppa源, 在source.list里添加 ppa 源了，同时完成导入key
sudo aptitude update                         更新源
sudo aptitude search ppsspp                  搜索下刚刚添加的第三方源的软件
sudo aptitude install ppsspp                 安装它
sudo aptitude purge ppsspp                   删除它
sudo add-apt-repository -r ppa:ppsspp/stable 删除ppa源
sudo aptitude update                         再次更新源
```

#### dpkg 管理 Debian 软件包

```bash
dpkg -l                         列出系统安装的所有debian包
dpkg -c package.deb             列出 deb 包的内容
dpkg -ivh <.deb file name>      安装软件
dpkg -L package                 用此命令查看软件安装到什么地方
dpkg -r package                 移除软件（保留配置）
dpkg -P package                 移除软件（不保留配置）
dpkg -s package                 查找包的详细信息
dpkg –unpack package.deb        解开 deb 包的内容
dpkg -S keyword                 搜索所属的包内容
dpkg –configure package         配置包
dpkg–reconfigure package        重新配置包
```

#### 编译安装软件

```bash
sudo aptitude install libxml2-dev libgtk2.0-dev libnotify-dev libglib2.0-dev libevent-dev
sudo aptitude install libcurl4-openssl-dev libssl-dev # 先安装依赖
sudo apt-get build-dep wireshark # 安装编译wireshark工具
# 在 wireshark 源码文件夹下执行
./configure
make
sudo checkinstall # 构建debian包并且安装
```

### 截图工具

自带的截图软件，使用 `shift + printscreen` 截图，自动保存到指定文件夹，也挺好的！

[Linux 上好用的截图工具 flameshot](https://blog.csdn.net/qq_34347375/article/details/83589772)，这一款是带画笔工具的，非常好用，唯一就是每次都需要选定保存的文件夹。
[Flameshot 一个简洁但功能丰富的截图工具](https://linux.cn/article-10180-1.html)

## 解决软件包版本太高问题

`E:无法修正错误，因为您要求某些软件包保持现状，就是它们破坏了软件包间的依赖关系 解决办法` 就是这个提示

解决办法: [Ubuntu 解决包依赖关系](https://blog.csdn.net/newmann/article/details/70149021)

方案就是使用`aptitude`
- 执行命令`sudo aptitude install build-essential`
- 在展示`1) build-essential [未安装的]`等保持原样，并且询问 `是否接受该解决方案？[Y/n/q/?]` 时，填入 `n`,表示不接受
- 在继续展示 `降级 下列软件包：1) gcc-7-base [7.3.0-21ubuntu1~16.04 (now) -> 7.3.0-16ubuntu3 (bionic)]`, 并询问`是否接受该解决方案？[Y/n/q/?]`时，填入`Y` 表示接受软件包降级，这样问题就解决了

### 特殊权限

```bash
000 , --- , 0 , 不使用任何特殊权限
001 , --t , 1 ,
010 , -s- , 2 ,
011 , -st , 3 ,
100 , s-- , 4 ,
101 , s-t , 5 ,
110 , ss- , 6 ,
111 , sst , 7 ,
```

```bash
➜  ~ ls -alh /bin/su
-rwsr-xr-x 1 root root 40K 5月  16 10:28 /bin/su
```

- s 特殊权限
- 只对二进制程序有效 , 执行者拥有该程序的执行权限，且只在执行该程序的过程中有效
- 执行者将具有该程序拥有者的权限，比如 su 的 s 权限,可以让用户暂时拥有 root 用户的权限
- 通过 `chmod u+s file` 或者 `chmod 4755 file` 来设置

```bash
➜  ~ ls -alh /usr/bin/mlocate
-rwxr-sr-x 1 root mlocate 39K 11月 18  2014 /usr/bin/mlocate
```

- SGID 权限,与 s 权限相同，不同的是，SGID 在执行过程中还会得到该程序的用户组的支持
- 对于设置了 SGID 权限的目录来说,用户拥有 r x 权限时，可以进入该目录,用户在此目录下的有效用户变为该目录的用户，创建的文件的所属用户也是该目录的用户
- 使用 `chmod g+s file` 来添加此权限

```bash
➜  / ls -alh / |grep tmp
drwxrwxrwt  16 root root 4.0K 6月   3 13:01 tmp
```

- SBIT 权限, `--t` ,该权限只对目录有效,用户在该目录下创建的文件或目录，权限默认为`-rw-r--r--`,即只有该用户和 root 可以删除
- 使用命令 `chmod o+t /tmp` 来添加此权限

限制用户进程数

在`/etc/security/limits.conf` 文件后面添加上下面代码，限制用户进程数为 200

```bash
*   hard    nproc   200
```

### 笔记本 fn 键问题

按`fn + Esc`切换功能键与`F1~F12`。

### Ubuntu 防火墙

```bash
$ sudo ufw status
$ sudo ufw allow 80
$ sudo ufw allow 443
$ sudo ufw allow 3306
$ sudo ufw allow 22
```

## 中文输入法

使用开源的[`Rime`输入法](https://github.com/rime/home/wiki/RimeWithIBus):

```bash
sudo apt-get install ibus-rime # 安装
```

设置：

![](https://img.codekissyoung.com/2020/06/18/6d8bf71b420bf0475e0820e3b7aca923.png)

```bash
$ ibus-setup   # 设置水平显示词语
$ ibus restart # 配置生效
```

![](https://img.codekissyoung.com/2020/06/18/db8b562d6155ce96e4f6450000d727c0.png)

如果上面的没有生效，请尝试在`~/.config/ibus/rime/build/ibus_rime.yaml`,添加下面内容：
```yaml
style:
  horizontal: true
```

```
Ctrl + space 组合键来切换输入法
```

改改默认配置：只留下中文简体、每页词语数为10

```bash
vim .config/ibus/rime/default.yaml 
```

![](https://img.codekissyoung.com/2020/06/18/d9f9cf1f79f723e4c5b1956ab2950e36.png)

## 禁用ipv6协议

编辑　/etc/sysctl.conf　文件,在最后面添加：

```bash
net.ipv6.conf.all.disable_ipv6=1
net.ipv6.conf.default.disable_ipv6=1
net.ipv6.conf.lo.disable_ipv6=1
```

终端执行，让配置生效，然后重启电脑。

```bash
$ sudo sysctl -p
```

## 禁用NetworkManager

Ubuntu 默认使用 /etc/network/interfaces 来设置网络，参考如下：

```bash
# interfaces(5) file used by ifup(8) and ifdown(8)
# 回环网卡
auto lo
iface lo inet loopback

# 系统硬件网卡 设置成静态IP配置
auto enp4s0
iface enp4s0 inet static
address 192.168.31.124
netmask 255.255.255.0
gateway 192.168.31.1
```

而Ubuntu Desktop版本，使用了NetworkManager来再次接管网络设置，常常发生莫名其妙的网络问题，所以建议禁用NetworkManager，只保留 interfaces 机制来配置网络。

```bash
# 查看网卡硬件，包括虚拟出来的
$ sudo lshw -C network                         
  *-network                 
  				...
       logical name: enp4s0 # 真实网卡
       ...
  *-network DISABLED # 这个就是未启用状态
				 ...
       logical name: virbr0-nic # KVM 虚拟出来的
       serial: 52:54:00:1d:c6:ac

$ sudo systemctl stop network-manager.service # 关闭服务
$ sudo rm /var/lib/NetworkManager/NetworkManager.state # 删除当前运行状态
$ sudo systemctl disable network-manager.service # 禁止开机启动

$ sudo vim /etc/NetworkManager/NetworkManager.conf # 修改配置文件
# 设置为 managed=false 

$ sudo systemctl restart networking.service # 重启系统网络
```

## netplan使用

使用 /etc/network/interfaces 来直接设置网卡的方式，已经渐渐的被主流淘汰了，Ubuntu 从 18.04开始，就使用 netplan 来管理网络.

https://netplan.io/ 官网

![image-20210308012422145](https://img.codekissyoung.com/2021/03/08/457788fbc7f3a5686fe58e0200de1ebf.png)

一份 Ubuntu Server 服务器配置参考：

```yaml
network:
  version: 2
  ethernets:
    enp0s8:
      dhcp4: yes
    enp0s3:
      addresses: [10.0.2.15/24]
      gateway4: 10.0.2.2
      dhcp4: no
```

```bash
$ sudo netplan -d apply # 更新网络
$ sudo systemctl restart systemd-networkd.service # 重启 networkd
$ sudo systemctl restart networking.service # 重启网络
```