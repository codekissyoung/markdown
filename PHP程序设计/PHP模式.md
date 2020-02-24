# 设计模式

本文是`PHP`常用的设计模式的梳理。

## 工厂模式

使用函数或者类方法生成对象，而不是在代码中直接`new`，使用工厂模式的一个考虑就是，假如在系统中多次使用了这个类`new`对象，如果该类发生改变，那么所有`new`代码都需要改正，但是如果把`new`这一操作封装到工厂方法里，就只需要改工厂里`new`的代码就行了，所有使用到该对象的地方都不用改。

```php
class  Factory {
    static function createDb(){
        $db = new Database ;
        return $db;
    }
}
Factory::createDb();
```

## 单例模式

保证程序运行时，只能存在某个类的一个实例对象！比如链接`MySQL`的对象，链接`Memcache`的对象。

```php
<?php
class Mem extends Memcache{
    private static $mem_instance = null;
    private function __construct(){      // 在外部就不能new对象了
        parent::__construct();
    }
    private function __clone(){}         // 私有
    public static function get_mem_ins(){
        if(null === self::$mem_instance){
            self::$mem_instance = new Memcache;
        }
        return self::$mem_instance;
    }
}
$mem = Memcache::get_mem_ins();  //调用
```

## 注册树模式

用来将一些全局需要使用的 `对象/变量` 挂载到注册树上，程序任何地方都可以通过注册器树取到想要的 `对象/变量`

```php
class Register{
    protected static $objects;
    static function set($alias,$object){
        self::$objects[$alias] = $object;
    }
    static function _unset(){
        unset(self::$objects[$alias]);
    }
    public function get($alias){
        return slef::$objects[$alias];
    }
}
```

## 适配器模式

将不同的 `函数接口/对象` 封装成统一的 API,比如 PHP 数据库操作有 mysql mysqli pdo 3 种，可以使用适配器模式统一成一致。类似的有 `cache适配器`，将`Memcache redis/file/apc`等不同缓存函数统一成一致

实现思路：定义一个接口约束 Interface DB ,里面定义了要实现的方法,MySQL,MySQLi,PDO 分别是这个接口的三种实现。

```php
<?php
// 适配器接口
interface Database{
    function connect($host,$user,$passwd,$dbname);
    function query($sql);
    function close();
}

class MySQL implements Database{
    function connect($host,$user,$passwd,$dbname){
    }
    function query($sql){
    }
    function close(){
    }
}

class MySQLi implements Database{
    // ... 类似的，实现接口的3个函数
}

class PDO implements Database{
    // ... 类似的，实现接口的3个函数
}

$db = new MySQL(); // 这边根据需要可以随意将 MySQL 替换成 MySQLi 或者 PDO,三种实现任意切换,
$db->connect('127.0.0.1','root','root','test');
$db->query('show databases');
$db->close();
```

## 策略模式

将一组特定的`行为和算法`封装成类,以适应某些特定的上下文环境,比如一个电商系统，针对`男/女生用户`分别要展示不同的商品类目，并且所有广告位展示不同的广告

如果在代码中使用`if else`区分用户，分别实现，那么 当新增加一类用户时，比如`儿童`，所有的`if else`都要作相应的调整

```php
// 不使用策略模式
if (男生){
    // 展示男生目录
}else if(女生){
    // 展示女生目录
}else{
    // 展示儿童目录
}
if (男生){
    // 展示男生广告
}else if(女生){
    // 展示女生广告
}else{
    // 展示儿童广告
}
if (男生){
    // 展示男生广告
}else if(女生){
    // 展示女生广告
}else{
    // 展示儿童广告
}
```

约定一个接口`interface Show{...}` ,根据上下文环境,分别实现 n 个符合接口的策略类

```php
interface UserStrategy{
    function showAd();
    function showCategory();
}
class ManUserStrategy implements UserStrategy{
    function showAd(){}
    function showCategory(){}
}
class WomenUserStrategy implements UserStrategy{
    function showAd(){}
    function showCategory(){}
}
class ChildUserStrategy implements UserStrategy{ }

if(男性){
    $strategy = 'ManUserStrategy';
}else if(女性){
    $strategy = 'WomenUserStrategy';
} else{
	// 假如新增了一类用户，只需要新增一个策略继承UserStrategy
	// 然后这里的选择策略多一个判断而已，下面调用策略实现功能的代码都是一样的
    $strategy = 'ChildUserStrategy';
}

// 下面的代码都是统一的
$user_strategy = new $strategy();
$user_strategy -> showCategory();
$user_strategy -> showAd();
```

