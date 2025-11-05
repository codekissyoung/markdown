# 在线游戏音频解决方案与成本分析

> 以狼人杀为例的实时/准实时音频技术选型

---

## 基础概念

### RPA (Robotic Process Automation)
机器人流程自动化，通过软件模拟人工操作。

**典型应用**：
- Python + Selenium 自动化浏览器
- Puppeteer 控制 Chrome
- 必须使用真实账号登录

### BFF (Backend For Frontend)
为前端服务的后端中间层。

**架构**：
```
浏览器 → Nginx → BFF(Node.js/PM2) → 后端API(Go/PHP)
```

**作用**：
- 聚合多个后端API
- 数据格式转换
- SSR渲染
- 提供HTTP服务，使用Nginx反向代理

### RTC (Real-Time Communication)
实时通信，包括音频、视频、实时消息、屏幕共享。

---

## 音视频技术方案对比

### 方案一：第三方RTC SDK

**主流服务商**：

| 服务商 | 音频价格 | 视频价格 | 免费额度 | 适用场景 |
|--------|---------|---------|---------|---------|
| 声网Agora | ￥7/千分钟 | ￥25/千分钟 | 1万分钟/月 | 出海首选 |
| 腾讯云TRTC | ￥7/千分钟 | ￥25/千分钟 | 1万分钟/月 | 微信生态 |
| 阿里云RTC | ￥6/千分钟 | ￥18/千分钟 | 1万分钟/月 | 阿里云用户 |

**计费规则**（关键）：
```
RTC按订阅方计费，不是发言方

12人房间示例：
  每人订阅其他11人的音频
  总计费 = 游戏时长 × 12人

一局狼人杀（75分钟）：
  计费时长：75分钟 × 12人 = 900分钟
  成本：900/1000 × ￥6 = ￥5.4
```

**个人用户使用**：
- ✅ 支持个人注册（实名认证）
- ✅ 支持支付宝/微信付费
- ❌ 不能开发票
- ✅ 免费额度1万分钟/月

---

### 方案二：自建WebRTC

**技术栈**：
```
前端：WebRTC API
信令服务器：Go + WebSocket
媒体服务器：Mediasoup/Janus/LiveKit
STUN服务器：NAT穿透（必须）
TURN服务器：中继兜底（20%用户需要）
```

#### NAT穿透原理

**STUN (Session Traversal Utilities for NAT)**：
```
作用：帮助客户端发现自己的公网IP和端口
流程：
  1. 客户端 → STUN服务器："我的公网IP是啥？"
  2. STUN回复："你是 123.45.67.89:12345"
  3. 客户端把这个地址告诉对方
  4. 对方直连（P2P）

免费STUN：
  stun:stun.qq.com:3478
  stun:stun.l.google.com:19302
```

**TURN (Traversal Using Relays around NAT)**：
```
作用：STUN失败时中继流量
流量：玩家A → TURN服务器 → 玩家B
成本：消耗服务器带宽
```

**NAT类型决定成功率**：

| NAT类型 | P2P成功率 | 占比 |
|---------|----------|------|
| Full Cone NAT | 99% ✅ | 20% |
| Restricted NAT | 90% ✅ | 50% |
| Port Restricted NAT | 80% ✅ | 10% |
| Symmetric NAT | 0% ❌ 需要TURN | 20% |

**检测NAT类型**（在线工具）：
```
https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

结果：
  srflx (Server Reflexive) → 可用STUN
  relay (Relayed) → 需要TURN
```

#### 带宽成本计算

**SFU架构**（服务器转发）：
```
12人狼人杀房间：
  音频码率：50Kbps/人
  上行：12人 × 50Kbps = 600Kbps
  下行：12人 × 11人 × 50Kbps = 6.6Mbps

服务器需求：7Mbps/房间

10个房间：70Mbps带宽（约￥500/月）
```

**P2P + TURN兜底**：
```
100个房间：
  80个STUN成功 → 不占带宽
  20个TURN中继 → 20 × 7Mbps = 140Mbps

成本：￥700/月
```

**结论**：3Mbps服务器连1个房间都跑不起来，自建WebRTC必须升级带宽。

---

### 方案三：录音上传（准实时）

**核心思路**：
```
不追求实时 → 边录边传 → 延迟3-5秒 → 成本接近0
```

#### 技术实现

**分片流式传输**：
```javascript
// 玩家A：边录边传（每3秒切片）
const recorder = new MediaRecorder(stream, {
    mimeType: 'audio/webm;codecs=opus',
    audioBitsPerSecond: 16000  // 16Kbps
});

recorder.ondataavailable = async (e) => {
    // 方案1：上传OSS + CDN分发
    const url = await uploadOSS(e.data);
    socket.emit('audio_chunk', { url });

    // 方案2：WebSocket直接转发（推荐）
    const base64 = await blobToBase64(e.data);
    ws.send(JSON.stringify({ type: 'audio', data: base64 }));
};

recorder.start(3000); // 每3秒触发
```

