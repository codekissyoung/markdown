# Python 函数完全指南

**学习日期**: 2025-11-09
**前置知识**: Python 基础语法、数据结构
**对比语言**: Go、PHP、JavaScript
**核心特性**: 类型注解、灵活的参数系统、装饰器、推导式、常用内置函数

---

## 一、函数定义

### 基本语法

```python
def greet(name):
    """函数文档字符串（docstring）"""
    return f"Hello, {name}"

result = greet("Link")  # "Hello, Link"
```

**语法要素**：
- `def` 关键字（Go 用 `func`，PHP 用 `function`）
- 强制缩进定义函数体
- 无需声明返回类型（动态类型）
- docstring 可选，但推荐写（用于文档生成）

### 返回值

#### 单返回值

```python
def add(a, b):
    return a + b

# 无 return 时返回 None
def no_return():
    print("Hello")
    # 隐式 return None

result = no_return()
print(result)  # None
```

#### 多返回值（tuple 语法糖）

```python
def get_user():
    return "Link", 30, "Shenzhen"  # 自动打包成 tuple

# 解包接收
name, age, city = get_user()

# 或接收整个 tuple
user_info = get_user()  # ('Link', 30, 'Shenzhen')
```

**Go 对比**：
```go
// Go 的真正多返回值
func getUser() (string, int, string) {
    return "Link", 30, "Shenzhen"
}

name, age, city := getUser()
```

Python 只是语法糖，本质是返回一个 tuple。

---

## 二、类型注解（Type Hints）

### 为什么需要类型注解？

Python 是动态类型语言，但类型注解能带来：
- ✅ 代码可读性（一眼看出参数和返回值类型）
- ✅ IDE 支持（自动补全、错误检查）
- ✅ 静态类型检查（mypy、pyright 工具）
- ✅ 文档自动生成

**重要**：类型注解是**可选的**，不影响运行时行为（Python 运行时不检查类型）。

### 基础类型注解

```python
# 基本类型
def greet(name: str) -> str:
    return f"Hello, {name}"

def add(a: int, b: int) -> int:
    return a + b

def get_average(numbers: list[float]) -> float:
    return sum(numbers) / len(numbers)

# 变量注解
age: int = 30
name: str = "Link"
scores: list[int] = [85, 90, 92]
```

### Python 3.9+ 新语法（推荐）

**旧语法（Python 3.5-3.8）**：

```python
from typing import List, Dict, Tuple, Optional

def process_users(users: List[Dict[str, str]]) -> Optional[str]:
    pass
```

**新语法（Python 3.9+）**：

```python
# 直接用内置类型小写，无需 import
def process_users(users: list[dict[str, str]]) -> str | None:
    pass
```

**对比表**：

| 类型 | 旧语法 (typing) | 新语法 (3.9+) |
|:-----|:----------------|:--------------|
| 列表 | `List[int]` | `list[int]` |
| 字典 | `Dict[str, int]` | `dict[str, int]` |
| 元组 | `Tuple[int, str]` | `tuple[int, str]` |
| 集合 | `Set[int]` | `set[int]` |
| 可选值 | `Optional[str]` | `str \| None` |
| 联合类型 | `Union[int, str]` | `int \| str` |

### 常用类型注解

#### 1. 集合类型

```python
# 列表
def sum_numbers(numbers: list[int]) -> int:
    return sum(numbers)

# 字典
def get_user_age(users: dict[str, int], name: str) -> int:
    return users[name]

# 元组（固定长度）
def get_coordinate() -> tuple[float, float]:
    return (1.5, 2.3)

# 元组（可变长度）
def get_numbers() -> tuple[int, ...]:
    return (1, 2, 3, 4, 5)

# 集合
def unique_ids(data: list[int]) -> set[int]:
    return set(data)
```

#### 2. 可选类型（`| None`）

```python
# Python 3.10+ 推荐语法
def find_user(user_id: int) -> dict[str, str] | None:
    if user_id in database:
        return database[user_id]
    return None

# 旧语法（仍然可用）
from typing import Optional
def find_user(user_id: int) -> Optional[dict[str, str]]:
    pass
```

#### 3. 联合类型（`|`）

```python
# Python 3.10+ 推荐语法
def process(value: int | str | float) -> str:
    return str(value)

# 旧语法
from typing import Union
def process(value: Union[int, str, float]) -> str:
    pass
```

#### 4. 可调用类型（函数作为参数）

```python
from collections.abc import Callable

# Callable[[参数类型], 返回类型]
def apply_func(func: Callable[[int, int], int], a: int, b: int) -> int:
    return func(a, b)

# 使用
def add(x: int, y: int) -> int:
    return x + y

result = apply_func(add, 1, 2)  # 3
```

#### 5. 泛型（TypeVar）

```python
from typing import TypeVar

T = TypeVar('T')

def first_element(items: list[T]) -> T | None:
    return items[0] if items else None

# 使用时 T 会自动推断
numbers = [1, 2, 3]
result = first_element(numbers)  # result 类型是 int | None

strings = ["a", "b", "c"]
result = first_element(strings)  # result 类型是 str | None
```

