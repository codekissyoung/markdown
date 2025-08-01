![image-20210318135436554](http://img.codekissyoung.com/2021/03/18/e56ce080838c4e4e8ef19f6fcfc8d988.png)

负载均衡系统是一个CDN系统的神经中枢，主要功能是负责对所有发起服务请求的用户进行访问调度，确定提供给用户的最终实际访问地址。

![image-20210318135830572](http://img.codekissyoung.com/2021/03/18/69c18f7d3086773373453fdc541b8373.png)



- GAC（Global Access Controller）模块对应于图2-1中的负载均衡系统，主要采用了智能DNS解析方案，负责通过域名解析应答实现将用户请求调度到最优服务节点的目的。

- CCN（ChinaCache Nod）模块对应于图2-1中的分发服务系统，是CDN的基本服务模块，由分布于各个城市、各个运营商网络中的Cache设备和辅助设备组成。
- NOC（Network Operating Center）模块对应图2-1中的网络管理系统，负责对全网进行7×24小时的监控和管理。NOC可以监控ChinaCache CDN中的链路状况、节点响应速度、设备运行状态，也可以监控到客户的源站点运行状况等信息，一旦发现异常马上采取相应措施予以解决，是保障CDN服务安全可靠性的重要系统。值得一提的是，蓝汛的NOC中设置了源站点监控功能，对客户源站进行可达性监控，从而减轻或者避免由于源站故障造成的服务中断。
- OSS（Operating Support System）模块对应图2-1中的运营管理子系统，负责采集和汇总各个CCN的日志记录信息，然后由中央处理软件加以整理和分析，最后通过客户服务门户进行发布。蓝汛的客户可以通过OSS提供的查询界面来查询加速页面或频道的实时流量、流量分布、点击数量、访问日志等信息。

![image-20210318144834690](http://img.codekissyoung.com/2021/03/18/402c072c4b610700b18a91bc92c89910.png)

首先由用户代理（IP地址10.9.55.68，端口4719）向服务器主机（IP地址202.102.86.141，端口80，这里的服务器不是源服务器）发起TCP连接建立请求[SYN]，服务器同意用户请求并向用户代理响应[SYN, ACK]，用户代理再返回[ACK]，这样双方就通过三次握手过程建立起了一个TCP连接。



![image-20210318151200423](http://img.codekissyoung.com/2021/03/18/07188331b2884c9decd9719ec6da7578.png)