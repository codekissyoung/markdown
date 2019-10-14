# Linux下64位汇编语言

`Linux`下64位汇编语言学习记录。时至今日，汇编语言的重点已经不是编写汇编语言代码，而是看懂GCC编译器生成的汇编语言，本文正是以此为目标进行学习。

## 如何得到一个汇编语言模板

```c
#include <stdio.h>
int main()
{
	printf("helloworld\n");
	return 0;
}
```

对上面最经典的C语言入门程序使用 `gcc -S main.c -o main.s` ,便可得到一个汇编语言模板:

```c
	.file	"main.c"
	.text
	.section	.rodata
.LC0:
	.string	"helloworld"
	.text
	.globl	main
	.type	main, @function

main:
.LFB0:
	pushq	%rbp
	movq	%rsp, %rbp
	leaq	.LC0(%rip), %rdi
	call	puts@PLT
	movl	$0, %eax
	popq	%rbp
	ret
.LFE0:
	.size	main, .-main
	.ident	"GCC: (Ubuntu 7.4.0-1ubuntu1~18.04.1) 7.4.0"
	.section	.note.GNU-stack,"",@progbits
```

将无用的部分去除后，就是我们需要的汇编语言框架模板: 

```asm
.section .rodata

OUTPUT:
	.string "fuck you"

.text
	.globl	main

main:
	pushq	%rbp
	movq	%rsp, %rbp
	
	leaq	OUTPUT(%rip), %rdi
	call	puts@PLT

	movl	$0, %eax
	popq	%rbp
	ret
```

## 定义数据

常用的数据类型:

```bash
.ascii      # 文本字符串
.asciz
.string
.byte
.double
.float
.int
.long
.octa       # 16 字节整型
.quad       # 8 字节整型
.short      # 2 字节整型
```

定义方法:

```asm
.section .rodata

OUTPUT:
	.string "fuck you"
PI:
	.double 3.1415926			# 定义 double 类型
SIZES:
	.long 100, 500, 235			# 定义多个长整型
```

定义常量:

```asm
.section .rodata
	.equ LINUX_SYS_CALL, 0x80	        # 定义常量

main:
    ...
	movq	$LINUX_SYS_CALL, %rax       # 使用常量
```

定义未初始化变量:

```bash
.comm       # 声明未初始化的数据的通用内存区域
.lcomm      # 声明未初始化的数据的本地通用内存区域
```

```asm
.section .bss
.lcomm buffer, 10000			# 只是声明，不占用硬盘空间
```

```asm
.section .data
MY_BUFFER:
	.fill 10000                 # 填充 10000 字节，占用了磁盘空间
```

## 传送数据元素

