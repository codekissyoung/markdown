# PHP 语言

PHP与MySQL程序设计(第四版)

安全PHP编程，MVC与Zend框架，MySQL存储引擎和数据类型，存储过程，MySQL触发器，索引和搜索，事务等。

Laravel框架关键技术解析

进入到框架的世界里，从2016年开始说吧，推荐使用Laravel/Thinkphp5.0（Thinkphp5.0，没有书，但是王芳说明很全。）以上支持更多新特性的强大的框架，比如Composer,Artisan,依赖注入，Traits，路由，PSR-4命名规范，组件式的模块扩展，多级缓存使用，分布式等。

[PHP设计模式全集2018](https://learnku.com/docs/php-design-patterns/2018)

PHP应用程序安全编程

本书主要内容包括：去除应用程序安全漏洞，防御PHP攻击，提高运行PHP代码的服务器安全，实施严格的身份验证以及加密应用程序，预防跨站点脚本攻击，系统化测试应用程序安全性，解决第三方应用程序已有漏洞等。

深入PHP面向对象、模式与实践

这本书讲解的知识（对象、高级特性、对象工具、对象与设计、模式等等）不光适用于PHP，它适用于所有支持面向对象技术的语言（如Java,Python,Ruby等），这是这本书最难能可贵之处，它并不是针对某一种语言来讲，而是针对多门语言来讲，书中除了PHP之外还常提及JAVA，如果你曾经接触过JAVA这门强类型语言，那么你在读书过程中能体会到静态语言与动态语言的区别，并且能体会到不管用什么语言来实现需求，最终都能殊途同归---应用面向对象的技术来解决问题。

PHP与Mysql高性能开发

本书以“PHP与MySQL高性能应用开发”为主题，选取了其中为核心的佳实践进行讲解，是一个有十余年PHP开发经验的老程序员的经验总结。首先从语言层面总结了PHP编程中的一些疑点和难点，然后重点讲解了PHP的缓冲、网络编程、缓存技术、命令行、调试、测试、用户验证策略、代码重构等知识；然后重点讲解了MySQL的驱动、存储引擎、性能优化、memcached、sphinx全文搜索引擎等重要主题。

PHP系统核心与最佳实践

由于语言的特性，php语言简单好用导致了编程人员水平以及代码的良莠不齐，工作一到两年的php人员都是模板工人的代名词。此书在一定范围内开阔了开发人员的视野，比如通过面向对象的方式来解决php代码扩展性差的问题，网络编程应用来扩展php的实用范围，并且花费了相当的篇幅进行php源码的剖析，完成一个php的扩展项目，这是深度方面。

高性能PHP应用开发

一本广受好评的php性能优化方面的图书，通过介绍PHP的原理和相关的工具集来实现调优性能的目的。它分析和研究了Web应用程序的前端和后端，并系统地提升了其性能和运行效率。本书还介绍了PHP编码最佳实践的运用以及如何使用工具来应用缓存技术。另外书中也涉及了对web服务器的优化和数据库的优化。

Modern PHP(现代PHP)

介绍了很棒的php新特性。作者还写了 slimphp 微框架，php之道。能潜移默化行程好的php编码风格。

我相信国内很多php开发者对php5.4以后的特征并不了解，国内还有很多公司采用着5.3的版本，这种守旧的思想对国内php开发者的技术成长很不利，虽然本书所讲的新特征在新版手册上都有，但你不一定能看到，本书做了一个很好的归纳。


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
    protected $type = 'text/html';
    protected $body = 'hello world';

    public function addRoute( $path, $routeCallback ) {
        // 将闭包绑定到 当前 App 实例, 
        $this -> routes[$path] = $routeCallback->bindTo( $this, __CLASS__ );
    }

    public function dispatch( $cur_path )
    {
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
















