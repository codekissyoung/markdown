# JavaScript 数据类型详解

## 概述

JavaScript 是一种动态类型语言，变量不需要提前声明类型。JavaScript 有 **8 种数据类型**，分为两大类：

- **原始类型 (Primitive Types)**: 7种
- **引用类型 (Reference Types)**: 1种

## 原始类型 (Primitive Types)

原始类型的值是不可变的，存储在栈内存中，按值传递。

### 1. Number (数字)

```javascript
let integer = 42;           // 整数
let float = 3.14;          // 浮点数
let negative = -100;       // 负数
let scientific = 1.5e3;    // 科学计数法: 1500
let infinity = Infinity;   // 无穷大
let negInfinity = -Infinity; // 负无穷大
let notANumber = NaN;      // Not a Number

// 特殊值检测
console.log(Number.isNaN(NaN));        // true
console.log(Number.isFinite(42));      // true
console.log(Number.isInteger(42));     // true
```

**注意事项:**
- JavaScript 中所有数字都是 64 位浮点数
- 最大安全整数: `Number.MAX_SAFE_INTEGER` (2^53 - 1)
- 浮点数计算可能不精确: `0.1 + 0.2 !== 0.3`

### 2. String (字符串)

```javascript
let single = 'Hello';
let double = "World";
let backtick = `Template ${single} ${double}`;
let multiline = `多行
字符串`;

// 字符串方法
let str = "JavaScript";
console.log(str.length);           // 10
console.log(str.charAt(0));        // "J"
console.log(str.indexOf('Script')); // 4
console.log(str.slice(0, 4));      // "Java"
console.log(str.toUpperCase());    // "JAVASCRIPT"
```

**字符串特性:**
- 不可变 (immutable)
- 支持 Unicode
- 模板字符串支持表达式和多行

### 3. Boolean (布尔值)

```javascript
let isTrue = true;
let isFalse = false;

// 布尔值转换 (Truthy/Falsy)
// Falsy 值 (转换为 false 的值):
console.log(Boolean(false));     // false
console.log(Boolean(0));         // false
console.log(Boolean(-0));        // false
console.log(Boolean(0n));        // false
console.log(Boolean(""));        // false
console.log(Boolean(null));      // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN));       // false

// 其他所有值都是 Truthy
console.log(Boolean("0"));       // true
console.log(Boolean([]));        // true
console.log(Boolean({}));        // true
```

### 4. undefined

```javascript
let undeclared;
console.log(undeclared);         // undefined

function noReturn() {}
console.log(noReturn());         // undefined

let obj = {};
console.log(obj.nonExistent);    // undefined
```

**undefined 的产生:**
- 声明但未赋值的变量
- 函数没有返回值
- 访问对象不存在的属性
- 函数参数未传递

### 5. null

```javascript
let empty = null;
console.log(empty);              // null
console.log(typeof null);        // "object" (这是一个历史 bug)

// null vs undefined
console.log(null == undefined);  // true (宽松比较)
console.log(null === undefined); // false (严格比较)
```

**null 的含义:**
- 表示"空"或"无"
- 需要显式赋值
- 通常用于表示对象的空值

### 6. Symbol (符号) - ES6

```javascript
let sym1 = Symbol();
let sym2 = Symbol('description');
let sym3 = Symbol('description');

console.log(sym2 === sym3);      // false (每个 Symbol 都是唯一的)
console.log(sym2.toString());    // "Symbol(description)"

// 全局 Symbol
let globalSym1 = Symbol.for('global');
let globalSym2 = Symbol.for('global');
console.log(globalSym1 === globalSym2); // true

// 用作对象属性
let obj = {};
obj[sym1] = 'value';
console.log(Object.keys(obj));   // [] (Symbol 属性不可枚举)
```

**Symbol 特性:**
- 每个 Symbol 都是唯一的
- 不能被隐式转换为字符串
- 常用作对象的私有属性键

### 7. BigInt - ES2020

```javascript
let bigInt1 = 123n;
let bigInt2 = BigInt(123);
let bigInt3 = BigInt("123456789012345678901234567890");

console.log(typeof bigInt1);     // "bigint"
console.log(bigInt1 + bigInt2);  // 246n

// 注意：不能与 Number 直接运算
// console.log(bigInt1 + 123);   // TypeError
console.log(bigInt1 + BigInt(123)); // 246n
```

