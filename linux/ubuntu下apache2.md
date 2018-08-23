# Apache

## 安装
```
sudo aptitude install -y apache2
```

## 管理
```
sudo systemctl start apache2
```

## 检测是否运行
```
➜  ~ sudo lsof -i:80
COMMAND  PID     USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
apache2 7467     root    4u  IPv6  69058      0t0  TCP *:http (LISTEN)
apache2 7472 www-data    4u  IPv6  69058      0t0  TCP *:http (LISTEN)
apache2 7473 www-data    4u  IPv6  69058      0t0  TCP *:http (LISTEN)
apache2 7474 www-data    4u  IPv6  69058      0t0  TCP *:http (LISTEN)
apache2 7475 www-data    4u  IPv6  69058      0t0  TCP *:http (LISTEN)
apache2 7476 www-data    4u  IPv6  69058      0t0  TCP *:http (LISTEN)
```

## 配置文件 `/etc/apache2`
```
➜  apache2 tree -L 1
.
├── apache2.conf # 加载配置的入口文件
├── conf-available # 所有可用的配置
├── conf-enabled # 启用的配置
├── envvars # 环境变量的设置
├── magic # mod_mime_magic 模块的数据
├── mods-available # 所有可用的模块
├── mods-enabled # 启用的模块
├── ports.conf # 设置apache2监听的端口，默认80
├── sites-available # 所有的虚拟主机
└── sites-enabled # 启用的虚拟主机
```







