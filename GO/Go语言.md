# Go 语言

### 变量的作用域

变量的生存周期：

- 包一级声明的变量，生存期和整个程序运行周期一致
- 局部变量，从该变量声明开始，到该变量不再被引用，被自动回收后结束
- 函数是可以返回局部变量的，因为 `Go` 编译器会将返回到函数外的局部变量存储在 `heap` 上。实际上所有变量都是由 `Go` 编译器决定存储在 `heap` 或是 `stack`，这个称为**变量逃逸分析**。

```go
var cwd string
func init() {
	// 写法1
	cwd, err := os.Getwd() // 这里的 cwd 是新建的，就不是全局变量
	// 写法2
	var err error
	cwd, err = os.Getwd() // 这里的 cwd 就是全局变量
	if err != nil {
		log.Fatalf("os.Getwd faild: %v", err)
	}
	log.Printf("Working directory = %s", cwd)
}
func main() {
	fmt.Printf("cwd : %s", cwd)
}
```

```bash
# 变量逃逸分析
# -m 表示进行内存分配分析
# -l 表示避免程序内联，也就是避免进行程序优化  
$ go run -gcflags "-m -l" cky.go
```

```go
var a string  // 全局变量
func main() {
	a = "G"
	print(a) // G
	f1()
}
func f1() {
	a := "O"
	print(a) // O
	f2()
}
func f2() {
	print(a) // G 思考下，f2 在 f1 里调用，为啥 a 不是 0 呢 ？
}
```

### 指针

`Go` 指针 最大的特点就是取消了 指针运算，其他方面和 `C` 差不多。

```go
i := 42             // 普通变量
var p *int;         // 声明 int 指针
p = &i              // p 指向 i
*p = 21             // 通过 p 改变 i
fmt.Println( *p );  // 通过 p 访问 i
```

#### `Defer` 对命名的函数返回值的影响：

```go
// f1() = 1
func f1() (r int) {
	defer func() {
		r++
	}()
	return 0
}

// f2() = 5
func f2() (r int) {
	t := 5
	defer func() {
		t += 5
	}()
	return t
}

// f3() = 1
func f3() (r int) {
	defer func(r int) {
		r = r + 5
	}(r)
	return 1
}

// f4() = 0
func f4() int {
	r := 0
	defer func() {
		r++
	}()
	return r
}

// f5() = 0
func f5() int {
	r := 0
	defer func(i int) {
		i++
	}(r)
	return 0
}
```

总结下：

- 闭包内部直接对闭包外部的数据是引用，如果想要拿副本，还需要通过入参的方式，拷贝进入里面，参考`f3()`
- `defer`执行时机：`return`之后 -> `defer` -> 调用处拿到返回值。所以采用`f1() f2() f3()`等命名返回值写法，如果有 `defer`闭包，则有闭包里面修改到返回值的风险,参考`f1()`。当然这种风险可以避免，参考`f2()` `f3()`。