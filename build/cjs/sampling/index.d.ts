import { DataSource } from "../commonTypes";
/**
 * todo reservoir sampling is better to support stream data
 * Algorithm R:
 * Vitter, Jeffrey S. (1 March 1985). "Random sampling with a reservoir" (PDF). ACM Transactions on Mathematical Software. 11 (1): 37–57. CiteSeerX 10.1.1.138.784. doi:10.1145/3147.3165.
 */
export declare function reservoirSampling(dataSource: DataSource, size?: number | undefined): DataSource;
export declare function uniformSampling(dataSource: DataSource, size: number): DataSource;
