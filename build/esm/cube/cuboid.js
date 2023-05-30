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
exports.Cuboid = void 0;
var commonTypes_1 = require("../commonTypes");
var statistics_1 = require("../statistics");
var aggregators_1 = require("../statistics/aggregators");
var DEFAULT_OPS = ['max', 'min', 'sum', 'mean', 'count', 'dist'];
var Cuboid = /** @class */ (function () {
    function Cuboid(props) {
        this.cached = false;
        this.statSize = 0;
        this.storageMode = commonTypes_1.IStorageMode.LocalCache; // IStorageMode.LocalDisk;
        var dimensions = props.dimensions, measures = props.measures, _a = props.ops, ops = _a === void 0 ? DEFAULT_OPS : _a, ranges = props.ranges, storage = props.storage, _b = props.storageMode, storageMode = _b === void 0 ? commonTypes_1.IStorageMode.LocalDisk : _b;
        this.dimensions = dimensions;
        this.measures = measures;
        this.ops = ops;
        this._state = [];
        this.cached = false;
        this.ranges = ranges;
        this.storageMode = storageMode;
        this.sto = storage;
    }
    Cuboid.prototype.cacheState = function (state) {
        this.cached = true;
        this._state = state;
    };
    Cuboid.prototype.clearState = function () {
        if (this.storageMode === commonTypes_1.IStorageMode.LocalDisk) {
            this.cached = false;
            this._state = [];
        }
    };
    Cuboid.prototype.getState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = [];
                        if (!(this.storageMode === commonTypes_1.IStorageMode.LocalDisk)) return [3 /*break*/, 2];
                        if (this.cached) {
                            return [2 /*return*/, this._state];
                        }
                        return [4 /*yield*/, this.sto.getItem(this.dimensions.join('-'))];
                    case 1:
                        state = (_a.sent()) || [];
                        return [3 /*break*/, 3];
                    case 2:
                        state = this._state;
                        _a.label = 3;
                    case 3:
                        this.statSize = state.length;
                        return [2 /*return*/, state];
                }
            });
        });
    };
    Cuboid.prototype.loadStateInCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.storageMode === commonTypes_1.IStorageMode.LocalDisk)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.sto.getItem(this.dimensions.join('-'))];
                    case 1:
                        _a._state = (_b.sent()) || [];
                        _b.label = 2;
                    case 2:
                        this.cached = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    Cuboid.prototype.setState = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.statSize = state.length;
                        if (!(this.storageMode === commonTypes_1.IStorageMode.LocalDisk)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sto.setItem(this.dimensions.join('-'), state)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this._state = state;
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Cuboid.prototype.setData = function (dataSource) {
        return __awaiter(this, void 0, void 0, function () {
            var state, _a, dimensions, measures, ranges, groups, _loop_1, state_1, state_1_1, row;
            var e_1, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        state = (0, statistics_1.stdAggregate)({
                            dimensions: this.dimensions,
                            measures: this.measures,
                            ops: this.ops,
                            dataSource: dataSource
                        });
                        _a = this, dimensions = _a.dimensions, measures = _a.measures, ranges = _a.ranges;
                        groups = (0, statistics_1.groupBy)(dataSource, dimensions);
                        _loop_1 = function (row) {
                            var e_2, _d;
                            var hashKey = (0, statistics_1.getAggHashKey)(dimensions.map(function (d) { return row.groupDict[d]; }));
                            var groupValues = groups.get(hashKey);
                            var _loop_2 = function (mea) {
                                var range = ranges.get(mea);
                                row.stat[mea]['dist'] = (0, aggregators_1.dist)(groupValues.map(function (v) { return v[mea]; }), range);
                            };
                            try {
                                for (var measures_1 = (e_2 = void 0, __values(measures)), measures_1_1 = measures_1.next(); !measures_1_1.done; measures_1_1 = measures_1.next()) {
                                    var mea = measures_1_1.value;
                                    _loop_2(mea);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (measures_1_1 && !measures_1_1.done && (_d = measures_1.return)) _d.call(measures_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                        };
                        try {
                            for (state_1 = __values(state), state_1_1 = state_1.next(); !state_1_1.done; state_1_1 = state_1.next()) {
                                row = state_1_1.value;
                                _loop_1(row);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (state_1_1 && !state_1_1.done && (_b = state_1.return)) _b.call(state_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        return [4 /*yield*/, this.setState(state)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/, state];
                }
            });
        });
    };
    Cuboid.prototype.computeFromCuboid = function (cuboid) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, ops, measures, dimensions, sourceCuboidState, state;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, ops = _a.ops, measures = _a.measures, dimensions = _a.dimensions;
                        return [4 /*yield*/, cuboid.getState()];
                    case 1:
                        sourceCuboidState = _b.sent();
                        state = (0, statistics_1.stdAggregateFromCuboid)({
                            dimensions: dimensions,
                            measures: measures,
                            ops: ops,
                            cuboidState: sourceCuboidState
                        });
                        return [4 /*yield*/, this.setState(state)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, state];
                }
            });
        });
    };
    Object.defineProperty(Cuboid.prototype, "size", {
        get: function () {
            return this.statSize;
        },
        enumerable: false,
        configurable: true
    });
    Cuboid.prototype.getAggregatedRows = function (measures, operatorOfMeasures) {
        return __awaiter(this, void 0, void 0, function () {
            var data, dimensions, state, state_2, state_2_1, row, newRow, dimensions_1, dimensions_1_1, dim, i, mea, op;
            var e_3, _a, e_4, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        data = [];
                        dimensions = this.dimensions;
                        return [4 /*yield*/, this.getState()];
                    case 1:
                        state = _c.sent();
                        try {
                            for (state_2 = __values(state), state_2_1 = state_2.next(); !state_2_1.done; state_2_1 = state_2.next()) {
                                row = state_2_1.value;
                                newRow = {};
                                try {
                                    for (dimensions_1 = (e_4 = void 0, __values(dimensions)), dimensions_1_1 = dimensions_1.next(); !dimensions_1_1.done; dimensions_1_1 = dimensions_1.next()) {
                                        dim = dimensions_1_1.value;
                                        newRow[dim] = row.groupDict[dim];
                                    }
                                }
                                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                finally {
                                    try {
                                        if (dimensions_1_1 && !dimensions_1_1.done && (_b = dimensions_1.return)) _b.call(dimensions_1);
                                    }
                                    finally { if (e_4) throw e_4.error; }
                                }
                                for (i = 0; i < measures.length; i++) {
                                    mea = measures[i];
                                    op = operatorOfMeasures[i];
                                    newRow[mea] = row.stat[mea][op];
                                }
                                data.push(newRow);
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (state_2_1 && !state_2_1.done && (_a = state_2.return)) _a.call(state_2);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Cuboid.prototype.getRawState = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getState()];
            });
        });
    };
    return Cuboid;
}());
exports.Cuboid = Cuboid;
