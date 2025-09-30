# JavaScript面向对象开发完整指南

## 目录
1. [ES6对象基础语法](#1-es6对象基础语法)
2. [Object静态方法](#2-object静态方法)
3. [类与继承](#3-类与继承)
4. [设计模式](#4-设计模式)
5. [错误处理](#5-错误处理)
6. [性能优化](#6-性能优化)
7. [微信小程序实战应用](#7-微信小程序实战应用)
8. [高级特性补充](#8-高级特性补充)

## 1. ES6对象基础语法

### 1.1 属性简写
ES6允许直接使用变量名作为对象属性：

```javascript
const name = 'John';
const age = 30;
const person = { name, age };
```

### 1.2 方法简写
对象方法可以省略`function`关键字：

```javascript
const obj = {
  sayHello() {
    return 'Hello!';
  }
};
```

### 1.3 计算属性名
使用表达式作为对象属性名：

```javascript
const propKey = 'dynamicProp';
const obj = {
  [propKey]: 'value',
  ['prop_' + Math.random()]: 'random'
};
```

### 1.4 super关键字
访问对象原型上的方法：

```javascript
const proto = { x: 'hello' };
const obj = {
  x: 'world',
  find() {
    return super.x; 
  }
};
Object.setPrototypeOf(obj, proto);

console.log(obj.find()); // hello
```

### 1.5 扩展运算符
用于对象合并和克隆：

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

// 对象合并
const merged = { ...obj1, ...obj2 };

// 对象克隆（浅拷贝）
const cloned = { ...obj1 };

// 属性覆盖
const updated = { ...obj1, b: 20 };
```

### 1.6 解构赋值
从对象中提取属性：

```javascript
const person = { name: 'John', age: 30, city: 'New York' };

// 基础解构
const { name, age } = person;

// 重命名变量
const { name: personName, age: personAge } = person;

// 默认值
const { height = 180 } = person;

// 剩余参数
const { name, ...rest } = person;
console.log(rest); // { age: 30, city: 'New York' }
```

## 2. Object静态方法

### 2.1 Object.is()
提供更精确的相等性比较：

```javascript
// 与 === 的区别
Object.is(+0, -0);        // false (=== 返回 true)
Object.is(NaN, NaN);      // true  (=== 返回 false)
Object.is('foo', 'foo');  // true
```

### 2.2 Object.assign()
用于对象合并，复制可枚举属性：

```javascript
const target = { a: 1, b: 2 };
const source1 = { b: 3, c: 4 };
const source2 = { c: 5, d: 6 };

Object.assign(target, source1, source2); // target: { a: 1, b: 3, c: 5, d: 6 }

// 常用于对象克隆
const clone = Object.assign({}, original);
```

### 2.3 属性遍历方法

```javascript
const obj = { name: 'John', age: 30, city: 'NYC' };

// 获取所有可枚举属性名
Object.keys(obj);     // ['name', 'age', 'city']

// 获取所有可枚举属性值
Object.values(obj);   // ['John', 30, 'NYC']

// 获取键值对数组
Object.entries(obj);  // [['name', 'John'], ['age', 30], ['city', 'NYC']]

// 从键值对创建对象
Object.fromEntries([['a', 1], ['b', 2]]); // { a: 1, b: 2 }
```

### 2.4 原型操作方法

```javascript
const parent = { x: 1 };
const child = { y: 2 };

// 设置原型
Object.setPrototypeOf(child, parent);

// 获取原型
Object.getPrototypeOf(child); // parent

// 检查自有属性
Object.hasOwn(child, 'y');    // true (ES2022新增)
child.hasOwnProperty('y');    // true (传统方法)
```

## 3. 类与继承

### 3.1 基础类定义

```javascript
class BaseService {
  constructor(config = {}) {
    this.config = config;
    this.initialized = false;
  }
  
  // 实例方法
  init() {
    this.initialized = true;
    return this;
  }
  
  // 静态方法
  static create(config) {
    return new this(config).init();
  }
  
  // Getter访问器
  get isReady() {
    return this.initialized;
  }
  
  // Setter访问器
  set status(value) {
    this.initialized = value;
  }
}
```

### 3.2 继承与多态

```javascript
class ApiService extends BaseService {
  constructor(baseURL) {
    super({ baseURL });  // 调用父类构造器
    this.baseURL = baseURL;
  }
  
  // 重写父类方法
  init() {
    super.init();  // 调用父类方法
    console.log('API Service ready');
    return this;
  }
  
  // 抽象方法 - 子类必须实现
  handleResponse(data) {
    throw new Error('handleResponse must be implemented by subclass');
  }
}

// 具体实现类
class GameApiService extends ApiService {
  constructor() {
    super('https://api.game.com');
  }
  
  // 实现抽象方法
  handleResponse(data) {
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message);
  }
  
  // 业务方法
  async createRoom(roomData) {
    const response = await this.request('/rooms', {
      method: 'POST',
      data: roomData
    });
    return this.handleResponse(response);
  }
}
```

### 3.3 混入模式(Mixin)

```javascript
// 事件混入功能
const EventMixin = {
  _listeners: {},
  
  on(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(callback);
    return this;
  },
  
  emit(event, ...args) {
    const listeners = this._listeners[event];
    if (listeners) {
      listeners.forEach(callback => callback.apply(this, args));
    }
    return this;
  },
  
  off(event, callback) {
    if (!callback) {
      delete this._listeners[event];
    } else {
      const listeners = this._listeners[event];
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    }
    return this;
  }
};

// 使用混入
class GameRoom {
  constructor(id) {
    this.id = id;
    this.players = [];
    
    // 混入事件功能
    Object.assign(this, EventMixin);
    this._listeners = {};
  }
  
  addPlayer(player) {
    this.players.push(player);
    this.emit('playerJoined', player);
  }
}
```

## 4. 设计模式

### 4.1 单例模式

```javascript
class ServiceManager {
  constructor() {
    this.services = new Map();
  }
  
  register(name, ServiceClass, ...args) {
    if (this.services.has(name)) {
      console.warn(`Service ${name} already registered`);
      return;
    }
    
    const instance = new ServiceClass(...args);
    this.services.set(name, instance);
    return instance;
  }
  
  get(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service;
  }
}

// 单例实例
const serviceManager = new ServiceManager();
module.exports = serviceManager;
```

### 4.2 观察者模式

```javascript
class Observable {
  constructor(initialData = {}) {
    this._data = { ...initialData };
    this._observers = new Map();
  }
  
  subscribe(key, observer) {
    if (!this._observers.has(key)) {
      this._observers.set(key, []);
    }
    this._observers.get(key).push(observer);
    
    // 返回取消订阅函数
    return () => this.unsubscribe(key, observer);
  }
  
  set(key, value) {
    const oldValue = this._data[key];
    this._data[key] = value;
    this._notify(key, value, oldValue);
  }
  
  get(key) {
    return this._data[key];
  }
  
  _notify(key, newValue, oldValue) {
    const observers = this._observers.get(key);
    if (observers) {
      observers.forEach(observer => {
        try {
          observer(newValue, oldValue, key);
        } catch (error) {
          console.error('Observer error:', error);
        }
      });
    }
  }
}
```

### 4.3 策略模式

```javascript
// 抽象策略类
class AIStrategy {
  makeDecision(gameState, playerState) {
    throw new Error('makeDecision must be implemented');
  }
  
  calculateHandStrength(cards) {
    // 通用辅助方法
    return Math.random();
  }
}

// 具体策略实现
class ConservativeStrategy extends AIStrategy {
  makeDecision(gameState, playerState) {
    const handStrength = this.calculateHandStrength(playerState.cards);
    
    if (handStrength > 0.7) {
      return { action: 'raise', amount: gameState.minBet * 2 };
    } else if (handStrength > 0.4) {
      return { action: 'call', amount: gameState.currentBet };
    } else {
      return { action: 'fold' };
    }
  }
}

class AggressiveStrategy extends AIStrategy {
  makeDecision(gameState, playerState) {
    const handStrength = this.calculateHandStrength(playerState.cards);
    const bluffChance = Math.random();
    
    if (handStrength > 0.5 || bluffChance < 0.3) {
      return { action: 'raise', amount: gameState.minBet * 3 };
    }
    return { action: 'call', amount: gameState.currentBet };
  }
}

// 策略管理器
class AIService {
  constructor() {
    this.strategies = {
      'conservative': new ConservativeStrategy(),
      'aggressive': new AggressiveStrategy()
    };
    this.currentStrategy = 'conservative';
  }
  
  setStrategy(strategyName) {
    if (this.strategies[strategyName]) {
      this.currentStrategy = strategyName;
    }
  }
  
  makeDecision(gameState, playerState) {
    const strategy = this.strategies[this.currentStrategy];
    return strategy.makeDecision(gameState, playerState);
  }
}
```

## 5. 错误处理

### 5.1 自定义错误类

```javascript
class GameError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'GameError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

// 具体错误类型
class ValidationError extends GameError {
  constructor(field, value, rule) {
    super(`Validation failed for field: ${field}`, 'VALIDATION_ERROR', {
      field, value, rule
    });
    this.name = 'ValidationError';
  }
}

class NetworkError extends GameError {
  constructor(message, statusCode) {
    super(message, 'NETWORK_ERROR', { statusCode });
    this.name = 'NetworkError';
  }
}
```

### 5.2 错误处理装饰器

```javascript
function catchErrors(errorHandler) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (typeof errorHandler === 'function') {
          return errorHandler.call(this, error, ...args);
        } else {
          console.error(`Error in ${target.constructor.name}.${propertyKey}:`, error);
          throw error;
        }
      }
    };
    
    return descriptor;
  };
}

// 使用装饰器
class RoomService {
  @catchErrors(function(error, roomId) {
    console.error('Failed to join room:', error);
    wx.showToast({ title: '加入房间失败', icon: 'error' });
    return null;
  })
  async joinRoom(roomId) {
    const response = await apiService.joinRoom(roomId);
    return response.data;
  }
}
```

## 6. 性能优化

### 6.1 对象池模式

```javascript
class ObjectPool {
  constructor(createFn, resetFn, maxSize = 100) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;
    this.pool = [];
    this.usedObjects = new Set();
  }
  
  acquire() {
    let obj;
    if (this.pool.length > 0) {
      obj = this.pool.pop();
    } else {
      obj = this.createFn();
    }
    
    this.usedObjects.add(obj);
    return obj;
  }
  
  release(obj) {
    if (this.usedObjects.has(obj)) {
      this.usedObjects.delete(obj);
      
      if (this.pool.length < this.maxSize) {
        this.resetFn(obj);
        this.pool.push(obj);
      }
    }
  }
}

// 使用示例
const cardPool = new ObjectPool(
  () => ({ suit: '', rank: '', visible: false }),
  (card) => {
    card.suit = '';
    card.rank = '';
    card.visible = false;
  }
);
```

### 6.2 生命周期管理

```javascript
class LifecycleManager {
  constructor() {
    this.instances = new WeakMap();
    this.cleanupTasks = new Map();
  }
  
  register(instance, cleanupFn) {
    const id = this.generateId();
    this.instances.set(instance, id);
    this.cleanupTasks.set(id, cleanupFn);
    
    if (typeof instance.onUnload === 'function') {
      const originalUnload = instance.onUnload;
      instance.onUnload = () => {
        this.cleanup(instance);
        originalUnload.call(instance);
      };
    }
    
    return id;
  }
  
  cleanup(instance) {
    const id = this.instances.get(instance);
    if (id) {
      const cleanupFn = this.cleanupTasks.get(id);
      if (cleanupFn) {
        try {
          cleanupFn();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
        this.cleanupTasks.delete(id);
      }
      this.instances.delete(instance);
    }
  }
  
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
```

## 7. 微信小程序实战应用

### 7.1 微信小程序环境特点

- **JavaScript引擎**: V8引擎（Android）、JavaScriptCore（iOS）
- **ES6支持**: 完整支持ES6+语法，自动Babel编译
- **模块系统**: 推荐使用CommonJS
- **限制**: 无DOM、无BOM、不支持`eval`和`new Function`

### 7.2 完整的房间管理系统

```javascript
// services/PokerRoomService.js
const { Observable } = require('../utils/Observable');
const { GameError, ValidationError } = require('../errors/GameError');
const EventMixin = require('../mixins/EventMixin');

class PokerRoomService extends Observable {
  constructor() {
    super({
      roomInfo: null,
      players: [],
      gameState: 'waiting',
      currentRound: 0,
      pot: 0,
      communityCards: [],
      deck: []
    });
    
    // 混入事件功能
    Object.assign(this, EventMixin);
    this._listeners = {};
    
    this.maxPlayers = 9;
    this.minPlayers = 2;
    this.blinds = { small: 10, big: 20 };
  }
  
  // 创建房间
  async createRoom(roomConfig) {
    this.validateRoomConfig(roomConfig);
    
    try {
      const roomInfo = {
        id: this.generateRoomId(),
        name: roomConfig.name,
        createdAt: new Date(),
        createdBy: roomConfig.creator,
        status: 'active',
        settings: {
          blinds: roomConfig.blinds || this.blinds,
          maxPlayers: roomConfig.maxPlayers || this.maxPlayers
        }
      };
      
      this.set('roomInfo', roomInfo);
      this.emit('roomCreated', roomInfo);
      
      return roomInfo;
    } catch (error) {
      throw new GameError('Failed to create room', 'CREATE_ROOM_ERROR', { roomConfig });
    }
  }
  
  // 加入房间
  async joinRoom(roomId, player) {
    const roomInfo = this.get('roomInfo');
    if (!roomInfo || roomInfo.id !== roomId) {
      throw new GameError('Room not found', 'ROOM_NOT_FOUND', { roomId });
    }
    
    const players = this.get('players');
    
    if (players.some(p => p.id === player.id)) {
      throw new GameError('Player already in room', 'PLAYER_ALREADY_EXISTS', { playerId: player.id });
    }
    
    if (players.length >= roomInfo.settings.maxPlayers) {
      throw new GameError('Room is full', 'ROOM_FULL', { 
        current: players.length, 
        max: roomInfo.settings.maxPlayers 
      });
    }
    
    const newPlayer = {
      ...player,
      chips: 1000,
      status: 'active',
      position: players.length,
      joinedAt: new Date()
    };
    
    const updatedPlayers = [...players, newPlayer];
    this.set('players', updatedPlayers);
    this.emit('playerJoined', newPlayer);
    
    return newPlayer;
  }
  
  // 玩家行动
  playerAction(playerId, action) {
    const players = this.get('players');
    const playerIndex = players.findIndex(p => p.id === playerId);
    
    if (playerIndex === -1) {
      throw new GameError('Player not found', 'PLAYER_NOT_FOUND', { playerId });
    }
    
    const player = players[playerIndex];
    let updatedPlayer;
    
    switch (action.type) {
      case 'fold':
        updatedPlayer = { ...player, status: 'folded' };
        break;
        
      case 'call':
        const callAmount = this.calculateCallAmount(player);
        if (player.chips < callAmount) {
          throw new GameError('Insufficient chips', 'INSUFFICIENT_CHIPS', {
            required: callAmount,
            available: player.chips
          });
        }
        updatedPlayer = {
          ...player,
          chips: player.chips - callAmount,
          currentBet: (player.currentBet || 0) + callAmount
        };
        break;
        
      case 'raise':
        const raiseAmount = action.amount;
        if (player.chips < raiseAmount) {
          throw new GameError('Insufficient chips for raise', 'INSUFFICIENT_CHIPS', {
            required: raiseAmount,
            available: player.chips
          });
        }
        updatedPlayer = {
          ...player,
          chips: player.chips - raiseAmount,
          currentBet: raiseAmount
        };
        break;
        
      default:
        throw new GameError('Invalid action', 'INVALID_ACTION', { action });
    }
    
    const updatedPlayers = [...players];
    updatedPlayers[playerIndex] = updatedPlayer;
    this.set('players', updatedPlayers);
    
    this.emit('playerAction', { player: updatedPlayer, action });
    this.checkRoundEnd();
  }
  
  // 工具方法
  validateRoomConfig(config) {
    if (!config.name || typeof config.name !== 'string') {
      throw new ValidationError('name', config.name, 'must be a non-empty string');
    }
    
    if (!config.creator || !config.creator.id) {
      throw new ValidationError('creator', config.creator, 'must have valid creator with id');
    }
  }
  
  generateRoomId() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  
  calculateCallAmount(player) {
    const highestBet = Math.max(...this.get('players').map(p => p.currentBet || 0));
    return Math.max(0, highestBet - (player.currentBet || 0));
  }
  
  checkRoundEnd() {
    const players = this.get('players');
    const activePlayers = players.filter(p => p.status === 'active');
    
    if (activePlayers.length <= 1) {
      this.endRound();
    }
  }
  
  endRound() {
    this.emit('roundEnd');
    // 结算逻辑...
  }
}

module.exports = PokerRoomService;
```

### 7.3 页面集成示例

```javascript
// pages/room/room.js
const PokerRoomService = require('../../services/PokerRoomService');

Page({
  data: {
    roomInfo: null,
    players: [],
    currentUser: null,
    gameState: 'waiting'
  },
  
  onLoad(options) {
    this.roomService = new PokerRoomService();
    this.initRoomService();
    
    if (options.roomId) {
      this.joinExistingRoom(options.roomId);
    }
  },
  
  initRoomService() {
    // 订阅房间信息变化
    this.roomService.subscribe('roomInfo', (roomInfo) => {
      this.setData({ roomInfo });
    });
    
    // 订阅玩家变化
    this.roomService.subscribe('players', (players) => {
      this.setData({ players });
    });
    
    // 监听游戏事件
    this.roomService.on('playerJoined', (player) => {
      wx.showToast({
        title: `${player.name} 加入房间`,
        icon: 'success'
      });
    });
    
    this.roomService.on('playerAction', ({ player, action }) => {
      this.updatePlayerActionUI(player, action);
    });
  },
  
  async createRoom() {
    try {
      const currentUser = wx.getStorageSync('currentUser');
      const roomConfig = {
        name: '德州扑克房间',
        creator: currentUser,
        maxPlayers: 6
      };
      
      const roomInfo = await this.roomService.createRoom(roomConfig);
      wx.showToast({
        title: '房间创建成功',
        icon: 'success'
      });
    } catch (error) {
      wx.showToast({
        title: error.message || '创建房间失败',
        icon: 'error'
      });
    }
  },
  
  async joinRoom(roomId) {
    try {
      const currentUser = wx.getStorageSync('currentUser');
      const player = await this.roomService.joinRoom(roomId, currentUser);
      
      this.setData({ currentUser: player });
      wx.showToast({
        title: '成功加入房间',
        icon: 'success'
      });
    } catch (error) {
      wx.showToast({
        title: error.message || '加入房间失败',
        icon: 'error'
      });
    }
  },
  
  onPlayerAction(e) {
    const { action, amount } = e.currentTarget.dataset;
    const currentUser = this.data.currentUser;
    
    try {
      this.roomService.playerAction(currentUser.id, {
        type: action,
        amount: amount
      });
    } catch (error) {
      wx.showToast({
        title: error.message,
        icon: 'error'
      });
    }
  },
  
  updatePlayerActionUI(player, action) {
    // 更新UI显示玩家操作
    console.log(`${player.name} 执行了 ${action.type} 操作`);
  },
  
  onUnload() {
    // 清理资源
    if (this.roomService) {
      this.roomService.cleanup && this.roomService.cleanup();
    }
  }
});
```

## 8. 高级特性补充

### 8.1 原型链机制详解

JavaScript对象系统基于原型链实现继承：

```javascript
// 理解原型链的本质
function Person(name) {
  this.name = name;
}
Person.prototype.sayHello = function() {
  return `Hello, ${this.name}`;
};

const person = new Person('John');

// 原型链查找过程
console.log(person.sayHello()); // 通过原型链找到方法

// 理解原型关系
console.log(person.__proto__ === Person.prototype);           // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null);             // true

// ES6 Class 本质上也是原型链
class Animal {}
class Dog extends Animal {}

console.log(Dog.prototype.__proto__ === Animal.prototype);    // true
console.log(Dog.__proto__ === Animal);                        // true

// 动态修改原型链
const parent = { type: 'parent' };
const child = { name: 'child' };
Object.setPrototypeOf(child, parent);
console.log(child.type); // 'parent' - 通过原型链访问
```

### 8.2 元编程技术

#### Proxy和Reflect
```javascript
// Proxy实现数据拦截
class ReactiveObject {
  constructor(target) {
    this._target = target;
    this._listeners = new Map();
    
    return new Proxy(target, {
      get: (target, property, receiver) => {
        console.log(`访问属性: ${property}`);
        return Reflect.get(target, property, receiver);
      },
      
      set: (target, property, value, receiver) => {
        const oldValue = target[property];
        const result = Reflect.set(target, property, value, receiver);
        
        if (oldValue !== value) {
          this._notify(property, value, oldValue);
        }
        
        return result;
      },
      
      has: (target, property) => {
        console.log(`检查属性存在: ${property}`);
        return Reflect.has(target, property);
      },
      
      deleteProperty: (target, property) => {
        console.log(`删除属性: ${property}`);
        return Reflect.deleteProperty(target, property);
      }
    });
  }
  
  _notify(property, newValue, oldValue) {
    const listeners = this._listeners.get(property);
    if (listeners) {
      listeners.forEach(listener => listener(newValue, oldValue));
    }
  }
  
  watch(property, callback) {
    if (!this._listeners.has(property)) {
      this._listeners.set(property, []);
    }
    this._listeners.get(property).push(callback);
  }
}

// 使用示例
const data = new ReactiveObject({ name: 'John', age: 30 });
data.watch('name', (newValue, oldValue) => {
  console.log(`姓名从 ${oldValue} 变为 ${newValue}`);
});

data.name = 'Jane'; // 触发监听器
```

#### 属性描述符
```javascript
// 精确控制属性特性
class ConfigurableObject {
  constructor() {
    // 定义只读属性
    Object.defineProperty(this, 'id', {
      value: Math.random().toString(36),
      writable: false,      // 不可写
      enumerable: true,     // 可枚举
      configurable: false   // 不可重配置
    });
    
    // 定义访问器属性
    let _value = 0;
    Object.defineProperty(this, 'counter', {
      get() {
        console.log('读取counter');
        return _value;
      },
      set(newValue) {
        console.log(`设置counter为: ${newValue}`);
        if (typeof newValue !== 'number') {
          throw new TypeError('Counter must be a number');
        }
        _value = newValue;
      },
      enumerable: true,
      configurable: true
    });
  }
  
  // 批量定义属性
  static defineProperties(obj, properties) {
    Object.defineProperties(obj, properties);
    return obj;
  }
}

// 使用示例
const obj = new ConfigurableObject();
console.log(obj.id);        // 只读ID
obj.counter = 10;           // 触发setter
console.log(obj.counter);   // 触发getter

// obj.id = 'new-id';       // 抛出错误，只读属性
```

### 8.3 现代私有属性语法

ES2022引入了真正的私有字段语法：

```javascript
class ModernClass {
  // 私有字段
  #privateField = 'secret';
  #computedField;
  
  // 静态私有字段
  static #staticPrivate = 'static secret';
  
  constructor(value) {
    this.#computedField = this.#calculateValue(value);
  }
  
  // 私有方法
  #calculateValue(input) {
    return input * 2 + Math.random();
  }
  
  // 静态私有方法
  static #staticPrivateMethod() {
    return ModernClass.#staticPrivate;
  }
  
  // 公共方法访问私有成员
  getPrivateData() {
    return {
      field: this.#privateField,
      computed: this.#computedField
    };
  }
  
  updatePrivateField(value) {
    this.#privateField = this.#validateInput(value);
  }
  
  #validateInput(value) {
    if (typeof value !== 'string') {
      throw new TypeError('Value must be a string');
    }
    return value;
  }
  
  // 检查私有字段是否存在
  hasPrivateField(obj) {
    return #privateField in obj;
  }
}

// 使用示例
const instance = new ModernClass(10);
console.log(instance.getPrivateData());

// 无法从外部访问私有字段
// console.log(instance.#privateField); // SyntaxError

// 继承中的私有字段
class ExtendedClass extends ModernClass {
  #ownPrivateField = 'extended secret';
  
  constructor(value) {
    super(value);
    // 无法直接访问父类私有字段
    // console.log(this.#privateField); // SyntaxError
  }
  
  getExtendedData() {
    return {
      parent: this.getPrivateData(), // 通过公共方法访问
      own: this.#ownPrivateField
    };
  }
}
```

### 8.4 异步模式与面向对象结合

```javascript
// 异步类设计模式
class AsyncDataService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.cache = new Map();
    this.pendingRequests = new Map();
  }
  
  // Promise链式操作
  async fetchUserData(userId) {
    return this.apiClient
      .get(`/users/${userId}`)
      .then(this.validateResponse.bind(this))
      .then(this.transformUserData.bind(this))
      .then(this.cacheUserData.bind(this))
      .catch(this.handleError.bind(this));
  }
  
  validateResponse(response) {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }
  
  transformUserData(userData) {
    return {
      id: userData.id,
      name: userData.full_name,
      email: userData.email_address,
      avatar: userData.profile_image_url,
      createdAt: new Date(userData.created_at)
    };
  }
  
  cacheUserData(userData) {
    this.cache.set(userData.id, userData);
    return userData;
  }
  
  handleError(error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
  
  // 防重复请求
  async fetchWithDeduplication(userId) {
    // 检查缓存
    if (this.cache.has(userId)) {
      return this.cache.get(userId);
    }
    
    // 检查正在进行的请求
    if (this.pendingRequests.has(userId)) {
      return this.pendingRequests.get(userId);
    }
    
    // 创建新请求
    const request = this.fetchUserData(userId)
      .finally(() => {
        this.pendingRequests.delete(userId);
      });
    
    this.pendingRequests.set(userId, request);
    return request;
  }
  
  // 并行处理多个请求
  async fetchMultipleUsers(userIds) {
    const promises = userIds.map(id => this.fetchWithDeduplication(id));
    
    try {
      return await Promise.all(promises);
    } catch (error) {
      console.error('Failed to fetch multiple users:', error);
      throw error;
    }
  }
  
  // 异步迭代器
  async* getUsersStream(userIds) {
    for (const userId of userIds) {
      try {
        const userData = await this.fetchWithDeduplication(userId);
        yield userData;
      } catch (error) {
        console.error(`Failed to fetch user ${userId}:`, error);
        // 继续处理其他用户
      }
    }
  }
}

