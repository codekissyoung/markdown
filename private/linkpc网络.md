# LinkPC网络



电信 Router : 192.168.1.1 (网关)

小米 Router : 192.168.31.1 (网关)

Link-pc 本机 : 191.168.31.124 ( enp4s0 有线网卡IP )













```bash
$ sudo dmesg | grep -in eth # 确认内核加载了网卡
665:[    1.115165] r8169 0000:04:00.0 eth0: RTL8168h/8111h, 04:d4:c4:ec:c0:80, XID 541, IRQ 127
666:[    1.115166] r8169 0000:04:00.0 eth0: jumbo features [frames: 9200 bytes, tx checksumming: ko]
667:[    1.115665] r8169 0000:04:00.0 enp4s0: renamed from eth0
921:[    4.684383] Bluetooth: BNEP (Ethernet Emulation) ver 1.3

$ sudo lspci  # 列出硬件设备的信息，里面有网卡             
00:00.0 Host bridge: Intel Corporation 8th Gen Core Processor Host Bridge/DRAM Registers (rev 0a)
00:01.0 PCI bridge: Intel Corporation Xeon E3-1200 v5/E3-1500 v5/6th Gen Core Processor PCIe Controller (x16) (rev 0a)
00:14.0 USB controller: Intel Corporation Cannon Lake PCH USB 3.1 xHCI Host Controller (rev 10)
00:14.2 RAM memory: Intel Corporation Cannon Lake PCH Shared SRAM (rev 10)
00:16.0 Communication controller: Intel Corporation Cannon Lake PCH HECI Controller (rev 10)
00:17.0 SATA controller: Intel Corporation Cannon Lake PCH SATA AHCI Controller (rev 10)
00:1d.0 PCI bridge: Intel Corporation Cannon Lake PCH PCI Express Root Port 9 (rev f0)
00:1f.3 Audio device: Intel Corporation Cannon Lake PCH cAVS (rev 10)
00:1f.4 SMBus: Intel Corporation Cannon Lake PCH SMBus Controller (rev 10)
00:1f.5 Serial bus controller [0c80]: Intel Corporation Cannon Lake PCH SPI Controller (rev 10)
01:00.0 VGA compatible controller: Advanced Micro Devices, Inc. [AMD/ATI] Ellesmere [Radeon RX 470/480/570/570X/580/580X] (rev e1)
01:00.1 Audio device: Advanced Micro Devices, Inc. [AMD/ATI] Ellesmere [Radeon RX 580]
04:00.0 Ethernet controller: Realtek Semiconductor Co., Ltd. RTL8111/8168/8411 PCI Express Gigabit Ethernet Controller (rev 15)

$ sudo ifconfig enp4s0 192.168.32.10 # 给网卡设置一个Ip
```



```bash
/etc/services    # 协议名 （HTTP FTP SSH） 与　默认端口对应表
/etc/protocols   # IP 数据包协议相关定义数据
/etc/resolv.conf # DNS IP地址
```





