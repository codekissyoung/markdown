## 请求页面携带cookie

```http
GET /Cookies/Test.aspx HTTP/1.1
Host: localhost:1335
User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.2; zh-CN; rv:1.9.1.1)
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: zh-cn,zh;q=0.5
Accept-Encoding: gzip,deflate
Accept-Charset: GB2312,utf-8;q=0.7,*;q=0.7
Keep-Alive: 300
Connection: keep-alive
Cookie: My.Common.TestCookieInfo=Pkid=999&TestValue=aaabbbcccdddeee
```

## 服务器响应设置cookie

```http
HTTP/1.x 200 OK
Server: ASP.NET Development Server/9.0.0.0
Date: Thu, 06 Aug 2009 03:40:59 GMT
X-AspNet-Version: 2.0.50727
Set-Cookie: My.Common.cookieinfo=Pkid=999&TestValue=abcde; expires=Fri, 07-Aug-2009 03:40:59 GMT; path=/
Cache-Control: private
Content-Type: text/html; charset=utf-8
Content-Length: 558
Connection: Close
```

## javascript中的cookie

```http
My.Common.SubKey=Pkid=999&TestValue=aaabbbcccdddeee;SingleKey=SingleKeyValue
```

上面的字符串包含了两个Cookies：
- 一个是不包含子键的`SingleKey`
- 一个是包含`pkid`和`TextValue`两个子键的`My.Common.SubKey`

## 过期时间

```
var cookieString=name+"="+escape(value);
//判断是否设置过期时间
if(expiresHours>0){
    var date=new Date();
    date.setTime(date.getTime+expiresHours*3600*1000);
    cookieString=cookieString+";expires="+date.toGMTString();
}
document.cookie=cookieString;
```

## 路径

让 cookie 在跟目录下,这样不管是哪个子页面创建的 cookie，所有的页面都可以访问到了:
document.cookie = "name=Darren;path=/"

## 域名

"sports.qq.com" 下的cookie被 "www.qq.com" 访问，我们就需要用到 cookie 的domain属性，并且需要把path属性设置为 "/"
参考：document.cookie = "username=Darren;path=/;domain=qq.com"

## 安全传输

如果一个 cookie 的属性为secure，那么它与服务器之间就通过HTTPS或者其它安全协议传递数据。语法如下：
document.cookie = "username=Darren;secure"
把cookie设置为secure，只保证 cookie 与服务器之间的数据传输过程加密，而保存在本地的 cookie文件并不加密。如果想让本地cookie也加密，得自己加密数据。注：就算设置了secure 属性也并不代表他人不能看到你机器本地保存的 cookie 信息，所以说到底，别把重要信息放cookie就对了

## cookie 编码细节

输入cookie信息时不能包含空格，分号，逗号等特殊符号，而在一般情况下，cookie 信息的存储都是采用未编码的方式。所以，在设置 cookie 信息以前要先使用escape()函数将 cookie 值信息进行编码，在获取到 cookie 值得时候再使用unescape()函数把值进行转换回来。如设置cookie时：
document.cookie = name + "="+ escape (value)
return unescape(document.cookie.substring(c_start,c_end))

## js 管理cookie

```js
function setCookie(name,value,expires_seconds){
    var cookieString = name + "=" + escape(value);
    //判断是否设置过期时间
    if(expires_seconds > 0){
        var date=new Date();
        date.setTime(date.getTime() + expires_seconds * 1000);
        cookieString += "; expires=" + date.toGMTString() + "; path=/";
    }
    console.log(cookieString);
    document.cookie = cookieString;
}

function getCookie(name){
    var strCookie=document.cookie;
    var arrCookie=strCookie.split("; ");
    for(var i=0;i<arrCookie.length;i++){
        var arr=arrCookie[i].split("=");
        if(arr[0]==name) return arr[1];
    }
    return "";
}

function delCookie(name){
    var date = new Date();
    date.setTime( date.getTime() - 10000 );
    document.cookie = name + "=v; expires=" + date.toGMTString();
}
```

## Cookies与Ajax

如果Ajax请求访问一个服务器页面，此服务器页面是可以向用户浏览器写入Cookies和Session的。

## 好资源

http://www.jb51.net/article/14566.htm
