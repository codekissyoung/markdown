# 安装拓展一般步骤
```shell
$ sudo apt-get install autoconf
$ phpize
$ ./configure --with-php-config=/usr/bin/php-config
$ sudo make && make install
# 修改对应的 php.ini 文件
```
- `extension_dir` 配置会在PHP编译安装时写入默认值,通过`phpinfo`可以搜索它的实际值
- 安装之前先配置好`autoconf`
- `--with-php-config`配置选项是为了`make install`命令能够正确的帮我们移动拓展`xxxx.so`到相应的php拓展目录,以及相关配置的书写,其中`php-config` 得看它实际的目录,而不是写死的 `/usr/local/php/bin/php-config`