```javascript
// 玩家B：流式播放（Web Audio API无缝衔接）
const audioContext = new AudioContext();
let nextStartTime = 0;

socket.on('audio_chunk', async (data) => {
    const arrayBuffer = base64ToArrayBuffer(data);
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    // 无缝拼接到上一个chunk后面
    const startTime = Math.max(nextStartTime, audioContext.currentTime + 0.1);
    source.start(startTime);

    nextStartTime = startTime + audioBuffer.duration;
});
```

**后端实现**（Go WebSocket转发）：
```go
type Room struct {
    ID      string
    Players map[string]*websocket.Conn
    mu      sync.RWMutex
}

func (r *Room) BroadcastAudio(chunk AudioChunk, sender *websocket.Conn) {
    r.mu.RLock()
    defer r.mu.RUnlock()

    // 内存转发，不存储
    for playerID, conn := range r.Players {
        if conn != sender {
            conn.WriteJSON(chunk)
        }
    }
}
```

#### 成本计算

**音频参数**：
```
编码：Opus 16Kbps
采样率：16000Hz
声道：单声道
```

**一局游戏成本**（75分钟，12人）：
```
音频大小：
  16Kbps × 75分钟 × 60秒 / 8 = 9MB/人

方案A（OSS + CDN）：
  存储：9MB × ￥0.12/GB/月 = ￥0.001
  流量：9MB × 11人 × ￥0.2/GB = ￥0.02
  总计：￥0.02/局

方案B（WebSocket转发）：
  服务器带宽：16Kbps × 12人 × 11 ≈ 2.1Mbps
  3Mbps服务器：可跑1个房间（峰值）
  成本：￥100/月服务器 ÷ 3000局 = ￥0.033/局
```

**规模化成本**：

| 日活 | 日开局数 | 月成本（WebSocket） | 月成本（RTC） |
|-----|---------|-------------------|--------------|
| 120 | 10局 | ￥100 | ￥162 |
| 1200 | 100局 | ￥100 | ￥1620 |
| 12000 | 1000局 | ￥200（双服务器） | ￥16200 |

**成本对比**：录音方案是RTC的 **1/160**

---

## 优化策略

### 1. 发言者模式（降低RTC成本）

**原理**：
```
传统模式：12人互相推流 = 12 × 11 = 132个流
发言者模式：只有发言者推流 = 1个流 × 11订阅

成本：
  传统：75分钟 × 12人 = 900分钟 → ￥5.4
  优化：75分钟 × 1人 × 12订阅 = 75分钟 → ￥0.45

降低到原来的 1/12
```

**实现**：
```javascript
// 非发言阶段
client.setClientRole("audience"); // 观众模式

// 轮到你发言
client.setClientRole("host"); // 主播模式
muteLocalAudio(false);

// 说完了
muteLocalAudio(true);
client.setClientRole("audience");
```

### 2. 混合方案

```
关键时刻（投票倒计时）：RTC实时
平时发言：录音上传（延迟3秒）

80%时间用录音，成本降低80%
```

### 3. 商务谈判（规模化后）

| 月消费 | 商务折扣 |
|--------|---------|
| <1万 | 无折扣 |
| 1-10万 | 8-9折 |
| 10-50万 | 6-7折 |
| 50万+ | 3-5折 |

---

## 狼人杀最终方案

### 推荐：录音WebSocket转发

**理由**：
1. 成本极低（￥100/月支撑日活5000）
2. 延迟3-5秒对回合制游戏影响小
3. 技术简单，Go + WebSocket
4. 3Mbps服务器够用

**架构**：
```
前端小程序/H5
  ├─ 录音（3秒分片，Opus 16Kbps）
  ├─ WebSocket实时上传
  └─ Web Audio API无缝播放

后端（Go）
  ├─ WebSocket接收音频
  ├─ 内存实时转发（不存储）
  ├─ 游戏逻辑（发言控制）
  └─ 可选：存OSS回放

服务器：
  2核4GB + 3Mbps = ￥100/月
```

**体验优化**：
```javascript
// 1. 缓冲2个分片再播放（首次延迟6秒，后续流畅）
const MIN_BUFFER = 2;

// 2. 预加载下一个分片
audio.preload = 'auto';

// 3. 说话者头像动画
showSpeakingAnimation(speakerId);

// 4. 网络差时提示
if (chunkDelay > 5000) {
    showToast("网络较慢，请稍候");
}
```

### 成本对比总结

**单局成本**（75分钟，12人）：

| 方案 | 成本 | 延迟 | 体验 |
|------|------|------|------|
| 阿里云RTC | ￥5.4 | <300ms | ⭐⭐⭐⭐⭐ |
| 自建WebRTC | ￥0.5 | <500ms | ⭐⭐⭐⭐ |
| 录音WebSocket | ￥0.033 | 3-5秒 | ⭐⭐⭐⭐ |

