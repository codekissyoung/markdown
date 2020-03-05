# 概念

本文是`PHP`对象的笔记，也论述了一些`PHP`面向对象实现上的得与失。

## 迟静态绑定

考虑下，子类的两个方法，都是用来实例化自身的，功能相同，只是类不同而已，能不能把它放入`Father`中，然后子类通过继承获取这种能力呢？

```php
class Father{
    static function create(){
        return new self();
    }
}
class Son extends Father{ }
class Girl extends Father{ }

var_dump(Son::create()); // Object Father
var_dump(Girl::create()); // Object Father
```

`self`在类定义的时候，已经和该类绑定到一起了，即便子类继承了父类的`create()`函数，但是`self()`还是指向父类。所以`PHP5.3`之后，开发了迟静态绑定技术，使用`static`替代掉`self`，声明该处的代码，在实际执行的时候，根据它的执行者，来决定它所指向的类。

```php
class Father{
    static function create(){
        return new static();
    }
}
class Son extends Father{
}
class Girl extends Father{
}

var_dump(Son::create()); // Object Son ,Son 执行的代码，所以 static 指向Son
var_dump(Girl::create()); // Object Girl
```

## 判断对象相等

`==` 只要两个对象属性一致就相等，`===`必须为同一个对象才相等。

## 对象克隆

`$b = $a` 直接赋值的其实是引用，`$a`与`$b`指向同一个对象。
`$b = clone $a;` 是克隆一个`$a`对象，`$a` 与 `$b` 分别指向不同的内存地址。

## 魔术方法 拦截器 overloader

```php
class Test {
    public $params = [];
    public function __construct(){} // 当对象被创建时调用
    public function __destruct(){}  // 对象被销毁时调用

    // 当对象设置不存在的属性时,使用一个$params变量将设置的值保存起来
    public function __set($key,$value){$this->params[$key] = $value;}
    public function __get($key){return $this->params[$key];}

    //在对象调用不存在的方法时执行
    public function __call($func,$params){var_dump($func,$params);}
    static public function __callStatic($func,$params){} // 跟 __call 类似,给静态方法提供的
    public function __toString(){return __DIR__;}   // 把一个对象当做字符串使用时执行
    public function __invoke($params){}             // 当对象被当做一个函数使用时调用
    function __isset(){}        // 对不可访问或不存在的属性调用isset()或empty()时被调用
    function __unse(){}         // 对不可访问或不存在的属性进行unset时被调用
    function __sleep(){}        // 当使用serialize时被调用，当你不需要保存大对象的所有数据时很有用
    function __wakeup(){}       // 当使用unserialize时被调用，可用于做些对象的初始化操作
    function __clone(){}        // 进行对象clone时被调用，用来调整对象的克隆行为
    function __set_state(){}    // 当调用var_export()导出类时，此静态方法被调用
    function __debuginfo(){}    // 当调用var_dump()打印对象时被调用
}
```

## 命名空间

无命名空间的 php 代码都是在同一个空间下，不能有重名的类，和方法，属性。

`__NAMESPACE__` 魔术常量，用于显示当前行所在命名空间

绝对命名空间 与 相对命名空间

```php
namespace main; // 声明命名空间

// 相对命名空间 ，实际解析运行时，会在前面加上 main，即变成 main\com\geti...
com\getinstance\util\Debug::helloworld();

// 绝对命名空间，告诉PHP从根命名空间开始搜索
\com\getinstance\util\Debug::helloworld();
```

## ::class 获取类的完全限定名称

```php
namespace NS;
    class ClassName {    }
    echo ClassName::class;  // NS\ClassName
```

```php
abstract class Father{
    abstract public function say();
}
class Son1 extends Father{ public function say(){ echo "son1\n";}}
class Son2 extends Father{ public function say(){ echo "son2\n";}}
class Son_say{
    public function ask_son_say(Father $father){
        // 参数 ，我们使用的是抽象类，只要是该抽象类的子类，都有 say 方法，当然就有了各自的实现
        $father->say();
    }
}
$son1 = new Son1();
$son2 = new Son2();
$say  = new Son_say();
$say->ask_son_say($son1);
$say->ask_son_say($son2);
```

