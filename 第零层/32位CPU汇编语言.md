# 32 位汇编语言

`x86`、`x86-64`、`PowerPC`、`ARM` CPU 的 32 位指令集是不同的，而目前的汇编语言有两种 `intel`和`AT&T`。`Gcc`编译器都是默认使用`AT&T`汇编语言的。汇编器 `nasm`、`masm`、`as`、`yasm` 可以将汇编语言编译成对应平台的目标文件。

[ibm Nasm 文章](https://www.ibm.com/developerworks/cn/linux/l-gas-nasm.html)
[Linux 汇编语言程序设计 (使用 NASM)](https://www.dazhuanlan.com/2019/12/05/5de86d1c77ab8/)

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
# makefile
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

#### 软中断与硬件中断的区别

硬件中断的中断码从`0`到`256`，直接对应操作系统内核里的中断处理程序，而软中断`80H`只算硬件中断中的一个，专门用来处理应用程序发起的系统调用，系统调用号约定号存储在`eax`中。

### 保护模式下内存寻址

```asm
[BASE + ( INDEX x SCALE ) + DISP ]
```

其中`BASE` 与 `INDEX` 可以是任意常用寄存器，`SCALE`可取`2 4 8`等，`DISP` 是常数。

### 调用子过程

```asm
section .text
global _start
_start:
	nop
    call printHelloWorld

printHelloWorld:
    push rax ; 保护现场
    push rbx ; 保护现场
    push rcx ; 保护现场
    push rdx ; 保护现场
	mov eax, 4      ; sys_write 系统调用
	mov ebx, 1      ; 输出到 文件描述符 1
	mov ecx, msg    ; 起时位置
	mov edx, len    ; 长度
	int 80h         ; 发送中断，开始系统调用
    pop rdx ; 恢复现场
    pop rcx ; 恢复现场
    pop rbx ; 恢复现场
    pop rax ; 恢复现场
    ret

section .data ; 数据段
    msg:
        db "Hello world", 10 , "nice to meet you !", 10 ; 10 是换行符 \n 的 assic 码
    len equ $ - msg ; nasm编译时，计算 msg: 到本行的字节长度, 赋值给 len
section .bss ; 保存为被初始化的数据的 .bss 段
```

## 常用汇编指令

### jnz 条件跳转

```asm
; 数据段
section .data
    Snippet db "CODEKISSYOUNG"  ; 长度 13

; 程序段
section .text
global _start
_start:
	nop
    mov ebx, Snippet
    mov eax, 13
DoMore:
    add byte [ebx], 32  ; 通过 + 32 将大写字母 修改为 小写
    inc ebx             ; ebx 地址 ++
    dec eax             ; eax 归零后，ZF = 0，jnz 判断为 false，不再跳转到 DoMore
    jnz DoMore
```

### 四则运算

#### 相反数（求补运算）

```asm
mov eax, 42     ; eax = 42          : 42
neg eax         ; eax = - eax       : -42
add eax, 42     ; eax = eax + 42    : 0
```

```asm
; 乘法
mov eax, 447
mov ebx, 1739
mul ebx         ; eax = eax * ebx
```

## 示范程序

```asm
; systemcall.asm 从标准输入读取字符，一次一个Byte，如果是小写字母，就换成大写字母
section .text ; 程序段
global _start
_start:
	nop
Read:
    mov eax, 3              ; 指定 sys_read 系统调用
    mov ebx, 0              ; 文件描述符 0
    mov ecx, Buff           ; 缓冲区地址为 Buff
    mov edx, 1              ; 读取字符数 1 byte
    int 80H
    cmp eax, 0              ; 如果 eax 为0， 说明到了 EOF
        je Exit
    mov r15, [Buff]         ; 用 r15 查看下 Buff 内存处的值
    cmp byte [Buff], 'a'    ; 字符 < a ，直接输出
        jb Write
    cmp byte [Buff], 'z'    ; 字符 > z，直接输出
        ja Write
    sub byte [Buff], 20H    ; a <= 字符 <= z，所以通过 - 20H 转换为大写字符，再输出
        jmp Write
Write:
    mov eax, 4                  ; sys_write
    mov ebx, 1                  ; 文件描述符
    mov ecx, Buff               ; 缓冲地址
    mov edx, 1                  ; 写入字节
    int 80h
    jmp Read
Exit:
	mov eax, 1      ; exit 系统调用号
	mov ebx, 0      ; return 0
	int 80h         ; 发送中断，开始系统调用

section .data       ; 数据段
section .bss        ; 保存为被初始化的数据的 .bss 段
    Buff resb 1
```

上面是缓冲区大小为`1`，读取一段字符的系统调用次数是非常多的，下面程序是将缓冲区大小设置为 1024，这样只需要一次系统调用，然后批量修改小写字母为大写字母，就可以达到目的，优化后的代码如下：

```asm
section .text ; 程序段
global _start
_start:
	nop
Read:
    mov eax, 3              ; 指定 sys_read 系统调用
    mov ebx, 0              ; 文件描述符 0
    mov ecx, Buff           ; 缓冲区地址为 Buff
    mov edx, BuffLen        ; 读取字符数 1 byte
    int 80H
    mov esi, eax            ; 复制系统调用返回值，保存在 esi 中
    cmp eax, 0              ; 如果 eax 为0， 说明到了 EOF
        je Exit

;   扫描缓冲区，改写小写字符为大写
    mov ebp, Buff           ; 基址
    mov ecx, esi            ; 保存读入的字节数到 ecx，即为偏移量
    dec ecx                 ; ebp + ecx 是越界地址，所以调整偏移量 ecx - 1
Scan:
    cmp byte [ebp + ecx], 'a'    ; 字符 < a ，直接输出
        jb Next
    cmp byte [ebp + ecx], 'z'    ; 字符 > z，直接输出
        ja Next
    sub byte [ebp + ecx], 20H    ; a <= 字符 <= z，所以通过 - 20H 转换为大写字符，再输出
Next:
    dec ecx
    jnz Scan                     ; 如果还有字符，继续 Scan

Write:
    mov eax, 4                  ; sys_write
    mov ebx, 1                  ; 文件描述符
    mov ecx, Buff               ; 缓冲地址
    mov edx, esi                ; 写入字节
    int 80h
    jmp Read

Exit:
	mov eax, 1      ; exit 系统调用号
	mov ebx, 0      ; return 0
	int 80h         ; 发送中断，开始系统调用

section .data       ; 数据段
section .bss        ; 保存为被初始化的数据的 .bss 段
    BuffLen equ 1024
    Buff resb BuffLen
```

调用效果如下：

```bash
$ systemcall
hello world!
hELLO WORLD!
FUck you Bitch
FUCK YOU BITCH
```

`hexdump`程序，将来自标准输入的字符全部用 16 进制打印出来。

## 使用 标准 C 函数库的汇编程序

![](https://img.codekissyoung.com/2020/04/07/cc4a5a65bac2693390ecc8e43cccd6e1.png)

C 函数调用公约：

> PS： 这里强调下，这只是 32 位 C 函数调用公约，升级到 64 位后，调用约定完全变化了！！！所以下面的编译也使用了 32 位的编译方式。

- 函数必须暂存 `EBX` `ESP` `EBP` `ESI` `EDI` 寄存器，调用后恢复
- 传递给函数的参数，以与参数顺序相反的顺序压栈，`Func(foo, bar, bas)` 的压栈顺序：`bas` `bar` `foo`
- 参数由主调函数进行处理，一个个`POP`或则是修改`ESP`偏移
- 返回值存储在 `eax` 中
- 入口点从`_start:`改为`main:`

```asm
section .text

extern puts
global main

main:
    nop
    push ebp
    mov ebp, esp
    push ebx
    push esi
    push edi
    ;;;;;;;;;;;;;; 调用约定，保护现场

    push msg        ; 将 msg 地址压入栈，作为 puts 函数的入参
    call puts       ; 调用 glibc 中的 puts 函数
    add esp, 4      ; 清理栈，将 esp 调回 4 个字节

    ;;;;;;;;;;;;;; 调用约定，清理现场
    pop edi         ; 恢复保存的寄存器
    pop esi
    pop ebx
    mov esp, ebp    ; 返回之前销毁栈空间
    pop ebp
    ret             ; 将控制返回给 Linux

section .data
    msg: db "Hello world",0
section .bss
```

```makefile
# uselibc 32 位
uselibc : uselibc.o
	gcc -m32 uselibc.o -o uselibc
uselibc.o : uselibc.asm
	nasm -f elf32 -F dwarf uselibc.asm -l uselibc.lst
```

[inputString.asm](https://github.com/codekissyoung/linux-asm-32/blob/master/inputString.asm) 调用了 C 语言的`Scanf` `printf` `fgets`等函数。

## Nasm 汇编

### 常量

```asm
mov ax, 100             ; 十进制常量
mov bx, 0xa2            ; 十六进制常量
mov ax, 'ab'            ; 字符常量
db 'ninechars', 0, 0, 0 ; 字符串常量
dd 3.6525e2             ; 浮点数常量
```

### 伪指令

指示`Nasm`如何生成目标程序的一种指令。

```asm
DB、DW、DD、DQ、DT              ; 定义初始化数据
db 'Hello World'                ; eg

resb、resw、resd、resq、rest    ; 定义不含初始值的数据
Buffer resb 64                  ; 保留64个字节的内存空间

incbin  "pic.dat"               ; 引用全部文件
incbin  "pic.dat", 1024         ; 跳过前面 1024 字节
incbin  "pic.dat", 1024, 512    ; 跳过1024, 最多引用 512 字节

message db "Hello, world"       ; equ 配合标号使用，给一个符号绑定一个常量
msglen  equ $ - message         ; $ 是当前 减去 mesage 得到的字节数，这里是 12，msglen 永远都是 12

Times 次数 指令                 ; 指定指令重复执行的次数
zerobuf: Times 64 db 0          ; 64 字节的 0
```

### 有效地址、EA、effective address

有效地址为指令的一个操作数，运行时实际会映射到一个内存地址，在`Nasm`里它的表示和计算都非常简单，计算在方括号内的表达式，结果就是一个有效地址。

```asm
var db 'a', 'b', 'c', 'd'
buf db '1', '2', '3', '4'
mov al, [var+1]             ; 将 b 送入 al
mov [buf], al               ; al 里的 b 送入 [buf]
```

### 表达式

```asm
$                           ; 表示此表达式源程序开始的地址
$$                          ; 当前段地址
$ - $$                      ; 此表达式源程序开始的地址离开段的距离（字节数）
```

### 运算符

```asm
| 与 OR
^ 与 XOR
& 与 AND
<< 左移
>> 右移
+ - * / 加 减 乘 无符号数除法
% 无符号数余数
// 有符号数除法
%% 有符号数余数
～ 取操作数反码
-  求操作数的相反数
seg 取操作数的段地址
```

### 局部符号

以`.`开头的符号

```asm
label2:
    .loop
        ; 某些程序代码
        jne .loop      ; 事实上跳转到 label2: .loop
        ret
label3:
    .loop
        ;;;;;;;;;; 其他代码
        jne .loop       ; 事实上跳转到 label3: .loop
        ret
```

### 预处理器

以`%`开头的指令。

```asm
%include "readchr.mac"                  ; 引入别的源文件的宏
%define sum(a,b) a+b                    ; 单行宏
mov dl, sum(64,1)
%undef sum                              ; 取消 sum 的定义
```

### 汇编指引

```asm
[bits 16]               ; 16位模式
[bits 32]               ; 32位模式

; unix 下目标文件格式，支持的三个标准段名
[section .text]
[section .data]
[section .bbs]

[ORG 0100H]               ; 指示程序代码必须从内存的 0100H 处开始存放
```
