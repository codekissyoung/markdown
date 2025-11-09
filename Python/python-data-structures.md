# Python 基础数据结构完全指南

## 学习信息

- **学习日期**: 2025-11-09
- **Python版本**: 3.13
- **参考资料**: Python官方文档、实战经验
- **前置知识**: Python基础语法

---

## 核心概述

Python有**四大基础数据结构**：

| 类型 | 符号 | 可变性 | 有序性 | 重复性 | 主要用途 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 列表 list | `[]` | 可变 | 有序 | 可重复 | 通用有序集合 |
| 元组 tuple | `()` | 不可变 | 有序 | 可重复 | 不可变数据、函数返回值 |
| 字典 dict | `{}` | 可变 | 有序* | 键唯一 | 键值对映射 |
| 集合 set | `{}` | 可变 | 无序 | 不重复 | 去重、集合运算 |

*Python 3.7+ 字典保证插入顺序

---

## 一、列表（list）

### 核心特性

**可变的有序序列** - 最常用的数据结构

```python
# 创建列表
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]  # 可以混合类型
empty = []
nested = [[1, 2], [3, 4], [5, 6]]  # 嵌套列表
```

### 索引和切片

```python
lst = [10, 20, 30, 40, 50]

# 索引
lst[0]      # 10（第一个元素）
lst[-1]     # 50（最后一个元素）
lst[-2]     # 40（倒数第二个）

# 切片 [start:stop:step]
lst[1:4]    # [20, 30, 40]（索引1到3，不包含4）
lst[:3]     # [10, 20, 30]（从头到索引2）
lst[2:]     # [30, 40, 50]（从索引2到末尾）
lst[::2]    # [10, 30, 50]（步长2，跳着取）
lst[::-1]   # [50, 40, 30, 20, 10]（倒序）

# 切片赋值
lst[1:3] = [99, 88]  # [10, 99, 88, 40, 50]
```

### 修改操作

```python
lst = [1, 2, 3]

# 添加元素
lst.append(4)           # [1, 2, 3, 4]（末尾追加）
lst.insert(1, 99)       # [1, 99, 2, 3, 4]（指定位置插入）
lst.extend([5, 6])      # [1, 99, 2, 3, 4, 5, 6]（合并列表）
lst += [7, 8]           # [1, 99, 2, 3, 4, 5, 6, 7, 8]

# 删除元素
lst.pop()               # 删除并返回最后一个元素
lst.pop(1)              # 删除并返回索引1的元素
lst.remove(3)           # 删除第一个值为3的元素
del lst[0]              # 删除索引0的元素
del lst[1:3]            # 删除切片
lst.clear()             # 清空列表

# 修改元素
lst[0] = 100
lst[1:3] = [88, 99]
```

### 常用方法

```python
lst = [3, 1, 4, 1, 5, 9, 2]

# 排序
lst.sort()              # [1, 1, 2, 3, 4, 5, 9]（原地排序）
lst.sort(reverse=True)  # [9, 5, 4, 3, 2, 1, 1]（降序）
sorted_lst = sorted(lst)  # 返回新列表，不修改原列表

# 反转
lst.reverse()           # 原地反转
reversed_lst = lst[::-1]  # 返回新列表

# 查找
lst.index(4)            # 2（返回4的索引）
lst.count(1)            # 2（统计1出现的次数）

# 其他
len(lst)                # 7（长度）
max(lst)                # 9（最大值）
min(lst)                # 1（最小值）
sum(lst)                # 25（求和，仅数字）
```

### 列表推导式

```python
# 基本形式
squares = [x**2 for x in range(5)]
# [0, 1, 4, 9, 16]

# 带条件过滤
evens = [x for x in range(10) if x % 2 == 0]
# [0, 2, 4, 6, 8]

# 带 if-else
labels = ["偶数" if x % 2 == 0 else "奇数" for x in range(5)]
# ['偶数', '奇数', '偶数', '奇数', '偶数']

# 嵌套循环
pairs = [(x, y) for x in [1, 2] for y in ['a', 'b']]
# [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]

# 二维列表推导
matrix = [[i*j for j in range(3)] for i in range(3)]
# [[0, 0, 0], [0, 1, 2], [0, 2, 4]]
```

### 复制列表

