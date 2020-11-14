# 接口

接口提供了一种方式来 **说明** 对象的行为：如果谁能搞定这件事，它就可以用在这儿。接口定义了一组方法（方法集），但是这些方法不包含（实现）代码：它们没有被实现（它们是抽象的）。接口里也不能包含变量。

不像大多数面向对象编程语言，在 Go 语言中接口可以有值，一个接口类型的变量或一个 **接口值** ：`var ai Namer`，`ai` 是一个多字（multiword）数据结构，它的值是 `nil`。它本质上是一个指针，虽然不完全是一回事。指向接口值的指针是非法的，它们不仅一点用也没有，还会导致代码错误。

即使接口在类型之后才定义，二者处于不同的包中，被单独编译：只要类型实现了接口中的方法，它就实现了此接口。

多态是面向对象编程中一个广为人知的概念：根据当前的类型选择正确的方法，或者说：同一种类型在不同的实例上似乎表现出不同的行为。



## 类型断言

一个接口类型的变量 `varI` 中可以包含任何类型的值，必须有一种方式来检测它的 **动态** 类型，即运行时在变量中存储的值的实际类型。在执行过程中动态类型可能会有所不同，但是它总是可以分配给接口变量本身的类型。通常我们可以使用 **类型断言** 来测试在某个时刻 `varI` 是否包含类型 `T` 的值。

类型断言可能是无效的，虽然编译器会尽力检查转换是否有效，但是它不可能预见所有的可能性。如果转换在程序运行时失败会导致错误发生。更安全的方式是使用以下形式来进行类型断言：

```go
if v, ok := varI.(T); ok {  // checked type assertion
    Process(v)
    return
}
// varI is not of type T
```

**varI 必须是一个接口变量**，否则编译器会报错：`invalid type assertion: varI.(T) (non-interface type (type of varI) on left)` 。

### Type Switch

```go
switch t := areaIntf.(type) {
case *Square:
	fmt.Printf("Type Square %T with value %v\n", t, t)
case *Circle:
	fmt.Printf("Type Circle %T with value %v\n", t, t)
case nil:
	fmt.Printf("nil value: nothing to check?\n")
default:
	fmt.Printf("Unexpected type %T\n", t)
}
```

如果仅仅是测试变量的类型，不用它的值，那么就可以不需要赋值语句，比如：

```go
switch areaIntf.(type) {
case *Square:
	// TODO
case *Circle:
	// TODO
...
default:
	// TODO
}
```

## 测试一个值是否实现了某个接口

假定 `v` 是一个值，然后我们想测试它是否实现了 `Stringer` 接口，可以这样做：

```go
type Stringer interface {
    String() string
}

if sv, ok := v.(Stringer); ok {
    fmt.Printf("v implements String(): %s\n", sv.String()) // note: sv, not v
}
```

`Print` 函数就是如此检测类型是否可以打印自身的。

接口是一种契约，实现类型必须满足它，它描述了类型的行为，规定类型可以做什么。接口彻底将类型能做什么，以及如何做分离开来，使得相同接口的变量在不同的时刻表现出不同的行为，这就是多态的本质。

编写参数是接口变量的函数，这使得它们更具有一般性。

**使用接口使代码更具有普适性。**

标准库里到处都使用了这个原则，如果对接口概念没有良好的把握，是不可能理解它是如何构建的。



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
    String() string显式地将 nil 赋值给接口时，接口的 type 和 data 都将为 nil。此时，接口与 nil 值判断是相等的。


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

## 接口的继承

当一个类型包含（内嵌）另一个类型（实现了一个或多个接口）的指针时，这个类型就可以使用（另一个类型）所有的接口方法。

```go
type Task struct {
	Command string
	*log.Logger
}
```

这个类型的工厂方法像这样：

```go
func NewTask(command string, logger *log.Logger) *Task {
	return &Task{command, logger}
}
```

当 `log.Logger` 实现了 `Log()` 方法后，Task 的实例 task 就可以调用该方法：

```go
task.Log()
```

类型可以通过继承多个接口来提供像 `多重继承` 一样的特性：

```go
type ReaderWriter struct {
	*io.Reader
	*io.Writer
}
```

上面概述的原理被应用于整个 Go 包，多态用得越多，代码就相对越少。这被认为是 Go 编程中的重要的最佳实践。

有用的接口可以在开发的过程中被归纳出来。添加新接口非常容易，因为已有的类型不用变动（仅仅需要实现新接口的方法）。已有的函数可以扩展为使用接口类型的约束性参数：通常只有函数签名需要改变。对比基于类的 OO 类型的语言在这种情况下则需要适应整个类层次结构的变化。