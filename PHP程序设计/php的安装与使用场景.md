# php作为服务器端脚本

## 直接的模块接口SAPI

对于很多服务器，PHP 均有一个直接的模块接口（也叫做 SAPI）。这些服务器包括 Apache、Microsoft Internet Information Server、Netscape 和 iPlanet 等服务器。其它很多服务器支持 ISAPI，即微软的模块接口（OmniHTTPd 就是个例子）。

## 作为 CGI 或 FastCGI 处理器

如果 PHP 不能作为模块支持 web 服务器，总是可以将其作为 CGI 或 FastCGI 处理器来使用。这意味着可以使用 PHP 的 CGI 可执行程序来处理所有服务器上的 PHP 文件请求。
官方文档：http://php.net/install.fpm
    首先，CGI是干嘛的？CGI是为了保证web server传递过来的数据是标准格式的，方便CGI程序的编写者。
    web server（比如说nginx）只是内容的分发者。比如，如果请求/index.html，那么web server会去文件系统中找到这个文件，发送给浏览器，这里分发的是静态数据。好了，如果现在请求的是/index.php，根据配置文件，nginx知道这个不是静态文件，需要去找PHP解析器来处理，那么他会把这个请求简单处理后交给PHP解析器。Nginx会传哪些数据给PHP解析器呢？url要有吧，查询字符串也得有吧，POST数据也要有，HTTP header不能少吧，好的，CGI就是规定要传哪些数据、以什么样的格式传递给后方处理这个请求的协议。仔细想想，你在PHP代码中使用的用户从哪里来的。
    当web server收到/index.php这个请求后，会启动对应的CGI程序，这里就是PHP的解析器。接下来PHP解析器会解析php.ini文件，初始化执行环境，然后处理请求，再以规定CGI规定的格式返回处理后的结果，退出进程。web server再把结果返回给浏览器。
好了，CGI是个协议，跟进程什么的没关系。那fastcgi又是什么呢？Fastcgi是用来提高CGI程序性能的。
    提高性能，那么CGI程序的性能问题在哪呢？"PHP解析器会解析php.ini文件，初始化执行环境"，就是这里了。标准的CGI对每个请求都会执行这些步骤（不闲累啊！启动进程很累的说！），所以处理每个时间的时间会比较长。这明显不合理嘛！那么Fastcgi是怎么做的呢？首先，Fastcgi会先启一个master，解析配置文件，初始化执行环境，然后再启动多个worker。当请求过来时，master会传递给一个worker，然后立即可以接受下一个请求。这样就避免了重复的劳动，效率自然是高。而且当worker不够用时，master可以根据配置预先启动几个worker等着；当然空闲worker太多时，也会停掉一些，这样就提高了性能，也节约了资源。这就是fastcgi的对进程的管理。
那PHP-FPM又是什么呢？是一个实现了Fastcgi的程序，被PHP官方收了。

大家都知道，PHP的解释器是php-cgi。php-cgi只是个CGI程序，他自己本身只能解析请求，返回结果，不会进程管理（皇上，臣妾真的做不到啊！）所以就出现了一些能够调度php-cgi进程的程序，比如说由lighthttpd分离出来的spawn-fcgi。好了PHP-FPM也是这么个东东，在长时间的发展后，逐渐得到了大家的认可（要知道，前几年大家可是抱怨PHP-FPM稳定性太差的），也越来越流行。
好了，最后来回来你的问题。
网上有的说，fastcgi是一个协议，php-fpm实现了这个协议

# 启用一个web服务器

`php -S localhost:8080 -t /home/cky/workspace/nodejs/grunt`

# 为何需要CGI

客户端在访问动态页面时，因为apache和nginx只能提供静态解析，这是他们通过内置的cgi接口去寻找php等脚本语言，当需要用到数据部分时PHP会去调用后台MYSQL数据库中的数据，之后通过解析生成静态页面在返回apache/nginx服务器，再由此交付给客户端。

# CGI 的位置

浏览器 ---> web服务器 ---CGI协议--> php解释器 ---> DB数据库

# CGI技术的性能缺陷

每当服务器收到一个对CGI程序请求时，服务器都将创建一个CGI程序的进程，CGI程序处理完请求后，将输出发给服务器或直接传回客户端，然后终止。

## fastCGI技术

fastCGI对CGI技术进行了改良，一个fastCGI进程在WEB服务器启动时或在客户端第一次请求时创建，它处理完客户端请求后并不终止，而是等待处理下一个请求。

## fastCGI与CGI与服务器的交互方式不同

- CGI程序通过环境变量、命令行、标准输入输出进行交互，因此CGI程序进程必须与服务器进程在同一台物理计算机上
- fastCGI程序与服务器进程通过(网络连接)交互，因此fastCGI程序可以分布在不同的计算机上，这不但可以提高性能，同时也提高了系统的扩展能力。
