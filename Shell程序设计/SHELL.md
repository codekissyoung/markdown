# SHELL脚本

## 1. 概述

Shell 适合文件、文本行、文本列粒度的操作。

执行程序、查找文件、删除文件、批量改变文件名、备份文件、列出目录的文件等。

命令可以划分为:

- 内建命令 : 不会产生子进程，为了效率才内建，比如 cd / read / echo 
- 函数 : 函数可以直接作为命令一样使用
- 外部命令 : 在　PATH　里搜寻并且执行的命令，产生子进程

所有命令返回 0 表示执行成功。

SHELL 脚本的执行被设计为阻塞式的，从上到下，依次执行，遇见创建子进程的外部命令，一定会等待子进程返回后，才继续往下执行。

shell 脚本程序:

- 没有 alias 别名 (别名在脚本中默认不开启，所以不要使用别名)
- 没有环境变量 PS1
- 不读入初始化文件
- 所有的操作不会影响到父进程
- 用 `.` 或 `source` 执行，则是在当前`Shell`进程中执行，所以会对当前环境产生影响。

```bash
$ /etc/profile (必读) --> /etc/profile.d/*.sh (可选)
$ ~/.bash_profile (必读) 
   --> ~/.bash_login, or ~/.profile --> ~/.bashrc -->  /etc/bashrc (可选)
$ ~/.bash_logout (退出必读)
```

```bash
if [ -z "$PS1" ]; then
    echo "作为脚本运行"
fi
```

## 2. 作为 Daemon 运行

通过`ssh`去远程执行命令时，如果网络中断，则终端会收到`HUP`中断信号，从而关闭所有的子进程。

所以为了长时间运行程序不受干扰，我们需要：
- 让脚本忽略 `HUP` 信号
- 让脚本运行在新的会话，脱离此终端，从而不收到终端`HUP`信号
- `()`可让命令在子 shell 中运行

```bash
$ nohup ping www.baidu.com &> ping.log &        # nohup 命令
$ setsid ping www.baidu.com &> setsid_ping.log  # setsid 命令
$ (ping www.baidu.com &> abc.log &)             # 孙子进程法，最后命令成了 孤儿进程
```

## 3. 基础知识

### 3.1 通配符

```bash
*                     代表任意字符串
?                     代表一个字符
[abcd]                代表从a, b, c, d选字符
[!abcd]               代表除这些字符串之外任意字符
[1-9]                 匹配1到9
[a-z]                 表示a到z
ls my_{finger,toe}s   匹配 my_fingers my_toes
```

### 3.2 调试脚本

```bash
set -x              # 调试开始, 显示每条实际执行的命令和参数
# 业务代码 ...
set +x              # 调试结束
```

### 3.3 脚本参数

```bash
$$        # 进程的 PID
$0	      # 脚本名
$# 		  # 参数个数
$1,$2,$3  # 第1，2，3个参数
$@        # 整个命令行
$*        # 用 IFS 的第一个字符(一般是空格)分割后，产生的 列表
$?        # 子 shell 的退出值，上一个程序执行后的退出码
```

`shift` 命令将参数左移动，`$1` 的原先的值丢弃，`$2` 的值变为 `$1` 的值，依次类推

```bash
while [ -n "$1" ] ;do
    if [[ "${1}" == "cut" ]]; then
        value="$2";                 # 获取 cut 后面的值
        echo "cut处理$2";
        shift                       # 左移 一次 
    fi
    if [[ "${1}" == "add" ]]; then
        echo "处理add";
    fi
    shift                           # 左移 一次
done
```

### 3.4 子shell

`$()` 产生一个子进程，子进程不会对当前 shell 有任何影响

```bash
count=$(ls | cat -n | wc -l)
echo "共有$count个子文件"

count2=`ls | cat -n | wc -l`        # `` 与 $() 相同
echo "count2 : $count2";
```

### 3.5 退出shell

```bash
exit 0          # 正常退出, 1 ~ 255 都表示错误
echo $?         # 输出上一个程序执行后的退出码
```

## 4. 输入


### 4.1 脚本输入流

```bash
# t.sh
var=$(cat -);	                # 等价于 $(cat /dev/stdin)
echo "from input : ${var}";

$ echo "ok" | t.sh 
from input : ok

# yes 不断输出 y 字符，通过管道变成成了 rm 的输入流，当 rm 从输入流中读取时，会读到 y 
# 所以就不需要手动敲 y 来确认删除
$ yes | rm -i *.txt 
```

