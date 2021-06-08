# 函数

## 0. 内置函数

```go
close(ch) // 关闭 channel
len(a) // 返回字符串、数组、切片、map 和管道的长度或数量
cap(a) // 返回 Slice Map 的最大容量
new(T) // 用于值类型和用户定义的类型，如自定义结构，返回指针
make(M) // 用于 Slice Map Channel　的初始化
copy() // 复制Slice
append() // 追加数据到切片里
panic() recover() // 用于错误处理机制
```

## 1. 可变参数类型

```go
func sum(args []int) int {
	var sum int
	for _, arg := range args {
		sum += arg
	}
	return sum
}

func sum2(args ...int) int {　// 实际上可变参数就是　切片　的一个语法糖写法
    // 实现同上 ...
}

func scale10(args ...int) []int {
    // ...
}
func main() {
	fmt.Println(sum([]int{2, 3, 4})) // 9
	fmt.Println(sum2(2, 3, 4))       // 9

	list := []int{2, 3, 4}
	list = scale10(list...)    // 将切片作为可变参数，完整传递给下一个函数的语法糖写法
	fmt.Println(sum2(list...)) // 90
}
```

如果变长参数的类型并不是都相同的呢？有 2 种方案可以解决这个问题：

1. 使用结构体，存储所有可能的参数
1. 使用空接口类型的不定参数，例如：`func checkType(value ...interface{})`

## 2. 一等公民

first class object : 可以在运行期创建、可作为值（参数、返回值、变量）的实体。

局限性：只能与 nil 比较．即便有相同函数类型　`fn1 == fn2`　语句也是错误的，而其他的一等公民（基础类型等）就没这个限制

#### 立即执行匿名函数

```go
func(s string) {
    println(s)
}("hello , world")
```

#### 赋值给变量

```go
func(x, y int) int { return x + y } // 无法独自存在　non-declaration statement　outside function body

// 可以存储到变量里
hypot := func(x, y float64) float64 {
    return math.Sqrt(x*x + y*y)
}

print hypot(5, 12)  // 调用
```

#### 作为参数

```go
fmt.Println(compute(hypot))
fmt.Println(compute(math.Pow))

func compute(fn func(float64, float64) float64) float64 {
    return fn(3, 4)
}
```

#### 作为返回值

```go
func MakeAddSuffix(suffix string) func(string) string {
	return func(name string) string {
		if !strings.HasSuffix(name, suffix) {
			return name + suffix
		}
		return name
	}
}

addBmp := MakeAddSuffix(".bmp")
addJpeg := MakeAddSuffix(".jpeg")

addBmp("file") // returns: file.bmp
addJpeg("file") // returns: file.jpeg
```

#### 作为结构体成员

```go
type calc struct {
		mul func(x, y int) int
}
x := calc{
    mul: func(x, y int) int {
        return x * y
    },
}
```

#### 通道里传递

```go
c := make(chan func(int, int) int, 2)

c <- func(x, y int) int {
    return x + y
}

c <- func(x, y int) int {
    return x * y
}

fmt.Println((<-c)(2, 3)) // 5
fmt.Println((<-c)(2, 3)) // 6
```

#### Demo: 以流的方式处理数据

```go
var list = []string{
		"go scanner",
		"go parser",
		"go compiler",
}
func main(){
	chain := []func(string) string{
		removePrefix,　      // 工序1. 去前缀
		strings.TrimSpace,　 // 工序2. 去空格
		strings.ToUpper,     // 工序3. 转换成大写
	}
	StringProccess(list, chain)
}
func StringProccess(list []string, chain []func(string) string) {
	for index, str := range list {
		result := str
		for _, proc := range chain {
			result = proc(result)
		}
		list[index] = result
	}
}
func removePrefix(str string) string {
	return strings.TrimPrefix(str, "go")
}
```

#### Demo: map[string]func()映射

```go
var skillParam = flag.String("skill", "", "skill to perform")
func main(){
	flag.Parse()
	var skill = map[string]func(){
		"fire": func() {
			fmt.Println("chicken fire")
		},
		"run": func() {
			fmt.Println("soldier run")
		},
		"fly": func() {
			fmt.Println("angel fly")
		},
	}
	if f, ok := skill[*skillParam]; ok {
		f()
	} else {
		fmt.Println("skill not found")
	}
}
```

## 3. 闭包

**闭包**　是引用了自由变量的函数．被引用的自由变量和函数一同存在，即使已经离开了自由变量的环境也不会被释放或，在闭包中可以继续使用这个自由变量．

> 函数 + 引用到的外部变量 = 闭包

一个函数类型就像结构体一样，可以被实例化，函数本身不存储任何信息，只有与引用环境结合后形成的闭包才具有**“记忆性”**，函数是编译期静态的概念，而闭包是运行期动态的概念。

