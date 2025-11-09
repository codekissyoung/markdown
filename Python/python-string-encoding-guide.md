# Python 字符编码完全指南

## 学习信息

- **学习日期**: 2025-11-09
- **Python版本**: 3.13
- **参考资料**: Unicode标准、Python官方文档
- **前置知识**: Python基础语法、字符串操作

---

## 核心概念

### 字符编码三要素

```
字符（Character）    →  人类可读的符号
  例：'你'、'好'、'A'

编码（Encoding）     →  将字符转换为字节的规则
  例：UTF-8、GBK、ASCII

字节（Bytes）        →  计算机存储的二进制数据
  例：b'\xe4\xbd\xa0'
```

## 一、Python 3 的字符串类型

### 1. str（文本字符串）

**特性**：Unicode字符序列，内存中的抽象表示

```python
# 创建
text = "你好"
text = '你好'
text = """多行
字符串"""

# 类型
type(text)  # <class 'str'>

# Unicode码点
ord("你")      # 20320（十进制）
hex(ord("你"))  # '0x4f60'（十六进制）
chr(20320)     # "你"
```

### 2. bytes（字节串）

**特性**：8位字节序列，文件/网络中的具体表示

```python
# 创建
data = b"hello"              # ASCII字符
data = b'\xe4\xbd\xa0'       # 十六进制字节
data = bytes([228, 189, 160])  # 整数列表

# 类型
type(data)  # <class 'bytes'>

# 不可变
# data[0] = 100  # ❌ TypeError

# 查看
data.hex()     # 'e4bda0'（十六进制表示）
list(data)     # [228, 189, 160]（字节值列表）
```

### 3. bytearray（可变字节串）

```python
# 创建
ba = bytearray(b"hello")
ba = bytearray([72, 101, 108, 108, 111])

# 可变
ba[0] = 72  # bytearray(b'Hello')
ba.append(33)  # bytearray(b'Hello!')
```

---

## 二、编码和解码

### 核心操作

```python
# 编码：str → bytes
text = "你好"
utf8_bytes = text.encode('utf-8')      # b'\xe4\xbd\xa0\xe5\xa5\xbd'
gbk_bytes = text.encode('gbk')         # b'\xc4\xe3\xba\xc3'
ascii_bytes = text.encode('ascii')     # ❌ UnicodeEncodeError

# 解码：bytes → str
utf8_bytes = b'\xe4\xbd\xa0\xe5\xa5\xbd'
text = utf8_bytes.decode('utf-8')      # "你好"

# 错误的解码 → 乱码
text = utf8_bytes.decode('gbk')        # "浣犲ソ"
```

### 记忆公式

```python
str.encode(编码)  →  bytes    （编码：文字变字节）
bytes.decode(编码) →  str     （解码：字节变文字）

encode = 加密（人类可读 → 机器可读）
decode = 解密（机器可读 → 人类可读）
```

---

## 三、常见编码格式

| 编码 | 全称 | 说明 | 英文 | 中文 | 适用场景 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UTF-8** | Unicode Transformation Format-8 | Unicode通用编码 | 1字节 | 3字节 | 推荐，跨平台 |
| **UTF-16** | Unicode Transformation Format-16 | Unicode宽字符 | 2字节 | 2字节 | Windows内部 |
| **UTF-32** | Unicode Transformation Format-32 | 固定长度 | 4字节 | 4字节 | 浪费空间，少用 |
| **GBK** | 国标扩展 | 中文国标扩展 | 1字节 | 2字节 | 旧系统，Windows |
| **GB2312** | 国标2312 | 中文国标 | 1字节 | 2字节 | 老旧系统 |
| **ASCII** | 美国标准码 | 7位编码 | 1字节 | ❌ 不支持 | 纯英文 |
| **Latin-1** | ISO 8859-1 | 西欧字符 | 1字节 | ❌ 不支持 | HTTP头部 |

### 编码示例对比

