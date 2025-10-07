# JS 开发者转向 TypeScript - 第4篇：进阶技巧

> 提升开发效率和代码质量的高级用法，让你真正发挥 TypeScript 的威力

## 🎯 高级类型系统

### 1. 条件类型 (Conditional Types)

条件类型让类型具有了编程能力，类似三元运算符：

```typescript
// 基础语法：T extends U ? X : Y
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>;  // true
type Test2 = IsString<number>;  // false

// 实际应用：API 响应类型
type ApiResponse<T> = T extends string
  ? { success: boolean; data: string }
  : { success: boolean; data: T };

function processResponse<T>(response: ApiResponse<T>) {
  // 根据类型不同处理不同的响应格式
}

// 更复杂的条件类型
type NonNullable<T> = T extends null | undefined ? never : T;
type ExtractArrayType<T> = T extends (infer U)[] ? U : never;
type ExtractPromiseType<T> = T extends Promise<infer U> ? U : never;

// 使用示例
type StringArray = ExtractArrayType<string[]>;  // string
type PromiseString = ExtractPromiseType<Promise<string>>;  // string
```

### 2. 映射类型 (Mapped Types)

基于现有类型创建新类型：

```typescript
// 基础映射类型
type Optional<T> = {
  [K in keyof T]?: T[K];
};

type Required<T> = {
  [K in keyof T]-?: T[K];
};

type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// 使用示例
interface User {
  id: string;
  name: string;
  email: string;
}

type PartialUser = Optional<User>;        // 所有属性可选
type CompleteUser = Required<PartialUser>; // 所有属性必填
type ReadOnlyUser = Readonly<User>;       // 所有属性只读

// 高级映射类型
type Stringify<T> = {
  [K in keyof T]: string;
};

type UserToString = Stringify<User>;
// 结果：{ id: string; name: string; email: string; }

// 条件映射类型
type StringProperties<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type UserStringProps = StringProperties<User>;  // 'name' | 'email'

// 选择性映射
type StringFields<T> = Pick<T, StringProperties<T>>;
type UserStringFields = StringFields<User>;
// 结果：{ name: string; email: string; }
```

### 3. 模板字面量类型

TypeScript 4.1+ 的强大特性：

```typescript
// 基础模板字面量类型
type EventName = `on${Capitalize<string>}`;
type ClickEvent = EventName<'click'>;  // 'onClick'
type HoverEvent = EventName<'hover'>;  // 'onHover'

// 实际应用：CSS 属性
type CSSProperty<T extends string> = `--${T}`;
type CustomProperty = CSSProperty<'theme-color'>;  // '--theme-color'

// API 端点生成
type ApiEndpoint<T extends string> = `/api/${T}`;
type UserEndpoint = ApiEndpoint<'users'>;  // '/api/users'
type PostEndpoint = ApiEndpoint<'posts'>;  // '/api/posts'

// 对象键名生成
type EventHandler<T extends string> = {
  [K in `on${Capitalize<T>}`]: (event: T) => void;
};

type UserEvents = EventHandler<'login' | 'logout'>;
// 结果：{ onLogin: (event: 'login') => void; onLogout: (event: 'logout') => void; }
```

## 🛠️ 实用工具类型

### 1. 自定义工具类型

```typescript
// 深度只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

interface Config {
  api: {
    url: string;
    timeout: number;
  };
  theme: {
    color: string;
    size: number;
  };
}

type ReadOnlyConfig = DeepReadonly<Config>;
// config.api.url 也不能修改

// 深度可选
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 选择性必需
type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

// 排除类型
type ExcludeTypes<T, U> = {
  [K in keyof T]: T[K] extends U ? never : K;
}[keyof T];

type UserWithoutFunctions = Pick<User, ExcludeTypes<User, Function>>;

// 递归条件类型
type Flatten<T> = T extends (infer U)[]
  ? U
  : T extends Promise<infer U>
  ? Flatten<U>
  : T;

type FlattenExample = Flatten<Promise<string[]>>;  // string
```

### 2. 函数类型工具

```typescript
// 函数参数类型
type Parameters<T> = T extends (...args: infer P) => any ? P : never;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 使用示例
function createUser(name: string, age: number): User {
  return { id: '1', name, email: `${name}@example.com` };
}

type CreateUserParams = Parameters<typeof createUser>;  // [string, number]
type CreateUserReturn = ReturnType<typeof createUser>;   // User

// 函数重载类型
type Overload<T> = T extends {
  (...args: infer A1): infer R1;
  (...args: infer A2): infer R2;
}
  ? ((...args: A1) => R1) & ((...args: A2) => R2)
  : never;

// 异步函数类型
type AsyncFunction<T extends any[] = any[], R = any> = (...args: T) => Promise<R>;
type SyncFunction<T extends any[] = any[], R = any> = (...args: T) => R;

// 函数组合类型
type Compose<F extends SyncFunction, G extends SyncFunction> = (
  ...args: Parameters<F>
) => ReturnType<G>;
```

