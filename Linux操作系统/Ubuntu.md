# Ubuntu 装机指南

`Ubuntu 18.04` 作为示范机，U盘装机软件 `LinuxLive USB Creator`。

## 0. 安装设置

用户名: `cky` 或 `link`
软件源: `http://mirrors.aliyun.com/ubuntu/`

#### 通过复制虚拟机 来获取多个节点

```bash
sudo vim /etc/cloud/cloud.cfg

preserve_hostname: true             # 修改一句

hostnamectl set-hostname cky5     # 之后重启系统
```

## 1. 更换软件源

如果安装时，未更换软件源，则可修改 `/etc/apt/sources.list` 为如下内容:

```bash
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
```

## 2. 修改DNS

```bash
sudo vim /etc/systemd/resolved.conf

[Resolve]
DNS=8.8.8.8

sudo systemctl restart systemd-resolved.service
```

设置时区:

```bash
sudo tzselect   # 选择亚洲Asia，继续选择中国China，最后选择北京Beijing
```

## 3. 安装服务端基础开发软件

```bash
sudo apt-get install -y apt-transport-https
sudo apt-get install -y vim git aptitude zsh tree tmux lnav
sudo apt-get install -y language-pack-zh-hans zhcon        # 中文支持
sudo apt-get install -y bash-builtins bash-completion bash-doc bash-static
sudo apt-get install -y rar unrar p7zip zip unzip          # 压缩

# 安装 c++ 开发环境
sudo apt-get install -y gcc gdb make autoconf automake libtool build-essential flex bison cmake
sudo apt-get install -y linux-headers-$(uname -r)
sudo apt-get install -y automake autoconf libtool pkg-config intltool checkinstall
```

```bash
sudo update-alternatives --config editor                # 默认编辑设置为vim
git config --global core.quotepath false                # git 中文正确显示
git config --global core.editor vim                     # 默认编辑器 vim
git config --global user.name "link"                    # git username
git config --global user.email "link@muchenglin.com"    # git email
```

## 4. 设置 vim 

用户目录 `.vimrc` 修改如下:

```vim
set nu            " 设置行号
set hlsearch      " 高亮查找项
set incsearch     " 查找跟随
set ignorecase    " 查找时忽略大小写
set fdm=marker    " 设定标记折叠
set autoindent    " 设置自动缩进
set tabstop=4     " 设置tab为4个空格
set list          " 显示空格和tab
set listchars=tab:>-,trail:- " 显示空格和tab的格式
syntax on         " 语法高亮
set tabpagemax=15 " 设置最大打开的标签页数

" 定义快捷键
noremap <F6> :set nu
```

## 5. 安装 lnmp 环境

```bash
sudo apt-get install nginx
sudo apt-get install mysql-server mysql-client
sudo apt-get install redis-server
sudo apt-get install php 
```

## 后面待定

```bash
#!/bin/bash

lsb_release -a
cat /etc/issue
uname -a

# 安装调试软件 insight 的依赖 
sudo apt-get install autoconf autogen texinfo zlib1g-dev tcl-dev tk-dev mesa-common-dev
sudo apt-get install libjpeg-dev libtogl-dev python-dev
sudo apt-get install flex bison itcl3 itk3 iwidgets4

sudo apt-get install lnav                       # 安装终端看访问日志的神器 lnav观看 [服务器端]
sudo apt-get install bless                      # 查看二进制，客户端软件
```

## 快捷键

```bash
alt + F2                # 运行一个命令
Super + L               # 锁屏,离开工作
Ctrl + Alt + T          # 开启终端
Super + tab             # 切换 App
Shift + Ctrl + Print    # 区域截图到剪贴板
Shift + Print           # 区域截图到 图片 目录
Ctrl + shift + A        # 带画笔的截图（Flameshot提供）、
F5                      # 刷新
```

## 设置软件运行时语言环境

`Locale` 是软件在运行时的语言环境, 它包括语言`Language`, 地域`Territory`和字符集`Codeset`:

- `sudo vim /etc/enviroment` 添加 `LANG="zh_CN.UTF-8"`
- `sudo locale-gen`
- `sudo vim /etc/default/locale` 添加 `LANG=zh_CN.UTF-8`

`gnome-session-properties` 设置开机自动运行软件。

```php
# 安装 Tab 栏目显示 CPU 和 内存使用率 工具
sudo add-apt-repository ppa:fossfreedom/indicator-sysmonitor
sudo apt-get update
sudo apt-get install indicator-sysmonitor   # 安装好后，Preferences 设置下开机运行就好
nohup indicator-sysmonitor &                # 手动启动
```

