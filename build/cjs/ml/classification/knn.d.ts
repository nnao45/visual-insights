import { DataSource, Record, NormalizedRecord } from "../../commonTypes";
interface BaseProps {
    readonly dataSource: DataSource;
    readonly dimensions: string[];
    readonly measures: string[];
}
declare class Base {
    readonly dataSource: DataSource;
    readonly dimensions: string[];
    readonly measures: string[];
    protected valueSets: Array<Map<any, number>>;
    protected valueParser: string[][];
    protected ranges: Array<[number, number]>;
    normalizedDataSource: NormalizedRecord[];
    constructor(props: BaseProps);
    normalize(): NormalizedRecord[];
    normalizeRecord(record: Record): NormalizedRecord;
}
export interface KNNProps extends BaseProps {
    K: number;
}
export declare class KNN extends Base {
    K: number;
    features: string[];
    targets: string[];
    constructor(props: KNNProps);
    getNeighbors(targetRecord: NormalizedRecord, features: string[], weights?: number[] | undefined): NormalizedRecord[];
    getTargetValue(targets: string[], neighbors: NormalizedRecord[]): any[];
}
export {};
