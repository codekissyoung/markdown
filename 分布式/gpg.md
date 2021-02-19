# GPG 加密解密

## 配置

```bash

```



## 使用

```bash
$ gpg --gen-key
注意：使用 “gpg --full-generate-key” 以获得一个功能完整的密钥产生对话框。
GnuPG 需要构建用户标识以辨认您的密钥。
真实姓名： link
姓名至少要有五个字符长
真实姓名： codekissyoung
电子邮件地址： codekissyoung@gmail.com
您选定了此用户标识：
    “codekissyoung <codekissyoung@gmail.com>”
更改姓名（N）、注释（C）、电子邮件地址（E）或确定（O）/退出（Q）？ O
我们需要生成大量的随机字节。在质数生成期间做些其他操作（敲打键盘
、移动鼠标、读写硬盘之类的）将会是一个不错的主意；这会让随机数
发生器有更好的机会获得足够的熵。
我们需要生成大量的随机字节。在质数生成期间做些其他操作（敲打键盘
、移动鼠标、读写硬盘之类的）将会是一个不错的主意；这会让随机数
发生器有更好的机会获得足够的熵。
gpg: 密钥 4E802A0B3589AE6E 被标记为绝对信任
gpg: 目录‘/home/link/.gnupg/openpgp-revocs.d’已创建
gpg: 吊销证书已被存储为‘/home/link/.gnupg/openpgp-revocs.d/055A3FCD80E2FE791474E09D4E802A0B3589AE6E.rev’
公钥和私钥已经生成并被签名。
pub   rsa3072 2021-02-19 [SC] [有效至：2023-02-19]
      055A3FCD80E2FE791474E09D4E802A0B3589AE6E
uid                      codekissyoung <codekissyoung@gmail.com>
sub   rsa3072 2021-02-19 [E] [有效至：2023-02-19]
```



```bash
$ gpg --list-keys
gpg: 正在检查信任度数据库
gpg: marginals needed: 3  completes needed: 1  trust model: pgp
gpg: 深度：0  有效性：  2  已签名：  0  信任度：0-，0q，0n，0m，0f，2u
gpg: 下次信任度数据库检查将于 2023-02-19 进行
/home/link/.gnupg/pubring.kbx
-----------------------------
pub   rsa3072 2021-02-19 [SC] [有效至：2023-02-19]
      055A3FCD80E2FE791474E09D4E802A0B3589AE6E
uid           [ 绝对 ] codekissyoung <codekissyoung@gmail.com>
sub   rsa3072 2021-02-19 [E] [有效至：2023-02-19]

pub   rsa2048 2021-02-19 [SC]
      7E348B36E46CC66B060D6E950060ADB19BFC71BF
uid           [ 绝对 ] codekissyoung (codekissyoung) <codekissyoung@gmail.com>
sub   rsa2048 2021-02-19 [E]
```

```bash
# 导出公钥
$ gpg --armor --output publickey.txt --export "codekissyoung <codekissyoung@gmail.com>"
# 导出私钥
$ gpg --armor --output privatekey.txt --export-secret-keys

# 输出公钥指纹
$ gpg --fingerprint "codekissyoung <codekissyoung@gmail.com>"
pub   rsa3072 2021-02-19 [SC] [有效至：2023-02-19]
      055A 3FCD 80E2 FE79 1474  E09D 4E80 2A0B 3589 AE6E
uid           [ 绝对 ] codekissyoung <codekissyoung@gmail.com>
sub   rsa3072 2021-02-19 [E] [有效至：2023-02-19]

# 加密
gpg --recipient "codekissyoung <codekissyoung@gmail.com>" --output demo.en.txt --encrypt demo.txt

# 解密
$ gpg --output demo.de.txt --decrypt demo.en.txt
gpg: 由 3072 位的 RSA 密钥加密，标识为 A22268870DF29127，生成于 2021-02-19
      “codekissyoung <codekissyoung@gmail.com>”
```

