[TOC]

## 1. 框架目录
```bash
├── Application # 个业务项目应用
├── index.php -> index_dev.php # 入口文件
├── static # 静态资源文件
├── Statistics # 数据统计
├── ThinkPHP # ThinkPHP 核心框架内部
├── xadmin # 管理后台
```

框架核心目录 :
```
├─ThinkPHP        框架系统目录（可以部署在非web目录下面）
│  ├─Common       核心公共函数目录
│  ├─Conf         核心配置目录 
│  ├─Lang         核心语言包目录
│  ├─Library      框架类库目录
│  │  ├─Think     核心Think类库包目录
│  │  ├─Behavior  行为类库目录
│  │  ├─Org       Org类库包目录
│  │  ├─Vendor    第三方类库目录
│  │  ├─ ...      更多类库目录
│  ├─Mode         框架应用模式目录
│  ├─Tpl          系统模板目录
```

Application 下业务应用目录有 :
```
Application
├─Common         公共模块（不能直接访问）
│  ├─Common      应用公共函数目录
│  └─Conf        应用公共配置文件目录(db配置,ES配置等)
├─Home           小雨伞主平台
│  ├─Conf        配置文件目录
│  ├─Common      公共函数目录
│  ├─Controller  控制器目录
│  ├─Model       模型目录
│  ├─Logic       逻辑目录(可选)
│  ├─Service     服务目录(可选)
│  └─View        模块视图文件目录
├─Runtime        运行时目录
│  ├─Cache       模版缓存目录
│  ├─Data        数据目录
│  ├─Logs        日志目录
│  └─Temp        缓存目录模块设计
├── Service # Swoole 后台服务
├── Tools # 工具和脚本
├── Admin  # 管理后台API
```


## 2. 框架配置文件

配置读取顺序如下：

```bash
# 模块共用
ThinkPHP/Conf/convention.php # 默认配置
Application/Common/Conf/config.php # 公共配置
Application/Common/Conf/config_$APP_MODE.php # 运行模式配置可选　默认为common，还有 sae api 模式可选
ThinkPHP/Conf/debug.php # 调试配置 可选
Application/Common/Conf/dev.php # 场景配置，用于划分生产和测试　define('APP_STATUS','dev'); home company pro 等　
Application/Common/Conf/user.php # 拓展配置 'LOAD_EXT_CONFIG' => 'user,db'
Application/Common/Conf/db.php # 拓展配置 'LOAD_EXT_CONFIG' => 'user,db'

# 模块独立配置
Application/$MODULE/Conf/config.php # 模块配置
Application/$MODULE/Conf/config_$APP_MODE.php # 可选
Application/$MODULE/Conf/dev.php # 可选
Application/$MODULE/Conf/user.php
Application/$MODULE/Conf/db.php
```

每个配置文件返回一个数组，同样的键，后面加载的值覆盖前面的．

```php
# 获取配置
$model     = C( 'URL_MODEL' );              // 读取 一维配置 config['URL_MODEL']
$user_type = C( 'USER_CONFIG.USER_TYPE' );  // 读取 二维配置 config['USER_CONFIG']['USER_TYPE']

# 动态修改的配置，只对本次请求的后续代码有效
C( 'DATA_CACHE_TIME', 60 );         // 设置 一维
C( 'USER_CONFIG.USER_TYPE', 1 );    // 设置 二维
C( ['WEB_SITE_TITLE'=>'ThinkPHP','WEB_SITE_DESCRIPTION'=>'开源PHP框架'] ); // 批量设置
```

常用配置:

```php
URL_MODEL = 2 ; URL模式  Rewrite URL 
```

## 3. 路由规则

> 小雨伞就是采用了 ThinkPHP 的 Rewrite URL 模式（配置名`URL_MODEL`）

### 3.1 PATHINFO 模式

PATHINFO 模式是系统的默认 URL 模式，参考如下：

```bash
http://serverName/index.php/模块/控制器/操作/key1/value1 # Web 访问
php index.php 模块/控制器/操作/key1/value1 # 命令行访问
```

### 3.2 REWRITE模式

REWRITE模式是在PATHINFO模式的基础上添加了重写规则的支持，可以去掉 `index.php` 文件（需要启用 Nginx 或是 Apache 的 `rewrite.so` URL 重写模块）


## 4. 控制器

```
http://xxx.com/Home/LinkTest/test/name/link/age/19
# name : link , age : 19
```

```php
// Application/Home/Controller/LinkTestController.class.php
class LinkTestController extends Controller
{
    public function test($name = "", $age = 0) {
        echo "name : $name , age : $age ";
    }
    // protect private 是无法访问的
    protected function can_not_access_fun(){}
}
```

## 5. View 组件

控制器中调用 `$this->display();` 会自动加载对应的模板文件，默认是模块目录下面的 `View/控制器名/操作名.html`

