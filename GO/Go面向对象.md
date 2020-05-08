# Go 面向对象

## 为 结构体 绑定 方法

`Go` 没有类，也没有对象，但是 `object.func()` 这样的方式，又很具有表达力．所以 `Go` 采用了＂为结构体绑定方法＂这一设计．

方法可以理解为一个特别的函数，该函数的默认入参是：当前结构体变量，为了和其他入参区分开，结构体入参位置在 函数名 前面

```go
type Vertex struct {
	X, Y float64
}
func ( v Vertex ) Abs() float64 { // 入参是 普通结构体变量, 是当前结构体的副本
	return math.Sqrt( v.X * v.X + v.Y * v.Y)
}
func ( v *Vertex ) Scale(f float64) { // 入参 是 结构体指针，方法内部可直接修改 当前结构体
	v.X *= f
	v.Y *= f
}
// 等价的函数实现:
func Abs( v Vertex ) float64 {
	return math.Sqrt( v.X * v.X + v.Y * v.Y )
}
func Scale( v *Vertex, f float64 ) {
	v.X *= f
	v.Y *= f
}
func main() {
	v := Vertex{3, 4}
	v.Scale( 2 )
	fmt.Println( v ) 			// { 6, 8 }
}
```

```go
func main() {
    v := Vertex{ 3, 4 }
    fmt.Println( v.Abs() )		// 5
	Scale( &v, 10 )
	fmt.Println(Abs(v))         // 50
}
```

通过 `Scale( &v, 10 )` 我能明确知道，`v` 是通过指针传递的，`Scale()` 内部是可以直接修改 `v`

而通过 `v.Scale( 2 )` 我在不知道 `Scale` 的 声明/实现 的情况下，无法确认 `Scale()` 会不会直接修改 `v`

再看下 结构体指针 调用方法的情况：

```go
v := Vertex{3, 4}
p := &v
Scale( v, 10 )	    // cannot use v (type Vertex) as type *Vertex in argument to Scale
Scale( &v, 10 )     // ok
Scale( p, 10 )      // ok

v.Scale( 10 )       // ok
(&v).Scale( 10 )    // ok
p.Scale( 10 )       // ok

fmt.Println( v, p )
```

对于 `Scale( v, 10 )` ，会因为　＂函数参数类型检查不一致＂ 而报错

但是对于 `v.Scale( 10 )` `(&v).Scale( 10 )` `p.Scale( 10 )` 在 `Go` 语言中都是正确的调用写法，并且`Go`内部将它们视为相同的操作，是等价的

再来观察下:

```go
func main() {
	v := Vertex{3, 4}
    p := &v
    fmt.Println( Abs(v) )  // 5
	fmt.Println( Abs(&v) ) // cannot use &v (type *Vertex) as type Vertex in argument to Abs
	fmt.Println( Abs(p) )  // cannot use p (type *Vertex) as type Vertex in argument to Abs

    fmt.Println( v.Abs() )   // 5
	fmt.Println( (*p).Abs() )// 5
	fmt.Println( p.Abs() )   // 5
}
```

对于 `Abs( &v )` `Abs( p )` 会因为　＂函数参数类型检查不一致＂ 而报错

而`v.Abs()` `(*p).Abs()` `p.Abs()` 在 `Go` 语言中都是正确的调用写法，并且`Go`内部将它们视为相同的操作，是等价的 ^\_^

PS: 这种为了方便而牺牲 "一致性" 和 ＂类型检查＂ 的做法是 **利大于弊** 的么？

## 接口

```go
type Talk interface {       // 新接口 Talk
    Hello( userName string ) string
    Talk( heard string ) ( saying string, end bool, err error )
}

type myTalk string          // 新类型 myTalk
func (talk *myTalk) Hello( userName string ) string {
    // ...
}
func (talk *myTalk) Talk( heard string ) (saying string, end bool, err error) {
    // ...
}
// 实现了 Hello() 和 Talk() 两个函数后，myTalk 类型自动成为了 Talk 接口的实现
```

```go
func producer(header string, channel chan<- string) {
    for {
        channel <- fmt.Sprintf("%s: %v", header, rand.Int31())
        time.Sleep(time.Second)
    }
}
func customer(channel <-chan string) {
    for{
        message := <-channel    // 从通道中取出数据, 此处会阻塞直到信道中返回数据
        fmt.Println(message)
    }
}
func main() {
    channel := make(chan string)    // 创建一个字符串类型的通道

    go producer("cat", channel)     // 创建producer()函数的并发goroutine
    go producer("dog", channel)     // 创建producer()函数的并发goroutine

    customer(channel)               // 数据消费函数
}
```

## 方法

与某个数据类型绑定在一起的函数

```go
type myInt int;

func (i myInt) add( another int ) myInt {
    i = i + myInt(another)
    return i
}

i1 := myInt(1)
i2 := i1.add(2)
fmt.Println(i1, i2) // 1 3

// 指针
func (i *myInt) add( another int ) myInt {
    *i = *i + myInt(another)
    return *i
}
i1 := myInt(1)
i2 := i1.add(2)
fmt.Println(i1, i2) // 3 3
```