**日活1000成本**（约100局/天）：

```
RTC方案：
  100局 × ￥5.4 × 30天 = ￥16200/月

录音方案：
  服务器 ￥100/月（固定成本）

差价：162倍
```

---

## 创业启动配置

### 最小化配置（MVP）

```
云服务器：2核4GB + 3Mbps = ￥50-100/月
  ├─ Go游戏服务器（WebSocket音频转发）
  ├─ MySQL（小规模够用）
  └─ Nginx（API + 静态资源）

域名 + HTTPS证书：已有

OSS + CDN（可选）：
  存储100GB：￥12/月
  CDN流量：按量

总计：￥100-200/月
支撑：日活1000-5000
```

### 个人 vs 企业资质

**必须营业执照**：
- ✗ 微信支付/支付宝商户号
- ✗ 小程序主体认证（个人版功能受限）
- ✗ App上架应用市场

**个人可以做的**：
- ✓ 个人网站（非经营性备案）
- ✓ 个人小程序（无支付功能）
- ✓ RTC服务付费（支持支付宝/微信）

**解决方案**：
```
初期：个人小程序（无支付）验证产品
有用户：注册个体户（￥500）→ 支持支付
规模化：注册公司
```

---

## 网络游戏带宽需求

### 游戏类型对比

| 游戏类型 | 带宽/人 | 说明 |
|---------|---------|------|
| 音频RTC | 50Kbps | 实时音频流 |
| 视频RTC | 500Kbps-2Mbps | 实时视频流 |
| 狼人杀（回合制） | 5-10Kbps | 只传操作指令 |
| 王者荣耀（MOBA） | 30-50Kbps | 位置同步30次/秒 |
| 饥荒（32人沙盒） | 30KB/s | 优化后2-3Mbps/房间 |

**结论**：
- 纯游戏逻辑带宽需求很低
- 音视频是大头（50-2000倍差距）
- 3Mbps服务器够跑大部分游戏，除非加音视频

### 单机服务器性能

**8核32G服务器**：

| 场景 | QPS | 业务量级 |
|------|-----|---------|
| Nginx静态文件 | 5-10万 | 千兆网卡瓶颈 |
| Go API（简单） | 3-5万 | CPU密集 |
| Go + MySQL | 1-2万 | 数据库瓶颈 |
| Go + Redis | 5-10万 | 内存缓存 |

**实际业务量**：
```
日活10万 → 平均500 QPS → 单机够用
日活100万 → 平均5000 QPS → 单机 + Redis
日活1000万+ → 需要集群
```

---

## 关键决策点

### 1. 音频方案选择

```
月消费 < ￥1000：
  → 录音方案（成本1/160）

月消费 > ￥10000 且对实时性要求高：
  → RTC + 发言者模式 + 商务折扣

技术能力强 + 日活10万+：
  → 自建WebRTC（需要50Mbps+带宽）
```

### 2. 服务器带宽规划

```
纯API + 静态资源：3Mbps够用
录音转发（10房间）：3-5Mbps
自建WebRTC（10房间）：70Mbps
```

### 3. 创业阶段投入

```
第1个月（验证想法）：
  ￥100/月 - 个人小程序 + 录音方案

第3个月（有用户）：
  ￥500/月 - 注册个体户 + 支付功能

第6个月（开始盈利）：
  ￥2000/月 - 升级服务器 + 考虑RTC

融资后：
  根据增长按需扩容
```

---

## 技术栈推荐

### 后端
```go
// Go + WebSocket + Gin
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/gorilla/websocket"
)

// 优势：
// - Goroutine天然适合多人游戏
// - 高并发低延迟
// - 内存管理优秀
```

### 前端
```javascript
// 微信小程序 + Web Audio API
const audioContext = new AudioContext();

// 技术栈：
// - 微信小程序（用户基础大）
// - Opus音频编码（压缩率高）
// - WebSocket（实时双向通信）
```

### 开源框架
```
游戏服务器：
  - Nano（Go，轻量级）
  - Leaf（Go，功能完整）

RTC服务器（自建）：
  - Mediasoup（Node.js，推荐）
  - LiveKit（Go，云原生）
  - Janus（C，性能极致）
```

---

## 总结

**核心观点**：
1. 音视频是成本大头，游戏逻辑带宽可忽略
2. 回合制游戏不需要实时音频，3秒延迟可接受
3. 录音方案成本是RTC的1/160，狼人杀最佳选择
4. 3Mbps服务器￥100/月可支撑日活5000
5. 自建WebRTC投入产出比低，除非日活10万+

**行动建议**：
```
1. 用录音WebSocket方案快速上线
2. 个人小程序验证产品（3个月）
3. 有付费用户后注册个体户
4. 月消费1万+再考虑优化RTC成本
5. 做大后（日活10万+）自建或深度商务合作
```

---

*最后更新：2025-11-05*
