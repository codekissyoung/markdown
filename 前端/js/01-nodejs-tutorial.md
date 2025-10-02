# Node.js 基础教程

### Node.js中的JavaScript

```javascript
console.log('Hello');         // 没有window对象
process.version;              // 有process全局对象
require('fs');                // 可以读写文件
```

## 4. Node.js核心概念

### 4.2 模块系统
```javascript
const fs = require('fs');      // 文件系统
const path = require('path');  // 路径处理
const os = require('os');      // 操作系统信息
```

### 4.3 异步编程
```javascript
const fs = require('fs');
fs.readFile('README.md', 'utf8', (err, data) => {
  if (err) {
    console.error('出错了:', err);
  } else {
    console.log('文件内容:', data);
  }
});
```

### 5.3 package.json 文件解释
```json
{
  "name": "learnvue",           // 项目名称
  "version": "1.0.0",           // 版本号
  "description": "学习vue3",     // 项目描述
  "main": "index.js",           // 入口文件
  "scripts": {                  // 脚本命令
    "start": "node index.js",
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {             // 运行时依赖
    "vue": "^3.0.0"
  },
  "devDependencies": {          // 开发时依赖
    "vite": "^4.0.0"
  }
}
```

## 6. 常用npm命令

### 6.1 项目初始化
```bash
npm init                 # 交互式创建package.json
npm init -y             # 使用默认设置创建package.json
```

### 6.2 安装包
```bash
npm install vue         # 安装vue包（添加到dependencies）
npm install vite -D     # 安装为开发依赖（devDependencies）
npm install            # 根据package.json安装所有依赖
```

### 6.3 运行脚本
```bash
npm run dev            # 运行package.json中scripts.dev定义的命令
npm start              # 运行package.json中scripts.start定义的命令
npm run build          # 运行构建命令
```

## 7. 重要文件和目录

### 7.1 不要提交到Git的文件
```gitignore
node_modules/          # 依赖包目录，文件很多很大
package-lock.json      # 有争议，一般建议提交
```

### 7.2 为什么node_modules不提交Git？
- **文件数量巨大**: 一个简单项目可能有几千个文件
- **可重新生成**: 通过`npm install`可以重新下载
- **平台差异**: 不同操作系统可能需要不同的编译版本

## 8. Node.js在Vue开发中的作用

```mermaid
flowchart TD
    A[开发者写代码] --> B[.vue文件]
    B --> C[Vite开发服务器]
    C --> D[实时编译]
    D --> E[浏览器显示]
    F[npm run build] --> G[Vite构建]
    G --> H[代码压缩]
    G --> I[资源优化] 
    G --> J[兼容性处理]
    H --> K[dist/目录]
    I --> K
    J --> K
    K --> L[部署到服务器]
    style C fill:#4caf50,color:#fff
    style G fill:#2196f3,color:#fff
    style K fill:#ff9800,color:#fff
```

## 10. 现代前端开发完整流程

```mermaid
graph TD
    subgraph "开发环境"
        A[Node.js] --> B[npm包管理]
        B --> C[Vite]
        C --> D[Vue 3]
    end
    
    subgraph "开发过程"
        E[写.vue组件] --> F[Vite开发服务器]
        F --> G[实时热更新]
        G --> H[浏览器预览]
    end
    
    subgraph "构建部署"
        I[npm run build] --> J[代码打包压缩]
        J --> K[生成dist/文件]
        K --> L[部署到服务器]
    end
    
    A --> E
    D --> E
    H --> I
    
    style A fill:#68d391
    style D fill:#4299e1
    style L fill:#ed8936
```