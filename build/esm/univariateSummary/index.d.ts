import { DataSource, Field, FieldType, Record } from '../commonTypes';
/**
 *
 * @param dataSource
 * @param field
 * todo: should accept BIField type and calculate the semantic type basic on it.
 */
export declare function getFieldType(dataSource: DataSource, field: string): FieldType;
export declare function getAllFieldTypes(dataSource: DataSource, fields: string[]): Field[];
export interface Member extends Record {
    memberName: string;
    count: number;
}
export declare type FieldDistribution = Member[];
export declare function getFieldDistribution(dataSource: DataSource, field: string): FieldDistribution;
export interface FieldSummary {
    distribution: FieldDistribution;
    fieldName: string;
}
export declare function getAllFieldsDistribution(dataSource: DataSource, fields: string[]): FieldSummary[];
export interface FieldEntropy {
    fieldName: string;
    entropy: number;
    /**
     * potentional max entropy of this field, log(count(members))
     */
    maxEntropy: number;
}
export declare function getFieldEntropy(dataSource: DataSource, field: string): FieldEntropy;
export declare function getFloatFieldEntropy(dataSource: DataSource, field: string): FieldEntropy;
export declare function getAllFieldsEntropy(dataSource: DataSource, fields: string[]): FieldEntropy[];
interface GroupResult {
    groupedData: DataSource;
    newFields: Field[];
    fields: Field[];
}
export declare function groupFields(dataSource: DataSource, fields: Field[]): GroupResult;
export {};
