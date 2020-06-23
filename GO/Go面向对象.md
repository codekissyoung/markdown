# Go 面向对象

## 方法

`Go` 没有类，也没有对象，但是 `object.func()` 这样的方式，又很具有表达力．所以 `Go` 采用了**为结构体绑定方法**这一设计

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

## 方法提升

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