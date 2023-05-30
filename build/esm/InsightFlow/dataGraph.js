"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataGraph = void 0;
var statistics_1 = require("../statistics");
var subspaces_1 = require("../insights/subspaces");
var config_1 = require("../insights/config");
var utils_1 = require("../utils");
var DataGraph = /** @class */ (function () {
    function DataGraph(dimensions, measures) {
        this.DIMENSION_CORRELATION_THRESHOLD = config_1.CramersVThreshold;
        this.MEASURE_CORRELATION_THRESHOLD = config_1.PearsonCorrelation.strong;
        this.dimensions = dimensions;
        this.measures = measures;
        // this.computeDGraph(dataSource);
        // this.computeMGraph(dataSource);
    }
    DataGraph.prototype.computeGraph = function (dataSource, fields, cc) {
        var matrix = fields.map(function (f) { return fields.map(function () { return 0; }); });
        for (var i = 0; i < fields.length; i++) {
            matrix[i][i] = 1;
            for (var j = i + 1; j < fields.length; j++) {
                matrix[i][j] = matrix[j][i] = cc(dataSource, fields[i], fields[j]);
            }
        }
        return matrix;
    };
    DataGraph.prototype.computeDGraph = function (dataSource, cc) {
        if (cc === void 0) { cc = statistics_1.cramersV; }
        this.DG = this.computeGraph(dataSource, this.dimensions, cc);
        return this.DG;
    };
    DataGraph.prototype.computeMGraph = function (dataSource, cc) {
        if (cc === void 0) { cc = statistics_1.pearsonCC; }
        this.MG = this.computeGraph(dataSource, this.measures, cc);
        return this.MG;
    };
    // public clusterDGraph(dataSource: IRow[], CORRELATION_THRESHOLD?: number) {
    //     const { dimensions, DIMENSION_CORRELATION_THRESHOLD } = this;
    //     this.DClusters = getDimClusterGroups(
    //         dataSource,
    //         dimensions,
    //         CORRELATION_THRESHOLD || DIMENSION_CORRELATION_THRESHOLD
    //     );
    //     return this.DClusters;
    // }
    DataGraph.prototype.clusterDGraph = function (dataSource, CORRELATION_THRESHOLD) {
        var _a = this, dimensions = _a.dimensions, DIMENSION_CORRELATION_THRESHOLD = _a.DIMENSION_CORRELATION_THRESHOLD;
        var threshold = CORRELATION_THRESHOLD || DIMENSION_CORRELATION_THRESHOLD;
        var DG = this.DG;
        var clusters = [];
        for (var i = 0; i < dimensions.length; i++) {
            var groups = [];
            for (var j = 0; j < dimensions.length; j++) {
                if (DG[i][j] >= threshold) {
                    groups.push(dimensions[j]);
                }
            }
            clusters.push(groups);
        }
        var uniqueClusters = [];
        var _loop_1 = function (i) {
            var removeIndices = [];
            var noSuperset = true;
            for (var j = 0; j < uniqueClusters.length; j++) {
                if ((0, utils_1.subset2theOther)(clusters[i], uniqueClusters[j])) {
                    if (clusters[i].length > uniqueClusters[j].length) {
                        removeIndices.push(j);
                    }
                    else {
                        noSuperset = false;
                    }
                }
            }
            if (removeIndices.length > 0) {
                uniqueClusters = uniqueClusters.filter(function (_, i) {
                    return !removeIndices.includes(i);
                });
            }
            if (noSuperset) {
                uniqueClusters.push(clusters[i]);
            }
        };
        for (var i = 0; i < clusters.length; i++) {
            _loop_1(i);
        }
        this.DClusters = uniqueClusters;
        return uniqueClusters;
    };
    DataGraph.prototype.clusterMGraph = function (dataSource, CORRELATION_THRESHOLD) {
        var _a = this, measures = _a.measures, MEASURE_CORRELATION_THRESHOLD = _a.MEASURE_CORRELATION_THRESHOLD;
        this.MClusters = (0, subspaces_1.getMeaSetsBasedOnClusterGroups)(dataSource, measures, CORRELATION_THRESHOLD || MEASURE_CORRELATION_THRESHOLD);
        return this.MClusters;
    };
    return DataGraph;
}());
exports.DataGraph = DataGraph;
