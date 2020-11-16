# SSH 远程登录

[SSH原理与运用（一）：远程登录](http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html)

[SSH原理与运用（二）：远程操作与端口转发](http://www.ruanyifeng.com/blog/2011/12/ssh_port_forwarding.html)

`SSH`整个过程是这样的：

（1）远程主机收到用户的登录请求，把自己的公钥发给用户。

（2）用户使用这个公钥，将登录密码加密后，发送回来。

（3）远程主机用自己的私钥，解密登录密码，如果密码正确，就同意用户登录。

#### 中间人攻击

如果有人截获了登录请求，然后冒充远程主机，将伪造的公钥发给用户，那么用户很难辨别真伪。因为不像https协议，SSH协议的公钥是没有证书中心（CA）公证的，也就是说，都是自己签发的。

可以设想，如果攻击者插在用户与远程主机之间（比如在公共的wifi区域），用伪造的公钥，获取用户的登录密码。再用这个密码登录远程主机，那么SSH的安全机制就荡然无存了。这种风险就是著名的["中间人攻击"](http://en.wikipedia.org/wiki/Man-in-the-middle_attack)（Man-in-the-middle attack）。



[25 个必须记住的 SSH 命令](http://blog.urfix.com/25-ssh-commands-tricks/)

## 原理

每台服务器上的每个用户都可以生成本用户的一对 “公私钥”，用户 A 将公钥`id_rsa.pub`内容写入到 用户 B 的受信任的公钥文件`authorized_keys`里，则用户 A 使用`ssh userB@hostB`命令登录`hostB`时。

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

## 临的公私钥登录

拿到公钥`tmpzale.pub`、私钥`tmpzale.pub`、和 `passphrase` 密码为 `pwd1234`。放到`.ssh`目录下：

```bash
.ssh/
├── id_rsa
├── id_rsa.pub
├── known_hosts
├── tmpzale             # 临时私钥
└── tmpzale.pub         # 临时公钥
```

指定私钥就可以登录：

```bash
$ ssh link@10.20.30.40 -i~/.ssh/tmpzale -p9510
Enter passphrase for key '/home/cky/.ssh/tmpzale':
```

这样做每次都需要输入`passphrase`，在一个终端里，可以使用`ssh-agent`来存储公私钥，然后`ssh`直接从`ssh-agent`里取，就不用再输入`passphrase`了。

```bash
$ eval $(ssh-agent)
$ ssh-add -k .ssh/tmpzale
Enter passphrase for .ssh/tmpzale:  # 这里需要输入 passphrase
Identity added: .ssh/tmpzale (.ssh/tmpzale)
$ ssh-add -l                        # 查看存储的私钥
2048 SHA256:aF..........qjc8o0 .ssh/tmpzale (RSA)
$ ssh-add -L                        # 查看存储的公钥
ssh-rsa AAAAxV..........vxr33B .ssh/tmpzale
```

因为每次输入`passphrase`都很麻烦，所以不考虑安全性的话，完全可以将附着在私钥上的`passphrase`去掉，直接使用私钥，这样就无需输入操作了.

```bash
$ openssl rsa -in ./tmpzale -out ./tmpzale.new
Enter pass phrase for ./tmpzale:
writing RSA key
```
