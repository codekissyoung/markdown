# CommonJS模块详解 - 从历史到实践

## 🎯 引言

CommonJS是JavaScript模块化的重要里程碑，它解决了早期JavaScript缺乏模块系统的核心问题。虽然ES6模块已成为现代标准，但CommonJS仍在Node.js生态和许多项目中发挥着重要作用。本文将深入探讨CommonJS的历史背景、设计理念、使用方法和最佳实践。

---

## 📜 1. CommonJS的历史背景

### JavaScript模块化的困境（2009年之前）

#### 全局污染问题
```javascript
// 早期JavaScript - 所有代码都在全局作用域
// file1.js
var userName = 'Alice';
var userChips = 1000;

function updateChips(amount) {
  userChips += amount;
}

// file2.js  
var userName = 'Bob'; // ❌ 意外覆盖了file1.js的变量
var gameMode = 'poker';

function updateChips(newAmount) { // ❌ 函数名冲突
  userChips = newAmount;
}

// 结果：变量冲突、函数覆盖、难以维护
```

#### 依赖管理混乱
```html
<!-- 早期的HTML页面 - 手动管理脚本加载顺序 -->
<!DOCTYPE html>
<html>
<head>
  <!-- ❌ 必须严格按照依赖顺序加载 -->
  <script src="utils.js"></script>        <!-- 工具函数 -->
  <script src="player.js"></script>       <!-- 依赖utils.js -->
  <script src="game.js"></script>         <!-- 依赖player.js和utils.js -->
  <script src="ui.js"></script>           <!-- 依赖game.js -->
  <script src="main.js"></script>         <!-- 依赖所有上述文件 -->
</head>
<body>
  <!-- 如果顺序错了，整个应用就会崩溃 -->
</body>
</html>
```

#### 缺乏封装机制
```javascript
// 早期的"模块"模拟 - 立即执行函数表达式(IIFE)
var MyModule = (function() {
  // 私有变量
  var privateVar = 'secret';
  
  // 私有函数
  function privateFunction() {
    return 'private';
  }
  
  // 公共API
  return {
    publicMethod: function() {
      return privateFunction() + ' ' + privateVar;
    },
    publicVar: 'public'
  };
})();

// 使用
MyModule.publicMethod(); // 'private secret'
// MyModule.privateVar;  // undefined - 无法访问私有变量
```

### CommonJS项目的诞生（2009年）

#### 历史背景
- **时间**: 2009年1月
- **发起人**: Kevin Dangoor
- **原名**: ServerJS（后改名为CommonJS）
- **目标**: 为JavaScript创建标准化的模块系统

#### 核心理念
```javascript
// CommonJS的设计哲学
/**
 * 1. 简单性 - 语法简洁直观
 * 2. 同步加载 - 适合服务器环境
 * 3. 文件作用域 - 每个文件都是独立模块
 * 4. 显式导入导出 - 明确的依赖关系
 */
```

#### 重要里程碑
- **2009年**: CommonJS规范发布
- **2010年**: Node.js采用CommonJS作为默认模块系统
- **2011-2015年**: 浏览器端工具（Browserify、Webpack）支持CommonJS
- **2015年**: ES6模块标准发布，但CommonJS依然广泛使用
- **至今**: Node.js生态的默认选择

---

## 🎯 2. CommonJS要解决的核心问题

### 问题1：模块封装
```javascript
// ❌ 传统方式 - 全局污染
var config = {
  maxPlayers: 9,
  defaultChips: 1000
};

function createPlayer(name) {
  return { name: name, chips: config.defaultChips };
}

// ✅ CommonJS方式 - 文件作用域封装
// config.js
const config = {
  maxPlayers: 9,
  defaultChips: 1000
};

function createPlayer(name) {
  return { name: name, chips: config.defaultChips };
}

module.exports = {
  config,
  createPlayer
};
```

