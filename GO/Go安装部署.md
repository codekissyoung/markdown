# Go 安装部署

## 配置

```bash
# /etc/profile
export GOROOT=/usr/local/go 									 # golang本身的安装位置
export GOPATH=~/go/
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin 	 # go 命令 
export GO111MODULE=on 														# 开启go mod模式
export GOPROXY=https://goproxy.cn,direct 	  # golang包的下载代理
export GOPRIVATE=gitlab.xinhulu.com 					# 私有包 替代了 GONOSUMDB 和 GONOPROXY 参数
export GIT_TERMINAL_PROMPT=1 									 # 使得go命令可以读取git的参数
```

## 命令

```bash
$ go version            # 查看版本
$ go env                # 查看环境变量 编译的参数
$ go run                # 直接运行程序
$ go build              # 测试编译
$ go test               # 运行测试文件
$ go get                # 获取第三方库 下载到 GOPATH 的 src 目录 依赖 git
$ go get -u -v github.com/adonovan/gopl.io            # 获取 Go 语言圣经里的代码
$ go get -u -v golang.org/x/tools/cmd/goimports       # 获取 goimports 工具

# Go Module
$ go mod init modName # 初始化go.mod
$ go mod tidy  				  # 更新依赖文件
$ go mod download  			# 下载依赖文件
$ go mod edit  					 # 手动修改依赖文件
$ go mod graph  				# 打印依赖图
$ go mod verify  				# 校验依赖
```

