# Go结构体



## 查找与遮蔽



## 字段

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
## 方法

方法是与`实例`绑定的`特殊函数`。

普通函数专注于算法流程，传入参数，返回结果；方法是有关联对象的，有的方法的调用结果取决于当时`关联对象`的状态。

方法非常主要的一个作用是：维护和展示对象的状态。

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
		callback(param) // 签名相同就可以调用
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
