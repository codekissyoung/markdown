# Python 基础语法速查手册

## 1. 数字类型

### 三种数字类型

| 类型 | 说明 | 示例 |
| :--- | :--- | :--- |
| `int` | 任意精度整数（无上限） | `10 ** 100` |
| `float` | 双精度浮点数 | `3.14` |
| `complex` | 复数 | `3 + 4j` |

### 进制表示

```python
a = 42        # 十进制
b = 0b101010  # 二进制（0b前缀）
c = 0o52      # 八进制（0o前缀）
d = 0x2A      # 十六进制（0x前缀）
# 四个变量值相同，都是42
```

### 除法运算

```python
10 / 3   # 3.333...  （总是返回float）
10 // 3  # 3          （整数除法，向下取整）
10 % 3   # 1          （取余）
10 ** 3  # 1000       （幂运算）

# 注意：// 是向下取整
-10 // 3  # -4 （不是-3）
```

---

## 2. 字符串

### 核心特性

**不可变序列** - 创建后不能修改：

```python
s = "hello"
s[0] = "H"  # ❌ 报错：'str' object does not support item assignment

# 正确做法：创建新字符串
s = "H" + s[1:]  # "Hello"
```

### 三种引号

```python
s1 = 'single'
s2 = "double"
s3 = '''多行
字符串'''  # 保留换行符
```

### 原始字符串

```python
path = r"C:\new\test.txt"  # r前缀，\n不会被转义成换行符
# 等价于 "C:\\new\\test.txt"
```

### f-string 格式化（推荐）

```python
name = "link"
age = 25
s = f"我是{name}，今年{age}岁"

# 表达式计算
s = f"明年{age + 1}岁"

# 精度控制
price = 3.14159
s = f"价格：{price:.2f}"  # "价格：3.14"
```

### 常用方法

```python
s = "  Hello World  "

s.strip()      # "Hello World"（去除两端空格）
s.lower()      # "  hello world  "
s.upper()      # "  HELLO WORLD  "
s.split()      # ["Hello", "World"]（按空格分割）
s.replace("World", "Python")  # "  Hello Python  "

# 注意：这些方法都返回新字符串，不修改原字符串
```

### 字符串拼接

```python
# ❌ 不推荐：循环中用 + 拼接
result = ""
for word in words:
    result += word

# ✅ 推荐：用 join()
result = "".join(words)        # 无分隔符
result = " ".join(words)       # 空格分隔
result = ", ".join(words)      # 逗号分隔
```

---

## 3. 列表

### 创建列表

```python
nums = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]  # 可以混合类型
empty = []
```

### 索引和切片

```python
lst = [10, 20, 30, 40, 50]

# 索引
lst[0]    # 10
lst[-1]   # 50（负数从末尾倒数）
lst[-2]   # 40

# 切片 [start:stop:step]
lst[1:4]   # [20, 30, 40]（不包含索引4）
lst[:3]    # [10, 20, 30]（从头开始）
lst[2:]    # [30, 40, 50]（到末尾）
lst[::2]   # [10, 30, 50]（步长2）
lst[::-1]  # [50, 40, 30, 20, 10]（倒序，常用技巧！）
```

### 修改列表

```python
lst = [1, 2, 3]

# 修改元素
lst[0] = 100        # [100, 2, 3]

# 添加元素
lst.append(4)       # [100, 2, 3, 4]（末尾追加）
lst.insert(1, 99)   # [100, 99, 2, 3, 4]（指定位置插入）
lst.extend([5, 6])  # [100, 99, 2, 3, 4, 5, 6]（合并列表）

# 删除元素
lst.pop()           # 返回最后一个元素并删除
lst.pop(1)          # 删除索引1的元素并返回
lst.remove(2)       # 删除第一个值为2的元素
del lst[0]          # 按索引删除
```

### 常用方法

```python
lst = [3, 1, 4, 1, 5]

lst.sort()          # [1, 1, 3, 4, 5]（原地排序，修改原列表）
sorted(lst)         # 返回新列表，不修改原列表

lst.reverse()       # [5, 4, 3, 1, 1]（原地反转）

lst.count(1)        # 2（统计1出现的次数）
lst.index(4)        # 2（返回4的索引）

len(lst)            # 5（长度）
```

