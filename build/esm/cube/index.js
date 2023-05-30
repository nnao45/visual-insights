"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cube = void 0;
var commonTypes_1 = require("../commonTypes");
var statistics_1 = require("../statistics");
var cuboid_1 = require("./cuboid");
// import { VIStorage } from './storage-node'
var adapters_1 = require("@kanaries/adapters");
// todo
// 至少返回的因该是一个DataFrame，而不应该是当前cuboid粒度的明细。
// case: 第一个请求的cuboid是明细粒度，则
var CUBOID_KEY_SPLITOR = '_join_';
var DEFAULT_OPS = ["max", "min", "sum", "mean", "count", 'dist'];
var CUBE_STORAGE_NAME = '_cuboids';
var Cube = /** @class */ (function () {
    function Cube(props) {
        var _this = this;
        this.storageName = CUBE_STORAGE_NAME;
        this.storageManageMode = commonTypes_1.ICubeStorageManageMode.LocalCache; //ICubeStorageManageMode.LocalMix;
        this.cuboidInMemorySizeLimit = 10000;
        this.recordPerformace = true;
        this.cuboidOrderLimit = 4;
        var dimensions = props.dimensions, measures = props.measures, dataSource = props.dataSource, _a = props.ops, ops = _a === void 0 ? DEFAULT_OPS : _a, _b = props.storageName, storageName = _b === void 0 ? CUBE_STORAGE_NAME : _b, _c = props.cubeStorageManageMode, cubeStorageManageMode = _c === void 0 ? commonTypes_1.ICubeStorageManageMode.LocalCache : _c, _d = props.cuboidOrderLimit, cuboidOrderLimit = _d === void 0 ? 4 : _d;
        this.dimensions = dimensions;
        this.measures = measures;
        this.dataSource = dataSource;
        this.ops = ops;
        this.cuboidOrderLimit = cuboidOrderLimit;
        this.dimOrder = new Map();
        this._performance = new Map();
        dimensions.forEach(function (dim, i) {
            _this.dimOrder.set(dim, i);
        });
        this.cuboids = new Map();
        this.ranges = new Map();
        this.storageName = storageName;
        this.storageManageMode = cubeStorageManageMode;
        if (typeof props.storage === 'undefined') {
            this.storage = new adapters_1.VIStorage(storageName);
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
    Cube.prototype.sortDimension = function (dimensions) {
        var _this = this;
        var orderedDims = __spreadArray([], __read(dimensions), false);
        orderedDims.sort(function (d1, d2) {
            return _this.dimOrder.get(d1) - _this.dimOrder.get(d2);
        });
        return orderedDims;
    };
    Cube.prototype.getCuboidKey = function (dimensions) {
        var orderedDims = this.sortDimension(dimensions);
        var dimKey = orderedDims.join(CUBOID_KEY_SPLITOR);
        return dimKey;
    };
    Cube.prototype.getCuboid = function (dimensions) {
        return __awaiter(this, void 0, void 0, function () {
            var start, res, end, orderedDims, dimKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.recordPerformace) return [3 /*break*/, 2];
                        start = performance.now();
                        return [4 /*yield*/, this._getCuboid(dimensions)];
                    case 1:
                        res = _a.sent();
                        end = performance.now();
                        orderedDims = this.sortDimension(dimensions);
                        dimKey = orderedDims.join(CUBOID_KEY_SPLITOR);
                        if (!this._performance.has(dimKey)) {
                            this._performance.set(dimKey, []);
                        }
                        this._performance.get(dimKey).push(end - start);
                        return [2 /*return*/, res];
                    case 2: return [2 /*return*/, this._getCuboid(dimensions)];
                }
            });
        });
    };
    Cube.prototype.showPerformance = function () {
        return __spreadArray([], __read(this._performance.entries()), false);
    };
    Cube.prototype._getCuboid = function (dimensions) {
        return __awaiter(this, void 0, void 0, function () {
            var orderedDims, dimKey, currDimSet, existingParentKeys, nullParentKeys, _a, _b, dim, parentDimensions, parentKey, minCost, minCuboidKey, existingParentKeys_1, existingParentKeys_1_1, key, pCuboid, parentCuboid, mode, cuboid;
            var e_1, _c, e_2, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        orderedDims = this.sortDimension(dimensions);
                        dimKey = orderedDims.join(CUBOID_KEY_SPLITOR);
                        // this.cuboids.get(dimKey)
                        if (this.cuboids.has(dimKey)) {
                            return [2 /*return*/, this.cuboids.get(dimKey)];
                        }
                        currDimSet = new Set(dimensions);
                        existingParentKeys = [];
                        nullParentKeys = [];
                        try {
                            for (_a = __values(this.dimensions), _b = _a.next(); !_b.done; _b = _a.next()) {
                                dim = _b.value;
                                if (!currDimSet.has(dim)) {
                                    parentDimensions = this.sortDimension(__spreadArray(__spreadArray([], __read(orderedDims), false), [dim], false));
                                    parentKey = parentDimensions.join(CUBOID_KEY_SPLITOR);
                                    if (this.cuboids.has(parentKey))
                                        existingParentKeys.push(parentKey);
                                    else {
                                        nullParentKeys.push(parentKey);
                                    }
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        minCost = Infinity;
                        minCuboidKey = this.dimensions.join(CUBOID_KEY_SPLITOR);
                        if (existingParentKeys.length > 0) {
                            try {
                                for (existingParentKeys_1 = __values(existingParentKeys), existingParentKeys_1_1 = existingParentKeys_1.next(); !existingParentKeys_1_1.done; existingParentKeys_1_1 = existingParentKeys_1.next()) {
                                    key = existingParentKeys_1_1.value;
                                    pCuboid = this.cuboids.get(key);
                                    if (pCuboid.size < minCost) {
                                        minCost = pCuboid.size;
                                        minCuboidKey = key;
                                    }
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (existingParentKeys_1_1 && !existingParentKeys_1_1.done && (_d = existingParentKeys_1.return)) _d.call(existingParentKeys_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                        }
                        else if (nullParentKeys.length > 0) {
                            minCuboidKey = nullParentKeys[0];
                        }
                        return [4 /*yield*/, this.getCuboid(minCuboidKey.split(CUBOID_KEY_SPLITOR))];
                    case 1:
                        parentCuboid = _e.sent();
                        mode = this.getCuboidStorageMode(parentCuboid.size);
                        cuboid = new cuboid_1.Cuboid({
                            dimensions: dimensions,
                            measures: this.measures,
                            ops: this.ops,
                            ranges: this.ranges,
                            storage: this.storage,
                            storageMode: mode
                        });
                        // cuboid.setData(parentCuboid.state);
                        return [4 /*yield*/, cuboid.computeFromCuboid(parentCuboid)];
                    case 2:
                        // cuboid.setData(parentCuboid.state);
                        _e.sent();
                        this.cuboids.set(dimKey, cuboid);
                        return [2 /*return*/, cuboid];
                }
            });
        });
    };
    Cube.prototype.getNearstExistParent = function (dimensions) {
        return __awaiter(this, void 0, void 0, function () {
            var dimSet, parentCuboidDims, potentionalParentCuboidDims, _a, _b, dim, ck;
            var e_3, _c;
            return __generator(this, function (_d) {
                dimSet = new Set(dimensions);
                parentCuboidDims = null;
                potentionalParentCuboidDims = [];
                try {
                    for (_a = __values(this.dimensions), _b = _a.next(); !_b.done; _b = _a.next()) {
                        dim = _b.value;
                        if (!dimSet.has(dim)) {
                            potentionalParentCuboidDims = __spreadArray(__spreadArray([], __read(dimensions), false), [dim], false); //this.getCuboidKey([...this.dimensions])
                            ck = this.getCuboidKey(potentionalParentCuboidDims);
                            if (this.cuboids.has(ck)) {
                                parentCuboidDims = potentionalParentCuboidDims;
                                break;
                            }
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                if (parentCuboidDims !== null) {
                    return [2 /*return*/, this.getCuboid(parentCuboidDims)]; // parentCub
                }
                else {
                    if (potentionalParentCuboidDims.length !== 0) {
                        return [2 /*return*/, this.getNearstExistParent(potentionalParentCuboidDims)];
                    }
                    return [2 /*return*/, this.getBaseCuboid()];
                }
                return [2 /*return*/];
            });
        });
    };
    Cube.prototype.computeRanges = function () {
        var e_4, _a;
        var _b = this, measures = _b.measures, dataSource = _b.dataSource;
        try {
            for (var measures_1 = __values(measures), measures_1_1 = measures_1.next(); !measures_1_1.done; measures_1_1 = measures_1.next()) {
                var mea = measures_1_1.value;
                this.ranges.set(mea, (0, statistics_1.getRangeBy)(dataSource, mea));
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (measures_1_1 && !measures_1_1.done && (_a = measures_1.return)) _a.call(measures_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    Cube.prototype.buildCuboidOnCluster = function (dimensions) {
        return __awaiter(this, void 0, void 0, function () {
            var baseCuboidKey, baseCuboid, mode, clusterCuboid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        baseCuboidKey = this.sortDimension(this.dimensions).join(CUBOID_KEY_SPLITOR);
                        baseCuboid = this.cuboids.get(baseCuboidKey);
                        mode = this.getCuboidStorageMode(baseCuboid.statSize);
                        clusterCuboid = new cuboid_1.Cuboid({
                            dimensions: dimensions,
                            measures: this.measures,
                            ops: this.ops,
                            ranges: this.ranges,
                            storage: this.storage,
                            storageMode: mode
                        });
                        // clusterCuboid.setData(this.dataSource)
                        return [4 /*yield*/, clusterCuboid.computeFromCuboid(baseCuboid)];
                    case 1:
                        // clusterCuboid.setData(this.dataSource)
                        _a.sent();
                        this.cuboids.set(dimensions.join(CUBOID_KEY_SPLITOR), clusterCuboid);
                        return [2 /*return*/];
                }
            });
        });
    };
    Cube.prototype.getCuboidStorageMode = function (cost) {
        if (this.storageManageMode === commonTypes_1.ICubeStorageManageMode.LocalCache)
            return commonTypes_1.IStorageMode.LocalCache;
        if (this.storageManageMode === commonTypes_1.ICubeStorageManageMode.LocalDisk)
            return commonTypes_1.IStorageMode.LocalDisk;
        return cost <= this.cuboidInMemorySizeLimit ? commonTypes_1.IStorageMode.LocalCache : commonTypes_1.IStorageMode.LocalDisk;
    };
    Cube.prototype.buildBaseCuboid = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mode, baseCuboid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mode = this.getCuboidStorageMode(this.dataSource.length);
                        this.computeRanges();
                        baseCuboid = new cuboid_1.Cuboid({
                            dimensions: this.dimensions,
                            measures: this.measures,
                            ops: this.ops,
                            ranges: this.ranges,
                            storage: this.storage,
                            storageMode: mode
                        });
                        return [4 /*yield*/, baseCuboid.setData(this.dataSource)];
                    case 1:
                        _a.sent();
                        this.cuboids.set(this.dimensions.join(CUBOID_KEY_SPLITOR), baseCuboid);
                        return [2 /*return*/, baseCuboid];
                }
            });
        });
    };
    Cube.prototype.loadCuboid = function (cuboidKey, cuboidState) {
        return __awaiter(this, void 0, void 0, function () {
            var cuboid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cuboid = new cuboid_1.Cuboid({
                            dimensions: cuboidKey.split(CUBOID_KEY_SPLITOR),
                            measures: this.measures,
                            ops: this.ops,
                            ranges: this.ranges,
                            storage: this.storage
                        });
                        return [4 /*yield*/, cuboid.setState(cuboidState)];
                    case 1:
                        _a.sent();
                        this.cuboids.set(cuboidKey, cuboid);
                        return [2 /*return*/];
                }
            });
        });
    };
    Cube.prototype.exportCuboids = function () {
        var cbs = {};
        // for (let [ck, cb] of this.cuboids) {
        //     cbs[ck] = cb.getRawState()
        // }
        return cbs;
    };
    Cube.prototype.getBaseCuboid = function () {
        return __awaiter(this, void 0, void 0, function () {
            var baseKey;
            return __generator(this, function (_a) {
                baseKey = this.dimensions.join(CUBOID_KEY_SPLITOR);
                if (!this.cuboids.has(baseKey)) {
                    return [2 /*return*/, this.buildBaseCuboid()];
                }
                return [2 /*return*/, this.cuboids.get(baseKey)];
            });
        });
    };
    Object.defineProperty(Cube.prototype, "cuboidSize", {
        get: function () {
            return this.cuboids.size;
        },
        enumerable: false,
        configurable: true
    });
    return Cube;
}());
exports.Cube = Cube;
