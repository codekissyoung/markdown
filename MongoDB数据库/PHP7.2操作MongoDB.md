# PHP7.2操作MongoDB

## 安装PHP7.2的MongoDB拓展

## 增删改查

```php
<?php
$manager = new MongoDB\Driver\Manager("mongodb://localhost:12345");
$bulk    = new MongoDB\Driver\BulkWrite;

// 插入
$bulk->insert(['x' => 1, 'name'=>'菜鸟教程', 'url' => 'http://www.runoob.com']);
$bulk->insert(['x' => 2, 'name'=>'Google', 'url' => 'http://www.google.com']);
$bulk->insert(['x' => 3, 'name'=>'taobao', 'url' => 'http://www.taobao.com']);

$writeConcern = new MongoDB\Driver\WriteConcern( MongoDB\Driver\WriteConcern::MAJORITY, 1000 );
$result = $manager->executeBulkWrite("runoob.sites", $bulk, $writeConcern);

// 查询
$filter = ['x'=>['$gt'=>1]];
$options = [
    'projection' => ['_id'=>0],
    'sort'=>['x'=>-1]
];
$query = new MongoDB\Driver\Query($filter,$options);
$cursor = $manager->executeQuery("runoob.sites",$query);
foreach( $cursor as $document )
{
    print_r($document);
}

// 更新
$bulk    = new MongoDB\Driver\BulkWrite;
$bulk->update(
    ['x'=>2],
    ['$set'=>['name'=>'工具','url'=>'tool.runoob.com']],
    ['multi'=>false,'upsert'=>false]
);

$result = $manager->executeBulkWrite('runoob.sites',$bulk,$writeConcern);

// 删除
$bulk    = new MongoDB\Driver\BulkWrite;
$bulk->delete(['x'=>3],['limit'=>0]); // 删除所有匹配数据
$result = $manager->executeBulkWrite('runoob.sites',$bulk,$writeConcern);
```