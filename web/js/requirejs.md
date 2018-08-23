# 原理
- requireJS使用head.appendChild()将每一个依赖加载为一个script标签。
- requireJS等待所有的依赖加载完毕，计算出模块定义函数正确调用顺序，然后依次调用它们。

# 模块化的好处
```bash
1. 作用域污染
    小明定义了 var name = 'xiaoming';
    N ~ 天之后：
    小王又定义了一个 var name = 'xiaowang';

2.  防止代码暴漏可被修改：
    为了解决全局变量的污染，早期的前端的先驱们则是以对象封装的方式来写JS代码：
    var utils = {
        'version':'1.3'
    };
    然而这种方式不可以避免的是对象中的属性可被直接修改：utils.version = 2.0 
```

# 模块化发展
1. 无序(洪荒时代) ：自由的书写代码。
1. 函数时代 ：将代码关入了笼子之中。
1. 面向对象的方式。
1. 匿名自执行函数：其典型的代表作就是JQ。
1. 伪模块开发（CMD/AMD）
1. 模块化开发 ES6标准

# 引入require.js
```html
<script src="/path/to/require.js" data-main="/path/to/main.js"></script>
```
- `data-main` 是告诉 `requirejs` 你下载完以后，马上去载入真正的入口文件

# require.config 配置参数
```js
require.config({
  baseUrl: 'js/', // 基准目录 与 paths 中模块地址拼接 构成该模块的实际地址
  paths: {
    hello: 'hello'
  }, // { 模块名称 : 模块地址, 模块名称 : 模块地址 ... } 对象
  shim: {
    hello: { exports: 'hello' }
  }
});
```
- `paths`中，文件可省略`.js`后缀
- 值为url ( 比如`http://xxx.xxxx.com/js/jquery.min` ) 可以绕过`baseUrl`

# 集成没有按 AMD 风格定义的库 Backbone
- Backbone采用MVC的分层结构很好的将程序各个部分解耦。
- Backbone目前不支持AMD，那么它只能作为普通的JS文件使用。它全局的标示符是Backbone
- 它还依赖于underscore，underscore的全局标示是下划线 `_` 。因此，当我们使用AMD方式写的模块中使用Backbone时，得确保underscore和Backbone已经载入了


# 资源
- [requirejs最佳实践](https://www.cnblogs.com/digdeep/p/4607131.html) 强烈推荐
- [requirejs从概念到实战](https://www.cnblogs.com/HCJJ/p/6611669.html) 强烈推荐