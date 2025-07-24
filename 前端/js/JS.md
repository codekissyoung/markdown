# JS

## 概论

`JS` 是一种嵌入式`embedded`语言。本身提供少量核心语法，只用来做一些数学和逻辑运算。不提供任何与 `I/O`（输入/输出）相关的 `API`，都要靠宿主环境`host`(浏览器 | Node)提供，只合适嵌入更大型的应用程序环境，去调用宿主环境提供的底层 `API`。

浏览器宿主提供：

- 浏览器控制类：操作浏览器
- DOM 类：操作网页的各种元素
- Web 类：实现互联网的各种功能

Node宿主提供：

- 操作系统的 API
- 文件操作 API
- 网络通信 API

`JS` 核心语法不难，但用要它完成应用，需要涉及大量的外部`API`，这个需要花费很多时间和精力。
`JS` 语言有一些设计缺陷，某些地方相当不合理，另一些地方则会出现怪异的运行结果。为了更合理地编写 `JS` 程序，就不能用 `JS` 来写，而必须发明新的语言，比如 `CoffeeScript`、`TypeScript`、`Dart`。

## 语言设计

- 基本语法：借鉴 C 语言和 Java 语言。
- 数据结构：借鉴 Java 语言，包括将值分成原始值和对象两大类。
- 函数的用法：借鉴 Scheme 语言和 Awk 语言，将函数当作第一等公民，并引入闭包。
- 原型继承模型：借鉴 Self 语言（Smalltalk 的一种变种）。
- 正则表达式：借鉴 Perl 语言。
- 字符串和数组处理：借鉴 Python 语言。

`JS` 的基本语法和对象体系，是模仿 `Java` 而设计的，但没有采用`Java`的静态类型。
`JS` 语言的函数是一种独立的数据类型。
`JS` 采用基于原型对象 `prototype` 的继承链。

## 基本语法

