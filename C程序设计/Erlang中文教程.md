# Erlang 中文教程

面向消息、面向并发的语言`Erlang`!!!

## 1. 安装与执行

```bash
# 去下面这个网址下载最新的安装包　各大系统都有
https://www.erlang-solutions.com/resources/download.html

$ erlc -d -W hello.erl 														# 编译成 *.beam 文件
$ erl -noshell -pa dir -s module fun 					# 在指定目录下，执行指定模块的函数
$ erl -noshell -s hello start -s init stop  # 在当前目录，先执行 shell:start()　再执行 init:stop()
Hello world
```

### 1.1 erlang shell

```bash
$ erl	 # 进入 erl shell
> q(). # 退出 erl shell
> b(). # 打印当前变量绑定
> f(). # 删除所有当前变量绑定,　f(X) 删除指定变量绑定
> regs(). # 打印所有绑定了 PID 的原子
> cd("目录"). # 进入目录, erlang shell 可以查找到,当前目录下的 *.beam 里的函数,直接调用它们
> c("xxx.erl", [debug_info]). # 编译
> help(). # 展示 erl shell 中所有可以调用的命令
> xxmodule:module_info().  # 打印该模块所有信息，module_info("xxx") 打印指定属性
```

### 1.2 escript 

```erlang
#!/usr/bin/env escript
%% 将参数转换成整数类型后调用阶乘函数, A 是命令行参数
%% ./fac.sh 4
%% factorial 4 = 24
main([A]) ->
    I = list_to_integer(A),
    F = fac(I),
    io:format("factorial ~w = ~w~n", [I, F]),
    init:stop().

fac(0) ->1;
fac(N) ->N*fac(N-1).
```



## 2. 变量与数据类型

### 2.1 变量

大写字母开头的单词是变量 (Name X Age),在命令式的语言(C Go JAVA)里，变量名其实是伪装起来的内存地址，`X = 12`　表达的将该内存地址处的值修改为 `12`.

而在 Erlang 中，`X = 12` 表示 X 本身就是 12，两者绑定在一起了，不可更改。

```erlang
1> Name.                            % unbond variable
* 1: variable 'Name' is unbound
1> Name = "Link".                   % bind "Link" to Name
"Link"
2> Name = "codekissyoung".          % Name can not changed once bind to one Value
** exception error: no match of right hand side value "codekissyoung"
```

### 2.2 整数

```erlang
格式 : Base#Value
-234      % 十进制 -234
2#1010    % 二进制表示的  10
-16#EA    % 十六进制表示的 -234
$a $A $\n % ASCII 字符表示的整数 97 65 10
```

#### 2.2.1 算术运算符

`+` `-` `*` `/` `rem` 求余 `div` 整除

#### 2.2.2 关系运算符

`==` 值相等 `/=` 值不相等

`=:=` 值与类型都相等 `=/=` 值与类型都不相等

`<` 小于 `<=` 小于等于 `>` 大于 `>=`　大于等于

#### 2.2.3 逻辑运算

`andalso` 等价于 && 
`orelse` 等价 ||
`xor` 异或 
`not` 非

#### 2.2.4 位运算符

```erlang
band binary and
bor　binary or
bxor binary xor
bnot binary not 按位否定运算符
```

### 2.3 原子 Atom

而小写字母开头（`name` `friend`）后可接　`字母`　`数字` `@` `.` `_` 作为原子值

所谓原子值就是没有具体含义，只需要知道这个值，而不关心它具体是啥。类似于 C 语言中的`#define age 10`中的`age`。最大作用在于标识 匹配 和 比较．

```erlang
2> name.                            % atom variable
name
```

#### 2.3.2 true false ok

两个保留的原子值　`true` `false` 被当作布尔值使用

```erlang
4> {1,2} < {1,3}.
true
5> {1,2} == {2,3}.
false
6> {1,2} /= {2, 3}.
true
7> 
```

### 2.4 位串 Bit 

