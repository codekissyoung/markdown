# 安装 svn 服务器

```shell
sudo apt-get install subversion
```

# 在服务器建立中心库 /home/cky/svn

```
svnadmin create /home/cky/svn
```

# 目录概述

```
➜  svn tree
.
├── conf
│   ├── authz
│   ├── hooks-env.tmpl
│   ├── passwd
│   └── svnserve.conf
├── db
...
```

# 配置 svn 用户

- home/cky/svn/conf/svnserve.conf

```svn
[general]
anon-access = none      # 匿名用户不可读
auth-access = write     # 权限用户可写
password-db = passwd    # 密码文件为passwd
authz-db = authz        # 权限文件为authz
```

- home/cky/svn/conf/authz

```svn
[aliases]

[groups]
admin = cky,zj

[/]
@admin = rw

[svn-base:/]
cky = rw
```

- home/cky/svn/conf/passwd

```shell
[users]
cky = Cky_951010
```

# 启动 svn 服务

```shell
sudo svnserve -d -r /home/cky/svn
```

# 配置 svn 服务自启动

- `vim /etc/rc.local`

```vim
#!/bin/sh -e
# 开机自启动svn服务
svnserve -d -r /svn-base/

exit 0
```

## 安装 SVN

```
sudo apt-get install subversion subversion-tools
```

## 配置 svn

```
$mkdir  /var/svn/project_name
$svnadmin /var/svn/project_name
```

上面两步就配好了 svn 仓库，在/project_name/conf/下有
authz passwd svnserve.conf 三个文件

- svnserve.conf 文件

```
       anon-access：   #控制非鉴权用户访问版本库的权限
       auth-access：write   #控制鉴权用户访问版本库的权限。
       password-db：passwd   #填用户密码文件
       authz-db：authz      #填用户权限文件
       realm：/var/svn/project_name   #填版本库目录
```

- Passwd 文件

```
[users]
username = password
caokaiyan = caokaiyan
```

- authz 文件

```
[groups]
dev = root,caokaiyan,shijie
test = yanfei
[/]
* = r      #所有用户对于全部文件夹都有写的权利
root = rw  #root 用户拥有全部文件夹的读写权利

[/develop]
@dev = rw  #只有dev组的用户拥有对 project_name/develop 文件夹的读写权利
@test = r

[/test]
@test = rw  #只有test组的用户拥有对 project_name/test 文件夹的读写权利
@dev = r
```

## 开启和关闭 svn 服务

```
svnserve -d -r /var/svn/project_name  开启svn 服务
ps -aux |grep svn
kill -9  svn进程id  关闭是查找 svn 进程id,用 kill -9  杀掉
```

server 端存的仓库数据都是经过压缩的，不能直接用！
我们必须先在服务器上 co 出一个 client 副本，作为 web 访问的目录,这个副本要能设置成自动更新！

```
svn  co  svn://127.0.0.1  /var/www/project_name
```

## SVN 副本自动更新

svn 项目中的 hooks 文件中的 post-commit(该文件夹下有 tmp 文件 去除后缀即可)，这是 svn 给我们提供的钩子文件。
编辑它：（假设我们要自动更新的是 web 目录）

```
cd /var/www/web
svn cleanup
svn up --username=caokaiyan --password = caokaiyan --no-auth-cache --non-interactive /var/www/web
```
