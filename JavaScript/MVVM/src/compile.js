import { Watcher } from "./watch";
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
    /** 辅助方法 */
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
    /** 核心方法 */
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
            expr.replace(mustacheReg, function(){
                let args = [...arguments];
                // 定义一个watcher
                new Watcher(vm, args[1], () => {
                    // 注意这里面不能使用newValue
                    // 因为对于expr来说，可能为 {{a}} {{b}}，此时返回的newValue只是其中一个的值
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
export default Compile