### 问题2：依赖管理
```javascript
// ❌ 传统方式 - 隐式依赖
// 必须确保utils.js已经加载
function processPlayerData(data) {
  return Utils.validate(data); // Utils从哪来？不明确
}

// ✅ CommonJS方式 - 显式依赖
const Utils = require('./utils');

function processPlayerData(data) {
  return Utils.validate(data); // 清晰的依赖关系
}

module.exports = { processPlayerData };
```

### 问题3：命名空间冲突
```javascript
// ❌ 传统方式 - 命名冲突风险
// player.js
var Player = function(name) { this.name = name; };

// game.js  
var Player = function(id, chips) { // ❌ 覆盖了之前的Player
  this.id = id;
  this.chips = chips;
};

// ✅ CommonJS方式 - 独立命名空间
// player.js
class Player {
  constructor(name) {
    this.name = name;
  }
}
module.exports = Player;

// game.js
const PlayerClass = require('./player'); // 明确引用
class GamePlayer extends PlayerClass {
  constructor(name, chips) {
    super(name);
    this.chips = chips;
  }
}
module.exports = GamePlayer;
```

---

## 🔧 3. CommonJS语法详解

### 模块导出（module.exports）

#### 基础导出方式
```javascript
// math.js - 基础导出
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

const PI = 3.14159;

// 方式1：直接赋值对象
module.exports = {
  add,
  multiply,
  PI
};

// 方式2：逐个添加属性
// module.exports.add = add;
// module.exports.multiply = multiply;
// module.exports.PI = PI;

// 方式3：使用exports简写（注意限制）
// exports.add = add;
// exports.multiply = multiply;  
// exports.PI = PI;
```

#### 导出类和构造函数
```javascript
// player.js - 导出类
class Player {
  constructor(name, chips = 1000) {
    this.name = name;
    this.chips = chips;
    this.cards = [];
    this.status = 'active';
  }
  
  bet(amount) {
    if (amount > this.chips) {
      throw new Error('筹码不足');
    }
    this.chips -= amount;
    return amount;
  }
  
  fold() {
    this.status = 'folded';
    this.cards = [];
  }
  
  static createFromData(data) {
    return new Player(data.name, data.chips);
  }
}

// 导出类（推荐方式）
module.exports = Player;

// 或者导出多个内容
// module.exports = {
//   Player,
//   createDefaultPlayer: () => new Player('Anonymous'),
//   PLAYER_STATUSES: ['active', 'folded', 'eliminated']
// };
```

#### 导出函数（函数式模块）
```javascript
// api.js - 导出工厂函数
function createApiClient(baseURL, timeout = 5000) {
  const client = {
    baseURL,
    timeout,
    
    async request(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        timeout: this.timeout,
        ...options
      };
      
      // 模拟网络请求
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) { // 90% 成功率
            resolve({
              data: { success: true, endpoint },
              status: 200
            });
          } else {
            reject(new Error('Network error'));
          }
        }, 100);
      });
    },
    
    async get(endpoint, params) {
      return this.request(endpoint, { method: 'GET', params });
    },
    
    async post(endpoint, data) {
      return this.request(endpoint, { method: 'POST', data });
    }
  };
  
  return client;
}

// 导出工厂函数
module.exports = createApiClient;

// 或者导出配置好的实例
// const defaultClient = createApiClient('https://api.example.com');
// module.exports = defaultClient;
```

#### exports vs module.exports的区别
```javascript
// 正确理解exports和module.exports的关系

// 内部机制（简化版）
function require(modulePath) {
  const module = { exports: {} };
  const exports = module.exports; // exports是module.exports的引用
  
  // 执行模块代码...
  
  return module.exports; // 始终返回module.exports
}

// ✅ 正确用法
// 方式1：使用exports添加属性
exports.name = 'Alice';
exports.age = 25;
// 等同于: module.exports.name = 'Alice'; module.exports.age = 25;

// 方式2：直接赋值module.exports
module.exports = {
  name: 'Alice',
  age: 25
};

// 方式3：导出单个值
module.exports = function() {
  return 'Hello World';
};

// ❌ 错误用法
exports = { name: 'Alice' }; // ❌ 这样做无效！
// 原因：exports = ... 切断了与module.exports的引用关系

// ❌ 混合使用导致混乱
exports.name = 'Alice';
module.exports = { age: 25 }; // 这会覆盖exports.name
```

