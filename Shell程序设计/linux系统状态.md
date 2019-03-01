# 查看linux系统状态

## 环境变量

- `cat /proc/6438/environ | tr '\\0' '\\n'` 查看`6438`进程的环境变量, 由于返回的变量以`name=value`描述，彼此之间用`null`(`\\0`)分隔，所以这里替换下，方便查看

## ps 查看进程状态

```bash
ps axfu                # 显示了系统所有进程
ps axfj                # 显示了 进程/子进程 之间关系
ps axl                 # 长模式 ，显示了 PPID 谦让值 NI 进程正在等待的资源
pgrep -l ssh           # 查出带有某字符串的进程的进程号
```

## 查看硬盘分区情况

`fdisk    -l    [/dev/had]`硬盘分区情况
`df    -h`    硬盘分区的使用情况
`du    -sh   /root`    查看`/root`下所有目录大小

## linux环境配置

`Locale`    查看当前语言环境
`LANG=zh_CN.UTF-8`设置当前语言,`LANG` 是环境变量可以使用配置环境变量，而不用去修改对应的配置文件
`env`    列出所有的环境变量
`date`   显示当前时间
`cal`    显示当前日历
`env`    列出所有环境变量和值
`set`    列出所有已经生效的变量

## df

```bash
df -h # 查看磁盘使用情况
du -sh *
du -lh --max-depth=1
```

## 观察内存状态 cat /proc/meminfo

```bash
blog git:(master)cat /proc/meminfo
MemTotal:        8056516 kB
MemFree:         4403196 kB
MemAvailable:    6264224 kB
Buffers:          381480 kB
Cached:          1689388 kB
SwapCached:            0 kB
```

## ipcs 查看进程的共享内存 消息队列 信号量

```bash
blog git:(master)ipcs

--------- 消息队列 -----------
键        msqid      拥有者  权限     已用字节数 消息      

------------ 共享内存段 --------------
键        shmid      拥有者  权限     字节     连接数  状态      
0x00000000 98304      cky        600        16777216   2                       
0x00000000 4292609    cky        600        1048576    2          目标       
--------- 信号量数组 -----------
键        semid      拥有者  权限     nsems     
```

## lsof 查看进程调用的文件

```bash
lsof /sbin/init     # 查看某个文件(系统文件)被哪个进程调用
lsof -c httpd       # 查看httpd进程调用了哪些文件(系统文件)
lsof -u root        # 查看该用户的进程调用的文件(系统文件)

COMMAND     PID USER   FD      TYPE DEVICE SIZE/OFF NODE NAME
systemd       1 root  cwd   unknown                      /proc/1/cwd (readlink: Permission denied)
systemd       1 root  rtd   unknown                      /proc/1/root (readlink: Permission denied)
systemd       1 root  txt   unknown                      /proc/1/exe (readlink: Permission denied)
kthreadd      2 root  cwd   unknown                      /proc/2/cwd (readlink: Permission denied)
```

## 查看系统信息

```bash
uptime            # 查看系统平均负载 15:55:30 up  5:25,  1 user,  load average: 0.32, 0.27, 0.21
dmesg             # 内核启动自检信息
cat /proc/cpuinfo # 查看cpu详细信息
free -h           # 查看内存
vmstat 1 3        # 每隔一秒刷新一次输出 总共刷新3次
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b 交换 空闲 缓冲 缓存   si   so    bi    bo   in   cs us sy id wa st
 1  0      0 3918024 125876 2305964    0    0    22    17   70  303  3  1 96  1  0
- in : 每秒被中断的进程次数
- cs : 每秒钟进行的事件切换次数,值越大，代表系统与接口设备的通信越繁忙
- us : 非内核进程消耗cpu运算时间的百分比
- sy : 内核进程消耗cpu运算时间的百分比
- id : 空闲cpu的百分比
- wa : 等待 I/O 所消耗的cpu百分比
- st ：被虚拟机所盗用的cpu占比
```