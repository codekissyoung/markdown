# Go 安装部署

## 安装Go

```bash
$ wget https://dl.google.com/go/go1.13.4.linux-amd64.tar.gz  # 解压到 /usr/local/go
export GOROOT=/usr/local/go
export GOPATH=~/go                  # 工作区
export PATH=$PATH:$GOROOT/bin
```

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

由于中国墙的存在，还需要设置下 [Module 包代理](https://github.com/goproxy/goproxy.cn/blob/master/README.zh-CN.md)

这里有篇文章写的很清楚了：[go module 基本使用](https://www.cnblogs.com/chnmig/p/11806609.html) ^\_^

```bash
go mod init					# 初始化go.mod
go mod tidy  				# 更新依赖文件
go mod download  			# 下载依赖文件
go mod vendor  				# 将依赖转移至本地的vendor文件
go mod edit  				# 手动修改依赖文件
go mod graph  				# 打印依赖图
go mod verify  				# 校验依赖
```

