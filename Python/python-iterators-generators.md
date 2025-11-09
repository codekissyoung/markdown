# Python 迭代器与生成器完全指南

**学习日期**: 2025-11-09
**前置知识**: Python 函数基础、作用域
**对比语言**: Go、JavaScript、Rust
**核心问题**: 如何高效遍历数据？生成器为什么省内存？

---

## 核心概念速览

```
可迭代对象（Iterable）
    ↓ 调用 iter()
迭代器（Iterator）
    ↓ 简化实现方式
生成器（Generator）
```

**三者关系**：
- **可迭代对象**：实现了 `__iter__()` 方法，可以被 `for` 循环
- **迭代器**：实现了 `__iter__()` + `__next__()` 方法，记住遍历位置
- **生成器**：使用 `yield` 的函数，自动实现迭代器协议

**一句话总结**：生成器是迭代器，迭代器来自可迭代对象。

---

## 一、可迭代对象（Iterable）

### 什么是可迭代对象？

**定义**：实现了 `__iter__()` 方法的对象，能返回迭代器。

```python
# Python 内置的可迭代对象
lst = [1, 2, 3]        # list
tup = (1, 2, 3)        # tuple
dct = {"a": 1}         # dict
st = {1, 2, 3}         # set
s = "hello"            # str

# 都可以用 for 循环
for item in lst:
    print(item)
```

### for 循环的本质

```python
lst = [1, 2, 3]

# for 循环的实际执行过程
for item in lst:
    print(item)

# 等价于
iterator = iter(lst)  # 调用 lst.__iter__()
while True:
    try:
        item = next(iterator)  # 调用 iterator.__next__()
        print(item)
    except StopIteration:
        break
```

**关键步骤**：
1. `iter(obj)` 获取迭代器
2. 反复调用 `next(iterator)` 获取下一个值
3. 捕获 `StopIteration` 异常结束循环

### 自定义可迭代对象

```python
class MyRange:
    """自定义范围类"""
    def __init__(self, start, end):
        self.start = start
        self.end = end

    def __iter__(self):
        """返回迭代器对象"""
        return MyRangeIterator(self.start, self.end)

class MyRangeIterator:
    """配套的迭代器"""
    def __init__(self, start, end):
        self.current = start
        self.end = end

    def __iter__(self):
        return self

    def __next__(self):
        if self.current < self.end:
            value = self.current
            self.current += 1
            return value
        else:
            raise StopIteration

# 使用
for num in MyRange(1, 5):
    print(num)  # 1, 2, 3, 4
```

**问题**：需要写两个类，太繁琐。**生成器可以简化这个过程**（后面讲）。

---

## 二、迭代器（Iterator）

### 什么是迭代器？

**定义**：实现了 `__iter__()` 和 `__next__()` 方法的对象。

```python
class Counter:
    """简单的计数器迭代器"""
    def __init__(self, max_num):
        self.max_num = max_num
        self.current = 0

    def __iter__(self):
        """返回迭代器对象本身"""
        return self

    def __next__(self):
        """返回下一个值"""
        if self.current < self.max_num:
            self.current += 1
            return self.current
        else:
            raise StopIteration  # 迭代结束信号

# 使用
counter = Counter(3)
print(next(counter))  # 1
print(next(counter))  # 2
print(next(counter))  # 3
print(next(counter))  # StopIteration 异常
```

### 迭代器协议

```python
# 迭代器必须实现的两个方法
class MyIterator:
    def __iter__(self):
        """返回迭代器对象本身"""
        return self

    def __next__(self):
        """返回下一个值，结束时抛出 StopIteration"""
        if 有下一个值:
            return 下一个值
        else:
            raise StopIteration
```

### 可迭代对象 vs 迭代器

```python
# list 是可迭代对象，但不是迭代器
lst = [1, 2, 3]

# 获取迭代器
iterator = iter(lst)

# 迭代器记住了遍历位置
print(next(iterator))  # 1
print(next(iterator))  # 2

# list 本身可以多次遍历
for x in lst:
    print(x)  # 1, 2, 3
for x in lst:
    print(x)  # 1, 2, 3  ← 可以再次遍历

# 迭代器只能遍历一次（已耗尽）
for x in iterator:
    print(x)  # 3  ← 只剩最后一个元素
for x in iterator:
    pass  # 什么都不输出，迭代器已耗尽
```

