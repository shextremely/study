Promise是异步编程的一种解决方案，

## Promise发展

最开始我们写JavaScript异步程序时，使用callback方式实现，callback方式有其不好的地方，最主要的就是难以维护以及万恶的回调地狱。

我们以jquery的ajax为例讲述jquery的异步编程发展史。

jQuery1.5之前，采用传统的callback方式调用，代码如下：
```javascript
var ajax = $.ajax({
  url: 'data.json',
  success: function(){
    console.log('success')
  },
  error: function(){
    console.log('error')
  }
})
console.log(ajax) //返回一个XHR对象
```
在jQuery1.5之后，以上代码便有了链式的执行done和fail方法执行的方案
```javascript
var ajax = $.ajax('data.json');
ajax.done(function(){
  console.log('success 1');
}).fail(function(){
  console.log('fail')
}).done(function(){
  console.log('success 2')
})
console.log(ajax) //返回一个deferred对象
```
聪明的你也许已经发现这已经具有了Promise的雏形。

## Promise

首先我们来看Promise是什么，我们通过`console.dir(Promise)`看一下Promise

![Promise](../../images/promise/promise.png)

通过图我们可以看出，Promise本质上是一个构造函数，本身带有all,race,resolve,reject等方法，其原型上有then,catch等方法。所以我们通过new可以创建一个Promise对象。

其中resolve是Promise的状态由pending变为fullfilled，reject是Promise的状态有pending变为rejected。

具体知识见阮老师教程[Promise对象](http://es6.ruanyifeng.com/#docs/promise)

## JQuery的Promise

JQuery用$.Deferred实现Promise规范，$.Deferred()返回的是一个对象，打印来看

![Deferred](../../images/promise/deferred.png)

从图中我们可以看出上面挂着always,done,fail,then方法。

Deferred的基本用法如下：
```javascript
function runAsync(){
  var def = $.Deferred();
  var wait = function(def){
    setTimeout(function(){
      console.log('执行完成')
      def.resolve('数据')
    }, 2000)
    return def
  }
  return wait(def)
}
```
这里需要注意的有以下几点：
* jquery的Deferred对象本身带有resolve和reject方法，这里和Promise不同，可以直接用`def.resolve`调用；
* 这样有一个弊端，就是返回def对象，可以在外部调用`def.resolve`来修改def的状态了，这是有风险的。所以Deferred对象提供了promise方法，只需要在wait方法中返回`def.promise()`即可。这里的promise不同于Promise对象，只是一个方法名称，返回的是一个受限的Deferred对象，就是不能从外部访问resolve和reject方法等，推荐使用；
* done和fail方法就是分别指定完成和失败的语法糖而已；
* always方法是无论执行成功失败与否，都会执行的函数；

JQuery中还有一个$.when()方法来实现Promise规范，与ES6中的all方法功能一样，用来并行运行多个异步任务。

注意他并没有定义在Deferred对象中，并且他接收的不是数组，而是多个Deferred对象，用法如下：
```javascript
$.when(runAsync1(), runAsync2(), runAsync3())
  .then(function(data1, data2, data3){
    console.log('全部执行完成')
    console.log(data1, data2, data3)
  })
```
JQuery中并没有实现ES6的race方法

jquery的ajax返回的是一个受限的Promise对象，ajax的success,error,complete分别对应于done,fail,always，只是一些语法糖。

## Promise应用细节

Promise在实际项目中还是有很多运用的，这里我们简单做几个细节点的介绍

当Promise执行resolve传递的值时，会被后面的第一个then接收到，如果在then中有链式操作，前面步骤中的返回值会被后面的步骤接收到，这一点就可以进行参数的传递或者多个异步操作的串行运算，我们通过代码来看
```javascript
// readFile Promise封装
const fs = require('fs')
const path = require('path')
const readAasyncFile = function(filename){
  return new Promise((resolve, reject) => {
    fa.readFile(filename, (err, data) => {
      if(err){
        reject(err)
      }else {
        resolve(data.toString())
      }
    })
  })
}
```
```javascript
// 参数传递
const fullFileName = path.resolve(__dirname, './data/user.json')
const result = readAasyncFile(fullFileName)
result.then((data) => {
  console.log(data)
  // 这里会将data数据的name值当做下一个then的参数传递下去
  return JSON.parse(data).name
}).then(name =>{
  console.log(name)
})
```
```javascript
const fullFileName1 = path.resolve(__dirname, './data/user1.json')
const fullFileName2 = path.resolve(__dirname, './data/user2.json')
const result1 = readAasyncFile(fullFileName1)
const result2 = readAasyncFile(fullFileName2)

result1.then(data => {
  console.log('user1.json')
  console.log(data)
  return result2 //这里会将result2异步执行后才会将结果传递给下个参数
}).then(data => {
  console.log('user2.json')
  console.log(data)
})
```

## Promise的resolve()

Promise.resolve可以将thenable对象转换成Promise对象

所以jquery的Deferred对象可以转成Promise对象，示例如下
```javascript
const jqPromise = Promise.resolve($.ajax('./data/user.json'))
```

为了在项目中使用Promise，推荐使用一些完善的第三方库，不止为常见的Promise提供了快捷的封装，而且也可以很好地起到兼容的作用，这里如Q.js或者bluebird。
