# jQuery

一个专业的操作`DOM`的库。

## 概述

```js
$(function(){
    // 等页面的文档中的节点都加载完毕后，再执行这里的代码
});
```

`DOM`对象就是`DOM`元素，`jQuery`是一个类数组对象，互相转化：

```js
var $div = $('div')     //  jQuery对象
var div = $div[0]       //  转化成DOM对象
var div = $div.get(0)   //  通过get方法，转化成DOM对象
div.style.color = 'red' //  操作dom对象的属性

var div         = document.getElementsByTagName('div'); //　dom对象
var $div        = $(div);                               //　jQuery对象
var $first      = $div.first();                         //　找到第一个div元素
$first.css('color', 'red');                             //　给第一个元素设置颜色
```

## 选择器

```js
$("*")                      // 全选
$("#my_id")                 // 指定 id，id是唯一的，每个id值在一个页面中只能使用一次
$("p")                      // 指定 标签
$(".class")                 // 指定 类
if( $('#box').length > 0 )  // 判断是否选中节点
```

```js
$("#my_id,p,.class")       // 多选　,符号
$("ance desc")             // 后代 空格符号
$("parent>child")          // 子类 > 符号
$("prev+next")             // 下一个元素 +号
$("prev~siblings")         // 选择prev之后所有同一层级的元素 ~号
```

```js
$("li:first")              // 第一个li
$("li:last")               // 最后一个li
$("li:eq(2)")              // 第三个li
$("li:gt(2)")              // 第三个之后的li
$("li:lt(2)")              // 第三个之前的li
$("li:even")               // 偶数项
$("li:odd")                // 奇数项
$("li:first-child")        // 第一个子元素，li里如果是文本了,那么就是文本节点 
$("li:last-child")         // 最后一个子元素
$("li:only-child")         // 选中唯一子元素
$(":nth-child")            // 第n个子元素
$(":nth-last-child")       // 第n个子元素 倒着数
$(":root")                 // 项目根文档 html
```

```js
$("li:contains('土豪')")    //  包含"土豪"文本的 li
$("div:parent")             //  拥有子元素或文本节点的 div
$("div:empty")              //  没有子元素（包含文本节点）的div
$("li:has('p')")            //  含有 p 的 li
```

```js
$("li:hidden")              // 不可见元素
$("li:visble")              // 可见
$(":animated")              // 选择所有正在执行动画效果的元素
```


```js
$("li[title]")             // 选择具有 title 属性的 li
$("li[title='我最爱']")    // 选择 title 为 我最爱的 li
$("li[title!='我最爱']")   // 上条 取反
$("li[title*='最']")       // 选择 title 包含 最 的 li
$("li[title^='crm']")      // 以指定字符串开始
$("li[title$='crm']")      // 以指定字符串结束
```

```js
$("#frmTest :input")        // 获取所有 input、textarea、select、button 元素
$("#frmTest :text")         // 获取所有 text 表单
$("#frmTest :password")     // 获取所有 password 表单
$("#frmTest :radio")        // 获取所有 radio
$("#frmTest :checkbox")     // 获取所有 checkbox 
$("#frmTest :submit")       // 获取所有 submit 按钮
$("#frmTest :reset")        // 匹配所有 重置按钮
$("#frmTest :image")        // 获取所有 图像域 
$("#frmTest :button")       // 获取所有 type=button 的 input 和 <button>
$("#frmTest :checked")      // 获取所有 checked 的<input>元素
$("#frmTest :selected")     // 获取所有 下拉框中被选中的<option>
$("#frmTest :enabled")      // 选取所有 可用的表单元素 
$("#frmTest :disabled")     // 选取所有 不可用的表单元素 
```

### this 在 jQuery 中的含义

```js
var p1 = document.getElementById('test1')
p1.addEventListener('click', function () {
    console.log(this);  // this 是当前操作的 dom 对象
    this.style.color = "blue";
}, false);

$('#test2').click(function () {
    // this仍然是dom对象，但被包装成jQuery对象了
    $(this).css('color', 'red');
});
```


## 样式篇

`DOM`节点常见的属性有：`src` `title` `id` `class` 

### 属性

```js
$("#client").attr();
attr(属性名)                // 获取属性的值
attr(属性名, 属性值)        // 设置属性的值
attr(属性名, 函数值)        // 设置属性的函数值
attr(attributes)            // 给指定元素设置多个属性值
removeAttr( attributeName ) // 为匹配的元素集合中的每个元素中移除一个属性

data(key, value)        // 在标签上的 data- 上存数据
data(key)               // 从Dom上的 data- 上取数据
```

