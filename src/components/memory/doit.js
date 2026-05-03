export default function (iframeDocument) {
    let memoryEl = iframeDocument.getElementById("memory-container");

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

    // 格式化内存大小
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // 检查是否支持性能内存API
    function isMemoryAPIAvailable() {
        return performance && performance.memory;
    }

    // 获取内存使用信息
    function getMemoryInfo() {
        if (!isMemoryAPIAvailable()) {
            return null;
        }

        const memory = performance.memory;
        return {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
            percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100).toFixed(2)
        };
    }

    // 添加内存监控记录
    function addMemoryRecord(record) {
        // 隐藏空状态提示
        let blankEl = memoryEl.querySelector('.blank');
        if (blankEl) {
            blankEl.style.display = 'none';
        }

        let recordEl = document.createElement('div');
        recordEl.className = 'memory-item';
        recordEl.setAttribute('data-type', record.type.toLowerCase());

        let headerEl = document.createElement('div');
        headerEl.className = 'memory-item-header';
        recordEl.appendChild(headerEl);

        // 时间戳
        let timestampEl = document.createElement('span');
        timestampEl.className = 'memory-timestamp';
        timestampEl.textContent = getTimestamp();
        headerEl.appendChild(timestampEl);

        // 记录类型
        let typeEl = document.createElement('span');
        typeEl.className = 'memory-type';
        typeEl.setAttribute('data-type', record.type.toLowerCase());
        typeEl.textContent = record.type === 'usage' ? '内存使用' : 
                            record.type === 'performance' ? '性能指标' : '内存警告';
        headerEl.appendChild(typeEl);

        // 标题
        let titleEl = document.createElement('span');
        titleEl.className = 'memory-title-text';
        titleEl.textContent = record.title;
        headerEl.appendChild(titleEl);

        // 值
        let valueEl = document.createElement('span');
        valueEl.className = 'memory-value';
        valueEl.textContent = record.value;
        headerEl.appendChild(valueEl);

        // 展开/收起图标
        let toggleIcon = document.createElement('span');
        toggleIcon.className = 'toggle-icon';
        toggleIcon.textContent = '▶';
        headerEl.appendChild(toggleIcon);

        // 详细信息
        let detailsEl = document.createElement('div');
        detailsEl.className = 'memory-details';
        detailsEl.style.display = 'none';
        recordEl.appendChild(detailsEl);

        // 详细信息内容
        if (record.details) {
            let detailsSection = document.createElement('div');
            detailsSection.className = 'memory-section';
            detailsSection.innerHTML = '<h4>详细信息</h4><pre>' + JSON.stringify(record.details, null, 2) + '</pre>';
            detailsEl.appendChild(detailsSection);
        }

        memoryEl.appendChild(recordEl);
    }

    // 监控内存使用
    function monitorMemory() {
        if (!isMemoryAPIAvailable()) {
            // 如果不支持内存API，显示提示信息
            addMemoryRecord({
                type: 'alert',
                title: '浏览器不支持内存监控API',
                value: 'N/A',
                details: {
                    message: '当前浏览器不支持performance.memory API，无法获取内存使用信息。'
                }
            });
            return;
        }

        // 获取初始内存信息
        const initialMemory = getMemoryInfo();
        if (initialMemory) {
            addMemoryRecord({
                type: 'usage',
                title: '初始内存使用',
                value: formatBytes(initialMemory.usedJSHeapSize),
                details: {
                    usedJSHeapSize: formatBytes(initialMemory.usedJSHeapSize),
                    totalJSHeapSize: formatBytes(initialMemory.totalJSHeapSize),
                    jsHeapSizeLimit: formatBytes(initialMemory.jsHeapSizeLimit),
                    usagePercentage: initialMemory.percentage + '%'
                }
            });
        }

        // 设置定时器，每5秒检查一次内存使用
        setInterval(() => {
            const memoryInfo = getMemoryInfo();
            if (memoryInfo) {
                // 检查内存使用是否超过80%
                if (parseFloat(memoryInfo.percentage) > 80) {
                    addMemoryRecord({
                        type: 'alert',
                        title: '内存使用过高警告',
                        value: memoryInfo.percentage + '%',
                        details: {
                            usedJSHeapSize: formatBytes(memoryInfo.usedJSHeapSize),
                            totalJSHeapSize: formatBytes(memoryInfo.totalJSHeapSize),
                            jsHeapSizeLimit: formatBytes(memoryInfo.jsHeapSizeLimit),
                            usagePercentage: memoryInfo.percentage + '%',
                            warning: '内存使用已超过80%，建议优化代码或释放内存。'
                        }
                    });
                } else {
                    addMemoryRecord({
                        type: 'usage',
                        title: '内存使用正常',
                        value: formatBytes(memoryInfo.usedJSHeapSize),
                        details: {
                            usedJSHeapSize: formatBytes(memoryInfo.usedJSHeapSize),
                            totalJSHeapSize: formatBytes(memoryInfo.totalJSHeapSize),
                            jsHeapSizeLimit: formatBytes(memoryInfo.jsHeapSizeLimit),
                            usagePercentage: memoryInfo.percentage + '%'
                        }
                    });
                }
            }
        }, 5000); // 每5秒检查一次

        // 监听页面可见性变化，当页面重新可见时记录内存使用
        if (document.addEventListener) {
            document.addEventListener('visibilitychange', function() {
                if (!document.hidden) {
                    const memoryInfo = getMemoryInfo();
                    if (memoryInfo) {
                        addMemoryRecord({
                            type: 'performance',
                            title: '页面可见性变化',
                            value: formatBytes(memoryInfo.usedJSHeapSize),
                            details: {
                                usedJSHeapSize: formatBytes(memoryInfo.usedJSHeapSize),
                                totalJSHeapSize: formatBytes(memoryInfo.totalJSHeapSize),
                                jsHeapSizeLimit: formatBytes(memoryInfo.jsHeapSizeLimit),
                                usagePercentage: memoryInfo.percentage + '%',
                                event: '页面从不可见变为可见'
                            }
                        });
                    }
                }
            });
        }

        // 监听窗口大小变化，记录内存使用
        if (window.addEventListener) {
            window.addEventListener('resize', function() {
                const memoryInfo = getMemoryInfo();
                if (memoryInfo) {
                    addMemoryRecord({
                        type: 'performance',
                        title: '窗口大小变化',
                        value: formatBytes(memoryInfo.usedJSHeapSize),
                        details: {
                            usedJSHeapSize: formatBytes(memoryInfo.usedJSHeapSize),
                            totalJSHeapSize: formatBytes(memoryInfo.totalJSHeapSize),
                            jsHeapSizeLimit: formatBytes(memoryInfo.jsHeapSizeLimit),
                            usagePercentage: memoryInfo.percentage + '%',
                            event: '窗口大小发生变化',
                            windowSize: {
                                width: window.innerWidth,
                                height: window.innerHeight
                            }
                        }
                    });
                }
            });
        }

        // 监听垃圾回收事件（如果支持）
        if (window.gc && typeof window.gc === 'function') {
            // 记录手动垃圾回收
            const originalGC = window.gc;
            window.gc = function() {
                const beforeGC = getMemoryInfo();
                const result = originalGC.apply(this, arguments);
                const afterGC = getMemoryInfo();
                
                if (beforeGC && afterGC) {
                    const freedMemory = beforeGC.usedJSHeapSize - afterGC.usedJSHeapSize;
                    addMemoryRecord({
                        type: 'performance',
                        title: '垃圾回收完成',
                        value: formatBytes(freedMemory),
                        details: {
                            beforeGC: formatBytes(beforeGC.usedJSHeapSize),
                            afterGC: formatBytes(afterGC.usedJSHeapSize),
                            freedMemory: formatBytes(freedMemory),
                            usagePercentage: afterGC.percentage + '%',
                            event: '手动触发垃圾回收'
                        }
                    });
                }
                
                return result;
            };
        }
    }

    // 开始监控内存
    monitorMemory();
}