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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisSpaces = exports.getIntentionSpaces = exports.IntentionWorkerCollection = exports.getGroupIntentionSpace = exports.getTrendIntentionSpace = exports.getOutlierIntentionSpace = exports.getGeneralIntentionSpace = void 0;
var commonTypes_1 = require("../commonTypes");
var subspaces_1 = require("./subspaces");
var config_1 = require("./config");
var index_1 = require("../ml/index");
var index_2 = require("../statistics/index");
var constant_1 = require("../constant");
var index_3 = require("../statistics/index");
var index_4 = require("../statistics/index");
var groups_1 = require("./intention/groups");
var SPLITER = '=;=';
function crossGroups(dimensionGroups, measureGroups) {
    var e_1, _a, e_2, _b;
    var viewSpaces = [];
    try {
        for (var dimensionGroups_1 = __values(dimensionGroups), dimensionGroups_1_1 = dimensionGroups_1.next(); !dimensionGroups_1_1.done; dimensionGroups_1_1 = dimensionGroups_1.next()) {
            var dimensions = dimensionGroups_1_1.value;
            try {
                for (var measureGroups_1 = (e_2 = void 0, __values(measureGroups)), measureGroups_1_1 = measureGroups_1.next(); !measureGroups_1_1.done; measureGroups_1_1 = measureGroups_1.next()) {
                    var measures = measureGroups_1_1.value;
                    viewSpaces.push({
                        dimensions: dimensions,
                        measures: measures
                    });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (measureGroups_1_1 && !measureGroups_1_1.done && (_b = measureGroups_1.return)) _b.call(measureGroups_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (dimensionGroups_1_1 && !dimensionGroups_1_1.done && (_a = dimensionGroups_1.return)) _a.call(dimensionGroups_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return viewSpaces;
}
function getDimSetsFromClusterGroups(groups) {
    var e_3, _a;
    var dimSets = [];
    try {
        for (var groups_2 = __values(groups), groups_2_1 = groups_2.next(); !groups_2_1.done; groups_2_1 = groups_2.next()) {
            var group = groups_2_1.value;
            var combineDimSet = (0, index_2.getCombination)(group, 1, constant_1.CHANNEL.maxDimensionNumber);
            dimSets.push.apply(dimSets, __spreadArray([], __read(combineDimSet), false));
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (groups_2_1 && !groups_2_1.done && (_a = groups_2.return)) _a.call(groups_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return dimSets;
}
function getCombinationFromClusterGroups(groups, limitSize) {
    var e_4, _a;
    if (limitSize === void 0) { limitSize = constant_1.CHANNEL.maxDimensionNumber; }
    var fieldSets = [];
    try {
        for (var groups_3 = __values(groups), groups_3_1 = groups_3.next(); !groups_3_1.done; groups_3_1 = groups_3.next()) {
            var group = groups_3_1.value;
            var combineFieldSet = (0, index_2.getCombination)(group, 1, limitSize);
            fieldSets.push.apply(fieldSets, __spreadArray([], __read(combineFieldSet), false));
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (groups_3_1 && !groups_3_1.done && (_a = groups_3.return)) _a.call(groups_3);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return fieldSets;
}
var getGeneralIntentionSpace = function (aggData, dimensions, measures) {
    return __awaiter(this, void 0, void 0, function () {
        var score, significance, _loop_1, measures_1, measures_1_1, mea;
        var e_5, _a;
        return __generator(this, function (_b) {
            score = 0;
            significance = 0;
            _loop_1 = function (mea) {
                var fL = aggData.map(function (r) { return r[mea]; });
                var pL = (0, index_3.normalize)((0, index_2.mapPositive)(fL));
                var value = (0, index_3.entropy)(pL);
                score += value;
                significance += value / Math.log2(fL.length);
            };
            try {
                for (measures_1 = __values(measures), measures_1_1 = measures_1.next(); !measures_1_1.done; measures_1_1 = measures_1.next()) {
                    mea = measures_1_1.value;
                    _loop_1(mea);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (measures_1_1 && !measures_1_1.done && (_a = measures_1.return)) _a.call(measures_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
            score /= measures.length;
            significance /= measures.length;
            significance = 1 - significance;
            return [2 /*return*/, {
                    dimensions: dimensions,
                    measures: measures,
                    type: 'default_general',
                    score: score,
                    impurity: score,
                    significance: significance,
                    order: 'asc'
                }];
        });
    });
};
exports.getGeneralIntentionSpace = getGeneralIntentionSpace;
var getOutlierIntentionSpace = function getOutlierIntentionSpace(aggData, dimensions, measures) {
    return __awaiter(this, void 0, void 0, function () {
        var iForest, scoreList, maxIndex, score, i, des;
        return __generator(this, function (_a) {
            iForest = new index_1.Outier.IsolationForest([], measures, aggData);
            iForest.buildIsolationForest();
            scoreList = iForest.estimateOutierScore();
            maxIndex = 0;
            score = 0;
            for (i = 0; i < scoreList.length; i++) {
                if (scoreList[i] > score) {
                    score = scoreList[i];
                    maxIndex = i;
                }
            }
            des = {};
            dimensions.concat(measures).forEach(function (mea) { des[mea] = aggData[maxIndex][mea]; });
            return [2 /*return*/, {
                    dimensions: dimensions,
                    measures: measures,
                    score: score,
                    significance: score,
                    order: 'desc',
                    description: des
                }];
        });
    });
};
exports.getOutlierIntentionSpace = getOutlierIntentionSpace;
var getTrendIntentionSpace = function (aggData, dimensions, measures) {
    return __awaiter(this, void 0, void 0, function () {
        var orderedData, score, measures_2, measures_2_1, mea, linearModel;
        var e_6, _a;
        return __generator(this, function (_b) {
            if (dimensions.length !== 1)
                return [2 /*return*/, null];
            orderedData = __spreadArray([], __read(aggData), false);
            orderedData.sort(function (a, b) {
                if (a[dimensions[0]] > b[dimensions[0]])
                    return 1;
                if (a[dimensions[0]] === b[dimensions[0]])
                    return 0;
                if (a[dimensions[0]] < b[dimensions[0]])
                    return -1;
            });
            score = 0;
            try {
                for (measures_2 = __values(measures), measures_2_1 = measures_2.next(); !measures_2_1.done; measures_2_1 = measures_2.next()) {
                    mea = measures_2_1.value;
                    linearModel = new index_4.oneDLinearRegression(orderedData, dimensions[0], mea);
                    linearModel.normalizeDimensions(dimensions);
                    score += linearModel.significance();
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (measures_2_1 && !measures_2_1.done && (_a = measures_2.return)) _a.call(measures_2);
                }
                finally { if (e_6) throw e_6.error; }
            }
            score /= measures.length;
            return [2 /*return*/, {
                    dimensions: dimensions,
                    measures: measures,
                    score: score,
                    significance: score,
                    order: 'desc'
                }];
        });
    });
};
exports.getTrendIntentionSpace = getTrendIntentionSpace;
var getGroupIntentionSpace = function (aggData, dimensions, measures) {
    return __awaiter(this, void 0, void 0, function () {
        var score, groupIntention;
        return __generator(this, function (_a) {
            if (dimensions.length < 2)
                return [2 /*return*/, null];
            score = 0;
            groupIntention = new groups_1.GroupIntention({
                dataSource: aggData,
                dimensions: dimensions,
                measures: measures,
                K: 8
            });
            score = groupIntention.getSignificance(measures.concat(dimensions.slice(0, -1)), dimensions.slice(-1));
            return [2 /*return*/, {
                    dimensions: dimensions,
                    measures: measures,
                    score: score,
                    significance: score,
                    order: 'desc'
                }];
        });
    });
};
exports.getGroupIntentionSpace = getGroupIntentionSpace;
// export const IntentionWorkerCollection: Map<string, IntentionWorker> = new Map();
var IntentionWorkerCollection = /** @class */ (function () {
    function IntentionWorkerCollection() {
        this.workers = new Map();
    }
    IntentionWorkerCollection.prototype.register = function (name, iWorker) {
        if (this.workers.has(name)) {
            throw new Error("There has been a worker named: ".concat(name, " already."));
        }
        else {
            this.workers.set(name, [true, iWorker]);
        }
    };
    IntentionWorkerCollection.prototype.enable = function (name, status) {
        if (!this.workers.has(name)) {
            throw new Error("Intention Worker \"".concat(name, "\" does not exist."));
        }
        else {
            var iWorkerWithStatus = this.workers.get(name);
            iWorkerWithStatus[0] = status;
            this.workers.set(name, iWorkerWithStatus);
        }
    };
    IntentionWorkerCollection.prototype.each = function (func) {
        var e_7, _a;
        try {
            for (var _b = __values(this.workers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_1 = _d[0], iWorker = _d[1];
                if (iWorker[0]) {
                    func(iWorker[1], name_1);
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
    };
    IntentionWorkerCollection.init = function (props) {
        if (props === void 0) { props = { withDefaultIWorkers: true }; }
        var _a = props.withDefaultIWorkers, withDefaultIWorkers = _a === void 0 ? true : _a;
        if (!IntentionWorkerCollection.colletion) {
            IntentionWorkerCollection.colletion = new IntentionWorkerCollection();
            if (withDefaultIWorkers) {
                IntentionWorkerCollection.colletion.register(commonTypes_1.DefaultIWorker.outlier, exports.getOutlierIntentionSpace);
                IntentionWorkerCollection.colletion.register(commonTypes_1.DefaultIWorker.cluster, exports.getGroupIntentionSpace);
                IntentionWorkerCollection.colletion.register(commonTypes_1.DefaultIWorker.trend, exports.getTrendIntentionSpace);
            }
        }
        for (var key in commonTypes_1.DefaultIWorker) {
            IntentionWorkerCollection.colletion.enable(commonTypes_1.DefaultIWorker[key], withDefaultIWorkers);
        }
        return IntentionWorkerCollection.colletion;
    };
    return IntentionWorkerCollection;
}());
exports.IntentionWorkerCollection = IntentionWorkerCollection;
function getIntentionSpaces(cubePool, viewSpaces, Collection) {
    return __awaiter(this, void 0, void 0, function () {
        var ansSpace, _loop_2, viewSpaces_1, viewSpaces_1_1, space, e_8_1;
        var e_8, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ansSpace = [];
                    _loop_2 = function (space) {
                        var dimensions, measures, key, aggData_1, generalSpace_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    dimensions = space.dimensions, measures = space.measures;
                                    key = dimensions.join(SPLITER);
                                    if (!cubePool.has(key)) return [3 /*break*/, 2];
                                    aggData_1 = cubePool.get(key);
                                    return [4 /*yield*/, (0, exports.getGeneralIntentionSpace)(aggData_1, dimensions, measures)];
                                case 1:
                                    generalSpace_1 = _c.sent();
                                    Collection.each(function (iWorker, name) { return __awaiter(_this, void 0, void 0, function () {
                                        var iSpace, error_1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);
                                                    return [4 /*yield*/, iWorker(aggData_1, dimensions, measures)];
                                                case 1:
                                                    iSpace = _a.sent();
                                                    if (iSpace !== null) {
                                                        iSpace.type = name;
                                                        iSpace.impurity = generalSpace_1.impurity;
                                                        ansSpace.push(iSpace);
                                                    }
                                                    return [3 /*break*/, 3];
                                                case 2:
                                                    error_1 = _a.sent();
                                                    console.error('worker failed', { dimensions: dimensions, measures: measures, aggData: aggData_1 }, error_1);
                                                    return [3 /*break*/, 3];
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    _c.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    viewSpaces_1 = __values(viewSpaces), viewSpaces_1_1 = viewSpaces_1.next();
                    _b.label = 2;
                case 2:
                    if (!!viewSpaces_1_1.done) return [3 /*break*/, 5];
                    space = viewSpaces_1_1.value;
                    return [5 /*yield**/, _loop_2(space)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    viewSpaces_1_1 = viewSpaces_1.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_8_1 = _b.sent();
                    e_8 = { error: e_8_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (viewSpaces_1_1 && !viewSpaces_1_1.done && (_a = viewSpaces_1.return)) _a.call(viewSpaces_1);
                    }
                    finally { if (e_8) throw e_8.error; }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/, ansSpace];
            }
        });
    });
}
exports.getIntentionSpaces = getIntentionSpaces;
function getVisSpaces(props) {
    return __awaiter(this, void 0, void 0, function () {
        var dataSource, dimensions, measures, collection, _a, dimension_correlation_threshold, _b, measure_correlation_threshold, _c, max_dimension_num_in_view, _d, max_measure_num_in_view, visableDimensions, dimensionGroups, dimensionSets, measureGroups, measureSets, viewSpaces, cubePool, t0, dimensionSets_1, dimensionSets_1_1, group, key, aggData, t1, usedCollection, ansSpace;
        var e_9, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    dataSource = props.dataSource, dimensions = props.dimensions, measures = props.measures, collection = props.collection, _a = props.dimension_correlation_threshold, dimension_correlation_threshold = _a === void 0 ? config_1.CramersVThreshold : _a, _b = props.measure_correlation_threshold, measure_correlation_threshold = _b === void 0 ? config_1.PearsonCorrelation.strong : _b, _c = props.max_dimension_num_in_view, max_dimension_num_in_view = _c === void 0 ? 3 : _c, _d = props.max_measure_num_in_view, max_measure_num_in_view = _d === void 0 ? 3 : _d;
                    visableDimensions = dimensions;
                    dimensionGroups = (0, subspaces_1.getDimClusterGroups)(dataSource, visableDimensions, dimension_correlation_threshold);
                    dimensionSets = getCombinationFromClusterGroups(dimensionGroups, max_dimension_num_in_view);
                    measureGroups = (0, subspaces_1.getMeaSetsBasedOnClusterGroups)(dataSource, measures, measure_correlation_threshold);
                    measureSets = getCombinationFromClusterGroups(measureGroups, max_measure_num_in_view);
                    viewSpaces = crossGroups(dimensionSets, measureSets);
                    cubePool = new Map();
                    t0 = new Date().getTime();
                    try {
                        for (dimensionSets_1 = __values(dimensionSets), dimensionSets_1_1 = dimensionSets_1.next(); !dimensionSets_1_1.done; dimensionSets_1_1 = dimensionSets_1.next()) {
                            group = dimensionSets_1_1.value;
                            key = group.join(SPLITER);
                            aggData = (0, index_2.stdAggregate)({
                                dimensions: group,
                                measures: measures,
                                dataSource: dataSource,
                                ops: measures.map(function (m) { return 'sum'; })
                            });
                            cubePool.set(key, aggData);
                        }
                    }
                    catch (e_9_1) { e_9 = { error: e_9_1 }; }
                    finally {
                        try {
                            if (dimensionSets_1_1 && !dimensionSets_1_1.done && (_e = dimensionSets_1.return)) _e.call(dimensionSets_1);
                        }
                        finally { if (e_9) throw e_9.error; }
                    }
                    t1 = new Date().getTime();
                    console.log('cube cost', t1 - t0);
                    cubePool.set('*', dataSource);
                    usedCollection = collection || IntentionWorkerCollection.init();
                    ;
                    return [4 /*yield*/, getIntentionSpaces(cubePool, viewSpaces, usedCollection)];
                case 1:
                    ansSpace = _f.sent();
                    return [2 /*return*/, ansSpace];
            }
        });
    });
}
exports.getVisSpaces = getVisSpaces;
