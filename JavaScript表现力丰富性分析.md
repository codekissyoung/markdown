# JavaScript表现力丰富性分析

### 函数式编程
```javascript
// 数据处理管道 - 函数式风格
const players = [
  { name: 'Alice', chips: 1000, wins: 8, losses: 2 },
  { name: 'Bob', chips: 1500, wins: 6, losses: 4 },
  { name: 'Charlie', chips: 800, wins: 3, losses: 7 }
];

const topPlayers = players
  .filter(p => p.chips > 900)                           // 筛选
  .map(p => ({ ...p, winRate: p.wins / (p.wins + p.losses) }))  // 转换
  .sort((a, b) => b.winRate - a.winRate)               // 排序
  .slice(0, 2)                                         // 截取
  .reduce((acc, p) => ({ ...acc, [p.name]: p.winRate }), {}); // 聚合

// 结果: { Alice: 0.8, Bob: 0.6 }
```

### 面向对象编程
```javascript
// 经典的面向对象设计
class PokerPlayer extends EventEmitter {
  constructor(name, initialChips = 1000) {
    super();
    this.name = name;
    this.chips = initialChips;
    this.cards = [];
    this.status = 'active';
  }
  
  // 封装行为
  bet(amount) {
    if (amount > this.chips) {
      throw new Error('筹码不足');
    }
    this.chips -= amount;
    this.emit('action', { type: 'bet', amount, player: this.name });
    return amount;
  }
  
  // 多态 - 子类可以重写
  makeDecision(gameState) {
    throw new Error('子类必须实现makeDecision方法');
  }
  
  // 静态方法
  static compare(player1, player2) {
    return player2.chips - player1.chips;
  }
}

// 继承和多态
class AIPlayer extends PokerPlayer {
  makeDecision(gameState) {
    // AI决策逻辑
    const handStrength = this.evaluateHand();
    return handStrength > 0.7 ? 'raise' : 'fold';
  }
}

class HumanPlayer extends PokerPlayer {
  async makeDecision(gameState) {
    // 等待用户输入
    return new Promise(resolve => {
      this.emit('requestDecision', { gameState, resolve });
    });
  }
}
```

### 过程式编程
```javascript
// 传统的步骤式编程 - 适合线性逻辑
function calculateGameResult(players, pot, communityCards) {
  // 第1步：评估每个玩家手牌
  let playerHands = [];
  for (let i = 0; i < players.length; i++) {
    if (players[i].status === 'active') {
      const handValue = evaluateHand([...players[i].cards, ...communityCards]);
      playerHands.push({ 
        player: players[i], 
        handValue: handValue,
        index: i 
      });
    }
  }
  
  // 第2步：按手牌强度排序
  playerHands.sort((a, b) => b.handValue - a.handValue);
  
  // 第3步：分配奖金
  let remainingPot = pot;
  let winners = [];
  
  for (let i = 0; i < playerHands.length && remainingPot > 0; i++) {
    const winnings = Math.min(remainingPot, playerHands[i].player.contribution);
    winners.push({
      player: playerHands[i].player.name,
      winnings: winnings,
      handValue: playerHands[i].handValue
    });
    remainingPot -= winnings;
  }
  
  return winners;
}
```

## 🔀 2. 语法灵活性

JavaScript的语法灵活性让同一个概念可以用多种方式表达，适应不同的场景需求。

### 动态类型系统
```javascript
// 一个变量可以承载任何类型的值
let gameData = 42;                    // 数字 - 游戏ID
gameData = "德州扑克房间";              // 字符串 - 房间名
gameData = ['Alice', 'Bob', 'Charlie']; // 数组 - 玩家列表
gameData = {                          // 对象 - 完整游戏状态
  roomId: 'room123',
  players: ['Alice', 'Bob'],
  pot: 200,
  status: 'playing'
};
gameData = function() {               // 函数 - 游戏逻辑
  return '游戏开始';
};
gameData = /^room\d+$/;              // 正则 - 房间ID验证
```

### 函数作为一等公民
```javascript
// 函数可以：赋值、传参、返回、存储在数据结构中

// 1. 函数存储在对象中
const gameOperations = {
  start: () => console.log('游戏开始'),
  pause: () => console.log('游戏暂停'),
  end: () => console.log('游戏结束')
};

// 2. 函数作为参数传递
function executeWithLogging(operation, operationName) {
  console.log(`开始执行: ${operationName}`);
  const result = operation();
  console.log(`执行完成: ${operationName}`);
  return result;
}

executeWithLogging(gameOperations.start, '开始游戏');

// 3. 高阶函数 - 返回函数的函数
function createValidator(rule, message) {
  return function(value) {
    if (!rule(value)) {
      throw new Error(message);
    }
    return true;
  };
}

const validatePlayerName = createValidator(
  name => name && name.length >= 2,
  '玩家名至少2个字符'
);

const validateChips = createValidator(
  chips => chips >= 0,
  '筹码数不能为负数'
);

// 4. 函数工厂和闭包
function createCounter(initialValue = 0) {
  let count = initialValue;
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count,
    reset: () => count = initialValue
  };
}

const roundCounter = createCounter(1);
console.log(roundCounter.increment()); // 2
console.log(roundCounter.getValue());  // 2
```

