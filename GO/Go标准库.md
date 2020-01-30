# Go标准库

## strconv

```go
str := strconv.Itoa( 100 )                  // num to str
num, err := strconv.Atoi("s200")            // str to num
is_ok, err = strconv.ParseBool( 'FALSE' )   //  1、0、t、f、T、F、true、false、True、False、TRUE、FALSE
num, err := strconv.ParseInt("-11", 10, 0)  // equal to Atoi()
str := strconv.FormatBool( false )          // boolen to string "false" or "true"
str := strconv.FormatInt( 16, 16)           // conv to string in 16th
```

## net/http