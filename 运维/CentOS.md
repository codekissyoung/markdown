# CentOS

## U盘装机

```bash
# USB设备为　/dev/sdc
$ dd if=CentOS-7-x86_64-Minimal-2009.iso of=/dev/sdc
```

## 准备KVM

### 1. 安装相关软件

```bash
$ egrep -c '(vmx|svm)' /proc/cpuinfo
6 # > 0 表示CPU支持虚拟化, 否则请重启系统，然后转到 BIOS 设置中启用 VT 技术。

$ sudo apt install cpu-checker # 确定您的服务器是否能够运行硬件加速的 KVM 虚拟机
$ sudo kvm-ok
INFO: /dev/kvm exists
KVM acceleration can be used
$ sudo apt update

# 成功安装后，您登录的本地用户将自动添加到 libvirtd 组中。
$ sudo apt install qemu qemu-kvm libvirt-bin bridge-utils virt-manager

# 将当前用户添加到 libvirt 和 kvm 用户组
$ sudo usermod -aG libvirt $USER
$ sudo usermod -aG kvm $USER

# 自动启动并启用 libvirtd 服务
$ sudo systemctl start libvirtd.service
$ sudo systemctl enable libvirtd.service
$ sudo systemctl status libvirtd.service
```

- qemu-kvm 为 KVM 管理程序提供硬件模拟的软件程序
- libvirt-bin 管理虚拟化平台的软件
-  bridge-utils 用来配置网络桥接的命令行工具
-   virtinst 用来创建虚拟机的命令行工具
-   virt-manager 提供一个易用的图形界面，并且通过libvirt 支持用于管理虚拟机的命令行工具

### 2. 为KVM虚拟机配置网桥

在 libvirt 安装后中，一个被称为 virbr0　的桥接设备默认被创建。这个设备使用 NAT 来连接客户机到外面的世界。

```bash
# 列出当前的桥接和它们连接的接口
$ brctl show                
bridge name	  bridge id		        STP   enabled	interfaces
virbr0		     8000.5254001dc6ac	  yes		virbr0-nic
$ ifconfig 
enp4s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500 ...
lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536 ...

virbr0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 192.168.122.1  netmask 255.255.255.0  broadcast 192.168.122.255
        ether 52:54:00:1d:c6:ac  txqueuelen 1000  (以太网)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

virbr0 桥接没有添加任何的物理接口。virbr0-nic 是一个虚拟设备，没有任何流量通过。这个设备唯一的目的就是避免修改 virbr0 桥接的 MAC 地址。

KVM 虚拟机需要通过网桥才能访问 Host 主机或访问网络，所以在安装好之后需要先配置网桥。编辑　

/etc/netplan/50-cloud-init.yaml

```yaml

```

### 3. 使用virt-manager创建虚拟机

```bash
sudo virt-manager
```

![image-20210307134127551](https://img.codekissyoung.com/2021/03/07/e0da1b34c3b91b4267659cbcf6898964.png)

文件->新建虚拟机

![image-20210307140133636](https://img.codekissyoung.com/2021/03/07/78fcc9ac72113f058fcd219fa1bd38f5.png)

选择好 iso 磁盘



![image-20210307140443452](https://img.codekissyoung.com/2021/03/07/7777a78ab38989f4ff15f68eb437aea2.png)



前进后，设置下CPU、内存、磁盘大小（图略）。

设置网络：

![image-20210307140941828](https://img.codekissyoung.com/2021/03/07/4b77323df2c69314faa3f254967f0db5.png)

![image-20210307141149846](https://img.codekissyoung.com/2021/03/07/7cca0c6323cec0536d701a15d7030703.png)



### 4. 使用 virt-install 命令行创建虚拟机

```bash
# 命令行界面下，使用以下 virt-install 命令从终端为 KVM 创建 VM 虚拟机
$ sudo virt-install -n Sysgeek-Server \
--description "Test VM for Sysgeek" \
--os-type=Linux \
--os-variant=rhel7 \
--ram=1096 --vcpus=1 \
--disk path=/var/lib/libvirt/images/ sgserver.img,bus=virtio,size=10 \
--network bridge:br0 \
--graphics none \
--location /home/billyfu/rhel-server-7.3-x86_64-dvd.iso \
--extra-args console=ttyS0
```



## 在KVM中安装CentOS

完成KVM的虚拟机器创建后，点击“开始安装”，即可进入CentOS的安装界面：

![image-20210307141418227](https://img.codekissyoung.com/2021/03/07/1003e28044fa837c1a8f9ceb8ffc19de.png)

![image-20210307141806915](https://img.codekissyoung.com/2021/03/07/734424a5e9f1b0c51bb73d34d148c23f.png)



![image-20210307152258711](https://img.codekissyoung.com/2021/03/07/d3329dbd93c81ba242f5fa7edf99775d.png)

采用手动分区，使用 LVM 模式。

![image-20210307152639124](https://img.codekissyoung.com/2021/03/07/0e9efffae4ede7d10787e0ab9d97144c.png)

配置下网络。

![image-20210307152933488](https://img.codekissyoung.com/2021/03/07/7b0f4560364b633a7ea949d50dddced6.png)

设置下用户名和密码，就已经在安装了。

![image-20210307153059798](https://img.codekissyoung.com/2021/03/07/5f21685e5bf37594df25f9932fac2438.png)