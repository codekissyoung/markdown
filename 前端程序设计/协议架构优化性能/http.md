1 能够提供 web 内容的东西都是 web 资源，比如一个图片文件，一个图书馆公共网关，因特网搜索引擎。

2 MIME type ，用于描述并标记 web 多媒体内容。
比如：html 格式文档由 text/html 标识，ASCII 文本由 text/plain 类型标识，gif ：image/gif ，jpeg 标识：image/jpeg

3 URL 统一资源定位符：方案+服务器地址+ 某个具体资源
如：http ://www.joes-hardware.com/specials/saw-blade.gif

4 http 方法

```bash
GET     得到web资源
PUT     将来自客户端的数据存储到一个web资源里去
DELETE  删除web资源
POST    将客户端数据发送到一个web资源里去
HEAD    只需要得到web资源的http首部就可以了，用于在不获取资源的情况下，判断下资源是否存在，是否更新
```

5，http 状态码

```bash
100            Continue             收到了客户端的初始部分，请客户端继续
200            OK                   获取成功
201            Created              创建服务器对象的请求(如PUT) ，创建成功
202            Accepted             请求已经被接受，但服务器暂时还未采取动作。
301            Moved  Permanently   请求的资源被移除，响应的Location中应该包含资源现在在的URL
302            Found                请求的资源被移除，响应的Location中应该包含资源现在在的URL,但这个URL只作为临时使用，以后还是用旧的
304            Not  Modified        请求的资源未更新，服务器响应不会返回主体
401            Unauthorized         未授权，需要输入用户名和密码
403            Forbidden            请求被服务器拒绝
404            Not  Found           没找到该web资源
405            Method not allowed   请求方法不被允许
406            Not  Acceptable      服务端没有请求的资源类型，accept-type 标识
408            Request    Timeout   超时
500            Internal Server Error服务器内部错误，很可能是代码写错了
502            Bad  GateWay         代理或网关错误
508            GateWay  Timeout     某个网关响应超时了
```

6，一张 web 页面通常不是单个资源，而是一组资源的集合。每个资源都使用一个单独的 http 请求！

7，http 报文

```
请求报文
请求起始行：GET    /tools.html    HTTP/1.0
请求首部：    User-agent :Mozilla/4.75
                        Host:www.joes-hardware.com
                        Accept:text/html ，image/gif, image/jpeg
                        Accept-language:en
请求主体 ：   没有请求主体(因为是get请求)

响应报文
响应起始行：HTTP/1.0 200 OK
响应首部      : Date :Sun ,1st Oct 2000 23:25:17 GMT
                        Server: Apache/1.3.11    Ubuntu(14.)
                        Last-modified: Tue ,04 Jul 2000 09:46:21 GMT
                        Content-length : 1237
                        Content-type     : text/html
响应主体      一堆 html 代码！
```

8 ，HTTP 网络协议栈

```
应用层                 HTTP
传输层                 TCP
网络层                 IP
数据链路层              MAC地址
物理层                 网线
```

9，http 发送报文前会先建立一条 tcp/ip 链接！

```
  a. http://www.netscape.com/index.html 通过DNS解析域名对应的 ip 地址和端口
  b. 解析后：http://207.200.83:80/index.html
  c . 通过 ip 和端口建立一条 tcp/ip 链接
  d .浏览器写好一条 http 请求报文发给服务器
  e  . 服务器接收到请求报文后，回送一条http响应报文
  c  . 关闭tcp/ip链接 ，浏览器显示文档 !
```

10 ， HTTP 协议是基于文本的，人很容易通过 http 协议，与 web 服务器对话
使用 telnet 模拟如下

```bash
cky@cky-pc:~$ telnet kanjiebao.com 80
Trying 101.200.172.72...
Connected to kanjiebao.com.
Escape character is '^]'.
GET /index HTTP/1.1
Host:kanjiebao.com
[空行回车 发送请求]

HTTP/1.1 200 OK
Date: Fri, 06 Nov 2015 14:29:56 GMT
Server: Apache/2.4.7 (Ubuntu)
X-Powered-By: PHP/5.5.9-1ubuntu4.12
Vary: Accept-Encoding
Content-Length: 5394
Content-Type: text/html; charset=UTF-8
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=0.35, maximum-scale=0.35, user-scalable=0"/>
<title>享优惠看街报</title>
<link rel="stylesheet" href="application/views/inc/css/bootstrap.min.css"/>

> telnet  kanjiebao.com  80      /* 通过telnet 建立一条tcp/ip 链接 */
> GET /index HTTP/1.1
  Host:kanjiebao.com                /*  手写 http 请求报文 ，回车就拿到了响应的报文 ^ V ^ */
  [空行]
```
