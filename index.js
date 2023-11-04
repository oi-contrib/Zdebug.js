/*!
* Zdebug.js
* git+https://github.com/fragement-contrib/Zdebug.js.git
*
* Copyright zxl20070701
* Released under the MIT license
* https://zxl20070701.github.io/notebook/home.html
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Zdebug = factory());
})(this, (function () {
    'use strict';

    var logo = "data:image/png;base64,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";

    var _toString = Object.prototype.toString;
    var getType = function (value) {
        if (value == null) {
            return value === undefined ? '[object Undefined]' : '[object Null]';
        }
        return _toString.call(value);
    };

    var isPlainObject = function (value) {
        if (value === null || typeof value !== 'object' || getType(value) != '[object Object]') {
            return false;
        }

        // 如果原型为null
        if (Object.getPrototypeOf(value) === null) {
            return true;
        }

        var proto = value;
        while (Object.getPrototypeOf(proto) !== null) {
            proto = Object.getPrototypeOf(proto);
        }
        return Object.getPrototypeOf(value) === proto;
    };

    var isString = function (value) {
        var type = typeof value;
        return type === 'string' || (type === 'object' && value != null && !Array.isArray(value) && getType(value) === '[object String]');
    };

    var isObject = function (value) {
        var type = typeof value;
        return value != null && (type === 'object' || type === 'function');
    };

    var isFunction = function (value) {
        if (!isObject(value)) {
            return false;
        }

        var type = getType(value);
        return type === '[object Function]' || type === '[object AsyncFunction]' ||
            type === '[object GeneratorFunction]' || type === '[object Proxy]';
    };

    var isNumber = function (value) {
        return typeof value === 'number' || (
            value !== null && typeof value === 'object' &&
            getType(value) === '[object Number]'
        );
    };

    var isBoolean = function (value) {
        return value === true || value === false ||
            (value !== null && typeof value === 'object' && getType(value) === '[object Boolean]');
    };

    var toString = function (val) {
        if (Array.isArray(val)) {
            var resultData = "[";
            for (var key in val) {
                resultData += val[key] + ',';
            }
            return resultData.replace(/\,$/, ']');
        }

        if (isPlainObject(val)) {
            var resultData = "{";
            for (var key in val) {
                resultData += key + ":" + val[key] + ",";
            }
            return resultData.replace(/\,$/, '}');
        }

        return val;
    };

    return function () {
        'use strict';

        var iframe = document.createElement("iframe");
        iframe.style.cssText =
            "display: block;" +
            "position: fixed;" +
            "z-index: 9999;" +
            "border: 0px;" +
            "border-top:0px solid rgba(0,0,0,0.5);" +
            "box-sizing: content-box;";
        document.documentElement.appendChild(iframe);

        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        // ifrmae中写入html模板
        iframeDocument.open();
        iframeDocument.write("<div id='btn'></div>" +
            "<div id='view'>" +
            "  <header style='text-align: center;line-height: 40px;font-weight: 800;background-color: #e6e6e6;'>" +
            "    调试工具" +
            "    <span id='close' style='position: absolute;right: 10px;top: 10px;font-size: 12px;background-color: #F44336;color: white;padding: 5px;border-radius: 5px;line-height: 1em;'>关闭</span>" +
            "  </header>" +
            "  <ul id='console'>" +
            "    <li class='blank'>" +
            "      无打印信息～" +
            "    </li>" +
            "  </ul>" +
            "<div>");
        iframeDocument.close();

        var styleEl = document.createElement("style");
        iframeDocument.documentElement.getElementsByTagName("head")[0].appendChild(styleEl);
        styleEl.innerText = "body{" +
            "  margin:0;" +
            "}" +
            "ul,li{" +
            "  -webkit-margin-before: 0;" +
            "  -webkit-margin-after: 0;" +
            "  -webkit-padding-start: 0;" +
            "  margin-block-end: 0;" +
            "  margin-block-start: 0;" +
            "  padding-inline-start: 0;" +
            "  padding: 0;" +
            "  margin: 0;" +
            "}" +
            "ul{" +
            "  height: calc(100vh - 40px);" +
            "  overflow: auto;" +
            "  font-size: 12px;" +
            "  font-weight: 200;" +
            "}" +
            "ul>li{" +
            "  border-bottom: 1px solid #e2e1e1;" +
            "  padding: 5px;" +
            "}" +
            "ul>li.blank:first-child:last-child {" +
            "  display: block;" +
            "}" +
            "ul>li.blank {" +
            "  display: none;" +
            "  border-bottom: none;" +
            "  text-align: center;" +
            "  padding-top: 100px;" +
            "  font-size: 26px;" +
            "  font-family: monospace;" +
            "  color: #9e9e9e;" +
            "  font-weight: 200;" +
            "}" +
            "ul>li [isopen] {" +
            "  position: relative;" +
            "}" +
            "ul>li [isopen]:before {" +
            "  content: '';" +
            "  display: inline-block;" +
            "  width: 0;" +
            "  height: 0;" +
            "  position: absolute;" +
            "  left: -15px;" +
            "  top: 4px;" +
            "}" +
            "ul>li [isopen='no']>div {" +
            "  display: none;" +
            "}" +
            "ul>li [isopen='no']:before {" +
            "  border-top: 5px solid transparent;" +
            "  border-bottom: 5px solid transparent;" +
            "  border-left: 10px solid #9e9e9e;" +
            "}" +
            "ul>li [isopen='yes']:before {" +
            "  border-left: 5px solid transparent;" +
            "  border-right: 5px solid transparent;" +
            "  border-top: 10px solid #9e9e9e;" +
            "}" +
            "ul>li [defType='showobject'] span {" +
            "  display: block;" +
            "  margin-top: 5px;" +
            "}" +
            "ul>li [defType='showobject'] .item {" +
            "  margin-left: 20px;" +
            "}" +
            "ul>li [defType='showobject'] i {" +
            "  font-style: normal;" +
            "  cursor: pointer;" +
            "}" +
            "ul>li .item {" +
            "  white-space: nowrap;" +
            "}" +
            "ul>li>.item {" +
            "  margin-left: 15px;" +
            "}";

        var btnEl = iframeDocument.getElementById("btn");
        var viewEl = iframeDocument.getElementById("view");
        var closeEl = iframeDocument.getElementById("close");
        var consoleEl = iframeDocument.getElementById("console");

        var fullStyle = "position:fixed;width:100vw;height:100vh;left:0;top:0;";
        btnEl.style = fullStyle +
            "background-image:url(" + logo + ");" +
            "background-size: 100% auto;" +
            "background-repeat: no-repeat;" +
            "background-position: center center;";
        viewEl.style = fullStyle +
            "background-color:white;";

        var toggleView = function (isView) {
            if (isView) {
                btnEl.style.display = "none";
                viewEl.style.display = "";

                iframe.style.right = '0';
                iframe.style.top = '0';
                iframe.style.width = '100vw';
                iframe.style.height = '100vh';

            } else {
                btnEl.style.display = "";
                viewEl.style.display = "none";

                iframe.style.right = '20px';
                iframe.style.top = '20px';
                iframe.style.width = '50px';
                iframe.style.height = '50px';
            }
        };
        toggleView(false);

        btnEl.addEventListener("click", function () {
            toggleView(true);
        });

        closeEl.addEventListener("click", function () {
            toggleView(false);
        });

        var console = window.console;

        // 原生的打印方法 + 当前执行的代码在堆栈中的调用路径
        var log = console.log;
        var info = console.info;
        var debug = console.debug;
        var warn = console.warn;
        var error = console.error;
        var trace = console.trace;

        var colors = {
            log: "gray",
            info: 'green',
            debug: 'blue',
            warn: 'f1c010',
            error: 'red',
            trace: 'white'
        };

        var showData = function (target, msg) {

            var doitShowData = function (target, obj) {
                if (target.getElementsByTagName('i')[0]) {
                    target.getElementsByTagName('i')[0].addEventListener("click", function () {

                        // 如果是字符串，就不需要展开了
                        if (isString(obj)) return;

                        // 如果没有加载过
                        if (target.getAttribute('hadload') != 'yes') {

                            target.setAttribute('hadload', 'yes');
                            target.setAttribute('isopen', 'yes');

                            var templateEl = document.createElement("div");
                            for (var key in obj) {
                                try {

                                    var spanEl = document.createElement("span");
                                    spanEl.setAttribute("isopen", "no");
                                    templateEl.appendChild(spanEl);

                                    var iEl = document.createElement("i");
                                    iEl.innerText = ":" + toString(obj[key]);
                                    spanEl.appendChild(iEl);

                                    var emEl = document.createElement("em");
                                    emEl.innerText = key;
                                    emEl.setAttribute("style", 'font-style:normal;color:#905');
                                    iEl.insertBefore(emEl, iEl.childNodes[0]);

                                } catch (e) {
                                    // todo
                                }
                            }
                            templateEl.setAttribute("class", "item");
                            target.appendChild(templateEl);

                            // 添加交互
                            var index = 0, lis = target.getElementsByTagName('span');
                            for (var key in obj) {
                                doitShowData(lis[index++], obj[key]);
                            }
                        }

                        // 如果加载过了，直接控制打开或者关闭即可
                        else {
                            if (target.getAttribute('isopen') == 'no') target.setAttribute('isopen', 'yes');
                            else target.setAttribute('isopen', 'no');
                        }

                    });
                }
            };

            // 如果是字符串、函数、数字等
            if (isString(msg) || isFunction(msg) || isNumber(msg) || isBoolean(msg)) {
                target.innerText = msg;
            }

            else if (msg === undefined) target.innerText = 'undefined';
            else if (msg === null) target.innerText = 'null';

            else {
                target.setAttribute('defType', 'showobject');
                target.setAttribute('class', 'item');

                // 默认作为对象显示
                target.setAttribute('hadload', 'no');
                target.setAttribute('isopen', 'no');
                target.innerHTML = "<i>" + toString(msg) + "</i>";
                doitShowData(target, msg);
            }

        };

        var appendConsole = function (item) {

            var liEl = document.createElement('li');
            consoleEl.appendChild(liEl);

            liEl.style.color = colors[item.type];

            var i, itemEl;
            for (i = 0; i < item.content.length; i++) {

                itemEl = document.createElement('div');
                liEl.appendChild(itemEl);

                showData(itemEl, item.content[i]);
            }
        };

        console.log = function () {
            log.apply(this, arguments);
            appendConsole({
                type: "log",
                content: arguments
            });
        };
        console.info = function () {
            info.apply(this, arguments);
            appendConsole({
                type: "info",
                content: arguments
            });
        };
        console.debug = function () {
            debug.apply(this, arguments);
            appendConsole({
                type: "debug",
                content: arguments
            });
        };
        console.warn = function () {
            warn.apply(this, arguments);
            appendConsole({
                type: "warn",
                content: arguments
            });
        };
        console.error = function () {
            error.apply(this, arguments);
            appendConsole({
                type: "error",
                content: arguments
            });
        };
        console.trace = function () {
            trace.apply(this, arguments);
            appendConsole({
                type: "trace",
                content: arguments
            });
        };

        if ('addEventListener' in window) {

            // 监听Promise相关错误
            window.addEventListener('unhandledrejection', function (event) {
                var content = event.reason.stack;
                appendConsole({
                    type: "error",
                    content: [content]
                });
            });

            // throw new error的捕获
            window.addEventListener('error', function (event) {
                var content = event.message + " " + event.filename + " " + event.lineno + " \nstack :\n" + (event.error ? event.error.stack : "");
                appendConsole({
                    type: "error",
                    content: [content]
                });
            });
        }

    };

}));

