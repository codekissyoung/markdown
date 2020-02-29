# PHP Session 机制

http 协议是无状态的，对于每个请求，服务端无法区分用户。PHP 为了区分用户，采用了 Session 机制。

## 概述

第一次用户通过 HTTP 请求访问时，php 会根据此刻的一些条件(用户 ip，浏览器号，时间等)生成一个 PHPSESSID 字符串。该字符串会写入到 HTTP 返回报文的 Cookie 中：

![](https://img.codekissyoung.com/2020/02/29/286b496bdd16dc195374d787c83cd0dc.png)

要完成这个操作，在 PHP 中只需要一句代码：

```php
session_start();
```

此后，获取到了 PHPSESSID 并且存储到 Cookie 中的浏览器，在每次发送 HTTP 请求中都会带上该 PHPSESSID：

![](https://img.codekissyoung.com/2020/02/29/82ddf07d8905a230aea2c0557d64e3d3.png)

这样，我们的 PHP Server 就有了识别不同用户的能力。

#### Session 存储用户数据

如果想要存储一些个人数据，只需要通过：

```php
// index.php
session_start();
$_SESSION['username'] = "link";
```

而读取只需要：

```php
// read.php
session_start();
echo $_SESSION['username'];
```

为了隐私，销毁数据只需要：

```php
// destroy.php
session_start();
session_destroy();
```

#### Session 数据实际存储的地方

打开`php.ini`配置文件，正常来说，默认配置下 Session 机制数据是存储在文件中的，但是我将它改为了存储在无密码的本地 Redis Server 里：

```conf
[Session]
session.save_handler = redis
session.save_path = "tcp://127.0.0.1:6379"
session.use_strict_mode = 0
session.use_cookies = 1
session.use_only_cookies = 1
session.name = PHPSESSID
session.auto_start = 1
session.cookie_lifetime = 0
session.cookie_path = /
session.cookie_domain =
session.cookie_httponly = 1
session.serialize_handler = php
session.gc_probability = 0
session.gc_divisor = 1000
session.gc_maxlifetime = 1440
session.referer_check =
session.cache_limiter = nocache
session.cache_expire = 180
session.use_trans_sid = 0
session.sid_length = 26
session.trans_sid_tags = "a=href,area=href,frame=src,form="
session.sid_bits_per_character = 5
```

来看下数据实际存储时候的样子：

```bash
127.0.0.1:6379> keys *SESSION*
 1) "PHPREDIS_SESSION:een87vp13avk7c1epo4dodfvi7"
 2) "PHPREDIS_SESSION:3h6v2tau5gp0dpk1uj9cst7jkg"
 3) "PHPREDIS_SESSION:1e09v5uk3eb76klkkji5p006ig"
127.0.0.1:6379> type PHPREDIS_SESSION:06k7lnq7mnshkdq7crjpmem1ol
string
127.0.0.1:6379> get PHPREDIS_SESSION:06k7lnq7mnshkdq7crjpmem1ol
"username|s:4:\"link\";"
```

#### Session 共享问题

接着上面的讨论，假如我们不使用本地 Redis,而是所有 PHP Server 共用一个中心 Redis，那么它们的 Session 不就共享了么 ^\_^，用户通过负载均衡过来的请求，无论最后分给哪一个 PHP Server 处理，都能拿到该用户存储在 Session 中的数据。

![](https://img.codekissyoung.com/2020/02/29/494edee80eb7df61267580d82172f72d.png)

#### Session 机制安全性

再一个问题，这个 PHPSESSID 的安全性，它是否容易被窃取，是否容易被伪造，是否容易被篡改？使用 Https 可以防止被篡改。
