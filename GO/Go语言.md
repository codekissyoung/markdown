# Go 语言

Go 语言提供的所有系统调用操作、IO同步操作，都会将CPU让给其他 Goroutine。



多个 Goroutine 执行流:

- 对于共享资源的访问：互斥 与 同步 问题。

- 通信 : 

  

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



### 模拟枚举

```go
type ChipType int // 声明芯片类型
const (
    None ChipType = iota
    CPU    // 中央处理器
    GPU    // 图形处理器
)
func (c ChipType) String() string {
    switch c {
    case None:
        return "None"
    case CPU:
        return "CPU"
    case GPU:
        return "GPU"
    }
    return "N/A"
}
func main() {
    fmt.Printf("%s %d", CPU, CPU) // 输出CPU的值并以整型格式显示
}
```

