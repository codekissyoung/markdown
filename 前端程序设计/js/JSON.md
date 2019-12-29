# JSON

`JSON` 是 `JS` 子集，字符集必须是`UTF-8`，字符串规定必须用`""`，`Object`的键也必须用`""`

```js
number：和JavaScript的number完全一致；
boolean：就是JavaScript的true或false；
string：就是JavaScript的string；
null：就是JavaScript的null；
array：就是JavaScript的Array表示方式——[]；
object：就是JavaScript的{ ... }表示方式。
```

## 对象=>JSON

```js
var xiaoming = {
    name: '小明',
    age: 14,
    gender: true,
    height: 1.65,
    grade: null,
    'middle-school': '\"W3C\" Middle School',
    skills: ['JavaScript', 'Java', 'Python', 'Lisp']
};
JSON.stringify(xiaoming, null, '');

// {"name":"小明","age":14,"gender":true,"height":1.65,"grade":null,
// "middle-school":"\"W3C\" Middle School","skills":["JavaScript",
// "Java","Python","Lisp"]}

// 只要 name 和 skills 属性
JSON.stringify(xiaoming, ['name', 'skills'], '');

```

```js
JSON.stringify(xiaoming, function convert(key, value) {
    if (typeof value === 'string') {
        return value.toUpperCase();
    }
    return value;
}, '');
```

```js
var xiaoming = {
    name: '小明',
    age: 14,
    gender: true,
    height: 1.65,
    grade: null,
    'middle-school': '\"W3C\" Middle School',
    skills: ['JavaScript', 'Java', 'Python', 'Lisp'],
    toJSON: function () { // 直接返回JSON应该序列化的数据
        return { // 只输出name和age，并且改变了key：
            'Name': this.name,
            'Age': this.age
        };
    }
};
JSON.stringify(xiaoming); // '{"Name":"小明","Age":14}'
```


## json 字符串 => 对象

```js
JSON.parse('[1,2,3,true]'); // [1, 2, 3, true]
JSON.parse('{"name":"小明","age":14}'); // Object {name: '小明', age: 14}
JSON.parse('true'); 　　// true
JSON.parse('123.45'); 　// 123.45

JSON.parse('{"name":"小明","age":14}', function (key, value) {
    // 把number * 2:
    if (key === 'name') {
        return value + '同学';
    }
    return value;
}); // Object {name: '小明同学', age: 14}
```
