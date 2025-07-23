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