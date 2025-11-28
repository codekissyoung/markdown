# React 性能优化指南（2025版）

## 学习元信息

| 项目 | 内容 |
|:---|:---|
| **学习日期** | 2025-11-28 |
| **参考资料** | React 官方文档、oh-my-chat 项目实战 |
| **前置知识** | React Hooks 基础、组件渲染机制、闭包 |
| **对比语言** | TypeScript (Vue3)、Go (并发模型) |
| **实践项目** | `~/workspace/learnReact/oh-my-chat` |

---

## 核心概念

### 1. 性能优化的范式转变（2025）

```
过去: 主动使用 memo/useCallback/useMemo 优化
现在: 测量后按需优化 (Don't optimize prematurely)
未来: React Compiler 自动优化 (实验性)
```

**关键原则**：
- ✅ 先写清晰代码，再优化性能
- ✅ 用 React DevTools Profiler **测量**真实瓶颈
- ⚠️ 优化本身有成本（内存、复杂度、可维护性）

### 2. 三类优化工具的优先级

| 工具 | 重要性 | 使用场景 | 学习建议 |
|:---|:---:|:---|:---|
| **startTransition** | 🔥 高 | 搜索过滤、路由切换、大列表 | **重点掌握** |
| **Context + useMemo** | ⭐ 中 | Context Provider 值稳定 | 记住模式 |
| **React.memo + useCallback** | ⏸️ 低 | 明确的性能瓶颈 | 理解原理即可 |

### 3. React 18 并发特性的核心思想

```typescript
// 区分更新优先级
紧急更新: 用户输入、点击、滚动（立即响应）
过渡更新: 列表过滤、路由切换（可延迟、可中断）
```

**设计哲学**：
- **Go 并发对比**：类似 `select` 处理多个 channel，优先级调度
- **Vue3 对比**：Vue 没有内置优先级，依赖调度器的统一批处理

---

## 一、React.memo + useCallback/useMemo（谨慎使用）

### 原理：防止不必要的重新渲染

```typescript
// ❌ 反模式：纯组件失效
const Parent = () => {
  const [count, setCount] = useState(0)

  // 每次渲染都创建新函数 → 引用变化 → memo 失效
  const handleClick = () => console.log('clicked')

  return <MemoChild onClick={handleClick} />
}

const MemoChild = React.memo(({ onClick }) => {
  console.log('Child rendered')  // 仍然每次都渲染！
  return <button onClick={onClick}>Click</button>
})
```

```typescript
// ✅ 使用 useCallback 稳定引用
const Parent = () => {
  const [count, setCount] = useState(0)

  // 只要依赖项不变，返回同一函数引用
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])  // 空依赖 = 永远不变

  return <MemoChild onClick={handleClick} />
}
```

### 实现细节

```typescript
// useCallback 就是 useMemo 的马甲
useCallback(fn, deps)
===
useMemo(() => fn, deps)
```

### 成本分析

| 项目 | 成本 |
|:---|:---|
| **内存** | 缓存函数/值 |
| **计算** | 每次渲染都要比较依赖数组 |
| **维护** | 依赖数组容易遗漏/过期 |
| **可读** | 代码嵌套层级增加 |

**建议**：只在 Profiler 测出性能问题时才用。

---

## 二、Context + useMemo 模式（推荐记住）

### 问题：Context 更新导致全树渲染

```typescript
// ❌ 每次渲染都创建新对象 → 引用变化 → 所有 Consumer 重新渲染
const NavigationProvider = ({ children }) => {
  const [activeView, setActiveView] = useState('chat')

  // 对象字面量每次都是新引用
  return (
    <NavigationContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </NavigationContext.Provider>
  )
}
```

### 解决方案：useMemo 稳定 Context value

```typescript
// ✅ oh-my-chat 的最佳实践
const NavigationProvider = ({ children }) => {
  const [activeView, setActiveView] = useState('chat')

  // 只要 activeView 不变，value 引用就稳定
  const contextValue = useMemo(
    () => ({ activeView, setActiveView }),
    [activeView]  // setActiveView 引用天然稳定
  )

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}
```

### 配合 React.memo 避免渲染

