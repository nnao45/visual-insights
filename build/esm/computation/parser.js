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
exports.parseTable = exports.parseCell = exports.inferAnalyticTypeFromDataType = exports.inferSemanticTypeFromDataType = exports.dbDataType2DataType = void 0;
var DB_DATA_TYPE_TO_DATA_TYPE = {
    'Int8': 'integer',
    'Int16': 'integer',
    'Int32': 'integer',
    'Int64': 'integer',
    'UInt8': 'integer',
    'UInt16': 'integer',
    'UInt32': 'number',
    'UInt64': 'number',
    'Float32': 'number',
    'Float64': 'number',
    'BOOLEAN': 'boolean',
    'String': 'string'
};
var DEFAULT_SEMANTIC_TYPE = {
    'number': 'quantitative',
    'integer': 'quantitative',
    'boolean': 'nominal',
    'date': 'temporal',
    'string': 'nominal'
};
var DEFAULT_ANALYTIC_TYPE = {
    'number': 'measure',
    'integer': 'measure',
    'boolean': 'dimension',
    'date': 'dimension',
    'string': 'dimension'
};
function dbDataType2DataType(dbDataType) {
    return DB_DATA_TYPE_TO_DATA_TYPE[dbDataType] || 'string';
}
exports.dbDataType2DataType = dbDataType2DataType;
function inferSemanticTypeFromDataType(dataType) {
    return DEFAULT_SEMANTIC_TYPE[dataType];
}
exports.inferSemanticTypeFromDataType = inferSemanticTypeFromDataType;
function inferAnalyticTypeFromDataType(dataType) {
    return DEFAULT_ANALYTIC_TYPE[dataType];
}
exports.inferAnalyticTypeFromDataType = inferAnalyticTypeFromDataType;
function parseCell(rawValue, dataType) {
    switch (dataType) {
        case 'Int8':
        case 'Int16':
        case 'Int32':
        case 'Int64':
        // case 'Int128':
        // case 'Int256':
        case 'UInt8':
        case 'UInt16':
        case 'UInt32':
        case 'UInt64':
            return parseInt(rawValue);
        case 'Float32':
        case 'Float64':
            return Number(rawValue);
        default:
            return rawValue;
    }
}
exports.parseCell = parseCell;
function parseTable(str, fields) {
    var e_1, _a;
    var rows = [];
    var rawRows = str.substring(0, str.length - 1).split('\n');
    try {
        for (var rawRows_1 = __values(rawRows), rawRows_1_1 = rawRows_1.next(); !rawRows_1_1.done; rawRows_1_1 = rawRows_1.next()) {
            var rawRow = rawRows_1_1.value;
            var row = {};
            var rowValues = rawRow.split(/[\t]/);
            for (var i = 0; i < fields.length; i++) {
                row[fields[i].fid] = parseCell(rowValues[i], fields[i].dataType);
            }
            rows.push(row);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (rawRows_1_1 && !rawRows_1_1.done && (_a = rawRows_1.return)) _a.call(rawRows_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return rows;
}
exports.parseTable = parseTable;
