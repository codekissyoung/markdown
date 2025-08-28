# 中国大陆GitHub连接问题完全解决方案

## 问题现象

在中国大陆，开发者经常遇到GitHub连接问题：
- `git push` 和 `git pull` 超时失败
- `ping github.com` 无响应  
- `ssh -T git@github.com` 连接超时
- 浏览器能正常访问GitHub，但命令行工具不行

## 问题根本原因

### PAC模式的局限性
V2NET等代理工具的PAC（Proxy Auto-Configuration）模式：
- ✅ **浏览器支持**：能执行PAC脚本，自动判断哪些网站走代理
- ❌ **Git不支持**：命令行工具无法读取和执行PAC脚本
- ❌ **SSH不支持**：SSH协议不会自动使用系统代理

**这就是为什么浏览器访问GitHub正常，而Git操作失败的根本原因。**

## 解决方案对比

我们测试了3种主要解决方案：

### 方案1：全局代理模式 ⭐⭐⭐⭐
```bash
# V2NET切换到全局模式，获得SOCKS代理
scutil --proxy  # 查看代理配置
# 输出：SOCKSEnable : 1, SOCKSPort : 1081

# 配置SSH使用SOCKS代理
cat > ~/.ssh/config << 'EOF'
Host github.com
    HostName github.com
    User git
    Port 22
    ProxyCommand nc -X 5 -x 127.0.0.1:1081 %h %p
EOF

# 测试连接
git push  # 成功！
```

**优点：**
- 稳定可靠，SSH连接质量高
- 所有Git操作都能正常工作
- 一次配置，长期有效

**缺点：**
- 所有流量都走代理，消耗较多代理流量
- 国内网站也被代理，访问可能变慢

### 方案2：修改hosts文件 + PAC模式 ⭐⭐⭐⭐⭐
```bash
# 添加GitHub IP到hosts文件（需要定期更新）
sudo vim /etc/hosts
# 添加：140.82.112.4 github.com

# V2NET保持PAC模式
scutil --proxy  # 确认PAC模式启用

# 测试连接
git push  # 成功！
```

**优点：**
- 🏆 **最优解**：GitHub直连，其他网站按PAC规则
- 节省代理流量
- 浏览器和命令行都工作正常
- PAC模式保持灵活性

**缺点：**
- GitHub IP可能变化，需要定期更新hosts
- hosts文件修改需要管理员权限

### 方案3：Git专用代理配置 ⭐⭐⭐
```bash
# 只对GitHub配置HTTP/HTTPS代理
git config --global http.https://github.com.proxy http://127.0.0.1:1081
git config --global https.https://github.com.proxy http://127.0.0.1:1081
```

**优点：**
- 精确控制，只影响GitHub相关操作
- 其他Git仓库正常直连

**缺点：**
- HTTP代理在某些网络环境下不稳定
- 配置相对复杂

## 推荐的最终方案

### 🥇 首选：hosts文件 + PAC模式
这是经过实战验证的最佳方案：

1. **修改hosts文件**（添加GitHub IP）
2. **保持V2NET PAC模式**  
3. **享受最佳体验**：
   - Git操作：直连GitHub，速度快
   - 浏览器：PAC自动分流，节省流量
   - 其他开发工具：按需走代理

### 🥈 备选：SSH + SOCKS代理
当hosts方案不稳定时的可靠备选：
- V2NET切换到全局模式
- 配置SSH ProxyCommand
- 稳定性极高，但消耗更多代理流量

## 实用调试工具

### macOS系统代理检查
```bash
scutil --proxy  # 查看当前代理配置
```

### 网络连接测试
```bash
# 测试直连
ping github.com
curl -I https://github.com

# 测试SSH连接  
ssh -T git@github.com

# 测试SOCKS代理
curl --socks5 127.0.0.1:1081 -I https://github.com
```

### Git状态检查
```bash
git remote -v          # 查看远程仓库配置
git config --list | grep proxy  # 查看Git代理配置
```

## 长期维护建议

1. **定期更新hosts文件**：GitHub IP可能变化
2. **备份SSH配置**：`~/.ssh/config`文件很重要  
3. **监控连接质量**：如果hosts方案变慢，及时切换到代理方案
4. **保持工具更新**：V2NET、Git等工具的更新可能改善连接性

## 总结

GitHub连接问题的核心是**PAC模式与命令行工具的兼容性问题**。通过合理配置，我们可以：
- 让浏览器享受PAC模式的灵活性
- 让Git等开发工具稳定连接GitHub
- 在流量消耗和连接稳定性间找到平衡

记住：**问题的本质是理解代理协议的工作原理，解决方案就是让合适的工具使用合适的连接方式。**

---
*调试记录时间: 2025-08-28*
*测试环境: macOS + V2NET + Git*
*验证状态: 方案1和方案2都已实战验证成功*