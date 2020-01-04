# Rsync 备份

`Rsync` 基于 `SSH` 同步本地和远程主机之间的文件，在不同主机之间镜像同步整个目录树，支持增量备份，保持链接和权限。`Rsync` 只同步两个文件不同的部分，相同的部分不再传递（增量备份），这使得在服务器传递备份文件或者同步文件，比起`scp`工具要省好多时间。

## Ubuntu18.04 下的安装配置

```bash
$ sudo cp /usr/share/doc/rsync/examples/rsyncd.conf /etc/rsyncd.conf
$ sudo systemctl start rsync.service 
```

## 配置信息

```bash
# motd file=/etc/motd           # 欢迎信息
log file=/var/log/rsyncd        # rsync 不能正确工作时，需要查看该文件
# pid file=/var/run/rsyncd.pid  # 一般由systemd管理，不主动设置
#syslog facility=daemon         # 指定rsync发送日志消息给syslog时的消息级别
#socket options=                # 自定义tcp选项，默认是关闭的

[ftp]                           # 定义一个模块
    comment = public archive    # 模块描述
    path = /var/www/pub         # 需要同步的路径
    use chroot = yes            # chroot到path参数指定的目录下
    max connections=10
    lock file = /var/lock/rsyncd
    address = 192.168.0.100     # 监听地址
    port 873                    # 监听端口
    read only = yes             # 只读限定 
    list = yes                  # 客户请求可用模块时，是否列出该模块
    uid = nobody                # 守护进程使用的 uid
    gid = nogroup               # 守护进程使用的 gid
    strict modes = yes          # 密码文件只能被 pid 用户访问，其他任何用户不可以访问该文件
    ignore errors = yes         # 运行 delete 操作时忽略I/O错误
    ignore nonreadable = yes    # 忽略那些没有访问文件权限的用户
    transfer logging = no       # 使用ftp格式的文件来将操作记录在自己单独的日志中
    timeout = 600               # 超时
    refuse options = checksum dry-run   # 定义一些不允许客户对该模块使用的命令选项列表
    dont compress = *.gz *.tgz *.zip *.z *.rpm *.deb *.iso *.bz2 *.tbz # 同步时不再压缩的类型
```

## 设置忽略文件

```bash
exclude = 
exclude from = 
include =
include from =
```

## 用户权限校验

```bash
auth users =   # 该选项指定由空格或逗号分隔的用户名列表，只有这些用户才允许连接该模块
# 该文件每行包含一个 username:password对，以明文方式存储
# 只有在auth users被定义时，此选项才生效。同时我们需要将此文件权限设置为0600
secrets file = /etc/rsyncd.secrets
```

## 客户端控制

```bash
hosts allow =
hosts deny =
```

## 日志

```bash
log format = %t: host %h (%a) %o %f (%l bytes). Total %b bytes.
%h:远程主机名
%a:远程IP地址
%l:文件长度字符数
%p:该次rsync会话的进程id
%o:操作类型：send 或 recv del
%f:文件名
%P:模块路径
%m:模块名
%t:当前时间
%u:认证的用户名(匿名时是null)
%b:实际传输的字节数
%c:当发送文件时，该字段记录该文件的校验码
```

## inotify 监控文件变化

```bash
$ sudo apt-get install inotify-tools
```