安装 `Swoole` :

```bash
sudo apt-get install libmcrypt-dev libiconv-hook-dev libxml2-dev libmysqlclient-dev libcurl4-openssl-dev
sudo apt-get install libjpeg8-dev libpng-dev libfreetype6-dev
sudo apt install php-pear
sudo apt install php7.2-dev     # 这里要确定自己安装的版本号
sudo pecl install swoole
```

需要将`extension=swoole.so`添加到`php.ini`文件(通过`phpinfo()`确认路径)中，开启`Swoole`拓展。

然后重启`php-fpm`:

```bash
sudo systemctl restart php7.2-fpm.service
sudo systemctl restart nginx.service
```

```bash
# apt-get 命令
apt-cache search keyword        搜寻软件
apt-cache show package          软件包信息
apt-get install package         安装软件
apt-get remove package          删除软件
apt-get --purge remove package  彻底删除
```

#### 更强大的 aptitude

```bash
# aptitude 更强大的的 apt-get 命令
sudo apt-get install aptitude           安装aptitude
sudo aptitude                           打开软件包字符操作界面
sudo aptitude search package            搜索
sudo aptitude install package           安装软件
sudo aptitude remove package            删除软件
sudo aptitude purge package             彻底删除 连配置一起删除
sudo aptitude update                    更新软件源
sudo aptitude upgrade                   更新软件
```

#### 使用第三方源 安装软件

```bash
sudo add-apt-repository ppa:ppsspp/stable    添加ppa源, 在source.list里添加 ppa 源了，同时完成导入key
sudo aptitude update                         更新源
sudo aptitude search ppsspp                  搜索下刚刚添加的第三方源的软件
sudo aptitude install ppsspp                 安装它
sudo aptitude purge ppsspp                   删除它
sudo add-apt-repository -r ppa:ppsspp/stable 删除ppa源
sudo aptitude update                         再次更新源
```

#### dpkg 管理 Debian软件包

```bash
dpkg -l                         列出系统安装的所有debian包
dpkg -c package.deb             列出 deb 包的内容
dpkg -ivh <.deb file name>      安装软件
dpkg -L package                 用此命令查看软件安装到什么地方
dpkg -r package                 移除软件（保留配置）
dpkg -P package                 移除软件（不保留配置）
dpkg -s package                 查找包的详细信息
dpkg –unpack package.deb        解开 deb 包的内容
dpkg -S keyword                 搜索所属的包内容
dpkg –configure package         配置包
dpkg–reconfigure package        重新配置包
```

#### 编译安装软件

```bash
sudo aptitude install libxml2-dev libgtk2.0-dev libnotify-dev libglib2.0-dev libevent-dev
sudo aptitude install libcurl4-openssl-dev libssl-dev # 先安装依赖
sudo apt-get build-dep wireshark # 安装编译wireshark工具
# 在 wireshark 源码文件夹下执行
./configure
make
sudo checkinstall # 构建debian包并且安装
```

#### snap 安装软件包

`snap`包思路模仿苹果软件包,没有依赖关系，体积大，下载安装包后，将下载的安装文件挂载到`/snap`目录下并自动创建挂载点，然后复制文件到指定位置

```bash
snap find htop            # 查找软件
sudo snap install htop    # 安装软件
sudo snap refresh stop    # 更新软件
sudo snap remove stop     # 删除一个应用
snap list                 # 列出安装的应用

➜  htop tree   
.
├── 68
│   ├── bin
│   │   └── htop
│   ├── command-htop.wrapper
│   ├── meta
│   │   └── snap.yaml
│   └── share
└── current -> 68

➜  htop pwd
/snap/htop
```

## 接入GitHub

- 生成密钥 `ssh-keyen`, 将密钥`~/.ssh/id_rsa.pub`上传到 `Github > Settings > SSH And GPG keys`

## 连接到远程开发服务器

- 将密钥`~/.ssh/id_rsa.pub`加入到远程服务器的`~/.ssh/authorized_keys`中
- 在客户机执行`scp .ssh/id_rsa.pub cky@codekissyoung.com:~/id_rsa.pub`
- 然后在远程服务器执行 `cat id_rsa.pub >> .ssh/authorized_keys`, 记得修改`authorized_keys`的权限位`600`
- 登陆远程服务器 `ssh cky@codekissyoung.com`

## 安装QT

