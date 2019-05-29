# 购买阿里云ECS服务器
购买一台阿里云ECS服务器,可使用我的推荐码`xmm4oh`,系统安装设置为`centOS 7.2 64位`

# 为系统添加用户
并不推荐使用`root`用户来管理`linux`,所以拿到一台`linux`的第一件事就是创建一个供自己使用的用户
`useradd cky` 添加cky用户
`passwd cky` 设置密码
`visudo` 设置新用户权限
在 `root ALL=(ALL) ALL` 这一行下面，再加入一行`cky ALL=(ALL) ALL` 

# 查询系统环境
`rpm -q centos-release` 查看CentOS 版本号
`sudo yum -y install ntpdate` 安装时间同步工具
`ntpdate times.aliyun.com` 和阿里云时间同步
centOS 7 默认开启防火墙 ，可能导致远程不能访问服务器，可以关闭它
`systemctl stop firewalld.service` 停止firewall
`systemctl disable firewalld.service` 禁止firewall开机启动
`yum install iptables-services` 改用iptables防火墙

配置用户免密码登录
=========================
如果是windows，使用`xshell`就好
如果是`mac` `ubuntu`等环境则需要配置下
在客户端用户目录执行`ssh-keygen -t rsa`生成密钥
客户端执行`scp .ssh/id_rsa.pub cky@192.168.1.181:~/` 将密钥发给服务端
服务端执行`cat id_rsa.pub >> .ssh/authorized_keys` 将客户端密钥添加到登录可登录密钥列表里
服务端执行`chmod 600 .ssh/authorized_keys` 改变下密钥列表权限

安装工作状态保存软件
========================
`sudo yum install tmux`

安装代码管理工具git
==================
`sudo yum install git`

安装shell 编辑器 
========================
`sudo yum install zsh`
`sudo yum install vim`
安装oh-my-zsh
```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

安装nginx
=============
`yum localinstall http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm`
`yum install nginx`
`systemctl start nginx.service`

安装mysql
=============
`yum localinstall  http://dev.mysql.com/get/mysql57-community-release-el7-7.noarch.rpm`
`yum install mysql-community-server`
`yum install mysql-community-devel`
`systemctl start  mysqld.service`
`service mysqld status` 出现PID说明启动成功
`grep 'temporary password' /var/log/mysqld.log`
`mysql -uroot -p`
`mysql>  ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';`
`mysql> quit;`

安装PHP
=============
`yum install libxml2 libxml2-devel openssl openssl-devel bzip2 bzip2-devel libcurl libcurl-devel libjpeg libjpeg-devel libpng libpng-devel freetype freetype-devel gmp gmp-devel libmcrypt libmcrypt-devel readline readline-devel libxslt libxslt-devel
`
安装编译环境
`yum -y install libjpeg-devel libpng-devel libtiff-devel fontconfig-devel freetype-devel libXpm-devel gettext-devel openssl openssl-devel libtool-ltdl-devel gcc gcc-c++ ncurses ncurses-devel`
在`php-7.0.9`里面使用我的库`git@git.coding.net:caokaiyan/code.git`里的配置 
`sudo bash phpinstall`配置
`sudo make` 编译
`sudo make install`安装
`vim /etc/profile` 末尾加上
```

PATH=$PATH:/usr/local/php/bin
export PATH
```
`source /etc/profile` 立即生效
`php -v` 测试下

在`php-7.0.9`里执行下面代码,配置好php
```
$ cp php.ini-production /etc/php.ini
$ cp /usr/local/php/etc/php-fpm.conf.default /usr/local/php/etc/php-fpm.conf$ cp /usr/local/php/etc/php-fpm.d/www.conf.default /usr/local/php/etc/php-fpm.d/www.conf
$ cp sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm
$ chmod +x /etc/init.d/php-fpm
```
`/etc/init.d/php-fpm start` 开启php-fpm
开启虚拟域名
=====================
`vim /etc/nginx/conf.d/jizipu.com.conf`
```
server {
    listen       80;
    server_name  test.jizipu.com;
    index  index.php index.html index.htm;
    root   /home/cky/workspace/test;
    location / {
        root   /home/cky/workspace/test;
        try_files $uri $uri/ /index.php?$args;
        }
    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    location ~ \.php$ {
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        include        fastcgi_params;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
    }
}
```

