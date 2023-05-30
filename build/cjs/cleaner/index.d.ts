import { DataSource } from '../commonTypes';
declare function dropNullColumn(dataSource: DataSource, fields: string[]): {
    fields: string[];
    dataSource: DataSource;
};
declare function dropNull(dataSource: DataSource, dimensions: string[], measures: string[]): DataSource;
/**
 * use mode of one field to replace its null value
 * @param dataSource
 * @param fieldNames name list of fields you want to clean with useMode function.
 * problem: some field may regard the null value as the most common value... sad : (.
 * I am dead.
 */
declare function useMode(dataSource: DataSource, fieldNames: string[]): DataSource;
declare function simpleClean(dataSource: DataSource, dimensions: string[], measures: string[]): DataSource;
export { simpleClean, dropNull, useMode, dropNullColumn };
