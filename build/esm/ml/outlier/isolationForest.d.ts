import { NormalizedRecord, DataSource, Record } from "../../commonTypes";
interface ITree {
    field: string;
    value: number;
    size: number;
    left?: ITree | null;
    right?: ITree | null;
}
export declare class IsolationForest {
    private normalizedDataSource;
    readonly dataSource: DataSource;
    readonly dimensions: string[];
    readonly measures: string[];
    readonly treeNumber: number;
    readonly sampleSize: number;
    readonly limitHeight: number;
    recordScoreList: number[];
    private valueSets;
    private ranges;
    private iForest;
    constructor(dimensions: string[], measures: string[], dataSource: DataSource, treeNumber?: number, Psi?: number);
    private normalizeDimensions;
    normalizeRecord(record: Record): NormalizedRecord;
    buildIsolationTree(normalizedSampleData: NormalizedRecord[], depth: number): ITree;
    /**
     * average unsuccessful searches in BST (Preiss, 1999)
     * @param Psi
     */
    AFS(Psi: number): number;
    getPathLength(record: NormalizedRecord, iTree: ITree, pathLength: number, nodeSize: number): number;
    buildIsolationForest(): ITree[];
    estimateOutierScore(): number[];
}
export {};
