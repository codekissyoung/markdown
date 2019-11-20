## 执行一个脚本

- 内核约定: 一个文件以`#!`开头时，内核会扫描其后文本，看是否存在可用来执行脚本的解释器的完整路径，此外还会扫描其后文本是否有参数传递给解释器，例如`#!/bin/csh -f`,`#!/bin/awk -f`

## Shell识别的三种命令


## /dev/null 与 /dev/tty

- `/dev/null`输出到此文件的数据都会被系统丢弃掉，数据黑洞，从`/dev/null`读数据会立即返回文件结束符
- `/dev/tty`是当前会话终端或者是通过网络登录的伪终端，在程序需要读取人工输入时有用

```bash
printf "Enter New Password:"
stty -echo                  # 关闭回显
read pass < /dev/tty        # 从终端读入数据到 pass
printf "Enter Again:"
read pass2 < /dev/tty       # 从终端读入数据到 pass2
stty echo                   # 恢复回显
```

## shell的字符集 排序规则

shell脚本里的排序规则,正则表达式里的 `[字符...]` 的字符范围都跟Unix系统的字符集和排序规则有关

```bash
export LANG=zh_CN.UTF-8   # 默认值
export LC_ALL=zh_CN.UTF-8 # 统一值
local                     # 查看当前字符集和排序规则
local -ck LC_TIME         # 查看当前时间格式
```