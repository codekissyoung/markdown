# JS 开发者转向 TypeScript - 第3篇：常见陷阱和解决方案

> 避免在迁移过程中踩坑，这些问题几乎每个开发者都会遇到

## 🚨 陷阱1：类型与值的混淆

### 问题表现

```typescript
// ❌ 错误理解
let role: 'admin' | 'user' = 'admin';  // 这是类型，不是值
let roles = ['admin', 'user'];         // 这是值，不是类型

// 常见错误
function createUser(role: 'admin' | 'user') {
  // ...
}

const myRole = 'admin';
createUser(myRole); // ❌ 编译错误！
```

### 问题原因

TypeScript 的字面量类型过于严格，`myRole` 被推断为 `string` 类型，而不是具体的 `'admin'` 字面量类型。

### 解决方案

```typescript
// ✅ 方案1：使用 const 声明
const myRole = 'admin' as const;  // 确保是字面量类型
createUser(myRole);

// ✅ 方案2：明确类型
let myRole: 'admin' | 'user' = 'admin';
createUser(myRole);

// ✅ 方案3：使用枚举
enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

function createUser(role: UserRole) {
  // ...
}

createUser(UserRole.ADMIN);
```

## 🚨 陷阱2：可选属性的 undefined 处理

### 问题表现

```typescript
interface User {
  id: string;
  name: string;
  profile?: {
    bio: string;
    avatar?: string;
  };
}

function getUserBio(user: User): string {
  // ❌ 运行时错误！profile 可能是 undefined
  return user.profile.bio;
}

function processUser(user: User) {
  // ❌ 可能为 undefined
  console.log(user.profile.avatar.length);
}
```

### 解决方案

```typescript
// ✅ 方案1：可选链操作符 (?.)
function getUserBio(user: User): string {
  return user.profile?.bio || '暂无简介';
}

function getAvatarLength(user: User): number {
  return user.profile?.avatar?.length || 0;
}

// ✅ 方案2：类型守卫
function hasProfile(user: User): user is User & { profile: { bio: string } } {
  return !!(user.profile && user.profile.bio);
}

function processUser(user: User) {
  if (hasProfile(user)) {
    // TypeScript 知道这里 profile.bio 存在
    console.log(user.profile.bio);
  }
}

// ✅ 方案3：默认值
interface User {
  id: string;
  name: string;
  profile: {
    bio?: string;
    avatar?: string;
  };
}

function getUserBio(user: User): string {
  const profile = user.profile || {};
  return profile.bio || '暂无简介';
}
```

## 🚨 陷阱3：数组类型的陷阱

### 问题表现

```typescript
// ❌ 类型推导问题
let numbers = [1, 2, 3];  // 推导为 number[]
let mixed = [1, 'hello', true];  // 推导为 (string | number | boolean)[]

// ❌ 数组方法返回类型
function getUsers() {
  return fetch('/api/users').then(res => res.json());
}

// TypeScript 不知道返回的是 User[]
getUsers().then(users => {
  users.forEach(user => {
    console.log(user.name); // ❌ user 是 any 类型
  });
});
```

### 解决方案

```typescript
// ✅ 明确数组类型
let numbers: number[] = [1, 2, 3];
let mixed: (string | number | boolean)[] = [1, 'hello', true];

// ✅ 泛型数组
function getUsers(): Promise<User[]> {
  return fetch('/api/users').then(res => res.json());
}

// ✅ 类型断言（谨慎使用）
const users = await getUsers() as User[];
users.forEach(user => {
  console.log(user.name); // ✅ user 是 User 类型
});

// ✅ 类型守卫函数
function isUserArray(arr: any[]): arr is User[] {
  return arr.every(item =>
    typeof item.id === 'string' &&
    typeof item.name === 'string'
  );
}
```

## 🚨 陷阱4：事件处理的类型问题

### 问题表现

```typescript
// ❌ 事件类型推断错误
const button = document.getElementById('myButton');
button.addEventListener('click', (event) => {
  console.log(event.target.value); // ❌ target 可能不是 HTMLInputElement
});

// ❌ 自定义事件类型丢失
class EventEmitter {
  on(event: string, callback: (data: any) => void) {
    // 实现...
  }
}

const emitter = new EventEmitter();
emitter.on('user-login', (user) => {
  console.log(user.name); // ❌ user 是 any 类型
});
```

