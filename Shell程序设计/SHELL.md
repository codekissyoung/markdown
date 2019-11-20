# SHELL

我掌握的SHELL相关知识和技巧。

## 我用SHELL做什么

`SHELL`的操作对象和粒度是文件：执行程序，查找文件，删除文件，批量改变文件名，备份文件、列出目录的文件。

`SHELL`中的调用命令分类：

- **内建命令** : 不会产生子进程，为了效率才内建，比如`cd` `read` `echo`
- **函数** : 函数可以直接作为命令一样使用
- **外部命令** : 在`PATH`里搜寻并且执行的命令，产生子进程

`SHELL`脚本的执行被设计为阻塞式的，从上到下，依次执行，遇见创建子进程的外部命令，一定会等待子进程返回后，才继续往下执行。所有命令返回 0 表示执行成功。

## SHELL实现原理

```c
while( true )
{
    input = read(用户输入);

    commad = syntax(input); // 通配符、别名、算术和变量展开

    $? = exec(command);  // 依据命令种类不同，执行内部命令函数、外部程序或文件系统调用

}
```

## 执行环境

```bash
$ /etc/profile (必读) --> /etc/profile.d/*.sh (可选)
$ ~/.bash_profile (必读) --> ~/.bash_login, or ~/.profile --> ~/.bashrc -->  /etc/bashrc (可选)
$ ~/.bash_logout (退出必读)
```

```bash
if [ -z "$PS1" ]; then
    echo "脚本里";
else
    echo "交互式环境里";
fi
```

执行脚本启动 SHELL 子进程中没有`alias`、没有环境变量`PS1`、不读入初始化文件（`profile`等）、没有作业控制（当然的事）... 所有的操作不会影响到父进程。

而以命令 `.` 或 `source` 执行脚本，则是在当前Shell进程中执行，所以会对当前环境产生影响。

当远程`SSH`登录执行长时间运行的命令时，如果网络中断，则终端会收到`HUP`中断信号，从而关闭所有的子进程。所以为了长时间运行程序不受干扰，我们需要：

- 让脚本忽略 `HUP` 信号
- 让脚本运行在新的会话，脱离此终端，从而不收到终端`HUP`信号
- `()`可让命令在子 shell 中运行

```c
$ nohup ping www.baidu.com &> ping.log &        # nohup 命令
$ setsid ping www.baidu.com &> setsid_ping.log  # setsid 命令
$ (ping www.baidu.com &> abc.log &)             # 孙子进程法，最后命令成了 孤儿进程
```

三者选其一。

#### 调试

```bash
set -x              # 调试开始, 显示每条实际执行的命令和参数
# 调试代码 ...
set +x              # 调试结束
```

## 输出

### 格式化输出

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

### 重定向输出

```bash
command > output.txt 2> error.log < input.txt # < 输入 > 截断输出 >> 追加输出 1> 正常输出 2> 错误输出
command > output.txt 2>&1 < input.txt         # 2>&1 错误输出重定向到 1，而 1 是正常输出
command &> output.txt < input.txt             # 上句简写版
command &> output.txt < input.txt &           # 最后的 & 让命令在后台执行
command 2> /dev/null                          # /dev/null 是文件黑洞，表示丢弃 2> 输出
command | tee -a out.txt | wc -l              # tee 复制一份输出, -a 表示追加写入
```

### 输入

`shift` 命令将参数左移动，`$1` 的原先的值丢弃，`$2` 的值变为 `$1` 的值，依次类推

```bash
while [ -n "$1" ]; do
    commands;
    shift
done

# 依次处理每个带值的参数
while [ -n "$1" ] ;do
    if [[ "${1}" == "cut" ]]; then
        value="$2"; # 获取cut后面的值
        echo "cut处理$2";
        shift       # 左移 一次 
    fi
    if [[ "${1}" == "add" ]]; then
        echo "处理add";
    fi
    shift # 左移 一次
done
```

## 变量

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

PS： 所有的变量都建议使用`"${var}"`, 双引号 + `${}` 包裹使用，可以防止变量为空时，程序发生莫名其妙的错误，比如 ` if [ ${var} = "yes" ]`。

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

### 特殊变量

