# Go容器

## new 与 make

`new`操作用于基本类型和`struct`自定义类型，返回的是指针:

```go
var sum *int
sum = new(int) // 分配空间
*sum = 98
fmt.Println(*sum)

type Student struct {
	name string
	age int8
}
var s *Student
s = new(Student)
s.name = "codekissyoung"
fmt.Printf("type : %T value: %v", s, s)
```

`make`专门用于 `slice` `map` `chan` 容器，分配及初始化它们的结构和数据。

## 切片

切片的底层结构包括三部分：`起始地址` + `大小` + `容量`。

```go
primes := [6]int{2, 3, 5, 7, 11, 13}        // 方式1 数组
abc := []int{2, 3, 5, 7, 11, 13} 							// 方式2 
edf := make([]int, 5, 5) 												// 方式3 make([]Type, len, cap) [0, 0, 0, 0, 0]

fmt.Println(primes[1:4], len(primes[1:4]), cap(primes[1:4]) ) // [3 5 7] 3 5
fmt.Println(primes[:4], len(primes[:4]), cap(primes[:4]) )    // [2 3 5 7] 4 6 省略 low ，默认取 0
fmt.Println(primes[1:], len(primes[1:]), cap(primes[1:]) )    // [3 5 7 11 13] 5 5 省略 high，默认取 len(a)
fmt.Println(primes[1:4], (primes[1:4])[1:2])　　　　　　　　　　// [3 5 7] [5] 切了后 再切 ^_^
```

往切片追加值，当切片的底层数组大小不足，容不下追加的值时，`Go`底层会分配一个更大的数组，然后将数据复制一份到新数组上。最后，返回的是新数组上的切片 ^\_^

```go
// 尾部追加
var a []int
a = append(a, 1) // 追加1个元素
a = append(a, 1, 2, 3) // 追加多个元素, 手写解包方式
a = append(a, []int{1,2,3}...) // 追加一个切片, 切片需要解包

// 开头插入
var a = []int{1,2,3}
a = append([]int{0}, a...) // 在开头添加1个元素
a = append([]int{-3,-2,-1}, a...) // 在开头添加1个切片

// 拷贝
src := []int{1, 2, 3, 4, 5}
dst := []int{5, 4, 3}
copy(dst, src) // 复制 src 到 dst，长度限制，只复制了 3 个元素
copy(src, dst) // 复制 dst 到 src 的前3个位置

// 删除
a = []int{1, 2, 3}
a = a[1:] // 删除开头1个元素
a = a[N:] // 删除开头N个元素

a = []int{1, 2, 3}
a = append(a[:0], a[1:]...) // 删除开头1个元素
a = append(a[:0], a[N:]...) // 删除开头N个元素

a = []int{1, 2, 3}
a = a[:copy(a, a[1:])] // 删除开头1个元素
a = a[:copy(a, a[N:])] // 删除开头N个元素

a = []int{1, 2, 3}
a = a[:len(a)-1] // 删除尾部1个元素
a = a[:len(a)-N] // 删除尾部N个元素

a = []int{1, 2, 3, ...}
a = append(a[:i], a[i+1:]...) // 删除中间1个元素
a = append(a[:i], a[i+N:]...) // 删除中间N个元素
a = a[:i+copy(a[i:], a[i+1:])] // 删除中间1个元素
a = a[:i+copy(a[i:], a[i+N:])] // 删除中间N个元素
```

## Map

```go
type Vertex struct {
	Lat, Long float64
}
m := map[string]Vertex{}            // 声明
n := make( map[string]Vertex )      // make 式声明，等价上句，作用是一样的

m["Bell Labs"] = Vertex{ 40.68433, -74.39967 }

m[key] = elem           // 新增 or 修改
a = m[key]              // 获取
b, ok = m[key]          // 如果 key 在 m 中，则 ok 为 true；否则 ok 为 false, b 为零值
key is: 3 - value is: 3.000000
2
key is: 1 - value is: 1.000000
3
key is: 4 - value is: 4.000000
4
key is: 2 - value is: 2.000000
fmt.Println( map[string]bool{"192.168.0.101":true} )  // 字面量 map[192.168.0.1:true]
var ipSwitches = map[string]bool{}
ipSwitchs["192.168.0.1"] = true
delete(ipSwitchs, "192.168.0.1")        // 删除元素

// 一个 key 只能对应一个 value，而 value 又是一个原始类型，那么如果一个 key 要对应多个值怎么办？
// 用切片作为 map 的值
mp1 := make(map[int][]int)
mp2 := make(map[int]*[]int)

// 删除
scene["route"] = 66
scene["brazil"] = 4
delete(scene, "brazil")

// 清空 map 中的所有元素
// 清空 map 的唯一办法就是重新 make 一个新的 map
// 不用担心垃圾回收的效率，Go语言中的并行垃圾回收效率比写一个清空函数要高效的多
```

### Map的多键索引

