import Util from  './util';
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
