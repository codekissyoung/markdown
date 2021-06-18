# PHP 字符串

`PHP`字符串笔记。

## 子字符串相关

```php
// mb_substr是按字来切分字符，而mb_strcut是按字节来切分字符，但是都不会产生半个字符的现象。
mb_substr('这样一来我的字符串就不会有乱码^_^', 0, 7, 'utf-8'); // 0开始，取7个字符
mb_strcut('这样一来我的字符串就不会有乱码^_^', 0, 7, 'utf-8');
mb_strlen("我是个好人","utf-8");

// ***ijklmnopqrstuvwxyz 后面的两个数字的参数的使用方法跟substr 一样
substr_replace('abcdefghijklmnopqrstuvwxyz','***',0,8);
strstr($_POST['email'],'@'); // 判断是否包含子字符串
strpos($_POST['email'],'@'); // 返回找到的位置

if(strpos($_POST['email'],'@') === false){
    print 'there was no @ in the e-mail address ';
}
```

## 编码转换

```php
$str = "编码转换";
iconv( 'UTF-8', 'GBK', $str ); // 转换为utf-8编码

strtoupper('caokaiyan');
strtolower('CAOkaiyan'); // 字符串大小写转换
lcfirst($foo); // 首字母小写
ucfist('how do you do today?'); // How do you do today?`首字母大写
ucwords("how do you do today?");//How Do You Do Today ?`每个单词首字母大写
```

## 转义函数

```php
// 使得 HTML 之中的特殊字符被正确的编码，从而不会被使用者在页面注入 HTML 标签或者 Javascript 代码
htmlspecialchars();
htmlspecialchars_decode($a);

htmlentities($str);
html_entity_decode($a);

nl2br();			// 将 '\n' 变为 '<br>'
addslashes();  		// 单双引号、反斜线及NULL加上反斜线转义
stripslashes();	 	// 去掉反斜线字符

//转义　. \ + * ? [ ^ ] ( $ )　元字符集
$str = "Hello world. (can you hear me?)";
quotemeta($str); // Hello world\. \(can you hear me\?\)

// 转义　正则表达式特殊字符有： . \ + * ? [ ^ ] $ ( ) { } = ! < > | : -
$keywords = '$40 for a g3/400';
$keywords = preg_quote($keywords, '/'); // 第二个参数表明: / 也要被转义
$keywords; // 返回 \$40 for a g3\/400

escapeshellcmd();		// 防止用户的输入执行系统命令
exec("ls -l");			// 直接执行系统命令的函数
```

## 汉字加密解密

为了解决传输时，汉字符会丢失的问题

```php
$urlstr = urlencode("我是codekissyoung");
urldecode($urlstr);
```

## JSON 字符串

```php
json_encode( $arr, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
json_decode( $json, [ture] ); // ture 表示解析成数组
// 判断数据是合法的json字符串
function is_json($string) {
    json_decode($string);
    return (json_last_error() == JSON_ERROR_NONE);
}
```

## 字符串大小写

```php
strtoupper('caokaiyan'); 		// CAOKAIYAN
strtolower('CAOkaiyan');		// caokaiyan
lcfirst('HelloWorld');       	// helloWorld
ucfist('how do you do today?'); // How do you do today?
ucwords("how do you do today?");// How Do You Do Today ?
```

## 将字符串切成数组

```php
// 将字符串切成数组
$pieces = explode(" ","piece1 piece2 piece3 piece4 piece5 piece6");
$pieces[0]; // piece1
$pieces[1]; // piece2

// list构造器
$data = "foo:*:1023:1000::/home/foo:/bin/sh";
list($user, $pass, $uid, $gid, $gecos, $home, $shell) = explode(":", $data);
$user; // foo
$pass; // *

//  将url 的　查询字符串　解析成数组
$str = "first=value&arr[]=foo+bar&arr[]=baz";
parse_str($str, $output);
$output['first'];  // value
$output['arr'][0]; // foo bar
$output['arr'][1]; // baz
```
