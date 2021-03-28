# Virtual Box

https://www.bilibili.com/video/BV1JV411t7ow?from=search&seid=6697858248324967619



## 网络接入模式

### NAT 网络地址转换模式

原理：虚拟机的请求传递给 NAT Engine，由它来利用主机进行对外的网络访问，返回的数据包再由 NAT Engine 给虚拟机。

- 虚拟机 => 主机
- 主机 !=> 虚拟机
- 虚拟机1 !=> 虚拟机2（PS: 不同虚拟机配置同一个NAT Network，其实可以相互访问的）

```bash
高级-控制芯片 选择 PCnet-FAST III
高级-混杂模式 拒绝
高级-接入网线 √
虚拟机ip自动获取

ip样式：
ip 10.0.2.15

网关 10.0.2.2 (NAT Engine)
注意此处的网关在不同虚拟机中可能是同一个值，但是这归属于不同的 NAT Engine，因此实际上各个虚拟机用的不是同一个网关。
实际我们可以指定所有的NAT模式的虚拟机使用同一个 NAT Network,这样虚拟机之间也可以相互访问了。

DNS 10.0.2.3
```

### Bridged Adapter 桥接模式

原理：通过主机网卡，架设一条桥，直接连入到网络中。它使得虚拟机能被分配到一个网络中独立的IP，所有网络功能完全和在网络中的真实机器一样。虚拟机是通过主机所在网络中的DHCP服务得到ip地址的，所以按理来说，两者是完全独立的，但事实却是虚拟机是没有独立硬件的，它还是要依靠主机的网卡，因此，主机要断开网络，虚拟机也就没法拿到ip了。

- 主机 <=> 虚拟机 <=> 虚拟机
- 虚拟机与主机会获取同一个网段的IP地址
- 虚拟机网关与主机网关也是同一个

```bash
连接方式 选择 桥接模式
界面名称 选择 （如果你的笔记本有无线网卡和有线网卡，需要根据现在的上网方式对应选择）
高级-控制芯片 选择 PCnet-FAST III
高级-混杂模式 拒绝
高级-接入网线 √
虚拟机ip自动获取
```

假如公司的内网ip应该是严格管理的，那么在主机上的虚拟机还得去单独去申请公司内网IP，所以这种方法不好维护。
所以，如果主机所在局域网中得其他机器不需要使用虚拟机上的功能，最好使用Host-Only建立独立局域网。

### 最佳方案 双网卡

网卡一 NAT方式和宿主机共享网络，虚拟机可以联网，方便下载安装各种软件
    
网卡二 与主机建立独立局域网，和路由上其他的机器分离

现在看这种方式太对了，我后来把mac带到公司用了，因为要演示hadoop集群计算，而公司的ip是需要向网管申请的。每一台虚拟机的ip固定，因为hadoop集群要设置master，ip要固定下来。

### Host-only Adapter 主机模式

可以理解为Vbox在主机中模拟出一张专供虚拟机使用的网卡，所有虚拟机都是连接到该网卡上的，我们可以通过设置这张网卡来实现上网及其他很多功能，比如网卡共享、网卡桥接等。

通过　VirtualBox Host-Only Network 网卡进行通信，虚拟机以此ip作为网关，因此模拟了一个本机与各个虚拟机的局域网，如名称所指，
应该是无法上网的（但是有人说可以通过对 VirtualBox Host-Only Network 网卡进行桥接等操作使虚拟机可以上网，但如此就不如直接
采用桥接来的容易了，而且，呵呵，我没试成功，有的人也说不可以，因为主机不提供路由服务，我也不好乱说到底行不行，你自己试吧）

- 虚拟机 => 主机　永远通（用的是虚拟出来的vboxnet0网卡）
- 主机 => 虚拟机　永远通（用的是虚拟出来的vboxnet0网卡）
- 虚拟机 => 虚拟机 永远通（用的是虚拟出来的vboxnet0网卡）

