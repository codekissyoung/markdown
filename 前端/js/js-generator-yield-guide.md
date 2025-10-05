# JavaScript Generator 与 Yield - 历史遗产指南

> **核心结论**: Generator 在现代开发中用得很少(< 1%)，async/await 已经替代了它的大部分应用场景。了解概念即可，不必深入。

## 一、什么是 Generator？

Generator（生成器）是 ES6 (2015年) 引入的特殊函数，可以**暂停执行**和**恢复执行**，用 `yield` 控制暂停点。

### 基本语法

```javascript
// 定义生成器函数 (function* 带星号)
function* myGenerator() {
    console.log('开始执行');
    yield 1;  // 第一个暂停点，返回 1
    console.log('继续执行');
    yield 2;  // 第二个暂停点，返回 2
    console.log('最后执行');
    return 3; // 结束
}

// 调用生成器函数返回迭代器对象
const gen = myGenerator();

// 调用 next() 执行到下一个 yield
console.log(gen.next());  // {value: 1, done: false}
// 输出: "开始执行"

console.log(gen.next());  // {value: 2, done: false}
// 输出: "继续执行"

console.log(gen.next());  // {value: 3, done: true}
// 输出: "最后执行"

console.log(gen.next());  // {value: undefined, done: true}
```

### 执行流程详解

```javascript
function* counter() {
    console.log('1. 开始');
    yield 'A';
    console.log('2. yield A 之后');
    yield 'B';
    console.log('3. yield B 之后');
    yield 'C';
    console.log('4. 结束');
}

const gen = counter();

// 第1次 next(): 执行到第一个 yield
gen.next();
// 输出: "1. 开始"
// 返回: {value: 'A', done: false}

// 第2次 next(): 从上次 yield 继续执行到下一个 yield
gen.next();
// 输出: "2. yield A 之后"
// 返回: {value: 'B', done: false}

// 第3次 next()
gen.next();
// 输出: "3. yield B 之后"
// 返回: {value: 'C', done: false}

// 第4次 next()
gen.next();
// 输出: "4. 结束"
// 返回: {value: undefined, done: true}
```

## 二、核心特性

### 1. yield 可以双向传值

```javascript
function* echo() {
    const a = yield '请输入第一个值';
    console.log('收到:', a);

    const b = yield '请输入第二个值';
    console.log('收到:', b);

    return a + b;
}

const gen = echo();

console.log(gen.next());      // {value: '请输入第一个值', done: false}
console.log(gen.next(10));    // 输出: "收到: 10"
                              // {value: '请输入第二个值', done: false}
console.log(gen.next(20));    // 输出: "收到: 20"
                              // {value: 30, done: true}
```

**关键理解**：
- `yield` 向外传值：`gen.next()` 的返回值
- `next(value)` 向内传值：作为上一个 `yield` 的返回值

### 2. 可迭代对象

```javascript
function* range(start, end) {
    for (let i = start; i <= end; i++) {
        yield i;
    }
}

// 使用 for...of 遍历
for (let num of range(1, 5)) {
    console.log(num);  // 1, 2, 3, 4, 5
}

// 扩展运算符
const arr = [...range(1, 3)];
console.log(arr);  // [1, 2, 3]
```

### 3. yield* 委托生成器

```javascript
function* gen1() {
    yield 'A';
    yield 'B';
}

function* gen2() {
    yield 1;
    yield* gen1();  // 委托给 gen1
    yield 2;
}

console.log([...gen2()]);  // [1, 'A', 'B', 2]
```

## 三、为什么用得少？

### 原因1: async/await 已经替代异步场景

```javascript
// ❌ 以前用 Generator 处理异步 (2015-2017年流行)
function* fetchUser() {
    const user = yield fetch('/api/user');
    const posts = yield fetch(`/api/posts/${user.id}`);
    return posts;
}

// 需要配合 co 库或自己写执行器
const co = require('co');
co(fetchUser()).then(posts => console.log(posts));

// ✅ 现在直接用 async/await (2017年后成为标准)
async function fetchUser() {
    const user = await fetch('/api/user');
    const posts = await fetch(`/api/posts/${user.id}`);
    return posts;
}

// 使用更简单
fetchUser().then(posts => console.log(posts));
```

**历史演进**:
```
2012年: Callback Hell (回调地狱)
2015年: Promise + Generator (过渡方案)
2017年: async/await (最终方案) ✅
```

### 原因2: 大部分场景有更简单的替代方案

**场景1: 生成唯一ID**

```javascript
// ❌ Generator 版本 (繁琐)
function* idGen() {
    let id = 1;
    while(true) yield id++;
}
const gen = idGen();
const id1 = gen.next().value;  // 1
const id2 = gen.next().value;  // 2

// ✅ 闭包版本 (简单直观)
function createIdGen() {
    let id = 0;
    return () => ++id;
}
const getId = createIdGen();
const id1 = getId();  // 1
const id2 = getId();  // 2
```

