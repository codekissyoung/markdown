## ﻿1、在主配置文件中中包含Apache vitualHost模块 ##
```
Include conf/extra/httpd-vhosts.conf #apache2.2配置
IncludeOptional sites-enabled/*.conf #ubuntu apache2.4配置
```
## 2、将虚拟主机的文件目录设置为可以访问的 ##
![这里写图片描述](http://img.blog.csdn.net/20150914111258795)

## 3、开启分布式文件.htaccess可重写 ##
```
AllowOverride  All 
主要是实现网站单入口访问！
```

##4、写虚拟主机配置 ##
![这里写图片描述](http://img.blog.csdn.net/20150914111416006)

## 5,开启站点 ##
```
#apache2.2 中写在Include conf/extra/httpd-vhosts.conf中
#ubuntu apache2.4 在sites-available/ 中自己创建文件,每一个文件就是一个虚拟主机配置，使用sudo a2ensite api.com(文件名)激活，sudo a2dissite api.com 停用
```
![这里写图片描述](http://img.blog.csdn.net/20150914111534558)



## url重写 ##
```
http://www.example.com/USA/California/San_Diego  
“/USA/California/San_Diego” 是能够Rewrite的字符串！
重写：就是实现URL的跳转和隐藏真实地址，基于Perl语言的正则表达式规范。平时帮助我们实现拟静态，拟目录，域名跳转，防止盗链等 
```
## .htaccess ##
```
RewriteEnine on 
RewriteRule  ^/t_(.*).html$  /test.php?id = $1
#当访问任何以t_开头，以.html结尾的文件时，将$1用与(.*)匹配的字符替换后，访问相应的test.php页面
RewriteRule ^/test([0-9]*).html$ /test.php?id=$1
RewriteRule ^/new([0-9]*)/$ /new.php?id=$1 [R]
#当我们访问的地址不是以www.163.com开头的，那么执行下一条规则
RewriteCond %{HTTP_HOST} !^www.163.com [NC]
RewriteRule ^/(.*) http://www.163.com/ [L]
```
## Apache Rewrite规则修正符  ##
```
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


安装好Apache 2.4 后
1，开启重写模块
$ sudo  a2enmod  rewrite
2，指定重写目录
sudo  vim  /etc/apache2/sites-enabled/000-default
在该文件后面添加上
![000-default 文件配置](http://img.blog.csdn.net/20150430120333283)
Virtualhost 是配置虚拟主机
pms.com 是在/etc/hosts 中配置的映射到127.0.0.1本地的域名
/etc/hosts 文件中  
127.0.0.1			pms.com
Directory  是配置重写目录，也就是 .htaccess 文件生效的目录！



