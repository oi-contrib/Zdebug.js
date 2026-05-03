import { defineElement } from "zipaper";
import template from "./index.html";
import style from "./index.scss";
import loadStyle from "../../tools/loadStyle";
import doit from "./doit";

export default defineElement({
    template,
    methods: {
        // 清空内存监控记录
        clearMemoryLogs() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const memoryEl = iframeDoc.getElementById("memory-container");
            if (memoryEl) {
                const blankEl = memoryEl.querySelector('.blank');
                const allItems = memoryEl.querySelectorAll('.memory-item:not(.blank)');
                allItems.forEach(item => item.remove());
                
                // 如果没有内容了，显示空状态
                if (memoryEl.children.length === 1) {
                    blankEl.style.display = 'flex';
                }
            }
        },
        
        // 删除选中的内存类型
        deleteSelectedMemoryTypes() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const memoryEl = iframeDoc.getElementById("memory-container");
            if (!memoryEl) return;
            
            const checkboxes = iframeDoc.querySelectorAll('#memory-filter-bar input[type="checkbox"]');
            const selectedTypes = [];
            
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedTypes.push(checkbox.value);
                }
            });
            
            if (selectedTypes.length === 0) {
                alert('请选择要删除的内存记录类型');
                return;
            }
            
            const allItems = memoryEl.querySelectorAll('.memory-item:not(.blank)');
            let deletedCount = 0;
            
            allItems.forEach(item => {
                const memoryType = item.getAttribute('data-type');
                if (memoryType && selectedTypes.includes(memoryType)) {
                    item.remove();
                    deletedCount++;
                }
            });
            
            // 更新空状态显示
            const blankEl = memoryEl.querySelector('.blank');
            if (memoryEl.children.length === 1) {
                blankEl.style.display = 'flex';
            }
            
            console.log(`已删除 ${deletedCount} 条内存记录（类型: ${selectedTypes.join(', ')}）`);
        },
        
        // 切换过滤栏显示
        toggleFilterBar() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const filterBar = iframeDoc.getElementById("memory-filter-bar");
            if (filterBar) {
                filterBar.style.display = filterBar.style.display === 'none' ? 'flex' : 'none';
            }
        },
        
        // 应用内存记录过滤
        applyMemoryFilter() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const memoryEl = iframeDoc.getElementById("memory-container");
            if (!memoryEl) return;
            
            const checkboxes = iframeDoc.querySelectorAll('#memory-filter-bar input[type="checkbox"]');
            const enabledTypes = [];
            
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    enabledTypes.push(checkbox.value);
                }
            });
            
            const allItems = memoryEl.querySelectorAll('.memory-item:not(.blank)');
            allItems.forEach(item => {
                const memoryType = item.getAttribute('data-type');
                item.style.display = enabledTypes.includes(memoryType) ? 'block' : 'none';
            });
        },
        
        // 展开/收起内存详情
        toggleMemoryDetails(element) {
            const detailsEl = element.querySelector('.memory-details');
            const toggleIcon = element.querySelector('.toggle-icon');
            
            if (detailsEl.style.display === 'none') {
                detailsEl.style.display = 'block';
                toggleIcon.textContent = '▼';
            } else {
                detailsEl.style.display = 'none';
                toggleIcon.textContent = '▶';
            }
        }
    },
    created() {
        setTimeout(() => {
            loadStyle(style);

            // 启动内存监控
            doit(window.zdebugiframeDocument);
            
            // 使用iframe文档上下文
            const iframeDoc = window.zdebugiframeDocument || document;
            
            // 绑定内存面板头部按钮事件
            const clearBtn = iframeDoc.getElementById("clear-memory");
            const filterBtn = iframeDoc.getElementById("filter-memory");
            const toggleFilterBtn = iframeDoc.getElementById("toggle-memory-filter-bar");
            
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    if (confirm('确定要清空所有内存监控记录吗？')) {
                        this.clearMemoryLogs();
                    }
                });
            }
            
            if (filterBtn) {
                filterBtn.addEventListener('click', this.toggleFilterBar.bind(this));
            }
            
            if (toggleFilterBtn) {
                toggleFilterBtn.addEventListener('click', this.toggleFilterBar.bind(this));
            }
            
            // 绑定过滤选项事件
            const filterCheckboxes = iframeDoc.querySelectorAll('#memory-filter-bar input[type="checkbox"]');
            filterCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', this.applyMemoryFilter.bind(this));
            });
            
            // 绑定删除按钮事件
            const deleteSelectedBtn = iframeDoc.getElementById("memory-delete-selected-types");
            const deleteAllBtn = iframeDoc.getElementById("memory-delete-all-logs");
            
            if (deleteSelectedBtn) {
                deleteSelectedBtn.addEventListener('click', this.deleteSelectedMemoryTypes.bind(this));
            }
            
            if (deleteAllBtn) {
                deleteAllBtn.addEventListener('click', () => {
                    if (confirm('确定要清空所有内存监控记录吗？')) {
                        this.clearMemoryLogs();
                    }
                });
            }
            
            // 绑定内存项展开/收起事件
            const memoryContainer = iframeDoc.getElementById("memory-container");
            if (memoryContainer) {
                memoryContainer.addEventListener('click', (e) => {
                    const memoryItem = e.target.closest('.memory-item-header');
                    if (memoryItem) {
                        this.toggleMemoryDetails(memoryItem.parentElement);
                    }
                });
            }
        });
    }
});