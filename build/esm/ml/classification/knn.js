"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.KNN = void 0;
var Base = /** @class */ (function () {
    function Base(props) {
        var dataSource = props.dataSource, dimensions = props.dimensions, measures = props.measures;
        this.dataSource = dataSource;
        this.dimensions = dimensions;
        this.measures = measures;
    }
    Base.prototype.normalize = function () {
        var _this = this;
        this.normalizedDataSource = [];
        this.valueSets = [];
        this.valueParser = [];
        this.ranges = [];
        this.dimensions.forEach(function (dim) {
            _this.valueSets.push(new Map());
            _this.valueParser.push([]);
        });
        this.measures.forEach(function () {
            _this.ranges.push([Infinity, -Infinity]);
        });
        this.dataSource.forEach(function (record) {
            _this.dimensions.forEach(function (dim, index) {
                var value = (record[dim] || 'others').toString();
                if (!_this.valueSets[index].has(value)) {
                    _this.valueSets[index].set(value, _this.valueSets[index].size);
                    _this.valueParser[index].push(value);
                }
            });
            _this.measures.forEach(function (mea, index) {
                var value = record[mea];
                if (typeof value === 'number') {
                    _this.ranges[index][0] = Math.min(_this.ranges[index][0], value);
                    _this.ranges[index][1] = Math.max(_this.ranges[index][1], value);
                }
            });
        });
        this.dataSource.forEach(function (record) {
            var normalizedRecord = _this.normalizeRecord(record);
            _this.normalizedDataSource.push(normalizedRecord);
        });
        return this.normalizedDataSource;
    };
    Base.prototype.normalizeRecord = function (record) {
        var _this = this;
        var normalizedRecord = {};
        this.measures.forEach(function (mea, index) {
            normalizedRecord[mea] = (record[mea] - _this.ranges[index][0]) / (_this.ranges[index][1] - _this.ranges[index][0]);
        });
        this.dimensions.forEach(function (dim, index) {
            var value = (record[dim] || 'others').toString();
            normalizedRecord[dim] = _this.valueSets[index].get(value);
        });
        return normalizedRecord;
    };
    return Base;
}());
var KNN = /** @class */ (function (_super) {
    __extends(KNN, _super);
    function KNN(props) {
        var _this = _super.call(this, props) || this;
        var K = props.K;
        _this.K = K;
        _this.normalize();
        return _this;
    }
    KNN.prototype.getNeighbors = function (targetRecord, features, weights) {
        if (weights === void 0) { weights = []; }
        if (weights.length !== features.length) {
            features.forEach(function (f) {
                weights.push(1);
            });
        }
        // let normalizedRecord = this.normalizeRecord(targetRecord);
        var dimFeatures = [];
        var meaFeatures = [];
        var dimWeights = [];
        var meaWeights = [];
        var dimSets = new Set(this.dimensions);
        for (var i = 0; i < features.length; i++) {
            if (dimSets.has(features[i])) {
                dimFeatures.push(features[i]);
                dimWeights.push(weights[i]);
            }
            else {
                meaFeatures.push(features[i]);
                meaWeights.push(weights[i]);
            }
        }
        // let legalFeatures = features.filter(f => this.measures.includes(f));
        var distances = [];
        this.normalizedDataSource.forEach(function (record, rIndex) {
            var dis = 0;
            meaFeatures.forEach(function (feature, index) {
                dis += Math.pow(((record[feature] - targetRecord[feature]) * meaWeights[index]), 2);
            });
            dimFeatures.forEach(function (feature, index) {
                if (record[feature] !== targetRecord[feature]) {
                    dis += Math.pow(dimWeights[index], 2);
                }
            });
            distances.push({
                dis: dis,
                index: rIndex
            });
        });
        distances.sort(function (a, b) {
            return a.dis - b.dis;
        });
        var ans = [];
        var len = Math.min(this.K, distances.length);
        for (var i = 0; i < len; i++) {
            ans.push(this.normalizedDataSource[distances[i].index]);
        }
        return ans;
    };
    KNN.prototype.getTargetValue = function (targets, neighbors) {
        var _this = this;
        var ans = [];
        targets.forEach(function (tar) {
            var e_1, _a;
            var votes = new Map();
            neighbors.forEach(function (nei) {
                if (!votes.has(nei[tar])) {
                    votes.set(nei[tar], 0);
                }
                votes.set(nei[tar], votes.get(nei[tar]) + 1);
            });
            var mostCount = 0;
            var mostFeature = 0;
            try {
                for (var votes_1 = __values(votes), votes_1_1 = votes_1.next(); !votes_1_1.done; votes_1_1 = votes_1.next()) {
                    var vote = votes_1_1.value;
                    if (vote[1] > mostCount) {
                        mostCount = vote[1];
                        mostFeature = vote[0];
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (votes_1_1 && !votes_1_1.done && (_a = votes_1.return)) _a.call(votes_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var dimIndex = _this.dimensions.indexOf(tar);
            if (dimIndex > -1) {
                ans.push(_this.valueParser[dimIndex][mostFeature]);
            }
            else {
                ans.push(mostFeature);
            }
        });
        return ans;
    };
    return KNN;
}(Base));
exports.KNN = KNN;
