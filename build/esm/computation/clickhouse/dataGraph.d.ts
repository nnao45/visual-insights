declare type ICC = (viewName: string, col1: string, col2: string) => Promise<number>;
export declare class CHDataGraph {
    viewName: string;
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
    SOFT_MAX_DIM_IN_VIEW: number;
    SOFT_MAX_MEA_IN_VIEW: number;
    private dimensions;
    private measures;
    constructor(viewName: string, dimensions: string[], measures: string[]);
    private computeGraph;
    computeDGraph(cc: ICC): Promise<number[][]>;
    computeMGraph(cc: ICC): Promise<number[][]>;
    clusterDGraph(CORRELATION_THRESHOLD?: number): string[][];
    clusterMGraph(CORRELATION_THRESHOLD?: number): string[][];
}
export {};
