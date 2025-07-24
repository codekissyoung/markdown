# JavaScript对象基础知识

## 概述

对象是JavaScript的核心概念，类似于现实生活中的"物品"。就像一辆车有颜色、品牌、型号等属性，还有启动、刹车等功能一样，JavaScript对象也有属性和方法。

## 1. 对象基础

### 创建对象

```javascript
// 对象字面量（最常用）
let car = {
    brand: "Toyota",
    model: "Camry",
    year: 2023,
    start: function() {
        console.log("发动机启动");
    }
};

// 构造函数方式
let car2 = new Object();
car2.brand = "Honda";
car2.model = "Civic";
```

### 访问对象属性

```javascript
let user = {
    name: "张三",
    age: 30,
    "favorite color": "blue"  // 属性名有空格需要用引号
};

// 点语法
console.log(user.name);       // "张三"
console.log(user.age);        // 30

// 方括号语法（可以访问动态属性名）
console.log(user["name"]);    // "张三"
console.log(user["favorite color"]); // "blue"

// 动态属性访问
let prop = "age";
console.log(user[prop]);      // 30
```

### 修改和添加属性

```javascript
let person = {
    name: "李四"
};

// 修改现有属性
person.name = "王五";

// 添加新属性
person.age = 25;
person.greet = function() {
    return "你好！";
};

console.log(person); // {name: "王五", age: 25, greet: ƒ}
```

### 删除属性

```javascript
let obj = {
    a: 1,
    b: 2,
    c: 3
};

delete obj.b;
console.log(obj); // {a: 1, c: 3}

// 检查属性是否存在
console.log("b" in obj);      // false
console.log("a" in obj);      // true
console.log(obj.hasOwnProperty("a")); // true
```

## 2. 对象引用和复制

### 引用特性（重要概念）

```javascript
// 基本类型按值传递
let a = 5;
let b = a;
a = 10;
console.log(b); // 5 (b不受影响)

// 对象按引用传递
let obj1 = {name: "张三"};
let obj2 = obj1;  // obj2指向同一个对象
obj1.name = "李四";
console.log(obj2.name); // "李四" (obj2受影响！)

// 比较也是比较引用
let user1 = {name: "张三"};
let user2 = {name: "张三"};
console.log(user1 == user2);  // false (不是同一个对象)
console.log(user1 === user2); // false
```

### 对象复制

```javascript
// 浅拷贝
let original = {
    name: "张三",
    age: 30
};

// 方法1：Object.assign()
let copy1 = Object.assign({}, original);

// 方法2：展开语法（推荐）
let copy2 = {...original};

copy1.name = "李四";
console.log(original.name); // "张三" (原对象不受影响)

// 深拷贝问题
let person = {
    name: "张三",
    address: {
        city: "北京",
        district: "朝阳区"
    }
};

let shallowCopy = {...person};
shallowCopy.address.city = "上海";
console.log(person.address.city); // "上海" (嵌套对象还是引用！)

// 简单深拷贝（有限制）
let deepCopy = JSON.parse(JSON.stringify(person));
```

## 3. 对象方法和this

### 方法定义

```javascript
let calculator = {
    a: 10,
    b: 5,
    
    // 方法
    add: function() {
        return this.a + this.b;
    },
    
    // 简写语法
    subtract() {
        return this.a - this.b;
    },
    
    // 箭头函数（注意：没有自己的this！）
    multiply: () => {
        // this不指向calculator！
        return this.a * this.b; // undefined
    }
};

console.log(calculator.add());      // 15
console.log(calculator.subtract()); // 5
```

### this关键字

```javascript
let user = {
    firstName: "张",
    lastName: "三",
    
    getFullName() {
        return this.firstName + this.lastName; // this指向user
    },
    
    greet: function() {
        console.log("你好，我是" + this.firstName + this.lastName);
    }
};

console.log(user.getFullName()); // "张三"
user.greet(); // "你好，我是张三"

// this的动态绑定
let sayHello = user.greet;
sayHello(); // "你好，我是undefinedundefined" (this指向window/undefined)

// 解决方案：bind
let boundGreet = user.greet.bind(user);
boundGreet(); // "你好，我是张三"
```

