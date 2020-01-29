# Go安装部署

## 安装

```bash
$ wget https://dl.google.com/go/go1.13.4.linux-amd64.tar.gz  # 解压到 /usr/local/go
export GOROOT=/usr/local/go
export GOPATH=~/go                  # 工作区
＂export GOBIN=~/bin                # go install 保存的可执行文件路径
export PATH=$PATH:$GOROOT/bin:$GOBIN
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