nginx php-fpm 权限问题 
=================
个人喜欢将项目放在`～／workspace`下面 , `～／`的权限为 `drwx------`,除了root和本用户,其它用户根本无法访问该目录下的任何东西 
nginx 是以 nginx 用户运行的(可使用root运行)
php-fpm 也是使用nginx 或者php-fpm用户运行的(php-fpm不能使用root运行)
假设lnmp的架构都配置正确了，那么会有下面几种情况
1. php-fpm 和 nginx 都使用 nginx 运行
则根本访问不到 `~/` 里的项目
2. nginx 使用 root , php-fpm 使用nginx或者php-fpm
`~/` 目录下面的项目里的静态文件可以被访问，但转发给php-fpm访问的`*.php`就会报错 `file not found`了

解决方案 ： 
1. 将nginx设置为root用户运行 , php-fpm 设置为本用户运行
2. 将本用户目录的权限修改为 `drwxr-xr-x` , 开放写和执行权限给外部用户,这样可能带来隐私泄露问题,
可以通过建立个 `~/own` 文件夹 ,权限设置为 `drwx------`,将所有隐私文件放在里面


# centos 命令
##服务相关
`systemctl start|stop|restart nginx.service` 启动｜关闭｜重启某项服务
`systemctl enable httpd.service` 开机自启动
`systemctl disable httpd.service` 关闭开机自启动
`systemctl status httpd.service` 查看服务状态
`systemctl list-units --type=service` 列出启动的服务

## 更新yum源到阿里云
第一步：备份你的原镜像文件，以免出错后可以恢复
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
第三步：运行yum makecache生成缓存
yum makecache


# 安装lnmp架构
###配置 YUM 源
CentOS 7 的 默认 YUM 源里的软件包版本可能不是最新的，如果要安装最新的软件包就得配置下 YUM 源。
配置 YUM 源可以通过直接安装 RPM (Red Hat Package Manager) 包，或者修改 Repository，本文讲解通过安装 RPM 方式。
首先需要安装 EPEL ( Extra Packages for Enterprise Linux ) YUM 源，用以解决部分依赖包不存在的问题：
`sudo yum install -y epel-release`

#编译安装lnmp
安装依赖
```
yum -y install libjpeg-devel libpng-devel libtiff-devel fontconfig-devel freetype-devel libXpm-devel gettext-devel openssl openssl-devel libtool-ltdl-devel gcc gcc-c++ ncurses ncurses-devel
```
编译安装pcre
```
wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.39.tar.gz
```
安装pcre-devel
`yum -y install pcre-devel`
安装nginx
```
wget [http://nginx.org/download/nginx-1.10.1.tar.gz](http://nginx.org/download/nginx-1.10.1.tar.gz)
useradd -s /sbin/nologin nginx
./configure --user=nginx --group=nginx --prefix=/usr/local/nginx/ --with-http_stub_status_module --with-http_ssl_module --with-sha1=/usr/libmake && make install/usr/local/nginx/sbin/nginx  #启动nginx
```


概述
==============
linux 下只分两种安装包
`1. 源代码包`
`2. 二进制包`
脚本安装包和yum在线安装也只是做了些自动化和管理的工作
这些包都是编译的包，不同于一些工作在`java,php,python,nodejs`上面的包,那些包不需要安装的,直接就可以用

二进制包
==============

`sudo rpm -ivh package-name-full-name` 安装rpm包,要解决依赖问题，安装包之前,要先安装它依赖的包
`sudo rpm -Uvh package-name-update-full-name` 升级rpm包,如果之前没装过这个包的话,那就等同于安装命令
`sudo rpm -e package-name` 卸载包,也是要解决依赖问题,不能卸载被别的包依赖的包
`sudo rpm -qa` 列出系统中安装的所有rpm包,查询的话，用grep过滤一下
`sudo rpm -i[p] package-name` 查询这个软件包信息,主要用于找它的官方网站,解决bug; -p用于未安装包
`sudo rpm -l[p] package-name` 查询这个软件包安装后所有文件的位置;-p 用于未安装包
`sudo rpm -qf file_name` 查询这个文件属于哪个软件包,必须是这个软件包产生的文件
`sudo rpm -qR[p] package-name` 查询这个包依赖的包／文件／库
`sudo rpm -V package-name` 校验这个包文件，看哪些文件做了修改
`rpm2cpio 包全名|cpio -idv ./bin/ls`将包中的/bin/ls文件取出到当前目录

解决依赖
`www.rpmfind.net` 查询库文件在哪个软件包里，安装那个软件包,库就会自动安装上