## 🏗️ 高级设计模式

### 1. 状态机类型

```typescript
// 状态机类型定义
type State = 'idle' | 'loading' | 'success' | 'error';
type Event = 'start' | 'success' | 'error' | 'reset';

type StateMachine = {
  [S in State]: {
    [E in Event]?: State;
  };
};

type UserStateMachine = StateMachine & {
  idle: { start: 'loading' };
  loading: { success: 'success'; error: 'error' };
  success: { start: 'loading'; reset: 'idle' };
  error: { start: 'loading'; reset: 'idle' };
};

// 状态机实现
class StateMachineManager<T extends Record<string, any>> {
  private currentState: keyof T;
  private transitions: T;

  constructor(initialState: keyof T, transitions: T) {
    this.currentState = initialState;
    this.transitions = transitions;
  }

  transition<E extends keyof T[keyof T]>(
    event: E
  ): keyof T[keyof T] | null {
    const stateTransitions = this.transitions[this.currentState];
    const nextState = stateTransitions[event];

    if (nextState !== undefined) {
      this.currentState = nextState;
      return nextState;
    }

    return null;
  }

  getCurrentState(): keyof T {
    return this.currentState;
  }
}

// 使用示例
const userStateMachine: UserStateMachine = {
  idle: { start: 'loading' },
  loading: { success: 'success', error: 'error' },
  success: { start: 'loading', reset: 'idle' },
  error: { start: 'loading', reset: 'idle' }
};

const machine = new StateMachineManager('idle', userStateMachine);
machine.transition('start');  // -> 'loading'
```

### 2. 插件系统类型

```typescript
// 插件接口
interface Plugin<T = any> {
  name: string;
  install(app: T): void;
  uninstall?(app: T): void;
}

// 插件管理器
class PluginManager<T = any> {
  private plugins = new Map<string, Plugin<T>>();
  private app: T;

  constructor(app: T) {
    this.app = app;
  }

  use<P extends Plugin<T>>(plugin: P): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already installed`);
    }

    this.plugins.set(plugin.name, plugin);
    plugin.install(this.app);
  }

  remove(name: string): void {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.uninstall?.(this.app);
      this.plugins.delete(name);
    }
  }

  getPlugin<P extends Plugin<T>>(name: string): P | undefined {
    return this.plugins.get(name) as P;
  }
}

// 类型安全的插件系统
interface AppContext {
  config: Record<string, any>;
  services: Record<string, any>;
  plugins: Record<string, any>;
}

interface DatabasePlugin extends Plugin<AppContext> {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

interface LoggerPlugin extends Plugin<AppContext> {
  log(message: string): void;
  error(message: string): void;
}

// 使用示例
const app: AppContext = {
  config: {},
  services: {},
  plugins: {}
};

const pluginManager = new PluginManager(app);

const dbPlugin: DatabasePlugin = {
  name: 'database',
  async install(app) {
    await this.connect();
    app.services.db = { /* database instance */ };
  },
  async disconnect() {
    // 清理连接
  },
  async connect() {
    // 建立连接
  }
};

pluginManager.use(dbPlugin);
```

### 3. 高级工厂模式

```typescript
// 工厂类型定义
type Constructor<T = {}> = new (...args: any[]) => T;

// 混入工厂
type Mixin<T extends Constructor> = T & Constructor<{
  mixinMethod(): void;
}>;

// 泛型工厂
class ServiceFactory {
  private static services = new Map<string, any>();

  static register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  static get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service as T;
  }

  static create<T extends Constructor>(
    Constructor: T,
    ...args: ConstructorParameters<T>
  ): InstanceType<T> {
    return new Constructor(...args);
  }
}

// 依赖注入容器
interface Container {
  register<T>(key: string, factory: () => T): void;
  resolve<T>(key: string): T;
}

class DIContainer implements Container {
  private factories = new Map<string, () => any>();
  private instances = new Map<string, any>();

  register<T>(key: string, factory: () => T): void {
    this.factories.set(key, factory);
  }

  resolve<T>(key: string): T {
    if (!this.instances.has(key)) {
      const factory = this.factories.get(key);
      if (!factory) {
        throw new Error(`No factory registered for ${key}`);
      }
      this.instances.set(key, factory());
    }
    return this.instances.get(key);
  }
}
```

## 🎯 实用高级技巧

### 1. 类型级编程

```typescript
// 类型级数学运算
type Length<T extends any[]> = T['length'];
type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never;
type Tail<T extends any[]> = T extends [any, ...infer T] ? T : never;

// 类型级字符串操作
type Split<S extends string, D extends string> =
  S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

type Join<T extends string[], D extends string> =
  T extends [] ? '' :
  T extends [infer F extends string] ? F :
  T extends [infer F extends string, ...infer R extends string[]] ?
    `${F}${D}${Join<R, D>}` : '';

// 使用示例
type PathParts = Split<'api/users/posts', '/'>;  // ['api', 'users', 'posts']
type PathString = Join<['api', 'users', 'posts'], '/'>;  // 'api/users/posts'

