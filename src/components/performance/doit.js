export default function (iframeDocument) {
    let performanceEl = iframeDocument.getElementById("performance-container");

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

    // 获取文件扩展名
    function getFileExtension(url) {
        try {
            const pathname = new URL(url).pathname;
            const filename = pathname.split('/').pop();
            const extension = filename.split('.').pop().toLowerCase();
            return extension;
        } catch (e) {
            return 'unknown';
        }
    }

    // 获取文件类型描述
    function getFileTypeDescription(url, initiatorType) {
        const extension = getFileExtension(url);
        
        const typeMap = {
            'js': 'JavaScript',
            'css': '样式表',
            'html': 'HTML',
            'htm': 'HTML',
            'png': 'PNG图片',
            'jpg': 'JPEG图片',
            'jpeg': 'JPEG图片',
            'gif': 'GIF图片',
            'svg': 'SVG图片',
            'webp': 'WebP图片',
            'woff': '字体',
            'woff2': '字体',
            'ttf': '字体',
            'otf': '字体',
            'eot': '字体',
            'json': 'JSON数据',
            'xml': 'XML数据',
            'csv': 'CSV数据',
            'pdf': 'PDF文档',
            'mp4': 'MP4视频',
            'webm': 'WebM视频',
            'mp3': 'MP3音频',
            'wav': 'WAV音频',
            'ico': '图标'
        };
        
        if (typeMap[extension]) {
            return typeMap[extension];
        }
        
        if (initiatorType) {
            const initiatorMap = {
                'img': '图片',
                'link': '链接',
                'script': '脚本',
                'css': '样式',
                'fetch': 'API请求',
                'xmlhttprequest': 'XHR请求',
                'other': '其他'
            };
            return initiatorMap[initiatorType] || initiatorType;
        }
        
        return '未知类型';
    }

    // 获取性能类型颜色
    function getPerformanceTypeColor(type) {
        switch (type) {
            case 'navigation':
                return '#007bff'; // 蓝色
            case 'resource':
                return '#28a745'; // 绿色
            case 'paint':
                return '#fd7e14'; // 橙色
            case 'user-timing':
                return '#6f42c1'; // 紫色
            case 'js-execution':
                return '#dc3545'; // 红色
            default:
                return '#6c757d'; // 灰色
        }
    }

    // 提取文件名
    function extractFileName(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const filename = pathname.split('/').pop();
            return filename || url;
        } catch (e) {
            return url;
        }
    }

    // 添加性能记录
    function addPerformanceRecord(record) {
        // 隐藏空状态提示
        let blankEl = performanceEl.querySelector('.blank');
        if (blankEl) {
            blankEl.style.display = 'none';
        }

        let recordEl = document.createElement('div');
        recordEl.className = `performance-item performance-type-${record.type}`;
        recordEl.setAttribute('data-type', record.type);

        let headerEl = document.createElement('div');
        headerEl.className = 'performance-item-header';
        recordEl.appendChild(headerEl);

        // 时间戳
        let timestampEl = document.createElement('span');
        timestampEl.className = 'performance-timestamp';
        timestampEl.textContent = getTimestamp();
        headerEl.appendChild(timestampEl);

        // 性能类型
        let typeEl = document.createElement('span');
        typeEl.className = 'performance-type';
        typeEl.textContent = record.typeLabel;
        typeEl.style.color = getPerformanceTypeColor(record.type);
        headerEl.appendChild(typeEl);

        // 名称
        let nameEl = document.createElement('span');
        nameEl.className = 'performance-name';
        nameEl.textContent = record.name;
        nameEl.title = record.name;
        headerEl.appendChild(nameEl);

        // 持续时间
        let durationEl = document.createElement('span');
        durationEl.className = 'performance-duration';
        durationEl.textContent = record.duration + 'ms';
        headerEl.appendChild(durationEl);

        // 大小（如果有）
        if (record.size) {
            let sizeEl = document.createElement('span');
            sizeEl.className = 'performance-size';
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
        detailsEl.className = 'performance-details';
        detailsEl.style.display = 'none';
        recordEl.appendChild(detailsEl);

        // 详细信息内容
        if (record.details) {
            let detailsSectionEl = document.createElement('div');
            detailsSectionEl.className = 'performance-section';
            detailsSectionEl.innerHTML = '<h4>详细信息</h4><pre>' + JSON.stringify(record.details, null, 2) + '</pre>';
            detailsEl.appendChild(detailsSectionEl);
        }

        performanceEl.appendChild(recordEl);
    }

    // 收集导航性能数据
    function collectNavigationTiming() {
        if (!window.performance || !window.performance.timing) return;

        const timing = window.performance.timing;
        const navigation = window.performance.navigation;

        // 计算各个阶段的时间
        const dnsLookup = timing.domainLookupEnd - timing.domainLookupStart;
        const tcpConnect = timing.connectEnd - timing.connectStart;
        const request = timing.responseStart - timing.requestStart;
        const response = timing.responseEnd - timing.responseStart;
        const domProcessing = timing.domComplete - timing.domLoading;
        const loadEvent = timing.loadEventEnd - timing.loadEventStart;

        // 首屏渲染时间
        const firstPaint = window.performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint');
        const firstContentfulPaint = window.performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint');
        
        // 获取所有资源数量统计
        const allResources = window.performance.getEntriesByType('resource');
        const resourceStats = {
            total: allResources.length,
            js: allResources.filter(r => getFileExtension(r.name) === 'js').length,
            css: allResources.filter(r => getFileExtension(r.name) === 'css').length,
            img: allResources.filter(r => ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(getFileExtension(r.name))).length,
            font: allResources.filter(r => ['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(getFileExtension(r.name))).length,
            other: allResources.filter(r => !['js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'woff', 'woff2', 'ttf', 'otf', 'eot'].includes(getFileExtension(r.name))).length
        };

        // 计算总资源大小
        const totalResourceSize = allResources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0);

        const navigationRecord = {
            type: 'navigation',
            typeLabel: '导航',
            name: '页面加载',
            duration: timing.loadEventEnd - timing.navigationStart,
            details: {
                'DNS查找': dnsLookup + 'ms',
                'TCP连接': tcpConnect + 'ms',
                '请求时间': request + 'ms',
                '响应时间': response + 'ms',
                'DOM处理': domProcessing + 'ms',
                '加载事件': loadEvent + 'ms',
                '重定向次数': navigation.redirectCount,
                '导航类型': navigation.type === 0 ? '导航' : navigation.type === 1 ? '重载' : navigation.type === 2 ? '返回' : '其他',
                '首屏渲染': firstPaint ? firstPaint.startTime.toFixed(2) + 'ms' : 'N/A',
                '首内容渲染': firstContentfulPaint ? firstContentfulPaint.startTime.toFixed(2) + 'ms' : 'N/A',
                '资源统计': resourceStats,
                '资源总大小': formatBytes(totalResourceSize),
                '资源加载详情': allResources.map(resource => ({
                    '文件名': extractFileName(resource.name),
                    '文件类型': getFileTypeDescription(resource.name, resource.initiatorType),
                    '加载时间': Math.round(resource.duration) + 'ms',
                    '大小': formatBytes(resource.transferSize || 0),
                    'URL': resource.name
                }))
            }
        };

        addPerformanceRecord(navigationRecord);
    }

    // 收集资源性能数据
    function collectResourceTiming() {
        if (!window.performance || !window.performance.getEntriesByType) return;

        const resources = window.performance.getEntriesByType('resource');
        
        resources.forEach(resource => {
            const fileName = extractFileName(resource.name);
            const fileType = getFileTypeDescription(resource.name, resource.initiatorType);
            
            const resourceRecord = {
                type: 'resource',
                typeLabel: '资源',
                name: fileName,
                duration: Math.round(resource.duration),
                size: resource.transferSize || 0,
                details: {
                    '文件类型': fileType,
                    '完整URL': resource.name,
                    'DNS查找': Math.round(resource.domainLookupEnd - resource.domainLookupStart) + 'ms',
                    'TCP连接': Math.round(resource.connectEnd - resource.connectStart) + 'ms',
                    '请求时间': Math.round(resource.responseStart - resource.requestStart) + 'ms',
                    '响应时间': Math.round(resource.responseEnd - resource.responseStart) + 'ms',
                    '传输大小': formatBytes(resource.transferSize || 0),
                    '编码大小': formatBytes(resource.encodedBodySize || 0),
                    '解码大小': formatBytes(resource.decodedBodySize || 0),
                    '缓存状态': resource.transferSize === 0 ? '已缓存' : '网络请求',
                    '协议': resource.nextHopProtocol || '未知',
                    '发起者': resource.initiatorType
                }
            };

            addPerformanceRecord(resourceRecord);
        });
    }

    // 收集绘制性能数据
    function collectPaintTiming() {
        if (!window.performance || !window.performance.getEntriesByType) return;

        const paints = window.performance.getEntriesByType('paint');
        
        paints.forEach(paint => {
            const paintRecord = {
                type: 'paint',
                typeLabel: '绘制',
                name: paint.name === 'first-paint' ? '首屏渲染' : '首内容渲染',
                duration: Math.round(paint.startTime),
                details: {
                    '渲染类型': paint.name === 'first-paint' ? '首屏渲染' : '首内容渲染',
                    '开始时间': paint.startTime.toFixed(2) + 'ms',
                    '条目类型': paint.entryType
                }
            };

            addPerformanceRecord(paintRecord);
        });
    }

    // 收集用户计时性能数据
    function collectUserTiming() {
        if (!window.performance || !window.performance.getEntriesByType) return;

        const userTimings = window.performance.getEntriesByType('measure');
        
        userTimings.forEach(timing => {
            const userTimingRecord = {
                type: 'user-timing',
                typeLabel: '用户计时',
                name: timing.name,
                duration: Math.round(timing.duration),
                details: {
                    '开始时间': timing.startTime.toFixed(2) + 'ms',
                    '持续时间': timing.duration.toFixed(2) + 'ms',
                    '条目类型': timing.entryType
                }
            };

            addPerformanceRecord(userTimingRecord);
        });
    }

    // 监控JS执行性能
    function monitorJSErrors() {
        // 监听未处理的错误
        window.addEventListener('error', function(event) {
            const errorRecord = {
                type: 'js-execution',
                typeLabel: 'JS错误',
                name: event.filename.split('/').pop() + ':' + event.lineno,
                duration: 0,
                details: {
                    '错误类型': '运行时错误',
                    '错误消息': event.message,
                    '文件名': event.filename,
                    '行号': event.lineno,
                    '列号': event.colno,
                    '错误对象': event.error ? event.error.stack : 'N/A'
                }
            };

            addPerformanceRecord(errorRecord);
        });

        // 监听未处理的Promise拒绝
        window.addEventListener('unhandledrejection', function(event) {
            const errorRecord = {
                type: 'js-execution',
                typeLabel: 'JS错误',
                name: '未处理的Promise拒绝',
                duration: 0,
                details: {
                    '错误类型': 'Promise拒绝',
                    '错误消息': event.reason ? event.reason.toString() : 'N/A',
                    '原因': event.reason
                }
            };

            addPerformanceRecord(errorRecord);
        });
    }

    // 监控长时间运行的JS
    function monitorLongTasks() {
        if (!window.PerformanceObserver) return;

        try {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 50) { // 超过50ms的任务被认为是长任务
                        const longTaskRecord = {
                            type: 'js-execution',
                            typeLabel: 'JS执行',
                            name: '长任务',
                            duration: Math.round(entry.duration),
                            details: {
                                '开始时间': entry.startTime.toFixed(2) + 'ms',
                                '持续时间': entry.duration.toFixed(2) + 'ms',
                                '条目类型': entry.entryType,
                                '归因': entry.attribution ? entry.attribution.map(a => ({
                                    '容器类型': a.containerType,
                                    '容器名称': a.containerName,
                                    '容器ID': a.containerId,
                                    '处理时间': a.duration + 'ms'
                                })) : []
                            }
                        };

                        addPerformanceRecord(longTaskRecord);
                    }
                });
            });

            observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            console.warn('无法监控长任务:', e);
        }
    }

    // 收集所有性能数据
    function collectAllPerformanceData() {
        collectNavigationTiming();
        collectResourceTiming();
        collectPaintTiming();
        collectUserTiming();
    }

    // 页面加载完成后收集性能数据
    if (document.readyState === 'complete') {
        collectAllPerformanceData();
    } else {
        window.addEventListener('load', function() {
            // 延迟一点执行，确保所有资源都加载完成
            setTimeout(collectAllPerformanceData, 1000);
        });
    }

    // 监控JS错误
    monitorJSErrors();

    // 监控长任务
    monitorLongTasks();

    // 监听新的性能条目
    if (window.PerformanceObserver) {
        try {
            // 监听新的资源加载
            const resourceObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'resource') {
                        const fileName = extractFileName(entry.name);
                        const fileType = getFileTypeDescription(entry.name, entry.initiatorType);
                        
                        const resourceRecord = {
                            type: 'resource',
                            typeLabel: '资源',
                            name: fileName,
                            duration: Math.round(entry.duration),
                            size: entry.transferSize || 0,
                            details: {
                                '文件类型': fileType,
                                '完整URL': entry.name,
                                'DNS查找': Math.round(entry.domainLookupEnd - entry.domainLookupStart) + 'ms',
                                'TCP连接': Math.round(entry.connectEnd - entry.connectStart) + 'ms',
                                '请求时间': Math.round(entry.responseStart - entry.requestStart) + 'ms',
                                '响应时间': Math.round(entry.responseEnd - entry.responseStart) + 'ms',
                                '传输大小': formatBytes(entry.transferSize || 0),
                                '编码大小': formatBytes(entry.encodedBodySize || 0),
                                '解码大小': formatBytes(entry.decodedBodySize || 0),
                                '缓存状态': entry.transferSize === 0 ? '已缓存' : '网络请求',
                                '协议': entry.nextHopProtocol || '未知',
                                '发起者': entry.initiatorType
                            }
                        };

                        addPerformanceRecord(resourceRecord);
                    } else if (entry.entryType === 'paint') {
                        const paintRecord = {
                            type: 'paint',
                            typeLabel: '绘制',
                            name: entry.name === 'first-paint' ? '首屏渲染' : '首内容渲染',
                            duration: Math.round(entry.startTime),
                            details: {
                                '渲染类型': entry.name === 'first-paint' ? '首屏渲染' : '首内容渲染',
                                '开始时间': entry.startTime.toFixed(2) + 'ms',
                                '条目类型': entry.entryType
                            }
                        };

                        addPerformanceRecord(paintRecord);
                    } else if (entry.entryType === 'measure') {
                        const userTimingRecord = {
                            type: 'user-timing',
                            typeLabel: '用户计时',
                            name: entry.name,
                            duration: Math.round(entry.duration),
                            details: {
                                '开始时间': entry.startTime.toFixed(2) + 'ms',
                                '持续时间': entry.duration.toFixed(2) + 'ms',
                                '条目类型': entry.entryType
                            }
                        };

                        addPerformanceRecord(userTimingRecord);
                    }
                });
            });

            resourceObserver.observe({ entryTypes: ['resource', 'paint', 'measure'] });
        } catch (e) {
            console.warn('无法监听性能条目:', e);
        }
    }
}