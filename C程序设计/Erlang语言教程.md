# Erlang 教程

面向消息、面向并发的语言`Erlang`!!!

## 1. 安装与部署

```bash
# 去下面这个网址下载最新的安装包　各大系统都有
https://www.erlang-solutions.com/resources/download.html

$ erlc -d hello.erl 编译成 *.beam 文件
$ erl -noshell -s hello start -s init stop
Hello world
```

## 2. 变量与数据类型

```bash
$ erl # 进入 erl shell
> q(). # 退出 erl shell
> b(). # 打印当前变量绑定
> f(). # 删除所有当前变量绑定,　f(X) 删除指定变量绑定
> cd("目录"). # 进入目录, erlang shell 可以查找到,当前目录下的 *.beam 里的函数,直接调用它们
> c("xxx.erl", [debug_info]). # 编译
> help(). # 展示 erl shell 中所有可以调用的命令
> xxmodule:module_info().  # 打印该模块所有信息，module_info("xxx") 打印指定属性
```

### 变量

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

### 整数

```erlang
格式 : Base#Value
-234      % 十进制 -234
2#1010    % 二进制表示的  10
-16#EA    % 十六进制表示的 -234
$a $A $\n % ASCII 字符表示的整数 97 65 10
```

算术运算符：

```erlang
+	增加了两个操作数				1 + 2　  将给出3
−	从第一个减去第二个操作数		　1 - 2　  将给-1
*	两个操作数的乘法				2 * 2　  将给4
/	由分母划分的分子				2/2      会给1
rem将第一个数除以第二个数的余数		3 rem 2　将给出1
div将执行除法并返回整数组件　　	　　3 div 2　将给出1
```

关系运算符：

```erlang
==	测试两个对象之间的相等性		   2 = 2  将给出真实
=:= 精确等于 会比较类型
/=	测试两个对象之间的差异			    3 /= 2 将给出真实
=/= 精确不等于
<	检查左对象是否小于右操作数。		  2 <  3 将给出真实
=<	检查左对象是否小于或等于右操作数。	2 =< 3 将给出真实
>	检查左对象是否大于右操作数。		  3 >  2 将给出真实
>=	检查左对象是否大于或等于右操作数。	3> = 2 将给出真实
```

逻辑运算符

```erlang
and andalso 等价于 && 
or orelse 等价 ||  
xor 异或 
not 非
```

位运算符

```erlang
band binary and
bor　binary or
bxor binary xor
bnot binary not 按位否定运算符
```

### 原子值 atom

而小写字母开头（`name` `friend`）后可接　`字母`　`数字` `@` `.` `_` 作为原子值

所谓原子值就是没有具体含义，只需要知道这个值，而不关心它具体是啥。类似于 C 语言中的`#define age 10`中的`age`。最大作用在于标识 匹配 和 比较．

```erlang
2> name.                            % atom variable
name
```

#### 特殊的原子值 true false ok

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

### Bit String 位串

```erlang
4> <<5,10,20>>.
<<5,10,20>>
5> <<65,66,67>>.
<<"ABC">>
6> <<"hello">>. 
<<"hello">>

% list_to_binary(L) -> B
7> Bin1 = <<1,2,3>>.
<<1,2,3>>
8> Bin2 = <<4,5>>.
<<4,5>>
9> Bin3 = <<6>>.
<<6>>
10> list_to_binary([ Bin1, 1, [2, 3, Bin2], 4 | Bin3 ]).
<<1,2,3,1,2,3,4,5,4,6>>

% term_to_binary(Term) -> Bin  把任何数据类型转换成一个二进制类型
% binary_to_term(Bin) -> Term
11> B = term_to_binary( {binaries, "are", useful } ).
<<131,104,3,100,0,8,98,105,110,97,114,105,101,115,107,0,3,
  97,114,101,100,0,6,117,115,101,102,117,108>>
12> X = binary_to_term(B).
{binaries,"are",useful}
```

#### 位语法

```erlang
12> Pixels = <<213,35,23,64,78,12,34,12,234>>.
<<213,35,23,64,78,12,34,12,234>>

% 数字表示匹配的 bit 数
14> <<Pix1:24,Pix2:24,Pix:24>> = Pixels.
<<213,35,23,64,78,12,34,12,234>>

17> <<R:8,G:8,B:8>> = <<Pix1:24>>.
<<213,35,23>>

18> R.
213

% /binary 匹配剩下的所有 bit
21> <<R:8, Rest/binary>> = Pixels.
<<213,35,23,64,78,12,34,12,234>>

23> Rest.
<<35,23,64,78,12,34,12,234>>

% 二进制推导式
24> << <<X>> || <<X>> <= <<1,2,3,4,5>> , X rem 2 == 0 >>.
<<2,4>>

% 二进制 到 列表
26> RGB = [ {R, G, B} || << R:8, G:8, B:8>> <= Pixels ].
[{213,35,23},{64,78,12},{34,12,234}]

% 列表 到 二进制
27> << <<R:8, G:8, B:8>> || {R,G,B} <- RGB >>.
<<213,35,23,64,78,12,34,12,234>>
```

