# Python 面向对象进阶主题

**学习日期**: 2025-11-11
**前置知识**: Python 基础 OOP（类、继承、魔法方法、属性装饰器）
**对比语言**: Go、Java、C++、TypeScript
**核心特性**: 抽象类、数据类、上下文管理器、描述符、元类

---

## 学习路线图

```
基础 OOP (已掌握)
├── 类和实例
├── 继承和多态
├── 魔法方法
├── @property
├── @classmethod/@staticmethod
└── MRO

进阶 OOP (本文)
├── 抽象类 (abc)           ← 定义接口规范
├── 数据类 (@dataclass)    ← 减少样板代码
├── 上下文管理器 (with)    ← 资源管理
├── 描述符协议             ← @property 底层
├── __slots__              ← 内存优化
└── 元类 (metaclass)       ← 类的类
```

---

## 一、抽象类和接口（`abc` 模块）

### 1. 问题：如何强制子类实现某些方法？

**场景**：设计一个 API，要求所有数据源必须实现 `connect()` 和 `fetch()` 方法。

```python
# ❌ 普通继承无法强制
class DataSource:
    def connect(self):
        raise NotImplementedError("子类必须实现")

    def fetch(self):
        raise NotImplementedError("子类必须实现")

class MySQL(DataSource):
    # 忘记实现 fetch() 方法
    def connect(self):
        return "MySQL connected"

# 问题：实例化时不报错，运行时才报错
db = MySQL()  # ✅ 没问题
db.fetch()    # ❌ 运行时才报错
```

**解决方案：抽象基类（ABC）**

```python
from abc import ABC, abstractmethod

class DataSource(ABC):
    """抽象基类，定义数据源接口"""

    @abstractmethod
    def connect(self):
        """连接数据源（子类必须实现）"""
        pass

    @abstractmethod
    def fetch(self, query):
        """查询数据（子类必须实现）"""
        pass

    def disconnect(self):
        """断开连接（可选实现）"""
        print("断开连接")

# ❌ 抽象类不能实例化
# source = DataSource()  # TypeError: Can't instantiate abstract class

# ❌ 子类未实现所有抽象方法，无法实例化
class MySQL(DataSource):
    def connect(self):
        return "MySQL connected"
    # 忘记实现 fetch()

# db = MySQL()  # TypeError: Can't instantiate abstract class

# ✅ 正确实现
class MySQL(DataSource):
    def connect(self):
        return "MySQL connected"

    def fetch(self, query):
        return f"MySQL: {query}"

db = MySQL()  # ✅ 成功
print(db.connect())  # MySQL connected
print(db.fetch("SELECT * FROM users"))  # MySQL: SELECT * FROM users
db.disconnect()  # 断开连接（继承自父类）
```

### 2. 抽象属性

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @property
    @abstractmethod
    def area(self):
        """面积（子类必须实现）"""
        pass

class Circle(Shape):
    def __init__(self, radius):
        self._radius = radius

    @property
    def area(self):
        import math
        return math.pi * self._radius ** 2

circle = Circle(5)
print(circle.area)  # 78.54
```

### 3. Go/Java 对比

**Go（接口）**：

```go
// Go 的接口是隐式实现的
type DataSource interface {
    Connect() string
    Fetch(query string) string
}

type MySQL struct{}

func (m MySQL) Connect() string {
    return "MySQL connected"
}

func (m MySQL) Fetch(query string) string {
    return fmt.Sprintf("MySQL: %s", query)
}

// 自动实现接口，不需要显式声明
```

**Java（接口）**：

```java
// Java 的接口必须显式实现
interface DataSource {
    String connect();
    String fetch(String query);
}

class MySQL implements DataSource {
    public String connect() {
        return "MySQL connected";
    }

    public String fetch(String query) {
        return "MySQL: " + query;
    }
}
```

### 4. 应用场景

**场景 1：插件系统**

```python
from abc import ABC, abstractmethod

class Plugin(ABC):
    @abstractmethod
    def execute(self, data):
        """插件执行逻辑"""
        pass

    @abstractmethod
    def get_name(self):
        """插件名称"""
        pass

class LogPlugin(Plugin):
    def execute(self, data):
        print(f"日志: {data}")

    def get_name(self):
        return "日志插件"

class EmailPlugin(Plugin):
    def execute(self, data):
        print(f"发送邮件: {data}")

    def get_name(self):
        return "邮件插件"

