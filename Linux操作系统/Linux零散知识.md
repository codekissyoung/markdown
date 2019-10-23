# Linux 零散知识

## KVM

KVM 集成在内核中，是内核的一个模块

```bash
# 查看是否支持 KVM 返回不等于0,则支持
egrep -c "(svm|vmx)" /proc/cpuinfo

# 安装 KVM
sudo aptitude install -y qemu-kvm qemu virt-manager virt-viewer libvirt-bin bridge-utils
# 验证kvm是否安装正确
➜  ~ lsmod |grep kvm 
kvm_intel             200704  0
kvm                   593920  1 kvm_intel
irqbypass              16384  1 kvm
```