## 使用策略模式 实现 IOC 解耦合 控制反转 依赖倒置

- 依赖: 类 A 调用了　类 B , 称　类 A 依赖于类 B
- 耦合: 类 A 调用了　类 B 或者　类 B 调用了 类 A ,称类 A 与类 B 之间有耦合关系
- 耦合度: 类之间依赖程度的一种量化描述
- 控制: 类 A 调用了 类 B 和 类 C ,称　类 A 控制着　类 B 类 C
- 假如 A 类里面，需要使用到 B 类的对象帮助其实现功能，那么 A 是依赖 B 的，这是一种紧耦合

```php
class Page{
    // 展示页面
    function index(){
        if(男性){
            $strategy = new ManUserStrategy();
        }else{
            $strategy = new WomenUserStrategy();
        }
        $strategy -> showAd();
        $strategy -> showCategory();
    }
}
// Page 需要使用到 ManUserStrategy/WomenUserStrategy 帮助其实现功能
// 所以 Page 依赖于ManUserStrategy/WomenUserStrategy
$page = new Page();
$page -> index();
```

但是我们通过约定接口，传递符合接口的策略对象进入 Page 对象，那么 Page 类对于每个具体的策略没有依赖关系，只对约定的接口有依赖关系,这就解除 Page 对于 ManUserStrategy/WomenUserStrategy 的耦合关系了

```php
class Page{
    function index(UserStrategy $strategy){
        $strategy -> showAd();
        $strategy -> showCategory();
    }
}

// 判断使用哪一种策略
if(男性){
    $strategy = 'ManUserStrategy';
}else{
    $strategy = 'WomenUserStrategy';
}

// 在执行的过程中，判断出使用哪一种策略，将该策略传入需要使用该策略的对象，从而实现了该策略与对象的绑定
$page = new Page();
$page -> index(new $strategy());
```

## 数据对象　映射模式

将`对象`和`数据存储`映射起来，对一个`对象`的操作 会 映射为对`数据存储`的操作，最典型的实现是 ORM,对象的属性映射到数据库的字段，对属性的值的修改，会映射成数据库记录的修改，这样可以使 PHP 对数据库的操作的代码显得更加优雅

```php
class User{
    protected $db;
    public $id;
    public $name;
    public $mobile;
    public $regtime;
    function __construct($id){
        $this -> db = new Mysqli('127.0.0.1','root','root','test'); // 链接到数据库
        $res = $this -> db -> query("select * from test where id = $id"); // 获取 该id 的用户记录
        // 将查询出来的数据库 记录 映射为 对象的属性
        $this -> id = $res['id'];
        $this -> name = $res['name'];
        $this -> mobile = $res['mobile'];
        $this -> regtime = $res['regtime'];
    }
    function __destruct(){
		$sql = "update test set name = '{$this -> name}',mobile = '{$this -> mobile}',";
		$sql .= "regtime = '{$this -> regtime}' where id = '{$this -> id}'";
    }
}

$user = new User(25); // 初始化类的对象，获取了 id 为 25的用户的记录，并且映射成了对象
$user -> name = "codekissyoung"; // 修改对象属性的值
// 代码运行结束，__destruct 会自动运行，将对属性的修改 写回到数据库
```

## 依赖倒置原则（Dependence Inversion Principle, DIP）

DIP 　的核心思想是上层定义接口，下层实现这个接口， 从而使得下层依赖于上层，降低耦合度，提高整个系统的弹性。这是一种经实践证明的有效策略。

## 控制反转（Inversion of Control, IoC）

而 IoC 是一种实现 DIP 的方法。IoC 的核心是将类（上层）所依赖的单元（下层）的实例化过程交由第三方来实现。一个简单的特征，就是类中不对所依赖的单元有诸如 \$component = new yii\component\SomeClass（） 的实例化语句。

## 依赖注入（Dependence Injection, DI）

DI 是 IoC 的一种设计模式，是一种套路，按照 DI 的套路，就可以实现 IoC，就能符合 DIP 原则。 DI 的核心是把类所依赖的单元的实例化过程，放到类的外面去实现。

##　控制反转容器（IoC Container）

当项目比较大时，依赖关系可能会很复杂。 而 IoC Container 提供了动态地创建、注入依赖单元，映射依赖关系等功能，减少了许多代码量。 Yii 设计了一个 yii\di\Container 来实现了 DI Container。

## 服务定位器（Service Locator）Service Locator

