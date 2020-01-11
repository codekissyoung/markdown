# 搭建TiDB集群

## 中控机

创建 `tidb` 用户:

```bash
$ sudo adduser tidb 
$ sudo visudo                               # 修改tidb权限为 sudo 免密

tidb ALL=(ALL) NOPASSWD: ALL

$ su - tidb                                 # 切换到 tidb 用户进行操作
$ ssh-keygen                                # 创建 tidb 用户 公私钥
```

下载相关软件:

```bash
$ sudo apt-get -y install git curl sshpass python-pip
```

安装`ansible`:

```bash
$ git clone -b v3.0.6 https://github.com/pingcap/tidb-ansible.git
$ cd tidb-ansible
$ sudo pip install -r requirements.txt              # 安装 ansible 的相关依赖
$ ansible --version                                 # 确定下版本
ansible 2.7.11
  config file = /home/tidb/tidb-ansible/ansible.cfg
...
```

配置`ansible`:

### tidb 用户机器互信，且 sudo 免密

所有机器上，都生成`tidb`用户，然后设置`sudo visudo`.

```bash
tidb ALL=(ALL) NOPASSWD: ALL
```

```bash
$ sudo -su root     # 验证能直接切换成 root 而无需密码
```

### ntp 时间同步服务

```bash
$ sudo apt-get install ntp
```

修改下配置文件 `/etc/ntp.conf`，设置上游服务器为中国的：

```conf
server 0.cn.pool.ntp.org iburst
server 1.cn.pool.ntp.org iburst
server 2.cn.pool.ntp.org iburst
server 3.cn.pool.ntp.org iburst
```

```bash
tidb@node9:~$ sudo service ntp restart
tidb@node9:~$ sudo service ntp status
```




