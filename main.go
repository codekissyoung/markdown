package main

import (
	"fmt"
	"math"
)

// 接口
type Abser interface {
	Abs() float64
}
type I interface {
	M()
}
type T struct {
	S string
}

// 接口实现 Abs()
type MyFloat float64
func (f MyFloat) Abs() float64 {
	if f < 0 {
		return float64(-f)
	}
	return float64(f)
}

// 接口实现
type Vertex struct {
	X, Y float64
}
func ( v Vertex ) Abs() float64 {
	return math.Sqrt( v.X * v.X + v.Y * v.Y)
}

// T 实现了接口 I
func (t T) M() {
	fmt.Println(t.S)
}

func describe(i I) {
	fmt.Printf("%v, %T\n", i, i)
}

func main() {
	var a Abser
	// f := MyFloat(-math.Sqrt2)
	v := Vertex{3, 4}

	a = v

	var i I = T{"hello"}
	
	describe( i )
	
	fmt.Printf("%v, %T\n", a, a)

	i.M()
}



