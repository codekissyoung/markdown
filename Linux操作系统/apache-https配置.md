# apache https 配置

## 申请证书

- [腾讯免费证书申请](https://www.qcloud.com/product/ssl)

```bash
➜ www.dadishe.com tree
.
├── Apache
│   ├── 1_root_bundle.crt
│   ├── 2_www.dadishe.com.crt
│   └── 3_www.dadishe.com.key
├── IIS
│   ├── keystorePass.txt
│   └── www.dadishe.com.pfx
├── Nginx
│   ├── 1_www.dadishe.com_bundle.crt
│   └── 2_www.dadishe.com.key
├── Tomcat
│   ├── keystorePass.txt
│   └── www.dadishe.com.jks
└── www.dadishe.com.zip
```

## 开启Apache ssl mod

```bash
➜ apache2 apache2 -v
Server version: Apache/2.4.18 (Ubuntu)
Server built: 2017-06-26T11:58:04
➜ apache2 sudo a2enmod ssl
Considering dependency setenvif for ssl:
Module setenvif already enabled
Considering dependency mime for ssl:
Module mime already enabled
Considering dependency socache_shmcb for ssl:
Module socache_shmcb already enabled
Module ssl already enabled
```

## 配置虚拟站点 参考配置

```bash
<VirtualHost *:80>
ServerName www.dadishe.com
Redirect permanent / https://www.dadishe.com
</VirtualHost>
<VirtualHost *:443>
SSLEngine on
SSLCertificateFile /home/cky/cert/www.dadishe.com/apache/2_www.dadishe.com.crt
SSLCertificateKeyFile /home/cky/cert/www.dadishe.com/apache/3_www.dadishe.com.key
ServerName www.dadishe.com
DocumentRoot /var/www/html
ErrorLog ${APACHE_LOG_DIR}/www.dadishe.com.error.log
CustomLog ${APACHE_LOG_DIR}/www.dadishe.com.access.log combined
</VirtualHost>
# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
```
