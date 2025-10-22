# TypeScript 类型系统完全指南

> 基于个人实践经验的重构版本，更清晰的结构和实用见解

## 🎯 为什么需要 TypeScript 类型

作为 Go + PHP + JS 技术栈开发者，我发现 TypeScript 解决了 JavaScript 的核心痛点：

- **编译期错误发现**：类似 Go 的静态检查，避免运行时意外
- **代码提示**：比 PHPStorm + PHP 更精准的智能提示
- **重构安全**：像 Go 一样重构时能发现所有影响点

## 📊 基础类型体系

### 原始类型 (Primitive Types)

TypeScript 继承 JavaScript 的 8 种基本类型：

```typescript
// 布尔值 - 严格类型约束
let isLoading: boolean = false;
isLoading = 'true'; // ❌ 编译错误

// 字符串 - 模板字符串支持
let name: string = 'link';
let greeting: string = `Hello ${name}`;

// 数字 - 统一数字类型
let count: number = 42;
let price: number = 3.14;
let hex: number = 0xFF;

// 大整数 - 处理超大数字
let bigNum: bigint = 9007199254740991n;

// Symbol - 唯一标识符
let id: symbol = Symbol('user-id');

// 空值类型
let notDefined: undefined = undefined;
let empty: null = null;
```

### 包装对象类型的陷阱 ⚠️

```typescript
// ✅ 正确做法
let s3: string = 'hello';        // 推荐使用
let s4: String = new String('hello'); // 不推荐
```

**个人建议**：永远使用小写类型（`string`, `number`, `boolean`），避免包装对象类型。

## 🏗️ 对象类型系统

### object vs Object 类型区别

```typescript
// 小写 object - 狭义对象
let obj1: object = { name: 'link' };  // ✅
let obj2: object = [1, 2, 3];        // ✅
let obj3: object = () => {};         // ✅
let obj4: object = 'hello';          // ❌ 原始类型

// 大写 Object - 广义对象（几乎包含所有值）
let any1: Object = 'hello';          // ✅
let any2: Object = 123;              // ✅
let any3: Object = null;             // ❌ null 和 undefined 除外
```

**实际开发建议**：
- 使用 `object` 表示纯粹的对象/数组/函数
- 避免使用 `Object`，类型约束太宽松
- 更推荐使用接口或类型别名

## 🔧 高级类型特性

### 类型别名 (type)

类似 Go 的 `type` 定义，但更灵活：

```typescript
// 基础类型别名
type UserID = string;
type Age = number;

// 对象类型别名
type User = {
  id: UserID;
  name: string;
  age: Age;
};

// 函数类型别名
type EventHandler<T> = (event: T) => void;
```

### 联合类型 (Union Types)

**类似 PHP 的类型提示，但更强大**：

```typescript
// 多种可能类型
type Status = 'pending' | 'success' | 'error';
type ID = string | number;

// 实际应用
function processStatus(status: Status) {
  if (status === 'success') {
    // TypeScript 知道这里 status 只能是 'success'
  }
}
```

### 函数重载 vs 联合 / 泛型

当函数逻辑只是针对入参做轻量分支，而返回值结构保持一致时，一条带联合或泛型的签名往往比维护多条重载更省心：

- **差异小**：例如 `number` 和 `Date` 都格式化成字符串，用 `number | Date` 即可覆盖全部调用。
- **结构一致**：返回值只是包裹入参，直接用泛型让 TypeScript 推断即可。

```typescript
// 联合类型：同一签名覆盖两种输入
function format(data: number | Date): string {
  return data instanceof Date ? data.toISOString() : data.toFixed(2);
}

// 泛型：返回类型直接携带入参的精确信息
function wrap<T>(value: T) {
  return { ok: true as const, payload: value };
}

const a = format(3.14);                   // string
const b = format(new Date());             // string
const user = wrap({ id: 1, name: 'Go' }); // { ok: true; payload: { id: number; name: string } }
```

但当 API 存在“截然不同的调用语义”时，重载仍然不可替代：

- **参数数量/结构差异大**：`readFile(path, callback)` 与 `readFile(path, options, callback)`。
- **返回类型随入参精确变化**：事件监听根据事件名返回不同事件对象。
- **同名接口兼容多个调用方式**：例如既支持 Promise，也支持回调。

这类场景使用重载列出所有外部契约更清晰，也能为调用者提供最精确的类型提示。

### 交叉类型 (Intersection Types)

**类似 Go 的结构体嵌入**：

```typescript
type HasName = { name: string };
type HasAge = { age: number };

// 合并两个类型
type Person = HasName & HasAge;
// 等价于:
// type Person = {
//   name: string;
//   age: number;
// }
```

### 字面量类型

**将具体值作为类型**：

```typescript
type Theme = 'light' | 'dark';
type ButtonSize = 'small' | 'medium' | 'large';

// 配置对象
type Config = {
  theme: Theme;
  version: 1;  // 只能是数字 1
};
```

## 🛠️ 实用开发模式

### 1. 类型守卫 (Type Guards)

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(value: unknown) {
  if (isString(value)) {
    // TypeScript 知道 value 是 string 类型
    console.log(value.toUpperCase());
  }
}
```

### 2. 泛型约束

```typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength('hello');  // ✅
logLength([1, 2, 3]); // ✅
logLength(123);       // ❌ 没有length属性
```

### 3. 条件类型

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type Result = NonNullable<string | null>; // 结果是 string
```

## 💡 个人实践建议

### 从 Go/PHP 角度理解 TypeScript

| Go/PHP 概念 | TypeScript 对应 | 注意事项 |
|------------|----------------|----------|
| 接口定义 | Interface | TypeScript 接口更灵活 |
| 类型别名 | Type | Go 中只能为基础类型 |
| 结构体 | Type/Interface | TypeScript 可以后期扩展 |
| 泛型 | Generics | 概念相似，语法不同 |

### 开发中的最佳实践

1. **严格模式配置**：
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true
  }
}
```

2. **类型优先于接口**：
```typescript
// 推荐 - 类型别名
type User = { name: string; };

// 也可以 - 接口
interface IUser { name: string; }
```

3. **避免 any 类型**：
```typescript
// ❌ 避免
function processData(data: any) { }

// ✅ 推荐
function processData<T>(data: T) { }
// 或者使用 unknown
function processData(data: unknown) { }
```

## 🚀 进阶学习路径

1. **掌握基础类型系统** - 当前文档内容
2. **学习接口和类型组合** - 提高代码复用性
3. **掌握泛型编程** - 编写可复用组件
4. **理解类型推导** - 减少冗余类型声明
5. **实践类型体操** - 解决复杂类型问题

---

*基于实际开发经验整理，持续更新中...*