```erlang
4> <<5,10,20>>. % <<5,10,20>>
5> <<65,66,67>>.
<<"ABC">>
6> <<"hello">>. 
<<"hello">>

% list_to_binary(L) -> B
7> Bin1 = <<1,2,3>>.
8> Bin2 = <<4,5>>.
9> Bin3 = <<6>>.
10> list_to_binary([ Bin1, 1, [2, 3, Bin2], 4 | Bin3 ]).
<<1,2,3,1,2,3,4,5,4,6>>

% term_to_binary(Term) -> Bin  把任何数据类型转换成一个二进制类型
% binary_to_term(Bin) -> Term
11> B = term_to_binary( {binaries, "are", useful } ).
<<131,104,3,100,0,8,98,105,110,97,114,105,101,11 ... >>
12> X = binary_to_term(B).
{binaries,"are",useful}
```

#### 2.4.1 位语法

```erlang
12> Pixels = <<213,35,23,64,78,12,34,12,234>>.
14> <<Pix1:24,Pix2:24,Pix:24>> = Pixels. % 数字表示匹配的 bit 数
17> <<R:8,G:8,B:8>> = <<Pix1:24>>.
18> R.
213

21> <<R:8, Rest/binary>> = Pixels.  % /binary 匹配剩下的所有 bit
23> Rest.
<<35,23,64,78,12,34,12,234>>

24> << <<X>> || <<X>> <= <<1,2,3,4,5>> , X rem 2 == 0 >>. % 二进制推导式
<<2,4>>

% 二进制 到 列表
26> RGB = [ {R, G, B} || << R:8, G:8, B:8>> <= Pixels ].
[{213,35,23},{64,78,12},{34,12,234}]

% 列表 到 二进制
27> << <<R:8, G:8, B:8>> || {R,G,B} <- RGB >>.
<<213,35,23,64,78,12,34,12,234>>
```

### 2.5 元组 tuple

元组用来组合多个值。并且提供了一种相等匹配模式，用来非常方便的取出元组里的值。

```erlang
14> P = {10, 45}.                                          % P表示一个点
16> P.                                                     % 展示 P
{10,45}
15> Person = {person, {name, "codekissyoung"}, {age, 24}}. % Person 表示一个人
17> Person.                                                % 展示 Person
{person,{name,"codekissyoung"},{age,24}}
18> PersonLocation = {Person, P}.                          % 组合 Person 与 P 成为 PersonLocation
{{person,{name,"codekissyoung"},{age,24}},{10,45}}
1> tuple_size({abc, {def, 123}, ghi}). 
3
2> element(2, {abc, {def, 123}, ghi}). % 索引从 1 开始
{def,123}
```

如何从元组定位取值呢? 通过匹配

```erlang
32> PersonLocation.                                 % 先查看下 PersonLocation 的值
{{person,{name,"codekissyoung"},{age,24}},{10,45}}
33> {{_,{_,Name},_},_} = PersonLocation.            % 写匹配等式
{{person,{name,"codekissyoung"},{age,24}},{10,45}}
34> Name.
"codekissyoung"
```

`_`是占位符，用来接收不需要的值。我们再来复述一遍相等匹配模式：假如要使`=`两边的东西相等，那么`Erlang`要做啥操作呢？答案是：让 `Name` 的实际内容存储为`codekissyoung`。

### 2.6 列表 list

#### 2.6.1 基础

列表用来容纳多个值，并且提供了一种相等匹配模式`[H|T]`（`H`表示列表的第一个，`T`表示剩下的），用来非常方便的存入和取出操作。

```erlang
22> ThingsToBuy = [{apple, 10}, {pear, 6}, {milk, 3}].    % 声明列表
42> [Buy|ThingsLeft] = ThingsToBuy.                       % 通过 [H|T] 模式匹配取数据
[{apple,10},{pear,6},{milk,3}]
43> Buy.
{apple,10}
44> ThingsLeft.
[{pear,6},{milk,3}]
45> ThingsToBuy.
[{apple,10},{pear,6},{milk,3}]
27> ThingsToBuy2 = [{orange,4}|ThingsToBuy].              % 通过 [H|T] 模式往列表存数据
[{orange,4},{apple,10},{pear,6},{milk,3}]
```

#### 2.6.2 列表推导

list comprehension

```erlang
[ Expression || Generator ... , filter ... ] % || 左边是想要的结果，|| 右边的表达式执行顺序是 从左到右
```

