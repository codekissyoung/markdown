# Erlang 教程

面向消息、面向并发的语言`Erlang`!!!

## 1. 安装与部署

```bash
$ sudo apt-get install erlang
```

## 2. 变量与数据类型

```bash
$ erl                       # 进入 erl shell
1> q().                     # 退出 erl shell
2> help().                  # 展示 erl shell 中所有可以调用的命令
```

### 变量

大写字母开头的单词是变量 (Name X Age)

在命令式的语言(C Go JAVA)里，变量名其实是伪装起来的内存地址，`X = 12`　表达的将该内存地址处的值修改为 `12`.

而在 Erlang 中，`X = 12` 表示 X 本身就是 12，两者绑定在一起了，不可更改。

```erlang
1> Name.                            % unbond variable
* 1: variable 'Name' is unbound
1> Name = "Link".                   % bind "Link" to Name
"Link"
2> Name = "codekissyoung".          % Name can not changed once bind to one Value
** exception error: no match of right hand side value "codekissyoung"
```

### 原子值 atom

而小写字母开头（`name` `friend`）作为原子值

所谓原子值就是没有具体含义，只需要知道这个值，而不关心它具体是啥。类似于 C 语言中的`#define age 10`中的`age`。

```erlang
2> name.                            % atom variable
name
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

如果想要表示一个可以增长的组合呢?

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
1> F1 = #{ a => 1, b => 2 }. # 创建一个 Map 绑定到 F1
#{a => 1,b => 2}

2> Facts = #{ {wife,fred} => "Sue", {age, fred} => 45 }. % 键值可以是任何 Erlang 类型
#{{age,fred} => 45,{wife,fred} => "Sue"}

3> F2 = F1#{ c => xx }. # 新增键后，绑定到 F2
#{a => 1,b => 2,c => xx}

4> F3 = F2#{ c := ok }. # 修改键后，绑定到 F3
#{a => 1,b => 2,c => ok}
```



## 模块与函数

`Erlang`的函数可以顺序/并行执行，而模块则是包含了多个函数，是组织代码的基本单元。

```erlang
% geometry.erl
-module(geometry).                      % 声明本文件是 geometry 模块
-export([test/0, area/1]).              % 导出 test area 函数，0 1 是参数数目

% 实现1 求正方形面积
area({rectangle, Width, Height})
    -> Width * Height;
% 实现2 求圆形面积
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
5>
```

如果要加上求圆形面积，只需要增加：

```erlang
% 实现3 求圆形面积
area({circle, Radius})
    -> 3.14159 * Radius * Radius;
```

如果用 C 或 JAVA 实现同样的功能代码，可以对比下代码行数，以及表达意图的清晰程度。`Erlang` 很明显地只包含了表达意图的必要的代码，而把所有罗嗦的语法全部去掉了。

再来解释下标点符号的使用：

- `,` 用于分隔开函数调用、数据构造、和模式中的参数
- `;` 用于分隔子句
- `.` 是句号，分隔函数整体，以及 erl shell 里的表达式

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

运行结果如下，应该很容易就能看懂，不用解释了：

```erlang
$ erl
1> c(shop).
{ok,shop}
2> BuyList = [{oranges,4}, {newspaper,1}, {milk,3}, {apples, 10}].
[{oranges,4},{newspaper,1},{milk,3},{apples,10}]
4> shop:total(BuyList).
69
```

### 高阶函数 fun

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

cost(oranges) -> 5;
cost(newspaper) -> 8;
cost(apples) -> 2;
cost(pears) -> 10;
cost(milk) -> 7.

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



### 自定义控制抽象

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

### 可重入解析代码 reentrant parsing code
### 解析组合器 parser combinator
### 惰性求值器 lazy evaluator

### 列表推导 list comprehension

格式：

```erlang
[ X || 生成器, 过滤器, 位串] % || 左边是想要的结果，|| 右边的表达式执行顺序是 从左到右
```

`X` 可以是任意的表达式，而后面的`Qualifier`可以是生成器 或 过滤器。同样的功能，使用列表推导比使用 map 的高阶函数版本更简洁。

```erlang
# 使用高阶函数
1> L = [1,2,3,4,5].
[1,2,3,4,5]
2> lists:map(fun(X) -> 2 * X end, L).
[2,4,6,8,10]

# 等价的列表推导
4> [ 2 * X || X <- L ]. %  X <- L 是生成器表达式
[2,4,6,8,10]

5> Buy = [{oranges,4},{newspaper,1},{apples,10},{pears,5}].
[{oranges,4},{newspaper,1},{apples,10},{pears,5}]

6> [{Name, 2 * Number} || {Name, Number} <- Buy].
[{oranges,8},{newspaper,2},{apples,20},{pears,10}]

# 生成表达式也起到了过滤器作用
7> [X || {a, X} <- [{a,1}, {b,2}, {c,3}, {a, 4}, hello, "link"] ].
[1,4]

7> L = [1,2,3,4,5,6,7].
[1,2,3,4,5,6,7]
8> L2 = [ X * X || X <- L ].             % 生成器
[1,4,9,16,25,36,49]
10> L3 = [ X * X || X <- L, X > 3 ].     % 生成器, 过滤器
[16,25,36,49]
1> [ X || {a, X} <- [{a,1}, {b,2}, {a,4}, "hello", atom] ]. % 过滤器
[1,4]
```

使用列表推导表达式改写的`total`版本：

```erlang
total( L ) ->
    sum( [shop:cost(A) * B || {A, B} <- L] ).
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

#### 关卡

```erlang
max(X, Y) when X > Y -> X;      % 关卡结构，如果匹配这句，就直接返回
max(X, Y) -> Y.

moreThan6(X, Y)
    when is_integer(X), X > Y, Y < 6 -> X; % 等价于 if( is_int(X) && X > Y && Y < 6 ) return X
moreThan6(X, Y)
    -> Y.
```

### case Expr

```erlang
% case 表达式实现 filter
filter(F, [H|T] ) ->
  case F(H) of
    true -> [H|filter(F,T)];
    false -> filter(F,T)
  end;
filter(F,[]) -> [].
```

### if Expr



## 错误处理

![](https://img.codekissyoung.com/2020/04/02/c83f5f4263e95c387759164ce81ff739.png)

## 命令行

```bash
$ erlc hello.erl
$ erl -noshell -s hello start -s init stop
Hello world
```