### 4.2 输入流转化为参数

部分命令被设计成 只接受`命令行`参数输入，所以我们需要一个能将 `输出文本流` 转换为 `命令行参数` 的工具 `xargs`。

```bash
# t.sh
echo "get $* ok";
```

```bash
$ echo "hello bob" | t.sh
get  ok                 # 取值 失败

$ echo "hello bob" | xargs t.sh
get hello bob ok        # 取值 成功

$ echo "hello bob" | xargs -n1 t.sh
get hello ok
get bob ok              # 取值成功，而且是分割开调用 t.sh 两次
```

`xargs`　采用　`空格` 和 `换行` 作为分割符，将输入流的文本分割成多个参数:

- `-n` 指定每次传几个参数作为参数，默认 1
- `-I {}` 指定 传入参数的 位置
- `-0` 指定分割符为 `\0`，默认为 `\n` `\b` 
- `-d:`指定分割符为`:`

```bash
find . -name "*.txt" | xargs -0 rm -f                   # 将找到的 txt 文件删除
find . -name "*.sh"  | xargs -I {} cp {} ./sh_dir/      # 将找到的 sh 文件 拷贝到 sh_dir 文件夹中
find . -name "*.c"   | xargs -0 wc -l	                # 统计当前目录下 c 代码行数
find . -name "*.php" | xargs cat | grep -v ^$ | wc -l   # 统计当前目录下所有.php文件中代码行数 过滤空白行
```

## 5. 输出

### 5.1 格式化输出

```bash
# 默认是换行， -n 不换行
echo "Hello world ${var}";      # 解析变量
echo 'Hello world ${var} !';    # 不解析变量

# 格式化输出 格式参考 C 语言
printf "%-5s %-10s %-4.2f\n" 1 code 90.33
printf "%-5s %-10s %-4.2fn" 2 kiss 23.112

# -e 开启 彩色打印
echo -e "\e[31m 红色字 \e[0m"  
echo -e "\e[43;34m 黄底蓝字 \e[0m"  
echo -e "\e[4;31m 下划线红字 \e[0m"  
echo -e "\e[5;34m 闪烁 \e[0m"

for STYLE in 1 3 4 5 7 8; do
  for FG in 30 31 32 33 34 35 36 37; do
    for BG in 40 41 42 43 44 45 46 47; do
      echo -en "\e[${STYLE};${FG};${BG}m";
      echo -n " ${STYLE};${FG};${BG} ";
      echo -en "\e[0m";
    done
    echo ;
  done
done
```

### 5.2 重定向输出

```bash
command > output.txt 2> error.log <input.txt # < 输入 > 截断输出 >> 追加输出 1> 正常输出 2> 错误输出
command > output.txt 2>&1 <input.txt         # 2>&1 错误输出重定向到 1，而 1 是正常输出
command &> output.txt < input.txt             # 上句简写版
command 2> /dev/null                          # /dev/null 是文件黑洞，表示丢弃 2> 输出
command | tee -a out.txt | wc -l              # tee 复制一份输出, -a 表示追加写入
```

## 6. 变量

### 普通变量

```bash
var="100";                      # 声明赋值，随取随用，= 两边不能有空格，所有值都是 字符串 类型
time=$(date)                    # 值来自命令返回
read -p "请输入姓名 : " name    # 值来自用户输入，-p 提示语句 -t 限制输入时间，-s 无回显
echo    "当前时间:${time} . "   # 输出 当前时间是:2018年 02月 13日 星期二 15:54:43 CSTend
echo    "${#name}"              # 获取变量的字符长度
unset   time                    # 删除该变量
set                             # 输出当前 shell 所有变量
```

```bash
if [[ "${var}" = "yes" ]] # 最佳实践，可以防止变量为空时，程序发生莫名其妙的错误
```

### 环境变量

变量只能在当前 shell 使用，而环境变量可以传递到 子shell。

```bash
export var                       # 将变量声明为环境变量
printenv;                        # 打印当前 shell 所有环境变量

# 系统环境变量： 家目录，UID，用户名，命令提示符1，2，PATH,当前SHELL
echo "系统环境变量 : ${HOME},${UID},${USER},${PS1},${PS2},${PATH}"

export PATH="/home/cky/bin:${PATH}"     # 在PATH中添加一条新路径

# 检测是否 root 用户
if [ $UID -ne 0 ]; then
    echo "Root";
fi
```

