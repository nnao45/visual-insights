import { DataSource, ViewSpace } from "../commonTypes";
export interface InsightSpace {
    dimensions: string[];
    measures: string[];
    type?: string;
    order?: 'desc' | 'asc';
    score?: number;
    significance: number;
    impurity?: number;
    description?: any;
}
export declare type IntentionWorker = (aggData: DataSource, dimensions: string[], measures: string[]) => Promise<InsightSpace | null>;
export declare const getGeneralIntentionSpace: IntentionWorker;
export declare const getOutlierIntentionSpace: IntentionWorker;
export declare const getTrendIntentionSpace: IntentionWorker;
export declare const getGroupIntentionSpace: IntentionWorker;
export declare class IntentionWorkerCollection {
    static colletion: IntentionWorkerCollection;
    private workers;
    private constructor();
    register(name: string, iWorker: IntentionWorker): void;
    enable(name: string, status: boolean): void;
    each(func: (iWorker: IntentionWorker, name?: string) => void): void;
    static init(props?: {
        withDefaultIWorkers?: boolean;
    }): IntentionWorkerCollection;
}
export declare function getIntentionSpaces(cubePool: Map<string, DataSource>, viewSpaces: ViewSpace[], Collection: IntentionWorkerCollection): Promise<InsightSpace[]>;
interface VisSpaceProps {
    dataSource: DataSource;
    dimensions: string[];
    measures: string[];
    collection?: IntentionWorkerCollection;
    dimension_correlation_threshold?: number;
    measure_correlation_threshold?: number;
    max_dimension_num_in_view?: number;
    max_measure_num_in_view?: number;
}
export declare function getVisSpaces(props: VisSpaceProps): Promise<InsightSpace[]>;
export {};
