# 结构体



## 字段

1. 在一个结构体中对于每一种数据类型只能有一个匿名字段。

1. 当两个字段拥有相同的名字（可能是继承来的名字）时该怎么办呢？

   - 外层名字会覆盖内层名字，但是两者的内存空间都保留，这提供了一种重载字段或方法的方式；

   - 如果相同的名字在同一级别出现了两次，如果这个名字被程序使用了，将会引发一个错误（不使用没关系）。没有办法来解决这种问题引起的二义性，必须由程序员自己修正。


**并发访问对象**

对象的字段（属性）不应该由 2 个或 2 个以上的不同线程在同一时间去改变。如果在程序发生这种情况，为了安全并发访问，可以使用包 `sync` 中的方法。

```go
type attr struct { rm int 
type file struct {
	name string
	attr
}
          
// 1. 接访问 attr 里的 perm !!!                 
f.perm = 0644
                  
type data struct {
	file
	name string // 2. 同名遮蔽 file.name
  os.File // 3. 作为匿名字段时，包名 os 去掉了
}

d.name = "data2"      // 这里的是 data 下的 name
d.file.name = "file2" // 使用 类型名 + 字段名 访问 里面被遮蔽的字段
```
## Tag

一个附属于字段的字符串，可以是文档或其他的重要标记。标签的内容不可以在一般的编程中使用，只有包 `reflect` 能获取它。



## 方法

方法是作用在接收者 Receiver 上的一个函数。

- 任何类型都可以有方法，甚至可以是函数类型

- 接收者不能是一个接口类型，因为接口是一个抽象定义，但是方法却是具体实现
- 接收者不能是一个指针类型，但是它可以是任何其他允许类型的指针



### Recevier 是 T 或 *T

- 要修改对象状态，用 `*T`

- 大对象，用`*T`，小对象用`T`

- 切片、字符串、函数等指针包装对象，直接用`T`

- 包含`Mutex`等同步字段，用`*T`,避免因复制造成锁操作无效

- 其他无法确定的情况，都用`*T`

### v 与 &v 等价

```go
type Vertex struct {
	X, Y float64
}
func (v Vertex) Abs() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}
func (v *Vertex) Scale(f float64) {
	v.X = v.X * f
	v.Y = v.Y * f
}

v := Vertex{3, 4}
p := &Vertex{3, 4}
println(v.Abs())
println(p.Abs()) // 编译时实际是 (*p).Abs()
v.Scale(10) 			// 编译时实际是 (&v).Scale(10)
p.Scale(3)
```

PS: 这种为了方便而牺牲 "一致性" 和 ＂类型检查＂ 的做法是 **利大于弊** 的么？


### 匿名字段的方法

```go
type data struct {
	sync.Mutex
	buf [1024]byte
}

func main() {
	d := data{}
	d.Lock() // 编译器会处理成 d.(*Mutex).Lock() 调用
	defer d.Unlock()
}
```

### 同名遮蔽

这个`同名遮蔽`特性反而可以用作`override`覆盖功能，类似于`OO`里的子类重写父类方法。

```go
type user struct { name string }
func (u user) show() string { return u.name }

type manager struct { user}
func (m manager) show() string { return "manager " + m.user.show() }  // override

m := &manager{}
m.name = "link"
println(m.show())      // manager link
println(m.user.show()) // link
```



```go
type user struct {
	name string
	age  int8
}
func (u user) ToString() string {
	return fmt.Sprintf("%+v %T", u, u)
}
type manager struct {
	user
	title string
}
func main() {
    var m manager
    m.name = "Link"
    m.age = 29
    println(m.ToString()) // 等价于 m.user.ToString()
}
```

## 方法集与接口

类型有一个称之为`方法集`的东西，就是该类型可以使用的所有方法的集合，这些方法包含它`自己实现`的，也包含它的`匿名字段实现`的。规则如下：

- 类型 T 拥有所有 receiver T 方法
- 类型 *T 拥有所有 receiver T + receiver *T 方法

嵌入匿名结构体：

