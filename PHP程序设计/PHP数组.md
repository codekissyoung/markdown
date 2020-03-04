# PHP 数组

本文是 PHP 数组的笔记。

## 数组是什么

##

## 添加元素

```php
$arr[]         = "caokaiyan"; // 键为数字键
$arr['xuehao'] = 1001121213;  // 指定键
array_push(  $arr , $var );
$fruits['red'][] = 'strawberry';
```

## 剔除元素

```php
unset($arr['xuehao']);              // 删除指定元素
$var = array_pop( $arr );           // 弹出最后一个元素
$arr2 = array_unique( $arr );     // 按值去重
```

## 访问数组元素

```php
// 遍历，$value 为副本
foreach( $arr as $key => $value ){
    echo '键 :'.$key.'值：'.$value;
}
// 遍历，$value 为引用
foreach ($arr as &$value) {
    $value = $value * 2;
}
unset($value); // 最后取消掉引用

// 过滤元素
array_filter( $ar, function($v){
    return $v !== null;
} );
```

## 数组之间的操作

```php
array_merge( $arr1, $arr2 ); // 合并两个数组，健相同的情况，保留 $arr2 中元素
```

## 其他操作

```php
echo count( $arr, COUNT_RECURSIVE ); // 计数，COUNT_RECURSIVE 表示递归多维数组
array_key_exists( 'key',  $arr  );   // 键存在
in_array( 'value',  $arr  );         // 值存在
ksort( $arr );                       // 按 key 排序
join( ',', $arr );                   // 以 , 链接成字符串
implode( '-', ['a','b','c'] );       // 以 - 链接成字符串

// 将关联数组，根据键名 拆成 变量，有重名的变量名加上 'ex' 前缀
extract( $var_array, EXTR_PREFIX_SAME, "ex");

// list构造器　将数组里面的值分别指定给单独变量
list( $b, $c, $d ) =  ['apple','orange','card'];
echo $b,$c,$d; // apple orange card
```

将`url`的查询字符串解析成数组

```php
$str = "first=value&arr[]=foo+bar&arr[]=baz";
parse_str($str, $output);
echo $output['first'];  // value
echo $output['arr'][0]; // foo bar
echo $output['arr'][1]; // baz
```