闭包对环境中变量的引用过程也可以被称为　**“捕获”**。捕获有两种类型，可以改变引用的原值叫做　**“引用捕获”**，捕获的过程值被复制到闭包中使用叫做　**“复制捕获”**。



匿名函数同样被称之为闭包：它们被允许调用定义在其它环境下的变量。

闭包可使得某个函数捕捉到一些外部状态，例如：函数被创建时的状态。

另一种表示方式为：一个闭包继承了函数所声明时的作用域。这种状态（作用域内的变量）都被共享到闭包的环境中，因此这些变量可以在闭包中被操作，直到被销毁。

闭包经常被用作包装函数：它们会预先定义好 1 个或多个参数以用于包装，详见下一节中的示例。另一个不错的应用就是使用闭包来完成更加简洁的错误检查。

### 3.1 内部修改引用的变量

```go
str := "hello world"
foo := func() {
    fmt.Println("in foo : ", str) // hello world
    str = "hello dude"
}
foo()
fmt.Println(str) // hello dude

str = "改回去了"
foo() // in foo :  改回去了
```



```go
var g int
go func(i int) {
	s := 0
	for j := 0; j < i; j++ { s += j }
	g = s
}(1000) // Passes argument 1000 to the function literal.
```

### 3.2 记忆效应

```go
func Accumulate(value int) func() int {
	return func() int {
		value++
		return value
	}
}
func main() {
	accumulator := Accumulate(1)
	fmt.Println(accumulator())       // 2
	fmt.Println(accumulator())       // 3
	fmt.Printf("%p\n", &accumulator) // 0xc00000e028

	accumulator2 := Accumulate(10)
	fmt.Println(accumulator2())       // 11
	fmt.Printf("%p\n", &accumulator2) // 0xc00000e038
}
```

### 3.3 生成器

```go
func playerGen(name string) func() (string, int) {
	hp := 150 // 血量一直为150
	return func() (string, int) {
		return name, hp
	} // 返回创建的闭包
}

func main() {
	generator := playerGen("jack Ma")
	name, hp := generator()
	fmt.Println(name, hp) // jack Ma 150
}
```

闭包还具有一定的封装性，`hp` 是 playerGen 的局部变量，playerGen 的外部无法直接访问及修改这个变量，这种特性也与面向对象中强调的封装性类似。

### 3.4 延迟求值效应

```go
func main() {
    for _, f := range test() {
        f()
    }
} // 2 2
func test() []func() {
	var s []func()
	for i := 0; i < 2; i++ {
		println(&i)
		s = append(s, func() {
			println(&i, i) // 这里的 i 与func()外部的 i 是同一个
		})
	}
	return s
}
```

`延迟求值`效应是由多个闭包引用同一个变量（内存空间）引起的．这会带来竞争状态，往往需要做同步处理。

```go
func main() {
	for _, f := range test() {
		f()
	}
} // 0 1
func test() []func() {
	var s []func()
	for i := 0; i < 2; i++ {
		var x int = i // 每次循环都重新创建一个局部变量
		println(&x)   // 0xc00001e0b8 0xc00001e0d0
		s = append(s, func() {
			println(&x, x)
		})
	}
	return s
}
```

### 3.5 斐波纳契数列

```go
func fibonacci() func() int {
	time, pre, next := 0, 0, 1
	return func() int {
		time++
		switch time {
		case 1:
			return pre
		case 2:
			return next
		default:
			pre, next = next, pre+next
			return next
		}
	}
}
func main() {
	f := fibonacci()
	for i := 0; i < 10; i++ {
		fmt.Println(f())
	}
}
```


```go
type Car struct {
	Model        string
	Manufacturer string
	BuildYear    int
}

type Cars []*Car

func (cs Cars) Process(f func(car *Car)) {
	for _, c := range cs {
		f(c)
	}
}

func (cs Cars) String() string {
	if len(cs) == 0 {
		return "()"
	}
	var s string
	s += "( "
	for _, v := range cs {
		s += v.Manufacturer + " " + v.Model + "; "
	}
	s += " )"
	return s
}

func MakeSortedAppender(manufacturers []string) (func(car *Car), map[string]Cars) {
	sortedCars := make(map[string]Cars)
	for _, m := range manufacturers {
		sortedCars[m] = make([]*Car, 0)
	}
	sortedCars["Default"] = make([]*Car, 0)

	appender := func(c *Car) {
		if _, ok := sortedCars[c.Manufacturer]; ok {
			sortedCars[c.Manufacturer] = append(sortedCars[c.Manufacturer], c)
		} else {
			sortedCars["Default"] = append(sortedCars["Default"], c)
		}
	}
	return appender, sortedCars
}

func main() {
	ford := &Car{"Fiesta", "Ford", 2008}
	bmw := &Car{"XL 450", "BMW", 2011}
	merc := &Car{"D600", "Mercedes", 2009}
	bmw2 := &Car{"X 800", "BMW", 2008}
	allCars := Cars([]*Car{ford, bmw, merc, bmw2})

	manufacturers := []string{"Ford", "Land Rover", "BMW", "Jaguar"}
	// 精髓是：返回了一个闭包以及闭包里的变量，这样闭包可以传入Process中，修改的就是该变量值
	sortedAppender, sortedCars := MakeSortedAppender(manufacturers)
	allCars.Process(sortedAppender)
	fmt.Printf("Map sortedCars: %v ", sortedCars)
}

```



