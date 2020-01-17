## 概述

http 协议是无状态的，对于每个请求，服务端无法区分用户。php 会话控制就是给了用户一把钥匙(一个加密session字符串)，同时这也是用户身份的一个证明，服务端存放了这把钥匙能打开的箱子(数据库，内存数据库或者使用文件做的)，箱子里面装的就是用户的各个变量信息。

这把钥匙放在哪儿呢？
１，url 查询字符串中
２，浏览器cookie中

## 传统的php session 使用

```
<?php
//page1.php 启动一个会话并注册一个变量
session_start();
$_SESSION['user_var'] = "hello,codekissyoung!";
//这里的可以将$_SESSION理解为用户的箱子，实际的实现是php在服务器端生成的小文件
?>
```
```
<?php
//page2.php
session_start();
echo $_SESSION['user_var'];//通过钥匙访问自己的箱子内的变量
$_SESSION['user_var'] = "bey,codekissyoung!";
```
```
<?php
//page3.php 销毁钥匙,一般在用户注销时，访问page3.php文件
session_start();
session_destroy();
?>
```
提一个问题，钥匙呢？没看见给用户钥匙的操作啊？
这个操作是php背后帮我们做了的，自从你访问page1.php 程序运行，session_start();这句时，php 会根据此刻的一些条件(用户ip,浏览器号，时间等)生成一个PHPSESSID变量，http response 回客户端后，这个PHPSESSID就已经存在你的浏览器cookie里了，每次你再次访问这个域名时，该PHPSESSID都会发送到服务端。这个PHPSESSID 就是我这里说的用户钥匙了。

再一个问题，这个PHPSESSID的安全性，它是否容易被窃取，是否容易被伪造，是否容易被篡改？
使用 Https 可以防止被篡改。不使用PHPSESSID,而是自己生成一把秘钥给用户可以防止被伪造。至于是否容易被窃取，还真没怎么研究过。比如如果你电脑连着网，黑客入侵你电脑。

## 将生成的秘钥存入浏览器cookie中 ##
```
设置cookie
setCookie('key','value',time()+3600);
删除cookie
setCookie('key','',time()-1);
```

## 实现单点登录:session共享 ##

单点登录：多个子系统之间共用一套用户验证体系，在其中一处登录，就可以访问所有子系统。
试想这么一种情景：假设服务器A与B的php环境一致。用户在 服务器A 上拿到了自己的钥匙，然后他拿着这把钥匙去访问服务器B,请问服务器B认识么？
很显然不能，服务器A生成的钥匙，服务器并不认识。
解决办法：用户无论访问A或B,生成的钥匙我都存储在C（同一个数据库，或缓存系统）中，用户再次访问A或B时，A和B都去问下C:这个用户的钥匙对么？对的话，用户就可以使用自己存在A或者B那里的箱子了。
```
<?php
session_regenerate_id();//重置　session 　字符
$session_info=array('uid'=>$uid,'session'=>session_encrypt(session_id().time()));
//下一步将，$session_info 存到　C 中
```

提一个问题，钥匙呢？没看见给用户钥匙的操作啊？
这个操作是php背后帮我们做了的，自从你访问page1.php 程序运行，session_start();这句时，php 会根据此刻的一些条件(用户ip,浏览器号，时间等)生成一个PHPSESSID变量，http response 回客户端后，这个PHPSESSID就已经存在你的浏览器cookie里了，每次你再次访问这个域名时，该PHPSESSID都会发送到服务端。这个PHPSESSID 就是我这里说的用户钥匙了。
再一个问题，这个PHPSESSID的安全性，它是否容易被窃取，是否容易被伪造，是否容易被篡改？
使用 Https 可以防止被篡改。不使用PHPSESSID,而是自己生成一把秘钥给用户可以防止被伪造。

## 将生成的秘钥存入浏览器cookie中

```php
<?php
setCookie('key','value',time()+3600); //设置cookie
setCookie('key','',time()-1); // 删除cookie
```

## 实现单点登录:session共享

单点登录：多个子系统之间共用一套用户验证体系，在其中一处登录，就可以访问所有子系统。
试想这么一种情景：假设服务器A与B的php环境一致。用户在 服务器A 上拿到了自己的钥匙，然后他拿着这把钥匙去访问服务器B,请问服务器B认识么？
很显然不能，服务器A生成的钥匙，服务器并不认识。
解决办法：用户无论访问A或B,生成的钥匙我都存储在C（同一个数据库，或缓存系统）中，用户再次访问A或B时，A和B都去问下C:这个用户的钥匙对么？对的话，用户就可以使用自己存在A或者B那里的箱子了。

```php
<?php
session_regenerate_id();//重置session
$session_info=['uid'=>$uid,'session'=>session_encrypt(session_id().time())];
//下一步将，$session_info 存到　C 中
```