### 对象字面量的强大表达
```javascript
// ES6+的对象字面量语法糖
const currentRound = 3;
const playerName = 'Alice';

const gameState = {
  // 计算属性名
  [`round_${currentRound}`]: 'active',
  [`player_${playerName}_status`]: 'thinking',
  
  // 属性简写
  currentRound,    // 等同于 currentRound: currentRound
  playerName,      // 等同于 playerName: playerName
  
  // 方法简写
  nextRound() {    // 等同于 nextRound: function() {}
    return this.currentRound + 1;
  },
  
  // getter/setter
  get activePlayer() {
    return this.players.find(p => p.status === 'active');
  },
  
  set activePlayer(player) {
    this.players.forEach(p => p.status = 'waiting');
    player.status = 'active';
  },
  
  // 展开操作符
  ...baseGameConfig,  // 合并其他对象的属性
  
  // Symbol属性
  [Symbol.iterator]() {
    // 使对象可迭代
    let index = 0;
    const players = this.players;
    return {
      next() {
        if (index < players.length) {
          return { value: players[index++], done: false };
        }
        return { done: true };
      }
    };
  },
  
  // 动态方法定义
  [`handle${playerName}Action`](action) {
    console.log(`处理${playerName}的${action}动作`);
  }
};
```

## 🚀 3. 异步编程的进化

JavaScript在异步编程方面的表现力从简陋的回调发展到优雅的现代语法，展现了语言的进化能力。

### 回调函数时代
```javascript
// 传统回调 - 容易陷入回调地狱
function createRoomOldStyle(roomData, callback) {
  // 第1步：验证用户
  validateUser(roomData.userId, function(err, user) {
    if (err) return callback(err);
    
    // 第2步：检查房间限制
    checkRoomLimit(user.id, function(err, canCreate) {
      if (err) return callback(err);
      if (!canCreate) return callback(new Error('房间数量达到上限'));
      
      // 第3步：创建房间
      insertRoom(roomData, function(err, room) {
        if (err) return callback(err);
        
        // 第4步：通知其他用户
        notifyUsers(room.id, function(err) {
          if (err) console.warn('通知发送失败:', err);
          callback(null, room);
        });
      });
    });
  });
}
```

### Promise链式调用
```javascript
// Promise - 链式调用，避免嵌套
function createRoomWithPromise(roomData) {
  return validateUser(roomData.userId)
    .then(user => {
      if (!user) throw new Error('用户不存在');
      return checkRoomLimit(user.id);
    })
    .then(canCreate => {
      if (!canCreate) throw new Error('房间数量达到上限');
      return insertRoom(roomData);
    })
    .then(room => {
      // 通知操作不阻塞主流程
      notifyUsers(room.id).catch(err => console.warn('通知失败:', err));
      return room;
    })
    .catch(error => {
      console.error('创建房间失败:', error);
      throw error;
    });
}
```

### async/await - 同步化的异步代码
```javascript
// async/await - 最接近同步代码的异步写法
async function createRoomModern(roomData) {
  try {
    // 第1步：验证用户
    const user = await validateUser(roomData.userId);
    if (!user) throw new Error('用户不存在');
    
    // 第2步：检查限制
    const canCreate = await checkRoomLimit(user.id);
    if (!canCreate) throw new Error('房间数量达到上限');
    
    // 第3步：创建房间
    const room = await insertRoom(roomData);
    
    // 第4步：并行执行通知（不等待结果）
    notifyUsers(room.id).catch(err => console.warn('通知失败:', err));
    
    return room;
    
  } catch (error) {
    console.error('创建房间失败:', error);
    throw error;
  }
}

// 并行异步操作
async function loadGameData(roomId) {
  try {
    // 同时发起多个请求
    const [roomInfo, players, gameHistory] = await Promise.all([
      fetchRoomInfo(roomId),
      fetchPlayers(roomId),
      fetchGameHistory(roomId)
    ]);
    
    return {
      room: roomInfo,
      players: players,
      history: gameHistory,
      loaded: Date.now()
    };
    
  } catch (error) {
    console.error('数据加载失败:', error);
    throw error;
  }
}
```

### Generator协程
```javascript
// Generator - 协程式异步控制
function* asyncGameFlow() {
  try {
    console.log('开始游戏初始化...');
    
    // 第1步：加载用户信息
    const userInfo = yield loadUserInfo();
    console.log(`用户 ${userInfo.name} 已登录`);
    
    // 第2步：创建或加入房间
    const room = yield userInfo.hasRoom 
      ? joinExistingRoom(userInfo.roomId)
      : createNewRoom(userInfo.preferences);
    console.log(`进入房间: ${room.name}`);
    
    // 第3步：等待其他玩家
    const players = yield waitForPlayers(room.id, room.minPlayers);
    console.log(`${players.length}名玩家已就位`);
    
    // 第4步：开始游戏
    const gameResult = yield startPokerGame(room.id, players);
    console.log('游戏结束，结果:', gameResult);
    
    return {
      success: true,
      room,
      players,
      result: gameResult
    };
    
  } catch (error) {
    console.error('游戏流程错误:', error);
    return { success: false, error: error.message };
  }
}

// 执行Generator异步流程
async function runGameFlow() {
  const flow = asyncGameFlow();
  let result = flow.next();
  
  while (!result.done) {
    try {
      const value = await result.value;
      result = flow.next(value);
    } catch (error) {
      result = flow.throw(error);
    }
  }
  
  return result.value;
}
```

## 🔧 4. 元编程能力

JavaScript的元编程特性让开发者能够在运行时操作和检查代码结构，创造出极具表现力的API。

