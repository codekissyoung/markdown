# Python 面向对象编程完全指南

**学习日期**: 2025-11-10
**前置知识**: Python 函数、数据结构
**对比语言**: Go、PHP、JavaScript
**核心特性**: 魔法方法、多继承、鸭子类型、属性装饰器

---

## 一、类的基础

### 1. 定义类和创建实例

```python
# 最简单的类
class User:
    pass

# 创建实例
user = User()
print(type(user))  # <class '__main__.User'>
```

### 2. 构造函数 `__init__`

```python
class User:
    def __init__(self, name, age):
        """构造函数，创建实例时自动调用"""
        self.name = name  # 实例属性
        self.age = age

# 创建实例
user = User("Link", 30)
print(user.name)  # Link
print(user.age)   # 30
```

**关键点**：
- `__init__` 是构造函数（不是 `__new__`，`__new__` 更底层）
- `self` 代表实例本身（类似其他语言的 `this`）
- `self.name` 是实例属性，每个实例独立

**Go 对比**：

```go
// Go 的结构体
type User struct {
    Name string
    Age  int
}

// 创建实例
user := User{Name: "Link", Age: 30}
// 或者
user := User{"Link", 30}
```

**PHP 对比**：

```php
class User {
    public $name;
    public $age;

    public function __construct($name, $age) {
        $this->name = $name;
        $this->age = $age;
    }
}

$user = new User("Link", 30);
```

### 3. 实例方法

```python
class User:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        """实例方法，第一个参数必须是 self"""
        return f"Hello, I'm {self.name}"

    def is_adult(self):
        return self.age >= 18

user = User("Link", 30)
print(user.greet())      # "Hello, I'm Link"
print(user.is_adult())   # True
```

**规则**：
- 实例方法第一个参数**必须是 `self`**
- 调用时不需要传 `self`，Python 自动传递
- `self` 名字可以改，但约定用 `self`

### 4. 类属性 vs 实例属性

```python
class User:
    # 类属性（所有实例共享）
    count = 0
    species = "Human"

    def __init__(self, name):
        # 实例属性（每个实例独立）
        self.name = name
        User.count += 1  # 修改类属性

user1 = User("Alice")
user2 = User("Bob")

# 类属性
print(User.count)    # 2  ← 通过类访问
print(user1.count)   # 2  ← 通过实例也能访问
print(user2.count)   # 2

# 实例属性独立
print(user1.name)    # Alice
print(user2.name)    # Bob

# 所有实例共享类属性
print(user1.species)  # Human
print(user2.species)  # Human
```

**⚠️ 常见陷阱**：

```python
class User:
    count = 0

    def __init__(self, name):
        self.name = name
        self.count += 1  # ❌ 错误！创建了实例属性 count

user1 = User("Alice")
user2 = User("Bob")

print(User.count)    # 0  ← 类属性未变
print(user1.count)   # 1  ← 实例属性
print(user2.count)   # 1  ← 实例属性
```

**正确写法**：

```python
class User:
    count = 0

    def __init__(self, name):
        self.name = name
        User.count += 1  # ✅ 修改类属性

user1 = User("Alice")
user2 = User("Bob")
print(User.count)  # 2
```

**内存示意**：

```
类属性（共享）
User.count = 2
User.species = "Human"

实例1                实例2
user1.name = "Alice"  user2.name = "Bob"
```

---

## 二、魔法方法（特殊方法）

Python 的魔法方法让你的类**行为像内置类型**。

### 1. `__str__` 和 `__repr__`

```python
class User:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __str__(self):
        """给用户看的字符串（print 调用）"""
        return f"User({self.name}, {self.age})"

    def __repr__(self):
        """给开发者看的字符串（调试用）"""
        return f"User(name={self.name!r}, age={self.age!r})"

user = User("Link", 30)
print(str(user))   # User(Link, 30)
print(repr(user))  # User(name='Link', age=30)
print(user)        # User(Link, 30)  ← 调用 __str__

# 交互式解释器
>>> user
User(name='Link', age=30)  ← 调用 __repr__
```

