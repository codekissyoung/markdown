# 延迟加载 Lazy loading
`spl_autoload_register(['Yii','autoload'],true,true)` 自动加载
## 类的映射表
`\Yii::$classMap['common\models\Order'] = '~\filmfest\common\models\Order.php'` 自动加载时，直接在classMap里看下是否能直接找到该类对应的文件，能的话直接include进来，省去根据类名解析路径的时间！
## 组件缓存
组件时先注册到`Yii::$app`中的，只有在控制器中实际使用的时候才会实例化，并且缓存起来，

# 缓存
## 数据缓存
缓存在文件系统中，缓存在内存中(memcache中)，
```
//获取缓存组件
$cache = \Yii::$app->cache;
// 存缓存
$cache -> add('key1','hello world',15); // 缓存15s
// 读缓存
$data = $cache->get('key1');
// 修改缓存
$data = $cache->set('key1','update',15); // 有效期15s
// 删除数据
$cache->delete('key1');
// 清空数据
$cache->flush();
```
## 缓存依赖
```
$cache = Yii::$app->cache;
// 文件依赖，文件发生了变化，缓存失效
$dependency = new \yii\caching\Filedependency(['fileName'=>'hehe']);
$cache->add('file_key','hello world',3000,$dependency);
var_dump($cache->get('file_key'));

// 表达式依赖，表达式执行后的值发生改变，缓存失效
$dependency = new \Yii\caching\ExpressionDependency(
    ['expression'=>'\Yii::$app->request->get('name')']
);
$cache->add('expression_key','hello world',3000,$dependency);
var_dump($cache->get('expression_key'));

// 数据库依赖,数据库查询的结果发生变化，缓存失效
$dependency = new \Yii\caching\Dbdependency(
    ['sql'=>'select count(*) from yii.order']
);
$cache->add('db_key','hello world',3000,$dependeny);
var_dump($cache->get('db_key'));
```
## 片段缓存
被缓存的片段不会执行里面的php解析，而是会直接到缓存里面取内容
```
<?php if($this->beginCache('cache_div')): ?>
    <div id="cache_div">这里被缓存</div>
    <?php $this->end_Cache(); ?>
<?php endif();
```
## 页面缓存
```
// behaviors 方法先于action方法执行
public function behaviors(){
    return [
        [
            'class' => 'yii\filters\PageCache',    // 使用页面缓存
            'duration' => 1000,
            'only' => ['index'],  // 只缓存index页面
            'dependency' => [     // 使用文件依赖
                'class' => 'yii\caching\FileDependency',
                'fileName' => 'hw.txt',
            ]
        ]
    ];
}

public function actionIndex(){
    $data = 'aaa';
    return $this->render('index',['data'=>$data]);
}
public function actionTest(){
    $data = 'bbb';
    return $this->render('test',['data'=>$data]);
}
```
### http 缓存
用户猛刷新浏览器时，实际上请求的数据都是一样的,将第一次数据缓存在浏览器里面，后面的请求来了后，服务器判断下请求数据是否发生变化，没有变化直接告诉浏览使用自己的缓存(使用304)，
last-modified:
etag
```
public function behaviors(){
    return [
        [
            'class' => 'yii\filters\HttpCache',// 使用http缓存，原理是在返回给浏览器上的报文上写上相关信息：Cache-controller:public,max-age=3600,告诉浏览器缓存数据
            'lastmodified' => function(){
                return 1432817566; // unix时间戳
             }，
            'etagSeed' => function(){
                return 'etagseed2';
            }
        ]
    ];
}
```
服务器如何判断浏览器缓存的数据和服务器的数据是否一致呢？
通过比对`last-Modified`,

# Gii