# 插件管理器
def run_plugins(plugins: list[Plugin], data):
    for plugin in plugins:
        print(f"运行 {plugin.get_name()}")
        plugin.execute(data)

plugins = [LogPlugin(), EmailPlugin()]
run_plugins(plugins, "测试数据")
```

**场景 2：策略模式**

```python
from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount):
        pass

class AlipayPayment(PaymentStrategy):
    def pay(self, amount):
        return f"支付宝支付 {amount} 元"

class WechatPayment(PaymentStrategy):
    def pay(self, amount):
        return f"微信支付 {amount} 元"

class ShoppingCart:
    def __init__(self, payment: PaymentStrategy):
        self.payment = payment

    def checkout(self, amount):
        return self.payment.pay(amount)

# 使用
cart1 = ShoppingCart(AlipayPayment())
print(cart1.checkout(100))  # 支付宝支付 100 元

cart2 = ShoppingCart(WechatPayment())
print(cart2.checkout(200))  # 微信支付 200 元
```

---

## 二、数据类（`@dataclass`）

### 1. 问题：样板代码太多

**传统写法**：

```python
class User:
    def __init__(self, name, age, email):
        self.name = name
        self.age = age
        self.email = email

    def __repr__(self):
        return f"User(name={self.name!r}, age={self.age!r}, email={self.email!r})"

    def __eq__(self, other):
        if not isinstance(other, User):
            return False
        return (self.name == other.name and
                self.age == other.age and
                self.email == other.email)

# 太多重复代码！
```

**数据类写法（Python 3.7+）**：

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int
    email: str = ""  # 默认值

# 自动生成 __init__, __repr__, __eq__
user1 = User("Link", 30, "link@example.com")
user2 = User("Link", 30, "link@example.com")

print(user1)  # User(name='Link', age=30, email='link@example.com')
print(user1 == user2)  # True
```

### 2. 数据类特性

**冻结实例（不可变）**：

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: int
    y: int

point = Point(1, 2)
# point.x = 3  # ❌ FrozenInstanceError
```

**排序支持**：

```python
from dataclasses import dataclass

@dataclass(order=True)
class User:
    name: str
    age: int

users = [User("Bob", 30), User("Alice", 25)]
sorted_users = sorted(users)
print(sorted_users)  # [User(name='Alice', age=25), User(name='Bob', age=30)]
```

**后处理初始化**：

```python
from dataclasses import dataclass, field

@dataclass
class User:
    name: str
    age: int
    display_name: str = field(init=False)  # 不在 __init__ 中

    def __post_init__(self):
        """初始化后自动调用"""
        self.display_name = self.name.upper()

user = User("link", 30)
print(user.display_name)  # LINK
```

**默认工厂函数**：

```python
from dataclasses import dataclass, field

@dataclass
class Task:
    name: str
    tags: list = field(default_factory=list)  # 避免可变默认值陷阱

# ❌ 错误写法（不要这样）
# class Task:
#     def __init__(self, name, tags=[]):  # 所有实例共享同一个列表
#         self.name = name
#         self.tags = tags

task1 = Task("任务1")
task2 = Task("任务2")
task1.tags.append("重要")

print(task1.tags)  # ['重要']
print(task2.tags)  # []  ← 独立的列表
```

### 3. 完整示例：配置类

```python
from dataclasses import dataclass, field
from typing import Optional

@dataclass
class DatabaseConfig:
    host: str
    port: int = 3306
    username: str = "root"
    password: str = ""
    database: str = "test"
    options: dict = field(default_factory=dict)

    def __post_init__(self):
        if self.port < 1 or self.port > 65535:
            raise ValueError("端口范围: 1-65535")

    def get_connection_string(self):
        return f"mysql://{self.username}:{self.password}@{self.host}:{self.port}/{self.database}"

# 使用
config = DatabaseConfig(
    host="localhost",
    username="admin",
    password="secret",
    options={"charset": "utf8mb4"}
)

print(config)
print(config.get_connection_string())
```

### 4. Go/TypeScript 对比

**Go（结构体）**：

```go
type User struct {
    Name  string
    Age   int
    Email string
}

// 需要手动实现方法
func (u User) String() string {
    return fmt.Sprintf("User{Name: %s, Age: %d, Email: %s}", u.Name, u.Age, u.Email)
}
```

**TypeScript（类）**：

```typescript
class User {
    constructor(
        public name: string,
        public age: number,
        public email: string = ""
    ) {}
}