---

## 4. 运算符

### 算术运算符

```python
10 + 3   # 13
10 - 3   # 7
10 * 3   # 30
10 / 3   # 3.333... （总是返回float）
10 // 3  # 3 （整数除法）
10 % 3   # 1 （取余）
10 ** 3  # 1000 （幂运算）
```

### 比较运算符

```python
5 > 3    # True
5 < 3    # False
5 >= 5   # True
5 <= 5   # True
5 == 5   # True
5 != 3   # True

# 链式比较（Python独有！）
1 < x < 10        # 等价于 1 < x and x < 10
x == y == z       # 三个都相等
```

### 逻辑运算符

```python
# 使用英文单词
True and True    # True
True and False   # False
True or False    # True
False or False   # False
not True         # False
not False        # True
```

### 短路求值（返回实际值）

```python
# and: 返回第一个假值，或最后一个值
5 and 3          # 3
0 and 3          # 0
"hello" and ""   # ""

# or: 返回第一个真值，或最后一个值
5 or 3           # 5
0 or 3           # 3
None or "default" # "default"

# 实际应用：设置默认值
name = input_name or "匿名用户"
```

### 真值测试

**假值 (Falsy)**：`False`, `None`, `0`, `0.0`, `""`, `[]`, `{}`, `()`

**其他所有值都是真值**：
```python
bool(1)          # True
bool(-1)         # True（负数也是真值！）
bool("0")        # True（非空字符串）
bool([0])        # True（非空列表）

# 实用技巧
if lst:              # 检查列表是否为空
    print("有元素")

if not name:         # 检查字符串是否为空
    print("未输入")
```

### 身份运算符

```python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

a == b           # True（值相等）
a is b           # False（不是同一个对象）
a is c           # True（指向同一个对象）

# 常用于检查 None
if x is None:    # ✅ 推荐
    pass
```

### 成员运算符

```python
3 in [1, 2, 3]          # True
"a" in "apple"          # True
"key" in {"key": 1}     # True（字典检查键）
5 not in [1, 2, 3]      # True
```

---

## 5. 流程控制

### if-elif-else

```python
age = 25

# 单分支
if age >= 18:
    print("成年")

# 双分支
if age >= 18:
    print("成年")
else:
    print("未成年")

# 多分支
if age < 18:
    print("未成年")
elif age < 60:      # elif = else if
    print("中年")
elif age < 80:
    print("老年")
else:
    print("长寿")
```

### 三元表达式

```python
# 语法：值1 if 条件 else 值2
status = "成年" if age >= 18 else "未成年"

# 列表推导式中使用
ages = [10, 20, 30]
labels = ["未成年" if x < 18 else "成年" for x in ages]
# ['未成年', '成年', '成年']
```

### match-case（Python 3.10+）

#### 基本匹配

```python
def http_status(code):
    match code:
        case 200:
            return "OK"
        case 404:
            return "Not Found"
        case 500:
            return "Server Error"
        case _:              # 默认分支
            return "Unknown"
```

#### 多值匹配

```python
def day_type(day):
    match day:
        case "周六" | "周日":
            return "周末"
        case "周一" | "周二" | "周三" | "周四" | "周五":
            return "工作日"
        case _:
            return "无效"
```

#### 解构匹配 - 元组/列表

```python
def describe_point(point):
    match point:
        case (0, 0):
            return "原点"
        case (0, y):         # 捕获y值
            return f"Y轴：y={y}"
        case (x, 0):
            return f"X轴：x={x}"
        case (x, y):
            return f"坐标：({x}, {y})"

# 匹配列表长度
def process_list(items):
    match items:
        case []:
            return "空"
        case [x]:
            return f"单个：{x}"
        case [x, y]:
            return f"两个：{x}, {y}"
        case [x, y, *rest]:         # *rest捕获剩余元素
            return f"多个：前两个是{x}, {y}，还有{len(rest)}个"
```

