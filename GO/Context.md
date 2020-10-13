# Context

最简单的一段取消子任务的代码。

```go
func isCancelled(ctx context.Context) bool {
	select {
	case <-ctx.Done():
		return true
	default:
		return false
	}
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	for i := 0; i < 5; i++ {
		go func(i int, ctx context.Context) {
			for {
				if isCancelled(ctx) {
					break
				}
				println(i)
				time.Sleep(time.Millisecond * 10)
			}
			fmt.Println(strconv.Itoa(i) + " Cancelled ")
		}(i, ctx)
	}
	time.Sleep(time.Millisecond * 20)
	cancel() // 触发取消, ctx.Done() 里都会收到取消指令
	time.Sleep(time.Second * 5)
}
```