```erlang
4> [ 2 * X || X <- L ]. %  X <- L 是生成器表达式
[2,4,6,8,10]

% 使用列表推导表达式改写的 total 版本
total( L ) ->
    sum( [shop:cost(A) * B || {A, B} <- L] ).

5> Buy = [{oranges,4},{newspaper,1},{apples,10},{pears,5}].
[{oranges,4},{newspaper,1},{apples,10},{pears,5}]

6> [{Name, 2 * Number} || {Name, Number} <- Buy].
[{oranges,8},{newspaper,2},{apples,20},{pears,10}]

10> L3 = [ X * X || X <- [1,2,3,4,5,6,7], X > 3 ].     % 生成器, 过滤器
[16,25,36,49]

% 生成表达式也起到了过滤器作用
7> [X || {a, X} <- [{a,1}, {b,2}, {c,3}, {a, 4}, hello, "link"] ].
[1,4]

% 多个Generator, 注意是全排列
11> [X + Y || X <- [1,2], Y <- [3,4]].
[4,5,5,6]
```

再来介绍一种连接列表的语法`++`：

```erlang
12> [1,2,3] ++ [7,9] ++ [23,45].
[1,2,3,7,9,23,45]
```

使用列表生成器和`++`语法写成的快速排序：

```erlang
% 快速排序　生成表达式 + 过滤表达式
qsort([]) -> [];
qsort([Piv | T]) ->
  qsort([ X || X <-T, X < Piv])
  ++ [Piv] ++
  qsort([ X || X <-T, X >= Piv]).
```

```erlang
2> shop:qsort([8,7,5,2,1,45,23,45,90]).
[1,2,5,7,8,23,45,45,90]
```

勾股定理，算出`N`以内符合勾股定理的数：

```erlang
pythag(N) ->
    [ {A,B,C} ||
        A <- lists:seq(1,N),
        B <- lists:seq(1,N),
        C <- lists:seq(1,N),
        A + B + C =< N,
        A * A + B * B =:= C * C ].
```

```erlang
9> shop:pythag(16).
[{3,4,5},{4,3,5}]
10> shop:pythag(30).
[{3,4,5},{4,3,5},{5,12,13},{6,8,10},{8,6,10},{12,5,13}]
```

所有字母的排列组合：

```erlang
perms( [] ) -> [[]];
perms( L )  -> [ [H|T] || H <- L, T <- perms( L -- [H]) ].
```

```erlang
5> shop:perms("cats").
["cats","cast","ctas","ctsa","csat","csta","acts","acst",
 "atcs","atsc","asct","astc","tcas","tcsa","tacs","tasc",
 "tsca","tsac","scat","scta","sact","satc","stca","stac"]
```

#### 2.6.3 字符串 string

字符串是使用双引号括起来的一串字符, 本质是一个整数列表。

```erlang
48> [83,117,114,112,114,105,115,101].
"Surprise"
51> "中国汉语".
[20013,22269,27721,35821]
```

### 2.7 记录 Record

```erlang
% records.hrl
-record(todo, {status=reminder,who=joe,text}). % 定义 名为 todo 的 record 类型

% 在函数 records 的模式匹配
clear_status(#todo{status = S, who = W} = R) ->
  R#todo{text="Finished",status=finished}.

% 匹配某个类型的 records
do_something(X) when is_record(X, todo) ->
  X#todo{status = finished}.
```

```erlang
3> rr("records.hrl").  % 载入头文件

4> #todo{}. % 实例化一个 todo
#todo{status = reminder,who = joe,text = undefined}

5> X = #todo{status=urgent, text="Fix errata in book"}. % 实例化一个 todo 绑定到 X
#todo{status = urgent,who = joe,text = "Fix errata in book"}

7> X2 = X#todo{status=done, who=joe, text="gone with Wind"}. % 修改 X 后，绑定到 X2
#todo{status = done,who = joe,text = "gone with Wind"}

8> #todo{who=W, text=Txt} = X2. % 模式匹配
9> W. % joe
10> Txt. % "gone with Wind"

11> X2#todo.text. % 直接访问 record 里字段的值
"gone with Wind"
12> X2#todo.who. 
```

### 2.8 映射 Map

```erlang
#{Key1 Op Val1, Key2 Op Val2 ... }
% Op 可以是 => 新增 和 := 修改 
```

