# Go 类型系统

特点：不同类型不允许`=`操作，只有强制类型转换

类型分为：

- 基本类型：`number` `string` `boolean`
- 聚合类型：`array` `struct`
- 引用类型：`pointer` `slice` `map` `function` `channel` 共同点是全部间接指向程序变量或者状态
- 接口类型：

## 概述

#### 基本类型

```go
bool   // 零值 false
string // 零值 ""
int  int8  int16  int32(rune)  int64 uint uint8(byte) uint16 uint32 uint64 uintptr // 零值 0
rune                        // 表示一个 Unicode 码点
float32 float64             // 浮点数
complex64 complex128        // 复数
array struct string         // 其他值类型
slice map chan              // 应用类型
interface                   // 接口类型
func()                      // 函数类型
```

```go
var is_ok bool
var name string
var age uint8
var weight float32
var score []float64
var pAge *int64
var test_score func() bool
var student struct {
    name string
    age uint8
    sex int8
}
fmt.Printf("type: %T\n", name) // 查看变量的类型
fmt.Println(name)              // 查看变量的值
```

### float 的坑

```go
var f float32 = 167777216
fmt.Println(f == f+1)           // true !!!!!
```

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

#### 结构体

```go
type Vertex struct { // 定义
    X int
    Y int
}

v2 := Vertex {X: 1}             // Y 成员为 零值
v3 := Vertex {}                 // X 与 Y 都是 零值

v.Y = 100                       // 访问 成员

p := &v                         // 指向结构体 指针
p.X = 23                        // 指针 访问 成员

p := &Vertex {1, 2}            // 指针 直接指向 字面量
```

PS: 变量 与 指针 都是通过 `.` 访问结构体成员，这样设计是 好？还是不好？

#### Map

#### 类型断言

```go
var i1 I1
var ok bool
i1, ok = interface{}(v1).(I1)   // 平行赋值

// 技巧1: 如果在声明变量的同时进行赋值，那么等号左边类型可以省略
var i1, ok = interface{}(v1).(I1)

// 技巧2: 短变量声明
i1, ok := interface{}(v1).(I1)
```
