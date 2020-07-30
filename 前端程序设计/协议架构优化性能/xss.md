# HTML ENCODE

- 将 HTML 标签里的 中括号 ，单引号，引号 之类的特殊字符进行实体字符转换编码

```php
fString = replace(fString, ">", "&gt;")
fString = replace(fString, "<", "&lt;")
fString = Replace(fString, CHR(32), "&nbsp;")
fString = Replace(fString, CHR(34), "&quot;")
```

## URL ENCODE

- URL 编码是为了符合 url 的规范。因为在标准的 url 规范中中文和很多的字符是不允许出现在 url 中的。例如在 baidu 中搜索 测试汉字 。 URL 会变成`http://www.baidu.com/s?wd=%B2%E2%CA%D4%BA%BA%D7%D6&rsv_bp=0&rsv_spt=3&inputT=7477`
- 所谓 URL 编码就是：　把所有非字母数字字符都将被替换成百分号（%）后跟两位十六进制数，空格则编码为加号（+）



[跨域](https://mp.weixin.qq.com/s?__biz=MzU0OTExNzYwNg==&mid=2247483685&idx=1&sn=543e9736146405e9e5b37ec5a1c4b448&chksm=fbb58aecccc203faa4517d77e3f0f723896d2cd5c3ddba2c360b0f0a03f0dc873a1df552d563&scene=0&key=72da87db120ba9cf61099ab1aa1018a958a343b288aa45db018dfe9121cff1879fabc215189a94b80df3231def1863854c558191cee62b44b7723f16099866bb8c3922d77f3430599807dfa31f570e9f&ascene=0&uin=MjIxODIxNjA0MA%3D%3D&devicetype=iMac+MacBookPro12%2C1+OSX+OSX+10.11.6+build(15G1004)&version=12010110&nettype=WIFI&fontScale=100&pass_ticket=yNbtn1PSEE2%2B4fxr6HsvYzix%2F29VqEk%2FSw%2BUz7LY0%2FJn75cfBnENdWcok3S%2FcXRr)





