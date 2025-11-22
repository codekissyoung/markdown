# 多人沙盒游戏服务端架构设计指南

> 学习日期: 2025-11-22
> 参考资料: 实战讨论 + Minecraft/饥荒架构分析
> 技术栈: Go + Godot
> 核心主题: 分布式架构、Chunk 分片、带宽优化

## 核心概念

### 1. 服务端权威架构 (Server Authoritative)

**设计原则**: 客户端只是"瘦终端"，所有游戏逻辑在服务端计算。

```
玩家客户端 (Godot)
    ↓ 上传输入
GameServer (计算真相)
    • 接收 N 个玩家输入
    • 计算物理/碰撞/伤害
    • 更新游戏状态
    ↓ 推送结果
玩家客户端 (渲染展示)
```

**优势**:
- 防作弊: 客户端无法篡改数据
- 一致性: 所有玩家看到相同的世界
- 易维护: 服务端逻辑修改，客户端不用更新

**代价**:
- 延迟: 操作需要往返服务器
- 带宽: 持续推送状态数据
- 服务端压力: 所有计算在服务端

### 2. Chunk 空间分片

**原理**: 将游戏世界按空间划分为固定大小的 Chunk，每个 Chunk 可以独立部署。

```go
type ChunkID struct {
    X int32
    Y int32
    Z int32  // 可选，2D 游戏不需要
}

const ChunkSize = 256  // 米

// 世界坐标 → ChunkID
func WorldPosToChunkID(x, y, z float64) ChunkID {
    return ChunkID{
        X: int32(math.Floor(x / ChunkSize)),
        Y: int32(math.Floor(y / ChunkSize)),
        Z: int32(math.Floor(z / ChunkSize)),
    }
}
```

**地图示例** (1km² 世界):

```
1024x1024 米 → Chunk 256x256
总 Chunk 数: (1024/256)² = 16 个

┌────┬────┬────┬────┐
│Ch00│Ch01│Ch02│Ch03│
├────┼────┼────┼────┤
│Ch10│Ch11│Ch12│Ch13│
├────┼────┼────┼────┤
│Ch20│Ch21│Ch22│Ch23│
├────┼────┼────┼────┤
│Ch30│Ch31│Ch32│Ch33│
└────┴────┴────┴────┘
```

### 3. Ghost Proxy (跨边界同步)

**问题**: 玩家站在 Chunk A 边缘，视野覆盖 Chunk B 的内容。

**方案**: Chunk B 将边缘实体的副本同步给 A (称为 Ghost Entity)。

```go
type GhostEntity struct {
    OriginalChunk ChunkID
    Entity        *Entity  // 只读副本
}

// Chunk B 向邻居推送边缘实体
func (chunkB *ChunkService) SyncBorderGhosts() {
    borderEntities := chunkB.GetBorderEntities(32)  // 边缘 32 米

    for _, neighbor := range chunkB.GetNeighbors() {
        neighbor.ReceiveGhosts(chunkB.ID, borderEntities)
    }
}
```

**挑战**: 这是分布式沙盒最大的带宽消耗点。

---

## 架构设计

### 阶段 1: 单服务器 (MVP)

**适用场景**: 独立游戏/小团队验证玩法

```
地图: 512-1024 米
Chunk: 256x256 米 → 2x2 或 4x4
玩家: 10-50 人
架构: 单进程 Go 服务器
```

**Go 实现**:

```go
type GameServer struct {
    Players   map[string]*Player
    Entities  map[string]*Entity
    TickRate  int  // 20 Hz
}

// 主循环
func (s *GameServer) Run() {
    ticker := time.NewTicker(time.Second / time.Duration(s.TickRate))
    for range ticker.C {
        s.ProcessTick()
    }
}

func (s *GameServer) ProcessTick() {
    // 1. 处理玩家输入
    for _, player := range s.Players {
        s.ProcessPlayerInput(player)
    }

    // 2. 物理计算 + 碰撞检测
    s.UpdatePhysics()
    s.CheckCollisions()

    // 3. 游戏逻辑
    s.ProcessCombat()
    s.ProcessBuilding()

    // 4. 推送状态给客户端
    s.BroadcastState()
}
```

**成本**: 单台服务器 500 元/月

### 阶段 2: 小规模集群

