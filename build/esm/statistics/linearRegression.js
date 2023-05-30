"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneDLinearRegression = void 0;
var oneDLinearRegression = /** @class */ (function () {
    function oneDLinearRegression(dataSource, X, Y) {
        this.dataSource = dataSource;
        this.X = X;
        this.Y = Y;
        this.normalizedDataSource = dataSource;
    }
    oneDLinearRegression.prototype.normalizeDimensions = function (dimensions) {
        var _this = this;
        this.normalizedDataSource = [];
        this.valueSets = [];
        dimensions.forEach(function () {
            _this.valueSets.push(new Map());
        });
        this.dataSource.forEach(function (record) {
            dimensions.forEach(function (dim, index) {
                var value = (record[dim] || 'others').toString();
                if (!_this.valueSets[index].has(value)) {
                    _this.valueSets[index].set(value, _this.valueSets[index].size);
                }
            });
        });
        this.dataSource.forEach(function (record) {
            var normalizedRecord = _this.normalizeRecord(record, dimensions);
            _this.normalizedDataSource.push(normalizedRecord);
        });
        return this.normalizedDataSource;
    };
    oneDLinearRegression.prototype.normalizeRecord = function (record, dimensions) {
        var _this = this;
        var normalizedRecord = {};
        Object.keys(record).forEach(function (mea) {
            normalizedRecord[mea] = record[mea];
        });
        dimensions.forEach(function (dim, index) {
            var value = (record[dim] || 'others').toString();
            normalizedRecord[dim] = _this.valueSets[index].get(value);
        });
        return normalizedRecord;
    };
    oneDLinearRegression.prototype.mean = function () {
        var _this = this;
        var meanX = 0;
        var meanY = 0;
        if (this.normalizedDataSource.length === 0)
            return [meanX, meanY];
        this.normalizedDataSource.forEach(function (record, index) {
            meanX += record[_this.X];
            meanY += record[_this.Y];
        });
        meanX /= this.normalizedDataSource.length;
        meanY /= this.normalizedDataSource.length;
        return [meanX, meanY];
    };
    oneDLinearRegression.prototype.getRegressionEquation = function () {
        var _this = this;
        if (this.normalizedDataSource.length === 0)
            return [0, 0];
        var _a = __read(this.mean(), 2), meanX = _a[0], meanY = _a[1];
        var beta = 0;
        var alpha = 0;
        var numerator = 0;
        var denominator = 0;
        this.normalizedDataSource.forEach(function (record) {
            numerator += (record[_this.X] - meanX) * (record[_this.Y] - meanY);
            denominator += Math.pow((record[_this.X] - meanX), 2);
        });
        beta = numerator / denominator;
        alpha = meanY - meanX * beta;
        return [alpha, beta];
    };
    oneDLinearRegression.prototype.r_squared = function () {
        var _this = this;
        var _a = __read(this.mean(), 2), meanY = _a[1];
        var _b = __read(this.getRegressionEquation(), 2), alpha = _b[0], beta = _b[1];
        var SSR = 0;
        var SST = 0;
        this.normalizedDataSource.forEach(function (record) {
            var x = record[_this.X];
            var y = record[_this.Y];
            var yHat = x * beta + alpha;
            SSR += Math.pow((yHat - meanY), 2);
            SST += Math.pow((y - meanY), 2);
        });
        return SSR / SST;
    };
    oneDLinearRegression.prototype.cumulativeLogisticDistribution = function (x) {
        var lambda = 2;
        var mu = 0.2;
        return 1 / (1 + Math.pow(Math.E, -(x - mu) / lambda));
    };
    oneDLinearRegression.prototype.pValue = function () {
        var _a = __read(this.getRegressionEquation(), 2), beta = _a[1];
        var value = this.cumulativeLogisticDistribution(Math.abs(beta));
        if (value > 0.5) {
            return 2 * (1 - value);
        }
        else {
            return 2 * value;
        }
    };
    oneDLinearRegression.prototype.significance = function () {
        var r_squared = this.r_squared();
        var p_value = this.pValue();
        return r_squared * (1 - p_value);
    };
    return oneDLinearRegression;
}());
exports.oneDLinearRegression = oneDLinearRegression;
