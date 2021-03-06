# Lua脚本

一些 `lua` 笔记。

## 安装与测试

```bash
$sudo apt-get install lua5.3  # 安装 
```

```lua
-- test.lua
print("Hello lua")
```

```bash
$ lua test.lua 
Hello lua
```

## 基本语法

```lua
-- 数据类型, 每个声明的变量都带有 类型 信息
nil	        
boolean	    -- false true
number	    -- 双精度类型浮点数
string	    -- 字符串
function	-- 由 C 或 Lua 编写的函数
userdata	-- 表示任意存储在变量中的C数据结构
thread	    -- 表示执行的独立线路，用于执行协同程序
table	    -- 关联数组，索引可以是number、string 或 table

a = 10 -- 声明变量

print(type(true)) -- 查看类型
print(type(nil))
```

```lua
-- 遍历
tab1 = { key1 = "val1", key2 = "val2", "val3" }
for k, v in pairs(tab1) do
    print( k .. ":" .. v) -- .. 是字符串链接符
end

tab1.key1 = nil -- nil 可用于删除变量，或者说赋值为 nil 等同于删除
```

```lua
-- 条件表达式
if false or nil then
    print("至少有一个是 true")
else
    print("false 和 nil 都为 false")
end

--  false 和 nil 看作是 false，其他的都为 true 包括 0
if 0 then
    print("数字 0 是 true")
else
    print("数字 0 为 false")
end
```

```lua
-- 函数
function factorial1(n)
    if n == 0 then
        return 1
    else
        return n * factorial1(n - 1)
    end
end
print(factorial1(5)) -- 120
fn = factorial1
print(fn(6)) -- 720
```


```lua
function testFun(tab, fun)
    for k ,v in pairs(tab) do
            print(fun(k, v));
    end
end

-- 匿名函数
tab={key1="val1",key2="val2"};
testFun(tab, function(key,val)
    return key.."="..val;
end);
```
