/**
 * cite: code below are mostly from vega/datalib.
 */
import { IRow, IDataType, IFieldSummary, FieldDictonary } from '../commonTypes';
export declare function inferDataType(values: any[]): IDataType;
export declare function getFieldsSummary(fieldKeys: string[], dataSource: IRow[]): {
    fields: IFieldSummary[];
    dictonary: FieldDictonary;
};
