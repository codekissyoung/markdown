1. 先将__construct()设置为 private 这样就不允许在外部 new 了
2. 在类的内部实例化一个对象。外部可以得到就行
```
class Mem extends Memcache{
   private static $mem_instance = null;
   private function __construct(){
       parent::__construct();
   }
   private function __clone(){}
   public static function get_mem_ins(){
       if(null === self::$mem_instance){
           self::$mem_instance = new Memcache;
       }
       return self::$mem_instance;
   }
}
```
3. memcache 操作
```
<?php
   //连接
   $mem = new Memcache;
   $mem->connect("db.nowamagic.net", 12000);
   //保存数据
   $mem->set('key1', 'This is first value', 0, 60);
   $val = $mem->get('key1');
   echo "Get key1 value: " . $val ."<br />";
   //替换数据
   $mem->replace('key1', 'This is replace value', 0, 60);
   $val = $mem->get('key1');
   echo "Get key1 value: " . $val . "<br />";
   //保存数组
   $arr = array('aaa', 'bbb', 'ccc', 'ddd');
   $mem->set('key2', $arr, 0, 60);
   $val2 = $mem->get('key2');
   echo "Get key2 value: ";
   print_r($val2);
   echo "<br />";
   //删除数据
   $mem->delete('key1');
   $val = $mem->get('key1');
   echo "Get key1 value: " . $val . "<br />";
   //清除所有数据
   $mem->flush();
   $val2 = $mem->get('key2');
   echo "Get key2 value: ";
   print_r($val2);
   echo "<br />";
   //关闭连接
   $mem->close();
?>
```
4. 输出
```
Get key1 value: This is first value
Get key1 value: This is replace value
Get key2 value: Array ( [0] => aaa [1] => bbb [2] => ccc [3] => ddd )
Get key1 value:
Get key2 value:
```