```python
text = "你好A"

# UTF-8（可变长度）
text.encode('utf-8')
# b'\xe4\xbd\xa0\xe5\xa5\xbd\x41'
# "你"=3字节 + "好"=3字节 + "A"=1字节 = 7字节

# GBK（固定2字节中文）
text.encode('gbk')
# b'\xc4\xe3\xba\xc3A'
# "你"=2字节 + "好"=2字节 + "A"=1字节 = 5字节

# UTF-16（固定2字节，带BOM）
text.encode('utf-16')
# b'\xff\xfe`O}Y\x00A'
# BOM(2) + "你"(2) + "好"(2) + "A"(2) = 8字节
```

### 推荐使用

```python
✅ 推荐：UTF-8
  - 国际标准
  - 兼容ASCII
  - 网络传输标准
  - Python 3默认

⚠️ 特殊场景：
  - GBK：对接旧系统（Windows中文）
  - Latin-1：HTTP头部（单字节编码）
  - ASCII：纯英文系统
```

---

## 四、文件读写编码

### 文本文件

```python
# ✅ 正确：显式指定编码
with open('data.txt', 'r', encoding='utf-8') as f:
    content = f.read()

with open('output.txt', 'w', encoding='utf-8') as f:
    f.write("你好，世界")

# ❌ 错误：不指定编码（依赖系统默认）
# Windows默认GBK，macOS/Linux默认UTF-8
with open('data.txt', 'r') as f:  # ⚠️ 可能乱码
    content = f.read()
```

### 二进制文件

```python
# 二进制模式（图片、PDF、视频等）
with open('image.png', 'rb') as f:
    data = f.read()  # bytes类型

with open('output.png', 'wb') as f:
    f.write(data)
```

### 编码转换

```python
# 场景：GBK文件转UTF-8
# 步骤1：用GBK读取
with open('gbk_file.txt', 'r', encoding='gbk') as f:
    content = f.read()  # str类型

# 步骤2：用UTF-8写入
with open('utf8_file.txt', 'w', encoding='utf-8') as f:
    f.write(content)
```

---

## 五、常见错误及解决

### 错误1：UnicodeDecodeError（解码错误）

```python
# 错误示例
data = b'\xc4\xe3\xba\xc3'  # GBK编码的"你好"
text = data.decode('utf-8')  # ❌ UnicodeDecodeError

# 原因：用UTF-8解码GBK数据

# 解决方法1：用正确的编码
text = data.decode('gbk')  # ✅ "你好"

# 解决方法2：忽略错误（不推荐）
text = data.decode('utf-8', errors='ignore')    # 忽略无法解码的字节
text = data.decode('utf-8', errors='replace')   # 用�替换
text = data.decode('utf-8', errors='backslashreplace')  # 用\xNN替换

# 解决方法3：检测编码
import chardet
result = chardet.detect(data)
text = data.decode(result['encoding'])
```

### 错误2：UnicodeEncodeError（编码错误）

```python
# 错误示例
text = "你好"
data = text.encode('ascii')  # ❌ UnicodeEncodeError

# 原因：ASCII不支持中文

# 解决方法1：用支持的编码
data = text.encode('utf-8')  # ✅

# 解决方法2：忽略错误
data = text.encode('ascii', errors='ignore')    # ''（忽略中文）
data = text.encode('ascii', errors='replace')   # b'??'（用?替换）
data = text.encode('ascii', errors='xmlcharrefreplace')  # b'&#20320;&#22909;'
```

### 错误3：文件读取乱码

```python
# 错误示例
# 文件是GBK编码，但用UTF-8读取
with open('gbk_file.txt', 'r', encoding='utf-8') as f:
    content = f.read()  # ❌ 乱码或报错

# 解决方法1：用正确的编码
with open('gbk_file.txt', 'r', encoding='gbk') as f:
    content = f.read()  # ✅

# 解决方法2：自动检测编码
import chardet

with open('unknown.txt', 'rb') as f:
    raw_data = f.read()
    result = chardet.detect(raw_data)
    encoding = result['encoding']

with open('unknown.txt', 'r', encoding=encoding) as f:
    content = f.read()
