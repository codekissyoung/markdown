# 检测是否符合基本安装条件
```
curl -Ss http://www.workerman.net/check.php | php
```

# php7 安装 Event 拓展
```shell
# 先安装 libevent 库 , 要求版本大于 2
➜  workerman git:(master) ✗ sudo apt-get install libevent-2.0-5
[sudo] password for cky:
Reading package lists... Done
Building dependency tree       
Reading state information... Done
libevent-2.0-5 is already the newest version (2.0.21-stable-2ubuntu0.16.04.1).
libevent-2.0-5 set to manually installed.
0 upgraded, 0 newly installed, 0 to remove and 3 not upgraded.

# 下载 event 库
➜  software wget http://pecl.php.net/get/event-2.3.0.tgz
$ phpize
$ ./configure --with-event-core --with-event-extra --enable-event-debug
$ make
Optionally run tests:
$ make test
Install it (as root):
$ sudo make install
```
