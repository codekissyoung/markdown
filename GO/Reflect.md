# 反射机制 reflect

## TypeOf 与 ValueOf

```go
func main() {
	var f float64 = 12
	fmt.Println(reflect.TypeOf(f), reflect.ValueOf(f), reflect.ValueOf(f).Type()) // float64 12 float64
	CheckType(f)                                                                  // Float
}

func CheckType(i interface{}) {
	t := reflect.TypeOf(i)
	switch t.Kind() {
	case reflect.Float32, reflect.Float64:
		fmt.Println("Float")
	case reflect.Int, reflect.Int32, reflect.Int64:
		fmt.Println("Int")
	default:
		fmt.Println("Unkown", t)
	}
}
```



## 获取结构体字段、方法

```go
type Employee struct {
	EmployeeID string
	Name       string `format:"normal"`
	Age        int
}

func (e *Employee) UpdateAge(newVal int) {
	e.Age = newVal
}

func main() {

	e := &Employee{"1", "Link", 30}
	fmt.Println(reflect.ValueOf(*e).FieldByName("Name")) // link
	if nameField, ok := reflect.TypeOf(*e).FieldByName("Name"); !ok {
		fmt.Println("Failed to get 'Name' field")
	} else {
		fmt.Println(nameField.Tag.Get("format")) // normal
	}
	var age = 10
	reflect.ValueOf(e).MethodByName("UpdateAge").Call([]reflect.Value{reflect.ValueOf(age)})
	fmt.Println(e) // &{1 Link 10}
}
```

## 深度比较

```go
	a := map[int]string{1: "one", 2: "two", 3: "threee"}
	b := map[int]string{1: "one", 2: "two", 4: "threee"}

	fmt.Println(reflect.DeepEqual(a, b)) // false

	s1 := []int{1, 2, 3}
	s2 := []int{1, 2, 3}
	s3 := []int{3, 2, 1}
	fmt.Println(reflect.DeepEqual(s1, s2)) // true
	fmt.Println(reflect.DeepEqual(s2, s3)) // false
```

## 万能程序

```go
type Employee struct {
	EmployeeID string
	Name       string `format:"normal"`
	Age        int
}

type Customer struct {
	CookieID string
	Name     string
	Age      int
}

func fillBySettings(s interface{}, m map[string]interface{}) error {
	if reflect.TypeOf(s).Kind() != reflect.Ptr {
		// Elem() 获取指针指向的值
		if reflect.TypeOf(s).Elem().Kind() != reflect.Struct {
			return errors.New("第一个参数必须是结构体的指针")
		}
	}

	if m == nil {
		return errors.New("setting is nil")
	}

	var field reflect.StructField
	var ok bool
	for k, v := range m {
		if field, ok = reflect.ValueOf(s).Elem().Type().FieldByName(k); ok {
			if field.Type == reflect.TypeOf(v) {
				reflect.ValueOf(s).Elem().FieldByName(k).Set(reflect.ValueOf(v))
			}
		}
	}
	return nil

}

func main() {

	setting := map[string]interface{}{
		"Name": "Link",
		"Age":  20,
	}
	e := Employee{}
	if err := fillBySettings(&e, setting); err != nil {
		fmt.Println(err)
	}
	c := Customer{}
	if err := fillBySettings(&c, setting); err != nil {
		fmt.Println(err)
	}

	fmt.Println(e, c)
}
```











