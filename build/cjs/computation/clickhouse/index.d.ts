import { ComputationEngine } from "../engine";
import { CHDataGraph } from "./dataGraph";
import { IConstRange, IDataViewMeta, IDBFieldMeta, IFieldSummary, IInsightSpace } from "../../commonTypes";
import { CHStatistics } from "./statistics";
import { CHUtils } from "./utils";
export declare class ClickHouseEngine implements ComputationEngine {
    rawFields: IFieldSummary[];
    fields: IFieldSummary[];
    dataViewName: string | null;
    dataGraph: CHDataGraph | null;
    dataViewMetas: IDataViewMeta[];
    insightSpaces: IInsightSpace[];
    dbMetas: IDBFieldMeta[];
    utils: CHUtils;
    statistics: CHStatistics;
    features: {
        size: number;
    };
    /**
    * number of dimensions appears in a view.
    */
    DIMENSION_NUM_IN_VIEW: IConstRange;
    /**
    * number of measures appears in a view.
    */
    MEASURE_NUM_IN_VIEW: IConstRange;
    constructor();
    get dimensions(): string[];
    get measures(): string[];
    setRawFields(fields: IFieldSummary[]): void;
    query(sql: string): Promise<string>;
    queryw(sql: string): Promise<string>;
    loadData(viewName: string): Promise<import("../../commonTypes").IRow[]>;
    getFieldMetas(viewName: string): Promise<IDBFieldMeta[]>;
    buildFieldsSummary(viewName: string): Promise<IFieldSummary[]>;
    uvsView(tableName: string): Promise<IFieldSummary[]>;
    getContinuousRanges(viewName: string): Promise<Array<{
        fid: string;
        range: [number, number];
    }>>;
    binContinuousFields(tableName: string, groupNumber: number): Promise<string[]>;
    featureTransform(tableName: string, viewName: string): Promise<IFieldSummary[]>;
    buildDataGraph(): Promise<void>;
    clusterFields(): this;
    buildSubspaces(DIMENSION_NUM_IN_VIEW?: IConstRange, MEASURE_NUM_IN_VIEW?: IConstRange): this;
    private getSpaceImpurity;
    fastInsightRecommand(dataViewMetas?: IDataViewMeta[]): Promise<IInsightSpace[]>;
    private getFieldInfoInVis;
    queryAggDataView(dimensions: string[], measures: string[], aggregators: string[], limit?: number): Promise<import("../../commonTypes").IRow[]>;
    queryDataView(dimensions: string[], measures: string[], limit?: number): Promise<import("../../commonTypes").IRow[]>;
    specification(insightSpace: IInsightSpace): Promise<{
        detailSize: number;
        dataView: import("../../commonTypes").IRow[];
        schema: import("../../commonTypes").ISpec;
    }>;
    destroyView(): Promise<void>;
}
