# Go 面向对象

程序等于 数据 + 算法。算法是一个计算步骤，数据是生产资料，也是生产结果。

**如何安排数据？**

如果只是写一段几百行的小程序，直接存在全局变量里，谁都可以访问，函数也不需要传参。

```c
int src = 10;
int sum = 0;
... // 所有参与计算的变量
    
int main (){
    func1();
    func2();
    // ...
    show();
}

int func1(){ ... }
int func2(){ ... }
int show(){ ... }
```

如果有些中间的临时数据，只想在某些计算过程中可见，而不是像全局变量一样，谁都可以用。于是就出现了**局部变量**。

```c
int func1(){
   int local = 10;
   // ...
}
```

计算过程之间的值交换，也希望是私密的，不想通过全局变量(因为任何地方都可以访问到)，于是加入 **传参机制** **返回值机制**。

```c
int func1(int a, int b){
    return c;
}
```




## 结构体方法

方法是与`对象实例`绑定的`特殊函数`。

普通函数专注于算法流程，传入参数，返回结果。而方法相比函数，是有关联对象的，有的方法的调用结果取决于当时`关联对象`的状态。

方法非常主要的一个作用是：维护和展示对象的状态。

```go
type Vertex struct {
	X, Y float64
}
func ( v Vertex ) Abs() float64 {
	  return math.Sqrt( v.X * v.X + v.Y * v.Y)
}
func ( v *Vertex ) Scale(f float64) {
	v.X *= f
	v.Y *= f
}
func main() {
    v := Vertex{ 3, 4 }
    fmt.Println( v.Abs() ) // 5
    Scale( &v, 10 )
    fmt.Println(Abs(v))    // 50
}
```

#### 如何选择`receiver`的类型？

- 要修改对象状态，用 `*T`

- 大对象，用`*T`,小对象用`T`

- 切片、字符串、函数等指针包装对象，直接用`T`

- 包含`Mutex`等同步字段，用`*T`,避免因复制造成锁操作无效

- 其他无法确定的情况，都用`*T`



### 匿名字段

#### 结构体匿名字段

```go
type attr struct {
	perm int
}

type file struct {
	name string
	attr // 匿名字段
}

type data struct {
	os.File // 作为匿名字段时，包名被自动去掉了
}

func main() {

	f := file{
		name: "test.dat",
		attr: attr{
			perm: 0755,
		},
	}
	f.perm = 0644  // 可以直接访问 attr 里的 perm !!!
	println(f.perm)

	d := data{
		File: os.File{},
	}
	fmt.Printf("%#v", d)
}
```

#### 基础类型匿名字段

```go
type data struct {
	*int   // 使用 int 作为字段名
	string // 使用 string 作为字段名
}

func main() {
	x := 100
	d := data{
		int:    &x, // 使用基础类型作为字段名
		string: "abc",
	}
	println(*d.int)   // 100
	println(d.string) // abc
	fmt.Printf("%#v\n", d)
}
```

#### 命名类型的指针不能作为匿名字段

```go
type a *int
type b **int
type c interface{}

type d struct {
	*int // ok
	a    // embedded type cannot be a pointer
	b    // embedded type cannot be a pointer
	c    // ok
	*c   // embedded type cannot be a pointer to interface
}
```

#### 匿名字段遮蔽

```go
type file struct {
	name string
}
type data struct {
	file
	name string
}
func main() {
	d := data{
		name: "data",
		file: file{"file"},
	}
	d.name = "data2"      // 这里的是 data 下的 name
	d.file.name = "file2" // 使用 类型名 + 字段名 访问 里面被遮蔽的字段
	fmt.Printf("%#v", d)
}
```


#### 匿名字段的方法

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

### 匿名字段的方法的同名遮蔽

这个`同名遮蔽`特性反而可以用作`override`覆盖功能，类似于`OO`里的子类重写父类方法。

```go
type user struct {
	name string
}

type manager struct {
	user
}

func (u user) show() string {
	return u.name
}

func (m manager) show() string {
	return "manager " + m.user.show()
}

func main() {
	m := &manager{}
	m.name = "link"

	println(m.show())      // manager link
	println(m.user.show()) // link
}
```



```go
v := Vertex{3, 4}
p := &v

fmt.Println( v, p )

Scale( v, 10 )	     // cannot use v (type Vertex) as type *Vertex in argument to Scale
Scale( &v, 10 )     // ok
Scale( p, 10 )      // ok

v.Scale( 10 )       // ok
(&v).Scale( 10 )    // ok
p.Scale( 10 )       // ok
```

对于 `Scale( v, 10 )` ，会因为　＂函数参数类型检查不一致＂ 而报错

但是对于 `v.Scale( 10 )` `(&v).Scale( 10 )` `p.Scale( 10 )` 在 `Go` 语言中都是正确的调用写法，并且`Go`内部将它们视为相同的操作，是等价的

再来观察下:

```go
func main() {
    v := Vertex{3, 4}
    fmt.Println( Abs(v) )  // 5
    fmt.Println( Abs(&v) ) // cannot use &v (type *Vertex) as type Vertex ...
    fmt.Println( Abs(p) )  // cannot use p (type *Vertex) as type Vertex ...

    p := &v
    fmt.Println( v.Abs() ) 			// 5
    fmt.Println( (*p).Abs() ) 	// 5
    fmt.Println( p.Abs() )   	// 5
}
```

对于 `Abs( &v )` `Abs( p )` 会因为　＂函数参数类型检查不一致＂ 而报错

而`v.Abs()` `(*p).Abs()` `p.Abs()` 在 `Go` 语言中都是正确的调用写法，并且`Go`内部将它们视为相同的操作，是等价的 ^\_^

PS: 这种为了方便而牺牲 "一致性" 和 ＂类型检查＂ 的做法是 **利大于弊** 的么？

## 继承

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
	// m 是 manager , 更是 user, 所以能调用 ToString()
	// 并且 ToString() 的 Reciver 的取值是 m.user
	println(m.ToString())
}
```

## 方法集、方法提升

类型有一个称之为`方法集`的东西，就是该类型可以使用的所有方法的集合，这些方法包含它`自己实现`的，也包含它的`匿名字段实现`的。

`方法提升`是指:结构体能否拿到它的匿名字段的方法，能拿到就是`方法提升`了。规则如下：


```go
type T struct {}
type S struct {
    T
}
type D struct {
    *T
}
```

| T struct 方法接收者类型 | S      | *S   | D    | *D   |
| :---------------------- | :----- | ---- | ---- | ---- |
| T                       | 提升   | 提升 | 提升 | 提升 |
| *T                      | 不提升 | 提升 | 提升 | 提升 |

**提升**:即`S` `*S`可以使用`T`的方法。

- 对于 `S` 类型，方法集由接收者为`S`类型的全部方法构成。

- 而对于`*S` 类型，方法集包括`S`类型的全部方法，以及`*S`的全部方法。

**只有一个类型的方法集完全涵盖了接口的方法集后，这个类型才会被认为是接口的实现类型。**

综上所述，只有一种情况要注意：

当外部结构体为`type S struct { T }` 时，`T` 的某个方法是使用`func (*T)notify(){}` 这样实现的时，`S`是无法拿到`notify()`方法的。 



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

## Go的编程思路

将模块分解成相互独立的更小单元，分别处理不同方面的需求，最后以匿名嵌入的方式，组合到一个结构体中，共同实现对外接口。

接口是多态的一种实现形式，要于基于继承体系的多态分别对待，两者在解决问题的套路上还是有些区别的。
