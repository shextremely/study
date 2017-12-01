当我们使用gulp或者grunt构建工具的时候，因为其增加了一层抽象，所以在有时候不免遇到一些问题，主要体现在过于依赖插件作者，调试起来也挺不方便。

我们在node开发中，离不开NPM的应用，而npm-scripts又是NPM中最强大，常用的功能之一。下面我们将对npm scripts进行简单的用法介绍。

## 什么是npm scripts

npm scripts的任务本质是可以重复执行的、命令行任务的快捷方式。

npm允许在package.json中定义scripts字段来定义脚本命令。
```json
{
  "script": {
    "build": "node build.js"
  }
}
```
如上例，scripts的每一个属性对应一段脚本，命令行中使用`npm run task`就可以执行改脚本，本例中需使用`npm run build`，等价于执行`node build.js`

查看本项目中的所有npm脚本命令，可以使用不带参数的`npm run`命令

## 原理

npm scripts原理很简单，就是在每次执行npm run命令时，都会新建一个shell，在这个shell中执行其所对应的脚本命令。因此只要是shell可运行的命令，就可以写在npm scripts中。

这里值得注意的是，`npm run`新建的这个shell，会将当前目录中的node_modules/.bin子目录下加入path变量，执行结束后，再将path变量恢复原样。也就是说，node_modules/.bin子目录下的所有脚本，都可以直接用脚本名直接调用，而不必加上路径。

例如当前目录下的依赖里面有Mocha，只要直接写`mocha test`就可以了，而不用写`./node_modules/.bin/mocha test`

## scripts语法

1、变量

npm scripts可以使用npm的内部变量。

首先，通过npm_package_前缀，能拿到package.json中的字段，比如下面：
```json
{
  "name": "foo",
  "version": "1.2.5",
  "script": {
    "view": "node view.js"
  }
}
```
那么在view.js中，可以通过上述取值方法得到package.json中的字段值
```javascript
// view.js
console.log(process.env.npm_package_name); //foo
console.log(process.env.npm_package_version); //1.2.5
```
这是在view.js文件中，若是在Bash脚本，可以使用$npm_package_name和$npm_package_version中取值，该种方式也支持嵌套方式，如下
```json
{
  "repository": {
    "type": "git",
    "url": "xxxx"
  },
  "scripts": {
    "view": "echo $npm_package_repository_type"
  }
}
```

然后，npm脚本还可以通过npm_config_前缀，拿到npm的配置变量，即npm config get xxx得到的值。比如当前模块的发行标签，则可以通过npm_config_tag取得。

这里需要注意package.json中的config对象，可以被环境变量覆盖。
```json
  "name": "foo",
  "config": {"port":8080},
  "scripts": {
    "start": "node server.js"
  }
```
上述例子中，npm_package_config_port取到的值为8080，这个值可以用下面的方法覆盖`npm config set foo:port 80`

最后，env变量可以列出所有的环境变量。

2、通配符

npm脚本就是shell脚本，因此可以使用通配符。* 表示任意的文件名，** 表示任意一层子目录。如果要将通配符传入原始命令，需要对 * 进行转译，即使用 \*。举例说明
```json
{
  "scripts": {
    "lint": "jshint *.js",
    "lint": "jshint **/*.js",
    "test": "tap test/\*.js"
  }
}
```

3、传参

向npm脚本传入参数，要使用--标明，看例子：
```json
{
  "scripts": {
    "lint": "jshint **.js",
    "lint:checkstyle": "npm run lint -- --reporter checkstyle > checkstyle.xml"
  }
}
```

4、执行顺序

npm脚本中需要执行多个任务时，就需要明确他们的执行顺序。有两个符号&和&&，&表示并行执行，&&表示继发执行（只有前一个任务完成，才会执行后一个任务），看例子：
```json
{
  "scripts": {
    "test": "npm run script1.js & npm run script2.js",
    "test": "npm run script1.js && npm run script2.js"
  }
}
```

5、钩子

npm有pre和post两个钩子，举例来说，build脚本命令的钩子就是prebuild和postbuild。
```json
{
  "scripts": {
    "prebuild": "echo I run before the build script",
    "build": "cross-env NODE_ENV=production webpack",
    "postbuild": "echo I run after this build script"
  }
}
```
当用户执行`npm run build`时，会按照以下命令执行`npm run prebuild && npm run build && npm run postbuild`，因此可以在这两个钩子里完成准备工作和清理工作，如下例子：
```json
{
  "scripts": {
    "clean": "rimraf ./dist && mkdir dist",
    "prebuild": "npm run clean",
    "build": "cross-env NODE_ENV=production webpack"
  }
}
```
npm默认会为publish,install,uninstall,version,test,stop,start,restart内置pre和post钩子，除此之外，还可以为自定义脚本命令街上这两个钩子

npm提供一个npm_lifecycle_event变量，返回正在运行的当前脚本名称，可以利用这一个变量，在同一个脚本文件中，为不同的npm scripts命令编写代码，如以下例子：
```javascript
const TARGET = process.env.npm_lifecycle_event;
if(TARGET === "test"){
  console.log('Running the test scripts!')
}
if(TARGET === "pretest"){
  console.log('Running the pretest scripts!')
}
```

## 常用命令

* 清空dist目录    `rimtaf dist/*`
* Compile scss to css   `node-sass --output-style compressed -o dist/css src/scss`
* 使用PostCSS自动给css加前缀    `postcss -u autoprefixer -r dist/css/*`
  这里需要注意的是postcss默认不做任何事情，这里需要安装postcss-cli和autoprefixer两个模块
* 代码检查    `eslint src/js`
* 混淆JS代码    `mkdir -p dist/js && uglifyjs src/js/*.js -m -o dist/js/app.js && uglifyjs src/js/*.js -m -c -o dist/js/app.min.js`
  -m标识(使用mangle命令) -c标识(使用compress命令), [uglifyjs全部配置项](https://github.com/mishoo/UglifyJS2#usage)
* 压缩图片    `imagemin src/images dist/images -p`
  -p 标识在允许的情况下将图片处理成渐变图片，这里需要安装imagemin-cli模块 [iamges-cli](https://github.com/imagemin/imagemin-cli#usage)

## 简写形式

四种常见的脚本简写形式
* npm start
* npm stop
* npm test
* npm restart 是 npm run stop && npm run restart && npm start的简写