### Proxy - 对象行为拦截
```javascript
// 创建智能的游戏配置对象
function createSmartConfig(defaultConfig) {
  const changeHistory = [];
  
  return new Proxy(defaultConfig, {
    // 拦截属性访问
    get(target, prop) {
      if (prop === 'history') {
        return [...changeHistory];
      }
      
      if (prop === 'reset') {
        return () => {
          Object.keys(target).forEach(key => {
            if (key in defaultConfig) {
              target[key] = defaultConfig[key];
            }
          });
          changeHistory.length = 0;
        };
      }
      
      console.log(`访问配置项: ${prop}`);
      return target[prop];
    },
    
    // 拦截属性设置
    set(target, prop, value) {
      const oldValue = target[prop];
      
      // 数据验证
      if (prop === 'maxPlayers' && (value < 2 || value > 10)) {
        throw new Error('最大玩家数必须在2-10之间');
      }
      
      if (prop === 'blinds' && (!value.small || !value.big || value.small >= value.big)) {
        throw new Error('盲注设置无效');
      }
      
      // 记录变更历史
      changeHistory.push({
        property: prop,
        oldValue: oldValue,
        newValue: value,
        timestamp: new Date().toISOString()
      });
      
      target[prop] = value;
      console.log(`配置已更新: ${prop} = ${value}`);
      return true;
    },
    
    // 拦截属性枚举
    ownKeys(target) {
      return Object.keys(target).filter(key => !key.startsWith('_'));
    }
  });
}

// 使用智能配置对象
const gameConfig = createSmartConfig({
  maxPlayers: 9,
  blinds: { small: 10, big: 20 },
  timeLimit: 30
});

gameConfig.maxPlayers = 6;  // 配置已更新: maxPlayers = 6
console.log(gameConfig.history); // 查看变更历史
// gameConfig.maxPlayers = 15;  // 抛出错误：最大玩家数必须在2-10之间
```

### Symbol - 创建私有属性和元数据
```javascript
// 使用Symbol创建真正的私有属性
const _privateData = Symbol('privateData');
const _id = Symbol('id');
const _secret = Symbol('secret');

class SecurePlayer {
  constructor(name, initialChips = 1000) {
    this.name = name;
    this[_id] = Math.random().toString(36).substr(2, 9);
    this[_privateData] = {
      chips: initialChips,
      cards: [],
      strategy: 'unknown',
      winnings: 0
    };
    this[_secret] = this.generateSecret();
  }
  
  // 公共接口
  get chips() { 
    return this[_privateData].chips; 
  }
  
  get id() { 
    return this[_id]; 
  }
  
  // 安全的筹码操作
  adjustChips(amount, authToken) {
    if (!this.verifyAuth(authToken)) {
      throw new Error('未授权的筹码操作');
    }
    this[_privateData].chips += amount;
  }
  
  // 私有方法（通过Symbol实现）
  generateSecret() {
    return Math.random().toString(36);
  }
  
  verifyAuth(token) {
    return token === this[_secret];
  }
  
  // 调试信息（只在开发环境显示私有数据）
  debug() {
    if (process.env.NODE_ENV === 'development') {
      return {
        public: { name: this.name, chips: this.chips },
        private: this[_privateData],
        id: this[_id]
      };
    }
    return { name: this.name, chips: this.chips };
  }
}

// Symbol也用于定义对象的元行为
const gameStats = {
  totalGames: 100,
  totalPlayers: 1500,
  
  // 自定义字符串表示
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return this.totalGames;
      case 'string':
        return `游戏统计：${this.totalGames}场游戏，${this.totalPlayers}名玩家`;
      default:
        return this.totalGames;
    }
  },
  
  // 自定义迭代行为
  *[Symbol.iterator]() {
    yield ['总游戏数', this.totalGames];
    yield ['总玩家数', this.totalPlayers];
    yield ['平均每场玩家', this.totalPlayers / this.totalGames];
  }
};

console.log(String(gameStats)); // "游戏统计：100场游戏，1500名玩家"
console.log(Number(gameStats)); // 100

for (const [key, value] of gameStats) {
  console.log(`${key}: ${value}`);
}
```

### Reflect - 反射操作
```javascript
// 使用Reflect进行安全的对象操作
class DynamicGameObject {
  constructor() {
    this.properties = new Map();
  }
  
  // 动态设置属性
  setProperty(key, value, validator = null) {
    if (validator && !validator(value)) {
      throw new Error(`属性${key}的值${value}未通过验证`);
    }
    
    // 使用Reflect进行安全的属性设置
    const success = Reflect.set(this, key, value);
    if (success) {
      this.properties.set(key, {
        value,
        timestamp: Date.now(),
        validator
      });
    }
    return success;
  }
  
  // 动态获取属性
  getProperty(key) {
    return Reflect.get(this, key);
  }
  
  // 检查属性是否存在
  hasProperty(key) {
    return Reflect.has(this, key);
  }
  
  // 获取所有属性名
  getAllProperties() {
    return Reflect.ownKeys(this).filter(key => typeof key === 'string');
  }
  
  // 安全删除属性
  removeProperty(key) {
    if (this.properties.has(key)) {
      this.properties.delete(key);
      return Reflect.deleteProperty(this, key);
    }
    return false;
  }
  
  // 创建属性代理
  createProxy() {
    return new Proxy(this, {
      set(target, prop, value) {
        console.log(`设置属性 ${prop} = ${value}`);
        return Reflect.set(target, prop, value);
      },
      
      get(target, prop) {
        const value = Reflect.get(target, prop);
        if (typeof value === 'function') {
          return value.bind(target);
        }
        console.log(`访问属性 ${prop}`);
        return value;
      }
    });
  }
}
```

## 🎨 5. 强大的内置对象

JavaScript丰富的内置对象为复杂数据处理提供了强大的表现力。

