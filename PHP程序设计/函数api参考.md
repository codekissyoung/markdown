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
is_callable( [$obj,$method] ); // 确保传入的字符串是函数，能够被call_user_func()和array_walk()等函数调用
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
substr_replace('abcdefghijklmnopqrstuvwxyz','***',0,8); // ***ijklmnopqrstuvwxyz 后面的两个数字的参数的使用方法跟substr 一样：
// 判断数据是合法的json字符串
function is_json($string) {
	json_decode($string);
	return (json_last_error() == JSON_ERROR_NONE);
}
echo json_encode($arr, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); 
```

## 数组函数

```php
// 给数组添加一个元素
$arr[] = "caokaiyan";//键为数字键
$arr['xuehao'] = 1001121213;
array_push($array,$var);

// 删除数组中的元素
unset($arr['xuehao']);
$var = array_pop($array);//$var 获取数组最后一个元素,数组减去那个元素
$array2 = array_unique($array);//删除数组中重复的元素

// 数组计数
$array2 =array(array('PHP1','php2','php3'),array('asp1'));
echo count($array2,COUNT_RECURSIVE);//后面标志表示递归

// 遍历数组中的元素　key和value 都是副本 , 修改value 的值不会影响到　$arr
foreach($arr as $key => $value){     print   '键 :'.$key.'   值：'.$value;}

// 遍历数组 $value 是引用 ,　修改$value 的值会影响到　$arr
$arr = array(1, 2, 3, 4);
foreach ($arr as &$value) {
    $value = $value * 2;
} // $arr is now array(2, 4, 6, 8)
unset($value); // 最后取消掉引用

// 将多个值保存在匿名数组中
$fruits['red'][]='strawberry';$fruits['red'][]='apple';

// 将关联数组，根据 键名 拆成 一个个的变量！
extract($var_array, EXTR_PREFIX_SAME, "ex"); //如果前面有定义过此变量，则变量名加前缀　ex

// list构造器　将数组里面的值分别指定给单独变量
list($b,$c,$d) =  array('apple','orange','card');echo $b,$c,$d; //apple orange card

// 合并两个数组
array_merge($arr1,$arr2);//$arr2 会覆盖同名键的值

// 检查数组中是否存在某个键
array_key_exists('key',$array);//key存在就返回true,不考虑对应的值isset($array['key']);/*在array 中的键存在，且不为null*/

// 检查数组中是否包含某个值
in_array('value',$array);//存在就返回ture

// 将数组按键排序
ksort($array);

// 计算两个数组的并集
$union = array_unique(array_merge($A,$b));

// 使用回调函数过滤　array 中的值
$ar = array("hello", null, "world");
print(implode(',', $ar));
worldprint(implode(',', array_filter($ar, function($v){ return $v !== null; }))); // hello,world

// 数组合并为字符串
join(',',$arr);//返回以 , 分割的字符串implode('-',array('a','b','c'));

// 一维数字去重
$aa=array("apple","banana","pear","apple","wail","watermalon");
$bb=array_unique($aa);
print_r($bb); //Array ( [0] => apple [1] => banana [2] => pear [4] => wail [5] => watermalon)

// 二维数组去重,因为某一键名的值不能重复，删除重复项
$aa = array(
    array('id' => 123, 'name' => '张三'),
    array('id' => 123, 'name' => '李四'),
    array('id' => 124, 'name' => '王五'),
    array('id' => 125, 'name' => '赵六'),
    array('id' => 126, 'name' => '赵六')
);//需求，id 不能重复
function assoc_unique($arr, $key){
    $tmp_arr = array();
    foreach($arr as $k => $v){
        //搜索$v[$key]是否在$tmp_arr数组中存在，若存在返回true
        if(in_array($v[$key], $tmp_arr)){
            unset($arr[$k]);
        }else {
            $tmp_arr[] = $v[$key];
       }
    }
    sort($arr); //sort函数对数组进行排序
    return $arr;
}
$key = 'id';
assoc_unique(&$aa, $key);
print_r($aa);//Array ( [0] => Array ( [id] => 123 [name] => 张三 ) [1] => Array ( [id] => 124 [name] => 王五 ) [2] => Array ( [id] => 125 [name] => 赵六 ) [3] => Array ( [id] => 126 [name] => 赵六 ) )

