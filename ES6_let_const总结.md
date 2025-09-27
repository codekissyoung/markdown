# ES6 let 和 const 总结 - 微信小程序开发要点

## 📚 核心特性对比

### var vs let vs const

| 特性 | var | let | const |
|------|-----|-----|-------|
| **作用域** | 函数作用域 | 块级作用域 | 块级作用域 |
| **变量提升** | 是 | 否 | 否 |
| **重复声明** | 允许 | 报错 | 报错 |
| **暂时性死区** | 无 | 有 | 有 |
| **初始化** | 可选 | 可选 | 必须 |
| **重新赋值** | 允许 | 允许 | 禁止 |

## 🔍 块级作用域详解

### 1. 基本块级作用域
```javascript
// var的问题
function varExample() {
  if (true) {
    var x = 1;
  }
  console.log(x); // 1 - var无块级作用域
}

// let/const的改进
function letExample() {
  if (true) {
    let x = 1;
    const y = 2;
  }
  console.log(x); // ReferenceError - let有块级作用域
  console.log(y); // ReferenceError - const有块级作用域
}
```

### 2. 循环中的作用域陷阱
```javascript
// ❌ var的经典问题
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 输出: 3, 3, 3
}

// ✅ let的解决方案
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 输出: 0, 1, 2
}
```

## ⚠️ 暂时性死区 (Temporal Dead Zone)

```javascript
// ❌ 错误使用
console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 10;

// ❌ 更隐蔽的错误
let y = 20;
function example() {
  console.log(y); // ReferenceError - 不是访问外部的y
  let y = 30;     // 这里重新声明了y
}
```

## 🎯 const 深度使用

### 1. 基础常量
```javascript
const PI = 3.14159;
const APP_NAME = '不德不推计分器';
const API_BASE_URL = 'https://xdjsq.codekissyoung.com/api';

// ❌ 错误 - 不能重新赋值
// PI = 3.14; // TypeError
```

### 2. 对象和数组的const
```javascript
// ✅ 对象内容可以修改
const config = {
  debug: true,
  version: '1.0.0'
};
config.debug = false;    // 允许
config.theme = 'dark';   // 允许

// ❌ 不能重新赋值整个对象
// config = {}; // TypeError

// ✅ 数组内容可以修改
const players = ['Alice', 'Bob'];
players.push('Charlie');     // 允许
players[0] = 'Adam';         // 允许

// ❌ 不能重新赋值整个数组
// players = []; // TypeError
```

### 3. 防止对象修改
```javascript
// 完全冻结对象
const frozenConfig = Object.freeze({
  maxPlayers: 9,
  blinds: { small: 10, big: 20 }
});

// ❌ 这些都不会生效（严格模式下会报错）
// frozenConfig.maxPlayers = 10;
// frozenConfig.blinds.small = 5;
```

## 🚀 在微信小程序中的实践

### 1. 页面数据管理
```javascript
// ✅ 推荐写法
Page({
  data: {
    roomInfo: null,
    players: []
  },
  
  onLoad() {
    // 使用const声明不会改变的配置
    const config = {
      maxPlayers: 9,
      minBet: 10
    };
    
    // 使用let声明可能改变的变量
    let currentUserId = null;
    
    // 获取用户信息
    wx.getUserInfo({
      success: (res) => {
        currentUserId = res.userInfo.openId; // let允许重新赋值
        this.initializeRoom(config, currentUserId);
      }
    });
  },
  
  initializeRoom(config, userId) {
    // 块级作用域中的临时变量
    for (let i = 0; i < config.maxPlayers; i++) {
      // i只在这个循环块中存在
      console.log(`初始化座位 ${i}`);
    }
  }
});
```

### 2. 服务类中的使用
```javascript
// services/RoomService.js
class RoomService {
  constructor() {
    // 使用const声明不变的配置
    const defaultConfig = {
      maxPlayers: 9,
      minPlayers: 2,
      initialChips: 1000
    };
    
    this.config = { ...defaultConfig };
    this.players = [];
  }
  
  addPlayer(player) {
    // 使用const声明本次操作中不会改变的值
    const playerCount = this.players.length;
    const maxPlayers = this.config.maxPlayers;
    
    if (playerCount >= maxPlayers) {
      throw new Error('房间已满');
    }
    
    // 使用let声明可能需要修改的变量
    let playerData = { ...player };
    
    // 根据条件修改playerData
    if (!playerData.chips) {
      playerData.chips = this.config.initialChips;
    }
    
    this.players.push(playerData);
  }
  
  processGameRound() {
    // 块级作用域确保变量不污染
    {
      const communityCards = this.dealCommunityCards();
      let pot = 0;
      
      // 计算底池
      for (const player of this.players) {
        pot += player.currentBet || 0;
      }
      
      this.updateGameState(communityCards, pot);
    } // communityCards 和 pot 在这里就销毁了
  }
}

module.exports = RoomService;
```

## ⚠️ 微信小程序开发注意事项

