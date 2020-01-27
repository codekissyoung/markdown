# Ubuntu 装机指南

`Ubuntu 18.04` 作为示范机，U盘装机软件 `LinuxLive USB Creator`。

## 制作一个干净的 Ubuntu18.04 Server

### 1. 更换软件源

修改 `/etc/apt/sources.list` 为如下内容:

```bash
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
```

### 2. 更换DNS

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

```vim
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

### 5. 设置时区

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
$ sudo nmap -sP 192.168.13.0/24 # 先嗅探下，找出本网段中没有被使用过的私有 IP 地址
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
            addresses: [192.168.0.10/24, ]
            gateway4: 192.168.0.1
            dhcp4: no
    version: 2
```

```bash
$ sudo netplan apply    # 重启下网络，如果是 ssh 链接，那么执行后会掉线
$ ifconfig              # 确认下是否已经修改
```

## 快速复制多个 Ubuntu Server

在制作完一个干净的`Ubuntu 18.04 Server`后，我们完全可以以它作为源，复制出多个`Server`用于实验。这里利用的是`Virtual Box`的 “链接复制”，复制快速，节省磁盘。要注意重新生成网卡的`MAC`地址。

![](https://img.codekissyoung.com/2020/01/03/684bc8654a94444a0fffcd12a11bdfa0.png)

复制完后的`Server`，它们的公私钥、`hostname` 和 `ip` 是一毛一样的，所以我们需要修改下，启动后：

```bash
$ ssh link@192.168.0.10         # 副本与源Server一毛一样，所以直接ssh登录副本

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
```

```bash
git config --global core.quotepath false                # git 中文正确显示
git config --global core.editor vim                     # 默认编辑器 vim
git config --global user.name "link"                    # git username
git config --global user.email "link@muchenglin.com"    # git email
```

## 安装 lnmp 环境

```bash
sudo apt-get install nginx
sudo apt-get install mysql-server mysql-client
sudo apt-get install redis-server
sudo apt-get install php
```

## 美化Ubuntu

[Ubuntu18桌面美化(MacOS Mojave)](https://blog.csdn.net/barbarassa/article/details/97301735)

护眼软件：

```shell
sudo apt install gtk-redshift redshift python-appindicator
```

## 后面待定

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
Ctrl + shift + A        # 带画笔的截图（Flameshot提供）、
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

#### dpkg 管理 Debian软件包

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

## 安装QT

- [QT5.9.5安装包](http://download.qt.io/official_releases/qt/5.9/5.9.5/)

### 截图工具

自带的截图软件，使用 `shift + printscreen` 截图，自动保存到指定文件夹，也挺好的！

[Linux上好用的截图工具 flameshot](https://blog.csdn.net/qq_34347375/article/details/83589772)，这一款是带画笔工具的，非常好用，唯一就是每次都需要选定保存的文件夹。
[Flameshot一个简洁但功能丰富的截图工具](https://linux.cn/article-10180-1.html)

### 安装企业微信

[Ubuntu16.04/18.04安装企业微信教程](https://blog.svenhetin.com/ubuntu16-04an-zhuang-qi-ye-wei-xin-jiao-cheng/)

## 解决软件包版本太高问题

- `E:无法修正错误，因为您要求某些软件包保持现状，就是它们破坏了软件包间的依赖关系 解决办法` 就是这个提示
- 解决办法: [Ubuntu解决包依赖关系](https://blog.csdn.net/newmann/article/details/70149021)
- 方案就是使用`aptitude`
  - 执行命令`sudo aptitude install build-essential`
  - 在展示`1)      build-essential [未安装的]`等保持原样，并且询问 `是否接受该解决方案？[Y/n/q/?]` 时，填入 `n`,表示不接受
  - 在继续展示 `降级 下列软件包：1)     gcc-7-base [7.3.0-21ubuntu1~16.04 (now) -> 7.3.0-16ubuntu3 (bionic)]`, 并询问`是否接受该解决方案？[Y/n/q/?]`时，填入`Y` 表示接受软件包降级，这样问题就解决了

## linux用于完成特定任务的用户

- `nobody` `admin` `ftp` ，无密码,无home目录，无shell,主要就是为了运行某些特定的进程，比如 nginx 使用nobody用户来运行

## 特殊权限

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

- SGID 权限,与 s 权限相同，不同的是，SGID在执行过程中还会得到该程序的用户组的支持
- 对于设置了SGID权限的目录来说,用户拥有r x权限时，可以进入该目录,用户在此目录下的有效用户变为该目录的用户，创建的文件的所属用户也是该目录的用户
- 使用 `chmod g+s file` 来添加此权限

```bash
➜  / ls -alh / |grep tmp
drwxrwxrwt  16 root root 4.0K 6月   3 13:01 tmp

```
- SBIT 权限, `--t` ,该权限只对目录有效,用户在该目录下创建的文件或目录，权限默认为`-rw-r--r--`,即只有该用户和root可以删除
- 使用命令 `chmod o+t /tmp` 来添加此权限


限制用户进程数

- 在`/etc/security/limits.conf` 文件后面添加上下面代码，限制用户进程数为200

```bash
*   hard    nproc   200
```

### 笔记本fn键问题

按`fn + Esc`切换功能键与`F1~F12`。