**规则**：
- `__str__`：用户友好，`print()` 时调用
- `__repr__`：开发者友好，交互式解释器显示
- 如果只定义一个，优先定义 `__repr__`
- `__repr__` 应该尽量返回能重新创建对象的代码

**Go 对比**：

```go
// Go 的 String() 方法（类似 __str__）
func (u User) String() string {
    return fmt.Sprintf("User(%s, %d)", u.Name, u.Age)
}
```

### 2. `__len__`

```python
class Playlist:
    def __init__(self, songs):
        self.songs = songs

    def __len__(self):
        """让对象支持 len()"""
        return len(self.songs)

playlist = Playlist(["Song1", "Song2", "Song3"])
print(len(playlist))  # 3  ← 调用 __len__
```

### 3. `__getitem__` 和 `__setitem__`（索引访问）

```python
class Playlist:
    def __init__(self, songs):
        self.songs = songs

    def __getitem__(self, index):
        """支持 playlist[0]"""
        return self.songs[index]

    def __setitem__(self, index, value):
        """支持 playlist[0] = "new song" """
        self.songs[index] = value

    def __len__(self):
        return len(self.songs)

playlist = Playlist(["Song1", "Song2", "Song3"])

# 索引访问
print(playlist[0])     # Song1
playlist[0] = "NewSong"
print(playlist[0])     # NewSong

# 支持切片
print(playlist[0:2])   # ['NewSong', 'Song2']

# 支持 for 循环（因为有 __getitem__）
for song in playlist:
    print(song)
```

### 4. `__eq__`, `__lt__`, `__gt__`（比较运算符）

```python
class User:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __eq__(self, other):
        """支持 =="""
        if not isinstance(other, User):
            return False
        return self.name == other.name and self.age == other.age

    def __lt__(self, other):
        """支持 <"""
        return self.age < other.age

    def __gt__(self, other):
        """支持 >"""
        return self.age > other.age

    def __repr__(self):
        return f"User({self.name!r}, {self.age})"

user1 = User("Alice", 25)
user2 = User("Bob", 30)
user3 = User("Alice", 25)

# 比较
print(user1 == user3)   # True
print(user1 == user2)   # False
print(user1 < user2)    # True

# 可以排序
users = [user2, user1]
sorted_users = sorted(users)
print(sorted_users)  # [User('Alice', 25), User('Bob', 30)]
```

**完整比较运算符**：

| 魔法方法 | 运算符 | 说明 |
|:---------|:-------|:-----|
| `__eq__` | `==` | 等于 |
| `__ne__` | `!=` | 不等于（默认是 `not __eq__`） |
| `__lt__` | `<` | 小于 |
| `__le__` | `<=` | 小于等于 |
| `__gt__` | `>` | 大于 |
| `__ge__` | `>=` | 大于等于 |

### 5. `__add__`, `__sub__`（算术运算符）

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        """支持 +"""
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        """支持 -"""
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        """支持 *"""
        return Vector(self.x * scalar, self.y * scalar)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(1, 2)
v2 = Vector(3, 4)

print(v1 + v2)  # Vector(4, 6)
print(v1 - v2)  # Vector(-2, -2)
print(v1 * 3)   # Vector(3, 6)
```

### 6. `__call__`（让对象可调用）

```python
class Multiplier:
    def __init__(self, factor):
        self.factor = factor

    def __call__(self, x):
        """让对象像函数一样调用"""
        return x * self.factor

times3 = Multiplier(3)
print(times3(10))  # 30  ← 对象像函数一样被调用
print(times3(5))   # 15

# 检查是否可调用
print(callable(times3))  # True
```

**应用场景**：装饰器可以用类实现

```python
from functools import wraps

class Log:
    def __init__(self, func):
        self.func = func
        wraps(func)(self)  # 保留原函数元信息

    def __call__(self, *args, **kwargs):
        print(f"调用 {self.func.__name__}")
        return self.func(*args, **kwargs)

@Log
def add(a, b):
    return a + b

