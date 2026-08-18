import { defineElement } from "zipaper";
import template from "./index.html";
import style from "./index.scss";
import loadStyle from "../../tools/loadStyle";
import doit from "./doit";

export default defineElement({
    template,
    methods: {
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