**适用场景**: 玩家数增长到 50-200 人

```
地图: 1024-2048 米
Chunk: 256x256 米 → 4x4 或 8x8
玩家: 50-200 人
架构: Go-Micro 微服务集群 (5-10 台)
```

**架构图**:

```
Godot Client (WebSocket)
    ↓
Gateway 集群 - 长连接管理 + 消息路由
    ↓
┌─────────────────────────────────┐
│ 游戏逻辑集群 (Go-Micro)          │
│ • World Partition Service       │
│ • Player Service                │
│ • Combat Service                │
│ • Building Service              │
└─────────────────────────────────┘
    ↓
Redis (AOI 缓存) + PostgreSQL (持久化)
```

**跨 Chunk 切换**:

```go
func (s *GameServer) OnPlayerMove(playerID string, newPos Position) {
    player := s.Players[playerID]
    oldChunk := player.CurrentChunk
    newChunk := WorldPosToChunkID(newPos.X, newPos.Y, newPos.Z)

    if oldChunk != newChunk {
        s.HandleChunkTransfer(player, oldChunk, newChunk)
    }
}

func (s *GameServer) HandleChunkTransfer(player *Player, oldChunk, newChunk ChunkID) {
    // 1. 从旧 Chunk 移除
    oldChunkService := s.GetChunkService(oldChunk.String())
    oldChunkService.RemovePlayer(player.ID)

    // 2. 向新 Chunk 添加
    newChunkService := s.GetChunkService(newChunk.String())
    newChunkService.AddPlayer(player)

    // 3. 推送新 Chunk 数据
    snapshot := newChunkService.GetSnapshot()
    s.PushTo(player.ID, "chunk_enter", snapshot)

    // 4. 通知其他玩家
    oldChunkService.Broadcast("player_left", player.ID)
    newChunkService.Broadcast("player_joined", player.Snapshot())
}
```

**成本**: 5,000-10,000 元/月

---

## 带宽计算详解

### 单玩家带宽消耗

**数据结构** (Protobuf):
```protobuf
message EntityUpdate {
    string id = 1;           // 16 字节
    Vector3 position = 2;    // 12 字节
    Vector3 rotation = 3;    // 12 字节
    int32 state = 4;         // 4 字节
}
// 压缩后: ~50 字节/实体
```

**订阅范围**: 3x3 Chunk (视野内)
- 玩家: 20 人
- 建筑/物品: 100 个
- 更新频率: 20 Hz

**下行带宽**:
```
玩家实体:  20 × 50 字节 × 20 Hz = 20 KB/s
静态实体:  100 × 50 字节 × 5 Hz = 25 KB/s  (低频)
事件推送:  5 KB/s (建造/破坏)
─────────────────────────────────────────
单玩家:    50 KB/s ≈ 0.4 Mbps
```

**上行带宽**:
```
输入指令:  5 KB/s
单玩家:    5 KB/s ≈ 0.04 Mbps
```

### 单 Chunk Server 带宽

**普通 Chunk** (5 个玩家):

```
内部同步:
  5 × 50 KB/s = 250 KB/s (玩家下行)
  5 × 5 KB/s  = 25 KB/s  (玩家上行)

Ghost 同步 (边缘 → 8 个邻居):
  13 实体 × 50 字节 × 20 Hz × 8 = 104 KB/s

总消耗: ~380 KB/s ≈ 3 Mbps
```

**热点 Chunk** (50 个玩家):

```
内部同步:
  50 × 100 KB/s = 5 MB/s (下行)
  50 × 5 KB/s   = 250 KB/s (上行)

Ghost 同步:
  50 实体 × 50 字节 × 20 Hz × 8 = 400 KB/s

总消耗: ~5.6 MB/s ≈ 45 Mbps
```

⚠️ **单 Chunk 承载上限: 50 人**

### 集群总带宽 (1000 人在线)

**场景假设**:
```
地图: 10km² (过大，不推荐)
分布:
  - 10 个热点 Chunk (50 人/个)
  - 100 个普通 Chunk (5 人/个)
```

**计算**:

