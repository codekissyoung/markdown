# JavaScript 遍历方法完全指南

## 核心概念对比

### `for...in` vs `for...of`

| 特性 | `for...in` | `for...of` |
|------|-----------|-----------|
| **遍历内容** | 键名(索引/属性名) | 值 |
| **返回类型** | 字符串 | 原始类型 |
| **适用对象** | 所有可枚举对象 | 可迭代对象 |
| **原型链** | 会遍历继承属性 | 不遍历原型 |
| **ES版本** | ES5 | ES6 |

## 一、`for...in` - 遍历键名

### 基本用法

```js
const obj = {a: 1, b: 2, c: 3};

for (const key in obj) {
  console.log(key);        // 'a', 'b', 'c'
  console.log(obj[key]);   // 1, 2, 3
}
```

### 数组遍历陷阱

```js
const arr = [10, 20, 30];
arr.custom = 'test';  // 自定义属性

for (const key in arr) {
  console.log(key);        // '0', '1', '2', 'custom' ⚠️
  console.log(typeof key); // 'string' ⚠️ 索引是字符串
}
```

### 原型链问题

```js
Array.prototype.customMethod = function() {};

const arr = [1, 2, 3];
for (const key in arr) {
  console.log(key); // '0', '1', '2', 'customMethod' ⚠️ 原型属性也遍历
}

// 解决方案: hasOwnProperty 过滤
for (const key in arr) {
  if (arr.hasOwnProperty(key)) {
    console.log(key); // '0', '1', '2'
  }
}
```

### 适用场景

- ✅ 遍历对象自有属性
- ✅ 获取对象所有键名
- ❌ 遍历数组(索引顺序不保证)

## 二、`for...of` - 遍历值

### 基本用法

```js
const arr = [10, 20, 30];

for (const value of arr) {
  console.log(value);      // 10, 20, 30
  console.log(typeof value); // 'number'
}
```

### 可迭代对象

```js
// 1. 数组
for (const num of [1, 2, 3]) {
  console.log(num); // 1, 2, 3
}

// 2. 字符串
for (const char of 'abc') {
  console.log(char); // 'a', 'b', 'c'
}

// 3. Map
const map = new Map([['a', 1], ['b', 2]]);
for (const [key, value] of map) {
  console.log(key, value); // 'a' 1, 'b' 2
}

// 4. Set
const set = new Set([1, 2, 3]);
for (const value of set) {
  console.log(value); // 1, 2, 3
}

// 5. arguments 对象
function demo() {
  for (const arg of arguments) {
    console.log(arg);
  }
}
demo(10, 20); // 10, 20

// 6. NodeList (DOM)
for (const div of document.querySelectorAll('div')) {
  console.log(div);
}
```

### 忽略自定义属性

```js
const arr = [10, 20, 30];
arr.custom = 'test';

for (const value of arr) {
  console.log(value); // 10, 20, 30 (忽略 custom)
}
```

### 不能遍历普通对象

```js
const obj = {a: 1, b: 2};

for (const value of obj) {
  console.log(value); // ❌ TypeError: obj is not iterable
}

// 解决方案: Object.values/entries
for (const value of Object.values(obj)) {
  console.log(value); // 1, 2
}

for (const [key, value] of Object.entries(obj)) {
  console.log(key, value); // 'a' 1, 'b' 2
}
```

### 适用场景

- ✅ 遍历数组元素
- ✅ 遍历字符串字符
- ✅ 遍历 Map/Set
- ❌ 遍历普通对象

## 三、传统 `for` 循环

```js
const arr = [10, 20, 30];

// 标准写法
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]); // 10, 20, 30
}

// 性能优化: 缓存长度
for (let i = 0, len = arr.length; i < len; i++) {
  console.log(arr[i]);
}

// 倒序遍历
for (let i = arr.length - 1; i >= 0; i--) {
  console.log(arr[i]); // 30, 20, 10
}
```

### 适用场景

- ✅ 需要索引操作
- ✅ 需要中途 break/continue
- ✅ 性能敏感场景

## 四、数组方法

### `forEach` - 不可中断

```js
const arr = [1, 2, 3, 4, 5];

arr.forEach((value, index, array) => {
  console.log(value, index);
});

// ⚠️ 无法 break/continue
arr.forEach(value => {
  if (value === 3) return; // 只跳过当前迭代，不能终止循环
  console.log(value); // 1, 2, 4, 5
});
```