#### 解构匹配 - 字典

```python
def handle_event(event):
    match event:
        case {"type": "click", "x": x, "y": y}:
            return f"点击位置：({x}, {y})"
        case {"type": "keypress", "key": key}:
            return f"按键：{key}"
        case _:
            return "未知事件"

# 部分匹配（字典可以有额外字段）
def process_user(user):
    match user:
        case {"role": "admin"}:     # 只要有role=admin就匹配
            return "管理员权限"
        case {"role": "user", "verified": True}:
            return "已验证用户"
        case _:
            return "访客"
```

#### 守卫条件

```python
def categorize_number(x):
    match x:
        case n if n < 0:
            return "负数"
        case 0:
            return "零"
        case n if n > 0 and n < 10:
            return "个位正数"
        case n if n >= 10:
            return "两位及以上"
```

---

## 6. 循环

### for 循环

```python
# 遍历列表
for item in [1, 2, 3]:
    print(item)

# range()生成数字序列
for i in range(5):          # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 5):       # 1, 2, 3, 4（不包含5）
    print(i)

for i in range(0, 10, 2):   # 0, 2, 4, 6, 8（步长2）
    print(i)

# 遍历字典
user = {"name": "link", "age": 25}
for key, value in user.items():
    print(f"{key}: {value}")
```

### while 循环

```python
count = 0
while count < 5:
    print(count)
    count += 1

# 无限循环
while True:
    data = input("输入（q退出）：")
    if data == "q":
        break
```

### 循环控制

```python
# break：跳出整个循环
for i in range(10):
    if i == 5:
        break       # 遇到5直接退出循环
    print(i)        # 输出0-4

# continue：跳过本次循环
for i in range(5):
    if i == 2:
        continue    # 跳过2
    print(i)        # 输出0, 1, 3, 4

# for-else：循环正常结束时执行
for num in numbers:
    if num == target:
        print("找到了")
        break
else:
    print("未找到")  # 只有没被break才执行
```

---

## 7. 列表推导式

### 基本语法

```python
# 简单映射
numbers = [1, 2, 3, 4, 5]
squares = [x ** 2 for x in numbers]
# [1, 4, 9, 16, 25]

# 带过滤条件
evens = [x for x in numbers if x % 2 == 0]
# [2, 4]

# 带if-else（注意语法顺序！）
labels = ["偶数" if x % 2 == 0 else "奇数" for x in numbers]
# ['奇数', '偶数', '奇数', '偶数', '奇数']
```

### 语法区别

```python
# if 在后面：过滤（不满足条件的跳过）
[x for x in range(10) if x % 2 == 0]
# [0, 2, 4, 6, 8]

# if-else 在前面：转换（所有元素都保留）
[x if x % 2 == 0 else -x for x in range(5)]
# [0, -1, 2, -3, 4]
```

### 嵌套循环

```python
# 笛卡尔积
colors = ["红", "蓝"]
sizes = ["S", "M", "L"]
products = [f"{color}-{size}" for color in colors for size in sizes]
# ['红-S', '红-M', '红-L', '蓝-S', '蓝-M', '蓝-L']

# 嵌套+条件
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [num for row in matrix for num in row if num % 2 == 0]
# [2, 4, 6, 8]
```

### 字符串处理

```python
# 分割并转大写
sentence = "hello world python"
words = [word.upper() for word in sentence.split()]
# ['HELLO', 'WORLD', 'PYTHON']

# 提取文件扩展名
files = ["test.py", "data.txt", "image.jpg", "README"]
extensions = [f.split(".")[-1] for f in files if "." in f]
# ['py', 'txt', 'jpg']
```

### 其他推导式

**字典推导式**：
```python
items = ["apple", "banana", "cherry"]
lengths = {item: len(item) for item in items}
# {'apple': 5, 'banana': 6, 'cherry': 6}

# 反转字典
original = {"a": 1, "b": 2, "c": 3}
swapped = {value: key for key, value in original.items()}
# {1: 'a', 2: 'b', 3: 'c'}
```

