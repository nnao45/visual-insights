var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CramersVThreshold, PearsonCorrelation } from "../../insights/config";
import { Cluster } from "../../ml";
export class CHDataGraph {
    constructor(viewName, dimensions, measures) {
        this.DIMENSION_CORRELATION_THRESHOLD = CramersVThreshold;
        this.MEASURE_CORRELATION_THRESHOLD = PearsonCorrelation.strong;
        this.SOFT_MAX_DIM_IN_VIEW = 4;
        this.SOFT_MAX_MEA_IN_VIEW = 3;
        this.dimensions = [];
        this.measures = [];
        this.viewName = viewName;
        this.dimensions = dimensions;
        this.measures = measures;
    }
    computeGraph(colKeys, cc) {
        return __awaiter(this, void 0, void 0, function* () {
            const { viewName } = this;
            let matrix = colKeys.map(() => colKeys.map(() => 0));
            for (let i = 0; i < colKeys.length; i++) {
                for (let j = 0; j < colKeys.length; j++) {
                    matrix[i][j] = matrix[j][i] = yield cc(viewName, colKeys[i], colKeys[j]);
                }
            }
            return matrix;
        });
    }
    computeDGraph(cc) {
        return __awaiter(this, void 0, void 0, function* () {
            this.DG = yield this.computeGraph(this.dimensions, cc);
            return this.DG;
        });
    }
    computeMGraph(cc) {
        return __awaiter(this, void 0, void 0, function* () {
            this.MG = yield this.computeGraph(this.measures, cc);
            return this.MG;
        });
    }
    clusterDGraph(CORRELATION_THRESHOLD) {
        const { DG, dimensions, SOFT_MAX_DIM_IN_VIEW, DIMENSION_CORRELATION_THRESHOLD } = this;
        const threshold = typeof CORRELATION_THRESHOLD === 'number' ? CORRELATION_THRESHOLD : DIMENSION_CORRELATION_THRESHOLD;
        this.DClusters = Cluster.kruskal({
            matrix: DG,
            measures: dimensions,
            groupMaxSize: Math.round(dimensions.length / SOFT_MAX_DIM_IN_VIEW),
            threshold
        });
        return this.DClusters;
    }
    clusterMGraph(CORRELATION_THRESHOLD) {
        const { MG, measures, MEASURE_CORRELATION_THRESHOLD, SOFT_MAX_MEA_IN_VIEW } = this;
        const threshold = typeof CORRELATION_THRESHOLD === 'number' ? CORRELATION_THRESHOLD : MEASURE_CORRELATION_THRESHOLD;
        this.MClusters = Cluster.kruskal({
            matrix: MG,
            measures,
            groupMaxSize: Math.round(measures.length / SOFT_MAX_MEA_IN_VIEW),
            threshold
        });
        return this.MClusters;
    }
}