#### 6. 字面量类型

```python
from typing import Literal

def set_mode(mode: Literal["read", "write", "append"]) -> None:
    print(f"模式: {mode}")

set_mode("read")    # ✅ 正确
set_mode("delete")  # ❌ 类型检查器会报错
```

#### 7. Any 类型（不推荐）

```python
from typing import Any

def process(data: Any) -> Any:
    # 接受任意类型，失去了类型检查的意义
    return data
```

**建议**：尽量避免使用 `Any`，除非确实需要。

### 实战示例

```python
# 用户数据处理
def create_user(
    name: str,
    age: int,
    email: str | None = None,
    roles: list[str] | None = None
) -> dict[str, str | int | list[str]]:
    user: dict[str, str | int | list[str]] = {
        "name": name,
        "age": age,
    }
    if email:
        user["email"] = email
    if roles:
        user["roles"] = roles
    return user

# API 响应类型
def fetch_data(url: str) -> dict[str, list[dict[str, str | int]]]:
    # 返回类型：{"users": [{"name": "Alice", "age": 25}, ...]}
    pass

# 回调函数
from collections.abc import Callable

def retry(
    func: Callable[[], bool],
    max_attempts: int = 3
) -> bool:
    for _ in range(max_attempts):
        if func():
            return True
    return False
```

### 类型检查工具

#### 使用 mypy

```bash
# 安装
uv add --dev mypy

# 检查类型
mypy script.py
```

**示例**：

```python
# script.py
def add(a: int, b: int) -> int:
    return a + b

result = add(1, "2")  # 类型错误
```

```bash
$ mypy script.py
script.py:4: error: Argument 2 to "add" has incompatible type "str"; expected "int"
```

### Go 对比

**Go（静态类型，必须声明）**：

```go
// 函数签名必须声明类型
func greet(name string) string {
    return "Hello, " + name
}

// 编译时检查类型错误
greet(123)  // 编译错误
```

**Python（动态类型，类型注解可选）**：

```python
# 类型注解不影响运行时
def greet(name: str) -> str:
    return f"Hello, {name}"

# 运行时不会报错，但类型检查器会警告
greet(123)  # 运行成功，mypy 会报错
```

### 最佳实践

```python
# ✅ 推荐：使用最新语法
def process(data: list[int]) -> int | None:
    pass

# ❌ 避免：旧语法（除非需要兼容 Python 3.8）
from typing import List, Optional
def process(data: List[int]) -> Optional[int]:
    pass

# ✅ 推荐：复杂类型用类型别名
UserData = dict[str, str | int | list[str]]

def create_user(name: str, age: int) -> UserData:
    return {"name": name, "age": age}

# ✅ 推荐：公开 API 必须加类型注解
def public_api(param: str) -> dict[str, str]:
    pass

# ✅ 可选：内部简单函数可以省略
def _internal_helper(x, y):
    return x + y
```

---

## 三、参数系统（Python 最复杂的部分）

### 1. 位置参数

```python
def add(a, b, c):
    return a + b + c

add(1, 2, 3)  # 6
add(1, 2)     # TypeError: 缺少参数
```

按顺序传递，与 Go/PHP 相同。

### 2. 默认参数

```python
def greet(name, prefix="Hello"):
    return f"{prefix}, {name}"

greet("Link")           # "Hello, Link"
greet("Link", "Hi")     # "Hi, Link"
```

#### ⚠️ 重要陷阱：默认参数只在函数定义时求值一次

```python
# ❌ 危险写法
def add_item(item, lst=[]):
    lst.append(item)
    return lst

print(add_item(1))  # [1]
print(add_item(2))  # [1, 2]  ← 惊！同一个列表对象
print(add_item(3))  # [1, 2, 3]

# ✅ 正确写法
def add_item(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst

print(add_item(1))  # [1]
print(add_item(2))  # [2]  ← 每次都是新列表
```

**原理**：默认参数 `[]` 在函数定义时只创建一次，所有调用共享同一个对象。

**规则**：**永远不要用可变对象（list/dict/set）作为默认参数**。

### 3. 关键字参数

```python
def create_user(name, age, city):
    return f"{name}, {age}, {city}"

# 位置传递
create_user("Link", 30, "Shenzhen")

# 关键字传递（顺序无关）
create_user(age=30, city="Shenzhen", name="Link")

# 混合使用（位置参数必须在前）
create_user("Link", city="Shenzhen", age=30)
```

**优势**：可读性强，特别是参数多的时候。

**Go 对比**：Go 没有关键字参数，常用结构体模拟：

```go
type UserConfig struct {
    Name string
    Age  int
    City string
}

func CreateUser(cfg UserConfig) string {
    return fmt.Sprintf("%s, %d, %s", cfg.Name, cfg.Age, cfg.City)
}

// 调用
CreateUser(UserConfig{
    Name: "Link",
    Age:  30,
    City: "Shenzhen",
})
```

### 4. `*args`：可变位置参数