### 正则表达式 - 模式匹配大师
```javascript
// 复杂的文本处理和数据提取
class TextProcessor {
  constructor() {
    // 预编译正则表达式提高性能
    this.patterns = {
      // 游戏动作解析
      action: /^(?<player>\w+)\s*(?<action>下注|跟注|加注|弃牌|全押)\s*(?<amount>\d+)?/,
      
      // 手机号验证
      phone: /^1[3-9]\d{9}$/,
      
      // 邮箱验证  
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      
      // 房间ID格式
      roomId: /^room_[a-zA-Z0-9]{6}$/,
      
      // 筹码数量（支持K、M后缀）
      chips: /^(\d+(?:\.\d+)?)\s*([KMB]?)$/i,
      
      // 时间格式解析
      time: /^(?<hours>\d{1,2}):(?<minutes>\d{2})(?::(?<seconds>\d{2}))?$/
    };
  }
  
  // 解析游戏动作文本
  parseGameAction(text) {
    const match = text.match(this.patterns.action);
    if (!match) return null;
    
    const { player, action, amount } = match.groups;
    
    return {
      player,
      action,
      amount: amount ? parseInt(amount) : null,
      timestamp: Date.now()
    };
  }
  
  // 解析筹码数量（支持1K、2.5M等格式）
  parseChips(text) {
    const match = text.match(this.patterns.chips);
    if (!match) return null;
    
    const [, number, suffix] = match;
    const multipliers = { K: 1000, M: 1000000, B: 1000000000 };
    
    return parseFloat(number) * (multipliers[suffix.toUpperCase()] || 1);
  }
  
  // 批量验证数据
  validateBatch(data) {
    return data.map(item => ({
      ...item,
      isValidPhone: this.patterns.phone.test(item.phone || ''),
      isValidEmail: this.patterns.email.test(item.email || ''),
      isValidRoomId: this.patterns.roomId.test(item.roomId || '')
    }));
  }
  
  // 高级文本分析
  analyzeGameLog(logText) {
    const lines = logText.split('\n');
    const actions = [];
    const players = new Set();
    
    // 使用正则表达式解析每一行
    lines.forEach((line, index) => {
      const action = this.parseGameAction(line.trim());
      if (action) {
        actions.push({ ...action, lineNumber: index + 1 });
        players.add(action.player);
      }
    });
    
    // 统计分析
    const playerStats = {};
    actions.forEach(action => {
      if (!playerStats[action.player]) {
        playerStats[action.player] = {
          totalActions: 0,
          actionTypes: {},
          totalAmount: 0
        };
      }
      
      const stats = playerStats[action.player];
      stats.totalActions++;
      stats.actionTypes[action.action] = (stats.actionTypes[action.action] || 0) + 1;
      if (action.amount) {
        stats.totalAmount += action.amount;
      }
    });
    
    return {
      totalActions: actions.length,
      uniquePlayers: players.size,
      actions,
      playerStats
    };
  }
}

// 使用示例
const processor = new TextProcessor();

// 解析游戏动作
const action = processor.parseGameAction("Alice 下注 100");
console.log(action); // { player: "Alice", action: "下注", amount: 100, timestamp: ... }

// 解析筹码数量
console.log(processor.parseChips("2.5K")); // 2500
console.log(processor.parseChips("1M"));   // 1000000
```

### Set和Map - 高级数据结构
```javascript
// 使用Set和Map构建复杂的游戏数据结构
class GameDataManager {
  constructor() {
    // Set - 唯一值集合
    this.activeRooms = new Set();
    this.onlinePlayers = new Set();
    this.bannedUsers = new Set();
    
    // Map - 键值对映射
    this.playerStats = new Map();
    this.roomConfigs = new Map();
    this.gameHistory = new Map();
    
    // WeakMap - 弱引用映射（自动垃圾回收）
    this.privatePlayerData = new WeakMap();
    this.sessionData = new WeakMap();
    
    // WeakSet - 弱引用集合
    this.authenticatedUsers = new WeakSet();
  }
  
  // 房间管理
  addRoom(roomId, config) {
    this.activeRooms.add(roomId);
    this.roomConfigs.set(roomId, {
      ...config,
      createdAt: new Date(),
      playerCount: 0
    });
  }
  
  removeRoom(roomId) {
    this.activeRooms.delete(roomId);
    this.roomConfigs.delete(roomId);
    this.gameHistory.delete(roomId);
  }
  
  // 玩家管理
  addPlayer(player) {
    this.onlinePlayers.add(player.id);
    
    // 使用WeakMap存储敏感数据
    this.privatePlayerData.set(player, {
      ip: player.ip,
      sessionId: player.sessionId,
      loginTime: new Date()
    });
    
    // 使用WeakSet标记认证用户
    this.authenticatedUsers.add(player);
    
    // 更新或创建统计信息
    if (!this.playerStats.has(player.id)) {
      this.playerStats.set(player.id, {
        gamesPlayed: 0,
        totalWinnings: 0,
        averagePlayTime: 0,
        favoriteRooms: new Set()
      });
    }
  }
  
  // 高级查询操作
  findRoomsByConfig(criteria) {
    const matchingRooms = [];
    
    for (const [roomId, config] of this.roomConfigs) {
      let matches = true;
      
      for (const [key, value] of Object.entries(criteria)) {
        if (config[key] !== value) {
          matches = false;
          break;
        }
      }
      
      if (matches) {
        matchingRooms.push({ roomId, config });
      }
    }
    
    return matchingRooms;
  }
  
  // 使用Set操作进行玩家分析
  analyzePlayerOverlap(roomId1, roomId2) {
    const players1 = new Set(this.getRoomPlayers(roomId1));
    const players2 = new Set(this.getRoomPlayers(roomId2));
    
    return {
      // 交集 - 两个房间都有的玩家
      commonPlayers: new Set([...players1].filter(p => players2.has(p))),
      
      // 差集 - 只在房间1的玩家
      uniqueToRoom1: new Set([...players1].filter(p => !players2.has(p))),
      
      // 差集 - 只在房间2的玩家
      uniqueToRoom2: new Set([...players2].filter(p => !players1.has(p))),
      
      // 并集 - 两个房间的所有玩家
      allPlayers: new Set([...players1, ...players2])
    };
  }
  
  // 统计分析
  getStatsSummary() {
    const stats = {
      activeRooms: this.activeRooms.size,
      onlinePlayers: this.onlinePlayers.size,
      totalRegisteredPlayers: this.playerStats.size,
      bannedUsers: this.bannedUsers.size
    };
    
    // 计算平均值
    let totalWinnings = 0;
    let totalGames = 0;
    
    for (const playerStat of this.playerStats.values()) {
      totalWinnings += playerStat.totalWinnings;
      totalGames += playerStat.gamesPlayed;
    }
    
    stats.averageWinningsPerPlayer = totalWinnings / this.playerStats.size;
    stats.averageGamesPerPlayer = totalGames / this.playerStats.size;
    
    return stats;
  }
  
  // 清理过期数据
  cleanup() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24小时
    
    // 清理过期房间
    for (const [roomId, config] of this.roomConfigs) {
      if (now - config.createdAt.getTime() > maxAge) {
        this.removeRoom(roomId);
      }
    }
    
    // WeakMap和WeakSet会自动清理无引用的对象
    console.log('数据清理完成');
  }
  
  getRoomPlayers(roomId) {
    // 模拟获取房间玩家列表
    return ['player1', 'player2', 'player3'];
  }
}
```

