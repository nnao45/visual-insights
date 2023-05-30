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
exports.stdAggregateFromCuboid = exports.getAggHashKey = exports.stdAggregate = exports.simpleAggregate = exports.fastGroupBy = exports.groupByDev = exports.encodeRowsByValueMap = exports.getValueMapList = exports.groupBy = exports.getAggregator = exports.SFMapper = void 0;
var aggregators_1 = require("./aggregators");
var aggregators_2 = require("./aggregators");
var SPLITOR = '_@_';
var count = function (x) {
    return x.length;
};
exports.SFMapper = {
    sum: aggregators_1.sum,
    max: aggregators_1.max,
    mean: aggregators_1.mean,
    min: aggregators_1.min,
    count: count
};
function getAggregator(op) {
    var func = exports.SFMapper[op] || aggregators_1.sum;
    return func;
}
exports.getAggregator = getAggregator;
function groupBy(rows, by) {
    var e_1, _a;
    var groups = new Map();
    var _loop_1 = function (record) {
        var key = by.map(function (d) { return record[d]; }).join(SPLITOR);
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(record);
    };
    try {
        for (var rows_1 = __values(rows), rows_1_1 = rows_1.next(); !rows_1_1.done; rows_1_1 = rows_1.next()) {
            var record = rows_1_1.value;
            _loop_1(record);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (rows_1_1 && !rows_1_1.done && (_a = rows_1.return)) _a.call(rows_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return groups;
}
exports.groupBy = groupBy;
function getValueMapList(rows, by) {
    var valueMapList = [];
    var reverseValueList = [];
    for (var i = 0; i < by.length; i++) {
        var valueMap = new Map();
        var valueIndices = [];
        var size = 0;
        for (var j = 0; j < rows.length; j++) {
            // valueIndices.push()
            if (!valueMap.has(rows[j][by[i]])) {
                valueIndices.push(rows[j][by[i]]);
                valueMap.set(rows[j][by[i]], size);
                size++;
            }
        }
        reverseValueList.push(valueIndices);
        valueMapList.push(valueMap);
    }
    return valueMapList;
}
exports.getValueMapList = getValueMapList;
function encodeRowsByValueMap(rows, dimensions, valueMapList) {
    return rows.map(function (r) {
        var nr = __assign({}, r);
        dimensions.forEach(function (d, di) {
            nr[d] = valueMapList[di].get(r[d]);
        });
        return nr;
    });
}
exports.encodeRowsByValueMap = encodeRowsByValueMap;
function groupByDev(rows, by, valueMapList) {
    var e_2, _a;
    var groups = new Map();
    var _loop_2 = function (record) {
        // const key = by.map((d) => record[d]).join(SPLITOR);
        var key = by.map(function (d, di) { return valueMapList[di].get(record[d]); }).join(SPLITOR);
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(record);
    };
    try {
        // const valueMapList: Map<any, number>[] = [];
        // const reverseValueList: any[][] = [];
        // for (let i = 0; i < by.length; i++) {
        //     const valueMap: Map<any, number> = new Map();
        //     const valueIndices: any[] = [];
        //     let size = 0;
        //     for (let j = 0; j < rows.length; j++) {
        //         // valueIndices.push()
        //         if (!valueMap.has(rows[j][by[i]])) {
        //             valueIndices.push(rows[j][by[i]])
        //             valueMap.set(rows[j][by[i]], size);
        //             size++;
        //         }
        //     }
        //     reverseValueList.push(valueIndices);
        //     valueMapList.push(valueMap);
        // }
        for (var rows_2 = __values(rows), rows_2_1 = rows_2.next(); !rows_2_1.done; rows_2_1 = rows_2.next()) {
            var record = rows_2_1.value;
            _loop_2(record);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (rows_2_1 && !rows_2_1.done && (_a = rows_2.return)) _a.call(rows_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return groups;
}
exports.groupByDev = groupByDev;
function fastGroupBy(rows, by) {
    var e_3, _a, e_4, _b, e_5, _c;
    var groups = [__spreadArray([], __read(rows), false)];
    try {
        for (var by_1 = __values(by), by_1_1 = by_1.next(); !by_1_1.done; by_1_1 = by_1.next()) {
            var groupKey = by_1_1.value;
            var ungrouped = groups.splice(0, groups.length);
            var hashMap = new Map();
            try {
                for (var ungrouped_1 = (e_4 = void 0, __values(ungrouped)), ungrouped_1_1 = ungrouped_1.next(); !ungrouped_1_1.done; ungrouped_1_1 = ungrouped_1.next()) {
                    var prevGrp = ungrouped_1_1.value;
                    try {
                        // const hashMap = new Map<string | number, number>();
                        for (var prevGrp_1 = (e_5 = void 0, __values(prevGrp)), prevGrp_1_1 = prevGrp_1.next(); !prevGrp_1_1.done; prevGrp_1_1 = prevGrp_1.next()) {
                            var d = prevGrp_1_1.value;
                            var idx = hashMap.get(d[groupKey]);
                            if (idx === undefined) {
                                groups.push([]);
                                idx = groups.length - 1;
                                hashMap.set(d[groupKey], idx);
                            }
                            groups[idx].push(d);
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (prevGrp_1_1 && !prevGrp_1_1.done && (_c = prevGrp_1.return)) _c.call(prevGrp_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                    hashMap.clear();
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (ungrouped_1_1 && !ungrouped_1_1.done && (_b = ungrouped_1.return)) _b.call(ungrouped_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (by_1_1 && !by_1_1.done && (_a = by_1.return)) _a.call(by_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return groups;
}
exports.fastGroupBy = fastGroupBy;
function simpleAggregate(props) {
    var e_6, _a;
    var dataSource = props.dataSource, dimensions = props.dimensions, measures = props.measures, ops = props.ops;
    var groups = groupBy(dataSource, dimensions);
    var result = [];
    var _loop_3 = function (key, group) {
        var aggs = {};
        measures.forEach(function (mea, meaIndex) {
            var opFunc = getAggregator(ops[meaIndex]);
            aggs[mea] = opFunc(group.map(function (r) { return r[mea]; }));
        });
        var dimValues = key.split(SPLITOR);
        dimensions.forEach(function (dim, dimIndex) {
            aggs[dim] = dimValues[dimIndex];
        });
        result.push(aggs);
    };
    try {
        for (var groups_1 = __values(groups), groups_1_1 = groups_1.next(); !groups_1_1.done; groups_1_1 = groups_1.next()) {
            var _b = __read(groups_1_1.value, 2), key = _b[0], group = _b[1];
            _loop_3(key, group);
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (groups_1_1 && !groups_1_1.done && (_a = groups_1.return)) _a.call(groups_1);
        }
        finally { if (e_6) throw e_6.error; }
    }
    return result;
}
exports.simpleAggregate = simpleAggregate;
function stdAggregate(props) {
    var e_7, _a;
    var dataSource = props.dataSource, dimensions = props.dimensions, measures = props.measures, ops = props.ops;
    var groups = groupBy(dataSource, dimensions);
    var result = [];
    var _loop_4 = function (key, group) {
        // for (let group of groups) {
        var aggs = {
            groupDict: {},
            stat: {}
        };
        measures.forEach(function (mea, meaIndex) {
            aggs.stat[mea] = {};
            ops.forEach(function (op) {
                var opFunc = getAggregator(op);
                aggs.stat[mea][op] = opFunc(group.map(function (r) { return r[mea]; }));
            });
        });
        var dimValues = key.split(SPLITOR);
        dimensions.forEach(function (dim, dimIndex) {
            aggs.groupDict[dim] = dimValues[dimIndex];
        });
        result.push(aggs);
    };
    try {
        for (var groups_2 = __values(groups), groups_2_1 = groups_2.next(); !groups_2_1.done; groups_2_1 = groups_2.next()) {
            var _b = __read(groups_2_1.value, 2), key = _b[0], group = _b[1];
            _loop_4(key, group);
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (groups_2_1 && !groups_2_1.done && (_a = groups_2.return)) _a.call(groups_2);
        }
        finally { if (e_7) throw e_7.error; }
    }
    return result;
}
exports.stdAggregate = stdAggregate;
function getAggHashKey(values) {
    return values.join(SPLITOR);
}
exports.getAggHashKey = getAggHashKey;
function cuboidStateGroupBy(state, by) {
    var e_8, _a;
    var groups = new Map();
    var _loop_5 = function (record) {
        var key = by.map(function (d) { return record.groupDict[d]; }).join(SPLITOR);
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(record);
    };
    try {
        for (var state_1 = __values(state), state_1_1 = state_1.next(); !state_1_1.done; state_1_1 = state_1.next()) {
            var record = state_1_1.value;
            _loop_5(record);
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (state_1_1 && !state_1_1.done && (_a = state_1.return)) _a.call(state_1);
        }
        finally { if (e_8) throw e_8.error; }
    }
    return groups;
}
function fastCuboidStateGroupBy(state, by) {
    var e_9, _a, e_10, _b, e_11, _c, e_12, _d;
    var t0 = 0, t1 = 0, t2 = 0, t3 = 0;
    t0 = performance.now();
    var groups1 = new Map();
    var _loop_6 = function (record) {
        var key = by.map(function (d) { return record.groupDict[d]; }).join(SPLITOR);
        if (!groups1.has(key)) {
            groups1.set(key, []);
        }
        groups1.get(key).push(record);
    };
    try {
        for (var state_2 = __values(state), state_2_1 = state_2.next(); !state_2_1.done; state_2_1 = state_2.next()) {
            var record = state_2_1.value;
            _loop_6(record);
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (state_2_1 && !state_2_1.done && (_a = state_2.return)) _a.call(state_2);
        }
        finally { if (e_9) throw e_9.error; }
    }
    t1 = performance.now();
    groups1.clear();
    t2 = performance.now();
    var groups = [__spreadArray([], __read(state), false)];
    try {
        for (var by_2 = __values(by), by_2_1 = by_2.next(); !by_2_1.done; by_2_1 = by_2.next()) {
            var groupKey = by_2_1.value;
            var ungrouped = groups.splice(0, groups.length);
            try {
                for (var ungrouped_2 = (e_11 = void 0, __values(ungrouped)), ungrouped_2_1 = ungrouped_2.next(); !ungrouped_2_1.done; ungrouped_2_1 = ungrouped_2.next()) {
                    var prevGrp = ungrouped_2_1.value;
                    var hashMap = new Map();
                    try {
                        for (var prevGrp_2 = (e_12 = void 0, __values(prevGrp)), prevGrp_2_1 = prevGrp_2.next(); !prevGrp_2_1.done; prevGrp_2_1 = prevGrp_2.next()) {
                            var d = prevGrp_2_1.value;
                            var idx = hashMap.get(d.groupDict[groupKey]);
                            if (idx === undefined) {
                                groups.push([]);
                                idx = groups.length - 1;
                                hashMap.set(d.groupDict[groupKey], idx);
                            }
                            groups[idx].push(d);
                        }
                    }
                    catch (e_12_1) { e_12 = { error: e_12_1 }; }
                    finally {
                        try {
                            if (prevGrp_2_1 && !prevGrp_2_1.done && (_d = prevGrp_2.return)) _d.call(prevGrp_2);
                        }
                        finally { if (e_12) throw e_12.error; }
                    }
                    hashMap.clear();
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (ungrouped_2_1 && !ungrouped_2_1.done && (_c = ungrouped_2.return)) _c.call(ungrouped_2);
                }
                finally { if (e_11) throw e_11.error; }
            }
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (by_2_1 && !by_2_1.done && (_b = by_2.return)) _b.call(by_2);
        }
        finally { if (e_10) throw e_10.error; }
    }
    t3 = performance.now();
    console.log({
        old: t1 - t0,
        new: t3 - t2
    });
    return groups;
}
function stdAggregateFromCuboid(props) {
    var e_13, _a;
    var cuboidState = props.cuboidState, dimensions = props.dimensions, measures = props.measures, ops = props.ops;
    var groups = cuboidStateGroupBy(cuboidState, dimensions);
    // const groups = fastCuboidStateGroupBy(cuboidState, dimensions)
    var result = [];
    // TODO: need a formal solution for distributive\algebraic\holistic aggregators.
    var generalOpNames = ops.filter(function (op) { return !(['sum', 'count', 'mean', 'dist'].includes(op)); });
    var generalOps = generalOpNames.map(function (opName) { return getAggregator(opName); });
    var _loop_7 = function (key, group) {
        // for (let group of groups) {
        var aggs = {
            groupDict: {},
            stat: {}
        };
        var _loop_8 = function (meaIndex) {
            var mea = measures[meaIndex];
            aggs.stat[mea] = {};
            generalOps.forEach(function (op, opIndex) {
                var opName = generalOpNames[opIndex];
                aggs.stat[mea][opName] = op(group.map(function (r) { return r.stat[mea][opName]; }));
            });
            // 讨论：描述的简洁性 vs 性能
            aggs.stat[mea]["sum"] = (0, aggregators_2.sumByCol)(group, mea, 'sum');
            aggs.stat[mea]["count"] = (0, aggregators_2.sumByCol)(group, mea, 'count');
            // aggs[mea]["sum"] = getAggregator('sum')(group.map((r) => r[mea]["sum"]));
            // aggs[mea]["count"] = getAggregator('sum')(group.map((r) => r[mea]['count']));
            aggs.stat[mea]["mean"] = aggs.stat[mea]['sum'] / aggs.stat[mea]['count'];
            aggs.stat[mea]['dist'] = (0, aggregators_2.distMergeBy)(group, mea, 'dist');
        };
        for (var meaIndex = 0; meaIndex < measures.length; meaIndex++) {
            _loop_8(meaIndex);
        }
        var dimValues = key.split(SPLITOR);
        for (var dimIndex = 0; dimIndex < dimensions.length; dimIndex++) {
            aggs.groupDict[dimensions[dimIndex]] = dimValues[dimIndex];
        }
        result.push(aggs);
    };
    try {
        for (var groups_3 = __values(groups), groups_3_1 = groups_3.next(); !groups_3_1.done; groups_3_1 = groups_3.next()) {
            var _b = __read(groups_3_1.value, 2), key = _b[0], group = _b[1];
            _loop_7(key, group);
        }
    }
    catch (e_13_1) { e_13 = { error: e_13_1 }; }
    finally {
        try {
            if (groups_3_1 && !groups_3_1.done && (_a = groups_3.return)) _a.call(groups_3);
        }
        finally { if (e_13) throw e_13.error; }
    }
    return result;
}
exports.stdAggregateFromCuboid = stdAggregateFromCuboid;
