import { IRow } from "../commonTypes";
import { CorrelationCoefficient } from "../statistics";
export declare class DataGraph {
    dimensions: string[];
    measures: string[];
    /**
     * dimension graph(adjmatrix)
     */
    DG: number[][];
    /**
     * measure graph(adjmatrix)
     */
    MG: number[][];
    DClusters: string[][];
    MClusters: string[][];
    DIMENSION_CORRELATION_THRESHOLD: number;
    MEASURE_CORRELATION_THRESHOLD: number;
    constructor(dimensions: string[], measures: string[]);
    private computeGraph;
    computeDGraph(dataSource: IRow[], cc?: CorrelationCoefficient): number[][];
    computeMGraph(dataSource: IRow[], cc?: CorrelationCoefficient): number[][];
    clusterDGraph(dataSource: IRow[], CORRELATION_THRESHOLD?: number): string[][];
    clusterMGraph(dataSource: IRow[], CORRELATION_THRESHOLD?: number): string[][];
}
