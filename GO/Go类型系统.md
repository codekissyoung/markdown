# Go 类型系统



Go中，类的继承树并无意义，你只需要知道这个类实现了哪些方法，每个方法是啥含义就足够了。

- 实现类的时候，只需要关心自己应该提供哪些方法，不用纠结接口要拆分地多细才合理。接口由使用方法，按需定义，而不用事前规划。
- 接口由使用方按自身需求来定义，使用方无需关心是否有其他模块定义过类似的接口。



## 类型一致问题

https://juejin.im/post/5d5ff27d518825637965f3f3

#### 怎样才算同一类型？

- 基本类型：就是基本类型相同，比如`int8` `string` `complex128`
- `Point`:基本类型相同的指针是同一类型
- `array`:长度相同 + 基本类型相同
- `slice`:基本类型相同
- `map`:键和值类型相同
- `struct`:相同字段、类型、`tag` + 相同顺序 
- `func`:相同签名(参数列表、返回值列表)
- `interface`:相同方法集
- `channel`：基本类型相同 + 方向

#### Type自定义类型后是否和原来类型是同一类型

#### 操作数`a`与`b`同一类型意味着什么?

- 可以进行`=`赋值运算
- 是`==`比较操作的前提条件

#### Slice类型的比较

禁止比较，原因有：

```go
a := []interface{}{ 1, 2.0 }
a[1] = a // 会导致递归调用
fmt.Println(a)
// !!!
// runtime: goroutine stack exceeds 1000000000-byte limit
// fatal error: stack overflow
```

- 切片如果直接比较引用地址，是不合适的。首先，切片与数组是比较相近的类型，比较方式的差异会造成使用者的混淆。另外，长度和容量是切片类型的一部分，不同长度和容量的切片如何比较？

- 切片如果像数组那样比较里面的元素，又会出现上来提到的循环引用的问题。虽然可以在语言层面解决这个问题，但是 `golang` 团队认为不值得为此耗费精力。

#### Map类型的比较

因为`Map`的值可能是`Slice`，所以干脆将`Map`类型做成不可比较类型。

#### 引用类型的比较

引用类型的比较实际判断的是两个变量是不是指向同一份数据，它不会去比较实际指向的数据。

```go
type A struct {
    a int
    b string
}

aa := &A { a : 1, b : "test1" }
bb := &A { a : 1, b : "test1" }
cc := aa
fmt.Println(aa == bb) // false
fmt.Println(aa == cc) // true
```

### Channel的比较

看是否是同一个`Channel`

```go
ch1 := make(chan int, 1)
ch2 := make(chan int, 1)
ch3 := ch1

fmt.Println(ch1 == ch2)  // false
fmt.Println(ch1 == ch3)  // true
```

### 字符串

```go
type stringStruct struct{
    str unsafe.Pointer // 存储空间的起始地址
    len int            // 字节数
} // 字符串的实现结构
```

字符串存储以`utf8`编码，存储的是`unicode`字符串，零值为`""`

支持`!=` `==` `>` `<` `+` `+=` 操作符号，支持这样`s[3]`读取单个字节，支持切片语法`s1 = s[1:4]` `s1`切片底层引用的是`s`数组

`range`操作对字符串做了优化，默认是按字符取值，而不是按字节

要修改字符串内容，必须转成`[]rune`或`[]byte`类型，完成后再转换回来。这种转换要重新分配内存，复制数据。

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



## 命名类型 与 未命名类型

具有同样结构的`命名类型`与`未命名类型`的赋值：

```go
type Person struct {
	name string
	age  int
}

type PersonCopy struct {
	name string
	age  int
}

func main() {
	link := struct {
		name string
		age  int
	}{
		"link",
		18,
	}

	var linkCopy Person
	var linkCopyCopy PersonCopy

	// 1. 命名类型 = 未命名类型 ok
	linkCopy = link

	// 2. 命名类型 = 命名类型
	//  cannot use linkCopy (type Person) as type PersonCopy in assignment
	linkCopyCopy = linkCopy

	// 3. 未命名类型 = 命名类型 ok
	linkCopyCopy.name = "linkCopyCopy"
	link = linkCopyCopy

	fmt.Println("link:", link, "\nlinkCopy:", linkCopy, "\nlinkCopyCopy:", linkCopyCopy)
}
```

`通道`的赋值：

```go
a := make(chan int, 2) // 双向通道 转 单向通道, b 为未命名类型
fmt.Printf("%#v\n", a) // (chan int)(0xc0000c2000)

var b chan<- int = a
fmt.Printf("%#v\n", b) // (chan<- int)(0xc0000c2000)

b <- 2
```

## 常数Const是没有类型的

```go
const (
        MaxInt64 = int(^uint64(0) >> 1)
        MinInt64 = -MaxInt64 - 1
        Big      = 1 << 100
        Small    = Big >> 99
)
func needInt(x int) int { return x*10 + 1 }
func needFloat(x float64) float64 {
	return x * 0.1
}
func main() {
    fmt.Println(needInt(Small))
    fmt.Println(needFloat(Small))
    fmt.Println(needFloat(Big))
    fmt.Printf("Max int64 : %v\n ", MaxInt64)
    fmt.Printf("Min int64 : %v\n ", MinInt64)
}
```

