import commonStyle from './common.scss';
import bootstrap from './bootstrap.js'


export default function (options) {
    var _options = {
        zIndex: 9999999
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
    iframeDocument.write("<div id='root'></div>");
    iframeDocument.close();

    var styleEl = document.createElement("style");
    iframeDocument.documentElement.getElementsByTagName("head")[0].appendChild(styleEl);
    styleEl.innerText = commonStyle;

    window.zdebugiframe = iframe;
    window.zdebugiframeDocument = iframeDocument;
    bootstrap(iframeDocument.getElementById("root"));
};
