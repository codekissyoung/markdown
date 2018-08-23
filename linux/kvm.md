# 概述
- 集成在内核中，是内核的一个模块

# 测试是否支持kvm
- 返回不等于0,则支持
```
egrep -c "(svm|vmx)" /proc/cpuinfo
```

# 安装
```
sudo aptitude install -y qemu-kvm qemu virt-manager virt-viewer libvirt-bin bridge-utils 
➜  ~ lsmod |grep kvm # 验证kvm是否安装正确
kvm_intel             200704  0
kvm                   593920  1 kvm_intel
irqbypass              16384  1 kvm
```
















