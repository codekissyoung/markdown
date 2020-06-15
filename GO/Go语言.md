# Go 语言

`CSP`（`communicating sequential processes` 顺序通信进程）：进程是一组中间没有共享状态的平行运行的处理过程，进程间使用 `Pipe` 进行通信和控制同步．

拥有：类型系统 自动垃圾回收 `Package`系统 函数 词法作用域 系统调用接口 只读`utf-8`字符串

放弃：隐式数据转换，类系统，运算符重载，默认参数，继承，泛函数，异常，宏，函数修饰，线程局部存储．

## 参考资料


```bash
$ go get github.com/adonovan/gopl.io            # 获取 Go 语言圣经里的代码
$ go get golang.org/x/tools/cmd/goimports       # 获取 goimports 工具
$ go get -u golang.org/x/lint/golint			# 代码静态检查工具
```

`echo`程序：

```go
package main
import (
	"fmt"
	"os"
)
func main() {
	var s, sep string
	for i := 1; i < len(os.Args); i++ {
		s += sep + os.Args[i]
		sep = " "
	}
	fmt.Println(s)
}
```

`echo`程序切片改良版本：

```go
package main
import (
	"fmt"
	"os"
)
func main() {
	var s, sep string
	//fmt.Println(os.Args[:])
	for _, arg := range os.Args[1:] {
		s += sep + arg
		sep = " "
	}
	fmt.Println(s)
}
```

`echo`带自定义参数版本，利用`flag`包实现：

```go
package main
import (
	"flag"
	"fmt"
	"strings"
)
var n = flag.Bool("n", true, "不换行")        // 默认换行
var sep = flag.String("s", " ", "指定分割府") // 默认分割符：空格
func main() {
	flag.Parse()
	fmt.Print(strings.Join(flag.Args(), *sep))
	if *n {
		fmt.Println()
	}
}
```

打印重复行的 `dup` 程序：

```go
package main
import (
	"bufio"
	"fmt"
	"io"
	"os"
)
func main() {
	counts := make(map[string]int)
	files := os.Args[1:]
	if len(files) > 0 {
		for _, fileName := range files {
			file, err := os.Open(fileName)
			if err != nil {
				fmt.Fprintf(os.Stderr, "dup: %v\n", err)
				continue
			}
			countLines(file, counts)
			file.Close()
		}
	} else {
		countLines(os.Stdin, counts)
	}
	for line, n := range counts {
		if n > 1 {
			fmt.Printf("%d\t%s\t\n", n, line)
		}
	}
}
func countLines(reader io.Reader, counts map[string]int) {
	input := bufio.NewScanner(reader)
	for input.Scan() {
		counts[input.Text()]++
	}
}
```

### 变量的作用域

声明一个新变量 or 引用全局变量? 对比下面两段代码：

```go
var cwd string
func init() {
	cwd, err := os.Getwd()
    if err != nil {
		log.Fatalf("os.Getwd faild: %v", err)
	}
	log.Printf("Working directory = %s", cwd)
}
func main() {
	fmt.Printf("cwd : %s", cwd)
}
```

```go
var cwd string
func init() {

	var err error
	cwd, err = os.Getwd()

    if err != nil {
		log.Fatalf("os.Getwd faild: %v", err)
	}
	log.Printf("Working directory = %s", cwd)
}
func main() {
	fmt.Printf("cwd : %s", cwd)
}
```

变量的生存周期：

- 包一级声明的变量，生存期和整个程序运行周期一致
- 局部变量，从该变量声明开始，到该变量不再被引用，被自动回收后结束

所有变量都是由 `Go` 编译器决定存储在 `heap` 或是 `stack`，这个称为“变量逃逸分析” 。所以 `Go` 函数是可以返回局部变量的，因为 `Go` 编译器会将它存储在 `heap` 上，这点和 `C` 语言有很大的区别。

```bash
$ go run -gcflags "-m -l" cky.go        # 变量逃逸分析
```

- `-m` 表示进行内存分配分析

- `-l` 表示避免程序内联，也就是避免进行程序优化  
```go
package main
var a string
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
   print(a) // ?!!! 这里是多少？
}
```

#### 多分支 switch

```go
switch today := time.Now().Weekday(); time.Saturday {
    case today + 0:             // 只要求为可求值的表达式、函数、基本类型
        fmt.Println("Today.")   // 自动 break
    case today + 1:
        fmt.Println("Tomorrow.")
    default:
        fmt.Println("Too far away.")
}

switch people {
    case "mum", "daddy":
        fmt.Println("family")
}

switch t := time.Now(); {
    case t.Hour() < 12:
        fmt.Println("Good morning!")
    case t.Hour() < 17:
        fmt.Println("Good afternoon.")
    default:
        fmt.Println("Good evening.")
}
```

#### goto 语句

```go
for x := 0; x < 10; x++ {
    for y := 0; y < 10; y++ {
        if y == 2 {
            goto breakHere // 跳转到标签
        }
    }
}
return // 手动返回, 避免执行进入标签

breakHere:
    fmt.Println("done")
```

#### defer 延迟执行

```go
func main() {
		defer fmt.Printf("nice to meet you \n")     // 函数退出前 执行
		defer fmt.Printf("world ")                  // 函数退出前 执行
		fmt.Printf("hello ")
}
// hello world nice to meet you
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

示例：`Defer` 对命名的函数返回值的影响：

```go
func f1() (r int) {
	defer func() {
		r++             // 闭包，引用到了返回值列表里的 r
	}()
	return 0
}
func f2() (r int) {
	t := 5
	defer func() {
		t = t + 5       // 引用到的是局部变量 t，先 return，再执行 defer
	}()
	return t
}
func f3() (r int) {
	defer func(r int) {
		r = r + 5
	}(r)                // 这里的 r 传值 copy
	return 1
}
func f4() int {
	r := 0
	defer func() {
		r++
	}()
	return r
}
func f5() int {
	r := 0
	defer func(i int) {
		i++
	}(r)
	return 0
}
func main() {
	println(f1(), f2(), f3(), f4(), f5()) // 1 5 1 0 0
}
```
