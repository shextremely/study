除了避免不必要的资源下载，优化和压缩文件可以减少HTTP请求响应的内容大小，也能极大的提高网页的加载速度。
当然也会增加一点点服务器的开销

## 为什么要使用GZIP压缩

使用合适的压缩算法进行压缩，主要目的就是减少HTTP传输过程中的数据大小。压缩就是使用更小的位对信息进行编码的过程。下面来举例说明压缩的核心原理，以短信发送信息为例，原示例文件如下：

> \# Below is a secret message, which consists of a set of headers in
> \# Below is a secret message, which consists of a set of headers in
> format: secret-cipher
> date:08/25/16
> AAAZZBBBBEEEMMM EEETTTAAA

我们在向客户端传送这些信息时，其实很多信息都是不需要的，如注释，如重复利用的标头，如重复性的文本内容。我们可以综合使用各种技术压缩其传送内容如下：

> format: secret-cipher
> date:08/25/16
> 3A2Z4B3E3M 3E3T3A

新短信相对于之前长度由200个字符变成56个字符，将信息压缩了72%，而且传送到客户端，有客户端再进行解析，我们就可以极大的提高网络传送的速度。我们在优化网页中使用的压缩算法其实和这些是类似的，通过预处理、环境特定优化以及为不同的内容采用不同的压缩算法等方式进行压缩优化。

毫无疑问，我们在这样处理的过程中，也会增加服务器的开销，所以这里也是要有斟酌的去打开关闭压缩功能。

## HTTP压缩过程

压缩过程一般是在服务器端进行展开，根据不同的资源类型（文本，图片，字体等），可以在服务器上启用适用于特定内容类型的预处理优化。

作为优化资产效率的第一步，需要建立一个不同内容类型的清单，根据不同的资源类型选择特定的压缩优化减小其大小。在项目开发中，在确=确定具体的优化后，将其加入到开发模式与发布模式的自动化流程来自动执行这些优化。

一般HTTP压缩的过程如下：

1. 浏览器发送HTTP request给Web服务器，request中具有Accept-Encoding: gzip, deflate。告诉服务器浏览器支持gzip压缩；
2. Web服务器接到request请求后，生成原始的Response；
3. Web服务器通过Gzip对Response，编码后会在response响应头中添加Content-Encoding: gzip，然后把response发给浏览器。
4. 浏览器收到Response后，根据Content-Encoding: gzip来对Response进行解码，获取原始的response后，渲染网页。

## Gzip和deflate
gzip和deflate都是压缩的编码规范，deflate表示的是实体使用zlib格式压缩的，除了这两种外，Content-Encoding还有其他的的值，如下：
* compress 表明实体采用Unix的文件压缩程序
* identity 表明没有对实体进行压缩，当没有Content-Ecoding值时，就默认这种情况。

gzip，compress和deflate都是无损压缩，其中最常用的就是gzip。
gzip和deflate的区别在于deflate重压缩效率，gzip重压缩质量，在高流量的服务器，deflate会比gzip加载速度快。

GZIP对于基于文本的资产压缩效果最好，CSS、JS和HTML，所有的现代浏览器都支持GZIP压缩，自动请求该压缩，在确保服务器已经正确配置gzip压缩后，返回我们想要的格式。在采用GZIP压缩时，可先压缩源码后（产生.min的文件），再使用GZIP压缩，可进一步提高压缩率。

参考：
* [优化基于文本的资产的编码和传送大小](https://developers.google.cn/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer?hl=zh-cn)
