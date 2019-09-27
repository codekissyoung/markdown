# Linux下汇编语言

在`Linux`下学习汇编语言的笔记。

## 背景知识

不同的CPU(`x86`、`x86-64`、`PowerPC`、`ARM`等)平台的指令集不同，针对不同的指令集，汇编器(`nasm`、`masm`、`as`、`yasm`等)可以将汇编语言编译成对应平台的目标文件。

目前常用的汇编语言有两种：`intel`和`AT&T`,不同汇编器可能支持其中一种或两种。

个人觉得`intel`汇编语言比较简洁易懂，学习资料比较多。但是`Unix/Linux`系统、`Gcc`编译器都是默认使用`AT&T`汇编语言的。下图可以感受下`AT&T`(红色)反人类的设计。

![两种汇编语言](https://img.codekissyoung.com/2019/09/25/09a2e2be380cfdc18c491524529acbf7.png)

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
        mov     rsi, hello      ; argument #2 in rsi: where does the string start?
        mov     rdx, 14         ; argument #3 in rdx: how many bytes to write?
        syscall                 ; this instruction invokes a system call
        mov     rax, 60         ; 'exit' syscall number
        xor     rdi, rdi        ;   
        syscall
```

```bash
$ nasm -g -f elf64 -F dwarf test.s -o test.o # 编译
$ objdump -d -M intel test.o                 # 查看生成的目标文件，可以观察到，没有给程序的入口分配地址

test.o：     文件格式 elf64-x86-64
Disassembly of section .text:
0000000000000000 <_start>:
   0:	b8 01 00 00 00       	mov    eax,0x1
   5:	bf 01 00 00 00       	mov    edi,0x1
   a:	48 be 00 00 00 00 00 	movabs rsi,0x0
  11:	00 00 00 
  14:	ba 0e 00 00 00       	mov    edx,0xe
  19:	0f 05                	syscall 
  1b:	b8 3c 00 00 00       	mov    eax,0x3c
  20:	48 31 ff             	xor    rdi,rdi
  23:	0f 05                	syscall 
```

```bash
$ ld test.o -o test             # 链接
$ objdump -d -M intel test      # 链接后，就有程序入口地址了，可以执行它了

test：     文件格式 elf64-x86-64
Disassembly of section .text:
00000000004000b0 <_start>:
  4000b0:	b8 01 00 00 00       	mov    eax,0x1
  4000b5:	bf 01 00 00 00       	mov    edi,0x1
  4000ba:	48 be d8 00 60 00 00 	movabs rsi,0x6000d8
  4000c1:	00 00 00 
  4000c4:	ba 0e 00 00 00       	mov    edx,0xe
  4000c9:	0f 05                	syscall 
  4000cb:	b8 3c 00 00 00       	mov    eax,0x3c
  4000d0:	48 31 ff             	xor    rdi,rdi
  4000d3:	0f 05                	syscall 

$ ./test                        # 执行
hello, world!
```

### 寄存器

通用寄存器: `EAX`、`EBX`、`ECX`、`EDX`、 `EDI`、 `ESI`、`EBP` (32位)

栈顶寄存器: `ESP`

标志寄存器: 























