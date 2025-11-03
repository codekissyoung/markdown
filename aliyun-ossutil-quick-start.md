# 阿里云OSS命令行工具：ossutil 2.0快速上手

## 什么是ossutil？

`ossutil`是阿里云对象存储OSS的**官方命令行工具**，用于快速管理OSS资源。相比Web控制台和SDK，命令行方式更适合批量操作、脚本自动化和日常运维。

**版本**：2.0（本文基于2.2.0）
**安装**：从[阿里云文档](https://help.aliyun.com/document_detail/120075.html)下载对应平台二进制文件

## 安装配置

### macOS安装
```bash
# 下载后解压，移动到系统路径
sudo mv ossutil /usr/local/bin/

# 验证安装
ossutil version
```

### 初始化配置
```bash
ossutil config
```

交互式配置参数：
- **Access Key ID**：你的AK（RAM控制台获取）
- **Access Key Secret**：你的SK
- **Region**：`cn-hangzhou`、`cn-shenzhen`等区域代码
- **Endpoint**：留空自动使用公网地址，或手动指定如`oss-cn-shenzhen.aliyuncs.com`

配置文件默认保存在`~/.ossutilconfig`

## 常用命令

### 查看Bucket
```bash
# 列出所有bucket
ossutil ls

# 列出bucket内容（当前层级，不递归）
ossutil ls oss://bucket-name/ -d

# 递归列出所有文件
ossutil ls oss://bucket-name/ -r

# 限制返回数量
ossutil ls oss://bucket-name/ --limited-num 20
```

### 文件上传下载
```bash
# 上传单个文件
ossutil cp local.txt oss://bucket-name/path/remote.txt

# 下载单个文件
ossutil cp oss://bucket-name/path/remote.txt local.txt

# 递归上传目录
ossutil cp local-dir/ oss://bucket-name/remote-dir/ -r

# 增量同步（只传输差异文件）
ossutil sync local-dir/ oss://bucket-name/remote-dir/
```

### 文件管理
```bash
# 查看文件元信息
ossutil stat oss://bucket-name/file.txt

# 查看存储大小
ossutil du oss://bucket-name/

# 删除文件
ossutil rm oss://bucket-name/file.txt

# 递归删除目录
ossutil rm oss://bucket-name/dir/ -r
```

## 高级过滤

### 按文件类型过滤
```bash
# 只列出.jpg图片
ossutil ls oss://bucket-name/ --include "**.jpg"

# 多个后缀
ossutil ls oss://bucket-name/ --include "**.jpg" --include "**.png"

# 排除日志文件
ossutil ls oss://bucket-name/ --exclude "**.log"
```

### 按时间/大小过滤
```bash
# 最近3天内的文件
ossutil ls oss://bucket-name/ --max-age 3d

# 大于10MB的文件
ossutil ls oss://bucket-name/ --min-size 10M

# 小于100MB的文件
ossutil ls oss://bucket-name/ --max-size 100M
```

### 组合条件
```bash
# 查找最近7天内，大于5MB的PNG图片
ossutil ls oss://bucket-name/ \
  --include "**.png" \
  --max-age 7d \
  --min-size 5M
```

## 多账号管理

企业场景常需要管理多个阿里云主体的OSS资源，ossutil支持**profile机制**。

### 配置多个账号
编辑`~/.ossutilconfig`：
```ini
[default]
accessKeyID=YOUR_DEFAULT_AK
accessKeySecret=YOUR_DEFAULT_SK
region=cn-shenzhen

[profile company-a]
accessKeyID=COMPANY_A_AK
accessKeySecret=COMPANY_A_SK
region=cn-hangzhou

[profile personal]
accessKeyID=PERSONAL_AK
accessKeySecret=PERSONAL_SK
region=cn-beijing
```

### 切换账号使用
```bash
# 使用默认账号
ossutil ls

# 使用company-a账号
ossutil ls --profile company-a

# 使用personal账号上传
ossutil cp file.txt oss://my-bucket/file.txt --profile personal
```

### 查看所有profile
```bash
ossutil config list-profiles
```

## 实际应用场景

### 批量备份数据
```bash
# 将本地数据库备份同步到OSS
ossutil sync /data/backups/ oss://db-backup-bucket/$(date +%Y%m%d)/ -r
```

### 下载日志分析
```bash
# 下载最近3天的访问日志
ossutil ls oss://log-bucket/nginx/ --max-age 3d -r | \
  grep ".log" | \
  xargs -I {} ossutil cp {} ./logs/
```

### 清理过期文件
```bash
# 删除30天前的临时文件
ossutil ls oss://temp-bucket/ --min-age 30d -r | \
  grep "tmp" | \
  xargs -I {} ossutil rm {}
```

### 迁移Bucket数据
```bash
# 跨bucket拷贝（需先配置目标bucket）
ossutil cp oss://source-bucket/ oss://target-bucket/ -r
```

## 对比其他方式

| 方式 | 适用场景 | 优势 | 劣势 |
|------|---------|------|------|
| Web控制台 | 偶尔查看、单文件操作 | 直观可视化 | 批量操作效率低 |
| Go SDK | 程序内集成 | 细粒度控制、错误处理 | 需要编写代码 |
| ossutil | 日常运维、批量操作、脚本自动化 | 快速、灵活、支持过滤 | 不适合复杂业务逻辑 |

## 实用技巧

### 结合jq解析JSON输出
```bash
# 设置JSON输出格式
ossutil ls oss://bucket-name/ --output-format json | jq '.objects[] | .key'
```

### 传输大文件优化
```bash
# 调整并发数（默认16）
ossutil cp large-file.zip oss://bucket-name/ --checkers 32
```

### 生成预签名URL
```bash
# 生成24小时有效的下载链接
ossutil presign oss://bucket-name/file.pdf --timeout 86400
```

## 注意事项

⚠️ **内网vs公网Endpoint**
- 公网：`oss-cn-shenzhen.aliyuncs.com`（任何地方可访问）
- 内网：`oss-cn-shenzhen-internal.aliyuncs.com`（仅阿里云机房可访问）
- Region配置：只填区域代码如`cn-shenzhen`，Endpoint留空或单独指定

⚠️ **AK/SK安全**
- 配置文件权限：`chmod 600 ~/.ossutilconfig`
- 推荐使用RAM子账号，最小权限原则
- 定期轮换密钥

⚠️ **删除操作不可恢复**
- 删除前务必确认，建议先用`--dry-run`测试（部分命令支持）
- 开启版本控制可恢复误删文件

## 总结

`ossutil`是阿里云OSS运维必备工具，特别适合：
- 批量文件传输
- 定时备份脚本
- 日志收集下载
- 跨账号资源管理

掌握过滤参数和profile机制，让OSS管理效率翻倍！

---
*记录时间: 2025-11-03*
*适用版本: ossutil 2.x*
*官方文档: https://help.aliyun.com/document_detail/120075.html*
