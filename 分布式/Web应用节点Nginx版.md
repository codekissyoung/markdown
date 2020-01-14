# Web应用节点 Nginx 版

参考 [Ubuntu 装机指南](https://blog.codekissyoung.com/%E5%88%86%E5%B8%83%E5%BC%8F/UbuntuServer)，获得一个干净的`Server`后，下面可以将这个`Server`做成`Web`应用节点。

## 制作 Nginx + PHP-fpm 节点

### 1. 安装 Nginx

```bash
$ sudo apt-get install nginx
$ pgrep -a nginx
2031 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
2033 nginx: worker process                           
2034 nginx: worker process
$ sudo netstat -natp
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      2031/nginx: master  
tcp6       0      0 :::80                   :::*                    LISTEN      2031/nginx: master  
$ sudo lsof -i:80
nginx   2031     root    6u  IPv4  22976      0t0  TCP *:http (LISTEN)
nginx   2033 www-data    6u  IPv4  22976      0t0  TCP *:http (LISTEN)
$ sudo systemctl restart nginx.service      # 重启
$ dpkg -S nginx | grep conf                 # 查看软件包安装后的所有文件清单
```

### 2. 安装 php-fpm

```bash
$ sudo apt-get install php7.2-fpm           # 直接安装 php-fpm ，就不会带有 apache2 了 ^_^
```

### 3. 配置 nginx 链接上 php-fpm

首先需要知道`php-fpm`到底是监听`named sock`还是`socket`,以及监听位置（或端口），查阅`php-fpm`的配置：

![](https://img.codekissyoung.com/2019/11/28/533543b1767f3962a4919d2360c973c9.png)

```bash
link@link2:/etc/nginx/sites-available$ sudo cp default db.link.com.conf # 新建 Virtual Server
```

```conf
server {
    listen 80; 
    listen [::]:80;
    server_name db.link.com;            # 域名
    root /home/link/phpMyAdmin;         # 代码根目录
    index index.php index.html;         # 入口文件 index.php
    location / { 
        try_files $uri $uri/ =404;
    }
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php7.2-fpm.sock; # 将 php 文件发送给php-fpm处理
    }
}
```

```bash
$ sudo ln -s /etc/nginx/sites-available/db.link.com.conf /etc/nginx/sites-enabled/db.link.com.conf 
```

### 4. 访问验证