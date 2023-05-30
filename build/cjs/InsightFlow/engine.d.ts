import { IRow, ViewSpace, FieldDictonary, IFieldSummary, IInsightSpace, IMutField, IStorage, IDataStorage } from "../commonTypes";
import { DataGraph } from "./dataGraph";
import { Cube } from "../cube";
import { StatFuncName } from "../statistics";
import { InsightWorkerCollection } from "./workerCollection";
interface ConstRange {
    MAX: number;
    MIN: number;
}
export declare class VIEngine {
    rawDataSource: IRow[];
    dataSource: IRow[];
    env: 'node' | 'browser';
    private _dimensions;
    private _measures;
    private _mutFields;
    rawFields: IFieldSummary[];
    fields: IFieldSummary[];
    protected fieldDictonary: FieldDictonary;
    dataGraph: DataGraph;
    cube: Cube | null;
    workerCollection: InsightWorkerCollection;
    subSpaces: ViewSpace[];
    insightSpaces: IInsightSpace[];
    aggregators: StatFuncName[];
    cubeStorageName: string;
    minDistEvalSampleSize: number;
    /**
    * number of dimensions appears in a view.
    */
    DIMENSION_NUM_IN_VIEW: ConstRange;
    /**
    * number of measures appears in a view.
    */
    MEASURE_NUM_IN_VIEW: ConstRange;
    constructor();
    serialize(): {
        storage: IStorage;
        dataStorage: IDataStorage;
    };
    deSerialize(storage: IStorage, dataStorage?: IDataStorage): void;
    /**
     * 为了实现简单，这里加一个隐形约束，必须先setData，才能调用setFields
     *
     * @param mutFields
     */
    setFields(mutFields: IMutField[]): void;
    setData(dataSource: IRow[]): this;
    get dimensions(): string[];
    get measures(): string[];
    buildfieldsSummary(): this;
    univarSelection(selectMode?: 'auto' | 'list' | 'percent', percent?: number | undefined): void;
    buildGraph(): this;
    buildCube(injectCube?: Cube): Promise<this>;
    clusterFields(): this;
    private static getCombinationFromClusterGroups;
    buildSubspaces(DIMENSION_NUM_IN_VIEW?: ConstRange, MEASURE_NUM_IN_VIEW?: ConstRange): VIEngine;
    static getSpaceImpurity(dataSource: IRow[], dimensions: string[], measures: string[]): number;
    exploreViewsPOC(viewSpaces?: ViewSpace[]): Promise<IInsightSpace[]>;
    exploreViews(viewSpaces?: ViewSpace[]): Promise<IInsightSpace[]>;
    searchPointInterests(viewSpace: ViewSpace): void;
    insightExtraction(viewSpaces?: ViewSpace[]): Promise<IInsightSpace[]>;
    setInsightScores(): this;
    private getFieldInfoInVis;
    private getFieldInfoInVisBeta;
    specification(insightSpace: IInsightSpace): Promise<{
        schema: import("../commonTypes").ISpec;
        dataView: IRow[];
    }>;
}
export {};
