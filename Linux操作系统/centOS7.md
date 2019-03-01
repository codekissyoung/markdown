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
