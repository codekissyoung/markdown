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

## 转移指令

转移指令就是能够修改到`CS` `IP`的指令，它们影响了程序的执行流程。

#### offset 指令

```asm
assume cs:code

code segment
start:                      ; start 标记 : 链接后, CS:IP 指向的位置
    s:
        mov ax, bx          ; 指令占 2 字节
        mov si, offset s    ; offset 取 s 相对 start 的偏移量，这里是 0x0000
        mov di, offset s0   ; 取 s0 相对 start 的偏移量，这里是 0x000E
        mov ax, cs:[si]
        mov cs:[di], ax
    s0:
        nop                 ; nop 的机器码占一个字节
        nop
    mov ax, 4c00h
    int 21h
code ends
end start
```

#### jmp short 标号

```asm
assume cs:code
code segment
    start:             ; start 标记 : 链接后, CS:IP 指向的位置
        mov ax, 0
        jmp short s    ; 跳到本段中 s 处执行, 实际操作是 IP = IP + offset_to_s
        add ax, 1
    s:
        inc ax
    mov ax, 4c00h
    int 21h
code ends
end start
```

#### jmp far ptr 标号

```asm
assume cs:code
code segment
    start:             ; start 标记 : 链接后, CS:IP 指向的位置
        mov ax, 0
        mov bx, 0
        jmp far ptr s  ; 跳到 s: 处执行
        db 256 dup (0)
    s:
        add ax, 1
        inc ax
    mov ax, 4c00h
    int 21h
code ends
end start
```

#### jmp 寄存器

```asm
jmp ax          ; IP = ax
```

#### 转移地址在内存中的 jmp 指令

`jmp word ptr`只修改 `IP`:

```asm
mov ax, 0123H
mov ds:[0], ax
jmp word ptr ds:[0] ; 执行后, IP = 0123H
```

`jmp dword ptr` 修改 `CS` 与 `IP`

```asm
mov ax, 0123H
mov ds:[0], ax
mov word ptr ds:[2], 0
jmp dword ptr ds:[0]    ; 执行后 CS:IP =0000:0123
```

#### 条件转移 jcxz 指令

```asm
jcxz 标号
; 等价于
if ( cx == 0 )
    jmp short 标号
```

#### 循环指令 loop

```asm
loop 标号
; 等价于
cx--;
if ( cx != 0 )
    jmp short 标号
```

## CALL 和 RET 指令

这是专门设计的，用栈来实现函数功能的指令。

```asm
assume cs:code
code segment
    start:             ; start 标记 : 链接后, CS:IP 指向的位置
        mov ax, 1
        mov cx, 3
        call func      ; 调用 子过程
        mov bx, ax     ; bx = 8
        mov ax, 4c00h
        int 21h
    func:
        add ax, ax
        loop func
        ret             ; 返回
code ends
end start
```

原理：

`call func` 指令加载后，`IP` 已经指向了下一条指令，然后`call func`执行，做了 2 个操作：

- 将当前`IP`的值压栈
- 将`IP`设置为指向标号`func`处的指令内存地址

`func`里指令执行完毕后，执行`ret`指令，做了 2 个操作：

- 出栈`POP`出一个值
- 将`IP`设置为该值

#### 如何实现子过程传参

思考下，`func`和`start`里的`ax`寄存器是共用的，假如子过程多了后，任何一个地方都可能修改到`ax`，程序必然混乱。

所以设计出了一套传参机制：栈机制。

## 11. 标志寄存器

每条指令执行后，都会将它的执行结果以及副作用记录到`标志寄存器`中。后续指令可以根据上一条指令执行的结果，来决定下一步操作。

`8086 CPU`标志寄存器也是 16 位，每个标志占用 1 位，所有信息加起来，被称为程序状态字`PSW`：

- `ZF` 记录 指令执行结果 是否为`0`,如果为`0`,则`ZF = 1`。

- `PF` 记录 指令执行结果 中，所有`bit`位中`1`的个数是否为偶数，如果是`PF = 1`。

