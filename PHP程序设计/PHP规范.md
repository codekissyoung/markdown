# PHP 规范

[PHP PSR 标准规范](https://learnku.com/docs/psr) 合集，是一个比较好的中文翻译版本。

## PSR-0 废弃 参考 PSR-4

## PSR-1 基本规范

类名：大写开头 驼峰 StudlyCaps 
常量：所有字母大写 `_` 分割
方法：小写字母开头 驼峰 camelCase

## PSR-2 代码风格规范

一份很详细的代码风格规范，建议使用格式化工具，不用刻意去记忆。

## PSR-3 日志接口规范

## PSR-4 自动加载规范

```php
// 执行 new \Foo\Bar\Baz\Qux; 
// 会自动 require /path/to/project/src/Baz/Qux.php
spl_autoload_register(function ($class) {
    $prefix = 'Foo\\Bar\\';
    $base_dir = __DIR__ . '/src/'; // base directory for the namespace prefix

    // 是本注册函数自动加载的类么？ 不是 则跳过，尝试下一个注册函数
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        // no, move to the next registered autoloader
        return;
    }
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    if (file_exists($file)) {
        require $file;
    }
});
```

## PSR-6 缓存接口规范

## PSR-7 HTTP 消息接口规范

## PSR-11 容器接口规范

## PSR-12

## PSR-14 事件分发器

## PSR-15 HTTP 请求处理器

## PSR-16 缓存接口

## PSR-17 HTTP 工厂

## PSR-18 HTTP 客户端
