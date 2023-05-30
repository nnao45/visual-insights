import { IAggGroup, IRow, StatFunc } from '../commonTypes';
export declare type StatFuncName = 'sum' | 'mean' | 'max' | 'min' | 'count' | 'dist';
export declare const SFMapper: {
    [key: string]: StatFunc;
};
export declare function getAggregator(op: StatFuncName): StatFunc<undefined, number>;
export declare function groupBy(rows: IRow[], by: string[]): Map<string, IRow[]>;
export declare function getValueMapList(rows: IRow[], by: string[]): Map<any, number>[];
export declare function encodeRowsByValueMap(rows: IRow[], dimensions: string[], valueMapList: Map<any, number>[]): IRow[];
export declare function groupByDev(rows: IRow[], by: string[], valueMapList: Map<any, number>[]): Map<string, IRow[]>;
export declare function fastGroupBy(rows: IRow[], by: string[]): IRow[][];
export interface ISimpleAggregateProps {
    dataSource: IRow[];
    dimensions: string[];
    measures: string[];
    ops: StatFuncName[];
}
export declare function simpleAggregate(props: ISimpleAggregateProps): IRow[];
export interface ISTDAggregateProps {
    dataSource: IRow[];
    dimensions: string[];
    measures: string[];
    ops: StatFuncName[];
}
export declare function stdAggregate(props: ISTDAggregateProps): IAggGroup[];
export declare function getAggHashKey(values: any[]): string;
export interface ISTDAggregateFromCuboidProps {
    cuboidState: IAggGroup[];
    dimensions: string[];
    measures: string[];
    ops: StatFuncName[];
}
export declare function stdAggregateFromCuboid(props: ISTDAggregateFromCuboidProps): IAggGroup[];
