# Python 扩展数据结构速查手册

## 学习信息

- **撰写日期**: 2025-11-09
- **Python版本**: 3.13
- **前置知识**: Python四大基础数据结构（list, tuple, dict, set）
- **学习状态**: 待学习（速查参考）

---

## 使用说明

本文档是**四大基础数据结构**之外的扩展数据结构速查手册。

**学习策略**：
- ✅ 先掌握四大基础：list, tuple, dict, set
- 📖 本文档作为参考：了解有哪些扩展工具
- 🎯 按需学习：遇到特定场景时再深入

---

## 数据结构分类

```
内置类型：
  - frozenset      不可变集合
  - range          范围对象
  - bytes/bytearray 字节序列

collections 模块（重点）：
  - deque          双端队列
  - namedtuple     命名元组
  - Counter        计数器
  - defaultdict    默认字典
  - OrderedDict    有序字典
  - ChainMap       链式映射

专用场景：
  - heapq          堆队列（优先队列）
  - queue          线程安全队列
  - array          数组
```

---

## 一、内置类型

### frozenset（不可变集合）

**用途**：set的不可变版本，可以作为字典的键

```python
# 创建
fs = frozenset([1, 2, 3, 4])

# 不可变
# fs.add(5)  # ❌ AttributeError

# 可以做字典的键（普通set不行）
locations = {
    frozenset([1, 2]): "位置A",
    frozenset([3, 4]): "位置B",
}

# 集合运算
a = frozenset([1, 2, 3])
b = frozenset([2, 3, 4])
a | b  # frozenset({1, 2, 3, 4})（并集）
a & b  # frozenset({2, 3})（交集）
```

**何时使用**：
- 需要不可变集合
- 集合作为字典的键
- 集合作为另一个集合的元素

---

### range（范围对象）

**用途**：懒加载的数字序列，节省内存

```python
# 创建
r = range(10)        # 0到9
r = range(1, 10)     # 1到9
r = range(0, 10, 2)  # 0, 2, 4, 6, 8

# 懒加载（不占内存）
r = range(1000000)   # 几乎不占内存

# 常用操作
len(r)       # 长度
5 in r       # 成员检查
r[3]         # 索引访问
list(r)      # 转换为列表

# 倒序
range(10, 0, -1)  # 10, 9, 8, ..., 1
```

**何时使用**：
- for循环遍历数字范围
- 需要大范围数字但不想占内存
- 生成等差数列

---

### bytes / bytearray（字节序列）

**用途**：处理二进制数据

```python
# bytes（不可变）
b = b"hello"
b = bytes([65, 66, 67])  # b'ABC'
b = "你好".encode('utf-8')  # 字符串转字节

# bytearray（可变）
ba = bytearray(b"hello")
ba[0] = 72  # bytearray(b'Hello')

# 转换
b.decode('utf-8')  # 字节转字符串
```

**何时使用**：
- 网络传输数据
- 文件读写（二进制模式）
- 加密解密
- 图片/音频等二进制处理

---

## 二、collections 模块

### deque（双端队列）

**用途**：两端都能高效增删的队列

```python
from collections import deque

# 创建
dq = deque([1, 2, 3])
dq = deque([1, 2, 3], maxlen=5)  # 限制最大长度

# 两端操作（O(1)时间复杂度）
dq.append(4)        # 右端添加
dq.appendleft(0)    # 左端添加
dq.pop()            # 右端删除
dq.popleft()        # 左端删除

# 旋转
dq.rotate(2)        # 右旋2位
dq.rotate(-2)       # 左旋2位
```

**何时使用**：
- 队列（FIFO）
- 栈（LIFO）
- 频繁在两端增删元素
- 固定长度的滑动窗口

**性能对比**：
```python
操作            list      deque
左端插入        O(n)      O(1)  ← deque优势
右端插入        O(1)      O(1)
随机访问        O(1)      O(n)  ← list优势
```

---

### namedtuple（命名元组）

**用途**：带字段名的元组，提高代码可读性

```python
from collections import namedtuple

# 定义
Point = namedtuple('Point', ['x', 'y'])
User = namedtuple('User', 'name age email')

# 创建
p = Point(10, 20)
user = User("link", 25, "link@example.com")

# 访问
p.x          # 10（字段名）
p[0]         # 10（索引）

# 不可变
# p.x = 100  # ❌ AttributeError

# 转换
p._asdict()      # {'x': 10, 'y': 20}
p._replace(x=30) # Point(x=30, y=20)
```

**何时使用**：
- 数据记录（比普通元组更清晰）
- 函数返回多个值
- 轻量级数据类（比class简单）
- CSV/数据库查询结果

---

### Counter（计数器）

**用途**：专门用于计数的字典

