const pkg = require("../package.json");

module.exports = {
    input: "./src/index.js",
    output: {
        name: 'Zdebug',
        file: "./dist/Zdebug.js",
        format: "umd",
        banner: `/*!
 * Zdebug.js v${pkg.version}
 * git+https://github.com/fragement-contrib/Zdebug.js.git
 *
 * Copyright zxl20070701
 * Released under the MIT license
 * https://zxl20070701.github.io/notebook/home.html
 */`
    },
    plugins: [
        (function () {
            return {
                transform(source, path) {
                    if (/\.scss$/.test(path)) {
                        return require('./scss-loader.js')(source)
                    }

                    else if (/\.html$/.test(path)) {
                        return `export default ${JSON.stringify(source)}`
                    }

                    return
                }
            }
        })()
    ]
}