是 IoC 的另一种实现方式， 其核心是把所有可能用到的依赖单元交由 Service Locator 进行实例化和创建、配置， 把类对依赖单元的依赖，转换成类对 Service Locator 的依赖。 DI 与 Service Locator 并不冲突，两者可以结合使用。 目前，Yii2.0 把这 DI 和 Service Locator 这两个东西结合起来使用，或者说通过 DI 容器，实现了 Service Locator。

# 组合模式 Composite

- 组合比继承提供更多的灵活性
- 将一组对象组合为单个对象
- 对于客户端代码来说，组合内部是透明的

```php
class UnitException extends Exception {

}

abstract class Unit {
	function getComposite(){
		return null;
	}
	function addUnit ( Unit $unit ) {
		throw new UnitException( get_class( $this )." is a leaf ");
	}
	function removeUnit( Unit $unit ){
		throw new UnitException( get_class( $this )." is a leaf " );
	}
	abstract function bombardStrength();
}

abstract class CompositeUnit extends Unit {
	private $units = [];

	function getComposite(){
		return $this;
	}

	protected function units(){
		return $this -> units;
	}

	function removeUnit ( Unit $unit ) {
		$this -> units = array_udiff( $this -> units , array($unit) , function ($a ,$b){ return ($a === $b)?0:1;});
	}

	function addUnit( Unit $unit ){
		if( in_array($unit ,$this -> units,true) ){
			return;
		}
		$this -> units[] = $unit;
	}
}

// 射手
class Archer extends Unit {
	function bombardStrength() {
		return 4;
	}
}

// 激光炮
class LaserCannonUnit extends Unit {
	function bombardStrength(){
		return 44;
	}
}

// 军队 : 由军队 / 射手 / 激光炮组成
class Army extends Unit {
	private $units = [];
	private $armies = [];

	function addUnit( Unit $unit ){
		if( in_array( $unit , $this -> units , true ) ){
			return;
		}
		$this -> units[] = $unit;
	}

	function removeUnit( Unit $unit ){
		$this -> units = array_udiff( $this -> units , [$unit] , function($a,$b){ return ($a == $b) ? 0 : 1; } );
	}

	function addArmy (Army $army){
		array_push( $this -> armies , $army );
	}

	function bombardStrength(){
		$ret = 0;
		foreach( $this -> units as $unit ){
			$ret += $unit -> bombardStrength();
		}
		foreach( $this -> armies as $army){
			$ret += $army -> bombardStrength();
		}
		return $ret;
	}
}


// army 对象
$main_army = new Army();
$main_army -> addUnit( new Archer() );
$main_army -> addUnit( new LaserCannonUnit() );

// 另一个 army对象
$sub_army = new Army();
$sub_army -> addUnit( new Archer() );
$sub_army -> addUnit( new Archer() );
$sub_army -> addUnit( new Archer() );

// 将一部分军队加入到另一部分军队中
$main_army -> addArmy( $sub_army );
print "攻击强度: {$main_army -> bombardStrength() } \n";
```

# 装饰模式 Decorator

- 通过在运行时，合并对象来拓展功能的一种灵活机制

```php
<?php
abstract class Tile {
	abstract function getWealthFactor();
}

class Plains extends Tile {

	private $wealthfactor = 2;

	function getWealthFactor(){
		return $this -> wealthfactor;
	}
}

abstract class TileDecorator extends Tile {
	protected $tile;
	function __construct( Tile $tile ){
		$this -> tile = $tile;
	}
}

class DiamondDecorator extends TileDecorator{
	function getWealthFactor() {
		return $this -> tile -> getWealthFactor() + 2;
	}
}

class PollutionDecorator extends TileDecorator{
	function getWealthFactor(){
		return $this -> tile -> getWealthFactor() - 4;
	}
}

$tile = new Plains();
print $tile -> getWealthFactor(); // 2

$tile = new DiamondDecorator( new Plains() );
print $tile -> getWealthFactor(); // 4

$tile = new PollutionDecorator( new DiamondDecorator(new Plains()) );
print $tile -> getWealthFactor(); // 0
```

- 多个装饰器，犹如管道被串联起来