## 🌊 6. 函数式编程范式

JavaScript对函数式编程的支持让数据处理变得极其优雅和强大。

### 链式调用和流式处理
```javascript
// 复杂数据处理管道
class DataProcessor {
  constructor(data) {
    this.data = data;
  }
  
  // 支持链式调用的方法
  filter(predicate) {
    return new DataProcessor(this.data.filter(predicate));
  }
  
  map(transform) {
    return new DataProcessor(this.data.map(transform));
  }
  
  sort(compareFn) {
    return new DataProcessor([...this.data].sort(compareFn));
  }
  
  groupBy(keyFn) {
    const groups = {};
    this.data.forEach(item => {
      const key = keyFn(item);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return new DataProcessor(groups);
  }
  
  take(count) {
    return new DataProcessor(this.data.slice(0, count));
  }
  
  skip(count) {
    return new DataProcessor(this.data.slice(count));
  }
  
  // 终端操作
  collect() {
    return this.data;
  }
  
  reduce(reducer, initialValue) {
    return this.data.reduce(reducer, initialValue);
  }
  
  forEach(action) {
    this.data.forEach(action);
    return this;
  }
}

// 游戏数据分析示例
const gameData = [
  { player: 'Alice', chips: 1500, winRate: 0.65, gamesPlayed: 100 },
  { player: 'Bob', chips: 2000, winRate: 0.58, gamesPlayed: 150 },
  { player: 'Charlie', chips: 800, winRate: 0.72, gamesPlayed: 80 },
  { player: 'David', chips: 1200, winRate: 0.45, gamesPlayed: 200 },
  { player: 'Eve', chips: 1800, winRate: 0.69, gamesPlayed: 120 }
];

// 复杂的数据处理链
const topPerformers = new DataProcessor(gameData)
  .filter(player => player.gamesPlayed >= 100)           // 至少100局
  .filter(player => player.winRate > 0.6)               // 胜率60%以上
  .map(player => ({                                     // 添加计算字段
    ...player,
    efficiency: player.winRate * player.chips / player.gamesPlayed,
    level: player.winRate > 0.7 ? 'Expert' : 'Advanced'
  }))
  .sort((a, b) => b.efficiency - a.efficiency)          // 按效率排序
  .take(3)                                              // 取前3名
  .collect();

console.log('顶级玩家:', topPerformers);

// 函数组合
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

// 创建数据处理管道
const processPlayerData = pipe(
  players => players.filter(p => p.isActive),
  players => players.map(p => ({ ...p, winRate: p.wins / (p.wins + p.losses) })),
  players => players.sort((a, b) => b.winRate - a.winRate),
  players => players.slice(0, 10)
);

// 柯里化函数
const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...moreArgs) {
        return curried.apply(this, args.concat(moreArgs));
      };
    }
  };
};

// 柯里化的数据验证函数
const validate = curry((rule, message, value) => {
  if (!rule(value)) {
    throw new Error(message);
  }
  return value;
});

const validatePlayerName = validate(
  name => name && name.length >= 2,
  '玩家名至少2个字符'
);

const validateChips = validate(
  chips => chips >= 0,
  '筹码不能为负数'
);

// 使用
try {
  const name = validatePlayerName('Alice');
  const chips = validateChips(1000);
  console.log(`玩家 ${name} 有 ${chips} 筹码`);
} catch (error) {
  console.error(error.message);
}
```

## 🎪 7. 模块化和命名空间

JavaScript的模块系统提供了强大的代码组织和封装能力。

