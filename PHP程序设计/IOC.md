# 依赖倒置原则（Dependence Inversion Principle, DIP）

DIP　的核心思想是上层定义接口，下层实现这个接口， 从而使得下层依赖于上层，降低耦合度，提高整个系统的弹性。这是一种经实践证明的有效策略。

# 控制反转（Inversion of Control, IoC）
而IoC是一种实现DIP的方法。IoC的核心是将类（上层）所依赖的单元（下层）的实例化过程交由第三方来实现。一个简单的特征，就是类中不对所依赖的单元有诸如 $component = new yii\component\SomeClass（） 的实例化语句。

# 依赖注入（Dependence Injection, DI）

DI是IoC的一种设计模式，是一种套路，按照DI的套路，就可以实现IoC，就能符合DIP原则。 DI的核心是把类所依赖的单元的实例化过程，放到类的外面去实现。

#　控制反转容器（IoC Container）
当项目比较大时，依赖关系可能会很复杂。 而IoC Container提供了动态地创建、注入依赖单元，映射依赖关系等功能，减少了许多代码量。 Yii 设计了一个 yii\di\Container 来实现了 DI Container。

# 服务定位器（Service Locator）Service Locator

是IoC的另一种实现方式， 其核心是把所有可能用到的依赖单元交由Service Locator进行实例化和创建、配置， 把类对依赖单元的依赖，转换成类对Service Locator的依赖。 DI 与 Service Locator并不冲突，两者可以结合使用。 目前，Yii2.0把这DI和Service Locator这两个东西结合起来使用，或者说通过DI容器，实现了Service Locator。
