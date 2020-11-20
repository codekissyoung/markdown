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



## 模块与函数

函数可以并行执行，组织在模块里．

### 高阶函数fun

```erlang
1> Double = fun(X) -> 2 * X end.
#Fun<erl_eval.7.126501267>
2> Double(2).
4
3> TempConv = fun({c,C}) -> {f, 32 + C * 9 / 5 }; ({f,F}) -> {c, (F - 32) * 5 / 9 } end. 
#Fun<erl_eval.7.126501267>
4> TempConv({c,100}).
{f,212.0}
5> TempConv({f,100}).
{c,37.77777777777778}
6> 
```

#### map 与 filter

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



### 列表推导 list comprehension

```erlang
[ X || 生成器, 过滤器, 位串] % || 左边是想要的结果，|| 右边的表达式执行顺序是 从左到右，
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

5> Buy = [{oranges,4},{newspaper,1},{apples,10},{pears,5}].
[{oranges,4},{newspaper,1},{apples,10},{pears,5}]

6> [{Name, 2 * Number} || {Name, Number} <- Buy].
[{oranges,8},{newspaper,2},{apples,20},{pears,10}]

# 生成表达式也起到了过滤器作用
7> [X || {a, X} <- [{a,1}, {b,2}, {c,3}, {a, 4}, hello, "link"] ].
[1,4]

% 快速排序　生成表达式 + 过滤表达式
qsort([]) -> [];
qsort([Piv | T]) ->
  qsort([ X || X <-T, X < Piv])
  ++ [Piv] ++
  qsort([ X || X <-T, X >= Piv]).
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

### 记录



### case表达式

```erlang

```

