import { createApp } from "zipaper";

import App from "./App/index.js";
import uiConsole from "./components/console/index.js";

export default function (el) {
    createApp(App)
        .component("ui-console", uiConsole)
        .mount(el); // 挂载到页面
}