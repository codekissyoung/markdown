# PHP 语言

## 变量

`$a`作为一个标识符，如果不赋值的话，解释器表示找不到这个标识符，表示不存在的意思。其实`null`也表示这个意思。

```php
$a;         // a: no such symbol
```

赋值的话，`$a`这个标识符，就与一个实体`10`绑定了，更容易理解的说法是：`$a`就代表了这个实体。

```php
$a = 10;    // a: (refcount=0, is_ref=0)int 10
```

那么，能赋值给`$a`，或者说，`$a`能够存储的数据有哪些呢?

> 答: `String` `Integer` `Float` `Boolean` `Array` `Object` `NULL`

`&`是引用符号，将两个标识符绑定到同一块内存上，`$a`与`$b`互相作为对方的别名。

```php
$a = 10;
$b = &$a;
$b = 20;
// 执行后
// a: (refcount=2, is_ref=1)int 20
// b: (refcount=2, is_ref=1)int 20
```

对于`Object`来说，默认就是 赋值 就是 引用：

```php
class SimpleClass
{
    public $name = "Link";
}
$a = new SimpleClass();
$b = $a;
$b->name = "Sam";
// 执行后
// a: (refcount=2, is_ref=0)
// object(SimpleClass)[1]
//   public 'name' => (refcount=2, is_ref=0)string 'Sam' (length=3)
// b: (refcount=2, is_ref=0)
// object(SimpleClass)[1]
//   public 'name' => (refcount=2, is_ref=0)string 'Sam' (length=3)
```

可变变量

```php
$a    = "test";

$test = "i am the test";
function test(){
    echo "i am function test!";
}

echo $$a; 	// i am the test
$a(); 		// i am function test!

// example.com?class=person&func=run
$class = $_GET['class'];
$func  = $_GET['func'];
$obj = new $class();
$obj -> $func();
```

#### unset

```php
$a = 1;
$b = &$a;
unset($b);  // 只会取消 $b 到内存的引用，不会销毁空间
```

#### 变量的地址

```php
// 这里其实隐藏了 $val = $data[$key] 操作
$data = ['a', 'b', 'c'];
foreach ( $data as $key => $val ) {
    $val = &$data[$key];        // $val 与 $data[$key] 互为引用， 指向当前 $data[$key] 表示的实体
    var_dump($data);
}
var_dump($data);
// 结果: [a,b,c],[b,b,c],[b,c,c],[b,c,c]
```

## Trait 的使用

两个现实含义相差较大的类, 比如 `RetailStore` 和 `Car`, 但是都需要一个 "转换成经纬度坐标" 的功能

- 第一反应: 都继承父类 `Geocodable`, 父类提供 "转换成经纬度坐标" 功能 (下策)
- 第二反应: 都实现统一接口 `Geocodable`, 但是 "转换成经纬度坐标" 功能 的实现代码是一致的, 两个类要重复写两次, 违背`DRY` (中策)
- 上策: 使用 `trait` 实现 `Geocodable` 功能, 然后分别 "注入" 到 `RetailStore` 和 `Car`中

```php
trait Geocodable { // 定义 trait
    protected $address;
    protected $geocoder;
    public function setGeocoder(){}
    public function getLatitude(){}
    protected function geocodeAddress(){}
}
class RetailStore {
    use Geocodable;// 注入 Geocodable
}
class Car {
    use Geocodable;// 注入 Geocodable
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

JS 的闭包是自动将 上下文状态 封装到闭包里面的,而 PHP 中需要手动操作:

- 方法 1 使用 `use` 关键字

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

闭包其实是个`Closure`类实例, 它可以使用 `bindTo()` 方法,绑定到其他对象上,这样在闭包内部,可以通过`$this`访问到被绑对象的所有 `属性` 和 `方法`

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

```php
$x = 3;

$func1 = function() use(&$x) { return $x *= 2; };
// 对比下
$func2 = function() use($x) { return $x *= 2; };

$x = 4;

print $func1(); // 8
print $func2(); // 6
print $x;       // 8
```


## 参考

PHP 与 MySQL 程序设计(第四版)
安全 PHP 编程
Laravel 框架关键技术解析
[PHP 设计模式全集 2018](https://learnku.com/docs/php-design-patterns/2018)
PHP 应用程序安全编程
深入 PHP 面向对象、模式与实践
PHP 与 Mysql 高性能开发
PHP 系统核心与最佳实践
高性能 PHP 应用开发
Modern PHP
[php the right way](http://laravel-china.github.io/php-the-right-way/)
[阅读 PSR-0](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md)
[阅读 PSR-1](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md)
[阅读 PSR-2](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md)
[阅读 PSR-4](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-4-autoloader.md)
[阅读 PEAR 编码准则](http://pear.php.net/manual/en/standards.php)
[阅读 Symfony 编码准则](http://symfony.com/doc/current/contributing/code/standards.html)
[PHP_CodeSniffer](http://pear.php.net/package/PHP_CodeSniffer/)  检查代码是否符合规范
[PHP Coding Standards Fixer](http://cs.sensiolabs.org/) 自动修复语法格式
