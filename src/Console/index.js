import { isString, isFunction, isNumber, isBoolean, toString } from '../tools/type.js'

export default function (_options, iframeDocument) {
    var consoleEl = iframeDocument.getElementById("console");
    var console = window.console;

    // 原生的打印方法 + 当前执行的代码在堆栈中的调用路径
    var log = console.log;
    var info = console.info;
    var debug = console.debug;
    var warn = console.warn;
    var error = console.error;
    var trace = console.trace;

    var colors = {
        log: "black",
        info: 'green',
        debug: 'blue',
        warn: 'f1c010',
        error: 'red',
        trace: 'pink'
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

    if (_options.log)
        console.log = function () {
            log.apply(this, arguments);
            appendConsole({
                type: "log",
                content: arguments
            });
        };

    if (_options.info)
        console.info = function () {
            info.apply(this, arguments);
            appendConsole({
                type: "info",
                content: arguments
            });
        };

    if (_options.debug)
        console.debug = function () {
            debug.apply(this, arguments);
            appendConsole({
                type: "debug",
                content: arguments
            });
        };

    if (_options.warn)
        console.warn = function () {
            warn.apply(this, arguments);
            appendConsole({
                type: "warn",
                content: arguments
            });
        };

    if (_options.error)
        console.error = function () {
            error.apply(this, arguments);
            appendConsole({
                type: "error",
                content: arguments
            });
        };

    if (_options.trace)
        console.trace = function () {
            trace.apply(this, arguments);
            appendConsole({
                type: "trace",
                content: arguments
            });
        };

    if (_options.error)
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