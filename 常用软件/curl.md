# CURL

## 1. typora自定义上传文件脚本

```bash
#!/bin/bash
ret=$(curl -F "action=upload" -F "filename=@$1" http://img.codekissyoung.com/)
echo "Upload Success:";
echo $ret | tr -d "\"[]";
```
