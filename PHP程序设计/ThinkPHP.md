# ThinkPHP 3.2.3 框架

## 目录结构

```bash
├── Application             # 应用目录
│   ├── Common              # 公共模块 （不能直接访问）
│   │   ├── Common          # 应用公共函数目录
│   │   └── Conf            # 应用公共配置文件目录
│   ├── Home                # 前台 模块目录 (默认会生成的)
│   │   ├── Common          # 函数公共目录
│   │   ├── Conf            # 配置文件目录
│   │   ├── Controller      # 控制器目录
│   │   ├── Model           # 模型目录
│   │   └── View            # 视图目录
│   │   └── Logic           # 逻辑层目录（可选）
│   │   └── Service         # Service 层目录（可选）
│   └── Admin               # 后台模块目录（可选）
│   └── Runtime             # 缓存、日志等运行数据
├── index.php               # 入口
├── Public                  # 资源文件目录
└── ThinkPHP                # 框架内核目录
```

入口文件`index.php`

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

配置文件`Application/Common/Conf/config.php`

```php
'SHOW_PAGE_TRACE' => true,                  # 开启 Trace 调试工具
'URL_CASE_INSENSITIVE' => true,             # 忽略大小写
'DB_TYPE' => 'mysql',                       # mysql数据库类型
'DB_HOST' => 'localhost',                   # 数据库 host
'DB_USER' => 'root',                        # 用户名
'DB_PWD' => '123456',                       # 密码
'DB_NAME' => 'ThinkPHP',                    # 数据库名称
'DB_PREFIX' => 'prefix_',                   # 表的前缀
```

控制器`Home/Controller/IndexController.class.php`

```php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller{
    public function index(){
        echo "<h1> Hello ThinkPHP</h1>";
    }
}
```

在浏览器中访问 `http://host/Home/Index/index` 即是访问`IndexController`类的`index()`方法。

`spl_autoload_register`注册的自动加载函数中，是以`Application`作为查找路径的，所以相应的完整类名为:`Home\Controller\IndexController`。

PS: 控制器文件名以`.class.php`结尾，这是`ThinkPHP`框架要求的，在框架代码里面强制要求类符合这一规范，才会自动被加载。

## 开发规范

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

## 配置

框架中默认所有配置文件的定义格式均采用`return [...];` 方式。

比如框架自身的配置`./ThinkPHP/Conf/convention.php`:

```php
return  array(
    /* 应用设定 */
    'APP_USE_NAMESPACE'     =>  true,    // 应用类库是否使用命名空间
    // ...
);
```

配置的加载顺序：

```bash
ThinkPHP/Conf/convention.php
Application/Common/Conf/config.php
Application/Common/Conf/config_应用模式名称.php       # 可选
ThinkPHP/Conf/debug.php                              # 可选
Application/Common/Conf/debug.php                    # 可选
Application/Common/Conf/dev.php                      # 状态配置，用于划分 生产 和 测试
Application/当前模块名/Conf/config.php                # 模块配置
Application/当前模块名/Conf/config_应用模式名称.php    # 可选
Application/当前模块名/Conf/应用状态.php               # 可选
```

关于应用状态配置，需要与 `APP_STATUS` 常量配合使用，比如：

```bash
define('APP_STATUS','dev');                 // index.php
```

就会加载以下配置:

```bash
Application/Common/Conf/dev.php
Application/当前模块名/Conf/dev.php
```

#### 获取配置

```php
$model     = C( 'URL_MODEL' );              // 读取 一维配置 config['URL_MODEL']
$user_type = C( 'USER_CONFIG.USER_TYPE' );  // 读取 二维配置 config['USER_CONFIG']['USER_TYPE']
```

#### 动态修改配置

动态修改的配置，只对本次请求的后续代码有效。

```php
C( 'DATA_CACHE_TIME', 60 );         // 设置 一维
C( 'USER_CONFIG.USER_TYPE', 1 );    // 设置 二维

// 批量设置
C( ['WEB_SITE_TITLE'=>'ThinkPHP','WEB_SITE_DESCRIPTION'=>'开源PHP框架'] );
```

拓展配置：

如果在`Application/Common/Conf/config.php`中设置了以下 项目：

```php
'LOAD_EXT_CONFIG' => 'user,db',
```

则会额外加载以下配置：

```bash
Application/Common/Conf/user.php
Application/Common/Conf/db.php
Application/当前模块/Conf/user.php
Application/当前模块/Conf/db.php
```

## 模块化设计

默认以 `PATHINFO` 模式访问应用：

```bash
http://serverName/index.php/模块/控制器/操作/[参数名/参数值...]
$ php index.php 模块/控制器/操作/[参数名/参数值...]
```

应用： 一个入口文件，代表一个应用。
模块：`APP_PATH` 下，一个 `Module` (比如`Home`) 代表一个模块，一个应用下可以有多个模块。
控制器：`Module`下`Controller`目录下，一个控制器类，代表一个控制器
操作：控制器类的方法，一个方法 表示 一个操作

## CBD 模式

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
│   ├── Lite
│   ├── Sae
│   └── sae.php
└── Tpl                 # 系统模板
    └── think_exception.tpl
```

## 调试

```php
dump( C() );                                        # 获取 ThinkPHP 中定义的所有配置
dump( get_defined_constants(true)['user'] );        # 获取 ThinkPHP 中定义的所有常量
```
