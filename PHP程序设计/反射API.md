# 各种有用的反射类

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

- 这些反射类可以在运行时访问对象、函数和脚本中的扩展信息

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

#### PHP 是动态实时解析的语言

```php
function test() {
	echo "i am function test!";
}

$a 		= "test";
$test 	= "i am the test";

echo $a; 	// test
echo $$a; 	// i am the test
$a(); 		// i am function test!

foreach ($_POST as $key => $value)
{
	$$key = $value; // 将　assoc 　数组拆解成变量
}

//example.com?class=person&func=run  动态 new 对象和调用函数
$class = $_GET['class'];
$func  = $_GET['func'];
$obj   = new $class();
$obj -> $func();
```