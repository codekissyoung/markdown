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

getter/setter是现代JavaScript中很实用的特性，特别是在Vue、React等框架开发中经常遇到。掌握基本用法就足以应对大部分开发需求了！