**场景2: 数据遍历**

```javascript
// ❌ Generator 版本
function* filter(arr, predicate) {
    for (let item of arr) {
        if (predicate(item)) yield item;
    }
}
const result = [...filter([1,2,3,4,5], x => x > 2)];

// ✅ 数组方法 (更常用)
const result = [1,2,3,4,5].filter(x => x > 2);
```

### 实际开发占比

```
async/await       ████████████████████ 95%
Promise           ██████ 4%
Generator         ▏ <1%
```

## 四、极少数会用到的场景

### 1. Redux-Saga (特定框架)

```javascript
// Redux-Saga 用 Generator 处理副作用
function* watchFetchUser() {
    yield takeEvery('FETCH_USER', fetchUser);
}

function* fetchUser(action) {
    try {
        const user = yield call(api.fetchUser, action.userId);
        yield put({type: 'FETCH_USER_SUCCESS', user});
    } catch (e) {
        yield put({type: 'FETCH_USER_FAILED', error: e});
    }
}
```

**但是**: 现在很多项目已经转向 Redux-Toolkit 的 `createAsyncThunk`，不再需要 Saga。

### 2. 无限序列生成

```javascript
// 斐波那契数列
function* fibonacci() {
    let [a, b] = [0, 1];
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

// 取前10个
function* take(n, iterable) {
    let count = 0;
    for (let item of iterable) {
        if (count++ >= n) return;
        yield item;
    }
}

console.log([...take(10, fibonacci())]);
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

**但是**: 前端很少需要无限序列，通常用数组就够了。

### 3. 自定义迭代器（罕见）

```javascript
// 让对象可迭代
class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    *[Symbol.iterator]() {
        for (let i = this.start; i <= this.end; i++) {
            yield i;
        }
    }
}

const range = new Range(1, 5);
for (let num of range) {
    console.log(num);  // 1, 2, 3, 4, 5
}
```

**但是**: 99%的情况下直接用数组就够了。

### 4. 处理超大数据流（前端罕见）

```javascript
// 处理几百万条数据，避免内存爆炸
async function* readHugeFile(filePath) {
    const CHUNK_SIZE = 1000;
    let offset = 0;

    while (true) {
        const chunk = await readFileChunk(filePath, offset, CHUNK_SIZE);
        if (!chunk) break;
        yield chunk;
        offset += CHUNK_SIZE;
    }
}

// 使用
for await (let chunk of readHugeFile('huge.csv')) {
    processChunk(chunk);  // 一次只处理一块，不占太多内存
}
```

**但是**: 这种场景在前端极少，后端用 Node.js Stream 更专业。

## 五、Generator vs 其他方案

### Generator vs async/await

```javascript
// Generator (需要手动写执行器，繁琐)
function* fetchData() {
    const user = yield fetch('/api/user').then(r => r.json());
    const posts = yield fetch(`/api/posts/${user.id}`).then(r => r.json());
    return posts;
}

// 需要执行器
function run(gen) {
    const g = gen();
    function step(value) {
        const result = g.next(value);
        if (result.done) return result.value;
        result.value.then(data => step(data));
    }
    step();
}
run(fetchData);

// async/await (内置执行器，简单)
async function fetchData() {
    const user = await fetch('/api/user').then(r => r.json());
    const posts = await fetch(`/api/posts/${user.id}`).then(r => r.json());
    return posts;
}
fetchData();  // 直接调用
```

### Generator vs 普通函数

```javascript
// 普通函数: 一次性执行完
function normal() {
    console.log('A');
    console.log('B');
    console.log('C');
    return 'done';
}
normal();  // 输出: A B C，一次性全部执行

// Generator: 可以暂停
function* generator() {
    console.log('A');
    yield 1;
    console.log('B');
    yield 2;
    console.log('C');
    return 'done';
}
const gen = generator();
gen.next();  // 输出: A
gen.next();  // 输出: B
gen.next();  // 输出: C
```

### Generator vs 闭包

```javascript
// 需求: 创建计数器

// Generator 版本
function* counter() {
    let count = 0;
    while(true) {
        yield ++count;
    }
}
const gen = counter();
gen.next().value;  // 1
gen.next().value;  // 2

// 闭包版本 (更简单)
function createCounter() {
    let count = 0;
    return () => ++count;
}
const counter = createCounter();
counter();  // 1
counter();  // 2
```

## 六、对比 Go 语言

Go 没有 Generator，但 channel 有类似的"生产-消费"模式：

```go
// Go 的 channel 实现类似效果
func fibonacci() <-chan int {
    ch := make(chan int)
    go func() {
        a, b := 0, 1
        for {
            ch <- a
            a, b = b, a+b
        }
    }()
    return ch
}

