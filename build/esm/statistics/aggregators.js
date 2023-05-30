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
Object.defineProperty(exports, "__esModule", { value: true });
exports.min = exports.max = exports.mean = exports.sum = exports.distMergeBy = exports.dist = exports.sumByCol = void 0;
var constant_1 = require("../constant");
/**
 * 只针对 stdAggregateFromCuboid 设计的写法，其他地方不要使用，不具备通用型。
 * @param rows
 * @param colKey
 * @param opKey
 * @returns
 */
function sumByCol(rows, colKey, opKey) {
    var _sum = 0;
    for (var i = 0; i < rows.length; i++) {
        _sum += rows[i].stat[colKey][opKey];
    }
    return _sum;
}
exports.sumByCol = sumByCol;
// for cases when all values are same
function fixRange(originalRange) {
    if (originalRange[0] === originalRange[1]) {
        return [originalRange[0], originalRange[1] + 0.1];
    }
    return originalRange;
}
var dist = function (values, originalRange) {
    var e_1, _a;
    var range = fixRange(originalRange);
    var step = (range[1] - range[0]) / constant_1.DEFAULT_BIN_NUM;
    var bins = new Array(constant_1.DEFAULT_BIN_NUM + 1).fill(0);
    try {
        for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
            var value = values_1_1.value;
            var vIndex = Math.floor((value - range[0]) / step);
            bins[vIndex]++;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    bins[constant_1.DEFAULT_BIN_NUM - 1] += bins[constant_1.DEFAULT_BIN_NUM];
    return bins.slice(0, -1);
};
exports.dist = dist;
function distMergeBy(rows, colKey, opKey) {
    var bins = new Array(constant_1.DEFAULT_BIN_NUM).fill(0);
    for (var i = 0; i < rows.length; i++) {
        var recordBins = rows[i].stat[colKey][opKey];
        for (var j = 0; j < bins.length; j++) {
            bins[j] += recordBins[j];
        }
    }
    return bins;
}
exports.distMergeBy = distMergeBy;
function sum(nums) {
    var s = 0;
    for (var i = 0; i < nums.length; i++) {
        s += nums[i];
    }
    return s;
}
exports.sum = sum;
function mean(nums) {
    return sum(nums) / nums.length;
}
exports.mean = mean;
function max(nums) {
    var ans = -Infinity;
    for (var i = 0; i < nums.length; i++) {
        if (nums[i] > ans) {
            ans = nums[i];
        }
    }
    return ans;
}
exports.max = max;
function min(nums) {
    var ans = Infinity;
    for (var i = 0; i < nums.length; i++) {
        if (nums[i] < ans) {
            ans = nums[i];
        }
    }
    return ans;
}
exports.min = min;
