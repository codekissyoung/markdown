1. php文件：UTF-8编码，无BOM保存
2. 纯php文件不使用 ?>结尾，代之以
```
/* End of file myfile.php */ 
/* Location: ./system/modules/mymodule/myfile.php */
```
3. 一个类只放在一个文件，文件名小写，类名首字母大写，分割单词用 _
```
convert_text()  // 公开方法
_convert_text()  // 私有方法
```
4. 相同作用的辅助函数放到一个文件，文件名小写，函数名小写，分割单词用 _，变量命名：小写，用_分割
5. 注释
文档块(DocBlock) 式的注释要写在类和方法的声明前，这样它们就能被集成开发环境(IDE)捕获：
PHPDocumentor 是一个能将注解生成API文档的工具！文档可以转换成PDF，HTML，CHM等格式。
```
注解比较常用到参数的应该是

@author 程序作者名称，联络方式

@const 常数

@deprecate 不建议使用的 API

@global 全域变量

@param 函数的参数

@return 回传值

@see 可参考函数

@since 开始时间

@static 静态变量

@var 物件成员变量

@todo 计划中要进行的项目
```










