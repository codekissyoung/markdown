# Python 装饰器完全指南

**学习日期**: 2025-11-11
**前置知识**: Python 函数、闭包
**对比语言**: Go、Java、TypeScript、Rust
**核心价值**: 分离关注点、代码复用、无侵入式增强

---

## 一、装饰器核心原理

### 1. 本质：函数是一等公民

```python
# 函数可以赋值
def greet():
    return "Hello"

say_hello = greet
print(say_hello())  # Hello

# 函数可以作为参数
def execute(func):
    return func()

result = execute(greet)

# 函数可以作为返回值
def get_function():
    def inner():
        return "Inner"
    return inner

func = get_function()
print(func())  # Inner
```

### 2. 装饰器 = 高阶函数 + 语法糖

```python
def log_decorator(func):
    def wrapper(*args, **kwargs):
        print(f"调用 {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

# 手动装饰
def add(a, b):
    return a + b
add = log_decorator(add)

# 语法糖（等价）
@log_decorator
def add(a, b):
    return a + b

# 核心：@decorator 就是 func = decorator(func)
```

### 3. 闭包：内层函数记住外层变量

```python
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for i in range(times):  # 访问外层的 times
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)  # times=3 被"记住"
def greet():
    print("Hello")
```

---

## 二、装饰器语法速查

### 不带参数装饰器（2 层嵌套）

```python
from functools import wraps

def decorator(func):
    @wraps(func)  # 保留元信息
    def wrapper(*args, **kwargs):
        # 前置逻辑
        result = func(*args, **kwargs)
        # 后置逻辑
        return result
    return wrapper

@decorator
def my_func():
    pass
```

### 带参数装饰器（3 层嵌套）

```python
def decorator(arg1, arg2):
    def _decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 可以访问 arg1, arg2
            result = func(*args, **kwargs)
            return result
        return wrapper
    return _decorator

@decorator("param1", "param2")
def my_func():
    pass
```

### 类装饰器

```python
from functools import wraps

class Decorator:
    def __init__(self, func):
        wraps(func)(self)
        self.func = func

    def __call__(self, *args, **kwargs):
        # 装饰逻辑
        return self.func(*args, **kwargs)

@Decorator
def my_func():
    pass
```

### 装饰器叠加

```python
@decorator1
@decorator2
@decorator3
def func():
    pass

# 等价于：
func = decorator1(decorator2(decorator3(func)))

# 执行顺序：从下往上装饰，从上往下执行
```

---

## 三、企业级装饰器库

### 1. 错误处理 + 重试

```python
import logging
from functools import wraps
import time

def retry(max_attempts=3, delay=1, exceptions=(Exception,)):
    """错误重试装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    logging.error(f"{func.__name__} 第 {attempt+1} 次失败: {e}")
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=2, exceptions=(IOError, TimeoutError))
def fetch_data():
    response = requests.get("https://api.example.com/data")
    return response.json()
```

### 2. 链路追踪

```python
import uuid
import time
from contextvars import ContextVar
from functools import wraps

trace_id_var = ContextVar('trace_id', default=None)

def trace(func):
    """分布式链路追踪"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        trace_id = trace_id_var.get() or str(uuid.uuid4())[:8]
        trace_id_var.set(trace_id)

        start = time.time()
        print(f"[{trace_id}] → {func.__name__}")

        try:
            result = func(*args, **kwargs)
            elapsed = time.time() - start
            print(f"[{trace_id}] ← {func.__name__} ({elapsed:.3f}s)")
            return result
        except Exception as e:
            elapsed = time.time() - start
            print(f"[{trace_id}] ✗ {func.__name__} ({elapsed:.3f}s): {e}")
            raise
    return wrapper

@trace
def service_a():
    time.sleep(0.1)
    service_b()

@trace
def service_b():
    time.sleep(0.05)

service_a()
# [a1b2c3d4] → service_a
# [a1b2c3d4] → service_b
# [a1b2c3d4] ← service_b (0.050s)
# [a1b2c3d4] ← service_a (0.150s)
```

