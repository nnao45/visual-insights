import { IRow } from '../commonTypes';
declare const JOIN_SYMBOL = "_";
declare function deepcopy(data: any): any;
declare function copyData(data: IRow[]): IRow[];
declare function isFieldCategory(dataSource: IRow[], fieldName: string): boolean;
declare function isFieldContinous(dataSource: IRow[], fieldName: string): boolean;
declare function isFieldNumeric(dataSource: IRow[], fieldName: string): boolean;
declare function isFieldTime(dataSource: IRow[], fieldName: string): boolean;
interface AggregateProps {
    dataSource: IRow[];
    fields: string[];
    bys: string[];
    method?: string;
}
declare function aggregate({ dataSource, fields, bys, method }: AggregateProps): IRow[];
declare function memberCount(dataSource: IRow[], field: string): [string, number][];
interface GroupFieldProps {
    dataSource: IRow[];
    field: string;
    newField: string;
    groupNumber: number;
}
declare function groupContinousField({ dataSource, field, newField, groupNumber }: GroupFieldProps): IRow[];
declare function groupCategoryField({ dataSource, field, newField, groupNumber }: GroupFieldProps): IRow[];
/**
 * Kullback–Leibler divergence
 * @param p1List
 * @param p2List
 *
 */
declare function DKL(p1List: number[], p2List: number[]): number;
declare function isFieldUnique(dataSource: IRow[], field: string): boolean;
export declare function subset2theOther(A: string[], B: string[]): boolean;
export { deepcopy, copyData, memberCount, groupCategoryField, groupContinousField, aggregate, isFieldCategory, isFieldContinous, isFieldTime, isFieldNumeric, JOIN_SYMBOL, DKL, isFieldUnique };
