# JavaScript 原型链继承图解

基于经典的 Person 和 Student 类原型链继承示例，深度图解 JavaScript 原型链机制。

## 代码结构概述
- **Person**: 父类构造函数，包含 `name` 和 `age` 属性
- **Student**: 子类构造函数，继承 Person 并添加 `major` 属性
- **继承方式**: 使用 `Object.create()` 和 `call()` 实现原型链继承

## 原型链继承图

```mermaid
graph TD
    %% 实例对象
    student1["student1<br/>{name: 'Charlie', age: 22, major: 'Computer Science'}"]
    person1["person1<br/>{name: 'Alice', age: 25}"]
    
    %% 构造函数
    Student["Student 构造函数<br/>function Student(name, age, major)"]
    Person["Person 构造函数<br/>function Person(name, age)"]
    Object_Constructor["Object 构造函数<br/>function Object()"]
    
    %% 原型对象
    StudentPrototype["Student.prototype<br/>{constructor: Student, study: function}"]
    PersonPrototype["Person.prototype<br/>{constructor: Person, sayHello: function, eat: function}"]
    ObjectPrototype["Object.prototype<br/>{toString, valueOf, hasOwnProperty, ...}"]
    
    %% null 终点
    Null["null<br/>(原型链终点)"]
    
    %% 实例到原型的关系 (__proto__)
    student1 -.->|"__proto__"| StudentPrototype
    person1 -.->|"__proto__"| PersonPrototype
    
    %% 原型链向上查找
    StudentPrototype -.->|"__proto__"| PersonPrototype
    PersonPrototype -.->|"__proto__"| ObjectPrototype
    ObjectPrototype -.->|"__proto__"| Null
    
    %% 构造函数到原型的关系 (prototype)
    Student ==>|"prototype"| StudentPrototype
    Person ==>|"prototype"| PersonPrototype
    Object_Constructor ==>|"prototype"| ObjectPrototype
    
    %% 原型到构造函数的关系 (constructor)
    StudentPrototype -->|"constructor"| Student
    PersonPrototype -->|"constructor"| Person
    ObjectPrototype -->|"constructor"| Object_Constructor
    
    %% 创建关系 (new)
    Student -.->|"new"| student1
    Person -.->|"new"| person1
    
    %% 样式
    classDef instance fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef constructor fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef prototype fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef special fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    
    class student1,person1 instance
    class Student,Person,Object_Constructor constructor
    class StudentPrototype,PersonPrototype,ObjectPrototype prototype
    class Null special
```

## 方法查找过程

当调用 `student1.sayHello()` 时的查找过程：

```mermaid
flowchart TD
    A["student1.sayHello()"] --> B{"在 student1 对象上<br/>找到 sayHello 方法?"}
    B -->|否| C{"在 Student.prototype 上<br/>找到 sayHello 方法?"}
    C -->|否| D{"在 Person.prototype 上<br/>找到 sayHello 方法?"}
    D -->|是| E["调用 Person.prototype.sayHello<br/>返回: 'Hello, my name is Charlie'"]
    
    B -->|是| F["调用该方法"]
    C -->|是| G["调用该方法"]
    D -->|否| H{"继续向上查找到<br/>Object.prototype"}
    H -->|找不到| I["抛出 TypeError"]
    
    %% 样式
    classDef found fill:#c8e6c9,stroke:#4caf50,stroke-width:2px
    classDef notfound fill:#ffcdd2,stroke:#f44336,stroke-width:2px
    classDef process fill:#e1f5fe,stroke:#2196f3,stroke-width:2px
    
    class E,F,G found
    class I notfound
    class A,B,C,D,H process
```

## 关键概念说明

### 1. 原型链查找规则
- 先在实例对象自身查找属性/方法
- 找不到则沿着 `__proto__` 链向上查找
- 直到 `Object.prototype.__proto__` (null) 为止

### 2. 继承实现关键步骤
```javascript
// 1. 继承属性: 在子类构造函数中调用父类构造函数
Person.call(this, name, age);

// 2. 继承方法: 设置原型链关系
Student.prototype = Object.create(Person.prototype);

// 3. 修复构造函数指向
Student.prototype.constructor = Student;
```

### 3. 原型链的优势
- **方法共享**: 所有实例共享原型上的方法，节省内存
- **动态扩展**: 可以动态给原型添加方法，所有实例立即可用
- **继承机制**: 通过原型链实现类之间的继承关系

### 4. 实际代码示例

```javascript
// 父类构造函数
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// 在原型上添加方法
Person.prototype.sayHello = function() {
    return `Hello, my name is ${this.name}`;
};

Person.prototype.eat = function() {
    return `${this.name} is eating`;
};

// 子类构造函数
function Student(name, age, major) {
    // 继承属性
    Person.call(this, name, age);  
    this.major = major;  
}

// 继承方法（设置原型链）
Student.prototype = Object.create(Person.prototype);  
// 修复构造函数指向
Student.prototype.constructor = Student;  

// 添加子类特有方法
Student.prototype.study = function() {
    return `${this.name} is studying ${this.major}`;
};

// 使用示例
const student1 = new Student('Charlie', 22, 'Computer Science');
console.log(student1.sayHello()); // 继承自Person
console.log(student1.study());    // Student特有方法

// 原型链验证
console.log(student1.__proto__ === Student.prototype);                    // true
console.log(Student.prototype.__proto__ === Person.prototype);           // true
console.log(Person.prototype.__proto__ === Object.prototype);            // true
console.log(Object.prototype.__proto__ === null);                        // true
```

## 与现代 ES6 Class 的对比

ES6 的 class 语法本质上也是基于原型链的语法糖：

```javascript
// ES6 Class 写法
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    sayHello() {
        return `Hello, my name is ${this.name}`;
    }
}

class Student extends Person {
    constructor(name, age, major) {
        super(name, age);  // 等价于 Person.call(this, name, age)
        this.major = major;
    }
    
    study() {
        return `${this.name} is studying ${this.major}`;
    }
}

// 原型链结构完全相同
const student = new Student('Alice', 20, 'Math');
console.log(student.__proto__ === Student.prototype);              // true
console.log(Student.prototype.__proto__ === Person.prototype);     // true
```

这种原型链继承机制是 JavaScript 面向对象编程的核心，理解它对掌握 JavaScript 和现代框架（如 Vue 3）的响应式原理都很重要。