| 类型 | 数量 | 单位带宽 | 总带宽 |
|:---|---:|---:|---:|
| 热点 Chunk | 10 | 5.6 MB/s | 56 MB/s |
| 普通 Chunk | 100 | 380 KB/s | 38 MB/s |
| **玩家下行总计** | 1000 | 50 KB/s | **50 MB/s** |
| **服务器间同步** | 110 | - | **44 MB/s** |
| **集群总带宽** | - | - | **94 MB/s ≈ 752 Mbps** |

**物理服务器** (100 台):
- 单台带宽: ~2 MB/s ≈ 16 Mbps
- 月成本: ~300 元/台
- **总成本: 30,000 元/月**

### 优化方案

#### 1. 增量更新 (Delta Compression)

只推送变化的字段:

```go
type EntityUpdate struct {
    ID       string
    Changed  []string  // ["position"]
    Position *Vector3  // 只有变化的字段
}
```

**效果**: 50 字节 → 15 字节 (70% 降低)

#### 2. 动态更新频率

距离越远，频率越低:

| 距离 | 频率 | 带宽系数 |
|:---|---:|---:|
| 0-50 米 | 60 Hz | 1.0x |
| 50-200 米 | 20 Hz | 0.33x |
| 200-500 米 | 5 Hz | 0.08x |

**效果**: 再降低 60%

#### 3. Ghost 过滤

只同步玩家视野覆盖的边缘区域:

```go
func (b *BorderGrid) GetVisibleCells(playerPos Position, viewCone Cone) []*Entity {
    // 根据视锥体过滤
}
```

**效果**: Ghost 带宽降低 70%

#### 优化总结

| 阶段 | 集群总带宽 | 降幅 |
|:---|---:|---:|
| 原始 | 752 Mbps | - |
| + 增量 | 226 Mbps | 70% |
| + 动态频率 | 90 Mbps | 60% |
| + Ghost 过滤 | **68 Mbps** | 24% |

**最终**: 1000 人在线 ≈ 68 Mbps

---

## 真实案例分析

### Minecraft

| 维度 | 数据 |
|:---|:---|
| 地图 | 无限 (程序生成) |
| Chunk | 16x16x256 方块 |
| 玩家 | 20-100 人/服 |
| 架构 | 单进程 Java |
| 特点 | 懒加载，活动范围 < 5km² |

**启示**: 无限地图不等于需要无限服务器，玩家实际活动范围有限。

### Don't Starve Together (饥荒联机版)

| 维度 | 数据 |
|:---|:---|
| 地图 | 1.2-2 km² |
| 玩家 | 4-10 人 (推荐) |
| 架构 | 单进程 Lua |
| 带宽 | ~1 Mbps (6 人) |
| 成本 | 家用电脑或 5 元/月 VPS |

**启示**: 小地图 + 精致玩法 > 大地图 + 空洞内容。

### 地图大小与体验关系

| 地图 | 玩家密度 | 体验 |
|:---|:---|:---|
| < 500m | 过于拥挤 | PvP 激烈，资源抢夺 |
| 500m-2km | **平衡** | 探索 + 社交适中 |
| > 5km | 玩家分散 | 孤独感强，新手流失 |

---

## 实战建议

### MVP 开发路径

**阶段 1: 核心验证** (1-3 个月)

```
地图: 512x512 米
Chunk: 256x256 → 2x2
玩家: 4-10 人
技术: 单进程 Go + Godot
成本: < 100 元/月

验证:
  ✅ 核心玩法是否有趣？
  ✅ 玩家留存率？
  ✅ 付费意愿？
```

**阶段 2: 小规模测试** (3-6 个月)

```
地图: 1024x1024 米
Chunk: 256x256 → 4x4
玩家: 20-50 人
技术: Go-Micro 小集群 (2-3 台)
成本: ~1,000 元/月
```

**阶段 3: 商业化扩展** (6-12 个月)

```
地图: 2048x2048 米
Chunk: 256x256 → 8x8
玩家: 100-500 人
技术: 完整分布式集群
成本: 5,000-20,000 元/月
```

### 技术选型

**客户端**:
- Godot (开源，跨平台)
- WebSocket + Protobuf

**服务端**:
- Go (高并发，简洁)
- Go-Micro (微服务框架)
- Redis (AOI 缓存)
- PostgreSQL (数据持久化)

### 常见陷阱

❌ **过早优化**:
- 一开始就做分布式集群
- MVP 阶段搞 Ghost Proxy
- 追求完美的带宽优化

