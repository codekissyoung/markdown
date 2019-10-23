# is系列
```php
<?php
// 类型符合就返回true
is_bool();
is_integer();
is_double();
is_string();
is_object();
is_array();
is_resource();
is_null();
is_callable([$obj,$method]); // 确保传入的字符串是函数，能够被call_user_func()和array_walk()等函数调用
```

# exists 系列
```php
<?php
// 存在就返回 true
file_exists($file_name);

class_exists($classname);

method_exists($obj , $method); // 方法是否存在
```

# 类相关
```php
<?php
get_declared_classes(); // 获取脚本运行到当前行时，所有已经定义的类的数组

get_class($obj); // 获取对象的 类名

$obj instanceof interface_name ; // 判断 $obj 是否实现了某个接口

get_class_methods($class_name); // 获取一个类中所有的方法名

get_class_vars($class_name); // 获取一个类中的所有属性名

get_parent_class($sub_obj); // 获取一个类的父类

is_subclass_of($sub_obj,'Parent_class'); // 检查是否是一个类的子类

class_implements($obj); // 获取该对象实现的所有接口

call_user_func('myFunction');
call_user_func([$myObj,'method_name'],20); // 调用用户函数 / 方法
// 等价于
$myObj -> method_name(20);

call_user_func_array([$obj,'method'],$args); // 等价于 $obj -> method($args); $args 为不定个数的数组


```


# 写http头
 返回json数据
```php
<?php
header("content-type:application/json ;charset = utf-8;");  // 返回json数据
header('HTTP/1.1 200 OK'); // 告诉浏览器，请求成功
header('HTTP/1.1 404 Not Found'); // 无此页面

// 以下3行 禁止浏览器缓存
header('Cache-Control:no-cache,no-store,max-age=0,must-revalidate');
header('Expires：Mon,26 Jul 1997 05:00:00 GMT');
header('Pragma:no-cache');

header('Refresh:10;url=http://www.baidu.com/'); //页面重定向,十秒钟后跳到　url
header('location:http://www.baidu.com'); // 向浏览器发送一条Http头信息，告诉它重定向到莫个网址
header("Access-Control-AllowOrigin:http://dev.kanjiebao.com"); //允许http://dev.kanjiebao.com 的　ajax 的跨域请求
```

# 加载所有配置文件
```php
<?php
// glob 是寻找与模式匹配的文件路径，组成数组
foreach (glob(ROOT_PATH.'config/*') as $file){
    require_once $file;
}
```

# 变量方法
```php
<?php
function ($method,$param){
    $this ->input ->$method($param);
}
```

# 使用 or 和 and 截断
```php
<?php
defined('YII_DEBUG') or define('YII_DEBUG', true);
isset($page_size) or exit("未设置page_size");
```

# 数字处理
```php
<?php
ceil(1243648.43464); // 向上取整 1243649
round(1243648.43464); // 四舍五入1243648
intval(1243648.43464); // 强制转换为整型1243648
```

# 加密函数
```php
<?php
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
# 时间函数
```php
<?php
$timestamp=time(); // 拿到当前的时间戳
date_default_timezone_get(); // 得到当前时区
date_default_timezone_set('PRC'); // 设置默认时区为中国
date_default_timezone_set("Asia/Shanghai"); // 设置默认时区为中国
mktime(0,0,0,10,9,2014); //  定制时间 返回2014年9月10号的时间戳
date('Y年m日d天 H:i:s',time()); // 格式化的时间
strtotime($stringtime); // 时间字符串转时间戳
```
# 测试代码执行时间
```php
<?php
$start_time=microtime();
//...执行的代码
$end_time=microtime();
$execute_time=$end_time-$start_time;
```

# 字符串函数
```php
<?php
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

