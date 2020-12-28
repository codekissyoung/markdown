# Nginx

## ubuntu apt-get 安装

```bash
sudo aptitude install -y nginx          # 安装
sudo systemctl start nginx.service      # 启动
cky@codekissyoung2:~$ sudo lsof -i:80   # 检测是否启动
cky@cky-pc:/etc/nginx$ tree -L 1
├── conf.d                  # 一般性的配置文件
├── fastcgi.conf            # FastCGI 配置文件
├── fastcgi_params          # FastCGI 默认参数
├── mime.types              # 资源的媒体类型相关配置
├── modules-available
├── modules-enabled
├── nginx.conf              # 主配置文件
├── proxy_params
├── scgi_params
├── sites-available         # 所有配置的虚拟主机的配置
├── sites-enabled           # 已经启用的虚拟主机的配置
├── snippets
```

## Ubuntu 下彻底删除 Nginx 重新安装

如果自己手动删除 Nginx 后，删除`/etc/nginx`目录后，或者其他相关文件后，再次重装，可能会发生安装不上的问题，所以要 **完全清理**, 以下是方法

```bash
# 1. 关闭Nginx进程

# 2. --purge 删除Nginx所有包
dpkg --get-selections | grep nginx
sudo apt-get --purge remove nginx
sudo apt-get --purge remove nginx-common
sudo apt-get --purge remove nginx-core
```

## 编译安装 Nginx

```bash
# 安装依赖
sudo apt-get install openssl libssl-dev
sudo apt-get install libpcre3 libpcre3-dev
sudo apt-get install zlib1g-dev

cd /home/cky/software/nginx-1.15.5              # 进入解压好的安装包目录
./configure --prefix=/home/cky/software/nginx   # 配置好软件安装目录

cd /home/cky/software/nginx/sbin                         # 进入可执行文件目录
sudo ./nginx -c /home/cky/software/nginx/conf/nginx.conf # 运行Nginx

sudo ./nginx -s [ stop | quit | reopen | reload ]        # 常用命令
sudo ./nginx -t -c /home/cky/software/nginx/conf/nginx.conf # 检查配置是否有语法错误

# 也可以使用信号控制 Nginx 进程 kill -信号 master-pid
TERM, INT 快速关闭
QUIT 平滑关闭
HUP 平滑重启
USR1 重新打开日志文件，在切割日志时用途比较大
USR2 平滑升级可执行程序
WINCH 从容关闭工作进程
```

## Nginx 平滑升级

- 将`./sbin/nginx`旧版本备份成`./sbin/nginx.2018.10.09`,然后将新编译好的 nginx 版本移入`./sbin`
- 执行`sudo kill -USR2 旧版本的Nginx主进程号`
- 旧版本 Nginx 的主进程将重新命名它的`.pid`文件为`.pid.oldbin`,然后执行新版本的 Nginx 可执行程序，依次启动新的主进程和新的工作进程
- 此时新、旧版本的 Nginx 实例会同时运行，共同处理输入的请求，要逐步停止旧版本的 Nginx 实例，必须发送`WINCH`信号给旧的主进程，平滑关闭它,命令为`sudo kill -WINCH 旧版本Nginx主进程号`
- 一段时间后，旧的工作进程处理了所有已连接的请求后退出，仅由新的 Nginx 工作进程来处理输入的请求了

## 配置

```nginx
# 全局块 主要设置一些影响Ngnix整体运行的配置指令
worker_processes  3;
user nobody nobody; # 设置哪些用户/组可以启动nginx,nobody是所有用户都可以
pid /home/caokaiyan/workspace/etc_sh/nginx/nginx.pid; # pid 路径
# 错误日志路径,日志级别：debug info notice warn error crit alert emerg
error_log /home/caokaiyan/workspace/etc_sh/nginx/nginx_error.log info;
```

```nginx
# events 块
events {
    worker_connections  1024; # 每个 worker 最大链接数
    accept_mutex on;          # 进程接收链接进行序列化,防止惊群
    # 惊群问题: 当一个网络连接到来时，多个睡眠进程会被同时唤醒
    # 但只有一个进程会获得连接，如果每次唤醒的进程数目太多，
    # 会影响一部分系统性能,在Nginx多进程下会出现这样的问题
    multi_accept on;          # worker 能同时接收多个新到达的网络连接
    use epoll;                # 强制使用 epoll
}
```