**BigInt 特性:**
- 可以表示任意大的整数
- 不能与 Number 类型直接运算
- 不支持 Math 对象的方法

## 引用类型 (Reference Types)

### Object (对象)

引用类型存储在堆内存中，变量存储的是引用地址，按引用传递。

```javascript
// 普通对象
let person = {
    name: "张三",
    age: 30,
    sayHello: function() {
        return `Hello, I'm ${this.name}`;
    }
};

// 数组 (Array)
let numbers = [1, 2, 3, 4, 5];
let mixed = [1, "hello", true, null, {key: "value"}];

// 函数 (Function)
function greet(name) {
    return `Hello, ${name}!`;
}

// 日期 (Date)
let now = new Date();
let specificDate = new Date('2024-01-01');

// 正则表达式 (RegExp)
let regex = /\d+/g;
let regexConstructor = new RegExp('\\d+', 'g');

// 其他内置对象
let map = new Map();
let set = new Set();
let promise = new Promise((resolve) => resolve('done'));
```

## 类型检测

### 1. typeof 操作符

```javascript
console.log(typeof 42);          // "number"
console.log(typeof "hello");     // "string"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object" (历史bug)
console.log(typeof Symbol());    // "symbol"
console.log(typeof 123n);        // "bigint"
console.log(typeof {});          // "object"
console.log(typeof []);          // "object"
console.log(typeof function(){}); // "function"
```

### 2. instanceof 操作符

```javascript
let arr = [1, 2, 3];
let obj = {};
let date = new Date();

console.log(arr instanceof Array);   // true
console.log(obj instanceof Object);  // true
console.log(date instanceof Date);   // true
console.log(arr instanceof Object);  // true (数组也是对象)

// instanceof 判断obj在其原型链上是否有Array原型
alert(obj instanceof Array);
```

### 3. Object.prototype.toString.call() - 最可靠的类型检测

```javascript
// 标准的类型检测函数
function getType(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
}

console.log(getType(42));           // "Number"
console.log(getType("hello"));      // "String"
console.log(getType(true));         // "Boolean"
console.log(getType(null));         // "Null"
console.log(getType(undefined));    // "Undefined"
console.log(getType([]));           // "Array"
console.log(getType({}));           // "Object"
console.log(getType(new Date()));   // "Date"
console.log(getType(/regex/));      // "RegExp"

// 具体用法示例
Object.prototype.toString.call([]) === "[object Array]";      // 判断是否是Array对象
Object.prototype.toString.call(function(){}) === "[object Function]"; // 判断是否为函数对象

// 另一种实现方式
var toString = Object.prototype.toString;
function getType(o) { 
    return toString.call(o).slice(8, -1); 
}
console.log(getType(null));                 // Null
console.log(getType(undefined));            // Undefined
console.log(getType(1));                    // Number
console.log(getType('aaa'));                // String
console.log(getType(new Boolean(true)));    // Boolean

function A() { this.a = 11; }
console.log(getType(new A()));              // Object
```

## 类型转换

### 隐式类型转换

```javascript
// 字符串转换
console.log("5" + 3);          // "53" (数字转字符串)
console.log("5" - 3);          // 2 (字符串转数字)
console.log("5" * 3);          // 15
console.log("5" / 3);          // 1.6666666666666667

// 布尔值转换
console.log(true + 1);         // 2
console.log(false + 1);        // 1
console.log("" == false);      // true
console.log(0 == false);       // true

// 对象转原始值
console.log({} + "");          // "[object Object]"
console.log([] + "");          // ""
console.log([1,2] + "");       // "1,2"
```

### 显式类型转换

```javascript
// 转数字
console.log(Number("123"));    // 123
console.log(Number("123.45")); // 123.45
console.log(Number("123abc")); // NaN
console.log(parseInt("123"));  // 123
console.log(parseInt("123.45")); // 123
console.log(parseFloat("123.45")); // 123.45
console.log(+"123");           // 123 (一元加号)

// 转字符串
console.log(String(123));      // "123"
console.log(String(true));     // "true"
console.log((123).toString()); // "123"

