# Zdebug.js
移动端调试工具

<p>
    <a href="https://zxl20070701.github.io/toolbox/#/npm-download?packages=zdebug.js&interval=7">
        <img src="https://img.shields.io/npm/dm/zdebug.js.svg" alt="downloads">
    </a>
    <a href="https://www.npmjs.com/package/zdebug.js">
        <img src="https://img.shields.io/npm/v/zdebug.js.svg" alt="Version">
    </a>
    <a href="https://github.com/fragement-contrib/Zdebug.js" target='_blank'>
        <img alt="GitHub repo stars" src="https://img.shields.io/github/stars/fragement-contrib/Zdebug.js?style=social">
    </a>
</p>

## 如何使用？

首先需要进行安装：

```
npm install --save-dev zdebug.js
```

然后在项目中引入：

```js
import Zdebug from 'zdebug.js'
Zdebug()
```

当然，你也可以使用CDN的方式：

```html
<script src="https://unpkg.com/zdebug.js"></script>
```

然后，在代码开头启动：

```js
Zdebug()
```

### 配置项

> v0.2.0 新增

为了更好的和不同环境融合，你还可以通过下面的配置进行调整：

```js
Zdebug({

    // 可选，表示工具的css属性z-index，默认9999999
    zIndex: number,

    // 可选，设置是否捕获相关日志级别，默认全部true
    log: boolean,
    info: boolean,
    debug: boolean,
    warn: boolean,
    error: boolean,
    trace: boolean,
})
```

## 版权

MIT License

Copyright (c) [zxl20070701](https://zxl20070701.github.io/notebook/home.html) 走一步，再走一步
