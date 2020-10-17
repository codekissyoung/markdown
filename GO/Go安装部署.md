# Go安装部署

将 Go 开发包安装到`/usr/local/go`之后，还需要设置一些环境变量：

```bash
# /etc/profile
export GOROOT=/usr/local/go
export GOPATH=~/go/
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin # go 命令
export GOPROXY=https://goproxy.cn,direct # 代理
export GOPRIVATE=gitlab.xinhulu.com # 私有module 替代了GONOSUMDB GONOPROXY
export GIT_TERMINAL_PROMPT=1 # 使得go命令可以读取git的参数
```

```bash
$ go version            # 查看版本
$ go env                # 查看环境变量 编译的参数
$ go run                # 直接运行程序
$ go build              # 测试编译
$ go test               # 运行测试文件
$ go get                # 获取第三方库 下载到 GOPATH 的 src 目录 依赖 git
$ go get -u -v golang.org/x/tools/cmd/goimports # 获取 goimports 工具
$ go get 包名＠[ 分支 | tag | commit_id ] # 更新到指定的版本
```

```bash
$ go mod init moduleName # 初始化一个 go.mod
$ go mod tidy  				  	  # 更新go.mod里的依赖
```

```bash
$ go run -gcflags "-m -l" main.go # -m 表示进行内存分配分析，-l 表示避免程序内联
```

