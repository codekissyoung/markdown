# 函数

`Go`语言有三种类型的函数：普通带名字的函数、匿名`lambda`函数、方法。

## 普通函数

```go
func 函数名(入参列表) (返回值列表) {
	// 函数体
}
```

```go
func add(x, y int) int {
	return x + y
}

func swap(x, y string) (string, string) {
	return y, x
}

a, b := swap("hello", "world") // a b 分别接收函数返回值

// 如果给返回值命名，则可以直接在函数内部赋值，作为返回．非常好用的设计 ^_^
func my_division(sum, num int) ( quotient int, remainder int ) {
	quotient  = sum / num;
	remainder = sum % num;
	return
}
a, b := my_division( 38, 10 );
fmt.Println( "38 / 10 =  ", a, ".......", b ); // 38 / 10 =   3 ....... 8

func divide(dividend int, divisor int) (result int, err error) {
    if divisor == 0 {
        err = errors.New("division by zero")
        return
    }
    result = dividend / divisor
    return
}
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

## 方法

与某个数据类型绑定在一起的函数

```go
type myInt int;

func (i myInt) add( another int ) myInt {
    i = i + myInt(another)
    return i
}

i1 := myInt(1)
i2 := i1.add(2)
fmt.Println(i1, i2) // 1 3

// 指针
func (i *myInt) add( another int ) myInt {
    *i = *i + myInt(another)
    return *i
}
i1 := myInt(1)
i2 := i1.add(2)
fmt.Println(i1, i2) // 3 3
```
