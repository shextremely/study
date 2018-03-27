本例主要涉及的是Proxy和Reflect的应用，Proxy可以理解为拦截，代理的意思。具体的使用说明可以见网上教程。

这里直接给出一个使用Proxy和Reflect实现的验证模块，其实现了验证功能的解耦，直接上代码：

```javascript
/**
 * [validator 验证函数]
 * @param  {[type]} target    [需要验证的目标]
 * @param  {[type]} validator [验证条件]
 * @return {[type]}           [description]
 */
function validator(target, validator){
  return new Proxy(target, {
    _validator: validator,
    set(target, key, value, proxy){
      // 判断目标中有没有key
      if(target.hasOwnProperty(key)){
        // 取出key对应的验证条件，为一函数
        let va = this._validator[key];
        if(!!va(value)){
          // 验证成功，则Reflect到对象上
          return Reflect.set(target, key, value, proxy);
        }else{
          throw Error(`不能设置${key}到${value}`);
        }
      }else{
        throw Error(`${key}不存在`);
      }
    }
  })
}

const personValidator = {
  name (val) {
    return typeof val === 'string';
  },
  age (val) {
    return typeof val === 'number' && val >= 18;
  }
}

class Person{
  constructor (name, age) {
    this.name = name;
    this.age = age;
    // tips 注意这里返回一个Proxy
    return validator(this, personValidator)
  }
}

const person = new Person('lili', 28);

console.log(person)

person.name = 123;
// Uncaught Error: 不能设置name到123
```

现在这里已经完全解耦验证逻辑，当有新的验证条件加入时，我们只需要在personValidator中添加对应的验证条件，然后在Person类中添加对应的属性即可。
