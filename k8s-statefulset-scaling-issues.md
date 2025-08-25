# Kubernetes StatefulSet 扩缩容踩坑记录：存储卷管理的血泪教训

## 背景

最近在阿里云 K8S 集群上对一个有状态服务（StatefulSet）进行扩容时遭遇了存储卷挂载失败的问题。经过一番排查，发现了 StatefulSet 扩缩容中两个容易被忽视但非常关键的问题。

## 问题现象

**扩容操作**：将 StatefulSet 从 2 个副本扩容到 8 个副本

**失败症状**：
- 新创建的 Pod 长时间处于 `Init:0/2` 状态
- 部分 Pod 被调度到不存在的节点上
- 存储卷挂载超时：`timed out waiting for the condition`

**环境信息**：
- 阿里云 ACK 集群
- StatefulSet 配置了 1000Gi 持久存储
- 存储类：`idc-receiver-web-20220328`，策略：`Retain + WaitForFirstConsumer`

## 排查过程

### 1. 初步诊断

```bash
# 检查 Pod 状态
kubectl get pods -n cx-idc | grep receiver-receiver-web-statefulset

# 结果显示
receiver-receiver-web-statefulset-0   2/2     Running       0          19d
receiver-receiver-web-statefulset-1   2/2     Running       0          19d  
receiver-receiver-web-statefulset-2   2/2     Terminating   0          33m  # 卡住删除
receiver-receiver-web-statefulset-5   0/2     Init:0/2      0          32m  # 初始化失败
```

### 2. 存储状态检查

```bash
# 检查 PVC 状态 - 正常
kubectl get pvc -n cx-idc | grep large-format-log
large-format-log-receiver-receiver-web-statefulset-0   Bound    d-wz97b0sh6u1a3i00coh0   1000Gi
large-format-log-receiver-receiver-web-statefulset-1   Bound    d-wz9a4xdd6p7b0nbyvwmd   1000Gi
...

# 检查 PV 状态 - 发现异常！
kubectl get pv | grep idc-receiver-web
d-wz9gme1m29dd3jkf0g2t   1000Gi   RWO   Retain   Available   # 未绑定状态
d-wz9gme1m29dd3jkf0g2x   1000Gi   RWO   Retain   Available   # 未绑定状态
```

### 3. 节点调度问题

```bash
# 检查 Pod 被调度到的节点
kubectl describe pod receiver-receiver-web-statefulset-2 -n cx-idc

# 发现调度到了不存在的节点
Node: cn-shenzhen.172.16.19.55  

# 验证节点是否存在
kubectl get node cn-shenzhen.172.16.19.55
Error from server (NotFound): nodes "cn-shenzhen.172.16.19.55" not found
```

## 根本原因分析

经过深入排查和同事的经验总结，发现了两个核心问题：

### 问题 1：PV 复用导致的状态冲突

**问题机制**：
1. **缩容时**：Pod 删除 → PVC 保留（Retain 策略）→ PV 变为 Available 状态
2. **扩容时**：新 Pod 创建 → 复用存在的 Available PV → 数据冲突/状态异常

**危害**：
- PV 中可能包含旧的应用数据和状态信息
- 新 Pod 挂载后出现数据不一致问题
- 导致初始化容器或应用启动失败

### 问题 2：新节点存储资源不足

**问题背景**：
- 扩容时新增的 ECS 节点默认只配置系统盘
- StatefulSet 需要 1000Gi 大容量数据盘
- CSI 驱动需要足够的存储配额才能自动创建云盘

**影响**：
- 存储类无法在新节点创建所需容量的云盘
- Pod 调度成功但存储卷挂载失败
- 导致整个扩容流程阻塞

## 解决方案

### 立即修复

