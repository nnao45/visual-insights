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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHDataGraph = void 0;
var config_1 = require("../../insights/config");
var ml_1 = require("../../ml");
var CHDataGraph = /** @class */ (function () {
    function CHDataGraph(viewName, dimensions, measures) {
        this.DIMENSION_CORRELATION_THRESHOLD = config_1.CramersVThreshold;
        this.MEASURE_CORRELATION_THRESHOLD = config_1.PearsonCorrelation.strong;
        this.SOFT_MAX_DIM_IN_VIEW = 4;
        this.SOFT_MAX_MEA_IN_VIEW = 3;
        this.dimensions = [];
        this.measures = [];
        this.viewName = viewName;
        this.dimensions = dimensions;
        this.measures = measures;
    }
    CHDataGraph.prototype.computeGraph = function (colKeys, cc) {
        return __awaiter(this, void 0, void 0, function () {
            var viewName, matrix, i, j, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        viewName = this.viewName;
                        matrix = colKeys.map(function () { return colKeys.map(function () { return 0; }); });
                        i = 0;
                        _e.label = 1;
                    case 1:
                        if (!(i < colKeys.length)) return [3 /*break*/, 6];
                        j = 0;
                        _e.label = 2;
                    case 2:
                        if (!(j < colKeys.length)) return [3 /*break*/, 5];
                        _a = matrix[i];
                        _b = j;
                        _c = matrix[j];
                        _d = i;
                        return [4 /*yield*/, cc(viewName, colKeys[i], colKeys[j])];
                    case 3:
                        _a[_b] = _c[_d] = _e.sent();
                        _e.label = 4;
                    case 4:
                        j++;
                        return [3 /*break*/, 2];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, matrix];
                }
            });
        });
    };
    CHDataGraph.prototype.computeDGraph = function (cc) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.computeGraph(this.dimensions, cc)];
                    case 1:
                        _a.DG = _b.sent();
                        return [2 /*return*/, this.DG];
                }
            });
        });
    };
    CHDataGraph.prototype.computeMGraph = function (cc) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.computeGraph(this.measures, cc)];
                    case 1:
                        _a.MG = _b.sent();
                        return [2 /*return*/, this.MG];
                }
            });
        });
    };
    CHDataGraph.prototype.clusterDGraph = function (CORRELATION_THRESHOLD) {
        var _a = this, DG = _a.DG, dimensions = _a.dimensions, SOFT_MAX_DIM_IN_VIEW = _a.SOFT_MAX_DIM_IN_VIEW, DIMENSION_CORRELATION_THRESHOLD = _a.DIMENSION_CORRELATION_THRESHOLD;
        var threshold = typeof CORRELATION_THRESHOLD === 'number' ? CORRELATION_THRESHOLD : DIMENSION_CORRELATION_THRESHOLD;
        this.DClusters = ml_1.Cluster.kruskal({
            matrix: DG,
            measures: dimensions,
            groupMaxSize: Math.round(dimensions.length / SOFT_MAX_DIM_IN_VIEW),
            threshold: threshold
        });
        return this.DClusters;
    };
    CHDataGraph.prototype.clusterMGraph = function (CORRELATION_THRESHOLD) {
        var _a = this, MG = _a.MG, measures = _a.measures, MEASURE_CORRELATION_THRESHOLD = _a.MEASURE_CORRELATION_THRESHOLD, SOFT_MAX_MEA_IN_VIEW = _a.SOFT_MAX_MEA_IN_VIEW;
        var threshold = typeof CORRELATION_THRESHOLD === 'number' ? CORRELATION_THRESHOLD : MEASURE_CORRELATION_THRESHOLD;
        this.MClusters = ml_1.Cluster.kruskal({
            matrix: MG,
            measures: measures,
            groupMaxSize: Math.round(measures.length / SOFT_MAX_MEA_IN_VIEW),
            threshold: threshold
        });
        return this.MClusters;
    };
    return CHDataGraph;
}());
exports.CHDataGraph = CHDataGraph;