## 4. 构造函数和new操作符

### 构造函数

```javascript
// 构造函数（首字母大写是约定）
function Car(brand, model, year) {
    this.brand = brand;
    this.model = model;
    this.year = year;
    
    this.start = function() {
        console.log(this.brand + " " + this.model + " 启动了");
    };
}

// 使用new创建对象
let myCar = new Car("Toyota", "Camry", 2023);
let yourCar = new Car("Honda", "Civic", 2022);

console.log(myCar.brand); // "Toyota"
myCar.start(); // "Toyota Camry 启动了"
```

### new操作符的工作过程

```javascript
// 当执行 new Car("Toyota", "Camry", 2023) 时：
function Car(brand, model, year) {
    // 1. 创建一个新的空对象
    // let this = {};
    
    // 2. 执行构造函数代码
    this.brand = brand;
    this.model = model;
    this.year = year;
    
    // 3. 返回this
    // return this;
}
```

### 检测构造函数

```javascript
function User(name) {
    this.name = name;
}

let user = new User("张三");

console.log(user instanceof User); // true
console.log(user.constructor === User); // true
```

## 5. 可选链操作符 "?."

### 解决嵌套属性访问问题

```javascript
// 传统方式：容易出错
let user = null;
console.log(user.address.street); // TypeError: Cannot read property 'address' of null

// 传统的安全访问
if (user && user.address && user.address.street) {
    console.log(user.address.street);
}

// 可选链（ES2020）
console.log(user?.address?.street); // undefined (不会报错)

// 实际应用
let user = {
    name: "张三",
    address: {
        city: "北京",
        street: "长安街"
    }
};

console.log(user?.address?.street);   // "长安街"
console.log(user?.address?.zipCode);  // undefined
console.log(user?.phone?.mobile);     // undefined
```

### 可选链的其他用法

```javascript
let user = {
    name: "张三",
    admin() {
        console.log("管理员操作");
    }
};

// 可选方法调用
user.admin?.(); // "管理员操作"
user.regular?.(); // undefined (不会报错)

// 可选数组访问
let users = null;
console.log(users?.[0]?.name); // undefined

let userList = [{name: "张三"}, {name: "李四"}];
console.log(userList?.[0]?.name); // "张三"
```

## 6. Symbol类型

### Symbol基础

```javascript
// 创建Symbol
let id1 = Symbol("id");
let id2 = Symbol("id");

console.log(id1 === id2); // false (每个Symbol都是唯一的)

// 用作对象属性
let user = {
    name: "张三",
    [id1]: 123  // Symbol作为属性键
};

console.log(user[id1]); // 123
console.log(user.name); // "张三"

// Symbol属性不会被普通遍历发现
for (let key in user) {
    console.log(key); // 只输出 "name"，不会输出Symbol属性
}

console.log(Object.keys(user)); // ["name"]
```

### 全局Symbol

```javascript
// 全局Symbol注册表
let globalId1 = Symbol.for("user.id");
let globalId2 = Symbol.for("user.id");

console.log(globalId1 === globalId2); // true (相同的键返回相同的Symbol)

// 获取Symbol的键
console.log(Symbol.keyFor(globalId1)); // "user.id"
```

## 7. 对象到原始值的转换

### 转换规则

```javascript
let user = {
    name: "张三",
    money: 1000,
    
    // 自定义转换为字符串
    toString() {
        return this.name;
    },
    
    // 自定义转换为数字
    valueOf() {
        return this.money;
    }
};

// 字符串转换
console.log(String(user)); // "张三" (调用toString)
console.log("" + user);    // "张三"

// 数字转换
console.log(Number(user)); // 1000 (调用valueOf)
console.log(+user);        // 1000

// 默认转换（优先valueOf）
console.log(user + 500);   // 1500 (数字运算)
console.log(`用户：${user}`); // "用户：张三" (字符串模板)
```

## 实际开发中的最佳实践

### 1. 对象创建模式

```javascript
// ✅ 推荐：对象字面量
const config = {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    retries: 3
};

// ✅ 推荐：工厂函数
function createUser(name, age) {
    return {
        name,
        age,
        greet() {
            return `你好，我是${this.name}`;
        }
    };
}

const user = createUser("张三", 30);
```

