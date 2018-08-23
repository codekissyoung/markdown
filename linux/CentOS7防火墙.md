#SElinux

系统运行状态执行`setenforce 0`关闭SELinux
永久关闭`/etc/sysconfig/selinux`
```
# This file controls the state of SELinux on the system.# SELINUX= can take one of these three values:# enforcing - SELinux security policy is enforced.# permissive - SELinux prints warnings instead of enforcing.# disabled - No SELinux policy is loaded.#SELINUX=enforcingSELINUX=disabled# SELINUXTYPE= can take one of these two values:# targeted - Targeted processes are protected,# mls - Multi Level Security protection.SELINUXTYPE=targeted

```
重启linux
