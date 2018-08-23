# 如何理解CSS的盒子模型？
每个HTML元素都是长方形盒子。
（1）盒子模型有两种：IE盒子模型、标准W3C盒子模型；IE的content部分包含了border和pading。
（2）标准W3C盒模型包含：内容(content)、填充(padding)、边界(margin)、边框(border)。

# link和@import的区别？
（1）link属于XHTML标签，而@import是CSS提供的。
（2）页面被加载时，link会同时被加载，而@import引用的CSS会等到页面被加载完再加载。
（3）import只在IE 5以上才能识别，而link是XHTML标签，无兼容问题。
（4）link方式的样式权重高于@import的权重。
（5）使用dom控制样式时的差别。当使用javascript控制dom去改变样式的时候，只能使用link标签，因为@import不是dom可以控制的。


# CSS 选择符有哪些？哪些属性可以继承？优先级算法如何计算？CSS 3新增伪类有哪些？
id选择器（# myid）
类选择器（.myclassname）
标签选择器（div、h1、p）
相邻选择器（h1 + p）
子选择器（ul < li）
后代选择器（li a）
通配符选择器（ * ）
属性选择器（a[rel = "external"]）
伪类选择器（a: hover, li: nth - child）
可继承： font-size font-family color, UL LI DL DD DT;
不可继承 ：border padding margin width height ;
优先级就近原则，样式定义最近者为准，载入样式以最后载入的定位为准。
优先级为：
     !important >  id > class > tag  
     important 比 内联优先级高
CSS3新增伪类举例：
p:first-of-type 选择属于其父元素的首个<p>元素的每个<p>元素。
p:last-of-type  选择属于其父元素的最后<p>元素的每个<p>元素。
p:only-of-type  选择属于其父元素唯一的<p>元素的每个<p>元素。
p:only-child    选择属于其父元素的唯一子元素的每个<p>元素。
p:nth-child(2)  选择属于其父元素的第二个子元素的每个<p>元素。
:enabled、:disabled 控制表单控件的禁用状态。
:checked  单选框或复选框被选中。

# 用纯 CSS 创建一个三角形的原理是什么？
```css
#demo {
    width:0;
    height: 0;
    border-width: 20px;
    border-style: solid;
    border-color: transparent transparent red transparent;
}
```

# 怎么让Chrome支持小于12px 的文字？
```css
body{-webkit-text-size-adjust:none}
```

# ::before 和 :after中双冒号和单冒号 有什么区别？解释一下这2个伪元素的作用。
```
单冒号(:)用于CSS3伪类，双冒号(::)用于CSS3伪元素。
伪元素由双冒号和伪元素名称组成。双冒号是在css3规范中引入的，用于区分伪类和伪元素。但是伪类兼容现存样式，浏览器需要同时支持旧的伪类，比如:first-line、:first-letter、:before、:after等。
对于CSS2之前已有的伪元素，比如:before，单冒号和双冒号的写法::before作用是一样的。
提醒，如果你的网站只需要兼容webkit、firefox、opera等浏览器，建议对于伪元素采用双冒号的写法，如果不得不兼容IE浏览器，还是用CSS2的单冒号写法比较安全。
```

# 现在HTML5中css3可以写出一个旋转的立方体，请写出要用到的CSS属性。
```
-webkit-transform-style: preserve-3d;
-webkit-transform: rotateY(30deg) rotateX(10deg);
-webkit-animation:  rot 4s linear infinite;
```
