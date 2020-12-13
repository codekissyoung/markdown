# PHP 函数 

## 传参不定

```php
function more_args(){
    $args=func_get_args(); // 将所有传递进来的参数封装成一个数组
    echo $args[0];         // 输出第一个变量
}
```

## 变量函数

```php
function varfunc( $a, $b ) {
    return $a + $b;
}
$a = 'varfunc';
echo $a( 2, 56 );
```

## 回调函数

将一个函数名当做参数传入,执行

```php
function   filter（$fun）{
    $i=2;
    return  $fun($i);
}
function one($i){
    retrun  $i*$i;
}
filter(one);// 这里将回调函数的名称当作变量，传入里面！
```

## 递归函数

```php
function A($i){
    if($i<=1) return $i;
    return A($i-1)*$i;
}
```

## 匿名函数

也叫闭包(Closures), 经常被用来临时性地创建一个无名函数，用于回调函数等用途。

```php
$func = function($arg)
{
    print $arg;
};
$func("Hello World");
```

以上代码定义了一个匿名函数，并赋值给了 \$func.

可以看到定义匿名函数依旧使用 function 关键字，只不过省略了函数名，直接是参数列表。

然后我们又调用了 \$func 所储存的匿名函数。

```php
$input = array(1, 2, 3, 4, 5, 6);

// Creates a new anonymous function and assigns it to a variable
$filter_even = function($item) {
    return ($item % 2) == 0;
};

// Built-in array_filter accepts both the data and the function
$output = array_filter($input, $filter_even);

// The function doesn't need to be assigned to a variable. This is valid too:
$output = array_filter($input, function($item) {
    return ($item % 2) == 0;
});

print_r($output);
```

匿名函数还可以用 use 关键字来捕捉外部变量

```php
function arrayPlus($array, $num)
{
    array_walk($array, function(&$v) use($num){
        $v += $num;
    });
}
```

上面的代码定义了一个 arrayPlus() 函数(这不是匿名函数), 它会将一个数组($array)中的每一项，加上一个指定的数字($num).
在 arrayPlus() 的实现中，我们使用了 array_walk() 函数，它会为一个数组的每一项执行一个回调函数，即我们定义的匿名函数。
在匿名函数的参数列表后，我们用 use 关键字将匿名函数外的 \$num 捕捉到了函数内，以便知道到底应该加上多少。

## php 闭包使用 use 关键字

```php
function criteria_greater_than($min)
{
    return function($item) use ($min) {
        return $item > $min;
    };
}

$input = array(1, 2, 3, 4, 5, 6);

// Use array_filter on a input with a selected filter function
$output = array_filter($input, criteria_greater_than(3));

print_r($output); // items > 3
```

## call_user_func_array 调用用户函数

```php
function foobar($arg, $arg2) {
    echo __FUNCTION__, " got $arg and $arg2\n";
}
class foo {
    function bar($arg, $arg2) {
        echo __METHOD__, " got $arg and $arg2\n";
    }
}

call_user_func_array("foobar", ["one", "two"]); // 调用函数
$foo = new foo;
call_user_func_array( [$foo, "bar"], ["three", "four"]); // 调用方法

namespace Foobar;
class Foo {
    static public function test($name) {
        print "Hello {$name}!\n";
    }
}
call_user_func_array(　__NAMESPACE__ .'\Foo::test', ['Hannes']);
call_user_func_array(　[　__NAMESPACE__ .'\Foo', 'test'], ['Philip']);
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

call_user_func_array("foobar", ["one", "two"]); // 等价 foobar("one", "two")

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
call_user_func_array( __NAMESPACE__ .'\Foo::test', ['Hannes']);
call_user_func_array( [__NAMESPACE__ .'\Foo', 'test'], ['Philip']);
```
