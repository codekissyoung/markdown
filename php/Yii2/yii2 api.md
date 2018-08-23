# 添加一个应用
frontend,backend等称为一个应用,使用init命令初始化的
```
cp -r frontend api
```
修改yii2/enviroment/index.php文件,照着backend抄一个api配置
```
cp -r yii2/enviroment/dev/backend   yii2/enviroment/dev/api
cp -r yii2/enviroment/prod/backend  yii2/enviroment/dev/api
```

# 应用主体  Yii::$app
`$application = new yii\web\Application($config);`index.php 创建应用主体,`$application`是一个单例,赋值给了Yii::$app以供全局访问
`Yii::$app->id;`区分应用主体的唯一标识id.
`Yii::$app->basePath;`是应用所在的路径
`Yii::$app->aliases`是所有别名,只写属性,详细见[别名 Yii::$app->aliases]
`Yii::$app->catchAll` 通常在维护模式下用,使用一个控制器处理所有请求,配置：`'catchAll' => ['offline/notice','param1' => 'value1','param2' => 'value2',],`
`Yii::$app->params['envDir'];` 使用params.php配置站点信息,访问配置好的变量
`Yii::$app->defaultRoute` 默认路由
`Yii::$app->controllerNamespace` 控制器命名空间
`Yii::$app->language` yii的语言配置：`'language' => 'zh-CN',`
`Yii::$app->sourceLanguage` 这个应用是用什么语言写的,配置 `'sourceLanguage' => 'zh-CN'`
`Yii::$app->timeZone` 配置时区：`'timeZone' => 'Asia/Chongqing'`
`Yii::$app->version` 配置当前应用的版本 `'version'  => '1.0'`
`Yii::$app->charset` 编码设置
`Yii::$app->extensions` yii2 使用的拓展插件们
`Yii::$app->layout` yii2应用使用的默认布局文件
`Yii::$app->layoutPath` yii2使用的布局文件的路径目录
`Yii::$app->runtimePath`是runtime文件夹路径
`Yii::$app->viewPath` 是views文件夹路径
`Yii::$app->vendorPath` 是类库文件夹路径
`Yii::$app->components` 是注册了的组件,在main.php使用如下配置：
```
'components' => [
    	 'cache' => [
    	    	 'class' => 'yii\caching\FileCache',
    	 ],
    	 'user' => [
        	 'identityClass' => 'app\models\User',
        	 'enableAutoLogin' => true,
    	 ],
],
```
`Yii::$app->modules` 是应用的子模块,配置：
```
'modules' => [
    	 'booking' => 'app\modules\booking\BookingModule',
    	 'comment' => [
        	 'class' => 'app\modules\comment\CommentModule',
        	 'db' => 'db',
    	 ],
],
```
`Yii::$app->bootstrap;`查看应用在启动时就运行的组件,在main.php使用如下配置：
```
'bootstrap' => [
    'componentID', // an application component ID or module ID
    'app\components\Profiler', // a class name
    ['class' => 'app\components\Profiler','level' => 3,], // 配置数组
    function () {return new app\components\Profiler();}// 无名称函数
],
```
`Yii::$app->controllerMap` 是控制器map,用于映射特殊的控制器,在main.php使用如下配置：
```
'controllerMap' => [
    [
        	 'account' => 'app\controllers\UserController',
        	 'article' => [
        	    	 'class' => 'app\controllers\PostController',
        	    	 'enableCsrfValidation' => false,
            ],
    ],
],
```
Yii::$app事件
`on beforeRequest` 在Yii::$app->request之前执行
`on afterRequest`  在结束Yii::$app->request之后执行
`on beforeAction`  在action之前执行
`on afterAction`   在actioin之后执行
```
//事件：
'on beforeRequest'=>function($event){
    	 //op($event);
    	 //echo "<h1>hello!excuted before request!</h1>";
},
```
`\Yii::$app->on(\yii\base\Application::EVENT_BEFORE_REQUEST, function ($event) {    // ... });`
Note that the same afterAction event is also triggered by modules and controllers. These objects trigger this event in the reverse order as for that of beforeAction. That is, controllers are the first objects triggering this event, followed by modules (if any), and finally applications.

# 别名 Yii::$app->aliases
`Yii::setAlias('@foo', '/path/to/foo');`文件路径的别名
`Yii::setAlias('@bar', 'http://www.example.com');`URL的别名
`Yii::setAlias('@foobar', '@foo/bar');`
`return ['aliases' => ['@foo' => '/path/to/foo','@bar' => 'http://www.example.com',], ];`在main.php里配置别名
`echo Yii::getAlias('@foo');` 解析别名输出：/path/to/foo
`echo Yii::getAlias('@foo/bar/file.php');` 输出：/path/to/foo/bar/file.php
`use yii\caching\FileCache;$cache = new FileCache([ 'cachePath' => '@runtime/cache', ]);`支持别名,别名在 Yii 的很多地方都会被正确识别，无需调用 Yii::getAlias() 来把它们转换为路径/URL。请关注 API 文档了解特定属性或方法参数是否支持别名
预定义别名
`@yii` - BaseYii.php 文件所在的目录（也被称为框架安装目录）
`@app` - 当前运行的应用 yii\base\Application::basePath
`@runtime` - 当前运行的应用的 yii\base\Application::runtimePath
`@vendor` - yii\base\Application::vendorPath
`@webroot` - 当前运行应用的 Web 入口目录
`@web` - 当前运行应用的根 URL

# urlManager 组件
```
'urlManager' => [
      'enablePrettyUrl' => true, // 启用美化URL
      'enableStrictParsing' => false, // 是否执行严格的url解析
      'showScriptName' => false, // 在URL路径中是否显示脚本入口文件
      'rules' => [
           '<modules:\w+>/<controller:\w+>/<action:\w+>/<id:\w+>'=>'<modules>/<controller>/<action>?id=<id>',
           '<modules:\w+>/<controller:\w+>/<action:\w+>' => '<modules>/<controller>/<action>',
           '<controller:\w+>/<action:\w+>' => '<controller>/<action>',
           '/' => 'index/index',
       ]
],
```


# 设置站点语言为中文
yii/common/main.php 中配置`'language'=>'zh-CN'`
设置activeform表单标签和错误显示为中文
```
public function attributeLabels(){
    return [
        'name' => '电影名称',
        'film_url' => '电影播放链接',
        'film_desc' => '电影描述',
    ];
}
```
