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
exports.groupFields = exports.getAllFieldsEntropy = exports.getFloatFieldEntropy = exports.getFieldEntropy = exports.getAllFieldsDistribution = exports.getFieldDistribution = exports.getAllFieldTypes = exports.getFieldType = void 0;
var index_1 = require("../utils/index");
var index_2 = require("../statistics/index");
var distribution_1 = require("../distribution");
var constant_1 = require("../constant");
var MIN_QUAN_MEMBER_SIZE = constant_1.BIN_NUM_FOR_ANALYTIC;
/**
 *
 * @param dataSource
 * @param field
 * todo: should accept BIField type and calculate the semantic type basic on it.
 */
function getFieldType(dataSource, field) {
    if ((0, index_1.isFieldTime)(dataSource, field)) {
        return 'temporal';
    }
    else if ((0, index_1.isFieldContinous)(dataSource, field)) {
        // Todo:
        // here is only a tmp solution. we still hope to divided ordinal type and quantitative type.
        // if (memberCount(dataSource, field).length > MIN_QUAN_MEMBER_SIZE) {
        //   return 'quantitative'
        // } else {
        //   return 'ordinal';
        // }
        // TODO: 讨论这里的严格逻辑
        // [2022.2.8] 由ordinal字段被当做quantitative字段处理导致的效果变差的问题。
        // 参考 https://ewgw6z7tk0.feishu.cn/docs/doccnfuCntXAx5K0SA9jOxgKxYe
        if ((0, index_1.memberCount)(dataSource, field).length > MIN_QUAN_MEMBER_SIZE) {
            return 'quantitative';
        }
        else {
            return 'ordinal';
        }
        return 'quantitative';
    }
    else if ((0, index_1.isFieldCategory)(dataSource, field)) {
        // isFieldCategory is a safety checking here, for sometimes dirty data value can be object.
        return 'nominal';
    }
    else {
        // todo do something(like cleaning)
        return 'nominal';
    }
}
exports.getFieldType = getFieldType;
function getAllFieldTypes(dataSource, fields) {
    var e_1, _a;
    var fieldsWithType = [];
    try {
        for (var fields_1 = __values(fields), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
            var field = fields_1_1.value;
            fieldsWithType.push({
                name: field,
                type: getFieldType(dataSource, field)
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (fields_1_1 && !fields_1_1.done && (_a = fields_1.return)) _a.call(fields_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return fieldsWithType;
}
exports.getAllFieldTypes = getAllFieldTypes;
function getFieldDistribution(dataSource, field) {
    var members = (0, index_1.memberCount)(dataSource, field);
    // members.sort((a, b) => a[1] - b[1]);
    return members.map(function (m) {
        return { memberName: m[0], count: m[1] };
    });
}
exports.getFieldDistribution = getFieldDistribution;
function getAllFieldsDistribution(dataSource, fields) {
    var e_2, _a;
    var fieldsDistribution = [];
    try {
        for (var fields_2 = __values(fields), fields_2_1 = fields_2.next(); !fields_2_1.done; fields_2_1 = fields_2.next()) {
            var field = fields_2_1.value;
            fieldsDistribution.push({
                fieldName: field,
                distribution: getFieldDistribution(dataSource, field)
            });
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (fields_2_1 && !fields_2_1.done && (_a = fields_2.return)) _a.call(fields_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return fieldsDistribution;
}
exports.getAllFieldsDistribution = getAllFieldsDistribution;
function getFieldEntropy(dataSource, field) {
    var members = (0, index_1.memberCount)(dataSource, field);
    var frequencyList = members.map(function (m) { return m[1]; });
    var probabilityList = (0, index_2.normalize)(frequencyList);
    var fieldEntropy = (0, index_2.entropy)(probabilityList);
    var maxEntropy = Math.log2(members.length);
    return {
        fieldName: field,
        entropy: fieldEntropy,
        maxEntropy: maxEntropy
    };
}
exports.getFieldEntropy = getFieldEntropy;
function getFloatFieldEntropy(dataSource, field) {
    var _max = -Infinity;
    var _min = Infinity;
    for (var i = 0; i < dataSource.length; i++) {
        _max = Math.max(_max, dataSource[i][field]);
        _min = Math.min(_min, dataSource[i][field]);
    }
    var rangeStep = (_max - _min) / constant_1.BIN_NUM_FOR_ANALYTIC;
    var rangeCounts = new Array(constant_1.BIN_NUM_FOR_ANALYTIC + 1).fill(0);
    for (var i = 0; i < dataSource.length; i++) {
        var value = dataSource[i][field];
        var valueIndex = Math.floor((value - _min) / rangeStep);
        rangeCounts[valueIndex]++;
    }
    rangeCounts[constant_1.BIN_NUM_FOR_ANALYTIC - 1] += rangeCounts[constant_1.BIN_NUM_FOR_ANALYTIC];
    var pl = (0, index_2.normalize)(rangeCounts.slice(0, constant_1.BIN_NUM_FOR_ANALYTIC));
    var fieldEntropy = (0, index_2.entropy)(pl);
    var maxEntropy = Math.log2(constant_1.BIN_NUM_FOR_ANALYTIC);
    return {
        fieldName: field,
        entropy: fieldEntropy,
        maxEntropy: maxEntropy
    };
}
exports.getFloatFieldEntropy = getFloatFieldEntropy;
function getAllFieldsEntropy(dataSource, fields) {
    var e_3, _a;
    var fieldEntropyList = [];
    try {
        for (var fields_3 = __values(fields), fields_3_1 = fields_3.next(); !fields_3_1.done; fields_3_1 = fields_3.next()) {
            var field = fields_3_1.value;
            fieldEntropyList.push(getFieldEntropy(dataSource, field));
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (fields_3_1 && !fields_3_1.done && (_a = fields_3.return)) _a.call(fields_3);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return fieldEntropyList;
}
exports.getAllFieldsEntropy = getAllFieldsEntropy;
function groupFields(dataSource, fields) {
    var e_4, _a;
    var groupedData = (0, index_1.deepcopy)(dataSource);
    var newFields = [];
    try {
        for (var fields_4 = __values(fields), fields_4_1 = fields_4.next(); !fields_4_1.done; fields_4_1 = fields_4.next()) {
            var field = fields_4_1.value;
            var newFieldName = "".concat(field.name, "(group)");
            if (field.type === 'quantitative' && (0, index_1.memberCount)(dataSource, field.name).length > MIN_QUAN_MEMBER_SIZE * 2) {
                if (!(0, distribution_1.isUniformDistribution)(dataSource, field.name)) {
                    groupedData = (0, index_1.groupContinousField)({
                        dataSource: groupedData,
                        field: field.name,
                        newField: newFieldName,
                        groupNumber: 8
                    });
                    newFields.push({
                        name: newFieldName,
                        type: 'ordinal'
                    });
                }
            }
            else if ((field.type === 'ordinal' || field.type === 'nominal') && (0, index_1.memberCount)(dataSource, field.name).length > MIN_QUAN_MEMBER_SIZE) {
                if (!(0, distribution_1.isUniformDistribution)(dataSource, field.name)) {
                    groupedData = (0, index_1.groupCategoryField)({
                        dataSource: groupedData,
                        field: field.name,
                        newField: newFieldName,
                        groupNumber: 8
                    });
                    newFields.push({
                        name: newFieldName,
                        type: field.type
                    });
                }
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (fields_4_1 && !fields_4_1.done && (_a = fields_4.return)) _a.call(fields_4);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return {
        groupedData: groupedData,
        fields: fields,
        newFields: newFields
    };
}
exports.groupFields = groupFields;