result = add(1, 2)  # 输出: 调用 add
print(result)       # 3
```

### 7. 常用魔法方法总览

| 类别 | 魔法方法 | 作用 | 示例 |
|:-----|:---------|:-----|:-----|
| **对象表示** | `__init__` | 构造函数 | `User("Link")` |
| | `__str__` | `str(obj)`, `print(obj)` | `print(user)` |
| | `__repr__` | `repr(obj)`, 交互式显示 | `>>> user` |
| **容器** | `__len__` | `len(obj)` | `len(playlist)` |
| | `__getitem__` | `obj[key]` | `playlist[0]` |
| | `__setitem__` | `obj[key] = value` | `playlist[0] = "song"` |
| | `__delitem__` | `del obj[key]` | `del playlist[0]` |
| | `__contains__` | `item in obj` | `"song" in playlist` |
| **比较** | `__eq__` | `obj1 == obj2` | `user1 == user2` |
| | `__lt__` | `obj1 < obj2` | `user1 < user2` |
| | `__gt__` | `obj1 > obj2` | `user1 > user2` |
| **算术** | `__add__` | `obj1 + obj2` | `vec1 + vec2` |
| | `__sub__` | `obj1 - obj2` | `vec1 - vec2` |
| | `__mul__` | `obj1 * obj2` | `vec1 * 3` |
| **其他** | `__call__` | `obj()` | `multiplier(5)` |
| | `__enter__`, `__exit__` | `with obj:` | 上下文管理器 |

---

## 三、继承

### 1. 单继承

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "Some sound"

    def describe(self):
        return f"I'm {self.name}"

class Dog(Animal):
    """Dog 继承 Animal"""
    def speak(self):
        """重写（override）父类方法"""
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"

# 使用
dog = Dog("Buddy")
print(dog.name)        # Buddy  ← 继承了父类的属性
print(dog.speak())     # Woof!  ← 重写了父类的方法
print(dog.describe())  # I'm Buddy  ← 继承了父类的方法

cat = Cat("Whiskers")
print(cat.speak())     # Meow!
```

**继承的好处**：
- 代码复用（子类自动获得父类的属性和方法）
- 多态（不同子类可以有不同实现）

### 2. `super()` 调用父类方法

```python
class Animal:
    def __init__(self, name):
        self.name = name
        print(f"Animal __init__: {name}")

    def speak(self):
        return "Some sound"

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)  # 调用父类的 __init__
        self.breed = breed
        print(f"Dog __init__: {breed}")

    def speak(self):
        # 调用父类方法并扩展
        parent_sound = super().speak()
        return f"{parent_sound} -> Woof!"

dog = Dog("Buddy", "Golden Retriever")
# 输出:
# Animal __init__: Buddy
# Dog __init__: Golden Retriever

print(dog.name)    # Buddy
print(dog.breed)   # Golden Retriever
print(dog.speak()) # Some sound -> Woof!
```

**`super()` 的作用**：
- 调用父类的方法
- 处理多继承时的方法解析顺序（MRO）
- 避免硬编码父类名（改父类名时不用改子类代码）

**Go 对比**：

```go
// Go 用嵌入（embedding）模拟继承
type Animal struct {
    Name string
}

func (a Animal) Speak() string {
    return "Some sound"
}

type Dog struct {
    Animal  // 嵌入 Animal
    Breed string
}

// 重写方法
func (d Dog) Speak() string {
    return "Woof!"
}

dog := Dog{
    Animal: Animal{Name: "Buddy"},
    Breed: "Golden Retriever",
}
```

### 3. 多继承（Python 特有）

```python
class Flyable:
    def fly(self):
        return "Flying..."

class Swimmable:
    def swim(self):
        return "Swimming..."

class Duck(Flyable, Swimmable):
    """Duck 同时继承 Flyable 和 Swimmable"""
    def quack(self):
        return "Quack!"

duck = Duck()
print(duck.fly())    # Flying...
print(duck.swim())   # Swimming...
print(duck.quack())  # Quack!
```

**多继承的应用场景**：
- Mixin 模式（混入功能）
- 组合不同的行为

