import { DataSource } from '../commonTypes';
export declare function getDimCorrelationMatrix(dataSource: DataSource, dimensions: string[]): number[][];
export declare function getMeaCorrelationMatrix(dataSource: DataSource, measures: string[]): number[][];
export declare function getDimClusterGroups(dataSource: DataSource, dimensions: string[], threshold?: number | undefined, max_number_of_group?: number): string[][];
export declare function getDimSetsBasedOnClusterGroups(dataSource: DataSource, dimensions: string[], correlation_threshold?: number, max_dimensions_in_space?: number): string[][];
/**
 *
 * @param dataSource
 * @param measures
 * @param correlation_threshold a threshold of correlation used to define min correlation value in a cluster of measure.
 * @param max_measure_in_view
 */
export declare function getMeaSetsBasedOnClusterGroups(dataSource: DataSource, measures: string[], correlation_threshold?: number, max_number_of_group?: number | undefined): string[][];
export declare function subspaceSearching(dataSource: DataSource, dimensions: string[], should_dimensions_correlated?: boolean | undefined): string[][];
declare type RelatedEdge = {
    field: string;
    corValue: number;
};
export declare function getRelatedVertices(adjMatrix: number[][], vertices: string[], verticesInGraph: string[], topK?: number): RelatedEdge[];
export {};
