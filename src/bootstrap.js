import { createApp } from "zipaper";

import App from "./App/index.js";
import uiConsole from "./components/console/index.js";
import uiNetwork from "./components/network/index.js";

export default function (el) {
    createApp(App)
        .component("ui-console", uiConsole)
        .component("ui-network", uiNetwork)
        .mount(el); // 挂载到页面
}