# Go 安装部署

```bash
$ wget https://dl.google.com/go/go1.13.1.linux-amd64.tar.gz
$ tar zxvf go*.tar.gz -C /usr/local/
```

使用 go mod 功能推荐如下配置`/etc/profile`:

```bash
export GOROOT=/usr/local/go                 # golang本身的安装位置
export GOPATH=~/go/                         # golang包的本地安装位置
export PATH=$PATH:$GOROOT/bin               # go本身二进制文件的环境变量
export PATH=$PATH:$GOPATH/bin               # go第三方二进制文件的环境便令
export GO111MODULE=on                       # 开启go mod模式
export GOPROXY=https://goproxy.cn,direct    # golang包的下载代理
export GOPRIVATE=gitlab.xinhulu.com		    # 不使用 GOPROXY 代理的包
export GIT_TERMINAL_PROMPT=1			   # 使得go命令可以读取git的参数
```

### GO命令

```bash
$ go version            # 查看版本
$ go env                # 查看环境变量 编译的参数
$ go get                # 获取第三方库 下载到 GOPATH 的 src 目录 依赖 git
$ go run                # 直接运行程序
$ go build              # 测试编译
$ go fmt                # 格式化源码
$ go install            # 编译包文件并编译整个程序
$ go test               # 运行测试文件
$ go doc                # 查看文档
$ go get github.com/adonovan/gopl.io            # 获取 Go 语言圣经里的代码
$ go get golang.org/x/tools/cmd/goimports       # 获取 goimports 工具
```

## Go Module

[官方解释](https://github.com/golang/go/wiki/Modules)

`go module`可以将某个项目的所有依赖整理成一个 `go.mod` 文件，里面写入了依赖的版本等，使用`go module`之后我们可不用将代码放置在 `$GOPATH/src` 下了。

由于中国墙的存在，还需要设置下 
- [Module 包代理](https://github.com/goproxy/goproxy.cn/blob/master/README.zh-CN.md)
- [go module 基本使用](https://www.cnblogs.com/chnmig/p/11806609.html)

```bash
$ go mod init modName		# 初始化go.mod
$ go mod tidy  						 # 更新依赖文件
$ go mod download  				# 下载依赖文件
$ go mod vendor  				 # 将依赖转移至本地的vendor文件
$ go mod edit  						 # 手动修改依赖文件
$ go mod graph  				  # 打印依赖图
$ go mod verify  					# 校验依赖
```


 go 插件会出现无法下载情况，解决办法：

```bash
# 开启了 go mod
go get -u -v github.com/ramya-rao-a/go-outline
go get -u -v github.com/acroca/go-symbols
go get -u -v golang.org/x/tools/cmd/guru
go get -u -v golang.org/x/tools/cmd/gorename
go get -u -v github.com/rogpeppe/godef
go get -u -v github.com/sqs/goreturns
go get -u -v github.com/cweill/gotests/gotests
go get -u -v golang.org/x/lint/golint
```