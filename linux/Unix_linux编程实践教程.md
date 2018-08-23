# Unix/Linux编程实践教程

## 第一章 概述

### 用户 shell 内核

- 登录linux系统后，系统给用户启动一个shell程序，用户将所有的需求与shell进行交互，shell再去与内核交互，期间shell也可以帮用户启动其他程序
- 通过shell启动的进程都是shell的子进程，但是我们可以编写能够脱离shell的进程
- 用户进行注销操作时，内核会结束这个用户的所有进程

## 第二章 用户 文件操作

### 使用 open read close

- `文件描述符` : `open`系统调用在进程和文件之间建立一条链接，这条链接被称为文件描述符
- 同时打开多个文件，它们的文件描述符不同; 同一个文件被多次打开，对应的文件描述符也不同

#### open 打开进程到文件的链接

- `int fd = open( char *name, int how )`
  - how : `O_RDONLY`只读 `O_WRONLY` 只写 `O_RDWR` 可读可写

#### read 从文件fd中读取数据

- `ssize_t numread = read( int fd, void *buf , size_t num)`
  - buf 存放读取到的数据的缓冲区，一般为一个定长数组
  - num 从 fd 对应的文件中，这次要读取的字节数

#### close 关闭进程和文件fd之间的链接

- `int result = close(int fd)`

#### creat 创建新文件

- `int fd = creat( char *filename, mode_t mode)`
  - filename 文件名 带路径
  - mode 设置文件的访问权限

#### write 向文件写入数据

- `ssize_t result = write(int fd, void *buf, size_t num)`
  - buf 要写入文件的准备数据
  - num 要写入的字节数
  - result 实际写入的字节数

### 改变一个文件的当前读/写位置

- 进程打开文件，建立链接fd,会保存一个指针用来记录当前读写文件的位置
  - 读文件 ： 从文件开始处，读取指定的字节，然后移动指针，指向未被读取的字节
  - 写文件 : 从文件开始处写入指定字节，然后移动指针，指向写入后的位置
- 当两个进程同时打开同一个文件时，这时会有两个指针，两个进程对文件的操作不会互相干扰

#### lseek 修改一个链接 fd 的位置指针

- `off_t oldpos = lseek(int fd, off_t dist, int base)`
  - dist 移动的字节数，可以为负
  - base : `SEEK_SET` 文件的开始, `SEEK_CUR` 当前位置, `SEEK_END` 文件结尾

## 第 3 章 目录与文件属性

- `DIR *opendir( dirname )`打开目录
- `struct dirent *direntp = readdir( DIR* dir_ptr)` 读取目录里面的内容
- `int result = stat(char *fname, struct stat *bufp)` 得到文件的各项属性