### 模块导入（require）

#### 基础导入
```javascript
// 导入自定义模块
const Player = require('./player');           // 相对路径
const utils = require('../utils/helpers');    // 父级目录
const config = require('./config/app');       // 子级目录

// 导入Node.js内置模块
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 导入npm包
const express = require('express');
const lodash = require('lodash');
const moment = require('moment');
```

#### 解构导入
```javascript
// math.js
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => b !== 0 ? a / b : null,
  PI: 3.14159,
  E: 2.71828
};

// main.js - 解构导入
const { add, multiply, PI } = require('./math');

console.log(add(5, 3));      // 8
console.log(multiply(4, 7)); // 28
console.log(PI);             // 3.14159

// 重命名导入
const { add: sum, multiply: product } = require('./math');
console.log(sum(2, 3));      // 5
console.log(product(2, 3));  // 6

// 导入全部 + 解构
const math = require('./math');
const { add } = math;
```

#### 条件导入和动态导入
```javascript
// 条件导入
let DatabaseAdapter;

if (process.env.NODE_ENV === 'production') {
  DatabaseAdapter = require('./adapters/mysql');
} else {
  DatabaseAdapter = require('./adapters/memory');
}

// 动态导入（运行时决定）
function loadPlugin(pluginName) {
  try {
    const plugin = require(`./plugins/${pluginName}`);
    return plugin;
  } catch (error) {
    console.error(`插件 ${pluginName} 加载失败:`, error);
    return null;
  }
}

const aiPlugin = loadPlugin('ai-player');
if (aiPlugin) {
  console.log('AI插件加载成功');
}

// 延迟导入（优化启动时间）
let heavyModule;

function getHeavyModule() {
  if (!heavyModule) {
    console.log('首次加载大型模块...');
    heavyModule = require('./heavy-calculations');
  }
  return heavyModule;
}

// 只有真正需要时才加载
if (needsComplexCalculation) {
  const calc = getHeavyModule();
  const result = calc.performHeavyTask();
}
```

### 模块缓存机制

#### require.cache详解
```javascript
// 演示模块缓存
// counter.js
let count = 0;

function increment() {
  return ++count;
}

function getCount() {
  return count;
}

console.log('counter.js 被加载了！');

module.exports = { increment, getCount };

// main.js
const counter1 = require('./counter');  // 输出: "counter.js 被加载了！"
const counter2 = require('./counter');  // 不会再次输出，使用缓存

console.log(counter1 === counter2);     // true - 同一个对象引用

console.log(counter1.increment());     // 1
console.log(counter2.getCount());      // 1 - 共享状态

// 查看模块缓存
console.log(Object.keys(require.cache));

// 手动清除缓存（谨慎使用）
delete require.cache[require.resolve('./counter')];
const counter3 = require('./counter');  // 重新加载，再次输出: "counter.js 被加载了！"
```

#### 缓存的实际意义
```javascript
// database.js - 数据库连接模块
class Database {
  constructor() {
    console.log('创建数据库连接...');
    this.connection = this.createConnection();
    this.isConnected = true;
  }
  
  createConnection() {
    // 模拟数据库连接创建
    return {
      id: Math.random().toString(36),
      createdAt: new Date()
    };
  }
  
  query(sql) {
    if (!this.isConnected) {
      throw new Error('数据库未连接');
    }
    return `执行查询: ${sql}`;
  }
  
  close() {
    this.isConnected = false;
    console.log('数据库连接已关闭');
  }
}

// 导出单例实例
module.exports = new Database();

// 使用方（file1.js）
const db = require('./database');  // 创建连接
console.log(db.query('SELECT * FROM players'));

// 使用方（file2.js）
const db = require('./database');  // 复用同一个连接实例
console.log(db.query('SELECT * FROM games'));
```