### 值、文本、数据

```js
html()                      // 获取 一个或多个节点内的 innerHTML
html(htmlString)            // 设置
html( function(index, oldhtml) ) 

text()                      // 得到匹配元素集合中每个元素的合并文本，包括他们的后代
text(textString)            // 设置匹配元素内容的文本
text( function(index, text) )

// 只能使用在表单元素上
val()                       // 获取匹配的元素集合中第一个元素的当前值
val( value )                // 设置匹配的元素集合中每个元素的值
val( function )             // 一个用来返回设置值的函数
```

### 样式

```js
addClass("class class2 class3"); // 为每个匹配元素所要增加的一个或多个样式名
addClass( function(index, currentClass) ) // 这个函数返回一个或更多用空格隔开的要增加的样式名
removeClass("class1 class2") 　// 每个匹配元素移除的一个或多个用空格隔开的样式名
removeClass( function(index, class) ) // 一个函数，返回一个或多个将要被移除的样式名
toggleClass( className ) // 一次执行相当于addClass，再次执行相当于removeClass

css({"background-color":"red","color":"white"}) // 设置css值 (多个)
css([name1,name2,name3])                        // 获取css值 (返回对象 多个)
css( propertyName, function ) // 可以传入一个回调函数，返回取到对应的值进行处理
```

## DOM 节点增删改查

### 创建节点

```js
$("<div class='right'><div class='aaron'>动态创建DIV元素节点</div></div>");
```

### 插入节点

大多数方法都可以接收`HTML`字符串，`DOM` 元素，元素数组，或者`jQuery`对象。

```js
$("body").append("<div>往节点里面追加内容</div>");
$("body").prepend("<div>往节点里面前边插入内容</div>");

$("<div>追加到后面</div>").appendTo($("body"));
$("<div>插入到前面</div>").prependTo($("body"));

$("#box").before("<div>插入到#box元素前面</div>"); 
$("<div>插入到#box元素前面</div>").insertBefore("#box");

$("#box").after("<div>插入到#box元素后面</div>");
$("<div>插入到#box元素后面</div>").insertAfter("#box");
```

### 删除节点

```js
remove();   // 移除本节点(包含后代)，同时销毁绑定的事件，不然会导致内存泄露
$("p").filter(":contains('3')").remove(); // 还可以前置一个过滤器
empty();    // 移除了 指定元素中的所有 子 节点

p = $("p").detach(); // 只是页面不可见，但是这个节点还是保存在，数据与事件都不丢失
$("body").append(p); // 加回到页面中，事件还是存在
```

### 复制与替换

元素数据`data`内对象和数组不会被复制，将继续被克隆元素和原始元素共享。深复制的所有数据，需要手动复制每一个。

```js
$("#box").replaceWith("<div>newbox</div>");     // 替换节点
$("<div>newbox</div>").replaceAll($("#box"));   // 替换节点
$("p").wrap("<div></div>");                     // <div><p>......</p></div>
$('p').unwrap();                                // 和 wrap 相反，去掉外层元素
$("p").wrapInner("<i></i>");                    // <p><i>.....</i></p>
$("div").clone()                                // 只克隆了结构，事件丢失
$("div").clone(true)                            // 结构、事件与数据都克隆
```

### 遍历节点

```js
// 遍历 index是第几个 this指代当前传入的js的原生dom对象
each(function(index){
    if(index == 1){
        $(this).attr("class",'red');
    }
});
add()
siblings()
prev()
next()
closet()
parents()
parent()
find()
children()
```

## 事件

### 事件绑定

```js
// 绑定单击事件
$("#elem").on("click",function(){
    // ...
});
// 多个事件 绑定到一个函数上
$("#elem").on("mouseover mouseout",function(){
    // ...
});
// 多个事件 分别绑定到不同函数
$("#elem").on({
    mouseover:function(){},  
    mouseout:function(){}
});
// 传递数据到处理函数
function greet( event ) {
  alert( "Hello " + event.data.name );
}
$( "button" ).on( "click", {
  name: "慕课网"
}, greet );
```

```js
$("elem").off("mousedown")          // 删除一个事件
$("elem").off("mousedown mouseup")  // 删除多个事件
$("elem").off()                     // 删除所有事件
```

## 委托机制

