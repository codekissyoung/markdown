# Python 面向对象进阶速查表

**学习日期**: 2025-11-11
**状态**: 待学习（速查表）
**详细教程**: `python-oop-advanced.md`

---

## 一、抽象类（`abc`）

**用途**: 定义接口规范，强制子类实现方法

```python
from abc import ABC, abstractmethod

class DataSource(ABC):
    @abstractmethod
    def connect(self):
        pass

class MySQL(DataSource):
    def connect(self):
        return "MySQL connected"

# DataSource() ❌ 抽象类不能实例化
db = MySQL()  # ✅
```

**使用场景**: 插件系统、策略模式、大型项目接口定义

---

## 二、数据类（`@dataclass`）

**用途**: 自动生成 `__init__`, `__repr__`, `__eq__`

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int
    email: str = ""

user = User("Link", 30)
print(user)  # User(name='Link', age=30, email='')
```

**常用参数**:
- `frozen=True`: 不可变
- `order=True`: 支持排序
- `field(default_factory=list)`: 默认值工厂

**使用场景**: 配置类、数据传输对象

---

## 三、上下文管理器（`with`）

**用途**: 自动管理资源（文件、连接、锁）

```python
# 方式 1: 类实现
class Timer:
    def __enter__(self):
        self.start = time.time()
        return self

    def __exit__(self, *args):
        print(f"耗时: {time.time() - self.start}s")

# 方式 2: 装饰器实现
from contextlib import contextmanager

@contextmanager
def timer():
    start = time.time()
    try:
        yield
    finally:
        print(f"耗时: {time.time() - start}s")

# 使用
with timer():
    do_something()
```

**使用场景**: 文件操作、数据库事务、临时状态、性能计时

---

## 四、描述符协议

**用途**: `@property` 的底层实现，自定义属性访问行为

```python
class TypedProperty:
    def __init__(self, name, expected_type):
        self.name = name
        self.expected_type = expected_type

    def __get__(self, obj, objtype=None):
        return obj.__dict__.get(self.name)

    def __set__(self, obj, value):
        if not isinstance(value, self.expected_type):
            raise TypeError(f"{self.name} 必须是 {self.expected_type}")
        obj.__dict__[self.name] = value

class User:
    age = TypedProperty("age", int)
```

**使用场景**: 属性验证、惰性求值、ORM 字段定义

---

## 五、`__slots__`

**用途**: 减少内存占用（40-50%）

```python
class Point:
    __slots__ = ['x', 'y']  # 不再使用 __dict__

    def __init__(self, x, y):
        self.x = x
        self.y = y

# 限制: 不能动态添加属性
p = Point(1, 2)
# p.z = 3  ❌ AttributeError
```

**使用场景**: 创建大量实例（数十万+）、内存敏感应用

---

## 六、元类（`metaclass`）

**用途**: 控制类的创建过程（类的类）

```python
class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=Singleton):
    pass

db1 = Database()
db2 = Database()
print(db1 is db2)  # True（单例）
```

**使用场景**: ORM、单例模式、框架开发
**建议**: 99% 情况用装饰器更简单

---

## 学习优先级

```
┌─────────────────────────────────────────┐
│ 必学（工作常用，优先级 ★★★★★）          │
├─────────────────────────────────────────┤
│ 1. 数据类 (@dataclass)                  │
│ 2. 上下文管理器 (with)                  │
│ 3. 抽象类 (abc)                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 了解（看懂代码，优先级 ★★★☆☆）          │
├─────────────────────────────────────────┤
│ 4. 描述符协议                           │
│ 5. __slots__                            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 选学（框架开发，优先级 ★☆☆☆☆）          │
├─────────────────────────────────────────┤
│ 6. 元类 (metaclass)                     │
└─────────────────────────────────────────┘
```

---

## 何时深入学习

| 触发条件 | 学习主题 |
|:---------|:---------|
| 需要定义插件接口 | 抽象类 |
| 写很多配置类、DTO | 数据类 |
| 需要管理资源（文件/连接/锁） | 上下文管理器 |
| 看到框架代码中的描述符 | 描述符协议 |
| 程序内存占用过高（百万实例） | `__slots__` |
| 需要开发框架/ORM | 元类 |

---

## 快速对比

| 特性 | 复杂度 | 使用频率 | 业务代码 | 框架代码 |
|:-----|:-------|:---------|:---------|:---------|
| 抽象类 | ★★☆☆☆ | ★★★★☆ | ✅ 常用 | ✅ 常用 |
| 数据类 | ★☆☆☆☆ | ★★★★★ | ✅ 必用 | ✅ 常用 |
| 上下文管理器 | ★★☆☆☆ | ★★★★★ | ✅ 必用 | ✅ 必用 |
| 描述符 | ★★★★☆ | ★★☆☆☆ | ❌ 少用 | ✅ 常用 |
| `__slots__` | ★☆☆☆☆ | ★★☆☆☆ | ❌ 少用 | ✅ 优化时用 |
| 元类 | ★★★★★ | ★☆☆☆☆ | ❌ 几乎不用 | ✅ 框架级 |

---

## 一句话总结

- **抽象类**: 定义必须实现的接口
- **数据类**: 自动生成样板代码
- **上下文管理器**: 自动清理资源
- **描述符**: 自定义属性行为
- **`__slots__`**: 省内存
- **元类**: 控制类的创建（少用）

---

**下次学习时间**: 待定
**详细教程**: 见 `python-oop-advanced.md`
