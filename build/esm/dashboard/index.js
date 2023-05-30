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
exports.cramersV = exports.getDashBoardView = exports.getDashBoardSubspace = exports.getEntropyMatrix = void 0;
var index_1 = require("../ml/index");
var index_2 = require("../statistics/index");
var index_3 = require("../statistics/index");
Object.defineProperty(exports, "cramersV", { enumerable: true, get: function () { return index_3.cramersV; } });
var config_1 = require("../insights/config");
function getEntropyMatrix(dimensionsList, measures, dataSource, operator) {
    var e_1, _a;
    var matrix = [];
    for (var i = 0; i < dimensionsList.length; i++) {
        var dimensions = dimensionsList[i];
        matrix.push([]);
        var aggData = (0, index_2.stdAggregate)({
            dimensions: dimensions,
            measures: measures,
            dataSource: dataSource,
            ops: measures.map(function (m) { return operator || 'sum'; })
        });
        var _loop_1 = function (mea) {
            var fL = aggData.map(function (r) { return r[mea]; });
            var pL = (0, index_2.normalize)((0, index_3.mapPositive)(fL));
            var value = (0, index_2.entropy)(pL);
            matrix[i].push(value);
        };
        try {
            for (var measures_1 = (e_1 = void 0, __values(measures)), measures_1_1 = measures_1.next(); !measures_1_1.done; measures_1_1 = measures_1.next()) {
                var mea = measures_1_1.value;
                _loop_1(mea);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (measures_1_1 && !measures_1_1.done && (_a = measures_1.return)) _a.call(measures_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return matrix;
}
exports.getEntropyMatrix = getEntropyMatrix;
function getDashBoardSubspace(dataSource, dimensions, measures, fieldFeatureList) {
    var e_2, _a, e_3, _b, e_4, _c;
    var correlationMatrix = measures.map(function (i) { return measures.map(function (j) { return 0; }); });
    for (var i = 0; i < measures.length; i++) {
        correlationMatrix[i][i] = 1;
        for (var j = i + 1; j < measures.length; j++) {
            var r = (0, index_3.pearsonCC)(dataSource, measures[i], measures[j]);
            correlationMatrix[j][i] = correlationMatrix[i][j] = r;
        }
    }
    var measureGroups = index_1.Cluster.kruskal({
        matrix: correlationMatrix,
        measures: measures,
        groupMaxSize: Math.round(measures.length / 6),
        threshold: config_1.PearsonCorrelation.weak
    });
    var dimCorrelationMatrix = dimensions.map(function (d) { return dimensions.map(function (d) { return 0; }); });
    for (var i = 0; i < dimensions.length; i++) {
        dimCorrelationMatrix[i][i] = 1;
        for (var j = i + 1; j < dimensions.length; j++) {
            dimCorrelationMatrix[i][j] = dimCorrelationMatrix[j][i] = (0, index_3.cramersV)(dataSource, dimensions[i], dimensions[j]);
        }
    }
    var dimensionsInDashBoardSet = new Set();
    try {
        for (var fieldFeatureList_1 = __values(fieldFeatureList), fieldFeatureList_1_1 = fieldFeatureList_1.next(); !fieldFeatureList_1_1.done; fieldFeatureList_1_1 = fieldFeatureList_1.next()) {
            var fieldFeature = fieldFeatureList_1_1.value;
            try {
                for (var _d = (e_3 = void 0, __values(fieldFeature[0])), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var dim = _e.value;
                    dimensionsInDashBoardSet.add(dim);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (fieldFeatureList_1_1 && !fieldFeatureList_1_1.done && (_a = fieldFeatureList_1.return)) _a.call(fieldFeatureList_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    var dimensionsInDashBoard = __spreadArray([], __read(dimensionsInDashBoardSet), false);
    var dashBoardSpaces = [];
    var _loop_2 = function (group) {
        var matrix = group.map(function (g) { return group.map(function (p) { return 0; }); });
        for (var i = 0; i < group.length; i++) {
            var mea1Index = measures.indexOf(group[i]);
            for (var j = 0; j < group.length; j++) {
                var mea2Index = measures.indexOf(group[j]);
                matrix[i][j] = correlationMatrix[mea1Index][mea2Index];
            }
        }
        var dMatrix = dimensionsInDashBoard.map(function (d) { return dimensionsInDashBoard.map(function (d) { return 0; }); });
        for (var i = 0; i < dimensionsInDashBoard.length; i++) {
            var dim1Index = dimensions.indexOf(dimensionsInDashBoard[i]);
            for (var j = 0; j < dimensionsInDashBoard.length; j++) {
                var dim2Index = dimensions.indexOf(dimensionsInDashBoard[j]);
                dMatrix[i][j] = dimCorrelationMatrix[dim1Index][dim2Index];
            }
        }
        dashBoardSpaces.push({
            dimensions: dimensionsInDashBoard,
            measures: group,
            correlationMatrix: matrix,
            dimensionCorrelationMatrix: dMatrix,
            entropyMatrix: getEntropyMatrix(dimensionsInDashBoard.map(function (dim) { return [dim]; }), group, dataSource)
        });
    };
    try {
        for (var measureGroups_1 = __values(measureGroups), measureGroups_1_1 = measureGroups_1.next(); !measureGroups_1_1.done; measureGroups_1_1 = measureGroups_1.next()) {
            var group = measureGroups_1_1.value;
            _loop_2(group);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (measureGroups_1_1 && !measureGroups_1_1.done && (_c = measureGroups_1.return)) _c.call(measureGroups_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return dashBoardSpaces;
}
exports.getDashBoardSubspace = getDashBoardSubspace;
/**
 * handle how to combine dim and mea to produce a chart view in dashboard
 * @param dashBoardSpace
 *
 */
function getDashBoardView(dashBoardSpace, dataSource) {
    var e_5, _a;
    var dimensions = dashBoardSpace.dimensions, measures = dashBoardSpace.measures, entropyMatrix = dashBoardSpace.entropyMatrix, dimensionCorrelationMatrix = dashBoardSpace.dimensionCorrelationMatrix;
    /**
     * 1. get correlation view
     * 2. get impact view
     */
    var visViewList = [];
    /**
     * correlation view
     */
    var measureGroups = index_1.Cluster.kruskal({
        matrix: dashBoardSpace.correlationMatrix,
        measures: measures,
        groupMaxSize: Math.round(measures.length / 3),
        threshold: config_1.PearsonCorrelation.strong
    });
    var _loop_3 = function (group) {
        var meaIndexList = group.map(function (mea) { return measures.indexOf(mea); });
        var dimScoreList = dimensions.map(function (dim, index) {
            var e_6, _a;
            var score = 0;
            try {
                for (var meaIndexList_1 = (e_6 = void 0, __values(meaIndexList)), meaIndexList_1_1 = meaIndexList_1.next(); !meaIndexList_1_1.done; meaIndexList_1_1 = meaIndexList_1.next()) {
                    var meaIndex = meaIndexList_1_1.value;
                    score += entropyMatrix[index][meaIndex];
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (meaIndexList_1_1 && !meaIndexList_1_1.done && (_a = meaIndexList_1.return)) _a.call(meaIndexList_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
            return score;
        });
        var dimInView = dimensions[minIndex(dimScoreList)];
        visViewList.push({
            type: 'target',
            dimensions: [dimInView],
            measures: group
        });
    };
    try {
        for (var measureGroups_2 = __values(measureGroups), measureGroups_2_1 = measureGroups_2.next(); !measureGroups_2_1.done; measureGroups_2_1 = measureGroups_2.next()) {
            var group = measureGroups_2_1.value;
            _loop_3(group);
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (measureGroups_2_1 && !measureGroups_2_1.done && (_a = measureGroups_2.return)) _a.call(measureGroups_2);
        }
        finally { if (e_5) throw e_5.error; }
    }
    /**
     * impact views
     * todo: protentional repeat view or very similiar view
     */
    var dimensionGroups = index_1.Cluster.kruskal({
        matrix: dimensionCorrelationMatrix,
        measures: dimensions,
        groupMaxSize: 2,
        limitSize: true,
        threshold: config_1.CramersVThreshold
    });
    var dimGroupEntropyMatrix = getEntropyMatrix(dimensionGroups, measures, dataSource);
    for (var i = 0; i < dimensionGroups.length; i++) {
        var meaInView = measures[minIndex(dimGroupEntropyMatrix[i])];
        visViewList.push({
            type: 'feature',
            dimensions: dimensionGroups[i],
            measures: [meaInView]
        });
    }
    return visViewList;
}
exports.getDashBoardView = getDashBoardView;
function minIndex(arr) {
    var i = 0;
    var len = arr.length;
    var maxValue = Infinity;
    var pos = -1;
    for (i = 0; i < len; i++) {
        if (arr[i] < maxValue) {
            maxValue = arr[i];
            pos = i;
        }
    }
    return pos;
}