```erlang
1> F1 = #{ a => 1, b => 2 }. # 创建一个 Map 绑定到 F1
#{a => 1,b => 2}

2> Facts = #{ {wife,fred} => "Sue", {age, fred} => 45 }. % 键值可以是任何 Erlang 类型
#{{age,fred} => 45,{wife,fred} => "Sue"}

3> F2 = F1#{ c => xx }. # 新增键后，绑定到 F2
#{a => 1,b => 2,c => xx}

4> F3 = F2#{ c := ok }. # 修改键后，绑定到 F3
#{a => 1,b => 2,c => ok}
```

#### 操作map的内置函数

#### 与json的互转

## 3. 模块与函数

### 3.1 基本概念

**引用透明性**　：　referential transparency　对于同样的参数，函数永远要返回同样的值．

```erlang
% 函数格式: Body 必须是一个或者多个用 , 分割的 Erlang 表达式, 最后一个表达式的值作为返回值
Name(Args) -> Body.
```

函数可以顺序并行执行，而模块则是包含了多个函数，是组织代码的基本单元。

```erlang
-module(geometry).                      % 声明本文件是 geometry 模块
-define(PI, 3.14159). 												% 定义宏
-define(sub(X,Y), X - Y).
-export([test/0, area/1]).              % 导出 test area 函数，0 1 是参数数目

% 实现1 求正方形面积
area({rectangle, Width, Height})
    -> Width * Height;
area({circle, Radius})
    -> ?PI * Radius * Radius; 							% 使用了宏替换
area({square, Side})
    -> Side * Side.

% 测试用例
test() ->
    12 = area({rectangle, 3, 4}),       % 用例1
    144 = area({square, 12}),           % 用例2
    tests_passed.                       % 用例全部通过
```

代码的编译和执行过程：

```erlang
$ erl                                   % 进入 erlang shell
1> c(geometry).                         % 编译
{ok,geometry}
2> geometry:area({rectangle, 10, 5}).   % 调用 area 函数
50
3> geometry:area({square, 3}).
9
4> geometry:test().                     % 调用 test 函数
tests_passed
```

再来解释下标点符号的使用：

- `,` 用于分隔开函数调用参数、数据构造、和模式中的参数、表达式
- `;` 用于分隔函数子句，以及匹配表达式
- `.` 是句号，分隔函数整体

Erlang 是没有专门的控制流程的语句的，有的只有表达式．但是我们可以构造出通用的控制流程结构．

### 3.2 分支流程

#### 3.2.1 函数匹配

函数匹配就是一种分支控制，如上面例子中的`area`函数匹配。

#### 3.2.2 Guard 保护式/卫式/关卡/断言

当函数的匹配结构是一样的时候，需要对具体的值进行判断了，这时候可以使用 Guard ，进一步分支。

以 `when` 开头，`;` 连接相当于 `or`, `,`连接相当于 `and`. 常见的用于 Guard 的的函数有：`is_atom(X)` `is_function` 等.

```erlang
max(X, Y) when X > Y -> X; % 如果匹配这句，就直接返回
max(X, Y) -> Y.

% , 等价 andalso ; 等价 orelse
% if( is_int(X) && X > Y && Y < 6 ) return X
moreThan6(X, Y) when is_integer(X), X > Y, Y < 6 -> X; 
moreThan6(X, Y) -> Y.
```

#### 3.2.3 if 表达式

if 的表现与 "函数+卫式" 的构造一样：

```erlang
cost2(X) ->
  if
    X == orange -> 5;
    X == newspaper -> 8;
    X == apples -> 2;
    X == pears -> 9;
    X == milk -> 7;
    true -> unkown 			% 用于捕获其他所有的情况
  end.
```

#### 3.2.4 case of 表达式

case of 的表达式就像是整个函数头，可以对函数的每个参数使用 匹配模式 + Guard

```erlang
beach(Temprature) -> % 根据温度决定去不去海滩玩耍
  case Temprature of
    {celsius, N } when N >= 20, N =< 45 -> 'favorable';
    {kelvin, N} when N >= 293, N =< 318 -> 'favorable';
    _ -> 'avoid beach'
  end.
```

个人感觉，去掉 if 和 case of 完全可行，同一个操作没必要使用多种写法。

### 3.3 循环流程

