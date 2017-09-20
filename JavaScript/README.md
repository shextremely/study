# Javascript

本章节主要介绍JavaScript。下面我们以黄金圈法则（刚学到的新名词 :bowtie:）来谈一下她

## WHAT

    Q: 什么是JavaScript呢？

    A: JavaScript是一门`编程语言`。

    Q：这就完了？

    A：对啊，要不然？

    Q：不对呀，老师教我们要追求本质。

    A：那我重新说，JavaScript是一种轻量解释型的，或是JIT编译型的程序设计语言，有着头等函数的编程语言。这次懂了？

    Q：不懂。。。

    A：来我们进行下一课，看看她如何用。

## HOW

JavaScript一直在发展，额，其实我是个实用主义者，她的历史貌似与我没什么关系。<br>

JavaScript致力于`为网站添加交互功能`，在Web的世界里，JavaScript可以`跨平台`，`跨浏览器`的驱动网页且与用户进行交互。<br>

现在，随着她的发展，已经不限于只在浏览器环境中运行，例如nodejs，貌似还有一个Apache CouchDB（ :sweat: 这个不懂）。<br>

### 如何学习？

网上的教程有很多，这里我就简单推荐几个（反正是在拿别人的劳动成果:sunglasses:）<br>

* JavaScript高级程序设计  (Nicholas C.Zakas)

* JavaScript | MDN  (https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

* 廖雪峰JavaScript教程 (https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/)

大牛很多，我只当技术的搬运工 :joy: <br>

    ps: 个人觉得，JavaScript还是蛮容易上手的，只是精通的话蛮难，需要有大量的阅读。

## WHY

这里我们就需要考虑两个问题了，她能做什么？她有什么优缺点？

### JavaScript能做什么呢？

JavaScript是一种广泛应用于`客户端Web开发`的脚本语言，目前在项目中，最主要的用途还是`与网站页面进行交互`，包括`操作DOM`，`添加事件`，`与服务器数据交换`等一系列与网站相关的操作，在我们研究如何使用她时也会有更直观的感受。<br>

当然随着技术的发展，随着nodejs的流行，JavaScript已经不单单作为客户端开发的语言了，现在的JavaScript完全可以作为一种`服务器语言`开发应用，只是目前我还只是停留在用nodejs的层面，没有深入的挖掘过，所以这里不详述了，以后有机会补上。<br>

### 优缺点？

JavaScript是一种`基于原型的、多范式的`动态脚本语言。这里简单的介绍几个概念：<br>

* 脚本语言，通常以文本（如ASCII）保存，在调用的时候进行解释或编译; <br>

  这样的好处在于简化了开发、部署、测试和调试的周期，达到`快速开发`，`随时部署`，不需要耗时的编译打包，容易与已有的技术`集成`并且`易学易用`；

* 多范式其实就是支持面向对象、命令式和函数式编程风格；

* 原型，原型本质上就是一个对象。 <br>

  通过原型可以实现对象间的`继承`，对应于对象的私有属性[[prototype]]，与Java等基于类的语言还是有很大的区别的，虽然ES6中新增了Class表示类型，其实本质上的实现还是基于原型，`Class只是一个语法糖`。

#### JavaScript的优点

1、JavaScript可以减少网络传输<br>

JavaScript可以在客户端进行数据验证等操作，减少网络传输。<br>

2、JavaScript可以更容易的操作DOM，添加事件驱动等<br>

可以使用JavaScript“定制”页面更加友好，交互性更强的网站。<br>

3、JavaScript运行所有浏览器支持<br>

截止到2012年，所有的现代浏览器完整的支持EMCAScript5.1，在电脑，手机抑或是平板上浏览的所有网页，以及基于HTML5的手机APP，交互逻辑都是由JavaScript驱动。<br>

#### JavaScript局限性

1、各浏览器厂商对JavaScript支持程度不同<br>

2、JavaScript作为脚本语言，并不擅长对本地文件或者数据库的读写操作，不过在nodejs兴起后，这方面得到了极大的改善。<br>

=============

补充待续

