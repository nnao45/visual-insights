import { cramersV, pearsonCC } from "../statistics";
import { getMeaSetsBasedOnClusterGroups } from "../insights/subspaces";
import { CramersVThreshold, PearsonCorrelation } from "../insights/config";
import { subset2theOther } from "../utils";
export class DataGraph {
    constructor(dimensions, measures) {
        this.DIMENSION_CORRELATION_THRESHOLD = CramersVThreshold;
        this.MEASURE_CORRELATION_THRESHOLD = PearsonCorrelation.strong;
        this.dimensions = dimensions;
        this.measures = measures;
        // this.computeDGraph(dataSource);
        // this.computeMGraph(dataSource);
    }
    computeGraph(dataSource, fields, cc) {
        let matrix = fields.map((f) => fields.map(() => 0));
        for (let i = 0; i < fields.length; i++) {
            matrix[i][i] = 1;
            for (let j = i + 1; j < fields.length; j++) {
                matrix[i][j] = matrix[j][i] = cc(dataSource, fields[i], fields[j]);
            }
        }
        return matrix;
    }
    computeDGraph(dataSource, cc = cramersV) {
        this.DG = this.computeGraph(dataSource, this.dimensions, cc);
        return this.DG;
    }
    computeMGraph(dataSource, cc = pearsonCC) {
        this.MG = this.computeGraph(dataSource, this.measures, cc);
        return this.MG;
    }
    // public clusterDGraph(dataSource: IRow[], CORRELATION_THRESHOLD?: number) {
    //     const { dimensions, DIMENSION_CORRELATION_THRESHOLD } = this;
    //     this.DClusters = getDimClusterGroups(
    //         dataSource,
    //         dimensions,
    //         CORRELATION_THRESHOLD || DIMENSION_CORRELATION_THRESHOLD
    //     );
    //     return this.DClusters;
    // }
    clusterDGraph(dataSource, CORRELATION_THRESHOLD) {
        const { dimensions, DIMENSION_CORRELATION_THRESHOLD } = this;
        const threshold = CORRELATION_THRESHOLD || DIMENSION_CORRELATION_THRESHOLD;
        const DG = this.DG;
        const clusters = [];
        for (let i = 0; i < dimensions.length; i++) {
            const groups = [];
            for (let j = 0; j < dimensions.length; j++) {
                if (DG[i][j] >= threshold) {
                    groups.push(dimensions[j]);
                }
            }
            clusters.push(groups);
        }
        let uniqueClusters = [];
        for (let i = 0; i < clusters.length; i++) {
            let removeIndices = [];
            let noSuperset = true;
            for (let j = 0; j < uniqueClusters.length; j++) {
                if (subset2theOther(clusters[i], uniqueClusters[j])) {
                    if (clusters[i].length > uniqueClusters[j].length) {
                        removeIndices.push(j);
                    }
                    else {
                        noSuperset = false;
                    }
                }
            }
            if (removeIndices.length > 0) {
                uniqueClusters = uniqueClusters.filter((_, i) => {
                    return !removeIndices.includes(i);
                });
            }
            if (noSuperset) {
                uniqueClusters.push(clusters[i]);
            }
        }
        this.DClusters = uniqueClusters;
        return uniqueClusters;
    }
    clusterMGraph(dataSource, CORRELATION_THRESHOLD) {
        const { measures, MEASURE_CORRELATION_THRESHOLD } = this;
        this.MClusters = getMeaSetsBasedOnClusterGroups(dataSource, measures, CORRELATION_THRESHOLD || MEASURE_CORRELATION_THRESHOLD);
        return this.MClusters;
    }
}
