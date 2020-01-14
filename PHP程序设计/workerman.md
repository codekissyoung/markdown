# Workerman

`Workerman`是一款开源高性能异步`PHP socket`即时通讯框架。

## 安装

```shell
# 安装 libevent 库 , 要求版本大于 2
➜  workerman git:(master) ✗ sudo apt-get install libevent-2.0-5

# 安装 php 的event库
➜  software wget http://pecl.php.net/get/event-2.3.0.tgz
$ phpize
$ ./configure --with-event-core --with-event-extra --enable-event-debug
$ make
Optionally run tests:
$ make test
Install it (as root):
$ sudo make install
```

```
curl -Ss http://www.workerman.net/check.php | php
```