```
<?php
// ./Application/Home/Controller/LinkTestController.class.php
namespace Home\Controller;
use Think\Controller;
class LinkTestController extends Controller {
    public function hello($name='link'){
        $this->assign('name',$name);
        $this->display();
    }
}
```

### 5.1 全局模板变量机制

在 config.php 文件中 `VIEW_DEFAULT_VALUE` 定义的变量，会自动注册到视图中，并且会覆盖掉用户自定义的同名变量．

```php
// ThinkPHP View 模板中，会自动加载的默认变量
'VIEW_DEFAULT_VALUE' => [
　　　　'CDN' => "/static" // 前端资源的 CDN 取值
]
```

```html
// ./Application/Home/View/LinkTest/hello.html
hello, {$name} !
CDN : {$CDN}
```



## 6. Model 组件

### 6.1 配置

```php
// ./Application/Common/conf/config.php
// 默认数据库配置
'DB_TYPE' => 'mysqli', // 数据库类型
'DB_HOST' => 'rm-wz90kn3um1o3gakci.mysql.rds.aliyuncs.com', // 服务器地址
'DB_NAME' => 'xproject', // 数据库名
'DB_USER' => 'xuser', // 用户名
'DB_PWD' => 'Xpass611', // 密码
'DB_PORT' => 3306, // 端口
'DB_PREFIX' => 't_', // 数据库表前缀
'DB_CHARSET' => 'utf8mb4', // 字符集
```

建立测试表 SQL :

```SQL
SET FOREIGN_KEY_CHECKS = 0;
CREATE TABLE `t_thinkphp_data` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `data` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
insert into `t_thinkphp_data`(`id`,`data`) values
(1,'thinkphp'),
(2,'php'),
(3,'framework');
CREATE TABLE IF NOT EXISTS `t_thinkphp_form` (
  `id` smallint(4) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `create_time` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
 ) ENGINE=INNODB;
SET FOREIGN_KEY_CHECKS = 1;
```
控制器：
```php
<?php
// ./Application/Home/Controller/LinkTestController.class.php
namespace Home\Controller;
use Think\Controller;
class LinkTestController extends Controller {
    public function hello($name='link'){
        $Data = M('thinkphp_data'); // 实例化 Data 数据模型
        $result = $Data->find(3);
        $this->assign('result', $result);
        $this->display();
    }
}
```
视图：
```html
// ./Application/Home/View/LinkTest/hello.html
id : {$result.id}
data : {$result.data}
```

### 6.2 创建数据

`http://dev.xinhulu.com/Home/LinkTest/add` 访问表单界面，ThinkPHP 在没有找到对应操作方法的情况下，会检查是否存在对应的模板文件，由于我们有对应的add模板文件，所以控制器就直接渲染该模板文件输出了。所以说对于没有任何实际逻辑的操作方法，我们只需要直接定义对应的模板文件就行了。

```html
// ./Application/Home/View/LinkTest/add.html
<FORM method="post" action="/Home/LinkTest/insert">
    标题：<INPUT type="text" name="title"><br/>
    内容：<TEXTAREA name="content" rows="5" cols="45"></TEXTAREA><br/>
    <INPUT type="submit" value="提交">
</FORM>
```

对应的 Controller `Application/Home/Controller/LinkTestController.class.php`

```php
public function insert()
{
    $Form = D('LinkForm'); // 需要对应的模型类
    try {
        if ($Form->create() == false) // 数据对象已经成功创建，但目前只是保存在内存中
            throw new \Exception("创建失败");
        $result = $Form->add(); // 直到我们调用add方法写入数据到数据库
        if ($result == false)
            throw new \Exception("添加失败");
        echo '数据添加成功！';
    } catch (Throwable $e) {
        $this->error($Form->getError());
    }
}
```

对应的模型类`Application/Home/Model/LinkFormModel.class.php`

```php
<?php
namespace Home\Model;
use Think\Model;
class LinkFormModel extends Model
{
    protected $tableName = "thinkphp_form";
    // 定义自动验证
    protected $_validate = array(
        array('title', 'require', '标题必须'),
    );
    // 定义自动写入
    // 当我们顺利提交表单后，会看到写入数据表的数据中的create_time字段已经有值了，这就是通过模型的自动完成写入的
    protected $_auto = array(
        array('create_time', 'time', 1, 'function'),
    );
}
```

### 6.3 展示数据

```php
// 读取
public function read($id = 1)
{
    try {
        $Form = M('thinkphp_form');
        $data = $Form->find($id); // 读取数据
        if ($data == false)
            throw new \Exception("数据错误");

        $title = $Form->where("id = $id")->getField('title'); // 获取某个字段的值
        $this->assign('title', $title);
        $this->assign('data', $data); // 模板变量赋值
        $this->display();
    } catch (\Exception $e) {
        $this->error("数据错误");
    }
}
```

