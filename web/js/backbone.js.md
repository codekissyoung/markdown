# 概述
- 依照Backbone进行代码结构组织，将页面中的数据，逻辑，视图解耦
- Backbone `Model` 可以被继承，可以方便的重载和拓展自定义方法
- 内置与服务器交互规则(基于REST架构)，数据同步工作在Model中自动进行，前端开发人员只需对客户端数据进行操作，Backbone会自动将操作的数据同步到服务器
- Backbone中的 `view` 将用户事件和处理事件的方法有序的组织起来
- 使用 `Underscore` 轻量级模板解析,帮助我们更好的分离视图结构与逻辑，还可以将视图中的 HTML 结构独立管理，比如不同状态显示不同的HTML结构，写成模板，按需加载
- 自定义事件管理，`model.on('xx',function(){...})` 自定义事件 , `model.trigger('xx')` 触发事件


# 事件管理 Events
- Events是Backbone中所有其它模块的基类，无论是Model、Collection、View还是Router和History，都继承了Events中的方法。
- Events为其它的模块提供了事件管理相关的方法，包括on、off和trigger
- 我们无法直接实例化一个Events对象，因为它必须要依赖于Backbone中的某一个模块类（或子类）才能使用

```js
// 创建一个Model的实例  
var m = new Backbone.Model();
// 将监听函数绑定到m对象的自定义事件custom中  
m.on('custom', function(index) {  
    // 监听函数接收并显示参数index  
    alert(index);  
});  
// 循环触发m对象的custom事件  
for(var i = 0; i < 3; i++) {  
    m.trigger('custom', i);  
}  
// 从m对象的custom事件中移除已绑定的所有监听函数  
m.off('custom');  
// 试着再次触发custom事件  
m.trigger('custom', i);  
```

- all 是Backbone中一个特殊的事件，它在当前对象触发任何事件之后，都会被自动触发
- 同一个事件中如果绑定了多个监听函数，那它们将按照函数绑定时的顺序依次调用
- 在Backbone内部，会为每个对象添加一个`_callbacks` 私有属性，用于记录该对象中绑定的事件和监听函数列表。Events类的on、off和trigger方法都围绕每个对象的_callbacks列表在操作

```js
var m = new Backbone.Model();  
m.on('all', function() {  
    alert('all');  
});  
m.on('show', function() {  
    alert('show title');  
});  
m.on('show', function() {  
    alert('show content');  
});  
m.on('hide', function() {  
    alert('hide');  
});

m.trigger('show');  
m.trigger('hide');
// 执行结果
// show title
// show content
// all
// hide
// all
```

# Model 数据模型
- Model是Backbone中所有数据模型的基类，用于封装原始数据，并提供对数据进行操作的方法，我们一般通过继承的方式来扩展和使用它。
- 如果你做过数据库开发，可能对ORM（对象关系映射）不会陌生，而Backbone中的Model就像是映射出来的一个数据对象，它可以对应到数据库中的某一条记录，并通过操作对象，将数据自动同步到服务器数据库。
- Backbone模块类（包括子类）都包含一个extend静态方法用于实现继承。给extend方法传递的第一个参数应该是一个对象，对象中的属性和方法将被添加到子类，我们可以通过extend方法扩展子类或重载父类的方法。
- 我们可以在定义模型类、实例化模型对象、和调用set()方法来设置模型中的数据
- 当模型中数据发生改变时，会触发change事件和属性事件
- 我们可以定义validate方法对模型中的数据进行验证
- 通过调用save()、fetch()和destroy()方法可以让模型中的数据与服务器保持同步，但在此之前必须设置url或urlRoot属性

```js
// 定义Book模型类  
var Book = Backbone.Model.extend({  
    defaults : {  
        name : 'unknown',  
        author : 'unknown',  
        price : 0  
    }  
});
// 实例化模型对象  
var javabook = new Book({  
    name : 'Thinking in Java',  
    author : 'Bruce Eckel',  
    price : 395.70  
});  
```

# collection
- 如果将一个Model对象比喻成数据库中的一条记录，那么Collection就是一张数据表。它表示为一个模型集合类，用于存储和管理一系列相同类型的模型对象
- 集合用于组织和管理多个模型，但它并不是必须的，如果你的某个模型对象是唯一的（单例），那么你没必要将它放到集合中
- 如果你的集合类仅仅是用于简单地存储和管理模型对象，且Backbone.Collection类所提供的方法已经可以满足你的要求，那么你可以直接实例化一个Backbone.Collection
```js
// 定义模型类  
var Book = Backbone.Model.extend({  
    defaults : {  
        name : ''  
    }  
});  
// 定义集合类  
var BookList = Backbone.Collection.extend({  
    model : Book  
});  
// 创建一系列模型对象  
var book1 = new Book({  
    name : 'Effective Java中文版(第2版)'  
});  
var book2 = new Book({  
    name : 'JAVA核心技术卷II：高级特性（原书第8版）'  
});  
var book3 = new Book({  
    name : '精通Hibernate：Java对象持久化技术详解（第2版）'  
});  
// 创建集合对象  
var books = new BookList([book1, book2, book3]);  
```