Erlang 没有 for 语句，但是使用模式匹配和高阶函数，却可以创造自己的＂控制抽象＂，一则可以根据实际问题创建出精确的控制结构，二来不受语言自带的少量固定控制结构的束缚．

```erlang
for(Max, Max, F) -> % 这句一定要在前面，是终止条件
  [ F(Max) ];
for(I, Max, F) ->
  [ F(I) | for(I+1, Max, F) ].
%% 21> lib:for(1, 10, fun(X) -> X end).
%% [1,2,3,4,5,6,7,8,9,10]
%% 22> lib:for(1, 10, fun(X) -> X * 2 end).
%% [2,4,6,8,10,12,14,16,18,20]
```

### 3.4 高阶函数

```erlang
4> Double = fun(X) -> 2 * X end.
5> Double(2).
4
7> Hypot = fun(X, Y) -> math:sqrt(X*X +Y*Y) end.
8> Hypot(10, 20).
22.360679774997898

10> TempConvert = fun({c, C}) -> {f, 32+C*9/5};
10>                  ({f, F}) -> {c, (F-32)*5/9} end.
11> TempConvert({c, 100}).
{f,212.0}
12> TempConvert(TempConvert({c, 100})).
{c,100.0}
```

再来看两个接收高阶函数的作为参数的常用函数`lists:map()`与`lists:filter()`：

```erlang
# lists:map(F, L) L 函数
6> L = [1,2,3,4,5,6].
[1,2,3,4,5,6]
7> lists:map(fun(X) -> 2 * X end, L).
[2,4,6,8,10,12]

# lists:filter(F, L) L 函数
8> Even = fun(X) -> (X rem 2) =:= 0 end.
#Fun<erl_eval.7.126501267>
10> lists:map(Even, [1,2,3,4,5,6,7,8]).
[false,true,false,true,false,true,false,true]
11> lists:filter(Even, [1,2,3,4,5,6,7,8]).
[2,4,6,8]
```

再来看一下将高阶函数作为返回值的例子：

```erlang
# lists:member(X, L) Bool  X 是否在 L 内
12> Fruit = [apple,pear,orange].
[apple,pear,orange]
13> MakeTest = fun(L) -> (fun(X) -> lists:member(X, L) end ) end.
#Fun<erl_eval.7.126501267>
14> IsFruit = MakeTest(Fruit).
#Fun<erl_eval.7.126501267>
15> IsFruit(dog).  
false
16> IsFruit(apple).
true
17> lists:filter(IsFruit, [dog,orange,cat,apple,bear]).
[orange,apple]
```

然后我们通过高阶函数来改造下`shop`例子：

```erlang
sum([H|T]) -> H + sum(T);
sum([]) -> 0.

map(_, []) -> [];
map(F, [H|T]) -> [F(H) | map(F, T)].
total( L ) ->
    sum( map( fun({What,N}) -> shop:cost(What) * N end, L ) ).
% 6> shop:total([{oranges,6},{newspaper, 1},{milk, 2}]).
$ 52
```

可重入解析代码 reentrant parsing code

解析组合器 parser combinator

惰性求值器 lazy evaluator



## 4. 并发

### 4.1 new process

```erlang
% 运行一个模块里的函数作为进程
Pid = spawn(模块名，函数名，参数list).

16> F = fun() -> io:format("new process~n") end.              
17> spawn(F). % 产生一个新进程
new process
<0.126.0>

% 产生多个新进程，并且通过闭包，传递的值 X 
13> G = fun(X) -> timer:sleep(10), io:format("~p~n", [X]) end.
15> [spawn(fun() -> G(X) end) || X <- lists:seq(1,10)]. 
[<0.114.0>,<0.115.0>,<0.116.0>,<0.117.0>,<0.118.0>,
 <0.119.0>,<0.120.0>,<0.121.0>,<0.122.0>,<0.123.0>]
```

### 4.2 send data

```erlang
Pid ! {a, 12} 									% 向 Pid 发送消息 {a, 12} 
foo(12) ! area({square, 5}) % foo(12) 必须返回一个 Pid , area(...) 将表达式计算出的值，发送给 Pid
```

```erlang
6> self() ! hello. 				% 向 erlang shell 发送数据
hello
7> self() ! world. 
world
8> self() ! "how are you". 
"how are you"
9> flush(). % 由于 erlang shell 一直没有接收（暂时存在进程邮箱里），可以通过　flush 将它们冲刷出来
Shell got hello
Shell got world
Shell got "how are you"
ok
```