// 转布尔值
console.log(Boolean(1));       // true
console.log(Boolean(0));       // false
console.log(!!1);              // true (双重否定)
console.log(!!"hello");        // true
```

## JavaScript的历史包袱与陷阱

### JavaScript诞生的"不靠谱"历史

JavaScript诞生于1995年，Brendan Eich在短短10天内设计完成。时间紧迫导致了很多设计决策比较仓促，为了向后兼容性，这些"历史bug"一直保留至今。

### 经典的"不靠谱"行为

```javascript
// 1. 经典的 typeof null bug
console.log(typeof null);           // "object" (明明是null，却说是object！)
console.log(null instanceof Object); // false (但instanceof又正确)

// 2. 令人困惑的相等比较（隐式类型转换）
console.log([] == false);           // true (空数组等于false？？？)
console.log("" == 0);              // true (空字符串等于0)
console.log(" " == 0);             // true (空格字符串也等于0)
console.log("0" == false);         // true (字符串"0"等于false)
console.log(null == undefined);    // true (null等于undefined)

// 但严格相等就正常了
console.log([] === false);         // false ✓
console.log(null === undefined);   // false ✓

// 3. 加法运算的混乱（+ 操作符重载）
console.log(1 + "2");              // "12" (数字+字符串=字符串拼接)
console.log("2" + 1);              // "21" 
console.log(1 + 2 + "3");          // "33" (先算1+2=3，再拼接"3")
console.log("3" + 1 + 2);          // "312" (从左到右全部拼接)

// 减法、乘法、除法就正常（自动转数字）
console.log("3" - 1);              // 2 ✓
console.log("3" * 2);              // 6 ✓
console.log("6" / 2);              // 3 ✓

// 4. NaN 的奇怪行为
console.log(NaN === NaN);          // false (NaN不等于自己！)
console.log(NaN == NaN);           // false (宽松比较也不行)
console.log(Number.isNaN(NaN));    // true (只能用这个方法判断)

// 5. 浮点数精度问题（所有语言都有，但JS特别明显）
console.log(0.1 + 0.2);            // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);    // false

// 6. 自动类型转换的更多奇怪例子
console.log(true + true);          // 2 (true转成1)
console.log(true + false);         // 1
console.log("5" - "4");            // 1 (字符串减法转数字)
console.log("5" + - "4");          // "5-4" (复杂的操作优先级)
console.log([] + []);              // "" (两个空数组相加得空字符串)
console.log({} + []);              // "[object Object]" (对象转字符串)
console.log([] + {});              // "[object Object]"

// 7. 函数参数的诡异行为
function test(a) {
    arguments[0] = 99;
    console.log(a);                 // 99 (参数和arguments关联！)
}
test(1);
```

### 为什么会这样？

1. **设计时间紧迫**：10天设计一门语言，很多细节考虑不周
2. **多种语言影响**：同时借鉴了Java、Scheme、Self等语言特性
3. **向后兼容**：一旦发布就不能破坏现有代码，bug也要保留
4. **隐式类型转换**：为了方便使用，但规则复杂且不直观

## 实践建议

### 1. 类型安全编程（避开历史陷阱）

```javascript
// ✅ 总是使用严格相等
if (value === null) { /* 明确检查null */ }
if (typeof value === 'string') { /* 明确类型检查 */ }

// ✅ 避免隐式转换陷阱，但可以利用有用的特性
if (value == null) { /* 同时检查 null 和 undefined，这个是有用的 */ }

// ✅ 显式类型转换
const num = Number(str);            // 而不是 +str 或 str * 1
const str = String(num);            // 而不是 num + ""
const bool = Boolean(value);        // 而不是 !!value

// ✅ 安全的数组和对象检查
if (Array.isArray(value)) { /* 而不是 typeof value === 'object' */ }
if (value && typeof value === 'object' && value !== null) { /* 检查对象 */ }

// ✅ 安全的NaN检查
if (Number.isNaN(value)) { /* 而不是 value === NaN */ }

// ✅ 浮点数比较
function isEqual(a, b, epsilon = 0.0001) {
    return Math.abs(a - b) < epsilon;
}
console.log(isEqual(0.1 + 0.2, 0.3)); // true

