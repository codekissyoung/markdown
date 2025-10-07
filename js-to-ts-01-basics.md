# JS 开发者转向 TypeScript - 第1篇：基础迁移
TypeScript 的目标就是解决这些问题。

## 🚀 快速上手 - 3步完成第一个 TS 文件

### 第1步：安装配置

```bash
# 安装 TypeScript
npm install -g typescript

# 初始化配置文件
tsc --init
```

**推荐的 tsconfig.json 配置**：
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 第2步：类型注解

从 JS 到 TS，只需要给变量添加类型注解：

```javascript
// JavaScript
function calculateTotal(price, quantity, discount) {
  return price * quantity * (1 - discount);
}
```

```typescript
// TypeScript
function calculateTotal(
  price: number,
  quantity: number,
  discount: number
): number {
  return price * quantity * (1 - discount);
}
```

### 第3步：编译运行

```bash
# 编译 TS 文件
tsc app.ts

# 运行生成的 JS 文件
node app.js
```

## 📊 核心类型系统 - 掌握这6个就够了

### 1. 基础类型

```typescript
// 字符串
let name: string = 'link';

// 数字
let age: number = 28;

// 布尔值
let isActive: boolean = true;

// 数组
let tags: string[] = ['javascript', 'typescript'];
let scores: number[] = [95, 88, 76];

// 对象
let user: { name: string; age: number } = {
  name: 'link',
  age: 28
};

// 函数
let greet: (name: string) => string = (name) => `Hello ${name}`;
```

### 2. 数组类型

```typescript
// 类型 + 方括号
let numbers: number[] = [1, 2, 3];

// 泛型数组（更推荐）
let strings: Array<string> = ['a', 'b', 'c'];

// 混合类型数组
let mixed: (string | number)[] = ['hello', 123, 'world'];
```

### 3. 对象类型

```typescript
// 简单对象
let person: {
  name: string;
  age: number;
} = {
  name: 'link',
  age: 28
};

// 可选属性
let config: {
  host: string;
  port?: number;  // ? 表示可选
} = {
  host: 'localhost'
};
```

### 4. 函数类型

```typescript
// 函数声明
function add(a: number, b: number): number {
  return a + b;
}

// 箭头函数
const multiply = (a: number, b: number): number => a * b;

// 函数表达式
const divide: (a: number, b: number) => number = (a, b) => a / b;
```

### 5. 联合类型

```typescript
// 多种可能的类型
let id: string | number;
id = 'abc123';  // ✅
id = 123;       // ✅
id = true;      // ❌

// 实际应用：状态管理
type Status = 'loading' | 'success' | 'error';
let currentStatus: Status = 'loading';
```

### 6. 字面量类型

```typescript
// 具体的值作为类型
type Theme = 'light' | 'dark';
type ButtonSize = 'small' | 'medium' | 'large';

// 配置对象
type AppConfig = {
  theme: Theme;
  debug: boolean;
  version: 1 | 2 | 3;  // 只能是 1、2、3
};
```

## 🔧 实际项目改造

### 场景1：API 响应处理

```javascript
// JavaScript
async function fetchUser(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();

  if (data.success) {
    return data.user;
  } else {
    throw new Error(data.message);
  }
}
```

```typescript
// TypeScript
type User = {
  id: string;
  name: string;
  email: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/api/users/${userId}`);
  const data: ApiResponse<User> = await response.json();

  if (data.success && data.data) {
    return data.data;
  } else {
    throw new Error(data.message || 'Unknown error');
  }
}
```

### 场景2：事件处理

```javascript
// JavaScript
function handleClick(event) {
  const button = event.target;
  if (button.dataset.action === 'delete') {
    const id = button.dataset.id;
    deleteItem(id);
  }
}
```

```typescript
// TypeScript
function handleClick(event: MouseEvent): void {
  const button = event.target as HTMLButtonElement;
  if (button.dataset.action === 'delete') {
    const id = button.dataset.id;
    deleteItem(id);
  }
}
```

## 💡 实用技巧

### 1. 类型推导 - 减少冗余

```typescript
// TypeScript 能自动推导类型，无需重复声明
let name = 'link';        // 自动推导为 string
let numbers = [1, 2, 3];  // 自动推导为 number[]
let user = {              // 自动推导对象类型
  name: 'link',
  age: 28
};
```

### 2. 类型断言 - 临时告诉 TS 类型

```typescript
// 当你比 TypeScript 更清楚类型时使用
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const input = document.querySelector('input') as HTMLInputElement;

// 或者使用尖括号语法（JSX 中不支持）
const button = <HTMLButtonElement>document.getElementById('btn');
```

### 3. any 类型 - 临时方案

```typescript
// 迁移期间的妥协方案
function processData(data: any): any {
  // 暂时使用 any，逐步完善类型
  return data;
}
```

## ⚠️ 常见陷阱

### 1. undefined 和 null

```typescript
// 严格模式下，不能给非空类型赋值 null/undefined
let name: string = 'link';
name = null;  // ❌ 编译错误（strictNullChecks: true）

// 解决方案：联合类型
let name: string | null = 'link';
name = null;  // ✅
```

### 2. 对象属性访问

```typescript
interface User {
  name: string;
  profile?: {
    email: string;
  };
}

function getUserEmail(user: User): string {
  // ❌ 可能的运行时错误
  return user.profile.email;

  // ✅ 安全访问
  return user.profile?.email || 'No email';
}
```

## 🎯 迁移策略

### 渐进式迁移

1. **第一步**：新功能用 TS 编写
2. **第二步**：核心模块添加类型注解
3. **第三步**：逐步替换现有 JS 文件
4. **第四步**：启用严格模式

### 团队协作

```typescript
// 使用 JSDoc 为现有 JS 代码添加类型信息
/**
 * @param {string} name - 用户名
 * @param {number} age - 用户年龄
 * @returns {string} 格式化的用户信息
 */
function formatUserInfo(name, age) {
  return `${name} (${age}岁)`;
}
```

---

**下一篇预告**：实战项目类型改造 - 真实项目中的类型系统设计

*记住：先用起来，再追求完美。*