### 字符串分割符

`IFS` 是系统环境变量，表示分割字符，通常是空格、制表符 和 换行符

```bash
data="name,sex,rollno,location"
IFS_OLD=${IFS}
IFS=","                       # 将IFS 设置为 ,
for item in ${data}; do
    echo "item : ${item}"
done
IFS=${IFS_OLD}                # 恢复原值
```

## 7. 简单计算

记住两种就够了,之所以说是简单计算，是因为如果需要复杂计算的话，那就不要用SHELL啊。

```bash
foo=4
bar=5

let foo++;  # 自加
let bar--;  # 自减
let foo+=6;

res=$[ ${foo} * (${bar} + ${foo}) ]     # 复杂点的用 $[] , 注意[]中空格不能省
echo ${res};
```

## 8. 条件分支

```bash
if [[ condition ]]; then        # [[]] 两边的空格是必要的
    command1;
elif [[ cond2 ]]; then
    command2;
else
    command3;
fi
```

### 8.1 判断命令执行成功

```bash
# command 的退出值 $? = 0 则为真
if command; then
    echo "命令执行成功";
fi
```

### 8.2 判断数字

```bash
a=10
b=10
if [[ ${a} -eq ${b} ]]; then  # 判断数字大小 只限于整数 , -gt 大于，-lt 小于
   echo "a 等于 b"
fi
```

### 8.3 判断字符串

```bash
export LANG=zh_CN.UTF-8       # 设置字符集
export LC_ALL=zh_CN.UTF-8     # 统一值
if [[ "${USER}" == "cky" ]]   # 判断字符串相等，支持 != , < , > 大小根据字典序来判断
if [[ -n "${var}" ]]          # 非空字符串
if [[ -z "${PS1}" ]]          # 是空字符串
```

### 8.4 判断文件

```bash
if [[ -d file ]]              # -d 目录存在, -f 文件存在, -e 文件存在
if [[ -w file ]]              # -r -w -x 判断文件是否 可读 可写 可执行
if [[ -O file ]]              # 判断执行者是否是文件的属主
if [[ -L "${var}" ]]          # 是符号链接
if [[ file1 -nt file2 ]]      # file1 是否比 file2 更新, 镜像: file1 -ot file2
```

### 8.5 组合条件

```bash
if [[ -d $HOME ]] && [[ -w "$HOME" ]]; then     # && 与 || 组合条件
    echo "$HOME 存在并且可读";
fi
```

## 9. 循环语句

### 9.1 遍历字符串

循环中字符串的解析，借助的是`$IFS`，而我们可以通过暂时修改`IFS`的值来改变我们的解析规则

```bash
for var in list; do                     # 格式
    commands
done

list="abc bcd cdf"                      # 普通字符串
for var in ${list} ; do
    echo "var : $var"
done

IFS=$`\n`                               # 按行分割 命令获取到的字符串
for var in $(cat /etc/passwd); do
    echo "$var";
done
```

### 9.2 遍历文件

```bash
for script in /etc/*.d /etc/*.conf; do  # 接多个目录通配符，获取文件列表
    echo $script
done
```

### 9.3 条件循环

```bash
while [[ condition; ]]; do
    commands;
    break;                  # 可选
    continue;               # 可选
done
```

## 10. 函数

函数、内置命令、外部命令同名时，函数的执行优先级最高，所以是执行函数。执行函数或则外部命令都会 `fork` 子进程。 

```bash
:(){:|:&}:  # 是有名的 fork 炸弹,  : 是函数名，递归在后台调用自身，不断的 fork 子进程，直到拖垮系统
```

```bash
printit()  # 定义函数
{
    echo "$1,$2";       # 打印第一个参数, 第二个参数
    echo "$@";          # 以列表的形式打印出所有的参数
    echo "$*";          # 所有的参数作为单个实体
    local a="local a"   # 声明局部变量, 只在函数内有效
    echo "局部变量a是$a"
    return 0;           # 返回值 0 为成功， 非 0 为错误
}

# 调用函数
printit arg1 arg2

# 在调用函数后，马上使用 $? 获取函数 return 的值, 0 表示成功
if [[ $? -eq 0 ]]; then
    echo "printit 执行成功";
fi

export -f printit;     # 导出函数为全局函数， 这样在子进程中，也能使用该函数了
```

## 11. 常用命令参考

### 11.1 特殊文件