### 元组 tuple

元组用来组合多个值。并且提供了一种相等匹配模式，用来非常方便的取出元组里的值。

```erlang
14> P = {10, 45}.                                          % P表示一个点
{10,45}
15> Person = {person, {name, "codekissyoung"}, {age, 24}}. % Person 表示一个人
{person,{name,"codekissyoung"},{age,24}}
16> P.                                                     % 展示 P
{10,45}
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

### 列表 list

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

### 字符串 string

`Erlang`字符串本质为`Unicode`数字列表。

```erlang
48> [83,117,114,112,114,105,115,101].
"Surprise"
51> "中国汉语".
[20013,22269,27721,35821]
```

### Record

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
[todo]

4> #todo{}. % 实例化一个 todo
#todo{status = reminder,who = joe,text = undefined}

5> X = #todo{status=urgent, text="Fix errata in book"}. % 实例化一个 todo 绑定到 X
#todo{status = urgent,who = joe,text = "Fix errata in book"}

7> X2 = X#todo{status=done, who=joe, text="gone with Wind"}. % 修改 X 后，绑定到 X2
#todo{status = done,who = joe,text = "gone with Wind"}

8> #todo{who=W, text=Txt} = X2. % 模式匹配
#todo{status = done,who = joe,text = "gone with Wind"}
9> W.
joe
10> Txt.
"gone with Wind"

11> X2#todo.text. % 直接访问 record 里字段的值
"gone with Wind"
12> X2#todo.who. 
```

### Map

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

```erlang
% 函数格式: Body 必须是一个或者多个用 , 分割的 Erlang 表达式, 最后一个表达式的值作为返回值
Name(Args) -> Body.
```

函数可以顺序并行执行，而模块则是包含了多个函数，是组织代码的基本单元。

```erlang
-module(geometry).                      % 声明本文件是 geometry 模块
-define(PI, 3.14159). % 定义宏
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
- `;` 用于分隔函数子句
- `.` 是句号，分隔函数整体

再来看一个例子，体会下参数的变化

```erlang
-module(shop).
-export([cost/1, total/1]).

cost(oranges) -> 5;
cost(newspaper) -> 8;
cost(apples) -> 2;
cost(pears) -> 10;
cost(milk) -> 7.

total( [{What,N}|T] ) -> shop:cost(What) * N + total(T);
total( [] ) -> 0.
```

运行结果如下:

```erlang
2> BuyList = [{oranges,4}, {newspaper,1}, {milk,3}, {apples, 10}].
[{oranges,4},{newspaper,1},{milk,3},{apples,10}]
4> shop:total(BuyList).
69
```

#### 高阶函数 fun

通过下面的`fun`直观的来感受下高阶函数：

```erlang
4> Double = fun(X) -> 2 * X end.
#Fun<erl_eval.6.99386804>
5> Double(2).
4
7> Hypot = fun(X, Y) -> math:sqrt(X*X +Y*Y) end.
#Fun<erl_eval.12.99386804>
8> Hypot(10, 20).
22.360679774997898

10> TempConvert = fun({c, C}) -> {f, 32+C*9/5};
10>                  ({f, F}) -> {c, (F-32)*5/9} end.
#Fun<erl_eval.6.99386804>
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
# 返回 Fun 类型
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
-module(shop).
-export([cost/1, total/1]).

% cost 函数略

sum([H|T]) -> H + sum(T);
sum([]) -> 0.

map(_, []) -> [];
map(F, [H|T]) -> [F(H) | map(F, T)].

total( L ) ->
    sum( map( fun({What,N}) -> shop:cost(What) * N end, L ) ).
```

```erlang
6> shop:total([{oranges,6},{newspaper, 1},{milk, 2}]).
52
```



#### 自定义控制抽象

Erlang 没有 If Switch for while 语句，但是使用模式匹配和高阶函数，却可以创造自己的＂控制抽象＂，一则可以根据实际问题创建出精确的控制结构，二来不受语言自带的少量固定控制结构的束缚．

```erlang
-module(lib).
-export([for/3]).

for(Max, Max, F) -> % 这句一定要在前面，是终止条件
  [ F(Max) ];
for(I, Max, F) ->
  [ F(I) | for(I+1, Max, F) ].

%% 20> c("lib.erl").
%% {ok,lib}
%% 21> lib:for(1, 10, fun(X) -> X end).
%% [1,2,3,4,5,6,7,8,9,10]
%% 22> lib:for(1, 10, fun(X) -> X * 2 end).
%% [2,4,6,8,10,12,14,16,18,20]
```

#### 可重入解析代码 reentrant parsing code
#### 解析组合器 parser combinator
#### 惰性求值器 lazy evaluator

#### 列表推导 list comprehension

```erlang
[ Expression || Generator ... , filter ... ] % || 左边是想要的结果，|| 右边的表达式执行顺序是 从左到右
```

```erlang
# 使用高阶函数
1> L = [1,2,3,4,5].
[1,2,3,4,5]
2> lists:map(fun(X) -> 2 * X end, L).
[2,4,6,8,10]