**关键区别**：

| 类型 | 实现方法 | 是否记住位置 | 可重复遍历 |
|:-----|:---------|:-------------|:-----------|
| **可迭代对象** | `__iter__()` | ❌ | ✅ |
| **迭代器** | `__iter__()` + `__next__()` | ✅ | ❌ |

**记忆公式**：
- 可迭代对象 = 数据容器（list、tuple、dict 等）
- 迭代器 = 遍历指针（记住当前位置）

### 手动实现 range

```python
class MyRange:
    """自定义 range 迭代器"""
    def __init__(self, start, end, step=1):
        self.current = start
        self.end = end
        self.step = step

    def __iter__(self):
        return self

    def __next__(self):
        if self.current < self.end:
            value = self.current
            self.current += self.step
            return value
        else:
            raise StopIteration

# 使用
for num in MyRange(0, 10, 2):
    print(num)  # 0, 2, 4, 6, 8
```

**问题**：手动实现迭代器需要：
1. 定义类
2. 管理状态（`self.current`）
3. 处理边界条件
4. 抛出 `StopIteration`

**解决方案**：用生成器自动化这些步骤。

---

## 三、生成器（Generator）

### 什么是生成器？

**定义**：使用 `yield` 关键字的函数，自动实现迭代器协议。

```python
# 用生成器函数实现 Counter（对比上面的迭代器类）
def counter(max_num):
    current = 0
    while current < max_num:
        current += 1
        yield current  # 暂停并返回值

# 使用（完全相同）
for num in counter(3):
    print(num)  # 1, 2, 3
```

**代码对比**：

```python
# ❌ 手动实现迭代器：15 行
class Counter:
    def __init__(self, max_num):
        self.max_num = max_num
        self.current = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.current < self.max_num:
            self.current += 1
            return self.current
        else:
            raise StopIteration

# ✅ 生成器：5 行
def counter(max_num):
    current = 0
    while current < max_num:
        current += 1
        yield current
```

**结论**：生成器是实现迭代器的**语法糖**。

### `yield` 的工作原理

```python
def simple_generator():
    print("第一次执行")
    yield 1
    print("第二次执行")
    yield 2
    print("第三次执行")
    yield 3
    print("函数结束")

# 调用生成器函数，返回生成器对象（此时不执行）
gen = simple_generator()
print(type(gen))  # <class 'generator'>

# 第一次调用 next()
print(next(gen))
# 输出:
# 第一次执行
# 1  ← yield 返回

# 第二次调用 next()
print(next(gen))
# 输出:
# 第二次执行
# 2  ← yield 返回

# 第三次调用 next()
print(next(gen))
# 输出:
# 第三次执行
# 3  ← yield 返回

# 第四次调用 next()
print(next(gen))
# 输出:
# 函数结束
# StopIteration 异常
```

**执行流程**：

```
调用生成器函数
    ↓
返回生成器对象（函数体不执行）
    ↓
第一次 next() → 执行到第一个 yield → 暂停返回值
    ↓
第二次 next() → 从上次暂停处继续 → 执行到第二个 yield → 暂停返回值
    ↓
...
    ↓
最后一次 next() → 函数执行完毕 → 抛出 StopIteration
```

**关键点**：
1. 调用生成器函数返回生成器对象，**不立即执行**
2. 每次 `next()` 执行到 `yield`，**暂停并返回值**
3. 下次 `next()` 从上次暂停的地方**继续执行**
4. 函数结束时自动抛出 `StopIteration`

### 生成器的本质

```python
def counter(n):
    for i in range(n):
        yield i

# 生成器对象
gen = counter(3)

# 生成器是迭代器
print(hasattr(gen, '__iter__'))  # True
print(hasattr(gen, '__next__'))  # True

# 可以用 iter() 和 next()
iterator = iter(gen)  # 返回自己
print(next(iterator))  # 0
print(next(iterator))  # 1
```

