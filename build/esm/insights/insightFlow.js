"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataGraph = void 0;
var statistics_1 = require("../statistics");
// export const totalVariationCC: CorrelationCoefficient = (dataSource, fieldX, fieldY) => {
// }
var DataGraph = /** @class */ (function () {
    function DataGraph(dataSource, dimensions, measures) {
        this.computeDGraph(dataSource, dimensions);
        this.computeMGraph(dataSource, measures);
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
    DataGraph.prototype.computeDGraph = function (dataSource, dimensions, cc) {
        if (cc === void 0) { cc = statistics_1.cramersV; }
        this.DG = this.computeGraph(dataSource, dimensions, cc);
        return this.DG;
    };
    DataGraph.prototype.computeMGraph = function (dataSource, measures, cc) {
        if (cc === void 0) { cc = statistics_1.pearsonCC; }
        this.MG = this.computeMGraph(dataSource, measures, cc);
        return this.MG;
    };
    return DataGraph;
}());
exports.DataGraph = DataGraph;
// export class InsightFlow implements Dataset {
//   public dataSource: Record[]
//   public dimensions: string[]
//   public measures: string[]
//   private dataGraph: number[][]
//   private cubePool: any
//   insightSpaces: InsightSpace[]
//   constructor(props) {}
// }
