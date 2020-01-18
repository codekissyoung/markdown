# PHP常用API

## 获取php.ini配置信息

```php
ini_get("allow_url_fopen");         // 获取 php.ini 中 allow_url_fopen 的设置
array get_loaded_extensions();            // 获取所有加载的 模块
```

## Bool 判断

```php
给定一个变量 $a ,下列是它的所有情况

1. $a; 未赋值过
2. $a = null;
3. $a = ""  ''  0  0.00  "0"  '0'  []
4. $a = new A(); 空对象 class A{}
5. $a = 其他值

isset($a);          // 3, 4, 5 为 true
empty($a);          // 1, 2, 3 为 true
if( $a );           // 4, 5    为 true
``` 

## 魔术变量

```php
// http://www.dadishe.com/test/checkbox.php?a[]=b&a[]=c
$_GET; // ['a'=>['b','c']];
var_dump($GLOBALS); // 打印脚本中的所有的全局变量
```

## 常量

```php
bool defined( ABC_NAME );           // 判断常量是否被定义
```


## is系列

```php
is_bool();
is_integer();
is_double();
is_string();
is_object();
is_array();
is_resource();
is_null();
is_callable( [$obj, $method] ); 
```

## 啥玩意?

```php
__LINE__            # 文件中的当前行号
__FILE__            # 文件的完整路径和文件名
__DIR__             # 文件所在的目录
__FUNCTION__        # 函数名称
__CLASS__           # 类的名称
__TRAIT__           # Trait 的名字
__METHOD__          # 类的方法名
__NAMESPACE__       # 当前命名空间的名称
```

## 如何调试和分析类

```php
get_declared_classes();        // 获取当前所有已定义的类名
get_class_methods( $obj );     // 获取所有的方法名
get_object_vars( $obj );       // 获取所有属性名
get_parent_class( $sub_obj );  // 获取一个对象的父类
is_subclass_of( $sub_obj, 'Think\Parent_class' ); // 检查对象是否是一个类的子类

class_implements( $obj );         // 获取该对象实现的所有接口
$obj instanceof interface_name ; // 判断 $obj 是否实现了某个接口
```

## exists 系列

```php
file_exists( $file_name );
class_exists( $classname );
method_exists( $obj , $method ); // 方法是否存在
```

## 类相关

```php
get_declared_classes(); // 获取脚本运行到当前行时，所有已经定义的类的数组
get_class($obj);        // 获取对象的 类名

$obj instanceof interface_name ; // 判断 $obj 是否实现了某个接口

get_class_methods($class_name); // 获取一个类中所有的方法名

get_class_vars($class_name); // 获取一个类中的所有属性名

get_parent_class($sub_obj); // 获取一个类的父类

is_subclass_of($sub_obj,'Parent_class'); // 检查是否是一个类的子类

class_implements($obj); // 获取该对象实现的所有接口

call_user_func('myFunction');
call_user_func( [ $myObj, 'method_name'], 20 ); // 调用用户函数 / 方法
// 等价于
$myObj -> method_name(20);

call_user_func_array([$obj,'method'],$args); // 等价于 $obj -> method($args); $args 为不定个数的数组
```

## 写http头

```php
header("content-type:application/json ;charset = utf-8;");  // 返回json数据
header('HTTP/1.1 200 OK'); // 告诉浏览器，请求成功
header('HTTP/1.1 404 Not Found'); // 无此页面

// 以下3行 禁止浏览器缓存
header('Cache-Control:no-cache,no-store,max-age=0,must-revalidate');
header('Expires：Mon,26 Jul 1997 05:00:00 GMT');
header('Pragma:no-cache');

header('Refresh:10;url=http://www.baidu.com/'); //页面重定向,十秒钟后跳到　url
header('location:http://www.baidu.com'); // 向浏览器发送一条Http头信息，告诉它重定向到莫个网址
header("Access-Control-AllowOrigin:http://dev.kanjiebao.com"); // 允许 ajax 的跨域请求
```

## 加载所有配置文件

```php
// glob 是寻找与模式匹配的文件路径，组成数组
foreach (glob(ROOT_PATH.'config/*') as $file){
    require_once $file;
}
```

## 变量方法

```php
function ($method,$param){
    $this ->input ->$method($param);
}
```

## 使用 or 和 and 截断

