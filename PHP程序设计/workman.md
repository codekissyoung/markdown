# 检测是否符合基本安装条件

```
curl -Ss http://www.workerman.net/check.php | php
```

# php7 安装 Event 拓展

```shell
# 先安装 libevent 库 , 要求版本大于 2
➜  workerman git:(master) ✗ sudo apt-get install libevent-2.0-5
[sudo] password for cky:
Reading package lists... Done
Building dependency tree       
Reading state information... Done
libevent-2.0-5 is already the newest version (2.0.21-stable-2ubuntu0.16.04.1).
libevent-2.0-5 set to manually installed.
0 upgraded, 0 newly installed, 0 to remove and 3 not upgraded.

# 下载 event 库
➜  software wget http://pecl.php.net/get/event-2.3.0.tgz
$ phpize
$ ./configure --with-event-core --with-event-extra --enable-event-debug
$ make
Optionally run tests:
$ make test
Install it (as root):
$ sudo make install
```

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

# 匿名函数 / 闭包 Closures

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
