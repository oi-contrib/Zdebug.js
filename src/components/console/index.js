import { defineElement } from "zipaper";
import template from "./index.html";
import style from "./index.scss";
import loadStyle from "../../tools/loadStyle";
import doit from "./doit";

export default defineElement({
    template,
    methods: {

    },
    created() {
        setTimeout(function () {
            loadStyle(style);

            // 启动打印监听
            doit(window.zdebugiframeDocument);
        });
    }
})