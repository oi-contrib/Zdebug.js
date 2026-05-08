import { defineElement } from "zipaper";
import template from "./index.html";
import style from "./index.scss";
import loadStyle from "../../tools/loadStyle";
import doit from "./doit";

export default defineElement({
    template,
    methods: {
        // 清空控制台
        clearConsole() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const consoleEl = iframeDoc.getElementById("console");
            if (consoleEl) {
                const blankLi = consoleEl.querySelector('.blank');
                const allLis = consoleEl.querySelectorAll('li:not(.blank)');
                allLis.forEach(li => li.remove());
                
                // 如果没有内容了，显示空状态
                if (consoleEl.children.length === 1) {
                    blankLi.style.display = 'flex';
                }
            }
        },
        
        // 删除选中的日志类型
        deleteSelectedLogTypes() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const consoleEl = iframeDoc.getElementById("console");
            if (!consoleEl) return;
            
            const checkboxes = iframeDoc.querySelectorAll('#console-filter-bar input[type="checkbox"]');
            const selectedTypes = [];
            
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedTypes.push(checkbox.value);
                }
            });
            
            if (selectedTypes.length === 0) {
                alert('请选择要删除的日志类型');
                return;
            }
            
            const allLis = consoleEl.querySelectorAll('li:not(.blank)');
            let deletedCount = 0;
            
            allLis.forEach(li => {
                const logType = Array.from(li.classList).find(cls => cls.startsWith('log-type-'));
                if (logType) {
                    const type = logType.replace('log-type-', '');
                    if (selectedTypes.includes(type)) {
                        li.remove();
                        deletedCount++;
                    }
                }
            });
            
            // 更新空状态显示
            const blankLi = consoleEl.querySelector('.blank');
            if (consoleEl.children.length === 1) {
                blankLi.style.display = 'flex';
            }
            
            console.log(`已删除 ${deletedCount} 条日志（类型: ${selectedTypes.join(', ')}）`);
        },
        
        // 切换过滤栏显示
        toggleFilterBar() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const filterBar = iframeDoc.getElementById("console-filter-bar");
            if (filterBar) {
                filterBar.style.display = filterBar.style.display === 'none' ? 'flex' : 'none';
            }
        },
        
        // 应用日志过滤
        applyLogFilter() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const consoleEl = iframeDoc.getElementById("console");
            if (!consoleEl) return;
            
            const checkboxes = iframeDoc.querySelectorAll('#console-filter-bar input[type="checkbox"]');
            const enabledTypes = [];
            
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    enabledTypes.push(checkbox.value);
                }
            });
            
            const allLis = consoleEl.querySelectorAll('li:not(.blank)');
            allLis.forEach(li => {
                const logType = Array.from(li.classList).find(cls => cls.startsWith('log-type-'));
                if (logType) {
                    const type = logType.replace('log-type-', '');
                    li.style.display = enabledTypes.includes(type) ? 'block' : 'none';
                }
            });
        },
        
        // 执行代码
        executeCode() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const codeInput = iframeDoc.getElementById("code-input");
            if (!codeInput) return;
            
            const code = codeInput.value.trim();
            if (!code) return;
            
            try {
                // 记录执行时间
                const startTime = performance.now();
                
                // 执行代码
                const result = window.eval(code);
                
                // 记录执行完成时间
                const endTime = performance.now();
                const executionTime = (endTime - startTime).toFixed(2);
                
                // 显示执行结果
                console.log(`执行结果 (${executionTime}ms):`, result);
                
            } catch (error) {
                // 显示错误信息
                console.error("代码执行错误:", error.message);
            }
        },
        
        // 设置代码输入区域的事件监听
        setupCodeInputEvents() {
            // 使用iframe文档上下文
            const iframeDoc = window.zdebugiframeDocument || document;
            const codeInput = iframeDoc.getElementById("code-input");
            if (codeInput) {
                // 监听Ctrl+Enter快捷键
                codeInput.addEventListener('keydown', (e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                        e.preventDefault();
                        this.executeCode();
                    }
                });
                
                // 监听执行按钮
                const executeBtn = iframeDoc.getElementById("execute-code");
                if (executeBtn) {
                    executeBtn.addEventListener('click', this.executeCode.bind(this));
                }
                
                // 监听头部运行按钮
                const runBtn = iframeDoc.getElementById("run-code");
                if (runBtn) {
                    runBtn.addEventListener('click', this.executeCode.bind(this));
                }
            }
        }
    },
    created() {
        setTimeout(() => {
            loadStyle(style);

            // 启动打印监听
            doit(window.zdebugiframeDocument);
            
            // 使用iframe文档上下文
            const iframeDoc = window.zdebugiframeDocument || document;
            
            // 绑定控制台头部按钮事件
            const clearBtn = iframeDoc.getElementById("clear-console");
            const filterBtn = iframeDoc.getElementById("filter-console");
            const runBtn = iframeDoc.getElementById("run-code");
            const toggleFilterBtn = iframeDoc.getElementById("toggle-console-filter-bar");
            
            if (clearBtn) {
                clearBtn.addEventListener('click', this.clearConsole.bind(this));
            }
            
            if (filterBtn) {
                filterBtn.addEventListener('click', this.toggleFilterBar.bind(this));
            }
            
            if (runBtn) {
                runBtn.addEventListener('click', this.executeCode.bind(this));
            }
            
            if (toggleFilterBtn) {
                toggleFilterBtn.addEventListener('click', this.toggleFilterBar.bind(this));
            }
            
            // 绑定过滤选项事件
            const filterCheckboxes = iframeDoc.querySelectorAll('#console-filter-bar input[type="checkbox"]');
            filterCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', this.applyLogFilter.bind(this));
            });
            
            // 绑定删除按钮事件
            const deleteSelectedBtn = iframeDoc.getElementById("console-delete-selected-types");
            const deleteAllBtn = iframeDoc.getElementById("console-delete-all-logs");
            
            if (deleteSelectedBtn) {
                deleteSelectedBtn.addEventListener('click', this.deleteSelectedLogTypes.bind(this));
            }
            
            if (deleteAllBtn) {
                deleteAllBtn.addEventListener('click', () => {
                    if (confirm('确定要清空所有日志吗？')) {
                        this.clearConsole();
                    }
                });
            }
            
            // 设置代码输入区域事件
            this.setupCodeInputEvents();
        });
    }
});