### 4.3 receive data

```erlang
receive
    Pattern1 when Guard1 -> Expr1;　 % 匹配模式一一验证
    Pattern2 when Guard2 -> Expr2;
    Pattern3 -> Expr3
end
```

海豚例子：

```erlang
dolphin() ->
  receive
    {From, do_a_flip} ->
      From ! "Nice to meet you, give me fish ~",
      dolphin();
    {From, fish} ->
      From ! "thanks"; % 没有递归了，进程或直接退出
    _ ->
      io:format("do nothing ~n"),
      dolphin()
  end.
```

```erlang
2> D1 = spawn(concurence, dolphin, []).
3> D1 ! {self(),fish}.
4> flush().
Shell got "thanks"
false
```

### 4.4 keep status process

```erlang
fridge(FoodList) ->
  receive
    {From, {store, Food}} ->
      From ! {self(), ok},
      fridge([Food|FoodList]);
    {From, {take, Food}} ->
      case lists:member(Food, FoodList) of
        true ->
          From ! {self(), {ok, Food}},
          fridge(lists:delete(Food, FoodList));
        false ->
          From ! {self(), {ok, not_found}},
          fridge(FoodList)
      end;
    terminate -> ok
  end.
```

```erlang
1> Pid = spawn(concurence, fridge, [[baking_soda]]).
2> Pid ! {self(), {store, milk}}.
3> flush().
Shell got {<0.62.0>,ok}
4> Pid ! {self(), {store, bacon}}.
{<0.60.0>,{store,bacon}}
5> Pid ! {self(), {take, bacon}}.
{<0.60.0>,{take,bacon}}
6> Pid ! {self(), {take, turkey}}.
{<0.60.0>,{take,turkey}}
7> flush().
Shell got {<0.62.0>,ok}
Shell got {<0.62.0>,{ok,bacon}}
Shell got {<0.62.0>,{ok,not_found}}
```



## 5. 错误处理

常见处理错误的方式：
- 在正常代码逻辑的每一层都处理错误
- 正常代码逻辑处直接抛出异常，推到程序最顶层的 try catch 处理

Erlang 还有第三种方式：
- 将异常处理逻辑从程序的正常执行流中移出来，放到另外一个并发进程中，这样做可以让业务代码更加整洁，只需要处理＂正常的情况＂

### 5.1 throw exit error

```erlang
generate_exception(1) -> a;           % 正常
generate_exception(2) -> {'EXIT', a}; % 正常
generate_exception(3) ->
  throw(a); % 抛出异常, 只是为了改变控制流(非局部返回)，并期望调用方去处理异常
generate_exception(4) ->
  exit(a); % 终止进程，如果未捕捉，广播 {'EXIT', Pid, Why} 到链接到的其他进程，不返回 Stack
generate_exception(5) ->
  error(a). % 崩溃性错误，会结束当前进程，会返回 Stack
```

### 5.2 catch 

```erlang
% 旧的异常处理风格
case (catch foo(...)) of
    {'EXIT', Why} ->...
    Val           ->...
end.

% 使用 catch 直接将任何异常转换为 {"EXIT", ...} 元组
demo2() ->
  [{I, catch generate_exception(I) } || I <- [1,2,3,4,5]].

%%2> error:demo2().
%%[{1,a},
%%{2,a},
%%{3,{'EXIT',a}},
%%{4,{'EXIT',a}},
%%{5,
%%{'EXIT',{a,[{error,generate_exception,1,
%%[{file,"error.erl"},{line,15}]}　...
```

- catch 从 exit(P) 拿到的是 {'EXIT', P}
- catch 从 throw(Q) 拿到的就是 Q

如果系统的顶层，不设法修正一个它检测到的错误，那么进程将终止，并且广播给所有的 Linker 和 Monitor. 进程死掉的时候产生了一个 {'EXIT',Why} 异常，那么退出信号 {'EXIT', P, Why} 会发送给所有 Linker 和 Monitor. 

任何收到 Why 不为 normal 信号的进程都会一起死亡,除非它是“系统进程”，系统进程会将退出信号转换为一个进程间通信消息，添加到它的邮箱中。