## 接口

1,是功能的封装抽象，我们只关注功能，不关心功能的实现，只要是继承了该接口的类，就应该具有接口的功能！
2,也就是说，你只要知道了一个对象的类型(继承了什么父类，实现了什么接口)，就知道它能做什么！
3,接口和抽象类的区别在于：抽象类关注的是其子类的功能和共性的抽象，而接口更关注的是功能,实现该接口的类就需要有该功能,它不在意类的继承关系

```php
interface Chargeable{ public function getPrice(); }
class ShopProduct implements Chargeable{
    public function getPrice(){
        return 5;
    }
}
class Test{
    // 这里限定类型是 接口，只要传递进来的类实现了该接口，都是合法的
    static public function echo_price(Chargeable $item){
        echo $item->getPrice();
    }
}
Test::echo_price(new ShopProduct());	// 5
```

## 对象语法参考

```php
class Myclass{
    private $id = 0;//私有属性
    protected $name;
    const SUCCESS = "hehe";//类常量
    static private $instance=NULL;//静态变量
    public function __construct(){
        echo "构造方法";
    }
    public function __destruct(){
        echo "析构方法";
    }
    public function getId(){
        echo self::$instance; // 类内部使用静态变量
        return $this->id;
    }
    public static function hellostatic(){
        echo '这是类 的静态方法 ';
    }
    final function getBaseClassName(){
        echo "final修饰，这个方法不允许被子类重写";
        return __CLASS__; // 返回本类的类名
    }
}
```

```php
$obj = new Myclass();
$obj_copy= clone $obj;      // 克隆一个新对象，有独立的内存地址
echo Myclass::SUCCESS;      // 直接使用类常量
Myclass::hellostatic();     // 直接使用静态方法
echo Myclass::$instance;    // 直接使用类静态变量
final class FinalClass(){
    function display(){
        echo 'final修饰，这个类是不允许被继承的';
    }
}
interface Display{
    function display(){}
}
class Circle implements Display{
    function display(){
        echo "我实现接口里面的方法";
    }
}
if($obj instanceof Myclass){
    echo "$obj 是类  Myclass 的实例";
}
abstract class MyBaseClass(){
    function display(){
        echo "抽象类禁止被实例化，只能被继承";
    }
    abstract function show(){} // 抽象类，没有任何功能，只能被继承
}
```



### 静态属性和静态方法

```php
class StaticExample{
    static public $num = 10;
    public function func(){
        echo self::$num."static function ";	 //在类内部使用 静态变量
    }
}
echo StaticExample::$num."\n";//在外部访问静态属性
StaticExample::func();//在外部调用静态方法
```

为何要使用静态变量和静态方法？

- 在程序任意可以访问到类的地方都可以使用，不用为了获取一个简单的功能而实例化一个对象！
- 由该类 new 出来的对象之间，可以共享一些东西！
- 静态方法中，`$this`变量不允许使用。可以使用`self，parent，static`在内部调用静态方法与属性。

```php
class Car {
    private static $speed = 10;
    public static function getSpeed() {
        return self::$speed;
    }
    public static function speedUp() {
        return self::$speed+=10;
    }
}
class BigCar extends Car {
    public static function start() {
        parent::speedUp();
    }
}
BigCar::start();
echo BigCar::getSpeed();
```

## 类的自动加载

```php
spl_autoload_register("autoload1");
spl_autoloda_register("autoload2");

// 如果 new 操作未找到对应的类，就会执行注册好的自动加载函数
// $class 为带命名空间的类名
function autoload1( $class ) {
    require  __DIR__.$class.'.php';
}
function autoload2( $class ) {
    require  __DIR__.'/framework/'.$class.'.php';
}
```
