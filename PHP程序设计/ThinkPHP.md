# ThinkPHP 3.2.3

## 1. 目录

```bash
├── Application             # 应用目录
│   ├── Common              # 公共模块（不能直接访问）
│   │   ├── Common          # 应用公共函数目录
│   │   └── Conf            # 应用公共配置文件目录
│   ├── Home                # 前台模块
│   │   ├── Common          # 函数公共目录
│   │   ├── Conf            # 配置文件目录
│   │   ├── Controller      # 控制器目录
│   │   ├── Model           # 模型目录
│   │   └── View            # 视图目录
│   │   └── Logic           # 逻辑层目录（可选）
│   │   └── Service         # Service 层目录（可选）
│   └── Admin               # 后台模块目录（可选）
│   └── Runtime             # 缓存、日志等运行数据
├── index.php               # 前台入口
├── admin.php               # 后台入口（可选）
├── Public                  # 资源文件目录
└── ThinkPHP                # 框架目录
```

一个 TP 项目中，一个入口文件`index.php`配上一个模块`Admin/` 构成一个应用，应用之间理论上是应该逻辑隔离的，只有`Common/`模块是共享的．

### 1.1 入口文件 index.php

```php
// THINK_PATH	框架目录
// STORAGE_TYPE	存储类型（默认为File）
// APP_MODE	应用模式（默认为common）
define('BUILD_DIR_SECURE', false);          # don't generate index.html
define('APP_DEBUG', TRUE);                  # debug mode
define('APP_PATH','./Application/');        # apps dir, only one
define('RUNTIME_PATH', '/tmp/tp-runtime');  # runtime dir, need writable
define('BIND_CONTROLLER','控制器名称');      # 入口文件绑定默认访问控制器
define('BIND_ACTION', '动作名称');           # 入口文件绑定默认访问动作

require './ThinkPHP/ThinkPHP.php';
```


## 2. 配置

配置的加载顺序：

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



## 3. 路由

下面这个访问模式是固定的．

```bash
http://serverName/index.php/模块/控制器/操作　　　　# Web 访问
php index.php 模块/控制器/操作 				   # 命令行访问
```

后续给到操作的参数，一般设置成 `rewrite` 模式, 即没有　`index.php`　文件（需要启用 Nginx 或是 Apache 的 `rewrite.so` URL 重写模块），将下列 `URL` :

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
}
```

### 3.1 自定义路由

略过

## 4. 控制器

控制器文件名必须以 `.class.php` 结尾

`spl_autoload_register` 以 `Application` 作为查找路径的，所以相应的完整类名为:`模块文件夹名\文件夹名\类文件名`，类文件名注意要去掉 `.class.php` 后缀．

### 4.1 Ajax 返回

```php
// 指定XML格式返回数据
$data['status']  = 1;
$data['content'] = 'content';
$this->ajaxReturn($data,'xml');
```

### 4.2 读取输入

```php
I('get.id',0); // 如果不存在$_GET['id'] 则返回0
I('get.name',''); // 如果不存在$_GET['name'] 则返回空字符串
I('get.name','','htmlspecialchars'); // 采用htmlspecialchars方法对$_GET['name'] 进行过滤，如果不存在则返回空字符串
I('post.name','','htmlspecialchars'); // 采用htmlspecialchars方法对$_POST['name'] 进行过滤，如果不存在则返回空字符串
I('session.user_id',0); // 获取$_SESSION['user_id'] 如果不存在则默认为0
I('cookie.'); // 获取整个 $_COOKIE 数组
I('server.REQUEST_METHOD'); // 获取 $_SERVER['REQUEST_METHOD'] 
I('post.email','','email'); // 验证为 email

// http://serverName/index.php/New/2013/06/01

// 正则匹配过滤
I('get.name','','/^[A-Za-z]+$/'); // 采用正则表达式进行变量过滤
I('get.id',0,'/^\d+$/');

// 修饰符
I('get.id/d'); // 强制变量转换为整型
I('post.name/s'); // 强制转换变量为字符串类型
I('post.ids/a'); // 强制变量转换为数组类型
```

### 4.3 前置后置操作

```php
public function _before_index(){ // 前置操作方法
	echo 'before<br/>';
}
public function _after_index(){ // 后置操作方法
	echo 'after<br/>';
}
```

## 5. 模型



## 5. CBD 模式

```php
./TinkPHP                                       # 框架系统
├── ThinkPHP.php                                # 框架入口文件
├── Common                                      # 核心公共函数
│   └── functions.php                           # 核心函数库
├── Conf                                        # 核心配置
│   ├── convention.php                          # 惯例配置文件
│   └── debug.php                               # 惯例调试配置文件
├── Library                                     # 框架类库
│   ├── Behavior                                # 系统行为类库
│   ├── Org                                     # Org类库包
│   ├── Think                                   # 核心类库包
│   │   ├── App.class.php                       # 核心应用类
│   │   ├── Cache.class.php                     # 核心缓存类
│   │   ├── Controller.class.php                # 基础控制器类
│   │   ├── Db.class.php                        # 数据库操作类
│   │   ├── Dispatcher.class.php                # URL解析调度类
│   │   ├── Exception.class.php                 # 系统基础异常类
│   │   ├── Hook.class.php                      # 系统钩子类
│   │   ├── Log.class.php                       # 系统日志记录类
│   │   ├── Model.class.php                     # 系统基础模型类
│   │   ├── Route.class.php                     # 系统路由类
│   │   ├── Storage.class.php                   # 系统存储类
│   │   ├── Template.class.php                  # 内置模板引擎类
│   │   ├── Think.class.php                     # 系统引导类
│   │   └── View.class.php                      # 系统视图类
│   └── Vendor                                  # 第三方库
├── Mode                                        # 框架应用模式
│   ├── Api
│   ├── api.php
│   ├── common.php                              # 普通模式定义文件
│   ├── Sae
│   └── sae.php
└── Tpl                 # 系统模板
    └── think_exception.tpl
```



## 6. 调试

```php
dump( C() );                                        # 获取 ThinkPHP 中定义的所有配置
dump( get_defined_constants(true)['user'] );        # 获取 ThinkPHP 中定义的所有常量
```


## 7. 开发规范

- `ThinkPHP` 内部类库文件名：类名(驼峰 首字母大写) + `class.php`
- `APP_PATH` 目录为命名空间的顶层目录，所有内部类的 `namespace` 与 路径 保持一致，比如：

```bash
APP_PATH/Home/Controller/UserController.class.php

namespace 要求为：Home\Controller
类名      要求为：UserController
```

- 大小写敏感，类名 与 文件名 一定要保持一致
- 函数命名：小写字母 + 下划线 `get_client_ip()`
- 方法命名：小写字母开头 驼峰法 `getUserName()`
- 私有方法：下划线开头 + 小写字母 + 驼峰法 `_parseType()`
- 属性、私有属性命名 与 方法、私有方法 一致，`tableName` `_instance`
- 常量、配置参数、语言变量：大写字母 + 下划线 `HAS_ONE` `MANY_TO_MANY` `HTML_CACHE_ON` `MY_LANG`
- 系统语言变量：`_CLASS_NOT_EXIST_`
- 模板文件：以 `.html` 为后缀
- 数据表名 和 字段名: 小写 + 下划线，注意：绝对不能 `_` 开头
- 单字母大写函数：`TP` 特有的快捷操作函数
- 程序文件采用`UTF-8`编码格式保存，并且去掉`BOM`信息头

开发建议：

- 养成使用 `I` 函数获取输入变量的好习惯
- 更新或者环境改变后遇到问题首要问题是清空 `RUNTIME_PATH` 指定的目录