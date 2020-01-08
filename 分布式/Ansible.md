# Ansible

`Ansible`是配置管理工具，类似的有`Chef`、`Puppet`、`Salt`。

## 概述

`Ubuntu 18.04`下安装：

```bash
sudo apt install software-properties-common
sudo apt-add-repository ppa:ansible/ansible
sudo apt-get update
sudo apt-get install ansible
```

一个Demo：

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
$ ansible linkDb -m ping                    # 测试连通性
192.168.0.11 | SUCCESS => {
192.168.0.12 | SUCCESS => {
$ ansible linkDb -a"tail /var/log/syslog"   # linkDb集群上执行一个命令
```

## playbook 剧本

```bash
.
├── ansible.cfg
├── book.yml
├── files
│   └── nginx.conf
├── hosts
└── templates
    └── index.html
```

```conf
# nginx.conf
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;
    server_name a.cky.com;
    location / {
        try_files $uri $uri/ =404;
    }
}
```

```bash
# index.html
<h1>hello ansible</h1>
```

```yaml
# book.yml
---
- name: Configure webserver with nginx
  hosts: linkWeb
  tasks:
    - name: install nginx
      apt: name=nginx update_cache=yes
    - name: 设置nginx配置文件
      copy: >
        src=files/nginx.conf
        dest=/etc/nginx/sites-available/default
    - name: 让nginx配置文件生效
      file: >
        src=/etc/nginx/sites-available/default
        dest=/etc/nginx/sites-enabled/default
        state=link
    - name: copy index.html
      template: >
        src=templates/index.html
        dest=/var/www/html/index.html
        mode=0644
    - name: restart nginx
      service: name=nginx state=restarted
...
```

上面的`book.yml`便是剧本文件，完成的任务是：在目标主机上，安装`nginx server`，配置`vhosts`，配置`index.html`，以及重启。

```bash
$ ansible-playbook webservers.yml -b -K # 以当前用户登录，并且在执行 sudo 时，询问密码
```

上述`book.yml`里的内容称为一个`play`，包含了`host`的无序集合，以及`task`的有序列表。每个`task`中使用了模块完成功能。

当然，一个`yml`文件里可以包含多个`play`。

### 常用模块

```bash
apt         # apt 包管理工具
copy        # 将一个文件从本地复制到主机
file        # 设置文件、符号链接、或者目录的属性
service     # 启动、停止、或者重启一个服务
template    # 从模板生成一个文件并复制到主机上
... 大约有 200 个
```

查看模块的使用方法：

```bash
$ ansible-doc service
```

### 改进版本

```bash
.
├── ansible.cfg
├── book.yml
├── files
│   ├── create-ssh
│   ├── nginx.crt
│   └── nginx.key
├── hosts
└── templates
    ├── index.html.j2
    └── nginx.conf.j2
```

用于生成公私钥`nginx.key` `nginx.crt`的`create-ssh`脚本：

```bash
# create-ssh
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -subj /CN=a.cky.com -keyout nginx.key -out nginx.crt
```

使用了`Python` `jinja` 模板变量机制的文件：

```html
<!-- index.html.j2 -->
<h1>Nginx Configuration by Ansible</h1>
<p>server_name : {{ server_name }}</p>
<p>www dir : {{ www_path }} </p>
```

```bash
# nginx.conf.j2
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    listen 443 ssl;
    root /var/www/html;
    index index.html index.htm;
    server_name {{ server_name }}; 
    ssl_certificate {{ cert_file }}; 
    ssl_certificate_key {{ key_file }}; 
    location / { 
        try_files $uri $uri/ =404;
    }   
}
```

修改后的`book.yml`：

```yml
---
- name: Configure webserver with nginx
  hosts: linkWeb
  vars:
    nginx_path: /etc/nginx
    ssl_path: /etc/nginx/ssl
    key_file: /etc/nginx/ssl/nginx.key
    cert_file: /etc/nginx/ssl/nginx.cert
    www_path: /var/www/html
    server_name: a.cky.com
  tasks:
    - name: install nginx
      apt: name=nginx update_cache=yes cache_valid_time=3600
    - name: set nginx configuration
      template: >
        src=templates/nginx.conf.j2
        dest={{ nginx_path }}/sites-available/default
        owner=root mode=0600
      notify: restart nginx # 与 handlers 中 restart nginx 对应
    - name: enable nginx configuration
      file: >
        src={{ nginx_path }}/sites-available/default
        dest={{ nginx_path }}/sites-enabled/default
        state=link
      notify: restart nginx # 与 handlers 中 restart nginx 对应
    - name: create dir for ssl certificates
      file: path={{ ssl_path }} state=directory
    - name: copy TLS key
      copy: src=files/nginx.key dest={{ key_file }} owner=root mode=0600
    - name: copy TLS certificate
      copy: src=files/nginx.crt dest={{ cert_file }}
      notify: restart nginx
    - name: copy index.html
      template: >
        src=templates/index.html.j2
        dest={{ www_path }}/index.html
        mode=0644
  handlers:
    - name: restart nginx
      service: name=nginx state=restarted
...
```

最大的变化是引入了 `vars`、`notify -> handlers` 机制。

## inventory: 描述你的服务器
