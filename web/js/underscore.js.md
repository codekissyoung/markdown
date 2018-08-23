# 对象封装
- Underscore并没有在原生的JavaScript对象原型中进行扩展，而是像jQuery一样，将数据封装在一个自定义对象中
```js
// 定义一个JavaScript内置对象  
var jsData = {  
    name : 'data'  
}
// 通过_()方法将对象创建为一个Underscore对象  
// underscoreData对象的原型中包含了Underscore中定义的所有方法，你可以任意使用  
var underscoreData = _(jsData);  
// 通过value方法获取原生数据, 即jsData  
underscoreData.value();  
```

# underscore 全局命名 _ 
```js
// Underscore对象  
console.dir(_);  
// 将Underscore对象重命名为us, 后面都通过us来访问和创建Underscore对象  
var us = _.noConflict();  
// 输出"自定义变量"  
console.dir(_);  
```
- 重命名以解决冲突问题

# 链式操作 .chain()
```js
var arr = [10, 20, 30];  
_(arr)
    .chain()  
    .map(function(item){ return item++; })  
    .first()  
    .value();
```
```js
// 这是Underscore中实现链式操作的关键函数，它将返回值封装为一个新的Underscore对象，并再次调用chain()方法，为方法链中的下一个函数提供支持。  
var result = function(obj, chain) {  
    return chain ? _(obj).chain() : obj;  
} 
```

# 拓展自定义方法
```js
_.mixin({  
    method1: function(object) {  
        // todo  
    },  
    method2: function(arr) {  
        // todo  
    },  
    method3: function(fn) {  
        // todo  
    }  
});
```
- 这些方法被追加到Underscore的原型对象中，所有创建的Underscore对象都可以使用这些方法，它们享有和其它方法同样的环境。

# 遍历集合
```js
var arr = [1, 2, 3];  
  
_(arr).map(function(item, i) {  
    arr[i] = item + 1;  
});  
  
var obj = {  
    first : 1,  
    second : 2  
}  
  
_(obj).each(function(value, key) {  
    return obj[key] = value + 1;  
});  
```
- 迭代一个集合（数组或对象），并依次处理集合中的每一个元素

# 函数节流
```js
<input type="text" id="search" name="search" />  
<script type="text/javascript">  
    var query = _(function() {  
        // 在这里进行查询操作  
    }).debounce(200); // 这个函数 在 0.2s 内，只调用一次
    $('#search').bind('keypress', query);  
</script>

<script type="text/javascript">  
    var query = _(function() {  
        // 在这里进行查询操作  
    }).throttle(500); // 这个函数 在500次触发下，只调用一次
    $(window).bind('scroll', query);  
</script>  
```
- 函数节流是指控制一个函数的执行频率或间隔，比如多久时间才执行一次，多少次触发才执行一次

# 模板解析
```js
<ul id="element"></ul>

<script type="text/template" id="tpl">  
    <% for(var i = 0; i < list.length; i++) { %>  
        <% var item = list[i] %>  
        <li>  
            <span><%=item.firstName%> <%=item.lastName%></span>  
            <span><%-item.city%></span>  
        </li>  
    <% } %>  
</script>  
<script type="text/javascript">  
    // 获取渲染元素和模板内容  
    var element = $('#element'),  
        tpl = $('#tpl').html();  
    // 创建数据, 这些数据可能是你从服务器获取的  
    var data = {  
        list: [  
            {firstName: '<a href="#">Zhang</a>', lastName: 'San', city: 'Shanghai'},  
            {firstName: 'Li', lastName: 'Si', city: '<a href="#">Beijing</a>'},  
            {firstName: 'Wang', lastName: 'Wu', city: 'Guangzhou'},  
            {firstName: 'Zhao', lastName: 'Liu', city: 'Shenzhen'}  
        ]  
    }
    // template方法会解析模板内容，生成解析后的可执行JavaScript代码，并返回一个函数，而函数体就是解析后的JavaScript
    var render = _.template(tpl);
    // 调用该函数渲染数据
    var html = render(data);  
    // 将解析后的内容填充到渲染元素  
    element.html(html);  
</script>  
```
- 我们将模板内容放到一个`<script>` 标签中，你可能已经注意到标签的type是text/template而不是text/javascript，因为它无法作为JavaScript脚本直接运行。我也建议你将模板内容放在`<script>`中，因为如果你将它们写在一个`<div>`或其它标签中，它们可能会被添加到DOM树中进行解析
- 执行过程：
    1. 将模板内容解析为可执行的JavaScript（解析模板标签）
    1. 通过with语句将解析后的JavaScript作用域修改为我们传递的数据对象，这使我们能够直接在模板中通过变量形式访问数据对象的属性
    1. 执行解析后的JavaScript（将数据填充到模板）
    1. 返回执行后的结果
