# database

`$sql = 'select * from user where id =:id';` 使用占位符的sql语句

`User::findBySql($sql,array(":id"=>$id))->all()` 通过sql语句查询 ,访问结果为[对象,对象]

`User::find()->where(['id'=>1])->all();` 查询 id = 1 的记录

`User::find()->where(['>','id',0])->asArray()->all();` 查询 id > 0 的记录,查询结果转化为数组

`User::find()->where(['between','id',1,3])->all();` 查询 1 和 3 之间的

`User::find()->where(['like','title','abc'])->all();` title  like  '%abc%' ，百分号自动加上

where 更多表达： `yii/db/Query :: where()` 方法 查询文档！


批量查询
要处理1000条数据，一下子拿1000条数据入内存太不可取了，使用批量查询，每次只拿100条依次处理，拿完为止，这是有效降低内存使用的方法！每次拿100条存入临时变量tests中处理,处理tests;
```
foreach(User::find()->batch(100) as $tests){
    print_r(count($tests));
}
```

新增一条记录
```
$user = new User();
$user->name="caokaiyan";
$user->save();
```
修改数据
查出一条记录,修改属性值后再save就是修改
```
$user = User::find()->where(['id'=>4])->one();
$user->name="caokaiyan";
$user->save();
```
删除数据
```
$res = User::find()->where(['>','id',1])->all();
$res[0]->delete(); 删除查询出来的第一条数据
User::deleteAll('id>:id',[":id"=>0]); 删除id>0的所有数据
```
核心验证器
在User.php中,用于在插入数据前检验数据的合法性(参考权威指南里核心验证器的用法),在`$user->save();`之前,使用`$user->validate();`进行验证,通过`$user->hasErrors();`拿到验证结果
```
public function rules(){
    return [[['name'],'required'],];
}
```

# 视图
控制器中调用视图
`$this->render('view',['id'=>10]);`

render函数将视图文件中的内容输出存为一个$content变量,再放置到布局文件中,最后加载那个布局文件,在布局文件中可以看到`<?=$content?>`

控制器具中指定布局文件
`public $layout = 'main'`

在视图文件中
`$this`为`yii\web\View`实例,这是在视图中加载另一个视图
`$this->render('about',['id'=>$id]);`

视图文件中定义数据块
`<?php $this->beginBlock('block1');?> //数据块内容 <?php $this->endBlock();`

在布局文件中使用数据块
`<?=$this->blocks['block1'];?>`


转义输出,防止跨站脚本
```
use yii\helpers\Html;
echo Html::encode($id);
```

过滤掉js代码
```
use yii\helpers\HtmlPurifier;
<h1><?=HtmlPurifier::process($str_hello);?>
```
