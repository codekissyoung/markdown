<h2>特殊选择器this</h2>
<p id="test1">点击测试：通过原生DOM处理</p>
<p id="test2">点击测试：通过原生jQuery处理</p>
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.js"></script>
<script src="./index.js"></script>
<?php
// class App
// {
//     protected $routes = [];
//     protected $status = '200 Ok';
//     protected $type = 'text/html';
//     protected $body = 'hello world';

//     public function addRoute($path, $routeCallback)
//     {
//         $this->routes[$path] = $routeCallback->bindTo($this, __CLASS__);
//     }

//     public function dispatch($cur_path)
//     {
//         $this->routes[$cur_path]();

//         header("HTTP/1.1 " . $this->status);
//         header("Content-type: " . $this->type);
//         header("Content-length: " . mb_strlen($this->body));
//         echo $this->body;
//     }
// }
// $app = new App();
// var_dump(serialize($app));
// $app->addRoute('/users/link', function () {
//     $this->type = 'application/json;charset=utf8';
//     $this->body = '{"name":"link"}';
// });
// $app->dispatch('/users/link');
?>