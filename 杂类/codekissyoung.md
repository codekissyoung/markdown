# 简历

状态 ：在职 / 26岁 / 男
联系 ：xxxxxxxxxx
学历 ：2016届本科 / 中国地质大学(北京) / 地质学遥感方向
博客 ：blog.codekissyoung.com
代码 ：github.com/codekissyoung

## 技能清单

熟悉语言：C / Go / PHP / JS
数据存储：MySQL / Redis
熟悉框架：Codeigniter / Yii2 advanced / ThinkPHP

## 2019.12 - 至今 互联网保险平台 小雨伞 组件架构组 架构师

## 2017.7 - 2019.9 旅行社交分享平台 青驿网 服务端研发

项目地址 ：www.iqingyi.com
项目介绍 ：分布式架构，前后端分离，可以简单划分为：接入层、服务层和数据层

- 接入层：采用 Codeigniter 提供 API 接口、Workerman 作为 Websoket 消息推送服务，对接 IOS、Andriod、Web、Mobile Web 四个端。接入层不允许链接数据库、不保存用户会话和状态、只提供参数检查、安全防范、返回数据格式定制等功能。所以可以非常容易通过前置一个负载均衡器（比如 Nginx 反向代理）进行横向拓展，应对大流量访问。

- 服务层：使用 C、PHP 自研多个常驻内存的 Service 服务，可分别部署在不同节点。大部分 Service 之间相互独立无依赖关系。服务层 与 接入层 之间在 TCP 之上采用自定义的 二进制协议 进行通信。

- 数据层：目前采用 MySQL 作为主存储器，多个节点，存储大部分业务数据。业务数据根据唯一ID通过 range table 或 hash 的方式存放在不同的节点中。采用 Redis 存储了数据唯一ID之间的索引关系，以及用户会话等信息，目前是单一节点。采用 MongoDB 存储了用户手机通讯录、微博、站内关注等信息，定时离线计算，用于社交推荐。

实现功能 ：

- 前后端分离不适合SEO，所以进行了页面静态化改造，离线脚本生成站点地图 sitemap.xml 提交百度
- 用户举报拉黑、管理员封禁用户功能
- 行程路线记录功能的设计与实现
- 解决大量历史遗留问题，合并数据表、分离用户数据与旅行地数据、修改 Redis 存储类型、修正不适用于分布式环境的代码，将正确的代码移动到合适的模块
- 解决生产与测试配置混乱、错误码不一致的问题，代码中所有字面量全部改为常量名
- 修复由于历史遗留问题，带来的生产环境下站内私信业务数据错误、评论数据不一致、点赞数据不一致等问题
- 通过加入校验机制和图片验证，解决短信接口被黑产利用，大量调用耗费短信费用的问题
- Service 监控重启脚本、批量删除僵尸用户数据脚本、统计 DAU MAU脚本、数据备份脚本等
- 部署https、右拍云图片存储url改造、防御小型Ddos攻击、服务器升级配置的关闭与重启服务等杂务
- 青驿商城的调研、设计、文档书写

## 2016.7 - 2017.2 共享充电宝租赁 云充吧 服务端研发

项目地址 ：云充吧驿站 微信公众号
项目介绍 ：LNMP 架构，Discuz X3.2 作为 PHP 框架，采用 swoole 与租售机器保持通信
实现功能 ：

- 附近的充电宝租赁点 API 接口
- 支付宝支付 API 接口
- 后台用户相关业务数据统计报表
- 基于 RBAC 的权限控制系统
- 引入 Composer，进行代码重构，将单个 4000+ 行的包含全部业务逻辑的 PHP 文件，按业务逻辑，拆分成控制器、模型、视图等多个 PHP 文件
- 模仿 Codeigniter 的 Active Record 数据库操作 API，将 Discuz 的数据库查询函数拓展为查询类，将所有用拼接 SQL 语句实现的业务逻辑全部改为使用查询类 API 实现
- 大型租赁站点售卖商品业务设计

## 2015.9 - 2015.12 汽车销售和服务平台 水稻汽车网 服务端研发(实习)

项目地址 ：www.shuidao.com
技术介绍 ：LNMP 架构，Yii2 框架
实现功能 ：

- 微信快速注册 API 接口
- 微信朋友圈悬赏寻车工具 API 接口
- 后台统计分析业务数据，定时生成报表，发送邮件
- 基于流量漏斗模型的用户行为日志分析

## 致谢

感谢您花时间阅读我的简历，期待能有机会和您共事
