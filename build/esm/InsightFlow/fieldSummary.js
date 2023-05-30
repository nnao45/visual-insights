"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldsSummary = exports.inferDataType = void 0;
var univariateSummary_1 = require("../univariateSummary");
var constant_1 = require("../constant");
var statistics_1 = require("../statistics");
var TESTS = {
    boolean: function (x) {
        return x === 'true' || x === 'false' || x === true || x === false;
    },
    integer: function (x) {
        return TESTS.number(x) && (x = +x) === ~~x;
    },
    number: function (x) {
        return !isNaN(+x);
    },
    date: function (x) {
        return !isNaN(Date.parse(x));
    },
};
function isValid(obj) {
    return obj != null && obj === obj;
}
function inferDataType(values) {
    var e_1, _a;
    // types to test for, in precedence order
    var types = ['boolean', 'integer', 'number', 'date'];
    try {
        for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
            var value = values_1_1.value;
            // test value against remaining types
            for (var j = 0; j < types.length; ++j) {
                if (isValid(value) && !TESTS[types[j]](value)) {
                    types.splice(j, 1);
                    j -= 1;
                }
            }
            // if no types left, return 'string'
            if (types.length === 0)
                return 'string';
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return types[0];
}
exports.inferDataType = inferDataType;
// 实现约束：必须保证fieldKeys与fields的顺序相同。engine依赖了这样的顺序，否则会产生逻辑错误。
function getFieldsSummary(fieldKeys, dataSource) {
    var e_2, _a;
    var fields = [];
    var dictonary = new Map();
    var _loop_1 = function (f) {
        var _b;
        var valueMap = new Map();
        dataSource.forEach(function (row) {
            if (!valueMap.has(row[f])) {
                valueMap.set(row[f], 0);
            }
            valueMap.set(row[f], valueMap.get(row[f]) + 1);
        });
        var dataType = inferDataType(__spreadArray([], __read(valueMap.keys()), false));
        var semanticType = (0, univariateSummary_1.getFieldType)(dataSource, f);
        var maxEntropy = Math.log2(valueMap.size);
        var entropy = maxEntropy;
        var _max = -Infinity;
        var _min = Infinity;
        var analyticType = 'dimension';
        var useFloatEntropy = false;
        if ((dataType === 'integer' || dataType === 'number') && semanticType !== 'ordinal') {
            analyticType = 'measure';
            if (valueMap.size > constant_1.BIN_NUM_FOR_ANALYTIC) {
                var info = (0, univariateSummary_1.getFloatFieldEntropy)(dataSource, f);
                entropy = info.entropy;
                maxEntropy = info.maxEntropy;
                useFloatEntropy = true;
                _b = __read((0, statistics_1.getRangeBy)(dataSource, f), 2), _min = _b[0], _max = _b[1];
            }
        }
        if (!useFloatEntropy) {
            var info = (0, univariateSummary_1.getFieldEntropy)(dataSource, f);
            entropy = info.entropy;
            maxEntropy = info.maxEntropy;
        }
        var field = {
            key: f,
            analyticType: analyticType,
            semanticType: semanticType,
            dataType: dataType,
            features: {
                unique: valueMap.size,
                size: dataSource.length,
                entropy: entropy,
                maxEntropy: maxEntropy,
                min: _min,
                max: _max
            }
        };
        fields.push(field);
        dictonary.set(field.key, field);
    };
    try {
        for (var fieldKeys_1 = __values(fieldKeys), fieldKeys_1_1 = fieldKeys_1.next(); !fieldKeys_1_1.done; fieldKeys_1_1 = fieldKeys_1.next()) {
            var f = fieldKeys_1_1.value;
            _loop_1(f);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (fieldKeys_1_1 && !fieldKeys_1_1.done && (_a = fieldKeys_1.return)) _a.call(fieldKeys_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return {
        fields: fields,
        dictonary: dictonary
    };
}
exports.getFieldsSummary = getFieldsSummary;