```python
def sum_all(*numbers):
    """接收任意数量的位置参数，打包成 tuple"""
    print(type(numbers))  # <class 'tuple'>
    return sum(numbers)

sum_all(1, 2, 3)        # 6
sum_all(1, 2, 3, 4, 5)  # 15
sum_all()               # 0
```

**内部机制**：`*args` 是一个 tuple，包含所有多余的位置参数。

**Go 对比**：
```go
// Go 的可变参数
func sumAll(numbers ...int) int {
    // numbers 是 []int 切片
    sum := 0
    for _, n := range numbers {
        sum += n
    }
    return sum
}
```

### 5. `**kwargs`：可变关键字参数

```python
def build_profile(name, **extra_info):
    """接收任意数量的关键字参数，打包成 dict"""
    print(type(extra_info))  # <class 'dict'>
    profile = {"name": name}
    profile.update(extra_info)
    return profile

result = build_profile("Link", age=30, city="Shenzhen", job="Developer")
# {'name': 'Link', 'age': 30, 'city': 'Shenzhen', 'job': 'Developer'}
```

**内部机制**：`**kwargs` 是一个 dict，包含所有多余的关键字参数。

### 6. 参数解包（`*` 和 `**` 的另一个用法）

#### 解包列表/元组 (`*`)

```python
def add(a, b, c):
    return a + b + c

numbers = [1, 2, 3]
add(*numbers)  # 等价于 add(1, 2, 3)

# 也可用于拼接
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined = [*list1, *list2]  # [1, 2, 3, 4, 5, 6]
```

#### 解包字典 (`**`)

```python
def create_user(name, age, city):
    return f"{name}, {age}, {city}"

data = {"name": "Link", "age": 30, "city": "Shenzhen"}
create_user(**data)  # 等价于 create_user(name="Link", age=30, city="Shenzhen")

# 也可用于合并字典
dict1 = {"a": 1, "b": 2}
dict2 = {"c": 3, "d": 4}
merged = {**dict1, **dict2}  # {'a': 1, 'b': 2, 'c': 3, 'd': 4}
```

**实战场景**：

```python
# 配置传递
db_config = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "123456"
}
connect_db(**db_config)

# API 请求
request_data = {
    "method": "POST",
    "url": "https://api.example.com",
    "headers": {"Content-Type": "application/json"},
    "json": {"key": "value"}
}
requests.request(**request_data)
```

### 7. 仅位置参数 / 仅关键字参数（Python 3.8+）

#### 仅位置参数（`/` 之前）

```python
def greet(name, /, prefix="Hello"):
    #         ↑ 斜杠：name 只能用位置传递
    return f"{prefix}, {name}"

greet("Link")              # ✅ 正确
greet("Link", prefix="Hi") # ✅ 正确
greet(name="Link")         # ❌ TypeError
```

**设计动机**：防止用户依赖参数名（便于未来重命名）。

#### 仅关键字参数（`*` 之后）

```python
def create_user(name, *, age, city):
    #                  ↑ 星号：age 和 city 只能用关键字传递
    return f"{name}, {age}, {city}"

create_user("Link", age=30, city="Shenzhen")  # ✅ 正确
create_user("Link", 30, "Shenzhen")           # ❌ TypeError
```

**设计动机**：强制可读性，避免 `create_user("Link", 30, "Shenzhen")` 这种不清晰的调用。

#### 完整示例

```python
def func(pos_only, /,        # 仅位置
         standard,           # 标准参数（位置或关键字）
         *, kw_only):        # 仅关键字
    pass

func(1, 2, kw_only=3)                      # ✅ 正确
func(1, standard=2, kw_only=3)             # ✅ 正确
func(pos_only=1, standard=2, kw_only=3)    # ❌ TypeError
```

### 8. 完整参数顺序规则

```python
def func(pos1, pos2,           # 1. 位置参数
         default1="a",         # 2. 默认参数
         *args,                # 3. 可变位置参数
         kwonly1,              # 4. 仅关键字参数
         kwonly2="b",          # 5. 仅关键字默认参数
         **kwargs):            # 6. 可变关键字参数
    pass
```

**规则**：严格按照上述顺序，否则语法错误。

---

## 四、作用域规则（LEGB）

Python 查找变量的顺序：**L → E → G → B**

```python
x = "global"        # Global 全局

def outer():
    x = "enclosing"  # Enclosing 外层函数

    def inner():
        x = "local"   # Local 局部
        print(x)

    inner()

outer()  # 输出: "local"
```

### LEGB 详解

| 层级 | 含义 | 示例 |
|:-----|:-----|:-----|
| **L** (Local) | 函数内部定义的变量 | `def f(): x = 1` |
| **E** (Enclosing) | 外层嵌套函数的变量 | 闭包中的外层变量 |
| **G** (Global) | 模块级别的全局变量 | 文件顶层定义的变量 |
| **B** (Built-in) | Python 内置名称 | `len`, `print`, `range` |

### `global` 关键字：修改全局变量

```python
count = 0  # 全局变量

def increment():
    global count  # 声明要修改全局变量
    count += 1

increment()
print(count)  # 1
```

**⚠️ 不用 `global` 的后果**：