### 4. 方法解析顺序（MRO）

```python
class A:
    def method(self):
        return "A"

class B(A):
    def method(self):
        return "B"

class C(A):
    def method(self):
        return "C"

class D(B, C):
    """多继承：D -> B -> C -> A"""
    pass

d = D()
print(d.method())  # B  ← 先找 B，再找 C

# 查看 MRO（方法解析顺序）
print(D.__mro__)
# (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)

# 或者
print(D.mro())
```

**MRO 规则**：
1. 子类优先于父类
2. 多个父类按照继承顺序从左到右
3. 保证每个类只出现一次（C3 线性化算法）

**图示**：

```
    A
   / \
  B   C
   \ /
    D

MRO: D -> B -> C -> A -> object
```

**复杂示例**：

```python
class Base:
    def method(self):
        return "Base"

class A(Base):
    def method(self):
        return "A"

class B(Base):
    def method(self):
        return "B"

class C(A, B):
    pass

c = C()
print(c.method())  # A
print(C.__mro__)
# (<class 'C'>, <class 'A'>, <class 'B'>, <class 'Base'>, <class 'object'>)
```

**Go 对比**：
- Go 不支持继承，只有接口（interface）和组合（embedding）
- Go 的设计哲学：组合优于继承

**PHP 对比**：
- PHP 不支持多继承
- PHP 有 trait（类似 Python 的 Mixin）

---

## 四、封装和属性

### 1. 私有属性（约定）

Python 没有真正的私有属性，只有约定。

```python
class User:
    def __init__(self, name, password):
        self.name = name              # 公开属性
        self._password = password     # "私有"属性（约定，单下划线）

    def check_password(self, password):
        return self._password == password

user = User("Link", "secret")
print(user.name)       # Link  ← 公开访问
print(user._password)  # secret  ← 仍然能访问，但约定不应该
```

**约定**：
- 单下划线 `_` 开头：内部使用，外部不应该访问（但可以）
- 双下划线 `__` 开头：名称改写（下面讲）

### 2. 名称改写（Name Mangling）

```python
class User:
    def __init__(self, name, password):
        self.name = name
        self.__password = password  # 双下划线开头

    def check_password(self, password):
        return self.__password == password

user = User("Link", "secret")
print(user.name)         # Link
print(user.__password)   # AttributeError  ← 无法直接访问

# 实际上只是名称改写
print(user._User__password)  # secret  ← 改写后的名字
```

**原理**：
- `__password` 被改写成 `_ClassName__password`
- 不是真正的私有，只是避免子类意外覆盖

**建议**：
- 通常用单下划线 `_` 就够了
- 双下划线 `__` 容易引起混淆，少用

### 3. `@property` 装饰器（最推荐）

```python
class User:
    def __init__(self, name, age):
        self._name = name
        self._age = age

    @property
    def name(self):
        """获取 name（像访问属性一样）"""
        return self._name

    @property
    def age(self):
        """获取 age"""
        return self._age

    @age.setter
    def age(self, value):
        """设置 age，可以加验证"""
        if value < 0:
            raise ValueError("年龄不能为负数")
        self._age = value

    @age.deleter
    def age(self):
        """删除 age"""
        print("删除 age 属性")
        del self._age

user = User("Link", 30)

# 像访问属性一样（调用 getter）
print(user.name)  # Link
print(user.age)   # 30

# 设置属性（调用 setter）
user.age = 31
print(user.age)   # 31

# 验证
try:
    user.age = -1  # ValueError: 年龄不能为负数
except ValueError as e:
    print(e)

# 删除属性（调用 deleter）
del user.age  # 输出: 删除 age 属性
```

**优势**：
- 外部看起来是属性，内部可以加逻辑（验证、计算等）
- 改变实现不影响接口
- 符合 Python 风格（不需要 getter/setter 方法）

### 4. 计算属性（只读）

