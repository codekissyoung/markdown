# 定义

- XML本身不算复杂，但是，加上DTD、XSD、XPath、XSLT等一大堆复杂的规范以后，任何正常的软件开发人员碰到XML都会感觉头大了，最后大家发现，即使你努力钻研几个月，也未必搞得清楚XML的规范。

- JSON 是javascript 子集
    ```js
    number：和JavaScript的number完全一致；
    boolean：就是JavaScript的true或false；
    string：就是JavaScript的string；
    null：就是JavaScript的null；
    array：就是JavaScript的Array表示方式——[]；
    object：就是JavaScript的{ ... }表示方式。
    ```

- JSON还定死了字符集必须是UTF-8
- JSON的字符串规定必须用双引号""，Object的键也必须用双引号""

# 对象装换成JSON字符串
- 普通
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
    JSON.stringify(xiaoming, null, '  ');

    // 结果
    {
      "name": "小明",
      "age": 14,
      "gender": true,
      "height": 1.65,
      "grade": null,
      "middle-school": "\"W3C\" Middle School",
      "skills": [
        "JavaScript",
        "Java",
        "Python",
        "Lisp"
      ]
    }
    ```
- 第二个参数用于控制如何筛选对象的键值，如果我们只想输出指定的属性，可以传入Array
    ```js
    JSON.stringify(xiaoming, ['name', 'skills'], '  ');

    // 结果
    {
      "name": "小明",
      "skills": [
        "JavaScript",
        "Java",
        "Python",
        "Lisp"
      ]
    }
    ```

- 还可以传入一个函数，这样对象的每个键值对都会被函数先处理：
    ```js
    JSON.stringify(xiaoming, convert, '  ');
    function convert(key, value) {
        if (typeof value === 'string') {
            return value.toUpperCase();
        }
        return value;
    }
    // 结果
    {
      "name": "小明",
      "age": 14,
      "gender": true,
      "height": 1.65,
      "grade": null,
      "middle-school": "\"W3C\" MIDDLE SCHOOL",
      "skills": [
        "JAVASCRIPT",
        "JAVA",
        "PYTHON",
        "LISP"
      ]
    }
    ```
- 可以给xiaoming定义一个toJSON()的方法，直接返回JSON应该序列化的数据
    ```js
    var xiaoming = {
        name: '小明',
        age: 14,
        gender: true,
        height: 1.65,
        grade: null,
        'middle-school': '\"W3C\" Middle School',
        skills: ['JavaScript', 'Java', 'Python', 'Lisp'],
        toJSON: function () {
            return { // 只输出name和age，并且改变了key：
                'Name': this.name,
                'Age': this.age
            };
        }
    };
    JSON.stringify(xiaoming); // '{"Name":"小明","Age":14}'
    ```


# JSON 字符串装换成对象
- parse
    ```js
    JSON.parse('[1,2,3,true]'); // [1, 2, 3, true]
    JSON.parse('{"name":"小明","age":14}'); // Object {name: '小明', age: 14}
    JSON.parse('true'); // true
    JSON.parse('123.45'); // 123.45
    ```

- JSON.parse()还可以接收一个函数，用来转换解析出的属性：
    ```js
    JSON.parse('{"name":"小明","age":14}', function (key, value) {
        // 把number * 2:
        if (key === 'name') {
            return value + '同学';
        }
        return value;
    }); // Object {name: '小明同学', age: 14}
    ```