```css
可以说前面几种模式所实现的功能，在这种模式下，通过虚拟机及网卡的设置都可以被实现。

虚拟机与主机关系 ：默认不能相互访问，双方不属于同一IP段，

host-only网卡默认IP段为192.168.56.X 子网掩码为255.255.255.0，后面的虚拟机被分配到的也都是这个网段。
通过网卡共享、网卡桥接等，可以实现虚拟机于主机相互访问。

虚拟机访问主机： 用的是主机的VirtualBox Host-Only Network网卡的IP：192.168.56.1 ，不管主机“本地连接”有无红叉，永远通。
注意虚拟机与主机通信是通过主机的名为VirtualBox Host-Only Network的网卡，因此ip是该网卡ip 192.168.56.1，而不是你现在正在上网所用的ip）

主机访问虚拟机，用是的虚拟机的网卡的IP： 192.168.56.101 ，不管主机“本地连接”有无红叉，永远通。
主机可以访问主机下的所有虚拟机，和192.168.56.1(是VirtualBox Host-Only Network网卡[在主机中模拟出的网卡，不是虚拟机中虚拟的网卡]的IP)

虚拟机与虚拟机关系 ：默认可以相互访问，都是同处于一个网段。
虚拟机与可以上网的主机IP关系 ：默认不能相互访问，也不能上网，原因同上，通过设置，可以实现相互访问。

应用场景：
在主机无法上网的情况下（主机可以上网的情况下可以用host-only，也可以用桥接），需要搭建一个模拟局域网，所有机器可以互访

配置方法：
连接方式 选择 仅主机（Host-Only）适配器
界面名称 选择 VirtualBox Host-Only Ethernet Adapter
如果无法设置界面名称，可以：In VirtualBox > Preferences > Network, set up a host-only network
高级-控制芯片 选择 PCnet-FAST III
高级-混杂模式 拒绝
高级-接入网线 √
虚拟机ip自动获取，也可以自己进行配置，网关配置为主机中虚拟网卡的地址【默认为192.168.56.1】，ip配置为与虚拟网卡地址同网段地址

ip样式：
ip 与本机VirtualBox Host-Only Network的网卡ip在同一网段内（默认192.168.56.*）
网关 本机VirtualBox Host-Only Network的网卡ip（默认192.168.56.1）
```

### Internal 内部网络模式

虚拟机与外网完全断开，只实现虚拟机于虚拟机之间的内部网络模式。各个虚拟机利用VirtualBox内置的DHCP服务器得到ip，数据包传递不经过主机所在网络，因此安全性高，防止外部抓包。让各台虚拟机处于隔离的局域网内，只让它们相互通信，与外界（包括主机）隔绝。

- 虚拟机 !=> 主机，彼此不属于同一个网络，无法相互访问。
- 虚拟机与主机网络中其他主机关系：不能相互访问，理由同上。
- 虚拟机 <=> 虚拟机 ，前提是在设置网络时，两台虚拟机设置同一网络名称。

```swift
配置方法：
连接方式 选择 内部网络
界面名称 选择 intnet（可以重新命名，所有放在同一局域网内的虚拟机此名称相同）
高级-控制芯片 选择 PCnet-FAST III
高级-混杂模式 拒绝
高级-接入网线 √
虚拟机ip：
- 对于XP自动获取ip即可
- 但对于linux，必须手动配置ip和子网掩码，手动配置时需保证各个虚拟机ip在同一网段
```

### 其他模式

下面这些是只在命令行下可以使用的模式：

- UDP Tunnel networking

- VDE networking

- Limiting bandwidth  for network I/O
- Improving network performance



### 支持的虚拟网卡

```bash
AMD PCNet FAST III (Am79C973, the default)
AMD PCNet PCI II (Am79C970A)
Intel PRO/1000 MT Desktop (82540EM)（Windows Vista and later versions）
Intel PRO/1000 T Server (82543GC)（Windows XP）
Intel PRO/1000 MT Server (82545EM)（OVF imports from other platforms）
Paravirtualized network adapter (virtio-net)
```



### NAT模式虚拟机互通

设置为`NAT`网络模式:

```
全局设置 -> 网络 -> NAT网络
```

新增一个NAT网络，然后设置各虚拟机网络类型为该网络。

![image-20210217190522738](https://img.codekissyoung.com/2021/02/17/76411345df105f682a1d1136e2e91158.png)

![image-20210217190559801](https://img.codekissyoung.com/2021/02/17/85558472a420ed6dfce32dc28be2f9ee.png)



### 配置双网卡

![image-20210217205556823](https://img.codekissyoung.com/2021/02/17/43da9732e560b1a590d6b3cf6d307741.png)

![image-20210217205608018](https://img.codekissyoung.com/2021/02/17/9c559afa983fb98fce1b14078e078b5c.png)

```bash
network:
  ethernets:
    enp0s8:
      dhcp4: true # 桥接网卡用 DHCP
    enp0s3: # NAT 网卡自己设置 IP
      addresses: [10.0.2.16/24]
      gateway4: 10.0.2.2
      dhcp4: no
  version: 2
```