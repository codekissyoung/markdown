# 查看系统状态
```
➜  html uname -a
Linux iZ252e1zy6zZ 2.6.32-573.22.1.el6.x86_64 #1 SMP Wed Mar 23 03:35:39 UTC 2016 x86_64 x86_64 x86_64 GNU/Linux
```
内存 `free -m` 以MB为单位 `free -g`以GB为单位
```
➜  html free
             total       used       free     shared    buffers     cached
Mem:       1018508     628632     389876        176      58600     454232
-/+ buffers/cache:     115800     902708
Swap:            0          0          0
```
cpu负载
```
➜  ~ uptime
 11:52:46 up 44 days, 11:01,  1 user,  load average: 0.18, 0.25, 0.19 //系统的平均负载，1分钟，5分钟，15分钟
```
实时负载 `top`
```
[root@linuxprobe ~]# top
top - 20:15:41 up 49 min,  3 users,  load average: 0.41, 0.38, 0.21
Tasks: 236 total,   1 running, 235 sleeping,   0 stopped,   0 zombie
Cpu(s):  0.2%us,  0.5%sy,  0.0%ni, 98.8%id,  0.5%wa,  0.0%hi,  0.0%si,  0.0%st
Mem:   5228872k total,   671136k used,  4557736k free,    28324k buffers
Swap:  4194296k total,        0k used,  4194296k free,   267360k cached

   PID USER      PR  NI  VIRT  RES  SHR S %CPU %MEM    TIME+  COMMAND
     1 root      20   0 19360 1536 1224 S  0.0  0.0   0:05.37 init
     2 root      20   0     0    0    0 S  0.0  0.0   0:00.02 kthreadd
     3 root      RT   0     0    0    0 S  0.0  0.0   0:00.07 migration/0
```
cpu 信息
```
➜  ~ cat /proc/cpuinfo
processor	: 0
vendor_id	: GenuineIntel
cpu family	: 6
model		: 62
model name	: Intel(R) Xeon(R) CPU E5-2650 v2 @ 2.60GHz
stepping	: 4
microcode	: 1064
cpu MHz		: 2593.778
cache size	: 20480 KB
physical id	: 0
siblings	: 1
core id		: 0
cpu cores	: 1
apicid		: 0
initial apicid	: 0
fpu		: yes
fpu_exception	: yes
cpuid level	: 13
wp		: yes
flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat clflush mmx fxsr sse sse2 ht syscall nx rdtscp lm constant_tsc up rep_good unfair_spinlock pni ssse3 cx16 sse4_1 sse4_2 popcnt aes hypervisor lahf_lm
bogomips	: 5187.55
clflush size	: 64
cache_alignment	: 64
address sizes	: 46 bits physical, 48 bits virtual
power management:
```
硬盘使用情况
```
➜  ~ df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/xvda1       40G  2.8G   35G   8% /
tmpfs           498M     0  498M   0% /dev/shm
```
查看分区情况
```
➜  ~ sudo fdisk -l
[sudo] password for cky:

Disk /dev/xvda: 42.9 GB, 42949672960 bytes
255 heads, 63 sectors/track, 5221 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x00078f9c

    Device Boot      Start         End      Blocks   Id  System
/dev/xvda1   *           1        5222    41940992   83  Linux
```

# 支持中文
安装中文语言包
```
yum groupinstall chinese-support
```
`vim /etc/sysconfig/i18n`
```
➜  md git:(master) cat /etc/sysconfig/i18n
LANG="zh_CN.UTF-8"
SUPPORTED="zh_CN.UTF-8:zh_CN:zh:en_US.UTF-8:en_US:en"
SYSFONT="latarcyrheb-sun16"
```
LANG变量，设置系统语言
SUPPORTED变量决定系统支持的语言，即系统能够显示的语言
SYSFONT变量表示系统字体
```
sudo reboot
```


# 新建用户
```
[root@iZ252e1zy6zZ ~]# useradd cky
[root@iZ252e1zy6zZ ~]# passwd cky
[root@iZ252e1zy6zZ ~]# visudo
```
编辑
```
## Allow root to run any commands anywhere
root    ALL=(ALL)       ALL
cky     ALL=(ALL)       ALL ## 新增
```

