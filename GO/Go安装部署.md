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
$ go get                # 获取第三方库 下载到 src 目录
```

## 范例

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
$ ./hello
hello, world
```

```go
package main
import "fmt"
func main() {
    fmt.Printf("hello, world\n")
}
```