// 类型级验证
type ValidateEmail<T extends string> =
  T extends `${string}@${string}.${string}` ? T : never;

type ValidEmail = ValidateEmail<'user@example.com'>;  // 'user@example.com'
type InvalidEmail = ValidateEmail<'invalid-email'>;  // never
```

### 2. 运行时类型验证

```typescript
// 类型检查器
type TypeChecker<T> = (value: unknown) => value is T;

// 创建类型检查器
function createTypeChecker<T>(validator: (value: unknown) => boolean): TypeChecker<T> {
  return validator as TypeChecker<T>;
}

// 基础类型检查器
const isString = createTypeChecker<string>((value): value is string =>
  typeof value === 'string'
);

const isNumber = createTypeChecker<number>((value): value is number =>
  typeof value === 'number' && !isNaN(value)
);

const isBoolean = createTypeChecker<boolean>((value): value is boolean =>
  typeof value === 'boolean'
);

// 复合类型检查器
function isObject<T extends Record<string, any>>(
  shape: Record<keyof T, TypeChecker<any>>
): TypeChecker<T> {
  return (value): value is T => {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    return Object.entries(shape).every(([key, checker]) =>
      checker((value as any)[key])
    );
  };
}

// 使用示例
interface User {
  id: string;
  name: string;
  age: number;
  active: boolean;
}

const isUser = isObject<User>({
  id: isString,
  name: isString,
  age: isNumber,
  active: isBoolean
});

function processUser(data: unknown): User {
  if (!isUser(data)) {
    throw new Error('Invalid user data');
  }
  return data; // TypeScript 知道这是 User 类型
}
```

### 3. 高级错误处理

```typescript
// 错误类型系统
interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  cause?: Error;
}

class TypedError extends Error implements AppError {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, any>,
    public cause?: Error
  ) {
    super(message, { cause });
    this.name = 'TypedError';
  }
}

// 错误处理器类型
type ErrorHandler<T extends AppError = AppError> = (error: T) => void;

type ErrorHandlers = {
  [K in AppError['code']]: ErrorHandler<Extract<AppError, { code: K }>>;
};

// 错误处理管理器
class ErrorManager {
  private handlers: Partial<ErrorHandlers> = {};

  register<T extends AppError['code']>(
    code: T,
    handler: ErrorHandler<Extract<AppError, { code: T }>>
  ): void {
    this.handlers[code] = handler;
  }

  handle(error: AppError): void {
    const handler = this.handlers[error.code];
    if (handler) {
      handler(error as any);
    } else {
      console.error('Unhandled error:', error);
    }
  }
}

// 使用示例
const errorManager = new ErrorManager();

errorManager.register('USER_NOT_FOUND', (error) => {
  console.log(`用户不存在: ${error.message}`);
  // 跳转到登录页等处理
});

errorManager.register('NETWORK_ERROR', (error) => {
  console.log(`网络错误: ${error.message}`);
  // 显示重试按钮等处理
});
```

## 🚀 性能优化技巧

### 1. 类型计算优化

```typescript
// 避免过深的递归类型
type FlattenSafe<T, Depth extends number = 5> = Depth extends 0
  ? T
  : T extends (infer U)[]
  ? FlattenSafe<U, Depth extends 5 ? 4 : Depth extends 4 ? 3 : Depth extends 3 ? 2 : Depth extends 2 ? 1 : 0>
  : T;

// 使用缓存类型
type Cached<T> = T & { __cached: true };

// 延迟类型计算
type Lazy<T> = T extends (...args: any[]) => any ? T : (() => T);
```

### 2. 编译时优化

```typescript
// 使用常量断言减少类型推导开销
const ROLES = ['admin', 'user', 'guest'] as const;
type Role = typeof ROLES[number];

// 使用接口而非交叉类型
interface User {
  id: string;
  name: string;
}

// 比交叉类型更快
// type User = { id: string } & { name: string };

// 使用类型别名而非复杂对象类型
type UserConfig = {
  theme: 'light' | 'dark';
  language: string;
};

// 比 Record<string, unknown> 更快
```

---

## 🎯 总结

通过这四篇教程，你已经掌握了从 JavaScript 迁移到 TypeScript 的核心技能：

1. **基础迁移**：掌握核心类型系统和基本用法
2. **实战项目**：真实项目中的类型系统设计
3. **避坑指南**：常见的陷阱和解决方案
4. **进阶技巧**：发挥 TypeScript 的全部威力

**记住 8/2 定律**：
- 80% 的日常开发只需要 20% 的 TypeScript 特性
- 先掌握基础，再追求高级特性
- 类型是工具，不是目的

**持续学习路径**：
1. 深入研究 TypeScript 编译器 API
2. 学习类型体操，解决复杂类型问题
3. 关注 TypeScript 新版本特性
4. 参与开源项目，学习最佳实践

*TypeScript 的学习是一个渐进的过程，不要急于求成。在实际项目中不断实践，你会逐渐掌握它的精髓。*