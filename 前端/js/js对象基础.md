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