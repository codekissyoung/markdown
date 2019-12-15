# 安装拓展一般步骤

```shell
$ sudo apt-get install autoconf
$ phpize
$ ./configure --with-php-config=/usr/bin/php-config
$ sudo make && make install

# 修改对应的 php.ini 文件
```

- `extension_dir` 配置会在PHP编译安装时写入默认值,通过`phpinfo`可以搜索它的实际值
- 安装之前先配置好`autoconf`
- `--with-php-config`配置选项是为了`make install`命令能够正确的帮我们移动拓展`xxxx.so`到相应的php拓展目录,以及相关配置的书写,其中`php-config` 得看它实际的目录,而不是写死的 `/usr/local/php/bin/php-config`

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


# php 是否适合 做后台常驻程序？

> 答案: 不适合

- php可以实现所有功能，内存问题也逐步变好，这是好事，但这并不是php适合做这件事的理由。要说可以实现功能，采用awk + nc也可以写一个常驻后台的web server且性能不一定比php差，但实际上绝不会有人采用这种geek的技术方案。

- php的设计目的是方便的构建动态网页，并非后台服务，使用一种语言工具应当尽可能扬长避短，勉力而为之并不合适。

- php缺乏内建的线程和非阻塞机制，采用fork的非阻塞方案已经在好几年前被证明是低效的，并非现在最合适的技术方案

- php缺乏制作后台常驻程序的库、框架、成功案例，相比其他在这个领域发展了许多年的语言、或专门为制作后台程序而生的语言（如C、Java、Go等），php并不合适

```bash
对这个回答持保留态度 ... 我自己用 php 实现过 webServer 和 socketServer ...
用到了 libevent 取代死循环 ... 用到了 shmop 缓存 ... 以及都是多进程 fork 的 ...
我用到了一切我能想到的优化 ... 但性能依然很烂 ...
socketServer 还好 ... 因为要维持长连接推送即可 ...
webServer 只能用呵呵来形容 ... 做做玩具还可以 ... 没办法真正用到生产环境去 ...
至于顶楼说的问题 ... 内存泄露什么的 ... 不敢说没有也不敢说有 ...
我只知道我的 php daemon 运行几个月 ... 也没见吃内存吃得多异常 ...
我完全没有在程序里刻意的调用 gc_collect_cycles() 或者 unset() 什么的 ...
运行也一切正常 ... 以及我觉得就 php 这种语言本身的特性而言 ...
只要你不直接去操作内存 ... 只是做普通操作的话 ... 想要内存泄露也难吧 ...
唯一需要注意的事情是 ... php 在做 daemon 的时候 ...
如果你连接了外部的服务 ... 切记要在再次打开连接之前关闭之前的连接！！
我见到的很多 php 程序员已经没这个习惯了 ... 写 daemon 需要注意的其实只有这一个 ...
基本就是这样 ... 总之 ... 嘛 ... 不管什么语言 ... 写得顺手就好了 ...
毕竟没有弱爆的语言只有弱爆的程序员 ...
```

## 在某些情况下使用

- 没什么性能压力、对稳定性也没什么特别要求时
- 必须调用很多php写的库，不方便使用其他语言重写时
- 开发同学只会写php，又找不到更好的人来实现这个项目时
- 总之，能不使用php做后台程序就别用，如果用了且未来还会上量，最好早做用其他语言重写的打算吧。


## 将配置文件移出文档根目录

简单的说，互联网上任何不能被用户直接访问的文件都不应该保存在Web站点的文档根目录。
比如 codekissyoung.com  对应的 web根目录是  /var/www/codekissyoung
那么所有与 codekissyoung 有关的配置，文档之类的文件，都应该放在/var/www/codekissyoung_etc 下
在 codekissyoung 的访问接口 index.php 中：
require "../codekissyoung_etc/etc.php";

严禁将账号密码等明文写于文件中

