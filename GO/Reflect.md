# 反射

## 1. 概念

编译型语言在编译时，变量的名称以及类型信息都会被抹去，只留下操作的内存地址，运行时变量是无法获取到自身信息的。但是通过`reflect`包，可以让编译器在编译期将变量的类型信息写入到可执行文件中，并且提供专门的接口函数，用于访问这些信息。

通过这些信息，程序可以在运行期间：

- 获取变量的类型信息

- 修改变量的值

- 调用变量（对象）的方法

- 直接调用变量（函数类型）

这个机制称为反射。

`reflect`中的所有方法基本都是围绕着 `reflect.Type` 和 `reflect.Value` 这两个类型设计的。

```go
var v = "link"

// 主要表达的是被反射的这个变量本身的类型信息
vType := reflect.TypeOf(v) // 获取 reflect.Type 对象

// 该变量实例本身的信息
vValue := reflect.ValueOf(v) // 获取　reflect.Value 对象
vType := vValue.Type() // 获取 reflect.Type 对象
```



### 反射存在的意义？

#### 编译期确定的 vs 运行期确定的

编译时只能确定代码是一个接口，只有运行时才能知道具体的类型。所以需要一种机制，使得程序在运行时，能够获取到对象的信息：名称、类型、字段、方法。

拿到了程序的当前运行时对象的信息，我们就可以根据这些类型：

- 执行不同的代码分支
- 修改当前对象
- 调用当前对象的方法

### 元编程的能力

元编程：生成可执行代码的能力。

实际编译时，只有 `接口.A方法()` 的二进制代码，但实际运行时，却可以根据对象当前上下文，同一段代码(编译前)会展开，能够准确的生成 `当前对象.A方法()` 这段代码，并执行。

所以，我们才可以写出非常简洁的代码。

