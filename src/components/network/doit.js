export default function (iframeDocument) {
    let networkEl = iframeDocument.getElementById("network-container");

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

    // 格式化文件大小
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // 获取状态码颜色
    function getStatusColor(status) {
        if (status >= 200 && status < 300) {
            return '#28a745'; // 绿色
        } else if (status >= 300 && status < 400) {
            return '#ffc107'; // 黄色
        } else if (status >= 400 && status < 500) {
            return '#fd7e14'; // 橙色
        } else if (status >= 500) {
            return '#dc3545'; // 红色
        } else {
            return '#6c757d'; // 灰色
        }
    }

    // 获取请求方法颜色
    function getMethodColor(method) {
        switch (method.toUpperCase()) {
            case 'GET':
                return '#007bff'; // 蓝色
            case 'POST':
                return '#28a745'; // 绿色
            case 'PUT':
                return '#ffc107'; // 黄色
            case 'DELETE':
                return '#dc3545'; // 红色
            case 'PATCH':
                return '#6f42c1'; // 紫色
            default:
                return '#6c757d'; // 灰色
        }
    }

    // 添加网络请求记录
    function addNetworkRecord(record) {
        // 隐藏空状态提示
        let blankEl = networkEl.querySelector('.blank');
        if (blankEl) {
            blankEl.style.display = 'none';
        }

        let recordEl = document.createElement('div');
        recordEl.className = 'network-item';
        recordEl.setAttribute('data-type', record.type.toLowerCase());
        recordEl.setAttribute('data-status', record.status);
        recordEl.setAttribute('data-method', record.method);

        let headerEl = document.createElement('div');
        headerEl.className = 'network-item-header';
        recordEl.appendChild(headerEl);

        // 时间戳
        let timestampEl = document.createElement('span');
        timestampEl.className = 'network-timestamp';
        timestampEl.textContent = getTimestamp();
        headerEl.appendChild(timestampEl);

        // 请求方法
        let methodEl = document.createElement('span');
        methodEl.className = 'network-method';
        methodEl.textContent = record.method;
        methodEl.style.color = getMethodColor(record.method);
        headerEl.appendChild(methodEl);

        // 状态码
        let statusEl = document.createElement('span');
        statusEl.className = 'network-status';
        statusEl.textContent = record.status;
        statusEl.style.color = getStatusColor(record.status);
        headerEl.appendChild(statusEl);

        // URL
        let urlEl = document.createElement('span');
        urlEl.className = 'network-url';
        urlEl.textContent = record.url;
        urlEl.title = record.url;
        headerEl.appendChild(urlEl);

        // 响应时间
        let durationEl = document.createElement('span');
        durationEl.className = 'network-duration';
        durationEl.textContent = record.duration + 'ms';
        headerEl.appendChild(durationEl);

        // 响应大小
        if (record.size) {
            let sizeEl = document.createElement('span');
            sizeEl.className = 'network-size';
            sizeEl.textContent = formatBytes(record.size);
            headerEl.appendChild(sizeEl);
        }

        // 展开/收起图标
        let toggleIcon = document.createElement('span');
        toggleIcon.className = 'toggle-icon';
        toggleIcon.textContent = '▶';
        headerEl.appendChild(toggleIcon);

        // 详细信息
        let detailsEl = document.createElement('div');
        detailsEl.className = 'request-details';
        detailsEl.style.display = 'none';
        recordEl.appendChild(detailsEl);

        // 请求头
        if (record.requestHeaders) {
            let requestHeadersEl = document.createElement('div');
            requestHeadersEl.className = 'request-section';
            requestHeadersEl.innerHTML = '<h4>请求头</h4><pre>' + JSON.stringify(record.requestHeaders, null, 2) + '</pre>';
            detailsEl.appendChild(requestHeadersEl);
        }

        // 响应头
        if (record.responseHeaders) {
            let responseHeadersEl = document.createElement('div');
            responseHeadersEl.className = 'request-section';
            responseHeadersEl.innerHTML = '<h4>响应头</h4><pre>' + JSON.stringify(record.responseHeaders, null, 2) + '</pre>';
            detailsEl.appendChild(responseHeadersEl);
        }

        // 请求体
        if (record.requestBody) {
            let requestBodyEl = document.createElement('div');
            requestBodyEl.className = 'request-section';
            requestBodyEl.innerHTML = '<h4>请求体</h4><pre>' + (typeof record.requestBody === 'string' ? record.requestBody : JSON.stringify(record.requestBody, null, 2)) + '</pre>';
            detailsEl.appendChild(requestBodyEl);
        }

        // 响应体
        if (record.responseBody) {
            let responseBodyEl = document.createElement('div');
            responseBodyEl.className = 'request-section';
            responseBodyEl.innerHTML = '<h4>响应体</h4><pre>' + (typeof record.responseBody === 'string' ? record.responseBody : JSON.stringify(record.responseBody, null, 2)).replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</pre>';
            detailsEl.appendChild(responseBodyEl);
        }

        networkEl.appendChild(recordEl);
    }

    // 拦截 XMLHttpRequest
    let originalXHR = window.XMLHttpRequest;
    let originalOpen = originalXHR.prototype.open;
    let originalSend = originalXHR.prototype.send;
    let originalSetRequestHeader = originalXHR.prototype.setRequestHeader;

    // 存储每个XHR实例的请求信息
    let xhrRequests = {};

    originalXHR.prototype.open = function (method, url, async, user, password) {
        let xhrId = this.zdebugId = Date.now() + Math.random();

        xhrRequests[xhrId] = {
            method: method,
            url: url,
            startTime: Date.now(),
            requestHeaders: {}
        };

        return originalOpen.apply(this, arguments);
    };

    originalXHR.prototype.setRequestHeader = function (header, value) {
        let xhrId = this.zdebugId;
        if (xhrId && xhrRequests[xhrId]) {
            xhrRequests[xhrId].requestHeaders[header] = value;
        }

        return originalSetRequestHeader.apply(this, arguments);
    };

    originalXHR.prototype.send = function (data) {
        let xhrId = this.zdebugId;
        let request = xhrRequests[xhrId];

        if (request) {
            request.requestBody = data;

            // 监听加载完成事件
            this.addEventListener('load', function () {
                let endTime = Date.now();
                let duration = endTime - request.startTime;

                let record = {
                    type: 'XHR',
                    method: request.method,
                    url: request.url,
                    status: this.status,
                    duration: duration,
                    size: this.responseText.length,
                    requestHeaders: request.requestHeaders,
                    requestBody: request.requestBody,
                    responseHeaders: this.getAllResponseHeaders() ? parseHeaders(this.getAllResponseHeaders()) : {},
                    responseBody: safeParseResponse(this.responseText, this.getResponseHeader('content-type'))
                };

                addNetworkRecord(record);
            });

            // 监听错误事件
            this.addEventListener('error', function () {
                let endTime = Date.now();
                let duration = endTime - request.startTime;

                let record = {
                    type: 'XHR',
                    method: request.method,
                    url: request.url,
                    status: 'Error',
                    duration: duration,
                    requestHeaders: request.requestHeaders,
                    requestBody: request.requestBody,
                    responseHeaders: {},
                    responseBody: '请求失败'
                };

                addNetworkRecord(record);
            });

            // 监听超时事件
            this.addEventListener('timeout', function () {
                let endTime = Date.now();
                let duration = endTime - request.startTime;

                let record = {
                    type: 'XHR',
                    method: request.method,
                    url: request.url,
                    status: 'Timeout',
                    duration: duration,
                    requestHeaders: request.requestHeaders,
                    requestBody: request.requestBody,
                    responseHeaders: {},
                    responseBody: '请求超时'
                };

                addNetworkRecord(record);
            });
        }

        return originalSend.apply(this, arguments);
    };

    // 拦截 Fetch API
    if (window.fetch) {
        let originalFetch = window.fetch;

        window.fetch = function (input, init) {
            let url = typeof input === 'string' ? input : input.url;
            let method = (init && init.method) || 'GET';
            let startTime = Date.now();

            // 获取请求头
            let requestHeaders = {};
            if (init && init.headers) {
                if (init.headers instanceof Headers) {
                    init.headers.forEach((value, key) => {
                        requestHeaders[key] = value;
                    });
                } else if (Array.isArray(init.headers)) {
                    init.headers.forEach(([key, value]) => {
                        requestHeaders[key] = value;
                    });
                } else {
                    Object.assign(requestHeaders, init.headers);
                }
            }

            // 获取请求体
            let requestBody = init && init.body || null;

            return originalFetch.apply(this, arguments)
                .then(function (response) {
                    let endTime = Date.now();
                    let duration = endTime - startTime;

                    // 克隆响应以便读取
                    let clonedResponse = response.clone();

                    // 读取响应体
                    let contentType = response.headers.get('content-type') || '';
                    let isJson = contentType.includes('application/json');
                    let isText = contentType.includes('text/') || contentType.includes('application/');

                    let responseBodyPromise;
                    if (isJson) {
                        responseBodyPromise = clonedResponse.json().catch(() => '无法解析JSON');
                    } else if (isText) {
                        responseBodyPromise = clonedResponse.text().catch(() => '无法解析文本');
                    } else {
                        responseBodyPromise = Promise.resolve('二进制数据');
                    }

                    return responseBodyPromise.then(function (responseBody) {
                        // 获取响应头
                        let responseHeaders = {};
                        response.headers.forEach((value, key) => {
                            responseHeaders[key] = value;
                        });

                        // 获取响应大小
                        let contentLength = response.headers.get('content-length');
                        let size = contentLength ? parseInt(contentLength, 10) : null;

                        let record = {
                            type: 'Fetch',
                            method: method,
                            url: url,
                            status: response.status,
                            duration: duration,
                            size: size,
                            requestHeaders: requestHeaders,
                            requestBody: requestBody,
                            responseHeaders: responseHeaders,
                            responseBody: responseBody
                        };

                        addNetworkRecord(record);

                        return response;
                    });
                })
                .catch(function (error) {
                    let endTime = Date.now();
                    let duration = endTime - startTime;

                    let record = {
                        type: 'Fetch',
                        method: method,
                        url: url,
                        status: 'Error',
                        duration: duration,
                        requestHeaders: requestHeaders,
                        requestBody: requestBody,
                        responseHeaders: {},
                        responseBody: error.message || '请求失败'
                    };

                    addNetworkRecord(record);

                    throw error;
                });
        };
    }

    // 辅助函数：解析响应头
    function parseHeaders(headerStr) {
        let headers = {};
        if (!headerStr) return headers;

        let headerPairs = headerStr.split('\u000d\u000a');
        for (let i = 0; i < headerPairs.length; i++) {
            let headerPair = headerPairs[i];
            let index = headerPair.indexOf('\u003a\u0020');
            if (index > 0) {
                let key = headerPair.substring(0, index);
                let val = headerPair.substring(index + 2);
                headers[key] = val;
            }
        }

        return headers;
    }

    // 安全解析响应体
    function safeParseResponse(responseText, contentType) {
        if (!responseText) return '';

        if (contentType) {
            if (contentType.includes('application/json')) {
                try {
                    return JSON.parse(responseText);
                } catch (e) {
                    return responseText;
                }
            } else if (contentType.includes('text/')) {
                return responseText;
            }
        }

        return responseText;
    }
}