```go
// 人员档案
type Profile struct {
	Name    string   // 名字
	Age     int      // 年龄
	Married bool     // 已婚
}

// 查询键
type classicQueryKey struct {
	Name string // 要查询的名字
	Age  int    // 要查询的年龄
}

func simpleHash(str string) (ret int) {
	for i := 0; i < len(str); i++ {
		c := str[i]
		ret += int(c)
	}
	return
}

// 计算查询键的hash值
func (c *classicQueryKey) hash() int {
	// 将名字的hash和年龄hash合并
	return simpleHash(c.Name) + c.Age*1000000
}

// 创建hash值到数据的索引关系
var mapper = make(map[int][]*Profile)

// 构建数据索引
func buildIndex(list []*Profile) {
	for _, profile := range list {
		key := classicQueryKey{profile.Name, profile.Age}
		existValue := mapper[key.hash()] 		// 计算数据的hash值，取出已经存在的记录
		existValue = append(existValue, profile) 		// 将当前数据添加到已经存在的记录切片中
		mapper[key.hash()] = existValue 		// 将切片重新设置到映射中
	}
}

func queryData(name string, age int) {
	keyToQuery := classicQueryKey{name, age} 	// 根据给定查询条件构建查询键
	resultList := mapper[keyToQuery.hash()] 	// 计算查询键的哈希值，并查询，获得同哈希值的所有结果集合
	for _, result := range resultList {
		if result.Name == name && result.Age == age {		// 与查询结果比对，确认找到打印结果

			fmt.Println(result)
			return
		}
	}
	fmt.Println("no found")	// 没有查询到时，打印结果
}

func main() {
	list := []*Profile{
		{Name: "张三", Age: 30, Married: true},
		{Name: "李四", Age: 21},
		{Name: "王麻子", Age: 20},
	}
	buildIndex(list)
	queryData("张三", 30)
	queryData("link",89)
}
```

Go语言的底层会为 map 的键自动构建哈希值。能够构建哈希值的类型必须是非动态类型、非指针、非函数、非闭包。利用这个特性，可以使用如下实现：

```go
type Profile struct {
	Name    string
	Age     int
	Married bool
}

// 查询键
type queryKey struct {
	Name string
	Age  int
}

// 构建查询索引
func buildIndex(list []*Profile) {
	for _, profile := range list {
		key := queryKey{
			Name: profile.Name,
			Age:  profile.Age,
		}
		mapper[key] = profile 		// 保存查询键
	}
}

// 根据条件查询数据
func queryData(name string, age int) {
	key := queryKey{name, age} 	// 根据查询条件构建查询键
	result, ok := mapper[key] 	// 根据键值查询数据
	if ok {
		fmt.Println(result) 	// 找到数据打印出来
	} else {
		fmt.Println("no found")
	}
}
var mapper = make(map[interface{}]*Profile)
func main() {
	list := []*Profile{
		{Name: "张三", Age: 30, Married: true},
		{Name: "李四", Age: 21},
		{Name: "王麻子", Age: 21},
	}
	buildIndex(list)
	queryData("张三", 30)
	queryData("link", 30)
}
```

map 也可以用函数作为自己的值，这样就可以用来做分支结构（详见第 5 章）：key 用来选择要执行的函数。

key 可以是任意可以用 == 或者 != 操作符比较的类型，比如 string、int、float。所以数组、切片和结构体不能作为 key (译者注：含有数组切片的结构体不能作为 key，只包含内建类型的 struct 是可以作为 key 的），但是指针和接口类型可以。如果要用结构体作为 key 可以提供 `Key()` 和 `Hash()` 方法，这样可以通过结构体的域计算出唯一的数字或者字符串的 key。

value 可以是任意类型的；通过使用空接口类型（详见第 11.9 节），我们可以存储任意值，但是使用这种类型作为值时需要先做一次类型断言（详见第 11.3 节）。

```go
func main() {
	mf := map[int]func() int{
		1: func() int { return 10 },
		2: func() int { return 20 },
		5: func() int { return 50 },
	}
	fmt.Println(mf) // map[1:0x10903be0 5:0x10903ba0 2:0x10903bc0]
}
```



既然一个 key 只能对应一个 value，而 value 又是一个原始类型，那么如果一个 key 要对应多个值怎么办？例如，当我们要处理unix机器上的所有进程，以父进程（pid 为整形）作为 key，所有的子进程（以所有子进程的 pid 组成的切片）作为 value。通过将 value 定义为 `[]int` 类型或者其他类型的切片，就可以优雅的解决这个问题。

```go
mp1 := make(map[int][]int)
mp2 := make(map[int]*[]int)
```

#### Map类型的切片

假设我们想获取一个 map 类型的切片，我们必须使用两次 `make()` 函数，第一次分配切片，第二次分配 切片中每个 map 元素。

```go
// Version A:
items := make([]map[int]int, 5)
for i:= range items {
    items[i] = make(map[int]int, 1)
    items[i][1] = 2
}
fmt.Printf("Version A: Value of items: %v\n", items)
// Version A: Value of items: [map[1:2] map[1:2] map[1:2] map[1:2] map[1:2]]

// Version B: NOT GOOD!
items2 := make([]map[int]int, 5)
for _, item := range items2 {
    item = make(map[int]int, 1) // item is only a copy of the slice element.
    item[1] = 2 // This 'item' will be lost on the next iteration.
}
fmt.Printf("Version B: Value of items: %v\n", items2)
// Version B: Value of items: [map[] map[] map[] map[] map[]]
```

#### map 默认是无序的

不管是按照 key 还是按照 value 默认都不排序（详见第 8.3 节）。

如果你想为 map 排序，需要将 key（或者 value）拷贝到一个切片，再对切片排序（使用 sort 包，详见第 7.6.6 节），然后可以使用切片的 for-range 方法打印出所有的 key 和 value。