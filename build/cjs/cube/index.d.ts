import { IAggGroup, ICubeStorageManageMode, IRow, IStorageMode } from "../commonTypes";
import { StatFuncName } from "../statistics";
import { Cuboid } from "./cuboid";
import { VIStorage } from '@kanaries/adapters';
interface ICube {
    dimensions: string[];
    measures: string[];
    dataSource: IRow[];
    ops?: StatFuncName[];
    storageName?: string;
    storage?: VIStorage;
    cubeStorageManageMode?: ICubeStorageManageMode;
    cuboidOrderLimit?: number;
}
export declare class Cube implements ICube {
    storageName: string;
    storage: VIStorage;
    dimensions: string[];
    measures: string[];
    dataSource: IRow[];
    ops: StatFuncName[];
    private cuboids;
    private dimOrder;
    private ranges;
    storageManageMode: ICubeStorageManageMode;
    cuboidInMemorySizeLimit: number;
    private _performance;
    recordPerformace: boolean;
    cuboidOrderLimit: number;
    constructor(props: ICube);
    sortDimension(dimensions: string[]): string[];
    getCuboidKey(dimensions: string[]): string;
    getCuboid(dimensions: string[]): Promise<Cuboid>;
    showPerformance(): [string, number[]][];
    private _getCuboid;
    getNearstExistParent(dimensions: string[]): Promise<Cuboid>;
    private computeRanges;
    buildCuboidOnCluster(dimensions: string[]): Promise<void>;
    getCuboidStorageMode(cost: number): IStorageMode;
    buildBaseCuboid(): Promise<Cuboid>;
    loadCuboid(cuboidKey: string, cuboidState: IAggGroup[]): Promise<void>;
    exportCuboids(): {
        [key: string]: IAggGroup[];
    };
    getBaseCuboid(): Promise<Cuboid>;
    get cuboidSize(): number;
}
export {};
