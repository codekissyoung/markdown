# Apache服务器

## apache https 配置

### 申请证书

- [腾讯免费证书申请](https://www.qcloud.com/product/ssl)

```bash
➜ www.dadishe.com tree
.
├── Apache
│   ├── 1_root_bundle.crt
│   ├── 2_www.dadishe.com.crt
│   └── 3_www.dadishe.com.key
├── IIS
│   ├── keystorePass.txt
│   └── www.dadishe.com.pfx
├── Nginx
│   ├── 1_www.dadishe.com_bundle.crt
│   └── 2_www.dadishe.com.key
├── Tomcat
│   ├── keystorePass.txt
│   └── www.dadishe.com.jks
└── www.dadishe.com.zip
```

### 开启Apache ssl mod

```bash
➜ apache2 apache2 -v
Server version: Apache/2.4.18 (Ubuntu)
Server built: 2017-06-26T11:58:04
➜ apache2 sudo a2enmod ssl
Considering dependency setenvif for ssl:
Module setenvif already enabled
Considering dependency mime for ssl:
Module mime already enabled
Considering dependency socache_shmcb for ssl:
Module socache_shmcb already enabled
Module ssl already enabled
```

### 配置虚拟站点 参考配置

```bash
<VirtualHost *:80>
    ServerName www.dadishe.com
    Redirect permanent / https://www.dadishe.com
</VirtualHost>

<VirtualHost *:443>
    SSLEngine on
    SSLCertificateFile /home/cky/cert/www.dadishe.com/apache/2_www.dadishe.com.crt
    SSLCertificateKeyFile /home/cky/cert/www.dadishe.com/apache/3_www.dadishe.com.key
    ServerName www.dadishe.com
    DocumentRoot /var/www/html
    ErrorLog ${APACHE_LOG_DIR}/www.dadishe.com.error.log
    CustomLog ${APACHE_LOG_DIR}/www.dadishe.com.access.log combined
</VirtualHost>
# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
```

## Apache 虚拟主机配置

### 1、在主配置文件中中包含Apache vitualHost模块

```conf
Include conf/extra/httpd-vhosts.conf #apache2.2配置
IncludeOptional sites-enabled/*.conf #ubuntu apache2.4配置
```

### 2、将虚拟主机的文件目录设置为可以访问的

![这里写图片描述](http://img.blog.csdn.net/20150914111258795)

### 3、开启分布式文件.htaccess可重写

```conf
AllowOverride  All # 主要是实现网站单入口访问！
```

### 4、写虚拟主机配置

![000-default 文件配置](http://img.blog.csdn.net/20150430120333283)

### url重写

```conf
http://www.example.com/USA/California/San_Diego  
“/USA/California/San_Diego” 是能够Rewrite的字符串！
重写：就是实现URL的跳转和隐藏真实地址，基于Perl语言的正则表达式规范。平时帮助我们实现拟静态，拟目录，域名跳转，防止盗链等 
```

### .htaccess

```conf
RewriteEnine on 
RewriteRule  ^/t_(.*).html$  /test.php?id = $1
#当访问任何以t_开头，以.html结尾的文件时，将$1用与(.*)匹配的字符替换后，访问相应的test.php页面
RewriteRule ^/test([0-9]*).html$ /test.php?id=$1
RewriteRule ^/new([0-9]*)/$ /new.php?id=$1 [R]
#当我们访问的地址不是以www.163.com开头的，那么执行下一条规则
RewriteCond %{HTTP_HOST} !^www.163.com [NC]
RewriteRule ^/(.*) http://www.163.com/ [L]
```

### Apache Rewrite规则修正符

```conf
1) R 强制外部重定向
2) F 禁用URL,返回403HTTP状态码。
3) G 强制URL为GONE，返回410HTTP状态码。
4) P 强制使用代理转发。
5) L 表明当前规则是最后一条规则，停止分析以后规则的重写。
6) N 重新从第一条规则开始运行重写过程。
7) C 与下一条规则关联
如果规则匹配则正常处理，以下修正符无效
8) T=MIME-type(force MIME type) 强制MIME类型
9) NS 只用于不是内部子请求
10) NC 不区分大小写
11) QSA 追加请求字符串
12) NE 不在输出转义特殊字符 \%3d$1 等价于 =$1
```
