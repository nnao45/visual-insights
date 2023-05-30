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
Object.defineProperty(exports, "__esModule", { value: true });
exports.pearsonCC = exports.chiSquaredFromDataSource = exports.cramersV = exports.chiSquared = void 0;
/**
 * chiSquared implementation using adjacency list(spare graph), which is ableto handle fields with large cardinality.
 * @param nestTree hash tree with depth = 2, represents the relationship between var x and var y.
 * @param xSet value set of var x.
 * @param ySet value set of var y.
 */
function chiSquared(nestTree, xSet, ySet) {
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e, e_6, _f;
    if (typeof nestTree === 'undefined' || typeof xSet === 'undefined' || typeof ySet === 'undefined') {
        return 0;
    }
    var rowSums = new Map();
    var colSums = new Map();
    var totalSum = 0;
    try {
        for (var xSet_1 = __values(xSet), xSet_1_1 = xSet_1.next(); !xSet_1_1.done; xSet_1_1 = xSet_1.next()) {
            var x = xSet_1_1.value;
            rowSums.set(x, 0);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (xSet_1_1 && !xSet_1_1.done && (_a = xSet_1.return)) _a.call(xSet_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    try {
        for (var ySet_1 = __values(ySet), ySet_1_1 = ySet_1.next(); !ySet_1_1.done; ySet_1_1 = ySet_1.next()) {
            var y = ySet_1_1.value;
            colSums.set(y, 0);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (ySet_1_1 && !ySet_1_1.done && (_b = ySet_1.return)) _b.call(ySet_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    try {
        for (var nestTree_1 = __values(nestTree), nestTree_1_1 = nestTree_1.next(); !nestTree_1_1.done; nestTree_1_1 = nestTree_1.next()) {
            var _g = __read(nestTree_1_1.value, 2), x = _g[0], node = _g[1];
            try {
                for (var node_1 = (e_4 = void 0, __values(node)), node_1_1 = node_1.next(); !node_1_1.done; node_1_1 = node_1.next()) {
                    var _h = __read(node_1_1.value, 2), y = _h[0], counter = _h[1];
                    rowSums.set(x, rowSums.get(x) + counter);
                    colSums.set(y, colSums.get(y) + counter);
                    totalSum += counter;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (node_1_1 && !node_1_1.done && (_d = node_1.return)) _d.call(node_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (nestTree_1_1 && !nestTree_1_1.done && (_c = nestTree_1.return)) _c.call(nestTree_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    var chis = 0;
    try {
        for (var nestTree_2 = __values(nestTree), nestTree_2_1 = nestTree_2.next(); !nestTree_2_1.done; nestTree_2_1 = nestTree_2.next()) {
            var _j = __read(nestTree_2_1.value, 2), x = _j[0], node = _j[1];
            try {
                for (var node_2 = (e_6 = void 0, __values(node)), node_2_1 = node_2.next(); !node_2_1.done; node_2_1 = node_2.next()) {
                    var _k = __read(node_2_1.value, 2), y = _k[0], observed = _k[1];
                    var expected = rowSums.get(x) * colSums.get(y) / totalSum;
                    chis += Math.pow((observed - expected), 2) / expected;
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (node_2_1 && !node_2_1.done && (_f = node_2.return)) _f.call(node_2);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (nestTree_2_1 && !nestTree_2_1.done && (_e = nestTree_2.return)) _e.call(nestTree_2);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return chis;
}
exports.chiSquared = chiSquared;
/**
 * cramersV implementation using adjacency list(spare graph), which is ableto handle fields with large cardinality.
 * @param dataSource array of records.
 * @param fieldX field key of var X.
 * @param fieldY field key of varY.
 */
var cramersV = function (dataSource, fieldX, fieldY) {
    var xSet = new Set();
    var ySet = new Set();
    var nestTree = new Map();
    var len = dataSource.length;
    for (var i = 0; i < len; i++) {
        var record = dataSource[i];
        xSet.add(record[fieldX]);
        ySet.add(record[fieldY]);
        if (!nestTree.has(record[fieldX])) {
            nestTree.set(record[fieldX], new Map());
        }
        var node = nestTree.get(record[fieldX]);
        if (!node.has(record[fieldY])) {
            node.set(record[fieldY], 0);
        }
        node.set(record[fieldY], node.get(record[fieldY]) + 1);
    }
    var chis = chiSquared(nestTree, xSet, ySet);
    var V = Math.sqrt(chis / (dataSource.length * Math.min(xSet.size - 1, ySet.size - 1)));
    return V;
};
exports.cramersV = cramersV;
function chiSquaredFromDataSource(dataSource, fieldX, fieldY) {
    var xSet = new Set();
    var ySet = new Set();
    var nestTree = new Map();
    var len = dataSource.length;
    for (var i = 0; i < len; i++) {
        var record = dataSource[i];
        xSet.add(record[fieldX]);
        ySet.add(record[fieldY]);
        if (!nestTree.has(record[fieldX])) {
            nestTree.set(record[fieldX], new Map());
        }
        var node = nestTree.get(record[fieldX]);
        if (!node.has(record[fieldY])) {
            node.set(record[fieldY], 0);
        }
        node.set(record[fieldY], node.get(record[fieldY]) + 1);
    }
    var chis = chiSquared(nestTree, xSet, ySet);
    return chis;
}
exports.chiSquaredFromDataSource = chiSquaredFromDataSource;
/**
 * Pearson correlation coefficient
 * @param dataSource array of records
 * @param fieldX field key of var X.
 * @param fieldY field key of var Y.
 */
var pearsonCC = function (dataSource, fieldX, fieldY) {
    var r = 0;
    var xBar = sum(dataSource.map(function (row) { return row[fieldX]; })) / dataSource.length;
    var yBar = sum(dataSource.map(function (row) { return row[fieldY]; })) / dataSource.length;
    r = sum(dataSource.map(function (row) { return (row[fieldX] - xBar) * (row[fieldY] - yBar); })) /
        Math.sqrt(sum(dataSource.map(function (row) { return Math.pow(row[fieldX] - xBar, 2); })) * sum(dataSource.map(function (row) { return Math.pow(row[fieldY] - yBar, 2); })));
    return r;
};
exports.pearsonCC = pearsonCC;
function sum(arr) {
    var s = 0;
    for (var i = 0, len = arr.length; i < len; i++) {
        // if (typeof dataSource[i][field])
        s += arr[i];
    }
    return s;
}
// can be used for test. do not delete these code. it is implementation with adj matrix. can be faster in dense graph cases.
// export function cramersV(dataSource: DataSource, fieldX: string, fieldY: string): number {
//   const xSet = new Set(dataSource.map(d => d[fieldX]))
//   const ySet = new Set(dataSource.map(d => d[fieldY]))
//   const xMembers = [...xSet];
//   const yMembers = [...ySet];
//   let xDict = {};
//   let yDict = {};
//   for (let i = 0; i < xMembers.length; i++) {
//     xDict[xMembers[i]] = i;
//   }
//   for (let i = 0; i < yMembers.length; i++) {
//     yDict[yMembers[i]] = i;
//   }
//   // let matrix: number[][] = xMembers.map(x => yMembers.map(y => 0));
//   let matrix: number[][] = [];
//   for (let  i = 0; i < xMembers.length; i++) {
//     matrix.push([]);
//     for (let j = 0; j < yMembers.length; j++) {
//       matrix[i].push(0);
//     }
//   }
//   for (let record of dataSource) {
//     matrix[xDict[record[fieldX]]][yDict[record[fieldY]]]++;
//   }
//   const chis = chiSquared(matrix);
//   const V = Math.sqrt(chis / (dataSource.length * Math.min(xMembers.length - 1, yMembers.length - 1)))
//   return V;
// }
// export function chiSquared(matrix: number[][] = [[]]): number {
//   let rowSums = matrix.map(m => 0);
//   let colSums = matrix[0].map(m => 0);
//   let totalSum = 0;
//   for (let i = 0; i < matrix.length; i++) {
//     for (let j = 0; j < matrix[i].length; j++) {
//       rowSums[i] += matrix[i][j];
//       colSums[j] += matrix[i][j];
//       totalSum += matrix[i][j];
//     }
//   }
//   let chis = 0;
//   for (let i = 0; i < matrix.length; i++) {
//     for (let j = 0; j < matrix[i].length; j++) {
//       let observed = matrix[i][j];
//       let expected = rowSums[i] * colSums[j] / totalSum;
//       chis += (observed - expected) ** 2 / expected;
//     }
//   }
//   return chis;
// }
