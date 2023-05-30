import { CHUtils } from "./utils";
import { IConstRange } from "../../commonTypes";
export declare function getCombinationFromClusterGroups(groups: string[][], limitSize: IConstRange): string[][];
export declare class CHStatistics {
    utils: CHUtils;
    constructor(chUtils: CHUtils);
    chiSquared: (viewName: string, col1: string, col2: string) => Promise<number>;
    cramersV: (viewName: string, col1: string, col2: string) => Promise<number>;
    pearsonCC: (viewName: string, col1: string, col2: string) => Promise<number>;
    getCombinationFromClusterGroups(groups: string[][], limitSize: IConstRange): string[][];
    getSpaceImpurity: (viewName: string, dimensions: string[], measures: string[]) => Promise<number>;
}
