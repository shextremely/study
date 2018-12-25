# 区别

  IE的script元素只支持onreadystatechange，不支持onload事件
  FF的script元素不支持onreadystatechange，只支持onload事件
  
  在IE中通过onreadystatechange注册事件后，this.readyState的值为'loaded'或者'complete'表示这个script已经加载完成。
  
# 兼容处理

  参考jQuery源码：
  
```javascript
  var script = document.createElement('script');
  script.src = 'xx.js';
  script.onload = onreadystatechange = function(){
    if(!this.readyState||this.readyState=="loaded"||this.readyState=="complete"){
      this.onload=this.onreadystatechange=null;
    }
  }
```
  当文件正在加载中时readyState为loading；当文件结束渲染但在加载内嵌资源时，返回interactive，并引发DOMContentLoaded事件；当文件加载完成时，返回complete，并引发load事件。