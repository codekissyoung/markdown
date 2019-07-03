# Composer

本文是`PHP`包管理器`composer`的笔记。

参考:

- [composer官网](https://getcomposer.org)

- [composer中文网](http://www.phpcomposer.com)

- [阿里云 Composer 全量镜像](https://mirrors.aliyun.com/composer/index.html)

## 安装以及配置源

1. 照着里面文档,先运行脚本下载安装

```shell
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
```

2. 变成全局安装

```shell
sudo mv composer.phar /usr/local/bin/composer
```

3. 修改安装源

```shell
composer config -g repo.packagist composer https://packagist.phpcomposer.com
```

4. 经常更新 保持最新版

```shell
composer selfupdate
```

## 使用

### 初始化一个空的composer项目

```shell
composer init
```

### 修改composer.json文件,添加require依赖

```shell
{
    "name": "wx/wx",
    "description": "a composer package for wx",
    "authors": [
        {
            "name": "caokaiyan",
            "email": "cky951010@163.com"
        }
    ],
    "require": {
		"monolog/monolog": "1.0.*"
	}
}
```

### 安装依赖 生成vendor/autoload.php自动加载文件

```shell
composer install
```

### 在项目开头引用composer自动加载

```php
require_once ./vendor/autolod.php

$log = new Monolog\Logger('name');
$log->pushHandler(new Monolog\Handler\StreamHandler('app.log', Monolog\Logger::WARNING));
$log->addWarning('Foo');
```
