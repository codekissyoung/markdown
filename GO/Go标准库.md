# Go 标准库

记录了一些标准库函数的用法。

## 日志

`log`: 记录程序运行时产生的日志,我们将在后面的章节使用它。

## os

`os`提供给我们一个平台无关性的操作系统功能接口，采用类Unix设计，隐藏了不同操作系统间差异，让不同的文件系统和操作系统对象表现一致。  

`os/exec` 提供我们运行外部操作系统命令和程序的方式。 

`syscall` 底层的外部包，提供了操作系统底层调用的基本接口。



命令行参数都在`os.Args`里，它的类型是`[]string`，这是切片类型。

```go
for i := 0; i < len(os.Args); i++ {
    fmt.Println(os.Args[i])
}
for _, arg := range os.Args[1:] {
   fmt.Println(arg)
}
```

打开文件`os.Open()`、`os.Stderr`、`os.Close()`等函数

```go
counts := make(map[string]int)
files := os.Args[1:]
if 0 == len(files) {
    countLines(os.Stdin, counts)
} else {
    for _, arg := range files {
        f, err := os.Open(arg)
        if err != nil {
            fmt.Fprintf(os.Stderr, "%v", err)
        } else {
            countLines(f, counts)
            f.Close()
        }
    }
}
func countLines(f *os.File, m map[string]int) {
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		m[scanner.Text()]++
	}
}
```

#### 让Linux重启

```go
const LINUX_REBOOT_MAGIC1 uintptr = 0xfee1dead
const LINUX_REBOOT_MAGIC2 uintptr = 672274793
const LINUX_REBOOT_CMD_RESTART uintptr = 0x1234567
func main() {
	syscall.Syscall(syscall.SYS_REBOOT,
		LINUX_REBOOT_MAGIC1,
		LINUX_REBOOT_MAGIC2,
		LINUX_REBOOT_CMD_RESTART)
}
```





## io / ioutil

`io`提供了基本输入输出功能，大多数是围绕系统功能的封装。  

计算重复行，`ioutil.ReadFile()`读取整个文件的数据，`strings.Split()`将数据拆分成`[]String`。

```go
counts := make(map[string]int)
for _, filename := range os.Args[1:] {
    data, err := ioutil.ReadFile(filename)
    if err != nil {
        fmt.Fprintf(os.Stderr, "%v\n", err)
        continue
    }
    for _, line := range strings.Split(string(data), "\n") {
        counts[line]++
    }
}
for line, n := range counts {
    fmt.Printf("%s : %d \n", line, n)
}
```

## bufio

缓冲输入输出功能的封装。  

`bufio.Scanner`读取输入，按换行符(或自定义)断开，依次读取输入文本。

- 调用`Scan()`进行读取，成功返回`true`，没有更多内容返回`false`
- 调用`Text()`获取读取到的文本行(已经去除换行符)

```go
counts := make(map[string]int)
scanner := bufio.NewScanner(os.Stdin)
for scanner.Scan() {
    counts[scanner.Text()]++
}
for line, n := range counts {
    fmt.Printf("%d \t %s \n", n, line)
}
```



```go
data := []byte("Go 语言中文网")
rd := bytes.NewReader(data)

r := bufio.NewReader(rd) // 包装下，具有缓存功能

// 读取并返回一个字节
c, err := r.ReadByte()
fmt.Println(string(c), err) // G <nil>

var buf [128]byte
// 读取数据，并存放到字节切片 p 中
n, err := r.Read(buf[:])             // 当字节流结束时，n 为 0，err 为 io. EOF
fmt.Println(string(buf[:n]), n, err) // o 语言中文网 17 <nil>
```



```go
data := []byte("C语言中文网, Go语言入门教程")
rd := bytes.NewReader(data)
r := bufio.NewReader(rd)

// 读取数据直到遇到第一个分隔符
var delim byte = ','
line, err := r.ReadBytes(delim) // C语言中文网, <nil>
fmt.Println(string(line), err)
```



```go
// 读取一行数据
data := []byte("Golang is a beautiful language. \r\n I like it!")
rd := bytes.NewReader(data)
r := bufio.NewReader(rd)

line, prefix, err := r.ReadLine()
// Golang is a beautiful language.  false <nil>
fmt.Println(string(line), prefix, err)
```



```go
// 读取一个 UTF-8 编码的字符，并返回其 Unicode 编码和字节数
data := []byte("语言中文网")
rd := bytes.NewReader(data)
r := bufio.NewReader(rd)

ch, size, err := r.ReadRune()
fmt.Println(string(ch), size, err) // 语 3 <nil>
```



