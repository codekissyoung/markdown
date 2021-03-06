# 大象 Thingking in UML

本文是《大象 thinking in UML》一书的笔记。

## 面向过程还是面向对象

### 面向过程

- 结构化程序设计，DFD 图，ER 模型，UC 矩阵
- 世界的一切都不是孤立的，它们相互紧密的链接在一起，缺一不可，相互影响，相互作用，并形成一个个具有严格因果律的小系统，而更多的小系统相互作用链接则组成了更大的系统
- 数据是面向过程的关键，过程的每一步都会产生、修改数据，每一个环节完成后，数据将顺着过程链传递，当我们想要的结果在数据中反映出来了，则认为这个过程结束了
- DFD 图表达了`输入数据->功能计算->输出数据`流程
- 数据的正确性和完备性非常重要，人们通过定义主键，外键来描述数据之间的关系，结构化的组织它们，利用关系理论三大范式来保证它们的完备性和一致性

### 面向对象

- 继承，封装，多态，复用
- 这个世界是分割开来的，由一个个对象组成，这些对象在不同的驱动力和规则下体现出不同的运动过程，只有在特定场景下，孤立的对象之间才进行某些信息交互

面向对象编程的目标不是复用，对象提供了一种处理复杂性问题的方式，有了对象，我们能够通过提升抽象级别来构建更大的，更复杂的系统

