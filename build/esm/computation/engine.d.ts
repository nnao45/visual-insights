import { IRow, IFieldSummary } from "../commonTypes";
export declare abstract class ComputationEngine {
    abstract uvsView(viewName: string): Promise<IFieldSummary[]>;
    abstract loadData(viewName: string): Promise<IRow[]>;
}
