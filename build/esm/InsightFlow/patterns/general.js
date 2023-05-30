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
exports.viewStrength = exports.meaImp = exports.entropyAcc = void 0;
var BIN_SIZE = 8;
function entropyAcc(fl) {
    var total = 0;
    for (var i = 0; i < fl.length; i++) {
        total += fl[i];
    }
    var tLog = Math.log2(total);
    var ent = 0;
    for (var i = 0; i < fl.length; i++) {
        ent = ent + fl[i] * (Math.log2(fl[i]) - tLog) / total;
    }
    return -ent;
}
exports.entropyAcc = entropyAcc;
function meaImp(dataSource, mea, minValue, maxValue) {
    var e_1, _a;
    // const _min = typeof minValue !== 'undefined' ? minValue : Math.min(...dataSource.map(d => d[mea]));
    // const _max = typeof maxValue !== 'undefined' ? maxValue : Math.max(...dataSource.map(d => d[mea]));
    var _min = minValue;
    var _max = maxValue;
    var step = (_max - _min) / BIN_SIZE;
    var dist = new Array(BIN_SIZE + 1).fill(0);
    try {
        for (var dataSource_1 = __values(dataSource), dataSource_1_1 = dataSource_1.next(); !dataSource_1_1.done; dataSource_1_1 = dataSource_1.next()) {
            var record = dataSource_1_1.value;
            var vIndex = Math.floor((record[mea] - _min) / step);
            dist[vIndex]++;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (dataSource_1_1 && !dataSource_1_1.done && (_a = dataSource_1.return)) _a.call(dataSource_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    dist[BIN_SIZE - 1] += dist[BIN_SIZE];
    // const pl = normalize(dist.filter(d => d > 0));
    var ent = entropyAcc(dist.slice(0, BIN_SIZE).filter(function (d) { return d > 0; }));
    return ent;
}
exports.meaImp = meaImp;
function viewStrength(dataSource, dimensions, measures) {
    var e_2, _a, e_3, _b;
    var _c;
    var groups = new Map();
    var _loop_1 = function (record) {
        var _key = dimensions.map(function (d) { return record[d]; }).join('_');
        if (!groups.has(_key)) {
            groups.set(_key, []);
        }
        (_c = groups.get(_key)) === null || _c === void 0 ? void 0 : _c.push(record);
    };
    try {
        for (var dataSource_2 = __values(dataSource), dataSource_2_1 = dataSource_2.next(); !dataSource_2_1.done; dataSource_2_1 = dataSource_2.next()) {
            var record = dataSource_2_1.value;
            _loop_1(record);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (dataSource_2_1 && !dataSource_2_1.done && (_a = dataSource_2.return)) _a.call(dataSource_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    var totalEntLoss = 0;
    var _loop_2 = function (mea) {
        var _min = Math.min.apply(Math, __spreadArray([], __read(dataSource.map(function (d) { return d[mea]; })), false));
        var _max = Math.max.apply(Math, __spreadArray([], __read(dataSource.map(function (d) { return d[mea]; })), false));
        ;
        var ent = meaImp(dataSource, mea, _min, _max);
        // conditional ent
        var condEnt = 0;
        var logs = [];
        var entries = __spreadArray([], __read(groups.entries()), false);
        entries.sort(function (a, b) { return b[1].length - a[1].length; });
        for (var i = 0; i < entries.length; i++) {
            if (i >= BIN_SIZE - 1)
                break;
            var groupRows = entries[i][1];
            var groupProb = groupRows.length / dataSource.length;
            var subEnt = meaImp(groupRows, mea, _min, _max);
            condEnt += groupProb * subEnt;
            logs.push([groupProb, subEnt]);
        }
        var noiseGroup = [];
        for (var i = BIN_SIZE - 1; i < entries.length; i++) {
            noiseGroup.push.apply(noiseGroup, __spreadArray([], __read(entries[i][1]), false));
        }
        if (noiseGroup.length > 0) {
            var groupProb = noiseGroup.length / dataSource.length;
            var subEnt = meaImp(noiseGroup, mea, _min, _max);
            condEnt += groupProb * subEnt;
        }
        // for (let [groupKey, groupRows] of groups.entries()) {
        //     let groupProb = groupRows.length / dataSource.length;
        //     const subEnt = meaImp(groupRows, mea, _min, _max);
        //     condEnt += groupProb * subEnt;
        //     logs.push([groupProb, subEnt])
        // }
        // console.log(logs)
        // console.log('H(X), H(X|Y)]]]]]]', ent, condEnt)
        totalEntLoss += noiseGroup.length > 0 ? (ent - condEnt) / Math.log2(BIN_SIZE) : (ent - condEnt) / Math.log2(groups.size);
    };
    try {
        for (var measures_1 = __values(measures), measures_1_1 = measures_1.next(); !measures_1_1.done; measures_1_1 = measures_1.next()) {
            var mea = measures_1_1.value;
            _loop_2(mea);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (measures_1_1 && !measures_1_1.done && (_b = measures_1.return)) _b.call(measures_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    // const groupFL: number[] = [];
    // for (let rows of groups.values()) {
    //     groupFL.push(rows.length);
    // }
    // totalEntLoss = totalEntLoss / Math.log2(groups.size)//groups.size;
    // console.log({ dimensions, measures, score: totalEntLoss / measures.length, totalEntLoss })
    return totalEntLoss / measures.length;
}
exports.viewStrength = viewStrength;