```

### 错误4：网页爬虫乱码

```python
import requests

# 错误示例
response = requests.get('http://example.com')
text = response.text  # ⚠️ 可能乱码（自动检测可能不准）

# 解决方法1：手动指定编码
response.encoding = 'utf-8'
text = response.text

# 解决方法2：用apparent_encoding
response.encoding = response.apparent_encoding
text = response.text

# 解决方法3：从字节解码
raw = response.content  # bytes
text = raw.decode('utf-8', errors='replace')
```

---

## 六、errors参数详解

| 错误处理方式 | 说明 | 示例 |
| :--- | :--- | :--- |
| `strict` | 默认，遇到错误抛出异常 | UnicodeDecodeError |
| `ignore` | 忽略无法处理的字符 | "你好" → "" |
| `replace` | 用替换字符（�或?）替换 | "你好" → "??" |
| `backslashreplace` | 用\xNN转义序列替换 | "你好" → "\\xc4\\xe3\\xba\\xc3" |
| `xmlcharrefreplace` | 用XML字符引用替换 | "你好" → "&#20320;&#22909;" |
| `surrogateescape` | 保留错误字节（高级） | 用于处理混合编码 |

```python
text = "你好ABC"
data = text.encode('utf-8')

# strict（默认）
data.decode('ascii', errors='strict')  # ❌ UnicodeDecodeError

# ignore（跳过无法解码的）
data.decode('ascii', errors='ignore')  # "ABC"

# replace（替换为�）
data.decode('ascii', errors='replace')  # "������ABC"

# backslashreplace（显示十六进制）
data.decode('ascii', errors='backslashreplace')
# "\\xe4\\xbd\\xa0\\xe5\\xa5\\xbdABC"
```

---

## 七、网络请求编码

### requests库

```python
import requests

# 基本用法
response = requests.get('https://example.com')

# 方式1：自动检测编码
text = response.text           # requests自动检测
encoding = response.encoding   # 检测到的编码

# 方式2：手动指定编码
response.encoding = 'utf-8'
text = response.text

# 方式3：用apparent_encoding（更准确）
response.encoding = response.apparent_encoding
text = response.text

# 获取原始字节
raw_bytes = response.content   # bytes类型
text = raw_bytes.decode('utf-8', errors='replace')
```

### urllib

```python
from urllib.request import urlopen

# 读取网页
response = urlopen('https://example.com')
raw = response.read()  # bytes类型

# 解码
text = raw.decode('utf-8')

# 检测编码（从HTTP头）
charset = response.headers.get_content_charset()
if charset:
    text = raw.decode(charset)
```

---

## 八、实用技巧

### 1. 自动检测文件编码

```python
import chardet

def detect_encoding(file_path):
    """检测文件编码"""
    with open(file_path, 'rb') as f:
        raw_data = f.read()
        result = chardet.detect(raw_data)
        return result['encoding'], result['confidence']

# 使用
encoding, confidence = detect_encoding('unknown.txt')
print(f"编码：{encoding}，置信度：{confidence}")

# 用检测到的编码读取
with open('unknown.txt', 'r', encoding=encoding) as f:
    content = f.read()
```

### 2. 批量转换文件编码

```python
import os
from pathlib import Path

def convert_encoding(src_dir, src_enc='gbk', dst_enc='utf-8'):
    """批量转换文件编码"""
    for file_path in Path(src_dir).glob('*.txt'):
        # 读取原文件
        with open(file_path, 'r', encoding=src_enc) as f:
            content = f.read()

        # 写入新编码
        with open(file_path, 'w', encoding=dst_enc) as f:
            f.write(content)

        print(f"转换：{file_path}")

# 使用
convert_encoding('./data', src_enc='gbk', dst_enc='utf-8')
```

### 3. 处理CSV乱码

```python
import pandas as pd

def read_csv_auto_encoding(file_path):
    """自动检测CSV编码"""
    encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1']

    for enc in encodings:
        try:
            df = pd.read_csv(file_path, encoding=enc)
            print(f"成功！编码是：{enc}")
            return df
        except UnicodeDecodeError:
            continue

    raise ValueError(f"无法读取文件：{file_path}")