```python
from collections import Counter

# 创建
words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
count = Counter(words)
# Counter({'apple': 3, 'banana': 2, 'cherry': 1})

# 最常见的N个
count.most_common(2)  # [('apple', 3), ('banana', 2)]

# 访问（不存在返回0，不报错）
count["apple"]  # 3
count["xxx"]    # 0

# 更新
count.update(["apple", "date"])

# 数学运算
c1 + c2  # 相加
c1 - c2  # 相减
c1 & c2  # 取最小
c1 | c2  # 取最大
```

**何时使用**：
- 词频统计
- 投票计数
- 元素频率分析
- Top N 问题

---

### defaultdict（默认字典）

**用途**：访问不存在的键时，自动创建默认值

```python
from collections import defaultdict

# 创建（指定默认值工厂函数）
dd = defaultdict(int)      # 默认值0
dd = defaultdict(list)     # 默认值[]
dd = defaultdict(set)      # 默认值set()
dd = defaultdict(lambda: "N/A")  # 自定义

# 自动创建
dd = defaultdict(int)
dd["apple"] += 1  # ✅ 不报错，自动创建键
# defaultdict(<class 'int'>, {'apple': 1})

# 实际应用：分组
groups = defaultdict(list)
for name, subject in students:
    groups[subject].append(name)
```

**何时使用**：
- 避免检查键是否存在
- 分组操作
- 累加计数
- 构建图（邻接表）

**对比普通字典**：
```python
# 普通字典
groups = {}
groups[key] = groups.get(key, [])  # 繁琐
groups[key].append(value)

# defaultdict
groups = defaultdict(list)
groups[key].append(value)  # 简洁
```

---

### OrderedDict（有序字典）

**用途**：保持插入顺序的字典

```python
from collections import OrderedDict

# 创建
od = OrderedDict()
od['a'] = 1
od['b'] = 2
od['c'] = 3

# 移动到末尾
od.move_to_end('a')  # OrderedDict([('b', 2), ('c', 3), ('a', 1)])

# 删除最后/最前
od.popitem(last=True)   # 删除最后
od.popitem(last=False)  # 删除最前
```

**注意**：
- Python 3.7+ 普通dict已经保证插入顺序
- OrderedDict现在主要用于 `move_to_end()` 等特殊操作

**何时使用**：
- LRU缓存实现
- 需要调整元素顺序
- 兼容旧版本Python（3.6-）

---

### ChainMap（链式映射）

**用途**：将多个字典链接成一个视图

```python
from collections import ChainMap

# 创建
default = {"host": "localhost", "port": 8080}
user = {"port": 3000}
config = ChainMap(user, default)

# 查找（按顺序在各字典中查找）
config["port"]  # 3000（user中有）
config["host"]  # "localhost"（从default取）

# 修改（只修改第一个字典）
config["debug"] = True
# user: {'port': 3000, 'debug': True}
# default: 不变

# 添加新字典
config = config.new_child({"timeout": 30})
```

**何时使用**：
- 配置优先级管理
- 作用域链（变量查找）
- 多层配置合并

---

## 三、专用数据结构

### heapq（堆队列 / 优先队列）

**用途**：最小堆实现，快速获取最小值

```python
import heapq

# 创建堆
heap = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappush(heap, 5)
# [1, 3, 5]

# 弹出最小值
heapq.heappop(heap)  # 1

# 直接转换为堆
nums = [3, 1, 5, 2, 4]
heapq.heapify(nums)  # 原地转换

# Top K 问题
heapq.nlargest(3, nums)   # [5, 4, 3]（最大3个）
heapq.nsmallest(3, nums)  # [1, 2, 3]（最小3个）
```

**何时使用**：
- 优先队列
- Top K 问题
- 任务调度（优先级）
- 合并K个有序列表

**时间复杂度**：
```python
操作          时间复杂度
插入          O(log n)
弹出最小值    O(log n)
查看最小值    O(1)
```

---

### queue（线程安全队列）

**用途**：多线程环境下的队列

```python
from queue import Queue, LifoQueue, PriorityQueue

# FIFO队列（先进先出）
q = Queue()
q.put(1)
q.put(2)
q.get()  # 1

# LIFO队列（后进先出，栈）
s = LifoQueue()
s.put(1)
s.put(2)
s.get()  # 2

# 优先队列
pq = PriorityQueue()
pq.put((5, "低优先级"))
pq.put((1, "高优先级"))
pq.get()  # (1, "高优先级")
```

**何时使用**：
- 多线程生产者-消费者模式
- 线程间通信
- 任务队列

**注意**：
- 单线程用 `collections.deque`（更快）
- 多线程用 `queue.Queue`（线程安全）

---

