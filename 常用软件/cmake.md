# Cmake 详解

本文记录了`cmake`的用法。

## 概述

### cmake 是什么

`cmake`是一款优秀的工程构建工具。KDE 开发者在使用了近 10 年`autotools`之后，终于决定为`KDE4`选择一个新的工程构建工具。

特点:

- 开放源代码
- 跨平台，在`Linux/Unix`上，生成`makefile`；在`MacOS`上生成`xcode`；在`windows`上生成`MSVC`的工程文件
- 简化编译构建过程和编译过程，工具链简单`cmake + make`
- 高效，比`autotools`快`%40`,主要是因为在工具链中没有`libtool`
- 可拓展，可以为`cmake`编写特定功能的模块，扩充`cmake`功能
- 额外的构建目录树（采用外部构建），不用担心任何删除源码文件的风险
- 支持机器字节序以及其他硬件特性问题的测试
- 在大部分平台下支持并行构建和自动生成文件依赖

### 为什么选用 cmake

为什么不用`autotools`?

- `autotools`在`windows`平台不友好
- 工具链太长，需要用户操作的地方太多

为什么不采用`JAM`、`qmake`、`Scons` 和 `ANT`？

- `qmake`是与`cmake`最相似的，尽管它缺少一些`CMake`中提供的一些系统适配的功能
- `ANT`使用`xml`作为输入使其与传统的`makefile`区分开来
- `JAM`用他自有的语言
- `Scons`使用的是`python`
- 这些工具中的几个直接调用编译器，而不是构建系统来直接处理这些构建任务。它们中的一些工具要求安装例如`python`和`Java`的第三方工具才能够正常工作。

### 安装 cmake

直接去官网下载最新的源代码，然后执行:

```bash
./bootstrap --prefix=/usr/local
make && make install
```

### 基本语法

```bash
command(arg1 arg2 ...)          # 运行命令
set(var_name var_value)         # 定义变量,或者给已经存在的变量赋值
command(arg1 ${var_name})       # 使用变量

# 控制语句
IF(expression)
    COMMAND1(ARGS)
ELSE(expression)
    COMMAND2(ARGS)
ENDIF(expression)

# expression
IF(var)                       # 不是空, 0, N, NO, OFF, FALSE, NOTFOUND 或 <var>_NOTFOUND时，为真
IF(NOT var)                   # 与上述条件相反。
IF(var1 AND var2)             # 当两个变量都为真是为真。
IF(var1 OR var2)              # 当两个变量其中一个为真时为真。
IF(COMMAND cmd)               # 当给定的cmd确实是命令并可以调用是为真
IF(EXISTS dir)                # 目录名存在
IF(EXISTS file)               # 文件名存在
IF(IS_DIRECTORY dirname)      # 当dirname是目录
IF(file1 IS_NEWER_THAN file2) # 当file1比file2新,为真
IF(variable MATCHES regex)    # 符合正则

# 循环
WHILE(condition)
    COMMAND1(ARGS)
    // ...
ENDWHILE(condition)

AUX_SOURCE_DIRECTORY(. SRC_LIST)
FOREACH(one_dir ${SRC_LIST})
    MESSAGE(${one_dir})
ENDFOREACH(onedir)
```

在项目的每个目录中，都需要编写一个`CMakeLists.txt`。

## hello cmake 例子

准备好下面两个文件。

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
ADD_EXECUTABLE(main ${SRC_LIST})
```

### 内部构建

在`cmake-demo`目录下执行:

```bash
cmake .
```

就可以看到`cmake`为项目生产的`Makefile`文件，以及一些`cmake`缓存文件。

```bash
make
```

### 外部构建

内部构建生成的`Cmake`的中间文件与源代码文件混杂在一起，并且`cmake`没有提供清理这些中间文件的命令。

所以`cmake`推荐使用外部构建，步骤如下:

1. 在`CMakeLists.txt`的同级目录下，新建一个`build`文件夹
1. 进入`build`文件夹，执行`cmake ..`命令，这样所有的中间文件以及`Makefile`都在`build`目录下了
1. 在`build`目录下执行`make`就可以得到可执行文件

## 从 hello cmake 到项目

### 多个源代码文件

```bash
.
├── build                   # 构建目录
├── CMakeLists.txt          # 主CMakeLists.txt
├── main.c                  # 入口源文件
└── mod1                    # 模块1
    ├── mod1.c
    ├── mod1_func.c
    ├── mod1_func.h
    └── mod1.h