# 更新和安装软件
```
[root@iZ252e1zy6zZ ~]# yum update
[root@iZ252e1zy6zZ ~]# cal
[root@iZ252e1zy6zZ ~]# date # 查看时间是否正确
[root@iZ252e1zy6zZ ~]# yum install tmux
```

# 切换成普通用户
```
[root@iZ252e1zy6zZ ~]# su cky

[cky@iZ252e1zy6zZ ~]$ tmux new-session -s console # 新建tmux窗口
```

# 安装zsh 并配置 `oh my zsh`
```
[cky@iZ252e1zy6zZ ~]$ sudo yum install zsh

[cky@iZ252e1zy6zZ ~]$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

# 设置下客户端ssh 无密码登录
客户端将自己的`id_rsa.pub`传到服务器上去
```
scp .ssh/id_rsa.pub cky@101.200.144.41:~/
```
服务器端
```
cat id_rsa.pub >> .ssh/authorized_keys
```

# 安装nginx
安装默认的nginx和它的所有模块
```
sudo yum install nginx.x86_64 nginx-all-modules.noarch
```

# 安装 MariaDB
Here is your custom MariaDB YUM repository entry for CentOS. Copy and paste it into a file under /etc/yum.repos.d/ (we suggest naming the file MariaDB.repo or something similar). See "Installing MariaDB with yum" for detailed information.
```
# MariaDB 10.1 CentOS repository list - created 2016-11-15 06:33 UTC
# http://downloads.mariadb.org/mariadb/repositories/
[mariadb]
name = MariaDB
baseurl = http://yum.mariadb.org/10.1/centos6-amd64
gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck=1
```


# 安装php 5.6
## 配置yum源
追加CentOS 6.5的epel及remi源
```
rpm -Uvh http://ftp.iij.ad.jp/pub/linux/fedora/epel/6/x86_64/epel-release-6-8.noarch.rpm
rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-6.rpm
```
使用yum list命令查看可安装的包(Packege)
```
yum list --enablerepo=remi --enablerepo=remi-php56 | grep php
```
安装php 5.6
```
yum install --enablerepo=remi --enablerepo=remi-php56 php php-opcache php-devel php-mbstring php-mcrypt php-mysqlnd php-phpunit-PHPUnit php-pecl-xdebug php-pecl-xhprof php-fpm
```
查看版本
```
➜  ~ php --version
PHP 5.6.28 (cli) (built: Nov  9 2016 07:23:55)
Copyright (c) 1997-2016 The PHP Group
Zend Engine v2.6.0, Copyright (c) 1998-2016 Zend Technologies
    with Zend OPcache v7.0.6-dev, Copyright (c) 1999-2016, by Zend Technologies
    with Xdebug v2.4.1, Copyright (c) 2002-2016, by Derick Rethans

```

# 配置lnmp
安装完后的软件版本
```
nginx version: nginx/1.10.1

mysql  Ver 14.14 Distrib 5.1.73, for redhat-linux-gnu (x86_64) using readline 5.1

PHP 5.6.28 (cli) (built: Nov  9 2016 07:23:55)
```
nginx 报错
```
nginx: [emerg] socket() [::]:80 failed (97: Address family not supported by protocol)
```
解决方法:
`vim /etc/nginx/conf.d/default.conf` 注释掉下句
```
#listen       [::]:80 default_server;
```
准备 nginx.conf 文件
```
mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
cp /etc/nginx/nginx.conf.default /etc/nginx/nginx.conf
```
`vim /etc/nginx/nginx.conf`
```
# 加入index.php
location / {
            root   html;
            index  index.php index.html index.htm;
        }

# 以tcp方式将nginx和php通信
location ~ \.php$ {
    root /usr/share/nginx/html;
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /usr/share/nginx/html$fastcgi_script_name;
    include fastcgi_params;
}
```
`vim /etc/php.ini` 关闭下面选项
[Nginx + PHP CGI的一个可能的安全漏洞](http://www.laruence.com/2010/05/20/1495.html)
```
cgi.fix_pathinfo = 0
```
重启nginx php-fpm
```
service nginx restart
service php-fpm restart
```
在目录下建立info.php ，里面用 `<?php phpinfo();` 测试下解析是否成功
