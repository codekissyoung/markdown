# GPG

参考资料：

[官方英文文档](https://gnupg.org/documentation/manuals/gnupg/)

[GPG配置、命令、实例与apt-key密钥测试](https://www.cnblogs.com/usmile/p/12873604.html)

[GnuPG2使用指北](https://emacsist.github.io/2019/01/01/gnupg2%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8C%97/#%E7%A7%81%E9%92%A5%E7%BB%B4%E6%8A%A4)

[GPG 入门](https://snowstar.org/2018/05/31/gpg-guide/)

[GPG 的正确使用姿势](https://mogeko.me/2019/068/)

[2021年，用更现代的方法使用PGP（上）](https://www.mdeditor.tw/pl/gW1n)

## 配置

- S wants to send a message to G. To do that:
    1. S looks for G's public key.
    2. S encrypts the message using G's public key.
    3. S signs the encrypted message with his own private key.
- G receives an encrypted signed message. The untrusted email header says it is from S.
    1. G looks for S's public key.
    2. G verifies the signature using S's public key. Now, G is convinced message is from S.
    3. G decrypts message using his own private key.

The whole scheme relies on the assumption that public keys are trustworthy



| 术语                     | 简写 | 含义                    |
| ------------------------ | ---- | ----------------------- |
| key pair                 |      | 密钥对(包含两部分)      |
| primary key [master key] |      | 主钥 包括 主公钥 主私钥 |
| public key               | pub  | 公钥                    |
| secret key               | sec  | 私钥                    |
| sub-key                  | sub  | 子公钥                  |
| secret sub-key           | ssb  | 子私钥                  |
| key fingerprint          |      | 密钥指纹                |

```bash
~/.gnupg
├── crls.d
│   └── DIR.txt
├── openpgp-revocs.d # 存储预先生成的吊销证书
│   ├── 055A3FCD80E2FE791474E09D4E802A0B3589AE6E.rev
│   └── 7E348B36E46CC66B060D6E950060ADB19BFC71BF.rev
├── private-keys-v1.d # 私钥存放的地方
│   ├── F3FCEA0E5140503BDF5971382464A182703CDD6C.key
│   └── F849602B4C47880363904618310A235BE0EE5A02.key
├── pubring.kbx # 公钥
├── random_seed
├── tofu.db
└── trustdb.gpg # 存放信任数据
└── gpg.conf # 配置文件
```

功能：认证[C]、签名[S]、解密[D]、验证签名[V]、加密[E]、身份验证[A]

只有主密钥具有**认证[C]**能力：认证具有不同功能的子密钥

假如删除私钥，则无法完成签名[S]、解密[D]

一个主密钥可以绑定多个子密钥，平时加密解密使用的都是子密钥，主密钥只有在某些特定的情况下才使用的，比如新建一个子密钥，撤销废除一个子密钥，签名认证别人的密钥等．

`~/.gnupg/gpg.conf`配置：

```conf
keyid-format long
with-fingerprint
```

## 使用

```bash
$ gpg --full-generate-key
gpg: 密钥 4E802A0B3589AE6E 被标记为绝对信任
gpg: 目录‘/home/link/.gnupg/openpgp-revocs.d’已创建
gpg: 吊销证书已被存储为‘/home/link/.gnupg/openpgp-revocs.d/055A3FCD80E2FE791474E09D4E802A0B3589AE6E.rev’
公钥和私钥已经生成并被签名。
pub   rsa3072 2021-02-19 [SC] [有效至：2023-02-19]
      055A3FCD80E2FE791474E09D4E802A0B3589AE6E
uid                      codekissyoung <codekissyoung@gmail.com>
sub   rsa3072 2021-02-19 [E] [有效至：2023-02-19]
```

**4E802A0B3589AE6E** 为密钥名，同时也是公钥名．



```bash
$ gpg --list-keys
gpg: marginals needed: 3  completes needed: 1  trust model: pgp
gpg: 深度：0  有效性：  2  已签名：  0  信任度：0-，0q，0n，0m，0f，2u
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
$ gpg --armor --output public.key --export "codekissyoung <codekissyoung@gmail.com>"
$ gpg --armor --output private.key --export-secret-keys       # 导出私钥
$ gpg --fingerprint "codekissyoung <codekissyoung@gmail.com>" # 输出公钥指纹
055A 3FCD 80E2 FE79 1474  E09D 4E80 2A0B 3589 AE6E

# 加密文件
$ gpg --recipient "codekissyoung <codekissyoung@gmail.com>" --output demo.en.txt --encrypt demo.txt
$ gpg --output demo.de.txt --decrypt demo.en.txt # 解密
```

### 子钥

```bash
$ gpg --expert --edit-key 055A3FCD80E2FE791474E09D4E802A0B3589AE6E
gpg> addkey
请选择您要使用的密钥类型：
   (6) RSA（仅用于加密）
您的选择是？ 6
RSA 密钥的长度应在 1024 位与 4096 位之间。
您想要使用的密钥长度？(3072) 2048
密钥的有效期限是？(0) 0
sec  rsa3072/4E802A0B3589AE6E
     创建于：2021-02-19  有效至：2023-02-19  可用于：SC  
     信任度：绝对        有效性：绝对
ssb  rsa3072/A22268870DF29127
     创建于：2021-02-19  有效至：2023-02-19  可用于：E   
ssb  rsa2048/7E79D11AF7B6E0BD
     创建于：2021-02-20  有效至：永不       可用于：E   
ssb  rsa2048/94A18A7E0F242440
     创建于：2021-02-20  有效至：永不       可用于：E   
[ 绝对 ] (1). codekissyoung <codekissyoung@gmail.com>
gpg> save

$ gpg -k # 查看公钥
/home/link/.gnupg/pubring.kbx
-----------------------------
pub   rsa3072 2021-02-19 [SC] [有效至：2023-02-19]
      055A3FCD80E2FE791474E09D4E802A0B3589AE6E
uid           [ 绝对 ] codekissyoung <codekissyoung@gmail.com>
sub   rsa3072 2021-02-19 [E] [有效至：2023-02-19]
sub   rsa2048 2021-02-20 [E]
sub   rsa2048 2021-02-20 [E]

$ gpg -K # 查看私钥                                                          
/home/link/.gnupg/pubring.kbx
-----------------------------
sec   rsa3072 2021-02-19 [SC] [有效至：2023-02-19]
      055A3FCD80E2FE791474E09D4E802A0B3589AE6E
uid           [ 绝对 ] codekissyoung <codekissyoung@gmail.com>
ssb   rsa3072 2021-02-19 [E] [有效至：2023-02-19]
ssb   rsa2048 2021-02-20 [E]
ssb   rsa2048 2021-02-20 [E]
```

### 子钥加密解密

```bash
$ gpg -k                                                                      
pub   rsa3072/4E802A0B3589AE6E 2021-02-19 [SC] [有效至：2023-02-19]
      密钥指纹 = 055A 3FCD 80E2 FE79 1474  E09D 4E80 2A0B 3589 AE6E
uid                 [ 绝对 ] codekissyoung <codekissyoung@gmail.com>
sub   rsa3072/A22268870DF29127 2021-02-19 [E] [有效至：2023-02-19]
sub   rsa2048/7E79D11AF7B6E0BD 2021-02-20 [E]
sub   rsa2048/94A18A7E0F242440 2021-02-20 [E]

# 指定子公钥加密
$ gpg --encrypt --recipient 94A18A7E0F242440 -o data/demo.en.txt data/demo.txt

# 解密，会自动找该公钥的的私钥
# 私钥是通过口令加密后存储的，所以还需要交互输入 口令
$ gpg --decrypt  data/demo.en.txt
```

### 公开公钥

```bash
# 备份后，即便没有清理本地的主私钥，私钥也不会发送到 gpgserver
$ gpg --keyserver keyserver.ubuntu.com --send-keys 4E802A0B3589AE6E
gpg: 正在发送密钥 4E802A0B3589AE6E 到 hkp://keyserver.ubuntu.com

# 在另一个PC上，导入该密钥
$ gpg --keyserver keyserver.ubuntu.com --search-keys codekissyoung
gpg: data source: http://162.213.33.8:11371
(1)	codekissyoung <codekissyoung@gmail.com>
	  3072 bit RSA key 4E802A0B3589AE6E, 创建于：2021-02-19
Keys 1-1 of 1 for "codekissyoung".  输入数字以选择，输入 N 翻页，输入 Q 退出 > 1
gpg: 密钥 4E802A0B3589AE6E：“codekissyoung <codekissyoung@gmail.com>” 未改变
gpg: 处理的总数：1
gpg:              未改变：1
```



关于gpg和密钥服务器的问题（不涉及子密钥）：

1. 吊销证书的生成过程会改变密钥内容么？为什么我看到说「上传（到密钥服务器）前先生成吊销证书」呢？
2. 密钥的有效期是密钥内容的一部分么？我可以将密钥上传到密钥服务器后再修改有效期么？
3. gpg为密钥设置的密码是什么东西？是通过对私钥进行对称加密完成的么？吊销证书呢？
4. gpg导出私钥时会连带公钥一起包含在那个文件中么？如果不是，那么为何我在其他设备上导入时再度导入公钥会提示已经存在；如果是，那么为何帮助中仅仅说是导出私钥（故意的，还是什么时候改变的行为）？
5. 对其他人公钥的信任是通过签名完成的么（因为我记得需要gpg --lsign）？信任度仅仅是一些离散的数值么？
6. 能否以及如何共享或导入对其他人公钥的信任度？（不仅仅是给自己）

关于子密钥以及密钥服务器的问题：

1. 我看到的文章们说gpg的子密钥也是一对密钥。那么它和一对独立的密钥有什么区别？换句话说：凭什么确定它就是某一主密钥的子钥？
2. 如果我将主密钥发布在密钥服务器上，那么其他人获取到的是只有我的主密钥，还是连同我的子密钥一起？
3. （接上）如果我为我的主密钥新增了子密钥，我需要再次发布到密钥服务器么？其他人如何获取到？
4. 如果我撤销了我的主密钥，子密钥也自动被撤销了么？
5. 我是否可以在设备A上为设备B生成子密钥，将子密钥的私钥发给B，保留主密钥的私钥在A上，然后在B上使用私钥签名以及加密？签名/加密过程中，B机器是否需要知道主密钥的公钥（还是说这个公钥会随着对子密钥的传输自动传输，所以不存在这个问题）？