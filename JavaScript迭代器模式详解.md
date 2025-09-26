# JavaScript 迭代器模式详解

## 什么是迭代器模式

迭代器模式是一种行为设计模式，它提供了一种方法来顺序访问一个聚合对象中的各个元素，而又不暴露其内部的表示。在JavaScript中，迭代器模式让我们能够以一种统一的方式遍历各种数据结构。

## 迭代器模式的核心概念

### 外部迭代器 vs 内部迭代器

- **外部迭代器**：由客户端代码控制迭代过程，显式调用next()方法
- **内部迭代器**：由迭代器自身控制迭代过程，通常通过回调函数

本文示例实现的是**外部迭代器**，它给予调用者更多的控制权。

## 基础迭代器实现

```javascript
var Iterator = function(obj) {
    var current = 0;

    var next = function() {
        current += 1;
    };

    var isDone = function() {
        return current >= obj.length;
    };

    var getCurrItem = function() {
        return obj[current];
    };

    return {
        next: next,
        isDone: isDone,
        getCurrItem: getCurrItem,
        length: obj.length
    };
};
```

### 核心方法解析

1. **next()**: 将迭代器移动到下一个位置
2. **isDone()**: 检查是否已经遍历完所有元素
3. **getCurrItem()**: 获取当前元素的值
4. **length**: 返回集合的长度属性

## 使用示例

### 基本遍历

```javascript
var arr = [1, 2, 3, 4, 5];
var iterator = Iterator(arr);

while (!iterator.isDone()) {
    console.log(iterator.getCurrItem());
    iterator.next();
}
// 输出: 1, 2, 3, 4, 5
```

### 迭代器比较

```javascript
var compare = function(iterator1, iterator2) {
    if (iterator1.length !== iterator2.length) {
        alert('iterator1和iterator2不相等');
    }
    while (!iterator1.isDone() && !iterator2.isDone()) {
        if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
            throw new Error('iterator1和iterator2不相等');
        }
        iterator1.next();
        iterator2.next();
    }
    alert('iterator1和iterator2相等');
};
```

## 迭代器模式的优势

### 1. 简化遍历逻辑
- 将复杂的遍历逻辑封装在迭代器中
- 客户端代码只需要简单的调用接口

### 2. 统一接口
- 不同的数据结构可以提供相同的迭代接口
- 代码更加一致和可维护

### 3. 支持多种遍历方式
- 可以实现不同类型的迭代器（正向、反向、跳跃等）
- 同一个数据结构可以有多种遍历方式

### 4. 封装性
- 不暴露数据结构的内部实现
- 保护数据完整性

## 实际应用场景

### 1. 数组遍历
```javascript
var arrayIterator = Iterator([1, 2, 3, 4, 5]);
```

### 2. 类数组对象遍历
```javascript
var arrayLike = {0: 'a', 1: 'b', 2: 'c', length: 3};
var arrayLikeIterator = Iterator(arrayLike);
```

### 3. 自定义数据结构
```javascript
var customCollection = {
    data: ['apple', 'banana', 'orange'],
    length: 3
};
var customIterator = Iterator(customCollection);
```

## 扩展：支持更多数据类型

我们的基础迭代器主要支持数组-like 对象，可以进一步扩展：

```javascript
var EnhancedIterator = function(collection) {
    var current = 0;
    var items = [];
    
    // 处理不同类型的集合
    if (Array.isArray(collection)) {
        items = collection;
    } else if (typeof collection === 'object') {
        // 对象转数组
        for (var key in collection) {
            if (collection.hasOwnProperty(key)) {
                items.push(collection[key]);
            }
        }
    }
    
    return {
        next: function() {
            current += 1;
        },
        isDone: function() {
            return current >= items.length;
        },
        getCurrItem: function() {
            return items[current];
        },
        length: items.length,
        reset: function() {
            current = 0;
        }
    };
};
```

## 与ES6迭代器的对比

ES6引入了原生的迭代器协议：

```javascript
// ES6迭代器示例
var arr = [1, 2, 3];
var iterator = arr[Symbol.iterator]();

console.log(iterator.next()); // {value: 1, done: false}
console.log(iterator.next()); // {value: 2, done: false}
console.log(iterator.next()); // {value: 3, done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```

### 对比特点

| 特性 | 自定义迭代器 | ES6迭代器 |
|------|-------------|-----------|
| 兼容性 | 支持所有浏览器 | ES6+浏览器 |
| 接口 | 自定义方法 | 标准next()方法 |
| 返回值 | 直接返回元素 | {value, done}对象 |
| 协议 | 自定义 | Symbol.iterator |

## 最佳实践

### 1. 错误处理
```javascript
var SafeIterator = function(obj) {
    var current = 0;
    
    return {
        next: function() {
            if (this.isDone()) {
                throw new Error('迭代已完成');
            }
            current += 1;
        },
        isDone: function() {
            return current >= obj.length;
        },
        getCurrItem: function() {
            if (current < 0 || current >= obj.length) {
                throw new Error('索引越界');
            }
            return obj[current];
        },
        length: obj.length
    };
};
```

### 2. 重置功能
```javascript
var ResetableIterator = function(obj) {
    var current = 0;
    
    return {
        next: function() {
            current += 1;
        },
        isDone: function() {
            return current >= obj.length;
        },
        getCurrItem: function() {
            return obj[current];
        },
        reset: function() {
            current = 0;
        },
        length: obj.length
    };
};
```

## 迭代器模式的实际应用案例