- 原始数据和模型对象的自动转换

```js

// 定义模型类  
var Book = Backbone.Model.extend({  
    defaults : {  
        name : ''  
    }  
});
// 定义集合类  
var BookList = Backbone.Collection.extend({  
    model : Book  
});
var models = [{  
    name : 'Effective Java中文版(第2版)'  
}, {  
    name : 'JAVA核心技术卷II：高级特性（原书第8版）'  
}, {  
    name : '精通Hibernate：Java对象持久化技术详解（第2版）'  
}];
// 创建集合对象  
var books = new BookList(models); 

// 或者 也可以直接使用 Collection 基类创建对象
var books = new Backbone.Collection(models, {  
    model : Book  
});
```

- `push()` `add()` 将模型追加到集合尾部
- `unshift()`      将模型插入到集合头部
- `remove()`       从集合中移除一个或多个指定的模型对象
- `pop()`          移除集合尾部的一个模型对象
- `shift()`        移除集合头部的一个模型对象
- `fetch()`        用于从服务器接口获取集合的初始化数据，覆盖或追加到集合列表中
- `create()`       在集合中创建一个新的模型，并将其同步到服务器



# view
```js
events:{
    'click #save': 'add', // 单击id为 'save' 的元素，执行视图的 add 方法
}
```
- 处理页面以及简单的页面逻辑的
- 在表达式中，事件:( click、mouseover、keypress等) , 元素：jQuery支持的任意选择器（如标签选择器、id选择器、class选择器等）。View自动将事件绑定到选择器元素，事件被触发后，自动调用方法。
- 使用视图（View）将这些数据渲染到界面，管理界面事件和逻辑
- 即使是特别复杂的视图类，它也应该仅仅是做界面事件、和渲染逻辑相关的操作，数据管理应该交由Model和Collection来完成，而业务逻辑应该由其它的类来完成

# 路由器
```js
var CustomRouter = Backbone.Router.extend({  
    routes : {  
        '' : 'index', // 当URL Hash在根目录时执行index方法：url#  
        'list' : 'getList', // 当URL Hash在list节点时执行getList方法：url#list  
        'detail/:id' : 'query', // 当URL Hash在detail节点时执行query方法，并将detail后的数据作为参数传递给query方法：url#list/1001  
        '*error' : 'showError' // 当URL Hash不匹配以上规则时, 执行error方法  
    },  
    index : function() {  
        alert('index');  
    },  
    getList : function() {  
        alert('getList');  
    },  
    query : function(id) {  
        alert('query id: ' + id);  
    },  
    // 当URL Hash发生变化时，会执行所绑定的方法，当遇到没有定义的Hash时，都会 执行showError方法，并将未定义的Hash传递给该方法
    showError : function(error) {  
        alert('error hash: ' + error);  
    }, 
});
var custom = new CustomRouter();  
Backbone.history.start();
// 在浏览器中输入
// URL
// URL#list
// URL#detail/1001
// URL#hash1
// URL#hash2
```
- 在单页应用中，我们通过JavaScript来控制界面的切换和展现，并通过AJAX从服务器获取数据。可能产生的问题是，当用户希望返回到上一步操作时，他可能会习惯性地使用浏览器“返回”和“前进”按钮，而结果却是整个页面都被切换了，因为用户并不知道他正处于同一个页面中。
- 对于这个问题，我们常常通过Hash（锚点）的方式来记录用户的当前位置，并通过onhashchange事件来监听用户的“前进”和“返回”动作，但我们发现一些低版本的浏览器（例如IE6）并不支持onhashchange事件。对于不支持onhashchange的低版本浏览器，会通过setInterval心跳监听Hash的变化
- Backbone提供了路由控制功能，通过Backbone提供的路由器，我们能通过一个简单的表达式将路由地址和事件函数绑定在一起


# 资料
- [御剑神兵backbone.js](http://yujianshenbing.iteye.com/)
- [the5fire的技术博客backbone.js](https://www.the5fire.com/tag/backbone/)