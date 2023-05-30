import { IRow } from "../commonTypes";
export declare function emptyCount(dataSource: IRow[], colKeys: string[]): number[];
/**
 *
 * @param dataSource
 * @returns indices of sparse column(with lots of null value)
 */
export declare function detectSparseColumn(dataSource: IRow[], colKeys: string[], SPARE_THRESHOLD?: number): number[];
/**
 * 1. drop掉&
 */
export declare function minDrop(dataSource: IRow[], colKeys: string[]): IRow[];