- [QT5.9.5安装包](http://download.qt.io/official_releases/qt/5.9/5.9.5/)

### 截图工具

自带的截图软件，使用 `shift + printscreen` 截图，自动保存到指定文件夹，也挺好的！

[Linux上好用的截图工具 flameshot](https://blog.csdn.net/qq_34347375/article/details/83589772)，这一款是带画笔工具的，非常好用，唯一就是每次都需要选定保存的文件夹。
[Flameshot一个简洁但功能丰富的截图工具](https://linux.cn/article-10180-1.html)

### 安装企业微信

[Ubuntu16.04/18.04安装企业微信教程](https://blog.svenhetin.com/ubuntu16-04an-zhuang-qi-ye-wei-xin-jiao-cheng/)

## 解决软件包版本太高问题

- `E:无法修正错误，因为您要求某些软件包保持现状，就是它们破坏了软件包间的依赖关系 解决办法` 就是这个提示
- 解决办法: [Ubuntu解决包依赖关系](https://blog.csdn.net/newmann/article/details/70149021)
- 方案就是使用`aptitude`
  - 执行命令`sudo aptitude install build-essential`
  - 在展示`1)      build-essential [未安装的]`等保持原样，并且询问 `是否接受该解决方案？[Y/n/q/?]` 时，填入 `n`,表示不接受
  - 在继续展示 `降级 下列软件包：1)     gcc-7-base [7.3.0-21ubuntu1~16.04 (now) -> 7.3.0-16ubuntu3 (bionic)]`, 并询问`是否接受该解决方案？[Y/n/q/?]`时，填入`Y` 表示接受软件包降级，这样问题就解决了

## NFS(Network File System)文件共享服务

## FTP(File Transfer Protocol)

## Samba

## linux用于完成特定任务的用户

- `nobody` `admin` `ftp` ，无密码,无home目录，无shell,主要就是为了运行某些特定的进程，比如 nginx 使用nobody用户来运行

## 特殊权限

```bash
000 , --- , 0 , 不使用任何特殊权限
001 , --t , 1 ,
010 , -s- , 2 ,
011 , -st , 3 ,
100 , s-- , 4 ,
101 , s-t , 5 ,
110 , ss- , 6 ,
111 , sst , 7 ,
```

```bash
➜  ~ ls -alh /bin/su
-rwsr-xr-x 1 root root 40K 5月  16 10:28 /bin/su
```

- s 特殊权限
- 只对二进制程序有效 , 执行者拥有该程序的执行权限，且只在执行该程序的过程中有效
- 执行者将具有该程序拥有者的权限，比如 su 的 s 权限,可以让用户暂时拥有 root 用户的权限
- 通过 `chmod u+s file` 或者 `chmod 4755 file` 来设置

```bash
➜  ~ ls -alh /usr/bin/mlocate
-rwxr-sr-x 1 root mlocate 39K 11月 18  2014 /usr/bin/mlocate
```

- SGID 权限,与 s 权限相同，不同的是，SGID在执行过程中还会得到该程序的用户组的支持
- 对于设置了SGID权限的目录来说,用户拥有r x权限时，可以进入该目录,用户在此目录下的有效用户变为该目录的用户，创建的文件的所属用户也是该目录的用户
- 使用 `chmod g+s file` 来添加此权限

```bash
➜  / ls -alh / |grep tmp
drwxrwxrwt  16 root root 4.0K 6月   3 13:01 tmp

```
- SBIT 权限, `--t` ,该权限只对目录有效,用户在该目录下创建的文件或目录，权限默认为`-rw-r--r--`,即只有该用户和root可以删除
- 使用命令 `chmod o+t /tmp` 来添加此权限


# 限制用户进程数

- 在`/etc/security/limits.conf` 文件后面添加上下面代码，限制用户进程数为200

```bash
*   hard    nproc   200
```

## 安装 Memcache

sudo apt-get install memcached #安装php memcached 扩展
memcached -d -m 50 -p 11211 -u root #启动一个memcached服务
-d 是启动一个守护进程 
-m 指定使用多少兆的缓存空间；
-p 指定要监听的端口； 
-u 指定以哪个用户来运行
-l 是监听的服务器ip地址，默认为127.0.0.1  
-c 是最大并发连接数，默认1024 
-P 是保存pid文件 如/tmp/memcached.pid
使用telnet测试 memcached 服务
$ telnet localhost 11211 Trying 127.0.0.1...Connected to localhost.

## 安装并配置apache2.4

```bash
sudo apt-get install apache2
```
```
sudo vim /etc/apache2/apache2.conf
    // 将 <Directory /var/www/>
    // 改成 <Directory "你的目录">
sudo vim /etc/apache2/sites-available/000-default.conf
    // 将 DocumentRoot /var/www/html
    // 改成 DocumentRoot "你的目录"
```

```
sudo /etc/init.d/apache2 restart
```

# apache 相关的
http://blog.csdn.net/u013178760/article/details/45393183    Apache 2.4 Rewrite 模块
http://blog.csdn.net/u013178760/article/details/48436777    Apache2 虚拟主机配置

# 安装apache
```bash
sudo apt-get install apache2
```
# 开启和关闭模块
```bash
sudo a2enmod rewrite #启用rewrite模块 
sudo a2dismod rewrite #禁用rewrite模块
```
# 开启和关闭站点
```bash
sudo a2ensite sitename ＃启用站点 
sudo a2dissite sitename ＃停用站点
```
# 允许使用.htaccess
```bash
AllowOverride None 改为 AllowOverride  All
```
# 重启|开启｜关闭apache 
```bash
sudo service apache2 restart|start|stop             重启|开启｜关闭apache 
sudo  /etc/init.d/apache2 restart|start|stop     　　重启｜开启｜关闭apache
```

## url重写
```bash
http://www.example.com/USA/California/San_Diego  
“/USA/California/San_Diego” 是能够Rewrite的字符串！
重写：就是实现URL的跳转和隐藏真实地址，基于Perl语言的正则表达式规范。平时帮助我们实现拟静态，拟目录，域名跳转，防止盗链等
```

## .htaccess

```bash
RewriteEnine on
RewriteRule  ^/t_(.*).html$  /test.php?id = $1#当访问任何以t_开头，以.html结尾的文件时，将$1用与(.*)匹配的字符替换后，访问相应的test.php页面
RewriteRule ^/test([0-9]*).html$ /test.php?id=$1RewriteRule ^/new([0-9]*)/$ /new.php?id=$1 [R]#当我们访问的地址不是以www.163.com开头的，那么执行下一条规则
RewriteCond %{HTTP_HOST} !^www.163.com [NC]RewriteRule ^/(.*) http://www.163.com/ [L]
```

## Apache Rewrite规则修正符
```bash
1) R 强制外部重定向
2) F 禁用URL,返回403HTTP状态码。
3) G 强制URL为GONE，返回410HTTP状态码。
4) P 强制使用代理转发。
5) L 表明当前规则是最后一条规则，停止分析以后规则的重写。
6) N 重新从第一条规则开始运行重写过程。
7) C 与下一条规则关联 如果规则匹配则正常处理，以下修正符无效
8) T=MIME-type(force MIME type) 强制MIME类型
9) NS 只用于不是内部子请求
10) NC 不区分大小写
11) QSA 追加请求字符串
12) NE 不在输出转义特殊字符 \%3d$1 等价于 =$1
```

## 核心模块
```bash
core_module,so_module,http_module,mpm
```

## 全局配置指令

```bash
#表示apache2这个软件安装的目录
ServerRoot  "/usr/local/apache2"

#监听端口命令 Listen  ip：portListen  80

#加载动态模块，
LoadModule  模块名   模块路径
LoadModule  php5_module  modules/libphp5.so

#是否加载某个模块容器
<IfModule ></IfMoudle>

#设置先读取 index.php 文件
<IfModule dir_module>
  DirectoryIndex index.php index.html
</IfModule>

#留下管理员邮箱
ServerAdmin 1162097842@qq.com

#用于多个域名访问同一个ip时，辨别它们访问的主机
ServerName pms.com

#设置主机所有文档的根目录
DocumentRoot "/var/www/html"
# 默认目录访问的文件
DirectoryIndex index.html index.htm index.php

添加默认字符集  AddDefaultCharset GB2312
监听ip是192.168.1.1的地址和端口为80创建虚拟目录
Alias /down    "/sofТWare /download"   创建名为down的虚拟目录，它对应的物理路径是：/sofТWare /download
设置目录权限<Directory "目录路径">    此次写设置目录权限的语句        
Options FollowSymLinks  允许符号链接 Options Indexes         允许用户浏览网页目录，（不安全的设置，建议删除）      
AllowOverride None      不允许 .htaccess 重写这个目录，改为 All 则能重写
</Directory>
```













wget -nc https://dl.winehq.org/wine-builds/winehq.key
sudo apt-add-repository 'deb https://dl.winehq.org/wine-builds/ubuntu/ bionic main'