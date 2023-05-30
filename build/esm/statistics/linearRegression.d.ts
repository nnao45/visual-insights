import { DataSource, NormalizedRecord, Record } from "../commonTypes";
export declare class oneDLinearRegression {
    private normalizedDataSource;
    readonly dataSource: DataSource;
    readonly X: string;
    readonly Y: string;
    private valueSets;
    constructor(dataSource: DataSource, X: string, Y: string);
    normalizeDimensions(dimensions: string[]): NormalizedRecord[];
    normalizeRecord(record: Record, dimensions: string[]): NormalizedRecord;
    mean(): [number, number];
    getRegressionEquation(): [number, number];
    r_squared(): number;
    cumulativeLogisticDistribution(x: number): number;
    pValue(): number;
    significance(): number;
}
