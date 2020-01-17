# php the right way

[php the right way](http://laravel-china.github.io/php-the-right-way/)

##  代码风格

[阅读 PSR-0](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md)
[阅读 PSR-1](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md)
[阅读 PSR-2](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md)
[阅读 PSR-4](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-4-autoloader.md)
[阅读 PEAR 编码准则](http://pear.php.net/manual/en/standards.php)
[阅读 Symfony 编码准则](http://symfony.com/doc/current/contributing/code/standards.html)
[PHP_CodeSniffer](http://pear.php.net/package/PHP_CodeSniffer/) 检查代码是否符合规范
[PHP Coding Standards Fixer](http://cs.sensiolabs.org/) 自动修复语法格式


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
class Child extends Test{

}

$obj1 = new Test();
$obj2 = new $obj1; // 通过new对象实例来创建一个该类的新对象
var_dump($obj1 !== $obj2); // true

$obj3 = Test::getNew();
var_dump($obj3 instanceof Test); // true

$obj4 = Child::getNew();
var_dump($obj4 instanceof Child); // true
```
