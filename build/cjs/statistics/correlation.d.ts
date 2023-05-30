import { IRow } from "../commonTypes";
declare type NestTree = Map<string, Map<string, number>>;
/**
 * correlation coefficient function. returns a value in range [0, 1].
 */
export declare type CorrelationCoefficient = (dataSource: IRow[], fieldX: string, fieldY: string) => number;
/**
 * chiSquared implementation using adjacency list(spare graph), which is ableto handle fields with large cardinality.
 * @param nestTree hash tree with depth = 2, represents the relationship between var x and var y.
 * @param xSet value set of var x.
 * @param ySet value set of var y.
 */
export declare function chiSquared(nestTree: NestTree, xSet: Set<string>, ySet: Set<string>): number;
/**
 * cramersV implementation using adjacency list(spare graph), which is ableto handle fields with large cardinality.
 * @param dataSource array of records.
 * @param fieldX field key of var X.
 * @param fieldY field key of varY.
 */
export declare const cramersV: CorrelationCoefficient;
export declare function chiSquaredFromDataSource(dataSource: IRow[], fieldX: string, fieldY: string): number;
/**
 * Pearson correlation coefficient
 * @param dataSource array of records
 * @param fieldX field key of var X.
 * @param fieldY field key of var Y.
 */
export declare const pearsonCC: CorrelationCoefficient;
export {};