---

## 🚀 4. CommonJS在实际项目中的应用

### 项目结构组织

#### 配置管理模式
```javascript
// config/database.js
const path = require('path');

const config = {
  development: {
    host: 'localhost',
    port: 3306,
    database: 'poker_dev',
    username: 'dev_user',
    password: 'dev_pass',
    dialect: 'mysql',
    logging: console.log
  },
  
  production: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000
    }
  },
  
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];

// config/index.js - 配置聚合
module.exports = {
  database: require('./database'),
  server: require('./server'),
  gameRules: require('./game-rules')
};
```

#### 服务层架构
```javascript
// services/BaseService.js - 基础服务类
class BaseService {
  constructor(model) {
    this.model = model;
  }
  
  async create(data) {
    try {
      return await this.model.create(data);
    } catch (error) {
      this.handleError('创建失败', error);
    }
  }
  
  async findById(id) {
    try {
      const result = await this.model.findByPk(id);
      if (!result) {
        throw new Error('记录不存在');
      }
      return result;
    } catch (error) {
      this.handleError('查询失败', error);
    }
  }
  
  async update(id, data) {
    try {
      const [affectedCount] = await this.model.update(data, {
        where: { id }
      });
      if (affectedCount === 0) {
        throw new Error('更新失败，记录不存在');
      }
      return await this.findById(id);
    } catch (error) {
      this.handleError('更新失败', error);
    }
  }
  
  async delete(id) {
    try {
      const deletedCount = await this.model.destroy({
        where: { id }
      });
      return deletedCount > 0;
    } catch (error) {
      this.handleError('删除失败', error);
    }
  }
  
  handleError(message, error) {
    console.error(`${this.constructor.name}: ${message}`, error);
    throw error;
  }
}

module.exports = BaseService;

// services/PlayerService.js - 玩家服务
const BaseService = require('./BaseService');
const Player = require('../models/Player');
const { validatePlayerData } = require('../utils/validators');

class PlayerService extends BaseService {
  constructor() {
    super(Player);
  }
  
  async createPlayer(playerData) {
    // 数据验证
    const validation = validatePlayerData(playerData);
    if (!validation.isValid) {
      throw new Error(`数据验证失败: ${validation.errors.join(', ')}`);
    }
    
    // 检查用户名是否已存在
    const existing = await Player.findOne({
      where: { username: playerData.username }
    });
    
    if (existing) {
      throw new Error('用户名已存在');
    }
    
    // 创建玩家
    const player = await this.create({
      ...playerData,
      chips: playerData.chips || 1000,
      status: 'active',
      createdAt: new Date()
    });
    
    return player;
  }
  
  async getPlayerStats(playerId) {
    const player = await this.findById(playerId);
    
    // 计算统计信息
    const stats = await this.calculatePlayerStats(playerId);
    
    return {
      player: player.toJSON(),
      stats: stats
    };
  }
  
  async calculatePlayerStats(playerId) {
    // 模拟统计计算
    return {
      gamesPlayed: 100,
      gamesWon: 65,
      winRate: 0.65,
      totalWinnings: 15000,
      averageGameTime: 45, // 分钟
      favoriteGameType: 'Texas Holdem'
    };
  }
  
  async updatePlayerChips(playerId, newChips) {
    if (newChips < 0) {
      throw new Error('筹码数不能为负数');
    }
    
    const player = await this.update(playerId, { 
      chips: newChips,
      updatedAt: new Date()
    });
    
    return player;
  }
}

module.exports = PlayerService;
```

### 微信小程序中的CommonJS实践