```python
original = [1, 2, 3]

# 浅拷贝（3种方式）
copy1 = original.copy()
copy2 = original[:]
copy3 = list(original)

# 深拷贝（嵌套列表需要）
import copy
nested = [[1, 2], [3, 4]]
deep = copy.deepcopy(nested)
```

---

## 二、元组（tuple）

### 核心特性

**不可变的有序序列** - 创建后不能修改

```python
# 创建元组
point = (10, 20)
rgb = (255, 128, 0)
single = (42,)          # 单元素元组，注意逗号！
empty = ()
nested = ((1, 2), (3, 4))

# 元组打包（省略括号）
coords = 3, 4
print(type(coords))     # <class 'tuple'>
```

### 索引和切片

```python
t = (10, 20, 30, 40, 50)

# 索引（和列表一样）
t[0]      # 10
t[-1]     # 50

# 切片（和列表一样）
t[1:4]    # (20, 30, 40)
t[::-1]   # (50, 40, 30, 20, 10)
```

### 不可变特性

```python
t = (1, 2, 3)

# ❌ 不能修改
t[0] = 100      # TypeError
t.append(4)     # AttributeError

# ✅ 可以重新赋值（创建新元组）
t = (4, 5, 6)

# ⚠️ 注意：元组不可变，但元素可以是可变对象
t = ([1, 2], [3, 4])
t[0].append(99)  # ✅ 可以（修改的是列表，不是元组）
print(t)         # ([1, 2, 99], [3, 4])
```

### 元组解包

```python
# 基本解包
point = (3, 4)
x, y = point
print(x, y)    # 3 4

# 交换变量
a, b = 1, 2
a, b = b, a    # 交换
print(a, b)    # 2 1

# 多值返回
def get_user():
    return "link", 25, "Python"

name, age, lang = get_user()

# 扩展解包（*语法）
numbers = (1, 2, 3, 4, 5)
first, *middle, last = numbers
print(first)   # 1
print(middle)  # [2, 3, 4]（注意：变成列表了）
print(last)    # 5

# 忽略某些值
_, age, _ = ("link", 25, "Python")
print(age)     # 25
```

### 常用方法

```python
t = (1, 2, 2, 3, 2)

t.count(2)     # 3（2出现了3次）
t.index(3)     # 3（3的索引位置）
len(t)         # 5（长度）
```

### 使用场景

```python
# ✅ 适合用元组
# 1. 固定数据（坐标、颜色等）
point = (10, 20)
color = (255, 0, 0)

# 2. 函数返回多个值
def divmod_custom(a, b):
    return a // b, a % b

quotient, remainder = divmod_custom(10, 3)

# 3. 字典的键（元组不可变，可以做键）
locations = {
    (0, 0): "原点",
    (1, 0): "X轴",
    (0, 1): "Y轴",
}

# 4. 保护数据
WEEKDAYS = ("周一", "周二", "周三", "周四", "周五")
```

---

## 三、字典（dict）

### 核心特性

**键值对映射** - 通过键快速查找值

```python
# 创建字典
user = {
    "name": "link",
    "age": 25,
    "skills": ["Python", "Go", "PHP"]
}

# 空字典
empty = {}
empty2 = dict()

# dict() 构造
user2 = dict(name="alice", age=30)

# 字典推导式
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

### 访问和修改

```python
user = {"name": "link", "age": 25}

# 访问值
user["name"]                # "link"
user.get("age")             # 25
user.get("city")            # None（键不存在返回None）
user.get("city", "北京")    # "北京"（指定默认值）

# 修改/添加
user["age"] = 26            # 修改
user["city"] = "深圳"        # 添加（键不存在会创建）

# 删除
del user["city"]            # 删除键值对
age = user.pop("age")       # 删除并返回值
user.pop("xxx", None)       # 键不存在返回默认值，不报错
user.clear()                # 清空

# setdefault - 获取值，不存在则设置默认值
user.setdefault("city", "北京")  # 键不存在时设置并返回"北京"
```

### 遍历字典

```python
user = {"name": "link", "age": 25, "city": "深圳"}

# 遍历键
for key in user:
    print(key)

for key in user.keys():
    print(key)

# 遍历值
for value in user.values():
    print(value)

# 遍历键值对（推荐）
for key, value in user.items():
    print(f"{key}: {value}")