```php
defined('YII_DEBUG') or define('YII_DEBUG', true);
isset($page_size) or exit("未设置page_size");
```

## 数字处理

```php
ceil(1243648.43464); // 向上取整 1243649
round(1243648.43464); // 四舍五入1243648
intval(1243648.43464); // 强制转换为整型1243648
```

## 加密函数

```php
$urlstr = urlencode("我是codekissyoung");
echo  urldecode($urlstr); // 汉字加密 解密，为了解决传输时，汉字符会丢失的问题
// 不可逆加密
md5("hehexiix23"); // md5散列值

crypt($some_string,'keyvalue'); // 使用秘钥加密
$str = 'apple';
echo sha1($str); // sha1 散列值
// 可逆加密
//  base64加解密
base64_encode($string);
base64_decode($string);
// convert_uudecode加解密
convert_uudecode($str);
convert_uuencode($str);
```

## 时间函数

```php
$timestamp=time(); // 拿到当前的时间戳
date_default_timezone_get(); // 得到当前时区
date_default_timezone_set('PRC'); // 设置默认时区为中国
date_default_timezone_set("Asia/Shanghai"); // 设置默认时区为中国
mktime(0,0,0,10,9,2014); //  定制时间 返回2014年9月10号的时间戳
date('Y年m日d天 H:i:s',time()); // 格式化的时间
strtotime($stringtime); // 时间字符串转时间戳
date("Y-m-d H:i:s",time());
date_default_timezone_get();
date_default_timezone_set("ETC/GMT-8");
date("Y-m-d H:i:s",time());
```

## 测试代码执行时间

```php
$start_time=microtime();
//...执行的代码
$end_time=microtime();
$execute_time=$end_time-$start_time;
```

## 字符串函数

```php
strstr($_POST['email'],'@'); // 判断是否包含子字符串
strpos($_POST['email'],'@'); // 返回找到的位置

// 将字符串切成数组
$pieces = explode(" ","piece1 piece2 piece3 piece4 piece5 piece6");
echo $pieces[0];
echo $pieces[1];

// list构造器
$data = "foo:*:1023:1000::/home/foo:/bin/sh";
list($user, $pass, $uid, $gid, $gecos, $home, $shell) = explode(":", $data);
echo $user;
echo $pass;

// 将数组连成字符串　：在生成表格，生成 sql 语句方面有大用
$elements = array('a', 'b', 'c');
echo "<ul><li>" . implode("</li><li>", $elements) . "</li></ul>";
// array containing data
$array = array(
"name" => "John",
"surname" => "Doe",
"email" => "j.doe@intelligence.gov"
);
// build query...
$sql  = "INSERT INTO table";
// implode keys of $array...
$sql .= " (`".implode("`, `", array_keys($array))."`)";
// implode values of $array...
$sql .= " VALUES ('".implode("', '", $array)."') ";
echo $sql;

//Select name,email,phone from usertable where user_id IN (?,?,?,?,?)
$id_nums = array(1,6,12,18,24);
$nums_list = implode(',', $id_nums);
$sqlquery = "Select name,email,phone from usertable where user_id IN ($nums_list)";
echo $sqlquery;

//  将url 的　查询字符串　解析成数组
$str = "first=value&arr[]=foo+bar&arr[]=baz";
parse_str($str);
echo $first;  // value
echo $arr[0]; // foo bar
echo $arr[1]; // baz
parse_str($str, $output);
echo $output['first'];  // value
echo $output['arr'][0]; // foo bar
echo $output['arr'][1]; // baz
```

## 编码转换

