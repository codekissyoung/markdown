# 异常处理流程

```php
<?php
class My_Exception extends Exception {
    function getInfo() {
        return '自定义错误信息';
    }
}

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
    // 处理 Exception 异常
    echo '捕获异常: ' .$e->getMessage();
    echo $e->getInfo();//获取自定义的异常信息
    echo $e->getMessage();//获取继承自基类的getMessage信息
    // 我们通常会获取足够多的异常信息，然后写入到错误日志中。
    // 通过我们需要将报错的文件名、行号、错误信息、异常追踪信息等记录到日志中，以便调试与修复问题。
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
