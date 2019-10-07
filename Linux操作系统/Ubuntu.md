# Ubuntu 19 装机指南

本文是配置`ubuntu 19.04`作为开发机的装机指南。

## 下载安装

- 下载`Ubuntu 18.04 .iso`镜像
- 下载U盘装机软件`LinuxLive USB Creator`
- 设置电脑的启动盘顺序，U盘进入，安装

## 初始化开发环境

由于经常装机，所以所有步骤都写成了一个脚本： [ubuntu.sh](https://github.com/codekissyoung/shell/blob/master/ubuntu.sh)

## 设置软件运行时语言环境

`Locale` 是软件在运行时的语言环境, 它包括语言`Language`, 地域`Territory`和字符集`Codeset`:

- `sudo vim /etc/enviroment` 添加 `LANG="zh_CN.UTF-8"`
- `sudo locale-gen`
- `sudo vim /etc/default/locale` 添加 `LANG=zh_CN.UTF-8`

## 安装软件

**软件安装原则**: 优先选择该系统版本上的默认软件,比如`ubuntu 16.04`的默认PHP版本是7.0,那就不要去用7.1的版本,否则会带来很大的麻烦

```bash
# apt-get 命令
sudo apt-get update             更新软件源
sudo apt-get upgrade            从软件源处更新软件
sudo apt-get autoremove         自动卸载系统不需要的软件
apt-cache search keyword        搜寻软件
apt-get install package         安装软件
apt-get remove package          删除软件
apt-get --purge remove package  彻底删除
```

#### 更强大的 aptitude

```
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

```
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

#### snap 安装软件包

`snap`包思路模仿苹果软件包,没有依赖关系，体积大，下载安装包后，将下载的安装文件挂载到`/snap`目录下并自动创建挂载点，然后复制文件到指定位置

```bash
snap find htop            # 查找软件
sudo snap install htop    # 安装软件
sudo snap refresh stop    # 更新软件
sudo snap remove stop     # 删除一个应用
snap list                 # 列出安装的应用

➜  htop tree   
.
├── 68
│   ├── bin
│   │   └── htop
│   ├── command-htop.wrapper
│   ├── meta
│   │   └── snap.yaml
│   └── share
└── current -> 68

➜  htop pwd
/snap/htop
```

## 接入GitHub

- 生成密钥 `ssh-keyen`, 将密钥`~/.ssh/id_rsa.pub`上传到 `Github > Settings > SSH And GPG keys`

## 连接到远程开发服务器

- 将密钥`~/.ssh/id_rsa.pub`加入到远程服务器的`~/.ssh/authorized_keys`中
- 在客户机执行`scp .ssh/id_rsa.pub cky@codekissyoung.com:~/id_rsa.pub`
- 然后在远程服务器执行 `cat id_rsa.pub >> .ssh/authorized_keys`, 记得修改`authorized_keys`的权限位`600`
- 登陆远程服务器 `ssh cky@codekissyoung.com`

## 安装QT

- [QT5.9.5安装包](http://download.qt.io/official_releases/qt/5.9/5.9.5/)

## 截图工具

- 自带的截图软件,使用 `shift + printscreen` 截图

## 安装 Monaco 字体

 进入github下载这个字体，github地址是`https://github.com/cstrap/monaco-font`,查看安装说明

```bash
sudo ./install-font-ubuntu.sh https://github.com/todylu/monaco.ttf/blob/master/monaco.ttf?raw=true
```

## 解决软件包版本太高问题

- `E:无法修正错误，因为您要求某些软件包保持现状，就是它们破坏了软件包间的依赖关系 解决办法` 就是这个提示
- 解决办法: [Ubuntu解决包依赖关系](https://blog.csdn.net/newmann/article/details/70149021)
- 方案就是使用`aptitude`
  - 执行命令`sudo aptitude install build-essential`
  - 在展示`1)      build-essential [未安装的]`等保持原样，并且询问 `是否接受该解决方案？[Y/n/q/?]` 时，填入 `n`,表示不接受
  - 在继续展示 `降级 下列软件包：1)     gcc-7-base [7.3.0-21ubuntu1~16.04 (now) -> 7.3.0-16ubuntu3 (bionic)]`, 并询问`是否接受该解决方案？[Y/n/q/?]`时，填入`Y` 表示接受软件包降级，这样问题就解决了

## 安装 PHP + Apache2

- 参考官方文档: [安装PHP语言 使用Apache2作为Web Server](https://help.ubuntu.com/lts/serverguide/php.html.en-GB)
- 当网站直接显示没有解析的php代码时，很可能的一个原因如下:

```bash
By default, when libapache2-mod-php is installed, the Apache 2 Web server is configured to run PHP scripts.
In other words, the PHP module is enabled in the Apache Web server when you install the module.
Please verify if the files /etc/apache2/mods-enabled/php7.0.conf and /etc/apache2/mods-enabled/php7.0.load exist.
If they do not exist, you can enable the module using the a2enmod command
```




## 安装python开发环境

```bash
sudo aptitude install -y python2.7-dev python3.5-dev libssl-dev libevent-dev libjpeg-dev libxml2-dev libxslt1-dev
sudo aptitude install python-pip 安装包管理工具
sudo pip install virtualenv 安装 python 版本的虚拟环境,先不管，学python时候再看
```

## NFS(Network File System)文件共享服务

## FTP(File Transfer Protocol)

## Samba

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


# 限制用户进程数
- 在`/etc/security/limits.conf` 文件后面添加上下面代码，限制用户进程数为200

```bash
*   hard    nproc   200
```

# Nginx 
```bash
service apache2 stop
apt-get remove apache2
apt-get install nginx
service nginx start
curl localhost # 验证下安装是否成功
```

`sudo path/to/nginx` 启动

`sudo nginx -s reload` 重启

`sudo　nginx -s stop` 停止

`curl localhost` 测试是否安装正确

# nginx 403 forbidden
* 缺少index.html或者index.PHP文件
* 目录权限:nginx的启动用户默认是nginx的,把web目录的权限改大，或者是把nginx的启动用户改成目录的所属用户，重起一下就能解决
[http://segmentfault.com/a/1190000003067828#articleHeader1](http://segmentfault.com/a/1190000003067828#articleHeader1) 
[http://macshuo.com/?p=547](http://macshuo.com/?p=547)  趣谈个人建站 lnmp 架构

# 使用apt-get安装 lnmp 架构
使用的是root用户
安装mysql
```bash
apt-get install mysql-server mysql-client
```

#### 安装php-fpm
```bash
apt-get install php5-fpm
apt-get install php5-mysql php5-curl php5-gd php5-intl php-pear php5-imagick php5-imap php5-mcrypt php5-memcache php5-ming php5-ps php5-pspell php5-recode php5-snmp php5-sqlite php5-tidy php5-xmlrpc php5-xsl php-apc
```
- 配置文件 `vim  /etc/php5/fpm/php.ini `
```bash
cgi.fix_pathinfo=0
```
改变php-fpm监听 `vi /etc/php5/fpm/pool.d/www.conf`
```bash
;listen = /var/run/php5-fpm.sock 
listen = 127.0.0.1:9000
```

重新启动php5-fpm  `service php5-fpm reload`
重新启动nginx `service nginx reload`
错误处理 报错 `reload: Unknown instance`
```
sudo pkill php5-fpm; sudo service php5-fpm start
```

浏览器访问下 `localhost/info.php` 查看是否支持php以及相关模块

# 安装 Memcache 
sudo apt-get install memcached #安装php memcached 扩展
memcached -d -m 50 -p 11211 -u root #启动一个memcached服务
-d 是启动一个守护进程 
-m 指定使用多少兆的缓存空间；
-p 指定要监听的端口； 
-u 指定以哪个用户来运行
-l 是监听的服务器ip地址，默认为127.0.0.1  
-c 是最大并发连接数，默认1024 
-P 是保存pid文件 如/tmp/memcached.pid
使用telnet测试 memcached 服务
$ telnet localhost 11211 Trying 127.0.0.1...Connected to localhost.

# ubuntu 16.04 搭建Ubuntu(16.04) + Apache(2.4) + Mysql(5.7) + PHP(7.0)环境
## 搭建目标
```bash
cky@cky-pc:~/worksapce$ apache2 -v
Server version: Apache/2.4.18 (Ubuntu)
Server built: 2016-04-15T18:00:57
cky@cky-pc:~/worksapce$ mysql --version
mysql Ver 14.14 Distrib 5.7.12, for Linux (x86_64) using EditLine wrapper
PHP 7.0.4-7ubuntu2.1 (cli) ( NTS )
Copyright (c) 1997-2016 The PHP Group
Zend Engine v3.0.0, Copyright (c) 1998-2016 Zend Technologies
with Zend OPcache v7.0.6-dev, Copyright (c) 1999-2016, by Zend Technologies
```
## 安装并配置apache2.4
```bash
sudo apt-get install apache2
```
```
sudo vim /etc/apache2/apache2.conf
    // 将 <Directory /var/www/>
    // 改成 <Directory "你的目录">
sudo vim /etc/apache2/sites-available/000-default.conf
    // 将 DocumentRoot /var/www/html
    // 改成 DocumentRoot "你的目录"
```
```
sudo /etc/init.d/apache2 restart
```
## 安装php7.0
```
sudo apt-get install php7.0
sudo apt-get install libapache2-mod-php7.0
```
安装更多的模块
```
sudo apt-get install php7.0[tab]
```
## 安装数据库
```
sudo apt-get install mysql-server mysql-client
sudo apt-get install php7.0-mysql
```
## 操作数据库
```
/etc/init.d/mysql start｜stop|restart
```

# 开启 Mcrypt 模块
sudo php5enmod mcrypt
sudo service apache2 restart

# apache 相关的
http://blog.csdn.net/u013178760/article/details/45393183    Apache 2.4 Rewrite 模块
http://blog.csdn.net/u013178760/article/details/48436777    Apache2 虚拟主机配置

# 安装apache
```bash
sudo apt-get install apache2
```
# 开启和关闭模块
```bash
sudo a2enmod rewrite #启用rewrite模块 
sudo a2dismod rewrite #禁用rewrite模块
```
# 开启和关闭站点
```bash
sudo a2ensite sitename ＃启用站点 
sudo a2dissite sitename ＃停用站点
```
# 允许使用.htaccess
```bash
AllowOverride None 改为 AllowOverride  All
```
# 重启|开启｜关闭apache 
```bash
sudo service apache2 restart|start|stop             重启|开启｜关闭apache 
sudo  /etc/init.d/apache2 restart|start|stop     　　重启｜开启｜关闭apache
```

## url重写
```bash
http://www.example.com/USA/California/San_Diego  
“/USA/California/San_Diego” 是能够Rewrite的字符串！
重写：就是实现URL的跳转和隐藏真实地址，基于Perl语言的正则表达式规范。平时帮助我们实现拟静态，拟目录，域名跳转，防止盗链等
```

## .htaccess

```bash
RewriteEnine on
RewriteRule  ^/t_(.*).html$  /test.php?id = $1#当访问任何以t_开头，以.html结尾的文件时，将$1用与(.*)匹配的字符替换后，访问相应的test.php页面
RewriteRule ^/test([0-9]*).html$ /test.php?id=$1RewriteRule ^/new([0-9]*)/$ /new.php?id=$1 [R]#当我们访问的地址不是以www.163.com开头的，那么执行下一条规则
RewriteCond %{HTTP_HOST} !^www.163.com [NC]RewriteRule ^/(.*) http://www.163.com/ [L]
```

## Apache Rewrite规则修正符
```bash
1) R 强制外部重定向
2) F 禁用URL,返回403HTTP状态码。
3) G 强制URL为GONE，返回410HTTP状态码。
4) P 强制使用代理转发。
5) L 表明当前规则是最后一条规则，停止分析以后规则的重写。
6) N 重新从第一条规则开始运行重写过程。
7) C 与下一条规则关联 如果规则匹配则正常处理，以下修正符无效
8) T=MIME-type(force MIME type) 强制MIME类型
9) NS 只用于不是内部子请求
10) NC 不区分大小写
11) QSA 追加请求字符串
12) NE 不在输出转义特殊字符 \%3d$1 等价于 =$1
```

## 核心模块
```bash
core_module,so_module,http_module,mpm
```

## 全局配置指令

```bash
#表示apache2这个软件安装的目录
ServerRoot  "/usr/local/apache2"

#监听端口命令 Listen  ip：portListen  80

#加载动态模块，
LoadModule  模块名   模块路径
LoadModule  php5_module  modules/libphp5.so

#是否加载某个模块容器
<IfModule ></IfMoudle>

#设置先读取 index.php 文件
<IfModule dir_module>
  DirectoryIndex index.php index.html
</IfModule>

#留下管理员邮箱
ServerAdmin 1162097842@qq.com

#用于多个域名访问同一个ip时，辨别它们访问的主机
ServerName pms.com

#设置主机所有文档的根目录
DocumentRoot "/var/www/html"
# 默认目录访问的文件
DirectoryIndex index.html index.htm index.php

添加默认字符集  AddDefaultCharset GB2312
监听ip是192.168.1.1的地址和端口为80创建虚拟目录
Alias /down    "/sofТWare /download"   创建名为down的虚拟目录，它对应的物理路径是：/sofТWare /download
设置目录权限<Directory "目录路径">    此次写设置目录权限的语句        
Options FollowSymLinks  允许符号链接 Options Indexes         允许用户浏览网页目录，（不安全的设置，建议删除）      
AllowOverride None      不允许 .htaccess 重写这个目录，改为 All 则能重写
</Directory>
```

## Set Search Domain

在Ubuntu设置IPv4时，
ip 地址 : 10.10.10.19
子网掩码 : 24
网关: 10.10.10.1
DNS服务器:119.29.29.29,114.114.114.114
搜索域:lingyunstrong.com
```bash
cky@cky-pc:~$ ping a
PING a.lingyunstrong.com (183.16.2.95) 56(84) bytes of data.
64 bytes from 183.16.2.95: icmp_seq=1 ttl=64 time=0.595 ms
64 bytes from 183.16.2.95: icmp_seq=8 ttl=64 time=0.655 ms
^C
--- a.lingyunstrong.com ping statistics ---
8 packets transmitted, 8 received, 0% packet loss, time 6997ms
rtt min/avg/max/mdev = 0.595/0.657/0.683/0.036 ms

cky@cky-pc:~$ ping cky
PING cky.lingyunstrong.com (10.10.10.19) 56(84) bytes of data.
64 bytes from 10.10.10.19: icmp_seq=1 ttl=64 time=0.026 ms
64 bytes from 10.10.10.19: icmp_seq=2 ttl=64 time=0.025 ms
^C
--- cky.lingyunstrong.com ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms
rtt min/avg/max/mdev = 0.025/0.025/0.026/0.005 ms
cky@cky-pc:~$ ping cky.linyunstrong.com
PING cky.linyunstrong.com.lingyunstrong.com (183.16.2.95) 56(84) bytes of data.
64 bytes from 183.16.2.95: icmp_seq=1 ttl=64 time=0.594 ms
64 bytes from 183.16.2.95: icmp_seq=4 ttl=64 time=0.648 ms
^C
--- cky.linyunstrong.com.lingyunstrong.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3002ms
rtt min/avg/max/mdev = 0.594/0.629/0.662/0.036 ms
cky@cky-pc:~$ ping a
PING a.lingyunstrong.com (183.16.2.95) 56(84) bytes of data.
64 bytes from 183.16.2.95: icmp_seq=1 ttl=64 time=0.587 ms
64 bytes from 183.16.2.95: icmp_seq=3 ttl=64 time=0.641 ms
^C
--- a.lingyunstrong.com ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2000ms
rtt min/avg/max/mdev = 0.587/0.628/0.658/0.041 ms
cky@cky-pc:~$ ping baidu.com
PING baidu.com (180.149.132.47) 56(84) bytes of data.
64 bytes from 180.149.132.47: icmp_seq=1 ttl=54 time=36.8 ms
64 bytes from 180.149.132.47: icmp_seq=4 ttl=54 time=39.6 ms
^C
--- baidu.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3003ms
rtt min/avg/max/mdev = 36.188/37.903/39.637/1.439 ms
cky@cky-pc:~$ ping sina.com
PING sina.com (66.102.251.33) 56(84) bytes of data.
^C
--- sina.com ping statistics ---
2 packets transmitted, 0 received, 100% packet loss, time 1007ms
```

# 追踪路由
```bash
➜  blog git:(master)  sudo traceroute m.dev.yunchongba.com
traceroute to m.dev.yunchongba.com (120.25.71.101), 30 hops max, 60 byte packets
 1  10.10.10.1 (10.10.10.1)  0.587 ms  0.584 ms  0.576 ms
 2  183.15.192.1 (183.15.192.1)  6.095 ms  6.930 ms  6.930 ms
 3  113.106.44.53 (113.106.44.53)  6.070 ms  7.084 ms  7.552 ms
 4  119.145.47.185 (119.145.47.185)  7.049 ms  7.318 ms  7.317 ms
 5  183.56.65.6 (183.56.65.6)  12.428 ms 183.56.65.14 (183.56.65.14)  12.696 ms 183.56.65.18 (183.56.65.18)  11.576 ms
 6  202.97.85.114 (202.97.85.114)  27.501 ms * *
 7  220.191.200.14 (220.191.200.14)  32.215 ms 220.191.200.18 (220.191.200.18)  28.028 ms *
 8  115.236.101.221 (115.236.101.221)  32.115 ms 115.238.21.117 (115.238.21.117)  32.036 ms 115.236.101.213 (115.236.101.213)  34.018 ms
 9  42.120.247.109 (42.120.247.109)  30.852 ms 42.120.247.53 (42.120.247.53)  33.999 ms 42.120.247.57 (42.120.247.57)  30.814 ms
10  42.120.239.138 (42.120.239.138)  58.777 ms  58.821 ms 42.120.242.81 (42.120.242.81)  58.187 ms
11  42.120.239.134 (42.120.239.134)  56.089 ms 42.120.239.158 (42.120.239.158)  52.129 ms 42.120.239.146 (42.120.239.146)  57.078 ms
12  42.120.253.6 (42.120.253.6)  50.913 ms  51.081 ms 42.120.253.2 (42.120.253.2)  54.589 ms
13  42.120.253.6 (42.120.253.6)  50.205 ms * *
```