![2019-10-14 16-41-58 的屏幕截图.png](https://img.codekissyoung.com/2019/10/14/3661422ae4f3c293249d660af463e147.png)

内存寻址模式:

```asm
base_address( offset, index, size )         # 格式
base_address + offset + index * size        # 所表示的地址
```

```asm
.section .data
value:
    .int 123
store:
    .int 0

main:
    movl value, %eax    # 内存 => 寄存器
    movl %eax, store    # 寄存器 => 内存
```

数组示范:

```asm
values:
    .int 10, 15, 20, 25, 30, 35, 40

main:

    movl $3, %edi
    movl values( , %edi, 4 ), %eax          # 将 values + 3 * 4 处的值(25)传送给 eax
```

间接寻址:

```asm
movl values, %eax       # 将 values 地址处存储的值(10) 传送给 eax
movl $values, %ebx      # 将 values 地址本身 传送给 ebx
```

```asm
movl $output, %edi      # 将 output 地址本身传送给 edi

movl %eax, %ebx         # 将 eax 的值传送给 ebx
movl %eax, (%edi)       # 将 eax 的值传送给 edi 存储的内存地址处( 即output处 )
```

对寄存器中内存地址进行偏移操作:

```asm
store:
    .int 0
values:
    .int 12, 13, 14, 15, 16,17 

movl $values, %edi
movl %eax, 4( %edi )    # 将 eax 的值传送到 value + 4 内存地址处( 13 所在位置)
movl %ebx, -4( %edi )   # 将 eax 的值传送到 value - 4 内存地址处( store 所在位置)
```

对于从较小的源传送到较大的目的地时，有两种类型的指令: 零拓展`MOVZ` 与 符号拓展`MOVS`: 

![2019-10-14 16-44-04 的屏幕截图.png](https://img.codekissyoung.com/2019/10/14/e8b170736d50820e4c63de753d3cff95.png)
![2019-10-14 16-45-02 的屏幕截图.png](https://img.codekissyoung.com/2019/10/14/504dcfd045b4a8a257dfc6645a6269fb.png)
![2019-10-14 17-29-30 的屏幕截图.png](https://img.codekissyoung.com/2019/10/14/f325f9e4e1d982a8d516666d7a1f7609.png)

## 栈操作

![2019-10-14 17-32-00 的屏幕截图.png](https://img.codekissyoung.com/2019/10/14/ddea02072b1a368344642bf7de5181f3.png)

## 算术和逻辑操作

![2019-10-14 17-34-09 的屏幕截图.png](https://img.codekissyoung.com/2019/10/14/4024827d8fe58065bd39797dd083f092.png)

位移例子:

![2019-10-14 18-06-25 的屏幕截图.png](https://img.codekissyoung.com/2019/10/14/a4588a0adbdc4eb993d949489749db05.png)

ps:只有最低位的字节才指示着位移量,所以是`%cl`。

## 特殊的算术操作

![2019-10-14 18-27-43 的屏幕截图.png](https://img.codekissyoung.com/2019/10/14/8a933aacac1283b947d03275950d85ff.png)

对于乘法: 其中一个乘数固定为`rax`,另一个乘数则是`mulq`的操作数 而得到的乘积，低位8字节存于`rax`,高位8字节存于`rdx`,下图为64位乘法实现的汇编代码:

![2019-10-14 20-07-35 的屏幕截图.png](https://img.codekissyoung.com/2019/10/14/6a7d70de3c13e0d1f14b50d7b41d97bf.png)

对于除法: 被除数放在`rdx`(高64位)`rax`（低64位）中，`rax`设置好后，`rdx`不需要人工赋值，而是通过`cqto`指令自动读出`rax`的符号位，然后设置到`rdx`的所有位; 除数则是`idivq`的操作数；除完后，商被保存在`rax`中，余数则保存在`rdx`中。下图是64位有符号数除法的实现:

![101420270708_02019-10-14 20-21-20 的屏幕截图.png](https://img.codekissyoung.com/2019/10/14/5111240dcb9a99b2666ff1323edb7d32.png)

对于无符号64位除法，则只需要将`rdx`强制设置为`0`，指令改用`divq` 即可:

![2019-10-14 20-30-38 的屏幕截图.png](https://img.codekissyoung.com/2019/10/14/a84584da839a0a1b8f5cdec166b8e9b8.png)

## 条件测试指令

![2019-10-14 22-48-04 的屏幕截图.png](https://img.codekissyoung.com/2019/10/14/c37fa86f4cddb275c069d018eae8984d.png)
![2019-10-14 21-24-54 的屏幕截图.png](https://img.codekissyoung.com/2019/10/14/94a2af7fc5f119675ef0d9ab7229f91c.png)

比较和测试指令只设置标志位，不改变任何寄存器的值。所以常常配合`set`指令使用:

![2019-10-14 21-30-31 的屏幕截图.png](https://img.codekissyoung.com/2019/10/14/f20467d8aa640e897177b555d89ec2a7.png)

```asm
# 函数 long comp( long a, long b ){ return a < b; }
comp:
    cmpq %rsi, %rdi     # 比较 S1 与 S2, 实际执行 S = S2 - S1, 然后根据 S 的情况设置标志位
    setl %al            # 根据标志位 SF ^ OF 的值，设置 al 为 0 或 1
    movzbl %al,%rax     # 将 rax 的高位全部清零
    ret                 # 返回给外部值为 0 或 1 (rax)

# 函数 long test( long a ) { return a > 0; }
test:
	testq   %rdi, %rdi      # a & a , 结果还是 a, 根据 a 的情况设置标志位
	setg    %al             # 根据 ～( SF ^ OF ) & ~ZF 设置 al 为 0 或 1
	movzbl  %al, %rax       # 将 rax 的高位全部清零
	ret                     # 返回给外部值为 0 或 1 (rax)
```

## 条件跳转指令

![2019-10-14 23-06-34 的屏幕截图.png](https://img.codekissyoung.com/2019/10/14/a3ed0518f5774fb30e4f6ddb5f0cfaee.png)

条件跳转例子:

![101500233236_02019-10-15 00-23-00 的屏幕截图.png](https://img.codekissyoung.com/2019/10/15/241b91c73e5ed6ecf1f94fc9c091a6d0.png)

