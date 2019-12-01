package main						// 当前包
import (
	"fmt"
	"math"
	"flag"
)									// 导入包

const 	PI 		= 3.14						// 常量
var 	name 	= "gopher"					// 全局变量

func init() {
	flag.StringVar( &name, "name", "jack", "your name: " )
	fmt.Println( "init..." )
}

func main() {
	f := "Runoob"
	flag.Parse()
	fmt.Printf( "hello %s!\n", name )
	fmt.Println( math.Exp2(10) )
	fmt.Println( f )
}
