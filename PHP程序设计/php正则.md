# 变量名约定

# 函数

匹配函数

`preg_match($pattern,$subject,[array &$matches]);` 

只匹配一次,匹配结果放置到$matchs数组中,返回匹配到的次数

`preg_match_all($pattern,$subject,array &matches);` 

匹配所有,匹配结果放置到$matchs数组中,[0,1,2...]

`preg_replace( $pattern, $replacement, $subject);`

`preg_filter($pattern,$replacement,$subject);`

`preg_grep($pattern,array $input);`

`preg_split($pattern,$subject);`

`preg_quote($str);`
