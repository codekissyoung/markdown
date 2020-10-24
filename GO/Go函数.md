# Go函数详解

`Go`语言有三种类型的函数：普通带名字的函数、匿名`lambda`函数、方法。

## 1. 传参

```go
type InnerData struct {
	a int
}
type Data struct {
	complax []int
	instance InnerData
	ptr *InnerData
}
func passByValue(inFunc Data) Data {
	fmt.Printf("fn value: %+v ptr : %p \n", inFunc, &inFunc )
	return inFunc
}
func main(){
	in := Data{
		complax: []int{1, 2, 3},
		instance: InnerData{
			5,
		},
		ptr: &InnerData{1},
	}
	// in : value: {complax:[1 2 3] instance:{a:5} ptr:0xc000110000} ptr: 0xc00010c000
	fmt.Printf("in : value: %+v ptr: %p \n", in, &in)
	// fn value: {complax:[1 2 3] instance:{a:5} ptr:0xc00001e0d8} ptr : 0xc000022210
	out := passByValue(in)
	// out value: {complax:[1 2 3] instance:{a:5} ptr:0xc00001e0d8} ptr : 0xc0000221e0 
	fmt.Printf("out value: %+v ptr : %p \n", out, &out)
}
```

### 1.1 传指针性能一定好么？

只有在所有指针都释放的时候，指针指向那个的内存空间，才会使用`GC`。指针被拷贝多份后，会延长内存对象的生命周期。

复制小对象一般在栈上，指令少而快，未必会比指针慢。

并发编程提倡使用不可变对象（只读或者复制），可以消除数据同步的麻烦。

总之，指针在`传递大对象` `修改原对象状态`时，使用比较好，其他时候不作考虑。

### 1.2 可变参数类型

```go
func sum(args []int) int {
	var sum int
	for _, arg := range args {
		sum += arg
	}
	return sum
}
// 实际上可变参数就是　切片　的一个语法糖写法
func sum2(args ...int) int {
	var sum int
	for _, arg := range args {
		sum += arg
	}
	return sum
}
func scale10(args ...int) []int {
	for i, arg := range args {
		args[i] = arg * 10
	}
	return args
}
func main() {
	fmt.Println(sum([]int{2, 3, 4})) // 9
	fmt.Println(sum2(2, 3, 4))       // 9

	list := []int{2, 3, 4}
	list = scale10(list...)    // 将切片作为可变参数，完整传递给下一个函数的语法糖写法
	fmt.Println(sum2(list...)) // 90
}
```



## 2. 函数是一等公民

函数在`Go`里面是`First Class Object`第一类对象，什么意思？

- 可在运行期创建
- 是值,可以存入变量实体，只能与`nil`比较
- 可以作为函数的入参以及返回值

```go
func compute(fn func(float64, float64) float64) float64 {
    return fn(3, 4)
}
func main() {
    	// 1. 直接执行
    func(s string) {
        println(s)
    }("hello , world")
    
    // 2. 赋值给变量
    hypot := func(x, y float64) float64 {
        return math.Sqrt(x*x + y*y)
    }
    fmt.Println(hypot(5, 12))
    
    // 3. 作为参数
    fmt.Println(compute(hypot))
    fmt.Println(compute(math.Pow))
}
// 4. 作为返回值
func getOperation() func(int, int) int {
	return func(x, y int) int {
		return x + y
	}
}
```

```go
type calc struct {
		mul func(x, y int) int
}
// 5. 作为结构体成员
x := calc{
    mul: func(x, y int) int {
        return x * y
    },
}

// 6. 通道里传匿名函数
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

在不使用`闭包`特性的情况下，匿名函数最重要的作用是：

- 作用域隔离，不会有变量污染
- 没有定义顺序限制，必要时可以抽离
- 将大函数分解为多个相对独立的匿名函数块，再用简洁的调用完成逻辑流程，实现框架与细节分离

### 2.1 函数作为值

```go
func main(){
	list := []string{
		"go scanner",
		"go parser",
		"go compiler",
		"go printer",
		"go formater",
	}
	chain := []func(string) string{
		removePrefix,
		strings.TrimSpace,
		strings.ToUpper,
	}
	StringProccess(list, chain)
	for _, str := range list {
		fmt.Println(str)
	}
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

### 2.2 字符串映射到函数

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



### 2.3 函数类型也能实现接口

```go
type Invoker interface {
	Call(interface{})
}
type Struct struct {
}
func (s *Struct) Call(p interface{}) {
	fmt.Println("from struct", p)
}

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



## 3. 闭包

解释: Go语言中　**闭包**　是引用了自由变量的函数．被引用的自由变量和函数一同存在，即使已经离开了自由变量的环境也不会被释放或，在闭包中可以继续使用这个自由变量．

> 函数 + 引用环境 = 闭包

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
		//0xc00001e0b8 2
		//0xc00001e0b8 2
	}
}
func test() []func() {
	var s []func()
	for i := 0; i < 2; i++ {
		println(&i) // 0xc00001e0b8
		s = append(s, func() {
			println(&i, i) // 这里的 i 与func()外部的 i 是同一个
		})
	}
	return s
}
```

`延迟求值`效应是由 `多个匿名函数共享变量` 引起的，这是个坑，因为任意匿名函数对共享变量的修改，都会影响到其他匿名函数，这会带来竞争状态，往往需要做同步处理。

`闭包`特性让我们不用传递参数就能读取和修改外部函数的状态，但是要特别小心的使用。

```go
func main() {
	for _, f := range test() {
		f()
		//0xc00001e0b8 0
		//0xc00001e0b8 1
	}
}
func test() []func() {
	var s []func()
	for i := 0; i < 2; i++ {
		var x int = i // 每次循环都重新创建一个局部变量
		println(&x)   // 0xc00001e0b8 0xc00001e0d0
		s = append(s, func() {
			println(&x, x) // 这里的 i 与func()外部的 i 是同一个
		})
	}
	return s
}
```

```go
func adder() func(int) int {
	sum := 0
	return func(x int) int { // 每个返回的 函数 都绑定了 各自的 sum 变量
		sum += x             // 主动捕获了外部的 sum，绑定到了 return 的 func 上
		return sum
	}
}
func main() {
	pos, neg := adder(), adder()
	for i := 0; i < 10; i++ {
		fmt.Println( pos(i), neg( -2 * i ))
	}
}
```

对象就是附有行为的数据，闭包就是附有数据的行为。闭包设计的目的是：在函数间传递共享数据时，不想传参，不想依赖全局变量。是一种隐秘的共享数据的方式。

```go
var GlobalValue = 10
func main() {
	f := fa(1)
	g := fa(1)
	println(f(1))
	println(f(1))
	fmt.Println("GlobalValue: ", GlobalValue)
	println(g(2))
	println(g(3))
	fmt.Println("GlobalValue: ", GlobalValue)
}
func fa(a int) func(i int) int {
	return func(i int) int {
		println(&a, a)
		a = a + i
		GlobalValue = a * 2
		return a
	}
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

## 4. panic 和 recover 机制

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
