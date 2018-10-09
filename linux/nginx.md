# Nginx

## 安装
```
sudo aptitude install -y nginx
```

## 启动
```
sudo systemctl start nginx.service
```

## 检测是否启动
```shell
cky@codekissyoung2:~$ sudo lsof -i:80
COMMAND     PID     USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
AliYunDun   957     root   18u  IPv4  14418      0t0  TCP 192.168.1.189:51318->140.205.140.205:http (CLOSE_WAIT)
AliYunDun   979     root   18u  IPv4  14418      0t0  TCP 192.168.1.189:51318->140.205.140.205:http (CLOSE_WAIT)
AliYunDun   979     root   20u  IPv4  47862      0t0  TCP 192.168.1.189:53316->106.11.68.13:http (ESTABLISHED)
nginx     29624     root    6u  IPv4 364742      0t0  TCP *:http (LISTEN)
nginx     29624     root    7u  IPv6 364743      0t0  TCP *:http (LISTEN)
nginx     29625 www-data    6u  IPv4 364742      0t0  TCP *:http (LISTEN)
nginx     29625 www-data    7u  IPv6 364743      0t0  TCP *:http (LISTEN)
```

## 配置目录
```shell
cky@codekissyoung2:/etc/nginx$ ls -l
total 56
drwxr-xr-x 2 root root 4096 Jul 12 18:34 conf.d  # 一般性的配置文件
-rw-r--r-- 1 root root 1077 Feb 12  2017 fastcgi.conf  # FastCGI 配置文件 
-rw-r--r-- 1 root root 1007 Feb 12  2017 fastcgi_params # FastCGI 默认参数
-rw-r--r-- 1 root root 2837 Feb 12  2017 koi-utf
-rw-r--r-- 1 root root 2223 Feb 12  2017 koi-win
-rw-r--r-- 1 root root 3957 Feb 12  2017 mime.types  # 资源的媒体类型相关配置
-rw-r--r-- 1 root root 1462 Feb 12  2017 nginx.conf  # 主配置文件
-rw-r--r-- 1 root root  180 Feb 12  2017 proxy_params
-rw-r--r-- 1 root root  636 Feb 12  2017 scgi_params
drwxr-xr-x 2 root root 4096 Aug  8 17:39 sites-available # 所有配置的虚拟主机的配置
drwxr-xr-x 2 root root 4096 Aug  8 17:39 sites-enabled  # 已经启用的虚拟主机的配置
drwxr-xr-x 2 root root 4096 Aug  8 17:39 snippets
-rw-r--r-- 1 root root  664 Feb 12  2017 uwsgi_params
-rw-r--r-- 1 root root 3071 Feb 12  2017 win-utf
```

## Ubuntu下彻底删除Nginx，重新安装

- 如果自己手动删除Nginx后，删除`/etc/nginx`目录后，或者其他相关文件后，再次重装，可能会发生安装不上的问题，所以要 **完全清理**,以下是方法

```bash
# 1. 关闭Nginx进程

# 2. --purge 删除Nginx所有包
dpkg --get-selections | grep nginx
sudo apt-get --purge remove nginx
sudo apt-get --purge remove nginx-common
sudo apt-get --purge remove nginx-core
```

## 配置