### ES6模块系统
```javascript
// utils/poker.js - 扑克工具模块
export const CARD_SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
export const CARD_RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// 具名导出
export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createDeck() {
  const deck = [];
  CARD_SUITS.forEach(suit => {
    CARD_RANKS.forEach(rank => {
      deck.push({ suit, rank, value: getCardValue(rank) });
    });
  });
  return deck;
}

export function getCardValue(rank) {
  if (rank === 'A') return 14;
  if (['K', 'Q', 'J'].includes(rank)) return ['K', 'Q', 'J'].indexOf(rank) + 11;
  return parseInt(rank);
}

// 手牌评估类（默认导出）
export default class HandEvaluator {
  static evaluateHand(cards) {
    // 复杂的手牌评估逻辑
    const sortedCards = [...cards].sort((a, b) => b.value - a.value);
    
    if (this.isStraightFlush(sortedCards)) return { rank: 8, name: '同花顺' };
    if (this.isFourOfAKind(sortedCards)) return { rank: 7, name: '四条' };
    if (this.isFullHouse(sortedCards)) return { rank: 6, name: '葫芦' };
    if (this.isFlush(sortedCards)) return { rank: 5, name: '同花' };
    if (this.isStraight(sortedCards)) return { rank: 4, name: '顺子' };
    if (this.isThreeOfAKind(sortedCards)) return { rank: 3, name: '三条' };
    if (this.isTwoPair(sortedCards)) return { rank: 2, name: '两对' };
    if (this.isPair(sortedCards)) return { rank: 1, name: '对子' };
    
    return { rank: 0, name: '高牌' };
  }
  
  static isStraightFlush(cards) {
    return this.isStraight(cards) && this.isFlush(cards);
  }
  
  static isFourOfAKind(cards) {
    const ranks = cards.map(c => c.rank);
    return ranks.some(rank => ranks.filter(r => r === rank).length === 4);
  }
  
  static isFullHouse(cards) {
    const ranks = cards.map(c => c.rank);
    const counts = {};
    ranks.forEach(rank => counts[rank] = (counts[rank] || 0) + 1);
    const values = Object.values(counts).sort((a, b) => b - a);
    return values[0] === 3 && values[1] === 2;
  }
  
  static isFlush(cards) {
    const suits = cards.map(c => c.suit);
    return suits.every(suit => suit === suits[0]);
  }
  
  static isStraight(cards) {
    const values = cards.map(c => c.value).sort((a, b) => a - b);
    for (let i = 1; i < values.length; i++) {
      if (values[i] !== values[i-1] + 1) return false;
    }
    return true;
  }
  
  static isThreeOfAKind(cards) {
    const ranks = cards.map(c => c.rank);
    return ranks.some(rank => ranks.filter(r => r === rank).length === 3);
  }
  
  static isTwoPair(cards) {
    const ranks = cards.map(c => c.rank);
    const counts = {};
    ranks.forEach(rank => counts[rank] = (counts[rank] || 0) + 1);
    const pairs = Object.values(counts).filter(count => count === 2);
    return pairs.length === 2;
  }
  
  static isPair(cards) {
    const ranks = cards.map(c => c.rank);
    const counts = {};
    ranks.forEach(rank => counts[rank] = (counts[rank] || 0) + 1);
    return Object.values(counts).some(count => count === 2);
  }
}

// services/game.js - 游戏服务模块
import HandEvaluator, { 
  createDeck, 
  shuffleDeck, 
  CARD_SUITS, 
  CARD_RANKS 
} from '../utils/poker.js';

// 重新导出（模块聚合）
export { HandEvaluator, CARD_SUITS, CARD_RANKS };

// 游戏状态管理
export class PokerGame {
  constructor(players) {
    this.players = players;
    this.deck = shuffleDeck(createDeck());
    this.communityCards = [];
    this.pot = 0;
    this.currentRound = 'preflop';
  }
  
  dealCards() {
    // 为每个玩家发两张牌
    this.players.forEach(player => {
      player.cards = [this.deck.pop(), this.deck.pop()];
    });
  }
  
  dealCommunityCards(count) {
    for (let i = 0; i < count; i++) {
      this.communityCards.push(this.deck.pop());
    }
  }
  
  evaluateAllHands() {
    return this.players.map(player => {
      const bestHand = this.findBestHand([...player.cards, ...this.communityCards]);
      return {
        player,
        hand: bestHand,
        evaluation: HandEvaluator.evaluateHand(bestHand)
      };
    });
  }
  
  findBestHand(cards) {
    // 从7张牌中找出最好的5张
    if (cards.length <= 5) return cards;
    
    let bestHand = null;
    let bestRank = -1;
    
    // 生成所有可能的5张牌组合
    const combinations = this.generateCombinations(cards, 5);
    
    combinations.forEach(combination => {
      const evaluation = HandEvaluator.evaluateHand(combination);
      if (evaluation.rank > bestRank) {
        bestRank = evaluation.rank;
        bestHand = combination;
      }
    });
    
    return bestHand;
  }
  
  generateCombinations(array, k) {
    if (k === 1) return array.map(item => [item]);
    if (k === array.length) return [array];
    if (k > array.length) return [];
    
    const combinations = [];
    for (let i = 0; i <= array.length - k; i++) {
      const first = array[i];
      const rest = array.slice(i + 1);
      const restCombinations = this.generateCombinations(rest, k - 1);
      restCombinations.forEach(combination => {
        combinations.push([first, ...combination]);
      });
    }
    return combinations;
  }
}

// 动态导入示例
export async function loadAdvancedFeatures() {
  try {
    // 动态导入可选功能
    const { AIPlayer } = await import('./ai-player.js');
    const { Statistics } = await import('./statistics.js');
    
    return {
      AIPlayer,
      Statistics,
      available: true
    };
  } catch (error) {
    console.warn('高级功能加载失败:', error);
    return { available: false };
  }
}
```