# 编码转换
```php
<?php
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

# 提取子字符串
```php
<?php
substr('abcdefghijklmnopqrstuvwxyz',0,8);//从下标为０开始，开始提取８个 :abcdefgh
substr('abcdefghijklmnopqrstuvwxyz',20);//从下标为 20 开始，提取到最后 :　vwxyz
substr('abcdefghijklmnopqrstuvwxyz',-5);//提取倒数５个字符串　：vwxyz
substr('abcdefghijklmnopqrstuvwxyz',-5,3);//从倒数５个开始，提取３个：　vwx
substr('abcdefghijklmnopqrstuvwxyz',-5,-1);//从倒数　５　个开始，提取到倒数　1 个　: vwxy
```

# 替换字符串
```php
<?php
substr_replace('abcdefghijklmnopqrstuvwxyz','***',0,8); // ***ijklmnopqrstuvwxyz 后面的两个数字的参数的使用方法跟substr 一样：
// 判断数据是合法的json字符串
function is_json($string) {
	json_decode($string);
	return (json_last_error() == JSON_ERROR_NONE);
}
// echo json_encode($arr, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); 
```

# 数组函数
```php
<?php
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

# 下载文件
前端代码
```javascript
<a href="doDownload.php?filename=1.jpg">通过程序下载1.jpg</a><br />
<a href="doDownload.php?filename=../upload/nv.jpg">下载nv.jpg</a>
```
后端代码
```php
<?php
$filename=$_GET['filename'];
header('content-disposition:attachment;filename='.basename($filename));
header('content-length:'.filesize($filename));readfile($filename);
```

# 脚本执行完注册函数
```php
<?php
register_shutdown_function(array('core', 'handleShutdown'));
```
当我们的脚本执行完成或意外死掉导致PHP执行即将关闭时,我们的这个函数将会 被调用.所以,我们可以使用在脚本开始处设置一个变量为false,然后在脚本末尾将之设置为true的方法,让PHP关闭回调函数检查脚本完成与否. 如果我们的变量仍旧是false,我们就知道脚本的最后一行没有执行,因此它肯定在程序执行到某处死掉了
http://www.blogdaren.com/post-2030.html


# 设置异常处理函数
```php
<?php
set_exception_handler(array('core', 'handleException'));
```

# 设置错误处理函数
```php
<?php
set_error_handler(array('core', 'handleError'));
```



## 防止 SQL 注入 ##
```
﻿mysql_real_escape_string($sql); //转义 sql 字符串中的特殊字符
```

## 一些转义函数##

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
<?php
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
<?php
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
<?php
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

## RemoveXSS  过滤跨站脚本 ##
```
<?php
function RemoveXSS($val) {
	// remove all non-printable characters. CR(0a) and LF(0b) and TAB(9) are allowed
	// this prevents some character re-spacing such as <java\0script>
	// note that you have to handle splits with \n, \r, and \t later since they *are* allowed in some inputs
	$val = preg_replace('/([\x00-\x08,\x0b-\x0c,\x0e-\x19])/', '', $val);
			 
	// straight replacements, the user should never need these since they're normal characters
	// this prevents like <IMG SRC=@avascript:alert('XSS')>
   $search = 'abcdefghijklmnopqrstuvwxyz';
   $search .= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   $search .= '1234567890!@#$%^&*()';
   $search .= '~`";:?+/={}[]-_|\'\\';
   for ($i = 0; $i < strlen($search); $i++) {
   // ;? matches the ;, which is optional
		// 0{0,7} matches any padded zeros, which are optional and go up to 8 chars
		// @ @ search for the hex values
		$val = preg_replace('/(&#[xX]0{0,8}'.dechex(ord($search[$i])).';?)/i', $search[$i], $val); // with a ;
		// @ @ 0{0,7} matches '0' zero to seven times
		$val = preg_replace('/(&#0{0,8}'.ord($search[$i]).';?)/', $search[$i], $val); // with a ;
	}
	// now the only remaining whitespace attacks are \t, \n, and \r
	$ra1 = Array('javascript', 'vbscript', 'expression', 'applet', 'meta', 'xml', 'blink', 'link', 'style', 'script', 'embed', 'object', 'iframe', 'frame', 'frameset', 'ilayer', 'layer', 'bgsound', 'title', 'base');
	$ra2 = Array('onabort', 'onactivate', 'onafterprint', 'onafterupdate', 'onbeforeactivate', 'onbeforecopy', 'onbeforecut', 'onbeforedeactivate', 'onbeforeeditfocus', 'onbeforepaste', 'onbeforeprint', 'onbeforeunload', 'onbeforeupdate', 'onblur', 'onbounce', 'oncellchange', 'onchange', 'onclick', 'oncontextmenu', 'oncontrolselect', 'oncopy', 'oncut', 'ondataavailable', 'ondatasetchanged', 'ondatasetcomplete', 'ondblclick', 'ondeactivate', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'onerror', 'onerrorupdate', 'onfilterchange', 'onfinish', 'onfocus', 'onfocusin', 'onfocusout', 'onhelp', 'onkeydown', 'onkeypress', 'onkeyup', 'onlayoutcomplete', 'onload', 'onlosecapture', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onmove', 'onmoveend', 'onmovestart', 'onpaste', 'onpropertychange', 'onreadystatechange', 'onreset', 'onresize', 'onresizeend', 'onresizestart', 'onrowenter', 'onrowexit', 'onrowsdelete', 'onrowsinserted', 'onscroll', 'onselect', 'onselectionchange', 'onselectstart', 'onstart', 'onstop', 'onsubmit', 'onunload');
   $ra = array_merge($ra1, $ra2);
   $found = true; // keep replacing as long as the previous round replaced something
	while ($found == true) {
	$val_before = $val;
	for ($i = 0; $i < sizeof($ra); $i++) {
	$pattern = '/';
	for ($j = 0; $j < strlen($ra[$i]); $j++) {
	if ($j > 0) {
	$pattern .= '(';
		$pattern .= '(&#[xX]0{0,8}([9ab]);)';
		$pattern .= '|';
		$pattern .= '|(&#0{0,8}([9|10|13]);)';
		$pattern .= ')*';
		}
		$pattern .= $ra[$i][$j];
		}
		$pattern .= '/i';
         $replacement = substr($ra[$i], 0, 2).'<x>'.substr($ra[$i], 2); // add in <> to nerf the tag
         $val = preg_replace($pattern, $replacement, $val); // filter out the hex tags
         if ($val_before == $val) {
         // no replacements were made, so exit the loop
         $found = false;
	}
	}
	}
	return $val;
	}
	?>