```python
count = 0

def increment():
    count += 1  # ❌ UnboundLocalError
    # Python 看到赋值操作，认为 count 是局部变量
    # 但赋值前要读取 count，局部变量还未定义

increment()
```

**规则**：
- 只读访问全局变量：不需要 `global`
- 修改全局变量：必须用 `global` 声明

### `nonlocal` 关键字：修改外层函数变量

```python
def outer():
    count = 0  # 外层函数的变量

    def inner():
        nonlocal count  # 声明要修改外层变量
        count += 1

    inner()
    print(count)  # 1

outer()
```

**`global` vs `nonlocal`**：

```python
x = "global"

def outer():
    x = "enclosing"

    def use_global():
        global x  # 跳过 enclosing，直接访问 global
        x = "modified global"

    def use_nonlocal():
        nonlocal x  # 访问 enclosing
        x = "modified enclosing"

    use_nonlocal()
    print(x)  # "modified enclosing"

outer()
print(x)  # "global" (未被 use_nonlocal 修改)
```

---

## 五、闭包（Closure）

**定义**：内层函数引用了外层函数的变量，外层函数返回内层函数。

```python
def make_multiplier(n):
    def multiplier(x):
        return x * n  # 引用外层的 n
    return multiplier  # 返回函数对象

times3 = make_multiplier(3)
times5 = make_multiplier(5)

print(times3(10))  # 30
print(times5(10))  # 50
```

**关键点**：
1. `multiplier` 函数"记住"了创建时的 `n` 值
2. 每次调用 `make_multiplier` 都创建一个新的闭包
3. `times3` 和 `times5` 是两个独立的函数对象

### 闭包的实战应用

#### 计数器

```python
def make_counter():
    count = 0

    def counter():
        nonlocal count
        count += 1
        return count

    return counter

c1 = make_counter()
c2 = make_counter()

print(c1())  # 1
print(c1())  # 2
print(c2())  # 1  ← 独立的计数器
print(c1())  # 3
```

#### 私有变量模拟

```python
def make_account(initial_balance):
    balance = initial_balance  # "私有"变量

    def deposit(amount):
        nonlocal balance
        balance += amount
        return balance

    def withdraw(amount):
        nonlocal balance
        if amount > balance:
            raise ValueError("余额不足")
        balance -= amount
        return balance

    def get_balance():
        return balance

    return {
        "deposit": deposit,
        "withdraw": withdraw,
        "balance": get_balance
    }

account = make_account(1000)
print(account["deposit"](500))   # 1500
print(account["withdraw"](200))  # 1300
print(account["balance"]())      # 1300
# balance 变量无法直接访问，实现了封装
```

**Go 对比**：
```go
// Go 也支持闭包
func makeMultiplier(n int) func(int) int {
    return func(x int) int {
        return x * n
    }
}

times3 := makeMultiplier(3)
fmt.Println(times3(10))  // 30
```

Go 和 Python 的闭包机制类似，都是词法作用域。

---

## 六、装饰器（Decorator）

**核心概念**：装饰器是一个函数，接收函数作为参数，返回新函数。

### 1. 手动装饰

```python
def make_bold(func):
    """装饰器：在结果两边加 <b> 标签"""
    def wrapper():
        result = func()
        return f"<b>{result}</b>"
    return wrapper

def greet():
    return "Hello"

# 手动装饰
greet = make_bold(greet)
print(greet())  # "<b>Hello</b>"
```

### 2. `@` 语法糖

```python
def make_bold(func):
    def wrapper():
        result = func()
        return f"<b>{result}</b>"
    return wrapper

@make_bold  # 等价于 greet = make_bold(greet)
def greet():
    return "Hello"

print(greet())  # "<b>Hello</b>"
```

**执行时机**：`@make_bold` 在函数定义时立即执行。

### 3. 通用装饰器模板

```python
from functools import wraps

def my_decorator(func):
    @wraps(func)  # 保留原函数的元信息（__name__, __doc__ 等）
    def wrapper(*args, **kwargs):
        # 前置操作
        result = func(*args, **kwargs)  # 调用原函数
        # 后置操作
        return result
    return wrapper
```

**`@wraps(func)` 的作用**：复制原函数的元信息

```python
from functools import wraps

def log(func):
    @wraps(func)  # 必须加这个
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@log
def greet(name):
    """问候函数"""
    return f"Hello, {name}"

print(greet.__name__)  # "greet"  ✅
print(greet.__doc__)   # "问候函数" ✅
```

**如果不加 `@wraps`**：

```python
def log(func):
    def wrapper(*args, **kwargs):  # 没有 @wraps(func)
        return func(*args, **kwargs)
    return wrapper

@log
def greet(name):
    """问候函数"""
    return f"Hello, {name}"

print(greet.__name__)  # "wrapper"  ❌
print(greet.__doc__)   # None       ❌
```

### 4. 实战示例

#### 日志装饰器

