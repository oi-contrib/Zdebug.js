var _toString = Object.prototype.toString;
var getType = function (value) {
    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]';
    }
    return _toString.call(value);
};

export var isPlainObject = function (value) {
    if (value === null || typeof value !== 'object' || getType(value) != '[object Object]') {
        return false;
    }

    // 如果原型为null
    if (Object.getPrototypeOf(value) === null) {
        return true;
    }

    var proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
};

export var isString = function (value) {
    var type = typeof value;
    return type === 'string' || (type === 'object' && value != null && !Array.isArray(value) && getType(value) === '[object String]');
};

export var isObject = function (value) {
    var type = typeof value;
    return value != null && (type === 'object' || type === 'function');
};

export var isFunction = function (value) {
    if (!isObject(value)) {
        return false;
    }

    var type = getType(value);
    return type === '[object Function]' || type === '[object AsyncFunction]' ||
        type === '[object GeneratorFunction]' || type === '[object Proxy]';
};

export var isNumber = function (value) {
    return typeof value === 'number' || (
        value !== null && typeof value === 'object' &&
        getType(value) === '[object Number]'
    );
};

export var isBoolean = function (value) {
    return value === true || value === false ||
        (value !== null && typeof value === 'object' && getType(value) === '[object Boolean]');
};

export var toString = function (val) {
    // 处理基本类型
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (typeof val === 'string') return '"' + val + '"';
    if (typeof val === 'number' || typeof val === 'boolean' || typeof val === 'function') {
        return String(val);
    }
    
    // 处理数组
    if (Array.isArray(val)) {
        if (val.length === 0) return '[]';
        
        var resultData = "[";
        for (var i = 0; i < Math.min(val.length, 10); i++) { // 限制数组长度，避免过长
            if (i > 0) resultData += ', ';
            if (typeof val[i] === 'string') {
                resultData += '"' + val[i] + '"';
            } else if (typeof val[i] === 'object' && val[i] !== null) {
                resultData += '{...}'; // 简化对象显示
            } else {
                resultData += String(val[i]);
            }
        }
        if (val.length > 10) resultData += ', ...'; // 表示还有更多元素
        return resultData + ']';
    }

    // 处理对象
    if (isPlainObject(val)) {
        var keys = Object.keys(val);
        if (keys.length === 0) return '{}';
        
        var resultData = "{";
        var count = 0;
        for (var key in val) {
            if (count >= 5) { // 限制属性数量，避免过长
                resultData += ', ...'; // 表示还有更多属性
                break;
            }
            if (count > 0) resultData += ', ';
            resultData += key + ": ";
            
            var value = val[key];
            if (typeof value === 'string') {
                resultData += '"' + value + '"';
            } else if (typeof value === 'object' && value !== null) {
                resultData += '{...}'; // 简化嵌套对象显示
            } else {
                resultData += String(value);
            }
            count++;
        }
        return resultData + '}';
    }

    // 处理其他类型
    try {
        return String(val);
    } catch (e) {
        return '[object Object]';
    }
};