// 或者用接口 + 对象字面量
interface User {
    name: string;
    age: number;
    email?: string;
}

const user: User = { name: "Link", age: 30 };
```

---

## 三、上下文管理器（`with` 语句）

### 1. 问题：资源管理容易出错

```python
# ❌ 容易忘记关闭文件
file = open("data.txt", "r")
content = file.read()
# 忘记 file.close()

# ❌ 异常时无法关闭
file = open("data.txt", "r")
content = file.read()
process(content)  # 如果这里抛异常，文件永远不会关闭
file.close()

# ✅ try-finally 保证关闭（但冗长）
file = open("data.txt", "r")
try:
    content = file.read()
    process(content)
finally:
    file.close()

# ✅ 最佳实践：with 语句
with open("data.txt", "r") as file:
    content = file.read()
    process(content)
# 自动调用 file.close()，即使有异常
```

### 2. 自定义上下文管理器

**方法 1：实现 `__enter__` 和 `__exit__`**

```python
class DatabaseConnection:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.connection = None

    def __enter__(self):
        """进入 with 块时调用"""
        print(f"连接数据库 {self.host}:{self.port}")
        self.connection = f"Connection to {self.host}:{self.port}"
        return self.connection  # 返回值赋给 as 变量

    def __exit__(self, exc_type, exc_val, exc_tb):
        """退出 with 块时调用"""
        print(f"断开连接")
        self.connection = None

        # exc_type: 异常类型
        # exc_val: 异常值
        # exc_tb: 异常追踪

        if exc_type is not None:
            print(f"发生异常: {exc_type.__name__}: {exc_val}")

        # 返回 True 表示吞掉异常，返回 False 或 None 表示传播异常
        return False

# 使用
with DatabaseConnection("localhost", 3306) as conn:
    print(f"使用连接: {conn}")
    # raise ValueError("测试异常")  # 取消注释测试异常处理

# 输出:
# 连接数据库 localhost:3306
# 使用连接: Connection to localhost:3306
# 断开连接
```

**方法 2：使用 `contextlib` 装饰器**

```python
from contextlib import contextmanager

@contextmanager
def database_connection(host, port):
    """简化版上下文管理器"""
    # __enter__ 部分
    print(f"连接数据库 {host}:{port}")
    connection = f"Connection to {host}:{port}"

    try:
        yield connection  # 返回值赋给 as 变量
    finally:
        # __exit__ 部分
        print(f"断开连接")

# 使用（语法完全一样）
with database_connection("localhost", 3306) as conn:
    print(f"使用连接: {conn}")
```

### 3. 实战示例

**示例 1：计时器**

```python
from contextlib import contextmanager
import time

@contextmanager
def timer(name):
    """性能计时器"""
    start = time.time()
    print(f"[{name}] 开始")
    try:
        yield
    finally:
        elapsed = time.time() - start
        print(f"[{name}] 耗时: {elapsed:.2f}s")

# 使用
with timer("数据处理"):
    time.sleep(1)
    print("处理数据...")

# 输出:
# [数据处理] 开始
# 处理数据...
# [数据处理] 耗时: 1.00s
```

**示例 2：临时改变工作目录**

```python
import os
from contextlib import contextmanager

@contextmanager
def change_dir(path):
    """临时切换目录"""
    old_dir = os.getcwd()
    os.chdir(path)
    try:
        yield
    finally:
        os.chdir(old_dir)

# 使用
print(f"当前目录: {os.getcwd()}")

with change_dir("/tmp"):
    print(f"临时目录: {os.getcwd()}")
    # 在这里操作 /tmp 目录

print(f"恢复目录: {os.getcwd()}")
```

**示例 3：数据库事务**

```python
class DatabaseTransaction:
    def __init__(self, connection):
        self.connection = connection

    def __enter__(self):
        self.connection.begin()
        return self.connection

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is None:
            self.connection.commit()  # 成功时提交
        else:
            self.connection.rollback()  # 异常时回滚
        return False

