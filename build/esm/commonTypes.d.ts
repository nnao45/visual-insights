import { StatFuncName } from './statistics';
export declare type ISemanticType = 'quantitative' | 'nominal' | 'ordinal' | 'temporal';
export declare type IDataType = 'number' | 'integer' | 'boolean' | 'date' | 'string';
export declare type IAnalyticType = 'dimension' | 'measure';
/**
 * @deprecated
 */
export interface Record {
    [key: string]: any;
}
export interface IRow {
    [key: string]: any;
}
export interface NormalizedRecord {
    [key: string]: number;
}
export declare type DataSource = IRow[];
export declare type Dimensions = string[];
export declare type Measures = string[];
/**
 * @deprecated
 */
export declare type FieldType = 'quantitative' | 'nominal' | 'ordinal' | 'temporal';
export interface Field {
    name: string;
    type: FieldType;
}
export declare type FieldImpurity = [string, number, number, Field];
export interface Specification {
    position?: string[];
    color?: string[];
    size?: string[];
    shape?: string[];
    opacity?: string[];
    facets?: string[];
    page?: string[];
    filter?: string[];
    highFacets?: string[];
    geomType?: string[];
}
export interface View {
    schema: Specification;
    aggData: DataSource;
}
export declare type OperatorType = 'sum' | 'mean' | 'count';
export interface InsightSpace {
    dimensions: string[];
    measures: string[];
    type?: string;
    order?: 'desc' | 'asc';
    score?: number;
    significance: number;
    impurity?: number;
    description?: any;
}
export interface IConstRange {
    MAX: number;
    MIN: number;
}
export interface IDataViewMeta {
    dimensions: string[];
    measures: string[];
}
export interface IDBFieldMeta {
    fid: string;
    dataType: string;
}
export declare type StatFunc<T = undefined, R = number> = (values: number[], info?: T) => R;
export interface IAggGroup {
    groupDict: {
        [key: string]: any;
    };
    stat: {
        [mea: string]: {
            [op: string]: number | number[];
        };
    };
}
interface IFieldBase {
    fid: string;
    name?: string;
    analyticType: IAnalyticType;
    semanticType: ISemanticType;
}
export interface IRawField extends IFieldBase {
    disable?: boolean;
    pfid?: string | null;
}
/**
* ImuteFieldBase 是未来替换IRawField的新interface，其扩展了'?'类型，方便告诉后续的类型推断机制来做。
*/
export interface IMuteFieldBase {
    fid: string;
    name?: string;
    analyticType: 'dimension' | 'measure' | '?';
    semanticType: 'nominal' | 'temporal' | 'ordinal' | 'quantitative' | '?';
    disable?: boolean | '?';
}
export interface IFieldMeta extends IFieldBase {
    /**
     * 性质上是计算属性，只读。
     */
    features: {
        entropy: number;
        maxEntropy: number;
        unique: number;
        max: number;
        min: number;
        [key: string]: any;
    };
    distribution: Array<{
        memberName: string;
        count: number;
    }>;
    disable?: boolean;
}
export interface IFilter {
    field: IFieldMeta;
    values: any[];
}
export interface IPattern {
    fields: IFieldMeta[];
    imp: number;
    filters?: IFilter[];
}
export declare enum IStorageMode {
    LocalCache = "local_cahce",
    LocalDisk = "local_disk"
}
export declare enum ICubeStorageManageMode {
    LocalCache = "local_cache",
    LocalDisk = "local_disk",
    LocalMix = "local_mix"
}
export declare enum DefaultIWorker {
    outlier = "default_outlier",
    cluster = "default_group",
    trend = "default_trend"
}
export interface ViewSpace {
    dimensions: string[];
    measures: string[];
}
export interface IField {
    key: string;
    name?: string;
    analyticType: IAnalyticType;
    semanticType: ISemanticType;
    dataType: IDataType;
}
export interface IMutField {
    key: string;
    name?: string;
    analyticType: IAnalyticType | '?';
    semanticType: ISemanticType | '?';
    dataType: IDataType | '?';
}
export interface IFieldSummary extends IField {
    features: {
        unique: number;
        size: number;
        entropy: number;
        maxEntropy: number;
        min: number;
        max: number;
        [key: string]: any;
    };
}
export declare type FieldDictonary = Map<string, IFieldSummary>;
export interface IInsightSpace {
    dimensions: string[];
    measures: string[];
    type?: string;
    score?: number;
    significance: number;
    impurity?: number;
    description?: any;
    [key: string]: any;
}
export interface IAlgebraView {
    dimensions: string[];
    measures: string[];
}
export interface IStatView extends IAlgebraView {
    aggregate: boolean;
    ops?: StatFuncName[];
}
export interface IStorage {
    version: string;
    fields: IFieldSummary[];
    dataGraph: {
        DG: number[][];
        MG: number[][];
        DClusters: string[][];
        MClusters: string[][];
    };
    subSpaces: ViewSpace[];
    insightSpaces: IInsightSpace[];
}
export interface IDataStorage {
    version: string;
    dataSource: {
        raw: IRow[];
        view: IRow[];
    };
    cuboids: {
        [key: string]: IAggGroup[];
    };
}
export interface IFieldSummaryInVis extends IFieldSummary {
    impurity: number;
}
export interface ISpec {
    position?: string[];
    color?: string[];
    size?: string[];
    shape?: string[];
    opacity?: string[];
    facets?: string[];
    page?: string[];
    filter?: string[];
    highFacets?: string[];
    geomType?: string[];
}
export {};