```
## 验证是否为手机用户访问 ##

```
﻿
<?php
//这个函数用来判断是否为手机访问，调用就可，如果是手机返回true
function is_mobile_request()
{
	$_SERVER['ALL_HTTP'] = isset($_SERVER['ALL_HTTP']) ? $_SERVER['ALL_HTTP'] : '';
	$mobile_browser = '0';
	if(preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|iphone|ipad|ipod|android|xoom)/i', strtolower($_SERVER['HTTP_USER_AGENT'])))
		$mobile_browser++;
	if((isset($_SERVER['HTTP_ACCEPT'])) and (strpos(strtolower($_SERVER['HTTP_ACCEPT']),'application/vnd.wap.xhtml+xml') !== false))
		$mobile_browser++;
	if(isset($_SERVER['HTTP_X_WAP_PROFILE']))
		$mobile_browser++;
	if(isset($_SERVER['HTTP_PROFILE']))
		$mobile_browser++;
	$mobile_ua = strtolower(substr($_SERVER['HTTP_USER_AGENT'],0,4));
	$mobile_agents = array(
			'w3c ','acs-','alav','alca','amoi','audi','avan','benq','bird','blac',
			'blaz','brew','cell','cldc','cmd-','dang','doco','eric','hipt','inno',
			'ipaq','java','jigs','kddi','keji','leno','lg-c','lg-d','lg-g','lge-',
			'maui','maxo','midp','mits','mmef','mobi','mot-','moto','mwbp','nec-',
			'newt','noki','oper','palm','pana','pant','phil','play','port','prox',
			'qwap','sage','sams','sany','sch-','sec-','send','seri','sgh-','shar',
			'sie-','siem','smal','smar','sony','sph-','symb','t-mo','teli','tim-',
			'tosh','tsm-','upg1','upsi','vk-v','voda','wap-','wapa','wapi','wapp',
			'wapr','webc','winw','winw','xda','xda-'
	);
	if(in_array($mobile_ua, $mobile_agents))
		$mobile_browser++;
	if(strpos(strtolower($_SERVER['ALL_HTTP']), 'operamini') !== false)
		$mobile_browser++;
	// Pre-final check to reset everything if the user is on Windows
	if(strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'windows') !== false)
		$mobile_browser=0;
	// But WP7 is also Windows, with a slightly different characteristic
	if(strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'windows phone') !== false)
		$mobile_browser++;
	if($mobile_browser>0)
		return true;
	else
		return false;
}
$a=is_mobile_request();
var_dump($a);
```


## 下载 ##
展示页面
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Insert title here</title>
</head>
<body>
<a href="1.rar">下载1.rar</a>
<br />
<a href="1.jpg">下载1.jpg</a>
<br />
<a href="doDownload.php?filename=1.jpg">通过程序下载1.jpg</a>
<br />
<a href="doDownload.php?filename=../upload/nv.jpg">下载nv.jpg</a>
</body>
</html>
```
通过程序下载例程 的 doDownload.php : 主要就是发个头，说明下是附件，然后打开要下载的文件就行，basename(); 是用来去除路径的，只留文件名！
```
<?php 
$filename=$_GET['filename'];
header('content-disposition:attachment;filename='.basename($filename));
header('content-length:'.filesize($filename));
readfile($filename);
```




