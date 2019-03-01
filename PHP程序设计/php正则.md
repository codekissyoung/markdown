# 变量名约定

`$pattern` 正则表达式

`$subject` 要匹配的字符目标

```
function show($var){
    if(empty($var)){
    }
    if(is_array($var)||is_object()){
    }
}

```

#函数

匹配函数

`preg_match($pattern,$subject,[array &$matches]);` 只匹配一次,匹配结果放置到$matchs数组中,返回匹配到的次数[0,1]

`preg_match_all($pattern,$subject,array &matches);`匹配所有,匹配结果放置到$matchs数组中,[0,1,2...]

`preg_replace($pattern,$replacement,$subject);`

`preg_filter($pattern,$replacement,$subject);`

`preg_grep($pattern,array $input);`

`preg_split($pattern,$subject);`

`preg_quote($str);`

* http://regexpal.com/ 调试正则表达式工具

#概念

原子：单个unicode字符

可见原子：" _ ? 汉字 符号等

不可见原子：\n ,\r ,\t , 空格 , 其他不可见符号

将特殊字符（包括汉字）转换为 Unicode 再进行匹配



->正则表达式运算符（$^\+等）要匹配它们的字符，要用 \ 转义

如 \$ 匹配 $ , \\ 匹配 \

->不可见原子的匹配

\ \ 匹配空格

\t 匹配制表符

\n 匹配换行


下面的例子会将D|d作为一个原子，再和uang~链接，再进行匹配

下面是懒惰匹配,在/后面加U，不加就是贪婪匹配

懒惰模式匹配的结果：imooc__123

贪婪模式：imooc__123123123123123123
