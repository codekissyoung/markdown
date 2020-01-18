# PHP 语言

PHP与MySQL程序设计(第四版)

安全PHP编程

Laravel框架关键技术解析

[PHP设计模式全集2018](https://learnku.com/docs/php-design-patterns/2018)

PHP应用程序安全编程

深入PHP面向对象、模式与实践

PHP与Mysql高性能开发

PHP系统核心与最佳实践

高性能PHP应用开发

Modern PHP

[php the right way](http://laravel-china.github.io/php-the-right-way/)

[阅读 PSR-0](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md)
[阅读 PSR-1](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md)
[阅读 PSR-2](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md)
[阅读 PSR-4](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-4-autoloader.md)
[阅读 PEAR 编码准则](http://pear.php.net/manual/en/standards.php)
[阅读 Symfony 编码准则](http://symfony.com/doc/current/contributing/code/standards.html)
[PHP_CodeSniffer](http://pear.php.net/package/PHP_CodeSniffer/) 检查代码是否符合规范
[PHP Coding Standards Fixer](http://cs.sensiolabs.org/) 自动修复语法格式

## 变量

#### Copy on write

```php
$a = 10;
$b = $a;    // $a 与 $b 指向同一块内存    
$b = 100;   // 执行到这句,才重新开辟一块内存给 $b ，然后写入 
```

#### 引用

```php
$a = range( 0, 3 );
xdebug_debug_zval('a');
$b = &$a;
xdebug_debug_zval('a');
xdebug_debug_zval('b');
$b = range( 4, 7 );         // 改变 $b 等与 改变 $a
xdebug_debug_zval('a');
xdebug_debug_zval('b');
```

### 变量赋值与引用

```php
$instance = new SimpleClass();
$assigned   =  $instance;
$reference  = &$instance;
$instance -> var = '$assigned will have this value';
$instance = null; // $instance and $reference become null

var_dump($instance); // null
var_dump($reference); // null
var_dump($assigned); //object(SimpleClass) 1 (1) { ["var"]=>string(30) "$assigned will have this value"}
```

可变变量

```php
//例子1
$a = "test";
$test = "i am the test";
function test（）{　echo "i am function test!";　}
echo $a; 	//　test
echo $$a; 	// i am the test
$a(); 		//　i am function test!

//例子2
foreach ($_POST as $key => $value) {
    $$key = $value;    // 利用可变变量，use key name as variable name
｝

//例子3
// example.com?class=person&func=run
$class=$_GET['class'];
$func=$_GET['func'];
$obj=new $class();
$obj->$func();
```

#### unset

```php
$a = 1;
$b = &$a;
unset($b);  // 只会取消 $b 到内存的引用，不会销毁空间
```

#### 对象本身 就是引用传递

```php
class Person { public $name = "zhangsan"; }

$p1 = new Person;
xdebug_debug_zval('p1');
// p1: (refcount=1, is_ref=0)=class Person { public $name = (refcount=2, is_ref=0)='zhangsan' }

$p2 = $p1;
xdebug_debug_zval('p1');
// p1: (refcount=2, is_ref=0)=class Person { public $name = (refcount=2, is_ref=0)='zhangsan' }

$p2->name = "lisi";
xdebug_debug_zval('p1');
// p1: (refcount=2, is_ref=0)=class Person { public $name = (refcount=0, is_ref=0)='lisi' }
```

#### 变量的地址

```php
$data = ['a', 'b', 'c'];
foreach ($data as $key => $val)  // 这里其实隐藏了 $val = $data[$key] 操作
{
    $val = &$data[$key];
    var_dump($data);
}
var_dump($data);
// 结果: [a,b,c],[b,b,c],[b,c,c],[b,c,c]
```

`$val = &$data[$key];` 表示将 `$data[$key]` 的地址给了 `$val`


## Trait 的使用

两个现实含义相差较大的类, 比如 `RetailStore` 和 `Car`, 但是都需要一个 "转换成经纬度坐标" 的功能

- 第一反应: 都继承父类 `Geocodable`, 父类提供 "转换成经纬度坐标" 功能 (下策)
- 第二反应: 都实现统一接口 `Geocodable`, 但是 "转换成经纬度坐标" 功能 的实现代码是一致的, 两个类要重复写两次, 违背`DRY` (中策)
- 上策: 使用 `trait` 实现 `Geocodable` 功能, 然后分别 "注入" 到 `RetailStore` 和 `Car`中

```php
// 定义 trait
trait Geocodable {
    protected $address;
    protected $geocoder;
    public function setGeocoder(){
        //... 
    }
    public function getLatitude(){
        // ... 
    }
    protected function geocodeAddress(){
        // ...
    }
}
class RetailStore {
    use Geocodable;     // 注入 Geocodable
}
class Car {
    use Geocodable;     // 注入 Geocodable
}
```

## 生成器 yield

`yield`的出现,为迭代处理数据提供了一种很 "简洁 清晰"的写法,不使用`yield`也能完成同样的任务,但是没有`yield`代码这么优雅

```php
// 占用内存为 $length 
function badMakeRange( $length ){
    $data = [];
    for( $i = 0; $i < $length; $i++)
        $data[] = $i;
    return $data;
}
// 占用内存为 1
function makeRange( $length ){
    for( $i = 0; $i < $length; $i++ )
        yield $i;
}

foreach( makeRange(1000) as $i )
    echo $i;

// 每次返回 1 行 csv 数据进行处理
function getRows($file){
    $handle = fopen($file, 'rb');
    while( feof($handle) === false )
        yield fgetcsv($handle);
    fclose($handle);
}

foreach( getRows('data.csv') as $row )
    print_r($row);
```

## 闭包

闭包 可以理解为 创建时封装了周围状态(上下文)的匿名函数,即使闭包的上下文环境消失了,闭包中在 初始化时保存的 "上下状态文状态" 还在.

闭包 和 匿名函数 在 PHP 几乎是等价的,它们其实是伪装成函数的对象,是`Closure`类的实例.与数值 字符串 对象一样,是一等类型,可以赋值给变量.

```php
$closure = function($name){
    return printf("Hello %s\n", $name);
};
$closure("link"); // Hello link

// 简化 参数为 回调函数 的 函数调用 代码
function incrementOne( $num ){
    return $num + 1;
}
$arr = array_map('incrementOne', [1,2,3]);
print_r($arr);      // [2, 3, 4]

// 简化为
$arr = array_map( function($num){
    return $num + 1;
}, [1,2,3] ); // 简洁而富有表达力
```

JS的闭包是自动将 上下文状态 封装到闭包里面的,而 PHP 中需要手动操作:

- 方法1 使用 `use` 关键字

```php
function enclosePerson( $name ){
    return function($doCommand) use ($name) {
        return printf("%s, %s\n", $name, $doCommand);
    };
}

// 下句调用后,已经跳出 $name 的作用域了,但是值已经被绑定到闭包了
$link = enclosePerson("link");

$link("give me a book");    // link, give me a book
```

- 方法2 闭包其实是个`Closure`类实例, 它可以使用 `bindTo()` 方法,绑定到其他对象上,这样在闭包内部,可以通过`$this`访问到被绑对象的所有 `属性` 和 `方法`

```php
class App{
    protected $routes = [];
    protected $status = '200 Ok';
    protected $type   = 'text/html';
    protected $body   = 'hello world';
    public function addRoute( $path, $routeCallback ) {
        // 将闭包绑定到 当前 App 实例, 
        $this -> routes[$path] = $routeCallback->bindTo( $this, __CLASS__ );
    }
    public function dispatch( $cur_path ){
        // 调用 cur_path 对应的 闭包, 闭包里面是 当时绑定的 app 的实例对象(被闭包操作过)
        $this -> routes[$cur_path] ();

        header("HTTP/1.1 ".$this->status);
        header("Content-type: ".$this->type);
        header("Content-length: ".mb_strlen($this->body));
        echo $this->body;
    }
}
$app = new App();
$app -> addRoute('/users/link', function(){
    $this -> type = 'application/json;charset=utf8';
    $this -> body = '{"name":"link"}';
});
$app -> dispatch('/users/link');
```

## 匿名函数 / 闭包 Closures

```php
# 不定参函数
function more_args() {
    $args = func_get_args();    // 返回包含所有参数的数组
    echo $args[0];
}

// 变量函数
function varfunc( $a, $b ) {
    return $a + $b;
}
$a = 'varfunc';
echo $a( 2, 56 );
```


```php
$func = function( $arg ) {
    print $arg;
};
$func("Hello World");

// array_filter 要求传递 一个 function( $item ) 类型函数
$input = array(1, 2, 3, 4, 5, 6);
$output = array_filter( $input, function( $item ) {
    return ( $item % 2 ) == 0;
});

// use 关键字 捕捉外部变量
function arrayPlus( $array, $num ) {
    // 为一个数组的每一项执行一个回调函数
    // 将匿名函数外的 $num 捕捉到了函数内
    array_walk($array, function( &$v ) use( $num ) {
        $v += $num;
    });
}
```

```php
// 测试代码执行时间
$start_time = microtime();
//...执行的代码
$end_time = microtime();
$execute_time = $end_time - $start_time;
```

```php
register_shutdown_function( ['core', 'handleShutdown'] );   // 正常/异常 退出时 调用
set_exception_handler( ['core', 'handleException'] );       // 设置异常处理函数
set_error_handler( ['core', 'handleError'] );               // 设置错误处理函数
```

## call_user_func_array 调用用户函数

```php
call_user_func( 'myFunction' );                 // myFunction();
call_user_func( [$myObj,'method_name'], 20 );   // $myObj -> method_name(20);
call_user_func_array( [$obj,'method'], $args ); // $obj -> method( $arg1, $arg2 );
```

```php
function foobar($arg, $arg2) {
    echo __FUNCTION__, " got $arg and $arg2\n";
}
class foo {
    function bar($arg, $arg2) {
        echo __METHOD__, " got $arg and $arg2\n";
    }
}

call_user_func_array("foobar", array("one", "two")); // 等价 foobar("one", "two")

$foo = new foo;
call_user_func_array([$foo, "bar"], ["three", "four"]); // 等价 $foo->bar("three","four")
```

```php
namespace Foobar;

class Foo {
    static public function test($name) {
        print "Hello {$name}!\n";
    }
}

call_user_func_array( __NAMESPACE__ .'\Foo::test', array('Hannes'));
call_user_func_array( [__NAMESPACE__ .'\Foo', 'test'], array('Philip'));
```












