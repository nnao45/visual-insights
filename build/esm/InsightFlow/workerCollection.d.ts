import { InsightWorker } from "./interfaces";
/**
 * collection of insight workers. it helps to manage all the workers in a centralized way.
 */
export declare class InsightWorkerCollection {
    static colletion: InsightWorkerCollection;
    private workers;
    private constructor();
    register(name: string, iWorker: InsightWorker): void;
    /**
     * set a existed worker's status.
     * @param name insight worker's name used for register.
     * @param status whether the worker should be used.
     */
    enable(name: string, status: boolean): void;
    /**
     * enumerate all enabled insight workers.
     * @param func (what is going to be done with the given worker)
     */
    each(func: (iWorker: InsightWorker, name?: string) => void): void;
    static init(props?: {
        withDefaultIWorkers?: boolean;
    }): InsightWorkerCollection;
}
