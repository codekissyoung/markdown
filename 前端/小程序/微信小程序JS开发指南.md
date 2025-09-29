# 微信小程序JavaScript开发指南

## 概述

微信小程序的JavaScript运行环境既不是浏览器也不是Node.js，而是运行在微信App的上下文中。这种特殊的运行环境带来了独特的开发体验和一些重要的限制。

## 运行环境特点

### 特殊的执行环境

微信小程序的JavaScript运行在一个受限的环境中：
- 不能操作Browser context下的DOM
- 不能通过Node.js相关接口访问操作系统API
- 基于安全考虑，不支持动态执行JS代码（不支持eval和new Function）

### 与标准JavaScript的差异

小程序基础库通过`core-js Polyfill`抹平了部分ECMAScript标准的差异，但语法差异仍需要代码转换工具处理。不同平台对ECMAScript标准的支持也存在差异。

## 模块系统

### CommonJS规范支持

微信小程序原生支持CommonJS规范：

```javascript
// 导出模块
module.exports = {
  sayHello: function() {
    console.log('Hello from module!');
  }
};

// 或者使用exports
exports.sayHello = function() {
  console.log('Hello from module!');
};

// 引入模块
const myModule = require('./myModule.js');
myModule.sayHello();
```

### 重要注意事项

- `exports`不能被直接赋值，只能添加属性
- 小程序会将ES Modules转换为CommonJS，可能导致循环依赖处理的复杂性

## 模块特点与限制

### 1. 路径限制

小程序目前不支持直接引入 node_modules：
- 只能使用相对路径引入模块
- 不支持绝对路径引入
- 需要使用 `../../../xxx/xxx.js` 这样的方式引入，当引入多个模块时会很繁琐

### 2. 文件作用域

在JavaScript文件中声明的变量和函数只在该文件中有效：
- 不同文件可以声明相同名字的变量和函数，不会互相影响
- 通过全局函数 `getApp()` 可以获取全局应用实例

### 3. 构建限制

微信小程序构建时不支持从App scope之外require文件：
- 这导致npm在小程序中不好用
- 需要实时build依赖到应用本地

### 4. 模块加载机制

- CommonJS的加载是同步的，只有加载完才执行后面的操作
- 模块可以多次加载，但只会在第一次加载时运行一次，之后运行结果被缓存

## 最佳实践

### 模块组织与引入

1. **简化路径管理**
   - 在`app.js`中新增`require`方法来解决模块引入路径过长的问题
   - 合理组织项目结构，减少深层嵌套

2. **使用构建工具**
   - 建议使用webpack等工具处理依赖构建
   - 通过构建工具支持更复杂的模块管理

3. **合理拆分模块**
   - 按功能拆分模块，提高代码复用性
   - 避免单个文件过大

### 性能优化

1. **代码包体积控制**
   - 使用分包策略
   - 移除无用代码
   - 开启组件懒注入

2. **主包优化**
   - 控制主包大小
   - 合理使用插件和静态资源管理（CDN）
   - JS/组件的按需加载和压缩

3. **版本发布频率**
   - 控制最低基础库版本
   - 及时回收定时器
   - 避免JS异常和网络请求异常

### 模板与组件化

1. **WXML模块化**
   - 使用模板进行WXML模块化
   - 合理使用组件化开发

2. **状态管理**
   - 通过`getApp()`获取全局数据
   - 合理设计数据流

## 与其他环境的对比

### 与Node.js CommonJS的区别

- **路径解析**：小程序只支持相对路径，Node.js支持绝对路径和node_modules
- **API支持**：小程序不能访问操作系统API，Node.js可以
- **构建限制**：小程序有App scope限制

### 与浏览器ES6模块的区别

- **语法**：小程序使用CommonJS语法，浏览器原生支持ES6 import/export
- **加载方式**：小程序同步加载，浏览器ES6模块异步加载
- **编译转换**：小程序内部会将ES Modules转换为CommonJS