```

```c
// main.c
#include <stdio.h>
#include "mod1/mod1.h"

int main( int argc, char *argv[] )
{
    mod1_process();
    return 0;
}
```

```c
// mod1.h
#ifndef __MOD1_H__
#define __MOD1_H__
const unsigned int GLOBAL_MOD1_VAR;
void mod1_process();
#endif

// mod1.c
#include "mod1.h"
#include "mod1_func.h"
const unsigned int GLOBAL_MOD1_VAR = 10;
void mod1_process()
{
    mod1_func();
}

// mod1_func.h
#ifndef __MOD1_FUNC_H__
#define __MOD1_FUNC_H__
void mod1_func();
#endif

// mod1_func.c
#include <stdio.h>
#include "mod1.h"
#include "mod1_func.h"
void mod1_func()
{
    printf( "mod1: %d \n", GLOBAL_MOD1_VAR );
}
```

本项目只有一个入口`main.c`文件，然后就是多个模块的源代码文件。一个主`CMakeLists.txt`也可管理好:

```bash
cmake_minimum_required(VERSION 3.10)
PROJECT(PROJECT_ONE)
add_executable(main main.c mod1/mod1.c mod1/mod1_func.c) # 指明需要的源代码文件就好
```

### 将 mod1 模块作为动态库

对于上述文件，如果想让`mod1`独立编译，然后再链接进入可执行文件。则需要做出的修改如下:

```bash
.
├── build
├── CMakeLists.txt          # 修改
├── main.c
└── mod1
    ├── CMakeLists.txt      # 新增
    ├── mod1.c
    ├── mod1_func.c
    ├── mod1_func.h
    └── mod1.h
```

```bash
# ./CMakeLists.txt
cmake_minimum_required(VERSION 3.10)
PROJECT(PROJECT_ONE)
add_subdirectory(mod1 lib)          # 添加一个模块，并且将编译好库文件放置在 build/lib 目录
add_executable(main main.c)
target_link_libraries(main mod1)    # 链接 mod1
```

```bash
# ./mod1/CMakeLists.txt
add_library(mod1 SHARED mod1.c mod1_func.c) # 生成动态库 libmod1.so
```

### mod1 依赖静态库 mod2

```bash
.
├── build
├── CMakeLists.txt
├── main.c
└── mod1
    ├── CMakeLists.txt          # 修改
    ├── mod1.c
    ├── mod1_func.c             # 修改，里面用到了 mod2 中的函数
    ├── mod1_func.h
    ├── mod1.h
    └── mod2                    # 新增
        ├── CMakeLists.txt
        ├── mod2.c
        └── mod2.h
```

代码改动:

```c
// ./mod1/mod1_func.c
#include <stdio.h>
#include "mod1.h"
#include "mod1_func.h"
#include "mod2/mod2.h"          // 新增
void mod1_func()
{
    mod2_func();                // 新增
    printf( "mod1: %d \n", GLOBAL_MOD1_VAR );
}
```

```c
// ./mod1/mod2/mod2.h
#ifndef __MOD2_H__
#define __MOD2_H__
void mod2_func();
#endif

// ./mod1/mod2/mod2.c
#include <stdio.h>
#include "mod2.h"
void mod2_func(){
    fprintf(stdout, "call mod2 func\n");
}
```

`main.c`没有直接用到`mod2`的，所以主`CMakeLists.txt`保持不变。`mod1`依赖`mod2`，所以由`mod1`的`CMakeLists.txt`负责`mod2`模块。

```bash
# mod1/CMakeLists.txt
add_subdirectory(mod2 mo2_lib)  # 新增 mod2 模块,　编译好的库置于 build/lib/mod2_lib　中
link_directories(mod2_lib)      # 添加链接器的查找路径 build/lib/mod2_lib
add_library(mod1 SHARED mod1.c mod1_func.c) # 生成动态库 libmod1.so
target_link_libraries(mod1 mod2) # 将 libmod2.a 链接进入 libmod1.so 中
```

```bash
# mod1/mod2/CMakeLists.txt
add_library(mod2 STATIC mod2.c) # 生成静态库 libmod2.a
```

思考下下列 4 种依赖关系:

```bash
main -> libmod1.so -> libmod2.a
main -> libmod1.a  -> libmod2.a
main -> libmod1.so -> libmod2.so
main -> libmod1.a  -> libmod2.so
```

- 对于底层是`libmod2.a`的情况，所有的实现代码都已经打包进入`libmod1`中，所以`libmod2.a`在最终生成`main`后，可以删除
- 对于底层是`libmod2.so`的情况，打包进入`libmod1`中的全部都是符号表，所以要保证`libmod2.so`的存在，并且正确链接到`main`了

### 如何支持 make install 操作

```bash
.
├── build
├── CMakeLists.txt          # 修改
├── doc                     # 新增
│   └── release_note.txt
├── main.c
└── mod1
    ├── CMakeLists.txt      # 修改
    ├── mod1.c
    ├── mod1_func.c
    ├── mod1_func.h
    ├── mod1.h
    └── mod2
        ├── CMakeLists.txt  # 修改
        ├── mod2.c
        └── mod2.h