类似于 数据库配置，网站 常数 KEY 值，管理员账号等敏感信息，应该放于codekissyoung_etc/etc.php 中，严禁明文写在程序中！
这样做的原因是当一个恶意用户请求一个非php或html文件时可能发生的状况，默认情况下Web服务器会将文件的内容导出到输出流。
要更好的避免这种情况，还必须确保配置Web服务器为只允许请求php和html文件，而对其他类型的文件请求必须返回错误。
同样的，任何其他文件，如密码文件、配置文件等，都必须与公众文档根目录隔离。
还有，不要启用php的allow_url_fopen选项，避免引入其他机器上的文件。
```

文件系统权限

PHP是能够与本地文件系统进行交互的。必须确保在PHP与文件系统交互时的权限问题，保证用户不能看到私密的文件，如php.ini等。



```
/*
 * 2014年12月30日自己总结的关于php error 的知识和最佳实践
 * 
 * 先从错误产生流程说起: 
 * php脚本运行--->脚本出错或主动报错---->触发php error 机制
 * ---->机制判断：是否有自定义的错误处理机制？--->(是)使用自定义的机制---->(否)使用php内部的错误机制
 *---->根据错误处理情况，决定脚本是退出还是继续运行
 * 
 * 再说细节：
 * 
 * ----主动报错----
 *trigger_error(‘我的报错信息’,【错误级别】);
 *脚本中，只要执行了这个函数，就会触发上面流程，比如：我传个参数，如果比3大，我就报错！
 *if（$var>3）{
 *	trigger_error(‘数太大了，换一个’,E_USER_WARNING);
 *}
 * 
 * ----自定义错误机制------
 * 我们可以单独写成一个自定义错误处理文件error_handler.php，然后每段脚本都加载它，这样我们就可以用自己的错误机制，而不用php内部的了！
 * 如果这个文件写的好，对开发来说是非常有利的！
 * 
 * 文件推荐写法：
 * error_handler.php
 * 
 * 先根据错误级别，给每个 级别写 上自定义处理函数
 *  function E_ERROR_handler($error_level,$error_message,【$error_file,$error_line,$error_context】){
 *  	函数里面写错误处理代码！
 *  	一般会写的东西：
 *  				错误发生的时间：$time=date("Y-m-d H:i:s");
 *  				错误级别(数值)：$error_level;
 *  				传过来的错误信息：$error_message;
 *  				错误发生的文件名：$error_file;
 *  				错误发生的行数：$error_line;
 *  				错误发生时涉及到的变量数组：$error_context;
 *  	你可以根据$error_level,或者$error_message的值，来决定如何处理错误
 *  				if($error_level==8){....}
 *  				if($error_message=="数据库错误"){...}
 *  	这些东西，你可以选择，将它们打印在屏幕上，然后退出脚本/继续脚本
 *  				echo .....;或者exit(....);
 *  	但是我建议你将它们都分门别类的记录下来;首先，将上面信息链接成字符串 
 *  				$error_log;
 *  	然后，再存到文件中去！
 *  				error_log($error_log;3,'/var/php/error_log/E_ERROR_log.log');
 *  }
 *   function E_WARNING_handler(){....}
 *   function E_NOTICE_handler(){....}
 *   .....
 * 再将每个自定义好的函数，根据错误处理级别，注册到php error 处理机制中去！
 * 	set_error_handler('E_ERROR_handler',E_ERROR);
 * 	set_error_handler('E_NOTICE_handler',E_NOTICE);
 *  .....
 * 
 * ----题后话-----
 * 错误处理的原理和形式是不难的，难点是你如何设计自定义错误处理的handler函数
 * -----附录（错误级别）------
值		常量						描述
2		E_WARNING				非致命的 run-time 错误。不暂停脚本执行。
8		E_NOTICE				Run-time 通知。脚本发现可能有错误发生，但也可能在脚本正常运行时发生。
256		E_USER_ERROR			致命的用户生成的错误。这类似于程序员使用 PHP 函数 trigger_error() 设置的 E_ERROR。
512		E_USER_WARNING			非致命的用户生成的警告。这类似于程序员使用 PHP 函数 trigger_error() 设置的 E_WARNING。
1024	E_USER_NOTICE			用户生成的通知。这类似于程序员使用 PHP 函数 trigger_error() 设置的 E_NOTICE。
4096	E_RECOVERABLE_ERROR		可捕获的致命错误。类似 E_ERROR，但可被用户定义的处理程序捕获。(参见 set_error_handler())
8191	E_ALL					所有错误和警告，除级别 E_STRICT 以外。
（在 PHP 6.0，E_STRICT 是 E_ALL 的一部分）
 * 
 * ----附录(php.ini关于error的设置)-----
 * 开发环境：
 * error_reporting=E_ALL
 * display_errors=On
 * html_errors=On
 * log_errors=Off
 * 上线运营的系统:
 * error_reporting=E_ALL & ~E_NOTICE
 * display_errors=Off
 * html_errors=Off
 * log_errors=On
 * error_log="/var/log/httpd/my-php-error.log"
 * ignore_repeated_errors=on
 * ignore_repeate_source=on
 * 
 * */
 ```
 echo "This works: {$arr['foo'][3]}";
 echo "This works too: {$obj->values[3]->name}";
 echo "This is the value of the var named $name: {${$name}}";
 echo "value of the var named by the return value of getName(): {${getName()}}";
 echo "value of the var named by the return value of \$object->getName(): {${$object->getName()}}";
 ```

