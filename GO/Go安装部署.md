# Go 安装部署

## 语言介绍

- 天然并发：语言层面支持并发，包括 gorotuine、channel
- 语法优势：没有历史包袱，包含多返回值、匿名函数、defer
- 语言层面支持多核 CPU 利用

与 Java 相比的不同：

- 没有 Java 支持的一些面向对象思想：重载、构造函数、继承
- 代码规范严格：花括号位置固定，变量名大小写代表公有私有
- 支持函数式编程：匿名函数，闭包
- 接口非侵入式：不需要显式声明对接口的继承，实现了接口的方法即为实现了该接口类型


## Go 安装

推荐使用官方的安装包直接安装，下载地址：https://golang.org/dl/

```bash
$ wget https://dl.google.com/go/go1.13.1.linux-amd64.tar.gz
$ tar zxvf go*.tar.gz -C /usr/local/
$ go version 	# 查看go版本
$ go env 		# 查看go环境配置
```

使用 go mod 功能推荐如下配置`/etc/profile`:

```bash
export GOROOT=/usr/local/go                 # golang本身的安装位置
export GOPATH=~/go/                         # golang包的本地安装位置
export PATH=$PATH:$GOROOT/bin               # go本身二进制文件的环境变量
export PATH=$PATH:$GOPATH/bin               # go第三方二进制文件的环境便令
export GO111MODULE=on                       # 开启go mod模式
export GOPROXY=https://goproxy.cn,direct    # golang包的下载代理
export GOPRIVATE=gitlab.xinhulu.com			# 不使用 GOPROXY 代理的包
export GIT_TERMINAL_PROMPT=1				# 使得go命令可以读取git的参数
```

### GO命令

```bash
$ go version            # 查看版本
$ go env                # 查看环境变量 编译的参数
$ go get                # 获取第三方库 下载到 GOPATH 的 src 目录 依赖 git
$ go run                # 直接运行程序
$ go build              # 测试编译，检查是否有编译错误
$ go fmt                # 格式化源码
$ go install            # 编译包文件并编译整个程序
$ go test               # 运行测试文件
$ go doc                # 查看文档
```

## Go Module

`go module` 基本使用。

[官方解释](https://github.com/golang/go/wiki/Modules)

`go module`可以将某个项目的所有依赖整理成一个 `go.mod` 文件，里面写入了依赖的版本等，使用`go module`之后我们可不用将代码放置在 `$GOPATH/src` 下了。

由于中国墙的存在，还需要设置下 
- [Module 包代理](https://github.com/goproxy/goproxy.cn/blob/master/README.zh-CN.md)
- [go module 基本使用](https://www.cnblogs.com/chnmig/p/11806609.html)

```bash
$ go mod init modName		# 初始化go.mod
$ go mod tidy  				# 更新依赖文件
$ go mod download  			# 下载依赖文件
$ go mod vendor  			# 将依赖转移至本地的vendor文件
$ go mod edit  				# 手动修改依赖文件
$ go mod graph  			# 打印依赖图
$ go mod verify  			# 校验依赖
```


 go 插件会出现无法下载情况，解决办法：

```bash
# 如果开启了go mod，则
    go get -u -v github.com/ramya-rao-a/go-outline
    go get -u -v github.com/acroca/go-symbols
    go get -u -v golang.org/x/tools/cmd/guru
    go get -u -v golang.org/x/tools/cmd/gorename
    go get -u -v github.com/rogpeppe/godef
    go get -u -v github.com/sqs/goreturns
    go get -u -v github.com/cweill/gotests/gotests
    go get -u -v golang.org/x/lint/golint

# 如果未开启go mod，则需要进入cd $GOPATH/src ，使用 git clone 下载上述文件
# 安装
cd $GOPATH
    go install github.com/ramya-rao-a/go-outline
    go install github.com/acroca/go-symbols
    go install golang.org/x/tools/cmd/guru
    go install golang.org/x/tools/cmd/gorename
    go install github.com/rogpeppe/godef
    go install github.com/sqs/goreturns
    go install github.com/cweill/gotests/gotests
    go install golang.org/x/lint/golint
```