// 使用示例
const dataService = new AsyncDataService(apiClient);

// 串行处理
const userData = await dataService.fetchUserData('123');

// 并行处理
const allUsers = await dataService.fetchMultipleUsers(['123', '456', '789']);

// 流式处理
for await (const user of dataService.getUsersStream(['123', '456', '789'])) {
  console.log('处理用户:', user.name);
}
```

### 8.5 函数式编程结合

```javascript
// 函数式编程与OOP结合
class FunctionalDataProcessor {
  constructor(data = []) {
    this.data = data;
  }
  
  // 高阶函数方法
  map(transformer) {
    return new FunctionalDataProcessor(
      this.data.map(transformer)
    );
  }
  
  filter(predicate) {
    return new FunctionalDataProcessor(
      this.data.filter(predicate)
    );
  }
  
  reduce(reducer, initialValue) {
    return this.data.reduce(reducer, initialValue);
  }
  
  // 柯里化方法
  static createValidator(rule) {
    return (data) => rule.test ? rule.test(data) : rule(data);
  }
  
  static createTransformer(transformFn) {
    return (item) => transformFn(item);
  }
  
  // 函数组合
  static compose(...functions) {
    return (value) => functions.reduceRight((acc, fn) => fn(acc), value);
  }
  
  static pipe(...functions) {
    return (value) => functions.reduce((acc, fn) => fn(acc), value);
  }
  
