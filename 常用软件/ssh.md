# SSH 远程登录

关于`SSH`远程登录服务器的所有相关知识。

## 原理

每台服务器上的每个用户都可以生成本用户的一对 “公私钥”，用户A 将公钥`id_rsa.pub`内容写入到 用户B 的受信任的公钥文件`authorized_keys`里，则用户A使用`ssh userB@hostB`命令登录`hostB`时。用户A 的私钥`id_rsa`与`hostB`中`authorized_keys`的某行内容匹配了，可直接免密登录。

如果两台机器分别将公钥，写入到对方的`authorized_keys`里，那么可以互相免密登录，俗称“互信”。

```bash
$ ssh-keygen                    # 生成公私钥
~/.ssh/id_rsa.pub               # 公钥文件
~/.ssh/id_rsa                   # 私钥文件
~/.ssh/authorized_keys          # 信任的公钥文件 权限 0600
```

```bash
$ /etc/init.d/ssh restart
$ netstat -tlp                          # 判断ssh是否运行
$ sudo systemctl restart sshd.service
$ ssh caokaiyan@192.168.0.103
$ ssh -t hostA ssh hostB                # 通过 hostB 连接到 hostA 跳板机 
```

```bash
$ scp .ssh/id_rsa.pub cky@101.202.144.41:~/id_rsa.pub # 本机传文件到远程机器
$ cat id_rsa.pub >> .ssh/authorized_keys              # 远程机器 执行
$ chmod 600 .ssh/authorized_keys                      # 修改权限
```

```bash
$ scp ./full.tar.gz 　cky@101.200.144.41:~/data/ # 本地 => 远程
$ scp cky@101.200.144.41:~/data/aa.txt ./        # 远程 => 本地
$ yes | pv | ssh $host "cat > /dev/null"         # 实时SSH网络吞吐量测试
```

保持持久连接

```bash
# /etc/ssh/ssh_config
ServerAliveInterval 20  # 每 20s 请求下 server 从而保持连接
ServerAliveCountMax 5   # server 未响应5次 就断开连接
```

[25个必须记住的SSH命令](http://blog.urfix.com/25-ssh-commands-tricks/)