### 解决方案

```typescript
// ✅ 正确的事件类型
const button = document.getElementById('myButton') as HTMLButtonElement;
button.addEventListener('click', (event: MouseEvent) => {
  const target = event.target as HTMLButtonElement;
  console.log(target.value);
});

// ✅ 泛型事件处理器
interface TypedEventEmitter<T extends Record<string, any>> {
  on<K extends keyof T>(event: K, callback: (data: T[K]) => void): void;
  emit<K extends keyof T>(event: K, data: T[K]): void;
}

type AppEvents = {
  'user-login': { id: string; name: string; timestamp: Date };
  'user-logout': { id: string };
  'notification': { message: string; type: 'info' | 'warning' | 'error' };
};

class TypedEventBus implements TypedEventEmitter<AppEvents> {
  private listeners = new Map<string, Function[]>();

  on<K extends keyof AppEvents>(event: K, callback: (data: AppEvents[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit<K extends keyof AppEvents>(event: K, data: AppEvents[K]): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
}

// 使用示例
const eventBus = new TypedEventBus();
eventBus.on('user-login', (user) => {
  // ✅ user 类型安全
  console.log(`${user.name} logged in at ${user.timestamp}`);
});
```

## 🚨 陷阱5：动态属性访问

### 问题表现

```typescript
interface User {
  name: string;
  email: string;
  age: number;
}

function getUserProperty(user: User, property: string) {
  // ❌ 编译错误：property 不是 User 的键
  return user[property];
}

// ❌ 动态对象属性
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

function getConfigValue(key: string) {
  return config[key]; // ❌ 编译错误
}
```

### 解决方案

```typescript
// ✅ 使用 keyof 操作符
function getUserProperty<K extends keyof User>(user: User, property: K): User[K] {
  return user[property];
}

// 使用示例
const user: User = { name: 'link', email: 'link@example.com', age: 28 };
const name = getUserProperty(user, 'name');  // ✅ 返回 string
const age = getUserProperty(user, 'age');     // ✅ 返回 number

// ✅ 动态配置类型
interface Config {
  apiUrl: string;
  timeout: number;
  retryAttempts: number;
}

const config: Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retryAttempts: 3
};

function getConfigValue<K extends keyof Config>(key: K): Config[K] {
  return config[key];
}

// ✅ 更灵活的解决方案
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// ✅ 字符串键的类型安全
type StringKey<T> = string & keyof T;

function getPropertyByString<T>(obj: T, key: string): T[StringKey<T>] | undefined {
  if (key in obj) {
    return obj[key as StringKey<T>];
  }
  return undefined;
}
```

## 🚨 陷阱6：异步函数的类型处理

### 问题表现

```typescript
// ❌ 忘记 Promise 类型
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();
  return user;  // 返回类型被推导为 Promise<any>
}

// ❌ 错误处理类型丢失
async function processData(data: any): Promise<string> {
  try {
    const result = await someAsyncOperation(data);
    return result;
  } catch (error) {
    // ❌ error 类型是 unknown
    console.log(error.message);
    throw error;
  }
}

// ❌ Promise.all 类型推导
const [users, posts, comments] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
]);
// 类型被推导为 any[]
```

### 解决方案

```typescript
// ✅ 明确异步函数返回类型
interface User {
  id: string;
  name: string;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();
  return user as User;  // 或者进行类型验证
}

// ✅ 错误处理类型安全
async function processData(data: any): Promise<string> {
  try {
    const result = await someAsyncOperation(data);
    return result;
  } catch (error) {
    // 类型安全地处理错误
    if (error instanceof Error) {
      console.log(error.message);
      throw new Error(`处理失败: ${error.message}`);
    }
    console.log('未知错误:', error);
    throw new Error('处理过程中发生未知错误');
  }
}

// ✅ Promise.all 类型推导
interface Post { id: string; title: string; }
interface Comment { id: string; content: string; }

const results = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
]) as [User[], Post[], Comment[]];

const [users, posts, comments] = results;
// ✅ 类型安全：users 是 User[]，posts 是 Post[]，comments 是 Comment[]

// ✅ 更安全的 Promise.all 封装
async function safePromiseAll<T extends readonly unknown[] | []>(
  promises: T
): Promise<{ [K in keyof T]: T[K] extends Promise<infer U> ? U : never }> {
  return Promise.all(promises) as any;
}
```