```go
// 读取数据直到分隔符“delim”处，并返回读取数据的字节切片
data := []byte("C语言中文网, Go语言入门教程")
rd := bytes.NewReader(data)
r := bufio.NewReader(rd)
var delim byte = ','

line, err := r.ReadSlice(delim)
fmt.Println(line, err)
line, err = r.ReadSlice(delim)
fmt.Println(line, err)
line, err = r.ReadSlice(delim)
fmt.Println(line, err)
```



```go
// 读取数据直到分隔符“delim”第一次出现，并返回一个包含“delim”的字符串
data := []byte("C语言中文网, Go语言入门教程")
rd := bytes.NewReader(data)
r := bufio.NewReader(rd)
var delim byte = ','

line, err := r.ReadString(delim)
fmt.Println(line, err) // C语言中文网, <nil>
```

#### 将读取到的字节放回去

```go
func (b *Reader) UnreadByte() error
func (b *Reader) UnreadRune() error
```

#### 还可以从缓冲区读出数据的字节数

```go
data := []byte("Go语言入门教程")
rd := bytes.NewReader(data)
r := bufio.NewReader(rd)

var buf [1]byte
n, err := r.Read(buf[:])
fmt.Println(string(buf[:n]), n, err) // G 1 <nil>

// 返回还可以从缓冲区读出数据的字节数
rn := r.Buffered()
fmt.Println(rn) // 19

n, err = r.Read(buf[:])
fmt.Println(string(buf[:n]), n, err) // o 1 <nil>

rn = r.Buffered()
fmt.Println(rn) // 18
```

#### 读取指定字节数的数据 不清理缓存

```go
data := []byte("Go语言入门教程")
rd := bytes.NewReader(data)
r := bufio.NewReader(rd)

bl, err := r.Peek(8)
fmt.Println(string(bl), err) // Go语言 <nil>

bl, err = r.Peek(14)
fmt.Println(string(bl), err) // Go语言入门 <nil>

bl, err = r.Peek(20)
fmt.Println(string(bl), err) // Go语言入门教程 <nil>
```

### 写入

```go
p := []byte("C语言中文网")
wr := bytes.NewBuffer(nil)
w := bufio.NewWriter(wr)

fmt.Println("写入前缓冲区为：", w.Available()) // 写入前缓冲区为： 4096

w.Write(p)
// 写入"C语言中文网"后，缓冲区为：4080
fmt.Printf("写入%q后，缓冲区为：%d\n", string(p), w.Available())

w.Flush()
// flush后，缓冲区为：4096
fmt.Printf("flush后，缓冲区为：%d\n", w.Available())
```

```go
wr := bytes.NewBuffer(nil)
w := bufio.NewWriter(wr)
s := "C语言中文网"
n, err := w.WriteString(s) // 写入一个字符串，并返回写入的字节数和错误信息
w.Flush()
fmt.Println(string(wr.Bytes()), n, err) // C语言中文网 16 <nil>
```



## net/http

```go
resp, _ := http.Get("http://www.ci.com")

fmt.Println(resp.Status)

b, _ := ioutil.ReadAll(resp.Body)
resp.Body.Close()

fmt.Printf("%s", b)
```

## flag

对命令行参数的操作，一个很有意思的处理参数的包。

```go
n := flag.Bool("n", false, "空行")
sep := flag.String("s", " ", "分割符")

flag.Parse()

fmt.Print(strings.Join(flag.Args(), *sep))

if !*n {
    fmt.Println()
}
```

```bash
$ main -s / ok err num
ok/err/num
```



## path/filepath

用来操作在当前系统中的目标文件名路径。  



## 字符串

- `strings`: 提供对字符串的操作。  
- `strconv`: 提供将字符串转换为基础类型的功能。
- `unicode`: 为 unicode 型的字符串提供特殊的功能。
- `regexp`: 正则表达式功能。  
- `bytes`: 提供对字符型分片的操作。  
- `index/suffixarray`: 子字符串快速查询。

#### 前缀和后缀

`HasPrefix` 判断字符串 `s` 是否以 `prefix` 开头：

```go
strings.HasPrefix(s, prefix string) bool
```

`HasSuffix` 判断字符串 `s` 是否以 `suffix` 结尾：

```go
strings.HasSuffix(s, suffix string) bool
```

#### 包含关系

`Contains` 判断字符串 `s` 是否包含 `substr`：

```go
strings.Contains(s, substr string) bool
```

#### 子字符串索引位置

`Index` 返回字符串 `str` 在字符串 `s` 中的索引（`str` 的第一个字符的索引），-1 表示字符串 `s` 不包含字符串 `str`：

```go
strings.Index(s, str string) int
```

