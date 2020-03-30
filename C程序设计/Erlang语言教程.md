# Erlang 教程

面向消息、面向并发的语言`Erlang`!!!

## 安装与部署

```bash
$ sudo apt-get install erlang
```

我们通过`erl shell`交互式命令行来学习`Erlang`语言。

## 变量与数据类型

```bash
$ erl                       # 进入 erl shell
Erlang/OTP 20 [erts-9.2] [source] [64-bit] [smp:6:6] [ds:6:6:10] [async-threads:10] [kernel-poll:false]
Eshell V9.2  (abort with ^G)
1> q().                     # 退出 erl shell
ok
2> help().                  # 展示 erl shell 中所有可以调用的命令
```

`Erlang`里面将大写字母开头的标识符（`Name` `X` `Age`）作为变量名。

```erl
1> Name.                            % unbond variable
* 1: variable 'Name' is unbound
1> Name = "Link".                   % bind "Link" to Name
"Link"
2> Name = "codekissyoung".          % Name can not changed once bind to one Value
** exception error: no match of right hand side value "codekissyoung"
```

`Erlang`变量最重要的一个概念就是一旦绑定到某个值后，它就不可以再重新绑定到其他值。

另外一种非常地道的理解思路是，将`=`作为一种相等匹配模式：假如要使`=`两边的东西相等，那么`Erlang`要做啥操作呢？答案是：让 `Name` 的实际内容存储为`Link`。

而小写字母开头（`name` `friend`）作为原子值，所谓原子值就是没有具体含义，只需要知道这个值，而不关心它具体是啥。类似于 C 语言中的`#define age 10`中的`age`。

```erl
2> name.                            % atom variable
name
```

#### 元组

`Erlang`提供了元组，用来组合多个值。并且提供了一种相等匹配模式，用来非常方便的取出元组里的值。

```erl
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

如何从元组定位取值呢?假如是 OOP 系列语言的话，可能有`PersonLocation[2].name`这样的方法，但是`Erlang`是完全不一样的，它用的是相等匹配。

```erl
32> PersonLocation.                                 % 先查看下 PersonLocation 的值
{{person,{name,"codekissyoung"},{age,24}},{10,45}}
33> {{_,{_,Name},_},_} = PersonLocation.            % 写匹配等式
{{person,{name,"codekissyoung"},{age,24}},{10,45}}
34> Name.
"codekissyoung"
```

`_`是占位符，用来接收不需要的值。我们再来复述一遍相等匹配模式：假如要使`=`两边的东西相等，那么`Erlang`要做啥操作呢？答案是：让 `Name` 的实际内容存储为`codekissyoung`。

### 列表

如果想要表示一个可以增长的组合呢?

`Erlang`还提供了列表，用来容纳多个值，并且提供了一种相等匹配模式`[H|T]`（`H`表示列表的第一个，`T`表示剩下的），用来非常方便的存入和取出操作。

```erl
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

### 字符串

`Erlang`字符串本质为`Unicode`数字列表。

```erl
48> [83,117,114,112,114,105,115,101].
"Surprise"
51> "中国汉语".
[20013,22269,27721,35821]
```

## 模块与函数

`Erlang`的函数可以顺序/并行执行，而模块则是包含了多个函数，是组织代码的基本单元。

```erl
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

```erl
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

```erl
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

```erl
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

```erl
$ erl
1> c(shop).
{ok,shop}
2> BuyList = [{oranges,4}, {newspaper,1}, {milk,3}, {apples, 10}].
[{oranges,4},{newspaper,1},{milk,3},{apples,10}]
4> shop:total(BuyList).
69
```

### 高阶函数

通过下面的`fun`直观的来感受下高阶函数：

```erl
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

```erl
1> L = [1,2,3,4].
[1,2,3,4]
3> L2 = lists:map(fun(X) -> 2*X end, L).
[2,4,6,8]

5> Even = fun(X) -> (X rem 2) =:= 0 end.
#Fun<erl_eval.6.99386804>
6> lists:filter(Even, [1,2,3,4,5,6,7,8]).
[2,4,6,8]
7> lists:map(Even, [1,2,3,4,5,6,7,8]).
[false,true,false,true,false,true,false,true]
```

再来看一下将高阶函数作为返回值的例子：

```erl
8> Fruit = [apple, pear, orange].
[apple,pear,orange]
9> MakeTest = fun(L) -> (fun(X) -> lists:member(X, L) end) end.
#Fun<erl_eval.6.99386804>
10> IsFruit = MakeTest(Fruit).
#Fun<erl_eval.6.99386804>
11> IsFruit(pear).
true
12> IsFruit(dog).
false
```

然后我们通过高阶函数来改造下`shop`例子：

```erl
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

```erl
6> shop:total([{oranges,6},{newspaper, 1},{milk, 2}]).
52
```

#### 列表推导

格式：

```erl
[ X || Qualifier1, Qualifier2 ... ]
```

`X` 可以是任意的表达式，而后面的`Qualifier`可以是生成器 或 过滤器。同样的功能，使用列表推导比使用 map 的高阶函数版本更简洁。

```erl
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

```erl
total( L ) ->
    sum( [shop:cost(A) * B || {A, B} <- L] ).
```

再来介绍一种连接列表的语法`++`：

```erl
12> [1,2,3] ++ [7,9] ++ [23,45].
[1,2,3,7,9,23,45]
```

使用列表生成器和`++`语法写成的快速排序：

```erl
qsort( [ MidValue | T ] ) ->
    qsort( [X || X <- T, X < MidValue])
    ++ [MidValue] ++
    qsort( [X || X <- T, X >= MidValue]);
qsort( [] ) -> [].
```

```erl
2> shop:qsort([8,7,5,2,1,45,23,45,90]).
[1,2,5,7,8,23,45,45,90]
```

## 命令行

```bash
$ erlc hello.erl
$ erl -noshell -s hello start -s init stop
Hello world
```
