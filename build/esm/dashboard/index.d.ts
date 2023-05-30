import { FieldsFeature } from "../insights/impurity";
import { DataSource, OperatorType } from "../commonTypes";
import { cramersV } from '../statistics/index';
interface DashBoardSpace {
    dimensions: string[];
    measures: string[];
    entropyMatrix: number[][];
    correlationMatrix: number[][];
    dimensionCorrelationMatrix: number[][];
}
export declare function getEntropyMatrix(dimensionsList: string[][], measures: string[], dataSource: DataSource, operator?: OperatorType | undefined): number[][];
export declare function getDashBoardSubspace(dataSource: DataSource, dimensions: string[], measures: string[], fieldFeatureList: FieldsFeature[]): DashBoardSpace[];
interface VisView {
    type?: 'target' | 'feature';
    dimensions: string[];
    measures: string[];
}
/**
 * handle how to combine dim and mea to produce a chart view in dashboard
 * @param dashBoardSpace
 *
 */
export declare function getDashBoardView(dashBoardSpace: DashBoardSpace, dataSource: DataSource): VisView[];
export { cramersV };