### `map` - 映射转换

```js
const arr = [1, 2, 3];
const doubled = arr.map(x => x * 2);
console.log(doubled); // [2, 4, 6]

// 与 forEach 对比
const result1 = [];
arr.forEach(x => result1.push(x * 2)); // 需要外部数组

const result2 = arr.map(x => x * 2);   // 直接返回新数组
```

#### 经典案例: 字符串转数字 (禁用parseInt)

```js
function string2int(s) {
  return s.split('')
          .map(c => c.charCodeAt(0) - '0'.charCodeAt(0))
          .reduce((acc, digit) => acc * 10 + digit, 0);
}

// 执行流程详解:
// '12345'
// → split('')       → ['1','2','3','4','5']
// → map()           → [1, 2, 3, 4, 5]
// → reduce()        → 12345

// reduce累加过程:
// 第1轮: acc=0,    digit=1  →  0 * 10 + 1 = 1
// 第2轮: acc=1,    digit=2  →  1 * 10 + 2 = 12
// 第3轮: acc=12,   digit=3  →  12 * 10 + 3 = 123
// 第4轮: acc=123,  digit=4  →  123 * 10 + 4 = 1234
// 第5轮: acc=1234, digit=5  →  1234 * 10 + 5 = 12345

// 对比Go的实现:
/*
func string2int(s string) int {
    result := 0
    for _, c := range s {
        digit := int(c - '0')
        result = result*10 + digit
    }
    return result
}
*/
```

**技术要点**:
- `charCodeAt(0)`: 获取字符的Unicode码值
- ASCII数字字符连续排列: `'0'→48, '1'→49, ..., '9'→57`
- `c.charCodeAt(0) - '0'.charCodeAt(0)`: 字符转数字
- `acc * 10 + digit`: 模拟十进制进位累加

#### ⚠️ 经典陷阱: map + parseInt

```js
let arr = ['1', '2', '3'];
let r = arr.map(parseInt);
console.log(r);  // [1, NaN, NaN] ❌
```

**问题根源**: `map` 传递3个参数给回调函数

```js
arr.map((element, index, array) => { ... })

// parseInt 接受2个参数:
parseInt(string, radix)  // radix 是进制基数(2-36)

// 实际执行:
arr.map(parseInt)
// 等价于:
arr.map((element, index) => parseInt(element, index))

// 展开执行:
parseInt('1', 0)  // radix=0 → 当作10进制 → 1 ✅
parseInt('2', 1)  // radix=1 → 无效进制 → NaN ❌
parseInt('3', 2)  // radix=2 → '3'不是合法二进制 → NaN ❌
```

**parseInt的radix规则**:
```js
radix = 0      → 自动判断(10进制或16进制)
radix = 1      → 无效,返回 NaN
radix = 2-36   → 按指定进制解析
radix 未传     → 默认10进制(ES5+)
```

**更多案例**:
```js
['10', '10', '10'].map(parseInt)
// 结果: [10, NaN, 2]
// parseInt('10', 0) → 10
// parseInt('10', 1) → NaN
// parseInt('10', 2) → 2 (二进制'10' = 十进制2)

['1', '2', '3'].map(parseFloat)
// 结果: [1, 2, 3] ✅
// parseFloat只接受1个参数,不受index影响
```

**正确写法**:
```js
// 方法1: 箭头函数只传第一个参数
arr.map(item => parseInt(item))  // [1, 2, 3]

// 方法2: 明确指定进制
arr.map(item => parseInt(item, 10))  // [1, 2, 3]

// 方法3: 使用Number()
arr.map(Number)  // [1, 2, 3]
```

### `filter` - 过滤筛选

```js
const arr = [1, 2, 3, 4, 5];
const even = arr.filter(x => x % 2 === 0);
console.log(even); // [2, 4]
```

#### 🌟 经典技巧: filter 数组去重

```js
let arr = ['apple', 'strawberry', 'banana', 'pear', 'apple', 'orange', 'orange', 'strawberry'];

let r = arr.filter(function (element, index, self) {
    return self.indexOf(element) === index;
});

console.log(r);
// ['apple', 'strawberry', 'banana', 'pear', 'orange']
```

