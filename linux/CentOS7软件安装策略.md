概述
==============
linux 下只分两种安装包
`1. 源代码包`
`2. 二进制包`
脚本安装包和yum在线安装也只是做了些自动化和管理的工作
这些包都是编译的包，不同于一些工作在`java,php,python,nodejs`上面的包,那些包不需要安装的,直接就可以用

二进制包
==============

`sudo rpm -ivh package-name-full-name` 安装rpm包,要解决依赖问题，安装包之前,要先安装它依赖的包
`sudo rpm -Uvh package-name-update-full-name` 升级rpm包,如果之前没装过这个包的话,那就等同于安装命令
`sudo rpm -e package-name` 卸载包,也是要解决依赖问题,不能卸载被别的包依赖的包
`sudo rpm -qa` 列出系统中安装的所有rpm包,查询的话，用grep过滤一下
`sudo rpm -i[p] package-name` 查询这个软件包信息,主要用于找它的官方网站,解决bug; -p用于未安装包
`sudo rpm -l[p] package-name` 查询这个软件包安装后所有文件的位置;-p 用于未安装包
`sudo rpm -qf file_name` 查询这个文件属于哪个软件包,必须是这个软件包产生的文件
`sudo rpm -qR[p] package-name` 查询这个包依赖的包／文件／库
`sudo rpm -V package-name` 校验这个包文件，看哪些文件做了修改
`rpm2cpio 包全名|cpio -idv ./bin/ls`将包中的/bin/ls文件取出到当前目录

解决依赖
`www.rpmfind.net` 查询库文件在哪个软件包里，安装那个软件包,库就会自动安装上

运行软件
使用`rpm包`安装的软件会将一些启动命令放在指定的文件夹(如`/etc/init.d/`)下，因此可以使用`linux`或者`CentOS`自定义的命令来运行软件
```
/etc/init.d/httpd start   # linux 标准启动方式
service httpd start    # CentOs 自定义的
```

yum 在线安装管理
========================
为解决依赖而生：树形依赖 ｜ 环形依赖 ｜ 库文件依赖
redhat 的 yum 需要付费

####yum 源文件
`cd /etc/yum.repos.d`
`vim /etc/yum.repos.d/CenOS-Base.repo`
```
[base]  容器名称
name   容器说明，随便写
mirrorlist=http://...   #yum源镜像站点
baseurl #yum源服务器地址
enabled=1 #此容器生效
gpgcheck=1 #数字证书验证
gpgkey=file:///etc/pki/rpm... # 数字证书
```

#### 使用光盘作为本地yum源
`mkdir /mnt/cdrom` 建立挂载点
`mount /dev/sr0  /mnt/cdrom/` 挂载光盘,假设它的设备文件为/dev/sr0
`mv CentOS-Base.repo CentOS-Base.repo.bak` 关闭网络yum源
`vim CentOS-Media.repo` 启用Media yum源
```
[c6-media]
name=CentOS-$releasever-Media
baseurl=file:///mnt/cdro
#    file:///media/cdrom
#    file:///media/cdrecorder
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6
```

####官方源头
base[默认打开]
updates[默认打开]
extras[默认打开]

####第三方源
问题
1. 第三方源和官方源有相同的包，导致官方源的包被第三方源替代
2. 多个第三方源中存在同一个软件包，版本不一致，存在冲突

选择第三方源-原则
1. 确保第三方源不会替换官方源中的包
2. 尽量少使用第三方源，保证第三方源之间不会冲突

推荐大型第三方源
EPEL [与官方源不冲突]
ELRepo [包含各种硬件驱动]
Nux Dextop [多媒体相关软件包][与EPEL个别软件冲突]

小型第三方源
Google Chrome [仅包含Google Chrome]
Adobe [仅包含Flash]
dropbox [仅包含dropbox]

####yum命令
安装软件原则: linux 最小化安装 , 尽量不卸载
`yum list` 列出源里所有软件包
`yum search 关键字` 搜索源里面的软件包 
`yum install -[y] 包名` 安装软件包 ,-y 自动安装,不需要询问管理员
`yum remove -[y] 包名` 卸载包
`yum grouplist` 列出组包
`yum groupinstall` 安装组包
`yum groupremove` 卸载

编译安装
=================
为什么要编译安装

1. 官方软件太久
2. 多个源的软件存在冲突
3. 手动编译软件，默认位置为`/usr/local`下不同子目录下,使得软件更新和删除变得很麻烦

编译安装的软件没有卸载命令，卸载就是把所有这个软件的文件删除
如果不指定安装目录，这类软件的默认安装目录都是 `/usr/local` ，最终文件会被分别放在 `/usr/local` 的 `bin、lib、share、man `目录下，我们卸载起来非常麻烦。所以源码安装的策略是：
指定安装目录为`/usr/local/软件名`,再手动将该软件的 bin 目录加入到PATH 中,或者将执行命令软链接到执行目录下
```
tar -zxvf  xxx.tar.gz
./configure  --prefix=/usr/local/xxxx
make #编译
sudo make install  #安装
```
如果之前`./configure`错了，可以再configure一次
`make`出错了，可以用`make clean`清理下之前产生编译好的文件
卸载就是 `sudo rm -r xxxx`

#### 编译安装和rpm安装区别
1. 安装软件位置的不同
2. 编译安装没有`rpm包`软件的默认启动执行等功能
将`/usr/local/包名/bin/xxx`等命令软连接到`/etc/init.d/`目录下,就可以使用`linux`或者`CentOS`默认软件管理命令来启动软件了[解决方案]
