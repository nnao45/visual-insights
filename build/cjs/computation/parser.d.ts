import { IRow, IAnalyticType, IDataType, ISemanticType } from "../commonTypes";
export declare function dbDataType2DataType(dbDataType: string): IDataType;
export declare function inferSemanticTypeFromDataType(dataType: IDataType): ISemanticType;
export declare function inferAnalyticTypeFromDataType(dataType: IDataType): IAnalyticType;
export declare function parseCell(rawValue: string, dataType: string): string | number;
export declare function parseTable(str: string, fields: {
    fid: string;
    dataType: string;
}[]): IRow[];