  // 链式调用支持函数式操作
  process(pipeline) {
    return pipeline.reduce((processor, operation) => {
      if (typeof operation === 'function') {
        return operation(processor);
      }
      return processor[operation.method](...operation.args);
    }, this);
  }
  
  // 获取最终结果
  value() {
    return this.data;
  }
  
  // 惰性求值
  lazy() {
    return new LazyDataProcessor(this.data);
  }
}

// 惰性求值实现
class LazyDataProcessor {
  constructor(data) {
    this.data = data;
    this.operations = [];
  }
  
  map(transformer) {
    this.operations.push({ type: 'map', fn: transformer });
    return this;
  }
  
  filter(predicate) {
    this.operations.push({ type: 'filter', fn: predicate });
    return this;
  }
  
  take(count) {
    this.operations.push({ type: 'take', count });
    return this;
  }
  
  // 执行所有操作
  evaluate() {
    return this.operations.reduce((data, operation) => {
      switch (operation.type) {
        case 'map':
          return data.map(operation.fn);
        case 'filter':
          return data.filter(operation.fn);
        case 'take':
          return data.slice(0, operation.count);
        default:
          return data;
      }
    }, this.data);
  }
  
  // 迭代器支持
  *[Symbol.iterator]() {
    let data = this.data;
    let index = 0;
    
    for (const operation of this.operations) {
      if (operation.type === 'take' && index >= operation.count) {
        break;
      }
      
      const item = data[index];
      if (item !== undefined) {
        let processedItem = item;
        
        for (const op of this.operations) {
          if (op.type === 'map') {
            processedItem = op.fn(processedItem);
          } else if (op.type === 'filter' && !op.fn(processedItem)) {
            processedItem = null;
            break;
          }
        }
        
        if (processedItem !== null) {
          yield processedItem;
        }
      }
      
      index++;
    }
  }
}