```typescript
// Consumer 组件用 memo 包裹
const ChatView = React.memo(() => {
  const { activeView } = useContext(NavigationContext)

  // 只有 activeView 真正变化时才渲染
  return <div>{activeView}</div>
})
```

### 多语言对比

| 框架 | Context 优化方式 | 是否需要手动优化 |
|:---|:---|:---:|
| **React** | useMemo 稳定 value | ✅ 需要 |
| **Vue3** | provide/inject + 响应式依赖追踪 | ❌ 自动 |
| **Svelte** | Context API + 编译器优化 | ❌ 自动 |

**Vue3 对比**：
```typescript
// Vue3 自动追踪依赖，不需要 useMemo
const activeView = ref('chat')
provide('navigation', { activeView })

// 消费组件只在 activeView 变化时更新
const { activeView } = inject('navigation')
```

---

## 三、startTransition / useTransition（重点掌握）

### 核心思想：区分紧急和非紧急更新

```typescript
import { useState, useTransition } from 'react'

function SearchList() {
  const [query, setQuery] = useState('')
  const [filteredList, setFilteredList] = useState(allItems)
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e) => {
    const value = e.target.value

    // 紧急更新：立即更新输入框（不能卡）
    setQuery(value)

    // 非紧急更新：可以延迟、可被打断
    startTransition(() => {
      const result = allItems.filter(item =>
        item.name.includes(value)
      )
      setFilteredList(result)
    })
  }

  return (
    <>
      <input
        value={query}
        onChange={handleSearch}
        placeholder="搜索..."
      />

      {isPending && <div>搜索中...</div>}

      <ul>
        {filteredList.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </>
  )
}
```

### 工作原理

```
用户输入 "abc"
  ↓
1. setQuery("abc")        ← 紧急更新，立即执行
2. 输入框显示 "abc"       ← 用户立即看到反馈
  ↓
3. startTransition(() => {
     setFilteredList(...)  ← 标记为低优先级
   })
  ↓
4. React 在空闲时处理过滤  ← 可被新输入打断
5. 过滤完成后更新列表      ← 不阻塞输入
```

### 适用场景

| 场景 | 紧急更新 | 过渡更新 |
|:---|:---|:---|
| **搜索框** | 输入框显示 | 列表过滤 |
| **路由切换** | 导航高亮 | 页面渲染 |
| **数据图表** | 选项切换 | 图表重绘 |
| **分页** | 当前页码 | 数据加载 |

### useDeferredValue 对比

```typescript
// useTransition: 主动标记低优先级更新
const [isPending, startTransition] = useTransition()
startTransition(() => {
  setState(newValue)
})

// useDeferredValue: 被动延迟一个值
const deferredQuery = useDeferredValue(query)
// deferredQuery 会"滞后"于 query
```

**选择建议**：
- 能控制 `setState` → 用 `useTransition`
- 只能拿到值（如 props） → 用 `useDeferredValue`

### 多语言对比：并发模型

| 技术 | 优先级调度 | 可中断性 | 类比 |
|:---|:---:|:---:|:---|
| **React Transitions** | ✅ | ✅ | Fiber 可中断渲染 |
| **Go Goroutine** | ✅ (调度器) | ✅ (抢占) | `runtime.Gosched()` |
| **JS Event Loop** | ✅ (微任务优先) | ❌ | `queueMicrotask` |
| **Vue3 Scheduler** | ⚠️ (单一优先级) | ❌ | 同步批处理 |

**Go 并发对比**：
```go
// Go: 高优先级任务优先执行
select {
case msg := <-highPriority:
    handleUrgent(msg)
case msg := <-lowPriority:
    handleDeferred(msg)  // 可能被饿死
default:
    // 无消息时执行
}

// React: 低优先级任务可被打断但不会被饿死
startTransition(() => {
  // 会在空闲时执行，不会永远不执行
})
```

---

## 四、React Compiler（未来）

### 自动记忆化

