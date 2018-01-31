GET和POST是HTTP协议中的两种发送请求的方法。

本质上说，GET和POST都是基于TCP链接，并无差别。但是由于HTTP的规定和浏览器/服务器的限制，导致他们在使用上有了区别。

主要的不同点体现在一下几个方面：

1. GET请求参数通过URL传递，POST请求放在Request Body中；
  > 注：技术上来说，在GET的请求体中加一些数据，在POST URL中添加参数也是可行的，但是不同的浏览器和服务器对他们处理的方式不同，例如有些服务器并不接受GET请求的REQUEST BODY内容，所以会存在问题
  *在使用上，因为GET会将参数放置在URL中，所以不适合传递敏感信息*
2. GET请求在URL传的参数有大小限制，而POST没有；
  > 大多数浏览器通常会限制url长度为2k个字节，大多数服务器最多处理64k大小的url
3. 对参数的数据类型，GET只接受ASCII字符，而POST无限制；
4. GET请求会被浏览器主动cache，而POST不会，需要手动设置；
5. GET在浏览器回退时是无害的，而POST会再次提交请求

最大的不同点在于：

GET产生一个TCP数据包，POST产生两个数据包。

对于GET请求，会将http header和body data一并发给服务器，服务器做出响应；

对于POST请求，浏览器先发送header，服务器响应100 continue，然后再发送data，服务器再做出响应。

虽然POST需要两步，时间上会消耗多一些，不过仍然不建议用GET取代POST，原因如下：
1. GET和POST有自己的语义
2. 在网络环境好的时候，发一次包与发两次包时间差别极小，可忽略不计；网速不好的时候，POST在验证数据的完整性上，也会有很多大的优势
3. 并不是所有的浏览器POST都会发两次包，火狐就只发送一次。

参考链接：
1. https://mp.weixin.qq.com/s?__biz=MzI3NzIzMzg3Mw==&amp;mid=100000054&amp;idx=1&amp;sn=71f6c214f3833d9ca20b9f7dcd9d33e4#rd