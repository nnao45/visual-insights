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
exports.mockDataSet = void 0;
var DIM_CARDINALITY = 8;
var DIM_PREFIX = "dim";
var MEA_PREFIX = "mea";
function mockDataSet(size, dimNum, meaNum) {
    var e_1, _a, e_2, _b;
    if (size === void 0) { size = 10000; }
    if (dimNum === void 0) { dimNum = 4; }
    if (meaNum === void 0) { meaNum = 6; }
    var data = [];
    var dimensions = [];
    var measures = [];
    for (var j = 0; j < dimNum; j++) {
        var dimKey = "".concat(DIM_PREFIX, "_").concat(j);
        dimensions.push(dimKey);
    }
    for (var j = 0; j < meaNum; j++) {
        var meaKey = "".concat(MEA_PREFIX, "_").concat(j);
        measures.push(meaKey);
    }
    for (var i = 0; i < size; i++) {
        var row = {};
        try {
            for (var dimensions_1 = (e_1 = void 0, __values(dimensions)), dimensions_1_1 = dimensions_1.next(); !dimensions_1_1.done; dimensions_1_1 = dimensions_1.next()) {
                var dimKey = dimensions_1_1.value;
                row[dimKey] = "".concat(dimKey, "_").concat(Math.floor(Math.random() * DIM_CARDINALITY));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (dimensions_1_1 && !dimensions_1_1.done && (_a = dimensions_1.return)) _a.call(dimensions_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var measures_1 = (e_2 = void 0, __values(measures)), measures_1_1 = measures_1.next(); !measures_1_1.done; measures_1_1 = measures_1.next()) {
                var meaKey = measures_1_1.value;
                row[meaKey] = Math.random() * 100;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (measures_1_1 && !measures_1_1.done && (_b = measures_1.return)) _b.call(measures_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        data.push(row);
    }
    return {
        dataSource: data,
        dimensions: dimensions,
        measures: measures,
    };
}
exports.mockDataSet = mockDataSet;
