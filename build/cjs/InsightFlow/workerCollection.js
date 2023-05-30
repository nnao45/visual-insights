import { IForestOutlierWorker } from '../insights/workers/IForestOutlier';
// import { KNNClusterWorker } from './workers/KNNCluster';
import { LRTrendWorker } from '../insights/workers/LRTrend';
import { DefaultIWorker } from "../commonTypes";
import { KNNClusterWorker } from "../insights";
/**
 * collection of insight workers. it helps to manage all the workers in a centralized way.
 */
export class InsightWorkerCollection {
    constructor() {
        this.workers = new Map();
    }
    register(name, iWorker) {
        if (this.workers.has(name)) {
            throw new Error(`There has been a worker named: ${name} already.`);
        }
        else {
            this.workers.set(name, [true, iWorker]);
        }
    }
    /**
     * set a existed worker's status.
     * @param name insight worker's name used for register.
     * @param status whether the worker should be used.
     */
    enable(name, status) {
        if (!this.workers.has(name)) {
            throw new Error(`Intention Worker "${name}" does not exist.`);
        }
        else {
            let iWorkerWithStatus = this.workers.get(name);
            iWorkerWithStatus[0] = status;
            this.workers.set(name, iWorkerWithStatus);
        }
    }
    /**
     * enumerate all enabled insight workers.
     * @param func (what is going to be done with the given worker)
     */
    each(func) {
        for (let [name, iWorker] of this.workers) {
            if (iWorker[0]) {
                func(iWorker[1], name);
            }
        }
    }
    static init(props = { withDefaultIWorkers: true }) {
        const { withDefaultIWorkers = true } = props;
        if (!InsightWorkerCollection.colletion) {
            InsightWorkerCollection.colletion = new InsightWorkerCollection();
            if (withDefaultIWorkers) {
                InsightWorkerCollection.colletion.register(DefaultIWorker.outlier, IForestOutlierWorker);
                InsightWorkerCollection.colletion.register(DefaultIWorker.cluster, KNNClusterWorker);
                InsightWorkerCollection.colletion.register(DefaultIWorker.trend, LRTrendWorker);
            }
        }
        Object.values(DefaultIWorker).forEach(workerName => {
            InsightWorkerCollection.colletion.enable(workerName, withDefaultIWorkers);
        });
        return InsightWorkerCollection.colletion;
    }
}