```

### 常用方法

```python
user = {"name": "link", "age": 25}

# 获取键、值、键值对
user.keys()        # dict_keys(['name', 'age'])
user.values()      # dict_values(['link', 25])
user.items()       # dict_items([('name', 'link'), ('age', 25)])

# 更新字典
user.update({"age": 26, "city": "深圳"})
# {'name': 'link', 'age': 26, 'city': '深圳'}

# 合并字典（推荐，Python 3.9+）
dict1 = {"a": 1, "b": 2}
dict2 = {"c": 3, "d": 4}
merged = dict1 | dict2
# {'a': 1, 'b': 2, 'c': 3, 'd': 4}

# 检查键是否存在
"name" in user     # True
"email" in user    # False
```

### 字典推导式

```python
# 基本形式
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# 过滤
scores = {"Alice": 85, "Bob": 92, "Charlie": 78}
passed = {name: score for name, score in scores.items() if score >= 80}
# {'Alice': 85, 'Bob': 92}

# 反转字典
original = {"a": 1, "b": 2, "c": 3}
swapped = {v: k for k, v in original.items()}
# {1: 'a', 2: 'b', 3: 'c'}

# 转换值
prices = {"apple": 5, "banana": 3}
discounted = {k: v * 0.9 for k, v in prices.items()}
# {'apple': 4.5, 'banana': 2.7}
```

### 嵌套字典

```python
users = {
    "user1": {
        "name": "link",
        "age": 25,
        "skills": ["Python", "Go"]
    },
    "user2": {
        "name": "alice",
        "age": 30,
        "skills": ["JavaScript", "TypeScript"]
    }
}

# 访问嵌套值
users["user1"]["name"]           # "link"
users["user1"]["skills"][0]      # "Python"
```

### 特殊字典类型

```python
# defaultdict - 自动设置默认值
from collections import defaultdict

count = defaultdict(int)  # 默认值0
count["apple"] += 1
count["banana"] += 1
# defaultdict(<class 'int'>, {'apple': 1, 'banana': 1})

# Counter - 计数器
from collections import Counter

words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
count = Counter(words)
# Counter({'apple': 3, 'banana': 2, 'cherry': 1})

count.most_common(2)  # [('apple', 3), ('banana', 2)]

# OrderedDict - 有序字典（Python 3.7+ 普通字典已有序，很少用了）
from collections import OrderedDict
od = OrderedDict()
```

---

## 四、集合（set）

### 核心特性

**无序、不重复** - 自动去重，快速查找

```python
# 创建集合
fruits = {"apple", "banana", "cherry"}
numbers = {1, 2, 3, 4, 5}

# 空集合（注意：{}是空字典！）
empty = set()

# 从列表创建（自动去重）
nums = [1, 2, 2, 3, 3, 3]
unique = set(nums)
# {1, 2, 3}

# 集合推导式
evens = {x for x in range(10) if x % 2 == 0}
# {0, 2, 4, 6, 8}
```

### 基本操作

```python
s = {1, 2, 3}

# 添加元素
s.add(4)           # {1, 2, 3, 4}
s.add(2)           # {1, 2, 3, 4}（重复元素不会添加）

# 批量添加
s.update([5, 6, 7])  # {1, 2, 3, 4, 5, 6, 7}

# 删除元素
s.remove(3)        # {1, 2, 4, 5, 6, 7}（元素不存在会报错）
s.discard(10)      # 不报错（元素不存在也不报错）
x = s.pop()        # 随机删除并返回一个元素

# 清空
s.clear()

# 长度
len(s)
```

### 集合运算

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

# 并集（union）
a | b              # {1, 2, 3, 4, 5, 6}
a.union(b)         # {1, 2, 3, 4, 5, 6}

# 交集（intersection）
a & b              # {3, 4}
a.intersection(b)  # {3, 4}

# 差集（difference）
a - b              # {1, 2}（在a中但不在b中）
b - a              # {5, 6}（在b中但不在a中）

# 对称差集（symmetric_difference）
a ^ b              # {1, 2, 5, 6}（在a或b中，但不同时在两者中）
```

### 集合关系

