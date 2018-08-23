`/etc/crontab` 是`root`用户的调度文件

## 个人任务调度命令
```
crontab -e
分     小时    日       月       星期     命令
0-59   0-23   1-31    1-12     0-6     command     (取值范围,0表示周日一般一行对应一个任务)

0 9 * * 0     date >> /home/yixiang/mylog.log 2>&1 & #每周日9:00执行一次

* 代表取值范围内的数字
/ 代表”每”
- 代表从某个数字到某个数字
, 分开几个离散的数字
2>&1  把错误输出和标准输出都输出到标准输出中，而标准输出又被重定向到mylog.log中
最后一个 & 表示后台执行
```



* 解释
ls 2>1测试一下，不会报没有2文件的错误，但会输出一个空的文件1；
ls xxx 2>1测试，没有xxx这个文件的错误输出到了1中；
ls xxx 2>&1测试，不会生成1这个文件了，不过错误跑到标准输出了；
ls xxx >out.txt 2>&1, 实际上可换成 ls xxx 1>out.txt 2>&1；重定向符号>默认是1,错误和输出都传到out.txt了。

## 终止任务调度
* crontab -r
## 列出当前有哪些任务调度
* crontab -l

## 技巧
写个 shell 脚本，将要执行的命令写在 shell 里面，然后定时将 shell 执行!

## 例子
30 21 * * * /usr/local/etc/rc.d/lighttpd restart       #每晚的21:30重启apache

45 4 1,10,22 * * /usr/local/etc/rc.d/lighttpd restart  #每月1、10、22日的4 : 45重启apache

10 1 * * 6,0  /usr/local/etc/rc.d/lighttpd restart     #每周六、周日的1 : 10重启apache

0,30 18-23 * * * /usr/local/etc/rc.d/lighttpd restart  #每天18 : 00至23 : 00之间每隔30分钟重启apache

0 23 * * 6 /usr/local/etc/rc.d/lighttpd restart        #每星期六的11 : 00 pm重启apache

* */1 * * * /usr/local/etc/rc.d/lighttpd restart       #每一小时重启apache

* 23-7/1 * * * /usr/local/etc/rc.d/lighttpd restart    #晚上11点到早上7点之间，每隔一小时重启apache

0 11 4 * mon-wed /usr/local/etc/rc.d/lighttpd restart  #每月的4号与每周一到周三的11点重启apache

0 4 1 jan * /usr/local/etc/rc.d/lighttpd restart       #一月一号的4点重启apache

参考
http://blog.csdn.net/xiyuan1999/article/details/8160998
