"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.VIEngine = void 0;
var fieldSummary_1 = require("./fieldSummary");
var dataGraph_1 = require("./dataGraph");
var cube_1 = require("../cube");
var statistics_1 = require("../statistics");
var workerCollection_1 = require("./workerCollection");
var encoding_1 = require("./specification/encoding");
var utils_1 = require("../utils");
var select_1 = require("./select");
var constant_1 = require("../constant");
var general_1 = require("./patterns/general");
// import { SQLInterface } from "../../SQLInterface";
var MIN_QUAN_MEMBER_SIZE = 50;
var VIEngine = /** @class */ (function () {
    function VIEngine() {
        this.env = 'browser';
        // public cookedDimensions: string[];
        // public cookedMeasures: string[];
        // public cookedFields: IFieldSummary[];
        // protected cookedFieldDictonary: FieldDictonary;
        // private _fieldKeys: string[];
        this._dimensions = [];
        this._measures = [];
        this.cubeStorageName = '_cuboids';
        this.minDistEvalSampleSize = 80;
        /**
        * number of dimensions appears in a view.
        */
        this.DIMENSION_NUM_IN_VIEW = {
            MAX: 3,
            MIN: 1,
        };
        /**
        * number of measures appears in a view.
        */
        this.MEASURE_NUM_IN_VIEW = {
            MAX: 3,
            MIN: 1,
        };
        this.cube = null;
        this.aggregators = ["max", "min", "sum", "mean", "count", 'dist'];
        this.workerCollection = workerCollection_1.InsightWorkerCollection.init();
    }
    VIEngine.prototype.serialize = function () {
        var _a = this, fields = _a.fields, dataGraph = _a.dataGraph, subSpaces = _a.subSpaces, insightSpaces = _a.insightSpaces, dataSource = _a.dataSource, rawDataSource = _a.rawDataSource, cube = _a.cube;
        var storage = {
            version: constant_1.VERSION,
            fields: fields,
            dataGraph: {
                MClusters: dataGraph.MClusters,
                DClusters: dataGraph.DClusters,
                DG: dataGraph.DG,
                MG: dataGraph.MG
            },
            subSpaces: subSpaces,
            insightSpaces: insightSpaces
        };
        var dataStorage = {
            version: constant_1.VERSION,
            dataSource: {
                raw: rawDataSource,
                view: dataSource
            },
            cuboids: cube.exportCuboids()
        };
        return {
            storage: storage,
            dataStorage: dataStorage
        };
    };
    VIEngine.prototype.deSerialize = function (storage, dataStorage) {
        var _this = this;
        this.fields = storage.fields;
        // make fields dict
        if (typeof this.fieldDictonary !== 'undefined' && this.fieldDictonary !== null) {
            this.fieldDictonary.clear();
        }
        else {
            this.fieldDictonary = new Map();
        }
        storage.fields.forEach(function (f) {
            _this.fieldDictonary.set(f.key, f);
        });
        var _a = this, dimensions = _a.dimensions, measures = _a.measures;
        this.dataGraph = new dataGraph_1.DataGraph(dimensions, measures);
        // this.dat
        this.dataGraph.DG = storage.dataGraph.DG;
        this.dataGraph.MG = storage.dataGraph.MG;
        this.dataGraph.DClusters = storage.dataGraph.DClusters;
        this.dataGraph.MClusters = storage.dataGraph.MClusters;
        this.subSpaces = storage.subSpaces;
        this.insightSpaces = storage.insightSpaces;
        if (dataStorage) {
            var aggregators = this.aggregators;
            this.rawDataSource = dataStorage.dataSource.raw;
            this.dataSource = dataStorage.dataSource.view;
            this.cube = new cube_1.Cube({
                dataSource: dataStorage.dataSource.view,
                dimensions: dimensions,
                measures: measures,
                ops: aggregators
            });
            Object.keys(dataStorage.cuboids).forEach(function (cuboidKey) {
                _this.cube.loadCuboid(cuboidKey, dataStorage.cuboids[cuboidKey]);
            });
        }
    };
    /**
     * 为了实现简单，这里加一个隐形约束，必须先setData，才能调用setFields
     *
     * @param mutFields
     */
    VIEngine.prototype.setFields = function (mutFields) {
        this._mutFields = mutFields;
        this.dataSource = (0, utils_1.copyData)(this.rawDataSource);
        var fieldKeys = mutFields.map(function (f) { return f.key; });
        var _a = (0, fieldSummary_1.getFieldsSummary)(fieldKeys, this.dataSource), fields = _a.fields, dictonary = _a.dictonary;
        // 用户指定优先，其次取推荐值
        this.rawFields = fields.map(function (f, i) {
            var field = __assign({}, f);
            if (mutFields[i].dataType !== '?')
                field.dataType = mutFields[i].dataType;
            if (mutFields[i].semanticType !== '?')
                field.semanticType = mutFields[i].semanticType;
            if (mutFields[i].analyticType !== '?')
                field.analyticType = mutFields[i].analyticType;
            return field;
        });
    };
    VIEngine.prototype.setData = function (dataSource) {
        this.rawDataSource = dataSource;
        this.dataSource = (0, utils_1.copyData)(dataSource);
        return this;
    };
    Object.defineProperty(VIEngine.prototype, "dimensions", {
        get: function () {
            // if (this._dimensions.length > 0) return this._dimensions;
            return this.fields.filter(function (f) { return f.analyticType === 'dimension'; }).map(function (f) { return f.key; });
            // return this._dimensions
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VIEngine.prototype, "measures", {
        get: function () {
            // if (this._measures.length > 0) return this._measures;
            return this.fields.filter(function (f) { return f.analyticType === 'measure'; }).map(function (f) { return f.key; });
            // return this._measures
        },
        enumerable: false,
        configurable: true
    });
    VIEngine.prototype.buildfieldsSummary = function () {
        var fieldKeys = this.fields.map(function (f) { return f.key; });
        var _a = (0, fieldSummary_1.getFieldsSummary)(fieldKeys, this.dataSource), fields = _a.fields, dictonary = _a.dictonary;
        this.fields = fields;
        this.fieldDictonary = dictonary;
        return this;
    };
    VIEngine.prototype.univarSelection = function (selectMode, percent) {
        if (selectMode === void 0) { selectMode = 'auto'; }
        if (percent === void 0) { percent = 1; }
        var _a = this, rawFields = _a.rawFields, rawDataSource = _a.rawDataSource;
        // 1. trans fields
        // 2. filter fields
        var cookedFieldKeys = [];
        var rawIndices = [];
        // const transedMap: Map<string, string> = new Map();
        for (var i = 0; i < rawFields.length; i++) {
            var field = rawFields[i];
            var transedField = field.key;
            if (field.analyticType === 'dimension') {
                if (field.semanticType === 'quantitative' && field.features.unique > MIN_QUAN_MEMBER_SIZE) {
                    // ISSUES [2022.03.07] https://ewgw6z7tk0.feishu.cn/wiki/wikcnnTJjRv9W0p1kae8gK8uzUf?app_id=11
                    // if (!isUniformDistribution(rawDataSource, field.key)) {
                    //     const newFieldKey = `${field.key}(group)`;
                    //     // const newFieldName = `${field.name}(group)`
                    //     this.dataSource = groupContinousField({
                    //         dataSource: rawDataSource,
                    //         field: field.key,
                    //         newField: newFieldKey,
                    //         groupNumber: DEFAULT_BIN_NUM
                    //     })
                    //     transedField = newFieldKey
                    //     // transedMap.set(newFieldKey, field.key);
                    // } 
                }
                else if (field.semanticType === 'nominal' || field.semanticType === 'ordinal') {
                    if (field.features.unique > constant_1.DOMMAIN_SIZE_THRESHOLD_MAYBE_DROP && (rawDataSource.length / field.features.unique) < this.minDistEvalSampleSize) {
                        continue;
                    }
                }
            }
            rawIndices.push(i);
            cookedFieldKeys.push(transedField);
        }
        var _b = (0, fieldSummary_1.getFieldsSummary)(cookedFieldKeys, this.dataSource), cookedFields = _b.fields, cookedFieldDictonary = _b.dictonary;
        cookedFields.forEach(function (f, i) {
            var rawIndex = rawIndices[i];
            f.semanticType = rawFields[rawIndex].semanticType;
            f.dataType = rawFields[rawIndex].dataType;
            f.analyticType = rawFields[rawIndex].analyticType;
        });
        this.fields = selectMode === 'auto' ? (0, select_1.autoFieldSelect)(cookedFields) : (0, select_1.fieldSelectByPercent)(cookedFields, percent);
        if (this.fields.findIndex(function (f) { return f.analyticType === 'dimension'; }) === -1) {
            // 针对维度较差的情况做的补充。
            var dims = cookedFields.filter(function (f) { return f.analyticType === 'dimension'; });
            // if (dims.length === 0) {
            //     throw new Error('提供的数据集中没有维度，暂时不支持这种分析类型。')
            // }
            if (dims.length > 0) {
                dims.sort(function (a, b) { return a.features.entropy - b.features.entropy; });
                this.fields.push(dims[0]);
            }
        }
        this.fieldDictonary = cookedFieldDictonary;
    };
    VIEngine.prototype.buildGraph = function () {
        this.dataGraph = new dataGraph_1.DataGraph(this.dimensions, this.measures);
        this.dataGraph.computeDGraph(this.dataSource);
        this.dataGraph.computeMGraph(this.dataSource);
        return this;
    };
    VIEngine.prototype.buildCube = function (injectCube) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, measures, dataSource, dataGraph, dimensions, aggregators, cube;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, measures = _a.measures, dataSource = _a.dataSource, dataGraph = _a.dataGraph, dimensions = _a.dimensions, aggregators = _a.aggregators;
                        cube = injectCube || new cube_1.Cube({
                            dimensions: dimensions,
                            measures: measures,
                            dataSource: dataSource,
                            ops: aggregators,
                            // cubeStorageManageMode: ICubeStorageManageMode.LocalCache
                        });
                        return [4 /*yield*/, cube.buildBaseCuboid()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, Promise.all(dataGraph.DClusters.map(function (group) { return cube.buildCuboidOnCluster(group); }))];
                    case 2:
                        _b.sent();
                        this.cube = cube;
                        return [2 /*return*/, this];
                }
            });
        });
    };
    VIEngine.prototype.clusterFields = function () {
        this.dataGraph.clusterDGraph(this.dataSource);
        this.dataGraph.clusterMGraph(this.dataSource);
        return this;
    };
    VIEngine.getCombinationFromClusterGroups = function (groups, limitSize) {
        var e_1, _a;
        var fieldSets = [];
        try {
            for (var groups_1 = __values(groups), groups_1_1 = groups_1.next(); !groups_1_1.done; groups_1_1 = groups_1.next()) {
                var group = groups_1_1.value;
                var combineFieldSet = (0, statistics_1.getCombination)(group, limitSize.MIN, limitSize.MAX);
                fieldSets.push.apply(fieldSets, __spreadArray([], __read(combineFieldSet), false));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (groups_1_1 && !groups_1_1.done && (_a = groups_1.return)) _a.call(groups_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return fieldSets;
    };
    // 以度量为核心，找该度量在哪些维度的拆分研究下最优的问题
    // 1. 有序的拆分（推荐拆分顺序）-> 决策树
    // 2. 无序的拆分，直接求最小拆分粒度的划分效果（先做这个）
    //      + 
    VIEngine.prototype.buildSubspaces = function (DIMENSION_NUM_IN_VIEW, MEASURE_NUM_IN_VIEW) {
        var e_2, _a, e_3, _b, e_4, _c;
        if (DIMENSION_NUM_IN_VIEW === void 0) { DIMENSION_NUM_IN_VIEW = this.DIMENSION_NUM_IN_VIEW; }
        if (MEASURE_NUM_IN_VIEW === void 0) { MEASURE_NUM_IN_VIEW = this.MEASURE_NUM_IN_VIEW; }
        // todo: design when to compute clusters.
        var dimensionGroups = this.dataGraph.DClusters;
        var measureGroups = this.dataGraph.MClusters;
        // const dimensionSets = VIEngine.getCombinationFromClusterGroups(
        //     dimensionGroups,
        //     MAX_DIMENSION_NUM_IN_VIEW
        // );
        var measureSets = VIEngine.getCombinationFromClusterGroups(measureGroups, MEASURE_NUM_IN_VIEW);
        // const subspaces = crossGroups(dimensionSets, measureSets);
        var subspaces = [];
        try {
            for (var dimensionGroups_1 = __values(dimensionGroups), dimensionGroups_1_1 = dimensionGroups_1.next(); !dimensionGroups_1_1.done; dimensionGroups_1_1 = dimensionGroups_1.next()) {
                var group = dimensionGroups_1_1.value;
                var dimSets = (0, statistics_1.getCombination)(group, DIMENSION_NUM_IN_VIEW.MIN, DIMENSION_NUM_IN_VIEW.MAX);
                try {
                    for (var dimSets_1 = (e_3 = void 0, __values(dimSets)), dimSets_1_1 = dimSets_1.next(); !dimSets_1_1.done; dimSets_1_1 = dimSets_1.next()) {
                        var dims = dimSets_1_1.value;
                        try {
                            for (var measureSets_1 = (e_4 = void 0, __values(measureSets)), measureSets_1_1 = measureSets_1.next(); !measureSets_1_1.done; measureSets_1_1 = measureSets_1.next()) {
                                var meas = measureSets_1_1.value;
                                subspaces.push({
                                    dimensions: dims,
                                    measures: meas,
                                });
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (measureSets_1_1 && !measureSets_1_1.done && (_c = measureSets_1.return)) _c.call(measureSets_1);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (dimSets_1_1 && !dimSets_1_1.done && (_b = dimSets_1.return)) _b.call(dimSets_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (dimensionGroups_1_1 && !dimensionGroups_1_1.done && (_a = dimensionGroups_1.return)) _a.call(dimensionGroups_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.subSpaces = subspaces;
        return this;
    };
    VIEngine.getSpaceImpurity = function (dataSource, dimensions, measures) {
        var e_5, _a;
        var imp = 0;
        var _loop_1 = function (mea) {
            var fL = dataSource.map(function (r) { return r[mea]; });
            var pL = (0, statistics_1.normalize)((0, statistics_1.mapPositive)(fL));
            var value = (0, statistics_1.entropy)(pL);
            imp += value;
        };
        try {
            for (var measures_1 = __values(measures), measures_1_1 = measures_1.next(); !measures_1_1.done; measures_1_1 = measures_1.next()) {
                var mea = measures_1_1.value;
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
        imp /= measures.length;
        return imp;
    };
    VIEngine.prototype.exploreViewsPOC = function (viewSpaces) {
        if (viewSpaces === void 0) { viewSpaces = this.subSpaces; }
        return __awaiter(this, void 0, void 0, function () {
            var context, ansSpace, viewSpaces_1, viewSpaces_1_1, space, dimensions, measures, imp;
            var e_6, _a;
            return __generator(this, function (_b) {
                context = this;
                ansSpace = [];
                try {
                    for (viewSpaces_1 = __values(viewSpaces), viewSpaces_1_1 = viewSpaces_1.next(); !viewSpaces_1_1.done; viewSpaces_1_1 = viewSpaces_1.next()) {
                        space = viewSpaces_1_1.value;
                        dimensions = space.dimensions, measures = space.measures;
                        imp = (0, general_1.viewStrength)(context.dataSource, dimensions, measures);
                        ansSpace.push({
                            impurity: imp,
                            significance: 1,
                            dimensions: dimensions,
                            measures: measures
                        });
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (viewSpaces_1_1 && !viewSpaces_1_1.done && (_a = viewSpaces_1.return)) _a.call(viewSpaces_1);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                ansSpace.sort(function (a, b) { return (b.impurity || 0) - (a.impurity || 0); });
                return [2 /*return*/, ansSpace];
            });
        });
    };
    VIEngine.prototype.exploreViews = function (viewSpaces) {
        if (viewSpaces === void 0) { viewSpaces = this.subSpaces; }
        return __awaiter(this, void 0, void 0, function () {
            var context, globalMeasures, fieldDictonary, dataSource, ansSpace, globalCuboid, globalDist, _loop_2, viewSpaces_2, viewSpaces_2_1, space, e_7_1;
            var e_7, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        context = this;
                        globalMeasures = context.measures, fieldDictonary = context.fieldDictonary, dataSource = context.dataSource;
                        ansSpace = [];
                        return [4 /*yield*/, context.cube.getCuboid([])];
                    case 1:
                        globalCuboid = _b.sent();
                        return [4 /*yield*/, globalCuboid.getAggregatedRows(globalMeasures, globalMeasures.map(function () { return 'dist'; }))];
                    case 2:
                        globalDist = _b.sent();
                        _loop_2 = function (space) {
                            var dimensions, measures, localCuboid, localDist, freqs, totalEntLoss, _loop_3, measures_2, measures_2_1, mea;
                            var e_8, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        dimensions = space.dimensions, measures = space.measures;
                                        return [4 /*yield*/, context.cube.getCuboid(dimensions)];
                                    case 1:
                                        localCuboid = _d.sent();
                                        return [4 /*yield*/, localCuboid.loadStateInCache()];
                                    case 2:
                                        _d.sent();
                                        return [4 /*yield*/, localCuboid.getAggregatedRows(measures, measures.map(function () { return 'dist'; }))];
                                    case 3:
                                        localDist = _d.sent();
                                        return [4 /*yield*/, localCuboid.getAggregatedRows(measures, measures.map(function () { return 'count'; }))];
                                    case 4:
                                        freqs = _d.sent();
                                        localCuboid.clearState();
                                        totalEntLoss = 0;
                                        _loop_3 = function (mea) {
                                            var ent = 0;
                                            if (globalDist.length > 0) {
                                                ent = (0, general_1.entropyAcc)(globalDist[0][mea].filter(function (d) { return d > 0; }));
                                            }
                                            var conEnt = 0;
                                            var totalCount = fieldDictonary.get(mea).features.size;
                                            var distList = localDist.map(function (r, rIndex) { return ({
                                                // TODO: 讨论是否应当直接使用count
                                                // props: 节省计算量
                                                // cons: 强依赖于cube必须去计算count
                                                // freq: r[mea].reduce((total, value) => total + value, 0),
                                                freq: freqs[rIndex][mea],
                                                dist: r[mea]
                                            }); });
                                            distList.sort(function (a, b) { return b.freq - a.freq; });
                                            for (var i = 0; i < distList.length; i++) {
                                                if (i >= constant_1.DEFAULT_BIN_NUM - 1)
                                                    break;
                                                var subEnt1 = (0, general_1.entropyAcc)(distList[i].dist.filter(function (d) { return d > 0; }));
                                                conEnt += (distList[i].freq / totalCount) * subEnt1;
                                            }
                                            var noiseGroup = new Array(constant_1.DEFAULT_BIN_NUM).fill(0);
                                            var noiseFre = 0;
                                            for (var i = constant_1.DEFAULT_BIN_NUM - 1; i < distList.length; i++) {
                                                for (var j = 0; j < noiseGroup.length; j++) {
                                                    noiseGroup[j] += distList[i].dist[j];
                                                }
                                                noiseFre += distList[i].freq;
                                            }
                                            if (noiseFre > 0) {
                                                conEnt += (noiseFre / totalCount) * (0, general_1.entropyAcc)(noiseGroup.filter(function (d) { return d > 0; }));
                                            }
                                            totalEntLoss += (ent - conEnt) / Math.log2(Math.min(constant_1.DEFAULT_BIN_NUM, distList.length));
                                        };
                                        try {
                                            for (measures_2 = (e_8 = void 0, __values(measures)), measures_2_1 = measures_2.next(); !measures_2_1.done; measures_2_1 = measures_2.next()) {
                                                mea = measures_2_1.value;
                                                _loop_3(mea);
                                            }
                                        }
                                        catch (e_8_1) { e_8 = { error: e_8_1 }; }
                                        finally {
                                            try {
                                                if (measures_2_1 && !measures_2_1.done && (_c = measures_2.return)) _c.call(measures_2);
                                            }
                                            finally { if (e_8) throw e_8.error; }
                                        }
                                        totalEntLoss /= measures.length;
                                        ansSpace.push({
                                            dimensions: dimensions,
                                            measures: measures,
                                            significance: 1,
                                            score: totalEntLoss,
                                            impurity: totalEntLoss
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 8, 9, 10]);
                        viewSpaces_2 = __values(viewSpaces), viewSpaces_2_1 = viewSpaces_2.next();
                        _b.label = 4;
                    case 4:
                        if (!!viewSpaces_2_1.done) return [3 /*break*/, 7];
                        space = viewSpaces_2_1.value;
                        return [5 /*yield**/, _loop_2(space)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        viewSpaces_2_1 = viewSpaces_2.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_7_1 = _b.sent();
                        e_7 = { error: e_7_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (viewSpaces_2_1 && !viewSpaces_2_1.done && (_a = viewSpaces_2.return)) _a.call(viewSpaces_2);
                        }
                        finally { if (e_7) throw e_7.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        ansSpace.sort(function (a, b) { return Number(b.impurity) - Number(a.impurity); });
                        return [2 /*return*/, ansSpace];
                }
            });
        });
    };
    VIEngine.prototype.searchPointInterests = function (viewSpace) {
    };
    VIEngine.prototype.insightExtraction = function (viewSpaces) {
        if (viewSpaces === void 0) { viewSpaces = this.subSpaces; }
        return __awaiter(this, void 0, void 0, function () {
            var context, ansSpace, _loop_4, this_1, viewSpaces_3, viewSpaces_3_1, space, e_9_1;
            var e_9, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        context = this;
                        ansSpace = [];
                        _loop_4 = function (space) {
                            var dimensions, measures, cube, cuboid, aggData, imp, jobPool;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        dimensions = space.dimensions, measures = space.measures;
                                        cube = context.cube;
                                        return [4 /*yield*/, cube.getCuboid(dimensions)];
                                    case 1:
                                        cuboid = _c.sent();
                                        return [4 /*yield*/, cuboid.getAggregatedRows(measures, measures.map(function () { return 'sum'; }))];
                                    case 2:
                                        aggData = _c.sent();
                                        imp = VIEngine.getSpaceImpurity(aggData, dimensions, measures);
                                        jobPool = [];
                                        this_1.workerCollection.each(function (iWorker, name) {
                                            // tslint:disable-next-line: no-shadowed-variable
                                            var job = function (iWorker, name) { return __awaiter(_this, void 0, void 0, function () {
                                                var iSpace, error_1;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            _a.trys.push([0, 2, , 3]);
                                                            return [4 /*yield*/, iWorker(aggData, dimensions, measures, context.fieldDictonary, context)];
                                                        case 1:
                                                            iSpace = _a.sent();
                                                            if (iSpace !== null) {
                                                                iSpace.type = name;
                                                                iSpace.impurity = imp;
                                                                ansSpace.push(iSpace);
                                                            }
                                                            return [3 /*break*/, 3];
                                                        case 2:
                                                            error_1 = _a.sent();
                                                            console.error("worker failed", { dimensions: dimensions, measures: measures, aggData: aggData }, error_1);
                                                            return [3 /*break*/, 3];
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            }); };
                                            jobPool.push(job(iWorker, "".concat(name)));
                                        });
                                        return [4 /*yield*/, Promise.all(jobPool)];
                                    case 3:
                                        _c.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        viewSpaces_3 = __values(viewSpaces), viewSpaces_3_1 = viewSpaces_3.next();
                        _b.label = 2;
                    case 2:
                        if (!!viewSpaces_3_1.done) return [3 /*break*/, 5];
                        space = viewSpaces_3_1.value;
                        return [5 /*yield**/, _loop_4(space)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        viewSpaces_3_1 = viewSpaces_3.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_9_1 = _b.sent();
                        e_9 = { error: e_9_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (viewSpaces_3_1 && !viewSpaces_3_1.done && (_a = viewSpaces_3.return)) _a.call(viewSpaces_3);
                        }
                        finally { if (e_9) throw e_9.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        context.insightSpaces = ansSpace;
                        this.setInsightScores();
                        this.insightSpaces.sort(function (a, b) { return (a.score || 0) - (b.score || 0); });
                        return [2 /*return*/, this.insightSpaces];
                }
            });
        });
    };
    // todo:
    VIEngine.prototype.setInsightScores = function () {
        var insightSpaces = this.insightSpaces;
        insightSpaces.forEach(function (space) {
            space.score = Number(space.impurity) / space.significance;
        });
        return this;
    };
    VIEngine.prototype.getFieldInfoInVis = function (insightSpace) {
        return __awaiter(this, void 0, void 0, function () {
            var fieldsInVis, cube, fieldDictonary, dimensions, measures, _loop_5, dimensions_1, dimensions_1_1, dim, e_10_1, dcuboid, dAggData;
            var e_10, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fieldsInVis = [];
                        cube = this.cube;
                        fieldDictonary = this.fieldDictonary;
                        dimensions = insightSpace.dimensions, measures = insightSpace.measures;
                        _loop_5 = function (dim) {
                            var cuboid, aggData, imp;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, cube.getCuboid([dim])];
                                    case 1:
                                        cuboid = _c.sent();
                                        return [4 /*yield*/, cuboid.getAggregatedRows(measures, measures.map(function () { return 'sum'; }))];
                                    case 2:
                                        aggData = _c.sent();
                                        imp = 0;
                                        measures.forEach(function (mea) {
                                            var fL = aggData.map(function (r) { return r[mea]; });
                                            var pL = (0, statistics_1.normalize)((0, statistics_1.mapPositive)(fL));
                                            var value = (0, statistics_1.entropy)(pL);
                                            imp += value;
                                        });
                                        fieldsInVis.push(__assign(__assign({}, fieldDictonary.get(dim)), { impurity: imp }));
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        dimensions_1 = __values(dimensions), dimensions_1_1 = dimensions_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!dimensions_1_1.done) return [3 /*break*/, 5];
                        dim = dimensions_1_1.value;
                        return [5 /*yield**/, _loop_5(dim)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        dimensions_1_1 = dimensions_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_10_1 = _b.sent();
                        e_10 = { error: e_10_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (dimensions_1_1 && !dimensions_1_1.done && (_a = dimensions_1.return)) _a.call(dimensions_1);
                        }
                        finally { if (e_10) throw e_10.error; }
                        return [7 /*endfinally*/];
                    case 8: return [4 /*yield*/, cube.getCuboid(dimensions)];
                    case 9:
                        dcuboid = _b.sent();
                        return [4 /*yield*/, dcuboid.getAggregatedRows(measures, measures.map(function () { return 'sum'; }))];
                    case 10:
                        dAggData = _b.sent();
                        measures.forEach(function (mea) {
                            var fL = dAggData.map(function (r) { return r[mea]; });
                            var pL = (0, statistics_1.normalize)((0, statistics_1.mapPositive)(fL));
                            var value = (0, statistics_1.entropy)(pL);
                            fieldsInVis.push(__assign(__assign({}, fieldDictonary.get(mea)), { impurity: value }));
                        });
                        return [2 /*return*/, fieldsInVis];
                }
            });
        });
    };
    VIEngine.prototype.getFieldInfoInVisBeta = function (insightSpace) {
        return __awaiter(this, void 0, void 0, function () {
            var fieldsInVis, cube, fieldDictonary, dimensions, measures, cuboid, aggs, freqs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fieldsInVis = [];
                        cube = this.cube;
                        fieldDictonary = this.fieldDictonary;
                        dimensions = insightSpace.dimensions, measures = insightSpace.measures;
                        dimensions.forEach(function (dim) {
                            var fd = fieldDictonary.get(dim);
                            fieldsInVis.push(__assign(__assign({}, fd), { impurity: fd.features.entropy }));
                        });
                        return [4 /*yield*/, cube.getCuboid(dimensions)];
                    case 1:
                        cuboid = _a.sent();
                        return [4 /*yield*/, cuboid.getAggregatedRows(measures, measures.map(function () { return 'dist'; }))];
                    case 2:
                        aggs = _a.sent();
                        return [4 /*yield*/, cuboid.getAggregatedRows(measures, measures.map(function () { return 'count'; }))];
                    case 3:
                        freqs = _a.sent();
                        measures.forEach(function (mea) {
                            var conEnt = 0;
                            var totalCount = fieldDictonary.get(mea).features.size;
                            var distList = aggs.map(function (r, rIndex) { return ({
                                // TODO: 讨论是否应当直接使用count
                                // props: 节省计算量
                                // cons: 强依赖于cube必须去计算count
                                // freq: r[mea].reduce((total, value) => total + value, 0),
                                freq: freqs[rIndex][mea],
                                dist: r[mea]
                            }); });
                            distList.sort(function (a, b) { return b.freq - a.freq; });
                            for (var i = 0; i < distList.length; i++) {
                                if (i >= constant_1.DEFAULT_BIN_NUM - 1)
                                    break;
                                var subEnt1 = (0, general_1.entropyAcc)(distList[i].dist.filter(function (d) { return d > 0; }));
                                conEnt += (distList[i].freq / totalCount) * subEnt1;
                            }
                            var noiseGroup = new Array(constant_1.DEFAULT_BIN_NUM).fill(0);
                            var noiseFre = 0;
                            for (var i = constant_1.DEFAULT_BIN_NUM - 1; i < distList.length; i++) {
                                for (var j = 0; j < noiseGroup.length; j++) {
                                    noiseGroup[j] += distList[i].dist[j];
                                }
                                noiseFre += distList[i].freq;
                            }
                            if (noiseFre > 0) {
                                conEnt += (noiseFre / totalCount) * (0, general_1.entropyAcc)(noiseGroup.filter(function (d) { return d > 0; }));
                            }
                            var fd = fieldDictonary.get(mea);
                            fieldsInVis.push(__assign(__assign({}, fd), { impurity: conEnt }));
                        });
                        return [2 /*return*/, fieldsInVis];
                }
            });
        });
    };
    VIEngine.prototype.specification = function (insightSpace) {
        return __awaiter(this, void 0, void 0, function () {
            var dimensions, measures, fieldsInVis, cuboid, dataView;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dimensions = insightSpace.dimensions, measures = insightSpace.measures;
                        return [4 /*yield*/, this.getFieldInfoInVisBeta(insightSpace)];
                    case 1:
                        fieldsInVis = _a.sent();
                        return [4 /*yield*/, this.cube.getCuboid(dimensions)];
                    case 2:
                        cuboid = _a.sent();
                        return [4 /*yield*/, cuboid.getAggregatedRows(measures, measures.map(function () { return 'sum'; }))];
                    case 3:
                        dataView = _a.sent();
                        return [2 /*return*/, (0, encoding_1.specification)(fieldsInVis, dataView)];
                }
            });
        });
    };
    return VIEngine;
}());
exports.VIEngine = VIEngine;
