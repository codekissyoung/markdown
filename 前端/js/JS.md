# JS

## 概论

`JS` 是一种嵌入式`embedded`语言。本身提供少量核心语法，只用来做一些数学和逻辑运算。不提供任何与 `I/O`（输入/输出）相关的 `API`，都要靠宿主环境`host`(浏览器 | Node)提供，只合适嵌入更大型的应用程序环境，去调用宿主环境提供的底层 `API`。

核心语法：

- 操作符、控制结构、语句
- 标准库`Array` `Date` `Math`

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

[到了公司继续学习](https://wangdoc.com/javascript/basic/grammar.html)

## 基本语法

[基本语法](https://wangdoc.com/javascript/basic/grammar.html)

值得注意的是配合`continue`和`break`的`label`标签语法，之前比较少用：

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
console.log(h()) // 无返回值的函数 返回undefined
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

### 对象

## 事件驱动和非阻塞式设计

