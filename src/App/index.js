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

            var toggleView = function (isView) {
                if (isView) {
                    btnEl.style.display = "none";
                    viewEl.style.display = "";

                    window.zdebugiframe.style.right = '0';
                    window.zdebugiframe.style.top = '0';
                    window.zdebugiframe.style.width = '100vw';
                    window.zdebugiframe.style.height = '100vh';

                } else {
                    btnEl.style.display = "";
                    viewEl.style.display = "none";

                    window.zdebugiframe.style.right = '20px';
                    window.zdebugiframe.style.top = '100px';
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
        });
    }
})