- 嵌入 S，类型 T 新增所有 receiver S 方法
- 嵌入 *S，类型 T 新增所有 receiver S + recevier *S 方法
- 嵌入 S 或者 *S，类型 *T 新增所有 receiver S + recevier *S 方法

**只有一个类型的方法集完全涵盖了接口的方法集后，这个类型才会被认为是接口的实现类型。**

## 方法退化成函数

#### 从类型退化

`Recevier`是`T`

```go
type N int

func (n N) test() {
	fmt.Printf("test.n: %p, %d\n", &n, n)
}

func main() {
	var n N = 25
	fmt.Printf("main.n: %p, %d\n", &n, n) // main.n: 0xc00001e0b8, 25

	f1 := N.test
	N.test(n) // test.n: 0xc00001e0e0, 25
	f1(n)     // test.n: 0xc00001e0f0, 25

	f2 := (*N).test
	(*N).test(&n) // test.n: 0xc00001e100, 25
	f2(&n)        // test.n: 0xc00001e110, 25
}
```

`Recevier`是`*T`

```go
type N int
func (n *N) test() {
	fmt.Printf("test.n: %p, %d\n", n, *n)
}
func main() {
	var n N = 25
	fmt.Printf("main.n: %p, %d\n", &n, n) // main.n: 0xc00001e0b8, 25
	// 只有这种
	f2 := (*N).test
	(*N).test(&n) // test.n: 0xc00001e0b8, 25
	f2(&n)        // test.n: 0xc00001e0b8, 25
}
```



#### 从实例退化

```go
type N int

func (n N) test() {
	fmt.Printf("test.n: %p, %d\n", &n, n)
}

func main() {
	var n N = 100
	p := &n

	n++
	f1 := n.test

	n++
	f2 := p.test

	n++

	fmt.Printf("main.n: %p, %v\n", p, n) // main.n: 0xc0000b6010, 103
	f1()                                 // test.n: 0xc0000b6028, 101
	f2()                                 // test.n: 0xc0000b6038, 102
}
```

```go
type N int

func (n N) test() {
	fmt.Printf("test.n: %p, %d\n", &n, n)
}

func call(m func()) {
	m()
}

func main() {
	var n N = 100
	p := &n

	n++
	call(n.test) // test.n: 0xc0000b6018, 101

	n++
	call(p.test) // test.n: 0xc0000b6030, 102

	n++
	fmt.Printf("main.n :%p, %v\n", p, n) // main.n :0xc0000b6010, 103

}
```

`Recevier`是`*T`

```go
type N int
func (n *N) test() {
	fmt.Printf("test.n: %p, %d\n", n, *n)
}
func main() {
	var n N = 100
	p := &n
	n++
	f1 := n.test
	n++
	f2 := p.test
	n++
	fmt.Printf("main.n: %p, %v\n", p, n) // main.n: 0xc0000b6010, 103
	f1()                                 // main.n: 0xc0000b6010, 103
	f2()                                 // main.n: 0xc0000b6010, 103
}
```



```go
func main() {
	var delegate func(int)

	delegate = funcDo // 签名一致,就可以赋值
	delegate(100)     // call function do: 100

	c := new(class)
	delegate = c.Do // 签名一致,就可以赋值
	delegate(100)   // call method do: 100
}
type class struct {
}
func (c *class) Do(v int) {
	fmt.Println("call method do:", v)
}
func funcDo(v int) {
	fmt.Println("call function do:", v)
}
```



### 简单实现事件机制

```go
var eventByName = make(map[string][]func(interface{}))

func RegisterEvent(name string, callback func(interface{})) {
	list := eventByName[name]
	list = append(list, callback) // 签名相同就可以赋值
	eventByName[name] = list
}
func CallEvent(name string, param interface{}) {
	list := eventByName[name]
	for _, callback := range list {
		callbacTagk(param) // 签名相同就可以调用
	}
}

type Actor struct {
}
func (a *Actor) OnEvent(param interface{}) {
	fmt.Println("actor event:", param)
}

func GlobalEvent(param interface{}) {
	fmt.Println("global event:", param)
}

func main() {
	a := new(Actor)
	RegisterEvent("OnSkill", a.OnEvent)   // 注册　OnSkill　actor事件
	RegisterEvent("OnSkill", GlobalEvent) // 注册　OnSkill　全局事件
	CallEvent("OnSkill", 100)             // 调用事件，所有注册的同名函数都会被调用
}
```