```python
import math

class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("半径不能为负数")
        self._radius = value

    @property
    def diameter(self):
        """计算属性（只读）"""
        return self._radius * 2

    @property
    def area(self):
        """计算属性（只读）"""
        return math.pi * self._radius ** 2

    @property
    def circumference(self):
        """计算属性（只读）"""
        return 2 * math.pi * self._radius

circle = Circle(5)
print(circle.radius)         # 5
print(circle.diameter)       # 10
print(circle.area)           # 78.54
print(circle.circumference)  # 31.42

# 修改半径，其他属性自动更新
circle.radius = 10
print(circle.diameter)       # 20
print(circle.area)           # 314.16

# 只读属性不能设置
try:
    circle.diameter = 20  # AttributeError
except AttributeError as e:
    print("diameter 是只读属性")
```

**Go 对比**：

```go
// Go 用方法实现
type Circle struct {
    radius float64
}

func (c Circle) Diameter() float64 {
    return c.radius * 2
}

func (c Circle) Area() float64 {
    return math.Pi * c.radius * c.radius
}
```

---

## 五、类方法和静态方法

### 1. 实例方法（默认）

```python
class User:
    def __init__(self, name):
        self.name = name

    def greet(self):
        """实例方法，需要 self"""
        return f"Hello, {self.name}"

user = User("Link")
print(user.greet())  # Hello, Link
```

### 2. 类方法（`@classmethod`）

```python
class User:
    count = 0

    def __init__(self, name):
        self.name = name
        User.count += 1

    @classmethod
    def get_count(cls):
        """类方法，第一个参数是 cls（类本身）"""
        return cls.count

    @classmethod
    def from_dict(cls, data):
        """工厂方法，创建实例"""
        return cls(data["name"])

    @classmethod
    def create_batch(cls, names):
        """批量创建"""
        return [cls(name) for name in names]

# 使用
user1 = User("Alice")
user2 = User("Bob")

# 通过类调用
print(User.get_count())  # 2

# 通过实例也能调用（但不常见）
print(user1.get_count())  # 2

# 工厂方法
data = {"name": "Charlie"}
user3 = User.from_dict(data)
print(user3.name)  # Charlie

# 批量创建
users = User.create_batch(["David", "Eve"])
print([u.name for u in users])  # ['David', 'Eve']
print(User.get_count())  # 5
```

**应用场景**：
- 访问/修改类属性
- 工厂方法（多种构造方式）
- 替代构造函数

**完整示例：日期类**

```python
class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    @classmethod
    def from_string(cls, date_string):
        """从字符串创建（工厂方法）"""
        year, month, day = map(int, date_string.split('-'))
        return cls(year, month, day)

    @classmethod
    def today(cls):
        """返回今天的日期"""
        import datetime
        now = datetime.date.today()
        return cls(now.year, now.month, now.day)

    def __str__(self):
        return f"{self.year}-{self.month:02d}-{self.day:02d}"

# 多种创建方式
date1 = Date(2025, 11, 10)
date2 = Date.from_string("2025-11-10")
date3 = Date.today()

print(date1)  # 2025-11-10
print(date2)  # 2025-11-10
print(date3)  # 2025-11-10
```

### 3. 静态方法（`@staticmethod`）

```python
class Math:
    @staticmethod
    def add(a, b):
        """静态方法，不需要 self 或 cls"""
        return a + b

    @staticmethod
    def is_even(n):
        return n % 2 == 0

    @staticmethod
    def validate_positive(value):
        if value <= 0:
            raise ValueError("必须是正数")
        return True

# 通过类调用
print(Math.add(1, 2))      # 3
print(Math.is_even(4))     # True

# 通过实例也能调用（但没意义）
math = Math()
print(math.add(1, 2))      # 3
```

**应用场景**：
- 工具函数，与类相关但不需要访问实例或类
- 组织相关的函数到类命名空间下

**实战示例：验证器**

```python
class Validator:
    @staticmethod
    def is_email(email):
        """验证邮箱格式"""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

    @staticmethod
    def is_phone(phone):
        """验证手机号"""
        return len(phone) == 11 and phone.isdigit()

    @staticmethod
    def is_strong_password(password):
        """验证强密码"""
        if len(password) < 8:
            return False
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        return has_upper and has_lower and has_digit

# 使用
print(Validator.is_email("link@example.com"))  # True
print(Validator.is_phone("13800138000"))       # True
print(Validator.is_strong_password("Abc123"))  # False
```