### 2. 安全的属性访问

```javascript
// ✅ 使用可选链
const userName = user?.profile?.name ?? "匿名用户";
const userEmail = user?.contact?.email ?? "未设置邮箱";

// ✅ 检查属性存在
if ("address" in user && user.address.city) {
    console.log(`用户住在${user.address.city}`);
}
```

### 3. 对象复制

```javascript
// ✅ 浅拷贝
const userCopy = {...originalUser};

// ✅ 合并对象
const userWithDefaults = {
    theme: "light",
    language: "zh-CN",
    ...userPreferences
};
```

## 总结：你需要掌握的核心点

1. **对象创建和访问**：字面量语法、属性访问
2. **引用特性**：理解对象是引用类型，复制时要注意
3. **this关键字**：在方法中指向调用对象
4. **可选链 ?.**：安全访问嵌套属性，避免报错
5. **构造函数**：用new创建对象的基本概念
6. **Symbol**：了解存在即可，特殊场景才用
7. **类型转换**：对象如何转换为基本类型

**类比记忆**：
- 对象 = 汽车（有属性：品牌、颜色；有方法：启动、刹车）
- 引用 = 汽车钥匙（多把钥匙可以操作同一辆车）
- this = 当前正在操作的车（在哪辆车里，this就指向哪辆车）
- 可选链 = 安全带（保护你不会因为访问不存在的属性而"撞车"）

这些概念掌握后，你就能熟练"驾驶"JavaScript对象了！


# 基础

JavaScript的对象是一组由键-值组成的无序集合

```javascript
var person = {
    name: 'Bob',
    tags: ['js', 'web', 'mobile'],
    city: 'Beijing',
    hasCar: true,
    zipcode: null
};
person.name; // 'Bob'
person.zipcode; // null

person.age; // undefined
person.age = 18; // 新增一个age属性
person.age; // 18
delete person.age; // 删除age属性
```

# 属性

是否拥有某一属性，可以用`in`操作符

```js
'name' in person; // true
'grade' in person; // false
'toString' in xiaoming; // true 继承得到
```

判断一个属性是否是自身拥有的，而不是继承得到的

```js
person.hasOwnProperty('name'); // true
person.hasOwnProperty('toString'); // false
```

```js
var n = new Number(123); // 123,生成了新的包装类型
var b = new Boolean(true); // true,生成了新的包装类型
var s = new String('str'); // 'str',生成了新的包装类型
```

包装对象看上去和原来的值一模一样，显示出来也是一模一样，但他们的类型已经变为object了！所以，包装对象和原始值用 === 比较会返回 false

```js
typeof new Number(123); // 'object'
new Number(123) === 123; // false

typeof new Boolean(true); // 'object'
new Boolean(true) === true; // false

typeof new String('str'); // 'object'
new String('str') === 'str'; // false
```

## 强制类型装换

```js
var n = Number('123'); // 123，相当于parseInt()或parseFloat()
typeof n; // 'number'

var b = Boolean('true'); // true
typeof b; // 'boolean'

var b2 = Boolean('false'); // true! 'false'字符串转换结果为true！因为它是非空字符串！
var b3 = Boolean(''); // false

var s = String(123.45); // '123.45'
typeof s; // 'string'
```

## 方法

在一个对象中绑定函数，称为这个对象的方法

```js
var xiaoming = {
    name: '小明',
    birth: 1990,
    age: function () {
        var y = new Date().getFullYear();
        return y - this.birth;
    }
};
xiaoming.age; // function xiaoming.age()
xiaoming.age(); // 今年调用是25,明年调用就变成26了
```

## this

方法内部 `this` 始终指向当前对象，谁（对象）调用方法，`this`就是谁。

```js
function getAge() {
    var y = new Date().getFullYear();
    return y - this.birth;
}
var xiaoming = {
    name: '小明',
    birth: 1990,
    age: getAge
};
xiaoming.age(); // this 是 xiaoming

// fn 虽然赋值为 xiaoming.age，但 fn 中的 this 并不会因此而绑定到 xiaoming
var fn = xiaoming.age;
fn();                  // NaN 
```

