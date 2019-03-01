# 选择器
```javascript
$("*"); // 全选选择器
$("#my_id"); // id选择器
$("p"); //  标签选择器
$(".class"); // 类选择器
$("#my_id,p,.class"); // 多选
$("ance[空格]desc"); // 后代选择器
$("parent>child"); // 子类选择器
$("prev+next"); // 下一个元素选择器
$("prev~siblings"); // 选择prev之后所有同一层级的元素
$("li:first"); // 过滤出第一个li
$("li:last"); // 过滤出最后一个li
$("li:eq(2)"); // 过滤出任意第三个li
$("li:contains('土豪')"); // 过滤出节点的包含"土豪"文本的li
$("li:has('p')"); // 过滤出含有p的li元素 格式 :has(selector)
$("li:hidden"); // 过滤出不可见元素 过滤可见:visible
$("li[title]"); // 过滤出含有某属性的元素
$("li[title='我最爱']"); $("li[title!='我最爱']"); //  属性过滤选择器
$("li[title*='最']"); // 属性值包含选择器
$("li:first-child"); // 选择第一个子元素 可能li里面就是文本了,那么就是文本节点 ,`:last-child`是最后一个子元素
```

# 表单元素选择器
```javascript
$("#frmTest :input").addClass("bg_blue"); // 获取input表单
$("#frmTest :text").addClass("bg_blue"); // 获取type是text的表单
$("#frmTest :password").addClass("bg_red"); // 获取type是password的表单
$("#frmTest :radio").attr("disabled","true"); // 获取radio元素
$("#frmTest :checkbox").attr("disabled","true"); // 获取checkbox元素
$("#frmTest input:submit").addClass("bg_red"); // 获取submit提交按钮
// <input type="image" src="http://img.mukewang.com/52b284ea00016b2902590070.jpg"/>
$("#frmTest :image").addClass("bg_red"); // 获取图像域的图片 
$("#frmTest :button").addClass("bg_blue"); // 获取type=button的input和<button>
$("#frmTest :checked").attr("disabled", true); // 获取已经checked的元素
$("#frmTest :selected"); // 获取下拉框中被选中的元素
```

# dom 操作
```javascript
$("#mydiv")
    |
    |---get(0);转换选中的第一个元素为js原生dom对象,等价于`var mydom = $jq[0];`
    |---if($('#box').length>0) 判断是否选中节点
    |---hide([time,callback]);隐藏一个节点,time是隐藏花费的时间,callback隐藏后需要执行的函数
    |---show([time,callback]); 显示一个节点,(设置display为block)
    |---html(str); 设置|获取 一个或多个节点内的innerHTML
    |---text([str]); 设置|获取元素里面的纯文本
    |---val([str]); 设置|获取表单元素里面的value值
    |---attr("disabled","true");设置|获取属性
    |---removeAttr('href'); 移除href属性
    |---css({"background-color":"red","color":"white"});设置css值
    |---css([name1,name2,name3]);获取css值
    |---addClass("class class2 class3"); 添加class
    |---removeClass("class1 class2"); 移除class
    |
    |
    |---each(function(index){if(index == 1){ $(this).attr("class",'red');}});
    |---遍历,index是第几个,this指代当前传入的js的原生dom对象
    |
    |---append("<div>往节点里面后边添加内容</div>");
    |---prepend("<div>往节点里面前边插入内容</div>");
    |---$("<div>添加到</div>").appendTo($("body"));
    |---$("#box").before("<div>插入到#box元素前面</div>");
    |---$("#box").after("<div>插入到#box元素后面</div>");
    |---clone() 返回一个复制的该节点
    |---$("#box").replaceWith("<div>newbox</div>");替换节点
    |---$("<div>newbox</div>").replaceAll($("#box"));替换节点
    |---remove(); 移除本节点
    |---empty(); 清空该节点内的内容
    |---$("p").wrap("<div></div>"); // <div><p>......</p></div>
    |---$("p").wrapInner("<i></i>"); // <p><i>.....</i></p>
    |
    |
    |
    |---事件
    |---bind('click mouseout',[data],func);绑定点击,鼠标移出事件
    |---one(event,[data],fun) 绑定一次性事件
    |---hover(func1,func2);鼠标移入,移出事件,切换
    |---toggle(func1,func2,func3);第一次click执行func1,第二次click执行func2,依次类推,循环执行
    |---unbind('click',fun) 移除click事件
    |---trigger(event) 触发元素的某个事件
    |
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
    |
    |
    |---$.ajax({ url:url ,data:{},dataType:"json",method:'post',
    |            success: function (data, textStatus,xmlHttpRequest) {
    |          	           //do something...
    |            },
    |            complete: function (XHR, TS) { XHR = null }/*释放 ajax 对象内存*/
    |          });
    |---$.ajaxSetup([dataType:"json"]) ajax 全局化设置
    |---$(selector).ajaxStart(function()) ajax 执行前调用的函数
    |---$(selector).ajaxStop(function()) ajax 执行完后调用的函数
```

# 事件类型
blur(表单失去焦点)focus(表单获取焦点),resize,change(元素的value改变时)
scroll,unload,click,dblclick,mousedown,mouseup,mousemove,mouseout
mouseenter,mouseleave,,select,submit,keydown,keypress,keyup,error

# 自定义事件
```javascript
$("div").bind("change-color", function () {
    $(this).addClass("color");
});
$("div").trigger("change-color");
```

# data-xxx 自定义属性

jquery的data()方法存取data-xxx 定义属性，方法允许我们在DOM元素上绑定任意类型的数据,避免了循环引用的内存泄漏风险。

```javascript
.data( key, value )
.data( obj )
.data( key )
.data()
<div data-role="page" data-last-value="43" data-hidden="true" data-options='{"name":"John"}'></div>
```
下面代码都是返回true的

```javascript
$("div").data("role")==="page";
$("div").data("lastValue")===43;
$("div").data("hidden")===true;
$("div").data("options").name==="John";
```


# jquery.cookie.js 操作web客户端cookie

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

# 事件处理
.on()方法事件处理程序到当前选定的jQuery对象中的元素。在jQuery 1.7中，.on()方法 提供绑定事件处理的所有功能。为了帮助从旧的jQuery事件方法转换过来，查看 .bind(), .delegate(), 和 .live(). 要删除的.on()绑定的事件，请参阅.off()。要绑定一个事件，并且只运行一次，然后删除自己， 请参阅.one()
也就是说 , 新版的 事件绑定变了.......... bind( )  live()  delegate ( ) 都要被替换成 on
onclick 事件，直接写成触发一个函数！这个应该是最原始的吧！
```javascript
<button class="add_event_product　btn btn-xs btn-danger" value="14" onclick="un_publish(this);">
不发布
</button>
```
值改变就触发的事件
```javascript
<form action="">
	<input type = 'text'>
</form>
<script type="text/javascript">
$("input").change(1995,function(c) {
	  console.log(c.data);//1995
	  var a = $(this).val();
	  alert("change now !"+a);
	});
</script>
```

绑定事件  :  点击或鼠标移出就不可以用了
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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