#### 小程序项目结构
```
miniprogram/
├── app.js
├── app.json
├── app.wxss
├── pages/
├── components/
├── services/           # 业务逻辑服务
│   ├── ApiService.js
│   ├── GameService.js
│   └── PlayerService.js
├── utils/              # 工具函数
│   ├── request.js
│   ├── validators.js
│   └── helpers.js
├── config/             # 配置文件
│   ├── api.js
│   └── constants.js
└── models/             # 数据模型
    ├── Player.js
    └── Game.js
```

#### API服务封装
```javascript
// services/ApiService.js - 小程序API服务
const { API_BASE_URL, REQUEST_TIMEOUT } = require('../config/api');

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = REQUEST_TIMEOUT;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }
  
  // 通用请求方法
  request(options) {
    return new Promise((resolve, reject) => {
      const requestOptions = {
        url: `${this.baseURL}${options.url}`,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          ...this.defaultHeaders,
          ...options.header
        },
        timeout: this.timeout,
        
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(this.handleResponse(res.data));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.data?.message || '请求失败'}`));
          }
        },
        
        fail: (err) => {
          reject(new Error(`网络请求失败: ${err.errMsg}`));
        }
      };
      
      wx.request(requestOptions);
    });
  }
  
  // 响应处理
  handleResponse(data) {
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || '服务器错误');
    }
  }
  
  // GET请求
  get(url, params = {}) {
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    
    return this.request({
      url: fullUrl,
      method: 'GET'
    });
  }
  
  // POST请求
  post(url, data = {}) {
    return this.request({
      url,
      method: 'POST',
      data
    });
  }
  
  // PUT请求
  put(url, data = {}) {
    return this.request({
      url,
      method: 'PUT',
      data
    });
  }
  
  // DELETE请求
  delete(url) {
    return this.request({
      url,
      method: 'DELETE'
    });
  }
}

// 导出单例实例
module.exports = new ApiService();
```

#### 业务服务层
```javascript
// services/GameService.js - 游戏业务服务
const ApiService = require('./ApiService');
const { validateRoomData } = require('../utils/validators');
const { GAME_STATES, ERROR_CODES } = require('../config/constants');

class GameService {
  constructor() {
    this.apiService = ApiService;
  }
  
