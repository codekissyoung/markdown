# Git

- [阮一峰的网络日志 / 常用 Git 命令清单](http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)
- [阮一峰的网络日志 / Git 使用规范流程](http://www.ruanyifeng.com/blog/2015/08/git-use-process.html)
- [阮一峰的网络日志 / Git 远程操作详解](http://www.ruanyifeng.com/blog/2014/06/git_remote.html)
- [阮一峰的网络日志 / Git 工作流程](http://www.ruanyifeng.com/blog/2015/12/git-workflow.html)

![阮一峰的网络日志 / git示意图](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015120901.png)

- **Workspace**：工作区
- **Index / Stage**：暂存区域是一个文件，保存了下次将提交的文件列表信息，一般在 Git 仓库目录中。 有时候也被称作　索引　，不过一般说法还是叫暂存区域。
- **Repository**：仓库区（或本地仓库）
- **Remote**：远程仓库,可能会有好多个,有些可以写,有些你只能读。对于远程库的工作包括:推送或拉取数据,分享各自的工作进展,包括添加远程库,移除废弃的远程库,管理各式远程库分支,定义是否跟踪这些分支

## git 配置

- `git config --global user.name "John Doe"`　写的文件：`~/.gitconfig` 或 `~/.config/git/config`
- `git config user.name "codekissyoung"` 写的文件`项目目录/.git/config`
- `git config --global core.editor vim` 设置默认编辑器
- `git config --list` 列出当前库所有配置选项，配置变量会重复，值取最后获取到的

## 给自己的项目设置 git 参数`.git/config`

```
➜  ~ cat ~/.gitconfig
[user]
	email = cky951010@163.com
	name = caokaiyan
[push]
	default = simple
[alias]
	lg = log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
[core]
	quotepath = false # 支持中文文件名
```

## 中文支持

在日志里正确显示中文 shell 里执行

```
export LESSCHARSET=utf-8
```

中文名称正确显示(utf-8 下) shell 里执行

```
git config --global core.quotepath false
```

## .gitignore

```
# no .a files
*.a

# but do track lib.a, even though you're ignoring .a files above
!lib.a

# only ignore the TODO file in the current directory, not subdir/TODO
/TODO

# ignore all files in the build/ directory
build/

# ignore doc/notes.txt, but not doc/server/arch.txt
doc/*.txt

# ignore all .pdf files in the doc/ directory
doc/**/*.pdf
```

## git 里怎样移除对一个文件的管理 并且不删除该文件

1. 先`git rm -r --cached 文件`
2. 在`.gitignore`中添加忽略信息
3. 最后`gti commit -m '提交.gitignore'`

## 新建代码库

```
# 在当前目录新建一个Git代码库
$ git init
# 新建一个目录，将其初始化为Git代码库
$ git init [project-name]
# 下载一个项目和它的整个代码历史
$ git clone [url]
```

## 本地操作

```
$ git diff # 查看未暂存的所有修改
$ git add . #　将所有修改的文件暂存
$ git reset file # 将暂存区文件撤回,回到修改状态
$ git checkout -- file ＃　将文件恢复到修改之前,等于是丢弃了对这个文件的修改
$ git diff --staged # 查看已经暂存起来的变化,同--cached
$ git commit -m "提交说明"　# 提交暂存区里的文件快照　，产生一个commit
$ git commit --amend # 将最后一次提交再次提交，最终你只会有一个提交 ，第二次提交将代替第一次提交的结果，重写提交说明
$ git rm PROJECTS.md # 只从库里移除一个文件,不会物理删除
$ git rm --cached README  # 想让文件保留在磁盘，但是并不想让 Git 继续跟踪
$ git mv file_from file_to # 重命名
$ git log # 查看日志
$ git log -p -2 # 显示最近两次提交的内容差异
```

## 远程仓库的使用

```
$ git remote add [remote_name] git://github.com/codekissyoung/[project-name].git 为本地库添加远程库,并取名为remote_name
$ git clone https://github.com/codekissyoung/git.git 克隆远程库为本地库，并取名为origin(默认推送的库)
$ git remote -v　# 列出所有的远程库
$ git remote show [remote-name] # 查看一个远程库的详细信息
$ git push -u origin master # 将当前分支与远程origin库的master分支关联起来
$ git branch -a　# 列出所有分支，包括远程和本地的
$ git fetch --all # 将全部远程仓库的更新获取到本地
$ git merge origin/master # 当前分支合并远程分支
$ git push origin test # 将当前分支推送到origin的test分支,如果远程库没有该分支，则创建
$ git remote rm git_test 删除远程仓库
$ git remote rename [remote_name] [new_remote_name] 修改远程库名字
$ git checkout branch_name # 切换到某一分支　，若该分支为远程分支,则以该分支为基础，在本地新建一个与之同名的分支，并设置为跟踪该远程分支　
$ git branch --set-upstream-to=github/master # 设置当前分支跟踪远程的github/master分支
$ git checkout -b newBrach origin/master # 在origin/master的基础上，创建一个新分支
```

## git commit 　产生的对象(commit 对象　 tree 对象 blob 快照对象)

![分支](https://git-scm.com/book/en/v2/book/03-git-branching/images/commit-and-tree.png)

## 分支运用

`git rebase origin/master` 在当前分支上，合并 origin/master

## 别名

```
$ git config --global alias.co checkout
$ git config --global alias.br branch
$ git config --global alias.ci commit
$ git config --global alias.st status
```

## git rebase 变基

http://blog.csdn.net/hudashi/article/details/7664631

## 将一台服务器作为远程仓库(类似 github)

http://blog.csdn.net/wangjia55/article/details/8802490
实现的效果是,我们可以通过`git clone ssh://software@172.16.0.30/~/yafeng/.git`拿到那台服务器上的代码,那台服务器可以代替 github 使用了

## 一个牛逼的 git 分支模型的使用

http://www.oschina.net/translate/a-successful-git-branching-model
查看附件,有模型的图

## git 获取远程分支

通过`Git clone` 获取的远端 git 库，只包含了远端 git 库的当前工作分支。
如果想获取其它分支信息，需要使用`git branch –r`来查看， 如果需要将远程的其它分支代码也获取过来，可以使用命令：

```
git checkout -b 本地分支名 远程分支名
```

其中，远程分支名为`git branch –r`所列出的分支名， 一般是诸如`origin/分支名`的样子
如果本地分支名已经存在， 则不需要`-b`参数