```php
<?php
class RequestHelper{}

abstract class ProcessRequest {
	abstract function process( RequestHelper $req );
}

class MainProcess extends ProcessRequest {
	function process( RequestHelper $req ){
		print __CLASS__." : doing something userful with request ! \n";
	}
}

abstract class DecorateProcess extends ProcessRequest{
	protected $processrequest;
	function __construct( ProcessRequest $pr ){
		$this -> processrequest = $pr;
	}
}

class LogRequest extends DecorateProcess{
	function process ( RequestHelper $req ) {
		print __CLASS__." : logging data \n";
		$this -> processrequest -> process( $req );
	}
}

class AuthRequest extends DecorateProcess{

	function process ( RequestHelper $req ) {
		print __CLASS__." : authenticating data \n";
		$this -> processrequest -> process( $req );
	}
}

class StrucRequest extends DecorateProcess{
	function process ( RequestHelper $req ) {
		print __CLASS__." : struc request data \n";
		$this -> processrequest -> process( $req );
	}
}

$process = new AuthRequest( new StrucRequest( new LogRequest( new MainProcess() )) );
$process -> process( new RequestHelper() );
// AuthRequest : authenticating data
// StrucRequest : struc request data
// LogRequest : logging data
// MainProcess : doing something userful with request !
```

## 外观模式 Facade

- 为复杂多变的系统创建一个简单的接口
- 只是为一个分层或者一个子系统创建一个单一的入口，这样会带来许多好处，比如 有助于分离项目中的不同部分，其次对于客户端开发者来说，访问代码变得非常简洁
- 另外只在一个地方调用子系统，减少了出错的可能性

```php
<?php
// 测试文件 test_facade
// 234-ladies_jumper 55
// 532-gents_hat 44

function getProductFileLines($file){
	return file($file);
}

function getProductObjectFromId($id,$productname){
	return new Product($id,$productname);
}

function getNameFromLine($line){
	if(preg_match("/.*-(.*)\s\d+/",$line,$array)){
		return str_replace('_',' ',$array[1]);
	}
	return '';
}

function getIDFromLine($line){
	if(preg_match("/^(\d{1,3})-/",$line,$array)){
		return $array[1];
	}
	return -1;
}

class Product{
	public $id;
	public $name;
	function __construct($id,$name){
		$this -> id = $id;
		$this -> name = $name;
	}
}

// 外观模式封装
class ProductFacade{
	private $products = [];
	private $file;

	function __construct($file){
		$this -> file = $file;
		$this -> compile();
	}

	private function compile(){
		$lines = getProductFileLines($this -> file);
		foreach($lines as $line){
			$id = getIDFromLine($line);
			$name = getNameFromLine($line);
			$this -> products[$id] = getProductObjectFromID($id,$name);
		}
	}

	function getProducts(){
		return $this -> products;
	}

	function getProduct($id){
		return $this -> products[$id];
	}
}

$lines = getProductFileLines('test_facade');
$objects = [];
foreach($lines as $line){
	$id = getIDFromLine($line);
	$name = getNameFromLine($line);
	$objects[$id] = getProductObjectFromID($id,$name);
}
var_dump($objects);

// 使用外观模式
$facade = new ProductFacade("test_facade");
$product = $facade -> getProduct('234');
var_dump($product);
```

# Single 单例模式

- 该对象可以被系统中任何对象使用
- 该对象不会存储在全局变量中
- 系统中有且只有一个该对象

```php
<?php
class Preferences {
	private $props = [];
	private static $instance;

	private function __construct(){}

	public function setProperty ( $key , $val ) {
		$this -> props[$key] = $val;
	}

	public function getProperty( $key ){
		return $this -> props[$key];
	}

	public static function getInstance(){
		if( empty( self::$instance ) ){
			self::$instance = new self();
		}
		return self::$instance;
	}
}

$pref = Preferences :: getInstance();
$pref -> setProperty("name","codekissyoung");

unset($pref);
$pref2 = Preferences :: getInstance();
print $pref2 -> getProperty("name")."\n";
```

## Factory Method 工厂模式

- 抽象类高于实现
- 工厂模式就是为了解决，在抽象时，如何创建对象实例，答案就是用特定的类来处理实例化

```php
<?php
abstract class AppEncoder {/*{{{*/
	abstract function encode();
}/*}}}*/

class BloggsApptEncoder extends AppEncoder {/*{{{*/
	function encode(){
		return "Appointment data encoded in BloggsCal format \n";
	}
}/*}}}*/

class MegaApptEncoder extends AppEncoder {/*{{{*/
	function encode(){
		return "Appointment data encoded in MegaCal format \n";
	}
}/*}}}*/

// 对象工厂 用于按需求生产对象
class CommsManager {

	const BLOGGS = 1;
	const MEGA   = 2;
	private $mode = 1;

	function __construct( $mode ){
		$this -> mode = $mode;
	}

	function getHeaderText() {
		switch( $this -> mode ){
			case ( self::MEGA ):
				return "MegaCal header \n";
				break;
			default:
				return "BloggsCal header \n";
				break;
		}
	}

	function getApptEncoder(){
		switch( $this -> mode ){
			case (self::MEGA):
				return new MegaApptEncoder();
				break;
			default:
				return new BloggsApptEncoder();
				break;
		}
	}
}

$comms = new CommsManager( CommsManager::MEGA );
$appEncoder = $comms -> getApptEncoder();
print $comms -> getHeaderText();
print $appEncoder -> encode();
```

