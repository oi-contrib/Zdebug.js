const fs = require("fs")
const pkg = require("../package.json")
const simpleScss = require("./simpleScss.js")
const { parseTemplate } = require("xhtml-to-json")
const pluginNodeResolve = require("@rollup/plugin-node-resolve")
const pluginCommonjs = require("@rollup/plugin-commonjs")

function toBase64(filepath) {
    return "data:image/png;base64," + fs.readFileSync(filepath).toString('base64')
}

module.exports = {
    input: "./src/index.js",
    output: {
        name: 'Zdebug',
        file: "./dist/Zdebug.js",
        format: "umd",
        banner: `/*!
 * Zdebug.js v${pkg.version}
 * git+https://github.com/oi-contrib/Zdebug.js.git
 */`
    },
    plugins: [
        pluginCommonjs(),
        pluginNodeResolve(),
        (function () {
            return {
                transform(source, path) {
                    if (/\.scss$/.test(path)) {
                        return `export default ${JSON.stringify(simpleScss(source))}`
                    }

                    else if (/\.html$/.test(path)) {
                        return `export default ${JSON.stringify(parseTemplate(source).toJson())}`
                    }

                    else if (/\.png$/.test(path)) {
                        return `export default ${JSON.stringify(toBase64(path))}`
                    }

                    return
                }
            }
        })()
    ]
}
