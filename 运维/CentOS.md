# CentOS

## U盘装机

```bash
# USB设备为　/dev/sdc
$ dd if=CentOS-7-x86_64-Minimal-2009.iso of=/dev/sdc
```

## 使用KVM虚拟化安装CentOS

### １．安装相关软件

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

# 自动启动并启用 libvirtd 服务
$ sudo service libvirtd start
$ sudo update-rc.d libvirtd enable
$ service libvirtd status
```

### 2．为KVM虚拟机配置网桥

KVM 虚拟机需要通过网桥才能访问 Host 主机或访问网络，所以在安装好之后需要先配置网桥。编辑　

/etc/netplan/50-cloud-init.yaml

```yaml

```









