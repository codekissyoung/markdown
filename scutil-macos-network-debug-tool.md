# macOS网络调试神器：scutil命令详解

## 什么是scutil？

`scutil`是macOS内置的**系统配置工具**（System Configuration Utility），用于查看和管理系统网络配置。相比图形界面，命令行方式更快速、精确。

## 常用命令

### 查看代理配置
```bash
scutil --proxy
```

输出示例：
```bash
<dictionary> {
  HTTPEnable : 0                    # HTTP代理状态（0=关闭，1=开启）
  HTTPSEnable : 0                   # HTTPS代理状态  
  ProxyAutoConfigEnable : 1         # PAC自动配置状态
  ProxyAutoConfigURLString : http://127.0.0.1:7777/pac  # PAC文件地址
  SOCKSEnable : 0                   # SOCKS代理状态
  SOCKSPort : 1081                  # SOCKS代理端口（如果启用）
  SOCKSProxy : 127.0.0.1            # SOCKS代理服务器（如果启用）
}
```

### 查看DNS配置
```bash
scutil --dns
```

### 查看主机名
```bash
scutil --get HostName
```

### 查看网络连接列表
```bash
scutil --nc list
```

## 实际应用场景

### 网络代理调试
当遇到网络连接问题时，第一步就是确认代理配置：
- PAC模式：`ProxyAutoConfigEnable : 1`
- 全局模式：`SOCKSEnable : 1` 或 `HTTPEnable : 1`
- 直连模式：所有Enable都为0

### 开发环境诊断
开发时经常需要确认：
- Git是否能走代理？
- API调用是否被代理影响？
- Docker网络配置是否正确？

使用`scutil --proxy`一目了然。

## 对比图形界面

**图形界面路径：**
系统偏好设置 → 网络 → 高级 → 代理

**scutil优势：**
- 🚀 **速度快** - 一条命令即可查看
- 📋 **信息全** - 显示所有代理配置细节
- 🤖 **脚本化** - 可集成到自动化脚本中
- 🔍 **精确** - 显示确切的端口和服务器地址

## 实用技巧

### 一键诊断网络配置
```bash
echo "=== 代理配置 ==="
scutil --proxy

echo -e "\n=== DNS配置 ==="
scutil --dns | head -20

echo -e "\n=== 主机名 ==="
scutil --get HostName
```

### 结合其他工具
```bash
# 检查代理是否工作
scutil --proxy
curl --proxy $(scutil --proxy | grep SOCKSProxy | cut -d: -f2 | tr -d ' ') https://github.com
```

## 总结

`scutil --proxy`是macOS开发者必备工具，特别适合：
- 网络连接问题排查
- 代理配置验证  
- 开发环境调试
- 自动化脚本集成

记住这个命令，让网络调试效率翻倍！

---
*记录时间: 2025-08-28*
*适用系统: macOS*