```erlang
go() -> 
    process_flag(trap_exit, true), % 成为系统进程
    loop().
loop() -> 
    receive
    	{'EXIT', P, Why} -> Why;
    end.
```

例外是 exit(P, kill) 调用，这种信号可以直接杀死 P 系统进程.

### 5.3 try catch

```erlang
try FuncOrExpressionSequence of  %% 首先对FuncOrExpressionSequence求值
    Pattern1 [when Guard1] ->Expressions1;
    ...
catch
    ExceptionType: ExPattern1 [when ExGuard1] ->ExExpressions1;
    ...
after
    AfterExpressions
end.
```

```erlang
% 新的异常处理风格
catcher(N) ->
  try 
    generate_exception(N) % 中间可以写多个表达式, 号隔开
  of
    Ret -> {N, normal, Ret} % 如果表达式执行正常，未抛出异常
  catch
    throw:Ret -> {N, caught, thrown, Ret}; % 处理 throw 异常
    throw:{fileError, Ret} -> {N, caught, thrown, Ret}; % 处理 fileError 异常
    exit:Ret  -> {N, caught, exited, Ret};  % 处理 exit 异常
    error:Ret -> {N, caught, error, Ret};  % 处理 error 异常
    _:_       -> {unkown, error}											% 处理所有异常错误的代码
  after 
    {N, always, exec } % 一定会执行的子句，不返回任何值，常用来关闭打开的文件等操作
  end.

demo1() ->
  [catcher(I) || I <- [1,2,3,4,5]].
%%2> error:demo1().
%%[{1,normal,a},
%%{2,caught,thrown,a},
%%{3,caught,exited,a},
%%{4,normal,{'EXIT',a}},
%%{5,caught,error,a}]
```

### 5.4 link

通过 `link(Pid)` 函数将本进程　与　指定进程链接到一起，当其中一个进程死亡时，另一个可以收到消息通知．

```erlang
myproc() ->
  timer:sleep(5000),
  throw({no_reason}). % 改成 exit 和 error 分别试试

chain(0) ->
  receive
    _ -> ok
  after 2000 ->
    throw("chain dies here") % 改成 exit 和 error 分别试试
  end;
chain(N) ->
  link(spawn( fun() -> chain(N - 1) end )),
  receive
    _ -> ok
  end.
```

```erlang
3> link(spawn(linkmon, myproc, [])). % exit({no_reason}) 的表现
** exception error: {no_reason}

5> link(spawn(linkmon, myproc, [])). % error({no_reason}) 表现
Error in process <0.95.0> with exit value:
{{no_reason},[{linkmon,myproc,0,[{file,"linkmon.erl"},{line,7}]}]}
** exception error: {no_reason}
     in function  linkmon:myproc/0 (linkmon.erl, line 7)
                                                   
7> link(spawn(linkmon, myproc, [])). % throw({no_reason}) 表现
Error in process <0.103.0> with exit value:
{{nocatch,{no_reason}},[{linkmon,myproc,0,[{file,"linkmon.erl"},{line,7}]}]}
** exception error: {nocatch,{no_reason}}
     in function  linkmon:myproc/0 (linkmon.erl, line 7)
                                                   
12> link(spawn(linkmon, chain, [3])). % 错误一直从 chain(0) 传递到本 shell
Error in process <0.131.0> with exit value:
{{nocatch,"chain dies here"},
 [{linkmon,chain,1,[{file,"linkmon.erl"},{line,13}]}]}
** exception error: {nocatch,"chain dies here"}
     in function  linkmon:chain/1 (linkmon.erl, line 13)                                                
```

错误在进程之间传播，并且杀死对方，是通过＂信号＂实现的．通过将进程设置为＂系统进程＂，可以将＂kill＂信号转化为消息，从而避免被杀死．

````erlang
6> process_flag(trap_exit, true). % 设置本进程成为 系统进程

7> spawn_link(fun() -> 1/0 end). 
Error in process <0.92.0> with exit value:
{badarith,[{erlang,'/',[1,0],[]}]}

8> flush().
Shell got {'EXIT',<0.92.0>,{badarith,[{erlang,'/',[1,0],[]}]}}
````

现在快速杀死进程的机制已经有了，现在再看下快速重启的机制．

### 5.5 monitor