![](https://img.codekissyoung.com/2020/11/05/84dbcf7ad1cf3a40a0ea6a48903a7571.png)

## 2. 类型信息

### 2.1 底层类型 Type.Kind() 与类型名 Type.Name()

```go
Invalid Kind = iota  // 非法类型
Bool                 // 布尔型
Int 、Int8、Int16、Int32、Int64 　　　// 有符号整型
Uint、Uint8、Uint16、Uint32、Uint64  // 无符号整型
Uintptr              // 指针
Float32、Float64     // 浮点数
Complex64、Complex128 // 复数类型
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
```

```go
type ErrCode int
const (
    unkownErr ErrCode = 0
    loginErr  ErrCode = 1
)

type Cat struct {
    Name string
    Age int
}

loginType := reflect.TypeOf(loginErr)
fmt.Println(loginType.Kind(), loginType.Name()) // int ErrCode

kiki := Cat{Name: "kiki"}
kikiType := reflect.TypeOf(kiki)
fmt.Println(kikiType.Kind(), kikiType.Name()) // struct Cat

if kikiType.Kind() == reflect.Struct {
    fmt.Println("struct Type")
}
```

## 3. 指针类型与修改变量的值

`v`是`x`的副本，所以无法调用 `Set` 系列方法:

```go
var x float64 = 3.4
v := reflect.ValueOf(x)
v.SetFloat(4.1) // panic: reflect: reflect.Value.SetFloat using unaddressable value
```

我们通过对指针进行反射，达到修改原始值的目的：

```go
var x float64 = 3.4
fmt.Println(&x) // 0xc00001e0d8

p := reflect.ValueOf(&x)               // 对指针进行反射
fmt.Println(p.Type().Kind(), p.Type()) // ptr *float64
fmt.Println(p.CanSet())                // false

p = p.Elem()                           // 获取了 x 本身
fmt.Println(p.Type().Kind(), p.Type()) // float64 float64
fmt.Println(p.CanSet())                // true

p.SetFloat(4.1)

fmt.Println(x) // 4.1
```

## 4. 结构体的反射

### 4.1 字段

```go
type User struct {
    Age  int
    Name string
}

user := User{203, "link"}

p := reflect.ValueOf(&user)
t := p.Elem().Type() // 返回 类型对象
v := p.Elem()        // 返回 值对象

fmt.Println(t) // main.User
fmt.Println(v) // {203 link}

fmt.Println(t.NumField()) // 2
fmt.Println(v.NumField()) // 2

fmt.Println(t.Field(0).Name, v.Field(0).Type(), v.Field(0).Interface()) // Age int 203
fmt.Println(t.Field(1).Name, v.Field(1).Type(), v.Field(1).Interface()) // Name string link

// 类似的获取字段的方法
Field(i int) StructField
FieldByName(name string) (StructField, bool)　// 根据给定字符串返回字符串对应的结构体字段的信息
FieldByIndex(index []int) StructField // 多层级索引
FieldByNameFunc(match func(string) bool) (StructField,bool) // 根据匹配函数匹配需要的字段

type StructField struct {
    Name string          // 字段名
    PkgPath string       // 字段路径
    Type      Type       // 字段反射类型对象
    Tag       StructTag  // 字段的结构体标签
    Offset    uintptr    // 字段在结构体中的相对偏移
    Index     []int      // Type.FieldByIndex中的返回的索引值
    Anonymous bool       // 是否为匿名字段
}
```


```go
// Type 类型
type Type interface {
    Align() int
    FieldAlign() int
    Method(int) Method
    MethodByName(string) (Method, bool)  // 获取当前类型对应方法的引用
    NumMethod() int
    Implements(u Type) bool // 判断当前类型是否实现了某个接口
}

// Value 类型
type Value struct {
}

func (v Value) Addr() Value
func (v Value) Bool() bool
func (v Value) Bytes() []byte
```

### 4.2 方法

```go
type Employee struct {
	EmployeeID string
	Name       string `format:"normal"`
	Age        int
}

func (e *Employee) UpdateAge(newVal int) {
	e.Age = newVal
}

func main() {

	e := &Employee{"1", "Link", 30}
	fmt.Println(reflect.ValueOf(*e).FieldByName("Name")) // link
	if nameField, ok := reflect.TypeOf(*e).FieldByName("Name"); !ok {
		fmt.Println("Failed to get 'Name' field")
	} else {
		fmt.Println(nameField.Tag.Get("format")) // normal
	}
	var age = 10
	reflect.ValueOf(e).MethodByName("UpdateAge").Call([]reflect.Value{reflect.ValueOf(age)})
	fmt.Println(e) // &{1 Link 10}
}
```

## 6. 判断是否实现了接口

```go
type CustomError struct{}
func (*CustomError) Error() string {
	return ""
}
func main() {
    // 拿到 CustomError 结构体类型的　reflect.Type 对象
    customErrorPtr := reflect.TypeOf(&CustomError{})
    customError := reflect.TypeOf(CustomError{})
    
    // 判断结构体是否继承接口
    typeOfError := reflect.TypeOf((*error)(nil)).Elem()
    fmt.Println(customErrorPtr.Implements(typeOfError)) // #=> true
    fmt.Println(customError.Implements(typeOfError))    // #=> false
}
```


## 7. 函数通过反射实现动态调用

```go
func Add(a, b int) int {
    return a + b
}

func main() {
	v := reflect.ValueOf(Add) // 1. 获取函数 Add 对应的反射对象
	if v.Kind() != reflect.Func {
        return
	}
	t := v.Type()

	// 2. 准备指定个数的函数入参
	argv := make([]reflect.Value, t.NumIn())
	for i := range argv {
		if t.In(i).Kind() != reflect.Int {
			return
		}
		argv[i] = reflect.ValueOf(i)
	}

	// 3. 使用 reflect.Value.Call 方法调用函数，参数为 argv
	result := v.Call(argv)
	if len(result) != 1 || result[0].Kind() != reflect.Int {
		return
	}

	// 4. 获取返回值数组、验证数组的长度以及类型并打印其中的数据
	fmt.Println(result[0].Int()) // #=> 1
}
```

## 10. 比较 map 与 slice

```go
a := map[int]string{1: "one", 2: "two", 3: "threee"}
b := map[int]string{1: "one", 2: "two", 4: "threee"}
fmt.Println(reflect.DeepEqual(a, b)) // false

s1 := []int{1, 2, 3}
s2 := []int{1, 2, 3}
s3 := []int{3, 2, 1}
fmt.Println(reflect.DeepEqual(s1, s2)) // true
fmt.Println(reflect.DeepEqual(s2, s3)) // false
```

## 11. 万能程序

```go
type Employee struct {
    EmployeeID string
    Name       string `format:"normal"`
    Age        int
}

type Customer struct {
	CookieID string
	Name     string
	Age      int
}

func fillBySettings(s interface{}, m map[string]interface{}) error {
	if reflect.TypeOf(s).Kind() != reflect.Ptr {
		if reflect.TypeOf(s).Elem().Kind() != reflect.Struct {
			return errors.New("第一个参数必须是结构体的指针")
		}
	}

	if m == nil {
		return errors.New("setting is nil")
	}

	var field reflect.StructField
	var ok bool
	for k, v := range m {
		if field, ok = reflect.ValueOf(s).Elem().Type().FieldByName(k); ok {
			if field.Type == reflect.TypeOf(v) {
				reflect.ValueOf(s).Elem().FieldByName(k).Set(reflect.ValueOf(v))
			}
		}
	}
	return nil
}

func main() {
	setting := map[string]interface{}{
		"Name": "Link",
		"Age":  20,
	}
	e := Employee{}
	if err := fillBySettings(&e, setting); err != nil {
		fmt.Println(err)
	}
	c := Customer{}
	if err := fillBySettings(&c, setting); err != nil {
		fmt.Println(err)
	}
	fmt.Println(e, c)
}
```

## 12. 三大法则

#### 从 `interface{}` 变量可以获取到反射对象

#### 从反射对象可以获取 `interface{}` 变量

从接口值到反射对象：

- 从基本类型到接口类型的类型转换
- 从接口类型到反射对象的转换

从反射对象到接口值：

- 反射对象转换成接口类型 `i := v.Interface()`
- 再强转成原始类型 `i.(int)`

#### 要修改反射对象，其值必须可设置