`/dev/tty`  表示当前终端
`/dev/null` 数据黑洞，丢弃全部输入，读取则返回EOF
`/dev/zero` 零文件，读取则返回`0`

```bash
printf "Enter New Password:"
stty -echo                  # 关闭回显
read pass < /dev/tty        # 从终端读入数据到 pass
printf "Enter Again:"
read pass2 < /dev/tty       # 从终端读入数据到 pass2
stty echo                   # 恢复回显

cat file 2> /dev/null         # 将stderr重定向到 /dev/null ，这样就不会输出到控制台了
cat /dev/null > /var/log/file # 将file清空，而又不删除它

dd if=/dev/zero of=/dev/sdb bs=4M # 把/dev/sdb 清零
```

### 11.2 文件与目录命令

所谓 “文件与目录命令”，就是不关心文件里的内容，操作对象就是文件目录。


#### 创建文件

```bash
$ dd if=/dev/zero of=file.txt bs=1M count=1 # 生成固定大小填充的文件
tempname=$(mktemp)                          # 创建一个临时文件在 /tmp 里，重启后自动删除
tempdir=$(mktemp -d)                        # 创建一个临时目录
umask                             	        # 查看当前值
umask 022                         	        # 设置值
touch  test.c                     	        # 创建新文件  默认权限 666 - umask 值 比如 666 - 022 = 644
mkdir -p    /var/www/advanced     	        # 递归创建目录    默认权限 777 - umask 值
cp  test.c   /root/target.c                 # 复制文件
cp  -r /var/www/abc /var/www/target         # 复制目录 -a 是复制文件与原文件一模一样
ln source.txt  /var/target.txt              # 创建硬链接
ln -s source.txt  /var/target.txt           # 创建软连接
```

#### 改删文件

```bash
chmod  [-R] 777             path    # 改变文件/目录权限 -R是递归
chown  [-R] caokaiyan       path    # 改变文件所有者
chown  [-R] caokaiyan:admin path    # 同时改变文件所有者和用户组
chgrp  [-R] admin           path    # 改变用户组
pwd                               	# 显示当前目录
rm    -rf    /mydir               	# 强制删除/mydir目录和里面的文件
mv  test.c  /root/target.c         	# 移动文件  (移动和复制都是有改名的效果的)
mv  /var/www/abc/  /root/def/     	# 移动目录
```

#### 切割文件

```bash
split -b 2k data.file                     # 给它切成 2k 一个的大小
split -b 3k data.file -d -a 4 splite_file # 指定前缀是splite_file, 编码是 4位整数，如 splite_file0000
split -l 1000 data.file                   # 切成 1000 行的块
```

#### 查找文件

```bash
find 目录 选项                                   

find /etc                                # 列出 /etc 下所有路径
find /etc -iname "*.log"                 # 通配符     过滤出符合条件的路径
find /etc -iregex ".*\(\.py | \.sh\)$"   # 正则表达式 过滤出符合条件的路径
find /etc -maxdepth 1 -name 'f*'         # 遍历深度，到当前子目录，不再往下遍历
find /etc -mtime -10                     # 10天内修改；   +10 十天前修改
find /etc -min -30                       # 30分钟内修改； +30 30分钟前修改
find /etc -user cky                      # 指定用户
find /etc -type f                        # 指定 路径为 普通文件类型，d 目录类型
find /etc -size +20M -a -size -50M       # -a : and , 20M ~ 50M 之间的文件
find /etc -size -20k -o -size +50k       # -o : or  , 小于 20k 或 大于 50k
find /etc -perm 644                      # 指定权限644
find . \( -name '.git' -prune \) -o -type f  # 跳过 .git 目录, 过滤出普通文件

# 对找到的每一条路径 都 执行操作，{} 指代路径名
find . -name "*.swp" -exec rm {} \;          # 将找到的文件全部删除
find . -user root    -exec chown cky {} \;   # 将匹配的文件，修改它们用户名为 cky
find . -name '*.sh'  -exec cp {} copy.sh \;  # 将查询到的所有文件都拷贝到 copy.sh 中
```

#### 压缩/解压

```bash
bzip2 -k cky                # 压缩cky文件为.bz2文件，-k 保留源文件
bunzip2 cky.bz2             # 解压文件
gzip cky                    # 压缩cky文件为.gz文件
gzip -d cky.gz              # 解压文件
zip -r src.zip ./src        # 递归压缩 src/ 目录下的文件 为 src.zip
unzip src.zip               # 解压
tar -zcvf cky.tar.gz ./cky  # 归档压缩
tar -zxvf cky.tar.gz        # 解压到当前目录
```

