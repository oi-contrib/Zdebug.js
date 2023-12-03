import indexStyle from './index.scss';
import indexTemplate from './index.html';

import consoleStyle from './Console/index.scss';
import runConsole from './Console/index.js';

var logo = "data:image/png;base64,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";

export default function (options) {
    'use strict';

    var _options = {
        zIndex: 9999999,
        log: true,
        info: true,
        debug: true,
        warn: true,
        error: true,
        trace: true
    };

    if (options) {
        for (var key in options) {
            _options[key] = options[key]
        }
    }

    var iframe = document.createElement("iframe");
    iframe.style.cssText =
        "display: block;" +
        "position: fixed;" +
        "z-index: " + _options.zIndex + ";" +
        "border: 0px;" +
        "border-top:0px solid rgba(0,0,0,0.5);" +
        "box-sizing: content-box;";
    document.documentElement.appendChild(iframe);

    var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    // ifrmae中写入html模板
    iframeDocument.open();
    iframeDocument.write(indexTemplate);
    iframeDocument.close();

    var styleEl = document.createElement("style");
    iframeDocument.documentElement.getElementsByTagName("head")[0].appendChild(styleEl);
    styleEl.innerText = indexStyle + consoleStyle;

    var btnEl = iframeDocument.getElementById("btn");
    var viewEl = iframeDocument.getElementById("view");
    var closeEl = iframeDocument.getElementById("close");


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

            iframe.style.right = '0';
            iframe.style.top = '0';
            iframe.style.width = '100vw';
            iframe.style.height = '100vh';

        } else {
            btnEl.style.display = "";
            viewEl.style.display = "none";

            iframe.style.right = '20px';
            iframe.style.top = '100px';
            iframe.style.width = '50px';
            iframe.style.height = '50px';
        }
    };
    toggleView(false);

    btnEl.addEventListener("click", function () {
        toggleView(true);
    });

    closeEl.addEventListener("click", function () {
        toggleView(false);
    });

    // Console
    runConsole(_options, iframeDocument);

};