# 等价的列表推导
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

### 保护式/卫式/关卡

```erlang
max(X, Y) when X > Y -> X; % 如果匹配这句，就直接返回
max(X, Y) -> Y.

% , 等价 andalso ; 等价 orelse
% if( is_int(X) && X > Y && Y < 6 ) return X
moreThan6(X, Y) when is_integer(X), X > Y, Y < 6 -> X; 
moreThan6(X, Y) -> Y.
```

### if Expr

if 的表现与 "函数+卫式" 的构造一样：

```erlang
% 使用 if 改写 cost
%%2> shop:cost2(orange).
%%5
%%3> shop:cost2(milk).
%%7
%%4> shop:cost2(aaaa).
%%unkown
%%5>
cost2(X) ->
  if
    X == orange -> 5;
    X == newspaper -> 8;
    X == apples -> 2;
    X == pears -> 9;
    X == milk -> 7;
    true -> unkown
  end.
```

### case of Expr

case of 的表达式就像是整个函数头，可以对函数的每个参数使用复杂的匹配模式，以及卫式

```erlang
filter(F, [H|T] ) -> % case 表达式实现 filter
  case F(H) of
    true -> [ H | filter(F, T) ];
    false -> filter(F,T)
  end;
filter(F,[]) -> [].

beach(Temprature) -> % 根据温度决定去不去海滩玩耍
  case Temprature of
    {celsius, N } when N >= 20, N =< 45 -> 'favorable';
    {kelvin, N} when N >= 293, N =< 318 -> 'favorable';
    _ -> 'avoid beach'
  end.
```



## 4. 错误处理

主动抛出错误的方式：

```erlang
generate_exception(1) -> a;           % 正常
generate_exception(2) -> {'EXIT', a}; % 正常
generate_exception(3) ->
  throw(a); % 抛出一个异常, 没有让进程崩溃的意思，只是为了改变控制流(非局部返回)，并期望调用方去处理异常
generate_exception(4) ->
  exit(a); % 终止当前进程时使用，如果未捕捉，则会广播　{'EXIT', Pid, Why} 到其他链接到本进程的其他进程，不会返回Stack
generate_exception(5) ->
  error(a). % 崩溃性错误,会结束当前进程，会返回 Stack
```

使用`catch`将异常处理成 `{"Exit",...}` 返回

```erlang
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
%%[{file,"error.erl"},{line,15}]},
%%{error,'-demo2/0-lc$^0/1-0-',1,
```

通过　`try catch`　语句捕获错误，并分开处理

```erlang
% throw exit error 都可以被捕获和处理
catcher(N) ->
  % N 是入参 Ret 是表达式的返回值
  try % 中间可以写多个表达式 , 号隔开
    generate_exception(N)
  of
    Ret -> {N, normal, Ret} % 如果表达式执行正常，未抛出异常
  catch
    throw:Ret -> {N, caught, thrown, Ret}; % 处理 throw 异常
    exit:Ret -> {N, caught, exited, Ret};  % 处理 exit 异常
    error:Ret -> {N, caught, error, Ret};  % 处理 error 异常
    _:_ -> {unkown, error}											% 处理所有异常错误的代码
  after % 一定会执行的子句，不返回任何值，常用来关闭打开的文件等操作
    {N, always, exec }
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



## 5. 并发

### 5.1 产生新进程

```erlang
16> F = fun() -> io:format("new process~n") end.              
#Fun<erl_eval.21.126501267>
17> spawn(F). % 产生一个新进程
new process
<0.126.0>

13> G = fun(X) -> timer:sleep(10), io:format("~p~n", [X]) end.
#Fun<erl_eval.7.126501267>

% 产生多个新进程，并且通过闭包，传递的值 X 
15> [spawn(fun() -> G(X) end) || X <- lists:seq(1,10)]. 
[<0.114.0>,<0.115.0>,<0.116.0>,<0.117.0>,<0.118.0>,
 <0.119.0>,<0.120.0>,<0.121.0>,<0.122.0>,<0.123.0>]
1   
2 ...

% 运行一个模块里的函数作为进程
spawn(模块名，函数名，参数list).
```

### 5.2 发送数据

```erlang
Pid ! {a, 12} % 向 Pid 发送消息 {a, 12} 

foo(12) ! area({square, 5}) % foo(12) 必须返回一个 Pid , area(...) 将表达式计算出的值，发送给 Pid
```

```erlang
6> self() ! hello. % 向 erlang shell 发送数据
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

### 5.3 接收数据

```erlang
receive
	Pattern1 when Guard1 -> Expr1;   % 匹配模式一一验证
	...
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
1> c("concurence.erl").
{ok,concurence}
2> D1 = spawn(concurence, dolphin, []).
<0.85.0>
3> D1 ! {self(),fish}.
{<0.78.0>,fish}
4> flush()>
4> flush().
Shell got "thanks"
false
```

保存状态：

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
<0.62.0>
2> Pid ! {self(), {store, milk}}.
{<0.60.0>,{store,milk}}
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



## BIF

```erlang
1> element(2, {a,b,c}).
b
```























