# 安装node
- 直接下载 x86 平台下的编译好的软件包，解压后，移动为 `/opt/node`
- 将`/opt/node/bin`加入`PATH`路径
- 执行`node -v` 和 `npm -v`验证下安装是否成功
```bash
# node js
export PATH="/opt/node/bin:$PATH"
```

# 第一个nodejs程序
```js
var http = require('http');
http.createServer(function (request, response) {
    	response.writeHead(200, {'Content-Type': 'text/plain'});
    	response.end('Hello World\n');
}).listen(8888);
console.log('Server running at http://127.0.0.1:8888/');
```

# 同步执行代码
```js
var fs = require("fs");
var data = fs.readFileSync('input.txt');
console.log(data.toString());
console.log("程序执行结束!");
```

# 异步执行代码
```js
var fs = require("fs");
fs.readFile('input.txt', function (err, data) {
    if (err) return console.error(err);
    console.log(data.toString());
});
console.log("程序执行结束!");
```

# 事件处理
http://www.runoob.com/nodejs/nodejs-event.html
```js
// 引入 events 模块
var events = require('events');
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();
// 创建事件处理程序
var connectHandler = function() {
   console.log('连接成功。');
   // 触发 data_received 事件
   eventEmitter.emit('data_received');
}
// 绑定 connection 事件处理程序
eventEmitter.on('connection', connectHandler);
// 使用匿名函数绑定 data_received 事件
eventEmitter.on('data_received', function(){
   console.log('数据接收成功。');
});
// 触发 connection 事件
eventEmitter.emit('connection');
console.log("程序执行完毕。");
```

# 回调函数
格式:err是错误信息,data是传入的数据
```js
function(err,data){ }
```
