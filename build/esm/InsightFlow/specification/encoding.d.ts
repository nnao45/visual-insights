import { IRow, ISpec, IFieldSummaryInVis } from "../../commonTypes";
export declare const geomTypes: {
    interval: number[];
    line: number[];
    area: number[];
    point: number[];
    path: number[];
    density: number[];
};
export declare function encoding(fields: IFieldSummaryInVis[]): ISpec;
export declare function specification(fields: IFieldSummaryInVis[], dataView: IRow[]): {
    schema: ISpec;
    dataView: IRow[];
};
