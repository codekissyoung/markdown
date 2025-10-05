# JavaScript函数进阶 - 实用指南

## 🔥 必须掌握：Rest参数与Spread语法

### Rest参数（收集剩余参数）

```javascript
// 传统方式：arguments对象（不推荐）
function oldWay() {
    console.log(arguments); // 类数组对象，不够好用
}

// 现代方式：Rest参数（推荐）
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4)); // 10

// 混合使用
function greet(greeting, ...names) {
    return `${greeting} ${names.join(', ')}!`;
}

console.log(greet("Hello", "张三", "李四", "王五")); // "Hello 张三, 李四, 王五!"

// 实际应用：通用日志函数
function log(level, ...messages) {
    console.log(`[${level}]`, ...messages);
}

log("INFO", "用户登录", "ID:", 123); // [INFO] 用户登录 ID: 123
```

### Spread语法（展开语法）

```javascript
// 数组展开
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];

// 合并数组
let combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// 复制数组
let copy = [...arr1]; // [1, 2, 3]

// 找最大值
console.log(Math.max(...arr1)); // 3

// 对象展开（非常实用！）
let user = {name: "张三", age: 30};
let userWithCity = {...user, city: "北京"}; // {name: "张三", age: 30, city: "北京"}

// 覆盖属性
let updatedUser = {...user, age: 31}; // {name: "张三", age: 31}

// 实际应用：React/Vue中的状态更新
function updateUserProfile(currentUser, updates) {
    return {...currentUser, ...updates, updatedAt: new Date()};
}
```

## 🔥 必须掌握：箭头函数深入理解

### 箭头函数 vs 普通函数

```javascript
// 普通函数
function normalFunction(x) {
    return x * 2;
}

// 箭头函数
const arrowFunction = (x) => x * 2;

// 简写形式
const double = x => x * 2;           // 单参数可省略括号
const add = (a, b) => a + b;         // 单表达式可省略return
const createUser = name => ({        // 返回对象需要括号
    name: name,
    createdAt: new Date()
});
```

### this绑定的重要区别

```javascript
const obj = {
    name: "张三",
    
    // 普通方法：this指向调用对象
    regularMethod: function() {
        console.log("普通方法:", this.name); // "张三"
        
        // 内部函数的this指向问题
        setTimeout(function() {
            console.log("普通函数内部:", this.name); // undefined
        }, 100);
        
        // 箭头函数继承外层this
        setTimeout(() => {
            console.log("箭头函数内部:", this.name); // "张三"
        }, 100);
    },
    
    // 箭头函数方法：this指向外层（注意陷阱！）
    arrowMethod: () => {
        console.log("箭头方法:", this.name); // undefined（this不是obj）
    }
};

obj.regularMethod();
obj.arrowMethod();
```

### 实际应用场景

```javascript
// Vue/React事件处理
class TodoApp {
    constructor() {
        this.todos = [];
    }
    
    // 箭头函数自动绑定this，不需要bind
    addTodo = (text) => {
        this.todos.push({
            id: Date.now(),
            text: text,
            completed: false
        });
    }
    
    // 数组处理中的箭头函数
    getCompletedTodos = () => {
        return this.todos.filter(todo => todo.completed);
    }
}

// 数组处理（最常用）
const users = [
    {name: "张三", age: 25},
    {name: "李四", age: 30},
    {name: "王五", age: 35}
];

const adultNames = users
    .filter(user => user.age >= 30)
    .map(user => user.name);
```

## 🔄 异步编程基础

> **注意**: setTimeout/setInterval的详细用法和事件循环机制请参考 [`js-event-loop-complete-analysis.md`](./js-event-loop-complete-analysis.md) 完整分析文档。

这里只保留与函数相关的核心概念：

```javascript
// 在异步回调中保持this绑定
const obj = {
    name: "示例对象",
    
    // 普通函数：this可能丢失
    regularCallback: function() {
        setTimeout(function() {
            console.log(this.name); // undefined
        }, 100);
    },
    
    // 箭头函数：自动绑定this
    arrowCallback: function() {
        setTimeout(() => {
            console.log(this.name); // "示例对象"
        }, 100);
    }
};
```

## ⚡ 重要理解：变量作用域和闭包

### 作用域基础

```javascript
// 全局作用域
let globalVar = "我是全局变量";

function outerFunction() {
    // 函数作用域
    let outerVar = "我是外层变量";
    
    function innerFunction() {
        // 内层作用域
        let innerVar = "我是内层变量";
        
        // 可以访问所有外层变量
        console.log(globalVar); // ✓
        console.log(outerVar);  // ✓
        console.log(innerVar);  // ✓
    }
    
    innerFunction();
    // console.log(innerVar); // ✗ 无法访问内层变量
}
```

### 闭包的实际应用

