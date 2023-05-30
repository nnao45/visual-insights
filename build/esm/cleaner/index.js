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
exports.dropNullColumn = exports.useMode = exports.dropNull = exports.simpleClean = void 0;
var index_1 = require("../utils/index");
function dropNullColumn(dataSource, fields) {
    var e_1, _a;
    var keepFields = fields.map(function () { return false; });
    try {
        for (var dataSource_1 = __values(dataSource), dataSource_1_1 = dataSource_1.next(); !dataSource_1_1.done; dataSource_1_1 = dataSource_1.next()) {
            var record = dataSource_1_1.value;
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                if (typeof record[field] !== 'undefined' && record[field] !== '' && record[field] !== null) {
                    keepFields[i] = true;
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (dataSource_1_1 && !dataSource_1_1.done && (_a = dataSource_1.return)) _a.call(dataSource_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var finalFields = fields.filter(function (field, index) {
        return keepFields[index];
    });
    return {
        fields: finalFields,
        dataSource: dataSource.map(function (record) {
            var e_2, _a;
            var ans = {};
            try {
                for (var finalFields_1 = __values(finalFields), finalFields_1_1 = finalFields_1.next(); !finalFields_1_1.done; finalFields_1_1 = finalFields_1.next()) {
                    var field = finalFields_1_1.value;
                    ans[field] = record[field];
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (finalFields_1_1 && !finalFields_1_1.done && (_a = finalFields_1.return)) _a.call(finalFields_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return ans;
        })
    };
}
exports.dropNullColumn = dropNullColumn;
function dropNull(dataSource, dimensions, measures) {
    var e_3, _a, e_4, _b, e_5, _c;
    var data = [];
    try {
        for (var dataSource_2 = __values(dataSource), dataSource_2_1 = dataSource_2.next(); !dataSource_2_1.done; dataSource_2_1 = dataSource_2.next()) {
            var record = dataSource_2_1.value;
            var keep = true;
            try {
                for (var dimensions_1 = (e_4 = void 0, __values(dimensions)), dimensions_1_1 = dimensions_1.next(); !dimensions_1_1.done; dimensions_1_1 = dimensions_1.next()) {
                    var dim = dimensions_1_1.value;
                    if (typeof record[dim] === 'undefined' || record[dim] === '' || record[dim] === null) {
                        keep = false;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (dimensions_1_1 && !dimensions_1_1.done && (_b = dimensions_1.return)) _b.call(dimensions_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
            try {
                for (var measures_1 = (e_5 = void 0, __values(measures)), measures_1_1 = measures_1.next(); !measures_1_1.done; measures_1_1 = measures_1.next()) {
                    var mea = measures_1_1.value;
                    if (typeof record[mea] !== 'number') {
                        keep = false;
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (measures_1_1 && !measures_1_1.done && (_c = measures_1.return)) _c.call(measures_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
            if (keep) {
                data.push(record);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (dataSource_2_1 && !dataSource_2_1.done && (_a = dataSource_2.return)) _a.call(dataSource_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return data;
}
exports.dropNull = dropNull;
function isNullValue(value) {
    return ['', null, undefined].includes(value);
}
/**
 * use mode of one field to replace its null value
 * @param dataSource
 * @param fieldNames name list of fields you want to clean with useMode function.
 * problem: some field may regard the null value as the most common value... sad : (.
 * I am dead.
 */
function useMode(dataSource, fieldNames) {
    var e_6, _a, e_7, _b, e_8, _c, e_9, _d, e_10, _e, e_11, _f;
    /**
     * map to count each member's times of apperance in fields.
     */
    var countMap = new Map();
    /**
     * map to get the mode member of each field.
     */
    var modeMap = new Map();
    try {
        for (var fieldNames_1 = __values(fieldNames), fieldNames_1_1 = fieldNames_1.next(); !fieldNames_1_1.done; fieldNames_1_1 = fieldNames_1.next()) {
            var fieldName = fieldNames_1_1.value;
            countMap.set(fieldName, new Map());
            modeMap.set(fieldName, 0);
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (fieldNames_1_1 && !fieldNames_1_1.done && (_a = fieldNames_1.return)) _a.call(fieldNames_1);
        }
        finally { if (e_6) throw e_6.error; }
    }
    try {
        for (var dataSource_3 = __values(dataSource), dataSource_3_1 = dataSource_3.next(); !dataSource_3_1.done; dataSource_3_1 = dataSource_3.next()) {
            var record = dataSource_3_1.value;
            try {
                for (var fieldNames_2 = (e_8 = void 0, __values(fieldNames)), fieldNames_2_1 = fieldNames_2.next(); !fieldNames_2_1.done; fieldNames_2_1 = fieldNames_2.next()) {
                    var fieldName = fieldNames_2_1.value;
                    var counter = countMap.get(fieldName);
                    if (!isNullValue(record[fieldName])) {
                        if (!counter.has(record[fieldName])) {
                            counter.set(record[fieldName], 0);
                        }
                        counter.set(record[fieldName], counter.get(record[fieldName]) + 1);
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (fieldNames_2_1 && !fieldNames_2_1.done && (_c = fieldNames_2.return)) _c.call(fieldNames_2);
                }
                finally { if (e_8) throw e_8.error; }
            }
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (dataSource_3_1 && !dataSource_3_1.done && (_b = dataSource_3.return)) _b.call(dataSource_3);
        }
        finally { if (e_7) throw e_7.error; }
    }
    try {
        for (var _g = __values(countMap.keys()), _h = _g.next(); !_h.done; _h = _g.next()) {
            var key = _h.value;
            var counter = countMap.get(key);
            var members = __spreadArray([], __read(counter.entries()), false);
            var max = 0;
            var maxPos = 0;
            for (var i = 0; i < members.length; i++) {
                var member = members[i];
                if (member[1] > max) {
                    max = member[1];
                    maxPos = i;
                }
            }
            modeMap.set(key, members[maxPos][0]);
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (_h && !_h.done && (_d = _g.return)) _d.call(_g);
        }
        finally { if (e_9) throw e_9.error; }
    }
    var newDataSource = (0, index_1.deepcopy)(dataSource);
    try {
        for (var newDataSource_1 = __values(newDataSource), newDataSource_1_1 = newDataSource_1.next(); !newDataSource_1_1.done; newDataSource_1_1 = newDataSource_1.next()) {
            var record = newDataSource_1_1.value;
            try {
                for (var fieldNames_3 = (e_11 = void 0, __values(fieldNames)), fieldNames_3_1 = fieldNames_3.next(); !fieldNames_3_1.done; fieldNames_3_1 = fieldNames_3.next()) {
                    var fieldName = fieldNames_3_1.value;
                    if (isNullValue(record[fieldName])) {
                        record[fieldName] = modeMap.get(fieldName);
                    }
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (fieldNames_3_1 && !fieldNames_3_1.done && (_f = fieldNames_3.return)) _f.call(fieldNames_3);
                }
                finally { if (e_11) throw e_11.error; }
            }
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (newDataSource_1_1 && !newDataSource_1_1.done && (_e = newDataSource_1.return)) _e.call(newDataSource_1);
        }
        finally { if (e_10) throw e_10.error; }
    }
    return newDataSource;
}
exports.useMode = useMode;
function simpleClean(dataSource, dimensions, measures) {
    var e_12, _a, e_13, _b, e_14, _c;
    var newDataSource = (0, index_1.deepcopy)(dataSource);
    try {
        for (var dataSource_4 = __values(dataSource), dataSource_4_1 = dataSource_4.next(); !dataSource_4_1.done; dataSource_4_1 = dataSource_4.next()) {
            var record = dataSource_4_1.value;
            try {
                for (var dimensions_2 = (e_13 = void 0, __values(dimensions)), dimensions_2_1 = dimensions_2.next(); !dimensions_2_1.done; dimensions_2_1 = dimensions_2.next()) {
                    var dim = dimensions_2_1.value;
                    if (isNullValue(record[dim])) {
                        record[dim] = 'null';
                    }
                }
            }
            catch (e_13_1) { e_13 = { error: e_13_1 }; }
            finally {
                try {
                    if (dimensions_2_1 && !dimensions_2_1.done && (_b = dimensions_2.return)) _b.call(dimensions_2);
                }
                finally { if (e_13) throw e_13.error; }
            }
            try {
                for (var measures_2 = (e_14 = void 0, __values(measures)), measures_2_1 = measures_2.next(); !measures_2_1.done; measures_2_1 = measures_2.next()) {
                    var mea = measures_2_1.value;
                    if (isNullValue(record[mea])) {
                        record[mea] = 0;
                    }
                }
            }
            catch (e_14_1) { e_14 = { error: e_14_1 }; }
            finally {
                try {
                    if (measures_2_1 && !measures_2_1.done && (_c = measures_2.return)) _c.call(measures_2);
                }
                finally { if (e_14) throw e_14.error; }
            }
        }
    }
    catch (e_12_1) { e_12 = { error: e_12_1 }; }
    finally {
        try {
            if (dataSource_4_1 && !dataSource_4_1.done && (_a = dataSource_4.return)) _a.call(dataSource_4);
        }
        finally { if (e_12) throw e_12.error; }
    }
    return newDataSource;
}
exports.simpleClean = simpleClean;
