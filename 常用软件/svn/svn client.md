# 检出一个工作副本
```shell
➜  svn checkout svn://127.0.0.1 --username cky --password Cky_xxxxxx
Checked out revision 0.
➜  ls -alhi
total 12K
788671 drwxrwxr-x  3 cky cky 4.0K Oct 19 23:56 .
793783 drwxr-xr-x 17 cky cky 4.0K Oct 19 23:54 ..
789305 drwxrwxr-x  4 cky cky 4.0K Oct 19 23:56 .svn
```

查看版本库里 日志 目录 内容
=================================================
```shell
svn log -l10                        # 查看最近10次日志 用来展示svn 的版本作者、日期、路径等等
svn log;                            # 什么都不加会显示所有版本commit的日志信息
svn log -r 4:5                      # 只看版本4和版本5的日志信息
svn log test.c                      # 查看文件test.c的日志修改信息
svn log -v dir                      # 查看目录的日志修改信息,需要加v
svn cat -r 4 test.c                 # 查看版本4中的文件test.c的内容,不进行比较;
svn list http://svn.test.com/svn    # 查看目录中的文件;
svn list -v http://svn.test.com/svn # 查看详细的目录的信息(修订人,版本号,文件大小等)
```

对比差异
==================================================
```shell
svn diff                # 什么都不加，会检测本地代码和缓存在本地.svn目录下的信息的不同，用来显示特定修改的行级详细信息
svn diff -r 3           # 比较你的本地代码和版本号为3的所有文件的不同
svn diff -r 3 text.c    # 比较你的本地代码和版本号为3的text.c文件的不同
svn diff -r 5:6         # 比较版本5和版本6之间所有文件的不同
svn diff -r 5:6 text.c  # 比较版本5和版本6之间的text.c文件的变化
```

回退修改
====================================================
```shell
svn revert file/path 回退对某一个文件／目录的修改
svn revert -R path   递归回退
```
- 一般的使用场景: `svn add`了但未提交的，不小心修改但未提交的，不小心删除的在版本库里的文件

添加忽略文件
=====================================================
- svn中对当前文件夹添加属性,执行命令后,直接在文本输入界面里填写要忽略的文件就好,默认编辑器在`.bash_rc`里设置`export SVN_EDITOR=vim`
```shell
svn propedit svn:ignore .
```

副本的文件添加到版本控制
=====================================================
```bash
svn　add　文件名
```

将服务器仓库中的文件删除操作
=====================================================
```
svn delete test.c
svn ci -m"删除测试文件test.c"
```

提交修改文件
=====================================================
```
svn ci -m "提交test.php到服务器"  test.php
svn ci -m "提交所有c文件到服务器"  *.c
```

查看本地副本中是否有异常的文件
```bash
svn st   # 查看当前目录下异常文件状态
?：不在svn的控制中；M：内容被修改；C：发生冲突；A：预定加入到版本库；K：被锁定
svn status -v [path]
-v 是连子目录中异常都显示
```

查看某个文件的详细信息和变更日志
=====================================================
```bash
svn info test.php
svn log  test.php
```

比较差异
=====================================================
```bash
svn diff test.php           # 将修改的文件与基础版本比较
svn diff -r200:201 test.php # 比较两个版本之间文本的差异
```

## 加锁/解锁 ##
```
svn lock -m “lock test file“ [--force] test.php
svn unlock test.php
```

## 更新到1920版本 ##
```
svn update -r1920 test.php
```
## 更新当前目录和其子目录下文件 ##

```
svn up
```

## 将两个版本之间的差异合并到当前文件 ##
```
svn merge -r m:n path
例如：svn merge -r 200:205 test.php
（将版本200与205之间的差异合并到当前文件，但是一般都会产生冲突，需要处理一下）
```

## 恢复本地修改 ##
```
svn revert path : 恢复原始未改变的工作副本文件 (恢复大部份的本地修改)。
注意: 本子命令不会存取网络，并且会解除冲突的状况。但是它不会恢复被删除的目录
```

## 解决冲突 ##
```
svn resolved  path: 移除工作副本的目录或文件的“冲突”状态。
注意: 本子命令不会依语法来解决冲突或是移除冲突标记；它只是移除冲突的相关文件，然后让 PATH 可以再次提交。
```

svn 分为server 和 client , client 从server copy 副本，commit 修改，update 更新，并且形成日志！
svn 监听3690端口
svn 可以是单独svnserver（svn://协议访问） ,也可以是 apache 插件 (http://访问)