## 如何在类型中嵌入功能

```go
type Log struct {
	msg string
}
func (l *Log) Add(s string) {
	l.msg += "\n" + s
}
func (l *Log) String() string {
	return l.msg
}
```



### 通过组合

```go
type Customer struct {
	Name string
	log  *Log
}
func (c *Customer) Log() *Log {
	return c.log
}

func main() {
	c := &Customer{"Barak Obama", &Log{"1 - Yes we can!"}}
	c.Log().Add("2 - After me the world will be a better place!")
	fmt.Println(c.Log())
}
```

### 通过嵌入

```go
type Customer struct {
	Name string
	Log
}
func (c *Customer) String() string {
	return c.Name + "\nLog:\n" + c.Log.String()
}

func main() {
	c := &Customer{"Barak Obama", Log{"1 - Yes we can!"}}
	c.Add("2 - After me the world will be a better place!")
	fmt.Println(c)
}
```

## 多重继承

多重继承指的是类型获得多个父类型行为的能力，它在传统的面向对象语言中通常是不被实现的（C++ 和 Python 例外）。因为在类继承层次中，多重继承会给编译器引入额外的复杂度。但是在 Go 语言中，通过在类型中嵌入所有必要的父类型，可以很简单的实现多重继承。

作为一个例子，假设有一个类型 `CameraPhone`，通过它可以 `Call()`，也可以 `TakeAPicture()`，但是第一个方法属于类型 `Phone`，第二个方法属于类型 `Camera`。

只要嵌入这两个类型就可以解决这个问题。



## 和其他面向对象语言比较 Go 的类型和方法



在如 C++、Java、C# 和 Ruby 这样的面向对象语言中，方法在类的上下文中被定义和继承：在一个对象上调用方法时，运行时会检测类以及它的超类中是否有此方法的定义，如果没有会导致异常发生。

在 Go 语言中，这样的继承层次是完全没必要的：如果方法在此类型定义了，就可以调用它，和其他类型上是否存在这个方法没有关系。在这个意义上，Go 具有更大的灵活性。

Go 不需要一个显式的类定义，如同 Java、C++、C# 等那样，相反地，“类”是通过提供一组作用于一个共同类型的方法集来隐式定义的。类型可以是结构体或者任何用户自定义类型。

我们想定义自己的 `Integer` 类型，并添加一些类似转换成字符串的方法，在 Go 中可以如下定义：

```go
type Integer int
func (i *Integer) String() string {
    return strconv.Itoa(int(*i))
}
```

在 Java 或 C# 中，这个方法需要和类 `Integer` 的定义放在一起，在 Ruby 中可以直接在基本类型 int 上定义这个方法。

在 Go 中，类型就是类（数据和关联的方法）。Go 不知道类似面向对象语言的类继承的概念。继承有两个好处：代码复用和多态。

在 Go 中，代码复用通过组合和委托实现，多态通过接口的使用来实现：有时这也叫 **组件编程（Component Programming）**。

许多开发者说相比于类继承，Go 的接口提供了更强大、却更简单的多态行为。

如果真的需要更多面向对象的能力，看一下 [`goop`](https://github.com/losalamos/goop) 包（Go Object-Oriented Programming），它由 Scott Pakin 编写: 它给 Go 提供了 JavaScript 风格的对象（基于原型的对象），并且支持多重继承和类型独立分派，通过它可以实现你喜欢的其他编程语言里的一些结构。

## String方法的递归问题

不要在 `String()` 方法里面调用涉及 `String()` 方法的方法，它会导致意料之外的错误，比如下面的例子，它导致了一个无限递归调用（`TT.String()` 调用 `fmt.Sprintf`，而 `fmt.Sprintf` 又会反过来调用 `TT.String()`...），很快就会导致内存溢出：

```go
type TT float64
func (t TT) String() string {
    return fmt.Sprintf("%v", t)
}
t.String()
```

