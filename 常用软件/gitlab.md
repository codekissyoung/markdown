# gitlab

## 安装

```bash
$ sudo apt-get update
$ sudo apt-get install -y curl openssh-server ca-certificates
$ curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.deb.sh | sudo bash
$ sudo EXTERNAL_URL="http://gitlab.cky.com" apt-get install gitlab-ce
```

### 配置

```ruby
# 访问URL配置
external_url 'http://gitlab.cky.com'
# 邮箱设置
gitlab_rails['smtp_enable'] = true 
gitlab_rails['smtp_address'] = "smtp.qq.com"
gitlab_rails['smtp_port'] = 465
gitlab_rails['smtp_user_name'] = "1162097842@qq.com" # 发件人邮箱
gitlab_rails['smtp_password'] = "aaaaaaaabbbbbbccdd"   # 授权码
gitlab_rails['smtp_domain'] = "qq.com"
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = true 
gitlab_rails['smtp_tls'] = true
gitlab_rails['gitlab_email_enabled'] = true 
gitlab_rails['gitlab_email_from'] = '1162097842@qq.com'
gitlab_rails['gitlab_email_display_name'] = 'gitlab.codekissyoung.com'
```

