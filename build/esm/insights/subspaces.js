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
exports.getRelatedVertices = exports.subspaceSearching = exports.getMeaSetsBasedOnClusterGroups = exports.getDimSetsBasedOnClusterGroups = exports.getDimClusterGroups = exports.getMeaCorrelationMatrix = exports.getDimCorrelationMatrix = void 0;
var index_1 = require("../statistics/index");
var config_1 = require("./config");
var index_2 = require("../ml/index");
var constant_1 = require("../constant");
// insights like outlier and trend both request high impurity of dimension.
function getDimCorrelationMatrix(dataSource, dimensions) {
    var matrix = dimensions.map(function (d) { return dimensions.map(function (d) { return 0; }); });
    for (var i = 0; i < dimensions.length; i++) {
        matrix[i][i] = 1;
        for (var j = i + 1; j < dimensions.length; j++) {
            matrix[i][j] = matrix[j][i] = (0, index_1.cramersV)(dataSource, dimensions[i], dimensions[j]);
        }
    }
    return matrix;
}
exports.getDimCorrelationMatrix = getDimCorrelationMatrix;
function getMeaCorrelationMatrix(dataSource, measures) {
    var matrix = measures.map(function (i) { return measures.map(function (j) { return 0; }); });
    for (var i = 0; i < measures.length; i++) {
        matrix[i][i] = 1;
        for (var j = i + 1; j < measures.length; j++) {
            var r = (0, index_1.pearsonCC)(dataSource, measures[i], measures[j]);
            matrix[j][i] = matrix[i][j] = r;
        }
    }
    return matrix;
}
exports.getMeaCorrelationMatrix = getMeaCorrelationMatrix;
function getDimClusterGroups(dataSource, dimensions, threshold, max_number_of_group) {
    if (threshold === void 0) { threshold = config_1.CramersVThreshold; }
    var maxDimNumberInView = 4;
    var dimCorrelationMatrix = getDimCorrelationMatrix(dataSource, dimensions);
    // groupMaxSize here means group number.
    var groups = index_2.Cluster.kruskal({
        matrix: dimCorrelationMatrix,
        measures: dimensions,
        groupMaxSize: max_number_of_group ? max_number_of_group : Math.round(dimensions.length / maxDimNumberInView),
        threshold: threshold,
    });
    return groups;
}
exports.getDimClusterGroups = getDimClusterGroups;
function getDimSetsBasedOnClusterGroups(dataSource, dimensions, correlation_threshold, max_dimensions_in_space) {
    var e_1, _a;
    var dimSets = [];
    var groups = getDimClusterGroups(dataSource, dimensions, correlation_threshold);
    try {
        for (var groups_1 = __values(groups), groups_1_1 = groups_1.next(); !groups_1_1.done; groups_1_1 = groups_1.next()) {
            var group = groups_1_1.value;
            var combineDimSet = (0, index_1.getCombination)(group, 1, max_dimensions_in_space ? max_dimensions_in_space : constant_1.CHANNEL.maxDimensionNumber);
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
/**
 *
 * @param dataSource
 * @param measures
 * @param correlation_threshold a threshold of correlation used to define min correlation value in a cluster of measure.
 * @param max_measure_in_view
 */
function getMeaSetsBasedOnClusterGroups(dataSource, measures, correlation_threshold, max_number_of_group) {
    if (max_number_of_group === void 0) { max_number_of_group = 3; }
    var soft_max_measures_in_view = 3;
    var correlationMatrix = getMeaCorrelationMatrix(dataSource, measures);
    var groups = index_2.Cluster.kruskal({
        matrix: correlationMatrix,
        measures: measures,
        groupMaxSize: max_number_of_group ? max_number_of_group : Math.round(measures.length / soft_max_measures_in_view),
        threshold: correlation_threshold ? correlation_threshold : config_1.PearsonCorrelation.strong
    });
    return groups;
}
exports.getMeaSetsBasedOnClusterGroups = getMeaSetsBasedOnClusterGroups;
function subspaceSearching(dataSource, dimensions, should_dimensions_correlated) {
    if (should_dimensions_correlated === void 0) { should_dimensions_correlated = true; }
    if (should_dimensions_correlated) {
        return getDimSetsBasedOnClusterGroups(dataSource, dimensions);
    }
    else {
        return (0, index_1.getCombination)(dimensions);
    }
}
exports.subspaceSearching = subspaceSearching;
function getRelatedVertices(adjMatrix, vertices, verticesInGraph, topK) {
    var verStatus = vertices.map(function (v) { return verticesInGraph.includes(v); });
    var edges = [];
    var ans = [];
    for (var i = 0; i < adjMatrix.length; i++) {
        // if vertex in graph, then check all the edges from this vertex
        if (verStatus[i]) {
            for (var j = 0; j < adjMatrix[i].length; j++) {
                if (!verStatus[j]) {
                    edges.push([adjMatrix[i][j], [i, j]]);
                }
            }
        }
    }
    edges.sort(function (a, b) {
        return b[0] - a[0];
    });
    for (var i = 0; i < edges.length; i++) {
        var targetVertexIndex = edges[i][1][1];
        if (!verStatus[targetVertexIndex]) {
            verStatus[targetVertexIndex] = true;
            ans.push({
                field: vertices[targetVertexIndex],
                corValue: edges[i][0]
            });
        }
    }
    return ans.slice(0, topK ? topK : ans.length);
}
exports.getRelatedVertices = getRelatedVertices;
