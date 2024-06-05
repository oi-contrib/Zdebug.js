import indexStyle from './index.scss';
import indexTemplate from './index.html';

import consoleStyle from './Console/index.scss';
import runConsole from './Console/index.js';

import logo from './logo.png';

export default function (options) {
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
            _options[key] = options[key];
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
