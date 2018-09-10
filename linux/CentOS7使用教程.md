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