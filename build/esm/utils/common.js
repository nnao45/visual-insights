"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.isFieldUnique = exports.DKL = exports.JOIN_SYMBOL = exports.isFieldNumeric = exports.isFieldTime = exports.isFieldContinous = exports.isFieldCategory = exports.aggregate = exports.groupContinousField = exports.groupCategoryField = exports.memberCount = exports.copyData = exports.deepcopy = exports.subset2theOther = void 0;
var JOIN_SYMBOL = '_';
exports.JOIN_SYMBOL = JOIN_SYMBOL;
var MAGIC_NUMBER = 5;
function deepcopy(data) {
    return JSON.parse(JSON.stringify(data));
}
exports.deepcopy = deepcopy;
function copyData(data) {
    return data.map(function (r) { return (__assign({}, r)); });
}
exports.copyData = copyData;
function isFieldCategory(dataSource, fieldName) {
    return dataSource.every(function (record) {
        return typeof record[fieldName] === 'string'
            || typeof record[fieldName] === 'undefined'
            || record[fieldName] === null;
    });
}
exports.isFieldCategory = isFieldCategory;
function isFieldContinous(dataSource, fieldName) {
    return dataSource.every(function (record) {
        return !isNaN(+record[fieldName])
            || typeof record[fieldName] === 'undefined'
            || record[fieldName] === null;
    });
}
exports.isFieldContinous = isFieldContinous;
function isFieldNumeric(dataSource, fieldName) {
    return dataSource.every(function (record) {
        return !isNaN(record[fieldName])
            || typeof record[fieldName] === 'undefined'
            || record[fieldName] === null;
    });
}
exports.isFieldNumeric = isFieldNumeric;
var TIME_RULES = [
    /^[0-9]{2,4}[-/][0-9]{1,2}([-/][0-9]{1,2})?$/,
    /^[0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4}$/,
    /^[1-2][0-9]{3}[0-9]{2}[0-9]{2}$/,
    /^[0-9]{2,4}[-/][0-9]{1,2}[-/][0-9]{1,2} [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$/ // YYYY-MM-DD HH:mm:ss
];
function isFieldTime(dataSource, fieldName) {
    return dataSource.every(function (record) {
        // todo: tmp solotion here.
        if (!isNaN(Number(record[fieldName])) && Number(record[fieldName]) >= 1800 && Number(record[fieldName]) <= 2200) {
            return true;
        }
        return (typeof record[fieldName] === 'string'
            // && /^[0-9]{0,4}[-/][0-9]{0,2}([-/][0-9]{0,2}$)?/.test(record[fieldName]))
            && TIME_RULES.some(function (rule) { return rule.test(record[fieldName]); }))
            || typeof record[fieldName] === 'undefined'
            || record[fieldName] === null;
    });
}
exports.isFieldTime = isFieldTime;
function aggregate(_a) {
    var e_1, _b, e_2, _c, e_3, _d, _e, e_4, _f;
    var dataSource = _a.dataSource, fields = _a.fields, bys = _a.bys, _g = _a.method, method = _g === void 0 ? 'sum' : _g;
    var tmp = [];
    try {
        for (var bys_1 = __values(bys), bys_1_1 = bys_1.next(); !bys_1_1.done; bys_1_1 = bys_1.next()) {
            var by = bys_1_1.value;
            var map = new Map();
            var _loop_1 = function (record) {
                var key = JSON.stringify(fields.map(function (field) { return record[field]; }));
                if (!map.has(key)) {
                    map.set(key, 0);
                }
                map.set(key, map.get(key) + record[by]);
            };
            try {
                for (var dataSource_1 = (e_2 = void 0, __values(dataSource)), dataSource_1_1 = dataSource_1.next(); !dataSource_1_1.done; dataSource_1_1 = dataSource_1.next()) {
                    var record = dataSource_1_1.value;
                    _loop_1(record);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (dataSource_1_1 && !dataSource_1_1.done && (_c = dataSource_1.return)) _c.call(dataSource_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            try {
                for (var map_1 = (e_3 = void 0, __values(map)), map_1_1 = map_1.next(); !map_1_1.done; map_1_1 = map_1.next()) {
                    var _h = __read(map_1_1.value, 2), key = _h[0], value = _h[1];
                    var row = (_e = {
                            index: key
                        },
                        _e[by] = value,
                        _e);
                    var dims = JSON.parse(key);
                    for (var i = 0; i < fields.length; i++) {
                        row[fields[i]] = dims[i];
                    }
                    tmp.push(row);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (map_1_1 && !map_1_1.done && (_d = map_1.return)) _d.call(map_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (bys_1_1 && !bys_1_1.done && (_b = bys_1.return)) _b.call(bys_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var ans = new Map();
    try {
        for (var tmp_1 = __values(tmp), tmp_1_1 = tmp_1.next(); !tmp_1_1.done; tmp_1_1 = tmp_1.next()) {
            var record = tmp_1_1.value;
            if (!ans.has(record.index)) {
                ans.set(record.index, {});
            }
            ans.set(record.index, __assign(__assign({}, ans.get(record.index)), record));
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (tmp_1_1 && !tmp_1_1.done && (_f = tmp_1.return)) _f.call(tmp_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return __spreadArray([], __read(ans.values()), false);
}
exports.aggregate = aggregate;
function memberCount(dataSource, field) {
    var e_5, _a;
    var counter = new Map();
    try {
        for (var dataSource_2 = __values(dataSource), dataSource_2_1 = dataSource_2.next(); !dataSource_2_1.done; dataSource_2_1 = dataSource_2.next()) {
            var row = dataSource_2_1.value;
            var member = row[field];
            if (!counter.has(member)) {
                counter.set(member, 0);
            }
            counter.set(member, counter.get(member) + 1);
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (dataSource_2_1 && !dataSource_2_1.done && (_a = dataSource_2.return)) _a.call(dataSource_2);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return __spreadArray([], __read(counter.entries()), false);
}
exports.memberCount = memberCount;
function groupContinousField(_a) {
    var dataSource = _a.dataSource, field = _a.field, _b = _a.newField, newField = _b === void 0 ? "".concat(field, "(con-group)") : _b, groupNumber = _a.groupNumber;
    // const members = memberCount(dataSource, field);
    // todo: outlier detection
    var values = dataSource.map(function (item) { return item[field]; });
    var max = Math.max.apply(Math, __spreadArray([], __read(values), false)); // Number.EPSILON * ;
    var min = Math.min.apply(Math, __spreadArray([], __read(values), false));
    var segWidth = (max - min) / groupNumber;
    var ranges = [];
    for (var i = 0; i < groupNumber; i++) {
        var left = min + i * segWidth;
        var right = min + (i + 1) * segWidth;
        ranges.push([left, right]);
    }
    ranges[0][0] = -Infinity;
    ranges[ranges.length - 1][1] = Infinity;
    var precision = Math.max(1, Math.log10(Math.abs(min)) - Math.log10(segWidth)) + 1;
    var _loop_2 = function (i) {
        var record = dataSource[i];
        var rangeIndex = ranges.findIndex(function (r) { return (r[0] <= record[field] && record[field] < r[1]); });
        var range = ranges[rangeIndex];
        if (typeof range !== 'undefined') {
            record[newField] = "".concat(rangeIndex + 1, ":[").concat(Number(range[0].toPrecision(precision)), ", ").concat(Number(range[1].toPrecision(precision)), ")");
        }
        else {
            record[newField] = 'null';
        }
    };
    for (var i = 0; i < dataSource.length; i++) {
        _loop_2(i);
    }
    return dataSource;
}
exports.groupContinousField = groupContinousField;
function groupCategoryField(_a) {
    var e_6, _b;
    var dataSource = _a.dataSource, field = _a.field, _c = _a.newField, newField = _c === void 0 ? "".concat(field, "(cat-group)") : _c, groupNumber = _a.groupNumber;
    // auto category should obey Power law distrubution.
    var members = memberCount(dataSource, field);
    members.sort(function (a, b) { return b[1] - a[1]; });
    var sum = members.map(function (v) { return v[1]; });
    groupNumber = members.length;
    for (var i = sum.length - 2; i >= 0; i--) {
        sum[i] = sum[i + 1] + sum[i];
    }
    for (var i = 0; i < members.length - 2; i++) {
        // strict mode
        // if (members[i][1] >= sum[i + 1] && members[i + 1][1] < sum[i + 2]) {
        if (members[i][1] * MAGIC_NUMBER >= sum[i + 1] && members[i + 1][1] / MAGIC_NUMBER < sum[i + 2]) {
            groupNumber = i + 2;
            break;
        }
    }
    // groupNumber = Math.max(Math.round(Math.sqrt(members.length)), groupNumber)
    if (groupNumber === members.length) {
        return dataSource.map(function (record) {
            var _a;
            return __assign(__assign({}, record), (_a = {}, _a[newField] = record[field], _a));
        });
    }
    var set = new Set();
    for (var i = groupNumber - 1; i < members.length; i++) {
        set.add(members[i][0]);
    }
    try {
        for (var dataSource_3 = __values(dataSource), dataSource_3_1 = dataSource_3.next(); !dataSource_3_1.done; dataSource_3_1 = dataSource_3.next()) {
            var record = dataSource_3_1.value;
            if (set.has(record[field])) {
                record[newField] = 'others';
            }
            else {
                record[newField] = record[field];
            }
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (dataSource_3_1 && !dataSource_3_1.done && (_b = dataSource_3.return)) _b.call(dataSource_3);
        }
        finally { if (e_6) throw e_6.error; }
    }
    return dataSource;
}
exports.groupCategoryField = groupCategoryField;
/**
 * Kullback–Leibler divergence
 * @param p1List
 * @param p2List
 *
 */
function DKL(p1List, p2List) {
    var sum = 0;
    var len = Math.max(p1List.length, p2List.length);
    for (var i = 0; i < len; i++) {
        var p1 = p1List[i] || 0;
        var p2 = p2List[i] || 0;
        sum += p1 * Math.log2(p1 / p2);
    }
    return sum;
}
exports.DKL = DKL;
function isFieldUnique(dataSource, field) {
    var set = new Set();
    var validCount = 0;
    var len = dataSource.length;
    for (var i = 0; i < len; i++) {
        if (dataSource[i][field] !== undefined && dataSource[i][field] !== null && dataSource[i][field] !== '') {
            validCount++;
            set.add(dataSource[i][field]);
        }
    }
    if (set.size === validCount)
        return true;
    return false;
}
exports.isFieldUnique = isFieldUnique;
function subset2theOther(A, B) {
    var e_7, _a;
    var smallArr = A.length > B.length ? B : A;
    var largeSet = A.length > B.length ? new Set(A) : new Set(B);
    try {
        for (var smallArr_1 = __values(smallArr), smallArr_1_1 = smallArr_1.next(); !smallArr_1_1.done; smallArr_1_1 = smallArr_1.next()) {
            var str = smallArr_1_1.value;
            if (!largeSet.has(str))
                return false;
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (smallArr_1_1 && !smallArr_1_1.done && (_a = smallArr_1.return)) _a.call(smallArr_1);
        }
        finally { if (e_7) throw e_7.error; }
    }
    return true;
}
exports.subset2theOther = subset2theOther;
