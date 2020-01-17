# 如何调试和分析PHP代码

```php
get_declared_classes();             // 获取当前所有已定义的类
get_class_methods($class_name);     // 获取一个类中所有的方法名
get_class_vars($class_name);        // 获取一个类中的所有属性名
get_parent_class($sub_obj);         // 获取一个类的父类
is_subclass_of($sub_obj,'Parent_class'); // 检查是否是一个类的子类
class_implements($obj); // 获取该对象实现的所有接口
call_user_func( 'myFunction' );                 // 等价 myFunction();
call_user_func( [$myObj,'method_name'], 20);    // 等价于 $myObj -> method_name(20);
call_user_func_array( [$obj,'method'], $args ); // 等价于 $obj -> method($args); $args 是数组

$obj instanceof interface_name ; // 判断 $obj 是否实现了某个接口

// 测试代码执行时间
$start_time = microtime();
//...执行的代码
$end_time = microtime();
$execute_time = $end_time - $start_time;

register_shutdown_function( ['core', 'handleShutdown'] );   // 正常/异常 退出时 调用
set_exception_handler( ['core', 'handleException'] );       // 设置异常处理函数
set_error_handler( ['core', 'handleError'] );               // 设置错误处理函数
```

```php
__LINE__            # 文件中的当前行号
__FILE__            # 文件的完整路径和文件名
__DIR__             # 文件所在的目录
__FUNCTION__        # 函数名称
__CLASS__           # 类的名称
__TRAIT__           # Trait 的名字
__METHOD__          # 类的方法名
__NAMESPACE__       # 当前命名空间的名称
```
