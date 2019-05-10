# SQL注入攻击与防御

本文是《SQL注入攻击与防御》一书的笔记。

## 第1章

```php
$query = "select * from products where price < '$_GET[val]' order by product_description";
```

当`$_GET['val'] = "100.00' OR '1' = '1";`时,构造的语句为`where price < '100.00' OR '1' = '1'`,这会将所有`product`数据查出来。

```php
$query = "select userid from cms_users where user = '$_GET[user]' and password = '$_GET[password]'";
```

当`$_GET['password'] = "xxx' or '1' = '1";`时,构造的语句为`and password = 'xxx' or '1' = '1'`,运行后返回为`true`,直接绕过登录验证了。