# awk 教程

- `awk -F regexp '/pattern/{ action }' files`
- `awk -F regexp '(expression){ action }' files`
- `awk -F regexp -f awk脚本 files`

- `-F`          设置字段分割符(默认`空格tab换行`),它接受一个正则表达式`re`作为值
- `pattern`     行匹配模式，省略的话就是匹配所有行
- `{ action }`  输出模式，省略的话就是输出整行

```awk
# awk 脚本
BEGING{ ... }
pattern1 { action1 }
pattern2 { action2 }
END{ ... }
```

## 工作流程

1. 先执行BEGING，一般是设置分隔符、定义变量 以及 输出信息行等
1. 然后读取文件，读入 `RS`(默认 `\n` ) 分割的一条记录
1. 然后将记录按 `FS` (默认`[ \t]+`)划分域，`$0`表示整行 `$1` 表示第一个域 `$n` 表示第n个域, 行数为 `NR`
1. 程序对每一行用 `pattern` 进行匹配,若匹配上则运行 `{action}`
1. 最后执行`END`操作 一般是进行后期处理,输出综合结果等

## 匹配条件格式

- 表达式 `(expression)`  在表达式为真时执行 `{action}`
- 正则表达式 `/pattern/`  正则表达式匹配上时执行 `{action}`
- 复合模式 `( expression && expression )` 用 `&& || !` 组合模式, 为真 时执行 `{action}`
- 范围模式 `( pattern1,pattern2 )` 从 pattern1 匹配上的行,直到pattern2 匹配上的行,包括这两行。如果 pattern2 一直没有匹配上,则到文件的末尾。

### 常量

- 数字常量 : `100`
- 字符串常量 : `"我们"`

# 变量

## 用户定义变量
- 不需要声明,也不需要初始化,直接使用
- 每一个变量同时有一个字符值 和数值,AWK 根据上下文环境决定作为数值或字符串处理
- 自动将变量初始化为空值,如果用作数字将作为 0
- 强制使用字符串 : `number ""`
- 强制使用数值 : `string + 0`
- `$`表示字段，用户变量的使用不需要加`$`

## 系统变量
```bash
ARGC               命令行参数个数
ARGV               命令行参数排列
ENVIRON            使用 ENVIRON["name"] 来获取 shell 环境变量的值
FILENAME           awk浏览的文件名
FNR                浏览文件的记录数
FS                 设置输入域分隔符，等价于命令行 -F 选项   默认值 "[\t]+"
NR                 已读的记录数 只有到 END 时,NR 才等于总记录数
OFS                输出域分隔符   默认值 空格 " "
ORS                输出记录分隔符 默认值 "\n"
RS                 记录分隔符 默认 "\n"
NF                 域的个数
```

## 字段变量
```bash
$0                 指整条记录
$1                 当前行的第一个域
$2                 当前行的第二个域...以此类推
```


# 数组
- awk 的数组的键都是字符串型的，是关联数组,因此在显示数组内容时会发现，它们并不是按照你预料的顺序显示出来的

```bash
// 遍历
for( i in array)
{

}

// 判断是否在数组内
if( var in array )
```


# 流程控制
```awk
{ statement }
if (expression) statement
if (expression ) statement1 else statment2
while (expression ) statement
for(expression1; expression2;expression3) statement
do statement while (expression)
for (variable in array) statement (这是 AWK 特别的对于数组中每个变量循环)
break (退出 while for do 循环)
continue (进入到下一 while for do 循环)
next (AWK 特别的指令,开始进入下一主输入循环,处理下一行记录,非常有用) exit
exit expression(马上进入END流程;如果在END流程内,结束程序,以expression值 为返回值)
```

# 用户自定义函数
- AWK 自定义函数的变量是带值传递,数组是以引用方式传递。另一特别的地方是 没在参数列表的变量是全局的, 因此定义函数私有变量的方式是将其加入到变量列表中

```awk
function name(parameter-list)
{
    statement
}

function aton(char_ip, int_ip, arr){
    split(char_ip, arr, ".")
    int_ip = (((arr[1] * 256 + arr[2]) * 256) + arr[3]) * 256 + arr[4]
    return int_ip
}
```

