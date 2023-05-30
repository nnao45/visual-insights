import { Record } from '../commonTypes';
export interface Dataset {
    dataSource: Record[];
    dimensions: string[];
    measures: string[];
}
export declare function mockDataSet(size?: number, dimNum?: number, meaNum?: number): Dataset;