`LastIndex` 返回字符串 `str` 在字符串 `s` 中最后出现位置的索引（`str` 的第一个字符的索引），-1 表示字符串 `s` 不包含字符串 `str`：

```go
strings.LastIndex(s, str string) int
```

如果需要查询非 ASCII 编码的字符在父字符串中的位置，建议使用以下函数来对字符进行定位：

```go
strings.IndexRune(s string, r rune) int
strings.IndexRune("chicken", rune('k'))
strings.IndexRune("chicken", 99)
```



#### 字符串替换



`Replace` 用于将字符串 `str` 中的前 `n` 个字符串 `old` 替换为字符串 `new`，并返回一个新的字符串，如果 `n = -1` 则替换所有字符串 `old` 为字符串 `new`：

```go
strings.Replace(str, old, new, n) string
```



#### 统计字符串出现次数

`Count` 用于计算字符串 `str` 在字符串 `s` 中出现的非重叠次数：

```go
strings.Count(s, str string) int
```



#### 重复字符串

`Repeat` 用于重复 `count` 次字符串 `s` 并返回一个新的字符串：

```go
strings.Repeat(s, count int) string
```



#### 修改字符串大小写

`ToLower` 将字符串中的 Unicode 字符全部转换为相应的小写字符：

```go
strings.ToLower(s) string
```

`ToUpper` 将字符串中的 Unicode 字符全部转换为相应的大写字符：

```go
strings.ToUpper(s) string
```



#### 修剪字符串

你可以使用 `strings.TrimSpace(s)` 来剔除字符串开头和结尾的空白符号；如果你想要剔除指定字符，则可以使用 `strings.Trim(s, "cut")` 来将开头和结尾的 `cut` 去除掉。该函数的第二个参数可以包含任何字符，如果你只想剔除开头或者结尾的字符串，则可以使用 `TrimLeft` 或者 `TrimRight` 来实现。



#### 分割字符串

`strings.Fields(s)` 将会利用 1 个或多个空白符号来作为动态长度的分隔符将字符串分割成若干小块，并返回一个 slice，如果字符串只包含空白符号，则返回一个长度为 0 的 slice。

`strings.Split(s, sep)` 用于自定义分割符号来对指定字符串进行分割，同样返回 slice。



#### 拼接 slice 到字符串

`Join` 用于将元素类型为 string 的 slice 使用分割符号来拼接组成一个字符串：

```go
strings.Join(sl []string, sep string) string
```



#### 从字符串中读取内容

函数 `strings.NewReader(str)` 用于生成一个 `Reader` 并读取字符串中的内容，然后返回指向该 `Reader` 的指针，从其它类型读取内容的函数还有：

- `Read()` 从 []byte 中读取内容。
- `ReadByte()` 和 `ReadRune()` 从字符串中读取下一个 byte 或者 rune。



```go
// int => string
str := strconv.Itoa(100)
fmt.Printf("type: %T value: %#v\n", str, str) // type: string value: "100"

// string => int
num1, err := strconv.Atoi("110")
if err != nil {
    fmt.Printf("%v 转换失败！", "110")
}
fmt.Printf("type:%T value:%#v\n", num1, num1) // type:int value:110

// string (1、0、t、f、T、F、true、false、True、False、TRUE、FALSE) => bool
str1 := "t"
boo1, err := strconv.ParseBool(str1)
if err != nil {
    fmt.Printf("str1: %v\n", err)
}
fmt.Println(boo1)  // true

// string => int64
str = "-11"
num, err := strconv.ParseInt(str, 10, 64) //　字符串、进制、溢出判断位数
if err != nil {
    fmt.Println(err)
}
fmt.Printf("type:%T value:%#v \n", num, num) // type:int64 value:-11

// string => uint
str = "11"
unum, err := strconv.ParseUint(str, 10, 0)
if err != nil {
    fmt.Println(err)
}
fmt.Printf("type:%T value:%d\n", unum, unum) // type:uint64 value:11

// string => float
fstr := "3.1415926"
f, err := strconv.ParseFloat(fstr, 64)
if err != nil {
    fmt.Println(err)
}
fmt.Printf("type:%T value:%f\n ", f, f) // type:float64 value:3.141593
```



