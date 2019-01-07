### 概述
项目中选用Karma + mocha + chai作为测试框架搭建

### 依赖安装
1. 安装karma及其依赖
```
npm install karma --save-dev
// Karma 谷歌浏览器运行插件
npm install karma-chrome-launcher --save-dev
```
2. 安装mocha
```
npm install mocha karma-mocha --save-dev
```
3. 安装chai断言库
```
npm install chai karma-chai --save-dev
```
4. 安装代码覆盖率测试工具
```
npm instasll karma-coverage --save-dev
```

### Helloword

1. 执行```npx karma init```命令，生成karma默认配置文件；
2. 手动配置断言库chai的使用
```
frameworks: ['mocha', 'chai'],
```
3. 手动配置覆盖率测试工具配置
```
preprocessors: {
    'dev/js/**/*.js': ['coverage']
},
reporters: ['progress', 'coverage'],
coverageReporter: {
    type: 'html',
    dir: 'coverage/'
}
```
4. 启动测试```npx karma start```

此时便可搭建一个基础的测试框架环境。

### 示例代码
* DEMO1 求和
```
// 1. 首先写求和的测试用例
describe('sum function Test', function(){
    it('1 + 2 + 3 + 4 + 5', function(){
        var res = sum([1,2,3,4,5]);
        expect(res).to.equal(15);
    })
    // 错误示例
    it('1 - 1 + 3 - 4', function(){
        var res = sum([1, -1, 3, -4]);
        expect(res).to.equal(-2);
    })
})
// 2. 源码
const sum = arr => arr.reduce((s, a) => (s + a), 0)
```

* DEMO2 异步
```
// 1. 测试用例
describe('async function test', function(){
    it('asyncFun correctly to abc', function(done){
        (async function(){
            try {
                const res = await asyncFun();
                expect(res).to.equal('abc');
                done();
            } catch (error) {
                done(err);
            }
        })()
    })
    it('asyncFun correctly to abc', async function(){
        const res = await asyncFun();
        expect(res).to.equal('abc');
    })
})
// 2. 源码
function asyncFun () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('abc')
        }, 10)
    })
}
```
### ES6高级功能
首先考虑的是对babel转译后的代码进行测试，遇到了几个问题：
1. 定位问题不好定位；
2. 代码打包后为模块化后的代码，测试用例中难以取到需测试的方法；
3. 代码覆盖率测试转译后的代码，将没有意义。

> ES6高级功能体现在两个方面，一个是在测试代码中书写ES6代码，一个是在测试用例中书写ES6代码<br>

#### 安装依赖
```
npm install webpack karma-webpack --save-dev
```

#### 修改配置文件

```
// karma.config.js
{
    files: [
        // '~temp/js/**/*.js',
        // 这里因模块化的问题，需要在测试用例中手动引入相应的文件，这里可注释掉
        // 'dev/js/**/*.js', 
        'test/**/*.spec.js'
    ],
    preprocessors: {
        /* 需测试文件手动引入webpack模块 */
        'dev/js/**/*.js': [webpack'],
        /* 测试用例文件手动引入webpack模块 */
        'test/**/*.spec.js': ['webpack']
    },
    /* webpack配置 */
    webpack: {
      module: {
        rules: [{
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules | ~temp | build | dist/
        }]
      },
      mode: 'development'
    }
}
```

#### 示例代码

* DEMO1 求和
```
// 1. 首先写求和的测试用例
import sum from '../../dev/js/test/add'
describe('sum function Test', function(){
    it('1 + 2 + 3 + 4 + 5', function(){
        var res = sum([1,2,3,4,5]);
        expect(res).to.equal(15);
    })
    // 错误示例
    it('1 - 1 + 3 - 4', function(){
        var res = sum([1, -1, 3, -4]);
        expect(res).to.equal(-2);
    })
})
// 2. 源码
const sum = arr => arr.reduce((s, a) => (s + a), 0)
export default sum
```

* DEMO2 异步
```
// 1. 测试用例
describe('async function test', function(){
    it('asyncFun correctly to abc', function(done){
        (async function(){
            try {
                const res = await asyncFun();
                expect(res).to.equal('abc');
                done();
            } catch (error) {
                done(err);
            }
        })()
    })
    it('asyncFun correctly to abc', async function(){
        const res = await asyncFun();
        expect(res).to.equal('abc');
    })
})
// 2. 源码
function asyncFun () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('abc')
        }, 10)
    })
}
```

#### 代码覆盖率问题
> 在未经编译的代码，可以直接使用karma-coverage进行代码覆盖率的测试问题，但是项目中使用ES6代码书写后，该问题就变得极为棘手。

> 为了很好的区分单元测试和代码覆盖率的问题，这里我们起两个命令分别执行：

> ps: 注意这里使用了babel-istanbul插件，需要手动执行```npm install babel-plugin-istanbul --save-dev```安装
```
// package.json
"scripts": {
    "test:dev": "npx karma start karma.dev.config.js",
    "test:cover": "npx karma start karma.cover.config.js"
}
```
```javascript
// karma.base.config.js
var webpackConfig = {
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules | ~temp | build | dist/
        }]
    },
    mode: 'development'
}

module.exports = {
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
        // '~temp/js/**/*.js',
        // 'dev/js/**/*.js',
        'test/**/*.spec.js'
    ],
    preprocessors: {
        'dev/js/**/*.js': ['webpack'],
        'test/**/*.spec.js': ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
        noInfo: true
    },
    plugins: [
        'karma-mocha',
        'karma-mocha-reporter',
        'karma-chai',
        'karma-webpack'
    ],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
}
```
```javascript
// karma.dev.config.js
var base = require('./karma.base.config.js');

module.exports = function (config) {
    config.set(Object.assign(base, {
        reporters: ['progress'],
        browsers: ['Chrome'],
        plugins: base.plugins.concat([
            'karma-chrome-launcher'
        ])
    }))
}
```
```javascript
// karma.cover.config.js
var base = require('./karma.base.config.js')

module.exports = function (config) {
  var options = Object.assign(base, {
    browsers: ['Chrome'],
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      reporters: [
        { type: 'lcov', dir: './coverage', subdir: '.' },
        { type: 'text-summary', dir: './coverage', subdir: '.' }
      ]
    },
    singleRun: true,
    plugins: base.plugins.concat([
      'karma-coverage',
      'karma-chrome-launcher'
    ])
  })

  options.webpack.module.rules[0].options = {
    plugins: [['istanbul', {
      exclude: [
        'test/'
      ]
    }]]
  }

  config.set(options)
}

```

### 参考文档
1. http://karma-runner.github.io/3.0/intro/installation.html (karma官网)
2. https://github.com/muwoo/blogs/issues/33 (单测随笔)
3. https://www.npmjs.com/package/babel-plugin-istanbul  (babel-istanbul插件)