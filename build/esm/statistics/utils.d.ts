import { IRow } from "../commonTypes";
export declare function linearMapPositive(arr: number[]): number[];
export declare function mapPositive(arr: number[]): number[];
export declare function getCombination(elements: string[], start?: number, end?: number): string[][];
export declare type ImpurityFC = (probabilityList: number[]) => number;
export declare function normalize(frequencyList: number[]): number[];
export declare const entropy: ImpurityFC;
export declare const gini: ImpurityFC;
export declare function getRangeBy(dataSource: IRow[], by: string): [number, number];
