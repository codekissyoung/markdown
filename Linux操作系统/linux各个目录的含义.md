```
/bin    /sbin    /usr/bin    /usr/sbin    /usr/local/bin  存放命令的文件    
/boot   存放内核和系统启动所需文件    
/opt    安装的大应用程序文件    
/tmp    临时文件    
/lost+found 系统修复过程中恢复的文件    
/root   超级用户主目录    
/home   普通用户目录    
/dev    设备文件目录
/dev/cdrom        光驱设备    
/dev/fd0    软驱

/etc/lilo.conf    启动引导程序文件
/etc/grub.conf     多系统引导时，配置文件
/etc/inittab    控制启动模式（图形/文本登录）
/etc/fstab    文件系统配置
/etc/profile    增加环境变量等的配置文件 如PATH 如配置javaEE 开发环境
/etc/ftp*    ftp 的配置文件
/etc/ssh*    ssh的配置文件
/etc/resolv.conf    dns域名服务器的配置文件
/etc/passwd    系统能识别的用户清单，纯文本显示加密了的口令，普通用户可读
/etc/shadow    超级用户才能读，用于保护加密口令的安全，隐藏口令
/etc/group    放置所有组名的地方
/etc/sysconfig/network-scripts/ifcfg-etho    ip地址的配置文件
/etc/hosts    类似于window  host 文件的，可以配置 pms.com 映射到本地127.0.0.1地址

/lib    系统所用的库，如 c 程序库
/lib/modules/2.4.20-8/kernel/drivers    驱动模块
/usr/lib/    应用程序使用的库文件如 mysql的api
/usr/sbin    系统管理的命令
/usr/bin    几乎所有的命令程序
/usr/include    c语言的头文件
/usr/local    本地安装的软件
/usr/doc    /usr/share/doc    帮助文档
/usr/share    共享文件和数据
/usr/src/linux-2.4.20-8/    linux 源代码
/mnt    装载目录

/var/www    apache 的文档目录
/var/lib    系统运行时随时改变的文件
/var/local    /usr/local程序的可变数据
/var/log    日志文件
/var/spool    邮件，新闻等队列的脱机目录
/var/tmp    临时文件
/root/.bash_profile    root 用户配置环境变量的文件
/home/username/.bash_profile    username 用户配置环境变量的文件

```






