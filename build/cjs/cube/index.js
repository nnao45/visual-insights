var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ICubeStorageManageMode, IStorageMode } from "../commonTypes";
import { getRangeBy } from "../statistics";
import { Cuboid } from "./cuboid";
// import { VIStorage } from './storage-node'
import { VIStorage } from '@kanaries/adapters';
// todo
// 至少返回的因该是一个DataFrame，而不应该是当前cuboid粒度的明细。
// case: 第一个请求的cuboid是明细粒度，则
const CUBOID_KEY_SPLITOR = '_join_';
const DEFAULT_OPS = ["max", "min", "sum", "mean", "count", 'dist'];
const CUBE_STORAGE_NAME = '_cuboids';
export class Cube {
    constructor(props) {
        this.storageName = CUBE_STORAGE_NAME;
        this.storageManageMode = ICubeStorageManageMode.LocalCache; //ICubeStorageManageMode.LocalMix;
        this.cuboidInMemorySizeLimit = 10000;
        this.recordPerformace = true;
        this.cuboidOrderLimit = 4;
        const { dimensions, measures, dataSource, ops = DEFAULT_OPS, storageName = CUBE_STORAGE_NAME, cubeStorageManageMode = ICubeStorageManageMode.LocalCache, cuboidOrderLimit = 4 } = props;
        this.dimensions = dimensions;
        this.measures = measures;
        this.dataSource = dataSource;
        this.ops = ops;
        this.cuboidOrderLimit = cuboidOrderLimit;
        this.dimOrder = new Map();
        this._performance = new Map();
        dimensions.forEach((dim, i) => {
            this.dimOrder.set(dim, i);
        });
        this.cuboids = new Map();
        this.ranges = new Map();
        this.storageName = storageName;
        this.storageManageMode = cubeStorageManageMode;
        if (typeof props.storage === 'undefined') {
            this.storage = new VIStorage(storageName);
            this.storage.init();
        }
        else {
            this.storage = props.storage;
        }
        // destroyStorage('test_cuboid.json') // fixme 没生效。
    }
    // public contains(dimensions: string[]): boolean {
    //     if (dimensions.length > )
    // }
    sortDimension(dimensions) {
        const orderedDims = [...dimensions];
        orderedDims.sort((d1, d2) => {
            return this.dimOrder.get(d1) - this.dimOrder.get(d2);
        });
        return orderedDims;
    }
    getCuboidKey(dimensions) {
        const orderedDims = this.sortDimension(dimensions);
        const dimKey = orderedDims.join(CUBOID_KEY_SPLITOR);
        return dimKey;
    }
    getCuboid(dimensions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.recordPerformace) {
                // semantic error TS2304: Cannot find name 'performance'.
                // @ts-ignore
                const start = performance.now();
                const res = yield this._getCuboid(dimensions);
                // @ts-ignore
                const end = performance.now();
                const orderedDims = this.sortDimension(dimensions);
                const dimKey = orderedDims.join(CUBOID_KEY_SPLITOR);
                if (!this._performance.has(dimKey)) {
                    this._performance.set(dimKey, []);
                }
                this._performance.get(dimKey).push(end - start);
                return res;
            }
            return this._getCuboid(dimensions);
        });
    }
    showPerformance() {
        return [...this._performance.entries()];
    }
    _getCuboid(dimensions) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderedDims = this.sortDimension(dimensions);
            const dimKey = orderedDims.join(CUBOID_KEY_SPLITOR);
            // this.cuboids.get(dimKey)
            if (this.cuboids.has(dimKey)) {
                return this.cuboids.get(dimKey);
            }
            // if (dimensions.length > this.cuboidOrderLimit) {
            //     return this.getNearstExistParent(dimensions);
            // }
            // does not get cuboid
            let currDimSet = new Set(dimensions);
            const existingParentKeys = [];
            const nullParentKeys = [];
            for (let dim of this.dimensions) {
                if (!currDimSet.has(dim)) {
                    // use insert O(n) instead of sort O(nlogn)
                    const parentDimensions = this.sortDimension([...orderedDims, dim]);
                    const parentKey = parentDimensions.join(CUBOID_KEY_SPLITOR);
                    if (this.cuboids.has(parentKey))
                        existingParentKeys.push(parentKey);
                    else {
                        nullParentKeys.push(parentKey);
                    }
                }
            }
            let minCost = Infinity;
            let minCuboidKey = this.dimensions.join(CUBOID_KEY_SPLITOR);
            if (existingParentKeys.length > 0) {
                for (let key of existingParentKeys) {
                    const pCuboid = this.cuboids.get(key);
                    if (pCuboid.size < minCost) {
                        minCost = pCuboid.size;
                        minCuboidKey = key;
                    }
                }
            }
            else if (nullParentKeys.length > 0) {
                minCuboidKey = nullParentKeys[0];
            }
            const parentCuboid = yield this.getCuboid(minCuboidKey.split(CUBOID_KEY_SPLITOR));
            // console.log('based on parents cube: ', minCuboidKey)
            // todo: 递归构建相关的cuboid，可能要依赖field dict来判断递归的路径
            const mode = this.getCuboidStorageMode(parentCuboid.size);
            let cuboid = new Cuboid({
                dimensions,
                measures: this.measures,
                ops: this.ops,
                ranges: this.ranges,
                storage: this.storage,
                storageMode: mode
            });
            // cuboid.setData(parentCuboid.state);
            yield cuboid.computeFromCuboid(parentCuboid);
            this.cuboids.set(dimKey, cuboid);
            return cuboid;
        });
    }
    getNearstExistParent(dimensions) {
        return __awaiter(this, void 0, void 0, function* () {
            const dimSet = new Set(dimensions);
            let parentCuboidDims = null;
            let potentionalParentCuboidDims = [];
            for (let dim of this.dimensions) {
                if (!dimSet.has(dim)) {
                    potentionalParentCuboidDims = [...dimensions, dim]; //this.getCuboidKey([...this.dimensions])
                    const ck = this.getCuboidKey(potentionalParentCuboidDims);
                    if (this.cuboids.has(ck)) {
                        parentCuboidDims = potentionalParentCuboidDims;
                        break;
                    }
                }
            }
            if (parentCuboidDims !== null) {
                return this.getCuboid(parentCuboidDims); // parentCub
            }
            else {
                if (potentionalParentCuboidDims.length !== 0) {
                    return this.getNearstExistParent(potentionalParentCuboidDims);
                }
                return this.getBaseCuboid();
            }
        });
    }
    computeRanges() {
        const { measures, dataSource } = this;
        for (let mea of measures) {
            this.ranges.set(mea, getRangeBy(dataSource, mea));
        }
    }
    buildCuboidOnCluster(dimensions) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseCuboidKey = this.sortDimension(this.dimensions).join(CUBOID_KEY_SPLITOR);
            const baseCuboid = this.cuboids.get(baseCuboidKey);
            const mode = this.getCuboidStorageMode(baseCuboid.statSize);
            let clusterCuboid = new Cuboid({
                dimensions,
                measures: this.measures,
                ops: this.ops,
                ranges: this.ranges,
                storage: this.storage,
                storageMode: mode
            });
            // clusterCuboid.setData(this.dataSource)
            yield clusterCuboid.computeFromCuboid(baseCuboid);
            this.cuboids.set(dimensions.join(CUBOID_KEY_SPLITOR), clusterCuboid);
        });
    }
    getCuboidStorageMode(cost) {
        if (this.storageManageMode === ICubeStorageManageMode.LocalCache)
            return IStorageMode.LocalCache;
        if (this.storageManageMode === ICubeStorageManageMode.LocalDisk)
            return IStorageMode.LocalDisk;
        return cost <= this.cuboidInMemorySizeLimit ? IStorageMode.LocalCache : IStorageMode.LocalDisk;
    }
    buildBaseCuboid() {
        return __awaiter(this, void 0, void 0, function* () {
            const mode = this.getCuboidStorageMode(this.dataSource.length);
            this.computeRanges();
            let baseCuboid = new Cuboid({
                dimensions: this.dimensions,
                measures: this.measures,
                ops: this.ops,
                ranges: this.ranges,
                storage: this.storage,
                storageMode: mode
            });
            yield baseCuboid.setData(this.dataSource);
            this.cuboids.set(this.dimensions.join(CUBOID_KEY_SPLITOR), baseCuboid);
            return baseCuboid;
        });
    }
    loadCuboid(cuboidKey, cuboidState) {
        return __awaiter(this, void 0, void 0, function* () {
            const cuboid = new Cuboid({
                dimensions: cuboidKey.split(CUBOID_KEY_SPLITOR),
                measures: this.measures,
                ops: this.ops,
                ranges: this.ranges,
                storage: this.storage
            });
            yield cuboid.setState(cuboidState);
            this.cuboids.set(cuboidKey, cuboid);
        });
    }
    exportCuboids() {
        const cbs = {};
        // for (let [ck, cb] of this.cuboids) {
        //     cbs[ck] = cb.getRawState()
        // }
        return cbs;
    }
    getBaseCuboid() {
        return __awaiter(this, void 0, void 0, function* () {
            const baseKey = this.dimensions.join(CUBOID_KEY_SPLITOR);
            if (!this.cuboids.has(baseKey)) {
                return this.buildBaseCuboid();
            }
            return this.cuboids.get(baseKey);
        });
    }
    get cuboidSize() {
        return this.cuboids.size;
    }
}