```html
<h2>{$title}</h2>
<table>
    <tr>
        <td>id:</td>
        <td>{$data.id}</td>
    </tr>
    <tr>
        <td>标题：</td>
        <td>{$data.title}</td>
    </tr>
    <tr>
        <td>内容：</td>
        <td>{$data.content}</td>
    </tr>
</table>
```

### 6.4 修改数据

对应的 Controller `Application/Home/Controller/LinkTestController.class.php`

```php
// 展示修改页面，有先查询出数据的逻辑
public function edit($id = 0)
{
    $Form = M('thinkphp_form');
    $this->assign('vo', $Form->find($id));
    $this->display();
}

// 改
public function update()
{
    $Form = D('thinkphp_form');
    try{
        if ($Form->create() == false)
            throw new \Exception("更新失败");

        $id = I("custom.id");
        
        // 修改单个字段
        $result = $Form->where("id = $id")->setField('title','ThinkPHP FieldOnly2');

        // 修改模型字段
        // $result = $Form->save(); // 返回值是影响的记录数，如果返回false则表示更新出错
        if ($result == false)
            throw new \Exception("更新失败");
        echo 'update 成功！';
    } catch (\Throwable $e){
        $this->error($Form->getError());
    }
}
```

edit 页面 `Application/Home/View/LinkTest/edit.html`

```html
<FORM method="post" action="/Home/LinkTest/update">
    标题：<INPUT type="text" name="title" value="{$vo.title}"><br/>
    内容：<TEXTAREA name="content" rows="5" cols="45">{$vo.content}</TEXTAREA><br/>
    <INPUT type="hidden" name="id" value="{$vo.id}">
    <INPUT type="submit" value="提交">
</FORM>
```

### 6.5 AR查询

```php
// SELECT * FROM think_user WHERE type=1 AND status=1
$User = M("User"); // 实例化User对象
$User->where('type=1 AND status=1')->select(); 

// SELECT * FROM think_user WHERE `name`='thinkphp' AND status=1
$User = M("User"); // 实例化User对象
$condition['name'] = 'thinkphp';
$condition['status'] = 1;
$User->where($condition)->select();   // 把查询条件传入查询方法

// SELECT * FROM think_user WHERE `name`='thinkphp' OR `account`='thinkphp'
$User = M("User"); // 实例化User对象
$condition['name'] = 'thinkphp';
$condition['account'] = 'thinkphp';
// 默认逻辑关系是 逻辑与 AND，但是用下面的规则可以更改默认的逻辑判断
$condition['_logic'] = 'OR';
$User->where($condition)->select();   // 把查询条件传入查询方法
```

### 6.6 ORM查询

```php
// SELECT * FROM think_user WHERE `name`='thinkphp' AND status=1
$User = M("User"); // 实例化User对象
$condition = new stdClass(); 
$condition->name = 'thinkphp';  // 定义查询条件
$condition->status= 1; 
$User->where($condition)->select(); 
```

#### 表达式查询 

```php
$User = M("User"); // 实例化User对象
$map['字段名'] = array('表达式','查询条件');

$map['id']  = array('eq',100); // 等价于 $map['id']  = 100;
$map['id']  = array('gt',100); // where id > 100
$map['name'] = array('like','thinkphp%'); // where name like 'thinkphp%'

// (a like '%thinkphp%' OR a like '%tp') AND (b not like '%thinkphp%' AND b not like '%tp')
$map['a'] =array('like',array('%thinkphp%','%tp'),'OR');
$map['b'] =array('notlike',array('%thinkphp%','%tp'),'AND');

$map['id']  = array('between',array('1','8')); // id BETWEEN 1 AND 8
$map['id']  = array('not in',array('1','5','8')); // id NOT IN (1,5, 8)

$User->where($map)->select(); // 把查询条件传入查询方法
```

#### 快捷查询

```php
$User = M("User"); // 实例化User对象
$map['name|title'] = 'thinkphp';
$User->where($map)->select(); // name= 'thinkphp' OR title = 'thinkphp'
```

#### 区间查询

```php
$map['id'] = array(array('gt',1),array('lt',10)) ; // (`id` > 1) AND (`id` < 10) 

```







### 6.7 裸SQL

```php
$Model = new Model() // 实例化一个model对象 没有对应任何数据表
$Model->query("select * from think_user where status=1");
$Model->execute("update think_user set name='thinkPHP' where status=1");
```





## 7. Xdebug 调试

```php
[xdebug]
zend_extension=xdebug.so
xdebug.remote_enable=1
xdebug.remote_port=29325
xdebug.remote_autostart=0
xdebug.idekey=PHPSTORM
xdebug.overload_var_dump=0
xdebug.collect_params=4
xdebug.filename_format=%f
```