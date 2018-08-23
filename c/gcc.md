# GCC 编译器相关

## 链接原理

- 可重定位目标文件 `*.o`
  - 编译成的机器指令和数据，因为它往往引用了其他 `xx.o` 中的符号，所以不能单独直接执行，需要将这些引用所在的文件链接进来，这种操作称为重定向

- 共享目标文件 `*.so`
  - 特殊的 `*.o` 文件，程序运行时候才动态加载到内存中运行

- 可执行目标文件
  - 已经将所有引用到的符号的所在文件链接起来，每一个符号都已经得到了解析和重定位，每个符号都是已知的，所以可以被机器直接执行

## gcc 编译

```bash
gcc -o hello hello.c -I/home/hello/include -L/home/hello/lib -lword
```

- `-I/home/hello/include` 自定义寻找头文件的目录，寻找顺序 `/home/hello/include` ->  `/usr/include` -> `/usr/local/include`

- `-L/home/hello/lib` 自定义寻找库文件的目录, 寻找顺序是`/home/hello/lib` -> `/lib` -> `/usr/lib` -> `/usr/local/lib`

- `-lword` 寻找动态链接库文件`libword.so`,也就是文件名去掉lib前缀和后缀所代表的库文件,对于第三方提供的动态链接库(.so），一般将其拷贝到一个lib目录下`/usr/local/lib`,或者使用`-L`来指定其所在目录， 然后使用`-l`来指定其名称,如果加上编译选项 `-static`，表示寻找静态链接库文件，也就是 `libword.a`