```python
from functools import wraps
import time

def log(func):
    """记录函数调用"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"[{time.strftime('%H:%M:%S')}] 调用 {func.__name__}")
        print(f"  参数: {args}, {kwargs}")
        result = func(*args, **kwargs)
        print(f"  返回: {result}")
        return result
    return wrapper

@log
def add(a, b):
    return a + b

add(1, 2)
# 输出:
# [14:23:45] 调用 add
#   参数: (1, 2), {}
#   返回: 3
```

#### 计时装饰器

```python
import time
from functools import wraps

def timing(func):
    """测量函数执行时间"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} 耗时: {end - start:.4f} 秒")
        return result
    return wrapper

@timing
def slow_function():
    time.sleep(1)
    return "Done"

slow_function()  # slow_function 耗时: 1.0012 秒
```

#### 权限检查装饰器

```python
from functools import wraps

def require_auth(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user = kwargs.get("user")
        if not user or not user.get("is_admin"):
            raise PermissionError("需要管理员权限")
        return func(*args, **kwargs)
    return wrapper

@require_auth
def delete_user(user_id, user=None):
    print(f"删除用户 {user_id}")

# 测试
delete_user(123, user={"is_admin": True})   # ✅ 成功
delete_user(123, user={"is_admin": False})  # ❌ PermissionError
```

### 5. 带参数的装饰器

```python
from functools import wraps

def repeat(n):
    """装饰器工厂：返回一个装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(n):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)  # 等价于 greet = repeat(3)(greet)
def greet(name):
    print(f"Hello, {name}")

greet("Link")
# 输出 3 次:
# Hello, Link
# Hello, Link
# Hello, Link
```

**执行顺序**：
1. `repeat(3)` 返回 `decorator`
2. `@decorator` 装饰 `greet`

### 6. 多个装饰器叠加

```python
@decorator1
@decorator2
@decorator3
def func():
    pass

# 等价于
func = decorator1(decorator2(decorator3(func)))
```

**执行顺序**：从下到上装饰，从上到下执行。

```python
from functools import wraps

def bold(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return f"<b>{func(*args, **kwargs)}</b>"
    return wrapper

def italic(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return f"<i>{func(*args, **kwargs)}</i>"
    return wrapper

@bold
@italic
def greet():
    return "Hello"

print(greet())  # "<b><i>Hello</i></b>"
```

---

## 七、推导式（Comprehensions）

### 1. 列表推导式

**语法**：`[表达式 for 变量 in 可迭代对象 if 条件]`

```python
# 基本用法
squares = [x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 带条件过滤
evens = [x for x in range(10) if x % 2 == 0]
# [0, 2, 4, 6, 8]

# 组合：映射 + 过滤
even_squares = [x**2 for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]
```

**等价的循环写法**：

```python
# 推导式（1 行）
result = [x**2 for x in range(10) if x % 2 == 0]

# 循环（5 行）
result = []
for x in range(10):
    if x % 2 == 0:
        result.append(x**2)
```

**嵌套推导式**：

```python
# 笛卡尔积
pairs = [(x, y) for x in [1, 2, 3] for y in ['a', 'b']]
# [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b'), (3, 'a'), (3, 'b')]

# 矩阵转置
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
transposed = [[row[i] for row in matrix] for i in range(3)]
# [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
```

**性能优势**：列表推导式比循环快 ~30%（CPython 优化）

### 2. 字典推导式

**语法**：`{键表达式: 值表达式 for 变量 in 可迭代对象 if 条件}`

```python
# 基本用法
squares_dict = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# 从列表创建字典
users = ["Alice", "Bob", "Charlie"]
user_ids = {name: i for i, name in enumerate(users)}
# {'Alice': 0, 'Bob': 1, 'Charlie': 2}

# 字典键值互换
original = {"a": 1, "b": 2, "c": 3}
swapped = {v: k for k, v in original.items()}
# {1: 'a', 2: 'b', 3: 'c'}

# 过滤字典
scores = {"Alice": 85, "Bob": 92, "Charlie": 78, "David": 95}
high_scores = {name: score for name, score in scores.items() if score >= 90}
# {'Bob': 92, 'David': 95}
```

### 3. 集合推导式

**语法**：`{表达式 for 变量 in 可迭代对象 if 条件}`

```python
# 基本用法
unique_lengths = {len(word) for word in ["hello", "world", "python", "code"]}
# {4, 5, 6}

# 去重
numbers = [1, 2, 2, 3, 3, 3, 4]
unique = {x for x in numbers}
# {1, 2, 3, 4}
```

### 4. 生成器表达式

**语法**：`(表达式 for 变量 in 可迭代对象 if 条件)`

```python
# 列表推导式（立即创建完整列表）
squares_list = [x**2 for x in range(1000000)]  # 占用大量内存

# 生成器表达式（惰性求值）
squares_gen = (x**2 for x in range(1000000))  # 几乎不占内存

# 迭代时才计算
for square in squares_gen:
    if square > 100:
        break
```

**对比**：

| 特性 | 列表推导式 | 生成器表达式 |
|:-----|:-----------|:-------------|
| 语法 | `[...]` | `(...)` |
| 返回类型 | list | generator |
| 内存占用 | 立即创建完整列表 | 惰性求值，节省内存 |
| 可重复使用 | ✅ | ❌ (只能迭代一次) |