// ✅ 使用适当的类型检查
function processArray(arr) {
    if (!Array.isArray(arr)) {
        throw new TypeError('Expected an array');
    }
    // 处理数组
}
```

### 2. 现代 JavaScript 中的类型处理

```javascript
// ✅ 使用可选链操作符 (ES2020) - 避免属性访问错误
const user = { profile: { name: "张三" } };
console.log(user.profile?.name);        // "张三"
console.log(user.profile?.age);         // undefined (不会报错)

// ✅ 使用空值合并操作符 (ES2020) - 避免falsy判断陷阱
const defaultName = user.name ?? "匿名用户";  // 只有null/undefined才用默认值
const defaultAge = user.age ?? 0;            // 不会因为age=0而用默认值

// ✅ 使用模板字符串 - 避免复杂的字符串拼接
const message = `用户 ${user.name ?? '匿名'} 的年龄是 ${user.age ?? '未知'}`;

// ✅ 使用现代工具
// TypeScript: 静态类型检查，编译时发现类型错误
// ESLint: 检查常见的JavaScript陷阱
// Prettier: 统一代码格式，避免歧义
```

### 3. 为什么JavaScript仍然流行？

尽管有这些历史包袱，JavaScript依然是最流行的编程语言：

1. **生态系统庞大**：npm包数量最多，轮子最全
2. **无处不在**：浏览器、Node.js服务端、React Native移动端、Electron桌面应用
3. **现代工具链完善**：TypeScript、Babel、Webpack等解决了很多历史问题
4. **语言在持续进步**：ES6+增加了很多现代特性，弥补了早期设计不足
5. **开发效率高**：动态类型在原型开发和小项目中确实提高开发效率
6. **学习成本低**：语法简单，容易上手

### 4. 现代JavaScript开发建议

```javascript
// ✅ 在大型项目中使用TypeScript
interface User {
    name: string;
    age: number;
    email?: string;
}

// ✅ 使用ESLint配置捕获常见错误
// .eslintrc.js 中配置规则避免常见陷阱

// ✅ 使用严格模式
'use strict';  // 或在模块中自动启用

// ✅ 优先使用const/let，避免var
const API_URL = 'https://api.example.com';
let counter = 0;

// ✅ 使用现代语法特性
const users = await fetch('/api/users').then(res => res.json());
const activeUsers = users.filter(user => user.active);
```

## 总结

JavaScript 的数据类型系统虽然相对简单，但理解其细节对于编写健壮的代码至关重要：

1. **7种原始类型** + **1种引用类型**
2. **原始类型**：不可变，按值传递，存储在栈中
3. **引用类型**：可变，按引用传递，存储在堆中
4. 掌握类型检测方法和转换规则
5. 使用现代 JavaScript 特性提高代码安全性

理解这些概念是掌握 JavaScript 的基础，也是进阶学习的重要前提。

---

## 深入对象操作

### 对象属性操作

```javascript
// 枚举对象属性
for(var i in obj) { 
    console.log(obj[i]); 
}

// 定义函数对象和原型
function foo() {}
foo.prototype.z = 3;           // 给原型加属性
var obj = new foo();           // 实例化对象
obj.a = 10;                    // 添加对象自有属性

console.log(obj.a);            // 访问对象自有属性
console.log(obj.z);            // 访问从原型链继承的属性

// 判断属性来源
obj.hasOwnProperty('z');       // false - 判断是否为对象自有属性
obj.hasOwnProperty('a');       // true

// 动态添加和删除属性
obj.z = 5;                     // 动态添加属性z
console.log(foo.prototype.z);  // 3 - 原型链里的z并没有改变
delete obj.z;                  // 删除obj的动态属性z，但无法删除原型上的属性
```

### 原型链操作

```javascript
// 创建对象指定原型链
var obj = Object.create({x: 1});  // obj ---> {x:1} ---> Object.prototype ---> null
obj.toString();                   // 可以访问Object.prototype上的方法

var obj = Object.create(null);    // obj ---> null (没有原型链)
obj.toString;                     // undefined
```

### 属性描述符

```javascript
// 查看属性描述符
console.log(Object.getOwnPropertyDescriptor({pro: 'aaa'}, 'pro'));
// {value: 'aaa', writable: true, enumerable: true, configurable: true}

// writable    - 决定属性是否可写
// enumerable  - 决定属性是否可枚举
// configurable- 决定属性是否可删除
```

### 定义属性

```javascript
// 定义单个属性
var cat = {};
Object.defineProperty(cat, 'price', {
    enumerable: false,
    value: 1000,
    writable: false,
    configurable: false
});

