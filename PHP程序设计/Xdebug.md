# Xdebug



```bash
$ pecl install xdebug
$ php -v
PHP 7.4.3 (cli) (built: Oct  6 2020 15:47:56) ( NTS )
Copyright (c) The PHP Group
Zend Engine v3.4.0, Copyright (c) Zend Technologies
    with Zend OPcache v7.4.3, Copyright (c), by Zend Technologies
    with Xdebug v2.9.8, Copyright (c) 2002-2020, by Derick Rethans
```



```bash
zend_extension=opcache.so # 启用 opcache 拓展
zend_extension=xdebug.so  # 启用 xdebug 拓展
```



```php
echo php_ini_loaded_file();
echo php_ini_scanned_files();
```

