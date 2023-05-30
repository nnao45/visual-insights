import * as Cluster from './cluster/index';
import { KNN } from './classification/knn';
import { IsolationForest } from './outlier/isolationForest';
declare const Outier: {
    IsolationForest: typeof IsolationForest;
};
declare const Classification: {
    KNN: typeof KNN;
};
export { Cluster, Outier, Classification };
