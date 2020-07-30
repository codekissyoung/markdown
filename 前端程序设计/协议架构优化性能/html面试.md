## 一个网页从请求到最终显示的完整过程一般可以分为如下 7 个步骤：

（1）在浏览器中输入网址；
（2）发送至 DNS 服务器并获得域名对应的 WEB 服务器 IP 地址；
（3）与 WEB 服务器建立 TCP 连接；
（4）浏览器向 WEB 服务器的 IP 地址发送相应的 HTTP 请求；
（5）WEB 服务器响应请求并返回指定 URL 的数据，或错误信息，如果设定重定向，则重定向到新的 URL 地址；
（6）浏览器下载数据后解析 HTML 源文件，解析的过程中实现对页面的排版，解析完成后在浏览器中显示基础页面；
（7）分析页面中的超链接并显示在当前页面，重复以上过程直至无超链接需要发送，完成全部数据显示。

## 行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？

**_行内元素_**：
a - 锚点，em - 强调，strong - 粗体强调，span - 定义文本内区块，i - 斜体,img - 图片,b - 粗体，label - 表格标签，select - 项目选择，textarea - 多行文本输入框，sub - 下标，
sup - 上标，q - 短引用；
**_块元素_**：
div - 常用块级，dl - 定义列表，dt，dd，ul- 非排序列表，li，ol-排序表单，p-段落，h1，h2，h3，h4，h5-标题，table-表格，fieldset - form 控制组，form - 表单，
**_空元素_**：
br-换行，hr-水平分割线；

## 浏览器内核

浏览器最重要或者说核心的部分是“Rendering Engine”，可大概译为“渲染引擎”，不过我们一般习惯将之称为“浏览器内核”。
负责对网页语法的解释（如标准通用标记语言下的一个应用 HTML、JavaScript）并渲染（显示）网页。
所以，通常所谓的浏览器内核也就是浏览器所采用的渲染引擎，渲染引擎决定了浏览器如何显示网页的内容以及页面的格式信息。
不同的浏览器内核对网页编写语法的解释也有不同，因此同一网页在不同的内核的浏览器里的渲染（显示）效果也可能不同，这也是网页编写者需要在不同内核的浏览器中测试网页显示效果的原因。
Trident 内核：IE,MaxThon,TT,The World,360,搜狗浏览器等。[又称 MSHTML]
Gecko 内核：Netscape6 及以上版本，FF,MozillaSuite/SeaMonkey 等。
Presto 内核：Opera7 及以上。 [Opera 内核原为：Presto，现为：Blink;]
Webkit 内核：Safari,Chrome 等。 [ Chrome 的：Blink（WebKit 的分支）]
EdgeHTML 内核：Microsoft Edge。 [此内核其实是从 MSHTML fork 而来，删掉了几乎所有的 IE 私有特性]

## html5 有哪些新特性、移除了那些元素？如何处理 HTML5 新标签的浏览器兼容问题？如何区分 ?

**_新增了以下的几大类元素_**
内容元素，article、footer、header、nav、section。
表单控件，calendar、date、time、email、url、search。
控件元素，webworker, websockt, Geolocation。
**\*移出的元素有下列这些\*\***
显现层元素：basefont，big，center，font, s，strike，tt，u。
性能较差元素：frame，frameset，noframes。
HTML5 已形成了最终的标准，概括来讲，它主要是关于图像，位置，存储，多任务等功能的增加。
新增的元素有绘画 canvas ，用于媒介回放的 video 和 audio 元素，
本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失
而 sessionStorage 的数据在浏览器关闭后自动删除，此外，还新增了以下的几大类元素。

**_移出的元素有下列这些_**
显现层元素：basefont，big，center，font, s，strike，tt，u。
性能较差元素：frame，frameset，noframes。
**_新的技术_**
canvas,svg,webworker, websocket, Geolocation......

## 简述一下你对 HTML 语义化的理解

（1）HTML 语义化让页面的内容结构化，结构更清晰，便于对浏览器、搜索引擎解析；
（2）即使在没有样式 CSS 的情况下也能以一种文档格式显示，并且是容易阅读的；
（3）搜索引擎的爬虫也依赖于 HTML 标记来确定上下文和各个关键字的权重，有利于 SEO；
（4）使阅读源代码的人更容易将网站分块，便于阅读、维护和理解。

## HTML5 的离线存储怎么使用？能否解释一下工作原理？