**验证**：生成器自动实现了迭代器协议。

---

## 四、生成器的优势

### 1. 内存效率（最重要）

```python
# ❌ 列表：占用大量内存
def get_squares_list(n):
    result = []
    for i in range(n):
        result.append(i ** 2)
    return result

numbers = get_squares_list(1000000)  # 立即创建 100 万个元素
print(numbers[0])  # 访问第一个元素

# ✅ 生成器：惰性求值
def get_squares_gen(n):
    for i in range(n):
        yield i ** 2

numbers = get_squares_gen(1000000)  # 只创建生成器对象，几乎不占内存
print(next(numbers))  # 只计算第一个元素
```

**内存对比**：

```python
import sys

# 列表推导式
lst = [x**2 for x in range(1000000)]
print(sys.getsizeof(lst))  # ~8 MB

# 生成器表达式
gen = (x**2 for x in range(1000000))
print(sys.getsizeof(gen))  # ~200 bytes
```

**差异**：列表需要立即分配内存存储所有元素，生成器只存储算法。

### 2. 支持无限序列

```python
# 斐波那契数列（无限）
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# 使用
fib = fibonacci()
for _ in range(10):
    print(next(fib))  # 0, 1, 1, 2, 3, 5, 8, 13, 21, 34

# 列表无法做到
# lst = [所有斐波那契数]  ← 不可能
```

### 3. 流水线处理

```python
# 读取 → 过滤 → 转换
def read_file(path):
    """生成器：逐行读取"""
    with open(path) as f:
        for line in f:
            yield line.strip()

def filter_errors(lines):
    """生成器：过滤错误行"""
    for line in lines:
        if "ERROR" in line:
            yield line

def extract_timestamp(lines):
    """生成器：提取时间戳"""
    for line in lines:
        yield line.split()[0]

# 链式调用（惰性求值，内存占用恒定）
timestamps = extract_timestamp(
    filter_errors(
        read_file("app.log")
    )
)

# 只在迭代时执行整个流水线
for ts in timestamps:
    print(ts)
```

**优势**：
- 每个生成器只处理当前元素，不存储中间结果
- 无论文件多大，内存占用恒定
- 可以处理无限数据流（网络流、日志流等）

---

## 五、生成器实战

### 1. 读取大文件

```python
# ❌ 一次性读取（内存爆炸）
def read_file(path):
    with open(path) as f:
        return f.readlines()  # 全部加载到内存

lines = read_file("10GB.log")  # 可能内存不足

# ✅ 用生成器（逐行读取）
def read_file(path):
    with open(path) as f:
        for line in f:
            yield line.strip()

for line in read_file("10GB.log"):
    process(line)  # 每次只处理一行，内存恒定
```

### 2. 数据分页

```python
def paginate(data, page_size):
    """将数据分页"""
    for i in range(0, len(data), page_size):
        yield data[i:i + page_size]

# 使用
users = list(range(1, 101))  # 100 个用户

for page in paginate(users, 10):
    print(f"处理第 {len(page)} 个用户: {page}")
    # API 请求、数据库写入等
```

### 3. 树的遍历

```python
class TreeNode:
    def __init__(self, value, children=None):
        self.value = value
        self.children = children or []

def traverse(node):
    """生成器：深度优先遍历"""
    yield node.value
    for child in node.children:
        yield from traverse(child)  # 递归生成

# 构建树
root = TreeNode(1, [
    TreeNode(2, [TreeNode(4), TreeNode(5)]),
    TreeNode(3, [TreeNode(6)])
])

# 遍历
for value in traverse(root):
    print(value)  # 1, 2, 4, 5, 3, 6
```

**`yield from` 语法**：
```python
# yield from iterable 等价于
for item in iterable:
    yield item
```

### 4. 批量处理

