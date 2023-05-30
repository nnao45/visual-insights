import { Record } from '../commonTypes';
export declare type CorrelationCoefficient = (dataSource: Record[], fieldX: string, fieldY: string) => number;
export declare class DataGraph {
    /**
     * dimension graph(adjmatrix)
     */
    DG: number[][];
    /**
     * measure graph(adjmatrix)
     */
    MG: number[][];
    constructor(dataSource: Record[], dimensions: string[], measures: string[]);
    private computeGraph;
    computeDGraph(dataSource: Record[], dimensions: string[], cc?: CorrelationCoefficient): number[][];
    computeMGraph(dataSource: Record[], measures: string[], cc?: CorrelationCoefficient): number[][];
}
