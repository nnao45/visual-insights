"use strict";
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
exports.getRangeBy = exports.gini = exports.entropy = exports.normalize = exports.getCombination = exports.mapPositive = exports.linearMapPositive = void 0;
function linearMapPositive(arr) {
    var min = Math.min.apply(Math, __spreadArray([], __read(arr), false));
    return arr.map(function (a) { return a - min + 1; });
}
exports.linearMapPositive = linearMapPositive;
function mapPositive(arr) {
    return arr.map(function (a) { return Math.abs(a); }).filter(function (a) { return a !== 0; });
}
exports.mapPositive = mapPositive;
function getCombination(elements, start, end) {
    if (start === void 0) { start = 1; }
    if (end === void 0) { end = elements.length; }
    var ans = [];
    var combine = function (step, set, size) {
        if (set.length === size) {
            ans.push(__spreadArray([], __read(set), false));
            return;
        }
        if (step >= elements.length) {
            return;
        }
        combine(step + 1, __spreadArray(__spreadArray([], __read(set), false), [elements[step]], false), size);
        combine(step + 1, set, size);
    };
    for (var i = start; i <= end; i++) {
        combine(0, [], i);
    }
    return ans;
}
exports.getCombination = getCombination;
function normalize(frequencyList) {
    var e_1, _a;
    var sum = 0;
    try {
        for (var frequencyList_1 = __values(frequencyList), frequencyList_1_1 = frequencyList_1.next(); !frequencyList_1_1.done; frequencyList_1_1 = frequencyList_1.next()) {
            var f = frequencyList_1_1.value;
            sum += f;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (frequencyList_1_1 && !frequencyList_1_1.done && (_a = frequencyList_1.return)) _a.call(frequencyList_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return frequencyList.map(function (f) { return f / sum; });
}
exports.normalize = normalize;
var entropy = function (probabilityList) {
    var e_2, _a;
    var sum = 0;
    try {
        for (var probabilityList_1 = __values(probabilityList), probabilityList_1_1 = probabilityList_1.next(); !probabilityList_1_1.done; probabilityList_1_1 = probabilityList_1.next()) {
            var p = probabilityList_1_1.value;
            sum += p * Math.log2(p);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (probabilityList_1_1 && !probabilityList_1_1.done && (_a = probabilityList_1.return)) _a.call(probabilityList_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return -sum;
};
exports.entropy = entropy;
var gini = function (probabilityList) {
    var e_3, _a;
    var sum = 0;
    try {
        for (var probabilityList_2 = __values(probabilityList), probabilityList_2_1 = probabilityList_2.next(); !probabilityList_2_1.done; probabilityList_2_1 = probabilityList_2.next()) {
            var p = probabilityList_2_1.value;
            sum += p * (1 - p);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (probabilityList_2_1 && !probabilityList_2_1.done && (_a = probabilityList_2.return)) _a.call(probabilityList_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return sum;
};
exports.gini = gini;
function getRangeBy(dataSource, by) {
    var e_4, _a;
    var maxValue = -Infinity;
    var minValue = Infinity;
    try {
        for (var dataSource_1 = __values(dataSource), dataSource_1_1 = dataSource_1.next(); !dataSource_1_1.done; dataSource_1_1 = dataSource_1.next()) {
            var row = dataSource_1_1.value;
            maxValue = Math.max(row[by], maxValue);
            minValue = Math.min(row[by], minValue);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (dataSource_1_1 && !dataSource_1_1.done && (_a = dataSource_1.return)) _a.call(dataSource_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return [minValue, maxValue];
}
exports.getRangeBy = getRangeBy;
