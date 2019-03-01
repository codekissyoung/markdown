## 在 Red-Hat 下管理软件 ##
 - rpm包
```
rpm -ivh pakage_path 安装这个软件包到linux
rpm -e pakage_name 卸载这个软件包
rpm -qa 查询linux中所有安装的rpm软件
rpm -qi pakage_name 查询软件包信息
rpm -qc pakage_name 查询软件包配置文件
rpm -qd pakage_name 查询软件包帮助文档
rpm -ql pakage_name 查询软件包中的文件
rpm -qf file_path 查询文件或者目录所属的软件包
```
 - yum包
```
yum install pakage_name 安装
yum check-update 检测升级
yum update 升级
yum list 软件包查询
yum info 软件包信息
yum remove 卸载
```
## 在Debian Ubuntu 下软件管理 ##
```
apt-cache search 搜索软件包
apt-cache show 软件包信息
apt-get install 安装
apt-get remove 卸载
apt-get update 更新软件源
apt-get upgrade 更新已经安装的包
```
## 源代码包安装：（这个是大公司定制安装（为了性能和资源）） ##

## 脚本安装：shell 脚本 或者 java 脚本安装，直接运行shell 就行！  ##