### 3. 权限检查

```python
def require_permission(*permissions):
    """权限检查装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = get_current_user()

            for permission in permissions:
                if not user.has_permission(permission):
                    raise PermissionError(f"需要权限: {permission}")

            return func(*args, **kwargs)
        return wrapper
    return decorator

@require_permission("user:write", "user:delete")
def delete_user(user_id):
    db.delete(user_id)
```

### 4. 限流

```python
import time
from collections import defaultdict
from functools import wraps

def rate_limit(max_calls=10, period=60):
    """限流装饰器：period 秒内最多 max_calls 次"""
    def decorator(func):
        calls = defaultdict(list)

        @wraps(func)
        def wrapper(*args, **kwargs):
            now = time.time()
            key = func.__name__

            # 清理过期记录
            calls[key] = [t for t in calls[key] if now - t < period]

            # 检查限流
            if len(calls[key]) >= max_calls:
                wait_time = period - (now - calls[key][0])
                raise Exception(f"请求过于频繁，请等待 {wait_time:.1f}s")

            calls[key].append(now)
            return func(*args, **kwargs)

        return wrapper
    return decorator

@rate_limit(max_calls=3, period=10)
def send_verification_code(phone):
    sms.send(phone, generate_code())
```

### 5. 缓存（带过期）

```python
import time
from functools import wraps

def cache_with_ttl(ttl=60):
    """带过期时间的缓存"""
    def decorator(func):
        cached = {}

        @wraps(func)
        def wrapper(*args):
            now = time.time()

            if args in cached:
                result, timestamp = cached[args]
                if now - timestamp < ttl:
                    return result

            result = func(*args)
            cached[args] = (result, now)
            return result

        return wrapper
    return decorator

@cache_with_ttl(ttl=300)
def get_config(key):
    return db.query("SELECT value FROM config WHERE key=?", key)
```

### 6. 性能计时

```python
import time
from functools import wraps

def timer(func):
    """性能计时装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"{func.__name__} 耗时: {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
```

### 7. 参数验证

```python
import inspect
from functools import wraps

def validate(rules):
    """参数验证装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            sig = inspect.signature(func)
            bound = sig.bind(*args, **kwargs)
            bound.apply_defaults()

            for param_name, rule in rules.items():
                value = bound.arguments.get(param_name)

                if 'type' in rule and not isinstance(value, rule['type']):
                    raise TypeError(f"{param_name} 必须是 {rule['type'].__name__}")

                if 'min' in rule and value < rule['min']:
                    raise ValueError(f"{param_name} 不能小于 {rule['min']}")

                if 'max' in rule and value > rule['max']:
                    raise ValueError(f"{param_name} 不能大于 {rule['max']}")

            return func(*args, **kwargs)
        return wrapper
    return decorator

@validate({
    'age': {'type': int, 'min': 0, 'max': 150},
    'email': {'type': str}
})
def create_user(name, age, email):
    return User(name, age, email)
```

### 8. 组合使用

```python
@trace                              # 链路追踪
@retry(max_attempts=3)              # 错误重试
@require_permission("api:read")     # 权限检查
@rate_limit(max_calls=100, period=60)  # 限流
@cache_with_ttl(ttl=300)            # 缓存
@timer                              # 性能监控
def get_user_info(user_id):
    """获取用户信息"""
    return db.query(User).filter_by(id=user_id).first()

# 核心业务逻辑只有 1 行，所有辅助功能都在装饰器里！
```

---

## 四、跨语言对比

### Python（装饰器语法）

```python
from functools import wraps

def log(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"调用 {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log
def add(a, b):
    return a + b
```

**特点**：
- ✅ 语法简洁（`@decorator`）
- ✅ 运行时修改行为
- ✅ 灵活（函数、类都可以装饰）
- ❌ 调试稍难（多层包装）

