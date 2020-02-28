## HTML ENCODE

- 将HTML标签里的 中括号 ，单引号，引号 之类的特殊字符进行实体字符转换编码

```php
fString = replace(fString, ">", "&gt;")
fString = replace(fString, "<", "&lt;")
fString = Replace(fString, CHR(32), "&nbsp;")
fString = Replace(fString, CHR(34), "&quot;")
```

## URL ENCODE

- URL 编码是为了符合url的规范。因为在标准的url规范中中文和很多的字符是不允许出现在url中的。例如在baidu中搜索 测试汉字 。 URL会变成`http://www.baidu.com/s?wd=%B2%E2%CA%D4%BA%BA%D7%D6&rsv_bp=0&rsv_spt=3&inputT=7477`
- 所谓URL编码就是：　把所有非字母数字字符都将被替换成百分号（%）后跟两位十六进制数，空格则编码为加号（+）
