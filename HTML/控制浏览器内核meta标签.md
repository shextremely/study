## 背景介绍
  
国内主流浏览器都是双核浏览器，例如360浏览器有极速模式和兼容模式，极速模式对应的就是webkit内核，兼容模式对应的是IE内核。基于IE的内核用于兼容网银、旧版网站等。

然后内核控制meta标签就应运而生了，就是在自己的网站中增加一个meta标签，告诉360浏览器这个网址应用于哪个内核进行渲染，并将这种行为应用到其所有的二级域名下的所有网址。

## 代码

```html
<!DOCTYPE html>
<html>
<head>
  <meta name="renderer" content="webkit|ie-comp|ie-stand">
</head>
<body>
</body>
</html>
```

content的取值为webkit、ie-comp和ie-stand，分别代表webkit内核，IE兼容内核，IE标准内核。
若页面需要极速内核，增加标签: <meta name="renderer" content="webkit">

这里的webkit对应于Chrome21，IE兼容对应于IE6/IE7，IE标准对应于IE9/IE10/IE11