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
    if (Array.isArray(val)) {
        var resultData = "[";
        for (var key in val) {
            resultData += val[key] + ',';
        }
        return resultData.replace(/\,$/, ']');
    }

    if (isPlainObject(val)) {
        var resultData = "{";
        for (var key in val) {
            resultData += key + ":" + val[key] + ",";
        }
        return resultData.replace(/\,$/, '}');
    }

    return val;
};