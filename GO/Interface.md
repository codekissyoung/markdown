# Interface



## 接口变量特性

- 没有字段
- 只能声明方法，没有实现
- 可以嵌入其他接口

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