- 缺点 : 工厂里面有很多条件语句，如果我们加入新协议，就又要加条件，如果要加入新方法，比如`getFooterText()`,又要每个可能生成的对象写一遍条件

```php
<?php
abstract class AppEncoder {/*{{{*/
	abstract function encode();
}/*}}}*/

class BloggsApptEncoder extends AppEncoder {/*{{{*/
	function encode(){
		return "Appointment data encoded in BloggsCal format \n";
	}
}/*}}}*/

class MegaApptEncoder extends AppEncoder {/*{{{*/
	function encode(){
		return "Appointment data encoded in MegaCal format \n";
	}
}/*}}}*/

// 对抽象工厂使用多态
abstract class CommsManager {/*{{{*/
	abstract function getHeaderText();
	abstract function getApptEncoder();
	abstract function getFooterText();
}/*}}}*/

class BloggsCommsManager extends CommsManager {
	function getHeaderText(){
		return "BloggsCal Header";
	}
	function getApptEncoder(){
		return new BloggsApptEncoder();
	}
	function getFooterText(){
		return "BloggsCal Footer";
	}
}

$blog = BloggsCommsManager::getApptEncoder();
print $blog -> encode();

```

# Abstract Factory 抽象工厂模式

```php
<?php
abstract class CommsManager {
	const APPT = 1;
	const TTD = 2;
	const CONTACT = 3;

	abstract function getHeaderText();

//	abstract function getApptEncoder();
//	abstract function getTtdEncoder();
//	abstract function getContactEncoder();

	// 抽象工厂
	abstract function make( $type );
	abstract function getFooterText();

}

class BloggsCommsManager extends CommsManager {

	function getHeaderText(){
		return "BloggsCal header";
	}
/*
	function getApptEncoder(){
		return new BloggsApptEncoder();
	}

	function getTtdEncoder(){
		return new BloggsTtdEncoder();
	}

	function getContactEncoder(){
		return new BloggsContactEncoder();
	}

*/
	function make ( $type ) {
		switch($type){
			case self::APPT:
				return new BloggsApptEncoder();
				break;
			case self::TTD:
				return new BloggsTtdEncoder();
				break;
			case self::CONTACT:
				return new BloggsContactEncoder();
				break;
		}
	}

	function getFooterText(){
		return "BloggsCal footer \n";
	}
}
```

# Prototype 原型模式

```php
<?php
class Sea{
	private $navigability = 0;
	function __construct( $navigability ){
		$this -> navigability = $navigability;
	}

}
class EarthSea extends Sea {}
class MarsSea extends Sea {}

class Plains {}
class EarthPlains extends Plains{}
class MarsPlains extends Plains{}

class Forest{}
class EarthForest extends Forest {}
class MarsForest extends Forest {}

class TerrainFactory {

	private $sea;
	private $forest;
	private $plains;

	function __construct(Sea $sea , Plains $plains ,Forest $forest){
		$this -> sea = $sea;
		$this -> plains = $plains;
		$this -> forest = $forest;
	}

	function getSea(){
		return clone $this -> sea;
	}

	function getPlains(){
		return clone $this -> plains;
	}

	function getForest() {
		return clone $this -> forest;
	}

}

$factory = new TerrainFactory( new EarthSea( -1 ) ,new EarthPlains() ,new EarthForest() );
print_r( $factory -> getSea() );
print_r( $factory -> getPlains() );
print_r( $factory -> getForest() );

```

# 深复制 和 浅复制

```php
<?php
class Contained{}

// 浅复制 : $obj_copy = clone $object; 假如被复制对象里面有属性也是对象，也只是复制该属性，也就是一个引用，而不会复制对象本身
// 深复制 : 通过 __clone 魔术方法，指定在clone的时候，将对象内的对象也一并复制

class Container {
	public $con;
	function __construct(){
		$this -> con = new Contained();
	}
	// 深复制
	function __clone(){
		$this -> con = clone $this -> contained;
	}
}
```
