# Ubuntu 24.04 LTS + LEMP + 免费SSL证书完整搭建指南

## 写在前面

最近需要为数据库管理搭建一个现代化的Web环境，顺便体验下Ubuntu 24.04 LTS的新特性。整个过程从系统重装到SSL证书配置，算是对现代Web服务器搭建的一次完整实践。

这次选择了LEMP技术栈（Linux + Nginx + MySQL + PHP），主要是想从传统的Apache切换到Nginx，毕竟公司也在用Nginx，技术栈统一会更好维护一些。

## 环境规划

**服务器信息：**
- 阿里云ECS：120.77.216.243
- 系统：Ubuntu 24.04 LTS (全新安装)
- 域名：db.codekissyoung.com
- 目标：搭建HTTPS phpMyAdmin环境

**技术选择：**
- Web服务器：Nginx (替代Apache)
- 数据库：MySQL 8.0+
- PHP：8.3 (最新稳定版)
- SSL证书：[Anchor Relay](https://anchor.dev/relay/d8ee4b64-8994-4c7a-948b-ca39ee422e4e)免费证书
- ACME客户端：acme.sh (替代certbot)

## 第一步：系统重装

直接在阿里云后台选择Ubuntu 24.04 LTS重装系统，比原地升级更稳妥。重装后创建普通用户：

```bash
# 创建用户
sudo adduser link
sudo usermod -aG sudo link

# 配置SSH密钥认证
mkdir ~/.ssh
chmod 700 ~/.ssh
# 复制公钥到 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## 第二步：LEMP栈安装

```bash
# 系统更新
sudo apt update && sudo apt upgrade -y

# 安装Nginx
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx

# 安装MySQL
sudo apt install mysql-server -y
sudo systemctl enable mysql
sudo systemctl start mysql

# MySQL安全配置
sudo mysql_secure_installation

# 安装PHP 8.3和phpMyAdmin
sudo apt install php8.3-fpm php8.3-mysql -y
sudo apt install phpmyadmin -y
```

安装phpMyAdmin时选择了lighttpd作为配置模板，然后手动配置Nginx。

## 第三步：SSL证书申请

这里遇到了第一个坑：Ubuntu 18.04的certbot版本太老(0.27.0)，不支持EAB(External Account Binding)认证，无法使用[Anchor Relay](https://anchor.dev/relay/d8ee4b64-8994-4c7a-948b-ca39ee422e4e)的ACME服务。

**解决方案：使用acme.sh替代certbot**

由于GitHub在大陆访问不稳定，使用Gitee镜像安装：

```bash
# 下载acme.sh
curl https://gitee.com/neilpang/acme.sh/raw/master/acme.sh -o /tmp/acme.sh

# 安装
cd /tmp
chmod +x acme.sh
./acme.sh --install

# 重新加载环境
source ~/.bashrc
```

**注册Anchor Relay ACME账户：**

```bash
~/.acme.sh/acme.sh --register-account \
  --server https://dv.acme-v02.anchor.dev/directory \
  --eab-kid "你的Kid" \
  --eab-hmac-key "你的HMAC密钥"
```

**申请SSL证书：**

```bash
~/.acme.sh/acme.sh --issue \
  --server https://dv.acme-v02.anchor.dev/directory \
  -d db.codekissyoung.com \
  --webroot /var/www/html \
  --debug
```

记得提前把域名DNS解析指向新服务器IP。

## 第四步：Nginx SSL配置

创建虚拟主机配置文件：

```bash
sudo nano /etc/nginx/sites-available/db.codekissyoung.com
```

配置内容：

```nginx
server {
    listen 80;
    server_name db.codekissyoung.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name db.codekissyoung.com;

    ssl_certificate /home/link/.acme.sh/db.codekissyoung.com/fullchain.cer;
    ssl_certificate_key /home/link/.acme.sh/db.codekissyoung.com/db.codekissyoung.com.key;

    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;

    root /usr/share/phpmyadmin;
    index index.php index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/db.codekissyoung.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 第五步：数据库用户配置

phpMyAdmin需要MySQL用户来连接数据库。检查现有用户：

```sql
-- 连接MySQL
sudo mysql -u root

-- 查看用户
SELECT user, host, plugin FROM mysql.user;
```

如果已经有合适的用户(如link用户)，直接使用即可。否则创建专用用户：

```sql
CREATE USER 'phpmyadmin'@'localhost' IDENTIFIED BY 'StrongPassword2024!';
GRANT ALL PRIVILEGES ON *.* TO 'phpmyadmin'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

## 最终效果

访问 https://db.codekissyoung.com，成功看到：
- **安全连接**：浏览器显示🔒图标
- **现代技术栈**：Ubuntu 24.04 + Nginx 1.24.0 + MySQL 8.0.43 + PHP 8.3.6
- **phpMyAdmin**：5.2.1版本，功能完整

**技术栈对比：**

| 组件 | 之前(Ubuntu 18.04) | 现在(Ubuntu 24.04) |
|------|------------------|------------------|
| Web服务器 | Apache 2.4.29 | Nginx 1.24.0 |
| 数据库 | MySQL 5.7 | MySQL 8.0.43 |
| PHP | 7.2 | 8.3.6 |
| SSL工具 | certbot 0.27.0 | acme.sh 3.0.5 |

## 几个坑和解决方案

### 1. certbot EAB支持问题
**问题**：Ubuntu 18.04的certbot太老，不支持EAB认证。
**解决**：升级到Ubuntu 24.04，使用acme.sh替代certbot。

### 2. GitHub访问问题  
**问题**：大陆服务器访问GitHub不稳定，acme.sh安装失败。
**解决**：使用Gitee镜像源安装acme.sh。

### 3. acme.sh安装路径问题
**问题**：直接在用户目录执行安装脚本导致路径错误。
**解决**：下载到/tmp目录再执行安装。

### 4. phpMyAdmin数据库连接
**问题**：phpMyAdmin提示密码错误。
**解决**：检查MySQL用户配置，使用现有用户或创建专用用户。

## 自动化和维护

**证书自动续期：**
acme.sh安装时自动配置了cron任务，证书会自动续期。可以手动检查：

```bash
crontab -l | grep acme

52 0 * * * "/home/link/.acme.sh"/acme.sh --cron --home "/home/link/.acme.sh" > /dev/null
```

**服务监控：**
```bash
# 检查服务状态
sudo systemctl status nginx mysql php8.3-fpm

# 检查SSL证书有效期
~/.acme.sh/acme.sh --list
```

## 总结

整个迁移过程还算顺利，从Ubuntu 18.04 + Apache切换到Ubuntu 24.04 + Nginx，技术栈明显更现代化了。特别是PHP 8.3的性能提升和MySQL 8.0的新特性，值得升级。

**主要收获：**
1. **acme.sh比certbot更灵活**：支持更多CA，EAB认证没问题
2. **Nginx配置相对简单**：相比Apache的.htaccess，Nginx的配置文件更清晰
3. **Ubuntu 24.04很稳定**：LTS版本还是值得信赖的
4. **证书自动化很重要**：Let's Encrypt类型的免费证书让HTTPS普及变得简单

下次可能会尝试容器化部署，Docker + docker-compose应该能让环境管理更简单。

---

*环境信息: Ubuntu 24.04 LTS, Nginx 1.24.0, MySQL 8.0.43, PHP 8.3.6*  
*SSL证书: Anchor Relay (90天免费证书)*  
*完成时间: 2025-08-30*