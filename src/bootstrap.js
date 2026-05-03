import { createApp } from "zipaper";

import App from "./App/index.js";
import uiConsole from "./components/console/index.js";
import uiNetwork from "./components/network/index.js";
import uiMemory from "./components/memory/index.js";

export default function (el) {
    createApp(App)
        .component("ui-console", uiConsole)
        .component("ui-network", uiNetwork)
        .component("ui-memory", uiMemory)
        .mount(el); // 挂载到页面
}