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

```php
$mysqli = new mysqli( "ip", "user_name", "password", "db_name");

$mysqli->query("CREATE TEMPORARY TABLE myCity LIKE City");
$city = "'s ' \r \n ; \0 \ , \ \x1a Hertogenbosch";

$sql = "INSERT into myCity (Name) VALUES ('$city')";
if (!$mysqli->query($sql)) // this query will fail, cause we didn't escape $city
    printf("Error: %s\n", $mysqli->sqlstate);

// 转义后再执行
$city = $mysqli -> real_escape_string($city);
$sql = "INSERT into myCity (Name) VALUES ('$city')";
if ($mysqli->query($sql))
    printf("%d Row inserted.\n", $mysqli->affected_rows);

$mysqli->close();
```