**集合推导式**：
```python
numbers = [1, 2, 2, 3, 3, 4, 5]
unique_evens = {x for x in numbers if x % 2 == 0}
# {2, 4}（集合自动去重）
```

**生成器表达式**（节省内存）：
```python
# 列表推导：立即创建整个列表
squares_list = [x ** 2 for x in range(1000000)]  # 占用大量内存

# 生成器表达式：按需生成
squares_gen = (x ** 2 for x in range(1000000))   # 几乎不占内存

# 使用
for square in squares_gen:
    print(square)  # 每次循环才计算一个
```

### 使用建议

**✅ 适合使用**：
- 简单的映射/过滤
- 扁平化嵌套列表

**❌ 避免使用**：
- 复杂逻辑（可读性差）
- 有副作用的操作（如 `[print(x) for x in nums]`）

---

## 8. 强制缩进

### 三大原则

1. **顶级代码不缩进** - 不依赖任何条件的代码必须顶格写
2. **同级代码缩进一致** - 同一代码块必须对齐
3. **官方建议4个空格** - 不要混用Tab和空格

### 示例

```python
# ✅ 正确
age = 56
if age < 50:
    print("还能折腾")
    print("可以执行多行代码")
else:
    print("太老了")

# ❌ 错误：缩进不一致
if age < 50:
    print("第一行")
      print("第二行多了2个空格")  # IndentationError
```

### 设计哲学

- Python强制所有人写出一致风格的代码
- 缩进即语法，消除歧义
- 可读性至上

---

## 9. 常用技巧速查

### 交换变量

```python
a, b = b, a  # Python独有的优雅写法
```

### 多重赋值

```python
x = y = z = 0
a, b, c = 1, 2, 3
```

### 解包

```python
# 列表解包
first, *middle, last = [1, 2, 3, 4, 5]
# first=1, middle=[2,3,4], last=5

# 字典解包
data = {"name": "link", "age": 25}
print(f"{data['name']} - {data['age']}")
```

### enumerate（带索引遍历）

```python
for index, value in enumerate(['a', 'b', 'c']):
    print(f"{index}: {value}")
# 0: a
# 1: b
# 2: c

# 指定起始索引
for index, value in enumerate(['a', 'b', 'c'], start=1):
    print(f"{index}: {value}")
```

### zip（并行遍历）

```python
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]

for name, age in zip(names, ages):
    print(f"{name}: {age}")
# Alice: 25
# Bob: 30
# Charlie: 35
```

### any 和 all

```python
# any：有一个为True就返回True
any([False, False, True])   # True
any([False, False, False])  # False

# all：全部为True才返回True
all([True, True, True])     # True
all([True, False, True])    # False

# 实用示例
numbers = [2, 4, 6, 8]
all(x % 2 == 0 for x in numbers)  # True（全是偶数）
```

### 海象运算符（Python 3.8+）

```python
# 赋值+判断一步完成
if (data := get_data()):
    process(data)

# while循环中使用
while (line := file.readline()):
    process(line)
```

---

## 10. 性能提示

### 列表操作

```python
# ❌ 低效：频繁在头部插入
lst.insert(0, x)

# ✅ 高效：在末尾追加
lst.append(x)

# 需要在头部操作？用 collections.deque
from collections import deque
dq = deque([1, 2, 3])
dq.appendleft(0)  # O(1) 时间复杂度
```

### 字符串拼接

```python
# ❌ 低效：循环中用 +
result = ""
for word in words:
    result += word

# ✅ 高效：用 join()
result = "".join(words)
```

### 成员检查

```python
# ❌ 低效：在列表中查找（O(n)）
if item in large_list:
    pass

# ✅ 高效：用集合（O(1)）
large_set = set(large_list)
if item in large_set:
    pass
```

---

## 参考资源

- Python官方文档：https://docs.python.org/zh-cn/3/
- PEP 8 编码规范：https://peps.python.org/pep-0008/
- Python 3.13 新特性：https://docs.python.org/zh-cn/3/whatsnew/3.13.html

---

*最后更新: 2025-11-08*