```python
def batch_process(items, batch_size):
    """批量处理数据"""
    batch = []
    for item in items:
        batch.append(item)
        if len(batch) == batch_size:
            yield batch
            batch = []

    # 处理剩余数据
    if batch:
        yield batch

# 使用
data = range(1, 26)  # 25 个元素

for batch in batch_process(data, 10):
    print(f"批量大小: {len(batch)}, 数据: {list(batch)}")
# 输出:
# 批量大小: 10, 数据: [1, 2, ..., 10]
# 批量大小: 10, 数据: [11, 12, ..., 20]
# 批量大小: 5, 数据: [21, 22, 23, 24, 25]
```

### 5. 模拟数据流

```python
import time
import random

def sensor_data():
    """模拟传感器数据流（无限）"""
    while True:
        temperature = random.uniform(20, 30)
        yield temperature
        time.sleep(0.1)  # 模拟采样间隔

# 使用
sensor = sensor_data()
for _ in range(10):
    temp = next(sensor)
    print(f"温度: {temp:.2f}°C")
```

---

## 六、生成器表达式

### 语法

```python
# 列表推导式
lst = [x**2 for x in range(10)]

# 生成器表达式（只改括号）
gen = (x**2 for x in range(10))
```

**对比**：

| 类型 | 语法 | 返回 | 内存 |
|:-----|:-----|:-----|:-----|
| 列表推导式 | `[...]` | list | 立即分配 |
| 生成器表达式 | `(...)` | generator | 惰性求值 |

### 使用场景

```python
# ✅ 只遍历一次：用生成器表达式
sum(x**2 for x in range(1000000))  # 不需要存储列表

# ✅ 需要多次访问：用列表推导式
squares = [x**2 for x in range(10)]
print(squares[0])
print(squares[5])

# ❌ 生成器不能多次访问
gen = (x**2 for x in range(10))
print(list(gen))  # [0, 1, 4, 9, ..., 81]
print(list(gen))  # []  ← 已耗尽
```

### 传递给函数

```python
# 生成器表达式作为参数，可以省略括号
sum((x**2 for x in range(10)))  # 带括号
sum(x**2 for x in range(10))    # 省略括号（推荐）

max(x for x in range(10) if x % 2 == 0)  # 4
any(x > 5 for x in range(10))            # True
```

---

## 七、生成器的高级特性

### 1. `send()` 方法：双向通信

```python
def echo_generator():
    value = None
    while True:
        # yield 既返回值，也接收值
        value = yield value

gen = echo_generator()
next(gen)  # 启动生成器（必须先调用一次）

print(gen.send(1))  # 发送 1，返回 1
print(gen.send(2))  # 发送 2，返回 2
print(gen.send(3))  # 发送 3，返回 3
```

**应用场景**：协程（旧式，现在推荐 `async`/`await`）

### 2. `close()` 方法：关闭生成器

```python
def counter():
    try:
        i = 0
        while True:
            i += 1
            yield i
    except GeneratorExit:
        print("生成器被关闭")

gen = counter()
print(next(gen))  # 1
print(next(gen))  # 2
gen.close()       # 关闭生成器
# 输出: 生成器被关闭
print(next(gen))  # StopIteration
```

### 3. `throw()` 方法：向生成器抛出异常

```python
def robust_generator():
    try:
        while True:
            value = yield
            print(f"接收到: {value}")
    except ValueError as e:
        print(f"捕获异常: {e}")
        yield "错误处理完毕"

gen = robust_generator()
next(gen)  # 启动
gen.send(1)  # 接收到: 1
gen.throw(ValueError, "测试异常")  # 捕获异常: 测试异常
```

**实际用途**：很少使用，主要用于协程框架。

---

## 八、跨语言对比

### 迭代器协议

| 语言 | 协议/接口 | 方法 |
|:-----|:----------|:-----|
| **Python** | `__iter__()` + `__next__()` | `iter(obj)`, `next(it)` |
| **Go** | 无统一协议 | `for...range`，channel |
| **Java** | `Iterator` 接口 | `hasNext()`, `next()` |
| **JavaScript** | `Symbol.iterator` | `for...of`, `.next()` |
| **Rust** | `Iterator` trait | `.next()` |