```nginx
# http 块
http {
    include       mime.types;                # 将其他nginx配置包含进来,相对路径
    default_type  application/octet-stream;  # 处理前端请求的MIME类型
    access_log    /var/log/nginx/access.log combined; # 日志文件
    sendfile        on;                      # 允许传输文件
    sendfile_max_chunk 1024k;                # 上传的文件不能超过1M,设置为０的话表示无限制
    keepalive_timeout  65;                   # 服务端对链接的保持时间
    gzip  on;                                # 开启压缩
    client_header_buffer_size    1k;         # 设定请求缓冲
    large_client_header_buffers  4 4k;       #

    # 主机块，后面详细讲
    Server{
        # ...
    }
}
```

```nginx
server{
    listen       80;                       # 监听80端口上的所有ip连接
    server_name  nginx.codekissyoung.com;  # 绑定域名
    error_page   500 502 503 504 /50x.html;

    # location 块基于 域名/uri-string 中的 /uri-string 部分进行匹配，对特定的请求进行处理。
    # 地址重定向，数据缓存，应答控制等功能都是在这部分实现
    location / {
        root /var/www/site1;    # 站点根目录
        index  index.php index.html index.htm;
    }
    location = /50x.html {
        root   /root;
    }
    location ~ ^/(images|javascript|js|css|flash|media|static)/ { # 静态文件，nginx自己处理
        root /var/www/virtual/htdocs;
        expires 30d; # 过期时间30天
    }
    location ~ \.php$ { # PHP 脚本请求全部转发到 FastCGI处理. 使用FastCGI默认配置.
        root /root;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME /home/www/www$fastcgi_script_name;
        include fastcgi_params;
    }
    location ~ /\.ht { # 禁止访问 .htxxx 文件
        deny all;
    }
    location /NginxStatus { # 设定查看Nginx状态的地址
        stub_status            on;
        access_log             on;
        auth_basic             "NginxStatus";
        auth_basic_user_file  conf/htpasswd;
    }
}
```

`Ubuntu18.04`默认的`nginx`中`Server`的配置参考，隐藏`index.php`并且带`PATHINFO`解析：

```nginx
server {
    listen          80;
    server_name     www.ci.com;
    root            /home/cky/workspace/tp;
    index           index.php index.html;
    rewrite_log     on;

    # url重写: host/welcome/deal => host/index.php/welcome/deal
    location / {
        if ( !-e $request_filename ) {
            rewrite ^/(.*)$ /index.php/$1 last;
            break;
        }
    }
    location ~ \.php($|/) {
        fastcgi_pass                unix:/run/php/php7.2-fpm.sock;
        include                     snippets/fastcgi-php.conf;  # pathinfo 生效
        fastcgi_param               SCRIPT_FILENAME     $document_root$fastcgi_script_name;
        include                     fastcgi_params;
    }
}
```

其实在编译版本，本质上差不多，参考如下：

```nginx
server {
    listen       80;
    server_name  www.pc.com;
    index        index.php index.html index.htm;
    root         /home/cky/workspace/tp322;
    rewrite_log         on;
    location / {
        if ( !-e $request_filename ) {
            rewrite ^/(.*)$ /index.php/$1 last;
            break;
        }
    }
    location ~ \.php($|/) {
        fastcgi_pass   unix:/run/php/php7.2-fpm.sock;
        fastcgi_index  index.php;
        fastcgi_split_path_info ^(.+\.php)(.*)$;
        fastcgi_param  PATH_INFO  $fastcgi_path_info;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }
}
```

## 负载均衡时 nginx http 配置

```nginx
#设定http服务器，利用它的反向代理功能提供负载均衡支持
http {
     #设定mime类型,类型由mime.type文件定义
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    #设定日志格式
    access_log    /var/log/nginx/access.log;
    #设定负载均衡的服务器列表
     upstream mysvr {
    #weigth参数表示权值，权值越高被分配到的几率越大
    server 192.168.8.1x:3128 weight=5;#本机上的Squid开启3128端口
    server 192.168.8.2x:80  weight=1;
    server 192.168.8.3x:80  weight=6;
    }

   upstream mysvr2 {
    # weigth参数表示权值，权值越高被分配到的几率越大
    server 192.168.8.x:80  weight=1;
    server 192.168.8.x:80  weight=6;
    }

   server {
        listen       80; 
        server_name  192.168.8.x;
    # 对aspx后缀的进行负载均衡请求
    location ~ .*\.aspx$ {
         root   /root;      #定义服务器的默认网站根目录位置
          index index.php index.html index.htm;   #定义首页索引文件的名称
          proxy_pass  http://mysvr ;#请求转向mysvr 定义的服务器列表
          # 以下是一些反向代理的配置可删除.

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

```nginx
# 设定负载均衡的服务器列表
upstream mysvr {
    #weigth参数表示权值，权值越高被分配到的几率越大
    #本机上的Squid开启3128端口
    server 192.168.8.1:3128 weight=5;
    server 192.168.8.2:80  weight=1;
    server 192.168.8.3:80  weight=6;
}
```

