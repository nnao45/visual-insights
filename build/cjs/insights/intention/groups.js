import { KNN } from "../../ml/classification/knn";
export class GroupIntention extends KNN {
    getTargetValuePercent(targets, targetRecord, neighbors) {
        let ans = [];
        targets.forEach((target, index) => {
            let sameCount = 0;
            neighbors.forEach(nei => {
                if (nei[target] === targetRecord[target]) {
                    sameCount++;
                }
            });
            ans.push(sameCount / neighbors.length);
        });
        return ans;
    }
    getSignificance(features, targets) {
        let ans = 0;
        this.normalizedDataSource.forEach(record => {
            let neighbors = this.getNeighbors(record, features);
            let percents = this.getTargetValuePercent(targets, record, neighbors);
            let sig = 0;
            percents.forEach(per => {
                sig += per;
            });
            sig /= percents.length;
            ans += sig;
        });
        ans /= this.normalizedDataSource.length;
        return ans;
    }
}