```javascript
// 数据私有化
function createCounter() {
    let count = 0; // 私有变量

    return {
        increment: () => ++count,
        decrement: () => --count,
        getValue: () => count
    };
}

const counter = createCounter();
console.log(counter.getValue()); // 0
counter.increment();
console.log(counter.getValue()); // 1
// count变量无法直接访问，实现了数据封装

// 模块模式
const userModule = (function() {
    let users = []; // 私有数据

    return {
        addUser: function(user) {
            users.push(user);
        },
        getUsers: function() {
            return [...users]; // 返回副本，保护原数据
        },
        getUserCount: function() {
            return users.length;
        }
    };
})();

userModule.addUser({name: "张三"});
console.log(userModule.getUserCount()); // 1
```

### ⚠️ 经典闭包陷阱: 循环中的 `var`

```javascript
function count() {
    let arr = [];
    for (var i=1; i<=3; i++) {
        arr.push(function () {
            return i * i;
        });
    }
    return arr;
}

let results = count();
let [f1, f2, f3] = results;

f1();  // 16 ❌ 预期是 1
f2();  // 16 ❌ 预期是 4
f3();  // 16 ❌ 预期是 9
```

**为什么全都是 16？**

#### 问题根源: `var` 的函数作用域

```javascript
// var 声明的 i 是函数作用域，不是块作用域
for (var i=1; i<=3; i++) {
    // 整个 count() 函数只有一个 i 变量
}

// 等价于:
var i;  // 变量提升到函数顶部
for (i=1; i<=3; i++) {
    // 所有推入的函数都引用同一个 i
}
```

#### 执行流程详解

```javascript
// 第1轮循环: i=1
arr.push(function () { return i * i; });  // 推入函数1

// 第2轮循环: i=2
arr.push(function () { return i * i; });  // 推入函数2

// 第3轮循环: i=3
arr.push(function () { return i * i; });  // 推入函数3

// 循环结束: i++ → i=4 (条件 i<=3 不满足，退出)

// ⚠️ 此时 arr 包含3个函数，但它们都引用同一个变量 i
// 此时 i 的值是 4

// 调用函数时:
f1();  // 执行 i * i，此时 i=4 → 4*4 = 16
f2();  // 执行 i * i，此时 i=4 → 4*4 = 16
f3();  // 执行 i * i，此时 i=4 → 4*4 = 16
```

#### 关键理解: 闭包捕获的是引用，不是值

```javascript
arr.push(function () { return i * i; });

// 这个函数不是存储 i 的当前值
// 而是存储对变量 i 的引用
// 等函数真正执行时，才去取 i 的值
```

#### 解决方案

**方法1: 使用 `let` (最简单) ✅**

```javascript
function count() {
    let arr = [];
    for (let i=1; i<=3; i++) {  // 改用 let
        arr.push(function () {
            return i * i;
        });
    }
    return arr;
}

let results = count();
let [f1, f2, f3] = results;
f1();  // 1 ✅
f2();  // 4 ✅
f3();  // 9 ✅
```

**原理**: `let` 是块作用域，每次循环都创建新的 `i` 变量

```javascript
for (let i=1; i<=3; i++) {
    // 每次循环，let 都创建一个新的 i
    // 第1轮: 新的 i=1
    // 第2轮: 新的 i=2
    // 第3轮: 新的 i=3
}
```

**方法2: 立即执行函数 (IIFE)**

```javascript
function count() {
    let arr = [];
    for (var i=1; i<=3; i++) {
        arr.push((function (n) {  // 立即执行函数
            return function () {
                return n * n;
            };
        })(i));  // 传入当前 i 的值
    }
    return arr;
}
```

**原理**: 立即执行函数创建新作用域，`n` 捕获当前 `i` 的值

```javascript
// 第1轮: (function(n) {...})(1) → n=1，返回的函数引用 n=1
// 第2轮: (function(n) {...})(2) → n=2，返回的函数引用 n=2
// 第3轮: (function(n) {...})(3) → n=3，返回的函数引用 n=3
```

**方法3: 辅助函数**

```javascript
function count() {
    let arr = [];
    function createFunc(n) {
        return function () {
            return n * n;
        };
    }
    for (var i=1; i<=3; i++) {
        arr.push(createFunc(i));
    }
    return arr;
}
```

#### 可视化理解

**使用 `var` 的情况 (错误)**:
```
count() 函数作用域
│
├── i (共享变量)
│   ├── 循环后值: 4
│   │
│   └── 3个函数都引用这个 i
│       ├── function() { return i * i }  → i=4 → 16
│       ├── function() { return i * i }  → i=4 → 16
│       └── function() { return i * i }  → i=4 → 16
```

**使用 `let` 的情况 (正确)**:
```
循环每次迭代创建新的块作用域
│
├── 第1轮: i=1 的块作用域
│   └── function() { return i * i }  → i=1 → 1
│
├── 第2轮: i=2 的块作用域
│   └── function() { return i * i }  → i=2 → 4
│
└── 第3轮: i=3 的块作用域
    └── function() { return i * i }  → i=3 → 9
```