# 使用
df = read_csv_auto_encoding('data.csv')
```

### 4. JSON编码处理

```python
import json

# Python对象序列化
data = {"name": "link", "message": "你好"}
json_str = json.dumps(data, ensure_ascii=False)
# '{"name": "link", "message": "你好"}'

# ensure_ascii=True（默认，转义中文）
json_str = json.dumps(data, ensure_ascii=True)
# '{"name": "link", "message": "\\u4f60\\u597d"}'

# 文件读写
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
```

### 5. URL编码

```python
from urllib.parse import quote, unquote

# URL编码
text = "你好世界"
encoded = quote(text)
# '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C'

# URL解码
decoded = unquote(encoded)
# "你好世界"

# 完整URL
url = f"https://example.com/search?q={quote('Python教程')}"
```

---

## 九、调试技巧

### 1. 查看字符编码信息

```python
# 查看字符的Unicode码点
char = "你"
print(f"字符：{char}")
print(f"十进制码点：{ord(char)}")        # 20320
print(f"十六进制码点：{hex(ord(char))}")  # 0x4f60
print(f"Unicode名称：{unicodedata.name(char)}")

# 从码点创建字符
chr(20320)     # "你"
chr(0x4f60)    # "你"

# 查看字符串的各种编码
text = "你好"
print(f"UTF-8:  {text.encode('utf-8').hex()}")    # e4bda0e5a5bd
print(f"GBK:    {text.encode('gbk').hex()}")      # c4e3bac3
print(f"UTF-16: {text.encode('utf-16').hex()}")   # fffe604f7d59
```

### 2. 字节串调试

```python
data = b'\xe4\xbd\xa0\xe5\xa5\xbd'

# 查看十六进制
print(data.hex())           # 'e4bda0e5a5bd'
print(data.hex(' '))        # 'e4 bd a0 e5 a5 bd'

# 查看字节值
print(list(data))           # [228, 189, 160, 229, 165, 189]

# 格式化输出
print(' '.join(f'{b:02x}' for b in data))  # 'e4 bd a0 e5 a5 bd'
```

### 3. 比较不同编码

```python
text = "你好ABC123"

encodings = ['utf-8', 'gbk', 'utf-16', 'utf-32']
for enc in encodings:
    data = text.encode(enc)
    print(f"{enc:10s}: {len(data):3d} bytes - {data.hex()[:40]}")

# 输出：
# utf-8     :  12 bytes - e4bda0e5a5bd4142433132333
# gbk       :  10 bytes - c4e3bac34142433132333
# utf-16    :  18 bytes - fffe604f7d594100420043003100320033
# utf-32    :  32 bytes - fffe0000604f00007d590000410000004200
```

---

## 十、最佳实践

### 黄金规则

```python
1. ✅ 统一使用 UTF-8 编码
   - 源代码文件
   - 文本文件
   - 网络传输
   - 数据库

2. ✅ 文件操作始终指定 encoding='utf-8'

3. ✅ 边界处理编码/解码
   - 读取时立即解码为 str
   - 输出前再编码为 bytes
   - 内部统一用 str 处理

4. ✅ 错误处理要明确
   - 生产环境避免 errors='ignore'
   - 记录无法处理的数据
   - 优先检测编码而非忽略

5. ✅ 代码可移植
   - 不依赖系统默认编码
   - 显式指定所有编码参数
```

### 源代码文件声明

```python
# 文件开头声明编码（Python 3可选，但推荐）
# -*- coding: utf-8 -*-

# 或
# coding: utf-8

# 或（PEP 263推荐）
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
```

### 代码模板

```python
# ===== 读取文本文件 =====
def read_text_file(file_path, encoding='utf-8'):
    """安全读取文本文件"""
    try:
        with open(file_path, 'r', encoding=encoding) as f:
            return f.read()
    except UnicodeDecodeError as e:
        print(f"编码错误：{e}")
        # 尝试自动检测
        import chardet
        with open(file_path, 'rb') as f:
            raw = f.read()
            detected = chardet.detect(raw)
            print(f"检测到编码：{detected['encoding']}")
            return raw.decode(detected['encoding'])

