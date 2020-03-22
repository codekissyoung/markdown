# 汇编语言

16 位 8086 CPU 的相关知识。

[项目下载地址](https://github.com/codekissyoung/masm)

## 环境搭建

环境是`ubuntu 18.04`下的`doxbox 0.74`模拟器，另外需准备`DOS`系统下的编译调试工具`debug.exe`、`link.exe`和`masm.exe`。

```bash
sudo apt-get install dosbox     # 安装
vim ~/.dosbox/dosbox-0.74.conf  # 配置
```

```bash
# dosbox-0.74.conf
[autoexec]
mount c ~/workspace/masm/
c:
```

```bash
masm/               # 项目目录
├── debug.exe
├── LINK.EXE
└── MASM.EXE
```

## 寄存器

通用寄存器: `AX` `BX` `CX` `DX`

段地址寄存器： `DS` `ES` `SS` `CS`

偏移地址寄存器: `SP` `BP` `SI` `DI` `IP`

上面所有寄存器都是 16 位的，而通用寄存器又可以拆成两个小寄存器，例如`AX`可以拆成`AH`与`AL`。

数据总线的长度也是 16 位，能一次性处理的、传输、存储的信息为 16 位。

地址总线设计为 20 位，能访问到`1MB`的地址，那么现在问题来了，在所有存储数据都是 16 位的情况下，CPU 如何使用这个 20 位的地址总线呢？

> 答案是：拼凑下。`内存地址 = 段地址 * 16 + 偏移地址`，例如：
> `CS x 16 + IP` 等于当前指令所在的内存地址
> `DS x 16 + [0]` 就是数据所在的内存地址

在 CPU 内部，这个拼凑就是通过地址加法器实现的：

![2019-09-10 18-16-42 的屏幕截图.png](https://img.codekissyoung.com/2019/09/10/c421eed8fac926efc6acdcc198ee1bf5.png)

指令要求，操作数的位数要一致。比如`mov ax,bl`就是错误的

```asm
mov ax, 18      ; ax = 18
add ax, 8       ; ax = ax + 8
mov ax, bx      ; ax = bx
add ax, bx      ; ax = ax + bx
jmp 2AE3:3      ; CS = 2AE3H  IP = 0003H
mov ax,1000H
jmp ax          ; IP = ax
```

指令是有长度的，一条指令可能占两个字节、三个字节。

`8086 CPU`加电启动后，默认`CS=FFFFH IP=0000H`，即从`FFFF0H`开始读取指令执行。任意时刻，CPU 都将`CS:IP`指向的内存地址处的二进制信息，当作指令来执行。

![2019-09-10 18-26-00 的屏幕截图.png](https://img.codekissyoung.com/2019/09/10/8f4a260a2621506e114da563b8f7deb3.png)

读取一条完整指令后，`IP`中的值自动增加指令所占用的字节数，此时`CS:IP`指向`2000:0003`,即下一条指令开始位置。

![2019-09-10 18-27-36 的屏幕截图.png](https://img.codekissyoung.com/2019/09/10/0430b60fc5202d4eb08909806b68197d.png)

执行控制器将一条指令执行完毕后，`CPU`继续读取`CS:IP`指向的下一条指令，依次执行完所有指令。

![2019-09-10 19-51-29 的屏幕截图.png](https://img.codekissyoung.com/2019/09/10/51a19b312400ef6ba0488177fadaf840.png)

## 内存访问

`CPU`读写一个内存单元时，必须给出这个内存单元的 `地址` 和 `读取长度`：

- 内存地址由`DS`和偏移量组成
- 长度就是依据寄存器的类型来确定的

```masm
mov bx,1000H   ; 不支持直接将数据送入段寄存器的操作，所以这里使用了 bx
mov ds,bx
mov al,[0]     ; al = ds[0] 传送一个 字节
mov cx,[0]     ; cx = ds[0] 传送一个 字
mov [1],al     ; ds[1] = al
mov [1],cx     ; ds[1] = cx
add al,[0]     ; al = al + ds[0]
```

### 栈机制

`CPU` 拥有的寄存器个数是有限的，并且所有程序共用，所以设计了栈机制。

栈是一段连续的普通内存单元，`SS:SP` 指向的内存地址称为`栈顶`，入栈 `PUSH`就是保存寄存器数据到内存，出栈`POP`是恢复数据到寄存器。所有操作都是以 `字` 为单位。栈顶从高地址向低地址方向增长。

```asm
push ax      ; ax 数据入栈，SP = SP - 2
pop  ax      ; 数据出栈 存入 ax
push [0]     ; 将1000:0 处的字压入栈
pop  [2]     ; 出栈，数据存入1000:2处
```

`PUSH AX` 入栈指令执行过程：

- 先 `SP = SP - 2`
- 再将 `AX` 中数据，存入`SS:SP`指向的内存中

`POP BX` 出栈指令执行过程:

- 将`SP:SP`指向的内存中的内容，拷贝到`BX`中
- `SP = SP + 2`

`SS` 设定好时，`SP` 设置为`0x0000`时，栈的容量最大。当第一次`PUSH`时，`SP - 2` 等于 `0xFFFE`。可以推算出，可以存放 `65536 / 2 = 32768` 个字型数据，大小为 `64KB`。

### 代码段、数据段、栈段

现在我们手里可用的段寄存器有`CS` `DS` `SS`，分别代表代码段、数据段、栈段，正常的一个程序都会用到。它们的实际地址，是不做要求的，完全由程序员自行决定。

`数据段`：使用`mov`、`add`、`sub` 访问内存单元时，CPU 将这个段里的二进制信息，当作数据来使用。

`代码段`： 任意时刻，CPU 都将`CS:IP`指向的内存地址处的二进制信息，当作指令来执行。设定 `CS:IP` 就是设置程序的入口。

`栈段`：CPU 将某段内存当作栈，只是因为`SS:IP`指向了那里。，将栈顶单元的偏移地址放在`SP`中，这样 CPU 在进行`push`、`pop`操作时，就将我们定义的栈段当作栈空间来用。

### 第一个程序

```asm
; test.asm
assume cs:codesg    ; 伪指令 假设 cs 寄存器 与 codesg 段关联

codesg segment      ; 伪指令 段开始

    mov ax,0123H    ; 汇编指令
    mov bx,0456H
    add ax,bx
    add ax,ax

    mov ax,4c00H    ; 退出程序指令，规定要写
    int 21H

codesg ends         ; codesg 段结束

end                 ; 伪指令 汇编代码结束
```

```bash
$ dosbox        # 进入 dos 模拟器

C:\> masm test.asm;        # 编译
C:\> link test;            # 链接
C:\> test                  # 执行
C:\> debug test.exe        # 调试，单步执行
-r                      # 查看所有寄存器
```

为了观察程序运行，我们使用`DEBUG` 工具将程序载入内存，设置`CS:IP`指向程序的入口，但`DEBUG`又不放弃对`CPU`的控制，这样我们就可以用`DEBUG`的相关命令来单步执行程序，查看每一条指令执行的结果。

![](https://img.codekissyoung.com/2020/03/22/eae01c3d7b30c2d4b2b73df2c6186ee3.png)

然后一直按`-t`，单步调试，观察寄存器的变化。

用 DEBUG 调试上面程序，通过 `-d cs:0` 可以查看程序段。

#### 栈的观察

```asm
assume cs:codesg

codesg segment
	mov ax,2000H
	mov ss,ax
	mov sp,0H
	add sp,10H
	pop ax
	pop bx
	push ax
	push bx
	pop ax
	pop bx

	mov ax,4C00H
	int 21H
codesg ends
end
```

#### 循环 loop 指令

`loop` 指令执行过程:

- `cx = cx - 1`
- 判断: 如果 `cx > 0` 跳转到某个指令处执行，如果`cx = 0`则继续向下执行

编程完成乘法 : `123 * 236`

```asm
assume cs:code

code segment

    mov ax,0
    mov cx,236
mul:
    add ax,123
    loop mul

    mov ax,4C00H
    int 21H
code ends

end
```

PS: 汇编程序中，数据不能以字母开头，例如`A000H` 要写成 `0A000H`。

## 使用多个段的程序

使用了数据，但是未使用段的一个程序：

```asm
assume cs:code

code segment

; 16 字节 数据
dw 1, 1, 1, 1, 1, 1, 1, 1

start:              ; start 标记 : 链接后, CS:IP 指向的位置

    mov bx, 0       ; 设置偏移地址
    mov ax, 0       ; 归零
    mov cx,8        ; 设置循环次数
    s:
        add ax, cs:[bx] ; 指定从 CS:bx 里读取数据
        add bx, 2       ; 每次读取 2 字节, 所以自增 2
        loop s

    mov ax, 4c00h
    int 21h
code ends

end start
```

加上一个数据段改造后：

```asm
assume cs:code,ds:data

; 数据段 ds
data segment
    dw 0001H,0002H, 0003H, 0004H, 0005H, 0006H, 0007H, 0008H ; 16 字节 数据
data ends

; 代码段 cs
code segment
start:              ; start 标记 : 链接后, CS:IP 指向的位置

    ; set ds
    mov ax, data
    mov ds, ax      ; ds = data

    mov ax, 0       ; 归零
    mov bx, 0       ; 设置偏移地址
    mov cx, 8       ; 设置循环次数
    s:
        add ax, ds:[bx] ; 指定从 ds:bx 里读取数据
        add bx, 2       ; 每次读取 2 字节, 所以自增 2
        loop s

    mov ax, 4c00h
    int 21h
code ends

end start
```

再加一个栈段后：

```asm
assume cs:code,ds:data,ss:stack
; 数据段 ds
data segment
    dw 0001H,0002H, 0003H, 0004H, 0005H, 0006H, 0007H, 0008H ; 16 字节 数据
data ends
; 栈段 ss
stack segment
    dw 0, 0, 0, 0, 0, 0, 0, 0 ; 程序执行后 => 0,0,0,0,1,2,3,4
stack ends
; 代码段 cs
code segment
start:              ; start 标记 : 链接后, CS:IP 指向的位置
    mov ax, stack
    mov ss, ax      ; ss = stack
    mov sp, 16

    mov ax, data
    mov ds, ax      ; ds = data

    push ds:[0]     ; stack[14] = ds[0]
    push ds:[2]     ; stack[12] = ds[2]
    push ds:[4]     ; stack[10] = ds[4]
    push ds:[6]     ; stack[8]  = ds[6]

    mov ax, 4c00h
    int 21h
code ends
end start
```

## 更灵活地定位内存地址的方法

`ASCII` 字符：

```asm
data segment
    db 'unix'
    db 'link'
data ends

code segment
    mov al, 'a'
    mov bl, 'x'
code ends
```

更多的内存寻址方式：

`15[si]` 表示 `ds:si +15` 处的内存地址，用于复制字符串程序：

```asm
assume cs:code,ds:data,ss:stack

data segment
    db 'welcome to masm'    ; 15 byte
    db '...............'
data ends

stack segment
    dw 0, 0, 0, 0, 0, 0, 0, 0
stack ends

code segment
start:              ; start 标记 : 链接后, CS:IP 指向的位置

    mov ax, data
    mov ds, ax      ; set ds = data

    mov si, 0
    mov cx, 14          ; copy 15 times
    s:
        mov ax, 0[si]   ; copy byte to ax
        mov 15[si], ax  ; copy ax to 15 offset byte
        add si, 1
        loop s

    mov ax, 4c00h
    int 21h
code ends
end start
```

## 数据处理的两个基本问题

### 处理的数据在什么地方?

在`8086`中，只有`bx` `si` `di` `bp` 可以用在`[...]`寻址中，并且只允许以下固定组合：

```asm
mov ax, [num]             ; 单个 num
mov ax, [bx + num]        ; 任意单个, num 可选
mov ax, [bx + si + num]   ; si 可替换成 di , num 可选
mov ax, [bp + si + num]   ; si 可替换成 di , num 可选

mov ax, [bx + bp]         ; 错误示范
mov ax, [si + di]         ; 错误示范
```

数据只可能在以下三个地方：

```asm
mov bx, [0] ; 内存 ds:0 单元中， 称为 内存中
mov bx, ax  ; 内部寄存器中，称为 寄存器
mov bx, 1   ; 指令的一部分，称为 立即数
```

### 要处理的数据有多长?

#### 寄存器名称表明了数据的尺寸

8086CPU 中，可以处理两种尺寸的数据`byte`和`word`，所以机器指令中要指明操作的是`byte`还是`word`。

```asm
mov ax,1        ; 字操作
inc ax
add ds,ax

mov al,1        ; 字节操作
mov bl,al
inc al
```

#### 使用 ptr 明确指明

```asm
mov word ptr ds:[0], 1       ; 字操作
inc word ptr [bx]
add word ptr [bx], 2

mov byte ptr ds:[0], 1       ; 字节操作
inc byte ptr [bx]
add byte ptr [bx], 2
```

#### 指令类型默认操作操作数据长度

`PUSH` `POP` 指定操作的数据就是`word`。

#### div 除法指令

```asm
div byte ptr ds:[0] ; 商 al = ax / ds:0 , ah = 余数
div word ptr es:[0] ; 商 ax = (dx * 10000H + ax) / es:0 , dx = 余数
div byte ptr [bx + si + 8] ; 商 al = ax / (ds*16 + si + 8), ah = 余数
div word ptr [bx + si + 8] ; 商 ax = (dx * 10000H + ax) / (ds * 16 + bx + si + 8), dx = 余数
```

#### dd 、dup

双字：

```asm
dd 100001               ; 定义 4 byte
```

`db 重复次数 dup (重复的db类型数据)`，里面的 `db` 可替换为`dw`、`dd`：

```asm
db 3 dup (0)            ; 定义 3 byte, 初始化为 0
db 3 dup (0,1,2)        ; 定义 9 byte, 0、1、2，0、1、2，0、1、2
db 3 dup ('abc','ABC')  ; abcABCabcABCabcABC
```

## 转移指令的原理

8086CPU 中转移指令分为以下几类:

- 无条件转移指令 `jmp`
- 条件转移指令
- 循环指令 `loop`
- 过程
- 中断

这些转移指令的前提条件可能不同，但是转移的原理都是相同的，这里只讨论学习`jmp`的实现原理。

## 10. CALL 和 RET 指令

## 11. 标志寄存器

标志寄存器作用:

- 用来存储相关指令执行后的 结果
- 用来为 CPU 执行相关指令提供 行为依据
- 用来控制 CPU 的相关工作方式

`8086CPU`的标志寄存器也是 16 位，其中存储的信息通常被称为程序状态字`PSW`,标志位的情况如下:

![屏幕快照 2019-09-20 下午7.07.26.png](https://img.codekissyoung.com/2019/09/20/fffd2756303356fe67f0246828e73935.png)

`ZF` 记录 指令执行结果 是否为`0`,如果为`0`,则`ZF = 1`。

`PF` 记录 指令执行结果 中，所有`bit`位中`1`的个数是否为偶数，如果是`PF = 1`。

`SF` 记录 指令执行结果 是否为负数，如果为负数，则`SF = 1`。

`CF` 记录 指令执行结果 中产生的进位，只对无符号数的运算有意义

`OF` 记录 指令执行结果 中的溢出，只对有符号数的运算有意义，比如`98 + 99` 超过了 `127`, 一个`byte`表示有符号数的话，没有对应的结果的表示方法，称为溢出。

## 12. 内中断

任何 CPU 都有这样的设计，在执行完一条指令后，检测到从 CPU 外部、内部产生的一种特殊信息，并且可以立即对所接收的信息进行处理。这种信息称为：中断信息。

内中断信息:

- 除法错误，比如`div`指令产生的溢出
- 单步执行
- 执行 `into` 指令
- 执行 `int` 指令

对于这些不同的中断信息，CPU 通过`中断码`来区分，它是一个字节，可以表示 256 种中断类型，比如在`8086CPU`中:

- 除法错误 0
- 单步执行 1
- `into`指令 4
- `int`指令 n(字节型立即数)

CPU 收到中断信息后，需要进行处理，如何处理是由操作系统中的中断处理程序决定的。一般来说，不同的中断信息需要不同程序进行处理。

那么现在的问题就是，CPU 收到中断信息后，如何将`CS:IP`指向对应的中断程序入口？

> 答案就是 操作系统在 内存中 维护了一张 中断向量表，表中记录了 每一个 中断信息 对应的 处理程序的 入口地址

现在问题变成了，CPU 如何找到中断向量表？

> 答案 不同的 CPU 会 规定死 中断向量表 在内存中的存储位置。例如，8086CPU 规定，0000:0000 ~ 0000:03FF 这 1024 个单元 存放中断向量表

### 中断过程

中断过程: CPU 收到中断信息，然后在中断向量表中找到处理程序的入口地址，然后用这个地址设置`CS:IP`，这个工作是 CPU 的硬件自动完成的。之后，CPU 就是在执行中断处理程序  了。

中断处理程序处理好后，还需要恢复原程序的执行，所以在中断之前，必须要保存原程序的执行现场。

具体的中断过程如下:

1. 从中断信息中取得 `中断码`
1. 标志寄存器 入栈，保护现场
1. 设置标志寄存器中 `TF = 0 IF = 0`
1. CS 寄存器入栈 IP 寄存器入栈
1. 根据 中断向量表 中 该 `中断码` 对应的程序入口，设置 `CS:IP`
1. 开始执行由程序员编写的中断处理程序

### 中断处理程序的编写

CPU 随时都能检测到中断信息，所以随时都可能执行中断处理程序，所以中断处理程序自系统运行就必须常驻内存，它的入口被写入中断向量表中。

中断处理程序的编写步骤:

- 保存用到的寄存器
- 处理中断
- 恢复用到的寄存器
- 用`iret`指令返回，`iret`指令会执行`POP IP; POP CS; popf;`操作，将中断之前原程序的 `CS` `IP` 和 标志寄存器的值恢复

至此，中断过程处理结束。

### 实模式下的 DEBUG 程序是如何实现的？

x86 系列的 cpu 有个中断叫单步,也就是 int1, 这个中断不能由程式发出,但只要标志暂存器里的第 09bit(也就是 IF)被设定为 1 时,则 cpu 每执行一条指令,都会产生一个 int1 单步中断.

一如其他的中断,cpu 会把控制权转移到中断向量表(0-400h)中,01 中断的地址上去(0:0003-0:0006),也是说,cp:ip 会跑到那个地址的新 cs:ip 去
先看图

![923b92529822720e92fa2c8471cb0a46f31fabe1.jpg](https://img.codekissyoung.com/2019/09/22/ad4d922aba2373b2b19ce04f9aab60d2.jpg)

随便载入一个程式,按 r 时,会看见一堆暂存器,其中有 cs:ip 的值,但这时候真正在内存运行的程式并不是那个被载入的程式,而是 debug 本身,debug 只是列出该程式被载入时的初始形况,当你按下 t, 或 p 或 g 时,debug 才会根据要求, [重新]把控制权,也就是 cs:ip 发还给被载入的程式.

至于如何取回控制权,就要看你键入 t,p,还是 g xxx 或紧跟其后的参数决定.

假如你按了 t, debug 会把一切环境还原到载入程式的那个被挂起的形况(按 R 时看见的一切),
做一些适当设定,再把标志暂存器的 if 设为 1,顺便改了中断表中的 int1 指向自己,最后才把被挂起桯式的 cs:ip 还原.

好了,该程式执行一条指令,触发单步中断,cpu 把控制权发还到 int1 的中断地址去,也就是 debug(之前修改了)

debug 回来了,保存刚被挂起程式的一切暂存器,并印出,然后等待你的下一步指示..
图中的 t 5 ,意即跟踪 5 步,在 debug 而言是做 5 次的单步工作

## 13. int 指令

## 14. 端口

## 15. 外中断

## 16. 直接定址表

## 17. 使用 BIOS 进行键盘输入和磁盘读写
