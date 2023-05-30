import { FieldDictonary, IInsightSpace, IRow } from '../commonTypes';
import { VIEngine } from './engine';
export declare type InsightWorker<E = VIEngine> = (aggData: IRow[], dimensions: string[], measures: string[], fieldDictonary: FieldDictonary, context: E) => Promise<IInsightSpace | null>;
