# Go GC



```go
type Road int
func findRoad(r *Road) {
	log.Printf("memory free : %p %v \n ", r, *r)
}
func entry() {
	rd := new(Road)
	*rd = 100
	runtime.SetFinalizer(rd, findRoad) // 在对象被 GC 时执行
}

func main() {
	entry()
	for i := 0; i < 10; i++ {
		time.Sleep(time.Second)
		runtime.GC()
	}
}
```

