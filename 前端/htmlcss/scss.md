# Sass ✅ **现代CSS预处理器标准**

> **完全推荐使用**: 现代前端开发的标准工具，Vue/React等框架完美集成

使用预编译器`Sass`来生成`CSS`。现代版本基于`Dart Sass`，性能更优。

## 现代安装方式 🚀

```bash
# ✅ 推荐：npm安装 (更现代的方式)
npm install -g sass
# 或在项目中安装
npm install --save-dev sass

# ✅ 使用方式
sass input.scss output.css
sass --watch src/scss:dist/css

# ⚠️ 传统方式：Ruby Gem (仍可用但不推荐)
gem install sass
```

## 安装

[Sass 官方文档](https://sass-lang.com/documentation)

```bash
# ubuntu 18.04 默认是 2.5 版本，能够满足需求了
$ sudo apt-get install ruby ruby-dev
# 安装 ruby 后自带 gem 命令，用于管理下载软件包
# 下面是更新软件源，参考 https://gems.ruby-china.com/
$ gem sources --remove https://rubygems.org/
$ gem sources --add https://gems.ruby-china.com/
$ gem cleanup                     # 清除所有包旧版本，保留最新版本
$ gem environment                 # 查看gem的环境
$ gem install sass                # 安装 sass
$ gem uninstall package-name      # 卸载软件包
$ sass -v                         # 查看 sass 版本
$ sass --watch --style expanded scss/:css/   # 监听文件夹,编译风格为可读
$ sass --watch --style expressed scss/:css/  # 监听文件夹,编译风格为压缩
```

## Sass 变量

```scss
$blue: #1875e7;
$side: left;
div {
  　　　color: $blue;
}
.rounded {
  　　　　border-#{$side}-radius: 5px; //变量写在#{}之中
}
```

## 数据类型

数字: 如，1、 2、 13、 10px；

字符串：有引号字符串或无引号字符串，如，"foo"、 'bar'、 baz；

颜色：如，blue、 #04a3f9、 rgba(255,0,0,0.5)；

布尔型：如，true、 false； 空值：如，null；

值列表：用空格或者逗号分开

`margin: 10px 15px 0 0`通过空格分割

`font-face: Helvetica, Arial, sans-serif` 通过逗号分割

`1px 2px, 5px 6px` 是包含 1px 2px 与 5px 6px 两个值列表的值列表,等价于`(1px 2px) (5px 6px)`

## 算数运算

减法|加法|乘法|除法：数字之间,颜色之间

除法：`(100px / 2)` 括号是必须的,不加会当做 css 处理 如`font: 10px/8px;`

字符串： + 链接

## 程序控制

`@for $i from <start> through <end>` 包含 end

`@for $i from <start> to <end>` 不包含 end

`@for $i from 1 through 3 { .item-#{$i} { width: 2em * $i; } }`

`@if 条件判断 { ... } @else { ... }`

`@while $types > 0 { ... }`

`@each $var in <list>` 遍历列表的值

`$list: adam john wynn mason kuroir;@each $author in $list { ... }`

`if($condition,$if-true,$if-false)` 三目运算符

## @extend

继承类.class 或者占位符`%`的样式

```scss
.class1 {
  margin-bottom: 10px;
}
%mt5 {
  margin-top: 5px;
} //占位符只有被@extend调用才产生代码
.btn {
  @extend %mt5;
  @extend .class1;
}
```

## 插值

```scss
$properties: (margin, padding);
@mixin set-value($side, $value) {
  @each $prop in $properties {
    #{$prop}-#{$side}: $value;
  }
}
.login-box {
  @include set-value(top, 14px);
}
//编译后
.login-box {
  margin-top: 14px;
  padding-top: 14px;
}

// 运用插值定义选择器
@mixin generate-sizes($class, $small, $medium, $big) {
  .#{$class}-small {
    font-size: $small;
  }
  .#{$class}-medium {
    font-size: $medium;
  }
  .#{$class}-big {
    font-size: $big;
  }
}
@include generate-sizes("header-text", 12px, 20px, 40px);

//插值不能用于 变量
$margin-big: 40px;
$margin-medium: 20px;
$margin-small: 12px;
@mixin set-value($size) {
  margin-top: $margin-#{$size};
}
.login-box {
  @include set-value(big);
}

// 插值不能用于mixin
@mixin updated-status {
  margin-top: 20px;
  background: #f00;
}
$flag: "status";
.navigation {
  @include updated-#{$flag};
}

// 插值可以用于 % 和 @extend
%updated-status {
  margin-top: 20px;
  background: #f00;
}
.selected-status {
  font-weight: bold;
}
$flag: "status";
.navigation {
  @extend %updated-#{$flag};
  @extend .selected-#{$flag};
}
```

## 函数

字符串函数
`unquote($string)` 删除字符串中的引号；
`quote($string)` 给字符串添加引号。
`To-upper-case()` 字符串大写
`To-lower-case()` 字符串小写
`percentage($value)` 将一个不带单位的数转换成百分比值；
`round($value)` 将数值四舍五入，转换成一个最接近的整数；
`ceil($value)` 将大于自己的小数转换成下一位整数；
`floor($value)` 将一个数去除他的小数部分；
`abs($value)` 返回一个数的绝对值；
`min($numbers…)` 找出几个数值之间的最小值；
`max($numbers…)` 找出几个数值之间的最大值；
`random()` 获取随机数
列表函数
`length($list)` 返回一个列表的长度值
`nth($list, $n)` 返回一个列表中指定的某个标签值
`join($list1, $list2, [$separator])` 将两个列给连接在一起，变成一个列表
`append($list1, $val, [$separator])` 将某个值放在列表的最后
`zip($lists…)` 将几个列表结合成一个多维的列表
`index($list, $value)` 返回一个值在列表中的位置值
`type-of($value)` 返回一个值的类型
`unit($number)` 返回一个值的单位
`unitless($number)` 判断一个值是否带有单位
`comparable($number-1, $number-2)` 判断两个值是否可以做加、减和合并
map 的使用

```scss
$map: (
  key1: value1,
  key2: (
    key-1: value-1,
    key-2: value-2
  ),
  key3: value3
);
```

`map-get($map,$key)`根据给定的 key 值，返回 map 中相关的值。
`map-merge($map1,$map2)`将两个 map 合并成一个新的 map。
`map-remove($map,$key)`从 map 中删除一个 key，返回一个新 map。
`map-keys($map)`返回 map 中所有的 key。
`map-values($map)`返回 map 中所有的 value。
`map-has-key($map,$key)`根据给定的 key 值判断 map 是否有对应的 value 值，如果有返回 true，否则返回 false。
`keywords($args)`返回一个函数的参数，这个参数可以动态的设置 key 和 value。

颜色函数

`rgb($red,$green,$blue)` 根据红、绿、蓝三个值创建一个颜色
`rgba($red,$green,$blue,$alpha)` 根据红、绿、蓝和透明度值创建一个颜色
`red($color)` 从一个颜色中获取其中红色值
`green($color)` 从一个颜色中获取其中绿色值
`blue($color)` 从一个颜色中获取其中蓝色值
`mix($color-1,$color-2,[$weight])` 把两种颜色混合在一起

## @ 规则

`@import "colors";` 引入 \_colors.scss 文件,但不会被编译为 colors.css 文件,因为有下划线
`@media` 媒体查询,暂时不了解
`@extend` 继承类或占位符

```scss
.a {
  color: red;
  .b {
    color: orange;
    .c {
      color: yellow;
      @at-root .d {
        //从多重嵌套里面跳出来,直接到根下面
        color: green;
      }
    }
  }
}
//编译后
.a {
  color: red;
}
.a .b {
  color: orange;
}
.a .b .c {
  color: yellow;
}
.d {
  color: green;
}
```

@debug @warn @error 调试用的

## 组件化开发

```scss
$baseLineHeight: 2; //会覆盖掉默认的
$baseLineHeight: 1.5 !default; // 设置默认的
body {
  line-height: $baseLineHeight; // 2
}
```