# 使用
# with DatabaseTransaction(conn) as db:
#     db.execute("INSERT ...")
#     db.execute("UPDATE ...")
#     # 如果发生异常，自动回滚
```

### 4. Go 对比

**Go（defer）**：

```go
func processFile(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()  // 函数返回前自动执行

    // 处理文件
    return nil
}
```

**Python 的 `with` vs Go 的 `defer`**：

| 特性 | Python `with` | Go `defer` |
|:-----|:--------------|:-----------|
| 作用域 | 块级作用域 | 函数级作用域 |
| 执行时机 | 退出 `with` 块 | 函数返回前 |
| 异常处理 | `__exit__` 可处理异常 | `defer` 可用 `recover()` |
| 返回值 | 可通过 `as` 获取 | 无返回值 |

---

## 四、描述符协议（`@property` 的底层）

### 1. 什么是描述符

描述符是实现了 `__get__`, `__set__`, `__delete__` 的类。

**`@property` 就是用描述符实现的！**

```python
class Descriptor:
    def __get__(self, obj, objtype=None):
        """获取属性时调用"""
        print("__get__ 被调用")
        return 42

    def __set__(self, obj, value):
        """设置属性时调用"""
        print(f"__set__ 被调用: {value}")

    def __delete__(self, obj):
        """删除属性时调用"""
        print("__delete__ 被调用")

class MyClass:
    attr = Descriptor()  # 类属性是描述符

obj = MyClass()
print(obj.attr)     # 触发 __get__
obj.attr = 100      # 触发 __set__
del obj.attr        # 触发 __delete__
```

### 2. 实战：类型验证描述符

```python
class TypedProperty:
    """类型检查描述符"""
    def __init__(self, name, expected_type):
        self.name = name
        self.expected_type = expected_type

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__.get(self.name)

    def __set__(self, obj, value):
        if not isinstance(value, self.expected_type):
            raise TypeError(f"{self.name} 必须是 {self.expected_type.__name__}")
        obj.__dict__[self.name] = value

class User:
    name = TypedProperty("name", str)
    age = TypedProperty("age", int)

    def __init__(self, name, age):
        self.name = name
        self.age = age

# 使用
user = User("Link", 30)
print(user.name)  # Link

# user.age = "thirty"  # ❌ TypeError: age 必须是 int
user.age = 31  # ✅
```

### 3. 实战：惰性求值描述符

```python
class LazyProperty:
    """延迟计算的属性"""
    def __init__(self, func):
        self.func = func
        self.name = func.__name__

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self

        # 第一次访问时计算
        value = self.func(obj)
        # 缓存结果（替换描述符为计算值）
        setattr(obj, self.name, value)
        return value

class Circle:
    def __init__(self, radius):
        self.radius = radius

    @LazyProperty
    def area(self):
        """第一次访问时才计算"""
        import math
        print("计算面积...")
        return math.pi * self.radius ** 2

circle = Circle(5)
print("创建圆形")
print(circle.area)  # 计算面积... 78.54
print(circle.area)  # 78.54（使用缓存，不再计算）
```

### 4. `@property` 的等价实现

```python
# @property 的简化实现
class Property:
    def __init__(self, fget=None, fset=None, fdel=None):
        self.fget = fget
        self.fset = fset
        self.fdel = fdel

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        if self.fget is None:
            raise AttributeError("不可读属性")
        return self.fget(obj)

    def __set__(self, obj, value):
        if self.fset is None:
            raise AttributeError("不可写属性")
        self.fset(obj, value)

    def __delete__(self, obj):
        if self.fdel is None:
            raise AttributeError("不可删除属性")
        self.fdel(obj)

    def setter(self, fset):
        return Property(self.fget, fset, self.fdel)

class User:
    def __init__(self, name):
        self._name = name

    @Property
    def name(self):
        return self._name

    @name.setter
    def name(self, value):
        self._name = value
```

---

## 五、`__slots__`（内存优化）

### 1. 问题：Python 对象默认很耗内存

```python
class User:
    def __init__(self, name, age):
        self.name = name
        self.age = age

user = User("Link", 30)

# 每个实例都有一个 __dict__ 存储属性
print(user.__dict__)  # {'name': 'Link', 'age': 30}

# __dict__ 是字典，占用额外内存
import sys
print(sys.getsizeof(user.__dict__))  # 约 240 字节
```

### 2. 解决方案：`__slots__`

```python
class User:
    __slots__ = ['name', 'age']  # 限制属性，不再使用 __dict__

    def __init__(self, name, age):
        self.name = name
        self.age = age

user = User("Link", 30)

# 没有 __dict__
# print(user.__dict__)  # ❌ AttributeError

# 不能动态添加属性
# user.email = "test"  # ❌ AttributeError