**核心原理**: 利用 `indexOf()` 永远返回**第一次出现的位置**

```js
// indexOf 的特性:
arr.indexOf('apple')  // 永远返回 0 (第一个apple的索引)

// 去重逻辑:
// - 第一次出现: indexOf(element) === index → true  ✅ 保留
// - 重复出现:   indexOf(element) !== index → false ❌ 过滤
```

**执行流程详解**:
```js
arr = ['apple', 'strawberry', 'banana', 'pear', 'apple', 'orange', 'orange', 'strawberry']
//      索引: 0        1          2        3       4        5         6         7

// filter 遍历每个元素:
index=0, element='apple'       → indexOf('apple')=0       → 0===0 ✅ 保留
index=1, element='strawberry'  → indexOf('strawberry')=1  → 1===1 ✅ 保留
index=2, element='banana'      → indexOf('banana')=2      → 2===2 ✅ 保留
index=3, element='pear'        → indexOf('pear')=3        → 3===3 ✅ 保留
index=4, element='apple'       → indexOf('apple')=0       → 0!==4 ❌ 过滤 (首次在索引0)
index=5, element='orange'      → indexOf('orange')=5      → 5===5 ✅ 保留
index=6, element='orange'      → indexOf('orange')=5      → 5!==6 ❌ 过滤
index=7, element='strawberry'  → indexOf('strawberry')=1  → 1!==7 ❌ 过滤
```

**其他去重方法对比**:
```js
// 方法1: Set (最简洁, 最快 O(n))
let r1 = [...new Set(arr)];

// 方法2: filter + indexOf (优雅但慢 O(n²))
let r2 = arr.filter((item, index, self) => self.indexOf(item) === index);

// 方法3: reduce + includes (O(n²))
let r3 = arr.reduce((acc, item) => {
  if (!acc.includes(item)) acc.push(item);
  return acc;
}, []);

// 方法4: 对象键去重 (O(n))
let r4 = Object.keys(arr.reduce((acc, item) => {
  acc[item] = true;
  return acc;
}, {}));
```

**对比 Go 实现**:
```go
// Go 去重 (用 map)
func unique(arr []string) []string {
    seen := make(map[string]bool)
    result := []string{}

    for _, item := range arr {
        if !seen[item] {
            seen[item] = true
            result = append(result, item)
        }
    }
    return result
}
```

**总结**:
- ✅ **优点**: 代码简洁优雅, 一行搞定, 无需额外数据结构
- ⚠️ **缺点**: 性能差 (O(n²)), 每次 `indexOf` 都要遍历整个数组
- 💡 **实际项目推荐**: `[...new Set(arr)]` (性能最优)
- 🎯 **学习价值**: 理解 `indexOf` 特性和 `filter` 的 `index` 参数妙用

### `reduce` - 累积计算

```js
const arr = [1, 2, 3, 4];

// 求和
const sum = arr.reduce((acc, cur) => acc + cur, 0);
console.log(sum); // 10

// 对象累积
const users = [{id: 1, name: 'A'}, {id: 2, name: 'B'}];
const userMap = users.reduce((map, user) => {
  map[user.id] = user;
  return map;
}, {});
// {1: {id: 1, name: 'A'}, 2: {id: 2, name: 'B'}}
```

### `some` / `every` - 条件判断

```js
const arr = [1, 2, 3, 4, 5];

// some: 至少一个满足
const hasEven = arr.some(x => x % 2 === 0);
console.log(hasEven); // true

// every: 全部满足
const allPositive = arr.every(x => x > 0);
console.log(allPositive); // true
```

### `find` / `findIndex` - 查找元素

```js
const arr = [1, 2, 3, 4, 5];

const found = arr.find(x => x > 3);
console.log(found); // 4 (第一个满足条件的值)

const index = arr.findIndex(x => x > 3);
console.log(index); // 3 (第一个满足条件的索引)
```

## 五、对象遍历方法

### `Object.keys`

```js
const obj = {a: 1, b: 2, c: 3};

Object.keys(obj).forEach(key => {
  console.log(key, obj[key]); // 'a' 1, 'b' 2, 'c' 3
});
```

### `Object.values`

```js
const obj = {a: 1, b: 2, c: 3};

Object.values(obj).forEach(value => {
  console.log(value); // 1, 2, 3
});
```