### 生成器支持

| 语言 | 生成器 | 语法 | 示例 |
|:-----|:-------|:-----|:-----|
| **Python** | ✅ | `yield` | `def gen(): yield 1` |
| **JavaScript** | ✅ | `function*` + `yield` | `function* gen() { yield 1; }` |
| **C#** | ✅ | `yield return` | `IEnumerable<int> Gen() { yield return 1; }` |
| **Go** | ❌ | channel 模拟 | 见下方示例 |
| **Rust** | ❌ | 迭代器 + 闭包 | `.map(\|x\| x * 2)` |
| **PHP** | ✅ | `yield` | `function gen() { yield 1; }` |

### Go 的替代方案

**Python 生成器**：

```python
def counter(max_num):
    for i in range(max_num):
        yield i

for num in counter(5):
    print(num)
```

**Go 的 channel 模拟**：

```go
func counter(max int) <-chan int {
    ch := make(chan int)
    go func() {
        for i := 0; i < max; i++ {
            ch <- i  // 类似 yield
        }
        close(ch)
    }()
    return ch
}

// 使用
for num := range counter(5) {
    fmt.Println(num)
}
```

**差异**：
- Python 的 `yield` 是语言级特性，自动管理状态
- Go 需要手动创建 goroutine 和 channel，更底层但更灵活

### JavaScript 生成器

```javascript
// JavaScript 生成器函数
function* counter(max) {
    for (let i = 0; i < max; i++) {
        yield i;
    }
}

// 使用
const gen = counter(3);
console.log(gen.next());  // {value: 0, done: false}
console.log(gen.next());  // {value: 1, done: false}
console.log(gen.next());  // {value: 2, done: false}
console.log(gen.next());  // {value: undefined, done: true}

// for...of 循环
for (const num of counter(3)) {
    console.log(num);  // 0, 1, 2
}
```

**对比 Python**：
- Python 的 `next()` 返回值，结束抛异常
- JavaScript 的 `next()` 返回 `{value, done}` 对象

---

## 九、常见陷阱

### 1. 生成器只能迭代一次

```python
gen = (x**2 for x in range(5))

# 第一次迭代
print(list(gen))  # [0, 1, 4, 9, 16]

# 第二次迭代（已耗尽）
print(list(gen))  # []

# ✅ 需要重新创建
gen = (x**2 for x in range(5))
print(list(gen))  # [0, 1, 4, 9, 16]
```

### 2. 提前求值陷阱

```python
# ❌ 错误：循环变量被延迟绑定
funcs = [lambda: i for i in range(3)]
for f in funcs:
    print(f())  # 2, 2, 2  ← 错误！

# ✅ 正确：立即绑定参数
funcs = [lambda x=i: x for i in range(3)]
for f in funcs:
    print(f())  # 0, 1, 2

# 生成器没有这个问题（每次 yield 都是实时计算）
def gen():
    for i in range(3):
        yield lambda: i  # 同样的问题

funcs = list(gen())
for f in funcs:
    print(f())  # 2, 2, 2  ← 一样错误
```

### 3. 生成器表达式的括号

```python
# ✅ 正确：作为唯一参数时可以省略括号
sum(x**2 for x in range(10))

# ❌ 错误：多个参数时必须加括号
max(x for x in range(10), 5)  # SyntaxError

# ✅ 正确
max((x for x in range(10)), 5)
```

---

## 十、性能对比

### 内存占用

```python
import sys

n = 1000000

# 列表
lst = [x for x in range(n)]
print(f"列表大小: {sys.getsizeof(lst) / 1024 / 1024:.2f} MB")
# 输出: 列表大小: 8.00 MB

# 生成器
gen = (x for x in range(n))
print(f"生成器大小: {sys.getsizeof(gen)} bytes")
# 输出: 生成器大小: 200 bytes
```

### 执行时间

```python
import timeit

n = 1000000

# 列表推导式
def list_comp():
    return sum([x**2 for x in range(n)])

# 生成器表达式
def gen_expr():
    return sum(x**2 for x in range(n))

print(timeit.timeit(list_comp, number=10))  # ~1.2 秒
print(timeit.timeit(gen_expr, number=10))   # ~1.0 秒
```