```js
var xiaoming = {
    name: '小明',
    birth: 1990,
    age: function () {
        function getAgeFromBirth() {
            var y = new Date().getFullYear();
            return y - this.birth; // 这里的 this 不指向 xiaoming
        }
        return getAgeFromBirth();
    }
};
xiaoming.age(); // Uncaught TypeError: Cannot read property 'birth' of undefined
```

使用变量，将 `this` 传入函数内部

```js
var xiaoming = {
    name: '小明',
    birth: 1990,
    age: function () {
        var that = this; // 在方法内部一开始就捕获this
        function getAgeFromBirth() {
            var y = new Date().getFullYear();
            return y - that.birth; // 用that而不是this
        }
        return getAgeFromBirth();
    }
};
xiaoming.age(); // 25
```

## apply

```js
function getAge() {
    var y = new Date().getFullYear();
    return y - this.birth;
}

var xiaoming = {
    name: '小明',
    birth: 1990,
    age: getAge
};

xiaoming.age(); // 25
getAge.apply(xiaoming, []); // 25, this指向xiaoming, 参数为空
```

`func.call(对象,参数1,参数2...)`

```js
getAge.call(xiaoming);
```

所有对象都是动态的，即使内置的函数，我们也可以重新指向新的函数

```js
var count = 0;
var oldParseInt = parseInt; // 保存原函数

window.parseInt = function () {
    count += 1;
    return oldParseInt.apply(null, arguments); // 调用原函数
};

// 测试:
parseInt('10');
parseInt('20');
parseInt('30');
count; // 3
```

原型链上的this

```js
var o = {f:function(){return this.a + this.b;}};
var p = Object.create(o);
p.a = 1;
p.b = 4;
console.log(p.f()); // p ---> a,p对象的原型链上的this也是指代p对象
```

set 与 get 函数里的this

```js
function modulus(){
    return Math.sqrt(this.re * this.re + this.im * this.im);
}
var o = {
    	 re:2,
    	 im:8,
    	 get phase(){
    	    	 return Math.atan2(this.im,this.re);
    	 }
}
Object.defineProperty(o,'modulus',{get:modulus,enumerable:true,configurable:true});
console.log(o.phase);
console.log(o.modulus);
```

构造函数里this

```js
function MyClass(){
    this.a = 37;
}
var o = new MyClass();
console.log(o.a);  //37

function C2(){
    this.a = 37;
    return {a:38};
}
var p = new C2();
console.log(p.a); //38
```
call/apply方法与this
```js
function add(c,d){
return this.a + this.b + c + d;
}
var o = {a:1,b:3};
console.log(add.call(o,5,7));	//1 + 3 + 5 + 7 = 16  call是直接传参
console.log(add.apply(o,[10,20])); //1 +3 + 10 + 20 = 34    apply是传一个参数数组进去
function bar(){
    return Object.prototype.toString.call(this);
}
console.log(bar.call(7));	//[object Number]
```

bind 后的this指向不会变了

```js
function f(){
    return this.a;
}
var g = f.bind({a:"test"});
console.log(g());	//test
var o = {a:37,f:f,g:g};
console.log(o.f());	//37
console.log(o.g()); //test
```

利用apply()，我们还可以动态改变函数的行为。

JavaScript的所有对象都是动态的，即使内置的函数，我们也可以重新指向新的函数。

现在假定我们想统计一下代码一共调用了多少次parseInt()，可以把所有的调用都找出来，然后手动加上count += 1，不过这样做太傻了。最佳方案是用我们自己的函数替换掉默认的parseInt()：

```js
var count = 0;
var oldParseInt = parseInt; // 保存原函数

window.parseInt = function () {
    count += 1;
    return oldParseInt.apply(null, arguments); // 调用原函数
};

// 测试:
parseInt('10');
parseInt('20');
parseInt('30');
count; // 3
```



# JavaScript对象属性配置

## 学习优先级说明

这章内容相对高级，按实际使用频率分级：
- 🔥 **必须掌握** - getter/setter，现代开发常用
- ⚡ **了解概念** - 属性描述符，知道原理即可
- 📚 **深入理解** - 遇到问题时再查阅

---

## 🔥 必须掌握：getter和setter

### 基本概念

