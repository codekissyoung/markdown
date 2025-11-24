# HTTPS普及史：从奢侈品到基础设施

## 引言

今天我们打开任何一个网站，浏览器地址栏的小锁图标已经司空见惯。但在十几年前，HTTPS还是一个"奢侈品"——只有银行、电商的登录页面才会用上。这篇文章回顾HTTPS从"选配"到"标配"的演进历程。

## SSL的算力代价

早期SSL确实有显著的性能开销。SSL/TLS握手需要：
- 非对称加密用于密钥交换（RSA或ECDH）
- 对称加密用于数据传输（AES等）
- 哈希计算用于完整性校验

在2000年代初期，一次完整的TLS握手可能需要数十毫秒的CPU时间。对于那个年代的服务器来说，这意味着：
- 单台服务器能支撑的并发HTTPS连接数大幅下降
- 需要专门的SSL加速卡（硬件加速）
- 服务器成本直接上升

所以当时的策略很实际：**只在敏感操作时使用HTTPS**。用户浏览商品用HTTP，点击"登录"或"支付"时才跳转到HTTPS页面。

## HTTP劫持：运营商的灰色生意

在全民HTTP的年代，中间人攻击几乎是"阳光下的秘密"：

### 运营商劫持
国内运营商在HTTP响应中注入广告是普遍现象：
- 页面右下角弹出浮窗广告
- 在HTML中插入iframe
- 劫持404页面导向广告页

这种行为直到HTTPS普及才基本消失，因为中间人无法解密和篡改加密流量。

### 公共WiFi风险
咖啡厅、机场的公共WiFi是攻击者的天堂：
- 会话劫持（Session Hijacking）
- Cookie窃取
- 明文密码截获

微博在2010年代早期就频繁出现用户账号被中间人攻击后"被关注"营销号的事件。

## HTTPS普及的关键节点

### Google的推动（2010-2014）

**2010年**：Gmail默认启用HTTPS。这是第一个大规模Web服务全站HTTPS化。

**2010年**：Google推出`encrypted.google.com`，为搜索提供加密版本。注意不是"ssl."子域名，而是"encrypted."前缀。

**2011年**：Google搜索主站开始向登录用户默认提供HTTPS。

**2014年**：Google宣布HTTPS作为搜索排名因素之一，直接用SEO激励推动全网HTTPS化。

### 混合内容问题

全站HTTPS迁移的一大障碍是**混合内容（Mixed Content）**问题。浏览器有严格规则：

```
HTTPS页面 → 加载HTTP资源 → 浏览器警告/阻止
```

这意味着：
- 所有图片、JS、CSS必须走HTTPS
- CDN需要支持HTTPS
- 第三方服务（广告、统计）需要HTTPS版本

对于大型网站，这需要：
1. 所有CDN节点配置证书
2. 更新数据库中的资源URL
3. 协调第三方服务商升级

微博等大型网站的HTTPS迁移花了数年时间（大约2015-2016年才基本完成），很大程度上就是在处理这些依赖链。

### 监控与隐私争议

HTTPS普及初期确实遇到了机构监管的阻力。一些教育机构和企业担心无法对加密流量进行内容审计：

- 无法过滤"不当内容"
- 无法监控数据泄露
- 合规审计困难

但这种阻力最终让位于安全需求。如今企业通常通过在终端设备安装根证书来实现HTTPS流量检查（本质上是合法的中间人）。

## Let's Encrypt：真正的转折点

2015年，Let's Encrypt开始公测，HTTPS才真正成为互联网基础设施。

### 传统证书的痛点

在Let's Encrypt之前，获取SSL证书需要：

| 痛点 | 具体问题 |
|:---|:---|
| 价格 | 几十到几百美元/年 |
| 流程 | 人工审核，几天到几周 |
| 续签 | 手动续签，容易忘记导致过期 |
| 门槛 | 需要理解CSR、私钥等概念 |

### Let's Encrypt的解决方案

**免费**：完全免费，降低准入门槛

**自动化**：ACME协议实现全自动申请和续签

**短有效期**：90天有效期（传统证书通常1年）

为什么选择90天？
- 减少密钥泄露的影响窗口
- 强制自动化，避免人工操作失误
- 快速吊销和重新签发

### ACME协议

ACME（Automatic Certificate Management Environment）是Let's Encrypt的核心创新。工作流程：

1. **域名验证**：服务器证明自己控制该域名
   - HTTP-01：在`/.well-known/acme-challenge/`放置token
   - DNS-01：在DNS添加TXT记录
2. **证书签发**：验证通过后自动签发
3. **自动续签**：证书到期前自动重复上述流程

现代Web服务器原生支持ACME：

```bash
# Caddy - 零配置自动HTTPS
caddy reverse-proxy --from example.com --to localhost:8080

# Traefik - 自动证书管理
# traefik.yml
certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@example.com
      storage: acme.json
      httpChallenge:
        entryPoint: web
```

## 现代HTTPS生态

### 性能不再是问题

今天HTTPS的性能开销已经微乎其微：

- **TLS 1.3**：握手只需1-RTT（往返时间）
- **会话复用**：Session Resumption减少握手
- **硬件加速**：AES-NI指令集让加密几乎零开销
- **HTTP/2 & HTTP/3**：强制HTTPS，且性能更好

Netflix等流媒体巨头全站HTTPS，每秒传输TB级加密流量。

### 浏览器的安全策略

浏览器厂商从"警告HTTP"逐步升级到"惩罚HTTP"：

- **Chrome 68（2018）**：HTTP页面标记"不安全"
- **Chrome 79（2019）**：开始阻止HTTPS页面的HTTP资源
- **现代浏览器**：部分API（Geolocation、Camera等）只在HTTPS下可用

### 仍在使用传统证书的场景

尽管Let's Encrypt已经普及，一些场景仍使用商业CA证书：

| 场景 | 原因 |
|:---|:---|
| 老旧系统 | 软件不支持ACME自动化 |
| 企业内网 | 需要OV/EV证书显示组织信息 |
| 金融机构 | 合规要求使用特定CA |
| IOT设备 | 设备无法运行ACME客户端 |

## 技术演进时间线

```
1995  SSL 2.0发布
1996  SSL 3.0发布
1999  TLS 1.0标准化
2006  TLS 1.1
2008  TLS 1.2
2010  Gmail默认HTTPS
2014  Google将HTTPS作为排名因素
2015  Let's Encrypt公测
2018  TLS 1.3标准化，Chrome标记HTTP为"不安全"
2020  主流浏览器禁用TLS 1.0/1.1
2021  HTTPS流量占比超过90%
```

## 总结

HTTPS从"付费可选"到"免费必备"的转变，是技术进步、商业激励和安全需求共同作用的结果：

1. **硬件进步**消除了性能借口
2. **Let's Encrypt**消除了成本和复杂度借口
3. **浏览器厂商**用UI压力倒逼网站升级
4. **Google的SEO策略**提供了商业激励

今天，部署HTTPS的成本几乎为零，没有理由不用。如果你还有HTTP服务在跑，现在就是升级的最好时机。

---

*参考资料*：
- [How Let's Encrypt Works](https://letsencrypt.org/how-it-works/)
- [TLS 1.3 RFC 8446](https://tools.ietf.org/html/rfc8446)
- [Google Security Blog](https://security.googleblog.com/)