运行软件
使用`rpm包`安装的软件会将一些启动命令放在指定的文件夹(如`/etc/init.d/`)下，因此可以使用`linux`或者`CentOS`自定义的命令来运行软件
```
/etc/init.d/httpd start   # linux 标准启动方式
service httpd start    # CentOs 自定义的
```

yum 在线安装管理
========================
为解决依赖而生：树形依赖 ｜ 环形依赖 ｜ 库文件依赖
redhat 的 yum 需要付费

####yum 源文件
`cd /etc/yum.repos.d`
`vim /etc/yum.repos.d/CenOS-Base.repo`
```
[base]  容器名称
name   容器说明，随便写
mirrorlist=http://...   #yum源镜像站点
baseurl #yum源服务器地址
enabled=1 #此容器生效
gpgcheck=1 #数字证书验证
gpgkey=file:///etc/pki/rpm... # 数字证书
```

#### 使用光盘作为本地yum源
`mkdir /mnt/cdrom` 建立挂载点
`mount /dev/sr0  /mnt/cdrom/` 挂载光盘,假设它的设备文件为/dev/sr0
`mv CentOS-Base.repo CentOS-Base.repo.bak` 关闭网络yum源
`vim CentOS-Media.repo` 启用Media yum源
```
[c6-media]
name=CentOS-$releasever-Media
baseurl=file:///mnt/cdro
#    file:///media/cdrom
#    file:///media/cdrecorder
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6
```

####官方源头
base[默认打开]
updates[默认打开]
extras[默认打开]

####第三方源
问题
1. 第三方源和官方源有相同的包，导致官方源的包被第三方源替代
2. 多个第三方源中存在同一个软件包，版本不一致，存在冲突

选择第三方源-原则
1. 确保第三方源不会替换官方源中的包
2. 尽量少使用第三方源，保证第三方源之间不会冲突

推荐大型第三方源
EPEL [与官方源不冲突]
ELRepo [包含各种硬件驱动]
Nux Dextop [多媒体相关软件包][与EPEL个别软件冲突]

小型第三方源
Google Chrome [仅包含Google Chrome]
Adobe [仅包含Flash]
dropbox [仅包含dropbox]

####yum命令
安装软件原则: linux 最小化安装 , 尽量不卸载
`yum list` 列出源里所有软件包
`yum search 关键字` 搜索源里面的软件包 
`yum install -[y] 包名` 安装软件包 ,-y 自动安装,不需要询问管理员
`yum remove -[y] 包名` 卸载包
`yum grouplist` 列出组包
`yum groupinstall` 安装组包
`yum groupremove` 卸载

编译安装
=================
为什么要编译安装

1. 官方软件太久
2. 多个源的软件存在冲突
3. 手动编译软件，默认位置为`/usr/local`下不同子目录下,使得软件更新和删除变得很麻烦

编译安装的软件没有卸载命令，卸载就是把所有这个软件的文件删除
如果不指定安装目录，这类软件的默认安装目录都是 `/usr/local` ，最终文件会被分别放在 `/usr/local` 的 `bin、lib、share、man `目录下，我们卸载起来非常麻烦。所以源码安装的策略是：
指定安装目录为`/usr/local/软件名`,再手动将该软件的 bin 目录加入到PATH 中,或者将执行命令软链接到执行目录下
```
tar -zxvf  xxx.tar.gz
./configure  --prefix=/usr/local/xxxx
make #编译
sudo make install  #安装
```
如果之前`./configure`错了，可以再configure一次
`make`出错了，可以用`make clean`清理下之前产生编译好的文件
卸载就是 `sudo rm -r xxxx`

#### 编译安装和rpm安装区别
1. 安装软件位置的不同
2. 编译安装没有`rpm包`软件的默认启动执行等功能
将`/usr/local/包名/bin/xxx`等命令软连接到`/etc/init.d/`目录下,就可以使用`linux`或者`CentOS`默认软件管理命令来启动软件了[解决方案]


#SElinux

系统运行状态执行`setenforce 0`关闭SELinux
永久关闭`/etc/sysconfig/selinux`
```
# This file controls the state of SELinux on the system.# SELINUX= can take one of these three values:# enforcing - SELinux security policy is enforced.# permissive - SELinux prints warnings instead of enforcing.# disabled - No SELinux policy is loaded.#SELINUX=enforcingSELINUX=disabled# SELINUXTYPE= can take one of these two values:# targeted - Targeted processes are protected,# mls - Multi Level Security protection.SELINUXTYPE=targeted

```
重启linux
