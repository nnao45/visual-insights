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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickHouseEngine = void 0;
var parser_1 = require("../parser");
var constant_1 = require("../../constant");
var dataGraph_1 = require("./dataGraph");
var statistics_1 = require("./statistics");
var statistics_2 = require("../../statistics");
var specification_1 = require("./specification");
var utils_1 = require("./utils");
var BIN_PREFIX = 'bin_';
var MIN_QUAN_MEMBER_SIZE = 50;
function createBins(range, groupNumber) {
    var binRanges = [];
    var binSize = (range[1] - range[0]) / groupNumber;
    for (var i = 0; i < groupNumber; i++) {
        binRanges.push([
            range[0] + i * binSize,
            range[0] + (i + 1) * binSize
        ]);
    }
    return binRanges;
}
var ClickHouseEngine = /** @class */ (function () {
    function ClickHouseEngine() {
        this.rawFields = [];
        this.fields = [];
        this.dataViewName = null;
        this.dataGraph = null;
        this.dataViewMetas = [];
        this.insightSpaces = [];
        this.dbMetas = [];
        this.features = { size: 0 };
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
        this.utils = new utils_1.CHUtils();
        this.statistics = new statistics_1.CHStatistics(this.utils);
    }
    Object.defineProperty(ClickHouseEngine.prototype, "dimensions", {
        get: function () {
            return this.fields.filter(function (f) { return f.analyticType === 'dimension'; }).map(function (f) { return f.key; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClickHouseEngine.prototype, "measures", {
        get: function () {
            return this.fields.filter(function (f) { return f.analyticType === 'measure'; }).map(function (f) { return f.key; });
        },
        enumerable: false,
        configurable: true
    });
    ClickHouseEngine.prototype.setRawFields = function (fields) {
        this.rawFields = fields;
    };
    ClickHouseEngine.prototype.query = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.utils.query(sql)];
            });
        });
    };
    ClickHouseEngine.prototype.queryw = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.utils.queryw(sql)];
            });
        });
    };
    ClickHouseEngine.prototype.loadData = function (viewName) {
        return __awaiter(this, void 0, void 0, function () {
            var dataStr, metas, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query("SELECT * from ".concat(viewName, ";"))];
                    case 1:
                        dataStr = _a.sent();
                        return [4 /*yield*/, this.getFieldMetas(viewName)];
                    case 2:
                        metas = _a.sent();
                        this.dbMetas = metas;
                        data = (0, parser_1.parseTable)(dataStr, metas);
                        return [2 /*return*/, data];
                }
            });
        });
    };
    ClickHouseEngine.prototype.getFieldMetas = function (viewName) {
        return __awaiter(this, void 0, void 0, function () {
            var metaRaw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query("DESC ".concat(viewName))];
                    case 1:
                        metaRaw = _a.sent();
                        return [2 /*return*/, metaRaw.substr(0, metaRaw.length - 1).split('\n').map(function (fr) {
                                var infos = fr.split('\t');
                                return {
                                    fid: infos[0],
                                    dataType: infos[1]
                                };
                            })];
                }
            });
        });
    };
    ClickHouseEngine.prototype.buildFieldsSummary = function (viewName) {
        return __awaiter(this, void 0, void 0, function () {
            var baseMetas, rawColUniques, colUniques, viewSize, _a, summary, i, maxEntropy, entropy, rawEnt, dataType;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getFieldMetas(viewName)];
                    case 1:
                        baseMetas = _b.sent();
                        this.dbMetas = baseMetas;
                        return [4 /*yield*/, this.query("SELECT ".concat(baseMetas.map(function (m) { return "uniq(`".concat(m.fid, "`)"); }).join(','), " FROM ").concat(viewName, ";"))];
                    case 2:
                        rawColUniques = _b.sent();
                        colUniques = rawColUniques.split('\t').map(function (n) { return parseInt(n); });
                        _a = parseInt;
                        return [4 /*yield*/, this.query("SELECT COUNT(*) FROM ".concat(viewName, ";"))];
                    case 3:
                        viewSize = _a.apply(void 0, [_b.sent()]);
                        this.features.size = viewSize;
                        summary = [];
                        i = 0;
                        _b.label = 4;
                    case 4:
                        if (!(i < baseMetas.length)) return [3 /*break*/, 9];
                        maxEntropy = Math.log2(colUniques[i]);
                        entropy = Infinity;
                        if (!(colUniques[i] === viewSize)) return [3 /*break*/, 5];
                        entropy = maxEntropy;
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.query("with frequency_list as (SELECT COUNT(*) as frequency FROM ".concat(viewName, " GROUP BY `").concat(baseMetas[i].fid, "`),\n                total as (select sum(frequency) as total from frequency_list),\n                pb_list as (select (frequency_list.frequency / total.total) as pb from frequency_list, total) \n                SELECT SUM(-pb * log2(pb)) FROM pb_list"))];
                    case 6:
                        rawEnt = _b.sent();
                        entropy = Number(rawEnt);
                        _b.label = 7;
                    case 7:
                        dataType = (0, parser_1.dbDataType2DataType)(baseMetas[i].dataType);
                        summary.push({
                            key: baseMetas[i].fid,
                            name: baseMetas[i].fid,
                            analyticType: (0, parser_1.inferAnalyticTypeFromDataType)(dataType),
                            semanticType: (0, parser_1.inferSemanticTypeFromDataType)(dataType),
                            dataType: dataType,
                            features: {
                                entropy: entropy,
                                maxEntropy: maxEntropy,
                                unique: colUniques[i],
                                size: viewSize,
                                max: 0,
                                min: 0
                            }
                        });
                        _b.label = 8;
                    case 8:
                        i++;
                        return [3 /*break*/, 4];
                    case 9: return [2 /*return*/, summary];
                }
            });
        });
    };
    ClickHouseEngine.prototype.uvsView = function (tableName) {
        return __awaiter(this, void 0, void 0, function () {
            var VIEW_NAME, _a, viewFields, fields, _loop_1, this_1, i;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        VIEW_NAME = 'test_view';
                        if (!(this.rawFields.length === 0)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.buildFieldsSummary(tableName)];
                    case 1:
                        _a.rawFields = _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, this.featureTransform(tableName, VIEW_NAME)];
                    case 3:
                        viewFields = _b.sent();
                        fields = [];
                        _loop_1 = function (i) {
                            var rawField = this_1.rawFields[i];
                            if (rawField.analyticType === 'dimension') {
                                if (rawField.semanticType === 'quantitative' && rawField.features.unique > MIN_QUAN_MEMBER_SIZE) {
                                    // fixme 这里对应字段判断做的不好。扩展性差。
                                    var relativeViewField = viewFields.find(function (vf) { return vf.key === "".concat(BIN_PREFIX); });
                                    if (relativeViewField) {
                                        fields.push(__assign(__assign({}, relativeViewField), { features: __assign({}, relativeViewField.features) }));
                                    }
                                    return "continue";
                                }
                            }
                            if (rawField.semanticType === 'quantitative') {
                                var relativeViewField = viewFields.find(function (vf) { return vf.key === "".concat(BIN_PREFIX).concat(rawField.key); });
                                var mergedField = __assign(__assign({}, rawField), { features: __assign({}, rawField.features) });
                                if (relativeViewField) {
                                    mergedField.features.entropy = relativeViewField.features.entropy;
                                    mergedField.features.maxEntropy = relativeViewField.features.maxEntropy;
                                }
                                fields.push(mergedField);
                            }
                            else {
                                fields.push(__assign(__assign({}, rawField), { features: __assign({}, rawField.features) }));
                            }
                        };
                        this_1 = this;
                        for (i = 0; i < this.rawFields.length; i++) {
                            _loop_1(i);
                        }
                        this.fields = fields;
                        return [2 /*return*/, fields];
                }
            });
        });
    };
    ClickHouseEngine.prototype.getContinuousRanges = function (viewName) {
        return __awaiter(this, void 0, void 0, function () {
            var continuousFields, rangeQuery, rawRanges, ranges, statValues, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        continuousFields = this.rawFields.filter(function (f) { return f.semanticType === 'quantitative'; });
                        rangeQuery = continuousFields.map(function (f) { return "min(`".concat(f.key, "`),max(`").concat(f.key, "`)"); });
                        return [4 /*yield*/, this.query("SELECT ".concat(rangeQuery.join(','), " FROM ").concat(viewName, ";"))];
                    case 1:
                        rawRanges = (_a.sent());
                        ranges = [];
                        statValues = rawRanges.substring(0, rawRanges.length - 1).split('\t').map(function (v) { return Number(v); });
                        for (i = 0; i < continuousFields.length; i++) {
                            ranges.push({
                                fid: continuousFields[i].key,
                                range: [statValues[i * 2], statValues[i * 2 + 1]]
                            });
                        }
                        return [2 /*return*/, ranges];
                }
            });
        });
    };
    ClickHouseEngine.prototype.binContinuousFields = function (tableName, groupNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var ranges, binFields;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContinuousRanges(tableName)];
                    case 1:
                        ranges = _a.sent();
                        binFields = ranges.map(function (r) {
                            var bins = createBins(r.range, groupNumber);
                            var binQuery = 'case ';
                            binQuery += "when `".concat(r.fid, "` < ").concat(bins[0][1], " then '(-Infinity, ").concat(bins[0][1], ")'\n");
                            for (var bi = 1; bi < bins.length - 1; bi++) {
                                binQuery += "when `".concat(r.fid, "` >= ").concat(bins[bi][0], " and `").concat(r.fid, "` < ").concat(bins[bi][1], " then '[").concat(bins[bi][0], ", ").concat(bins[bi][1], ")'\n");
                            }
                            binQuery += "when `".concat(r.fid, "` >= ").concat(bins[bins.length - 1][0], " then '[").concat(bins[bins.length - 1][0], ", Infinity)' end\n");
                            binQuery += "as `".concat(BIN_PREFIX).concat(r.fid, "`");
                            return binQuery;
                        });
                        return [2 /*return*/, binFields];
                }
            });
        });
    };
    ClickHouseEngine.prototype.featureTransform = function (tableName, viewName) {
        return __awaiter(this, void 0, void 0, function () {
            var binFields, viewFields;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.binContinuousFields(tableName, constant_1.DEFAULT_BIN_NUM)];
                    case 1:
                        binFields = _a.sent();
                        return [4 /*yield*/, this.queryw("DROP VIEW IF EXISTS ".concat(viewName, ";"))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.queryw("CREATE VIEW IF NOT EXISTS ".concat(viewName, " AS SELECT *, ").concat(binFields.join(','), " FROM ").concat(tableName, ";"))
                            // const raw = await this.query(`select * from ${viewName} limit 10;`);
                        ];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.buildFieldsSummary(viewName)];
                    case 4:
                        viewFields = _a.sent();
                        // todo: 调整bin字段的semanticType。
                        // 讨论：1. 完善原始字段和转换后字段的查询匹配机制（要具备对不同类型转换的扩展性）
                        // 2. 引入mutField中通配符机制，来直接使用指定类型，减少推断的计算量？但是推断好像是必须，无论是否指定，这里应该是个计算图关系，rath里有讨论过。
                        this.dataViewName = viewName;
                        return [2 /*return*/, viewFields];
                }
            });
        });
    };
    ClickHouseEngine.prototype.buildDataGraph = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, dimensions, measures, dataViewName, statistics;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, dimensions = _a.dimensions, measures = _a.measures, dataViewName = _a.dataViewName, statistics = _a.statistics;
                        this.dataGraph = new dataGraph_1.CHDataGraph(dataViewName, dimensions, measures);
                        return [4 /*yield*/, this.dataGraph.computeDGraph(statistics.cramersV)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.dataGraph.computeMGraph(statistics.pearsonCC)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ClickHouseEngine.prototype.clusterFields = function () {
        this.dataGraph.clusterDGraph();
        this.dataGraph.clusterMGraph();
        return this;
    };
    ClickHouseEngine.prototype.buildSubspaces = function (DIMENSION_NUM_IN_VIEW, MEASURE_NUM_IN_VIEW) {
        var e_1, _a, e_2, _b, e_3, _c;
        if (DIMENSION_NUM_IN_VIEW === void 0) { DIMENSION_NUM_IN_VIEW = this.DIMENSION_NUM_IN_VIEW; }
        if (MEASURE_NUM_IN_VIEW === void 0) { MEASURE_NUM_IN_VIEW = this.MEASURE_NUM_IN_VIEW; }
        var dimensionGroups = this.dataGraph.DClusters;
        var measureGroups = this.dataGraph.MClusters;
        var measureSets = (0, statistics_1.getCombinationFromClusterGroups)(measureGroups, MEASURE_NUM_IN_VIEW);
        var subspaces = [];
        try {
            for (var dimensionGroups_1 = __values(dimensionGroups), dimensionGroups_1_1 = dimensionGroups_1.next(); !dimensionGroups_1_1.done; dimensionGroups_1_1 = dimensionGroups_1.next()) {
                var group = dimensionGroups_1_1.value;
                var dimSets = (0, statistics_2.getCombination)(group, DIMENSION_NUM_IN_VIEW.MIN, DIMENSION_NUM_IN_VIEW.MAX);
                try {
                    for (var dimSets_1 = (e_2 = void 0, __values(dimSets)), dimSets_1_1 = dimSets_1.next(); !dimSets_1_1.done; dimSets_1_1 = dimSets_1.next()) {
                        var dims = dimSets_1_1.value;
                        try {
                            for (var measureSets_1 = (e_3 = void 0, __values(measureSets)), measureSets_1_1 = measureSets_1.next(); !measureSets_1_1.done; measureSets_1_1 = measureSets_1.next()) {
                                var meas = measureSets_1_1.value;
                                subspaces.push({
                                    dimensions: dims,
                                    measures: meas,
                                });
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (measureSets_1_1 && !measureSets_1_1.done && (_c = measureSets_1.return)) _c.call(measureSets_1);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (dimSets_1_1 && !dimSets_1_1.done && (_b = dimSets_1.return)) _b.call(dimSets_1);
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
        this.dataViewMetas = subspaces;
        return this;
    };
    ClickHouseEngine.prototype.getSpaceImpurity = function (viewName, dimensions, measures) {
        return __awaiter(this, void 0, void 0, function () {
            var res, imps, score, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query("with agg_view as (select count(*) as values_count, ".concat(measures.map(function (m) { return "sum(`".concat(m, "`) as `sum_").concat(m, "`"); }).join(','), " from ").concat(viewName, " group by ").concat(dimensions.map(function (d) { return "`".concat(d, "`"); }).join(','), "),\n            abs_sum as (select sum(values_count) as abssum_values_count, ").concat(measures.map(function (m) { return "sum(abs(`sum_".concat(m, "`)) as `abssum_sum_").concat(m, "`"); }).join(','), " from agg_view),\n            pb_view as (select agg_view.values_count / abs_sum.abssum_values_count as pb_count,\n                ").concat(measures.map(function (m) { return "abs(`sum_".concat(m, "`) / `abssum_sum_").concat(m, "` as `pb_").concat(m, "`"); }).join(','), "\n                from agg_view, abs_sum),\n            safe_value as (select if(pb_count = 0, 0, -pb_count * log2(pb_count)) as safe_count, ").concat(measures.map(function (m) { return "if(`pb_".concat(m, "` = 0, 0, -`pb_").concat(m, "` * log2(`pb_").concat(m, "`)) as `safe_").concat(m, "`"); }).join(','), " from pb_view)\n            select sum(safe_count), ").concat(measures.map(function (m) { return "sum(`safe_".concat(m, "`)"); }).join(','), " from safe_value\n        "))];
                    case 1:
                        res = _a.sent();
                        imps = res.slice(0, -1).split('\t').map(function (n) { return Number(n); });
                        score = 0;
                        for (i = 1; i < imps.length; i++) {
                            score += imps[i];
                        }
                        return [2 /*return*/, score];
                }
            });
        });
    };
    ClickHouseEngine.prototype.fastInsightRecommand = function (dataViewMetas) {
        if (dataViewMetas === void 0) { dataViewMetas = this.dataViewMetas; }
        return __awaiter(this, void 0, void 0, function () {
            var ansSpace, dataViewMetas_1, dataViewMetas_1_1, viewMeta, dimensions, measures, imp, e_4_1;
            var e_4, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ansSpace = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        dataViewMetas_1 = __values(dataViewMetas), dataViewMetas_1_1 = dataViewMetas_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!dataViewMetas_1_1.done) return [3 /*break*/, 5];
                        viewMeta = dataViewMetas_1_1.value;
                        dimensions = viewMeta.dimensions, measures = viewMeta.measures;
                        return [4 /*yield*/, this.getSpaceImpurity(this.dataViewName, dimensions, measures)];
                    case 3:
                        imp = _b.sent();
                        ansSpace.push({
                            dimensions: dimensions,
                            measures: measures,
                            impurity: imp,
                            score: imp,
                            significance: 1
                        });
                        _b.label = 4;
                    case 4:
                        dataViewMetas_1_1 = dataViewMetas_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_4_1 = _b.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (dataViewMetas_1_1 && !dataViewMetas_1_1.done && (_a = dataViewMetas_1.return)) _a.call(dataViewMetas_1);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        ansSpace.sort(function (a, b) { return a.score - b.score; });
                        this.insightSpaces = ansSpace;
                        return [2 /*return*/, ansSpace];
                }
            });
        });
    };
    ClickHouseEngine.prototype.getFieldInfoInVis = function (insightSpace) {
        return __awaiter(this, void 0, void 0, function () {
            var fieldsInVis, dimensions, measures, _loop_2, this_2, dimensions_1, dimensions_1_1, dim, e_5_1, _loop_3, this_3, measures_1, measures_1_1, mea, e_6_1;
            var e_5, _a, e_6, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        fieldsInVis = [];
                        dimensions = insightSpace.dimensions, measures = insightSpace.measures;
                        _loop_2 = function (dim) {
                            var imp, originField;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, this_2.statistics.getSpaceImpurity(this_2.dataViewName, [dim], measures)];
                                    case 1:
                                        imp = _d.sent();
                                        originField = this_2.fields.find(function (f) { return f.key === dim; });
                                        if (originField) {
                                            fieldsInVis.push(__assign(__assign({}, originField), { impurity: imp }));
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, 7, 8]);
                        dimensions_1 = __values(dimensions), dimensions_1_1 = dimensions_1.next();
                        _c.label = 2;
                    case 2:
                        if (!!dimensions_1_1.done) return [3 /*break*/, 5];
                        dim = dimensions_1_1.value;
                        return [5 /*yield**/, _loop_2(dim)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        dimensions_1_1 = dimensions_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_5_1 = _c.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (dimensions_1_1 && !dimensions_1_1.done && (_a = dimensions_1.return)) _a.call(dimensions_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        _loop_3 = function (mea) {
                            var imp, originField;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, this_3.statistics.getSpaceImpurity(this_3.dataViewName, dimensions, [mea])];
                                    case 1:
                                        imp = _e.sent();
                                        originField = this_3.fields.find(function (f) { return f.key === mea; });
                                        if (originField) {
                                            fieldsInVis.push(__assign(__assign({}, originField), { impurity: imp }));
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_3 = this;
                        _c.label = 9;
                    case 9:
                        _c.trys.push([9, 14, 15, 16]);
                        measures_1 = __values(measures), measures_1_1 = measures_1.next();
                        _c.label = 10;
                    case 10:
                        if (!!measures_1_1.done) return [3 /*break*/, 13];
                        mea = measures_1_1.value;
                        return [5 /*yield**/, _loop_3(mea)];
                    case 11:
                        _c.sent();
                        _c.label = 12;
                    case 12:
                        measures_1_1 = measures_1.next();
                        return [3 /*break*/, 10];
                    case 13: return [3 /*break*/, 16];
                    case 14:
                        e_6_1 = _c.sent();
                        e_6 = { error: e_6_1 };
                        return [3 /*break*/, 16];
                    case 15:
                        try {
                            if (measures_1_1 && !measures_1_1.done && (_b = measures_1.return)) _b.call(measures_1);
                        }
                        finally { if (e_6) throw e_6.error; }
                        return [7 /*endfinally*/];
                    case 16: return [2 /*return*/, fieldsInVis];
                }
            });
        });
    };
    ClickHouseEngine.prototype.queryAggDataView = function (dimensions, measures, aggregators, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var fieldsInView, sql, rawDataView, dataView;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fieldsInView = dimensions.concat(measures).map(function (fk) { return _this.dbMetas.find(function (f) { return f.fid === fk; }); }).filter(function (f) { return Boolean(f); });
                        sql = "select ".concat(dimensions.map(function (f) { return "`".concat(f, "`"); }).join(','), ", ").concat(measures.map(function (f, fIndex) { return "".concat(aggregators[fIndex], "(`").concat(f, "`) as `").concat(f, "`"); }).join(','), " from ").concat(this.dataViewName, " group by ").concat(dimensions.map(function (f) { return "`".concat(f, "`"); }).join(','));
                        if (typeof limit === 'number') {
                            sql += " limit ".concat(limit);
                        }
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        rawDataView = _a.sent();
                        dataView = (0, parser_1.parseTable)(rawDataView, fieldsInView);
                        return [2 /*return*/, dataView];
                }
            });
        });
    };
    ClickHouseEngine.prototype.queryDataView = function (dimensions, measures, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var fieldsInView, sql, rawDataView, dataView;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fieldsInView = dimensions.concat(measures).map(function (fk) { return _this.dbMetas.find(function (f) { return f.fid === fk; }); }).filter(function (f) { return Boolean(f); });
                        sql = "select ".concat(dimensions.concat(measures).map(function (f) { return "`".concat(f, "`"); }).join(','), " from ").concat(this.dataViewName);
                        if (typeof limit === 'number') {
                            sql += " limit ".concat(limit);
                        }
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        rawDataView = _a.sent();
                        dataView = (0, parser_1.parseTable)(rawDataView, fieldsInView);
                        return [2 /*return*/, dataView];
                }
            });
        });
    };
    ClickHouseEngine.prototype.specification = function (insightSpace) {
        return __awaiter(this, void 0, void 0, function () {
            var dimensions, measures, fieldsInVis, aggData, spec;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dimensions = insightSpace.dimensions, measures = insightSpace.measures;
                        return [4 /*yield*/, this.getFieldInfoInVis(insightSpace)];
                    case 1:
                        fieldsInVis = _a.sent();
                        return [4 /*yield*/, this.queryAggDataView(dimensions, measures, measures.map(function () { return 'sum'; }))];
                    case 2:
                        aggData = _a.sent();
                        spec = (0, specification_1.pureSpec)(fieldsInVis);
                        return [2 /*return*/, __assign(__assign({}, spec), { detailSize: this.features.size, dataView: aggData })];
                }
            });
        });
    };
    ClickHouseEngine.prototype.destroyView = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryw("drop view if exists ".concat(this.dataViewName))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ClickHouseEngine;
}());
exports.ClickHouseEngine = ClickHouseEngine;
