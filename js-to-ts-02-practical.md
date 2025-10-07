# JS 开发者转向 TypeScript - 第2篇：实战项目类型改造

> 基于真实项目场景的类型系统设计和最佳实践

## 🎯 项目场景：用户管理系统

假设我们要重构一个典型的用户管理系统，包含用户CRUD、权限管理、数据验证等功能。

## 🏗️ 项目结构设计

### 文件组织

```
src/
├── types/           # 类型定义
│   ├── user.ts      # 用户相关类型
│   ├── api.ts       # API 响应类型
│   └── common.ts    # 通用类型
├── services/        # 业务逻辑
├── utils/           # 工具函数
└── components/      # UI组件（如果用Vue/React）
```

## 📊 核心类型定义

### 1. 用户实体类型

```typescript
// src/types/user.ts
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;  // 可选属性
  role: UserRole;
  status: UserStatus;
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned'
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  bio?: string;
  website?: string;
  location?: string;
}
```

### 2. API 响应类型

```typescript
// src/types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// CRUD 操作类型
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  profile: Partial<UserProfile>;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  profile?: Partial<UserProfile>;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}
```

### 3. 表单验证类型

```typescript
// src/types/common.ts
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface FormField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  rules: ValidationRule[];
}

export type FormState<T extends Record<string, any>> = {
  [K in keyof T]: FormField<T[K]>;
};
```

## 🔧 实际实现

### 1. 用户服务类

```typescript
// src/services/UserService.ts
import { User, CreateUserRequest, UpdateUserRequest, UserListParams, PaginatedResponse } from '../types';

export class UserService {
  private baseUrl = '/api/users';

  async getUsers(params: UserListParams = {}): Promise<PaginatedResponse<User>> {
    const queryString = new URLSearchParams({
      page: String(params.page || 1),
      limit: String(params.limit || 10),
      ...(params.search && { search: params.search }),
      ...(params.role && { role: params.role }),
      ...(params.status && { status: params.status })
    }).toString();

    const response = await fetch(`${this.baseUrl}?${queryString}`);
    return response.json();
  }

  async getUserById(id: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || '获取用户失败');
    }

    return data.data;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || '创建用户失败');
    }

    return data.data;
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || '更新用户失败');
    }

    return data.data;
  }

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || '删除用户失败');
    }
  }
}
```

### 2. 表单验证工具

```typescript
// src/utils/validation.ts
import { FormField, ValidationRule } from '../types/common';

export function validateField<T>(field: FormField<T>): FormField<T> {
  const { value, rules } = field;
  let error = '';

  for (const rule of rules) {
    // 必填验证
    if (rule.required && (value === undefined || value === null || value === '')) {
      error = '此字段为必填项';
      break;
    }

    // 最小长度验证
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      error = `最少需要 ${rule.minLength} 个字符`;
      break;
    }

    // 最大长度验证
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      error = `最多允许 ${rule.maxLength} 个字符`;
      break;
    }

    // 正则验证
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      error = '格式不正确';
      break;
    }

    // 自定义验证
    if (rule.custom) {
      const result = rule.custom(value);
      if (result !== true) {
        error = typeof result === 'string' ? result : '验证失败';
        break;
      }
    }
  }

  return { ...field, error, touched: true };
}

export function validateForm<T extends Record<string, any>>(formState: FormState<T>): {
  isValid: boolean;
  formState: FormState<T>;
} {
  const newState = {} as FormState<T>;
  let isValid = true;

  for (const key in formState) {
    const field = validateField(formState[key]);
    newState[key] = field;
    if (field.error) {
      isValid = false;
    }
  }

  return { isValid, formState: newState };
}
```

### 3. 用户表单管理

