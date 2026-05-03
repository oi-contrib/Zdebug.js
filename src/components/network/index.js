import { defineElement } from "zipaper";
import template from "./index.html";
import style from "./index.scss";
import loadStyle from "../../tools/loadStyle";
import doit from "./doit";

export default defineElement({
    template,
    methods: {
        // 清空网络请求记录
        clearNetworkLogs() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const networkEl = iframeDoc.getElementById("network-container");
            if (networkEl) {
                const blankEl = networkEl.querySelector('.blank');
                const allItems = networkEl.querySelectorAll('.network-item:not(.blank)');
                allItems.forEach(item => item.remove());
                
                // 如果没有内容了，显示空状态
                if (networkEl.children.length === 1) {
                    blankEl.style.display = 'flex';
                }
            }
        },
        
        // 删除选中的请求类型
        deleteSelectedRequestTypes() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const networkEl = iframeDoc.getElementById("network-container");
            if (!networkEl) return;
            
            const checkboxes = iframeDoc.querySelectorAll('#network-filter-bar input[type="checkbox"]');
            const selectedTypes = [];
            
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedTypes.push(checkbox.value);
                }
            });
            
            if (selectedTypes.length === 0) {
                alert('请选择要删除的请求类型');
                return;
            }
            
            const allItems = networkEl.querySelectorAll('.network-item:not(.blank)');
            let deletedCount = 0;
            
            allItems.forEach(item => {
                const requestType = item.getAttribute('data-type');
                if (requestType && selectedTypes.includes(requestType)) {
                    item.remove();
                    deletedCount++;
                }
            });
            
            // 更新空状态显示
            const blankEl = networkEl.querySelector('.blank');
            if (networkEl.children.length === 1) {
                blankEl.style.display = 'flex';
            }
            
            console.log(`已删除 ${deletedCount} 条网络请求（类型: ${selectedTypes.join(', ')}）`);
        },
        
        // 切换过滤栏显示
        toggleFilterBar() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const filterBar = iframeDoc.getElementById("network-filter-bar");
            if (filterBar) {
                filterBar.style.display = filterBar.style.display === 'none' ? 'flex' : 'none';
            }
        },
        
        // 应用请求过滤
        applyRequestFilter() {
            const iframeDoc = window.zdebugiframeDocument || document;
            const networkEl = iframeDoc.getElementById("network-container");
            if (!networkEl) return;
            
            const checkboxes = iframeDoc.querySelectorAll('#network-filter-bar input[type="checkbox"]');
            const enabledTypes = [];
            
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    enabledTypes.push(checkbox.value);
                }
            });
            
            const allItems = networkEl.querySelectorAll('.network-item:not(.blank)');
            allItems.forEach(item => {
                const requestType = item.getAttribute('data-type');
                item.style.display = enabledTypes.includes(requestType) ? 'block' : 'none';
            });
        },
        
        // 展开/收起请求详情
        toggleRequestDetails(element) {
            const detailsEl = element.querySelector('.request-details');
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

            // 启动网络请求监听
            doit(window.zdebugiframeDocument);
            
            // 使用iframe文档上下文
            const iframeDoc = window.zdebugiframeDocument || document;
            
            // 绑定网络面板头部按钮事件
            const clearBtn = iframeDoc.getElementById("clear-network");
            const filterBtn = iframeDoc.getElementById("filter-network");
            const toggleFilterBtn = iframeDoc.getElementById("toggle-network-filter-bar");
            
            if (clearBtn) {
                clearBtn.addEventListener('click', this.clearNetworkLogs.bind(this));
            }
            
            if (filterBtn) {
                filterBtn.addEventListener('click', this.toggleFilterBar.bind(this));
            }
            
            if (toggleFilterBtn) {
                toggleFilterBtn.addEventListener('click', this.toggleFilterBar.bind(this));
            }
            
            // 绑定过滤选项事件
            const filterCheckboxes = iframeDoc.querySelectorAll('#network-filter-bar input[type="checkbox"]');
            filterCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', this.applyRequestFilter.bind(this));
            });
            
            // 绑定删除按钮事件
            const deleteSelectedBtn = iframeDoc.getElementById("network-delete-selected-types");
            const deleteAllBtn = iframeDoc.getElementById("network-delete-all-logs");
            
            if (deleteSelectedBtn) {
                deleteSelectedBtn.addEventListener('click', this.deleteSelectedRequestTypes.bind(this));
            }
            
            if (deleteAllBtn) {
                deleteAllBtn.addEventListener('click', () => {
                    if (confirm('确定要清空所有网络请求记录吗？')) {
                        this.clearNetworkLogs();
                    }
                });
            }
            
            // 绑定请求项展开/收起事件
            const networkContainer = iframeDoc.getElementById("network-container");
            if (networkContainer) {
                networkContainer.addEventListener('click', (e) => {
                    const requestItem = e.target.closest('.network-item-header');
                    if (requestItem) {
                        this.toggleRequestDetails(requestItem.parentElement);
                    }
                });
            }
        });
    }
});