// 二维数组去重,因内部的一维数组不能完全相同，而删除重复项
$aa = array(
    array('id' => 123, 'name' => '张三'),
    array('id' => 123, 'name' => '李四'),
    array('id' => 124, 'name' => '王五'),
    array('id' => 123, 'name' => '李四'),
    array('id' => 126, 'name' => '赵六')
);
function array_unique_fb($array2D){
    foreach ($array2D as $v){
        $v = join(",",$v); //降维,也可以用implode,将一维数组转换为用逗号连接的字符串
        $temp[] = $v;
    }
    $temp = array_unique($temp); //去掉重复的字符串,也就是重复的一维数组
    foreach ($temp as $k => $v){
        $temp[$k] = explode(",",$v); //再将拆开的数组重新组装
    }
    return $temp;
}
$bb=array_unique_fb($aa);
print_r($bb); //Array ( [0] => Array ( [0] => 123 [1] => 张三 ) [1] => Array ( [0] => 123 [1] => 李四 ) [2] => Array ( [0] => 124 [1] => 王五 ) [4] => Array ( [0] => 126 [1] => 赵六 ) )
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
```
htmlspecialchars();//将与、单双引号、大于和小于号化成HTML格式 
nl2br();	//将 '\n' 变为 '<br>'
addslashes();  //单双引号、反斜线及NULL加上反斜线转义
stripslashes();	 //﻿去掉反斜线字符
```

```
//转义　. \ + * ? [ ^ ] ( $ )　元字符集
$str = "Hello world. (can you hear me?)";
echo quotemeta($str);//Hello world\. \(can you hear me\?\)
```
```
转义　正则表达式特殊字符有： . \ + * ? [ ^ ] $ ( ) { } = ! < > | : -
$keywords = '$40 for a g3/400';
$keywords = preg_quote($keywords, '/');//第二个参数表明: / 也要被转义
echo $keywords; // 返回 \$40 for a g3\/400
```

```
escapeshellcmd();//防止用户的输入执行系统命令
exec("ls -l");//直接执行系统命令的函数
```

## 用于　html 　的一对转义函数 ##
```
$str = "<? W3S?h????>";
echo $a = htmlentities($str);
echo html_entity_decode($a);
$str = "This is some <b>bold</b> text.";
echo $a=htmlspecialchars($str);
echo htmlspecialchars_decode($a);
```

## 使用filter 拓展对变量进行过滤##
地址：http://php.net/manual/zh/filter.examples.validation.php
```

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

```

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

```

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

## csv 文件格式 ##
```
"数据１"，"数据２"，"数据３"
"数据４"，"数据５"，"数据６"
```
## 将二维数组存为　csv  文件fputcsv() ##
```
$csv_arr = (
    array(1,2,3,4),
    array(5,6,7,8),
    array(12,34,56,78)
);
$fh = fopen('test.csv','w') or die("can't open file test.csv")；
foreach($csv_arr as $csv_arr_line){
    if(fputcsv($fh,$csv_arr_line) === false){
        die(‘can not write test.csv !’)；
    }
}
fclose($fh) or  die("can not close test.csv !");
```
## 想输出　csv 格式的数据　php://output ##
```
$csv_arr = (
    array(1,2,3,4),
    array(5,6,7,8),
    array(12,34,56,78)
);
$fh = fopen('php://output','w');
foreach($csv_arr as $csv_arr_line){
    if(fputcsv($fh,$csv_arr_line) === false){
        die(‘can not write csv line !’)；
    }
}
fclose($fh);
```
## 想将　csv 格式的数据存到字符串中 ob buffer  ##
```
$csv_arr = (
    array(1,2,3,4),
    array(5,6,7,8),
    array(12,34,56,78)
);
ob_start();
$fh = fopen('test.csv','w') or die("can't open php://output")；
foreach($csv_arr as $csv_arr_line){
    if(fputcsv($fh,$csv_arr_line) === false){
        die(‘can not write csv line !’)；
    }
}
fclose($fh) or  die("can not close php://output !");
$output = ob_get_contents();
ob_end_clean();
```


## 一维数组 ##

```php
$aa=array("apple","banana","pear","apple","wail","watermalon");
$bb=array_unique($aa);
print_r($bb);//Array ( [0] => apple [1] => banana [2] => pear [4] => wail [5] => watermalon
```

## 二维数组 ##
1）因为某一键名的值不能重复，删除重复项
```
$aa = array(
            array('id' => 123, 'name' => '张三'),
            array('id' => 123, 'name' => '李四'),
            array('id' => 124, 'name' => '王五'),
            array('id' => 125, 'name' => '赵六'),
            array('id' => 126, 'name' => '赵六')
            );
