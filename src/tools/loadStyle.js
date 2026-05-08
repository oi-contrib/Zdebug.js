export default function (source) {

    let styleEl = window.zdebugiframeDocument.createElement("style");
    window.zdebugiframeDocument.documentElement.getElementsByTagName("head")[0].appendChild(styleEl);
    styleEl.innerText = source;

};