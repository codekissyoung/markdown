# 响应组件

`$response = Yii::$app->response;` 拿到响应组件
`$response -> statusCode = '404'`

# cookie组件

`use yii\web\Cookie` 使用Cookie类
`$cookies = Yii::$app->response->cookies` 拿到response cookie组件

增加一条数据

$cookie_data = ['name'=>'user',value='codekissyoung'];
`$cookies->add(new Cookie($cookie_data));` 添加或者覆盖一条cookie数据
`$cookies->remove('user')`;删除一条cookie数据

获取cookie

`$cookies = Yii::$app->request->cookies` 拿到request cookie组件
`$cookies -> getValue('user');` 获取cookie数据的值
cookie是经过 cookieValidationKey 加密后存储到浏览器中的

# session 组件

`$session = Yii::$app->session;`
`$session->isActive` 用于判断session是否开启
`$session->open();`打开session组件
`$session->set('user','张三');` 或者
`$session['user'] = '张三'` 保存数据到session文件(在php.ini中搜索session.save_path)中
`$session->get('user')`或者`$session['user']` 取数据
`$session->remove('user')`或者`unset($session['user'])` 删除数据
php对象能当做数组处理的原因：实现了php的ArrayAccess接口

# 请求组件

控制器中获取请求组件：
`$request = \Yii::$app->request` 先拿到请求组件
`$request->get()`获取所有get请求值,`$request->get('id',20)`获取get请求的id值,若获取不到,取默认值20
`$request->post()` 获取所有post请求值,`$request->post('id',20)`
`$request->isPost`用于判断是否为post请求
`$request->isGet`用于判断是否为get请求
`$request->userIp`用户ip
