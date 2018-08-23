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

## 配置nginx服务器
- nginx.conf 主配置文件
```

```