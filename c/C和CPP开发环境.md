# C和CPP开发环境

## 检查C的开发环境

```bash
uname -a                # 检测 linux 内核版本
lsb_release -a          # 查看发行版本
gcc -v                  # 检查 gcc 版本
gdb -v                  # 检查 gdb 版本
make -v                 # 检查 make 版本
autoconf --version      # 检查 autoconf 版本
automake --version      # 检查 automake 版本
libtoolize --version    # 检查 libtool 版本
```

## 安装开发环境

```bash
sudo apt-get install gcc gdb make autoconf automake libtool build-essential
```

## gcc