#### 对比 Go 语言

Go 没有这个问题，因为循环变量会被正确捕获：

```go
func count() []func() int {
    var funcs []func() int
    for i := 1; i <= 3; i++ {
        i := i  // 创建新变量 (Go 1.22之前需要)
        funcs = append(funcs, func() int {
            return i * i
        })
    }
    return funcs
}

// 调用:
// funcs[0]()  → 1
// funcs[1]()  → 4
// funcs[2]()  → 9
```

**注意**: Go 1.22+ 循环变量默认是每次迭代的新变量，不需要 `i := i` 了。

#### 核心总结

1. **`var` vs `let`**:
   - `var`: 函数作用域，循环中只有一个变量
   - `let`: 块作用域，每次循环创建新变量

2. **闭包捕获引用**:
   - 函数保存的是变量的引用，不是值
   - 函数执行时才取变量的当前值

3. **最佳实践**:
   - ✅ **优先使用 `let`**，避免这类陷阱
   - 理解作用域和闭包的工作原理
   - 老代码中用 IIFE 修复

## ⚡ 重要理解：函数绑定

### call、apply、bind的区别

```javascript
const person = {
    name: "张三",
    greet: function(greeting, punctuation) {
        return `${greeting}, 我是${this.name}${punctuation}`;
    }
};

const anotherPerson = {name: "李四"};

// call：立即调用，参数逐个传递
console.log(person.greet.call(anotherPerson, "你好", "!"));
// "你好, 我是李四!"

// apply：立即调用，参数用数组传递
console.log(person.greet.apply(anotherPerson, ["嗨", "~"]));
// "嗨, 我是李四~"

// bind：返回新函数，不立即调用
const boundGreet = person.greet.bind(anotherPerson);
console.log(boundGreet("欢迎", "。"));
// "欢迎, 我是李四。"
```

### 实际应用场景

```javascript
// 事件处理器中保持this
class Button {
    constructor(element) {
        this.element = element;
        this.clickCount = 0;
        
        // 绑定this，确保事件处理器中this指向正确
        this.element.addEventListener('click', this.handleClick.bind(this));
    }
    
    handleClick() {
        this.clickCount++;
        console.log(`按钮被点击了 ${this.clickCount} 次`);
    }
}

// 借用方法
const arrayLike = {0: 'a', 1: 'b', 2: 'c', length: 3};
const realArray = Array.prototype.slice.call(arrayLike);// 借用了 slice 方法
console.log(realArray); // ['a', 'b', 'c']
```

## 📚 了解即可（现在可跳过）

### 递归和堆栈
```javascript
// 了解概念即可，实际开发中循环更常用
function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}
```

### var的问题
```javascript
// 了解即可：现代开发用let/const，不用var
var oldWay = "有作用域提升和其他问题";
let modernWay = "推荐使用";
const constantWay = "不可重新赋值";
```

### 全局对象
```javascript
// 了解即可：window(浏览器)、global(Node.js)
// 现代模块化开发很少直接操作全局对象
```

### 函数对象和NFE
```javascript
// 了解即可：函数的name、length属性等
function example() {}
console.log(example.name); // "example"
```


### 装饰器模式
```javascript
// 了解即可：高级模式，框架内部使用
function decorator(func) {
    return function(...args) {
        console.log('调用前');
        const result = func.apply(this, args);
        console.log('调用后');
        return result;
    };
}
```

---

## 实际开发模式

### 现代函数式编程风格

```javascript
// 数据处理管道
const processUsers = (users) => 
    users
        .filter(user => user.active)
        .map(user => ({
            ...user,
            displayName: user.name.toUpperCase()
        }))
        .sort((a, b) => a.displayName.localeCompare(b.displayName));

// 异步操作
const fetchUserData = async (userId) => {
    try {
        const response = await fetch(`/api/users/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('获取用户数据失败:', error);
        return null;
    }
};

// 事件处理
const handleFormSubmit = async (formData) => {
    const result = await submitForm(formData);
    if (result.success) {
        showSuccessMessage();
    } else {
        showErrorMessage(result.error);
    }
};
```

## 学习建议

### 现在重点掌握
1. **Rest/Spread语法** - 现代JS核心特性
2. **箭头函数** - 简洁语法，理解this绑定
3. **setTimeout/setInterval** - 异步编程基础
4. **闭包基本概念** - 理解作用域和数据封装

### 实践方向
- 用箭头函数重写现有代码
- 练习数组的map/filter/reduce
- 实现简单的防抖函数
- 理解Vue/React中的this绑定

### 暂时跳过
- 复杂的闭包应用
- 装饰器模式
- 函数的高级特性

这些内容掌握后，你就具备了现代JavaScript函数编程的核心技能，足以应对大部分开发场景！