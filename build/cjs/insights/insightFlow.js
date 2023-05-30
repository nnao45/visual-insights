import { cramersV, pearsonCC } from '../statistics';
// export const totalVariationCC: CorrelationCoefficient = (dataSource, fieldX, fieldY) => {
// }
export class DataGraph {
    constructor(dataSource, dimensions, measures) {
        this.computeDGraph(dataSource, dimensions);
        this.computeMGraph(dataSource, measures);
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
    computeDGraph(dataSource, dimensions, cc = cramersV) {
        this.DG = this.computeGraph(dataSource, dimensions, cc);
        return this.DG;
    }
    computeMGraph(dataSource, measures, cc = pearsonCC) {
        this.MG = this.computeMGraph(dataSource, measures, cc);
        return this.MG;
    }
}
// export class InsightFlow implements Dataset {
//   public dataSource: Record[]
//   public dimensions: string[]
//   public measures: string[]
//   private dataGraph: number[][]
//   private cubePool: any
//   insightSpaces: InsightSpace[]
//   constructor(props) {}
// }
