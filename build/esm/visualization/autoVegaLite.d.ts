/**
 * distVis 是分布式可视化的推荐，是比较新的模块，目前暂时用于dev模块，即voyager模式下的测试。
 */
import { IPattern, IRow } from "../commonTypes";
export declare const geomTypeMap: {
    [key: string]: any;
};
interface BaseVisProps {
    dataSource: IRow[];
    pattern: IPattern;
}
export declare function labDistVis(props: BaseVisProps): any;
export {};
