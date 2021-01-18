# PHP 节点

在安装完`Nginx`或者`Apache2`后，总是需要安装`PHP`的基础支持软件。

## Composer

[Packagist / Composer 中国全量镜像](https://pkg.phpcomposer.com/) 按照这个，一步步安装好!

全局安装：

```bash
$ php -r "copy('https://install.phpcomposer.com/installer', 'composer-setup.php');"
$ php composer-setup.php
$ php -r "unlink('composer-setup.php');"
$ sudo mv composer.phar /usr/local/bin/composer
$ sudo composer selfupdate
$ composer config -g repo.packagist composer https://packagist.phpcomposer.com # 配置中国镜像
```

在`t1`目录下，创建一个`composer.json`文件

```json
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

然后执行：

```bash
$ composer install
```

就新建好了一个项目:

```bash
.
├── composer.json
├── composer.lock
├── index.php               # 自己手动添加
└── vendor
    ├── autoload.php
    ├── composer
    └── monolog
```

`index.php`内容如下：

```bash
<?php
require_once "vendor/autoload.php";

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\FirePHPHandler;

// 创建日志服务
$logger = new Logger('my_logger');

// 添加一些处理器
$logger->pushHandler(new StreamHandler( '/tmp/my_app.log', Logger::DEBUG));
$logger->pushHandler(new FirePHPHandler());

// 现在你就可以用日志服务了
$logger->info('My logger is now ready');
```

## 安装 Laravel 框架

```bash
$ sudo apt-get install php7.2-bcmath
$ sudo apt-get install php7.2-json
$ sudo apt-get install php7.2-mbstring
$ sudo apt-get install php7.2-zip
$ sudo apt-get install php7.2-xml
$ sudo systemctl restart php7.2-fpm.service
$ php -m                                        # 查看下依赖的库是否都安装齐全
$ composer global require laravel/installer     # 安装 laravel installer
```

```bash
# .bashrc
export PATH=.config/composer/vendor/bin:$PATH
```

`source .bashrc`后，创建一个新项目:

```bash
$ laravel new t1
```

给`nginx`修改下`root`为入口文件`index.php`的目录：

```bash
# /etc/nginx/sites-enabled/t1.cky.com.conf
root /home/link/t1/public;
```

```bash
link@phpServer:~/t1$ tree -L 1
.
├── app
├── artisan
├── bootstrap
├── composer.json
├── composer.lock
├── config
├── database
├── package.json
├── package-lock.json
├── phpunit.xml
├── public
├── README.md
├── resources
├── routes
├── server.php
├── storage             # 权限改为 777
├── tests
├── vendor
└── webpack.mix.js
```

![](https://img.codekissyoung.com/2020/01/15/13619d72fb58e1e71168e15d0841b4ee.png)

访问`http://t1.cky.com`看到上图，则安装成功!