# 分页函数
```
/*
 * @分页函数
 * @param		$total		总记录数
 * @param		$page_now	当前页码
 * @param		$page_size	一页的记录条数
 * @param		$pages		显示的最大页码数
 * */
function paging($total,$page_now,$page_size,$pages){
	$return['total_pages'] 	= 	ceil($total/$page_size);//总页数
	$return['pre_page']		=	($page_now>1)?$page_now-1:1;//前一页数
	$return['next_page'] 	=	($page_now<$return['total_pages'])?$page_now+1:$return['total_pages'];//下一页
	$return['page_now']		=	$page_now;//当前页面
	
	//生成页码 : 小于设定的最大页码数　｜　大于设定的最大的页码数
	if($pages>=$return['total_pages']){
		for ($p = 1;$p<=$return['total_pages'];$p++){
			$return['pages'][] = $p;
		}
	}else{
		//如果　page_now 太小了的话
		if($page_now<=$pages/2){
			for ($p = 1;$p<=$pages;$p++){
				$return['pages'][] = $p;
			}
		}
		//如果page_now 接近总页数了
		elseif($return['total_pages']-$page_now<=$pages/2){
			for ($a = 1,$p=$return['total_pages'];$a<=$pages;$p--,$a++){
				$return['pages'][] = $p;
			}
			sort($return['pages']);
		}
		//page_now 在页码中间
		else{
			//处理奇数页时，一个向上取整，一个去除小数
			for ($p = $page_now -intval($pages/2);$p<$page_now+ceil($pages/2);$p++){
				$return['pages'][] = $p;
			}
		}
	}
	return $return;
}
```


## 时间戳 ##
```
$timestamp=time();//拿到当前的时间戳
```
## 设置时区 ##
```
date_default_timezone_get();//得到当前时区
date_default_timezone_set('PRC');//设置默认时区为中国
```
## 格式化时间戳 ##
```
echo date('Y年m日d天 H:i:s');　//date返回格式化的当前时间
$date3=date('Y-m-d H:i:s',"1228348800");
```
## 拿到某个时间的时间戳 ##
```
mktime(0,0,0,10,9,2014);//返回2014年9月10号的时间戳
```
## 测试代码执行时间 ##
```
$start_time=microtime();
//...执行的代码
$end_time=microtime();
$execute_time=$end_time-$start_time;
```



