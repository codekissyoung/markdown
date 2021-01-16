# 类型检测
`alert(obj instanceof Array)` 判断obj在其原型链上是否有Array原型
`Object.prototype.toString.apply([]) === "[Object Array]";` 判断是否是Arrayd对象
`Object.prototype.toString.apply(function(){}) === "[Object Function]";` 判断是否为函数对象

# 对象属性
`for(var i in obj){console.log(obj[i]);}` 枚举对象属性
`function foo{}` 就是定义一个函数对象
`foo.prototype.z = 3;` 就是给它的原型加属性
`var obj = new foo();` 就是实例化一个foo对象
`obj.a = 10;` 添加对象自有属性
`console.log(obj.a);` 访问对象自有属性 `console.log(obj.z);` 访问对象从原型链继承到的属性
`obj.hasOwnProperty('z');` false 判断是否为对象自有属性,而不是从原型链里拿到的;
`obj.z = 5;` 是给obj动态添加一个属性z
`console.log(obj.prototype.z);//3;` 而原型链里的z并没有改变
`delete obj.z;` 是删除obj的动态属性z,原型里面的z是无法通过delete obj.z删除的

# 原型链
`var obj = Object.create({x:1});` 创建对象：原型链是： obj ---> {x:1} ----> Object prototype ----> null
`obj.toString();` // function
`var obj = Object.create(null);` 原型链是：obj ---> null;
`obj.toString;` //undefined

# 属性标签
`console.log(Object.getOwnPropertyDescriptor({pro:'aaa'},'pro'));`
`//Object {value: 'aaa', writable: true, enumerable: true, configurable: true}`
writable   决定pro是否可写
enumerable 决定该属性是否可枚举
configurable决定属性是否可删

# 创建属性
```js
var cat = {};
Object.defineProperty(cat,'price',{enumerable:false,value:1000,writable:false,configurable:false});
console.log(cat.propertyIsEnumerable('price'));    //是否可枚举
console.log(cat.hasOwnProperty('price'));          //是否自有属性
cat.price = 20;                                    //尝试改变属性的值
console.log(cat.price);
console.log(delete cat.price);                    //尝试删除属性
console.log(cat.price);
for(var i in cat){ console.log(cat[i]);}          //枚举属性
```
# 一次创建多个属性
```js
var person = {};
Object.defineProperties(person,{
    	title:{value:'fe',enumerable:true},
    	corp:{value:"BABA",enumerable:true},
    	salary:{value:10000,enumerable:true,writable:true},
    	luck:{
        	 get:function(){
        	    	 return Math.random() > 0.5?'good':'bad';
    	    	},
    	},
    	promote:{
        	 set:function(level){
        	    	 this.salary *= 1 + level*0.1;
    	    	},
    	    	get:function(){
    	        	 return this.salary;
    	    	}
    	}
});
console.log(person.salary);
console.log(person.luck);	 //属性使用get方法获得
person.promote = 2;	 //属性使用set方法,设置的值传给level了
console.log(person.promote);	//访问属性会调用get方法
```
* 读属性
`var yz = obj && obj.y && obj.y.z;`
`var default = obj[b] || 'default';`

* 删属性
`delete obj.a;`
` delete Object.prototype;`//false 不能删除prototype属性
`var descriptor = Object.getOwnPropertyDescriptor(Object,'prototype');`
`descriptor.configurable;`//false 该属性决定属性是否可删除
delete 只能删除对象的属性,不能删除全局变量和局部变量

* 查找属性
`console.log(cat.propertyIsEnumerable('legs'));` true 说明是可以枚举的(被for...in输出)
`console.log(cat.propertyIsEnumerable('toString'));` false  不可枚举
`legs in cat ;`//true 会查找原型链 `cat.hasOwnProperty('legs');`//只查找obj的自有属性
`Object.keys(cat)` 返回cat里面所有可枚举的属性的key

# 对象标签
* [[proto]]
    [[proto]]指向Object.prototype对象
* [[class]]
```
function A(){
    this.a = 11;
}
var toString = Object.prototype.toString;    //拿到toString函数
function getType(o){return toString.call(o).slice(8,-1);}    //对象冒充,调用函数,slice是取第8个字符到倒数第一个
console.log(getType(null));	 //Null
console.log(getType(undefined));	//Undefined
console.log(getType(1));	//Number
console.log(getType('aaa'));	//String
console.log(getType(new Boolean(true)));	//Boolean
console.log(getType(new A()));	// object
```
* [[extensible]]