### array（数组）

**用途**：C风格的固定类型数组，节省内存

```python
from array import array

# 创建（指定类型码）
arr = array('i', [1, 2, 3, 4])  # 'i' = 有符号整数
arr = array('d', [1.0, 2.5, 3.7])  # 'd' = 浮点数

# 操作（和列表类似）
arr.append(5)
arr.extend([6, 7])
arr[0] = 10

# 优势：内存占用小
```

**常用类型码**：
```python
'b'  有符号字节
'i'  有符号整数
'd'  双精度浮点数
'u'  Unicode字符
```

**何时使用**：
- 大量同类型数值数据
- 需要节省内存
- 与C代码交互

**对比列表**：
```python
list:  灵活，可存任意类型，占内存多
array: 固定类型，占内存少，速度快
```

---

## 四、快速选择指南

```python
场景                          推荐数据结构

两端频繁增删                → deque
固定长度滑动窗口            → deque(maxlen=N)
队列（先进先出）            → deque / queue.Queue
栈（后进先出）              → list / deque

带字段名的数据              → namedtuple
轻量级数据类                → namedtuple

计数/频率统计               → Counter
Top K 问题                  → Counter.most_common() / heapq

自动默认值                  → defaultdict
分组操作                    → defaultdict(list)

配置优先级                  → ChainMap

优先队列                    → heapq / queue.PriorityQueue
Top K 问题                  → heapq.nlargest/nsmallest
任务调度                    → heapq

线程安全队列                → queue.Queue
多线程通信                  → queue.Queue

不可变集合（做字典键）      → frozenset
数字范围                    → range
二进制数据                  → bytes/bytearray
大量同类型数值              → array
```

---

## 五、实战场景示例

### 场景1：LRU缓存

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity

    def get(self, key):
        if key not in self.cache:
            return None
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
```

### 场景2：最近N条日志

```python
from collections import deque

# 自动保留最新100条
recent_logs = deque(maxlen=100)

for log in logs:
    recent_logs.append(log)  # 自动淘汰最旧的
```

### 场景3：词频统计Top 10

```python
from collections import Counter

text = "apple banana apple cherry banana apple orange..."
words = text.split()
top10 = Counter(words).most_common(10)
```

### 场景4：按学科分组学生

```python
from collections import defaultdict

students = [("Alice", "Math"), ("Bob", "Math"), ...]
groups = defaultdict(list)

for name, subject in students:
    groups[subject].append(name)
```

### 场景5：配置优先级

```python
from collections import ChainMap

# 命令行参数 > 环境变量 > 配置文件 > 默认值
config = ChainMap(cli_args, env_vars, config_file, defaults)
```

---

## 六、性能对比表

| 操作 | list | deque | dict | Counter | heapq |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 左端插入 | O(n) | O(1) | - | - | - |
| 右端插入 | O(1) | O(1) | O(1) | O(1) | O(log n) |
| 查找 | O(n) | O(n) | O(1) | O(1) | O(n) |
| 获取最小值 | O(n) | O(n) | O(n) | O(n) | O(1) |
| 删除最小值 | O(n) | O(n) | - | - | O(log n) |

---

## 七、学习路线建议

### 优先级分级

```python
基础必学（已掌握）：
  list, tuple, dict, set

进阶推荐（按需学习）：
  ★★★ deque          日常开发常用
  ★★★ Counter        数据统计常用
  ★★★ defaultdict    简化代码常用
  ★★☆ namedtuple     提高可读性
  ★★☆ heapq          算法题常用
  ★☆☆ ChainMap       配置管理
  ★☆☆ OrderedDict    特定场景

了解即可：
  frozenset, range, bytes, array, queue
```

### 学习方式

1. **遇到问题时学习** - 不要一次性全学
2. **看场景示例** - 理解适用场景
3. **动手实践** - 写小例子验证
4. **查阅本文档** - 快速回顾语法

---

## 八、导入速查

```python
# 内置类型（无需导入）
frozenset, range, bytes, bytearray

# collections 模块
from collections import deque
from collections import namedtuple
from collections import Counter
from collections import defaultdict
from collections import OrderedDict
from collections import ChainMap

# 堆队列
import heapq

# 线程安全队列
from queue import Queue, LifoQueue, PriorityQueue

# 数组
from array import array
```

---

## 参考资源

- Python官方文档：https://docs.python.org/zh-cn/3/
- collections模块：https://docs.python.org/zh-cn/3/library/collections.html
- heapq模块：https://docs.python.org/zh-cn/3/library/heapq.html
- queue模块：https://docs.python.org/zh-cn/3/library/queue.html

---

*最后更新: 2025-11-09*
*学习状态: 待学习 - 作为速查参考*