```go
// bool => string
str := strconv.FormatBool(true)
fmt.Printf("type:%T, value: %v\n", str, str) // type:string, value: true

// int => string
str = strconv.FormatInt(100, 16)  // 十六进制
fmt.Printf("type:%T, value: %v\n", str, str) // type:string, value: 64

// uint => string
str = strconv.FormatUint(110, 16) // 十六进制
fmt.Printf("type:%T, value: %v\n", str, str) // type:string, value: 6e

// float => string
str = strconv.FormatFloat(3.1415926, 'f', -1, 64)
fmt.Printf("type:%T, value: %v\n ", str, str)

// 将指定类型转换为string，然后追加到 []byte 中
b10 := []byte("int (base 10):")
b10 = strconv.AppendInt(b10, -42, 10)
fmt.Println(string(b10))

b16 := []byte("int (base 16):")
b16 = strconv.AppendInt(b16, -42, 16)
fmt.Println(string(b16))
```

## 时间和日期

```go
start := time.Now()
// 业务代码
end := time.Now()
delta := end.Sub(start)
fmt.Printf("执行时间: %s\n", delta)

fmt.Printf("%02d.%02d.%4d\n", t.Day(), t.Month(), t.Year())　// 21.07.2020

// 根据一个格式化字符串来将一个时间 t 转换为相应格式的字符串
fmt.Println(t.Format("02 Jan 2006 15:04")) // 21 Jul 2011 10:31

// 暂停
time.Sleep(d Duration)
```



## md5 / sha1

```go
TestString := "http://blog.codekissyoung.com"

Md5Inst := md5.New()
Md5Inst.Write([]byte(TestString))
Result := Md5Inst.Sum([]byte(""))
fmt.Printf("%x\n\n", Result) // c9d937a5e1d082db8a26df824b97d274

Sha1Inst := sha1.New()
Sha1Inst.Write([]byte(TestString))
Result = Sha1Inst.Sum([]byte(""))
fmt.Printf("%x\n\n", Result) // a43a08350f00e4185f7fe59ee8bd284e94c13320

// 对文件计算
TestFile := "123.txt"
infile, _ := os.Open(TestFile)
md5h := md5.New()
io.Copy(md5h, infile)
fmt.Printf("%x %s\n", md5h.Sum([]byte("")), TestFile)

sha1h := sha1.New()
io.Copy(sha1h, infile)
fmt.Printf("%x %s\n", sha1h.Sum([]byte("")), TestFile)
```

## unsafe

## 数学

- `math`: 基本的数学函数。  
- `math/cmath`: 对复数的操作。  
- `math/rand`: 伪随机数生成。  
- `sort`: 为数组排序和自定义集合。  



### math/big

大数的实现和计算。  

有用来表示大整数的 `big.Int` 和表示大有理数的 `big.Rat` 类型（可以表示为 2/5 或 3.1416 这样的分数，而不是无理数或 π）。这些类型可以实现任意位类型的数字，只要内存足够大。缺点是更大的内存和处理开销使它们使用起来要比内置的数字类型慢很多。

大的整型数字是通过 `big.NewInt(n)` 来构造的，其中 n 为 int64 类型整数。而大有理数是通过 `big.NewRat(n, d)` 方法构造。n（分子）和 d（分母）都是 int64 型整数。因为 Go 语言不支持运算符重载，所以所有大数字类型都有像是 `Add()` 和 `Mul()` 这样的方法。它们作用于作为 receiver 的整数和有理数，大多数情况下它们修改 receiver 并以 receiver 作为返回结果。因为没有必要创建 `big.Int` 类型的临时变量来存放中间结果，所以运算可以被链式地调用，并节省内存。





## 数据 Encoding

- `encoding/json`: 读取并解码和写入并编码 JSON 数据。
- `encoding/xml`:简单的 XML1.0 解析器,有关 JSON 和 XML 的实例请查阅第。  
- `text/template`:生成像 HTML 一样的数据与文本混合的数据驱动模板。  

## 网络

- `net`: 网络数据的基本操作。  
- `http`: 提供了一个可扩展的 HTTP 服务器和基础客户端，解析 HTTP 请求和回复。  
- `html`: HTML5 解析器。  

## 运行时

`runtime`: Go 程序运行时的交互操作，例如垃圾回收和协程创建。  

`reflect`: 实现通过程序运行时反射，让程序操作任意类型的变量。

## 数据结构

- `list`: 双链表。
- `ring`: 环形链表。

## 并发锁

```go
type Info struct {
	mu sync.Mutex
	// ... other fields, e.g.: Str string
}

func Update(info *Info) {
	info.mu.Lock()
    // critical section:
    info.Str = // new value
    // end critical section
    info.mu.Unlock()
}

```

在 sync 包中还有一个 `RWMutex` 锁：他能通过 `RLock()` 来允许同一时间多个线程对变量进行读操作，但是只能一个线程进行写操作。如果使用 `Lock()` 将和普通的 `Mutex` 作用相同。包中还有一个方便的 `Once` 类型变量的方法 `once.Do(call)`，这个方法确保被调用函数只能被调用一次。