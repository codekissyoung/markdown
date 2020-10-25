# Go 标准库

记录了一些标准库函数的用法。

## os

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

## io

### ioutil

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

### bufio

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
n, err := w.WriteString(s)
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

一个很有意思的处理参数的包

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

## strconv、bytes、strings、unicode

```go
str         := strconv.Itoa( 100 )            // num to str
num, err    := strconv.Atoi("s200")           // str to num
is_ok, err  := strconv.ParseBool( 'FALSE' )   //  1、0、t、f、T、F、true、false、True、False、TRUE、FALSE
num, err    := strconv.ParseInt("-11", 10, 0) // equal to Atoi()
str         := strconv.FormatBool( false )    // boolen to string "false" or "true"
str         := strconv.FormatInt( 16, 16)     // conv to string in 16th
```



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



## time

```go
start := time.Now()
// 业务代码
end := time.Now()
delta := end.Sub(start)
fmt.Printf("执行时间: %s\n", delta)
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

