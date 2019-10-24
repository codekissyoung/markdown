# 高效用vim

## .vimrc 配置

- `/etc/vim/.vimrc` 会对所有用户生效
- `~/.vimrc` 只对该用户生效

```.vimrc
set nu            " 设置行号
set hlsearch      " 高亮查找项
set incsearch     " 查找跟随
set ignorecase    " 查找时忽略大小写
set fdm=marker    " 设定标记折叠
set autoindent    " 设置自动缩进
set tabstop=4     " 设置tab为4个空格
set list          " 显示空格和tab
set listchars=tab:>-,trail:- " 显示空格和tab的格式
if has("syntax")
  syntax on "语法高亮
endif
set tabpagemax=15 " 设置最大打开的标签页数

" 定义快捷键
noremap <F6> :set nu
noremap <F7> :set ai
noremap <F8> :set syntax on
```

## 移动光标

```vim
^  : 到行首去
$  : 到行尾去
gg : 到文首
Shift + g : 到文尾
ngg  移动到这个文件的第 n 行
hjkl 移动光标
ctrl + u  PageUp 上一页翻页
ctrl + d  PageDown 下一页翻页
```

## 插入

- `i` 输入，`o`新开一行输入

## 剪切 拷贝 粘贴 - 可视模式

```vim
v  字符选择　将光标经过的地方反白显示
V  行选择　会将光标经过的行反白选择
ctrl + v 块选择　可以用竖直的长方形的方式选择数据
y  复制反白的地方
d  剪切反白的地方
p  粘贴复制的内容
```

## 剪切 拷贝 粘贴 - 命令模式

```vim
x 删除当前光标的字符
ndd  光标处向下剪切 n 行
nyy  光标处向下复制 n 行
:100,200y  拷贝100到200行
:100,200d  剪切100到200行
p  粘贴拷贝或者剪切的行
. 重复前一个命令的动作
```

## 添加 | 删除 注释 - 可视模式

```vim
Ctrl + v　 进入VISUAL BLOCK 模式
Shift + i　 进入行首插入模式
输入注释符号　 开始注释
按两次esc　 完成注释

ctrl + v　 进入VISUAL BLOCK模式，选择要取消注释的部分。
d　 取消注释
```

## 回退操作

```vim
u  撤销上一个操作
Ctrl + r 对 u 操作的撤回
```

## 操作多个文件 标签页

```vim
:tabe file 在标签页打开文件
:tabn 移动到下一个标签页
:tabp 移动到上一个标签页
:w 保存文件
:wa 保存vim打开的所有文件
:wq 保存文件 并退出标签页
:wqa 保存vim打开的所有文件 并退出vim
```

## 分屏操作同一文件

```vim
:sp  上下分屏
:vsp 左右分屏
ctrl + ww : 在多屏中依次跳转
ctrl + w + 方向键 : 在多屏中依次跳转
```

## 代码折叠 - marker模式

```vim
zf%   将光标放置在()，{}，[]，<>上，创建从当前行起到对应的匹配的()，{}，[]，<>等的折叠
zc    折叠当前所在标记
zm    关闭所有折叠
zR    打开所有
zd    将光标置于折叠标记处,删除在光标处对应的的当前折叠
zD    将光标置于折叠标记处,嵌套删除在光标下的折叠
```

## 查找文本

```vim
/word + enter           在光标处向下查找word
？word + enter          在光标处向上查找word
n                       跳转到下一处匹配到的地方
```

## 以16进制查看文本

```vim
:%!xxd                 将当前文本转换为16进制格式。
:%!xxd -c 12           将当前文本转换为16进制格式,并每行显示12个字节。
:%!xxd -r              将当前文件转换回文本格式。
```

## 文本替换操作

- 格式 `:[选定范围]s分割符[正则表达式]分割符[替换文本]分割符[g]`
- [选定范围] `2,5` 表示2到5行, `.,10` 表示当前行到第10行, `^,10` 表示开头到第10行, `10,$` 表示第10行到末尾, `%` 表示每一行
- [分割符] 可以为 `/` `+` `#`
- [g] 不带`g`表示只匹配第一个
- 常用格式　`:%s/正则表达式/替换成的内容/g`

```vim
:s/vivian/sky/  替换当前行第一个vivian为sky
:s/vivian/sky/g 替换当前行所有vivian为sky
:%s/vivian/sky/ 替换每一行的第一个 vivian 为 sky
:%s/vivian/sky/g 替换每一行中所有 vivian 为 sky
:2,$s/vivian/sky/g 替换第 2 行开始到最后一行中每一行所有 vivian 为 sky
:.,$s/vivian/sky/g 替换当前行开始到最后一行中每一行所有 vivian 为 skyn 为数字
:s#vivian/#sky/#  替换当前行第一个 vivian/ 为 sky/ ,可以使用#作为分隔符，此时中间出现的　/ 不会作为分隔
:%s+/oradata/apras/+/user01/apras1/+  替换 /oradata/apras/成/user01/apras1/,使用+作为分割符

:%s/^\t\+$/\r/g  将[tab]开头的行换成空行
:%s/^\s\+$/\r/g  将只有空白的行换成空行
:%s/^/your_word/ 在所有行的行首添加字符
:%s/$/your_word/ 在所有行的行尾添加字符
:%s/\s\+$//      将行末的空白字符删除
```

## 匹配删除多行

```vim
:g/^\s*$/d` 删除包括空白，Tab，空白和Tab交错的所有空行
```

## 删除文本文件中的^M

- 对于换行,window下用回车换行`(0A0D)`来表示，Linux下是回车`(0A)`来表示。这样，将window上的文件拷到Unix上用时，总会有个`^M`.
- 使用命令：`cat filename1 | tr -d "^V^M" > newfile`
- 使用命令：`sed -e "s/^V^M//" filename > outputfilename`
- `^V`和`^M` 指的是`Ctrl+V`和`Ctrl+M`。你必须要手工进行输入，而不是粘贴。
- vi中处理：首先使用vi打开文件，然后按ESC键，接着输入命令`%s/^V^M//`和`:%s/^M$//g`

- 如果上述方法无用，则正确的解决办法是：

```vim
tr -d "\r" < src >dest
tr -d "\015" dest
strings A>B
```

## 可以借鉴和参考的文章

- [图解VIM常用操作](http://blog.csdn.net/marksinoberg/article/details/77595574)

## 查看vim版本

- `:version` 命令

```vim
:version
```

## 使用 vundle 安装插件

- [Vundle](https://github.com/VundleVim/Vundle.vim) 插件管理工具
- [nerdtree](https://github.com/scrooloose/nerdtree) 目录树工具

```vim
:NERDTree
```

- [vim-man](https://github.com/vim-utils/vim-man) 在vim里查看man文档的工具

```vim
:Man 命令
```