### Go（高阶函数）

```go
// Go 没有装饰器语法，需要手动包装
func LogDecorator(fn func(int, int) int) func(int, int) int {
    return func(a, b int) {
        fmt.Printf("调用函数\n")
        return fn(a, b)
    }
}

func Add(a, b int) int {
    return a + b
}

// 手动装饰
add := LogDecorator(Add)
result := add(1, 2)
```

**特点**：
- ✅ 类型安全（编译期检查）
- ✅ 性能好（无反射）
- ❌ 啰嗦（每种签名都要写一次）
- ❌ 无语法糖

### Java（注解 Annotation）

```java
@Override
@Deprecated
@Log  // 自定义注解
public void myMethod() {
    // ...
}

// 注解只是元数据，需要框架（Spring）通过反射实现功能
@RestController
public class UserController {
    @GetMapping("/users/{id}")
    @Cacheable(value = "users", ttl = 300)
    @RequiresPermission("user:read")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }
}
```

**特点**：
- ✅ 框架支持强（Spring、Hibernate）
- ✅ 编译期检查（注解处理器）
- ❌ 需要框架支持（AOP/反射）
- ❌ 不灵活（只能用框架提供的功能）

### TypeScript（实验性装饰器）

```typescript
// 需要 tsconfig.json: "experimentalDecorators": true
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
        console.log(`调用 ${propertyKey}`);
        return original.apply(this, args);
    };
}

class Calculator {
    @log
    add(a: number, b: number): number {
        return a + b;
    }
}
```

**特点**：
- ✅ 类似 Python 语法
- ❌ 实验性特性（不稳定）
- ❌ 主要用于类成员

### Rust（宏 Macro）

```rust
// Rust 用过程宏实现类似功能
#[derive(Debug)]  // 自动生成 Debug trait
struct Point {
    x: i32,
    y: i32,
}

// 自定义过程宏（复杂）
#[log_time]  // 自定义宏
fn expensive_operation() {
    // ...
}
```

**特点**：
- ✅ 编译期执行（零运行时开销）
- ✅ 类型安全
- ❌ 写宏很复杂（需要 syn/quote 库）

### 对比总结

| 特性 | Python | Go | Java | TypeScript | Rust |
|:-----|:-------|:---|:-----|:-----------|:-----|
| **语法糖** | ✅ `@decorator` | ❌ 手动包装 | ✅ `@Annotation` | ✅ `@decorator` | ✅ `#[macro]` |
| **运行时** | 运行时 | 编译后 | 运行时（反射） | 编译为 JS | 编译期 |
| **类型安全** | ❌ 动态类型 | ✅ 静态类型 | ✅ 静态类型 | ✅ 静态类型 | ✅ 静态类型 |
| **灵活性** | ★★★★★ | ★★☆☆☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ |
| **学习曲线** | ★★☆☆☆ | ★☆☆☆☆ | ★★★☆☆ | ★★★☆☆ | ★★★★★ |
| **性能** | 中等 | 最快 | 中等 | 中等 | 最快 |
| **适用场景** | Web、脚本 | 系统、网络 | 企业应用 | 前端、Node | 系统、嵌入式 |

---

## 五、最佳实践

### 1. 永远使用 `@wraps`

```python
# ✅ 正确
from functools import wraps

def decorator(func):
    @wraps(func)  # 保留元信息
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

# ❌ 错误
def decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper  # 函数名、文档丢失
```

### 2. 用 `*args, **kwargs` 接收任意参数

```python
# ✅ 正确：适用所有函数
def decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

# ❌ 错误：只能装饰无参数函数
def decorator(func):
    @wraps(func)
    def wrapper():
        return func()
    return wrapper
```

### 3. 分离关注点