```php
$str="编码转换";
iconv('UTF-8','GBK',$str); // 将$str内的函数转换为utf-8编码

echo mb_substr('这样一来我的字符串就不会有乱码^_^', 0, 7, 'utf-8'); //0开始，取7个字符
echo mb_strcut('这样一来我的字符串就不会有乱码^_^', 0, 7, 'utf-8');
echo mb_strlen("我是个好人","utf-8");
//mb_substr是按字来切分字符，而mb_strcut是按字节来切分字符，但是都不会产生半个字符的现象。

string htmlspecialchars(string str); // 不希望浏览器解析html标签
strtoupper('caokaiyan');
strtolower('CAOkaiyan'); // 字符串大小写转换
lcfirst($foo); // 首字母小写
ucfist('how do you do today?'); // How do you do today?`首字母大写
ucwords("how do you do today?");//How Do You Do Today ?`每个单词首字母大写
```

## 提取子字符串

```php
substr('abcdefghijklmnopqrstuvwxyz',0,8);//从下标为０开始，开始提取８个 :abcdefgh
substr('abcdefghijklmnopqrstuvwxyz',20);//从下标为 20 开始，提取到最后 :　vwxyz
substr('abcdefghijklmnopqrstuvwxyz',-5);//提取倒数５个字符串　：vwxyz
substr('abcdefghijklmnopqrstuvwxyz',-5,3);//从倒数５个开始，提取３个：　vwx
substr('abcdefghijklmnopqrstuvwxyz',-5,-1);//从倒数　５　个开始，提取到倒数　1 个　: vwxy
```

## 替换字符串

```php
// ***ijklmnopqrstuvwxyz 后面的两个数字的参数的使用方法跟substr 一样
substr_replace('abcdefghijklmnopqrstuvwxyz','***',0,8); 
// 判断数据是合法的json字符串
function is_json($string) {
	json_decode($string);
	return (json_last_error() == JSON_ERROR_NONE);
}
echo json_encode($arr, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); 
```

## 脚本执行完注册函数

```php
register_shutdown_function( ['core', 'handleShutdown'] );
```

当我们的脚本执行完成或意外死掉导致PHP执行即将关闭时,我们的这个函数将会 被调用.所以,我们可以使用在脚本开始处设置一个变量为false,然后在脚本末尾将之设置为true的方法,让PHP关闭回调函数检查脚本完成与否. 如果我们的变量仍旧是false,我们就知道脚本的最后一行没有执行,因此它肯定在程序执行到某处死掉了
http://www.blogdaren.com/post-2030.html


## 设置异常处理函数

```php
set_exception_handler(array('core', 'handleException'));
```

## 设置错误处理函数

```php
set_error_handler(array('core', 'handleError'));
```

## 防止 SQL 注入 ##

```php
mysql_real_escape_string($sql); //转义 sql 字符串中的特殊字符
```

## 一些转义函数 ##

htmlspecialchars() 使得 HTML 之中的特殊字符被正确的编码，从而不会被使用者在页面注入 HTML 标签或者 Javascript 代码。

```php
htmlspecialchars();//将与、单双引号、大于和小于号化成HTML格式 
nl2br();	//将 '\n' 变为 '<br>'
addslashes();  //单双引号、反斜线及NULL加上反斜线转义
stripslashes();	 //﻿去掉反斜线字符
```

```php
//转义　. \ + * ? [ ^ ] ( $ )　元字符集
$str = "Hello world. (can you hear me?)";
echo quotemeta($str);//Hello world\. \(can you hear me\?\)
```

```php
转义　正则表达式特殊字符有： . \ + * ? [ ^ ] $ ( ) { } = ! < > | : -
$keywords = '$40 for a g3/400';
$keywords = preg_quote($keywords, '/');//第二个参数表明: / 也要被转义
echo $keywords; // 返回 \$40 for a g3\/400
```

```php
escapeshellcmd();//防止用户的输入执行系统命令
exec("ls -l");//直接执行系统命令的函数
```

## 用于　html 　的一对转义函数

```php
$str = "<? W3S?h????>";
echo $a = htmlentities($str);
echo html_entity_decode($a);
$str = "This is some <b>bold</b> text.";
echo $a=htmlspecialchars($str);
echo htmlspecialchars_decode($a);
```

## 使用filter 拓展对变量进行过滤##

地址：http://php.net/manual/zh/filter.examples.validation.php

```php
$email_a = 'joe@example.com';
$email_b = 'bogus';

if (filter_var($email_a, FILTER_VALIDATE_EMAIL)) {
    echo "This ($email_a) email address is considered valid.";
}
if (filter_var($email_b, FILTER_VALIDATE_EMAIL)) {
    echo "This ($email_b) email address is considered valid.";
}
//输出：This (joe@example.com) email address is considered valid.
?>
```

```php
$ip_a = '127.0.0.1';
$ip_b = '42.42';