```bash
${0}                # 脚本名
${1},${2},${3}      # 第1个参数，第2个参数，第3个参数
$*                  # 所有参数，各个参数用 IFS 的第一个字符(一般是空格)分割开
$@                  # 所有参数作为一个字符串，不分隔开
$#                  # 参数个数
$$                  # 当前脚本的 进程号

name=${basename $0} # 从路径里面获取脚本名称

file="example.jpg"
name=${file%%.*}    # 获取文件名
ext=${file##*.}     # 获取后缀名
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

## 简单计算

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

## 子shell

`$()` 产生一个子进程，子进程不会对当前 shell 有任何影响

```bash
count=$(ls | cat -n | wc -l)
echo "共有$count个子文件"

count2=`ls | cat -n | wc -l`        # `` 与 $() 相同
echo "count2 : $count2";
```

## 条件分支

#### 判断命令执行成功

```bash
# 测试命令是否执行成功，根据 $? 的值来判断,$? = 0 则为真
if command; then
    echo "命令执行成功";
fi

if grep codekissyoung /etc/passwd; then
    echo "用户codekissyoung存在";
fi
```

#### 判断数字、字符串、文件

```bash
if [[ condition ]]; then        # [[]] 两边的空格是必要的
    command1;
elif [[ cond2 ]]; then
    command2;
else
    command3;
fi

a=10
b=10
if [[ ${a} -eq ${b} ]]; then  # 判断数字大小 只限于整数 , -gt 大于，-lt 小于
   echo "a 等于 b"
fi

export LANG=zh_CN.UTF-8       # 设置字符集
export LC_ALL=zh_CN.UTF-8     # 统一值

if [[ "${USER}" == "cky" ]]   # 判断字符串相等，支持 != , < , > 大小根据字典序来判断
if [[ -n "${var}" ]]          # 非空字符串
if [[ -z "${PS1}" ]]          # 是空字符串
if [[ -d file ]]              # -d 目录存在, -f 文件存在, -e 文件存在
if [[ -w file ]]              # -r -w -x 判断文件是否 可读 可写 可执行
if [[ -O file ]]              # 判断执行者是否是文件的属主
if [[ -L "${var}" ]]          # 是符号链接
if [[ file1 -nt file2 ]]      # file1 是否比 file2 更新, 镜像: file1 -ot file2

if [[ -d $HOME ]] && [[ -w "$HOME" ]]; then     # && 与 || 组合条件
    echo "$HOME 存在并且可读";
fi
```

## 循环

### 字符串循环

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

for script in /etc/*.d /etc/*.conf; do  # 接多个目录通配符，获取文件列表
    echo $script
done

for i in {a..z}; do                     # 生成序列 {1..10}
    echo ${i}; # 输出 a b c d e f g h i j k l m n o p q r s t u v w x y z
done;
```

### 条件循环

```bash
while [[ condition; ]]; do
    commands;
    break;                  # 可选
    continue;               # 可选
done
```

### 循环重定向

```bash
for var in $lists; do
    commands;
done > output.txt       # 输出的内容重定向到文件，

for var in $lists;do
    commands;
done | sort -nr         # 或者通过管道传递给其他命令
```

## 函数

在函数、内置命令、外部命令同名时，函数的执行优先级最高，所以是执行函数。执行函数或则外部命令都会 `fork` 子进程。 `:(){:|:&}:` 是有名的 `fork` 炸弹, `:` 是函数名，递归在后台调用自身，不断的 fork 子进程，直到拖垮系统。

```bash
function printit()  # 定义函数，其实不用 function 声明也可以
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

## 特殊文件

`/dev/tty` 表示当前终端
`/dev/null` 数据黑洞，丢弃全部输入，读取则返回EOF
`/dev/zero` 零文件，读取则返回`0`

```bash
printf "Enter New Password:"
stty -echo                  # 关闭回显
read pass < /dev/tty        # 从终端读入数据到 pass
printf "Enter Again:"
read pass2 < /dev/tty       # 从终端读入数据到 pass2
stty echo                   # 恢复回显
```


## 退出SHELL

```bash
exit 0          # 正常退出, 1 ~ 255 都表示错误
echo $?         # 输出上一个程序执行后的退出码
```