// 使用
fib := fibonacci()
for i := 0; i < 10; i++ {
    fmt.Println(<-fib)  // 0 1 1 2 3 5 8 13 21 34
}
```

**对比**:
- Go channel: 并发通信，真正的生产者-消费者
- JS Generator: 单线程，只是暂停/恢复执行

## 七、学习建议

### 优先级排序

**高优先级 (先学这些)**:
```javascript
✅ async/await
✅ Promise
✅ 数组方法 (map/filter/reduce)
✅ 闭包
✅ 箭头函数
```

**中优先级**:
```javascript
⭕ 事件循环
⭕ this 绑定
⭕ 模块化 (import/export)
⭕ 解构赋值
```

**低优先级 (可以先跳过)**:
```javascript
⚪ Generator (了解概念即可)
⚪ Proxy/Reflect
⚪ Symbol
⚪ 装饰器
```

### 什么时候回头学 Generator？

1. **项目用了 Redux-Saga** - 需要理解代码
2. **面试问到** - "Generator 和 async/await 的关系？"
3. **想深入理解原理** - async/await 是 Generator + Promise 的语法糖
4. **阅读老代码** - 2015-2017年的项目可能用到

### 现在应该优先掌握

```javascript
// 1. Promise 基础
fetch('/api/user')
    .then(res => res.json())
    .then(user => console.log(user))
    .catch(err => console.error(err));

// 2. async/await
async function fetchUser() {
    try {
        const res = await fetch('/api/user');
        const user = await res.json();
        console.log(user);
    } catch (err) {
        console.error(err);
    }
}

// 3. 数组处理
const data = [1, 2, 3, 4, 5];
const result = data
    .filter(x => x > 2)
    .map(x => x * 2);  // [6, 8, 10]

// 4. 闭包应用
function createCounter() {
    let count = 0;
    return {
        increment: () => ++count,
        getValue: () => count
    };
}
```

## 八、核心总结

### Generator 的本质

- 📌 **状态机**: 可以暂停和恢复执行
- 🔄 **迭代器**: 实现了迭代器协议
- ⏸️ **惰性计算**: 按需生成值，不一次性计算

### 为什么是"历史遗产"？

| 时期 | 异步解决方案 | 状态 |
|------|------------|------|
| 2012-2015 | Callback | 已淘汰 |
| 2015-2017 | Promise + Generator | **过渡方案** |
| 2017-至今 | async/await | ✅ 现代标准 |

### 使用场景对比

| 场景 | Generator | 推荐方案 | 占比 |
|------|-----------|---------|------|
| 异步编程 | ❌ 繁琐 | ✅ async/await | 95% |
| 生成序列 | ⚪ 可用 | ✅ 闭包/数组 | 4% |
| 遍历数据 | ⚪ 可用 | ✅ for/map | 99% |
| 状态管理 | ⚪ Saga | ✅ Redux-Toolkit | 大部分 |
| 真正需要 | ✅ | - | <1% |

### 关键概念（面试可能问）

```javascript
// Generator 是 async/await 的底层实现原理
function* gen() {
    const x = yield Promise.resolve(1);
    const y = yield Promise.resolve(2);
    return x + y;
}

// async/await 是语法糖
async function asyncFn() {
    const x = await Promise.resolve(1);
    const y = await Promise.resolve(2);
    return x + y;
}

// 本质上，async/await = Generator + 自动执行器
```

### 一句话总结

**Generator 是 JavaScript 异步编程演进过程中的过渡方案（2015-2017），现在 async/await 已经成为标准。日常开发中 99% 的场景都有更好的替代方案，了解概念即可，不必深入学习。**

---

## 附录: Generator 方法速查

### 基本方法

```javascript
function* gen() {
    yield 1;
    yield 2;
    yield 3;
}

const g = gen();

// next() - 执行到下一个 yield
g.next();  // {value: 1, done: false}

// return() - 提前结束
g.return(99);  // {value: 99, done: true}

// throw() - 抛出异常
g.throw('error');  // 在 generator 内部抛出错误
```

### 完整示例

```javascript
function* gen() {
    try {
        const x = yield 1;
        console.log('x:', x);
        const y = yield 2;
        console.log('y:', y);
        return x + y;
    } catch (e) {
        console.log('捕获错误:', e);
    }
}

const g = gen();
console.log(g.next());      // {value: 1, done: false}
console.log(g.next(10));    // x: 10, {value: 2, done: false}
console.log(g.throw('err')); // 捕获错误: err, {value: undefined, done: true}
```

---

**最后建议**: 把精力放在 async/await、Promise、数组方法这些高频使用的特性上，Generator 留到真正需要时再深入学习！
