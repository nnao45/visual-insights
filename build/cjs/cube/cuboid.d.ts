import { IAggGroup, IRow, IStorageMode } from "../commonTypes";
import { StatFuncName } from "../statistics";
import { VIStorage } from '@kanaries/adapters';
export interface ComplexRecord {
    [key: string]: {
        [key: string]: number;
    } | string | null | undefined | number | boolean;
}
export declare type ICuboidStorageMode = 'io' | 'cache' | 'mix';
interface CuboidProps {
    dimensions: string[];
    measures: string[];
    ranges: Map<string, [number, number]>;
    storage: VIStorage;
    ops?: StatFuncName[];
    storageMode?: IStorageMode;
}
export declare class Cuboid {
    dimensions: string[];
    measures: string[];
    ops: StatFuncName[];
    private _state;
    private cached;
    private sto;
    statSize: number;
    ranges: Map<string, [number, number]>;
    storageMode: IStorageMode;
    constructor(props: CuboidProps);
    cacheState(state: IAggGroup[]): void;
    clearState(): void;
    getState(): Promise<IAggGroup[]>;
    loadStateInCache(): Promise<void>;
    setState(state: IAggGroup[]): Promise<void>;
    setData(dataSource: IRow[]): Promise<IRow[]>;
    computeFromCuboid(cuboid: Cuboid): Promise<IAggGroup[]>;
    get size(): number;
    getAggregatedRows(measures: string[], operatorOfMeasures: StatFuncName[]): Promise<IRow[]>;
    getRawState(): Promise<IAggGroup[]>;
}
export {};