getter和setter让你能像访问属性一样调用方法，实现数据的计算和验证。

```javascript
const user = {
    firstName: "张",
    lastName: "三",
    
    // getter：计算属性
    get fullName() {
        return `${this.firstName}${this.lastName}`;
    },
    
    // setter：设置时执行逻辑
    set fullName(value) {
        const [firstName, lastName] = value.split(' ');
        this.firstName = firstName;
        this.lastName = lastName;
    },
    
    // 私有属性模拟
    _age: 0,
    
    get age() {
        return this._age;
    },
    
    set age(value) {
        if (value < 0 || value > 150) {
            throw new Error("年龄必须在0-150之间");
        }
        this._age = value;
    }
};

// 使用方式（像普通属性一样）
console.log(user.fullName); // "张三" (调用getter)
user.fullName = "李 四";     // 调用setter
console.log(user.firstName); // "李"
console.log(user.lastName);  // "四"

user.age = 25;               // 通过setter设置
console.log(user.age);       // 25 (通过getter获取)
// user.age = -5;            // 抛出错误
```

### 实际应用场景

```javascript
// 1. 数据验证和格式化
class User {
    constructor(email) {
        this._email = email;
    }
    
    get email() {
        return this._email;
    }
    
    set email(value) {
        // 邮箱格式验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            throw new Error("邮箱格式不正确");
        }
        this._email = value.toLowerCase(); // 自动转小写
    }
    
    // 只读属性（只有getter）
    get domain() {
        return this._email.split('@')[1];
    }
}

const user = new User("Zhang.San@Example.COM");
console.log(user.email);  // "zhang.san@example.com"
console.log(user.domain); // "example.com"

// 2. 计算属性
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    
    get area() {
        return this.width * this.height;
    }
    
    get perimeter() {
        return 2 * (this.width + this.height);
    }
    
    // 虚拟属性：同时改变宽高
    set size(value) {
        this.width = value;
        this.height = value;
    }
}

const rect = new Rectangle(10, 5);
console.log(rect.area);      // 50
console.log(rect.perimeter); // 30
rect.size = 8;              // 设置为正方形
console.log(rect.area);      // 64

// 3. Vue/React风格的响应式数据
class ReactiveData {
    constructor() {
        this._data = {};
        this._watchers = [];
    }
    
    // 通用getter
    get(key) {
        return this._data[key];
    }
    
    // 通用setter，触发更新
    set(key, value) {
        const oldValue = this._data[key];
        this._data[key] = value;
        
        // 通知所有观察者
        this._watchers.forEach(watcher => {
            watcher(key, value, oldValue);
        });
    }
    
    // 添加观察者
    watch(callback) {
        this._watchers.push(callback);
    }
}

const data = new ReactiveData();
data.watch((key, newVal, oldVal) => {
    console.log(`${key} changed from ${oldVal} to ${newVal}`);
});

data.set('name', '张三'); // 输出: name changed from undefined to 张三
```

### 使用defineProperty定义getter/setter

```javascript
const obj = {};

Object.defineProperty(obj, 'temperature', {
    get() {
        return this._celsius;
    },
    
    set(celsius) {
        this._celsius = celsius;
        this._fahrenheit = celsius * 9/5 + 32;
    }
});

Object.defineProperty(obj, 'fahrenheit', {
    get() {
        return this._fahrenheit;
    },
    
    set(fahrenheit) {
        this._fahrenheit = fahrenheit;
        this._celsius = (fahrenheit - 32) * 5/9;
    }
});

obj.temperature = 25;
console.log(obj.fahrenheit); // 77

obj.fahrenheit = 86;
console.log(obj.temperature); // 30
```

## ⚡ 了解概念：属性描述符

### 属性标志

每个对象属性都有三个特殊标志：
- `writable` - 是否可写
- `enumerable` - 是否可枚举（出现在for...in中）
- `configurable` - 是否可配置（可删除、可修改标志）