### 1. 编译环境影响
```javascript
// 微信开发者工具会将ES6编译为ES5
// 但理解原理仍然重要

// 开发时写ES6
const userInfo = await wx.getUserProfile();

// 编译后可能变成ES5（工具内部处理）
// var userInfo = wx.getUserProfile();
```

### 2. 作用域污染防护
```javascript
// ❌ 避免在小程序全局作用域污染
// 在app.js中
App({
  onLaunch() {
    // ❌ 不好的做法
    // var globalConfig = {}; // 可能污染全局
    
    // ✅ 好的做法
    const appConfig = {
      version: '1.0.0',
      debug: false
    };
    this.globalData.config = appConfig;
  }
});
```

### 3. 异步操作中的变量管理
```javascript
// 页面中处理异步操作
Page({
  async loadRoomData(roomId) {
    // 使用const确保roomId不被意外修改
    const currentRoomId = roomId;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        const roomData = await this.fetchRoomInfo(currentRoomId);
        
        // 成功后更新页面数据
        this.setData({
          roomInfo: roomData,
          loading: false
        });
        break;
        
      } catch (error) {
        retryCount++; // let允许修改重试次数
        
        if (retryCount >= maxRetries) {
          wx.showToast({
            title: '加载失败',
            icon: 'error'
          });
        }
      }
    }
  }
});
```

### 4. 循环中的事件处理
```javascript
// ✅ 正确处理循环中的事件绑定
Page({
  data: {
    players: [
      { id: 1, name: 'Alice', chips: 1000 },
      { id: 2, name: 'Bob', chips: 1500 }
    ]
  },
  
  bindPlayerEvents() {
    for (let i = 0; i < this.data.players.length; i++) {
      const player = this.data.players[i]; // const确保player引用不变
      
      // 为每个玩家创建独立的事件处理器
      this[`onPlayer${player.id}Click`] = () => {
        console.log(`点击了玩家: ${player.name}`); // 正确捕获player
      };
    }
  }
});
```

## 💡 最佳实践建议

### 1. 声明变量的优先级
```javascript
// 优先级：const > let > var (避免使用var)

// ✅ 优先使用const
const config = { maxPlayers: 9 };
const apiUrl = 'https://api.example.com';

// ✅ 需要重新赋值时使用let
let currentPlayer = null;
let gameState = 'waiting';

// ❌ 避免使用var
// var oldStyleVariable = 'avoid this';
```

### 2. 块级作用域的合理利用
```javascript
function processGameData(gameData) {
  const playerId = gameData.currentPlayer;
  
  // 使用块级作用域组织代码逻辑
  {
    // 玩家验证逻辑
    const player = this.findPlayer(playerId);
    if (!player) {
      throw new Error('玩家不存在');
    }
  }
  
  {
    // 游戏状态更新逻辑
    let newGameState = { ...gameData };
    newGameState.timestamp = Date.now();
    this.updateGameState(newGameState);
  }
  
  {
    // 通知其他玩家逻辑
    const otherPlayers = this.getOtherPlayers(playerId);
    for (const player of otherPlayers) {
      this.notifyPlayer(player.id, gameData);
    }
  }
}
```

### 3. 常量管理
```javascript
// config/constants.js
const GAME_CONFIG = Object.freeze({
  MAX_PLAYERS: 9,
  MIN_PLAYERS: 2,
  INITIAL_CHIPS: 1000,
  BLINDS: Object.freeze({
    SMALL: 10,
    BIG: 20
  })
});

const API_ENDPOINTS = Object.freeze({
  CREATE_ROOM: '/api/rooms',
  JOIN_ROOM: '/api/rooms/join',
  UPDATE_CHIPS: '/api/chips/update'
});

module.exports = {
  GAME_CONFIG,
  API_ENDPOINTS
};
```

## 🔧 调试技巧

### 1. 作用域调试
```javascript
function debugScope() {
  const outerVar = 'outer';
  
  if (true) {
    const innerVar = 'inner';
    let mutableVar = 'initial';
    
    // 在开发者工具中设置断点查看作用域
    debugger; // 可以看到 outerVar, innerVar, mutableVar
    
    mutableVar = 'changed';
  }
  
  // 设置断点查看作用域
  debugger; // 只能看到 outerVar，innerVar 和 mutableVar 已销毁
}
```

### 2. 常见错误识别
```javascript
// 检查暂时性死区错误
function checkTDZ() {
  try {
    console.log(myLet); // 这会抛出错误
    let myLet = 'value';
  } catch (error) {
    console.log('TDZ Error:', error.message);
  }
}

// 检查const重新赋值错误
function checkConstReassignment() {
  try {
    const myConst = 'initial';
    myConst = 'new value'; // 这会抛出错误
  } catch (error) {
    console.log('Const Error:', error.message);
  }
}
```

通过理解和正确使用 `let` 和 `const`，可以写出更安全、更清晰的微信小程序代码，避免var带来的作用域陷阱和意外行为。