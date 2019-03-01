# 其他语言的面向对象
- 类：类是对象的类型模板，例如，定义Student类来表示学生，类本身是一种类型，Student表示学生类型，但不表示任何具体的某个学生；
- 实例：实例是根据类创建的对象，例如，根据Student类可以创建出xiaoming、xiaohong、xiaojun等多个实例，每个实例表示一个具体的学生，他们全都属于Student类型。

# JS 的面向对象
- JavaScript不区分类和实例的概念，而是通过原型（prototype）来实现面向对象编程
- 原型是指当我们想要创建xiaoming这个具体的学生时，我们并没有一个Student类型可用。那怎么办？恰好有这么一个现成的对象：
    ```js
    var robot = {
        name: 'Robot',
        height: 1.6,
        run: function () {
            console.log(this.name + ' is running...');
        }
    };
    ```
- 我们看这个robot对象有名字，有身高，还会跑，有点像小明，干脆就根据它来“创建”小明得了！于是我们把它改名为Student，然后创建出xiaoming：
    ```js
    var Student = {
        name: 'Robot',
        height: 1.2,
        run: function () {
            console.log(this.name + ' is running...');
        }
    };

    var xiaoming = {
        name: '小明'
    };

    xiaoming.__proto__ = Student; // 把xiaoming的原型指向了对象Student，看上去xiaoming仿佛是从Student继承下来的：

    xiaoming.name; // '小明'
    xiaoming.run(); // 小明 is running...
    ```

- JavaScript的原型链和Java的Class区别就在，它没有“Class”的概念，所有对象都是实例，所谓继承关系不过是把一个对象的原型指向另一个对象而已。
    ```js
    var Bird = {
        fly: function () {
            console.log(this.name + ' is flying...');
        }
    };

    xiaoming.__proto__ = Bird;
    xiaoming.fly(); // 小明 is flying...现在xiaoming已经无法run()了，他已经变成了一只鸟：
    ```
在JavaScrip代码运行时期，你可以把xiaoming从Student变成Bird，或者变成任何对象。

# 使用Object.create()创建对象
- 在编写JavaScript代码时，不要直接用`obj.__proto__`去改变一个对象的原型，并且，低版本的IE也无法使用`__proto__`
- Object.create()方法可以传入一个原型对象，并创建一个基于该原型的新对象，但是新对象什么属性都没有，因此，我们可以编写一个函数来创建xiaoming
    ```js
    // 原型对象:
    var Student = {
        name: 'Robot',
        height: 1.2,
        run: function () {
            console.log(this.name + ' is running...');
        }
    };

    function createStudent(name) {
        // 基于Student原型创建一个新对象:
        var s = Object.create(Student);
        // 初始化新对象:
        s.name = name;
        return s;
    }

    var xiaoming = createStudent('小明');
    xiaoming.run(); // 小明 is running...
    xiaoming.__proto__ === Student; // true
    ```

# 原型链
- 每个创建的对象都会设置一个原型，指向它的原型对象
- 当我们用obj.xxx访问一个对象的属性时，JavaScript引擎先在当前对象上查找该属性，如果没有找到，就到其原型对象上找，如果还没有找到，就一直上溯到Object.prototype对象，最后，如果还没有找到，就只能返回undefined
- Array 的原型链
    ```js
    var arr = [1, 2, 3]; // arr ----> Array.prototype ----> Object.prototype ----> null
    ```
    Array.prototype定义了indexOf()、shift()等方法，因此你可以在所有的Array对象上直接调用这些方法
- Function 的原型链
    ```js
    function foo() {
        return 0;
    } // foo ----> Function.prototype ----> Object.prototype ----> null
    ```
由于Function.prototype定义了apply()等方法，因此，所有函数都可以调用apply()方法

# 构造函数
- 用于创建一个对象
    ```js
    function Student(name) {
        this.name = name;
        this.hello = function () {
            alert('Hello, ' + this.name + '!');
        }
    }
    var xiaoming = new Student('小明');
    xiaoming.name; // '小明'
    xiaoming.hello(); // Hello, 小明!
    ```
如果不写new，这就是一个普通函数，它返回undefined。但是，如果写了new，它就变成了一个构造函数，它绑定的this指向新创建的对象，并默认返回this，也就是说，不需要在最后写return this;
- 使用它创建出来的对象的原型链
    ```js
    xiaoming ↘
    xiaohong -→ Student.prototype ----> Object.prototype ----> null
    xiaojun  ↗
    ```

- 用new Student()创建的对象还从原型上获得了一个constructor属性，它指向函数Student本身：
    ```js
    xiaoming.constructor === Student.prototype.constructor; // true
    Student.prototype.constructor === Student; // true

    Object.getPrototypeOf(xiaoming) === Student.prototype; // true

    xiaoming instanceof Student; // true
    ```

- 通过new Student()创建了很多对象，这些对象的hello函数实际上只需要共享同一个函数就可以了,只要把hello函数移动到xiaoming、xiaohong这些对象共同的原型
    ```js
    function Student(name) {
        this.name = name;
    }

    Student.prototype.hello = function () {
        alert('Hello, ' + this.name + '!');
    };
    ```
- 照约定，构造函数首字母应当大写，而普通函数首字母应当小写

- 编写一个createStudent()函数，在内部封装所有的new操作
    ```js
    function Student(props) {
        this.name = props.name || '匿名'; // 默认值为'匿名'
        this.grade = props.grade || 1; // 默认值为1
    }

    Student.prototype.hello = function () {
        alert('Hello, ' + this.name + '!');
    };

    function createStudent(props) {
        return new Student(props || {})
    }
    var xiaoming = createStudent({
        name: '小明'
    });

    xiaoming.grade; // 1
    ```
如果创建的对象有很多属性，我们只需要传递需要的某些属性，剩下的属性可以用默认值。由于参数是一个Object，我们无需记忆参数的顺序。如果恰好从JSON拿到了一个对象，就可以直接创建出xiaoming。

# 继承 基于原型
- 算了吧,太绕
- 我们必须借助一个中间对象来实现正确的原型链，这个中间对象的原型要指向Student.prototype
```js
new PrimaryStudent() ----> PrimaryStudent.prototype ----> Student.prototype ----> Object.prototype ----> null
```

# 使用 class ES6
- class
    ```js
    class Student {
        constructor(name) {
            this.name = name;
        }

        hello() {
            alert('Hello, ' + this.name + '!');
        }
    }
    var xiaoming = new Student('小明');
    xiaoming.hello();
    ```

- extends
    ```js
    class PrimaryStudent extends Student {
        constructor(name, grade) {
            super(name); // 记得用super调用父类的构造方法!
            this.grade = grade;
        }

        myGrade() {
            alert('I am at grade ' + this.grade);
        }
    }
    ```
就需要一个工具把class代码转换为传统的prototype代码，可以试试**Babel**这个工具