### 4. 三种方法对比

| 方法类型 | 第一个参数 | 访问实例属性 | 访问类属性 | 典型用途 |
|:---------|:-----------|:-------------|:-----------|:---------|
| **实例方法** | `self` | ✅ | ✅ | 操作实例数据 |
| **类方法** | `cls` | ❌ | ✅ | 工厂方法、类级操作 |
| **静态方法** | 无 | ❌ | ❌ | 工具函数 |

**完整示例**：

```python
class Employee:
    # 类属性
    company = "TechCorp"
    employee_count = 0

    def __init__(self, name, salary):
        # 实例属性
        self.name = name
        self.salary = salary
        Employee.employee_count += 1

    # 实例方法
    def give_raise(self, amount):
        """给员工加薪"""
        self.salary += amount

    # 类方法
    @classmethod
    def get_employee_count(cls):
        """获取员工总数"""
        return cls.employee_count

    @classmethod
    def from_string(cls, emp_string):
        """工厂方法：从字符串创建"""
        name, salary = emp_string.split(',')
        return cls(name, int(salary))

    # 静态方法
    @staticmethod
    def is_valid_salary(salary):
        """验证工资是否合法"""
        return salary > 0

# 使用
emp1 = Employee("Alice", 50000)
emp1.give_raise(5000)  # 实例方法
print(emp1.salary)     # 55000

emp2 = Employee.from_string("Bob,60000")  # 类方法
print(emp2.name)       # Bob

print(Employee.get_employee_count())  # 2  ← 类方法
print(Employee.is_valid_salary(1000)) # True  ← 静态方法
```

---

## 六、跨语言对比

### 面向对象特性对比

| 特性 | Python | Go | PHP | JavaScript |
|:-----|:-------|:---|:----|:-----------|
| 类定义 | `class` | `struct` | `class` | `class` |
| 继承 | 单/多继承 | 组合（embedding） | 单继承 + trait | 单继承 |
| 私有属性 | 约定（`_`） | 小写首字母 | `private` | `#` 前缀 |
| 多态 | 鸭子类型 | 接口 | 接口 | 鸭子类型 |
| 魔法方法 | ✅ `__xxx__` | ❌ | `__xxx` | `Symbol.xxx` |
| 属性装饰器 | `@property` | ❌ | `__get`/`__set` | getter/setter |
| 类方法 | `@classmethod` | 值接收者 | `self::` | `static` |
| 静态方法 | `@staticmethod` | 函数 | `self::` | `static` |

### 继承方式对比

**Python（多继承）**：

```python
class A:
    pass

class B:
    pass

class C(A, B):  # 多继承
    pass
```

**Go（组合）**：

```go
type A struct {}
type B struct {}

type C struct {
    A  // 嵌入 A
    B  // 嵌入 B
}
```

**PHP（单继承 + Trait）**：

```php
trait A {
    public function methodA() {}
}

trait B {
    public function methodB() {}
}

class C extends Parent {
    use A, B;  // 使用 trait
}
```

**JavaScript（单继承）**：

```javascript
class A {}
class B {}

// JavaScript 不支持多继承
class C extends A {
    constructor() {
        super();
        // 只能组合 B 的功能
    }
}
```

---

## 七、最佳实践

### 1. 优先使用组合而非继承

```python
# ❌ 过度使用继承
class Animal:
    def eat(self):
        pass

class Flyable(Animal):
    def fly(self):
        pass

class Swimmable(Flyable):  # 不是所有会飞的都会游泳
    def swim(self):
        pass

# ✅ 使用组合
class Animal:
    def __init__(self):
        self.abilities = []

    def add_ability(self, ability):
        self.abilities.append(ability)

class FlyAbility:
    def fly(self):
        return "Flying..."

class SwimAbility:
    def swim(self):
        return "Swimming..."

# 灵活组合
duck = Animal()
duck.add_ability(FlyAbility())
duck.add_ability(SwimAbility())
```