```python
# ✅ 正确：业务逻辑纯净
@trace
@validate({'amount': {'min': 0.01}})
@require_permission("payment:create")
@audit_log
def create_payment(user_id, amount):
    payment = Payment(user_id, amount)
    db.save(payment)
    return payment

# ❌ 错误：业务逻辑被污染
def create_payment(user_id, amount):
    # 日志
    log.info(f"create_payment: {user_id}, {amount}")

    # 验证
    if amount < 0.01:
        raise ValueError("金额过小")

    # 权限
    if not check_permission("payment:create"):
        raise PermissionError()

    # 业务逻辑（淹没在辅助代码中）
    payment = Payment(user_id, amount)
    db.save(payment)

    # 审计
    audit.log("create_payment", user_id, amount)

    return payment
```

### 4. 装饰器命名：动词或名词

```python
# ✅ 动词（表示动作）
@trace
@cache
@retry
@log

# ✅ 名词（表示要求）
@authenticated
@admin_required
@rate_limited

# ❌ 混乱
@do_trace
@caching
@with_retry
```

### 5. 带参数装饰器提供默认值

```python
# ✅ 正确：可以不传参数
@retry()  # 使用默认值
def func1():
    pass

@retry(max_attempts=5)  # 自定义参数
def func2():
    pass

# 实现：
def retry(max_attempts=3, delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # ...
            pass
        return wrapper
    return decorator

# ❌ 错误：必须传参数
@retry(3)  # 不能写 @retry
def func():
    pass
```

### 6. 避免过度装饰

```python
# ❌ 过度：10 个装饰器
@decorator1
@decorator2
@decorator3
@decorator4
@decorator5
@decorator6
@decorator7
@decorator8
@decorator9
@decorator10
def func():
    pass

# ✅ 合理：3-5 个
@trace
@cache
@require_permission("api:read")
def func():
    pass
```

### 7. 装饰器顺序有意义

```python
# ✅ 正确顺序
@trace              # 最外层：记录整体耗时
@retry(3)           # 重试（包括缓存检查）
@cache              # 缓存（在权限检查后）
@require_permission # 权限检查（最先执行业务前置条件）
def get_data():
    return db.query()

# ❌ 错误顺序
@cache              # 缓存在权限检查前，绕过权限！
@require_permission
def get_data():
    return db.query()
```

### 8. 类装饰器记得 `wraps`

```python
from functools import wraps

# ✅ 正确
class CountCalls:
    def __init__(self, func):
        wraps(func)(self)  # 保留元信息
        self.func = func
        self.count = 0

    def __call__(self, *args, **kwargs):
        self.count += 1
        return self.func(*args, **kwargs)

# ❌ 错误
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.count = 0

    def __call__(self, *args, **kwargs):
        self.count += 1
        return self.func(*args, **kwargs)
```

---

## 六、常见陷阱

### 1. 忘记返回值

```python
# ❌ 错误
def decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        func(*args, **kwargs)  # 忘记 return
    return wrapper

@decorator
def add(a, b):
    return a + b

print(add(1, 2))  # None

# ✅ 正确
def decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)  # 必须 return
    return wrapper
```

### 2. 带参数装饰器忘记调用

```python
def repeat(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

# ❌ 错误：忘记调用 repeat(3)
@repeat
def greet():
    print("Hello")

# ✅ 正确
@repeat(3)
def greet():
    print("Hello")
```

### 3. 装饰类方法忘记 `self`

```python
def log(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"调用 {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

class User:
    # ✅ 正确：装饰器自动处理 self
    @log
    def greet(self):
        return f"Hello, {self.name}"

# ❌ 错误：手动传 self 会出错
# @log(self)  # SyntaxError
```

### 4. 闭包变量陷阱

