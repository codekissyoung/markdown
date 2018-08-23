# 模块化要解决的问题
1. 如何安全的包装一个模块的代码？（不污染模块外的任何代码）
2. 如何唯一标识一个模块？
3. 如何优雅的把模块的API暴漏出去？（不能增加全局变量）
4. 如何方便的使用所依赖的模块？

# Modules/1.0规范
1. 模块的标识应遵循的规则（书写规范）
2. 定义全局函数require，通过传入模块标识来引入其他模块，执行的结果即为别的模块暴漏出来的API
3. 如果被require函数引入的模块中也包含依赖，那么依次加载这些依赖
4. 如果引入模块失败，那么require函数应该报一个异常
5. 模块通过变量exports来向外暴露API，exports只能是一个对象，暴漏的API须作为此对象的属性。

# AMD 规范
1. 用全局函数define来定义模块，用法为：define(id?, dependencies?, factory);
2. id为模块标识，遵从CommonJS Module Identifiers规范
3. dependencies为依赖的模块数组，在factory中需传入形参与之一一对应
4. 如果dependencies的值中有"require"、"exports"或"module"，则与commonjs中的实现保持一致
5. 如果dependencies省略不写，则默认为["require", "exports", "module"]，factory中也会默认传入require,exports,module
6. 如果factory为函数，模块对外暴漏API的方法有三种：return任意类型的数据、exports.xxx=xxx、module.exports=xxx
7. 如果factory为对象，则该对象即为模块的返回值
