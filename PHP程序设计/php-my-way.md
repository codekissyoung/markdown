# php the right way

参考[php the right way](http://laravel-china.github.io/php-the-right-way/)

## 代码环境

> mac OS [Homebrew](http://brew.sh/) 
> PHP 5.6.20 (cli)
> nginx version: nginx/1.8.1
> mysql  Ver 14.14 Distrib 5.7.12, for osx10.11 (x86_64) using  EditLine wrapper

##  代码风格

[阅读 PSR-0](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md)
[阅读 PSR-1](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md)
[阅读 PSR-2](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md)
[阅读 PSR-4](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-4-autoloader.md)
[阅读 PEAR 编码准则](http://pear.php.net/manual/en/standards.php)
[阅读 Symfony 编码准则](http://symfony.com/doc/current/contributing/code/standards.html)
使用[PHP_CodeSniffer](http://pear.php.net/package/PHP_CodeSniffer/) 检查代码是否符合规范
使用 [PHP Coding Standards Fixer](http://cs.sensiolabs.org/)自动修复语法格式

## 面向对象

### 简单类

```php
class SimpleClass
{
    public $var = 'a default value';
    public function displayVar() {
        echo $this->var;
    }
}
$a = new SimpleClass();
$b = new SimpleClass();
```

### $this 

指向这个类的当前对象

```php
error_reporting(false);
class A
{
    function foo()
    {
        if (isset($this)) {
            echo '$this is defined ('.get_class($this).")\n";
        } else {
            echo "\$this is not defined.\n";
        }
    }
}
class B
{
    function bar()
    {
        A::foo();
    }
}
$a = new A();
$a->foo();  // $this is defined (A)
A::foo(); //$this is not defined.

$b = new B(); 
$b->bar(); // //$this is defined (B)
B::bar(); // $this is not defined.
```
### new 变量名（带命名空间）

```php
$className = 'SimpleClass';
$instance = new $className(); // 等同于 new SimpleClass()
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

### 创建对象的几种方式

```php
class Test
{
    static public function getNew()
    {
        return new static; // new static 是返回当前对象模板实例化的变量，
    }
}
class Child extends Test  // 继承
{}
$obj1 = new Test();
$obj2 = new $obj1; // 通过new对象实例来创建一个该类的新对象
var_dump($obj1 !== $obj2); // true

$obj3 = Test::getNew();
var_dump($obj3 instanceof Test); // true

$obj4 = Child::getNew();
var_dump($obj4 instanceof Child); // true
```

### 匿名函数

```php
class Foo
{
    public $bar;

    public function __construct() {
        $this->bar = function() {
            return 42;
        };
    }
}

$obj = new Foo();

// as of PHP 5.3.0:
$func = $obj->bar;
echo $func() , PHP_EOL;

// alternatively, as of PHP 7.0.0:
// echo ($obj->bar)();
```

