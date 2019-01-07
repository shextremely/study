/**
 * 提供渲染静态方法
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