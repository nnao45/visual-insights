var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { IStorageMode } from "../commonTypes";
import { getAggHashKey, groupBy, stdAggregate, stdAggregateFromCuboid } from "../statistics";
import { dist } from "../statistics/aggregators";
const DEFAULT_OPS = ['max', 'min', 'sum', 'mean', 'count', 'dist'];
export class Cuboid {
    constructor(props) {
        this.cached = false;
        this.statSize = 0;
        this.storageMode = IStorageMode.LocalCache; // IStorageMode.LocalDisk;
        const { dimensions, measures, ops = DEFAULT_OPS, ranges, storage, storageMode = IStorageMode.LocalDisk } = props;
        this.dimensions = dimensions;
        this.measures = measures;
        this.ops = ops;
        this._state = [];
        this.cached = false;
        this.ranges = ranges;
        this.storageMode = storageMode;
        this.sto = storage;
    }
    cacheState(state) {
        this.cached = true;
        this._state = state;
    }
    clearState() {
        if (this.storageMode === IStorageMode.LocalDisk) {
            this.cached = false;
            this._state = [];
        }
    }
    getState() {
        return __awaiter(this, void 0, void 0, function* () {
            let state = [];
            if (this.storageMode === IStorageMode.LocalDisk) {
                if (this.cached) {
                    return this._state;
                }
                state = (yield this.sto.getItem(this.dimensions.join('-'))) || [];
            }
            else {
                state = this._state;
            }
            this.statSize = state.length;
            return state;
        });
    }
    loadStateInCache() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.storageMode === IStorageMode.LocalDisk) {
                this._state = (yield this.sto.getItem(this.dimensions.join('-'))) || [];
            }
            this.cached = true;
        });
    }
    setState(state) {
        return __awaiter(this, void 0, void 0, function* () {
            this.statSize = state.length;
            if (this.storageMode === IStorageMode.LocalDisk) {
                yield this.sto.setItem(this.dimensions.join('-'), state);
            }
            else {
                this._state = state;
            }
        });
    }
    setData(dataSource) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = stdAggregate({
                dimensions: this.dimensions,
                measures: this.measures,
                ops: this.ops,
                dataSource
            });
            const { dimensions, measures, ranges } = this;
            const groups = groupBy(dataSource, dimensions);
            for (let row of state) {
                const hashKey = getAggHashKey(dimensions.map(d => row.groupDict[d]));
                const groupValues = groups.get(hashKey);
                for (let mea of measures) {
                    const range = ranges.get(mea);
                    row.stat[mea]['dist'] = dist(groupValues.map(v => v[mea]), range);
                }
            }
            yield this.setState(state);
            return state;
        });
    }
    computeFromCuboid(cuboid) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ops, measures, dimensions } = this;
            const sourceCuboidState = yield cuboid.getState();
            const state = stdAggregateFromCuboid({
                dimensions,
                measures,
                ops,
                cuboidState: sourceCuboidState
            });
            yield this.setState(state);
            return state;
        });
    }
    get size() {
        return this.statSize;
    }
    getAggregatedRows(measures, operatorOfMeasures) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = [];
            const { dimensions } = this;
            const state = yield this.getState();
            for (let row of state) {
                let newRow = {};
                for (let dim of dimensions) {
                    newRow[dim] = row.groupDict[dim];
                }
                for (let i = 0; i < measures.length; i++) {
                    const mea = measures[i];
                    const op = operatorOfMeasures[i];
                    newRow[mea] = row.stat[mea][op];
                }
                data.push(newRow);
            }
            return data;
        });
    }
    getRawState() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getState();
        });
    }
}