```
var obj = {x:1,y:2};
console.log(Object.isExtensible(obj));	//true
Object.preventExtensions(obj);	//设置对象不可再增加属性了
console.log(Object.isExtensible(obj));	//false
obj.z = 1;
console.log(obj.z);	//undefined
console.log(Object.getOwnPropertyDescriptor(obj,'x'));

console.log(Object.isSealed(obj)); //false
Object.seal(obj);	//设置对象属性不可再删除
console.log(Object.isSealed(obj)); //true
console.log(Object.getOwnPropertyDescriptor(obj,'x'));

console.log(Object.isFrozen(obj));	//false
Object.freeze(obj);	//设置对象属性不可再修改值
console.log(Object.isFrozen(obj));	//true
console.log(Object.getOwnPropertyDescriptor(obj,'x'));
```

# 对象的序列化
```
var obj = {x:1,y:true,z:[1,2,3],nullVal:null,undef:undefined};
//undefined不会出现在序列化字符串里
console.log(JSON.stringify(obj));	//{"x":1,"y":true,"z":[1,2,3],"nullVal":null}

var obj2 = JSON.parse('{"x":1}');
console.log(obj2.x);	//1
```
toJSON方法
```
var obj = {
    	 x:1,
    	 y:2,
    	 o:{
        	 o1:1,
        	 o2:2,
        	 toJSON:function(){
        	    	 return this.o1 + this.o2;
        	 }
    	 }
}
console.log(JSON.stringify(obj));
```
#toString 和 valueOf
对象被当做字符串使用时,会先自动调用valueOf看是否能返回为原始类型,若不能再调用toString方法
```js
var obj = {x:1,y:2};
console.log(obj.toString()); //[object Object]

obj.toString = function (){return this.x + this.y;}
console.log("Result : " + obj); //Result : 3

obj.valueOf = function(){return this.x + this.y + 100;}
console.log("Result : " + obj);	//Result : 103
```


## 面向对象编程
不需要定义全局函数去操作不同的数据类型，而是数据类型本身具有方法去操作自身的值，是`a.sort()`,而不是`sort(a);`

js 动态加载的特性，将匿名函数内部对象设置为 window 对象的属性，从而暴露接口
```
(function(){
	window.cky = {name:"caokaiyan"};
	cky.print = function (){
		console.log("i am "+this.name+" and i am "+this.age+" years old!");
	}
})();
cky.age = 20;//注释掉这句后，print 就报错了
console.log(cky);
cky.print();
```
对象的原型链　很重要，因为它决定了你的对象　继承了　哪些属性　和　方法　！
```
var book = {
		topic:'javascript',
		fat:10,
		line:[32,43,53,64],
		total:function(){
			console.log(this.fat);
		}
}
console.log(book);
book.author = 'caokaiyan';　//动态添加对象的属性
console.log(book);
```
注释 里：使用 this , p1 会变成成员变量，而使用 var 只会成为函数的 局部变量，函数调用完就销毁了，而成员变量只有在对象 unset 的时候才销毁！
```
var point = [{x:1,y:3},{x:1,y:4}];
point.dist = function(){
	//this.p1 = this[0];
	//this.p2 = this[1];
	//var res = this.p1.x * this.p2.x + this.p1.y*this.p2.y;
	var p1 = this[0];
	var p2 = this[1];
	var res = p1.x * p2.x + p1.y * p2.y;
	console.log(res);
	return res;
}
console.log(point);
point.dist();
```
简单的面向对象的一个例子
```javascript
var Point =function(x,y){
	this.x = x;
	this.y = y;
}
console.log(Point); //Point 函数
var point = new Point(2,3);
console.log(point); // point 对象
//console.log(point.r()); //报错，因为此时 r() 还未定义
Point.prototype.r = function(){
	return this.x * this.y;
}
console.log(point.r());
```

简单构造函数
```javascript
function a(){
	this.b = function(){
		console.log("i am b");
		c();
	}
	function c(){
		console.log("i am c");
	}
	var d = function(){
		console.log("i am d");
	}
	this.e = "i am e";
	var f = "i am f";
}
a.prototype.g = function(){
	console.log("i am g");
}
var cky = new a();
cky.b();	//i am b
cky.c();//Uncaught TypeError: cky.c is not a function
cky.d();//Uncaught TypeError: cky.d is not a function
console.log(cky.e);  //i am e
console.log(cky.f);  //undefined
cky.g();	//i am g
```
