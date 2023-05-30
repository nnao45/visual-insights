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
exports.labDistVis = exports.geomTypeMap = void 0;
var statistics_1 = require("../statistics");
var utils_1 = require("../utils");
exports.geomTypeMap = {
    interval: "boxplot",
    line: "line",
    point: "point",
    // density: 'rect'
    density: "point"
};
var channels = {
    quantitative: ['y', 'x', 'size', 'opacity', 'color'],
    ordinal: ['y', 'x', 'opacity', 'color', 'size', 'shape'],
    nominal: ['y', 'x', 'color', 'row', 'column', 'opacity', 'size', 'shape'],
    temporal: ['y', 'x', 'size', 'color', 'opacity', 'shape']
};
// const channels = {
//     quantitative: ['y' , 'x', 'size', 'color', 'opacity'],
//     ordinal: ['y', 'x', 'color', 'size', 'shape'],
//     nominal: ['y', 'x', 'color', 'row', 'column', 'size', 'shape'],
//     temporal: ['y', 'x', 'color', 'shape']
// } as const;
var highOrderChannels = {
    dimension: ['row', 'column'],
    measure: ['repeat']
};
function humanHabbit(encoding) {
    if (encoding.x && encoding.x.type !== 'temporal') {
        if (encoding.y && encoding.y.type === 'temporal') {
            var t = encoding.x;
            encoding.x = encoding.y;
            encoding.y = t;
        }
    }
}
function encode(props) {
    var fields = props.fields, _a = props.usedChannels, usedChannels = _a === void 0 ? new Set() : _a, _b = props.statFields, statFields = _b === void 0 ? [] : _b, _c = props.statEncodes, statEncodes = _c === void 0 ? [] : _c;
    var orderFields = __spreadArray([], __read(fields), false);
    var encoding = {};
    var inHighOrderStatus = null;
    var highOrderIndex = 0;
    orderFields.sort(function (a, b) { return b.features.entropy - a.features.entropy; });
    statFields.sort(function (a, b) { return b.features.entropy - a.features.entropy; });
    var totalFields = __spreadArray(__spreadArray([], __read(statFields), false), __read(orderFields), false).sort(function (a, b) { return b.features.entropy - a.features.entropy; });
    var _loop_1 = function (i) {
        var chs = channels[totalFields[i].semanticType];
        var encoded = false;
        var statIndex = statFields.findIndex(function (f) { return f.fid === totalFields[i].fid; });
        var orderIndex = orderFields.findIndex(function (f) { return f.fid === totalFields[i].fid; });
        var isStatField = statIndex > -1;
        if (isStatField) {
            for (var j = 0; j < chs.length; j++) {
                if (!usedChannels.has(chs[j])) {
                    encoding[chs[j]] = statEncodes[statIndex];
                    usedChannels.add(chs[j]);
                    encoded = true;
                    // if (statFields[statIndex].semanticType === 'quantitative') {
                    //     if (statFields[statIndex].features.entropy / Math.log2(16) > 0.8) {
                    //         encoding[chs[j]].scale = { type: 'sqrt' }
                    //     }
                    // }
                    break;
                }
            }
            // 发生可能很低
            // FIXME 多度量repeat设计
            if (!encoded) {
                inHighOrderStatus = statFields[statIndex].analyticType;
                if (inHighOrderStatus === 'dimension' && highOrderIndex < highOrderChannels[inHighOrderStatus].length) {
                    encoding[highOrderChannels[inHighOrderStatus][highOrderIndex]] = statEncodes[statIndex];
                    highOrderIndex++;
                }
            }
        }
        else {
            for (var j = 0; j < chs.length; j++) {
                if (!usedChannels.has(chs[j])) {
                    encoding[chs[j]] = {
                        field: orderFields[orderIndex].fid,
                        type: orderFields[orderIndex].semanticType,
                        title: orderFields[orderIndex].name || orderFields[orderIndex].fid
                    };
                    if (orderFields[orderIndex].semanticType === 'temporal' && chs[j] === 'color') {
                        encoding[chs[j]].scale = {
                            scheme: 'viridis'
                        };
                    }
                    // if (orderFields[orderIndex].semanticType === 'quantitative') {
                    //     if (orderFields[orderIndex].features.entropy / Math.log2(16) > 0.8) {
                    //         encoding[chs[j]].scale = { type: 'sqrt' }
                    //     }
                    // }
                    usedChannels.add(chs[j]);
                    encoded = true;
                    break;
                }
            }
            if (!encoded) {
                inHighOrderStatus = orderFields[orderIndex].analyticType;
                if (inHighOrderStatus === 'dimension' && highOrderIndex < highOrderChannels[inHighOrderStatus].length) {
                    encoding[highOrderChannels[inHighOrderStatus][highOrderIndex]] = {
                        field: orderFields[orderIndex].fid,
                        type: orderFields[orderIndex].semanticType
                    };
                    highOrderIndex++;
                }
            }
        }
    };
    // const totalFields = [...statFields, ...orderFields].sort((a, b) => a.features.entropy - b.features.entropy);
    // orderFields.unshift(...statFields);
    for (var i = 0; i < totalFields.length; i++) {
        _loop_1(i);
    }
    // for (let i = 0; i < statFields.length; i++) {
    //     const chs = channels[statFields[i].semanticType];
    //     let encoded: boolean = false;
    //     for (let j = 0; j < chs.length; j++) {
    //         if (!usedChannels.has(chs[j])) {
    //             encoding[chs[j]] = statEncodes[i]
    //             usedChannels.add(chs[j])
    //             encoded = true;
    //             break;
    //         }
    //     }
    //     // 发生可能很低
    //     if (!encoded) {
    //         inHighOrderStatus = statFields[i].analyticType;
    //         if (inHighOrderStatus === 'dimension' && highOrderIndex < highOrderChannels[inHighOrderStatus].length) {
    //             encoding[highOrderChannels[inHighOrderStatus][highOrderIndex]] = statEncodes[i]
    //             highOrderIndex++
    //         }
    //     }
    // }
    // for (let i = 0; i < orderFields.length; i++) {
    //     const chs = channels[orderFields[i].semanticType];
    //     let encoded: boolean = false;
    //     for (let j = 0; j < chs.length; j++) {
    //         if (!usedChannels.has(chs[j])) {
    //             encoding[chs[j]] = {
    //                 field: orderFields[i].fid,
    //                 type: orderFields[i].semanticType,
    //                 title: orderFields[i].name || orderFields[i].fid
    //             }
    //             usedChannels.add(chs[j])
    //             encoded = true;
    //             break;
    //         }
    //     }
    //     if (!encoded) {
    //         inHighOrderStatus = orderFields[i].analyticType;
    //         if (inHighOrderStatus === 'dimension' && highOrderIndex < highOrderChannels[inHighOrderStatus].length) {
    //             encoding[highOrderChannels[inHighOrderStatus][highOrderIndex]] = {
    //                 field: orderFields[i].fid,
    //                 type: orderFields[i].semanticType
    //             }
    //             highOrderIndex++
    //         }
    //     }
    // }
    return encoding;
}
function isSetEqual(a1, a2) {
    var e_1, _a;
    var s1 = new Set(a1);
    var s2 = new Set(a2);
    if (s1.size !== s2.size)
        return false;
    try {
        for (var s1_1 = __values(s1), s1_1_1 = s1_1.next(); !s1_1_1.done; s1_1_1 = s1_1.next()) {
            var ele = s1_1_1.value;
            if (!s2.has(ele))
                return false;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (s1_1_1 && !s1_1_1.done && (_a = s1_1.return)) _a.call(s1_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return true;
}
function autoMark(fields, statFields, originFields, statEncodes) {
    if (statFields === void 0) { statFields = []; }
    if (originFields === void 0) { originFields = []; }
    if (statEncodes === void 0) { statEncodes = []; }
    // const orderFields = [...fields];
    // const orderStatFields = [...statFields];
    // orderFields.sort((a, b) => b.features.entropy - a.features.entropy);
    // orderStatFields.sort((a, b) => b.features.entropy - a.features.entropy);
    var semantics = __spreadArray(__spreadArray([], __read(statFields), false), __read(originFields), false).sort(function (a, b) { return b.features.entropy - a.features.entropy; }).slice(0, 2).map(function (f) { return f.semanticType; });
    // if (fields.length === 1) {
    //     return 'bar'
    // }
    // FIXME: 时间序列多目标
    // if (statFields.length > 0) {
    //     // 仅对count生效。
    //     return 'bar'
    // }
    if (statEncodes.find(function (f) { return f.aggregate === 'count'; })) {
        return 'bar';
    }
    // if (fields.length === 1) {
    //     return 'bar'
    // }
    var cond_sinleTargets = fields.filter(function (f) { return f.analyticType === 'measure'; }).length === 1;
    if (cond_sinleTargets) {
        if (isSetEqual(semantics, ['nominal', 'nominal'])) {
            return 'text';
        }
        else if (isSetEqual(semantics, ['nominal', 'quantitative'])) {
            return 'bar';
        }
        else if (isSetEqual(semantics, ['ordinal', 'quantitative'])) {
            return 'point';
        }
        else if (isSetEqual(semantics, ['nominal', 'ordinal'])) {
            return 'point';
        }
        else if (isSetEqual(semantics, ['nominal', 'temporal'])) {
            return 'point';
        }
        else if (isSetEqual(semantics, ['quantitative', 'quantitative'])) {
            return 'circle';
        }
        else if (isSetEqual(semantics, ['temporal', 'quantitative'])) {
            return 'line';
        }
    }
    else {
        if (isSetEqual(semantics, ['nominal', 'nominal'])) {
            return 'square';
        }
        else if (isSetEqual(semantics, ['nominal', 'quantitative'])) {
            return 'tick';
        }
        else if (isSetEqual(semantics, ['ordinal', 'quantitative'])) {
            return 'point';
        }
        else if (isSetEqual(semantics, ['nominal', 'ordinal'])) {
            return 'tick';
        }
        else if (isSetEqual(semantics, ['quantitative', 'quantitative'])) {
            return 'circle';
        }
        else if (isSetEqual(semantics, ['nominal', 'temporal'])) {
            return 'point';
        }
    }
    return 'point';
}
function markFixEncoding(markType, usedChannels) {
    if (markType === 'bar') {
        usedChannels.add('size');
        usedChannels.add('shape');
    }
}
// FIXME: 统一aggregate逻辑。
function autoStat(fields) {
    var statFields = [];
    var statEncodes = [];
    var cond_singlefield = fields.length === 1;
    var cond_nonquanmeasure = fields.filter(function (f) { return f.analyticType === 'measure'; }).filter(function (f) { return f.semanticType === 'nominal' || f.semanticType === 'ordinal'; }).length > 0;
    if (cond_singlefield || cond_nonquanmeasure) {
        statFields.push({
            fid: '__tmp_stat_id_unique',
            semanticType: 'quantitative',
            analyticType: 'measure',
            features: {
                entropy: Infinity,
                maxEntropy: Infinity,
                unique: 1000,
                min: 0,
                max: 0
            },
            distribution: []
        });
        statEncodes.push({
            aggregate: 'count'
        });
        fields.filter(function (f) { return f.semanticType === 'quantitative'; }).forEach(function (f) {
            statFields.push(__assign({}, f));
            statEncodes.push({
                field: f.fid,
                title: f.name || f.fid,
                semanticType: f.semanticType,
                bin: true
            });
        });
    }
    else {
        var targets = fields.filter(function (f) { return f.analyticType === 'measure'; });
        // 单目标的场景
        if (targets.length === 1) {
            // 连续型 度量做聚合，非连续型度量做分箱；
            targets.forEach(function (f) {
                statFields.push(__assign({}, f));
                statEncodes.push({
                    field: f.fid,
                    semanticType: f.semanticType,
                    title: "mean(".concat(f.name || f.fid, ")"),
                    aggregate: 'mean'
                });
            });
            fields.filter(function (f) { return f.analyticType === 'dimension' && f.semanticType === 'quantitative'; }).forEach(function (f) {
                statFields.push(__assign({}, f));
                statEncodes.push({
                    field: f.fid,
                    title: f.name || f.fid,
                    semanticType: f.semanticType,
                    bin: true
                });
            });
        }
    }
    var distFields = fields.filter(function (f) { return !statFields.find(function (sf) { return sf.fid === f.fid; }); });
    return { statFields: statFields, distFields: distFields, statEncodes: statEncodes };
}
function labDistVis(props) {
    var pattern = props.pattern, dataSource = props.dataSource;
    var fields = (0, utils_1.deepcopy)(pattern.fields);
    var measures = fields.filter(function (f) { return f.analyticType === 'measure'; });
    var dimensions = fields.filter(function (f) { return f.analyticType === 'dimension'; });
    var _loop_2 = function (i) {
        var score = 0;
        var values1 = dataSource.map(function (r) { return r[measures[i].fid]; });
        var T = (0, statistics_1.binMap)(values1);
        if (measures.length > 1) {
            var _loop_4 = function (j) {
                if (j === i)
                    return "continue";
                var values2 = dataSource.map(function (r) { return r[measures[j].fid]; });
                score += (0, statistics_1.mic)(T, values2);
            };
            for (var j = 0; j < measures.length; j++) {
                _loop_4(j);
            }
            score /= (measures.length - 1);
        }
        else {
            score = Math.log2(16) - (0, statistics_1.entropy)((0, statistics_1.rangeNormilize)((0, statistics_1.bin)(values1).filter(function (v) { return v > 0; })));
        }
        measures[i].features.entropy = score;
    };
    // const TT = dataSource.map(r => dimensions.map(d => `${d.fid}_${r[d.fid]}`).join(','));
    // for (let i = 0; i < measures.length; i++) {
    //     const values = dataSource.map(r => r[measures[i].fid]);
    //     // const ent = pureGeneralConditionH(TT, values);
    //     measures[i].features.entropy = entropy(rangeNormilize(bin(values).filter(v => v > 0)))
    //     // measures[i].features.entropy = measures[i].features.entropy - ent;
    // }
    for (var i = 0; i < measures.length; i++) {
        _loop_2(i);
    }
    var _loop_3 = function (i) {
        var T = dataSource.map(function (r) { return r[dimensions[i].fid]; });
        var totalEntLoss = 0;
        var _loop_5 = function (j) {
            var values = dataSource.map(function (r) { return r[measures[j].fid]; });
            var entLoss = (0, statistics_1.pureGeneralMic)(T, values);
            totalEntLoss += entLoss;
        };
        // if (measures.length === 1) {
        //     const values = dataSource.map(r => r[measures[0].fid]);
        //     const entLoss = generalMic(T, values) // pureGeneralMic(T, values);
        //     totalEntLoss += entLoss;
        // } else {
        //     const meaIds = measures.map(m => m.fid);
        //     const projections = getCombination(meaIds, 2, 2);
        //     for (let pro of projections) {
        //         const meaProValues: [number, number][] = dataSource.map(row => [row[pro[0]], row[pro[1]]])
        //         const score = generalMatMic(T, meaProValues);
        //         totalEntLoss += score;
        //     }
        //     totalEntLoss /= projections.length
        // }
        for (var j = 0; j < measures.length; j++) {
            _loop_5(j);
        }
        totalEntLoss /= measures.length;
        //@ts-ignore
        dimensions[i].features.originEntropy = dimensions[i].features.entropy;
        dimensions[i].features.entropy = totalEntLoss;
    };
    for (var i = 0; i < dimensions.length; i++) {
        _loop_3(i);
    }
    var usedChannels = new Set();
    var _a = autoStat(fields), statFields = _a.statFields, distFields = _a.distFields, statEncodes = _a.statEncodes;
    var markType = autoMark(fields, statFields, distFields, statEncodes);
    markFixEncoding(markType, usedChannels);
    // if (filters && filters.length > 0) {
    //     usedChannels.add('color')
    // }
    var enc = encode({
        fields: distFields,
        usedChannels: usedChannels,
        statFields: statFields,
        statEncodes: statEncodes
    });
    // if (filters && filters.length > 0) {
    //     const field = filters[0].field;
    //     enc.color = {
    //         // field: field.fid,
    //         // type: field.semanticType,
    //         condition: {
    //             test: `datum['${field.fid}'] == '${filters[0].values[0]}'`
    //         },
    //         value: '#aaa'
    //         // value: '#000'
    //     }
    // }
    // autoAgg({
    //     encoding: enc, fields, markType,
    //     statFields
    // })
    humanHabbit(enc);
    var basicSpec = {
        // "config": {
        //     "range": {
        //       "category": {
        //         "scheme": "set2"
        //       }
        //     }
        //   },
        data: { name: 'dataSource' },
        // "params": [{
        //     "name": "grid",
        //     "select": "interval",
        //     "bind": "scales"
        //   }],
        mark: {
            type: markType,
            opacity: markType === 'circle' ? 0.56 : 0.88
        },
        encoding: enc
    };
    // if (filters && filters.length > 1) {
    //     basicSpec.transform = filters.slice(1).map(f => ({
    //         filter: `datum.${f.field.fid} == '${f.values[0]}'`
    //     }))
    // }
    // if (filters && filters.length > 0) {
    //     basicSpec.transform = filters.map(f => ({
    //         filter: `datum.${f.field.fid} == '${f.values[0]}'`
    //     }))
    // }
    return basicSpec;
}
exports.labDistVis = labDistVis;