### 命名空间模式
```javascript
// 传统的命名空间模式（适用于不支持ES6模块的环境）
const PokerNamespace = (function() {
  // 私有变量和函数
  const privateConfig = {
    maxPlayers: 10,
    defaultChips: 1000
  };
  
  let gameInstances = new Map();
  
  function generateGameId() {
    return 'game_' + Math.random().toString(36).substr(2, 9);
  }
  
  function validatePlayer(player) {
    return player && player.name && typeof player.name === 'string';
  }
  
  // 公共API
  return {
    // 工具子模块
    Utils: {
      Cards: {
        shuffle: function(deck) {
          // 洗牌逻辑
          return deck.sort(() => Math.random() - 0.5);
        },
        
        deal: function(deck, count) {
          return deck.splice(0, count);
        }
      },
      
      Validation: {
        isValidPlayerName: function(name) {
          return typeof name === 'string' && name.length >= 2 && name.length <= 20;
        },
        
        isValidChipAmount: function(amount) {
          return typeof amount === 'number' && amount >= 0 && amount <= 1000000;
        }
      }
    },
    
    // 游戏管理子模块
    GameManager: {
      createGame: function(config = {}) {
        const gameId = generateGameId();
        const gameConfig = { ...privateConfig, ...config };
        
        const game = {
          id: gameId,
          config: gameConfig,
          players: [],
          status: 'waiting',
          createdAt: new Date()
        };
        
        gameInstances.set(gameId, game);
        return gameId;
      },
      
      joinGame: function(gameId, player) {
        if (!validatePlayer(player)) {
          throw new Error('Invalid player data');
        }
        
        const game = gameInstances.get(gameId);
        if (!game) {
          throw new Error('Game not found');
        }
        
        if (game.players.length >= game.config.maxPlayers) {
          throw new Error('Game is full');
        }
        
        game.players.push({
          ...player,
          chips: game.config.defaultChips,
          joinedAt: new Date()
        });
        
        return game.players.length;
      },
      
      getGame: function(gameId) {
        const game = gameInstances.get(gameId);
        return game ? { ...game } : null; // 返回副本防止外部修改
      },
      
      getAllGames: function() {
        return Array.from(gameInstances.values()).map(game => ({
          id: game.id,
          playerCount: game.players.length,
          maxPlayers: game.config.maxPlayers,
          status: game.status
        }));
      }
    },
    
    // 统计子模块
    Statistics: {
      getGameStats: function(gameId) {
        const game = gameInstances.get(gameId);
        if (!game) return null;
        
        return {
          totalPlayers: game.players.length,
          averageChips: game.players.reduce((sum, p) => sum + p.chips, 0) / game.players.length,
          gameAge: Date.now() - game.createdAt.getTime()
        };
      },
      
      getGlobalStats: function() {
        const games = Array.from(gameInstances.values());
        return {
          totalGames: games.length,
          totalPlayers: games.reduce((sum, game) => sum + game.players.length, 0),
          activeGames: games.filter(game => game.status === 'playing').length
        };
      }
    },
    
    // 配置管理
    Config: {
      get: function(key) {
        return privateConfig[key];
      },
      
      // 只允许修改某些配置
      setMaxPlayers: function(max) {
        if (max >= 2 && max <= 20) {
          privateConfig.maxPlayers = max;
        }
      }
    },
    
    // 版本信息
    version: '1.0.0',
    
    // 清理方法
    cleanup: function() {
      gameInstances.clear();
    }
  };
})();

// 使用命名空间
const gameId = PokerNamespace.GameManager.createGame({ maxPlayers: 6 });
const playerCount = PokerNamespace.GameManager.joinGame(gameId, { name: 'Alice' });
const stats = PokerNamespace.Statistics.getGameStats(gameId);

console.log('游戏创建成功:', gameId);
console.log('当前玩家数:', playerCount);
console.log('游戏统计:', stats);
```

## 💫 8. DSL创建能力

JavaScript强大的语法灵活性使其能够创建领域特定语言（DSL），提供更自然的问题表达方式。

### 模板字符串DSL
```javascript
// SQL查询构建器DSL
function sql(strings, ...values) {
  let query = '';
  
  strings.forEach((string, i) => {
    query += string;
    if (i < values.length) {
      const value = values[i];
      if (typeof value === 'string') {
        query += `'${value.replace(/'/g, "''")}'`; // 防SQL注入
      } else if (value === null) {
        query += 'NULL';
      } else {
        query += value;
      }
    }
  });
  
  return {
    query: query.trim(),
    execute: async function(database) {
      // 模拟数据库执行
      console.log('执行SQL:', this.query);
      return { success: true, affectedRows: 1 };
    }
  };
}

// 使用SQL DSL
const playerId = 123;
const playerName = "Alice";
const chips = 1500;

const query = sql`
  UPDATE players 
  SET chips = ${chips}, 
      last_login = NOW(),
      name = ${playerName}
  WHERE player_id = ${playerId}
`;

// HTML模板DSL
function html(strings, ...values) {
  let result = '';
  
  strings.forEach((string, i) => {
    result += string;
    if (i < values.length) {
      const value = values[i];
      if (Array.isArray(value)) {
        result += value.join('');
      } else if (typeof value === 'string') {
        // 防XSS攻击的HTML转义
        result += value
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      } else {
        result += value;
      }
    }
  });
  
  return result;
}

// 使用HTML DSL
function renderPlayerCard(player) {
  return html`
    <div class="player-card" data-player-id="${player.id}">
      <h3>${player.name}</h3>
      <p>筹码: ${player.chips}</p>
      <p>状态: ${player.status}</p>
      <div class="actions">
        ${player.actions.map(action => html`
          <button onclick="handleAction('${action.type}')">${action.label}</button>
        `)}
      </div>
    </div>
  `;
}
```

### 配置DSL
```javascript
// 游戏规则配置DSL
class RuleBuilder {
  constructor() {
    this.conditions = [];
    this.currentCondition = null;
  }
  
