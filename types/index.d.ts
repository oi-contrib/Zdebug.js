/**
 * 移动端调试工具，支持typescript开发
 */
export default function (options?: {

    /**
     * 可选，表示工具的css属性z-index，默认9999999
     */
    zIndex?: number

    log?: boolean
    info?: boolean
    debug?: boolean
    warn?: boolean
    error?: boolean
    trace?: boolean
}): void