# Erlang

代码没有 side effect

没有互斥

没有同步方法

没有内存共享式编程

一个 Process 能修改自身, 但不能修改另一个 Process 的状态,只能通过 传递消息 进行交互

Erlang 的风格就是编写大量只做简单事情的小进程.

可以修改的内存区域称为＂mutable state＂可变状态，C 语言并发编程，必须解决共享内存的访问问题，在多个执行流中，只有一个能访问这些内存区域，所以必须给这些区域加锁，使用完后解锁. 这就要求加锁后，线程在操作共享内存时千万不能崩溃！！！崩溃了没有释放锁的话，这个程序都会阻塞在这把锁这里．

Erlang 变量是对某个值的引用，实现上用指针，为 nil 代表未绑定变量，指向一个包含值的内存区域后，称为绑定．绑定后不能修改，即不能修改指针的指向了．

可以被修改的变量是许多程序错误的根源，任何一处修改该变量的地方都有可能是错误发生之处，而对于 Erlang 变量，只要是发现它的值不符合预期，那么错误一定是在生成该变量的地方．

只有可以被赋值一次的变量该如何编程呢？答案是使用另一个变量：

```erlang
X1 = X + 1
```

Erlang 里一切都是表达式，而表达式最终都会产生一个值。



### 声明性语言

声明性质的语言原则是：描述应该计算什么，而不是去解释这个值是如何计算出来的．

使用＂模式匹配＂从不同的情况中去选择要执行的函数：

```erlang
% 传一个元组进来，匹配上了，就执行计算面积的代码
area({rectangle,Width,Height}) -> Width * Height;
area({circle,Radius})-> 3.14159 * Radius * Radius;
area({square,Side}) -> Side * Side.
```

从复杂的数据结构中抽取数据时：

```erlang
-define(IP_VERSION, 4).
-define(IP_MIN_HDR_LEN, 5). 
DgramSize = size(Dgram), 
case Dgram of  
    <<?IP_VERSION:4, HLen:4, SrvcType:8, TotLen:16,  
      ID:16, Flgs:3, FragOff:13, 
      TTL:8, Proto:8, HdrChkSum:16, 
      SrcIP:32, 
      DestIP:32, RestDgram/binary>> when HLen>=5, 4*HLen=<DgramSize -> 
        OptsLen = 4*(HLen - ?IP_MIN_HDR_LEN), 
        <<Opts:OptsLen/binary,Data/binary>> = RestDgram, 
end.
```





### 关卡

关卡是对模式匹配的一种补充．

合法的关卡表达式：

- 原子为 true
- 常量为 false
- 内置函数
- 数据结构比较
- 算术表达式
- 布尔表达式
- 短路布尔表达式

```erlang
% 增强函数匹配，而设计的 关卡 功能，通过 when 在函数开头调用 光卡
max(X,Y) when X > Y
  -> X;
max(X,Y) -> Y.

% , 是 并且 的含义
func(X, Y) when is_integer(X), X > Y, Y > 6 -> 
    ....

func(T, L) when is_tuple(T), tuple_size(T) =:= 6, abs(element(3,T)) > 5
　　　　　　　　　element(4, X) =:= hd(L) -> 
    ....

% ; 是 或者 的含义
func(X, Y) when X =:= dog; X =:= cat
                is_integer(X), X > Y; abs(Y) < 23 ->
    ...
                                                                             
func(A, B) when A >= -1.0 andalso A + 1 > B
                is_atom(L) orelse (is_list(L) andalso length(L) > 2)
    ...                          
```