### `Object.entries`

```js
const obj = {a: 1, b: 2, c: 3};

Object.entries(obj).forEach(([key, value]) => {
  console.log(key, value); // 'a' 1, 'b' 2, 'c' 3
});

// 配合 for...of
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}
```

## 六、实战对比

### 场景1: 数组求和

```js
const arr = [1, 2, 3, 4, 5];

// 传统 for (最快)
let sum1 = 0;
for (let i = 0; i < arr.length; i++) {
  sum1 += arr[i];
}

// for...of (简洁)
let sum2 = 0;
for (const num of arr) {
  sum2 += num;
}

// reduce (函数式)
const sum3 = arr.reduce((acc, cur) => acc + cur, 0);
```

### 场景2: 对象转换

```js
const obj = {a: 1, b: 2, c: 3};

// 键值互换
const swapped = Object.entries(obj).reduce((acc, [k, v]) => {
  acc[v] = k;
  return acc;
}, {});
// {1: 'a', 2: 'b', 3: 'c'}
```

### 场景3: 数组去重

```js
const arr = [1, 2, 2, 3, 3, 4];

// 方法1: Set + for...of
const unique1 = [];
const set = new Set(arr);
for (const num of set) {
  unique1.push(num);
}

// 方法2: Set + 扩展运算符
const unique2 = [...new Set(arr)];

// 方法3: filter
const unique3 = arr.filter((item, index) => arr.indexOf(item) === index);
```

## 七、性能对比

```js
const arr = new Array(1000000).fill(0).map((_, i) => i);

console.time('for');
let sum1 = 0;
for (let i = 0; i < arr.length; i++) sum1 += arr[i];
console.timeEnd('for'); // ~5ms

console.time('for...of');
let sum2 = 0;
for (const num of arr) sum2 += num;
console.timeEnd('for...of'); // ~10ms

console.time('forEach');
let sum3 = 0;
arr.forEach(num => sum3 += num);
console.timeEnd('forEach'); // ~15ms

console.time('reduce');
const sum4 = arr.reduce((a, b) => a + b, 0);
console.timeEnd('reduce'); // ~20ms
```

**性能排序**: `for` > `for...of` > `forEach` > `reduce`

## 八、选择建议

### 推荐用法

```js
// ✅ 遍历数组 - 优先 for...of
for (const item of array) {}

// ✅ 遍历对象 - 优先 Object.entries
for (const [key, value] of Object.entries(obj)) {}

// ✅ 需要索引 - 用 forEach
array.forEach((item, index) => {});

// ✅ 转换数组 - 用 map
const result = array.map(x => x * 2);

// ✅ 过滤数组 - 用 filter
const result = array.filter(x => x > 0);

// ✅ 累积计算 - 用 reduce
const sum = array.reduce((a, b) => a + b, 0);

// ✅ 性能敏感 - 用传统 for
for (let i = 0; i < array.length; i++) {}
```

### 避免用法

```js
// ❌ 用 for...in 遍历数组
for (const key in array) {} // 索引是字符串 + 遍历原型

// ❌ 用 forEach 需要中途退出
array.forEach(item => {
  if (condition) break; // ❌ 语法错误
});

// ❌ 用 for...of 遍历普通对象
for (const value of obj) {} // ❌ TypeError
```

## 九、迭代器协议

### 自定义可迭代对象

```js
const range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;

    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
};

for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

// 使用扩展运算符
console.log([...range]); // [1, 2, 3, 4, 5]
```

## 总结

| 场景 | 推荐方法 | 原因 |
|------|---------|------|
| 遍历数组元素 | `for...of` | 简洁清晰 |
| 遍历对象属性 | `Object.entries` + `for...of` | ES6 标准 |
| 需要索引操作 | `forEach` / 传统 `for` | 直接获取索引 |
| 数组转换 | `map` | 函数式编程 |
| 数组过滤 | `filter` | 语义明确 |
| 累积计算 | `reduce` | 强大灵活 |
| 性能优先 | 传统 `for` | 执行最快 |
| 需要中途退出 | 传统 `for` | 支持 break |

---

**核心原则**:
- **数组**: 优先 `for...of` 和数组方法
- **对象**: 优先 `Object.entries` + `for...of`
- **性能**: 传统 `for` 最快
- **可读性**: 函数式方法最清晰