```javascript
const user = { name: "张三" };

// 查看属性描述符
console.log(Object.getOwnPropertyDescriptor(user, 'name'));
// {value: "张三", writable: true, enumerable: true, configurable: true}

// 定义不可写属性
Object.defineProperty(user, 'id', {
    value: 123,
    writable: false,    // 不可修改
    enumerable: true,   // 可枚举
    configurable: false // 不可删除
});

console.log(user.id); // 123
user.id = 456;        // 静默失败（严格模式下会报错）
console.log(user.id); // 123 (没有改变)

// 定义不可枚举属性
Object.defineProperty(user, 'secret', {
    value: "秘密数据",
    enumerable: false   // 不会在for...in中出现
});

for (let key in user) {
    console.log(key);   // 只输出 "name" 和 "id"，不输出 "secret"
}

console.log(user.secret); // "秘密数据" (但不可枚举)
```

### 实际应用：创建常量对象

```javascript
function createConstants(obj) {
    const constants = {};
    
    for (let key in obj) {
        Object.defineProperty(constants, key, {
            value: obj[key],
            writable: false,
            enumerable: true,
            configurable: false
        });
    }
    
    return constants;
}

const API_URLS = createConstants({
    USER: '/api/users',
    ORDER: '/api/orders',
    PRODUCT: '/api/products'
});

console.log(API_URLS.USER);    // "/api/users"
API_URLS.USER = '/api/newurl'; // 无效
console.log(API_URLS.USER);    // "/api/users" (没有改变)
```

## 📚 深入理解：高级用法

### 属性拦截器模式

```javascript
// 创建一个配置对象，支持点号路径访问
function createConfig(data) {
    return new Proxy(data, {
        get(target, prop) {
            if (typeof prop === 'string' && prop.includes('.')) {
                // 支持 config.get('user.profile.name') 形式
                return prop.split('.').reduce((obj, key) => obj?.[key], target);
            }
            return target[prop];
        },
        
        set(target, prop, value) {
            if (typeof prop === 'string' && prop.includes('.')) {
                // 支持 config.set('user.profile.name', 'value') 形式
                const keys = prop.split('.');
                const lastKey = keys.pop();
                const obj = keys.reduce((obj, key) => {
                    if (!obj[key]) obj[key] = {};
                    return obj[key];
                }, target);
                obj[lastKey] = value;
            } else {
                target[prop] = value;
            }
            return true;
        }
    });
}

const config = createConfig({
    database: {
        host: 'localhost',
        port: 3306
    }
});

console.log(config['database.host']); // 'localhost'
config['database.port'] = 5432;
console.log(config.database.port);    // 5432
```

## 实际开发建议

### 什么时候使用getter/setter

```javascript
// ✅ 好的使用场景
class Product {
    constructor(price) {
        this._price = price;
    }
    
    // 计算属性
    get priceWithTax() {
        return this._price * 1.1;
    }
    
    // 数据验证
    set price(value) {
        if (value < 0) throw new Error("价格不能为负数");
        this._price = value;
    }
    
    get price() {
        return this._price;
    }
}

// ❌ 不好的使用：简单的存取，没必要用getter/setter
class BadExample {
    get name() {
        return this._name; // 没有额外逻辑，直接用属性就好
    }
    
    set name(value) {
        this._name = value; // 没有验证，没必要
    }
}
```

### 现代开发中的应用

```javascript
// Vue 3风格的响应式
class Store {
    constructor() {
        this._state = {};
        this._subscribers = [];
    }
    
    get state() {
        return new Proxy(this._state, {
            set: (target, key, value) => {
                target[key] = value;
                this._notify(key, value);
                return true;
            }
        });
    }
    
    _notify(key, value) {
        this._subscribers.forEach(callback => callback(key, value));
    }
    
    subscribe(callback) {
        this._subscribers.push(callback);
    }
}

const store = new Store();
store.subscribe((key, value) => {
    console.log(`State changed: ${key} = ${value}`);
});

store.state.count = 1; // 输出: State changed: count = 1
```

## 总结

### 现在需要掌握的
1. **getter/setter基本语法**：用于计算属性和数据验证
2. **实际应用场景**：表单验证、计算属性、只读属性
3. **现代框架中的应用**：理解Vue/React的响应式原理

### 了解即可的
1. **属性描述符**：知道有writable、enumerable、configurable
2. **Object.defineProperty**：知道可以精确控制属性特性
3. **高级模式**：遇到复杂需求时再深入学习