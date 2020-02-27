# PHP 常用 API

`PHP`常用`API`参考。

## 获取 php.ini 配置信息

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

坑爹的`isset`和`empty`判断：

![](https://img.codekissyoung.com/2020/02/25/7caca23bd2a077dfe6041027864ecc55.png)

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

## is 系列

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

## 写 http 头

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
$timestamp=time();//拿到当前的时间戳
date_default_timezone_get();//得到当前时区
date_default_timezone_set('PRC');//设置默认时区为中国
echo date('Y年m日d天 H:i:s');　//date返回格式化的当前时间
$date3=date('Y-m-d H:i:s',"1228348800");
mktime(0,0,0,10,9,2014);//返回2014年9月10号的时间戳
```

## 测试代码执行时间

```php
$start_time=microtime();
//...执行的代码
$end_time=microtime();
$execute_time=$end_time-$start_time;
```

## 脚本执行完注册函数

```php
register_shutdown_function( ['core', 'handleShutdown'] );
```

当我们的脚本执行完成或意外死掉导致 PHP 执行即将关闭时,我们的这个函数将会 被调用.所以,我们可以使用在脚本开始处设置一个变量为 false,然后在脚本末尾将之设置为 true 的方法,让 PHP 关闭回调函数检查脚本完成与否. 如果我们的变量仍旧是 false,我们就知道脚本的最后一行没有执行,因此它肯定在程序执行到某处死掉了
http://www.blogdaren.com/post-2030.html

## 设置异常处理函数

```php
set_exception_handler(array('core', 'handleException'));
```

## 设置错误处理函数

```php
set_error_handler(array('core', 'handleError'));
```

## 防止 SQL 注入

```php
mysql_real_escape_string($sql); //转义 sql 字符串中的特殊字符
```

## 使用 filter 拓展对变量进行过滤

地址：http://php.net/manual/zh/filter.examples.validation.php

```php
$email_a = 'joe@example.com';
if (filter_var($email_a, FILTER_VALIDATE_EMAIL)) {
    echo "This ($email_a) email address is considered valid.";
}
$ip_a = '127.0.0.1';
if (filter_var($ip_a, FILTER_VALIDATE_IP)) {
    echo "This (ip_a) IP address is considered valid.";
}
```

## 定义网站的起始路径，之后所有的引用都可以基于这个路径了

```php
define("APP_PATH",dirname(__FILE__));
require_once APP_PATH.'/myscript.php';
```

## 连缀调用

```php
// 在 method1 中 return $this;
$obj -> method1() -> method2();
```

## 限定函数参数类型

```php
function expectMyclass(Myclass $obj){
	//声明 函数的传入值必须为 Myclass 对象
	//建议有些需求可以限定传入值，比如限定传入数组/对象/数字等等
}
```

## 不可逆加密 md5 散列值，sha1 散列值

```php
echo  md5("hehexiix23");
echo crypt($some_string,'keyvalue');
$str = 'apple';
if (sha1($str) === 'd0be2dc421be4fcd0172e5afceea3970e2f3d940') {
    echo "Would you like a green or red apple?";
}
```

## 可逆加密

```php
base64_encode($string);
base64_decode($string);
convert_uudecode($str);
convert_uuencode($str);
```

#### method_exists 与 is_callable

```php
class Foo {
    public function PublicMethod(){}
    private function privateMethod(){}
    public static function PublicStaticMethod(){}
    private static function PrivateStaticMethod(){}
}
$foo = new Foo();
$callbacks = [
    [$foo,'PublicMethod'],
    [$foo,'PrivateMethod'],
    [$foo,'PublicStaticMethod'],
    [$foo,'PrivateStaticMethod'],
    ['Foo','PublicMethod'],
    ['Foo','PrivateMethod'],
    ['Foo','PublicStaticMethod'],
    ['Foo','PrivateStaticMethod']
];
class MethodTest {
    public function __call($name, $args) {
        echo $name;
        echo "\n";
        var_dump($args);
    }
}
$obj = new MethodTest();
$obj -> runtest('???????????');
var_dump(method_exists($obj,'runtest'));
var_dump(is_callable([$obj,'runtest']));
```

#### PHP 执行 shell 命令

```php
$out = `ls -al`;
var_dump( $out );
```
