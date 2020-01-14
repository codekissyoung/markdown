## null 就是不存在的意思，isset 是只要变量存在就true ##

```php
$a = '';	var_dump(isset($a));	// true
$b = null;	var_dump(isset($b));	// false
var_dump(null);						// NULL
```

## empty是只有变量不为空，才flase ##

```
class A{};
$a = new A;
if(!empty($var)) echo "not empty";	
//'',""，0，"0"，NULL，FALSE，array(),$var; 和没有任何属性的对象在用 empty判断时，都是空的，返回TURE；
```
##用 if 判断 true 和 false 时的自动转换##
```
class A{}
if('')     echo "true";
if("")     echo "true";
if([]) 	   echo "true";
if(new A)  echo "true";		//true
if(null)   echo "true";
if(0)	   echo "true";
if(0.0)	   echo "true";
if("0")	   echo "true";
```

## 静态变量 :驻留内存的变量##
```
function a(){
	static $a = 1;
	echo $a;
	$a++;
}
a();//1
a();//2
```
## 常量：只读变量 ##
```
define("TEST",'codekissyoung');
echo TEST;//codekissyoung
```
## 可变变量:php是动态实时解析的语言 ##
```
$a = "test";
$test = "i am the test";
function test（）{echo "i am function test!";}   
echo $a; //test
echo $$a; // i am the test
$a(); //i am function test!
```
将　assoc 　数组拆解成变量
```
foreach ($_POST as $key => $value) {
			$$key = $value;
		｝
```
动态 new 对象和调用函数
```
//example.com?class=person&func=run
$class=$_GET['class'];
$func=$_GET['func'];
$obj=new $class();
$obj->$func();
```
##  变量的引用　##

```
$a="ABC"; 
$b =&$a; 
echo $a;//这里输出:ABC 
echo $b;//这里输出:ABC 
$b="EFG"; 
echo $a;//这里$a的值变为EFG 所以输出EFG 
echo $b;//这里输出EFG 
```
引用和函数结合使用
```
function test(&$a) { 
	$a=$a+100; 
} 
$b=1; 
test($b);//这里$b传递给函数的其实是$b的变量内容所处的内存地址，通过在函数里改变$a的值　就可以改变$b的值了 
echo $b;//输出101 
//要注意的是，在这里test(１);的话就会出错，原因自己去想:标量不能按引用传递
```

## 变量的全局范围 ##

(1)现在的程序(web程序，或者其他)都是只有一个入口的(你以 url/test1.php 和 url/test2.php 去访问的其实是两个程序)。

(2)现在的web程序都是只能访问 index.php这个文件，然后index.php去调度资源，返回相应的页面！如果使用了框架的话，index.php 里面会先加载这个框架(资源，类库，函数库)，然后由这个框架来调度资源。

(3)ci就是一个url对应一个类里面的方法，每一次url请求，在服务器端都是执行一个类(控制器)的一个方法而已。而这个方法要如何写，就是我们要实现的程序部分了。换句话说，框架又将调度资源的规则交到了你的手里。

(4)如果想在框架里面使用一些自己定义的函数或者类库，或者变量和常量，可以在index.php 引入框架之前，将你的类库/函数库/常量变量配置文件引入。然后在程序的任意处都可以使用了（除变量）。注意，你的命名不能和php函数以及框架里面的函数重名，否则会被覆盖。

(5)全局变量在函数内部不可以直接访问，要用global 声明一下才可以访问。全局变量在函数外部是可以随意访问的。

## 变量的取值

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