```python
a = {1, 2, 3}
b = {1, 2, 3, 4, 5}

# 子集
a <= b                 # True（a是b的子集）
a < b                  # True（a是b的真子集）
a.issubset(b)          # True

# 超集
b >= a                 # True（b是a的超集）
b > a                  # True（b是a的真超集）
b.issuperset(a)        # True

# 不相交
c = {6, 7, 8}
a.isdisjoint(c)        # True（没有公共元素）
```

### 实用场景

```python
# 1. 去重
nums = [1, 2, 2, 3, 3, 3, 4]
unique_nums = list(set(nums))
# [1, 2, 3, 4]

# 2. 快速查找（比列表快）
visited = set()
if user_id not in visited:
    visited.add(user_id)
    process_user(user_id)

# 3. 找共同好友
user1_friends = {"Alice", "Bob", "Charlie"}
user2_friends = {"Bob", "David", "Charlie"}
common = user1_friends & user2_friends
# {'Bob', 'Charlie'}

# 4. 找差异
all_tasks = {"task1", "task2", "task3", "task4"}
completed = {"task1", "task3"}
remaining = all_tasks - completed
# {'task2', 'task4'}

# 5. 去除重复单词
text = "apple banana apple cherry banana apple"
unique_words = set(text.split())
# {'apple', 'banana', 'cherry'}
```

---

## 五、* 和 ** 运算符详解

### 1. 基础运算

```python
# 乘法
3 * 4              # 12
"ha" * 3           # "hahaha"
[1, 2] * 3         # [1, 2, 1, 2, 1, 2]

# 幂运算
2 ** 3             # 8
10 ** 2            # 100
```

### 2. 序列解包（*）

#### 解包赋值

```python
# 基本解包
numbers = [1, 2, 3, 4, 5]
first, *middle, last = numbers
# first=1, middle=[2,3,4], last=5

# 只要开头
first, *rest = [1, 2, 3, 4]
# first=1, rest=[2,3,4]

# 只要结尾
*rest, last = [1, 2, 3, 4]
# rest=[1,2,3], last=4

# 忽略中间
first, *_, last = [1, 2, 3, 4, 5]
# first=1, last=5
```

#### 合并序列

```python
# 合并列表
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined = [*list1, *list2]
# [1, 2, 3, 4, 5, 6]

# 添加元素
combined = [0, *list1, *list2, 7]
# [0, 1, 2, 3, 4, 5, 6, 7]

# 展开字符串
chars = [*"hello"]
# ['h', 'e', 'l', 'l', 'o']

# 复制列表
copy = [*original]
```

#### 函数调用解包

```python
def add(a, b, c):
    return a + b + c

numbers = [1, 2, 3]
result = add(*numbers)  # 等价于 add(1, 2, 3)
# 6

# print 解包
values = [1, 2, 3, 4, 5]
print(*values)          # 1 2 3 4 5
print(*values, sep=", ")  # 1, 2, 3, 4, 5
```

### 3. 字典解包（**）

#### 合并字典

```python
# 基本合并
dict1 = {"a": 1, "b": 2}
dict2 = {"c": 3, "d": 4}
merged = {**dict1, **dict2}
# {'a': 1, 'b': 2, 'c': 3, 'd': 4}

# 覆盖键值
dict1 = {"a": 1, "b": 2}
dict2 = {"b": 99, "c": 3}
merged = {**dict1, **dict2}
# {'a': 1, 'b': 99, 'c': 3}（dict2的b覆盖了dict1）

# 添加额外键值
base = {"a": 1, "b": 2}
extended = {**base, "c": 3, "d": 4}
# {'a': 1, 'b': 2, 'c': 3, 'd': 4}
```

#### 函数调用解包

```python
def greet(name, age, city):
    return f"{name}, {age}岁, 来自{city}"

user = {"name": "link", "age": 25, "city": "深圳"}
result = greet(**user)  # 等价于 greet(name="link", age=25, city="深圳")
# "link, 25岁, 来自深圳"

# 配置传递
config = {"host": "localhost", "port": 8080, "debug": True}
def start_server(host, port, debug):
    print(f"Server: {host}:{port}, debug={debug}")

start_server(**config)
```

### 4. 函数参数（*args 和 **kwargs）

#### *args - 可变位置参数

