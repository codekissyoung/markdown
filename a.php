#!/usr/bin/php
<?php
class App
{
    protected $routes = [];
    protected $status = '200 Ok';
    protected $type = 'text/html';
    protected $body = 'hello world';

    public function addRoute($path, $routeCallback)
    {
        $this->routes[$path] = $routeCallback->bindTo($this, __CLASS__);
    }

    public function dispatch($cur_path)
    {
        $this->routes[$cur_path]();

        header("HTTP/1.1 " . $this->status);
        header("Content-type: " . $this->type);
        header("Content-length: " . mb_strlen($this->body));
        echo $this->body;
    }
}

$app = new App();

$app->addRoute('/users/link', function () {
    $this->type = 'application/json;charset=utf8';
    $this->body = '{"name":"link"}';
});

$app->dispatch('/users/link');