# 输出函数
```awk
print  在标准输出输出 $0
print expression1,expression2
printf(format,expression1, expression2,)
```

# 函数
```awk
systime()
mktime(datespec) 将“YYYY MM DD HH MM SS [DST]”格式的 string 转化为时 间戳
strftime(format [,timestamp]) 转 化 timestamp 为 字 符 串 默 认 format 是 “%a %b %d %H:%M:%S %Z %Y”
index(s,t) 返回 t 在 s 中的第一个位置,如果没找到返回 0 返回 s 的字符个数
length(s) 返回 s 中从 p 开始的所有字符串 返回s中从p开始的n个字符
substr(s,p) 比如 substr(“abcd”,1, 3)将得到“abc” 替换$0 中所有的正则表达式 r 为字符串 s,返回替换数 替换字符串 t 中所有的正则表达式 r 为字符串 s 替换$0 中左边最长的匹配 r 的子串
substr(s,p,n) 替换 t 中左边最长的匹配 r 的子串
gsub(r,s)
gsub(r,s,t) sub(r,s) sub(r,s,t) split(s,a) split(s,a,fs)
用 FS 切割字符串 s 为数组 a,返回字段数
用 fs 切割字符串 s 为数组 a,返回字段数
如使用 split(“7/4/76”, arr, “/”)后, arr[“1”]为 7, arr[“2”]为 4, arr[“3”]为 76
```


# 关系运算符

```bash
== 相等
!= 不等
<  小于
<= 小于等于
>  大于
>= 大于等于
1为真，0 为假
字符串较短的会定义为小于较长的那个,"A"< "AA" 的值为真
```

- 例子

```awk
// 字符串转数字：变量通过 + 连接运算，自动强制将字符串转为整型，非数字变成0
➜  ~ awk 'BEGIN{a=1;b=2;c=a+b;print c}'
3

// 如果只是显示/etc/passwd的账户
cat /etc/passwd |awk  -F:  '{print $1}'

// 对匹配到了 root 的行执行 action
➜  ~ awk -F: '/root/' /etc/passwd
root:x:0:0:root:/root:/bin/bash

// 对匹配到了 root 的行执行 action
➜  ~ awk -F: '/root/{print $7}' /etc/passwd
/bin/bash

// 显示/etc/passwd的账户
awk -F: 'BEGIN {count=0;} {name[count] = $1;count++;}; END{for (i = 0; i < NR; i++) print i, name[i]}' /etc/passwd

// 删除用户zdd的所有文件，注意-rf后面有一个空格
ls -l | awk '/zdd/{print "rm -rf " $9}' | sh
```

- BEGIN可以用来打印表头或者列名等，如下
```bash
BEGIN{
    -F":"
    printf "----------------------------------------------------------------\n"
    printf "%-20s%-16s  Jan  |  Feb  |  Mar  |Total Donated\n ","NAME","PHONE"
    printf "----------------------------------------------------------------\n"
}
```

- awk 脚本例子
```bash
BEGIN{user_id="0";amount=0;register_day="unkown";login_days=0;last_login_day="unkown"}
{
    if($1""!=user_id){
        if(user_id!=0){
            print user_id,register_day,last_login_day,login_days,amount;
        }
        user_id = $1"";
        register_day = $2;
        amount = $3;
        login_days = 1;
    }else{
        last_login_day = $2;
        amount = amount + $3;
        login_days++;
    }
}
END{print $1,register_day,last_login_day,login_days,amount;}
```

# 参考
- http://www.cnblogs.com/softwaretesting/archive/2012/02/02/2335332.html
- http://blog.csdn.net/wzhwho/article/details/5513791
- http://blog.sina.com.cn/s/blog_7b9ace5301014q8o.html

# 能力
- 处理格式化文本 和 数据 : 改变数据的格式 验证合法性 寻求某些属性的项 数字求和 输出数据报表

# 特点
- 内置字段: sed 只有行 而没有内置的字段模型
- 自动读取文件 和 分割字段

