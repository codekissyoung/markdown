## 字符匹配 ##
```
* 代表任意字符串
？代表一个字符
[abcd...]代表从里面选字符
[1-9] [a-z] 表示范围
[!abcd] 代表除这些字符串之外
```
## 重定向 ##
```
ls  -l  /tmp > /tmp.msg   不再屏幕显示，而是输入到/tmp.msg 这个文件
date >> /tep.msg    >>表示在末尾追加
grep 127 < /etc/hosts   输入重定向
cp -R /usr   /backup/usr.bak  2> /bak.error   错误输出重定向
```
## 管道：将一个命令的输入作为另一个命令的输入 ##
```
ps aux | grep  apache2
```
## 命令链接符  ##
```
ls  -l  /etc/hosts;ls -l /etc/host;   命令依次执行
sudo service apache2  stop&&sudo  service apache2  start   前面命令执行成功后，才执行后面命令
service apache2 restart || sudo service apache2 restart  前面命令执行失败后，后面命令才执行
```
## 命令替换符  ##
```
ls  -l  `which touch`  将which touch的输入作为 ls -l 的参数
```
## 目录与文件管理命令 ##
```
ls  -ald  /root  显示/root下所有文件
pwd   显示当前目录
touch  test.c   创建一个新文件test.c
mkdir  test   创建一个新目录 test
cp  test.c   /root    复制 test.c 到 /root
cp   -R   test   /root     复制test 文件夹到 /root
mv  test.c  /root   移动 test.c 到/root
mv  test.c  /root/test2.c     移动并且改名
rm    -rf    /mydir 不询问 y/n，强制删除/mydir 目录和里面的文件
cat Myfile 查看文件
more  Myfile 分页查看文件内容，空格：下一页，enter：下一行，q：退出
tail -num log.txt 实时查看文件前num行内容
ln source.txt  /var/source.txt   创建硬链接（相当于copy + 实时更新）
ln -s  source.txt  /var/source.txt  创建软连接（相当于快捷方式）    
sudo chmod -R 777 /sh
```
## 压缩和解压 ##
```
gzip    -d    文件：压缩为 .gz文件，不支持目录，不保留源文件，-d 为解压缩
bzip2  -k    文件：压缩为.bz2 文件，它的压缩比非常惊人，-k 会保留源文件。
bunzip2    .bz2文件：解压 .bz2 文件。
tar  -zxvf   aa.tar.gz   解压到当前文件夹
tar  -zcvf   aa.tar.gz  /etc/aa.txt   压缩文件，记得文件用全路径
zip  services.zip  /etc/services  压缩文件
zip  test.zip  /test  压缩目录 zip 是保留源文件的压缩。
uzip    压缩文件：解压文件；
```
## 文件权限 ##
```
chmod  [-R]  777   /var/home/www    改变文件/目录权限 -R是递归
chown   caokaiyan    /var/home/www/aa.txt    改变文件所有者
chgrp  [-R]  admin        /var/home/www/aa.txt    改变文件所有组
```
## 用户管理 ##
```
useradd  caokaiyan  向系统添加一个用户
passwd   caokaiyan  给用户设定一个秘密
su  切换到root用户
sudo  普通用户使用root用户权限操作，一般在Debian系列linux才有
logout   注销登录
```
## 文件搜索 ##
```
which  ls   定位到ls命令的绝对路径；提供 命令别名信息
whereis  ls 定位到ls命令的绝对路径；提供帮助文档信息
find  /etc  host    在/etc 里面查找名字带有 host 的文件
locate  host   基于linux内置文件数据库查找带有 host 名的文件，一般在找之前 updatedb 一下，更新内置数据库
file    文件：判断文件类型
```
## 网络通信命令 ##
```
ping    + ip地址/URL：发送数据包，看看能不能得到包的返回
ping    自己机器ip地址：如果能通，说明自己的网络设置是没问题的！
ping    127.0.0.1(回环地址)：检测自己机器安装了tip/ip 协议 么
ping   + 6000    www.baidu.com    :发送 6000    block 大小的一个包，来测试网络连接时延
ifconfig    -a    ：查看网卡信息；eth0是第一块网卡     lo 是回环网卡；
netstat -anp：监控网络状态，端口号，哪个进程监听的这个端口啊，等等！
traceroute  +域名/主机 IP ：追踪路由
route -n：显示本机路由表
```
## 关机 ##
```
shutdown  -h [now/等待时间]
shutdown    -r    [now/等待时间] 重启
reboot    快速重启（跳过sync数据同步过程）
init    0    关机
init    6    重启
halt    系统停机
```
## 查看硬盘分区情况 ##

```
fdisk    -l    [/dev/had]硬盘分区情况
df    -h    硬盘分区的使用情况
du    -sh   /root    查看/root下所有目录大小
uname    -a 所用的linux 版本号
```
## linux环境配置 ##

```
Locale    查看当前语言环境
LANG=zh_CN.UTF-8   设置当前语言 ，LANG 是环境变量
可以使用配置环境变量，而不用去修改对应的配置文件
env    列出所有的环境变量
date    显示当前时间
cal    显示当前日历
```
## 进程管理 ##
```
ps aux 查看运行的所有进程
ps e   
kill  8024  通过PID杀死进程
Kill  -9  8935   强制杀死进程
killall  8323   杀死它和它的子进程
top   实时监控进程
```

