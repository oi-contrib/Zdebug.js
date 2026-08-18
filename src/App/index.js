import { defineElement, ref } from "zipaper";
import template from "./index.html";
import style from "./index.scss";
import loadStyle from "../tools/loadStyle";

import logo from '../images/logo.png';

export default defineElement({
    template,
    data() {
        return {
            activeTab: ref("console")
        }
    },
    methods: {
        changeTab(tabName) {
            this.activeTab = tabName;
        }
    },
    created() {
        setTimeout(() => {
            loadStyle(style);

            var btnEl = window.zdebugiframeDocument.getElementById("btn");
            var viewEl = window.zdebugiframeDocument.getElementById("view");
            var closeEl = window.zdebugiframeDocument.getElementById("close");

            var fullStyle = "position:fixed;width:100vw;height:100vh;left:0;top:0;";
            btnEl.style = fullStyle +
                "background-image:url(" + logo + ");" +
                "background-size: 100% auto;" +
                "background-repeat: no-repeat;" +
                "background-position: center center;";
            viewEl.style = fullStyle +
                "background-color:rgb(0 0 0 / 43%);";

            // 记录图标位置（关闭后恢复用）
            var iconLeft = (window.parent.innerWidth - 70) + "px";
            var iconTop = "100px";

            var toggleView = function (isView) {
                if (isView) {
                    btnEl.style.display = "none";
                    viewEl.style.display = "";

                    // 视图打开时强制覆盖整个父页面视口
                    window.zdebugiframe.style.left = '0';
                    window.zdebugiframe.style.top = '0';
                    window.zdebugiframe.style.right = '0';
                    window.zdebugiframe.style.width = '100vw';
                    window.zdebugiframe.style.height = '100vh';

                } else {
                    btnEl.style.display = "";
                    viewEl.style.display = "none";

                    // 关闭后恢复到拖动累积的位置
                    window.zdebugiframe.style.left = iconLeft;
                    window.zdebugiframe.style.top = iconTop;
                    window.zdebugiframe.style.right = "auto";
                    window.zdebugiframe.style.width = '50px';
                    window.zdebugiframe.style.height = '50px';
                }
            };
            toggleView(false);

            btnEl.addEventListener("click", function () {
                toggleView(true);
            });

            closeEl.addEventListener("click", function () {
                toggleView(false);
            });

            // 点击遮罩区域（非面板内部）也能关闭
            viewEl.addEventListener("click", function (e) {
                if (e.target === viewEl) {
                    toggleView(false);
                }
            });

            // 让图标按钮可拖动（仅在视图关闭/图标可见时生效）
            (function () {
                var startMouseX = 0, startMouseY = 0;
                var startIframeLeft = 0, startIframeTop = 0;
                var dragging = false;
                var moved = false;
                var iframeW = 50, iframeH = 50;

                function parentCoords(e) {
                    var rect = window.zdebugiframe.getBoundingClientRect();
                    return { x: e.clientX + rect.left, y: e.clientY + rect.top };
                }

                function onPointerDown(e) {
                    if (e.button !== 0) return;
                    // 视图打开时禁止拖动
                    if (viewEl.style.display !== "none") return;
                    var rect = window.zdebugiframe.getBoundingClientRect();
                    iframeW = rect.width;
                    iframeH = rect.height;
                    var p = parentCoords(e);
                    startMouseX = p.x;
                    startMouseY = p.y;
                    startIframeLeft = rect.left;
                    startIframeTop = rect.top;
                    dragging = true;
                    moved = false;
                    btnEl.style.cursor = "grabbing";
                    if (e.preventDefault) e.preventDefault();
                }

                function onPointerMove(e) {
                    if (!dragging) return;
                    var p = parentCoords(e);
                    var dx = p.x - startMouseX;
                    var dy = p.y - startMouseY;
                    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
                    if (!moved) return;

                    var parentWin = window.parent;
                    var parentW = parentWin.innerWidth;
                    var parentH = parentWin.innerHeight;

                    var newLeft = startIframeLeft + dx;
                    var newTop = startIframeTop + dy;
                    if (newLeft < 0) newLeft = 0;
                    if (newTop < 0) newTop = 0;
                    if (newLeft > parentW - iframeW) newLeft = parentW - iframeW;
                    if (newTop > parentH - iframeH) newTop = parentH - iframeH;

                    window.zdebugiframe.style.left = newLeft + "px";
                    window.zdebugiframe.style.top = newTop + "px";
                    window.zdebugiframe.style.right = "auto";

                    // 记录当前位置，关闭视图后恢复用
                    iconLeft = newLeft + "px";
                    iconTop = newTop + "px";
                }

                function onPointerUp() {
                    if (!dragging) return;
                    var wasMoved = moved;
                    dragging = false;
                    moved = false;
                    btnEl.style.cursor = "grab";
                    if (!wasMoved) toggleView(true);
                }

                btnEl.style.cursor = "grab";
                btnEl.addEventListener("mousedown", onPointerDown);
                window.zdebugiframeDocument.addEventListener("mousemove", onPointerMove);
                window.zdebugiframeDocument.addEventListener("mouseup", onPointerUp);

                btnEl.addEventListener("touchstart", function (e) {
                    var t = e.touches[0];
                    onPointerDown({
                        button: 0,
                        clientX: t.clientX,
                        clientY: t.clientY,
                        preventDefault: function () { e.preventDefault(); }
                    });
                }, { passive: false });
                window.zdebugiframeDocument.addEventListener("touchmove", function (e) {
                    if (!dragging) return;
                    var t = e.touches[0];
                    onPointerMove({ clientX: t.clientX, clientY: t.clientY });
                }, { passive: false });
                window.zdebugiframeDocument.addEventListener("touchend", onPointerUp);
            })();

        });
    }
})
