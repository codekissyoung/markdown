# 反射机制 reflect

反射包中的所有方法基本都是围绕着 Type 和 Value 这两个类型设计的。我们通过 reflect.TypeOf、reflect.ValueOf 可以将一个普通的变量转换成『反射』包中提供的 Type 和 Value，随后就可以使用反射包中的方法对它们进行复杂的操作。

反射是程序在运行期间检查其自身结构的一种方式。反射带来的灵活性是一把双刃剑，反射作为一种元编程方式可以减少重复代码

- reflect.TypeOf 能获取类型信息

- reflect.ValueOf 能获取数据的运行时表示

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
    // contains filtered or unexported fields
}

func (v Value) Addr() Value
func (v Value) Bool() bool
func (v Value) Bytes() []byte
```



```go
	author := "link"
	fmt.Println(reflect.TypeOf(author))  // string 拿到了类型
	fmt.Println(reflect.ValueOf(author)) // link 拿到了值
```





### 三大法则

#### 从 `interface{}` 变量可以获取到反射对象

#### 从反射对象可以获取 `interface{}` 变量

从接口值到反射对象：

- 从基本类型到接口类型的类型转换
- 从接口类型到反射对象的转换

从反射对象到接口值：

- 反射对象转换成接口类型 `i := v.Interface()`
- 再强转成原始类型 `i.(int)`

#### 要修改反射对象，其值必须可设置



关于反射的概念：

- 通过反射，可以获取丰富的类型信息，并可以利用这些类型信息做非常灵活的工作

- Java的反射可以做到`读取配置，并且根据类型名称，创建对象`，Java内置了类型工厂

  

- `Go`无法像Java那样，通过`类型字符串`创建对象实例(内置了类型工厂)。在`Java`中，通过读取配置，并根据类型名称创建对象，是常见的编程手法。
- 反射最常用的场景是做对象的序列化



### 反射的 Type 和 Value

对任何接口进行反射，都可以得到一个包含`Type`和`Value`的信息结构。

- `Type` 主要表达的是被反射的这个变量本身的类型信息。

- `Value` 则为该变量实例本身的信息。



```go
var x float64 = 3.4
fmt.Println(reflect.TypeOf(x)) // float64
```



```go
var x float64 = 3.4
v := reflect.ValueOf(x)
fmt.Println(v.Type()) // float64
fmt.Println(v.Kind() == reflect.Float64) // true
fmt.Println(v.Float()) // 3.4
```



### 修改值

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

v := reflect.ValueOf(x)
p := reflect.ValueOf(&x) // 对指针进行反射

fmt.Println(v.CanSet())        // false
fmt.Println(p.CanSet())        // false
fmt.Println(p.Elem().CanSet()) // true

p.Elem().SetFloat(4.1)

fmt.Println(p.Interface())        // 0xc00001e0d8
fmt.Println(p.Elem().Interface()) // 4.1
fmt.Println(p.Elem().Float())     // 4.1
fmt.Println(x)                    // 4.1
```



### 对结构体进行反射

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
```



### 判断结构体是否实现了接口



```go
type CustomError struct{}

func (*CustomError) Error() string {
	return ""
}

func main() {

	// 拿到 error 接口的 reflect.Type 对象
	typeOfError := reflect.TypeOf((*error)(nil)).Elem()

	// 拿到 CustomError 结构体类型的　reflect.Type 对象
	customErrorPtr := reflect.TypeOf(&CustomError{})
	customError := reflect.TypeOf(CustomError{})

	// 判断结构体是否继承接口
	fmt.Println(customErrorPtr.Implements(typeOfError)) // #=> true
	fmt.Println(customError.Implements(typeOfError))    // #=> false

}
```



### 通过反射动态调用函数

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







## 字段类型 名字 值

```go
type Bird struct {
	Name           string
	LifeExpectance int
}

func main() {
	s := &Bird{"link", 3}
	rs := reflect.ValueOf(s).Elem()
	for i := 0; i < rs.NumField(); i++ {
		fmt.Println(
			rs.Field(i).Type(),      // 字段类型
			rs.Type().Field(i).Name, // 字段名字
			rs.Field(i),             // 字段值
			rs.Field(i).Interface(),
		)
	}
}
```



## TypeOf 与 ValueOf

```go
func main() {
	var f float64 = 12
	fmt.Println(reflect.TypeOf(f), reflect.ValueOf(f), reflect.ValueOf(f).Type()) // float64 12 float64
	CheckType(f)                                                                  // Float
}

func CheckType(i interface{}) {
	t := reflect.TypeOf(i)
	switch t.Kind() {
	case reflect.Float32, reflect.Float64:
		fmt.Println("Float")
	case reflect.Int, reflect.Int32, reflect.Int64:
		fmt.Println("Int")
	default:
		fmt.Println("Unkown", t)
	}
}
```



## 获取结构体字段、方法

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

## 深度比较

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

## 万能程序

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
		// Elem() 获取指针指向的值
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



### 







