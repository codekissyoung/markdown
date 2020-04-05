# 32 位汇编语言

`x86`、`x86-64`、`PowerPC`、`ARM` CPU 的 32 位指令集是不同的，而目前的汇编语言有两种 `intel`和`AT&T`。`Gcc`编译器都是默认使用`AT&T`汇编语言的。汇编器 `nasm`、`masm`、`as`、`yasm` 可以将汇编语言编译成对应平台的目标文件。

## 汇编器 nasm

首先去[官网](https://www.nasm.us/)下载最新版本的源代码。然后：

```bash
$ ./configure
$ make
$ sudo make install
$ nasm --version
NASM version 2.14.02 compiled on Apr  5 2020
```

## Hello World

```asm
; systemcall.asm

; 程序指令段
section .text
global _start
_start:
	nop
	mov eax, 4      ; sys_write 系统调用
	mov ebx, 1      ; 输出到 文件描述符 1
	mov ecx, msg    ; 起时位置
	mov edx, len    ; 长度
	int 80h         ; 发送中断，开始系统调用

	mov eax, 1      ; exit 系统调用号
	mov ebx, 0      ; return 0
	int 80h         ; 发送中断，开始系统调用

; 数据段
section .data
    msg:
        db "Hello world", 10
        len: equ $-msg

; 保存为被初始化的数据的 .bss 段
section .bss
```

```makefile
BIN=systemcall

$(BIN) : systemcall.o
	ld systemcall.o -o $(BIN)

systemcall.o : systemcall.asm
    # -g 加入调试信息 -F 调试信息格式 dwarf -o 指定名字
	nasm -f elf64 -g -F dwarf systemcall.asm -l systemcall.lst

.PHONY=clean
clean:
	$(RM) $(BIN) *.o
```

```bash
$ make
nasm -f elf64 -g -F dwarf systemcall.asm -l systemcall.lst
ld systemcall.o -o systemcall

$ kdbg systemcall
```

![](https://img.codekissyoung.com/2020/04/05/fbc711906978630b67c14ded54a052d7.png)

## 基础知识

### 数据定义

```asm
; 数据段
section .data
    msg:                        ; msg: 称为标号，代表了这行的内存地址
        db "Hello world", 10 , "nice to meet you !", 10 ; 10 是换行符 \n 的 assic 码
    len equ $ - msg             ; nasm编译时，计算 msg: 到本行的字节长度, 赋值给 len

    MyByte:
        db 'abcdefg', 10        ; 字节
    MyWord:
        dw 0FFFFH               ; 字
    myDouble:
        dd 0F123H               ; 双字
```

### 栈

![](https://img.codekissyoung.com/2020/04/05/7f81080a90bfece032343450bc7d0de6.png)

### 软中断

![](https://img.codekissyoung.com/2020/04/05/d7f8057f914aa9408f4ff4028dcadfb8.png)

`80H`中断正是进入`Linux`内核的大门，在进入之前，首先会将下一条指令的地址自动`PUSH`到栈里，然后陷入内核调度程序，调度程序执行完，只需要`IRET`就可以恢复用户进程的执行。一个完整的中断调用过程如下：

```asm
mov eax, 4      ; sys_write 系统调用
mov ebx, 1      ; 输出到 文件描述符 1
mov ecx, msg    ; 字符串开始位置
mov edx, len    ; 长度
int 80h         ; 发送中断，开始系统调用
```

### 保护模式下内存寻址

![](https://img.codekissyoung.com/2020/04/05/0b256aed4c1319b59d6a494c754d709d.png)

### 调用子过程

```asm
section .text
global _start
_start:
	nop
    call printHelloWorld
    call exit

printHelloWorld:
    ; 保护现场
    push rax
    push rbx
    push rcx
    push rdx

	mov eax, 4      ; sys_write 系统调用
	mov ebx, 1      ; 输出到 文件描述符 1
	mov ecx, msg    ; 起时位置
	mov edx, len    ; 长度
	int 80h         ; 发送中断，开始系统调用

    ; 恢复现场
    pop rdx
    pop rcx
    pop rbx
    pop rax
    ret
exit:
	mov eax, 1      ; exit 系统调用号
	mov ebx, 0      ; return 0
	int 80h         ; 发送中断，开始系统调用

; 数据段
section .data
    msg:
        db "Hello world", 10 , "nice to meet you !", 10 ; 10 是换行符 \n 的 assic 码
    len equ $ - msg ; nasm编译时，计算 msg: 到本行的字节长度, 赋值给 len
; 保存为被初始化的数据的 .bss 段
section .bss
```
