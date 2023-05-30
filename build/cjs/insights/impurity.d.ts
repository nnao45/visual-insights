import { DataSource, OperatorType } from '../commonTypes';
export declare function getDimSetsBasedOnClusterGroups(dataSource: DataSource, dimensions: string[]): string[][];
export declare function subspaceSearching(dataSource: DataSource, dimensions: string[], shouldDimensionsCorrelated?: boolean | undefined): string[][];
export declare type FieldsFeature = [string[], any, number[][]];
export declare function insightExtraction(dataSource: DataSource, dimensions: string[], measures: string[], operator?: OperatorType | undefined): FieldsFeature[];
