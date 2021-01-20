```go
func main() {
    var sm sync.Map
    
    sm.Store(1,"a") //store 方法,添加元素
    
    //Load 方法，获得value
    if v,ok:=sm.Load(1);ok{
        fmt.Println(v)
    }
    
    // LoadOrStore方法，获取或者保存
    // 参数是一对key：value，如果该key存在且没有被标记删除则返回原先的value（不更新）和true；
    // 不存在则store，返回该value 和false
    if vv,ok:=sm.LoadOrStore(1,"c");ok{
        fmt.Println(vv)
    }
    if vv,ok:=sm.LoadOrStore(2,"c");!ok{
        fmt.Println(vv)
    }
    
    // 遍历该map，参数是个函数，该函数参的两个参数是遍历获得的key和value，返回一个bool值
    // 当返回false时，遍历立刻结束。
    sm.Range(func(k,v interface{})bool{
        fmt.Print(k)
        fmt.Print(":")
        fmt.Print(v)
        fmt.Println()
        return true
    })
}
```

