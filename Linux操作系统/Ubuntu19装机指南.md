# Ubuntu 19 装机指南

## 下载安装

- 下载`Ubuntu 18.04 .iso`镜像
- 下载U盘装机软件`LinuxLive USB Creator`
- 设置电脑的启动盘顺序，U盘进入，安装

## 查看系统版本和环境

```bash
lsb_release -a
cat /etc/issue
uname -a
```

## 安装中文支持

```bash
sudo apt-get install language-pack-zh-hans
sudo apt-get install zhcon
```

## 设置软件运行时语言环境

- Locale 是软件在运行时的语言环境, 它包括语言(Language), 地域 (Territory) 和字符集(Codeset)
- 运行 `sudo vim /etc/enviroment` 添加如下内容 `LANG="zh_CN.UTF-8"`
- 运行 `sudo locale-gen`
- 运行 `sudo vim /etc/default/locale`,添加如下内容`LANG=zh_CN.UTF-8`

## 软件安装原则

- 优先选择该系统版本上的默认软件,比如`ubuntu 16.04`的默认PHP版本是7.0,那就不要去用7.1的版本,否则会带来很大的麻烦

## 下载必备软件

- 软件市场，或者网络下载 `Chrome`，`Chromium`， `Vistual Studio Code`

```bash
# apt-get 命令
sudo apt-get update             更新软件源
sudo apt-get upgrade            从软件源处更新软件
sudo apt-get autoremove         自动卸载系统不需要的软件
apt-cache search keyword        搜寻软件
apt-get install package         安装软件
apt-get remove package          删除软件
apt-get --purge remove package  彻底删除

# aptitude 更强大的的 apt-get 命令
sudo apt-get install aptitude           安装aptitude
sudo aptitude                           打开软件包字符操作界面
sudo aptitude search package            搜索
sudo aptitude install package           安装软件
sudo aptitude remove package            删除软件
sudo aptitude purge package             彻底删除 连配置一起删除
sudo aptitude update                    更新软件源
sudo aptitude upgrade                   更新软件

# 使用第三方源 安装软件
sudo add-apt-repository ppa:ppsspp/stable    添加ppa源, 在source.list里添加 ppa 源了，同时完成导入key
sudo aptitude update                         更新源
sudo aptitude search ppsspp                  搜索下刚刚添加的第三方源的软件
sudo aptitude install ppsspp                 安装它
sudo aptitude purge ppsspp                   删除它
sudo add-apt-repository -r ppa:ppsspp/stable 删除ppa源
sudo aptitude update                         再次更新源

# 常用软件 建议依次安装
sudo apt-get install vim　               安装vim编辑器
sudo update-alternatives --config editor 默认编辑设置为vim
sudo apt-get install git                 安装git
sudo apt-get install unrar               安装rar解压工具, unrar x test.rar 解压到当前文件夹
sudo apt-get install zsh                 安装zsh 配置oh-my-zsh

sudo apt-get install tmux                用于保持工作现场 [服务器端]
sudo apt-get install lnav                安装终端看访问日志的神器 lnav观看 [服务器端]
sudo apt-get install openssh-server      安装ssh-server 可供远程登录 [服务器端]
sudo apt-get install bash-builtins bash-completion bash-doc bash-static  安装bash自动补全工具
```

## dpkg 管理 Debian软件包

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

## 接入GitHub

- 生成密钥 `ssh-keyen`, 将密钥`~/.ssh/id_rsa.pub`上传到Github > Settings > SSH And GPG keys

## 连接到远程开发服务器

- 将密钥`~/.ssh/id_rsa.pub`加入到远程服务器的`~/.ssh/authorized_keys`中
- 在客户机执行`scp .ssh/id_rsa.pub cky@codekissyoung.com:~/id_rsa.pub`
- 然后在远程服务器执行 `cat id_rsa.pub >> .ssh/authorized_keys`, 记得修改`authorized_keys`的权限位`600`
- 登陆远程服务器 `ssh cky@codekissyoung.com`

## 搭建C/C++开发环境

- 安装build-essential这个软件包，安装了这个包会自动安装上g++,libc6-dev,linux-libc-dev,libstdc++6-4.1-dev等一些必须的软件和头文件的库。

```bash
sudo apt-get install build-essential
sudo apt-get install linux-headers-$(uname -r)
sudo aptitude install automake autoconf libtool pkg-config intltool checkinstall
gcc -v
gdb -v
make -v
```

## 编译安装软件

```bash
sudo aptitude install libxml2-dev libgtk2.0-dev libnotify-dev libglib2.0-dev libevent-dev
sudo aptitude install libcurl4-openssl-dev libssl-dev # 先安装依赖
sudo apt-get build-dep wireshark # 安装编译wireshark工具
# 在 wireshark 源码文件夹下执行
./configure
make
sudo checkinstall # 构建debian包并且安装
```

## 安装QT

- [QT5.9.5安装包](http://download.qt.io/official_releases/qt/5.9/5.9.5/)

## 截图工具

- 自带的截图软件,使用 `shift + printscreen` 截图

## 安装 Monaco 字体

 进入github下载这个字体，github地址是`https://github.com/cstrap/monaco-font`,查看安装说明

```bash
sudo ./install-font-ubuntu.sh https://github.com/todylu/monaco.ttf/blob/master/monaco.ttf?raw=true
```

## 解决软件包版本太高问题

- `E:无法修正错误，因为您要求某些软件包保持现状，就是它们破坏了软件包间的依赖关系 解决办法` 就是这个提示
- 解决办法: [Ubuntu解决包依赖关系](https://blog.csdn.net/newmann/article/details/70149021)
- 方案就是使用`aptitude`
  - 执行命令`sudo aptitude install build-essential`
  - 在展示`1)      build-essential [未安装的]`等保持原样，并且询问 `是否接受该解决方案？[Y/n/q/?]` 时，填入 `n`,表示不接受
  - 在继续展示 `降级 下列软件包：1)     gcc-7-base [7.3.0-21ubuntu1~16.04 (now) -> 7.3.0-16ubuntu3 (bionic)]`, 并询问`是否接受该解决方案？[Y/n/q/?]`时，填入`Y` 表示接受软件包降级，这样问题就解决了

## 安装 PHP + Apache2

- 参考官方文档: [安装PHP语言 使用Apache2作为Web Server](https://help.ubuntu.com/lts/serverguide/php.html.en-GB)
- 当网站直接显示没有解析的php代码时，很可能的一个原因如下:

```bash
By default, when libapache2-mod-php is installed, the Apache 2 Web server is configured to run PHP scripts.
In other words, the PHP module is enabled in the Apache Web server when you install the module.
Please verify if the files /etc/apache2/mods-enabled/php7.0.conf and /etc/apache2/mods-enabled/php7.0.load exist.
If they do not exist, you can enable the module using the a2enmod command
```