```typescript
// 开发者写的代码（简洁）
function TodoList({ todos, onToggle }) {
  const filtered = todos.filter(t => !t.completed)

  return (
    <ul>
      {filtered.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
        />
      ))}
    </ul>
  )
}

// React Compiler 编译后（自动优化）
function TodoList({ todos, onToggle }) {
  const filtered = useMemo(
    () => todos.filter(t => !t.completed),
    [todos]
  )

  const handleToggle = useCallback(onToggle, [onToggle])

  return useMemo(() => (
    <ul>
      {filtered.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
        />
      ))}
    </ul>
  ), [filtered, handleToggle])
}
```

### 当前状态（2025-11）

| 项目 | 状态 |
|:---|:---|
| **稳定性** | 实验性（Meta 内部使用） |
| **生态支持** | 部分库需要适配 |
| **学习建议** | 了解即可，不要依赖 |

**结论**：仍然要学会手动优化，但不要过度优化。

---

## 五、实战建议

### 性能优化流程（SOP）

```
1. 用 React DevTools Profiler 录制操作
   ↓
2. 识别慢组件（渲染时间 > 50ms）
   ↓
3. 分析原因：
   - 计算量大？ → useMemo
   - 频繁渲染？ → React.memo + useCallback
   - 非紧急更新？ → startTransition
   ↓
4. 应用优化
   ↓
5. 再次测量验证效果
```

### 何时优化？

| 场景 | 是否优化 | 工具 |
|:---|:---:|:---|
| 输入框输入卡顿 | ✅ 立即优化 | `startTransition` |
| 列表滚动掉帧 | ✅ 立即优化 | 虚拟滚动 + `memo` |
| Context 多消费者 | ✅ 提前优化 | `useMemo` 稳定 value |
| 普通组件渲染 | ❌ 不优化 | - |
| "可能"会慢的代码 | ❌ 不优化 | 先测量 |

### oh-my-chat 项目实践

```typescript
// oh-my-chat/src/contexts/NavigationContext.tsx

import { createContext, useState, useMemo, type ReactNode } from 'react'

type View = 'chat' | 'contacts' | 'settings'

interface NavigationContextValue {
  activeView: View
  setActiveView: (view: View) => void
}

export const NavigationContext = createContext<NavigationContextValue | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<View>('chat')

  // ⭐ Context + useMemo 模式
  const contextValue = useMemo(
    () => ({ activeView, setActiveView }),
    [activeView]
  )

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}
```

### 反模式警告

```typescript
// ❌ 不要过早优化
function SimpleCounter() {
  const [count, setCount] = useState(0)

  // 🚫 完全没必要！
  const increment = useCallback(() => {
    setCount(c => c + 1)
  }, [])

  const doubleCount = useMemo(() => count * 2, [count])

  return <div>{doubleCount}</div>
}

// ✅ 简洁清晰
function SimpleCounter() {
  const [count, setCount] = useState(0)
  const doubleCount = count * 2

  return <div>{doubleCount}</div>
}
```

---

## 六、总结：2025 年的性能优化策略

### 优先级金字塔

```
              startTransition          ← 重点学习
             (真正解决问题)
        ─────────────────────
           Context + useMemo          ← 记住模式
          (Provider 必备)
      ───────────────────────────
    React.memo + useCallback/useMemo  ← 按需使用
        (测量后再优化)
  ─────────────────────────────────
         React Compiler              ← 了解即可
            (未来)
```

### 学习检查清单

- [ ] 理解 React 渲染机制（props 变化 → 重新渲染）
- [ ] 会用 React DevTools Profiler 测量性能
- [ ] **掌握 startTransition 解决输入卡顿问题** ⭐
- [ ] 记住 Context + useMemo 模式
- [ ] 理解 memo/useCallback 原理，但不主动用
- [ ] 知道 React Compiler 的存在

### 口诀

```
写代码先求清晰，优化等测出问题
输入卡顿 startTransition
Context Provider 稳定 value
其他优化谨慎为之
```

---

## 参考资料

- [React 官方文档 - useTransition](https://react.dev/reference/react/useTransition)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React Compiler 文档](https://react.dev/learn/react-compiler)
- [Dan Abramov: Before You memo()](https://overreacted.io/before-you-memo/)

---

**最后更新**: 2025-11-28
**相关项目**: `~/workspace/learnReact/oh-my-chat`
