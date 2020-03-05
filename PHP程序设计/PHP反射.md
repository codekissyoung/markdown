# 反射

`PHP`的反射类。

![](https://img.codekissyoung.com/2020/03/03/99726caed3d4ec64c5777047e0fedc40.png)

## Reflection

```php

class Person
{
    public $name;
    public $gender;
    public function say(){
        echo $this->name, " is ", $this->gender, PHP_EOL;
    }

    public function __set( $name, $value ){
        echo "Setting $name to $value" , PHP_EOL;
        $this -> $name = $value;
    }

    public function __get( $name ) {
        if ( !isset($this->$name) ){
            echo "未设置";
            $this -> $name = "默认值";
        }
        return $this->$name;
    }

    public function __call($name, $args){
        echo $name, " called ", PHP_EOL;
    }
}
```

```php
$s = new Person();
$s -> name = 'Link';
$s -> gender = 'male';
$s -> age = 24;

$reflect = new ReflectionObject($s);
var_dump( $reflect -> getProperties() );
var_dump( $reflect -> getMethods() );
var_dump(get_object_vars($s));
var_dump(get_class_vars(get_class($s)));
var_dump(get_class_methods(get_class($s)));

$obj = new ReflectionClass('Person');
print_r( $obj -> getName() );
print_r( $obj -> getProperties() );
print_r( $obj -> getMethods() );
```

使用反射实现动态代理：

```php
class mysql {
    function connect( $db ) {
        echo "connect to db[0]", PHP_EOL;
    }
}
class sqlproxy {
    private $target;
    function __construct($tar){
        $this -> target[] = new $tar();
    }
    function __call($name, $args){
        foreach ($this -> target as $obj) {
            $r = new ReflectionClass($obj);
            if( $method = $r -> getMethod($name) ){
                if( $method -> isPublic() && !$method->isAbstract()) {
                    echo "before invoke ...", PHP_EOL;
                    $method->invoke($obj,$args);
                    echo "after invoke ...", PHP_EOL;
                }
            }
        }
    }
}
$obj = new sqlproxy('mysql');
$obj -> connect('member');
```

## PHP 提供的反射类的相关知识

```php
Reflection          为类的摘要信息提供静态函数
ReflectionClass     类信息和工具
ReflectionMethod    提供类方法信息
ReflectionParameter 提供方法的参数信息
ReflectionProperty  类属性信息
ReflectionFunction  函数信息和工具
ReflectionExtension PHP扩展信息
ReflectionException 错误类
```

这些反射类可以在运行时访问对象、函数和脚本中的扩展信息

```php
<?php
interface Module {
	function execute();
}

class Person{
	public $name;
	function __construct($name){
		$this -> name = $name;
	}
}

class FtpModule implements Module {
	function setHost( $host ){
		print "Ftpmodule::setHost() : $host \n";
	}

	function setUser( $user ){
		print "FtpModule::setUser() : $user \n";
	}

	function execute(){
		// do something
	}
}

class PersonModule implements Module {
	function setPerson( Person $person){
		print "PersonModule::setPerson(): {$person -> name} \n";
	}

	function execute(){
		// do something
	}
}

class ModuleRunner {
	private $configData = [
		'PersonModule' => ['person'=>'bob'],
		'FtpModule' => ['host'=>'example.com','user'=>'anon']
	];

	private $modules = [];

	function init(){
		$interface = new ReflectionClass('Module');
		var_dump($interface);
		foreach ( $this -> configData as $modulename => $params ){
			$module_class = new ReflectionClass( $modulename );

			if( ! $module_class -> isSubclassOf($interface)){
				throw new Exception("Unkown module type : $modulename");
			}

			$module = $module_class -> newInstance();
			foreach( $module_class -> getMethods() as $method ) {
				$this -> handleMethod($module , $method , $params);
			}
			array_push($this -> modules,$module);
		}
	}

	function handleMethod(Module $module , ReflectionMethod $method,$params ){
		$name = $method -> getName();
		$args = $method -> getParameters();

		if(count($args) != 1 || substr($name,0,3) != 'set'){
			return false;
		}

		$property = strtolower(substr($name,3));

		if(!isset($params[$property])){
			return false;
		}

		$arg_class = $args[0] -> getClass();

		if(empty($arg_class)){
			$method -> invoke($module , $params[$property]);
		}else{
			$method -> invoke($module , $arg_class -> newInstance($params[$property]));
		}
	}
}

$test = new ModuleRunner();
$test -> init();
```

### 类反射

为了在不看类内部实现的情况下，深入了解一个类！

```php
class A{
    const A = 'i am const A';
    private $a = "aaa";
    public function hehe(){
        echo "heheh";
    }
}
$prod_class = new ReflectionClass('A');
Reflection::export($prod_class);
```
