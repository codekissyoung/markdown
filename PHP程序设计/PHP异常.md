# 异常处理流程

```php
class My_Exception extends Exception {
    function getInfo() {
        return '自定义错误信息';
    }
}
```

```php
try{
    // 业务代码 1
    if(...){
        throw new My_Exception ("异常提示-数字必须小于等于1");
    }
    // 业务代码 2
    if(...){
        throw new Exception("Error Processing Request", 1);
    }
} catch(My_Exception $e){
    //对异常处理，方法：
    //1、自己处理
    //2、不处理，将其再次抛出
} catch(Exception $e){
    // 处理 Exception 异常 ，获取自定义的异常信息，获取继承自基类的getMessage信息
    // 通过我们需要将报错的文件名、行号、错误信息、异常追踪信息等记录到日志中，以便调试与修复问题。
    echo '捕获异常: ' .$e->getMessage() ，$e->getInfo()，$e->getMessage();
    $msg = 'Error:'.$ex->getMessage()."\n";
    $msg.= $ex->getTraceAsString()."\n";
    $msg.= '异常行号：'.$ex->getLine()."\n";
    $msg.= '所在文件：'.$ex->getFile()."\n";
    //将异常信息记录到日志中
    file_put_contents('error.log', $msg);
}
```

## Exception 类

```php
message 异常消息内容
code 异常代码
file 抛出异常的文件名
line 抛出异常在该文件的行数
getTrace() 获取异常追踪信息
getTraceAsString() 获取异常追踪信息的字符串
getMessage() 获取出错信息
```

错误的异常使用方式：

```php
// PHP Warning:  Division by zero in
$a = null;
try {
    $a = 5 / 0;
    echo $a, PHP_EOL;
}catch (\throwable $e){
    $e -> getMessage();
    $a = -1;
}
echo $a;
```

正确的异常使用方式:

```php
class emailException extends exception { }
class pwdException extends exception{
    function __toString(){
        return "Exception: {$this->getCode()} : {$this->getMessage()} in ";
    }
}

function reg( $reginfo = null ){
    if(!isset($reginfo) || empty($reginfo)){
        throw new Exception("参数非法");
    }
    if(empty($reginfo['email'])){
        throw new emailException("邮件为空");
    }
    if($reginfo['pwd'] != $reginfo['repwd']){
        throw new pwdException('两次密码不一致');
    }
    echo '注册成功';
}
try{
    reg(['email'=>'1162097842@qq.com','pwd'=>'123456','repwd'=>'654321']);
}catch (emailException $ee){
    echo $ee->getMessage();
}catch (pwdException $ep){
    echo $ep ,'特殊处理', PHP_EOL;
}catch (Exception $e){
    echo $e->getTraceAsString();
    echo PHP_EOL, '其他情况, 统一处理';
}
```

```php
set_error_handler(function ($errno, $errstr, $errfile, $errline){
    throw new \Exception( "{$errfile} line: {$errline} {$errstr} {$errno}". PHP_EOL );
}, E_ALL | E_STRICT );

set_exception_handler(function (\Exception $e){
    echo $e -> getCode();
    var_dump( $e -> getTrace() );

});

register_shutdown_function(function (){
    print_r( error_get_last() );
});

try {
//    $a = 5 / 0;
    $a = [];
    echo $a['abcd'];
}catch (\Exception $e){
    echo $e->getMessage();
} finally {
    echo "finally done", PHP_EOL;
}
```
