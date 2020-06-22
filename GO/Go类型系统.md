# Go 类型系统

### 字符串

```go
s := "Hello, 世界"
fmt.Println(len(s))                    // 13
fmt.Println(utf8.RuneCountInString(s)) // 9

for i := 0; i < len(s); {
    oneChar, size := utf8.DecodeRuneInString(s[i:])
    fmt.Printf("%d\t%c\n", i, oneChar) // 挨个打印字符
    i += size
}

// 对于 utf8 字符串， range 操作是会特殊处理的，每次都会返回单个正确的 utf8 字符
// i 是具体的偏移字节数
for i, oneChar := range s {
    fmt.Printf("%d\t%c\t%d\n", i, oneChar, oneChar)
}

r := []rune(s)
fmt.Println(len(r))          // 9
fmt.Println(r)               // [72 101 108 108 111 44 32 19990 30028]
fmt.Println(string(30028))   // 界
fmt.Println(string(1234566)) // � 不符合utf8规范的值，默认会转化成 \uFFFD 即 �
```
