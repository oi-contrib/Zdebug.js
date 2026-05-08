import { defineElement } from "zipaper";
import template from "./index.html";
import style from "./index.scss";
import loadStyle from "../../tools/loadStyle";
import doit from "./doit";

export default defineElement({
    template,
    methods: {
        // 清空性能记录
        clearPerformanceLogs() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const performanceEl = iframeDoc.getElementById("performance-container");
            if (performanceEl) {
                const blankEl = performanceEl.querySelector('.blank');
                const allItems = performanceEl.querySelectorAll('.performance-item:not(.blank)');
                allItems.forEach(item => item.remove());
                
                // 如果没有内容了，显示空状态
                if (performanceEl.children.length === 1) {
                    blankEl.style.display = 'flex';
                }
            }
        },
        
        // 删除选中的性能类型
        deleteSelectedPerformanceTypes() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const performanceEl = iframeDoc.getElementById("performance-container");
            if (!performanceEl) return;
            
            const checkboxes = iframeDoc.querySelectorAll('#performance-filter-bar input[type="checkbox"]');
            const selectedTypes = [];
            
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedTypes.push(checkbox.value);
                }
            });
            
            if (selectedTypes.length === 0) {
                alert('请选择要删除的性能记录类型');
                return;
            }
            
            const allItems = performanceEl.querySelectorAll('.performance-item:not(.blank)');
            let deletedCount = 0;
            
            allItems.forEach(item => {
                const performanceType = item.getAttribute('data-type');
                if (performanceType && selectedTypes.includes(performanceType)) {
                    item.remove();
                    deletedCount++;
                }
            });
            
            // 更新空状态显示
            const blankEl = performanceEl.querySelector('.blank');
            if (performanceEl.children.length === 1) {
                blankEl.style.display = 'flex';
            }
            
            console.log(`已删除 ${deletedCount} 条性能记录（类型: ${selectedTypes.join(', ')}）`);
        },
        
        // 切换过滤栏显示
        toggleFilterBar() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const filterBar = iframeDoc.getElementById("performance-filter-bar");
            if (filterBar) {
                filterBar.style.display = filterBar.style.display === 'none' ? 'flex' : 'none';
            }
        },
        
        // 应用性能记录过滤
        applyPerformanceFilter() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const performanceEl = iframeDoc.getElementById("performance-container");
            if (!performanceEl) return;
            
            const checkboxes = iframeDoc.querySelectorAll('#performance-filter-bar input[type="checkbox"]');
            const enabledTypes = [];
            
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    enabledTypes.push(checkbox.value);
                }
            });
            
            const allItems = performanceEl.querySelectorAll('.performance-item:not(.blank)');
            allItems.forEach(item => {
                const performanceType = item.getAttribute('data-type');
                item.style.display = enabledTypes.includes(performanceType) ? 'block' : 'none';
            });
        },
        
        // 展开/收起性能详情
        togglePerformanceDetails(element) {
            const detailsEl = element.querySelector('.performance-details');
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

            // 启动性能监控
            doit(window.zdebugiframeDocument);
            
            // 使用iframe文档上下文
            const iframeDoc = window.zdebugiframeDocument || document;
            
            // 绑定性能面板头部按钮事件
            const clearBtn = iframeDoc.getElementById("clear-performance");
            const filterBtn = iframeDoc.getElementById("filter-performance");
            const toggleFilterBtn = iframeDoc.getElementById("toggle-performance-filter-bar");
            
            if (clearBtn) {
                clearBtn.addEventListener('click', this.clearPerformanceLogs.bind(this));
            }
            
            if (filterBtn) {
                filterBtn.addEventListener('click', this.toggleFilterBar.bind(this));
            }
            
            if (toggleFilterBtn) {
                toggleFilterBtn.addEventListener('click', this.toggleFilterBar.bind(this));
            }
            
            // 绑定过滤选项事件
            const filterCheckboxes = iframeDoc.querySelectorAll('#performance-filter-bar input[type="checkbox"]');
            filterCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', this.applyPerformanceFilter.bind(this));
            });
            
            // 绑定删除按钮事件
            const deleteSelectedBtn = iframeDoc.getElementById("performance-delete-selected-types");
            const deleteAllBtn = iframeDoc.getElementById("performance-delete-all-logs");
            
            if (deleteSelectedBtn) {
                deleteSelectedBtn.addEventListener('click', this.deleteSelectedPerformanceTypes.bind(this));
            }
            
            if (deleteAllBtn) {
                deleteAllBtn.addEventListener('click', () => {
                    if (confirm('确定要清空所有性能记录吗？')) {
                        this.clearPerformanceLogs();
                    }
                });
            }
            
            // 绑定性能项展开/收起事件
            const performanceContainer = iframeDoc.getElementById("performance-container");
            if (performanceContainer) {
                performanceContainer.addEventListener('click', (e) => {
                    const performanceItem = e.target.closest('.performance-item-header');
                    if (performanceItem) {
                        this.togglePerformanceDetails(performanceItem.parentElement);
                    }
                });
            }
        });
    }
});