console.log(cat.propertyIsEnumerable('price'));  // false - 是否可枚举
console.log(cat.hasOwnProperty('price'));        // true - 是否自有属性
cat.price = 20;                                  // 尝试改变属性值(失败，因为writable:false)
console.log(cat.price);                          // 1000
console.log(delete cat.price);                   // false - 尝试删除属性(失败)
for(var i in cat) { console.log(cat[i]); }      // 不会枚举price

// 定义多个属性
var person = {};
Object.defineProperties(person, {
    title: {value: 'fe', enumerable: true},
    corp: {value: "BABA", enumerable: true},
    salary: {value: 10000, enumerable: true, writable: true},
    luck: {
        get: function() {
            return Math.random() > 0.5 ? 'good' : 'bad';
        }
    },
    promote: {
        set: function(level) {
            this.salary *= 1 + level * 0.1;
        },
        get: function() {
            return this.salary;
        }
    }
});

console.log(person.salary);      // 10000
console.log(person.luck);        // 'good' 或 'bad' (随机)
person.promote = 2;              // 调用set方法
console.log(person.promote);     // 调用get方法，返回调整后的salary
```

### 属性访问和查找

```javascript
// 安全的属性读取
var yz = obj && obj.y && obj.y.z;
var defaultValue = obj[b] || 'default';

// 删除属性
delete obj.a;                    // 删除对象属性
delete Object.prototype;         // false - 不能删除prototype属性

var descriptor = Object.getOwnPropertyDescriptor(Object, 'prototype');
descriptor.configurable;         // false - 该属性决定属性是否可删除

// 注意：delete只能删除对象的属性，不能删除全局变量和局部变量

// 查找属性
console.log(cat.propertyIsEnumerable('legs'));    // true - 可枚举
console.log(cat.propertyIsEnumerable('toString')); // false - 不可枚举
'legs' in cat;                                     // true - 会查找原型链
cat.hasOwnProperty('legs');                        // 只查找对象自有属性
Object.keys(cat);                                  // 返回所有可枚举属性的key
```

### 对象状态控制

```javascript
var obj = {x: 1, y: 2};

// 扩展性控制
console.log(Object.isExtensible(obj));    // true
Object.preventExtensions(obj);            // 设置对象不可再增加属性
console.log(Object.isExtensible(obj));    // false
obj.z = 1;
console.log(obj.z);                       // undefined

// 密封性控制
console.log(Object.isSealed(obj));        // false
Object.seal(obj);                         // 设置对象属性不可删除
console.log(Object.isSealed(obj));        // true

// 冻结控制
console.log(Object.isFrozen(obj));        // false
Object.freeze(obj);                       // 设置对象属性不可修改值
console.log(Object.isFrozen(obj));        // true
```

### 对象序列化

```javascript
var obj = {
    x: 1,
    y: true,
    z: [1, 2, 3],
    nullVal: null,
    undef: undefined  // undefined不会出现在序列化字符串里
};

console.log(JSON.stringify(obj));  // {"x":1,"y":true,"z":[1,2,3],"nullVal":null}

var obj2 = JSON.parse('{"x":1}');
console.log(obj2.x);  // 1

// 自定义序列化 - toJSON方法
var obj = {
    x: 1,
    y: 2,
    o: {
        o1: 1,
        o2: 2,
        toJSON: function() {
            return this.o1 + this.o2;
        }
    }
};
console.log(JSON.stringify(obj));  // {"x":1,"y":2,"o":3}
```

### toString 和 valueOf

```javascript
// 对象被当做字符串使用时，会先调用valueOf，若不能返回原始类型，再调用toString
var obj = {x: 1, y: 2};
console.log(obj.toString());  // [object Object]

obj.toString = function() {
    return this.x + this.y;
};
console.log("Result: " + obj);  // Result: 3

obj.valueOf = function() {
    return this.x + this.y + 100;
};
console.log("Result: " + obj);  // Result: 103 (valueOf优先级更高)
```

## 面向对象编程实践

### 基本概念

面向对象编程的核心思想是：不需要定义全局函数去操作不同的数据类型，而是数据类型本身具有方法去操作自身的值。使用 `a.sort()` 而不是 `sort(a)`。

### 动态对象创建

```javascript
// 利用JS动态加载特性，通过匿名函数创建对象
(function() {
    window.cky = {name: "caokaiyan"};
    cky.print = function() {
        console.log("i am " + this.name + " and i am " + this.age + " years old!");
    }
})();

