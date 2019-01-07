import Compile from  './compile';
import { Dep } from './watch';

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
            new Compile(this.$ele, this);

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
                    dep.notify();
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