### 5. 推导式实战

#### 数据清洗

```python
# 提取用户名并转大写
users = [
    {"name": "alice", "age": 25},
    {"name": "bob", "age": 30},
    {"name": "charlie", "age": 35}
]

names = [user["name"].upper() for user in users]
# ['ALICE', 'BOB', 'CHARLIE']
```

#### 多条件过滤

```python
# 找出活跃的成年用户
users = [
    {"name": "Alice", "age": 17, "active": True},
    {"name": "Bob", "age": 25, "active": False},
    {"name": "Charlie", "age": 30, "active": True}
]

active_adults = [
    user["name"]
    for user in users
    if user["age"] >= 18 and user["active"]
]
# ['Charlie']
```

#### 字符串处理

```python
# 分割并清理
text = "  hello,  world,  python  "
words = [word.strip() for word in text.split(",") if word.strip()]
# ['hello', 'world', 'python']
```

#### 嵌套数据提取

```python
# 提取所有学生的成绩
classes = [
    {"name": "Math", "students": [{"name": "Alice", "score": 85}, {"name": "Bob", "score": 90}]},
    {"name": "English", "students": [{"name": "Alice", "score": 88}, {"name": "Bob", "score": 92}]}
]

all_scores = [
    student["score"]
    for cls in classes
    for student in cls["students"]
]
# [85, 90, 88, 92]
```

---

## 八、常用内置函数

Python 提供了大量实用的内置函数，无需 import 即可使用。

### 1. 遍历相关

#### `enumerate()` - 带索引的遍历

```python
# 基本用法
users = ["Alice", "Bob", "Charlie"]
for i, name in enumerate(users):
    print(f"{i}: {name}")
# 输出:
# 0: Alice
# 1: Bob
# 2: Charlie

# 自定义起始索引
for i, name in enumerate(users, start=1):
    print(f"{i}: {name}")
# 输出:
# 1: Alice
# 2: Bob
# 3: Charlie
```

**Go 对比**：

```go
// Go 的 for...range 自带索引
users := []string{"Alice", "Bob", "Charlie"}
for i, name := range users {
    fmt.Printf("%d: %s\n", i, name)
}
```

#### `zip()` - 并行遍历

```python
# 基本用法
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]
cities = ["Beijing", "Shanghai", "Shenzhen"]

for name, age, city in zip(names, ages, cities):
    print(f"{name}, {age}, {city}")
# 输出:
# Alice, 25, Beijing
# Bob, 30, Shanghai
# Charlie, 35, Shenzhen

# 长度不同时，以最短的为准
numbers = [1, 2, 3]
letters = ['a', 'b']
result = list(zip(numbers, letters))
# [(1, 'a'), (2, 'b')]  ← 只有 2 对

# 构造字典
user_dict = dict(zip(names, ages))
# {'Alice': 25, 'Bob': 30, 'Charlie': 35}
```

**实战示例**：

```python
# 矩阵转置
matrix = [
    [1, 2, 3],
    [4, 5, 6]
]
transposed = list(zip(*matrix))
# [(1, 4), (2, 5), (3, 6)]
```

### 2. 排序和反转

#### `sorted()` - 排序（不修改原数据）

```python
# 基本排序
numbers = [3, 1, 4, 1, 5]
sorted_numbers = sorted(numbers)
print(sorted_numbers)  # [1, 1, 3, 4, 5]
print(numbers)         # [3, 1, 4, 1, 5]  ← 原数据未变

# 降序
sorted_numbers = sorted(numbers, reverse=True)
# [5, 4, 3, 1, 1]

# 按 key 排序
users = [
    {"name": "Bob", "age": 30},
    {"name": "Alice", "age": 25},
    {"name": "Charlie", "age": 35}
]
sorted_users = sorted(users, key=lambda u: u["age"])
# [{'name': 'Alice', 'age': 25}, ...]

# 多条件排序
sorted_users = sorted(users, key=lambda u: (u["age"], u["name"]))
```

**对比 `list.sort()`**：

```python
# list.sort() 修改原列表
numbers = [3, 1, 4, 1, 5]
numbers.sort()
print(numbers)  # [1, 1, 3, 4, 5]  ← 原数据被修改
```

#### `reversed()` - 反转（返回迭代器）

```python
# 返回迭代器
numbers = [1, 2, 3, 4, 5]
reversed_iter = reversed(numbers)
print(list(reversed_iter))  # [5, 4, 3, 2, 1]

# 字符串反转
text = "hello"
print(''.join(reversed(text)))  # "olleh"
```

### 3. 聚合函数

#### `any()` / `all()` - 逻辑判断

```python
# any(): 任意一个为 True
numbers = [0, 0, 1, 0]
print(any(numbers))  # True

# all(): 全部为 True
numbers = [1, 2, 3, 4]
print(all(numbers))  # True

# 实战：检查权限
permissions = [True, True, False]
has_all_permissions = all(permissions)  # False

# 结合生成器表达式
numbers = [1, 2, 3, 4, 5]
print(any(x > 3 for x in numbers))  # True
print(all(x > 0 for x in numbers))  # True
```