✅ **正确做法**:
- 先单服务器跑通玩法
- 有玩家了再扩展
- 用数据驱动优化决策

❌ **地图过大**:
- 10km² 适合成熟商业游戏
- 独立项目 1-2 km² 足够

✅ **合理规模**:
- 从小地图开始
- 根据玩家反馈调整
- 技术服务于玩法

---

## 特殊场景: 修仙沙盒

### 核心差异

| 维度 | 普通沙盒 | 修仙沙盒 |
|:---|:---|:---|
| 移动方式 | 步行 | 飞行/遁术 |
| 视野范围 | 1 屏幕 | 神识扫描 (数百米) |
| 交互距离 | 近战 | 远程法术/大范围 AOE |
| 地图需求 | 1-2 km² | 4-10 km² |
| 玩家数 | 10-50 | 50-200 (宗门) |

### 技术挑战

**1. 飞行系统**:
```go
func (p *Player) UpdateAOI() {
    if p.IsFlying {
        p.LoadRadius = 2  // 5x5 Chunk
    } else {
        p.LoadRadius = 1  // 3x3 Chunk
    }
}
```

**带宽影响**: 飞行时订阅 25 个 Chunk (vs 9 个)

**2. 大范围法术**:
```go
// 跨 Chunk 碰撞检测
func (s *GameServer) CastSpell(spell Spell) {
    affectedChunks := s.GetChunksInRadius(spell.Position, spell.Radius)

    targets := []Entity{}
    for _, chunk := range affectedChunks {
        targets = append(targets, chunk.GetEntitiesInRange(spell)...)
    }

    // 计算伤害并广播
}
```

**3. 秘境副本**:
```go
type SecretRealm struct {
    ID       string
    Chunks   []*Chunk  // 临时实例
    Duration time.Duration
}
```

### 玩法设计

对标饥荒的修仙版本:

| 饥荒 | 修仙沙盒 |
|:---|:---|
| 采集浆果 | 采集灵药 |
| 烹饪食物 | 炼丹 |
| 建造科技树 | 炼器/布阵 |
| 生命/饥饿/理智 | 生命/灵力/心境 |
| 打 Boss 掉蓝图 | 渡劫获法宝 |
| 四季循环 | 灵潮周期 |
| 多人建基地 | 宗门建洞府 |

### MVP 建议

```
地图: 1024x1024 米
玩家: 4-10 人
境界: 3 个 (练气/筑基/金丹)
系统: 采集、炼丹、修炼、简单战斗

开发周期: 3-6 个月
验证: 修仙 + 生存融合是否有趣
```

---

## 总结

### 核心要点

1. **服务端权威**: 客户端只做渲染，服务端掌握真相
2. **Chunk 分片**: 空间划分是水平扩展的基础
3. **带宽优化**: 增量更新 > 动态频率 > Ghost 过滤
4. **规模控制**: 从小做起，别过早优化
5. **玩法优先**: 技术服务于玩法，不要本末倒置

### 开发检查清单

**MVP 阶段**:
- [ ] 单服务器架构 (Go 单进程)
- [ ] 基础 Chunk 划分 (2x2 或 4x4)
- [ ] 简单状态同步 (无优化)
- [ ] 10-50 人压测
- [ ] 核心玩法验证

**扩展阶段**:
- [ ] Go-Micro 集群化
- [ ] Redis AOI 缓存
- [ ] 增量更新实现
- [ ] 动态更新频率
- [ ] Ghost Proxy 优化
- [ ] 数据库分片

**商业化阶段**:
- [ ] 完整监控系统
- [ ] 自动扩缩容
- [ ] 跨区服务器
- [ ] CDN 加速
- [ ] 防作弊系统

### 参考资源

**开源项目**:
- Cuberite (Minecraft C++ 服务端)
- Minetest (开源沙盒)
- Leaf (Go 游戏服务器框架)

**技术文章**:
- [SpatialOS 分布式游戏架构](https://docs.improbable.io/)
- [Minecraft 网络协议文档](https://wiki.vg/Protocol)
- [饥荒联机版源码分析](https://github.com/kleientertainment)

---

*最后更新: 2025-11-22*
*核心观点: 技术服务于玩法，从小做起，数据驱动优化*
