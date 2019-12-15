# 变量的取值

给定一个变量 $a ,下列是它的所有情况

1. $a 未定义过
2. $a = null
3. $a 为空值，即 `"" ,'' , 0 , 0.00 , "0" , '0' , []`
4. $a 为空对象，即 `class A{}; $a = new A();`
5. $a 为非空值

对于判断函数 : 

- isset 判断 3 4 5 都为true
- empty 判断 1 2 3 都为true
- if 判断 4 5 为true

```php
#!/usr/bin/php
<?php
error_reporting(E_WARNING); // 只报告警告级别以上的错误
// 未定义值
echo "未定义值\n";
echo "isset : ".var_export(isset($undef),true)."\t";
echo "empty : ".var_export(empty($undef),true)."\t";
if($undef) { echo "if : true"; } else { echo 'if : false';}
echo "\n--------------------------------------------------\n";

// null
$d = null;
echo "null \n";
echo "isset : ".var_export(isset($d),true)."\t";
echo "empty : ".var_export(empty($d),true)."\t";
if($d) { echo "if : true"; } else { echo 'if : false';}
echo "\n--------------------------------------------------\n";

// 空值
$e = ['',"",0,0.00,'0',"0",[]];
echo '\'\',"",0,0.00,\'0\',"0",[]'."\n";
foreach ($e as $v){
	echo "isset : ".var_export(isset($v),true)."\t";
	echo "empty : ".var_export(empty($v),true)."\t";
	echo "if : ".($v ? 'true':'false')."\n";
}
echo "\n--------------------------------------------------\n";

// 空对象
class A{}
$a = new A();
echo "空对象\n";
echo "isset : ".var_export(isset($a),true)."\t";
echo "empty : ".var_export(empty($a),true)."\t";
if($a) { echo "if : true"; } else { echo 'if : false';}
echo "\n--------------------------------------------------\n";

// 非空值
$t = ['a',"ab",'0.00',"0.00",['a'=>12]];
echo '\'a\',"ab",\'0.00\',"0.00",[\'a\'=>12]'."\n";
foreach ($t as $v){
	echo "isset : ".var_export(isset($v),true)."\t";
	echo "empty : ".var_export(empty($v),true)."\t";
	echo "if : ".($v ? 'true':'false')."\n";
}
```

```bash
未定义值
isset : false	empty : true	if : false
--------------------------------------------------
null 
isset : false	empty : true	if : false
--------------------------------------------------
'',"",0,0.00,'0',"0",[]
isset : true	empty : true	if : false
isset : true	empty : true	if : false
isset : true	empty : true	if : false
isset : true	empty : true	if : false
isset : true	empty : true	if : false
isset : true	empty : true	if : false
isset : true	empty : true	if : false

--------------------------------------------------
空对象
isset : true	empty : false	if : true
--------------------------------------------------
'a',"ab",'0.00',"0.00",['a'=>12]
isset : true	empty : false	if : true
isset : true	empty : false	if : true
isset : true	empty : false	if : true
isset : true	empty : false	if : true
isset : true	empty : false	if : true
```

可变变量:php是动态实时解析的语言
================================================================================
```php
<?php
//例子1
$a = "test";
$test = "i am the test";
function test（）{echo "i am function test!";}
echo $a; //test
echo $$a; // i am the test
$a(); //i am function test!
//例子2
foreach ($_POST as $key => $value) {
    $$key = $value;    //利用可变变量，use key name as variable name
｝
//例子3
// example.com?class=person&func=run
$class=$_GET['class'];
$func=$_GET['func'];
$obj=new $class();
$obj->$func();
```

`$_GET`
================================================================================
```bash
<?php
// http://www.dadishe.com/test/checkbox.php?a[]=b&a[]=c
array
    'a' =>
        array
            0 => string 'b' (length=1)
            1 => string 'c' (length=1)
```

extensions
================================================================================
```bash
$a = get_loaded_extensions();
var_dump($a);
```

ini_get 拿配置信息
================================================================================
```bash
echo ini_get("allow_url_fopen") ? "支持":"不支持";
echo ini_get("file_uploads") ? ini_get("upload_max_filesize"):"Disabled";
echo ini_get("max_execution_time");
```


## $GLOBALS ##
```
var_dump($GLOBALS);//一个封装了所有在脚本中的全局变量的数组，包括php内置的和我们自己声明的
```
## $_GET ##
```
http://www.dadishe.com/test/checkbox.php?a[]=b&a[]=c
array
  'a' => 
    array
      0 => string 'b' (length=1)
      1 => string 'c' (length=1)
```
## extensions ##
```
$a = get_loaded_extensions();
var_dump($a);
```
## ini_get拿配置信息 ##
```
echo ini_get("allow_url_fopen")?"支持":"不支持";
echo ini_get("file_uploads")?ini_get("upload_max_filesize"):"Disabled";
echo ini_get("max_execution_time");
```
## 配置时区 ##
```
echo date("Y-m-d H:i:s",time());
echo date_default_timezone_get();
date_default_timezone_set("ETC/GMT-8");
echo date("Y-m-d H:i:s",time());
```
## 如何判定常量是否被定义 ##
```
bool defined(string constants_name);
```

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

