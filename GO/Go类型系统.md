# Go类型系统

特点：不同类型不允许`=`操作，只有强制类型转换

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

这些类型定义时的写法：

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

#### 结构体

```go
type Vertex struct { // 定义
    X int
    Y int
}

v  := Vertex { 4, 5 }           // 结构体 变量
v2 := Vertex {X: 1}             // Y 成员为 零值
v3 := Vertex {}                 // X 与 Y 都是 零值  
fmt.Println( Vertex { 1, 2 } )  // 字面量
v.Y = 100                       // 访问 成员

p := &v                         // 指向结构体 指针     
p.X = 23                        // 指针 访问 成员

p := &Vertex {1, 2}            // 指针 直接指向 字面量
```

PS: 变量 与 指针 都是通过 `.` 访问结构体成员，这样设计是 好？还是不好？


#### 数组

```go
var a [10]int
var b [2]string
b[0] = "Hello"
b[1] = "World"
primes := [6]int { 2, 3, 5, 7, 11, 13 }

var ipv4 [4]uint8 = [4]uint8{192, 168, 0, 1}

// 技巧1: 省略变量名后面的类型
var ipv4 = [4]uint8{192, 168, 0, 1}

// 技巧2: 由编译器自己计算长度
var ipv4 = [...]uint8{192, 168, 0, 1}
```

#### 切片 Slice

切片是从数组中划定的 `a[low:high]` 左开右闭区间，本身不存储任何数据。修改切片中的元素，等价于修改底层数组中对应的元素。

如果不写`low`或者`high`，则会自动取值 `0` 和 数组长度。比如 `a[:8]` 等价于 `a[0:8]`。

- 切片零值： `nil`
- 切片长度：包含的元素个数，`len(s)` 获得 
- 切片容量：从第一个元素开始数，到其底层数组元素末尾的个数，`cap(s)` 获得
- `make(切片类型， 长度[， 容量])` 创建切片
- `append(s, 元素 ... )` 往切片追加值 

```go
abc := []int{2, 3, 5, 7, 11, 13}            // 直接定义，底层实际构建了一个数组

edf := make([]int, 5)                       // [0, 0, 0, 0, 0]

primes := [6]int{2, 3, 5, 7, 11, 13}        // 数组

s := primes[1:4]                            // s len=3 cap=5 [3 5 7] 从数组中划定 切片

s = s[2:5]                                  // s len=3 cap=3 [7 11 13] 基于s, 重新划定范围

s = append( s, 7, 8, 9, 10, 11 )            // s len=8 cap=8 [7 11 13 7 8 9 10 11]

fmt.Println( primes )                       // [2 3 5 7 11 13] 原数组并没有改变

func printSlice( s string, x []int ) {
	fmt.Printf("%s len=%d cap=%d %v\n", s, len(x), cap(x), x)
}
```

PS：当切片的底层数组大小不足，容不下追加的值时，`Go`底层会分配一个更大的数组，然后将数据复制一份到新数组上。最后，返回的是新数组上的切片 ^_^

```go
var ips = []string{ "192.168.0.1", "192.168.0.2", "192.168.0.3" }

ips = append(ips, "192.168.0.4");

ips = make([]string, 100);
```


#### Map

- 零值为 `nil`
- `make(类型)` 返回给定类型的映射，并初始化。

```go
type Vertex struct {
	Lat, Long float64
}

m := map [string] Vertex{                           // from stack
    "Bell Labs": { 40.68433, -74.39967 },
    "Google": { 37.42202, -122.08408 },
}

m := make( map[string]Vertex )                      // from heap
m["Bell Labs"] = Vertex{ 40.68433, -74.39967 }

m[key] = elem           // 修改
a = m[key]              // 获取
b, ok = m[key]          // 如果 key 在 m 中，则 ok 为 true；否则 ok 为 false, b 为零值
delete( m, key )        // 删除元素
```

```go
var ipSwitches = map[string]bool {}

ipSwitchs["192.168.0.1"] = true

delete(ipSwitchs, "192.168.0.1")
```

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