  // 创建房间
  async createRoom(roomData) {
    try {
      // 数据验证
      const validation = validateRoomData(roomData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      // 发送创建请求
      const room = await this.apiService.post('/rooms', {
        name: roomData.name,
        maxPlayers: roomData.maxPlayers || 9,
        blinds: roomData.blinds || { small: 10, big: 20 },
        private: roomData.private || false
      });
      
      return room;
      
    } catch (error) {
      console.error('创建房间失败:', error);
      throw error;
    }
  }
  
  // 加入房间
  async joinRoom(roomId, playerId) {
    try {
      const result = await this.apiService.post(`/rooms/${roomId}/join`, {
        playerId
      });
      
      return result;
      
    } catch (error) {
      console.error('加入房间失败:', error);
      
      // 错误码处理
      if (error.message.includes('房间已满')) {
        throw new Error(ERROR_CODES.ROOM_FULL);
      } else if (error.message.includes('房间不存在')) {
        throw new Error(ERROR_CODES.NOT_FOUND);
      }
      
      throw error;
    }
  }
  
  // 获取房间信息
  async getRoomInfo(roomId) {
    try {
      return await this.apiService.get(`/rooms/${roomId}`);
    } catch (error) {
      console.error('获取房间信息失败:', error);
      throw error;
    }
  }
  
  // 玩家操作
  async playerAction(roomId, playerId, action) {
    try {
      const result = await this.apiService.post(`/rooms/${roomId}/actions`, {
        playerId,
        action: action.type,
        amount: action.amount
      });
      
      return result;
      
    } catch (error) {
      console.error('玩家操作失败:', error);
      
      if (error.message.includes('筹码不足')) {
        throw new Error(ERROR_CODES.INSUFFICIENT_CHIPS);
      }
      
      throw error;
    }
  }
  
  // 获取游戏历史
  async getGameHistory(playerId, page = 1, limit = 20) {
    try {
      return await this.apiService.get('/games/history', {
        playerId,
        page,
        limit
      });
    } catch (error) {
      console.error('获取游戏历史失败:', error);
      throw error;
    }
  }
}

module.exports = new GameService();
```

---

## 💡 5. CommonJS最佳实践

### 模块设计原则

#### 单一职责原则
```javascript
// ❌ 不好的设计 - 一个模块做太多事情
// gameUtils.js
module.exports = {
  // 网络请求
  makeApiCall: (url, data) => { /* ... */ },
  
  // 数据验证  
  validatePlayer: (player) => { /* ... */ },
  
  // UI操作
  showToast: (message) => { /* ... */ },
  
  // 数学计算
  calculateWinRate: (wins, losses) => { /* ... */ },
  
  // 文件操作
  saveGameData: (data) => { /* ... */ }
};

// ✅ 好的设计 - 单一职责

// utils/validators.js
module.exports = {
  validatePlayer: (player) => { /* ... */ },
  validateRoom: (room) => { /* ... */ },
  validateGameAction: (action) => { /* ... */ }
};

// utils/calculations.js  
module.exports = {
  calculateWinRate: (wins, losses) => { /* ... */ },
  calculatePotOdds: (pot, bet) => { /* ... */ },
  calculateHandStrength: (cards) => { /* ... */ }
};

// services/ApiService.js
module.exports = {
  get: (url, params) => { /* ... */ },
  post: (url, data) => { /* ... */ },
  put: (url, data) => { /* ... */ }
};

// utils/ui.js
module.exports = {
  showToast: (message) => { /* ... */ },
  showModal: (title, content) => { /* ... */ },
  showLoading: (text) => { /* ... */ }
};
```

#### 接口设计原则
```javascript
// ✅ 清晰的接口设计

// services/PlayerService.js
class PlayerService {
  // 构造函数明确依赖
  constructor(apiService, validator) {
    this.api = apiService;
    this.validator = validator;
  }
  
  // 方法名称清晰，参数明确
  async createPlayer({ name, email, initialChips = 1000 }) {
    // 参数验证
    const validation = this.validator.validatePlayerData({ name, email });
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }
    
