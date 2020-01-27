# GoMicro 分布式服务化框架

[go micro中文官方文档](https://micro.mu/docs/cn/)

## 环境搭建

#### 安装 consul (依赖1)

```bash
sudo apt-get install consul
consul version                      # 查看版本
consul agent -dev                   # 运行
consul members                      # 查看 集群内 的 成员
```

#### 安装 protobuf (依赖2)

[protobuf工具安装](https://github.com/protocolbuffers/protobuf/releases)

```bash
./autogen.sh
./configure
make
make check
sudo make install
sudo ldconfig               # refresh shared library cache
protoc --version            # 查看版本
```

#### 安装 go-micro

```bash
export GOROOT=/usr/local/go
export GOPATH=~/go:~/workspace/go           # 工作区的集合
export GOBIN=~/bin                          # 放置Go可执行程序的目录
export PATH=$PATH:$GOROOT/bin:$GOBIN:.
export GO111MODULE=on
export GOPROXY=https://goproxy.io
```

```bash
go get github.com/micro/micro
go get -u github.com/micro/protobuf/{proto,protoc-gen-go} # 生成 go-protobuf 的工具
go get -u github.com/micro/protoc-gen-micro               # 生成 go-micro 的工具
```

[看到这里](https://www.jianshu.com/p/0ff8c0923950)

```bash
$ micro new example         # 在 GOPATH src 下生成一个 示范项目
# 在 example 目录下，执行后就是一个完整的 微服务 了
$ protoc --proto_path=. --micro_out=. --go_out=. proto/example/example.proto
$ go run main.go                # 运行服务，注意，前提是 consul 要运行
$ micro list services           # 列出已经运行的服务
```
