# 函数

`Go`语言有三种类型的函数：普通带名字的函数、匿名`lambda`函数、方法。

## 普通函数

```go
// 如果给返回值命名，则可以直接在函数内部赋值，作为返回．非常好用的设计 ^_^
func my_division(sum, num int) ( quotient int, remainder int ) {
	quotient  = sum / num;
	remainder = sum % num;
	return
}
a, b := my_division( 38, 10 );
fmt.Println( "38 / 10 =  ", a, ".......", b ); // 38 / 10 =   3 ....... 8
```

## 匿名函数 闭包 lambda

函数也是值，也可以作为 参数 和 返回值。

```go
func compute(fn func(float64, float64) float64) float64 {
	return fn(3, 4)
}
func main() {
	hypot := func(x, y float64) float64 {
		return math.Sqrt(x*x + y*y)
	}
	fmt.Println(hypot(5, 12))
	fmt.Println(compute(hypot))
	fmt.Println(compute(math.Pow))
}
```

```go
type binaryOperation func(op1 int, op2 int) (result int, err error)

func operate(op1 int, op2 int, bop binaryOperation) (result int, err error){
    if bop == nil {
        err = errors.New("invalid binary operation function");
        return
    }
    return bop(op1, op2)
}
```

闭包是一个函数，它引用了其函数体之外的变量。该函数可以访问并赋予其引用的变量的值，换句话说，该函数被这些变量“绑定”在一起。

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

闭包实现 斐波纳契数列

```go
func fibonacci() func() int {
	n1, n2, cnt := 0, 1, 0
	return func() int {
		cnt ++;
		switch cnt {
			case 1:
				return n1
			case 2:
				return n2
			default:
				sum := n1 + n2
				n1, n2 = n2, sum
				return sum
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

## panic 和 recover 机制

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