```

各个目录的`CMakeLists.txt`各自负责自己目录下要安装的文件:

```bash
# ./CMakeLists.txt
cmake_minimum_required(VERSION 3.10)
PROJECT(PROJECT_ONE)
add_subdirectory(mod1 lib)          # 添加一个模块，并且将编译好库文件放置在 build/lib 目录
add_executable(main main.c)
target_link_libraries(main mod1)         # 链接 mod1

set(CMAKE_INSTALL_PREFIX $ENV{HOME}/usr)              # 安装路径前缀 /home/cao/usr
install(DIRECTORY doc/ DESTINATION share/PROJECT_ONE) # 安装项目文档
install(TARGETS main RUNTIME DESTINATION bin )        # main 安装到 usr/bin
```

```bash
# ./mod1/CMakeLists.txt
add_subdirectory(mod2 mo2_lib)  # 新增 mod2 模块,　编译好的库置于 build/lib/mod2_lib　中
link_directories(mod2_lib)      # 添加链接器的查找路径 build/lib/mod2_lib
add_library(mod1 SHARED mod1.c mod1_func.c) # 生成动态库 libmod1.so
target_link_libraries(mod1 mod2) # 将 libmod2.a 链接进入 libmod1.so 中

install(TARGETS mod1 LIBRARY DESTINATION lib)  # 安装到 usr/lib
install(FILES mod1.h DESTINATION include/mod1) # 安装到 usr/include/mod1
```

```bash
# ./mod1/mod2/CMakeLists.txt
add_library(mod2 SHARED mod2.c) # 生成静态库 libmod2.a
install(TARGETS mod2 LIBRARY DESTINATION lib)  # 安装到 usr/lib
install(FILES mod2.h DESTINATION include/mod2) # 安装到 usr/include/mod2
```

### 添加一个 Find 模块

其实纯粹依靠`cmake`本身提供的基本指令来管理工程是一件非常复杂的事情，所以`cmake`设计成了可扩展的架构，可以通过编写一些通用的模块来扩展`cmake`。这便是`Finder`功能，对于`linux`里一些常用的内置库，`cmake`也预先提供了这样模块，比如`FindCURL`、`FindCurses`、`FindImageMagick`模块。在`CMakeLists.txt`里的使用如下:

```bash
find_package(CURL)
if(CURL_FOUND)
    include_directories(${CURL_INCLUDE_DIR})
    add_executable(curltest main.c)
    target_link_libraries(curltest ${CURL_LIBRARY})
else(CURL_FOUND)
    message(FATAL_ERROR "curl library not found")
endif(CURL_FOUND)
```

那么对于`cmake`没有提供`Find`模块的第三方库，我们该如何实现这一功能呢？下面以`hiredis`库（一个流行的操作`Redis`的`C`库）举例。

首先，我们先安装好它:

```bash
wget https://github.com/redis/hiredis/archive/v0.14.0.tar.gz # 下载最新发布版
tar -zxvf v0.14.0.tar.gz                                     # 解压
cd hiredis-0.14.0
make                                                         # 编译，在本目录下得到 libhiredis.so
sudo make install

