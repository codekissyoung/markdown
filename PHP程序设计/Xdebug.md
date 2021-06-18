# Xdebug

[Xdebug 中文文档](http://xdebug.org.cn/)

[Xdebug安装使用远程调试原理](https://segmentfault.com/a/1190000011332021)

## 安装

```bash
$ pecl install xdebug
$ php -v
PHP 7.4.3 (cli) (built: Oct  6 2020 15:47:56) ( NTS )
```

```bash
zend_extension=opcache.so # 启用 opcache 拓展
zend_extension=xdebug.so  # 启用 xdebug 拓展
```

```php
echo php_ini_loaded_file();   # 查看加载的 php.ini 位置
echo php_ini_scanned_files();
```

### 常用调试代码


```php
$name = "Link";
xdebug_debug_zval( 'name' ); // name: (refcount=1, is_ref=0) string 'Link' (length=4)
```

## PHPStorm Xdebug 远程调试

#### 1. Server 的 Xdebug 配置

```bash
xdebug.remote_enable=1
xdebug.remote_port=29325
xdebug.remote_autostart=0
xdebug.idekey=PHPSTORM
```

#### 2. PHP Storm Debug 配置

![](https://img.codekissyoung.com/2020/11/10/b9ebf9d951071468994e9bce9e633620.png)

#### 3. PHPStorm 调试监听 9001 端口

![](https://img.codekissyoung.com/2020/11/10/6c7f6f00d5c6a5d33b96ce64fd1689a1.png)

![](https://img.codekissyoung.com/2020/11/10/7a1c6512f5428aa4c9c5ccd24e88cc18.png)




#### 4. 配置Server文件夹映射

![](https://img.codekissyoung.com/2020/11/10/ff9f613e8f6d0f36526b3fea408ba9e2.png)

#### 5. 浏览器 Xdebug helper 拓展

[Xdebug helper 拓展](https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc)

![](https://img.codekissyoung.com/2020/11/10/0c2812190679a7ec9cc38291c628c209.png)


将 Xdebug Helper 切换到：

![](https://img.codekissyoung.com/2020/11/10/eb83da28241e5ba358a5a856d36fc56c.png)


#### 6. 开启远程端口映射

Server 的 Xdebug 检测到 `Xdebug Helper` 附加到 `Http` 请求里的 `XDEBUGSESSIONSTART=PHPSTORM` 信息，PHP的解析执行将被暂停．`XDebug` 将数据发往 29325 端口，经过ssh隧道，到达了 PHP Storm 监听的 9001 端口，触发了调试界面．

```bash
$ ssh -p36000 -NT -R 29325:localhost:9001 xuser@120.79.86.110 # 在 PHP Strom 所在机器执行
```

#### 7. 断点调试

在浏览器里访问 Web Server 的 index.php 文件，PHP Storm 打上断点，就能自动调出调试界面了：

![](https://img.codekissyoung.com/2020/11/10/8a26adf817d4c67eb215a69a2c081b59.png)