```html
<div class="left">
    <p class="aaron">
        <a>目标节点</a> //点击在这个元素上
    </p>
</div>
<script>
$("div").on("click","p",function(){
    // ...
})
</script>
```

事件绑定在最上层`div`元素上，当用户触发在`a`元素上，事件将往上冒泡，一直会冒泡在`div`元素上。但是，如果提供了第二参数，那么事件在往上冒泡的过程中遇到了选择器匹配的元素，将会触发事件回调函数。

## 事件对象

```js
<ul>
    <li>点击：触发一</li>
    <li>点击：触发二</li>
    <li>点击：触发三</li>
    <li>点击：触发四</li>
</ul>
<script>
$("ul").on('click',function( event ){
    alert('触发的元素是内容是: ' + event.target.textContent );
}
</script>
```

如果要响应每一个`li`的事件，常规方法是给所有的`li`都单独绑定一个事件监听，这样写法很符合逻辑，但是同时有显得繁琐，因为`li`都有一个共同的父元素，而且所有的事件都是一致的。

这里我们可以采用要一个技巧来处理，也是常说的"事件委托"，事件没直接和`li`元素发生关系，而且绑定父元素了。由于浏览器有事件冒泡的这个特性，我们可以在触发`li`的时候把这个事件往上冒泡到`ul`上，因为`ul`上绑定事件响应所以就能够触发这个动作了。

怎么才知道触发的`li`元素是哪一个？

答：通过事件对象。

事件对象是用来记录一些事件发生时的相关信息的对象。事件对象只有事件发生时才会产生，并且只能是事件处理函数内部访问，在所有事件处理函数运行结束后，事件对象就被销毁。


```js
event.target                // 代表当前触发事件的元素
event.type                  // 获取事件的类型
event.pageX event.pageY     // 获取鼠标当前相对于页面的坐标
event.preventDefault()      // 阻止默认行为
event.stopPropagation()     // 阻止事件冒泡
event.which()               // 获取在鼠标单击时，单击的是鼠标的哪个键
event.currentTarget         // 在事件冒泡过程中的当前DOM元素 等同于this
```
`js` 中事件是会冒泡的，所以`this`是可以变化的，但`event.target`不会变化，它永远是直接接受事件的目标`DOM`元素.

`this`和`event.target`都是`dom`对象，使用`$()`将他们转换为`jquery`对象。

