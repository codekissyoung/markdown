# Interface

### reflect.TypeOf(a).Kind()

```go
type Kind uint
const (
    Invalid Kind = iota  // 非法类型
    Bool                 // 布尔型
    Int                  // 有符号整型
    Int8                 // 有符号8位整型
    Int16                // 有符号16位整型
    Int32                // 有符号32位整型
    Int64                // 有符号64位整型
    Uint                 // 无符号整型
    Uint8                // 无符号8位整型
    Uint16               // 无符号16位整型
    Uint32               // 无符号32位整型
    Uint64               // 无符号64位整型
    Uintptr              // 指针
    Float32              // 单精度浮点数
    Float64              // 双精度浮点数
    Complex64            // 64位复数类型
    Complex128           // 128位复数类型
    Array                // 数组
    Chan                 // 通道
    Func                 // 函数
    Interface            // 接口
    Map                  // 映射
    Ptr                  // 指针
    Slice                // 切片
    String               // 字符串
    Struct               // 结构体
    UnsafePointer        // 底层指针
)
```



## 接口主要用法

#### 从类型赋值到接口

- 当我们使用结构体实现接口时，指针类型和结构体类型都会实现该接口
- 当我们使用指针实现接口时，只有指针类型的变量才会实现该接口！！！也就是说，接口变量只能接受指针类型的变量。

```go
type Echoer interface {
	Echo()
}

type User struct {
	Age  int
	Name string
}

func (u *User) Echo() {
	fmt.Println("My Name is ", u.Name)
}

func main() {
    // cannot use User literal (type User) as type Echoer in assignment:
    // User does not implement Echoer (Echo method has pointer receiver)
    var v Echoer = User{19, "link"} 
    v.Echo()
}
```



```go
type User struct {
	Age  int
	Name string
}

func NilOrNot(v interface{}) bool {
	return v == nil
}

func main() {

	var u *User
	fmt.Println(u == nil) // true
	// 类型会转换成 interface{} 类型
	// 转换后的变量不仅包含转换前的变量，还包含变量的类型信息 User
	// 所以转换后的变量与 nil 不相等
	fmt.Println(NilOrNot(u)) // false

}
```





#### 接口之间相互赋值

#### 接口查询



Go 语言只会在传递参数、返回参数以及变量赋值时才会对某个类型是否实现接口进行检查，Go 语言会编译期间对代码进行类型检查。从类型检查的过程来看，编译器仅在需要时才对类型进行检查，类型实现接口时只需要实现接口中的全部方法。

```go
func main() {
    var rpcErr error = NewRPCError(400, "unknown err") // typecheck1: RPCError 类型 赋值给 error 接口类型
    err := AsErr(rpcErr) // typecheck2: error 接口类型 赋值给 error 接口类型
    println(err) 
}

func NewRPCError(code int64, msg string) error {
    return &RPCError{ // typecheck3:  RPCError 结构体类型 赋值给 error 接口类型
        Code:    code,
        Message: msg,
    }
}

func AsErr(err error) error {
    return err
}
```



## 两种接口类型

两种接口虽然都使用 `interface` 声明，但`interface{}`在实现时使用了特殊的类型。

### iface

带一组方法的接口。

```go
type iface struct { // 16 bytes
    tab  *itab          // 表示接口和结构体关系的字段
    data unsafe.Pointer // 指向底层数据
}

type itab struct { // 32 bytes
    inter *interfacetype
    _type *_type // 类型结构体指针
    hash  uint32 // _type.hash 的拷贝, 将 接口变量 转换成具体类型时，该字段快速判断目标类型和具体类型 _type 是否一致
    _     [4]byte
    fun   [1]uintptr  // 是一个动态大小的数组，它是一个用于动态派发的虚函数表，存储了一组函数指针，虽然该变量被声明成大小固定的数组，但是在使用时会通过原始指针获取其中的数据，所以 fun 数组中保存的元素数量是不确定的
}

type _type struct {
    size       uintptr		// 类型占用的内存空间
    ptrdata    uintptr		// size of memory prefix holding all pointers 		
    hash       uint32 		// 帮助我们快速确定类型是否相等
    tflag      tflag　　 // extra type information flags
    align      uint8　　	// alignment of variable with this type
    fieldAlign uint8		　// alignment of struct field with this type
    kind       uint8　　　// enumeration for C
    equal      func(unsafe.Pointer, unsafe.Pointer) bool // 用于判断当前类型的多个对象是否相等
    gcdata     *byte　　　// garbage collection data
    str        nameOff　　// string form
    ptrToThis  typeOff　　// type for pointer to this type, may be zero
}
```

### eface

