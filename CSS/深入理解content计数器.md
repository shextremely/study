content的功能很强大，这里我们对使用content实现计数器效果做一个总结。

若想通过content实现计数器效果，需要了解CSS计数器的两个属性(counter-reset, counter-increment)和一个方法(counter()/counters())

我们通过几段代码来看计数器的使用：

## 实现基础计数器功能
```html
<!DOCTYPE html>
<html>
<head>
  <title></title>
</head>
<body>
  <section>
    <article>
      <style type="text/css">
        .counter1{
          /* 重置并命名计时器 */
          counter-reset: shui 2; 
        }
        .counter1:before,
        .counter1:after{
          display: block;
          /* 
           * 展示计数结果， counter(name, style)
           * 第二个参数与list-style-type值相同，可递增的不止是数字，
           * 也可为英文字母甚至是中文 
           */
          content: counter(shui);
          /* 计数递增，也可为负数，即递减 */
          counter-increment: shui 2;
        }
      </style>
      <p>=====基础用法=======</p>
      <div class="counter1"></div>
    </article>
  </section>
</body>
</html>
```

## 实现嵌套计数器功能
```html
<!DOCTYPE html>
<html>
<head>
  <title></title>
</head>
<body>
    <section>
      <style>
        .reset{
          padding-left: 20px;
          counter-reset: wangxiaoer;
        }
        .counter:before{
          /*
           *counters()方法主要是实现嵌套计数器的，如1-1,1-2
           */
          content: counters(wangxiaoer, '-')'. ';
          counter-increment: wangxiaoer;
        }
      </style>
      <p>=======嵌套计数器=======</p>
      <div class="reset">
        <div class="counter">我是王小二
          <div class="reset">
            <div class="counter">我是小二的大儿子</div>
            <div class="counter">我是小二的二儿子
              <div class="reset">
                <div class="counter">我是小二的二儿子的儿子</div>
              </div>
            </div>
            <div class="counter">我是小二的三儿子</div>
          </div>
        </div>
        <div class="counter">我是王小三</div>
        <div class="counter">我是王小四</div>
      </div>
    </section>
</body>
</html>
```

## 实现计算选中input的个数
```html
<!DOCTYPE html>
<html>
<head>
  <title></title>
</head>
<body>
    <section>
      <style media="screen">
        body{
          counter-reset: check;
        }
        .counter-check:after{
          content: counter(check);
        }
        input:checked{
          counter-increment: check;
        }
      </style>
      <p>======实现计算选中input的个数=======</p>
      <div class="check">
        <input type="checkbox" name="counterCheck" value="A">A
        <input type="checkbox" name="counterCheck" value="B">B
        <input type="checkbox" name="counterCheck" value="C">C
        <input type="checkbox" name="counterCheck" value="D">D
      </div>
      <div class="counter-check"></div>
    </section>
</body>
</html>
```

## 实现排列DOM顺序的功能
```html
<!DOCTYPE html>
<html>
<head>
  <title></title>
</head>
<body>
    <section>
      <style media="screen">
        .choose{
          display: none;
        }
        .c-reset .choose{
          display: block;
        }
        .c-reset{
          counter-reset: ccounter;
        }
        .c-counter:after{
          content: counter(ccounter);
          counter-increment: ccounter;
        }
      </style>
      <p>=========与JavaScript结合，实现计数器============</p>
      <div id="test" class="choose">
        第<span class="c-counter"></span>选择
      </div>
      <div class="c-reset">
      </div>
      <input type="button" name="" value="ADD" id="add">
      <input type="button" value="MINUS" id="minus">
      <script>
        document.getElementById('add').onclick = function() {
          var test = document.getElementById('test').cloneNode(true);
          document.getElementsByClassName('c-reset')[0].appendChild(test)
        };

        document.getElementById('minus').onclick = function (){
          var firstChildNode = document.getElementsByClassName('c-reset')[0].childNodes[0];
          document.getElementsByClassName('c-reset')[0].removeChild(firstChildNode);
        };
      </script>
    </section>
</body>
</html>
```

参考：CSS世界---张鑫旭