```python
def sum_all(*args):
    print(f"args: {args}")  # args 是元组
    return sum(args)

sum_all(1, 2, 3)           # 6
sum_all(1, 2, 3, 4, 5)     # 15

# 实际应用
def log(*messages, level="INFO"):
    print(f"[{level}]", *messages)

log("User", "logged in")
# [INFO] User logged in
```

#### **kwargs - 可变关键字参数

```python
def print_info(**kwargs):
    print(f"kwargs: {kwargs}")  # kwargs 是字典
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="link", age=25, city="深圳")
# kwargs: {'name': 'link', 'age': 25, 'city': '深圳'}
# name: link
# age: 25
# city: 深圳

# 实际应用
def create_user(username, **options):
    user = {"username": username}
    user.update(options)
    return user

user = create_user("link", age=25, city="深圳")
# {'username': 'link', 'age': 25, 'city': '深圳'}
```

#### 组合使用

```python
# 标准参数顺序
def func(a, b, *args, default=10, **kwargs):
    print(f"a={a}, b={b}")
    print(f"args={args}")
    print(f"default={default}")
    print(f"kwargs={kwargs}")

func(1, 2, 3, 4, 5, default=20, x=100, y=200)
# a=1, b=2
# args=(3, 4, 5)
# default=20
# kwargs={'x': 100, 'y': 200}
```

### 5. 完整对照表

| 用法 | 说明 | 示例 |
| :--- | :--- | :--- |
| `*` 乘法 | 数字相乘 | `3 * 4` → `12` |
| `*` 重复 | 序列重复 | `"ha" * 3` → `"hahaha"` |
| `**` 幂运算 | 指数 | `2 ** 3` → `8` |
| `*var` 解包赋值 | 收集剩余元素 | `first, *rest = [1,2,3]` |
| `*list` 序列解包 | 展开序列 | `[*list1, *list2]` |
| `*args` 函数调用 | 传递位置参数 | `func(*args)` |
| `**dict` 字典解包 | 展开字典 | `{**dict1, **dict2}` |
| `**kwargs` 函数调用 | 传递关键字参数 | `func(**kwargs)` |
| `*args` 函数定义 | 接收可变位置参数 | `def f(*args)` |
| `**kwargs` 函数定义 | 接收可变关键字参数 | `def f(**kwargs)` |

---

## 六、类型转换

```python
# 列表 ↔ 元组
list([1, 2, 3])    → [1, 2, 3]
tuple([1, 2, 3])   → (1, 2, 3)

# 列表/元组 → 集合（去重）
set([1, 2, 2, 3])  → {1, 2, 3}

# 集合 → 列表
list({1, 2, 3})    → [1, 2, 3]

# 字典 → 列表
d = {"a": 1, "b": 2}
list(d.keys())     → ['a', 'b']
list(d.values())   → [1, 2]
list(d.items())    → [('a', 1), ('b', 2)]

# 字符串 → 列表
list("hello")      → ['h', 'e', 'l', 'l', 'o']

# 列表 → 字符串
''.join(['h', 'e', 'l', 'l', 'o'])  → "hello"
```

---

## 七、性能对比

### 时间复杂度

| 操作 | 列表 | 元组 | 字典 | 集合 |
| :--- | :--- | :--- | :--- | :--- |
| 索引访问 | O(1) | O(1) | - | - |
| 查找元素 | O(n) | O(n) | O(1) | O(1) |
| 添加元素 | O(1) | - | O(1) | O(1) |
| 删除元素 | O(n) | - | O(1) | O(1) |
| 插入元素 | O(n) | - | O(1) | O(1) |
| 遍历 | O(n) | O(n) | O(n) | O(n) |

### 内存占用

```python
import sys

lst = [1, 2, 3, 4, 5]
tup = (1, 2, 3, 4, 5)
dct = {i: i for i in range(5)}
st = {1, 2, 3, 4, 5}

sys.getsizeof(lst)  # 约 120 字节
sys.getsizeof(tup)  # 约 80 字节（元组更省空间）
sys.getsizeof(dct)  # 约 240 字节（字典最占空间）
sys.getsizeof(st)   # 约 224 字节
```

### 选择建议

```python
# 查找频繁 → 字典/集合（O(1)查找）
if item in big_set:  # 快
    pass

if item in big_list:  # 慢（O(n)）
    pass

# 保持顺序 → 列表/元组
# 需要去重 → 集合
# 键值映射 → 字典
# 不可变 → 元组
```