### 2. 使用 `@property` 而非 getter/setter

```python
# ❌ Java 风格
class User:
    def __init__(self, name):
        self._name = name

    def get_name(self):
        return self._name

    def set_name(self, value):
        self._name = value

# ✅ Python 风格
class User:
    def __init__(self, name):
        self._name = name

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value):
        self._name = value
```

### 3. 单下划线标记内部使用

```python
class User:
    def __init__(self, name):
        self.name = name         # 公开
        self._internal = None    # 内部使用（约定）

    def _helper_method(self):    # 内部方法（约定）
        pass
```

### 4. 魔法方法必须有意义

```python
# ✅ 有意义的 __add__
class Money:
    def __init__(self, amount):
        self.amount = amount

    def __add__(self, other):
        return Money(self.amount + other.amount)

# ❌ 无意义的 __add__
class User:
    def __add__(self, other):
        # 两个用户相加是什么意思？
        pass
```

### 5. `__repr__` 应该能重建对象

```python
# ✅ 好的 __repr__
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

p = Point(1, 2)
print(repr(p))  # Point(1, 2)
# 可以直接复制这个输出重新创建对象

# ❌ 不好的 __repr__
class Point:
    def __repr__(self):
        return f"坐标: ({self.x}, {self.y})"
```

### 6. 类方法用于工厂模式

```python
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

    @classmethod
    def from_dict(cls, data):
        """从字典创建"""
        return cls(data['name'], data['email'])

    @classmethod
    def from_json(cls, json_string):
        """从 JSON 创建"""
        import json
        data = json.loads(json_string)
        return cls.from_dict(data)
```

### 7. 避免过深的继承层次

```python
# ❌ 过深的继承
class A: pass
class B(A): pass
class C(B): pass
class D(C): pass
class E(D): pass  # 太深了

# ✅ 扁平化，用组合
class A: pass
class B:
    def __init__(self):
        self.a = A()
```

**建议**：继承层次不超过 3 层。

---

## 八、总结

### Python OOP 核心特性

1. **魔法方法**：让自定义类行为像内置类型
2. **多继承**：灵活但需要理解 MRO
3. **鸭子类型**：不需要显式声明接口
4. **属性装饰器**：`@property` 提供优雅的封装
5. **类方法/静态方法**：灵活的方法组织方式

### 记忆要点

```python
# 类定义
class User:
    count = 0  # 类属性

    def __init__(self, name):
        self.name = name  # 实例属性
        User.count += 1

    # 实例方法
    def greet(self):
        return f"Hello, {self.name}"

    # 魔法方法
    def __str__(self):
        return f"User({self.name})"

    def __eq__(self, other):
        return self.name == other.name

    # 属性装饰器
    @property
    def display_name(self):
        return self.name.upper()

    # 类方法
    @classmethod
    def from_dict(cls, data):
        return cls(data['name'])

    # 静态方法
    @staticmethod
    def validate(name):
        return len(name) > 0

# 继承
class Admin(User):
    def __init__(self, name, level):
        super().__init__(name)
        self.level = level
```

### 与其他语言的关键差异

| 差异点 | Python | Go/Java/C++ |
|:-------|:-------|:------------|
| 类型检查 | 鸭子类型（运行时） | 静态类型（编译时） |
| 私有属性 | 约定（`_`） | 真正的私有 |
| 多继承 | 支持 | 大多不支持 |
| 接口 | 隐式（鸭子类型） | 显式声明 |
| 魔法方法 | 丰富的魔法方法 | 有限的特殊方法 |

---

**参考资料**:
- [Python Data Model](https://docs.python.org/3/reference/datamodel.html)
- [Python Class Development Toolkit](https://docs.python.org/3/tutorial/classes.html)
- [PEP 3119 – Introducing Abstract Base Classes](https://www.python.org/dev/peps/pep-3119/)
- [PEP 8 – Style Guide for Python Code](https://www.python.org/dev/peps/pep-0008/)
