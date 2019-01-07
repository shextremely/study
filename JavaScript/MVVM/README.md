### 什么是MVVM
MVVM是一种架构模式（模型－视图－视图模型，Model-View-ViewModal），这里对MVVM不再细说，网上介绍很多。

MVVM的核心是***数据驱动***，这里我们通过构建一个简单的MVVM实例来了解MVVM的数据绑定机制。

### 架构设计
![image](https://github.com/shextremely/study/blob/master/images/mvvm.jpg?raw=true)

这张图即表示了主要的数据通信机制，下面我们通过源代码来具体看这里的实现细节。

### 最终实现
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="test">
        <p>{{person.name}} {{person.age}}</p>
        <p>{{abc}}</p>
        <input type="text" m-model="person.name">
    </div>
    <script src="index.js"></script>
</body>
</html>

```
```javascript
import MVVM from  './mvvm';
var vm = new MVVM({
    $id: '#test',
    data () {
        return {
            abc: 123,
            person: {
                name: 'zs',
                age: 25
            }
        }
    }
})
// 这里暴露到window上面是为了在控制台更改vm数据值
window.vm = vm;
```
如上述代码书写，即实现数据与视图的绑定，这里只是实现了简单的插值表达式以及双向绑定功能，我们可以通过改变DOM中的值，来改变vm实例中的数据，也可以手动更改vm实例中的数据，同步更新DOM值。<br>
MVVM还有很多功能，其他功能后续待扩展。

### 环境搭建
因为项目采用es6代码书写，而谷歌浏览器目前也不支持es6的模块化（import和export），这里采用webpack，babel等转译es6代码到es5。

webpack的知识不作为这里的介绍重点。可通过clone
```shell
// 安装依赖
npm install

// 运行开发服务器
npx webpack-dev-server
```

### MVVM入口
![image](https://github.com/shextremely/study/blob/master/images/mvvm.jpg?raw=true)

如图，我们首先需实现MVVM类，这里我们先对传给MVVM的数据进行劫持，并实现监听。
这里需要注意的几点：
1. data可以为对象，也可以为函数，建议data项为函数;
> ps: 在vue组件中，data项必须为函数，保证了每一个组件对应的vue实例相互独立。
2. proxyData的作用是为了把vm.$data中的数据挂载到vm上，这样以后再获取值和设置值的时候便可以通过 this.abc 指向 this.$data.abc；
3. 监听对象(observe)，首先需要对keys设置监听，若data[key]为对象时，继续向下监听；
```javascript
// mvvm.js
// import Compile from  './compile';
// import { Dep } from './watch';

class MVVM {
    constructor (options) {
        this.$id = options.$id;
        if(!options.$id){
            console.log('请设置Controller的id')
            return;
        }
        this.$ele = options.$id;
        this.$data = typeof options.data === 'function' ? options.data() : options.data;

        if(this.$ele){
            // 定义响应式
            this.observe(this.$data);
            // DOM编译
            // new Compile(this.$ele, this);

            // 把data中的数据挂载到this上
            this.proxyData(this.$data);
        }
    }

    observe (data) {
        Object.keys(data).forEach((key) => {
            // 如果data[key]是对象
            if(typeof data[key] === 'object'){
                this.observe(data[key]);
            }
            this.defineReactive(data, key, data[key]);
        })
    }

    defineReactive (data, key, value) {
        let that = this;
        // let dep = new Dep();
        Object.defineProperty(data, key, {
            get () {
                // get时，把相应的watcher加到dep中
                // Dep.target && dep.addDep(Dep.target);
                return value;
            },
            set (newV) {
                if(value !== newV){
                    // 如果传入的是对象，再次监听
                    if(typeof newV === 'object'){
                        that.observe(newV);
                    }
                    value = newV;
                    // dep.notify();
                }
            }
        })
    }

    /**
     * 把vm.$data上的数据代理到this上
     * @param {object} data
     */
    proxyData (data) {
        Object.keys(data).forEach((key) => {
            Object.defineProperty(this, key, {
                get () {
                    return data[key];
                },
                set (newV) {
                    data[key] = newV;
                }
            })
        })
    }
}

export default MVVM


```

### Compile模板编译
![image](https://github.com/shextremely/study/blob/master/images/mvvm.jpg?raw=true)

如图我们实现指令编译器功能，这里直接上代码，具体注释在代码中；
```javascript
// util.js
/**
 * 提供渲染的静态方法
 */
class Util {
    constructor () {
    }
    /**
     * 根据表达式获取vm中的值
     * @param {object} vm vm实例
     * @param {string} expr 表达式 可能值：message 、 message.a.b.d等
     */
    static getVal (vm, expr) {
        let value = '';
        if(expr){
            value = expr.split('.').reduce((data, key) => {
                return data[key];
            }, vm.$data);
        }
        return value;
    }
    /**
     *
     * @param {object} vm vm实例
     * @param {string} expr 表达式 可能值：message 、 message.a.b.d等
     * @param {string} value 设置的新值
     */
    static setVal (vm, expr, value) {
        if(expr){
            let exprArr = expr.split('.');
            let i = 0; // flag, 标记取值是否到最后一位
            exprArr.reduce((data, key) => {
                i++;
                if(i === exprArr.length){
                    data[key] = value;
                }
                return data[key];
            }, vm.$data);
        }
    }
    /**
     * 根据mustache表达式获取vm中的值
     * @param {object} vm vm实例
     * @param {*} expr 表达式，可能只：{{message}} 、 {{message.a.b.d}} 、 {{a}} {{b}}
     */
    static getMustacheVal (vm, expr) {
        let that = this;
        let value = '';
        if(expr){
            let mustacheReg = new RegExp('\{\{([^}]+)\}\}', 'g');
            // 箭头函数this和arguments指向均不是当前函数所取
            // arguments指向箭头函数上级的arguments，在箭头函数中处理arguments时，通常使用REST赋值，即...arguments
            // 不过通过webpack babel转译后，js为严格模式(strict)，严格模式下不能使用arguments.callee和arguments.callee.caller，命名时不能出现保留字
            // 故这里有两种处理方法：
            // 1. 用ES5语法处理这种情况；
            // 2. 下载babel-plugin-transform-remove-strict-mode，在转译时去除严格模式。
            value = expr.replace(mustacheReg, function(){
                let args = [...arguments];
                return that.getVal(vm, args[1]);
            })
            // value = expr.replace(mustacheReg, (...arguments) => {
            //     return that.getVal(vm, arguments[1]);
            // })
        }
        return value
    }
}
export default Util;
```
```javascript
// compile.js
// import { Watcher } from "./watch";
import Util from  './util';

class Compile {
    constructor (ele, vm) {
        this.$ele = this.isElementNode(ele) ? ele : document.querySelector(ele);
        if(!ele){
            console.log('DOM节点不存在');
            return;
        }
        /** mustache语法正则 */
        this.mustacheReg = new RegExp('\{\{([^}]+)\}\}', 'g');
        /** 因为在fragment中操作性能比操作节点好，故首先需要把node节点转成fragment */
        var fragment = this.node2fragment(this.$ele);
        this.compile(fragment, vm);
        this.$ele.appendChild(fragment);
    }
    /**
     * 是否是元素节点
     */
    isElementNode (node) {
        return node.nodeType === 1;
    }
    /**
     * 判断属性是否是指令
     * @param {string} attr 属性名
     */
    isDirective (attr) {
        return attr.includes('m-');
    }
    /**
     * node节点转成fragment
     */
    node2fragment (ele) {
        let fragment = document.createDocumentFragment();
        let firstChild;
        while(firstChild = ele.firstChild){
            fragment.appendChild(firstChild);
        }
        return fragment;
    }
    /**
     * 编译
     * @param {Fragment} fragment
     * @param {object} vm vm实例
     */
    compile (fragment, vm) {
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach((node) => {
            if(this.isElementNode(node)){
                // 如果是元素节点，处理当前节点，并且继续向下编译
                this.compileNode(node, vm);
                this.compile(node, vm);
            }else{
                // 如果是文本节点，处理文本
                this.compileText(node, vm);
            }
        })
    }
    /**
     * 编译node节点
     * @param {node} node node节点
     * @param {object} vm vm实例
     */
    compileNode (node, vm) {
        let attrs = node.attributes;
        Array.from(attrs).forEach((attr) => {
            let name = attr.name;
            if(this.isDirective(name)){
                // 如果是指令，那么去获取相应的数据，对节点进行操作
                var expr = attr.value;
                CompileUtil[name.split('-')[1]] && CompileUtil[name.split('-')[1]].init(vm, node, expr);
            }
        })
    }
    /**
     * 编译文本节点
     * @param {node} node node节点
     * @param {object} vm vm实例
     */
    compileText (node, vm) {
        let content = node.textContent;
        if(this.mustacheReg.test(content)){
            // 存在mustache语法，编译文本节点
            CompileUtil['text'] && CompileUtil['text'].init(vm, node, content);
        }
    }
}
let CompileUtil = {
    text: {
        /**
         * 文本编译初始化
         * @param {object} vm vm实例
         * @param {node} node node节点
         * @param {*} expr 表达式
         */
        init (vm, node, expr) {
            let that = this;
            let mustacheReg = new RegExp('\{\{([^}]+)\}\}', 'g');
            this.updater(node, Util.getMustacheVal(vm, expr));
            // 当数据变化了，调用watch的回调更新节点值
            // expr.replace(mustacheReg, function(){
                // let args = [...arguments];
                // 定义一个watcher
                // new Watcher(vm, args[1], () => {
                    // 注意这里面不能使用newValue
                    // 因为对于expr来说，可能为 {{a}} {{b}}，此时返回的newValue只是其中一个的值
                   //  that.updater(node, Util.getMustacheVal(vm, expr));
                // })
            // })
        },
        updater (node, value) {
            node.textContent = value;
        }
    },
    model: {
        /**
         * m-model编译初始化
         * @param {object} vm vm实例
         * @param {node} node node节点
         * @param {*} expr 表达式
         */
        init (vm, node, expr) {
            this.updater(node, Util.getVal(vm, expr));
            // 当数据变化了，调用watch的回调更新节点值
            // new Watcher(vm, expr, (newValue) => {
                // this.updater(node, newValue);
            // })
            // 为node添加事件，当改变时，更改数据中的值
            node.addEventListener('input', (e) => {
                let val = e.target.value;
                Util.setVal(vm, expr, val);
            })
        },
        /**
         * 节点更新
         * @param node node节点
         * @param value 节点更新值
         */
        updater (node, value) {
            // 因为具有双向绑定的元素有input，textarea等元素，故可以用node.value
            node.value = value;
        }
    }
}
export default Compile

```
目前我们实现了插值表达式渲染以及双向绑定，当我们增加新的指令时，只需要在compUtil中增加对应的指令渲染函数即可，指令需要提供init方法。<br>
当执行到这里时，便完成了页面的一部分功能，程序会将new MVVM提供的data渲染到页面中，并且对于m-model绑定的元素，实现dom值改变时，改变相应的vm中数据（通过添加原生input事件）。

### Watcher观察者
![image](https://github.com/shextremely/study/blob/master/images/mvvm.jpg?raw=true)

接下来实现当数据变化时，同步更新DOM节点，我们需要考虑的有几点：
1. 当数据变化时，每一个元素应如何变化？
2. 当数据变化时，如何知道有哪些元素发生了变化？
3. 当数据变化时，如何通知所有元素同步变化？
首先上watcher代码
```javascript
// watcher.js
iimport Util from  './util';
// 观察订阅模式，用于存放所有的watcher；
// 每一个变量对应一个Dep实例，每次通过new Watcher时，在其内追加一个watcher，监听值变化
class Dep {
    constructor(){
        this.subs = [];
    }
    addDep (watcher) {
        if(!this.subs.includes(item => item === watcher)){
            // 依赖中不存在该项
            this.subs.push(watcher);
            return;
        }
        console.log('依赖中已存在该项')
    }
    removeDep (watcher) {
        this.subs.forEach((item, i) => {
            if(item === watcher){
                this.subs.splice(i, 1);
            }
        })
    }
    notify () {
        // 当数据变化时，触发该方法，循环存放于该数据对应的所有watcher，并执行每一个的update方法，进而更新对node节点进行的更新操作
        this.subs.forEach(item => {
            typeof item.update === 'function' && item.update()
        })
    }
}

// 给需要变化的元素增加一个观察者，当数据变化时，执行对应的方法
class Watcher {
    /**
     * 构造函数
     * @param {object} vm vm实例
     * @param {string} expr 表达式
     * @param {function} cb 回调
     */
    constructor (vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        // 先获取旧的值
        this.value = this.get();
    }
    /**
     * [get 获取旧的值]
     */
    get () {
      // 这里把当前的watcher赋给Dep.target，至于为什么要这么做，
      // 我们首先要明白，当执行到Util.getVal时，会取到对应的key的值，
      此时将调用defineReactive中的get方法;
      // 在defineReactive中，我们需要把当前的watcher添加到相应的发布者手里，
      // 此时当数据变化时，发布者去触发更新其对应的所有watcher变化；
      // 为了保证只有通过new Watcher方法将该watcher加入到发布者手里，
      // 需要在defineReactive的get方法中加入 Dep.target && dep.addDep(Dep.target);
      Dep.target = this;
      let value = Util.getVal(this.vm, this.expr);
      // 当把watcher加入到发布者手中后，Dep.target就不再起作用了，故需要把其置为null
      Dep.target = null;
      return value;
    }
    /**
     * [update watcher更新方法]
     */
    update () {
        let value = Util.getVal(this.vm, this.expr);
        let oldValue = this.value;
        if(value !== oldValue){
            this.value = value;
            typeof this.cb === 'function' && this.cb(value);
        }
    }
}

export {
    Dep,
    Watcher
}
```

我们先看第一个问题，考虑到不同的指令，对于不同的node节点，改变node的值并不相同，所以最好是在CompUtil中实现监听，告知其node节点如何变化。

```javascript
// compile.js
let CompileUtil = {
    text: {
        /**
         * 文本编译初始化
         * @param {object} vm vm实例
         * @param {node} node node节点
         * @param {*} expr 表达式
         */
        init (vm, node, expr) {
            let that = this;
            let mustacheReg = new RegExp('\{\{([^}]+)\}\}', 'g');
            this.updater(node, Util.getMustacheVal(vm, expr));
            // 当数据变化了，调用watch的回调更新节点值，因为存在 {{a}} {{b}}的情况，这里需要对每一个插值中的变量定义watcher
            expr.replace(mustacheReg, function(){
                let args = [...arguments];
                // 定义一个watcher
                new Watcher(vm, args[1], () => {
                    // 注意这里面不能使用newValue
                    // 因为对于expr来说，可能为 {{a}} {{b}}，此时返回的newValue只是其中一个的值，
                    // 我们需要拼接最终的所有值传给对应的节点
                    that.updater(node, Util.getMustacheVal(vm, expr));
                })
            })
        },
        updater (node, value) {
            node.textContent = value;
        }
    },
    model: {
        /**
         * m-model编译初始化
         * @param {object} vm vm实例
         * @param {node} node node节点
         * @param {*} expr 表达式
         */
        init (vm, node, expr) {
            this.updater(node, Util.getVal(vm, expr));
            // 当数据变化了，调用watch的回调更新节点值
            new Watcher(vm, expr, (newValue) => {
                this.updater(node, newValue);
            })
            // 为node添加事件，当改变时，更改数据中的值
            node.addEventListener('input', (e) => {
                let val = e.target.value;
                Util.setVal(vm, expr, val);
            })
        },
        /**
         * 节点更新
         * @param node node节点
         * @param value 节点更新值
         */
        updater (node, value) {
            // 因为具有双向绑定的元素有input，textarea等元素，故可以用node.value
            node.value = value;
        }
    }
}
```
接下来看第2个问题，当数据发生变化时，如何知道有哪些元素变化，这里在注释中已介绍很详细，即需要在defineReactive中get时，为该数据添加观察者watcher;
同样第3个问题也有介绍，需要在数据变化的时候，即defineReactive中set的时候，触发该数据对应的所有watcher变化
```javascript
// mvvm.js
import { Dep } from './watch';
// ...
class MVVM {
    // ...
    defineReactive (data, key, value) {
        let that = this;
        let dep = new Dep();
        Object.defineProperty(data, key, {
            get () {
                // get时，把相应的watcher加到dep中
                Dep.target && dep.addDep(Dep.target);
                return value;
            },
            set (newV) {
                if(value !== newV){
                    // 如果传入的是对象，再次监听
                    if(typeof newV === 'object'){
                        that.observe(newV);
                    }
                    value = newV;
                    // 触发所有watcher变化
                    dep.notify();
                }
            }
        })
    }
}
```
如此便实现了一个简单的MVVM小型框架，主要功能是对MVVM中数据的流向以及双向绑定问题做一个大概的了解。<br>
一个真正的框架（如vue），还有很多地方要处理，不过vue对数据这块的处理与本文本质是一致的，理解本文也便于对vue源码进行更深层次的研究。
