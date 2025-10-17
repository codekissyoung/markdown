# Clash 自建代理体系速记

## 基础概念
- **Clash Core** 是无界面的规则引擎，负责解析 `config.yaml`，在本地开放 HTTP / SOCKS / TUN 端口并按策略转发流量。
- 图形客户端（ClashX、Clash for Windows 等）只是包装了 Clash Core；在无图形界面的服务器上使用 Core 即可。
- Clash 只提供“客户端”功能，真正的翻流量服务端需要自行搭建或购买，常见协议包括 VLESS、Trojan、Shadowsocks 等。

## 自建 VLESS Reality（xray-core 示例）
1. **环境准备**：推荐 Debian/Ubuntu 64 位，具备 `sudo`；准备解析指向服务器的域名或可用公网 IP；确保防火墙放行 SSH。
2. **安装 Xray**：
   ```bash
   curl -Ls https://github.com/XTLS/Xray-install/raw/main/install-release.sh | sudo bash
   ```
   安装完成后可得到 `/usr/local/bin/xray` 和 systemd 单元 `xray.service`。
3. **生成密钥与 UUID**：
   ```bash
   sudo xray x25519   # 得到 Reality 公钥/私钥
   uuidgen            # 生成 VLESS 用户 ID
   ```
   记录 `UUID`、`privateKey`、`publicKey`。
4. **编写配置**：编辑 `/usr/local/etc/xray/config.json`（根据需要调整域名、端口、shortId 等）。
   ```json
   {
     "log": { "loglevel": "warning" },
     "inbounds": [{
       "port": 443,
       "protocol": "vless",
       "settings": {
         "clients": [{ "id": "UUID", "flow": "xtls-rprx-vision" }],
         "decryption": "none"
       },
       "streamSettings": {
         "network": "tcp",
         "security": "reality",
         "realitySettings": {
           "dest": "www.microsoft.com:443",
           "serverNames": ["www.microsoft.com"],
           "privateKey": "PRIVATE_KEY",
           "shortIds": ["abcd"]
         }
       }
     }],
     "outbounds": [{ "protocol": "freedom" }]
   }
   ```
5. **启动与验证**：
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now xray
   sudo systemctl status xray
   sudo journalctl -u xray -f     # 查看实时日志
   sudo ss -lntp | grep 443       # 确认端口监听
   ```
   若有防火墙（`ufw` / `firewalld`），开放 TCP 443。
6. **Clash 客户端配置片段**：
   ```yaml
   proxies:
     - name: my-vless
       type: vless
       server: your.domain
       port: 443
       uuid: UUID
       flow: xtls-rprx-vision
       reality-opts:
         public-key: PUBLIC_KEY
         short-id: abcd
         spider-x: www.microsoft.com
   proxy-groups:
     - name: Auto
       type: select
       proxies: [my-vless]
   rules:
     - MATCH,Auto
   ```
   运行 `clash-linux-amd64 -d /path/to/config` 并用 `curl --proxy http://127.0.0.1:7890 https://ipinfo.io` 验证出口 IP。

## 协议稳定性与适用性
- **VLESS Reality**：TCP 直连，握手成本低，伪装真实站点，隐蔽性与抗干扰强；配置稍复杂，需要维护密钥和短 ID。
- **VLESS + XTLS Vision / TLS+WS**：Vision 延迟低，TLS/WS 可走 CDN；但需管理证书/反代，特征略显著。
- **Trojan**：标准 TLS，部署简单，兼容性好；必须保持证书有效，流量特征相对容易识别。
- **Shadowsocks (AEAD)**：实现轻量、性能好；若缺少混淆，易被主动探测；适合作为备用或内部使用。
- **WireGuard/透明代理**：协议稳、速度快，但 UDP 特征明显；在强干扰环境可能被限速或阻断。
> 建议准备多协议、多入口冗余，遇到封锁或线路波动时快速切换。

## 不自建的选项
- 购买现成的商业代理服务（俗称“机场”）省心，但需付费并信任服务商，质量参差。
- 公共免费节点存在稳定性与隐私风险，仅适合临时测试。
- 可与熟悉的伙伴共享自建节点，降低维护成本并保持可控性。

## 学习路线与收益
- 先夯实 TCP/IP、DNS、TLS、Linux 运维、防火墙、systemd 等基础。
- 阅读 Shadowsocks、xray-core、sing-box、Clash 等项目的开源实现和文档，理解协议握手、加密、分流逻辑。
- 动手搭建并测试多种协议，记录延迟、丢包、抗封锁表现。
- 关注 GitHub release、社区讨论，追踪协议演进与封锁手段。
- 收获：更自主排障、安全可控、性能可调、成本灵活，还能积累网络与安全技术。

## 域名与服务器选择
- **域名商**：Namecheap、Cloudflare Registrar、Gandi、Dynadot、阿里云国际等，部分支持支付宝/银联。
- **云服务器**：Vultr、DigitalOcean、Linode、Hetzner、阿里云国际、腾讯云国际等；选机房需兼顾延迟与流量政策。
- 留意实名、支付方式（双币信用卡、PayPal、支付宝等）和风控策略，建议小规格先行测试。

## 合规与商业化注意事项
- 自用前确认所在地与服务器所在国的法律法规，遵从平台服务条款。
- 在中国大陆地区私自向公众提供翻墙服务风险极高，不可贸然尝试。
- 台湾地区若面向公众运营，可能涉及《电信管理法》《个人资料保护法》等义务，最好先咨询当地法律与财税专家。
- 商业化需要额外处理账号认证、防滥用、日志留存、计费、客服、金流合规等，投入和风险远高于自用。

## 后续拓展
- 增加备用协议（Trojan/WS+TLS）与多地节点，实现自动探活与分流。
- 建立自动化脚本：证书续期、配置备份、节点健康检查。
- 加强安全：SSH 加固、Fail2Ban、系统更新、最小权限运维。
- 记录和审查每次变更，确保在合法合规范围内使用代理技术。