在用户没有连接英特网时，可以正常访问站点和应用；在用户连接英特网时，更新用户机器上的缓存文件。
`原理`：HTML5 的离线存储是基于一个新建的 `.appcache` 文件的缓存机制（并非存储技术），通过这个文件上的解析清单离线存储资源，这些资源就会像 cookie 一样被存储下来。之后当网络处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示。
使用方法：
(1) 在页面头部像下面一样加入一个 manifest 的属性；
(2) 在 cache.manifest 文件里编写离线存储资源；
CACHE MANIFEST
#v0.11
CACHE：
js/app.js
css/style.css
NETWORK:
resource/logo.png
FALLBACK：
/ /offline.html
(3) 在离线状态时，操作 window.applicationCache 进行需求实现；

## 浏览器是怎么对 HTML5 的离线储存资源进行管理和加载的呢？

在线情况下，浏览器发现 html 头部有 manifest 属性，它会请求 manifest 文件，如果是第一次访问 app，那么浏览器就会根据 manifest 文件的内容下载相应的资源并且进行离线存储。
如果已经访问过 app 并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的 manifest 文件与旧的 manifest 文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。

离线情况下，浏览器就直接使用离线存储的资源。

## 请描述一下 cookies，sessionStorage 和 localStorage 的区别？

Web Storage 有两种形式：LocalStorage（本地存储）和 sessionStorage（会话存储）。这两种方式都允许开发者使用 js 设置的键值对进行操作，在在重新加载不同的页面的时候读出它们。这一点与 cookie 类似。
（1）与 cookie 不同的是：Web Storage 数据完全存储在客户端，不需要通过浏览器的请求将数据传给服务器，因此 x 相比 cookie 来说能够存储更多的数据，大概 5M 左右。
（2）LocalStorage 和 sessionStorage 功能上是一样的，但是存储持久时间不一样。
LocalStorage：浏览器关闭了数据仍然可以保存下来，并可用于所有同源（相同的域名、协议和端口）窗口（或标签页）；
sessionStorage：数据存储在窗口对象中，窗口关闭后对应的窗口对象消失，存储的数据也会丢失。
注意：sessionStorage 都可以用 localStorage 来代替，但需要记住的是，在窗口或者标签页关闭时，使用 sessionStorage 存储的数据会丢失。
（3）使用 local storage 和 session storage 主要通过在 js 中操作这两个对象来实现，分别为 window.localStorage 和 window.sessionStorage. 这两个对象均是 Storage 类的两个实例，自然也具有 Storage 类的属性和方法。

## iframe 有哪些缺点？

（1）iframe 会阻塞主页面的 Onload 事件；
（2）搜索引擎的检索程序无法解读这种页面，不利于 SEO；
（3）iframe 和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。
（4）使用 iframe 之前需要考虑这两个缺点。如果需要使用 iframe，最好通过 JavaScript 动态给 iframe 添加 src 属性值，这样可以绕开以上两个问题。

## Label 的作用是什么？如何使用？

label 标签来定义表单控制间的关系，当用户选择该标签时，浏览器会自动将焦点转到和标签相关的表单控件上。

```html
<label for="Name">Number:</label>
<input type="text" name="Name" id="Name" />
<label>Date:<input type="text" name="B"/></label>
```

## HTML5 的 form 如何关闭自动完成功能？

给不想要提示的 form 或下面某个 input 设置为 `autocomplete = off`。

## 如何实现浏览器内多个标签页之间的通信？（阿里）

调用 localStorage、cookies 等本地存储方式

## webSocket 如何兼容低浏览器？（阿里）

Adobe Flash Socket
ActiveX HTMLFile（IE）
基于 multipart 编码发送 XHR
基于长轮询的 XHR

## 页面可见性（Page Visibility） API 可以有哪些用途？

在页面被切换到其他后台进程的时候，自动暂停音乐或视频的播放。

## 如何在页面上实现一个圆形的可点击区域？

(1) map + area 或者 svg
(2) border-radius
(3) 纯 js 实现，需要求一个点在不在圆上的简单算法、获取鼠标坐标等等

## 实现 不使用 border 画出 1px 高的线，在不同浏览器的标准模式与怪异模式下都能保持一致的效果？

```html
<div style="height:1px;overflow:hidden;background:#ccc"></div>
```

## 网页验证码是干什么用的？是为了解决什么安全问题？

可以防止：恶意破解密码、刷票、论坛灌水，有效防止某个黑客对某一个特定注册用户用特定程序暴力破解方式进行不断的登陆尝试，
实际上用验证码是现在很多网站通行的方式，我们利用比较简易的方式实现了这个功能。这个问题可以由计算机生成并评判，但是必须只有人类才能解答。
由于计算机无法解答 CAPTCHA 的问题，所以回答出问题的用户就可以被认为是人类。