  when(conditionFn) {
    this.currentCondition = { condition: conditionFn, actions: [] };
    this.conditions.push(this.currentCondition);
    return this;
  }
  
  then(actionFn) {
    if (this.currentCondition) {
      this.currentCondition.actions.push(actionFn);
    }
    return this;
  }
  
  and(actionFn) {
    return this.then(actionFn);
  }
  
  build() {
    return {
      evaluate: (context) => {
        const results = [];
        
        this.conditions.forEach(rule => {
          if (rule.condition(context)) {
            rule.actions.forEach(action => {
              results.push(action(context));
            });
          }
        });
        
        return results;
      }
    };
  }
}

// 使用规则DSL
const gameRules = new RuleBuilder()
  .when(game => game.players.filter(p => p.status === 'active').length === 1)
  .then(game => ({ type: 'endGame', winner: game.players.find(p => p.status === 'active') }))
  .and(game => ({ type: 'awardPot', amount: game.pot }))
  
  .when(player => player.chips <= 0)
  .then(player => ({ type: 'eliminate', playerId: player.id }))
  .and(player => ({ type: 'notify', message: `${player.name} 被淘汰` }))
  
  .when(game => game.currentBet > game.maxBet)
  .then(game => ({ type: 'error', message: '下注金额超过限制' }))
  
  .build();

// 链式API DSL
class FluentQuery {
  constructor(data) {
    this.data = data;
    this.operations = [];
  }
  
  where(predicate) {
    this.operations.push({ type: 'filter', fn: predicate });
    return this;
  }
  
  select(mapper) {
    this.operations.push({ type: 'map', fn: mapper });
    return this;
  }
  
  orderBy(compareFn) {
    this.operations.push({ type: 'sort', fn: compareFn });
    return this;
  }
  
  take(count) {
    this.operations.push({ type: 'slice', fn: data => data.slice(0, count) });
    return this;
  }
  
  groupBy(keyFn) {
    this.operations.push({ 
      type: 'group', 
      fn: data => {
        const groups = {};
        data.forEach(item => {
          const key = keyFn(item);
          if (!groups[key]) groups[key] = [];
          groups[key].push(item);
        });
        return groups;
      }
    });
    return this;
  }
  
  execute() {
    let result = this.data;
    
    this.operations.forEach(operation => {
      switch (operation.type) {
        case 'filter':
          result = result.filter(operation.fn);
          break;
        case 'map':
          result = result.map(operation.fn);
          break;
        case 'sort':
          result = [...result].sort(operation.fn);
          break;
        case 'slice':
        case 'group':
          result = operation.fn(result);
          break;
      }
    });
    
    return result;
  }
  
  // 支持异步操作
  async executeAsync() {
    let result = this.data;
    
    for (const operation of this.operations) {
      switch (operation.type) {
        case 'filter':
          if (operation.fn.constructor.name === 'AsyncFunction') {
            const filtered = [];
            for (const item of result) {
              if (await operation.fn(item)) {
                filtered.push(item);
              }
            }
            result = filtered;
          } else {
            result = result.filter(operation.fn);
          }
          break;
        case 'map':
          if (operation.fn.constructor.name === 'AsyncFunction') {
            result = await Promise.all(result.map(operation.fn));
          } else {
            result = result.map(operation.fn);
          }
          break;
        default:
          result = operation.fn(result);
      }
    }
    
    return result;
  }
}

// 使用链式查询DSL
const playerData = [
  { name: 'Alice', chips: 1500, games: 100, winRate: 0.65 },
  { name: 'Bob', chips: 2000, games: 150, winRate: 0.58 },
  { name: 'Charlie', chips: 800, games: 80, winRate: 0.72 }
];

const topPlayers = new FluentQuery(playerData)
  .where(player => player.games >= 100)
  .where(player => player.winRate > 0.6)
  .select(player => ({
    ...player,
    efficiency: player.winRate * player.chips / player.games,
    level: player.winRate > 0.7 ? 'Expert' : 'Advanced'
  }))
  .orderBy((a, b) => b.efficiency - a.efficiency)
  .take(2)
  .execute();

console.log('顶级玩家:', topPlayers);
```

## 🌟 9. 总结：JavaScript表现力的核心体现

### 语言特性矩阵

| 特性类别 | 具体表现 | 实际价值 |
|---------|---------|---------|
| **多范式支持** | 函数式、OOP、过程式自由切换 | 适应不同问题域的最佳解决方案 |
| **语法灵活性** | 同一概念的多种表达方式 | 提升代码可读性和开发效率 |
| **异步进化** | 回调→Promise→async/await→Generator | 解决复杂异步场景，代码更清晰 |
| **元编程** | Proxy、Symbol、Reflect | 创建智能API和框架 |
| **丰富内置** | 正则、Set/Map、Array方法 | 强大的数据处理和模式匹配能力 |
| **函数式特性** | 高阶函数、闭包、柯里化 | 优雅的数据流处理 |
| **模块化** | ES6模块、命名空间 | 大型项目的架构组织能力 |
| **DSL创建** | 模板字符串、链式API | 创建领域特定的表达语言 |

### 表现力的本质

JavaScript的表现力丰富性本质上体现在以下几个维度：

1. **表达自然性** - 能用最接近人类思维的方式描述程序逻辑
2. **解决方案多样性** - 同一问题有多种优雅的解决路径
3. **抽象层次灵活性** - 可以在不同抽象级别上操作
4. **组合能力强大** - 小的构建块可以组合成复杂系统
5. **演进适应性** - 语言持续进化，适应新的编程范式