## 建立自己函数库时，先判断函数是否已经定义了 ##
```
if (!function_exists('is_php')) {
	function is_php(){
		//函数代码
	}
}
```
## 将配置文件全加载进来的方法 ##
```
foreach (glob(ROOT_PATH.'config/*') as $file) {
	require_once $file;//glob 是寻找与模式匹配的文件路径，组成数组
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
```
/* ci 框架　*/
function ($method,$param){
      $this ->input ->$method($param);
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
## ﻿将二维数组存为　csv  文件fputcsv() ##
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
## ﻿想将　csv 格式的数据存到字符串中 ob buffer  ##
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

```
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



- 给数组添加一个元素
```
$arr[] = "caokaiyan";//键为数字键
$arr['xuehao'] = 1001121213;
array_push($array,$var); 
```
- ﻿删除数组中的元素
```
unset($arr['xuehao']);
$var = array_pop($array);//$var 获取数组最后一个元素,数组减去那个元素
$array2 = array_unique($array);//删除数组中重复的元素
```
- 数组计数
```
$array2 =array(array('PHP1','php2','php3'),array('asp1'));  
echo count($array2,COUNT_RECURSIVE);//后面标志表示递归  
```

- 遍历数组中的元素　$key  和　$value 都是副本 , 修改value 的值不会影响到　$arr
```
foreach($arr as $key => $value){
    print   '键 :'.$key.'   值：'.$value;
}
```
- 遍历数组　　\$value  是引用 ,　修改\$value  的值会影响到　$arr
```
$arr = array(1, 2, 3, 4);
foreach ($arr as &$value) {
   $value = $value * 2;
}
// $arr is now array(2, 4, 6, 8)
unset($value); // 最后取消掉引用
```
- 将多个值保存在匿名数组中
```
$fruits['red'][]='strawberry';
$fruits['red'][]='apple';
```
- 将关联数组，根据 键名 拆成 一个个的变量！
```
extract($var_array, EXTR_PREFIX_SAME, "ex"); 
//如果前面有定义过此变量，则变量名加前缀　ex
```
- list构造器　将数组里面的值分别指定给单独变量
```
list($b,$c,$d) =  array('apple','orange','card');
echo $b,$c,$d; //apple orange card
```
- 合并两个数组
```
array_merge($arr1,$arr2);//$arr2 会覆盖同名键的值
```
- 检查数组中是否存在某个键
```
array_key_exists('key',$array);//key存在就返回true,不考虑对应的值
isset($array['key']);/*在array 中的键存在，且不为null*/
```
- 检查数组中是否包含某个值
```
in_array('value',$array);//存在就返回ture
```
- 将数组按键排序
```
ksort($array);
```
- 计算两个数组的并集
```
$union = array_unique(array_merge($A,$b));
```
- 使用回调函数过滤　array 中的值
```
$ar = array("hello", null, "world");
print(implode(',', $ar)); // hello,,world
print(implode(',', array_filter($ar, function($v){ return $v !== null; }))); // hello,world
```
- 数组合并为字符串
```
join(',',$arr);//返回以 , 分割的字符串
implode('-',array('a','b','c'));
```

- 给数组添加一个元素
```
$arr[] = "caokaiyan";//键为数字键
$arr['xuehao'] = 1001121213;
array_push($array,$var); 
```
- ﻿删除数组中的元素
```
unset($arr['xuehao']);
$var = array_pop($array);//$var 获取数组最后一个元素,数组减去那个元素
$array2 = array_unique($array);//删除数组中重复的元素
```
- 数组计数
```
$array2 =array(array('PHP1','php2','php3'),array('asp1'));  
echo count($array2,COUNT_RECURSIVE);//后面标志表示递归  
```

- 遍历数组中的元素　$key  和　$value 都是副本 , 修改value 的值不会影响到　$arr
```
foreach($arr as $key => $value){
    print   '键 :'.$key.'   值：'.$value;
}
```
- 遍历数组　　\$value  是引用 ,　修改\$value  的值会影响到　$arr
```
$arr = array(1, 2, 3, 4);
foreach ($arr as &$value) {
   $value = $value * 2;
}
// $arr is now array(2, 4, 6, 8)
unset($value); // 最后取消掉引用
```
- 将多个值保存在匿名数组中
```
$fruits['red'][]='strawberry';
$fruits['red'][]='apple';
```
- 将关联数组，根据 键名 拆成 一个个的变量！
```
extract($var_array, EXTR_PREFIX_SAME, "ex"); 
//如果前面有定义过此变量，则变量名加前缀　ex
```
- list构造器　将数组里面的值分别指定给单独变量
```
list($b,$c,$d) =  array('apple','orange','card');
echo $b,$c,$d; //apple orange card
```
- 合并两个数组
```
array_merge($arr1,$arr2);//$arr2 会覆盖同名键的值
```
- 检查数组中是否存在某个键
```
array_key_exists('key',$array);//key存在就返回true,不考虑对应的值
isset($array['key']);/*在array 中的键存在，且不为null*/
```
- 检查数组中是否包含某个值
```
in_array('value',$array);//存在就返回ture
```
- 将数组按键排序
```
ksort($array);
```
- 计算两个数组的并集
```
$union = array_unique(array_merge($A,$b));
```
- 使用回调函数过滤　array 中的值
```
$ar = array("hello", null, "world");
print(implode(',', $ar)); // hello,,world
print(implode(',', array_filter($ar, function($v){ return $v !== null; }))); // hello,world
```
- 数组合并为字符串
```
join(',',$arr);//返回以 , 分割的字符串
implode('-',array('a','b','c'));
```

## 引用参数的函数 ##
```
function test（&$test）{
//按引用传递值
}
```
## 默认参数的函数 ##
```
function  preson（$name ,$age='20',$sex='男'）
{
        echo  “我的名字是{$name}”；
}
```
## ﻿参数个数可以变化的函数 ##

```
function   more_args()
{
        $args=func_get_args();
        //将所有传递进来的参数封装成一个数组
        echo $args[0];//输出第一个变量
}
```
## 回调函数 ##
```
mixed   funName（callback   arg）
{
     //将一个函数当作参数传递进来，这个函数称为回掉函数
}
function   filter（$fun）
{
        $i=1;
        return  $fun($i);
}
function one($i)
{
        retrun  $i*$i;
}
filter(one);// 这里将回调函数的名称当作变量，传入里面！
```
## 变量函数 ##
```
function varfunc($a,$b){
	return $a + $b;
}
$a = 'varfunc';
echo $a(2,56);
```
## 动态创建一个函数 ##
```
$func_name=create_function('$message','echo "hello ,{$message}"')；
echo $func_name;//调用动态创建的函数
```

## 对函数本身的引用 ##
```
<?php
function &func($a=0){                // 定义一个函数，在前面加上&
  return $a;                         // 返回参数$a
}
$str = &func("PHP对函数的引用！");   // 声明一个函数的引用$str
echo $str;                           // 输出$str，$str的值实际上就是$a的值。
?>
```

## 递归函数 ##


## 将配置文件移出文档根目录 ##
```
简单的说，互联网上任何不能被用户直接访问的文件都不应该保存在Web站点的文档根目录。
比如 codekissyoung.com  对应的 web根目录是  /var/www/codekissyoung
那么所有与 codekissyoung 有关的配置，文档之类的文件，都应该放在/var/www/codekissyoung_etc 下
在 codekissyoung 的访问接口 index.php 中：
require "../codekissyoung_etc/etc.php";
```
## 严禁将账号密码等明文写于文件中 ##

```
类似于 数据库配置，网站 常数 KEY 值，管理员账号等敏感信息，应该放于codekissyoung_etc/etc.php 中，严禁明文写在程序中！
这样做的原因是当一个恶意用户请求一个非php或html文件时可能发生的状况，默认情况下Web服务器会将文件的内容导出到输出流。
要更好的避免这种情况，还必须确保配置Web服务器为只允许请求php和html文件，而对其他类型的文件请求必须返回错误。
同样的，任何其他文件，如密码文件、配置文件等，都必须与公众文档根目录隔离。
还有，不要启用php的allow_url_fopen选项，避免引入其他机器上的文件。
```

## 文件系统权限 ##
```
　　PHP是能够与本地文件系统进行交互的。必须确保在PHP与文件系统交互时的权限问题，保证用户不能看到私密的文件，如php.ini等。
```


```
<?php
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
 解析数组

 ```
 $juices = array("apple", "orange", "koolaid1" => "purple");
 echo "He drank some $juices[0] juice.".PHP_EOL;
 echo "He drank some $juices[koolaid1] juice.".PHP_EOL;
 // 有效，只有通过花括号语法才能正确解析带引号的键名
 echo "This works: {$arr['key']}";
 // 有效
 echo "This works: {$arr[4][3]}";
 ```
 解析变量

 ```
 echo "This is {$great}";
 echo "This is ${great}";

 ```
 输出字符串

 ```
 $a = 'aaaa';
 $c['c'] = "ccc";
 $b = "i am '$a' and  '$c[c]' \" 我是双引号！\"";
 echo $b; //i am 'aaaa' and 'ccc' " 我是双引号！"
 ```
 {}的解析

 ```
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
 ```
 解析对象

 ```
 // 有效
 echo "This square is {$square->width}00 centimeters broad.";
 ```

 判断是否包含子字符串
 ```
 if(strpos($_POST['email'],'@') === false){
     print 'there was no @ in the e-mail address ';
 }
 ```
 字符串长度
 ```
 strlen("codekissyoung"); //13
 ```
 删除字符串两端空白
 ```
 echo trim('  caokaiyan  '); //caokaiyan
 ```
 将字符串切成数组
 ```
 <?php
 // 示例 1
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

 ```
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