#### `sum()` / `min()` / `max()`

```python
numbers = [1, 2, 3, 4, 5]

# 求和
print(sum(numbers))  # 15
print(sum(numbers, 10))  # 25  ← 初始值为 10

# 最小值/最大值
print(min(numbers))  # 1
print(max(numbers))  # 5

# 带 key 的最值
users = [
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 30}
]
youngest = min(users, key=lambda u: u["age"])
# {'name': 'Alice', 'age': 25}
```

### 4. 类型转换

```python
# 数值转换
int("123")     # 123
float("3.14")  # 3.14
str(123)       # "123"

# 集合转换
list("hello")     # ['h', 'e', 'l', 'l', 'o']
tuple([1, 2, 3])  # (1, 2, 3)
set([1, 2, 2, 3]) # {1, 2, 3}

# 字典转换
keys = ['a', 'b', 'c']
values = [1, 2, 3]
dict(zip(keys, values))  # {'a': 1, 'b': 2, 'c': 3}
```

### 5. 类型检查

#### `isinstance()` - 类型检查

```python
# 基本用法
print(isinstance(123, int))      # True
print(isinstance("hello", str))  # True
print(isinstance([1, 2], list))  # True

# 多类型检查
value = "hello"
print(isinstance(value, (int, str, float)))  # True

# 实战：参数验证
def process(value: int | str) -> str:
    if isinstance(value, int):
        return f"数字: {value}"
    elif isinstance(value, str):
        return f"字符串: {value}"
```

**对比 `type()`**：

```python
# type() 返回类型对象
print(type(123))  # <class 'int'>

# isinstance() 更推荐（支持继承）
class Animal: pass
class Dog(Animal): pass

dog = Dog()
print(isinstance(dog, Animal))  # True  ← 支持继承
print(type(dog) == Animal)      # False
```

#### `hasattr()` / `getattr()` / `setattr()` - 属性操作

```python
class User:
    def __init__(self, name):
        self.name = name

user = User("Alice")

# hasattr: 检查属性是否存在
print(hasattr(user, "name"))  # True
print(hasattr(user, "age"))   # False

# getattr: 获取属性（可设置默认值）
print(getattr(user, "name"))        # "Alice"
print(getattr(user, "age", 25))     # 25  ← 默认值

# setattr: 设置属性
setattr(user, "age", 30)
print(user.age)  # 30
```

### 6. 函数式编程（不推荐，用推导式替代）

#### `map()` - 映射

```python
# map 返回迭代器
numbers = [1, 2, 3, 4, 5]
squared = map(lambda x: x**2, numbers)
print(list(squared))  # [1, 4, 9, 16, 25]

# ✅ 推荐用列表推导式
squared = [x**2 for x in numbers]
```

#### `filter()` - 过滤

```python
# filter 返回迭代器
numbers = [1, 2, 3, 4, 5]
evens = filter(lambda x: x % 2 == 0, numbers)
print(list(evens))  # [2, 4]

# ✅ 推荐用列表推导式
evens = [x for x in numbers if x % 2 == 0]
```

### 7. 其他实用函数

#### `range()` - 生成数字序列

```python
# 基本用法
list(range(5))           # [0, 1, 2, 3, 4]
list(range(1, 5))        # [1, 2, 3, 4]
list(range(0, 10, 2))    # [0, 2, 4, 6, 8]

# 反向
list(range(5, 0, -1))    # [5, 4, 3, 2, 1]
```

#### `len()` - 长度

```python
len([1, 2, 3])      # 3
len("hello")        # 5
len({"a": 1, "b": 2})  # 2
```

#### `abs()` - 绝对值

```python
abs(-5)    # 5
abs(3.14)  # 3.14
```

#### `round()` - 四舍五入

```python
round(3.14159)      # 3
round(3.14159, 2)   # 3.14
```

#### `divmod()` - 同时取商和余数

```python
quotient, remainder = divmod(10, 3)
# quotient = 3, remainder = 1
```

### 8. 实战组合

#### 数据统计

```python
scores = [85, 92, 78, 95, 88]

print(f"总分: {sum(scores)}")
print(f"平均分: {sum(scores) / len(scores)}")
print(f"最高分: {max(scores)}")
print(f"最低分: {min(scores)}")
print(f"及格率: {sum(1 for s in scores if s >= 60) / len(scores) * 100}%")
```

#### 数据处理流水线

```python
# 原始数据
data = [
    {"name": "Alice", "age": 25, "score": 85},
    {"name": "Bob", "age": 30, "score": 92},
    {"name": "Charlie", "age": 35, "score": 78}
]

# 筛选成绩 >= 80 的用户，按分数降序排列
result = sorted(
    [user for user in data if user["score"] >= 80],
    key=lambda u: u["score"],
    reverse=True
)
# [{'name': 'Bob', ...}, {'name': 'Alice', ...}]
```

---

## 九、跨语言对比

### 参数系统

