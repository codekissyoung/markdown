# SHELL

## 我用SHELL做什么

`SHELL`的操作对象和粒度是文件：执行程序，查找文件，删除文件，批量改变文件名，备份文件、列出目录的文件。

`SHELL`中的调用命令分类：

- **内建命令** : 不会产生子进程，为了效率才内建，比如`cd` `read` `echo`
- **函数** : 函数可以直接作为命令一样使用
- **外部命令** : 在`PATH`里搜寻并且执行的命令，产生子进程

`SHELL`脚本的执行被设计为阻塞式的，从上到下，依次执行，遇见创建子进程的外部命令，一定会等待子进程返回后，才继续往下执行。

## SHELL实现原理

```c
while( true )
{
    input = read(用户输入);

    commad = syntax(input); // 通配符、别名、算术和变量展开

    $? = exec(command);  // 依据命令种类不同，执行内部命令函数、外部程序或文件系统调用

}
```

### 执行环境

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