```typescript
// src/components/UserForm.ts
import { useState, useEffect } from 'react';
import { User, CreateUserRequest, UpdateUserRequest, UserRole, UserStatus } from '../types';
import { FormState, ValidationRule } from '../types/common';
import { validateForm } from '../utils/validation';

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => void;
  loading?: boolean;
}

export function UserForm({ user, onSubmit, loading }: UserFormProps) {
  const isEdit = !!user;

  const [formState, setFormState] = useState<FormState<CreateUserRequest>>({
    username: { value: user?.username || '', touched: false, rules: [
      { required: true },
      { minLength: 3 },
      { maxLength: 20 },
      { pattern: /^[a-zA-Z0-9_]+$/, custom: (v) => v.includes('admin') ? '用户名不能包含admin' : true }
    ]},
    email: { value: user?.email || '', touched: false, rules: [
      { required: true },
      { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    ]},
    password: { value: '', touched: false, rules: [
      { required: !isEdit },
      { minLength: 6 },
      { maxLength: 50 }
    ]},
    role: { value: user?.role || UserRole.VIEWER, touched: false, rules: [{ required: true }] },
    profile: {
      value: user?.profile || { firstName: '', lastName: '' },
      touched: false,
      rules: [{ required: true }]
    }
  });

  const handleInputChange = (field: keyof typeof formState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: { ...prev[field], value, touched: true }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, formState: validatedState } = validateForm(formState);
    setFormState(validatedState);

    if (!isValid) return;

    const formData = Object.entries(validatedState).reduce((acc, [key, field]) => {
      if (key === 'password' && !field.value && isEdit) {
        return acc; // 编辑时不更新空密码
      }
      return { ...acc, [key]: field.value };
    }, {} as CreateUserRequest | UpdateUserRequest);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单渲染逻辑 */}
    </form>
  );
}
```

## 💡 实用技巧

### 1. 类型守卫

```typescript
// src/utils/typeGuards.ts
import { User, ApiResponse } from '../types';

export function isUser(obj: any): obj is User {
  return obj &&
         typeof obj.id === 'string' &&
         typeof obj.username === 'string' &&
         typeof obj.email === 'string';
}

export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(response.message || '请求失败');
  }

  if (!response.data) {
    throw new Error('响应数据为空');
  }

  return response.data;
}

// 使用示例
try {
  const response = await fetch('/api/user/1');
  const data = await response.json();

  if (isUser(data)) {
    console.log(data.username); // TypeScript 知道这是 User 类型
  }

  const user = handleApiResponse<ApiResponse<User>>(data);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 2. 工具类型

```typescript
// src/utils/typeHelpers.ts
import { User } from '../types';

// 部分更新类型
type PartialUser = Partial<User>;

// 必需字段
type RequiredUser = Required<Pick<User, 'id' | 'username'>> & Partial<User>;

// 用户显示信息
type UserDisplayInfo = Pick<User, 'id' | 'username' | 'email' | 'avatar'>;

// 排除某些字段
type UserCreateData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// 映射类型 - 所有字段变为可选
type OptionalUser = {
  [K in keyof User]?: User[K];
};

// 使用示例
function updateUserPartial(id: string, data: PartialUser): Promise<User> {
  // 实现...
}

function createUser(data: UserCreateData): Promise<User> {
  // 实现...
}
```

### 3. 错误处理类型

```typescript
// src/types/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: any
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// 使用示例
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      throw new ApiError(
        `HTTP Error: ${response.status}`,
        'HTTP_ERROR',
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API错误 [${error.code}]: ${error.message}`);
    }
    throw error;
  }
}
```

## 🎯 迁移策略

### 1. 渐进式类型覆盖

```typescript
// 第一阶段：添加 JSDoc 类型注释
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} email
 */

/**
 * @param {string} id - 用户ID
 * @returns {Promise<User>} 用户信息
 */
async function getUser(id) {
  // 实现...
}

// 第二阶段：创建 .d.ts 类型声明文件
// types/index.d.ts
export interface User {
  id: string;
  username: string;
  email: string;
}

declare global {
  function getUser(id: string): Promise<User>;
}

// 第三阶段：完全迁移到 TypeScript
async function getUser(id: string): Promise<User> {
  // 实现...
}
```

### 2. 类型安全的数据获取

```typescript
// 通用数据获取 hook（如果用 React）
function useApi<T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = []
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await fetcher();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// 使用示例
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error } = useApi(
    () => userService.getUserById(userId),
    [userId]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return <div>{user.username}</div>;
}
```

## ⚠️ 项目实战中的常见问题

### 1. 第三方库类型

```typescript
// 安装类型定义
npm install @types/lodash @types/node

// 自定义类型声明
declare module 'some-untyped-library' {
  export function someFunction(param: string): number;
}
```

### 2. DOM 操作类型安全

```typescript
// 安全的 DOM 操作
function setupForm(formId: string): HTMLFormElement | null {
  const form = document.getElementById(formId) as HTMLFormElement;

  if (!form || !(form instanceof HTMLFormElement)) {
    console.error(`Element with id "${formId}" is not a form`);
    return null;
  }

  return form;
}

// 使用示例
const form = setupForm('user-form');
if (form) {
  const formData = new FormData(form);
  // TypeScript 知道 form 是 HTMLFormElement
}
```

---

**下一篇预告**：常见陷阱和解决方案 - 避免在迁移过程中踩坑

*记住：类型安全是工具，不是目标。保持代码可读性和维护性更重要。*