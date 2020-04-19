# Go 安装部署

## 安装

```bash
$ wget https://dl.google.com/go/go1.13.4.linux-amd64.tar.gz  # 解压到 /usr/local/go
export GOROOT=/usr/local/go
export GOPATH=~/go                  # 工作区
export PATH=$PATH:$GOROOT/bin
＂export GOBIN=~/bin                # go install 保存的可执行文件路径
```

```bash
$ go version            # 查看版本
$ go env                # 查看环境变量 编译的参数
$ go get                # 获取第三方库 下载到 GOPATH 的 src 目录 依赖 git
$ go run                # 直接运行程序
$ go build              # 测试编译，检查是否有编译错误
$ go fmt                # 格式化源码（部分IDE在保存时自动调用）
$ go install            # 编译包文件并编译整个程序
$ go test               # 运行测试文件
$ go doc                # 查看文档
```

## 范例

```go
// hello.go
package main
import "fmt"
func main() {
    fmt.Printf("hello, world\n")
}
```

```bash
$ cd $HOME/go           # 工作区
$ tree
.
├── bin
├── pkg
└── src                 # src 目录下，一个子目录 就是一个项目
    └── hello           # 本目录执行 go build
        ├── hello       # 可执行文件
        └── hello.go    # hello world 命令源码文件
```

```bash
$ ./hello
hello, world
```