## 🚨 陷阱7：类型推导的意外行为

### 问题表现

```typescript
// ❌ 对象字面量类型推导过于具体
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

function updateConfig(config: { apiUrl: string; timeout: number; retries?: number }) {
  // 实现...
}

updateConfig(config); // ❌ 编译错误：缺少 retries 属性

// ❌ 函数参数类型推导
const users = [
  { id: 1, name: 'Alice', role: 'admin' as const },
  { id: 2, name: 'Bob', role: 'user' as const }
];

function findAdmin(users: { id: number; name: string; role: 'admin' }[]) {
  return users.find(u => u.role === 'admin');
}

findAdmin(users); // ❌ 编译错误：role 类型不匹配
```

### 解决方案

```typescript
// ✅ 明确对象类型
interface Config {
  apiUrl: string;
  timeout: number;
  retries?: number;
}

const config: Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// ✅ 使用 satisfies 操作符（TypeScript 4.9+）
const config2 = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} satisfies Config;

// ✅ 正确的角色类型定义
type UserRole = 'admin' | 'user';

interface User {
  id: number;
  name: string;
  role: UserRole;
}

const users: User[] = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' }
];

function findAdmin(users: User[]) {
  return users.filter(u => u.role === 'admin');
}

// ✅ 更灵活的类型推导
function createConfig<T extends Record<string, any>>(config: T): T {
  return config;
}

const dynamicConfig = createConfig({
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
});  // 保持了所有原始类型
```

## 🚨 陷阱8：模块和导入导出问题

### 问题表现

```typescript
// ❌ 默认导出的类型问题
// user.ts
export default class User {
  constructor(public name: string) {}
}

// main.ts
import User from './user';
const user = new User('link');  // ✅ 正常

// 但在类型声明时会有问题
import UserClass from './user';  // 导入的是值，不是类型

// ❌ 混合导入导出
// utils.ts
export function formatDate(date: Date): string {
  return date.toISOString();
}

export default {
  formatDate
};

// main.ts
import utils from './utils';
utils.formatDate(new Date());  // ❌ 类型丢失
```

### 解决方案

```typescript
// ✅ 推荐使用命名导出
// user.ts
export class User {
  constructor(public name: string) {}
}

export type UserType = {
  name: string;
  id: string;
};

// ✅ 类型导入导出
// types.ts
export interface User {
  id: string;
  name: string;
}

// user.ts
import type { User } from './types';
export class UserService {
  async getUser(id: string): Promise<User> {
    // 实现...
  }
}

// ✅ 重新导出
// index.ts
export { User, UserService } from './user';
export type { User as UserType } from './types';

// ✅ 工具函数模块
// utils.ts
export function formatDate(date: Date): string {
  return date.toISOString();
}

export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

export type DateUtils = {
  formatDate: typeof formatDate;
  parseDate: typeof parseDate;
};

// main.ts
import { formatDate, parseDate, type DateUtils } from './utils';
```

## 💡 避坑最佳实践

### 1. 启用严格模式

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### 2. 使用类型断言的替代方案

```typescript
// ❌ 过度使用类型断言
const user = data as User;

// ✅ 类型守卫
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
}

if (isUser(data)) {
  // 类型安全的使用
}
```

### 3. 渐进式类型改进

```typescript
// 第一阶段：使用 any
function processUser(user: any) {
  // 实现逻辑...
}

// 第二阶段：添加基础类型
function processUser(user: { id: string; name: string }) {
  // 实现逻辑...
}

// 第三阶段：完善类型定义
function processUser(user: User) {
  // 实现逻辑...
}
```

---

**下一篇预告**：进阶技巧 - 提升开发效率和代码质量的高级用法

*记住：遇到类型错误时，先理解类型系统的逻辑，而不是强制绕过它。*