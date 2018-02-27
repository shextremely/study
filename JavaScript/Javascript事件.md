## DOM0级和DOM2级

事件是JavaScript和HTML的交互基础，DOM事件有DOM0，DOM2和DOM3的区分，因为DOM规范1中没有事件的描述，所以没有DOM1事件之说。

DOM0级事件通过JavaScript指定事件处理程序的传统方式，将一个函数赋值给一个事件处理属性，即通过onclick、onmouseover等方式（HTML元素上添加或者通过javascript设定）实现事件的绑定。

DOM0级事件具有很明显的优势，就是简单且具有良好的兼容性，至今为所有浏览器所支持，不过每一个元素上通过此方式只能增加一个处理函数，换句话说，当通过这种方式增加事件时，该事件处理程序会转换成元素的属性存在，这意味着当指定多个事件处理程序时，后一个会将前面的覆盖掉。

在W3C指定的DOM2规范中，其中对DOM事件定义了两种方法，addEventListener和removeEventListener，分别用于添加事件处理程序和删除事件处理程序，具体的使用方法这里不做赘述，只做两点说明：
1. 在IE8中，没有实现addEventListener和removeEventListener，但是提供了两个其他的方法替代，即attachEvent和detachEvent，所以若想要兼容性更高的程序需要考虑到这些。不过我们在使用jquery或者其他框架时都会考虑到这些，所以我们也不用为IE的遗留问题而烦恼。
2. 通过addEventListener添加多个事件处理程序时，不会进行覆盖。

DOM3事件只是新增了一些事件方法。DOM2级和3级的目的在于扩展DOM API，以满足操作XML的所有需求，同时提供更好的错误处理及特性检测能力。

参考https://segmentfault.com/q/1010000000766310

## 事件流

Javascript中事件流描述的是从页面中接受事件的顺序。
DOM2级的事件规定了事件流包含三个阶段：

1. 事件捕获阶段
2. 处于目标阶段
3. 事件冒泡阶段

IE的事件流是冒泡，netscape的事件流是捕获，我们来看一下冒泡过程和捕获过程。

![冒泡和捕获](../images/javascript/eventflow.jpg)

具体冒泡和捕获的知识见[事件冒泡和事件捕获](http://blog.csdn.net/flyingpig2016/article/details/52964415)

这里也应注意到DOM事件流的概念，具体理解参考[理解DOM事件流](https://segmentfault.com/a/1190000004463384)

在触发DOM上的某个事件时，会产生一个事件对象Event，这个对象包含着所有与事件有关的信息，包括事件的元素，事件的类型以及其他与事件相关的信息。

参考https://www.cnblogs.com/libin-1/p/5767340.html