# 内存占用减少约 40-50%
```

### 3. 性能对比

```python
import sys

class Normal:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class Slotted:
    __slots__ = ['x', 'y']

    def __init__(self, x, y):
        self.x = x
        self.y = y

normal = Normal(1, 2)
slotted = Slotted(1, 2)

print(f"Normal:  {sys.getsizeof(normal) + sys.getsizeof(normal.__dict__)} bytes")
print(f"Slotted: {sys.getsizeof(slotted)} bytes")

# 输出示例:
# Normal:  296 bytes
# Slotted: 64 bytes
```

### 4. 适用场景

**适合使用 `__slots__`**：
- 创建大量实例（数十万、百万级）
- 属性固定，不需要动态添加
- 内存敏感的应用

**不适合使用 `__slots__`**：
- 需要动态添加属性
- 继承关系复杂
- 可读性优先于性能

### 5. 继承时的注意事项

```python
class Base:
    __slots__ = ['x']

class Derived(Base):
    __slots__ = ['y']  # 只需声明新属性

d = Derived()
d.x = 1  # ✅ 继承自 Base
d.y = 2  # ✅ Derived 的属性
```

---

## 六、元类（Metaclass）

### 1. 什么是元类

**核心概念**：
- 类是实例的模板
- 元类是类的模板
- `type` 是 Python 的默认元类

```python
# 创建类的两种方式

# 方式 1：class 关键字
class User:
    pass

# 方式 2：type() 动态创建
User = type('User', (), {})

# 等价！
```

**创建类的完整语法**：

```python
# type(类名, 父类元组, 属性字典)
User = type('User', (), {
    'name': 'Link',
    'greet': lambda self: f"Hello, {self.name}"
})

user = User()
print(user.greet())  # Hello, Link
```

### 2. 自定义元类

```python
class MyMeta(type):
    """自定义元类"""
    def __new__(cls, name, bases, attrs):
        """创建类时调用"""
        print(f"创建类: {name}")
        print(f"父类: {bases}")
        print(f"属性: {attrs.keys()}")

        # 可以修改类的定义
        attrs['created_by'] = 'MyMeta'

        return super().__new__(cls, name, bases, attrs)

class User(metaclass=MyMeta):
    name = "Link"

# 输出:
# 创建类: User
# 父类: ()
# 属性: dict_keys(['__module__', '__qualname__', 'name'])

print(User.created_by)  # MyMeta
```

### 3. 实战：单例模式元类

```python
class Singleton(type):
    """单例元类"""
    _instances = {}

    def __call__(cls, *args, **kwargs):
        """创建实例时调用"""
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=Singleton):
    def __init__(self, host):
        self.host = host

# 测试单例
db1 = Database("localhost")
db2 = Database("localhost")

print(db1 is db2)  # True（同一个实例）
print(id(db1), id(db2))  # 相同的内存地址
```

### 4. 实战：ORM 元类（简化版）

```python
class Field:
    """字段描述符"""
    def __init__(self, field_type):
        self.field_type = field_type
        self.name = None

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__.get(self.name)

    def __set__(self, obj, value):
        if not isinstance(value, self.field_type):
            raise TypeError(f"{self.name} 必须是 {self.field_type.__name__}")
        obj.__dict__[self.name] = value

class ModelMeta(type):
    """ORM 元类"""
    def __new__(cls, name, bases, attrs):
        # 提取所有字段
        fields = {}
        for key, value in attrs.items():
            if isinstance(value, Field):
                value.name = key  # 设置字段名
                fields[key] = value

        attrs['_fields'] = fields
        return super().__new__(cls, name, bases, attrs)

class Model(metaclass=ModelMeta):
    """模型基类"""
    pass

# 使用
class User(Model):
    name = Field(str)
    age = Field(int)

user = User()
user.name = "Link"
user.age = 30

print(user.name)  # Link
print(User._fields)  # {'name': <Field>, 'age': <Field>}

# user.age = "thirty"  # ❌ TypeError
```

### 5. 元类 vs 装饰器

**大多数情况用装饰器更简单**：

```python
# ❌ 用元类实现
class LogMeta(type):
    def __new__(cls, name, bases, attrs):
        for key, value in attrs.items():
            if callable(value):
                attrs[key] = log_decorator(value)
        return super().__new__(cls, name, bases, attrs)

class MyClass(metaclass=LogMeta):
    pass

