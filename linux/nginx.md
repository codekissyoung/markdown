# Nginx

## 配置
```nginx
#全局块 主要设置一些影响Ngnix整体运行的配置指令
events {
    # events 块
}
```

## 全局块设置
`worker_processes  3;`        启动的worker进程数为3,启动进程,通常设置成和cpu的数量相等

`user nobody nobody;`         user指令设置哪些用户/组可以启动nginx,nobody是所有用户都可以

`pid /home/caokaiyan/workspace/etc_sh/nginx/nginx.pid;`   设置nginx运行时,pid的存放路径

`error_log /home/caokaiyan/workspace/etc_sh/nginx/nginx_error.log debug;`

错误日志,debug 以上级别错误会被记录下来

日志级别：debug info notice warn error crit alert emerg


## events 块
`worker_connections  1024;`    #每个worker进程的最大链接数为1024
`accept_mutex on;`             #对多个nginx进程接收链接进行序列化,防止进程对连接的抢夺
`use epoll;`                   #使用 epoll 事件驱动模型(其余模型有select,poll等),epoll是多路复用IO(I/O Multiplexing)中的一种方式,但是仅用于linux2.6以上内核,可以大大提高nginx的性能

## http 块
`include       mime.types;`   #将其他nginx配置(写在别的文件里)包含进来
`default_type  application/octet-stream;`     #处理前端请求的MIME类型
`access_log    /var/log/nginx/access.log;` #设定日志格式
`sendfile        on;`           #允许传输文件
`sendfile_max_chunk 1024k;`                   #上传的文件不能超过1M,设置为０的话表示无限制
`keepalive_timeout  65;`   #设置连接超时
`gzip  on;`     #开启压缩
`client_header_buffer_size    1k;` 设定请求缓冲
`large_client_header_buffers  4 4k;`

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


## http块 里面的server块
`listen       80;`   #监听80端口上的所有ip连接
`server_name  site1.com;`  #域名
```
location / {
    root /var/www/site1;    #站点根目录
    index  index.html index.htm;
}
```
```
   # 定义错误提示页面
    error_page   500 502 503 504 /50x.html;
        location = /50x.html {
        root   /root;
    }
```
```
#默认请求
    location / {
          root   /root;      #定义服务器的默认网站根目录位置
          index index.php index.html index.htm;   #定义首页索引文件的名称

          fastcgi_pass  www.xx.com;
         fastcgi_param  SCRIPT_FILENAME  $document_root/$fastcgi_script_name;
          include /etc/nginx/fastcgi_params;
        }

```
```
 #静态文件，nginx自己处理
    location ~ ^/(images|javascript|js|css|flash|media|static)/ {
        root /var/www/virtual/htdocs;
        #过期30天，静态文件不怎么更新，过期可以设大一点，如果频繁更新，则可以设置得小一点。
        expires 30d;
    }
```
```
    #PHP 脚本请求全部转发到 FastCGI处理. 使用FastCGI默认配置.
    location ~ \.php$ {
        root /root;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME /home/www/www$fastcgi_script_name;
        include fastcgi_params;
    }
```
```
    #设定查看Nginx状态的地址
    location /NginxStatus {
        stub_status            on;
        access_log              on;
        auth_basic              "NginxStatus";
        auth_basic_user_file  conf/htpasswd;
    }
```
```
    #禁止访问 .htxxx 文件
    location ~ /\.ht {
        deny all;
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