[自定义事件](https://www.imooc.com/code/10155) 不常用，遇见了再说。

```js
// 定义事件
$("div").bind("change-color", function () {
    $(this).addClass("color");
});
// 主动触发事件
$("div").trigger("change-color");
```

### 单击事件

```js
$("#test").click(function() {
    //this 指向 div元素
});
$("#test").click(11111, function(e) {
    //e.data  => 11111 传递数据
});
$("#test").click(); // 手动触发
```

与单击事件同样用法的有：

`$("#test").mousedown(fn)` 鼠标按下
`$("#test").mouseup(fn)` 鼠标弹起
`$("#test").mousemove(fn)` 鼠标移动
`$("#test").mouseover(fn)` `mouseenter(fn)` 鼠标移入
`$("#test").mouseout(fn)` `mouseleave` 鼠标移出
`$("#test").focusin()` `focus()` 当一个元素，或者其内部任何一个元素获得焦点的时候，比如表单
`$("#test").focusout()` `blur()` 当一个元素，或者其内部任何一个元素失去焦点的时候
`$("#test").select(fn)` 当 `textarea` 或文本类型的 `input` 元素中的文本被选择时，会发生 `select` 事件


### 鼠标悬停事件

```js
// handlerIn 当鼠标指针进入元素时触发执行的事件函数
// handlerOut 当鼠标指针离开元素时触发执行的事件函数
$(selector).hover(handlerIn, handlerOut);
```

### change 事件

用法与`click`一样，只是要注意：

- **input元素**: 监听value值的变化，当有改变时，失去焦点后触发change事件。对于单选按钮和复选框，当用户用鼠标做出选择时，该事件立即触发。
- **select元素**: 对于下拉选择框，当用户用鼠标作出选择时，该事件立即触发
- **textarea元素**: 多行文本输入框，当有改变时，失去焦点后触发change事件

### 提交表单事件

```html
<input type="submit">
<input type="image">
<button type="submit">
<!-- 以上三种标签，可以触发提交表单 -->
<form id="target" action="destination.html">
  <input type="submit" value="Go" />
</form>
<script>
$("#target").submit(function(data) {
    // this指向 from元素 
   return false; //阻止默认行为，提交表单
});
</script>
```

### 键盘事件

`keydown` 与 `keyup` `keypress`事件。

```js
$elem.keydown( handler(eventObject) )               // 直接绑定事件
$elem.keydown( [eventData ], handler(eventObject) ) // 传递参数
$elem.keydown()                                     // 手动触发已绑定的事件
```

resize，scroll,unload，error

## 核心方法

```js
// each 就是 for 循环方法的一个包装，内部就是通过 for 遍历数组与对象
// 可以很方便的遍历一个数据，不需要考虑这个数据是对象还是数组
$.each(["Aaron", "慕课网"], function(index, value) {
    // index是索引,也就是数组的索引
    // value就是数组中的值了
    return false; // 停止迭代
});

// 如果要判断数组中是否存在指定值，你需要通过该函数的返回值不等于(或大于)-1来进行判断
$.inArray(5,[1,2,3,4,5,6,7]) // 返回对应的索引：4

$.trim(str);   // 去除字符串两边的空白字符 backspace tab \n \r
```

## Ajax 支持

```js
// 加载 HTML 文本
$.load( url, function() {
    // ...
});

// 加载 json 数据
$.getJSON(url,function(){
    // ...
});

// 异步请求并执行服务器中的 JS 脚本
$.getScript(url,function(){
    // ...
});
```

```js
// 使用 GET 请求获取数据
$.get(url,function(data){
    // ...
},"json");

// 使用 POST 发送数据，并且处理返回
$.post( url, {
        num:$("#txtNumber").val()
    },
    function(data){
        // ...
    },"json" );

// 底层方法
$.ajax( {
            url: url ,
            data: {},
            dataType: "json",
            method: 'post',
            success: function (data, textStatus,xmlHttpRequest) {
                //do something...
            },
            complete: function (XHR, TS) {
                XHR = null; // 释放 ajax 对象内存
            }
        } );

$(selector).serialize(); // 将表单中 name => value 序列化，生成标准URL编码字符串，直接可用于ajax请求
$.ajaxSetup([dataType:"json"])        // ajax 全局化设置
$(selector).ajaxStart(function(){})   // ajax 执行前调用的函数
$(selector).ajaxStop(function(){})    // ajax 执行完后调用的函数
```

## 剩下的

```js
$("#mydiv")
    |
    |---hide([time,callback]);隐藏一个节点,time是隐藏花费的时间,callback隐藏后需要执行的函数
    |---show([time,callback]); 显示一个节点,(设置display为block)
    |
    |---事件
    |---bind('click mouseout',[data],func);绑定点击,鼠标移出事件
    |---one(event,[data],fun) 绑定一次性事件
    |---hover(func1,func2);鼠标移入,移出事件,切换
    |---toggle(func1,func2,func3);第一次click执行func1,第二次click执行func2,依次类推,循环执行
    |---unbind('click',fun) 移除click事件
    |---trigger(event) 触发元素的某个事件
    |
    |---动画
    |---$(selector).slideUp(speed,[callback]);向上滑动隐藏掉节点
    |---$(selector).slideDown(speed,[callback]);向下滑动显示节点
    |---$(selector).slideToggle(speed,[callback])；自动判断向下，还是向上滑
    |---$(selector).fadeIn(speed,[callback]) 渐入
    |---$(selector).fadeOut(speed,[callback]) 渐出
    |---$(selector).fadeTo(speed,opacity,[callback]) 可以控制元素最后消失时的透明度
    |---$("span").animate({width: "80px",height: "80px"},3000, function () {});渐渐变大到80px正方形
    |---$("span").animate({left: "+=100px"},3000, function () {});渐渐向右移动100px
    |---$(selector).stop(); 立即停掉当前元素的所有动画
    |---$(selector).delay(time);将元素的动画延迟time毫秒,再继续执行
```

### data-xxx 自定义属性

`data()`允许我们在`DOM`元素上绑定任意类型的数据。

```js
.data( key, value )
.data( obj )
.data( key )
.data()
<div data-role="page" data-last-value="43" data-hidden="true" data-options='{"name":"John"}'></div>
<script>
// 下面代码都是返回true的
$("div").data("role")==="page";
$("div").data("lastValue")===43;
$("div").data("hidden")===true;
$("div").data("options").name==="John";
</script>
```

## jquery.cookie.js 操作web客户端cookie

```javascript
$('#create_cookie').on('click',function(){
    // $.cookie('name', 'value');
    $.cookie('name', 'codekissyoung', { expires: 7, path: '/' });
});

$('#read_cookie').on('click',function(){
    console.log($.cookie('name')); // => "value"
});

$('#delete_cookie').on('click',function(){
    console.log($.removeCookie('name',{path:'/'})); //true
});
```

## 事件处理

.on()方法事件处理程序到当前选定的jQuery对象中的元素。在jQuery 1.7中，.on()方法 提供绑定事件处理的所有功能。
为了帮助从旧的jQuery事件方法转换过来，查看 .bind(), .delegate(), 和 .live(). 
要删除的.on()绑定的事件，请参阅 .off()。要绑定一个事件，并且只运行一次，然后删除自己， 请参阅.one()
也就是说 , 新版的 事件绑定变了 bind( )  live()  delegate ( ) 
都要被替换成 on onclick 事件，直接写成触发一个函数！

这个应该是最原始的吧！

```js
<button class="add_event_product　btn btn-xs btn-danger" value="14" onclick="un_publish(this);">
不发布
</button>
```

值改变就触发的事件

```js
<form action="">
	<input type = 'text'>
</form>
<script type="text/javascript">
$("input").change(1995,function(c) {
    console.log(c.data); //1995
    var a = $(this).val();
    alert("change now !"+a);
});
</script>
```

绑定事件  :  点击或鼠标移出就不可以用了

```js
<input id="btntest" type="button" value="点击或移出就不可用了" />
<script type="text/javascript">
    $(function () {
        $("#btntest").bind("click mouseout", function () {
            $(this).attr("disabled", "true");
        })
    });
</script>
```

鼠标移入,移出执行函数

```js
<div>别走！你就是土豪</div>
<script type="text/javascript">
$(function () {
    $("div").hover(
    function () {
        $(this).addClass("orange");  //鼠标移入,执行函数
    },
    function () {
        $(this).removeClass("orange") //鼠标移出,执行寒酸
    })
});
</script>
```

移除绑定的事件

```js
<h3>unbind()移除绑定的事件</h3>
<input id="btntest" type="button" value="移除事件" />
<div>土豪，咱们交个朋友吧</div>

<script type="text/javascript">
    $(function () {
        $("div").bind("click",
        function () {
            $(this).removeClass("backcolor").addClass("color");
        }).bind("dblclick", function () {
            $(this).removeClass("color").addClass("backcolor");
        })
        $("#btntest").bind("click", function () {
            $("div").unbind("click dbclick");  //移除绑定了的事件
            $(this).attr("disabled", "true");
        });
    });
</script>
```

绑定只会触发一次的事件

```js
<h3>one()方法执行一次绑定事件</h3>
<div>请点击我一下</div>
        <script type="text/javascript">
            $(function () {
                var intI = 0;
                $("div").one("click", function () {
                    intI++;
                    $(this).css("font-size", intI + "px");
                })
            });
</script>
```

主动触发绑定的事件

```js
<h3>trigger()手动触发事件</h3>
<div>土豪，咱们交个朋友吧</div>
<script type="text/javascript">
            $(function () {
                $("div").bind("change-color", function () {
                    $(this).addClass("color");
                });
                $("div").trigger("change-color");//主动触发 div 的 change-color 事件
            });
</script>
```

文本框的 获得焦点 和失去焦点事件

```js
<h3>表单中文本框的focus和blur事件</h3>
<input id="txtest" type="text" value="" />
        <div></div>
        <script type="text/javascript">
            $(function () {
                $("input")
                .bind("focus", function () {
                    $("div").html("请输入您的姓名！");
                });//获得焦点事件

                $("input").bind("blur", function () {
                    if ($(this).val().length == 0)
                        $("div").html("你的名称不能为空！");
                }); //失去焦点事件
            });
</script>
```

下拉框的值改变时触发的事件

```js
<h3>下拉列表的change事件</h3>
<select id="seltest">
    <option value="葡萄">葡萄</option>
    <option value="苹果">苹果</option>
    <option value="荔枝">荔枝</option>
    <option value="香焦">香焦</option>
</select>
<script type="text/javascript">
    $(function () {
        $("#seltest").bind("change", function () {
            if ($(this).val() == "苹果")
                $(this).css("background-color", "red");
            else
                $(this).css("background-color", "green");
        })
    });
</script>
```
