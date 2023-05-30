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
exports.insightExtraction = exports.subspaceSearching = exports.getDimSetsBasedOnClusterGroups = void 0;
var index_1 = require("../statistics/index");
var index_2 = require("../statistics/index");
var config_1 = require("./config");
var index_3 = require("../ml/index");
var constant_1 = require("../constant");
// insights like outlier and trend both request high impurity of dimension.
function getDimCorrelationMatrix(dataSource, dimensions) {
    var matrix = dimensions.map(function (d) { return dimensions.map(function (d) { return 0; }); });
    for (var i = 0; i < dimensions.length; i++) {
        matrix[i][i] = 1;
        for (var j = i + 1; j < dimensions.length; j++) {
            matrix[i][j] = matrix[j][i] = (0, index_2.cramersV)(dataSource, dimensions[i], dimensions[j]);
        }
    }
    return matrix;
}
function getDimSetsBasedOnClusterGroups(dataSource, dimensions) {
    var e_1, _a;
    var maxDimNumberInView = 4;
    var dimSets = [];
    var dimCorrelationMatrix = getDimCorrelationMatrix(dataSource, dimensions);
    // groupMaxSize here means group number.
    var groups = index_3.Cluster.kruskal({
        matrix: dimCorrelationMatrix,
        measures: dimensions,
        groupMaxSize: Math.round(dimensions.length / maxDimNumberInView),
        threshold: config_1.CramersVThreshold
    });
    try {
        // todo: maybe a threhold would be better ?
        for (var groups_1 = __values(groups), groups_1_1 = groups_1.next(); !groups_1_1.done; groups_1_1 = groups_1.next()) {
            var group = groups_1_1.value;
            var combineDimSet = (0, index_2.getCombination)(group, 1, constant_1.CHANNEL.maxDimensionNumber);
            dimSets.push.apply(dimSets, __spreadArray([], __read(combineDimSet), false));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (groups_1_1 && !groups_1_1.done && (_a = groups_1.return)) _a.call(groups_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return dimSets;
}
exports.getDimSetsBasedOnClusterGroups = getDimSetsBasedOnClusterGroups;
function subspaceSearching(dataSource, dimensions, shouldDimensionsCorrelated) {
    if (shouldDimensionsCorrelated === void 0) { shouldDimensionsCorrelated = true; }
    if (shouldDimensionsCorrelated) {
        return getDimSetsBasedOnClusterGroups(dataSource, dimensions);
    }
    else {
        return (0, index_2.getCombination)(dimensions);
    }
}
exports.subspaceSearching = subspaceSearching;
function insightExtraction(dataSource, dimensions, measures, operator) {
    var e_2, _a, e_3, _b;
    if (operator === void 0) { operator = 'sum'; }
    var impurityList = [];
    var dimSet = subspaceSearching(dataSource, dimensions, true);
    try {
        for (var dimSet_1 = __values(dimSet), dimSet_1_1 = dimSet_1.next(); !dimSet_1_1.done; dimSet_1_1 = dimSet_1.next()) {
            var dset = dimSet_1_1.value;
            var impurity = {};
            var aggData = (0, index_1.stdAggregate)({
                dimensions: dimensions,
                measures: measures,
                dataSource: dataSource,
                ops: measures.map(function (m) { return operator || 'sum'; })
            });
            var _loop_1 = function (mea) {
                // fl = frequency list, pL = probability list
                var fL = aggData.map(function (r) { return r[mea]; });
                var pL = (0, index_1.normalize)((0, index_2.mapPositive)(fL));
                var value = (0, index_1.entropy)(pL);
                impurity[mea] = value;
            };
            try {
                // let fList = aggData.map(r => r)
                for (var measures_1 = (e_3 = void 0, __values(measures)), measures_1_1 = measures_1.next(); !measures_1_1.done; measures_1_1 = measures_1.next()) {
                    var mea = measures_1_1.value;
                    _loop_1(mea);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (measures_1_1 && !measures_1_1.done && (_b = measures_1.return)) _b.call(measures_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            var correlationMatrix = measures.map(function (i) { return measures.map(function (j) { return 0; }); });
            for (var i = 0; i < measures.length; i++) {
                correlationMatrix[i][i] = 1;
                for (var j = i + 1; j < measures.length; j++) {
                    var r = (0, index_2.pearsonCC)(aggData, measures[i], measures[j]);
                    correlationMatrix[j][i] = correlationMatrix[i][j] = r;
                }
            }
            impurityList.push([dset, impurity, correlationMatrix]);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (dimSet_1_1 && !dimSet_1_1.done && (_a = dimSet_1.return)) _a.call(dimSet_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return impurityList;
}
exports.insightExtraction = insightExtraction;
// interface InsightSpace {
//   dimensions: string[];
//   type: 'entropy' | 'trend' | 'outlier';
//   order: 'desc' | 'asc';
//   score: {
//     [meaName: string]: number;
//   };
//   correlationMatrix: number[][];
// }
// export function multiInsightExtraction(dataSource: DataSource, dimensions: string[], measures: string[]): InsightSpace[] {
//   let impurityList: FieldsFeature[] = [];
//   let dimSet = subspaceSearching(dataSource, dimensions, true);
//   let correlationMatrix = measures.map(i => measures.map(j => 0));
//   for (let i = 0; i < measures.length; i++) {
//     correlationMatrix[i][i] = 1;
//     for (let j = i + 1; j < measures.length; j++) {
//       let r = pearsonCC(dataSource, measures[i], measures[j]);
//       correlationMatrix[j][i] = correlationMatrix[i][j] = r;
//     }
//   }
//   for (let dset of dimSet) {
//     let impurity = {};
//     let trend = {};
//     let outlier = {};
//     let aggData = aggregate({
//       dataSource,
//       dimensions: dset,
//       measures,
//       asFields: measures,
//       operator: operator || 'sum'//: operator as 
//     });
//     // let fList = aggData.map(r => r)
//     for (let mea of measures) {
//       // fl = frequency list, pL = probability list
//       let fL = aggData.map(r => r[mea]);
//       let pL = normalize(linearMapPositive(fL));
//       let value = entropy(pL);
//       impurity[mea] = value;
//     }
//     for (let mea of measures) {
//     }
//     impurityList.push([dset, impurity, correlationMatrix]);
//   }
//   return impurityList
// }
