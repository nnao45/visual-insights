"use strict";
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
exports.IsolationForest = void 0;
var sampling_1 = require("../../sampling");
var constant_1 = require("../../constant");
var IsolationForest = /** @class */ (function () {
    function IsolationForest(dimensions, measures, dataSource, treeNumber, Psi) {
        if (treeNumber === void 0) { treeNumber = 100; }
        if (Psi === void 0) { Psi = 256; }
        this.dimensions = dimensions;
        this.measures = measures;
        this.dataSource = dataSource;
        if (dataSource.length < Psi) {
            this.treeNumber = Math.max(1, Math.ceil(Psi / 50));
            this.sampleSize = Math.max(2, Math.floor(dataSource.length / 2));
        }
        else {
            this.treeNumber = treeNumber;
            this.sampleSize = Psi;
        }
        this.limitHeight = Math.ceil(Math.log2(this.sampleSize));
        this.iForest = [];
        this.normalizeDimensions();
    }
    IsolationForest.prototype.normalizeDimensions = function () {
        var _this = this;
        this.normalizedDataSource = [];
        this.valueSets = [];
        this.ranges = [];
        this.dimensions.forEach(function () {
            _this.valueSets.push(new Map());
        });
        this.measures.forEach(function () {
            _this.ranges.push([Infinity, -Infinity]);
        });
        this.dataSource.forEach(function (record) {
            _this.dimensions.forEach(function (dim, index) {
                var value = (record[dim] || 'others').toString();
                if (!_this.valueSets[index].has(value)) {
                    _this.valueSets[index].set(value, _this.valueSets[index].size);
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
    IsolationForest.prototype.normalizeRecord = function (record) {
        var _this = this;
        var normalizedRecord = {};
        this.measures.forEach(function (mea) {
            normalizedRecord[mea] = record[mea];
        });
        this.dimensions.forEach(function (dim, index) {
            var value = (record[dim] || 'others').toString();
            normalizedRecord[dim] = _this.valueSets[index].get(value);
        });
        return normalizedRecord;
    };
    IsolationForest.prototype.buildIsolationTree = function (normalizedSampleData, depth) {
        var e_1, _a;
        if (depth >= this.limitHeight || normalizedSampleData.length <= 1) {
            return null;
        }
        else {
            var rand = Math.random();
            var randField = this.measures[0] || this.dimensions[0];
            var dimLength = this.dimensions.length;
            var meaLength = this.measures.length;
            var randValue = 0;
            if (rand >= dimLength / (dimLength + meaLength)) {
                var index = Math.floor(Math.random() * meaLength) % meaLength;
                randField = this.measures[index];
                randValue = this.ranges[index][0] + (this.ranges[index][1] - this.ranges[index][0]) * Math.random();
            }
            else {
                var index = Math.floor(Math.random() * dimLength) % dimLength;
                randField = this.dimensions[index];
                randValue = Math.floor(this.valueSets[index].size * Math.random()) % this.valueSets[index].size;
            }
            // random in range not in distribution.
            // let randValue = normalizedSampleData[Math.floor(Math.random() * normalizedSampleData.length) % normalizedSampleData.length][randField];
            var leftSubData = [];
            var rightSubData = [];
            try {
                for (var normalizedSampleData_1 = __values(normalizedSampleData), normalizedSampleData_1_1 = normalizedSampleData_1.next(); !normalizedSampleData_1_1.done; normalizedSampleData_1_1 = normalizedSampleData_1.next()) {
                    var record = normalizedSampleData_1_1.value;
                    if (record[randField] < randValue) {
                        leftSubData.push(record);
                    }
                    else {
                        rightSubData.push(record);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (normalizedSampleData_1_1 && !normalizedSampleData_1_1.done && (_a = normalizedSampleData_1.return)) _a.call(normalizedSampleData_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var node = {
                field: randField,
                value: randValue,
                size: normalizedSampleData.length
            };
            node.left = this.buildIsolationTree(leftSubData, depth + 1);
            node.right = this.buildIsolationTree(rightSubData, depth + 1);
            return node;
        }
    };
    /**
     * average unsuccessful searches in BST (Preiss, 1999)
     * @param Psi
     */
    IsolationForest.prototype.AFS = function (Psi) {
        if (Psi > 2)
            return 2 * (Math.log(Psi - 1) + constant_1.EULER) - 2 * (Psi - 1) / Psi;
        if (Psi === 2)
            return 1;
        return 0;
    };
    IsolationForest.prototype.getPathLength = function (record, iTree, pathLength, nodeSize) {
        if (iTree === null) {
            return pathLength + this.AFS(nodeSize);
        }
        var value = record[iTree.field];
        if (value < iTree.value) {
            return this.getPathLength(record, iTree.left, pathLength + 1, iTree.size);
        }
        else {
            return this.getPathLength(record, iTree.right, pathLength + 1, iTree.size);
        }
    };
    IsolationForest.prototype.buildIsolationForest = function () {
        this.iForest = [];
        for (var i = 0; i < this.treeNumber; i++) {
            var samples = (0, sampling_1.uniformSampling)(this.normalizedDataSource, this.sampleSize);
            var iTree = this.buildIsolationTree(samples, 0);
            this.iForest.push(iTree);
        }
        return this.iForest;
    };
    // public evaluate (record: Record): number {
    // }
    IsolationForest.prototype.estimateOutierScore = function () {
        var _this = this;
        this.recordScoreList = [];
        this.normalizedDataSource.forEach(function (record) {
            var recordScore = 0;
            var avgPathLength = 0;
            _this.iForest.forEach(function (iTree) {
                avgPathLength += _this.getPathLength(record, iTree, 0, _this.sampleSize);
            });
            avgPathLength /= _this.iForest.length;
            recordScore = Math.pow(2, -(avgPathLength / _this.AFS(_this.sampleSize)));
            _this.recordScoreList.push(recordScore);
        });
        return this.recordScoreList;
    };
    return IsolationForest;
}());
exports.IsolationForest = IsolationForest;