- `SF` 记录 指令执行结果 是否为负数，如果为负数，则`SF = 1`。

- `CF` 记录 指令执行结果 中产生的进位，只对无符号数的运算有意义

- `OF` 记录 指令执行结果 中的溢出，只对有符号数的运算有意义，比如`98 + 99` 超过了 `127`, 一个`byte`表示有符号数的话，没有对应的结果的表示方法，称为溢出。

`j`系列条件跳转指令就需要参考标志寄存器：

```asm
je func     ; 检测 zf = 1，等于则转移
ja func     ; 检测 cf = 0 且 zf = 0，高于则转移
```

## 12. 内中断

`8086CPU` 被设计成执行完一条指令后，立刻检测外部、内部产生的一种特殊信息，并且立即对所接收的信息进行处理。这种信息称为：中断信息。参见的有：除法错误、溢出、单步执行。

不同的中断信息，通过`中断码` （1 Byte）来区分，可以表示 256 种中断类型：

- 除法错误 0
- 单步执行 1
- `into`指令 4
- `int`指令 n(字节型立即数)

CPU 收到一个中断信息后，会立刻去查中断向量表（这个是 CPU 规定好的）。

> 8086CPU 规定: `0000:0000 ~ 0000:03FF` 这 1024 个单元存放中断向量表。该表每 4 个`Byte`为一项，每项存了一个可加载到`CS:IP`的内存地址，每个内存地址对应着一个中断处理程序。

通过执行 `中断码 x 4` 就可以定位到中断向量表里的对应的内存地址，该地址中的数据加载到`CS:IP`，就是运行中断处理程序，处理该中断的意思了。

收到中断信息 -> 定位到中断向量表项 -> 加载表项中的地址到`CS:IP`，这几步工作都是由硬件实现的，非常机械，不可更改，或者说，这就是 CPU 运行机制的一部分。

所以如果要写一个操作系统，必须做的一件事情就是，载入各个中断处理程序到内存后，将每个中断处理程序的入口地址，设置到对应的中断向量表项中。

那么中断处理程序，要做哪些事情呢？

中断信息都是在正常处理程序运行时，发生未知错误、硬件异常时触发的，所以中断处理程序必须先保护原程序的执行现场，然后再处理中断，最后恢复原程序运行现场。

具体的中断过程如下:

1. 从中断信息中取得 `中断码`
1. 标志寄存器 入栈，保护现场
1. 设置标志寄存器中 `TF = 0 IF = 0`
1. CS 寄存器入栈 IP 寄存器入栈
1. 根据 中断向量表 中 该 `中断码` 对应的程序入口，设置 `CS:IP`
1. 开始执行由程序员编写的中断处理程序
1. 中断信息处理完毕
1. 各种出栈，恢复原程序现场
1. 从栈中恢复原程序的 `CS:IP`，这步做完，就是退出中断处理程序的意思了

### 实模式下的 DEBUG 程序是如何实现的？

`8086cpu` 有个单步中断`int 1`, 只要标志寄存器中 `IF` 值为 1，则 cpu 每执行一条指令,都会产生一个单步中断。

CPU 检测到中断后，控制权转移到中断向量表`0:0003-0:0006`记录的内存地址，即 `cp:ip` 会设置为该内存地址处的值。

执行`debug abc.exe`时，真正在内存运行的程式并不是那个被载入的程式，而是 debug 本身，debug 只是列出该程式被载入时的初始形况：

![](https://img.codekissyoung.com/2019/09/22/ad4d922aba2373b2b19ce04f9aab60d2.jpg)

按下 `-t` 时，debug 把 `cs:ip` 设置为你的程序的入口的值，同时设置`IF = 1`，修改中断表`0:0003-0:0006`中的值，指向`debug`程序自身。

然后你的程序跑了一条指令后，单步中断触发，调用`0:0003-0:0006`处的中断程序（此时已经修改为指向`debug`了），控制权又回到了`debug`手中^\_^