[基本语法](https://wangdoc.com/javascript/basic/grammar.html)
[到了公司继续学习](https://wangdoc.com/javascript/basic/grammar.html)

值得注意的是配合 `continue` 和 `break` 的 `label` 标签语法，之前比较少用：

```js
top:
for (var i = 0; i < 3; i++){
    for (var j = 0; j < 3; j++){
        if (i === 1 && j === 1)
            break top;
        console.log('i=' + i + ', j=' + j);
    }
} // 跳到这里

foo: {
  console.log(1);
  break foo;
  console.log('本行不会输出');
} // 跳到这里
console.log(2);

top:
for (var i = 0; i < 3; i++){
    for (var j = 0; j < 3; j++){
        if (i === 1 && j === 1) // 会跳过当前循环，直接进入下一轮外层循环
            continue top;
        console.log('i=' + i + ', j=' + j);
    }
}
```

## 数据类型

**数值**：`1` 和 `3.14`，小数与整数都是以`64`位浮点数形式储存。[数值](https://wangdoc.com/javascript/types/number.html) 一文有详细说明，坑爹的设计！
**字符串**：`'hello world'`
`Bool`：`true` `false`
`undefined`：
`null`：

对象`object`：各种值的合成类型。又分为三个区别很大的子类：

- 对象 `Object`
- 数组 `Array`
- 函数 `function`

### 区分类型

```js
typeof 123          // "number"
typeof '123'        // "string"
typeof false        // "boolean"
function f() {}
typeof f            // "function"
typeof undefined    // "undefined"

// 要对一个可能不存在的变量进行判断：
if (v)                        // 错误的写法
if (typeof v === "undefined") // 正确的写法

typeof window       // "object"
typeof {}           // "object"
typeof []           // "object"

typeof null         // "object" 历史原因，坑的一比
```

[null 和 undefined的区别](https://wangdoc.com/javascript/types/null-undefined-boolean.html) 一文讲的很清楚了，历史的糟粕，不值得研究。

`null`表示“空”对象，`undefined`表示“此处无定义”

```js
undefined == null   // true
if( undefined )     // false
if( null )          // false

console.log(Number(null))       // 0
console.log(Number(undefined))  // NaN
5 + undefined                   // NaN

var i;
console.log(i) // 未赋值变量 undefined

function f(x) {
    console.log(x);
    return x;
}
f() // 未传参数 undefined

var o = new Object();
console.log(o.p) // 未定义的成员 undefined

function h() {}
console.log(h()) // 无返回值的函数 返回 undefined
```

`JS` 预期某个位置应该是布尔值，则该位置的现有的值会自动转换为`bool`值，目前只有`undefined` `null` `false` `0` `NaN` `""` `''` 被视为 `false`，其余所有值为 `true`。

```js
if ([])     // 空数组为 true
if ({})     // 空对象为 true
```

区分数组和对象：

```js
var o = {};
var a = [];
o instanceof Array // false
a instanceof Array // true
```

# 数据类型

Number, 字符串, 布尔值, null, undefined, 数组, 对象

## Number

- 不区分整数和浮点数，统一用 Number 表示
- `NaN`:无法计算结果, `Infinity`无限大
- `1 / 3 === (1 - 2 / 3);` false 浮点数的比较
- `Math.abs(1 / 3 - (1 - 2 / 3)) < 0.0000001;` true

## 字符串

```javascript
var s = "Hello, world!";
s.length; // 13

var s = "Test";
s[0] = "X"; // 下标可以取到　但是不可以改变字符串
alert(s); // s仍然为'Test'
```

## 布尔值

```js
false == 0; // true
false === 0; // false
// NaN
NaN === NaN; // false
isNaN(NaN); // true
```

## null

null 表示一个 空 的值，它和 0 以及空字符串''不同，0 是一个数值，''表示长度为 0 的字符串，而 null 表示 空

## undefined

JavaScript 的设计者希望用 null 表示一个空的值，而 undefined 表示值未定义。事实证明，这并没有什么卵用，区分两者的意义不大。大多数情况下，我们都应该用 null。undefined 仅仅在判断函数参数是否传递的情况下有用。

## 数组

```javascript
var arr = [1, 2, 3.14, "Hello", null, true];
arr[0]; // 返回索引为0的元素，即1
arr[5]; // 返回索引为5的元素，即true
arr[6]; // 索引超出了范围，返回undefined
arr.length; // 6
```

数组是一组按顺序排列的集合，集合的每个值称为元素。JavaScript 的数组可以包括任意数据类型。

## 对象

```js
var person = {
  name: "Bob",
  age: 20,
  tags: ["js", "web", "mobile"],
  city: "Beijing",
  hasCar: true,
  zipcode: null
};
person.name; // 'Bob'
person.zipcode; // null
```

JavaScript 的对象是一组由键-值组成的无序集合

## Map存键值对(ES6)

```js
var m = new Map([
  ["Michael", 95],
  ["Bob", 75],
  ["Tracy", 85]
]);
m.get("Michael"); // 95

var m = new Map(); // 空Map
m.set("Adam", 67); // 添加新的key-value
m.set("Bob", 59);
m.has("Adam"); // 是否存在key 'Adam': true
m.get("Adam"); // 67
m.delete("Adam"); // 删除key 'Adam'
m.get("Adam"); // undefined

var m = new Map();
m.set("Adam", 67);
m.set("Adam", 88);
m.get("Adam"); // 88
```

JavaScript 的默认对象表示方式{}可以视为其他语言中的 Map 或 Dictionary 的数据结构，即一组键值对。
但是 JavaScript 的对象有个小问题，就是键必须是字符串。但实际上 Number 或者其他数据类型作为键也是非常合理的。

## Set 存键 (ES6)

```js
var s1 = new Set(); // 空Set
var s2 = new Set([1, 2, 3]); // 含1, 2, 3

var s = new Set([1, 2, 3, 3, "3"]);
s; // Set {1, 2, 3, "3"}

s.add(4);
s; // {1, 2, 3, 4}
s.add(4);
s; // {1, 2, 3, 4}

var s = new Set([1, 2, 3]);
s; // Set {1, 2, 3}
s.delete(3);
s; // Set {1, 2}
```

Set 和 Map 类似，也是一组 key 的集合，但不存储 value

## Iterable 循环遍历

```js
var a = ["A", "B", "C"];
var s = new Set(["A", "B", "C"]);
var m = new Map([
  [1, "x"],
  [2, "y"],
  [3, "z"]
]);

// 遍历Array
for (var x of a) {
  alert(x);
}

// 遍历Set
for (var x of s) {
  alert(x);
}

// 遍历Map
for (var x of m) {
  alert(x[0] + "=" + x[1]);
}

var a = ["A", "B", "C"];
a.name = "Hello";
for (var x in a) {
  alert(x); // '0', '1', '2', 'name'
}

// vs
var a = ["A", "B", "C"];
a.name = "Hello";
for (var x of a) {
  alert(x); // 'A', 'B', 'C'
}
```
of 用于修复 in 的缺陷

```js
var a = ["A", "B", "C"];
a.forEach(function(element, index, array) {
  // element: 指向当前元素的值
  // index: 指向当前索引
  // array: 指向Array对象本身
  alert(element);
});
```
`a.forEach(function(k,v,f))`对每个元素进行操作

## 字符串属性和方法

```js
constructor	返回创建字符串属性的函数
length	返回字符串的长度
prototype	允许您向对象添加属性和方法
charAt()	返回指定索引位置的字符
charCodeAt()	返回指定索引位置字符的 Unicode 值
concat()	连接两个或多个字符串，返回连接后的字符串
fromCharCode()	将 Unicode 转换为字符串
indexOf()	返回字符串中检索指定字符第一次出现的位置
lastIndexOf()	返回字符串中检索指定字符最后一次出现的位置
localeCompare()	用本地特定的顺序来比较两个字符串
match()	找到一个或多个正则表达式的匹配
replace()	替换与正则表达式匹配的子串
search()	检索与正则表达式相匹配的值
slice()	提取字符串的片断，并在新的字符串中返回被提取的部分
split()	把字符串分割为子字符串数组
substr()	从起始索引号提取字符串中指定数目的字符
substring()	提取字符串中两个指定的索引号之间的字符
toLocaleLowerCase()	根据主机的语言环境把字符串转换为小写
toLocaleUpperCase()	根据主机的语言环境把字符串转换为大写
toLowerCase()	把字符串转换为小写
toString()	返回字符串对象值
toUpperCase()	把字符串转换为大写
trim()	移除字符串首尾空白
valueOf()	返回某个字符串对象的原始值
```