cky.age = 20;  // 动态添加属性
console.log(cky);
cky.print();
```

### 对象字面量

```javascript
var book = {
    topic: 'javascript',
    fat: 10,
    line: [32, 43, 53, 64],
    total: function() {
        console.log(this.fat);
    }
};

console.log(book);
book.author = 'caokaiyan';  // 动态添加对象属性
console.log(book);
```

### 数组对象扩展

```javascript
var point = [{x: 1, y: 3}, {x: 1, y: 4}];
point.dist = function() {
    // 使用局部变量 vs 成员变量的区别：
    // this.p1 = this[0];  // 成员变量，对象销毁时才释放
    // var p1 = this[0];   // 局部变量，函数调用完就销毁
    
    var p1 = this[0];
    var p2 = this[1];
    var res = p1.x * p2.x + p1.y * p2.y;
    console.log(res);
    return res;
};

console.log(point);
point.dist();
```

### 构造函数和原型

```javascript
// 简单的构造函数示例
var Point = function(x, y) {
    this.x = x;
    this.y = y;
};

console.log(Point);  // Point 函数
var point = new Point(2, 3);
console.log(point);  // Point 对象

// 动态添加原型方法
Point.prototype.r = function() {
    return this.x * this.y;
};
console.log(point.r());  // 6
```

### 构造函数中的作用域

```javascript
function A() {
    // 成员方法 - 可以被实例访问
    this.b = function() {
        console.log("i am b");
        c();  // 可以调用内部函数
    };
    
    // 内部函数 - 不能被实例直接访问
    function c() {
        console.log("i am c");
    }
    
    // 内部函数变量形式 - 不能被实例访问
    var d = function() {
        console.log("i am d");
    };
    
    // 成员属性 - 可以被实例访问
    this.e = "i am e";
    
    // 局部变量 - 不能被实例访问
    var f = "i am f";
}

// 原型方法 - 所有实例共享
A.prototype.g = function() {
    console.log("i am g");
};

var cky = new A();
cky.b();        // "i am b" 然后 "i am c"
// cky.c();     // TypeError: cky.c is not a function
// cky.d();     // TypeError: cky.d is not a function
console.log(cky.e);    // "i am e"
console.log(cky.f);    // undefined
cky.g();        // "i am g"
```

## 重要概念总结

1. **原型链很重要**：它决定了对象继承哪些属性和方法
2. **this关键字**：在构造函数中使用this定义的是成员变量，用var定义的是局部变量
3. **属性访问**：区分自有属性和继承属性，使用hasOwnProperty()判断
4. **对象状态**：理解可扩展性、密封性、冻结性的区别
5. **类型检测**：Object.prototype.toString.call()是最可靠的类型检测方法


# JavaScript数据类型进阶 - 实用指南

## 学习优先级说明

基于你的实用主义学习风格，本文档按重要性分级：
- 🔥 **必须掌握** - 日常开发必用
- ⚡ **重要了解** - 常见场景会用到  
- 📚 **了解即可** - 特殊场景才用，现在可跳过

---

## 🔥 必须掌握：字符串操作

### 基本字符串方法

```javascript
let str = "JavaScript";

// 长度和访问
console.log(str.length);        // 10
console.log(str[0]);           // "J"
console.log(str.charAt(0));    // "J" (更安全)

// 查找
console.log(str.indexOf("Script"));     // 4
console.log(str.includes("Script"));    // true (推荐)
console.log(str.startsWith("Java"));    // true
console.log(str.endsWith("Script"));    // true

// 截取
console.log(str.slice(0, 4));          // "Java"
console.log(str.slice(-6));            // "Script" (从后往前)
console.log(str.substring(0, 4));      // "Java"

// 替换
console.log(str.replace("Java", "Type")); // "TypeScript"
console.log(str.replaceAll("a", "A"));   // "JAvAScript"

// 大小写
console.log(str.toLowerCase());         // "javascript"
console.log(str.toUpperCase());         // "JAVASCRIPT"

