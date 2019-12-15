# PHP 语言

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




