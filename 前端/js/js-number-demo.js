// JavaScript Number类型详解演示
// 重点：JavaScript中所有数字都是64位浮点数(IEEE 754标准)

console.log('=== JavaScript Number类型详解 ===')

// 1. JavaScript Number的统一存储机制
console.log('\n1. 统一存储机制 - 都是64位浮点数')
console.log('整数也是浮点数存储:')
console.log('typeof 42:', typeof 42)           // "number"
console.log('typeof 3.14:', typeof 3.14)       // "number"
console.log('typeof -100:', typeof -100)       // "number"

// 验证：整数运算也可能产生浮点数
console.log('\n验证统一存储：')
console.log('0.1 + 0.2 =', 0.1 + 0.2)         // 0.30000000000000004 (浮点数精度问题)
console.log('0.1 + 0.2 === 0.3:', 0.1 + 0.2 === 0.3)  // false

// 2. 整数表示
console.log('\n2. 整数表示')
const integer1 = 42
const integer2 = -100
const integer3 = 0
console.log('正整数:', integer1)
console.log('负整数:', integer2)
console.log('零:', integer3)

// 不同进制表示
console.log('\n不同进制表示:')
console.log('十进制 42:', 42)
console.log('二进制 0b101010:', 0b101010)      // 42
console.log('八进制 0o52:', 0o52)              // 42
console.log('十六进制 0x2A:', 0x2A)            // 42

// 3. 浮点数表示
console.log('\n3. 浮点数表示')
const float1 = 3.14159
const float2 = -2.718
const float3 = 0.5
console.log('普通小数:', float1)
console.log('负小数:', float2)
console.log('0.x小数:', float3)

// 科学计数法
console.log('\n科学计数法:')
console.log('1e3 =', 1e3)                     // 1000
console.log('1.23e-4 =', 1.23e-4)             // 0.000123
console.log('2.5e+2 =', 2.5e+2)               // 250

// 4. 特殊值
console.log('\n4. 特殊值')

// NaN (Not a Number)
console.log('NaN相关:')
console.log('NaN:', NaN)
console.log('typeof NaN:', typeof NaN)         // "number" !!
console.log('0/0 =', 0/0)                     // NaN
console.log('parseInt("abc") =', parseInt("abc"))  // NaN
console.log('NaN === NaN:', NaN === NaN)       // false !!
console.log('isNaN(NaN):', isNaN(NaN))         // true
console.log('Number.isNaN(NaN):', Number.isNaN(NaN))  // true (更可靠)

// Infinity (无穷大)
console.log('\nInfinity相关:')
console.log('Infinity:', Infinity)
console.log('typeof Infinity:', typeof Infinity)  // "number" 
console.log('1/0 =', 1/0)                     // Infinity
console.log('-1/0 =', -1/0)                   // -Infinity
console.log('Infinity + 1 =', Infinity + 1)   // Infinity
console.log('Infinity === Infinity:', Infinity === Infinity)  // true

// 5. 数字范围和精度
console.log('\n5. 数字范围和精度')
console.log('最大安全整数:', Number.MAX_SAFE_INTEGER)      // 9007199254740991
console.log('最小安全整数:', Number.MIN_SAFE_INTEGER)      // -9007199254740991
console.log('最大值:', Number.MAX_VALUE)                   // 1.7976931348623157e+308
console.log('最小正值:', Number.MIN_VALUE)                  // 5e-324

// 超出安全范围的问题
console.log('\n精度问题示例:')
console.log('大整数精度丢失:')
console.log('9007199254740992 === 9007199254740993:', 9007199254740992 === 9007199254740993)  // true (精度丢失!)

// 6. 数字检测方法
console.log('\n6. 数字检测方法')
const testValues = [42, 3.14, NaN, Infinity, "123", null, undefined]

testValues.forEach(value => {
    console.log(`\n值: ${value}`)
    console.log('  typeof:', typeof value)
    console.log('  isNaN():', isNaN(value))              // 宽松检测
    console.log('  Number.isNaN():', Number.isNaN(value))  // 严格检测
    console.log('  isFinite():', isFinite(value))        // 宽松检测
    console.log('  Number.isFinite():', Number.isFinite(value))  // 严格检测
    console.log('  Number.isInteger():', Number.isInteger(value))  // 是否整数
})

// 7. 类型转换
console.log('\n7. 数字类型转换')
console.log('字符串转数字:')
console.log('Number("123"):', Number("123"))        // 123
console.log('Number("12.34"):', Number("12.34"))    // 12.34
console.log('Number("abc"):', Number("abc"))        // NaN
console.log('Number(""):', Number(""))              // 0
console.log('Number(null):', Number(null))          // 0
console.log('Number(undefined):', Number(undefined))  // NaN

console.log('\nparseInt和parseFloat:')
console.log('parseInt("123px"):', parseInt("123px"))    // 123
console.log('parseFloat("12.34em"):', parseFloat("12.34em"))  // 12.34
console.log('parseInt("px123"):', parseInt("px123"))    // NaN

// 8. 运算特点
console.log('\n8. 运算特点')
console.log('整数运算:')
console.log('10 / 3 =', 10 / 3)                 // 3.3333333333333335 (自动变浮点数)
console.log('10 % 3 =', 10 % 3)                 // 1

console.log('\n浮点数运算精度问题:')
console.log('0.1 + 0.2 =', 0.1 + 0.2)           // 0.30000000000000004
console.log('0.1 * 3 =', 0.1 * 3)               // 0.30000000000000004

// 解决精度问题的方法
console.log('\n精度问题解决方案:')
function preciseAdd(a, b, precision = 10) {
    return parseFloat((a + b).toFixed(precision))
}
console.log('精确加法 0.1 + 0.2 =', preciseAdd(0.1, 0.2, 1))  // 0.3

// 9. 与其他语言对比
console.log('\n9. 与其他语言对比')
console.log('Go语言对比:')
console.log(`
Go语言中的数字类型：
- int, int8, int16, int32, int64 (整数)
- uint, uint8, uint16, uint32, uint64 (无符号整数)
- float32, float64 (浮点数)
- 类型严格，需要显式转换

JavaScript中的数字类型：
- 只有一种 number 类型
- 统一使用64位浮点数存储
- 自动类型转换
- 更简单但精度要注意
`)

// 10. 实际应用建议
console.log('\n10. 实际应用建议')
console.log(`
在Vue 3开发中使用数字的建议：
1. 金钱计算：使用整数(分为单位)或专门的库
2. NaN检测：优先使用 Number.isNaN()
3. 无穷大检测：使用 Number.isFinite()
4. 整数检测：使用 Number.isInteger()
5. 大整数：考虑使用 BigInt 类型
6. 浮点运算：注意精度问题，必要时四舍五入
`)

console.log('\n=== JavaScript Number类型演示完成 ===')
console.log('🔢 理解了JavaScript统一的数字存储机制!')