# ===== 写入文本文件 =====
def write_text_file(file_path, content, encoding='utf-8'):
    """安全写入文本文件"""
    with open(file_path, 'w', encoding=encoding) as f:
        f.write(content)

# ===== HTTP请求 =====
def fetch_url(url, encoding='utf-8'):
    """获取网页内容"""
    import requests
    response = requests.get(url)
    response.encoding = encoding
    return response.text
```

---

## 十一、常见场景实战

### 场景1：爬虫处理不同编码网页

```python
import requests
import chardet

def fetch_page(url):
    """智能获取网页内容"""
    response = requests.get(url)

    # 方法1：从HTTP头获取编码
    encoding = response.encoding
    if encoding and encoding.lower() != 'iso-8859-1':
        return response.text

    # 方法2：从内容检测编码
    raw = response.content
    detected = chardet.detect(raw)
    encoding = detected['encoding']

    return raw.decode(encoding, errors='replace')

# 使用
content = fetch_page('https://example.com')
```

### 场景2：处理混合编码日志文件

```python
def read_mixed_encoding_log(file_path):
    """处理可能包含混合编码的日志"""
    with open(file_path, 'rb') as f:
        raw = f.read()

    # 尝试UTF-8
    try:
        return raw.decode('utf-8')
    except UnicodeDecodeError:
        pass

    # 尝试GBK
    try:
        return raw.decode('gbk')
    except UnicodeDecodeError:
        pass

    # 最后使用replace策略
    return raw.decode('utf-8', errors='replace')
```

### 场景3：Excel文件编码处理

```python
import pandas as pd

def read_excel_with_encoding(file_path):
    """读取可能有编码问题的Excel"""
    try:
        # 先尝试默认方式
        df = pd.read_excel(file_path)
        return df
    except Exception:
        # 转换为CSV再读取
        import openpyxl
        wb = openpyxl.load_workbook(file_path)
        ws = wb.active

        # 导出为CSV
        import csv
        with open('temp.csv', 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            for row in ws.rows:
                writer.writerow([cell.value for cell in row])

        # 读取CSV
        return pd.read_csv('temp.csv', encoding='utf-8')
```

### 场景4：数据库字符集问题

```python
import sqlite3

# SQLite（Python 3默认UTF-8）
conn = sqlite3.connect('test.db')
conn.execute("CREATE TABLE users (name TEXT)")
conn.execute("INSERT INTO users VALUES (?)", ("你好",))
conn.commit()

# MySQL（需要指定字符集）
import pymysql
conn = pymysql.connect(
    host='localhost',
    user='root',
    password='password',
    database='test',
    charset='utf8mb4'  # ← 关键：使用utf8mb4支持emoji
)
```

---

## 十二、Python 2 vs Python 3（了解）

### 主要区别

| 特性 | Python 2 | Python 3 |
| :--- | :--- | :--- |
| 默认字符串 | bytes（`"hello"`） | str（`"hello"`） |
| Unicode字符串 | 需要u前缀（`u"你好"`） | 默认Unicode |
| 字节字符串 | 默认（`"hello"`） | 需要b前缀（`b"hello"`） |
| 编码问题 | 频繁出现 | 大幅减少 |

```python
# Python 2（已废弃）
text = u"你好"      # Unicode字符串
data = "你好"       # 字节字符串

# Python 3（推荐）
text = "你好"       # str（Unicode）
data = b"hello"     # bytes
```

**重要**：Python 3 从设计上解决了大部分编码问题，统一用Unicode。

---

## 参考资源

- Python官方文档：https://docs.python.org/zh-cn/3/
- Unicode标准：https://www.unicode.org/
- 字符编码详解：https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/
- chardet库：https://github.com/chardet/chardet

---

*最后更新: 2025-11-09*