```python
# ❌ 错误：所有 wrapper 共享同一个 count
def make_counter():
    count = 0
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            nonlocal count
            count += 1
            print(f"调用次数: {count}")
            return func(*args, **kwargs)
        return wrapper
    return decorator

counter = make_counter()

@counter
def func1():
    pass

@counter
def func2():
    pass

func1()  # 调用次数: 1
func2()  # 调用次数: 2（共享计数！）

# ✅ 正确：每个装饰器独立计数
def make_counter():
    def decorator(func):
        func.count = 0  # 绑定到函数上
        @wraps(func)
        def wrapper(*args, **kwargs):
            func.count += 1
            print(f"{func.__name__} 调用次数: {func.count}")
            return func(*args, **kwargs)
        return wrapper
    return decorator

@make_counter()
def func1():
    pass

@make_counter()
def func2():
    pass

func1()  # func1 调用次数: 1
func2()  # func2 调用次数: 1（独立计数）
```

---

## 七、装饰器设计模式

### 1. 工厂模式（带参数装饰器）

```python
def create_cache_decorator(backend='memory'):
    """工厂函数：根据参数创建不同的缓存装饰器"""
    if backend == 'memory':
        return memory_cache()
    elif backend == 'redis':
        return redis_cache()
    else:
        raise ValueError(f"未知后端: {backend}")

@create_cache_decorator('redis')
def get_user(user_id):
    return db.query(user_id)
```

### 2. 策略模式（可切换装饰器）

```python
class AuthStrategy:
    @staticmethod
    def basic(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Basic Auth
            return func(*args, **kwargs)
        return wrapper

    @staticmethod
    def oauth(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # OAuth
            return func(*args, **kwargs)
        return wrapper

# 根据配置选择策略
auth_decorator = AuthStrategy.oauth if USE_OAUTH else AuthStrategy.basic

@auth_decorator
def protected_api():
    return {"data": "sensitive"}
```

### 3. 责任链模式（多个装饰器协作）

```python
@validate_input   # 1. 验证输入
@authenticate     # 2. 身份认证
@authorize        # 3. 权限检查
@rate_limit       # 4. 限流
@cache            # 5. 缓存
def api_endpoint(request):
    return process(request)

# 每个装饰器检查一个条件，失败则中断
```

---

## 八、总结

### 装饰器核心价值

1. **分离关注点**：业务逻辑 vs 辅助逻辑
2. **代码复用**：一次编写，到处使用
3. **无侵入式增强**：不修改原代码

### 记忆要点

```python
# 标准模板（不带参数）
from functools import wraps

def decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        # 前置逻辑
        result = func(*args, **kwargs)
        # 后置逻辑
        return result
    return wrapper

# 标准模板（带参数）
def decorator(param):
    def _decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 可以访问 param
            result = func(*args, **kwargs)
            return result
        return wrapper
    return _decorator
```

### 最佳实践清单

- ✅ 永远用 `@wraps`
- ✅ 用 `*args, **kwargs`
- ✅ 装饰器命名清晰（动词/名词）
- ✅ 提供默认参数
- ✅ 注意装饰器顺序
- ✅ 不要过度装饰（3-5 个）
- ✅ 记得返回值

### 何时使用装饰器

| 场景 | 是否用装饰器 |
|:-----|:-----------|
| 日志、监控、性能计时 | ✅ 用 |
| 权限检查、参数验证 | ✅ 用 |
| 错误处理、重试 | ✅ 用 |
| 缓存、限流 | ✅ 用 |
| 核心业务逻辑 | ❌ 不用 |
| 一次性代码 | ❌ 不用 |

### 跨语言思维

- **Python**：装饰器是一等公民，灵活但需要理解闭包
- **Go**：显式包装，啰嗦但清晰
- **Java**：注解 + 框架，强大但依赖框架
- **TypeScript**：实验性，不稳定
- **Rust**：编译期宏，复杂但性能最优

**选择标准**：Python 写业务代码时，装饰器是最优雅的方案。

---

**参考资料**:
- [PEP 318 – Decorators for Functions and Methods](https://www.python.org/dev/peps/pep-0318/)
- [functools.wraps 文档](https://docs.python.org/3/library/functools.html#functools.wraps)
- [Real Python: Primer on Python Decorators](https://realpython.com/primer-on-python-decorators/)
