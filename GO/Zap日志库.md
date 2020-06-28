# Zap日志库

```go
logger := zap.NewExample()
defer logger.Sync()
logger.Info("failed to fetch URL",
  zap.String("url", "http://example.com"),
  zap.Int("attempt", 3),
  zap.Duration("backoff", time.Second),
)
```

```go
logger := zap.NewExample()
defer logger.Sync()
sugar := logger.Sugar()
plain := sugar.Desugar()
```

```go
logger, err := zap.NewProduction() // NewProduction() NewDevelopment() NewExample()
if err != nil {
  log.Fatalf("can't initialize zap logger: %v", err)
}
defer logger.Sync()
```

简单配置：

See the package-level BasicConfiguration example for sample code.

```go
rawJSON := []byte(`{
	  "level": "debug",
	  "encoding": "json",
	  "outputPaths": ["stdout", "/tmp/logs"],
	  "errorOutputPaths": ["stderr"],
	  "initialFields": {"foo": "bar"},
	  "encoderConfig": {
	    "messageKey": "message",
	    "levelKey": "level",
	    "levelEncoder": "lowercase"
	  }
	}`)

var cfg zap.Config
if err := json.Unmarshal(rawJSON, &cfg); err != nil {
	panic(err)
}
logger, err := cfg.Build()
if err != nil {
	panic(err)
}
defer logger.Sync()

logger.Info("logger construction succeeded")
```



更多高级的需求：

More unusual configurations (splitting output between files, sending logs to a message queue, etc.) are possible, but require direct use of go.uber.org/zap/zapcore. See the package-level AdvancedConfiguration example for sample code



```go
// The bundled Config struct only supports the most common configuration
// options. More complex needs, like splitting logs between multiple files
// or writing to non-file outputs, require use of the zapcore package.
//
// In this example, imagine we're both sending our logs to Kafka and writing
// them to the console. We'd like to encode the console output and the Kafka
// topics differently, and we'd also like special treatment for high-priority logs.

// First, define our level-handling logic.
highPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
	return lvl >= zapcore.ErrorLevel
})
lowPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
	return lvl < zapcore.ErrorLevel
})

// Assume that we have clients for two Kafka topics. The clients implement
// zapcore.WriteSyncer and are safe for concurrent use. (If they only
// implement io.Writer, we can use zapcore.AddSync to add a no-op Sync
// method. If they're not safe for concurrent use, we can add a protecting
// mutex with zapcore.Lock.)
topicDebugging := zapcore.AddSync(ioutil.Discard)
topicErrors := zapcore.AddSync(ioutil.Discard)

// High-priority output should also go to standard error, and low-priority
// output should also go to standard out.
consoleDebugging := zapcore.Lock(os.Stdout)
consoleErrors := zapcore.Lock(os.Stderr)

// Optimize the Kafka output for machine consumption and the console output
// for human operators.
kafkaEncoder := zapcore.NewJSONEncoder(zap.NewProductionEncoderConfig())
consoleEncoder := zapcore.NewConsoleEncoder(zap.NewDevelopmentEncoderConfig())

// Join the outputs, encoders, and level-handling functions into
// zapcore.Cores, then tee the four cores together.
core := zapcore.NewTee(
	zapcore.NewCore(kafkaEncoder, topicErrors, highPriority),
	zapcore.NewCore(consoleEncoder, consoleErrors, highPriority),
	zapcore.NewCore(kafkaEncoder, topicDebugging, lowPriority),
	zapcore.NewCore(consoleEncoder, consoleDebugging, lowPriority),
)

// From a zapcore.Core, it's easy to construct a Logger.
logger := zap.New(core)
defer logger.Sync()
logger.Info("constructed a logger")
```



The zap package itself is a relatively thin wrapper around the interfaces in go.uber.org/zap/zapcore. 

Extending zap to support：

-   a new encoding (e.g., BSON)

-   a new log sink (e.g., Kafka)

-   something more exotic (perhaps an exception aggregation service, like Sentry or Rollbar) 
    

typically requires implementing the zapcore.Encoder, zapcore.WriteSyncer, or zapcore.Core interfaces. 



See the zapcore documentation for details.

Similarly, package authors can use the high-performance Encoder and Core implementations in the zapcore package to build their own loggers.



日志有两个概念：字段和消息。字段用来结构化输出错误相关的上下文环境，而消息简明扼要的阐述错误本身

```go
log.Error("User does not exist", zap.Int("uid", uid))
```



```go
// zap.Logger
type Logger struct {
	core        zapcore.Core
	development bool
	name        string
	errorOutput zapcore.WriteSyncer
	addCaller   bool
	addStack    zapcore.LevelEnabler
	callerSkip  int
}

// zapcore.Field
type Field struct {
	Key       string
	Type      FieldType
	Integer   int64
	String    string
	Interface interface{}
}

// zapcore.Level
type Level int8

// zapcore.Entry
// 一条日志生成一个Entry
type Entry struct {
	Level      Level
	Time       time.Time
	LoggerName string
	Message    string
	Caller     EntryCaller
	Stack      string
}

// zapcore.CheckedEntry
// 经过级别检查后的生成
type CheckedEntry struct {
	Entry
	ErrorOutput WriteSyncer
	dirty       bool // best-effort detection of pool misuse
	should      CheckWriteAction
	cores       []Core
}
```

