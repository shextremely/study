PageSpeed Tools是谷歌的网页速度监测工具，其有一个Chrome扩展，就是PageSpeed Insights，它可以分析页面载入的各个方面，包括资源、网络、DOM及时间线等信息的插件。

PageSpeedInsights下载链接：[PageSpeedInsights](https://chrome.google.com/webstore/detail/pagespeed-insights-with-p/lanlbpjbalfkflkhegagflkgcfklnbnh?hl=zh-CN)

安装完成之后，会在Chrome开发者工具上多一个PageSpeed项。PageSpeed的分析基于一个分为5类的最佳实践列表：
* 优化缓存，尽量的避免使用网络传输
* 减小请求大小，减少上传大小
* 减小有效负荷大小，减小响应、下载和缓存页面的大小
* 优化浏览器渲染，改善浏览器的页面布局

CSS和JS优化后的文件也可以下载以提供参考。

下面我们通过分析PageSpeedInsights的规则来看一下应怎样进行前端优化。

## 避免使用着陆页重定向

重定向会触发额外的HTTP请求-响应周期，并会拖慢网页的显示速度。

参考：[网站优化之尽量避免重定向](https://www.cnblogs.com/cdwp8/p/4074412.html)

## 启用压缩

所有的现代浏览器都支持gzip压缩并自动为所有的HTTP请求自动协商此类压缩，启用gzip压缩可以大幅缩减所传输的响应大小，从而显著缩短下载资源所用的时间，减小流量并加快呈现速度。

参考：[gzip压缩工作原理](./gzip压缩工作原理.md)

## 改善服务器响应时间

应该将服务器响应时间控制在200ms内，很多潜在的因素会延缓服务器响应，如缓慢的应用逻辑，缓慢的数据库查询，缓慢的路由、框架、库，资源CUP不足或内存不足等，考虑这些因素，改善服务器响应时间。

## 使用浏览器缓存

根据网络获取资源速度缓慢代价高昂，理论上所有的服务器响应都应该指定一种缓存策略。

参考：[HTTP缓存](../网络/HTTP缓存.md)

## 缩减资源（HTML、CSS、JavaScript）大小

缩减资源大小是指移除资源中的冗余数据（注释或者格式设置等）、移除未使用的代码、缩短变量和函数名称等等。例如对于JavaScript，其实就是将*.js缩减成*.min.js。

建议：
* HTML, 尝试使用HTMLMinifier
* CSS, cssnano或者csso
* JavaScript, UglifyJS

## 优化图片

在不影响视觉效果的情况下尽可能的优化图片，减小文件尺寸。

优化图片的方案：
[提供自适应图片](https://developers.google.cn/web/fundamentals/design-and-ux/responsive/images?hl=zh-cn)
[图片优化](https://developers.google.cn/web/fundamentals/performance/optimizing-content-efficiency/image-optimization?hl=zh-cn#image_optimization_checklist)

> 针对GIF，JPEG和PNG的图片可以直接从PageSpeedInsights下载经过优化后的图片

## 优化CSS发送

浏览器必须先处理当前网页的所有样式和布局信息，才会呈现内容。

参考：
[渲染树构建、布局和绘制](https://developers.google.cn/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=zh-cn)
[阻塞渲染的CSS](https://developers.google.cn/web/fundamentals/performance/critical-rendering-path/render-blocking-css?hl=zh-cn)

优化方案：
* 媒体查询
  通过媒体查询优化特定场合下的CSS文件加载；
* 内嵌较小的CSS文件
  就是说为了提高首屏加载的速度，把一些较小的关键的内嵌到HTML中，其他的可以通过JavaScript异步调用。
* 不要内嵌较大数据的URI，以勿导致首屏CSS变大，进而延缓网页呈现时间
* 不要内嵌CSS属性，主要是避免导致不必要的重复。

## 优先加载可见内容

如果所需要的数据量超过初始拥塞窗口的限制（通常为14.6kb压缩后大小），系统就需要在浏览器与服务器之间进行多次往返，如果用户的网络延迟过高，这个问题相当明显。

优化方案：
* 合理构建HTML，有限加载关键的首屏内容
  主要就是合理的区分页面上哪些内容需要优先加载，然后先加载某些内容，其他内容暂缓
* 减少资源所用的数据量
  压缩，min，优化图片等

## 异步或延迟加载Javascript

目的也是为了使其不阻塞页面的渲染。

参考：https://developers.google.cn/speed/docs/insights/rules?hl=zh-cn
