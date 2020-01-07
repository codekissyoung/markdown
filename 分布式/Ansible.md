# Ansible

`Ansible`是配置管理工具，类似的有`Chef`、`Puppet`、`Salt`。

## 概述

`Ubuntu 18.04`下安装：

```bash
sudo apt install software-properties-common
sudo apt-add-repository ppa:ansible/ansible
sudo apt update
sudo apt install ansible
```

### 非常简单的demo

```bash
$ tree
.
├── ansible.cfg
└── hosts
```

```bash
# ansible.cfg
[defaults]
hostfile = hosts
inventory = hosts
remote_user = link
private_key_file = ~/.ssh/id_rsa
host_key_checking = true
```

```bash
# hosts
[linkDb]
192.168.0.11 ansible_python_interpreter=/usr/bin/python3 
192.168.0.12 ansible_python_interpreter=/usr/bin/python3
[linkWeb]
192.168.0.13 ansible_python_interpreter=/usr/bin/python3
```

```bash
$ ansible linkWeb -m ping
192.168.0.13 | SUCCESS => {
$ ansible linkDb -m ping
192.168.0.11 | SUCCESS => {
192.168.0.12 | SUCCESS => {
$ ansible linkDb -a"tail /var/log/syslog"   # linkDb集群上执行一个命令
```
### play
`Ansible`引入了一种`DSL`，可以用来描述服务器的状态。

```bash
$ ansible-playbook webservers.yml
```