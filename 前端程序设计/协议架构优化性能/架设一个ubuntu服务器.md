# Ubuntu 安全配置

虽然阿里云比起其他小服务商的虚拟服务器要安全很多，但是还是建议开启 ECS 实例的 UFW（Ubuntu Firewall），开启步骤如下：

```shell
sudo ufw status # 查看当前防火墙状态，当 UFW 处于关闭状态时将显示如下信息：Status: inactive
```

复制代码
当 UFW 处于开启状态时将显示如下信息：
Status: active

To                         Action      From
--                         ------      ----
22                         ALLOW       Anywhere
80                         ALLOW       Anywhere
443                        ALLOW       Anywhere
3306                       ALLOW       Anywhere
22 (v6)                    ALLOW       Anywhere (v6)
80 (v6)                    ALLOW       Anywhere (v6)
443 (v6)                   ALLOW       Anywhere (v6)
3306 (v6)                  ALLOW       Anywhere (v6)
复制代码
对于运行 Web 应用的服务器而言，80 端口（http）是必须开放的，如支持 https 则 443 端口也必须开放；其次 22 端口是用于 SSHD 服务，根据管理需要开启；3306 是 MySQL 对外服务端口，如果无需对外提供 MySQL 服务，则可以不开放，具体根据实际情况进行选择。
1.2、使用 sudo ufw enable 开启 UFW，然后应该立即将需要的服务端口打开，使用命令 sudo ufw allow http，将此命令中的最后一个部分替换成需要使用的协议名称或者直接使用端口号，即可开放对应服务的端口，参考以下命令：
sudo ufw allow http 或者 sudo ufw allow 80
sudo ufw allow https 或者 sudo ufw allow 443
sudo ufw allow mysql 或者 sudo ufw allow 3306
sudo ufw allow ssh 或者 sudo ufw allow 22

2、Apache 虚拟主机配置
使用虚拟主机可以极大的方便 Web 应用的维护，通常建议给单独的 Web 应用分配独立的虚拟主机，即：Webapp A 对应虚拟主机 A，Webapp B 对应虚拟主机 B；对于 Apache 而言，一台虚拟主机仅仅是一个配置文件，不增加任何其他系统开销。
Apache 的虚拟主机配置文件均放置在目录 /etc/apache2/sites-available 下，初始状态只有一个虚拟主机配置文件，即：000-default.conf。创建新的虚拟主机只需要简单 copy 后修改即可，比如要为 Webapp A 创建一个虚拟主机可以安装如下步骤操作：
2.1、进入虚拟主机配置目录 cd /etc/apache2/sites-available
2.2、复制默认的虚拟主机配置文件 sudo cp 000-default.conf webapp-a.conf
2.3、修改 webapp-a.conf 中的关键配置，主要是设置好参数 ServerName、ServerAlias、 DocumentRoot 三个参数，本例配置如下：
ServerName weba.yourdomain.com
ServerAlias weba.testdomain.com
DocumentRoot /var/www/html/weba
复制代码
其中参数 ServerName 和 DocumentRoot 是最重要的参数，必须配置。ServerName 的作用为就是用来区分不同的虚拟主机；DocumentRoot 的作用用于设定虚拟主机在本服务器的物理访问地址；ServerAlias 是别名，设置后的效果与 ServerName 等同，可以设置多个用于不同测试。
当有一个目的URL为 http://weba.yourdomain.com/..... 的 http 请求发送到 Apache 时，Apache 会将 URL 中的协议和域名信息提取出来，然后在激活状态的虚拟主机中查找，当找到一个虚拟主机的 ServerName 与 URL 中的域名完全匹配的时候，就会将这个 http 请求转发到 DocumentRoot 所指向的目录，然后目录中对应的程序就开始处理本次 http 请求。
2.4、激活虚拟主机，首先使用命令 sudo a2ensite webapp-a.conf 将虚拟主机设置为活动状态，命令执行成功后，可以在目录 /etc/apache2/sites-enabled 中看到已经处于激活状态的虚拟主机。然后还需要执行命令 sudo service apache reload 重新加载最新的配置文件，执行成功后才能通过 ServerName 或者 ServerAlias 访问到虚拟主机。使用命令 sudo service apache restart 也能使虚拟主机生效，但是 restart 是重启整个服务，如果一台服务器上有多台虚拟主机，那么所有的虚拟主机都会受到影响，因此只有在 reload 无法生效时，才考虑使用 restart。
2.5、创建虚拟主机文件目录，此目录路径必须与 DocumentRoot 的值匹配。

3、MySQL 配置
配置 MySQL 的时候建议使用 phpmyadmin，在进行数据库管理的时候，主要考虑以下几点：
3.1、不能使用 root 用户作为应用访问数据库的用户，没有特殊原因的情况下必须为每个应用单独创建数据库用户和具有所有数据库权限的同名数据库。
3.2、应该创建一个只有只读权限（SELECT 与 LOCK TABLES）的数据库用户用于数据库的备份操作，改用户可以访问所有应用数据库。
3.3、数据库配置完成后，建议删除或者改名 phpmyadmin 目录下的 index.php 文件，以保证安全性。
3.4、在 MySQL 配置文件中（/etc/mysql/my.cnf）有一条命令是：
bind-address                = 127.0.0.1
复制代码
如果数据库需要对外（非本机）提供服务，则还需要注释此条命令。

4、域名配置
公网域名解析配置通常通过第三方的域名解析服务器完成，而无需自建 DNS 服务器，通常提供主机服务的主机商都会提供相应的域名解析服务。这里推荐使用 DNSPOD 提供的域名解析服务。以下是域名设置的大概步骤：
4.1、在域名注册商提供的后台将域名（yourdomain.com）的 DNS 服务器设置为：f1g1ns1.dnspod.net 和 f1g1ns2.dnspod.net 。
4.2、进入 DNSPOD 后台添加域名，通常只要上一步设置正确，都能正常将域名添加到 DNSPOD 的后台控制面板。
4.3、在 DNSPOD 后台添加 A 类型记录，IP 必须是 ECS 的公网IP，主机记录名在本例中为：weba


完成以上配置后，在浏览器访问 http://weba.yourdomain.com，就能映射到指定 IP 地址的 ECS 服务器的 /var/www/html/weba 目录。


