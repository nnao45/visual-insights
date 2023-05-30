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
exports.CHStatistics = exports.getCombinationFromClusterGroups = void 0;
var statistics_1 = require("../../statistics");
function getCombinationFromClusterGroups(groups, limitSize) {
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
}
exports.getCombinationFromClusterGroups = getCombinationFromClusterGroups;
var CHStatistics = /** @class */ (function () {
    function CHStatistics(chUtils) {
        var _this = this;
        this.chiSquared = function (viewName, col1, col2) { return __awaiter(_this, void 0, void 0, function () {
            var chis;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.utils.query("with col1Totals as (select `".concat(col1, "` as col1, count(*) as values_count from ").concat(viewName, " group by `").concat(col1, "`),\n            col2Totals as (select `").concat(col2, "` as col2, count(*) as values_count from ").concat(viewName, " group by `").concat(col2, "`),\n            total as (select count(*) as values_count from ").concat(viewName, "),\n            colPairs as (select `").concat(col1, "` as col1, `").concat(col2, "` as col2, count(*) as values_count from ").concat(viewName, " group by `").concat(col1, "`, `").concat(col2, "`)\n            select sum(value) from (select pow(col1Totals.values_count * (col2Totals.values_count / total.values_count) - colPairs.values_count, 2) / (col1Totals.values_count * (col2Totals.values_count / total.values_count)) as value\n            from colPairs, total \n            inner join col1Totals on colPairs.col1 = col1Totals.col1\n            inner join col2Totals on colPairs.col2 = col2Totals.col2);\n        "))];
                    case 1:
                        chis = _a.sent();
                        return [2 /*return*/, Number(chis)];
                }
            });
        }); };
        this.cramersV = function (viewName, col1, col2) { return __awaiter(_this, void 0, void 0, function () {
            var chis, rawViewInfo, viewInfo, V;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chiSquared(viewName, col1, col2)];
                    case 1:
                        chis = _a.sent();
                        return [4 /*yield*/, this.utils.query("select count(*), uniq(`".concat(col1, "`), uniq(`").concat(col2, "`) from ").concat(viewName))];
                    case 2:
                        rawViewInfo = _a.sent();
                        viewInfo = rawViewInfo.slice(0, -1).split('\t').map(function (v) { return parseInt(v); });
                        V = Math.sqrt(chis / (viewInfo[0] * Math.min(viewInfo[1] - 1, viewInfo[2] - 1)));
                        return [2 /*return*/, V];
                }
            });
        }); };
        this.pearsonCC = function (viewName, col1, col2) { return __awaiter(_this, void 0, void 0, function () {
            var rawValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.utils.query("select corr(`".concat(col1, "`, `").concat(col2, "`) from ").concat(viewName))];
                    case 1:
                        rawValue = _a.sent();
                        return [2 /*return*/, Number(rawValue)];
                }
            });
        }); };
        this.getSpaceImpurity = function (viewName, dimensions, measures) { return __awaiter(_this, void 0, void 0, function () {
            var res, imps, score, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.utils.query("with agg_view as (select count(*) as values_count, ".concat(measures.map(function (m) { return "sum(`".concat(m, "`) as `sum_").concat(m, "`"); }).join(','), " from ").concat(viewName, " group by ").concat(dimensions.map(function (d) { return "`".concat(d, "`"); }).join(','), "),\n            abs_sum as (select sum(values_count) as abssum_values_count, ").concat(measures.map(function (m) { return "sum(abs(`sum_".concat(m, "`)) as `abssum_sum_").concat(m, "`"); }).join(','), " from agg_view),\n            pb_view as (select agg_view.values_count / abs_sum.abssum_values_count as pb_count,\n                ").concat(measures.map(function (m) { return "abs(`sum_".concat(m, "`) / `abssum_sum_").concat(m, "` as `pb_").concat(m, "`"); }).join(','), "\n                from agg_view, abs_sum),\n            safe_value as (select if(pb_count = 0, 0, -pb_count * log2(pb_count)) as safe_count, ").concat(measures.map(function (m) { return "if(`pb_".concat(m, "` = 0, 0, -`pb_").concat(m, "` * log2(`pb_").concat(m, "`)) as `safe_").concat(m, "`"); }).join(','), " from pb_view)\n            select sum(safe_count), ").concat(measures.map(function (m) { return "sum(`safe_".concat(m, "`)"); }).join(','), " from safe_value\n        "))];
                    case 1:
                        res = _a.sent();
                        imps = res.slice(0, -1).split('\t').map(function (n) { return Number(n); });
                        score = 0;
                        for (i = 1; i < imps.length; i++) {
                            score += imps[i];
                        }
                        // score *= imps[0];
                        return [2 /*return*/, score];
                }
            });
        }); };
        this.utils = chUtils;
    }
    CHStatistics.prototype.getCombinationFromClusterGroups = function (groups, limitSize) {
        var e_2, _a;
        var fieldSets = [];
        try {
            for (var groups_2 = __values(groups), groups_2_1 = groups_2.next(); !groups_2_1.done; groups_2_1 = groups_2.next()) {
                var group = groups_2_1.value;
                var combineFieldSet = (0, statistics_1.getCombination)(group, limitSize.MIN, limitSize.MAX);
                fieldSets.push.apply(fieldSets, __spreadArray([], __read(combineFieldSet), false));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (groups_2_1 && !groups_2_1.done && (_a = groups_2.return)) _a.call(groups_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return fieldSets;
    };
    return CHStatistics;
}());
exports.CHStatistics = CHStatistics;