if (filter_var($ip_a, FILTER_VALIDATE_IP)) {
    echo "This (ip_a) IP address is considered valid.";
}
if (filter_var($ip_b, FILTER_VALIDATE_IP)) {
    echo "This (ip_b) IP address is considered valid.";
}
?>
//输出 ： This (ip_a) IP address is considered valid.
```

```php
$int_a = '1';
$int_b = '-1';
$int_c = '4';
$options = array(
    'options' => array(
                      'min_range' => 0,
                      'max_range' => 3,
                      )
);
if (filter_var($int_a, FILTER_VALIDATE_INT, $options) !== FALSE) {
    echo "This (int_a) integer is considered valid (between 0 and 3).\n";
}
if (filter_var($int_b, FILTER_VALIDATE_INT, $options) !== FALSE) {
    echo "This (int_b) integer is considered valid (between 0 and 3).\n";
}
if (filter_var($int_c, FILTER_VALIDATE_INT, $options) !== FALSE) {
    echo "This (int_c) integer is considered valid (between 0 and 3).\n";
}

$options['options']['default'] = 1;
if (($int_c = filter_var($int_c, FILTER_VALIDATE_INT, $options)) !== FALSE) {
    echo "This (int_c) integer is considered valid (between 0 and 3) and is $int_c.";
}
?>
//This (int_a) integer is considered valid (between 0 and 3).
//This (int_c) integer is considered valid (between 0 and 3) and is 1.
```

## 时间戳

```bash
$timestamp=time();//拿到当前的时间戳
date_default_timezone_get();//得到当前时区
date_default_timezone_set('PRC');//设置默认时区为中国
echo date('Y年m日d天 H:i:s');　//date返回格式化的当前时间
$date3=date('Y-m-d H:i:s',"1228348800");
mktime(0,0,0,10,9,2014);//返回2014年9月10号的时间戳
```


## 建立自己函数库时，先判断函数是否已经定义了 ##
```
if (!function_exists('is_php')) {
	function is_php(){
		//函数代码
	}
}
```

## 定义网站的起始路径，之后所有的引用都可以基于这个路径了 ##
```
define("APP_PATH",dirname(__FILE__));
require_once APP_PATH.'/myscript.php';
```
## php5中对象的连缀调用 ##
```
在method1 中 return $this;就可
$obj->method1()->method2();
```
## 限定函数参数类型 ##
```
function expectMyclass(Myclass $obj){
	//声明 函数的传入值必须为 Myclass 对象
	//建议有些需求可以限定传入值，比如限定传入数组/对象/数字等等
}
```
## 使用可变函数作为参数，来决定调用的函数 ##
```php
function ( $method, $param ) {
      $this ->input -> $method($param);
}
```


## 汉字加密 解密，为了解决传输时，汉字符会丢失的问题 ##
```
$urlstr = urlencode("我是codekissyoung");
echo  urldecode($urlstr);
```
## 不可逆加密　md5散列值，sha1 散列值 ##
```
echo  md5("hehexiix23");
echo crypt($some_string,'keyvalue');
$str = 'apple';
if (sha1($str) === 'd0be2dc421be4fcd0172e5afceea3970e2f3d940') {
    echo "Would you like a green or red apple?";
}
```
## 可逆加密 ##
```
base64_encode($string);
base64_decode($string);
convert_uudecode($str);
convert_uuencode($str);
```

## 格式化数字 ##
```
$a = 1243648.83464;
print number_format($a,3,'.',',');//1,243,648.835
```
## 向上取整 ##
```
$a = 1243648.43464;
echo ceil($a);//1243649
```
## 四舍五入 ##
```
$a = 1243648.43464;
echo round($a);//1243648
```
## 强制转换为整型 ##
```
$a = 1243648.93464;
echo intval($a);//1243648
```

## json 转码 ##
```
json_encode($mixed);
```
## json 解码成原始数据 ##
```
json_decode($json,[ture]);//ture 表示解析成数组
```
## 判断 数据是合法的　json 字符串  ##
```
function is_json($string) {
 json_decode($string);
 return (json_last_error() == JSON_ERROR_NONE);
}
```



```php
$juices = array("apple", "orange", "koolaid1" => "purple");
echo "He drank some $juices[0] juice.".PHP_EOL;
echo "He drank some $juices[koolaid1] juice.".PHP_EOL;
echo "This works: {$arr['key']}"; // 通过花括号语法才能正确解析带引号的键名
echo "This works: {$arr[4][3]}"; // 有效
echo "This is {$great}";
echo "This is ${great}";