    try {
      return await this.api.post('/players', {
        name,
        email,
        chips: initialChips,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      throw new ServiceError('创建玩家失败', error);
    }
  }
  
  // 返回值结构一致
  async getPlayer(playerId) {
    try {
      const player = await this.api.get(`/players/${playerId}`);
      return {
        success: true,
        data: player
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// 自定义错误类
class ValidationError extends Error {
  constructor(errors) {
    super(`验证失败: ${errors.join(', ')}`);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

class ServiceError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'ServiceError';
    this.originalError = originalError;
  }
}

module.exports = {
  PlayerService,
  ValidationError,
  ServiceError
};
```

#### 依赖注入模式
```javascript
// ✅ 使用依赖注入提高可测试性

// services/GameEngine.js
class GameEngine {
  constructor(dependencies) {
    // 依赖注入，而不是直接require
    this.playerService = dependencies.playerService;
    this.roomService = dependencies.roomService;
    this.logger = dependencies.logger;
    this.eventEmitter = dependencies.eventEmitter;
  }
  
  async startGame(roomId) {
    try {
      this.logger.info(`开始游戏，房间ID: ${roomId}`);
      
      const room = await this.roomService.getRoom(roomId);
      const players = await this.playerService.getPlayersInRoom(roomId);
      
      // 游戏逻辑...
      
      this.eventEmitter.emit('gameStarted', { roomId, players });
      
      return { success: true, gameId: generateGameId() };
      
    } catch (error) {
      this.logger.error('游戏启动失败', error);
      throw error;
    }
  }
}

// 工厂函数创建完整的依赖图
function createGameEngine() {
  const logger = require('./utils/logger');
  const EventEmitter = require('events');
  const PlayerService = require('./services/PlayerService');
  const RoomService = require('./services/RoomService');
  const ApiService = require('./services/ApiService');
  
  const eventEmitter = new EventEmitter();
  const playerService = new PlayerService(ApiService);
  const roomService = new RoomService(ApiService);
  
  return new GameEngine({
    playerService,
    roomService,
    logger,
    eventEmitter
  });
}

module.exports = {
  GameEngine,
  createGameEngine
};
```

### 错误处理最佳实践

```javascript
// utils/errorHandler.js - 统一错误处理
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, field) {
    super(message, 400);
    this.field = field;
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} 不存在`, 404);
    this.resource = resource;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = '未授权访问') {
    super(message, 401);
  }
}

// 错误处理中间件
function errorHandler(error, req, res, next) {
  if (error.isOperational) {
    // 预期错误，安全返回给客户端
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }
  
  // 非预期错误，记录日志但不暴露详细信息
  console.error('非预期错误:', error);
  
  return res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  errorHandler
};

// 在服务中使用
// services/PlayerService.js
const { ValidationError, NotFoundError } = require('../utils/errorHandler');

class PlayerService {
  async getPlayer(playerId) {
    if (!playerId) {
      throw new ValidationError('玩家ID不能为空', 'playerId');
    }
    
    try {
      const player = await Player.findById(playerId);
      if (!player) {
        throw new NotFoundError('玩家');
      }
      return player;
    } catch (error) {
      if (error instanceof AppError) {
        throw error; // 重新抛出应用错误
      }
      
      // 包装未知错误
      throw new Error('获取玩家信息失败');
    }
  }
}
```

### 性能优化策略

#### 模块懒加载
```javascript
// utils/moduleLoader.js - 模块懒加载器
class ModuleLoader {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
  }
  
  async loadModule(moduleName) {
    // 检查缓存
    if (this.cache.has(moduleName)) {
      return this.cache.get(moduleName);
    }
    
    // 避免重复加载
    if (this.loading.has(moduleName)) {
      return this.loading.get(moduleName);
    }
    
    // 异步加载模块
    const loadPromise = this.doLoadModule(moduleName);
    this.loading.set(moduleName, loadPromise);
    
    try {
      const module = await loadPromise;
      this.cache.set(moduleName, module);
      this.loading.delete(moduleName);
      return module;
    } catch (error) {
      this.loading.delete(moduleName);
      throw error;
    }
  }
  
  async doLoadModule(moduleName) {
    switch (moduleName) {
      case 'ai-player':
        return require('./ai/AIPlayer');
      case 'statistics':
        return require('./analytics/Statistics');
      case 'advanced-rules':
        return require('./rules/AdvancedRules');
      default:
        throw new Error(`未知模块: ${moduleName}`);
    }
  }
  
  // 预加载常用模块
  async preloadCommonModules() {
    const commonModules = ['ai-player', 'statistics'];
    await Promise.all(commonModules.map(name => this.loadModule(name)));
  }
  
  // 清理缓存
  clearCache() {
    this.cache.clear();
  }
}

const moduleLoader = new ModuleLoader();

// 导出单例
module.exports = moduleLoader;

// 使用示例
// services/GameService.js
const moduleLoader = require('../utils/moduleLoader');

class GameService {
  async enableAI(gameId) {
    try {
      const AIPlayer = await moduleLoader.loadModule('ai-player');
      const aiPlayer = new AIPlayer({ difficulty: 'medium' });
      
      // 添加AI玩家到游戏...
      
      return aiPlayer;
    } catch (error) {
      console.error('AI模块加载失败:', error);
      throw new Error('AI功能暂时不可用');
    }
  }
}
```