```bash
# 1. 强制删除卡住的 Pod
kubectl delete pod receiver-receiver-web-statefulset-2 -n cx-idc --force --grace-period=0

# 2. 清理 Available 状态的 PV
kubectl get pv | grep Available | grep idc-receiver-web
kubectl delete pv d-wz9gme1m29dd3jkf0g2t d-wz9gme1m29dd3jkf0g2x

# 3. 重新启动扩容流程
kubectl scale statefulset receiver-receiver-web-statefulset --replicas=8 -n cx-idc
```

### 预防措施

#### 规范化缩容流程

```bash
# 1. 缩容 StatefulSet
kubectl scale statefulset my-app --replicas=2 -n namespace

# 2. 等待 Pod 完全删除
kubectl get pods -n namespace | grep my-app

# 3. 删除不需要的 PVC
kubectl delete pvc large-format-log-my-app-2 large-format-log-my-app-3 -n namespace

# 4. 清理对应的 PV（Retain 策略下需要手动删除）
kubectl get pv | grep Available
kubectl delete pv <pv-names>
```

#### 扩容前置检查

```bash
# 1. 检查是否有历史遗留的 Available PV
kubectl get pv | grep Available | grep <storage-class>

# 2. 验证目标节点存储资源
kubectl describe node <node-name> | grep "Allocated resources" -A 10

# 3. 确认存储类在目标可用区的配额
# （需要通过阿里云控制台检查）
```

#### 存储类配置优化

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: optimized-storage-class
provisioner: diskplugin.csi.alibabacloud.com
parameters:
  type: cloud_essd
  performanceLevel: PL1
reclaimPolicy: Delete  # 改为 Delete 策略，自动清理
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
```

## 经验总结

### 核心原则

1. **缩容后 PV 要及时清理**：避免下次扩容时复用导致状态冲突
2. **新节点存储资源要预先准备**：大容量 PV 需要确保存储配额充足
3. **监控存储类配额和可用区分布**：避免调度到资源不足的区域

### 最佳实践

**存储策略选择**：
- **开发/测试环境**：使用 `Delete` 策略，自动清理 PV
- **生产环境**：使用 `Retain` 策略，但建立完善的 PV 生命周期管理

**扩缩容 SOP**：
1. 扩容前检查存储资源和历史 PV
2. 缩容后及时清理不需要的 PVC/PV
3. 建立 PV 使用情况的监控和告警

**节点资源规划**：
- 新增节点时预估存储需求
- 考虑单节点磁盘挂载数量限制（阿里云 ECS 通常为 16 个）
- 合理分布 Pod 避免存储热点

## 成本影响

这次踩坑也让我们意识到存储成本问题：

**成本计算**：
- 8 个副本 × 1000Gi = 8TB 存储
- 按阿里云高效云盘价格约 0.35 元/GB/月
- 月成本：8000GB × 0.35 元 = 2800 元/月

**优化建议**：
- 评估实际存储需求，避免过度分配
- 选择合适的云盘类型（高效云盘 vs ESSD）
- 建立存储使用率监控，及时清理无用 PV

## 结语

StatefulSet 的存储管理比想象中复杂，特别是在云环境中涉及自动化存储分配时。这次踩坑让团队深刻理解了以下几点：

1. **状态管理的复杂性**：有状态服务不仅仅是数据持久化，还涉及状态一致性
2. **云资源的限制性**：自动化不等于无限制，需要考虑配额和物理约束
3. **运维流程的重要性**：缺乏规范的扩缩容流程会带来隐性问题

希望这次总结能帮助其他同学避免类似的坑。记住：**缩容清 PV，扩容备资源** 🎯

---

**参考命令速查**：

```bash
# 检查 StatefulSet 状态
kubectl get statefulset -n namespace -w

# 检查 PV/PVC 状态  
kubectl get pv,pvc -n namespace

# 清理 Available PV
kubectl get pv | grep Available | awk '{print $1}' | xargs kubectl delete pv

# 强制删除卡住的 Pod
kubectl delete pod <pod-name> -n namespace --force --grace-period=0
```