# Linux下汇编语言

在`Linux`下学习汇编语言的笔记。

## 背景知识

不同的CPU(`x86`、`x86-64`、`PowerPC`、`ARM`等)平台的指令集不同，针对不同的指令集，汇编器(`nasm`、`masm`、`as`、`yasm`等)可以将汇编语言编译成对应平台的目标文件。

目前常用的汇编语言有两种：`intel`和`AT&T`,不同汇编器可能支持其中一种或两种。

个人觉得`intel`汇编语言比较简洁易懂，学习资料比较多。但是`Unix/Linux`系统、`Gcc`编译器都是默认使用`AT&T`汇编语言的。下图可以感受下`AT&T`(红色)反人类的设计。

![ATT 和 I](https://img.codekissyoung.com/2019/09/28/3e84de28b76b2b71fcf57126d196f821.png)

**nasm 汇编器**

```bash
sudo apt-get install nasm                    # 安装
nasm -hf                                     # 查看其支持的 .o 文件格式
nasm -g                                      # 生成带调试信息的 .o
nasm -F                                      # 调试信息格式, 常用的为 dwarf , stabs 已经过时了
nasm -g -f elf64 -F dwarf -o hello.o hello.s # 实际案例
```

**objdump 反汇编器** 


**insight 调试器**

安装: [Ubuntu 16.04安装Insight实现汇编的调试](https://www.cnblogs.com/EasonJim/p/7235972.html)

## 寄存器

32位寄存器:

![寄存器](https://img.codekissyoung.com/2019/09/28/e3590522730d21905506a399d8453998.png)

![通用寄存器](https://img.codekissyoung.com/2019/09/28/67326c3c637b357a44092e781680c6e4.png)

64位寄存器:

```asm
1F : eflags
2I : rdi(字符串操作的 dest index) rsi(字符串操作的 src index)
3P : rbp(一般指向栈中数据) rip(程序计数器PC) rsp(指向栈顶)
4X : rax(用于返回值) rbx(用于指向数据段数据) rcx(用于循环计数) rdx(I/O pointer)
8R : r8, r9, r10, r11, r12, r13, r14, r15
6S : CS, DS， ES, SS, FS, GS  段寄存器，一般64位下汇编程序，不再操作这几个了
```

![段寄存器](https://img.codekissyoung.com/2019/09/28/efb484359503c873e5cccdd13d624112.png)

#### 标志寄存器 Eflags

![标志寄存器](https://img.codekissyoung.com/2019/09/28/f3d848577191d3fa94a3432eae5ea246.png)

| 标志位 | 名称 | 作用 |
| ------ | ------ | ------ |
| `CF` Carry Flag | 进位标志 | 运算结果产生进位 |
| `ZF` Zero Flag | 零标志 | 指令结果为 0 |
| `SF` Sign Flag | 负数标志 | 运算结果为 负数 |
| `OF` Overflow Flag | 溢出标志 | 有符号加减 溢出 |
| `TF` Trap flag | 单步调试标志 | 设置后，每执行一条指令，产生一个单步中断 |
| `IF` Interrupt-enable Flag | 中断屏蔽标志 | 设置`IF = 0` CPU屏蔽部分中断(包括单步中断) |
| `PF` Parity Flag | 奇偶标志 | 运算结果中 1 的个数为偶数 |
| `AF` Auxiliary Carry Flag | 辅助进位标志 | 发生低字节向高字节进位/借位 |
| `VM` Virtual Model | 虚拟8086模式标志 | 设置后,CPU处于虚拟8086方式下工作|
| `AC` Alignment Check | 对齐标志 | 如果没在边界寻找一个字或者双字 则会设置该标志 |
| `RF` Restart Flag | 重启标志 | |
| `VIF` Virtual Interrupt Flag | 虚拟`IF` | `Pentium` 之后处理器有效 |
| `VIP` Virtual Interrupt Pause | 虚拟中断标志 | 在多任务环境下，给操作系统提供虚拟中断标志和中断暂挂信息|

## 寻址方式

在指令中,指定操作数存放位置的方法称为寻址方式。

![16位](https://img.codekissyoung.com/2019/09/29/d905a317ec611edcd71ceda3bbe966a0.png)

以及只有在32位以上才可以使用的:

![2019-09-29 00-37-22 的屏幕截图.png](https://img.codekissyoung.com/2019/09/29/20bd73d552e3d492bb720d7b960e91b3.png)

```asm
mov eax,[ebx+ebp]               ; 默认段寄存器 DS
mov edx,ES:[eax*4 + 200H]       ; 指定段寄存器为 ES
mov [esp + edx*2],eax           ; 默认 SS
mov ebx,GS:[eax + edx*2 + 300H] ; 指定 GS
mov ax,[esp]                    ; 默认 SS
```

## 汇编指令

### 操作符和变量

在高级语言中，要表达一个变化的值，需要一个具有某种数据类型的变量，该变量的名字称为标识符。汇编语言里面也类似，只是符号名的说明和引用方式不同而已。

#### 定义变量

格式: 

```bash
[变量名]  数据定义符  表达式1,表达式2,...
```

数据定义符号包括: `db`定义字节、 `dw`定义字、 `dd`定义双字、 `dq`定义8个字节

```asm
counter db 6
        db 'A','D',0DH,'$'
msg     db "i am a student"

myword  dw 89H, 1909H, -1
        dw 0ABCDH, 0

mydword dq 012345678H, 0H, -1234H
        dq 1238H
```


## C 与 汇编

#### 空函数
```c
long empty_func()
{

}
```

```asm
empty_func:
  push rbp      ; 保护现场，保存调用方的栈基
  mov rbp, rsp  ; 将 新栈顶 作为本函数的栈基
  nop           ; 因为是空函数，所以什么也不做
  pop rbp       ; 恢复现场, 恢复调用方的栈基
  ret
```

#### 带有返回值的函数

```c
long return_func()
{
	return 42;
}
```
```asm
return_func:
	push rbp
	mov	rbp, rsp
	mov	eax, 42		; 函数的返回值放在 eax
	pop	rbp
	ret
```

#### 函数传值

```c
long return_func( long a , long b )
{
	return a;
}

int main(){
  return_func( 20, 30 );
  return 0;
}

```

```asm
return_func:
	push	rbp
	mov	rbp, rsp

	mov	QWORD PTR -8[rbp], rdi    ; 将局部变量 a 放在 (当前栈基 - 8) 地址处 
	mov	QWORD PTR -16[rbp], rsi   ; 将局部变量 b 放在 (当前栈基 -16) 地址处
	mov	rax, QWORD PTR -8[rbp]    ; 再将 a 的值，移入 rax

	pop	rbp
	ret

main:
  ...
	mov	esi, 30
	mov	edi, 20
	call	return_func
  ...
```

#### 函数传非常多个值

```c
long multi_parm( long a , long b, long c, long d, long e, long f, long g, long h, long i )
{
	return g + h + i;
}
```

对于6个以内的传值(包括指针)，依次使用`rdi rsi rdx rcx r8 r9`传值，多于 6 个的话, 则直接使用 调用方 的栈来操作。 

```asm
multi_parm:
	push	rbp
	mov	rbp, rsp

	mov	QWORD PTR -8[rbp], rdi		# a
	mov	QWORD PTR -16[rbp], rsi		# b
	mov	QWORD PTR -24[rbp], rdx		# c
	mov	QWORD PTR -32[rbp], rcx		# d
	mov	QWORD PTR -40[rbp], r8		# e
	mov	QWORD PTR -48[rbp], r9		# f

	mov	rdx, QWORD PTR 16[rbp]		# g , 16[rbp] 这个计算后就是调用方的栈地址
	mov	rax, QWORD PTR 24[rbp]		# h
	add	rdx, rax
	mov	rax, QWORD PTR 32[rbp]		# i
	add	rax, rdx

	pop	rbp
	ret
```

总结下函数调用栈的主要功能:

- 保存 调用方(上层函数) 的调用状态(保存现场 + 恢复现场操作)
- 保存当前函数的局部变量
- 为下层函数调用做参数准备(当参数多于6个时)

函数调用方式:

- 普通调用
  - `call` 和 `ret`
  - `call` 和 `ret` 加 `enter` 和 `leave`
  - `enter` 和 `leave`可以用来辅助设置和清理调用栈

- 系统调用
  - 通过 `int 0x80` 中断
  - `sysenter` 和 `sysexit`
  - `syscall` 和 `sysret`

**Near Call** : 调用函数在当前代码段,一般一个进程内的函数都在一个代码段内。

**Far Call** : 调用函数在其他代码段，一般用于系统调用 或 调用其他进程内的函数。

## HelloWorld例子

```asm
; test.s 例子
global _start
section .data
    hello : db `hello, world!\n`
section .text
    _start:
        mov     rax, 1          ; system call number should be stored in rax
        mov     rdi, 1          ; argument #1 in rdi: where to write (descriptor)?
        mov     rsi, hello      ; argument 2 in rsi: where does the string start?
        mov     rdx, 14         ; argument #3 in rdx: how many bytes to write?
        syscall                 ; this instruction invokes a system call
        mov     rax, 60         ; 'exit' syscall number
        xor     rdi, rdi
        syscall
```

```bash
$ nasm -g -f elf64 -F dwarf test.s -o test.o # 编译
$ objdump -d -M intel test.o                 # 查看生成的目标文件，可以观察到，没有给程序的入口分配地址

0000000000000000 <_start>:
   0:	b8 01 00 00 00       	mov    eax,0x1
   5:	bf 01 00 00 00       	mov    edi,0x1
   a:	48 be 00 00 00 00 00 	movabs rsi,0x0
   ...
```

```bash
$ ld test.o -o test             # 链接
$ objdump -d -M intel test      # 链接后，就有程序入口地址了，可以执行它了

00000000004000b0 <_start>:
  4000b0:	b8 01 00 00 00       	mov    eax,0x1
  4000b5:	bf 01 00 00 00       	mov    edi,0x1
  4000ba:	48 be d8 00 60 00 00 	movabs rsi,0x6000d8
  ...

$ ./test                        # 执行
hello, world!
```