```nginx
# 全局块 主要设置一些影响Ngnix整体运行的配置指令

worker_processes  3; # 启动的worker进程数为3,启动进程,通常设置成和cpu的数量相等
user nobody nobody;  # user指令设置哪些用户/组可以启动nginx,nobody是所有用户都可以
pid /home/caokaiyan/workspace/etc_sh/nginx/nginx.pid; # 设置nginx运行时,pid的存放路径
# 错误日志,debug 以上级别错误会被记录下来，日志级别：debug info notice warn error crit alert emerg
error_log /home/caokaiyan/workspace/etc_sh/nginx/nginx_error.log debug;

# events 块
events {
    worker_connections  1024; # 每个worker进程的最大链接数为1024
    accept_mutex on;          # 对多个nginx进程接收链接进行序列化,防止进程对连接的抢夺
    use epoll;                # 使用 epoll 事件驱动模型(其余模型有select,poll等)
}

# http 块
http {
    include       mime.types;                # 将其他nginx配置(写在别的文件里)包含进来
    default_type  application/octet-stream;  # 处理前端请求的MIME类型
    access_log    /var/log/nginx/access.log; # 日志文件
    sendfile        on;                      # 允许传输文件
    sendfile_max_chunk 1024k;                # 上传的文件不能超过1M,设置为０的话表示无限制
    keepalive_timeout  65;                   #  设置连接超时
    gzip  on;                                # 开启压缩
    client_header_buffer_size    1k;         # 设定请求缓冲
    large_client_header_buffers  4 4k;       #

    # 虚拟主机块
    server{
        listen       80;                       # 监听80端口上的所有ip连接
        server_name  nginx.codekissyoung.com;  # 绑定域名
        location / {
            root /var/www/site1;    # 站点根目录
            index  index.php index.html index.htm;
        }

        # 定义错误提示页面
        error_page   500 502 503 504 /50x.html;
        location = /50x.html {
            root   /root;
        }

        # 静态文件，nginx自己处理
        location ~ ^/(images|javascript|js|css|flash|media|static)/ {
            root /var/www/virtual/htdocs;
            # 过期30天，静态文件不怎么更新，过期可以设大一点，如果频繁更新，则可以设置得小一点。
            expires 30d;
        }

        # PHP 脚本请求全部转发到 FastCGI处理. 使用FastCGI默认配置.
        location ~ \.php$ {
            root /root;
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME /home/www/www$fastcgi_script_name;
            include fastcgi_params;
        }

        # 禁止访问 .htxxx 文件
        location ~ /\.ht {
            deny all;
        }

        # 设定查看Nginx状态的地址
        location /NginxStatus {
            stub_status            on;
            access_log             on;
            auth_basic             "NginxStatus";
            auth_basic_user_file  conf/htpasswd;
        }
    }
}
```

## 负载均衡时nginx http配置

```nginx
#设定http服务器，利用它的反向代理功能提供负载均衡支持
http {
     #设定mime类型,类型由mime.type文件定义
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    #设定日志格式
    access_log    /var/log/nginx/access.log;

    #省略上文有的一些配置节点

    #。。。。。。。。。。

    #设定负载均衡的服务器列表
     upstream mysvr {
    #weigth参数表示权值，权值越高被分配到的几率越大
    server 192.168.8.1x:3128 weight=5;#本机上的Squid开启3128端口
    server 192.168.8.2x:80  weight=1;
    server 192.168.8.3x:80  weight=6;
    }

   upstream mysvr2 {
    #weigth参数表示权值，权值越高被分配到的几率越大

    server 192.168.8.x:80  weight=1;
    server 192.168.8.x:80  weight=6;
    }

   #第一个虚拟服务器
   server {
    #侦听192.168.8.x的80端口
        listen       80;
        server_name  192.168.8.x;

      #对aspx后缀的进行负载均衡请求
    location ~ .*\.aspx$ {

         root   /root;      #定义服务器的默认网站根目录位置
          index index.php index.html index.htm;   #定义首页索引文件的名称

          proxy_pass  http://mysvr ;#请求转向mysvr 定义的服务器列表

          #以下是一些反向代理的配置可删除.

          proxy_redirect off;

          #后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          client_max_body_size 10m;    #允许客户端请求的最大单文件字节数
          client_body_buffer_size 128k;  #缓冲区代理缓冲用户端请求的最大字节数，
          proxy_connect_timeout 90;  #nginx跟后端服务器连接超时时间(代理连接超时)
          proxy_send_timeout 90;        #后端服务器数据回传时间(代理发送超时)
          proxy_read_timeout 90;         #连接成功后，后端服务器响应时间(代理接收超时)
          proxy_buffer_size 4k;             #设置代理服务器（nginx）保存用户头信息的缓冲区大小
          proxy_buffers 4 32k;               #proxy_buffers缓冲区，网页平均在32k以下的话，这样设置
          proxy_busy_buffers_size 64k;    #高负荷下缓冲大小（proxy_buffers*2）
          proxy_temp_file_write_size 64k;  #设定缓存文件夹大小，大于这个值，将从upstream服务器传

       }
     }
}
```


```
#设定负载均衡的服务器列表
     upstream mysvr {
    #weigth参数表示权值，权值越高被分配到的几率越大
    #本机上的Squid开启3128端口
    server 192.168.8.1:3128 weight=5;
    server 192.168.8.2:80  weight=1;
    server 192.168.8.3:80  weight=6;
    }
```