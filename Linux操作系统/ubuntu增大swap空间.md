#  ubuntu增加swap空间

`ubuntu`增加`swap`空间。

## 查看系统内 Swap 分区大小

```bash
free -mh
             total       used       free     shared    buffers     cached
Mem:          993M       677M       316M        44K        13M       375M
-/+ buffers/cache:       288M       705M
Swap:         2.4G       722M       1.7G
```

## 创建一个 Swap 文件

```bash
sudo dd if=/dev/zero of=swapfile bs=1024 count=2000000  # 生成一个2G空字节文件
sudo mkswap -f swapfile                                 #  将这个文件转化为 swap文件
sudo swapon swapfile                                    # 启用这个swap文件

```

## 卸载与配置

```bash
sudo swapoff swapfile      # 卸载这个 swap文件
```

如果想默认使用这个swapfile文件 ，则需修改`/etc/fstab`文件

```bash
/swap/swapfile /swap swap defaults 0 0
```