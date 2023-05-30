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
exports.generalMatMic = exports.matrixBinShareRange = exports.initRanges = exports.incSim = exports.normalizeScatter = exports.pureGeneralConditionH = exports.pureGeneralMic = exports.generalMic = exports.mic = exports.rangeNormilize = exports.binMapShareRange = exports.binMap = exports.binShareRange = exports.bin = exports.w2dis = exports.l2Dis2 = exports.l1Dis2 = exports.l1Dis = exports.firstWDis = void 0;
var utils_1 = require("./utils");
function firstWDis(p1, p2) {
}
exports.firstWDis = firstWDis;
function l1Dis(p1, p2) {
    // for (let i )
    var ans = 0;
    var safeLen = Math.min(p1.length, p2.length);
    for (var i = 0; i < safeLen; i++) {
        ans += Math.abs(p1[i] - p2[i]);
    }
    return ans / 2;
}
exports.l1Dis = l1Dis;
function l1Dis2(p1, p2) {
    var total = 0;
    for (var i = 0; i < p1.length; i++) {
        for (var j = 0; j < p1[i].length; j++) {
            total += Math.abs(p1[i][j] - p2[i][j]);
        }
    }
    return total / 2;
}
exports.l1Dis2 = l1Dis2;
function l2Dis2(p1, p2) {
    var total = 0;
    for (var i = 0; i < p1.length; i++) {
        for (var j = 0; j < p1[i].length; j++) {
            total += Math.pow((p1[i][j] - p2[i][j]), 2);
        }
    }
    return total / 2;
}
exports.l2Dis2 = l2Dis2;
function w2dis() {
}
exports.w2dis = w2dis;
var BIN_SIZE = 16;
function bin(nums) {
    var _max = Math.max.apply(Math, __spreadArray([], __read(nums), false));
    var _min = Math.min.apply(Math, __spreadArray([], __read(nums), false));
    var step = (_max - _min) / BIN_SIZE;
    // for (let i = 0; i < nums)
    var dist = new Array(BIN_SIZE + 1).fill(0);
    for (var i = 0; i < nums.length; i++) {
        var numIndex = Math.floor((nums[i] - _min) / step);
        dist[numIndex % (BIN_SIZE + 1)]++;
    }
    dist[BIN_SIZE - 1] += dist[BIN_SIZE];
    return dist.slice(0, BIN_SIZE);
}
exports.bin = bin;
function binShareRange(nums, _min, _max) {
    var step = (_max - _min) / BIN_SIZE;
    // for (let i = 0; i < nums)
    var dist = new Array(BIN_SIZE + 1).fill(0);
    for (var i = 0; i < nums.length; i++) {
        var numIndex = Math.floor((nums[i] - _min) / step);
        dist[numIndex % (BIN_SIZE + 1)]++;
    }
    dist[BIN_SIZE - 1] += dist[BIN_SIZE];
    return dist.slice(0, BIN_SIZE);
}
exports.binShareRange = binShareRange;
function binMap(nums) {
    var _max = Math.max.apply(Math, __spreadArray([], __read(nums), false));
    var _min = Math.min.apply(Math, __spreadArray([], __read(nums), false));
    var step = (_max - _min) / BIN_SIZE;
    var ans = [];
    for (var i = 0; i < nums.length; i++) {
        var numIndex = Math.floor((nums[i] - _min) / step);
        if (numIndex === BIN_SIZE) {
            numIndex = BIN_SIZE - 1;
        }
        ans.push(numIndex);
    }
    return ans;
}
exports.binMap = binMap;
function binMapShareRange(nums, _min, _max) {
    var step = (_max - _min) / BIN_SIZE;
    var ans = [];
    for (var i = 0; i < nums.length; i++) {
        var numIndex = Math.floor((nums[i] - _min) / step);
        if (numIndex === BIN_SIZE) {
            numIndex = BIN_SIZE - 1;
        }
        ans.push(numIndex);
    }
    return ans;
}
exports.binMapShareRange = binMapShareRange;
function rangeNormilize(fl) {
    var _sum = 0;
    var pl = [];
    for (var i = 0; i < fl.length; i++) {
        _sum += fl[i];
    }
    for (var i = 0; i < fl.length; i++) {
        pl.push(fl[i] / _sum);
    }
    return pl;
}
exports.rangeNormilize = rangeNormilize;
function mic(T, X) {
    var condH = 0;
    var _min = Math.min.apply(Math, __spreadArray([], __read(X), false));
    var _max = Math.max.apply(Math, __spreadArray([], __read(X), false));
    var H = (0, utils_1.entropy)(rangeNormilize(binShareRange(X, _min, _max).filter(function (v) { return v > 0; })));
    var _loop_1 = function (i) {
        var conditionalX = X.filter(function (x, ti) { return T[ti] === i; });
        var bins = binShareRange(conditionalX, _min, _max).filter(function (v) { return v > 0; });
        var subEnt = (0, utils_1.entropy)(rangeNormilize(bins));
        var px = conditionalX.length / X.length;
        condH += px * subEnt;
    };
    for (var i = 0; i < BIN_SIZE; i++) {
        _loop_1(i);
    }
    return (H - condH) / Math.log2(BIN_SIZE);
}
exports.mic = mic;
function generalMic(T, X) {
    var condH = 0;
    var _min = Math.min.apply(Math, __spreadArray([], __read(X), false));
    var _max = Math.max.apply(Math, __spreadArray([], __read(X), false));
    var H = (0, utils_1.entropy)(rangeNormilize(binShareRange(X, _min, _max).filter(function (v) { return v > 0; })));
    var uniqueValueSet = new Set(T);
    var uniqueValues = __spreadArray([], __read(uniqueValueSet), false);
    var dists = [];
    var _loop_2 = function (i) {
        var conditionalX = X.filter(function (x, ti) { return T[ti] === uniqueValues[i]; });
        var bins = binShareRange(conditionalX, _min, _max);
        dists.push({
            freq: conditionalX.length,
            bins: bins
        });
    };
    for (var i = 0; i < uniqueValues.length; i++) {
        _loop_2(i);
    }
    dists.sort(function (a, b) { return b.freq - a.freq; });
    var noise = {
        freq: 0,
        bins: new Array(BIN_SIZE).fill(0)
    };
    for (var i = 0; i < dists.length; i++) {
        var _a = dists[i], bins = _a.bins, freq = _a.freq;
        if (i < BIN_SIZE - 1) {
            var subEnt = (0, utils_1.entropy)(rangeNormilize(bins.filter(function (v) { return v > 0; })));
            var px = freq / X.length;
            condH += px * subEnt;
        }
        else {
            noise.freq += freq;
            for (var j = 0; j < BIN_SIZE; j++) {
                noise.bins[j] += bins[j];
            }
        }
    }
    if (noise.freq > 0) {
        var bins = noise.bins, freq = noise.freq;
        var subEnt = (0, utils_1.entropy)(rangeNormilize(bins.filter(function (v) { return v > 0; })));
        var px = freq / X.length;
        condH += px * subEnt;
    }
    // for (let i = 0; i < uniqueValues.length; i++) {
    //     const conditionalX = X.filter((x, ti) => T[ti] === uniqueValues[i]);
    //     const bins = binShareRange(conditionalX, _min, _max).filter(v => v > 0);
    //     const subEnt = entropy(rangeNormilize(bins))
    //     const px = conditionalX.length / X.length;
    //     condH += px * subEnt;
    // }
    return (H - condH) / Math.log2(Math.min(BIN_SIZE, uniqueValues.length));
}
exports.generalMic = generalMic;
function pureGeneralMic(T, X) {
    var condH = 0;
    var _min = Math.min.apply(Math, __spreadArray([], __read(X), false));
    var _max = Math.max.apply(Math, __spreadArray([], __read(X), false));
    var H = (0, utils_1.entropy)(rangeNormilize(binShareRange(X, _min, _max).filter(function (v) { return v > 0; })));
    var uniqueValueSet = new Set(T);
    var uniqueValues = __spreadArray([], __read(uniqueValueSet), false);
    var dists = [];
    var _loop_3 = function (i) {
        var conditionalX = X.filter(function (x, ti) { return T[ti] === uniqueValues[i]; });
        var bins = binShareRange(conditionalX, _min, _max);
        dists.push({
            freq: conditionalX.length,
            bins: bins
        });
    };
    for (var i = 0; i < uniqueValues.length; i++) {
        _loop_3(i);
    }
    for (var i = 0; i < dists.length; i++) {
        var _a = dists[i], bins = _a.bins, freq = _a.freq;
        var subEnt = (0, utils_1.entropy)(rangeNormilize(bins.filter(function (v) { return v > 0; })));
        var px = freq / X.length;
        condH += px * subEnt;
    }
    // for (let i = 0; i < uniqueValues.length; i++) {
    //     const conditionalX = X.filter((x, ti) => T[ti] === uniqueValues[i]);
    //     const bins = binShareRange(conditionalX, _min, _max).filter(v => v > 0);
    //     const subEnt = entropy(rangeNormilize(bins))
    //     const px = conditionalX.length / X.length;
    //     condH += px * subEnt;
    // }
    return (H - condH);
}
exports.pureGeneralMic = pureGeneralMic;
function pureGeneralConditionH(T, X) {
    var condH = 0;
    var _min = Math.min.apply(Math, __spreadArray([], __read(X), false));
    var _max = Math.max.apply(Math, __spreadArray([], __read(X), false));
    var H = (0, utils_1.entropy)(rangeNormilize(binShareRange(X, _min, _max).filter(function (v) { return v > 0; })));
    var uniqueValueSet = new Set(T);
    var uniqueValues = __spreadArray([], __read(uniqueValueSet), false);
    var dists = [];
    var _loop_4 = function (i) {
        var conditionalX = X.filter(function (x, ti) { return T[ti] === uniqueValues[i]; });
        var bins = binShareRange(conditionalX, _min, _max);
        dists.push({
            freq: conditionalX.length,
            bins: bins
        });
    };
    for (var i = 0; i < uniqueValues.length; i++) {
        _loop_4(i);
    }
    dists.sort(function (a, b) { return b.freq - a.freq; });
    var noise = {
        freq: 0,
        bins: new Array(BIN_SIZE).fill(0)
    };
    for (var i = 0; i < dists.length; i++) {
        var _a = dists[i], bins = _a.bins, freq = _a.freq;
        if (i < BIN_SIZE - 1) {
            var subEnt = (0, utils_1.entropy)(rangeNormilize(bins.filter(function (v) { return v > 0; })));
            var px = freq / X.length;
            condH += px * subEnt;
        }
        else {
            noise.freq += freq;
            for (var j = 0; j < BIN_SIZE; j++) {
                noise.bins[j] += bins[j];
            }
        }
    }
    if (noise.freq > 0) {
        var bins = noise.bins, freq = noise.freq;
        var subEnt = (0, utils_1.entropy)(rangeNormilize(bins.filter(function (v) { return v > 0; })));
        var px = freq / X.length;
        condH += px * subEnt;
    }
    return condH;
}
exports.pureGeneralConditionH = pureGeneralConditionH;
function normalizeScatter(points) {
    var maxX = -Infinity;
    var maxY = -Infinity;
    var minX = Infinity;
    var minY = Infinity;
    for (var i = 0; i < points.length; i++) {
        maxX = Math.max(points[i][0], maxX);
        maxY = Math.max(points[i][1], maxY);
        minX = Math.min(points[i][0], minX);
        minY = Math.min(points[i][1], minY);
    }
    var stepX = (maxX - minX) / BIN_SIZE;
    var stepY = (maxY - minY) / BIN_SIZE;
    var matrix = new Array(BIN_SIZE + 1).fill(0).map(function () { return new Array(BIN_SIZE + 1).fill(0); });
    for (var i = 0; i < points.length; i++) {
        // matrix[]
        var indexX = Math.floor((points[i][0] - minX) / stepX);
        var indexY = Math.floor((points[i][1] - minY) / stepY);
        matrix[indexX][indexY]++;
    }
    for (var i = 0; i <= BIN_SIZE; i++) {
        matrix[i][BIN_SIZE - 1] += matrix[i][BIN_SIZE];
        matrix[BIN_SIZE - 1][i] += matrix[BIN_SIZE][i];
    }
    var pbMatrix = new Array(BIN_SIZE).fill(0).map(function () { return new Array(BIN_SIZE).fill(0); });
    for (var i = 0; i < BIN_SIZE; i++) {
        for (var j = 0; j < BIN_SIZE; j++) {
            pbMatrix[i][j] = matrix[i][j] / points.length;
        }
    }
    // console.log(pbMatrix)
    return pbMatrix;
}
exports.normalizeScatter = normalizeScatter;
function incSim(T, pointsX, pointsY) {
    var e_1, _a;
    var _b, _c;
    var S = l2Dis2(normalizeScatter(pointsX), normalizeScatter(pointsY));
    var groups = new Map();
    for (var i = 0; i < T.length; i++) {
        if (!groups.has(T[i])) {
            var pair = {
                X: [],
                Y: []
            };
            groups.set(T[i], pair);
        }
        (_b = groups.get(T[i])) === null || _b === void 0 ? void 0 : _b.X.push(pointsX[i]);
        (_c = groups.get(T[i])) === null || _c === void 0 ? void 0 : _c.Y.push(pointsY[i]);
    }
    var condS = 0;
    try {
        for (var _d = __values(groups.entries()), _e = _d.next(); !_e.done; _e = _d.next()) {
            var _f = __read(_e.value, 2), pair = _f[1];
            var p = pair.X.length / pointsX.length;
            if (p === 0)
                continue;
            if (pair.X.length < Math.pow(BIN_SIZE, 2)) {
                condS += p;
                continue;
            }
            // let p = 1 / groups.size
            condS += (p * l2Dis2(normalizeScatter(pair.X), normalizeScatter(pair.Y)));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return S - condS;
}
exports.incSim = incSim;
// type ITensor = Array<ITensor | number>;
// function initTensor (order: number, size = BIN_SIZE): ITensor {
//     if (order === 1) {
//         return new Array(size).fill(0);
//     }
//     const tensor: ITensor = [];
//     for (let i = 0; i < size; i++) {
//         tensor.push(initTensor(order - 1, size));
//     }
//     return tensor;
// }
function initRanges(vals, order) {
    var ranges = [];
    var _loop_5 = function (od) {
        ranges.push([
            Math.min.apply(Math, __spreadArray([], __read(vals.map(function (v) { return v[od]; })), false)),
            Math.max.apply(Math, __spreadArray([], __read(vals.map(function (v) { return v[od]; })), false)),
        ]);
    };
    for (var od = 0; od < order; od++) {
        _loop_5(od);
    }
    return ranges;
}
exports.initRanges = initRanges;
// function TensorCellAdd (tensor: ITensor, loc: number[], addVal: number) {
// }
// function highOrderBinShareRange(vals: number[][], ranges: [number, number][]): number[][] {
//     let order = ranges.length;
//     const tensor: ITensor = initTensor(order);
//     const steps = ranges.map(r => (r[1] - r[0]) / BIN_SIZE);
//     for (let i = 0; i < vals.length; i++) {
//         for (let j = 0; j < vals[i].length; j++) {
//             // tensor
//         }
//     }
//     return []
// }
// export function highOrderGeneralMic (T: string[], measures: number[][]) {
//     if (measures.length === 0) return 0;
//     const measureNumber = measures[0].length;
//     const measureBinSize = BIN_SIZE ** measureNumber;
// }
var BIN_SIZE_FOR_MAT = BIN_SIZE / 2;
// const BIN_SIZE_FOR_MAT = BIN_SIZE;
function matrixBinShareRange(values, ranges) {
    var binMat = new Array(BIN_SIZE_FOR_MAT + 1).fill(0).map(function () { return new Array(BIN_SIZE_FOR_MAT + 1).fill(0); });
    var stepX = (ranges[0][1] - ranges[0][0]) / BIN_SIZE_FOR_MAT;
    var stepY = (ranges[1][1] - ranges[1][0]) / BIN_SIZE_FOR_MAT;
    for (var i = 0; i < values.length; i++) {
        var indX = Math.floor((values[i][0] - ranges[0][0]) / stepX);
        var indY = Math.floor((values[i][1] - ranges[1][0]) / stepY);
        binMat[indY][indX]++;
    }
    for (var i = 0; i < BIN_SIZE_FOR_MAT + 1; i++) {
        binMat[i][BIN_SIZE_FOR_MAT - 1] += binMat[i][BIN_SIZE_FOR_MAT];
    }
    for (var i = 0; i < BIN_SIZE_FOR_MAT; i++) {
        binMat[BIN_SIZE_FOR_MAT - 1][i] += binMat[BIN_SIZE_FOR_MAT][i];
    }
    return binMat.slice(0, BIN_SIZE_FOR_MAT).map(function (row) { return row.slice(0, BIN_SIZE_FOR_MAT); });
}
exports.matrixBinShareRange = matrixBinShareRange;
function generalMatMic(T, X) {
    var condH = 0;
    var ranges = initRanges(X, 2);
    var H = (0, utils_1.entropy)(rangeNormilize(matrixBinShareRange(X, ranges).flatMap(function (v) { return v; }).filter(function (v) { return v > 0; })));
    var uniqueValueSet = new Set(T);
    var uniqueValues = __spreadArray([], __read(uniqueValueSet), false);
    var dists = [];
    var _loop_6 = function (i) {
        var conditionalX = X.filter(function (x, ti) { return T[ti] === uniqueValues[i]; });
        // const bins = binShareRange(conditionalX, _min, _max)
        var bins = matrixBinShareRange(conditionalX, ranges).flatMap(function (v) { return v; });
        dists.push({
            freq: conditionalX.length,
            bins: bins
        });
    };
    for (var i = 0; i < uniqueValues.length; i++) {
        _loop_6(i);
    }
    dists.sort(function (a, b) { return b.freq - a.freq; });
    var noise = {
        freq: 0,
        bins: new Array(BIN_SIZE_FOR_MAT * BIN_SIZE_FOR_MAT).fill(0)
    };
    for (var i = 0; i < dists.length; i++) {
        var _a = dists[i], bins = _a.bins, freq = _a.freq;
        if (i < BIN_SIZE - 1) {
            var subEnt = (0, utils_1.entropy)(rangeNormilize(bins.filter(function (v) { return v > 0; })));
            var px = freq / X.length;
            condH += px * subEnt;
        }
        else {
            noise.freq += freq;
            for (var j = 0; j < BIN_SIZE_FOR_MAT * BIN_SIZE_FOR_MAT; j++) {
                noise.bins[j] += bins[j];
            }
        }
    }
    if (noise.freq > 0) {
        var bins = noise.bins, freq = noise.freq;
        var subEnt = (0, utils_1.entropy)(rangeNormilize(bins.filter(function (v) { return v > 0; })));
        var px = freq / X.length;
        condH += px * subEnt;
    }
    return (H - condH) / Math.log2(uniqueValues.length);
}
exports.generalMatMic = generalMatMic;