## 4. 函数类型实现接口

```go
type Invoker interface {
	Call(interface{})
}

// 结构体类型
type Struct struct {
}
func (s *Struct) Call(p interface{}) {
	fmt.Println("from struct", p)
}

// 函数类型
type FuncCaller func(interface{})
func (f FuncCaller) Call(p interface{}) {
	f(p) // 调用f函数本体
}

func main() {
	var invoker Invoker

	s := new(Struct)
	invoker = s
	invoker.Call("hello")

	var f FuncCaller = func(v interface{}) {
		fmt.Println("from function", v)
	}
	invoker = f
	invoker.Call("hello")
}
```

## 5. Defer

#### 关闭资源

```go
// open a file  
defer file.Close() // 关闭文件流

mu.Lock()  
defer mu.Unlock()  // 解锁一个加锁的资源

printHeader()  
defer printFooter() // 打印最终报告

// open a database connection  
defer disconnectFromDB()  // 关闭数据库链接
```

#### 实现代码追踪

```go
func trace(s string) string {
	fmt.Println("entering:", s)
	return s
}

func un(s string) {
	fmt.Println("leaving:", s)
}

func a() {
	defer un(trace("a"))
	fmt.Println("in a")
}

func b() {
	defer un(trace("b"))
	fmt.Println("in b")
	a()
}

func main() {
	b()
}
```

#### 记录函数的参数与返回值

```go
func func1(s string) (n int, err error) {
	defer func() {
		log.Printf("func1(%q) = %d, %v", s, n, err)
	}()
	return 7, io.EOF
}

func main() {
	func1("Go") // Output: 2011/10/04 10:46:11 func1("Go") = 7, EOF
}
```

#### 修改返回值

defer 是在 函数 return 之后依次执行的

```go
func f() (ret int) {
	defer func() {
		ret++ // 这里将 return 后的值　自增了1
	}()
	return 1
}
func main() {
	fmt.Println(f()) // 2
}
```

defer 能不能修改到返回值的关键是：要区分清楚是修改的是返回值本身，还是拷贝？

```go
func f2() (r int) {
	t := 5
	defer func() {
		t += 5
	}()
	return t
}　// f2() = 5

func f3() (r int) {
	defer func(r int) {
		r = r + 5
	}(r) // 这里有赋值操作，所以成副本了
	return 1
}　// f3() = 1
```

都采用匿名返回值的话，实际上都发生了复制操作，defer 函数就无法修改到返回值了：

```go
func f4() int {
	r := 0
	defer func() {
		r++
	}()
	return r
} // f4() = 0

func f5() int {
	r := 0
	defer func(i int) {
		i++
	}(r)
	return 0
} // f5() = 0
```

## 6. panic 和 recover 

panic 和 recover 的组合有如下特性：

- 有 panic 没 recover，程序宕机。
- 有 panic 也有 recover，程序不会宕机，执行完对应的 defer 后，从宕机点退出当前函数后继续执行
- 在 panic 触发的 defer 函数内，可以继续调用 panic，进一步将错误外抛，直到程序整体崩溃
- 如果想在捕获错误时设置当前函数的返回值，可以使用`命名返回值`方式直接进行设置

```go
// 崩溃时需要传递的上下文信息
type panicContext struct {
	function string // 所在函数
}

// 保护方式运行一个函数
func ProtectRun(entry func()) {
	defer func() {
		err := recover() // 发生宕机时，获取panic传递的上下文并打印
		switch err.(type) {
		case runtime.Error: // 运行时错误
			fmt.Println("runtime error:", err)
		default: // 非运行时错误
			fmt.Println("error:", err)
		}
	}()
	entry()
}

func main() {
	fmt.Println("运行前")
	// 允许一段手动触发的错误
	ProtectRun(func() {
		fmt.Println("手动宕机前")
		// 使用panic传递上下文
		panic(&panicContext{
			"手动触发panic",
		})
		fmt.Println("手动宕机后") // Unreachable code
	})

	// 故意造成空指针访问错误 运行时错误
	ProtectRun(func() {
		fmt.Println("赋值宕机前")
		var a *int
		*a = 1               // 从宕机点退出当前函数后，继续执行
		fmt.Println("赋值宕机后") // 这句不会执行
	})
	fmt.Println("运行后")
}
//运行前
//手动宕机前
//error: &{手动触发panic}
//赋值宕机前
//runtime error: runtime error: invalid memory address or nil pointer dereference
//运行后
```



