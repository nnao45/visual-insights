import { IAggGroup, StatFunc } from '../commonTypes';
import { StatFuncName } from './aggregation';
/**
 * 只针对 stdAggregateFromCuboid 设计的写法，其他地方不要使用，不具备通用型。
 * @param rows
 * @param colKey
 * @param opKey
 * @returns
 */
export declare function sumByCol(rows: IAggGroup[], colKey: string, opKey: StatFuncName): number;
export declare const dist: StatFunc<[number, number], number[]>;
export declare function distMergeBy(rows: IAggGroup[], colKey: string, opKey: StatFuncName): number[];
export declare function sum(nums: number[]): number;
export declare function mean(nums: number[]): number;
export declare function max(nums: number[]): number;
export declare function min(nums: number[]): number;