# ✅ 用装饰器更清晰
def log_methods(cls):
    for key, value in vars(cls).items():
        if callable(value):
            setattr(cls, key, log_decorator(value))
    return cls

@log_methods
class MyClass:
    pass
```

---

## 七、进阶主题对比总结

| 主题 | 使用频率 | 复杂度 | 典型场景 |
|:-----|:---------|:-------|:---------|
| **抽象类** | ★★★★☆ | ★★☆☆☆ | 定义接口规范、插件系统 |
| **数据类** | ★★★★★ | ★☆☆☆☆ | 配置类、数据传输对象 |
| **上下文管理器** | ★★★★★ | ★★☆☆☆ | 资源管理、事务处理 |
| **描述符** | ★★☆☆☆ | ★★★★☆ | 属性验证、惰性求值 |
| **`__slots__`** | ★★☆☆☆ | ★☆☆☆☆ | 大量实例、内存优化 |
| **元类** | ★☆☆☆☆ | ★★★★★ | ORM、单例模式 |

---

## 八、学习建议

### 必须掌握（工作常用）

1. **数据类** (`@dataclass`)
   - 现代 Python 项目标配
   - 减少样板代码
   - Python 3.7+ 必学

2. **上下文管理器** (`with`)
   - 资源管理最佳实践
   - 文件、数据库、锁都用它
   - 必须理解 `__enter__` 和 `__exit__`

3. **抽象类** (`abc`)
   - 大型项目常用
   - 定义接口规范
   - 多人协作必备

### 了解即可（看懂代码）

4. **描述符协议**
   - 理解 `@property` 底层原理
   - 框架开发才用
   - 业务代码很少用

5. **`__slots__`**
   - 性能优化手段
   - 特定场景才用
   - 过早优化是万恶之源

### 不建议深入（99% 用不到）

6. **元类**
   - 极少使用（框架级别）
   - "元类是 99% 的 Python 程序员不需要的魔法" —— Tim Peters
   - 能用装饰器就别用元类

---

## 九、与 PythonAgent 的关联

回顾 PythonAgent 代码，它只用到：
- ✅ 基础类定义
- ✅ `__init__` 构造函数
- ✅ 实例方法
- ✅ `with open()` 上下文管理器（文件操作）

**未用到本文的进阶特性**，说明：
- 简单任务不需要复杂特性
- Python 的魅力在于简洁
- 过度设计反而降低可读性

**如果重构 PythonAgent 使用进阶特性**：

```python
from dataclasses import dataclass
from abc import ABC, abstractmethod

# 用数据类存储配置
@dataclass
class AgentConfig:
    model: str
    api_key: str
    base_url: str
    max_iterations: int = 10

# 用抽象类定义工具接口
class Tool(ABC):
    @abstractmethod
    def execute(self, *args):
        pass

    @abstractmethod
    def get_description(self):
        pass

class FileReadTool(Tool):
    def execute(self, path):
        with open(path, 'r') as f:
            return f.read()

    def get_description(self):
        return "读取文件内容"
```

但这是**过度设计**，当前 PythonAgent 的实现已经足够清晰。

---

## 总结

### 核心要点

1. **抽象类**：强制子类实现接口，适合插件系统和大型项目
2. **数据类**：减少样板代码，现代 Python 必学
3. **上下文管理器**：资源管理最佳实践，必须掌握
4. **描述符**：`@property` 的底层，理解原理即可
5. **`__slots__`**：内存优化，特定场景使用
6. **元类**：框架级别，业务代码基本不用

### 学习优先级

```
高优先级（必学）:
├── 数据类 (@dataclass)
├── 上下文管理器 (with)
└── 抽象类 (abc)

中优先级（了解）:
├── 描述符协议
└── __slots__

低优先级（选学）:
└── 元类
```

### 实践建议

- **简单优于复杂**：能用基础特性就别用高级特性
- **可读性第一**：代码是给人看的，不是炫技
- **按需学习**：遇到问题再深入，不要为了学而学

---

**参考资料**:
- [PEP 3119 – Abstract Base Classes](https://www.python.org/dev/peps/pep-3119/)
- [PEP 557 – Data Classes](https://www.python.org/dev/peps/pep-0557/)
- [PEP 343 – The "with" Statement](https://www.python.org/dev/peps/pep-0343/)
- [Descriptor HowTo Guide](https://docs.python.org/3/howto/descriptor.html)
- [Python Data Model](https://docs.python.org/3/reference/datamodel.html)