### 11.3 其他命令

#### 网络通信命令

```bash
ping blog.codekissyoung.com     # 坚持网络连通性
ping 127.0.0.1                  # 检测自己机器安装了 Tcp/Ip 协议
ifconfig -a                     # 查看网卡信息
traceroute www.baidu.com        # 追踪本机到目标的路由
netstat [-anp | -nat]           # 查看本机端口监听情况
route -n                        # 显示本机路由表
dig www.codekissyoung.com       # 获取域名的 DNS 信息
dig -x 101.200.144.41           # 逆向查询 host 信息
wget -c                         # 下载 file 断点续传
```

#### 挂载

```bash
$ mount [-t] [-o] 设备文件名 挂载点
$ mount                                          # 查看系统的挂载情况
$ cat /etc/fstab                                 # 查看开机自动挂载的项
$ mount -t vfat /dev/sdb1  /media/disk           # 以vfat 格式 挂载u盘/dev/sdb1 到 /media/disk
$ mount -t iso9660 -o loop  LIVE-DVD_32.iso mnt  # 将一个iso文件挂载到 mnt 路径下面
$ umount [directory | device]                    # 卸载已经挂载的设备
$ lsof [directory | device]                      # 卸载之前看看有没有文件被进程占用，有的话要先关闭该进程
```

#### 磁盘

```bash
fdisk -l [/dev/had]         # 硬盘分区情况
df -h                       # 查看磁盘使用情况
du -sh                      # 当前目录大小
du -sh *                    # 当前目录下 所有子目录 大小
```

**系统平均负载**：在特定时间间隔内 运行队列 中的平均进程数。

```bash
$ uptime
 16:13:14 up 2 days,  6:06,  3 users,  load average: 0.29, 0.24, 0.30
$ cat /proc/loadavg
0.25 0.23 0.30(最近15分钟负载) 1/1152(当前运行进程数/总进程数) 5748(最后进程ID)
```

**进程状态列表**

```bash
ps -axuf                # 显示了系统所有进程
ps -axjf                # 显示了 进程/子进程 之间关系
ps -axl                 # 长模式 ，显示了 PPID 谦让值 NI 进程正在等待的资源
pgrep ssh               # 查出带有某字符串的进程的进程号 -l 显示进程命令
```

**查看系统信息**

```bash
lsof /sbin/init         # 查看 某个文件(系统文件)被哪个进程调用
lsof -c httpd           # 查看 httpd 进程调用了哪些文件(系统文件)
lsof -u root            # 查看该用户的进程调用的文件(系统文件)
ipcs                    # 查看进程的共享内存 消息队列 信号量
dmesg                   # 内核启动自检信息
cat /proc/meminfo       # 观察内存状态
cat /proc/cpuinfo       # 查看cpu详细信息
free -h                 # 查看内存
vmstat 1 3              # 每隔一秒刷新一次输出 总共刷新3次
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b 交换 空闲    缓冲   缓存       si   so   bi    bo   in   cs   us sy id wa st
 1  0 0    3918024 125876 2305964    0    0    22    17   70   303  3  1  96  1  0

- in : 每秒被中断的进程次数
- cs : 每秒钟进行的事件切换次数,值越大，代表系统与接口设备的通信越繁忙
- us : 非内核进程消耗cpu运算时间的百分比
- sy : 内核进程消耗cpu运算时间的百分比
- id : 空闲cpu的百分比
- wa : 等待 I/O 所消耗的cpu百分比
- st ：被虚拟机所盗用的cpu占比
```

#### 杂

``` bash
date +%s                            		# 返回时间戳
date +%Y_%m_%d_%H_%M_%S             		# 返回 年_月_日_时_分_秒
```

### 11.4 经典代码参考

#### 11.4.1 重复一个命令直到成功

```bash
repeat()
{
    while true ; do
      $@ && return;
      sleep 5; # 如果失败了,那么就再延迟5秒，再循环执行命令
    done
}
repeat wget -c http://www.xunlei.com/software-aa.tar.gz
```

#### 11.4.2 批量重命名和移动

```bash
count=1;
for img in `find . -iname "*.png" -o -iname '*.jpg'`; do
  ext=${img##*.}
  new_name="image_"$count.$ext
  mv $img $new_name
  let count++
done
```





