---

## 八、常见陷阱

### 陷阱1：可变对象作为默认参数

```python
# ❌ 错误
def add_item(item, lst=[]):
    lst.append(item)
    return lst

add_item(1)  # [1]
add_item(2)  # [1, 2]（默认参数被所有调用共享！）

# ✅ 正确
def add_item(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst
```

### 陷阱2：列表重复创建引用

```python
# ❌ 错误
matrix = [[0] * 3] * 3
matrix[0][0] = 1
print(matrix)  # [[1, 0, 0], [1, 0, 0], [1, 0, 0]]（所有行都变了！）

# ✅ 正确
matrix = [[0] * 3 for _ in range(3)]
matrix[0][0] = 1
print(matrix)  # [[1, 0, 0], [0, 0, 0], [0, 0, 0]]
```

### 陷阱3：字典遍历时修改

```python
# ❌ 错误
d = {"a": 1, "b": 2, "c": 3}
for key in d:
    if key == "b":
        del d[key]  # RuntimeError: dictionary changed size during iteration

# ✅ 正确
d = {"a": 1, "b": 2, "c": 3}
for key in list(d.keys()):  # 先转成列表
    if key == "b":
        del d[key]
```

### 陷阱4：浅拷贝 vs 深拷贝

```python
# 浅拷贝：只复制第一层
original = [[1, 2], [3, 4]]
copy = original.copy()
copy[0][0] = 99
print(original)  # [[99, 2], [3, 4]]（原列表也变了！）

# 深拷贝：完全独立
import copy
original = [[1, 2], [3, 4]]
deep = copy.deepcopy(original)
deep[0][0] = 99
print(original)  # [[1, 2], [3, 4]]（原列表不变）
```

---

## 九、实战示例

### 示例1：统计单词频率

```python
text = "apple banana apple cherry banana apple"
words = text.split()

# 方式1：字典
count = {}
for word in words:
    count[word] = count.get(word, 0) + 1
print(count)  # {'apple': 3, 'banana': 2, 'cherry': 1}

# 方式2：defaultdict
from collections import defaultdict
count = defaultdict(int)
for word in words:
    count[word] += 1

# 方式3：Counter
from collections import Counter
count = Counter(words)
print(count.most_common(2))  # [('apple', 3), ('banana', 2)]
```

### 示例2：去重并排序

```python
nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]

# 去重并排序
result = sorted(set(nums))
# [1, 2, 3, 4, 5, 6, 9]
```

### 示例3：合并配置

```python
# 默认配置
default = {
    "host": "localhost",
    "port": 8080,
    "debug": False,
    "timeout": 30
}

# 用户配置
user = {
    "port": 3000,
    "debug": True
}

# 合并（用户配置优先）
config = {**default, **user}
# {'host': 'localhost', 'port': 3000, 'debug': True, 'timeout': 30}
```

### 示例4：找共同元素和差异

```python
set1 = {1, 2, 3, 4, 5}
set2 = {4, 5, 6, 7, 8}

common = set1 & set2        # {4, 5}（交集）
only_in_1 = set1 - set2     # {1, 2, 3}（差集）
only_in_2 = set2 - set1     # {6, 7, 8}
all_unique = set1 | set2    # {1, 2, 3, 4, 5, 6, 7, 8}（并集）
```

---

## 十、快速选择指南

```python
需要什么？                        用什么？

有序存储                      → 列表 list
通过索引访问                  → 列表 list
需要增删改                    → 列表 list

数据不变                      → 元组 tuple
函数返回多个值                → 元组 tuple
做字典的键                    → 元组 tuple

键值对映射                    → 字典 dict
快速查找值                    → 字典 dict
配置管理                      → 字典 dict

去重                          → 集合 set
快速查找元素是否存在          → 集合 set
数学集合运算                  → 集合 set
```

---

## 参考资源

- Python官方文档：https://docs.python.org/zh-cn/3/
- 数据结构教程：https://docs.python.org/zh-cn/3/tutorial/datastructures.html
- collections模块：https://docs.python.org/zh-cn/3/library/collections.html

---

*最后更新: 2025-11-09*
