# Cmake 详解

本文记录了`cmake`的用法。

## cmake是什么

`cmake`是一款优秀的工程构建工具。KDE开发者在使用了近10年`autotools`之后，终于决定为`KDE4`选择一个新的工程构建工具。

特点:

- 开放源代码
- 跨平台，在`Linux/Unix`上，生成`makefile`；在`MacOS`上生成`xcode`；在`windows`上生成`MSVC`的工程文件
- 简化编译构建过程和编译过程，工具链简单`cmake + make`
- 高效，比`autotools`快`%40`,主要是因为在工具链中没有`libtool`
- 可拓展，可以为`cmake`编写特定功能的模块，扩充`cmake`功能

在项目的每个目录中，都需要使用"cmake语言"编写一个`CMakeLists.txt`。

## Hello Cmake例子

准备好下面两个文件：

```c
// cmake-demo/main.c
#include <stdio.h>
int main( int argc, char *argv[] )
{
    printf("hello cmake!\n");
    return 0;
}
```

```c
// cmake-demo/CMakeLists.txt
PROJECT(HELLO)
SET(SRC_LIST main.c)
MESSAGE(STATUS "binary dir: " ${HELLO_BINARY_DIR})
MESSAGE(STATUS "source dir: " ${HELLO_SOURCE_DIR})
ADD_EXECUTABLE(main ${SRC_LIST})
```

在`cmake-demo`目录下执行:

```bash
cmake .
```

就可以看到`cmake`为项目生产的`Makefile`文件，以及其他不需要理会的文件和目录。

### 指令解释

```c
PROJECT(projectname)
```

上述命令执行后，会产生 4 个变量：

```bash
<projectname>_BINARY_DIR    # 指代编译路径，即执行 cmake 命令的当前路径
<projectname>_SOURCE_DIR    # 指代工程路径，即 CMakeLists.txt所在路径
PROJECT_BINARY_DIR       # 与 <projectname>_BINARY_DIR 值相同
PROJECT_SOURCE_DIR       # 与 <projectname>_SOURCE_DIR 值相同
```

```c
SET(VAR [VALUE] [CACHE TYPE DOCSTRING [FORCE]])
```

`SET`用于定义变量。使用变量则是`${VAR_NAME}`。注意：如果是在`IF`控制语句中，不能使用`${}`，而是直接使用`VAR_NAME`。

```c
MESSAGE([SEND_ERROR | STATUS | FATAL_ERROR] "message to display"...)
```

`MESSAGE`用于向终端输出用户定义的信息，`FATAL_ERROR`会立即终止`cmake`编译过程。

```c
ADD_EXECUTABLE(hello ${SRC_LIST})
```

`ADD_EXECUTABLE`用于指定要生成的可执行文件，以及生成它所需要源文件列表。

## 从 hello cmake 到最简单的工程项目

### 内部构建 与 外部构建

在上述`hello cmake`例子中，我们使用的就是内部构建，这种方式生成的`Cmake`的中间文件与源代码文件放在一起，并且`cmake`没有提供清理这些中间文件的命令。

所以`Cmake`推荐我们使用外部构建的方式，去管理项目工程，步骤如下:

1. 准备好下面`hello cmake`例子中的两个文件,在`CMakeLists.txt`的同级目录下，新建一个`build`文件夹
1. 进入`build`文件夹，执行`cmake ..`命令，这样所有的中间文件以及`Makefile`都在`build`目录下了
1. 在`build`目录下执行`make`就可以得到可执行文件

将`hello cmake`的文件扩展如下：

```bash
.
├── build                   # 构建目录
├── CMakeLists.txt          # 主CMakeLists.txt
├── doc                     # 该项目的文档目录
├── README.md               # readme 文件
├── run-main.sh             # 用于运行 build 中生成的 可执行文件
└── src                     # 所有源代码所在目录
    ├── CMakeLists.txt      # 子CMakeLists.txt
    └── main.c
```

主`CmakeLists.txt`也是需要修改:

```c
cmake_minimum_required(VERSION 3.10)

PROJECT(HELLO)

MESSAGE(STATUS "binary dir: " ${PROJECT_BINARY_DIR})
MESSAGE(STATUS "source dir: " ${PROJECT_SOURCE_DIR})

ADD_SUBDIRECTORY(src bin)
```

子`CMakeLists.txt`修改为:

```c
SET(SRC_LIST main.c)
ADD_EXECUTABLE(main ${SRC_LIST})
```

上述配置中新增了一个指令:

```c
ADD_SUBDIRECTORY(source_dir [binary_dir] [EXCLUDE_FROM_ALL])
```

`ADD_SUBDIRECTORY`用于指定源代码所在目录，以及编译可执行文件的目录，比如上述项目中，`src`就是源代码目录，`bin`参数决定了，在`build`目录执行`cmake ..`后，将会产生一个`bin`文件夹，存放`Makefile`以及相关文件，在`bin`文件夹中执行`make`即可得到可执行文件。

所以，为了减少操作步骤，可以写一个`run-main.sh`脚本，用于每次的构建过程:

```bash
#!/bin/bash

rm -rf ./build/*            # 清理上一次的结果

cd ./build && cmake ..      # 进入 build 并进行外部构建

cd bin && make              # 构建完成后，进入bin目录，进行编译

./main                      # 执行可执行程序
```

