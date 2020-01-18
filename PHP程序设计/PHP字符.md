# PHP字符串

`PHP`字符串笔记。


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


## 汉字加密 解密，为了解决传输时，汉字符会丢失的问题 ##

```php
$urlstr = urlencode("我是codekissyoung");
echo  urldecode($urlstr);
```



```php
json_encode($mixed);

json_decode($json,[ture]); // ture 表示解析成数组

function is_json($string) {
 json_decode($string);
 return (json_last_error() == JSON_ERROR_NONE);
}
```

判断是否包含子字符串

```php
if(strpos($_POST['email'],'@') === false){
    print 'there was no @ in the e-mail address ';
}
strlen("codekissyoung"); //13 字符串长度
trim('  caokaiyan  '); //caokaiyan 删除字符串两端空白

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