# 执行结果
mkdir -p /usr/local/include/hiredis /usr/local/include/hiredis/adapters /usr/local/lib
cp -pPR hiredis.h async.h read.h sds.h /usr/local/include/hiredis
cp -pPR adapters/*.h /usr/local/include/hiredis/adapters
cp -pPR libhiredis.so /usr/local/lib/libhiredis.so.0.14
cd /usr/local/lib && ln -sf libhiredis.so.0.14 libhiredis.so
cp -pPR libhiredis.a /usr/local/lib
mkdir -p /usr/local/lib/pkgconfig
cp -pPR hiredis.pc /usr/local/lib/pkgconfig
```

从上面的安装结果来看:

- 头文件在`/usr/local/include/hiredis/hiredis.h`,所以程序里需要`#include <hiredis/hiredis.h>`
- 库文件在`/usr/local/lib`中,库名为`hiredis`

```bash
.
├── build
├── cmake                   # 新增
│   └── FindHIREDIS.cmake   # FindHIREDIS 模块
├── CMakeLists.txt          # 修改
├── doc
│   └── release_note.txt
├── main.c                  # 修改
└── mod1
    ├── CMakeLists.txt
    ├── mod1.c
    ├── mod1_func.c
    ├── mod1_func.h
    ├── mod1.h
    └── mod2
        ├── CMakeLists.txt
        ├── mod2.c
        └── mod2.h
```

源代码的修改,添加使用例子 :

```c
#include <stdio.h>
#include <hiredis/hiredis.h>
#include "mod1/mod1.h"
int main( int argc, char *argv[] )
{
    mod1_process();
    redisContext *conn = redisConnect( "127.0.0.1", 6379 );
    if( conn != NULL && conn->err ){
        printf("连接失败:%s\n", conn->errstr);
        return 1;
    }
    redisReply *reply = (redisReply*)redisCommand(conn,"set foo 1234");
    freeReplyObject(reply);

    reply = redisCommand(conn,"get foo");
    printf("%s\n",reply->str);
    freeReplyObject(reply);

    redisFree(conn);
    return 0;
}
```

自定义`FindHIREDIS`模块:

```bash
find_path(HIREDIS_INCLUDE_DIR hiredis.h /usr/local/include/hiredis)
find_library(HIREDIS_LIBRARY NAMES hiredis PATH /usr/local/lib)

if(HIREDIS_INCLUDE_DIR AND HIREDIS_LIBRARY)
    SET(HIREDIS_FOUND TRUE)
endif(HIREDIS_INCLUDE_DIR AND HIREDIS_LIBRARY)

if(HIREDIS_FOUND)
    if(NOT HIREDIS_FIND_QUIETLY)
        message(STATUS "Found Hello: ${HIREDIS_LIBRARY}")
    endif(NOT HIREDIS_FIND_QUIETLY)
else(HIREDIS_FOUND)
    if(HIREDIS_FIND_REQUIRED)
        message(FATAL_ERROR "Could not find hello library")
    endif(HIREDIS_FIND_REQUIRED)
endif(HIREDIS_FOUND)
```

修改主`CMakeLists.txt`为:

```bash
cmake_minimum_required(VERSION 3.10)
PROJECT(PROJECT_ONE)
add_subdirectory(mod1 lib)
add_executable(main main.c)
target_link_libraries(main mod1)

set(CMAKE_MODULE_PATH ${PROJECT_SOURCE_DIR}/cmake)    # 设置自定义 Find module 的路径
# 连接 libhiredis.so
find_package(HIREDIS)
if(HIREDIS_FOUND)
    include_directories(${HIREDIS_INCLUDE_DIR})
    target_link_libraries(main ${HIREDIS_LIBRARY})
else(HIREDIS_FOUND)
    message(FATAL_ERROR "libhiredis.so not be found!")
endif(HIREDIS_FOUND)

set(CMAKE_INSTALL_PREFIX $ENV{HOME}/usr)
install(DIRECTORY doc/ DESTINATION share/PROJECT_ONE)
install(TARGETS main RUNTIME DESTINATION bin)
```

### 传递给源代码一些配置

在`CMakeLists.txt`中配置参数，控制源代码中代码的编译部分，比如可以通过一个参数控制，是用自己写的库还是系统库？

```bash
.
├── build
├── cmake
│   └── FindHIREDIS.cmake
├── cmakeconfig.h.in            # 新增
├── CMakeLists.txt              # 修改
├── doc
│   └── release_note.txt
├── main.c                      # 修改
└── mod1
    ├── CMakeLists.txt
...
```

在主`CMakeLists.txt`里定义:

```bash
cmake_minimum_required(VERSION 3.10)
PROJECT(PROJECT_ONE)

# 通过 cmakeconfig.h 传递参数给源文件
set(AUTHOR "codekissyoung")
set(RELEASE_DATE "2019-6-25")
set(USE_MY_LIB "1")                                  # 使用自己的库
configure_file(
    ${PROJECT_SOURCE_DIR}/cmakeconfig.h.in
    ${PROJECT_BINARY_DIR}/cmakeconfig.h
)
include_directories(${PROJECT_BINARY_DIR})

add_subdirectory(mod1 lib)                            # 添加模块，编译后放在 build/lib
...
```

再定义`cmakeconfig.h.in`,它会在`Build`目录里生成一个`cmakeconfig.h`，`@@`中间的名字会被替换:

```bash
#define AUTHOR "@AUTHOR@"
#define RELEASE_DATE "@RELEASE_DATE@"
#define USE_MY_LIB "@USE_MY_LIB@"
```

再看下源代码中如何使用:

```c
#include <stdio.h>
#include <hiredis/hiredis.h>
#include "cmakeconfig.h"                    # 这里引用 cmakeconfig.h
#include "mod1/mod1.h"
int main( int argc, char *argv[] )
{
    printf("author: %s, release_date: %s\n", AUTHOR, RELEASE_DATE );

    #ifdef USE_MY_LIB
        printf("使用自己的库的代码\n");
    #else
        printf("使用系统库的代码\n");
    #endif

    mod1_process();
    ...
}
```

### 区分 开发版 与 发布版

上述的代码编译后都是不可调试的，并且没有做编译优化，我们希望能够编译成一个调试版本与一个发布版本。做法如下:

- 我们将`build`目录作为开发版本编译目录，与之相对的新建一个`release`目录作为发布版本
- 在`build`目录下我们执行`cmake -DMAKE_BUILD_TYPE=Debug ..`,编译命令会使用`-g`
- 在`release`目录下我们执行`cmake -DMAKE_BUILD_TYPE=Release ..`,编译命令会使用`-O3 -DNDEBUG`

所以，在源代码中，我们可以使用`NDEBUG`宏来控制，在开发版输出调试信息，而在发布版本去掉调试信息。

```c
#ifndef NDEBUG
    printf("author: %s, release_date: %s\n", AUTHOR, RELEASE_DATE ); # 只在开发版本编译
#endif
```

我自己在写代码的时候，习惯在开发版本打开所有的错误报告，而上述的开发版本只使用了`-g`，这显然是不够的，需要通过在`CMakeLists.txt`里重新设置下开发版本的编译参数:

```bash
cmake_minimum_required(VERSION 3.10)

PROJECT(PROJECT_ONE)

set(CMAKE_C_FLAGS_DEBUG "-g -Wall -pedantic -DDEBUG")
message(STATUS "debug flags: ${CMAKE_C_FLAGS_DEBUG}")

message(STATUS "release flags: ${CMAKE_C_FLAGS_RELEASE}")
...
```

通常我习惯使用脚本来完成重复的`构建-编译-运行`这一过程，参考如下:

```bash
# ./make-debug.sh
#!/bin/bash
rm -rf build/*                                # 清理上一次的结果

cd build && cmake -DCMAKE_BUILD_TYPE=debug .. # 进入debug目录，执行构建

make && ./main                                # 编译，然后运行
```

```bash
./make-release.sh
#!/bin/bash
rm -rf release/*                                  # 清理上一次的结果

cd release && cmake -DCMAKE_BUILD_TYPE=release .. # 进入release目录，执行构建

make && ./main                                    # 编译，然后运行
```

### 总结 ONE_PROJECT 项目

```bash
.
├── build
├── cmake
│   └── FindHIREDIS.cmake
├── doc
│   └── release_note.txt
├── mod1
│   ├── mod2
│   │   ├── CMakeLists.txt
│   │   ├── mod2.c
│   │   └── mod2.h
│   ├── CMakeLists.txt
│   ├── mod1.c
│   ├── mod1_func.c
│   ├── mod1_func.h
│   └── mod1.h
├── release
├── cmakeconfig.h.in
├── CMakeLists.txt
├── main.c
├── make-debug.sh
└── make-release.sh
```

整个项目的目录结构如上,把这个项目作为脚手架，进行开发的话，非常容易就实现下面目标:

- 非常容易划分，添加项目自己实现的`mod`
- 非常容易通过`Find`功能引入第三方库
- 非常容易通过传递参数到 源代码 中，实现条件编译，比如选择使用　第三方库　还是 系统库　等
- 开发版本 与 发布版本 分离

## 指令参考

```bash
PROJECT(projectname) # 项目名
```

```bash
SET(VAR [VALUE] [CACHE TYPE DOCSTRING [FORCE]])
```

`SET`定义变量。使用变量则是`${VAR_NAME}`。注意：如果是在`IF`控制语句中，不能使用`${}`，而是直接使用`VAR_NAME`。

```bash
MESSAGE([SEND_ERROR | STATUS | FATAL_ERROR] "message to display"...)
```

`MESSAGE`向终端输出用户定义的信息，`FATAL_ERROR`会立即终止`cmake`编译过程。

```bash
ADD_EXECUTABLE(exe ${SRC_LIST})                     # 生成可执行文件 exe
ADD_LIBRARY(mod [SHARED|STATIC|MODULE] ${SRC_LIST}) # 生成库 libmod.so
```

```bash
ADD_SUBDIRECTORY(source_dir [binary_dir] [EXCLUDE_FROM_ALL])
```

`ADD_SUBDIRECTORY`指定`cmake`子目录源代码所在路径，以及编译后二进制文件存放目录。

```bash
$ENV{HOME} # 使用环境变量 HOME
```

```bash
INCLUDE_DIRECTORIES(header_file_dir)        # 添加头文件搜索目录
LINK_DIRECTORIES(lib_file_dir)　　　         # 添加库文件搜索目录
```

```bash
TARGET_LINK_LIBRARIES(exe mod1)             # 将 libmod1.so 链接到 exe 中
```

```bash
ADD_DEFINITIONS(-DENABLE_DEBUG)             # 向C/C++编译器中添加宏定义 ENABLE_DEBUG
```

```bash
ADD_DEPENDENCIES(target-name depend-target1 ) # 定义依赖
```

```bash
AUX_SOURCE_DIRECTORY(. SRC_LIST)
```

`AUX_SOURCE_DIRECTORY`发现一个目录下所有的源代码文件并将列表存储在一个变量中。

```bash
EXEC_PROGRAM(ls ARGS "*.c" OUTPUT_VARIABLE LS_OUTPUT RETURN_VALUE LS_RVALUE)
IF(not LS_RVALUE)
    MESSAGE(STATUS "ls result: " ${LS_OUTPUT})
ENDIF(not LS_RVALUE)
```

`EXEC_PROGRAM`用于在构建时，运行`shell`命令，`ARGS`指明参数，`OUTPUT_VARIABLE` `LS_OUTPUT` `RETURN_VALUE` `LS_RVALUE` 存储了命令运行的结果。

```bash
INCLUDE(file1 [OPTIONAL])       # 载入 CMakeLists.txt　文件
INCLUDE(module [OPTIONAL])　　　 # 载入 cmake 模块
```

`OPTIONAL`参数的作用是文件不存在也不会产生错误。

## 变量参考

项目目录相关:

```bash
# 构建发生的目录
CMAKE_BINARY_DIR
PROJECT_BINARY_DIR
<projectname>_BINARY_DIR

# 不论采用何种编译方式，都是工程顶层目录
CMAKE_SOURCE_DIR
PROJECT_SOURCE_DIR
<projectname>_SOURCE_DIR

CMAKE_CURRENT_SOURCE_DIR  # 当前处理的CMakeLists.txt所在的路径

CMAKE_CURRRENT_BINARY_DIR # 内部编译: 跟CMAKE_CURRENT_SOURCE_DIR一致
                          # 外部编译: 指的是构建目录
                          # add_subdirectory(src bin) 会更改它的值为 bin

CMAKE_CURRENT_LIST_FILE   # 当前输出所在的CMakeLists.txt的完整路径
CMAKE_CURRENT_LIST_LINE   # 当前输出所在的行
```

```bash
CMAKE_MODULE_PATH         # 模块所在路径

EXECUTABLE_OUTPUT_PATH    # 可执行文件存放目录
LIBRARY_OUTPUT_PATH       # 库存放目录

CMAKE_INCLUDE_DIRECTORIES_PROJECT_BEFORE # 将工程提供的头文件目录始终置于系统头文件目录的前面

CMAKE_INCLUDE_PATH        # 头文件搜索目录

CMAKE_LIBRARY_PATH        # 库搜索目录
```

系统信息:

```bash
CMAKE_MAJOR_VERSION       # CMAKE主版本号，比如2.4.6中的2
CMAKE_MINOR_VERSION       # CMAKE次版本号，比如2.4.6中的4
CMAKE_PATCH_VERSION       # CMAKE补丁等级，比如2.4.6中的6
CMAKE_SYSTEM              # 系统名称，比如Linux-2.6.22
CMAKE_SYSTEM_NAME         # 不包含版本的系统名，比如Linux
CMAKE_SYSTEM_VERSION      # 系统版本，比如2.6.22
CMAKE_SYSTEM_PROCESSOR    # 处理器名称，比如i686
UNIX                      # 在所有的类Unix平台为TRUE，包括OSX和cygwin
WIN32                     # 在所有的Win32平台为TRUE，包括cygwin
```

开关选项:

```bash
CMAKE_ALLOW_LOOSE_LOOP_CONSTRUCTS   # 用来控制IF ELSE语句的书写方式
BUILD_SHARED_LIBS                   # 这个开关用来控制默认的库编译方式: 动态库 静态库
CMAKE_C_FLAGS                       # 设置C编译选项
MAKE_CXX_FLAGS                      # MAKE_CXX_FLAGS
CMAKE_INCLUDE_CURRENT_DIR           # 自动将每个CMakeLists.txt的所在目录依次加入到 头文件搜索目录
```

编译参数相关:

```bash
message(STATUS "CMAKE_C_FLAGS = " ${CMAKE_C_FLAGS})
message(STATUS "CMAKE_C_FLAGS_DEBUG = " ${CMAKE_C_FLAGS_DEBUG})
message(STATUS "CMAKE_C_FLAGS_RELEASE = " ${CMAKE_C_FLAGS_RELEASE})

message(STATUS "CMAKE_CXX_FLAGS = " ${CMAKE_CXX_FLAGS})
message(STATUS "CMAKE_CXX_FLAGS_DEBUG = " ${CMAKE_CXX_FLAGS_DEBUG})
message(STATUS "CMAKE_CXX_FLAGS_RELEASE = " ${CMAKE_CXX_FLAGS_RELEASE})

message(STATUS "CMAKE_EXE_LINKER_FLAGS = " ${CMAKE_EXE_LINKER_FLAGS})
message(STATUS "CMAKE_EXE_LINKER_FLAGS_DEBUG = " ${CMAKE_EXE_LINKER_FLAGS_DEBUG})
message(STATUS "CMAKE_EXE_LINKER_FLAGS_RELEASE = " ${CMAKE_EXE_LINKER_FLAGS_RELEASE})

message(STATUS "CMAKE_SHARED_LINKER_FLAGS = " ${CMAKE_SHARED_LINKER_FLAGS})
message(STATUS "CMAKE_SHARED_LINKER_FLAGS_DEBUG = " ${CMAKE_SHARED_LINKER_FLAGS_DEBUG})
message(STATUS "CMAKE_SHARED_LINKER_FLAGS_RELEASE = " ${CMAKE_SHARED_LINKER_FLAGS_RELEASE})

message(STATUS "CMAKE_STATIC_LINKER_FLAGS = " ${CMAKE_STATIC_LINKER_FLAGS})
message(STATUS "CMAKE_STATIC_LINKER_FLAGS_DEBUG = " ${CMAKE_STATIC_LINKER_FLAGS_DEBUG})
message(STATUS "CMAKE_STATIC_LINKER_FLAGS_RELEASE = " ${CMAKE_STATIC_LINKER_FLAGS_RELEASE})
```

## 其他参考

- [CMake 入门实战](http://www.hahack.com/codes/cmake/)
- [CMake Official Tutorial——教程还是官方的好](https://www.cnblogs.com/Xiaoyan-Li/p/5674747.html)
- [cmake 教程 基本语法](https://blog.csdn.net/luanpeng825485697/article/details/81202136)