// 去空格
let text = "  hello world  ";
console.log(text.trim());              // "hello world"

// 分割
console.log("a,b,c".split(","));       // ["a", "b", "c"]
```

### 模板字符串（重要！）

```javascript
let name = "张三";
let age = 30;

// 传统拼接（不推荐）
let oldWay = "你好，我是" + name + "，今年" + age + "岁";

// 模板字符串（推荐）
let newWay = `你好，我是${name}，今年${age}岁`;

// 多行字符串
let html = `
    <div>
        <h1>${name}</h1>
        <p>年龄：${age}</p>
    </div>
`;

// 表达式
let message = `明年我就${age + 1}岁了`;
```

## 🔥 必须掌握：数组基础

### 数组创建和访问

```javascript
// 创建数组
let fruits = ["苹果", "香蕉", "橙子"];
let numbers = [1, 2, 3, 4, 5];
let mixed = ["文本", 123, true, null];

// 访问元素
console.log(fruits[0]);        // "苹果"
console.log(fruits.length);    // 3

// 修改元素
fruits[1] = "葡萄";
console.log(fruits);           // ["苹果", "葡萄", "橙子"]
```

### 核心数组方法

```javascript
let arr = [1, 2, 3];

// 添加/删除元素
arr.push(4);                   // 末尾添加: [1, 2, 3, 4]
arr.pop();                     // 末尾删除: [1, 2, 3]
arr.unshift(0);                // 开头添加: [0, 1, 2, 3]
arr.shift();                   // 开头删除: [1, 2, 3]

// 查找元素
console.log(arr.indexOf(2));   // 1
console.log(arr.includes(2));  // true

// 转换为字符串
console.log(arr.join(","));    // "1,2,3"
console.log(arr.join(" - "));  // "1 - 2 - 3"
```

## 🔥 必须掌握：重要数组方法

### 数组遍历和转换

```javascript
let numbers = [1, 2, 3, 4, 5];

// forEach - 遍历每个元素
numbers.forEach(num => {
    console.log(num * 2);
});

// map - 转换数组（返回新数组）
let doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter - 过滤数组
let evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4]

// find - 找到第一个符合条件的元素
let found = numbers.find(num => num > 3);
console.log(found); // 4

// some/every - 检测数组
console.log(numbers.some(num => num > 3));  // true (有元素>3)
console.log(numbers.every(num => num > 0)); // true (所有元素>0)
```

### 实际应用示例

```javascript
// 用户数据处理（常见场景）
let users = [
    {name: "张三", age: 25, active: true},
    {name: "李四", age: 30, active: false},
    {name: "王五", age: 35, active: true}
];

// 获取所有活跃用户的姓名
let activeUserNames = users
    .filter(user => user.active)
    .map(user => user.name);
console.log(activeUserNames); // ["张三", "王五"]

// 检查是否有成年用户
let hasAdult = users.some(user => user.age >= 18);
console.log(hasAdult); // true
```

## 🔥 必须掌握：解构赋值

### 数组解构

```javascript
// 基本用法
let arr = [1, 2, 3];
let [a, b, c] = arr;
console.log(a); // 1
console.log(b); // 2

// 跳过元素
let [first, , third] = arr;
console.log(first); // 1
console.log(third); // 3

// 默认值
let [x, y, z = 0] = [1, 2];
console.log(z); // 0

// 交换变量
let num1 = 10, num2 = 20;
[num1, num2] = [num2, num1];
console.log(num1); // 20
```

### 对象解构

```javascript
let user = {
    name: "张三",
    age: 30,
    email: "zhangsan@example.com"
};

// 基本用法
let {name, age} = user;
console.log(name); // "张三"
console.log(age);  // 30

// 重命名变量
let {name: userName, age: userAge} = user;
console.log(userName); // "张三"

// 默认值
let {name, age, city = "北京"} = user;
console.log(city); // "北京"

// 函数参数解构（很实用！）
function greetUser({name, age}) {
    return `你好${name}，你今年${age}岁`;
}
console.log(greetUser(user)); // "你好张三，你今年30岁"
```

## ⚡ 重要了解：数字类型

### 数字操作基础

```javascript
// 数字方法
let num = 123.456;
console.log(num.toFixed(2));        // "123.46" (保留2位小数)
console.log(num.toString());        // "123.456"
console.log(parseInt("123px"));     // 123
console.log(parseFloat("123.45"));  // 123.45