### 案例：文件上传组件的选择器

#### 重构前的问题

下面是一个获取文件上传对象的函数，它存在明显的设计问题：

```javascript
var getUploadObj = function(){
    try{
      return new ActiveXObject("TXFTNActiveX.FTNUpload");    // IE上传控件
    }catch(e){
      if ( supportFlash() ){       // supportFlash函数未提供
          var str = '<object  type="application/x-shockwave-flash"></object>';
          return $( str ).appendTo( $('body') );
      }else{
          var str = '<input name="file" type="file"/>';  // 表单上传
          return $( str ).appendTo( $('body') );
      }
    }
};
```

**存在的问题**：
1. **可读性差**：函数里充斥着try-catch和if条件分支
2. **违反开闭原则**：每次添加新的上传方式都需要修改原函数
3. **维护困难**：在开发和调试过程中需要来回切换不同上传方式
4. **扩展性差**：增加HTML5上传等新方式时，必须继续往函数里增加条件分支

#### 使用迭代器模式重构

**第一步：分离各种上传方式的创建逻辑**

```javascript
var getActiveUploadObj = function(){
    try{
      return new ActiveXObject("TXFTNActiveX.FTNUpload");    // IE上传控件
    }catch(e){
      return false;
    }
};

var getFlashUploadObj = function(){
    if (supportFlash()){     // supportFlash函数未提供
      var str = '<object type="application/x-shockwave-flash"></object>';
      return $(str).appendTo($('body'));
    }
    return false;
};

var getFormUpladObj = function(){
    var str = '<input name="file" type="file" class="ui-file"/>';  // 表单上传
    return $(str).appendTo($('body'));
};
```

**第二步：创建迭代器来依次尝试各种上传方式**

```javascript
var iteratorUploadObj = function(){
    for (var i = 0, fn; fn = arguments[i++];){
      var uploadObj = fn();
      if (uploadObj !== false){
          return uploadObj;
      }
    }
};

// 使用迭代器获取合适的上传对象
var uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, getFormUpladObj);
```

#### 重构后的优势

1. **单一职责原则**：每个函数只负责一种上传方式的创建
2. **开闭原则**：新增上传方式时，只需添加新的函数，无需修改现有代码
3. **可读性提升**：代码逻辑清晰，易于理解和维护
4. **可扩展性强**：可以轻松添加新的上传方式，如Webkit控件和HTML5上传：

```javascript
// 新增Webkit控件上传方式
var getWebkitUploadObj = function(){
    // 具体代码略
    if (window.webkitRequestFileSystem){
      var str = '<input name="file" type="file" webkitdirectory/>';
      return $(str).appendTo($('body'));
    }
    return false;
};

// 新增HTML5上传方式
var getHtml5UploadObj = function(){
    // 具体代码略
    if (window.FileReader){
      var str = '<input name="file" type="file" multiple/>';
      return $(str).appendTo($('body'));
    }
    return false;
};

// 使用时只需添加到参数列表中，完全符合开闭原则
var uploadObj = iteratorUploadObj(
    getActiveUploadObj,     // IE上传控件
    getWebkitUploadObj,     // Webkit控件上传
    getFlashUploadObj,      // Flash上传
    getHtml5UploadObj,      // HTML5上传
    getFormUpladObj         // 表单上传
);
```

5. **可配置性**：可以根据需要调整上传方式的优先级顺序
6. **可测试性**：每个上传函数可以独立测试

#### 更通用的迭代器实现

我们可以将这个迭代器进一步抽象化：

```javascript
var FirstSuccessIterator = function() {
    var current = 0;
    var functions = Array.prototype.slice.call(arguments);
    
    return {
        next: function() {
            current += 1;
        },
        isDone: function() {
            return current >= functions.length;
        },
        getCurrItem: function() {
            return functions[current];
        },
        executeUntilSuccess: function() {
            while (!this.isDone()) {
                var result = this.getCurrItem()();
                if (result !== false) {
                    return result;
                }
                this.next();
            }
            return null; // 所有方式都失败
        }
    };
};

// 使用通用迭代器
var uploadIterator = FirstSuccessIterator(
    getActiveUploadObj,
    getFlashUploadObj, 
    getHtml5UploadObj,
    getFormUpladObj
);

var uploadObj = uploadIterator.executeUntilSuccess();
```

这个案例完美展示了迭代器模式在实际开发中的应用价值：通过将复杂的条件分支逻辑转换为清晰的迭代过程，大大提升了代码的可维护性和扩展性。

## 性能考虑

### 优点
- 封装性好，代码清晰
- 易于扩展和维护
- 支持复杂的数据结构遍历

### 缺点
- 相比直接循环有轻微性能开销
- 需要额外的内存存储迭代器状态

## 总结

JavaScript迭代器模式是一种强大的设计模式，它：

1. **提供统一的遍历接口**：不同的数据结构可以使用相同的遍历方式
2. **增强代码可读性**：将遍历逻辑封装起来，使代码更加清晰
3. **提高代码复用性**：迭代器可以在多个地方重复使用
4. **支持复杂遍历**：可以实现各种复杂的遍历逻辑

虽然ES6提供了原生的迭代器支持，但理解自定义迭代器的实现原理对于深入理解JavaScript编程模式和设计思想仍然很有价值。在实际开发中，可以根据项目需求和兼容性要求选择合适的迭代器实现方式。

---

*发布时间：2025-09-26*
*标签：JavaScript, 设计模式, 迭代器, 前端开发*