// 使用示例
const processor = new FunctionalDataProcessor([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// 函数式链式调用
const result = processor
  .filter(x => x % 2 === 0)    // 过滤偶数
  .map(x => x * 2)             // 乘以2
  .filter(x => x > 8)          // 过滤大于8的数
  .value();                    // [12, 16, 20]

// 使用柯里化和组合
const isEven = FunctionalDataProcessor.createValidator(x => x % 2 === 0);
const double = FunctionalDataProcessor.createTransformer(x => x * 2);
const isGreaterThan8 = FunctionalDataProcessor.createValidator(x => x > 8);

const pipeline = FunctionalDataProcessor.compose(
  data => data.filter(isGreaterThan8),
  data => data.map(double),
  data => data.filter(isEven)
);

const composedResult = pipeline([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// 惰性求值
const lazyResult = processor
  .lazy()
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .take(3)
  .evaluate();  // 只在这里执行计算

// 迭代器使用
for (const item of processor.lazy().filter(x => x > 5).map(x => x * 2)) {
  console.log(item);
}
```

## 总结

这份指南涵盖了JavaScript面向对象开发的全部核心知识：

1. **ES6基础语法** - 现代对象字面量语法和实用特性
2. **Object方法** - 强大的内置对象操作方法
3. **类与继承** - 完整的面向对象编程范式
4. **设计模式** - 经典的可复用解决方案
5. **错误处理** - 健壮的异常处理体系
6. **性能优化** - 生产级别的优化技巧
7. **实战应用** - 微信小程序开发的具体实践
8. **高级特性** - 现代JavaScript的前沿技术

掌握这些知识点，你将能够构建出结构清晰、性能优良、易于维护的JavaScript应用程序。在微信小程序开发中，这些技术将帮你构建出专业级的复杂应用。

## 最佳实践要点

- **单一职责原则** - 每个类只负责一个核心功能
- **组合优于继承** - 灵活使用混入和组合模式  
- **错误优先处理** - 预期错误和意外错误分类处理
- **性能考虑** - 合理使用对象池和生命周期管理
- **代码可读性** - 清晰的命名和结构组织
- **现代语法** - 优先使用ES6+特性提升开发效率

通过系统学习和实践这些概念，你将能够编写出高质量的面向对象JavaScript代码。