// 检查数字
console.log(Number.isNaN(NaN));     // true
console.log(Number.isFinite(123));  // true
console.log(Number.isInteger(123)); // true

// 数学运算
console.log(Math.round(4.7));       // 5
console.log(Math.floor(4.7));       // 4
console.log(Math.ceil(4.3));        // 5
console.log(Math.random());         // 0-1随机数
console.log(Math.max(1, 3, 2));     // 3
console.log(Math.min(1, 3, 2));     // 1
```

## ⚡ 重要了解：Object.keys/values/entries

### 对象遍历

```javascript
let user = {
    name: "张三",
    age: 30,
    city: "北京"
};

// 获取所有键
console.log(Object.keys(user));     // ["name", "age", "city"]

// 获取所有值
console.log(Object.values(user));   // ["张三", 30, "北京"]

// 获取键值对
console.log(Object.entries(user));  // [["name", "张三"], ["age", 30], ["city", "北京"]]

// 实际应用：遍历对象
Object.entries(user).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
});

// 将对象转为数组处理，再转回对象
let doubledAges = Object.fromEntries(
    Object.entries(user)
        .filter(([key, value]) => typeof value === 'number')
        .map(([key, value]) => [key, value * 2])
);
```

## ⚡ 重要了解：JSON操作

### JSON基础

```javascript
// 对象转JSON
let user = {
    name: "张三",
    age: 30,
    hobbies: ["读书", "游泳"]
};

let jsonString = JSON.stringify(user);
console.log(jsonString); // '{"name":"张三","age":30,"hobbies":["读书","游泳"]}'

// JSON转对象
let userData = JSON.parse(jsonString);
console.log(userData.name); // "张三"

// 实际应用：本地存储
localStorage.setItem('user', JSON.stringify(user));
let savedUser = JSON.parse(localStorage.getItem('user'));
```

## 📚 了解即可（现在可跳过）

### 原始类型的方法
```javascript
// 了解即可：原始类型会临时包装成对象
let str = "hello";
console.log(str.toUpperCase()); // 临时创建String对象
```

### Map和Set
```javascript
// 了解即可：特殊数据结构，普通对象和数组够用了
let map = new Map();
let set = new Set();
```

### WeakMap和WeakSet
```javascript
// 了解即可：高级特性，新手不需要
let weakMap = new WeakMap();
```

### Iterable对象
```javascript
// 了解即可：for...of背后的机制
for (let item of [1, 2, 3]) {
    console.log(item);
}
```

### 日期对象
```javascript
// 了解即可：现代项目通常用date-fns或dayjs库
let now = new Date();
console.log(now.getFullYear()); // 获取年份
```

---

## 学习建议（类比驾驶）

### 现在重点练习（基本驾驶技能）
1. **字符串操作** = 方向盘（最常用的控制）
2. **数组方法** = 刹车和油门（核心操作）
3. **解构赋值** = 倒车镜（提高效率的工具）
4. **JSON操作** = 导航系统（数据传输必备）

### 了解概念即可（高级驾驶技巧）
1. **Map/Set** = 定速巡航（特殊场景才用）
2. **WeakMap/WeakSet** = 自适应巡航（高级功能）
3. **Iterable** = 发动机工作原理（知道即可）

### 实际开发模式

```javascript
// 典型的数据处理流程
const processUsers = (users) => {
    return users
        .filter(user => user.active)           // 过滤活跃用户
        .map(({name, age, email}) => ({        // 解构重组数据
            displayName: name.toUpperCase(),
            info: `${age}岁`,
            contact: email
        }))
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
};

// API数据处理
const saveUserData = (userData) => {
    const jsonData = JSON.stringify(userData);
    localStorage.setItem('users', jsonData);
};

const loadUserData = () => {
    const jsonData = localStorage.getItem('users');
    return jsonData ? JSON.parse(jsonData) : [];
};
```

## 总结

掌握了这些核心内容，你就能处理90%的日常开发需求。就像学会了基本驾驶技能，你就能安全上路了。那些高级特性，等你熟练了再学也不迟！

**下一步建议**：拿这些方法去实际项目中练习，比如处理用户列表、购物车数据等，实战是最好的学习方式。