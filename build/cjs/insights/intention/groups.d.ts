import { KNN } from "../../ml/classification/knn";
import { NormalizedRecord } from "../../commonTypes";
export declare class GroupIntention extends KNN {
    getTargetValuePercent(targets: string[], targetRecord: NormalizedRecord, neighbors: NormalizedRecord[]): any[];
    getSignificance(features: string[], targets: string[]): number;
}
