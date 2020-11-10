# 函数

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



## 2. 一等公民

first class object : 可以在运行期创建、可作为值（参数、返回值、变量）的实体。

局限性：只能与 nil 比较．即便有相同函数类型　`fn1 == fn2`　语句也是错误的，而其他的一等公民（基础类型等）就没这个限制

#### 立即执行的匿名函数

```go
func(s string) {
    println(s)
}("hello , world")
```

#### 赋值给变量

```go
hypot := func(x, y float64) float64 {
    return math.Sqrt(x*x + y*y)
}
fmt.Println(hypot(5, 12))
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
func getOperation() func(int, int) int {
	return func(x, y int) int {
		return x + y
	}
}
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
## 5. panic 和 recover 机制

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