不带任何方法的`interface{}`

```go
type eface struct { // 16 bytes
    _type *_type         // 类型结构体指针 见 iface
    data  unsafe.Pointer // 指向底层数据
}
```



```go
func main() {
    type User struct {
        Age  int
        Name string
    }
    v := User{19, "link"}
    println(v) // ./main.go:59:9: illegal types for operand: print User
     Print(v) // (0x495f00,0xc00006ef60)
}
// 在接收值时，变量在运行期间的类型也发生了变化，获取变量类型时就会得到 interface{}
func Print(v interface{}) {
	println(v)
}
```



## 接口变量特性

- 没有字段
- 只能声明方法，没有实现
- 可以嵌入其他接口

接口赋值并不要求两个接口必须等价(方法列表相等)。如果接口 `A`的方法列表是接口`B`的子集，那么`A = B`就是有效的。

## 怎么才算实现接口？

```go
type tester interface {
	test()
	string() string
}
type data struct {
	name string
}
func (d *data) test() {
	fmt.Println("test " + d.name)
}
func (d data) string() string {
	return d.name
}
func main() {
	d := data{"link"}
	// cannot use d (type data) as type tester in assignment:
	// data does not implement tester (test method has pointer receiver)
	// var t tester = d
	var t tester = &d
	t.test()
	fmt.Println(t.string())
}
```

- `T`和`*T`是两种类型
- `T`类型只包含`Recevier`为`T`的实现方法
- 而`*T`类型同时包含`Recevier`为`T` `*T`的实现方法

## 接口嵌套

```go
type T struct {
	String()
}
type S struct {
	T
	Name()
}
```

- 实现了`T`接口的`类型变量`，可以赋值给`接口变量`，编译器内部做了转换操作
- `S`接口变量可以赋值给`T`接口变量，反之则不行，即`超集`可以赋值给`子集`

## 实现机制

```go
type iface struct {
    tab *itab								// 类型信息
    data unsafe.Pointer  // 实际对象指针
}
type itab struct {
    inter *interfacetype // 接口类型
    _type *_type					 // 实际对象类型
    fun   [1]uintptr			// 实际对象方法地址 这是个不定长数组!!!
}
```

## 自定义函数类型实现接口

```go
type FuncString func() string
func (f FuncString) String() string {
	return f()
}
func main() {
	var t fmt.Stringer = FuncString(func() string {
		return "Hello World"
	}) // 相同签名函数，强转为 FunString 就实现了 Stringer 接口
	fmt.Println(t)
}
```

### 类型查询

```go
var v1 interface{} = ...
switch v := v1.(type) {
case int: // 现在 v 的类型是 int
case string: // 现在 v 的类型是 string
    ...
}
```

```go
type Stringer interface{
    String() string
}

func Println(args ...interface{}){
    for _, arg := range args {
        switch v := arg.(type){
        case int :
        case string:
        default:
            if v,ok := arg.(Stringer); ok {
                val := v.String()
                // ...
            }else{
                // ...
            }
        }
    }
}
```

### Any 类型 interface{}

```go
var v1 interface{} = 1 // 将 int 类型赋值给 Any 变量
var v2 interface{} = "abc" // 将 string 类型赋值给 Any 变量
var v3 interface{} = &v2 // 将 *interface{} 类型赋值给 Any 变量
var v4 interface{} = struct{ X int }{1}
var v5 interface{} = &struct{ X int }{1}
```



显式地将 nil 赋值给接口时，接口的 type 和 data 都将为 nil。此时，接口与 nil 值判断是相等的。

但如果将一个带有类型的 nil 赋值给接口时，只有 data 为 nil，而 type 为 nil，此时，接口与 nil 判断将不相等。

```go
type MyImplement struct {
}
func (m *MyImplement) String() string {
	return "hi"
}
func GetStringer() fmt.Stringer {
	var s *MyImplement = nil
	// 返回值为 nil 的变量，与直接返回 nil 是不同的
	if s == nil {
		return nil
	}
	return s
}

func main() {
	if GetStringer() == nil {
		fmt.Println("GetStringer() == nil")
	} else {
		fmt.Println("GetStringer() != nil")
	}
}
```



```go
func main() {
	getType(User{
		19,
		"link",
	})
	getType(1)
	getType(89.32)
	getType("string")
}

func getType(a interface{}) {
	switch a.(type) {
	case int:
		fmt.Println("the type of a is int")
	case string:
		fmt.Println("the type of a is string")
	case float64, float32:
		fmt.Println("the type of a is float")
	case User:
		fmt.Println("the type of a is User")
	default:
		fmt.Println("unknown type")
	}
}
```