```go
func main() {
	defer func() { fmt.Println("clean main resources") }()
	// defer catch()
	test()
	fmt.Println("afterErrorfunc() finished")
}
func test() {
	defer func() { fmt.Println("clean test resourses") }()
	// defer catch()
	testError()
	fmt.Println("test() finished")
}
func testError() {
	defer func() { fmt.Println("cleaned testEroor resources") }()
	// panic("i am testError painc")
	fmt.Println("testError() finished")
	// panic("i am second painc")
}
```

```go
func catch() {
	if r := recover(); r != nil {
		fmt.Println("got a painc :", r)
		var err error
		switch x := r.(type) {
		case string:
			err = errors.New(x)
		case error:
			err = x
		default:
			err = errors.New("")
		}
		if err != nil {
			fmt.Println("recovered :", err)
		}
	}
}
```

`defer-panic-recover` 在某种意义上也是一种像 `if`，`for` 这样的控制流机制。

Go 标准库中许多地方都用了这个机制，例如，json 包中的解码和 regexp 包中的 Complie 函数。Go 库的原则是即使在包的内部使用了 panic，在它的对外接口（API）中也必须用 recover 处理成返回显式的错误。

这是所有自定义包实现者应该遵守的最佳实践：

1）*在包内部，总是应该从 panic 中 recover*：不允许显式的超出包范围的 panic()

2）*向包的调用者返回错误值（而不是 panic）。*

在包内部，特别是在非导出函数中有很深层次的嵌套调用时，将 panic 转换成 error 来告诉调用方为何出错，是很实用的（且提高了代码可读性）。

```go
// A ParseError indicates an error in converting a word into an integer.
type ParseError struct {
    Index int      // The index into the space-separated list of words.
    Word  string   // The word that generated the parse error.
    Err error // The raw error that precipitated this error, if any.
}

// String returns a human-readable error message.
func (e *ParseError) String() string {
    return fmt.Sprintf("pkg parse: error parsing %q as int", e.Word)
}

// Parse parses the space-separated words in in put as integers.
func Parse(input string) (numbers []int, err error) {
    // 可导出的 Parse 函数会从 panic 中 recover 并用所有这些信息返回一个错误给调用者
    defer func() {
        if r := recover(); r != nil {
            var ok bool
            err, ok = r.(error)
            if !ok {
                err = fmt.Errorf("pkg: %v", r)
            }
        }
    }()

    fields := strings.Fields(input)
    numbers = fields2numbers(fields)
    return
}

func fields2numbers(fields []string) (numbers []int) {
    if len(fields) == 0 {
        panic("no words to parse")
    }
    for idx, field := range fields {
        num, err := strconv.Atoi(field)
        if err != nil {
            panic(&ParseError{idx, field, err})
        }
        numbers = append(numbers, num)
    }
    return
}
```

#### 一种用闭包处理错误的模式

```go
type fType1 func f(a type1, b type2)
func check(err error) { if err != nil { panic(err) } }

// 这是一个包装函数。接收一个 fType1 类型的函数 fn 并返回一个调用 fn 的函数。里面有 defer/recover 机制
func errorHandler(fn fType1) fType1 {
	return func(a type1, b type2) {
		defer func() {
			if err, ok := recover().(error); ok {
				log.Printf("run time panic: %v", err)
			}
		}()
		fn(a, b)
	}
}

// 当错误发生时会 recover 并打印在日志中
func f1(a type1, b type2) {
	...
	f, _, err := // call function/method
	check(err)
	t, err := // call function/method
	check(err)
	_, err2 := // call function/method
	check(err2)
	...
}
```

通过这种机制，所有的错误都会被 recover，并且调用函数后的错误检查代码也被简化为调用 check(err) 即可。在这种模式下，不同的错误处理必须对应不同的函数类型；它们（错误处理）可能被隐藏在错误处理包内部。可选的更加通用的方式是用一个空接口类型的切片作为参数和返回值。



## 7. 间接实现函数重载

函数重载是不被允许的。在 Go 语言中函数重载可以用可变参数 `...T` 作为函数最后一个参数来实现。如果我们把 T 换为空接口，那么可以知道任何类型的变量都是满足 T (空接口）类型的，这样就允许我们传递任何数量任何类型的参数给函数，即重载的实际含义。

函数 `fmt.Printf` 就是这样做的：

```go
fmt.Printf(format string, a ...interface{}) (n int, errno error)
```

这个函数通过枚举 `slice` 类型的实参动态确定所有参数的类型。并查看每个类型是否实现了 `String()` 方法，如果是就用于产生输出信息。