//需求，id 不能重复
function assoc_unique($arr, $key){
	$tmp_arr = array();
		foreach($arr as $k => $v){
			//搜索$v[$key]是否在$tmp_arr数组中存在，若存在返回true
			if(in_array($v[$key], $tmp_arr)){
	             unset($arr[$k]);
	        }else {
				$tmp_arr[] = $v[$key];
			}
		}
        sort($arr); //sort函数对数组进行排序
		return $arr;
}
$key = 'id';
assoc_unique(&$aa, $key);
print_r($aa);
//Array ( [0] => Array ( [id] => 123 [name] => 张三 ) [1] => Array ( [id] => 124 [name] => 王五 ) [2] => Array ( [id] => 125 [name] => 赵六 ) [3] => Array ( [id] => 126 [name] => 赵六 ) )
```

2）因内部的一维数组不能完全相同，而删除重复项

```
 $aa = array(
            array('id' => 123, 'name' => '张三'),
            array('id' => 123, 'name' => '李四'),
            array('id' => 124, 'name' => '王五'),
            array('id' => 123, 'name' => '李四'),
            array('id' => 126, 'name' => '赵六')
            );
function array_unique_fb($array2D){
                 foreach ($array2D as $v){
                     $v = join(",",$v); //降维,也可以用implode,将一维数组转换为用逗号连接的字符串
                     $temp[] = $v;
                 }
                 $temp = array_unique($temp);    //去掉重复的字符串,也就是重复的一维数组
                foreach ($temp as $k => $v){
                    $temp[$k] = explode(",",$v);   //再将拆开的数组重新组装
                }
                return $temp;
            }
            $bb=array_unique_fb($aa);
            print_r($bb);
            //Array ( [0] => Array ( [0] => 123 [1] => 张三 ) [1] => Array ( [0] => 123 [1] => 李四 ) [2] => Array ( [0] => 124 [1] => 王五 ) [4] => Array ( [0] => 126 [1] => 赵六 ) )  