**结论**：
- 内存：生成器完胜（差距上千倍）
- 速度：生成器略快（无需分配大块内存）

---

## 十一、设计建议

### 何时用列表？

```python
# ✅ 需要多次访问
squares = [x**2 for x in range(10)]
print(squares[0])
print(squares[5])
print(len(squares))

# ✅ 需要切片
print(squares[2:5])

# ✅ 需要排序/反转
squares.sort()
squares.reverse()
```

### 何时用生成器？

```python
# ✅ 只遍历一次
for item in (process(x) for x in huge_data):
    save(item)

# ✅ 数据量大（节省内存）
for line in read_file("10GB.log"):
    process(line)

# ✅ 无限序列
for num in fibonacci():
    if num > 1000:
        break

# ✅ 流水线处理
result = transform(
    filter_data(
        load_data("file.csv")
    )
)
```

### 决策树

```
需要多次访问元素？
├─ 是 → 用列表
└─ 否 → 数据量大？
    ├─ 是 → 用生成器
    └─ 否 → 需要切片/排序/len()？
        ├─ 是 → 用列表
        └─ 否 → 用生成器（更节省内存）
```

---

## 十二、总结

### 核心概念关系

```
可迭代对象（Iterable）
    ↓ 实现 __iter__()
    ↓ 例如：list, tuple, dict, set, str
    ↓
    ↓ iter(obj) 返回
    ↓
迭代器（Iterator）
    ↓ 实现 __iter__() + __next__()
    ↓ 记住遍历位置，只能遍历一次
    ↓
    ↓ 简化实现方式
    ↓
生成器（Generator）
    ↓ 使用 yield 关键字
    ↓ 自动实现迭代器协议
    ↓
    ↓ 表达式形式
    ↓
生成器表达式
    (x for x in iterable)
```

### 记忆公式

```python
# 迭代器：实现协议
class Iterator:
    def __iter__(self): return self
    def __next__(self): return value

# 生成器：使用 yield
def generator():
    yield value

# 生成器表达式：简写形式
gen = (value for item in iterable)
```

### 使用场景速查

| 场景 | 推荐方案 | 理由 |
|:-----|:---------|:-----|
| 小数据集，多次访问 | 列表推导式 | 可重复访问，支持索引 |
| 大数据集，一次遍历 | 生成器表达式 | 节省内存 |
| 复杂逻辑，逐步产出 | 生成器函数 | 代码清晰 |
| 无限序列 | 生成器函数 | 列表无法实现 |
| 文件/流处理 | 生成器函数 | 内存恒定 |
| 自定义遍历逻辑 | 迭代器类 | 完全控制 |

### 与其他概念的区别

**迭代器/生成器 vs 装饰器**：
- 迭代器/生成器：数据遍历工具
- 装饰器：函数增强工具（详见 `python-functions-guide.md`）

**完全不同的概念**，解决不同的问题。

---

## 延伸阅读

### 相关话题

1. **协程（Coroutines）**：基于生成器的异步编程（旧式），现在推荐 `async`/`await`
2. **迭代器模式**：设计模式中的经典模式，Python 内置支持
3. **惰性求值**：生成器的核心思想，函数式编程的重要概念

### 参考资料

- [PEP 255 – Simple Generators](https://www.python.org/dev/peps/pep-0255/)
- [PEP 289 – Generator Expressions](https://www.python.org/dev/peps/pep-0289/)
- [PEP 342 – Coroutines via Enhanced Generators](https://www.python.org/dev/peps/pep-0342/)
- [Iterators and Generators - Python Documentation](https://docs.python.org/3/tutorial/classes.html#iterators)

---

**最后提醒**：
- 生成器是迭代器的语法糖
- 大部分情况下，生成器表达式优于列表推导式（除非需要多次访问）
- `yield` 是 Python 最强大的特性之一，掌握它可以写出高效、优雅的代码
