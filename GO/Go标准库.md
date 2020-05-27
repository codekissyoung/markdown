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

## io/ioutil

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

## time

```go
start := time.Now()
// 业务代码
end := time.Now()
delta := end.Sub(start)
fmt.Printf("执行时间: %s\n", delta)
```

