"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minDrop = exports.detectSparseColumn = exports.emptyCount = void 0;
function emptyCount(dataSource, colKeys) {
    // const counter: Map<string, number> = new Map();
    var counter = colKeys.map(function () { return 0; });
    for (var i = 0; i < dataSource.length; i++) {
        // dataSource[i][col] = 
        for (var j = 0; j < colKeys.length; j++) {
            var col = colKeys[j];
            if (dataSource[i][col] === null || dataSource[i][col] === undefined || dataSource[i][col] === '') {
                counter[j]++;
            }
        }
    }
    return counter;
}
exports.emptyCount = emptyCount;
/**
 *
 * @param dataSource
 * @returns indices of sparse column(with lots of null value)
 */
function detectSparseColumn(dataSource, colKeys, SPARE_THRESHOLD) {
    if (SPARE_THRESHOLD === void 0) { SPARE_THRESHOLD = 0.5; }
    var nullCounts = emptyCount(dataSource, colKeys);
    var sparseColIndices = [];
    for (var i = 0; i < nullCounts.length; i++) {
        if (nullCounts[i] / dataSource.length < SPARE_THRESHOLD) {
            sparseColIndices.push(i);
        }
    }
    return sparseColIndices;
}
exports.detectSparseColumn = detectSparseColumn;
/**
 * 1. drop掉&
 */
function minDrop(dataSource, colKeys) {
    var sparseIndices = detectSparseColumn(dataSource, colKeys);
    var newData = [];
    // TODO: 改成双下表O(n)的写法。
    // 但这里只是非最高次项。理论上非极端场景不用优化。不过优化了会比较低碳，为地球做贡献。
    var newColKeys = colKeys.filter(function (c, ci) { return !sparseIndices.includes(ci); });
    for (var i = 0; i < dataSource.length; i++) {
        var row = {};
        for (var j = 0; j < newColKeys.length; j++) {
            row[newColKeys[j]] = dataSource[i][newColKeys[j]];
        }
    }
    return newData;
}
exports.minDrop = minDrop;