$a = 'aaaa';
$c['c'] = "ccc";
$b = "i am '$a' and  '$c[c]' \" 我是双引号！\"";
echo $b; // i am 'aaaa' and 'ccc' " 我是双引号！"

class beers {
	const softdrink = 'rootbeer';
	public static $ale = 'ipa';
}
$rootbeer = 'A & W';
$ipa = 'Alexander Keith\'s';
// 有效，输出： I'd like an A & W
echo "I'd like an {${beers::softdrink}}\n";
// 也有效，输出： I'd like an Alexander Keith's
echo "I'd like an {${beers::$ale}}\n";
// 有效
echo "This square is {$square->width} centimeters broad.";
```

判断是否包含子字符串

```php
if(strpos($_POST['email'],'@') === false){
    print 'there was no @ in the e-mail address ';
}
```

字符串长度

```php
strlen("codekissyoung"); //13
```

删除字符串两端空白

```php
echo trim('  caokaiyan  '); //caokaiyan
```

将字符串切成数组

```php
$pizza  = "piece1 piece2 piece3 piece4 piece5 piece6";
$pieces = explode(" ", $pizza);
echo $pieces[0]; // piece1
echo $pieces[1]; // piece2
// 示例 2
$data = "foo:*:1023:1000::/home/foo:/bin/sh";
list($user, $pass, $uid, $gid, $gecos, $home, $shell) = explode(":", $data);
echo $user; // foo
echo $pass; // *
```

编码转换
```php
//将$str内的函数转换为utf-8编码
$str="编码转换";
iconv('UTF-8','GBK',$str);
```

解决中文字符串问题：mbstring
 
```php
多字节字符串
echo mb_substr('这样一来我的字符串就不会有乱码^_^', 0, 7, 'utf-8'); 
echo mb_strcut('这样一来我的字符串就不会有乱码^_^', 0, 7, 'utf-8');  
echo mb_strlen("我是个好人","utf-8");
mb_substr是按字来切分字符，而mb_strcut是按字节来切分字符，但是都不会产生半个字符的现象。
```

不希望浏览器解析html标签

```php
string htmlspecialchars(string str);
```

字符串大小写转换

```php
echo strtoupper('caokaiyan'); //CAOKAIYAN
echo strtolower('CAOkaiyan');//caokaiyan
```

首字母小写
```php
$foo = 'HelloWorld';
$foo = lcfirst($foo);             // helloWorld
```

首字母大写
```php
echo ucfist('how do you do today?'); // How do you do today?
echo ucwords("how do you do today?");//How Do You Do Today ?
```

替换子字符串
```php
substr_replace('abcdefghijklmnopqrstuvwxyz','***',0,8);
//后面的两个数字的参数的使用方法跟　substr 一样：***ijklmnopqrstuvwxyz
```

提取子字符串
```php
substr('abcdefghijklmnopqrstuvwxyz',0,8);//从下标为０开始，开始提取８个 :abcdefgh
substr('abcdefghijklmnopqrstuvwxyz',20);//从下标为 20 开始，提取到最后 :　vwxyz
substr('abcdefghijklmnopqrstuvwxyz',-5);//提取倒数５个字符串　：vwxyz
substr('abcdefghijklmnopqrstuvwxyz',-5,3);//从倒数５个开始，提取３个：　vwx
substr('abcdefghijklmnopqrstuvwxyz',-5,-1);//从倒数　５　个开始，提取到倒数　1 个　: vwxy
```

```php
header('HTTP/1.1 200 OK');//告诉浏览器，请求成功
header('HTTP/1.1 404 Not Found');//无此页面

//禁止浏览器缓存
header('Cache-Control:no-cache,no-store,max-age=0,must-revalidate');
header('Expires：Mon,26 Jul 1997 05:00:00 GMT');
header('Pragma:no-cache');

//页面重定向,十秒钟后跳到　url 
header('Refresh:10;url=http://www.baidu.com/');

//向浏览器发送一条Http头信息，告诉它重定向到莫个网址
header('location:http://www.baidu.com');

//允许 http://dev.kanjiebao.com 的　ajax 的跨域请求
header("Access-Control-AllowOrigin:http://dev.kanjiebao.com");
```