| 特性 | Python | Go | PHP |
|:-----|:-------|:---|:----|
| 默认参数 | ✅ | ❌ | ✅ |
| 关键字参数 | ✅ | ❌ | ✅ (PHP 8.0+) |
| `*args` | ✅ tuple | `...T` slice | `...$args` array |
| `**kwargs` | ✅ dict | ❌ | ❌ |
| 仅位置/关键字 | ✅ `/`, `*` | ❌ | ❌ |

### 装饰器

| 语言 | 装饰器支持 | 语法 |
|:-----|:-----------|:-----|
| Python | ✅ 原生支持 | `@decorator` |
| Go | ❌ 手动包装 | 函数包装 |
| JavaScript | ✅ 提案阶段 | `@decorator` (Stage 3) |
| Java | ✅ 注解 | `@Annotation` |

### 推导式

| 语言 | 列表推导式 | 语法示例 |
|:-----|:-----------|:---------|
| Python | ✅ | `[x**2 for x in range(10)]` |
| Haskell | ✅ | `[x^2 \| x <- [0..9]]` |
| JavaScript | ❌ | `.filter().map()` |
| Go | ❌ | 手写循环 |
| Rust | ❌ | 迭代器链 `.filter().map()` |

---

## 十、最佳实践

### 1. 默认参数陷阱必须避免

```python
# ❌ 永远不要这样写
def bad(lst=[]):
    lst.append(1)
    return lst

# ✅ 正确写法
def good(lst=None):
    if lst is None:
        lst = []
    lst.append(1)
    return lst
```

### 2. 复杂参数用关键字传递

```python
# ❌ 看不懂参数含义
create_user("Link", 30, "Shenzhen", True, "admin", False)

# ✅ 清晰明了
create_user(
    name="Link",
    age=30,
    city="Shenzhen",
    active=True,
    role="admin",
    verified=False
)
```

### 3. API 设计时用仅关键字参数

```python
# ✅ 强制用户写清楚参数含义
def connect_db(host, port, *, user, password, timeout=30):
    pass

# 必须这样调用
connect_db("localhost", 3306, user="root", password="123", timeout=60)
```

### 4. 装饰器必须用 `@wraps`

```python
from functools import wraps

def my_decorator(func):
    @wraps(func)  # ← 必加
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper
```

### 5. 推导式不要过度嵌套

```python
# ❌ 三层嵌套（难以维护）
result = [
    (x, y, z)
    for x in range(10)
    for y in range(10)
    if x < y
    for z in range(10)
    if y < z
]

# ✅ 改用循环
result = []
for x in range(10):
    for y in range(10):
        if x < y:
            for z in range(10):
                if y < z:
                    result.append((x, y, z))
```

**规则**：超过 2 层嵌套就用循环。

### 6. 大数据用生成器表达式

```python
# ❌ 内存爆炸
squares = [x**2 for x in range(10000000)]

# ✅ 节省内存
squares = (x**2 for x in range(10000000))
total = sum(squares)  # 只在需要时计算
```

---

## 十一、总结

### Python 函数的核心特性

1. **类型注解**：Python 3.9+ 新语法 (`list[int]`, `str | None`)，提升代码可读性
2. **灵活的参数系统**：`*args`, `**kwargs`, `/`, `*` 提供了极大的灵活性
3. **闭包和装饰器**：实现了强大的元编程能力
4. **推导式**：简洁的声明式数据处理
5. **作用域规则**：LEGB 清晰定义了变量查找顺序
6. **内置函数**：`enumerate`, `zip`, `sorted`, `any`, `all` 等实用工具

### 记忆要点

```python
# 类型注解（Python 3.9+）
def func(name: str, age: int) -> dict[str, str | int]:
    return {"name": name, "age": age}

# 参数顺序
def func(pos, /, std, default=1, *args, kw_only, kw_default=2, **kwargs):
    pass

# 装饰器模板
from functools import wraps

def decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

# 推导式公式
[表达式 for 变量 in 可迭代对象 if 条件]  # 列表
{k: v for ... if ...}                    # 字典
{x for ... if ...}                       # 集合
(x for ... if ...)                       # 生成器

# 常用内置函数
enumerate(iterable, start=0)  # 带索引遍历
zip(*iterables)               # 并行遍历
sorted(iterable, key=None)    # 排序
any(iterable)                 # 任意为真
all(iterable)                 # 全部为真
```

---

**参考资料**:
- [PEP 484 – Type Hints](https://www.python.org/dev/peps/pep-0484/)
- [PEP 585 – Type Hinting Generics In Standard Collections](https://www.python.org/dev/peps/pep-0585/)
- [PEP 604 – Allow writing union types as X | Y](https://www.python.org/dev/peps/pep-0604/)
- [PEP 3102 – Keyword-Only Arguments](https://www.python.org/dev/peps/pep-3102/)
- [PEP 570 – Python Positional-Only Parameters](https://www.python.org/dev/peps/pep-0570/)
- [PEP 318 – Decorators for Functions and Methods](https://www.python.org/dev/peps/pep-0318/)
- [PEP 202 – List Comprehensions](https://www.python.org/dev/peps/pep-0202/)
- [Python Built-in Functions](https://docs.python.org/3/library/functions.html)
