import { isString, isFunction, isNumber, isBoolean, toString } from '../../tools/type.js'

export default function (iframeDocument) {
    var consoleEl = iframeDocument.getElementById("console");
    var console = window.console;

    // 原生的打印方法 + 当前执行的代码在堆栈中的调用路径
    var log = console.log;
    var info = console.info;
    var debug = console.debug;
    var warn = console.warn;
    var error = console.error;
    var trace = console.trace;
    var table = console.table;
    var time = console.time;
    var timeEnd = console.timeEnd;
    var count = console.count;
    var assert = console.assert;

    // 日志类型图标
    var icons = {
        log: "📝",
        info: "ℹ️",
        debug: "🐛",
        warn: "⚠️",
        error: "❌",
        trace: "🔍",
        table: "📋",
        time: "⏱️",
        count: "🔢",
        assert: "✅"
    };

    // 日志类型样式类
    var typeClasses = {
        log: "log-type-log",
        info: "log-type-info",
        debug: "log-type-debug",
        warn: "log-type-warn",
        error: "log-type-error",
        trace: "log-type-trace",
        table: "log-type-table",
        time: "log-type-time",
        count: "log-type-count",
        assert: "log-type-assert"
    };

    // 计时器存储
    var timers = {};

    // 计数器存储
    var counters = {};

    // 获取时间戳
    function getTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString('zh-CN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }) + '.' + now.getMilliseconds().toString().padStart(3, '0');
    }

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
        // 隐藏空状态提示
        var blankLi = consoleEl.querySelector('.blank');
        if (blankLi) {
            blankLi.style.display = 'none';
        }

        var liEl = document.createElement('li');
        liEl.className = typeClasses[item.type];

        consoleEl.appendChild(liEl);

        // 添加时间戳
        var timestampEl = document.createElement('span');
        timestampEl.className = 'log-timestamp';
        timestampEl.textContent = getTimestamp();
        liEl.appendChild(timestampEl);

        // 添加图标
        var iconEl = document.createElement('span');
        iconEl.className = 'log-icon';
        iconEl.textContent = icons[item.type];
        liEl.appendChild(iconEl);

        // 添加日志内容
        if (item.type === 'table') {
            var tableContainer = document.createElement('div');
            tableContainer.className = 'table-container';
            tableContainer.innerHTML = generateTable(item.data);
            liEl.appendChild(tableContainer);
        } else {
            var i, itemEl;
            for (i = 0; i < item.content.length; i++) {
                itemEl = document.createElement('div');
                liEl.appendChild(itemEl);
                showData(itemEl, item.content[i]);
            }
        }
    };


    // 生成表格HTML
    var generateTable = function (data) {
        if (!Array.isArray(data) && typeof data !== 'object') {
            return '<div>无法将非对象或数组数据转换为表格</div>';
        }

        var table = document.createElement('table');
        table.className = 'console-table';

        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');

        if (Array.isArray(data)) {
            if (data.length === 0) {
                return '<div>空数组，无法生成表格</div>';
            }

            // 处理数组对象，提取所有可能的键
            var keys = [];
            data.forEach(function (item) {
                if (typeof item === 'object' && item !== null) {
                    Object.keys(item).forEach(function (key) {
                        if (keys.indexOf(key) === -1) {
                            keys.push(key);
                        }
                    });
                }
            });

            if (keys.length === 0) {
                // 如果是简单数组
                var tr = document.createElement('tr');
                var th = document.createElement('th');
                th.textContent = '(index)';
                tr.appendChild(th);
                th = document.createElement('th');
                th.textContent = 'Value';
                tr.appendChild(th);
                thead.appendChild(tr);

                data.forEach(function (item, index) {
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    td.textContent = index;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = toString(item);
                    tr.appendChild(td);
                    tbody.appendChild(tr);
                });
            } else {
                // 如果是对象数组
                var tr = document.createElement('tr');
                var th = document.createElement('th');
                th.textContent = '(index)';
                tr.appendChild(th);
                keys.forEach(function (key) {
                    th = document.createElement('th');
                    th.textContent = key;
                    tr.appendChild(th);
                });
                thead.appendChild(tr);

                data.forEach(function (item, index) {
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    td.textContent = index;
                    tr.appendChild(td);

                    keys.forEach(function (key) {
                        td = document.createElement('td');
                        td.textContent = item && typeof item === 'object' && item.hasOwnProperty(key) ? toString(item[key]) : '';
                        tr.appendChild(td);
                    });

                    tbody.appendChild(tr);
                });
            }
        } else {
            // 处理单个对象
            var tr = document.createElement('tr');
            var th = document.createElement('th');
            th.textContent = 'Key';
            tr.appendChild(th);
            th = document.createElement('th');
            th.textContent = 'Value';
            tr.appendChild(th);
            thead.appendChild(tr);

            Object.keys(data).forEach(function (key) {
                tr = document.createElement('tr');
                var td = document.createElement('td');
                td.textContent = key;
                tr.appendChild(td);
                td = document.createElement('td');
                td.textContent = toString(data[key]);
                tr.appendChild(td);
                tbody.appendChild(tr);
            });
        }

        table.appendChild(thead);
        table.appendChild(tbody);

        return table.outerHTML;
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


    console.table = function (data, columns) {
        if (table) table.apply(this, arguments);

        appendConsole({
            type: "table",
            data: data,
            columns: columns
        });
    };

    console.time = function (label) {
        if (time) time.apply(this, arguments);

        var timerLabel = label || 'default';
        timers[timerLabel] = performance.now();
    };

    console.timeEnd = function (label) {
        if (timeEnd) timeEnd.apply(this, arguments);

        var timerLabel = label || 'default';
        var startTime = timers[timerLabel];

        if (startTime !== undefined) {
            var duration = performance.now() - startTime;
            delete timers[timerLabel];

            appendConsole({
                type: "time",
                content: [timerLabel + ': ' + duration.toFixed(2) + 'ms']
            });
        } else {
            appendConsole({
                type: "warn",
                content: ['Warning: No such label \'' + timerLabel + '\'']
            });
        }
    };

    console.count = function (label) {
        if (count) count.apply(this, arguments);

        var countLabel = label || 'default';

        // 增加计数器
        if (counters[countLabel] === undefined) {
            counters[countLabel] = 1;
        } else {
            counters[countLabel]++;
        }

        appendConsole({
            type: "count",
            content: [countLabel + ': ' + counters[countLabel]]
        });
    };

    console.assert = function (condition) {
        if (assert) assert.apply(this, arguments);

        // 如果条件为假，则显示错误
        if (!condition) {
            var args = Array.prototype.slice.call(arguments, 1);
            var message = args.length > 0 ? args.join(' ') : 'Assertion failed';

            appendConsole({
                type: "assert",
                content: [message]
            });
        }
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