```

给数组添加一个元素

```bash
$arr[] = "caokaiyan";//键为数字键
$arr['xuehao'] = 1001121213;
array_push($array,$var); 
```

删除数组中的元素

```bash
unset($arr['xuehao']);
$var = array_pop($array);//$var 获取数组最后一个元素,数组减去那个元素
$array2 = array_unique($array);//删除数组中重复的元素
```

数组计数

```bash
$array2 =array(array('PHP1','php2','php3'),array('asp1'));  
echo count($array2,COUNT_RECURSIVE);  //后面标志表示递归  
```

遍历数组中的元素　$key  和　$value 都是副本 , 修改value 的值不会影响到　$arr

```bash
foreach($arr as $key => $value){
    print   '键 :'.$key.'   值：'.$value;
}
```

遍历数组　　\$value  是引用 ,　修改\$value  的值会影响到　$arr

```bash
$arr = array(1, 2, 3, 4);
foreach ($arr as &$value) {
   $value = $value * 2;
}
// $arr is now array(2, 4, 6, 8)
unset($value); // 最后取消掉引用
```

将多个值保存在匿名数组中

```bash
$fruits['red'][]='strawberry';
$fruits['red'][]='apple';
```

将关联数组，根据 键名 拆成 一个个的变量！

```bash
extract($var_array, EXTR_PREFIX_SAME, "ex"); 
//如果前面有定义过此变量，则变量名加前缀　ex
```

list构造器　将数组里面的值分别指定给单独变量

```bash
list($b,$c,$d) =  array('apple','orange','card');
echo $b,$c,$d; //apple orange card
```

合并两个数组

```bash
array_merge($arr1,$arr2);//$arr2 会覆盖同名键的值
```

检查数组中是否存在某个键

```bash
array_key_exists('key',$array);//key存在就返回true,不考虑对应的值
isset($array['key']);/*在array 中的键存在，且不为null*/
```

检查数组中是否包含某个值

```bash
in_array('value',$array);//存在就返回ture
```

将数组按键排序

```bash
ksort($array);
```

计算两个数组的并集

```bash
$union = array_unique(array_merge($A,$b));
```

使用回调函数过滤　array 中的值

```bash
$ar = array("hello", null, "world");
print(implode(',', $ar)); // hello,,world
print(implode(',', array_filter($ar, function($v){ return $v !== null; }))); // hello,world
```

数组合并为字符串
```bash
join(',',$arr);//返回以 , 分割的字符串
implode('-',array('a','b','c'));
```

给数组添加一个元素

```bash
$arr[] = "caokaiyan";//键为数字键
$arr['xuehao'] = 1001121213;
array_push($array,$var); 
```

删除数组中的元素

```bash
unset($arr['xuehao']);
$var = array_pop($array);//$var 获取数组最后一个元素,数组减去那个元素
$array2 = array_unique($array);//删除数组中重复的元素
```

数组计数

```bash
$array2 =array(array('PHP1','php2','php3'),array('asp1'));  
echo count($array2,COUNT_RECURSIVE);//后面标志表示递归  
```

将数组按键排序

```bash
ksort($array);
```

计算两个数组的并集

```php
$union = array_unique(array_merge($A,$b));
```

使用回调函数过滤　array 中的值

```php
$ar = array("hello", null, "world");
print(implode(',', $ar)); // hello,,world
print(implode(',', array_filter($ar, function($v){ return $v !== null; }))); // hello,world
```

数组合并为字符串

```php
join(',',$arr);//返回以 , 分割的字符串
implode('-',array('a','b','c'));
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

将数组连成字符串　：在生成表格，生成 sql 语句方面有大用

```php
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
```

 将url 的　查询字符串　解析成数组
 ```
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
 编码转换
 ```
 //将$str内的函数转换为utf-8编码
 $str="编码转换";
 iconv('UTF-8','GBK',$str);
 ```
 解决中文字符串问题：mbstring
 ```
 多字节字符串
 echo mb_substr('这样一来我的字符串就不会有乱码^_^', 0, 7, 'utf-8'); 
 echo mb_strcut('这样一来我的字符串就不会有乱码^_^', 0, 7, 'utf-8');  
 echo mb_strlen("我是个好人","utf-8");
 mb_substr是按字来切分字符，而mb_strcut是按字节来切分字符，但是都不会产生半个字符的现象。
 ```
 不希望浏览器解析html标签
 ```
 string htmlspecialchars(string str);
 ```
 字符串大小写转换
 ```
 echo strtoupper('caokaiyan'); //CAOKAIYAN
 echo strtolower('CAOkaiyan');//caokaiyan
 ```
 首字母小写
 ```
 $foo = 'HelloWorld';
 $foo = lcfirst($foo);             // helloWorld
 ```
 首字母大写
 ```
 echo ucfist('how do you do today?'); // How do you do today?
 echo ucwords("how do you do today?");//How Do You Do Today ?
 ```
 替换子字符串
 ```
 substr_replace('abcdefghijklmnopqrstuvwxyz','***',0,8);
 //后面的两个数字的参数的使用方法跟　substr 一样：***ijklmnopqrstuvwxyz
 ```
 提取子字符串
 ```
 substr('abcdefghijklmnopqrstuvwxyz',0,8);//从下标为０开始，开始提取８个 :abcdefgh
 substr('abcdefghijklmnopqrstuvwxyz',20);//从下标为 20 开始，提取到最后 :　vwxyz
 substr('abcdefghijklmnopqrstuvwxyz',-5);//提取倒数５个字符串　：vwxyz
 substr('abcdefghijklmnopqrstuvwxyz',-5,3);//从倒数５个开始，提取３个：　vwx
 substr('abcdefghijklmnopqrstuvwxyz',-5,-1);//从倒数　５　个开始，提取到倒数　1 个　: vwxy
 ```

 ```
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

```