连接是双向的，并且两个进程之间只能存在一条链接，而监控是单向的，并且可以叠加多条监控．

```erlang
> Ref = erlang:monitor(prcess,B) % 本进程 A 监控进程 B
{'DOWN', Ref, process, B, Why} % B 死掉时，A 进程会收到本消息
```

```erlang
12> erlang:monitor(process, spawn(fun() -> timer:sleep(500) end)).
#Ref<0.950962386.96468998.180487>
13> flush().
Shell got {'DOWN',#Ref<0.950962386.96468998.180487>,process,<0.99.0>,normal}
```

### 5.6 register process

通过链接和监控都能检测到我们依赖的某个进程的死亡，然后我们可以做些什么呢？

```erlang
% 给 Client 调用的
send(X) ->
  Ref = make_ref(),
  critic ! {self(), Ref, {X}},
  receive
    {Ref, Y} -> Y
  after 2000 ->
    timeout
  end.

% 启动一个服务进程
start() ->
  spawn(?MODULE, protect_critic, []).

% critic 的保护进程
protect_critic() ->
  process_flag(trap_exit, true),                  % 系统进程
  Pid = spawn_link(?MODULE, critic, []),
  register(critic, Pid),                          % 给进程命名, 挂到注册树上
  receive
    {'EXIT', Pid, normal}     -> ok;              % exit normal
    {'EXIT', Pid, shutdown}   -> ok;              % exit by hand
    {'EXIT', Pid, _}          -> protect_critic() % restart it
  end.

% critic 进程
critic() ->
  receive
    {From, Ref, {"a"}}           -> From ! {Ref, "A"};
    {From, Ref, {"b"}}           -> From ! {Ref, "B"};
    {From, Ref, {X}}             -> From ! {Ref, X};
    {From, Ref, _}               -> From ! {Ref, unkown}
  end,
  critic().
```


端口收到的数据，都会转化成 {Port, {data, D}} 消息，给到控制进程。

### 5.7 热更新

A 模块使用 B 模块的代码，假如 B 模块更新来，原来执行B模块代码中进程，既可以选择执行老版本代码，也可以选择执行新版本代码。

```erlang
-moudule(m).
loop(Data, F) -> 
    receive
    		{From, Q} -> {Reply, Data1} -> F(Q, Data),
        m:loop(data1, F); % 每次调用都加载最新版本
        % loop(data1, F); % 希望继续执行当前版本代码，而不是新版本代码
    end.
```

## 6. 定时通知小应用

[定时通知小应用代码](https://github.com/codekissyoung/learn-erlang/tree/main/todolist)

## 7. OTP框架

Erlang 内置机制：链接link() 监控monitor() 服务器 超时 捕获退出信号 使用引用标记信息.

并发编程陷阱：保证执行的顺序 避免竞争条件 进程随时可能死亡 代码热加载 命名进程 监督者进程.

OTP就是利用上述的机制，考虑了各种陷阱，创建的一组模块和标准。

Erlang并发程序模式：一个函数负责创建新的进程，一个函数负责提供初始值，一个函数负责主循环，具备容错功能的消息发送函数

### 7.1 gen_server

通用型服务进程。

### 7.2 gen_fsm

```erlang
State(S) x Event(E) -> Actions(A), State(S')
```

有限状态机适用于文本解析，模式匹配、游戏逻辑等等方面的处理。

```erlang
gen_fsm:start_link(进程注册名,回调模块,传递给 init/1 的参数, 状态机的选项)
```

### 7.3 gen_event

事件管理器。

### 7.4 supervisor

监督者。

## 8. OTP 应用

OTP应用特指用 OTP behavior 实现进程，再用一种特定的结构对它们进行打包。通过这个结构，VM 就知道如何进行初始化以及退出清理。



## 9. 分布式编程

### 9.1 分布式编程

```erlang
spawn(Node, Fun) % 在一个远端节点 Node, 运行 Fun 进程
monitor(Node)    % 监视整个节点
```

### 9.2 端口 Port

```erlang
Port ! {Pid, Command} % Pid 是端口控制进程 控制端口完成Command任务

% {command, Data} 往端口写入数据
% close 关闭端口
% {connect, Pid1} 移交端口控制权给 Pid1
```




## 10. 分布式OTP应用



