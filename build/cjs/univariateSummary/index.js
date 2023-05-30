import { isFieldTime, isFieldContinous, memberCount, isFieldCategory, deepcopy, groupContinousField, groupCategoryField } from '../utils/index';
import { normalize, entropy } from '../statistics/index';
import { isUniformDistribution } from '../distribution';
import { BIN_NUM_FOR_ANALYTIC } from '../constant';
const MIN_QUAN_MEMBER_SIZE = BIN_NUM_FOR_ANALYTIC;
/**
 *
 * @param dataSource
 * @param field
 * todo: should accept BIField type and calculate the semantic type basic on it.
 */
export function getFieldType(dataSource, field) {
    if (isFieldTime(dataSource, field)) {
        return 'temporal';
    }
    else if (isFieldContinous(dataSource, field)) {
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
        if (memberCount(dataSource, field).length > MIN_QUAN_MEMBER_SIZE) {
            return 'quantitative';
        }
        else {
            return 'ordinal';
        }
        return 'quantitative';
    }
    else if (isFieldCategory(dataSource, field)) {
        // isFieldCategory is a safety checking here, for sometimes dirty data value can be object.
        return 'nominal';
    }
    else {
        // todo do something(like cleaning)
        return 'nominal';
    }
}
export function getAllFieldTypes(dataSource, fields) {
    let fieldsWithType = [];
    for (let field of fields) {
        fieldsWithType.push({
            name: field,
            type: getFieldType(dataSource, field)
        });
    }
    return fieldsWithType;
}
export function getFieldDistribution(dataSource, field) {
    let members = memberCount(dataSource, field);
    // members.sort((a, b) => a[1] - b[1]);
    return members.map(m => {
        return { memberName: m[0], count: m[1] };
    });
}
export function getAllFieldsDistribution(dataSource, fields) {
    let fieldsDistribution = [];
    for (let field of fields) {
        fieldsDistribution.push({
            fieldName: field,
            distribution: getFieldDistribution(dataSource, field)
        });
    }
    return fieldsDistribution;
}
export function getFieldEntropy(dataSource, field) {
    const members = memberCount(dataSource, field);
    const frequencyList = members.map(m => m[1]);
    const probabilityList = normalize(frequencyList);
    const fieldEntropy = entropy(probabilityList);
    const maxEntropy = Math.log2(members.length);
    return {
        fieldName: field,
        entropy: fieldEntropy,
        maxEntropy
    };
}
export function getFloatFieldEntropy(dataSource, field) {
    let _max = -Infinity;
    let _min = Infinity;
    for (let i = 0; i < dataSource.length; i++) {
        _max = Math.max(_max, dataSource[i][field]);
        _min = Math.min(_min, dataSource[i][field]);
    }
    const rangeStep = (_max - _min) / BIN_NUM_FOR_ANALYTIC;
    const rangeCounts = new Array(BIN_NUM_FOR_ANALYTIC + 1).fill(0);
    for (let i = 0; i < dataSource.length; i++) {
        const value = dataSource[i][field];
        const valueIndex = Math.floor((value - _min) / rangeStep);
        rangeCounts[valueIndex]++;
    }
    rangeCounts[BIN_NUM_FOR_ANALYTIC - 1] += rangeCounts[BIN_NUM_FOR_ANALYTIC];
    const pl = normalize(rangeCounts.slice(0, BIN_NUM_FOR_ANALYTIC));
    const fieldEntropy = entropy(pl);
    const maxEntropy = Math.log2(BIN_NUM_FOR_ANALYTIC);
    return {
        fieldName: field,
        entropy: fieldEntropy,
        maxEntropy
    };
}
export function getAllFieldsEntropy(dataSource, fields) {
    let fieldEntropyList = [];
    for (let field of fields) {
        fieldEntropyList.push(getFieldEntropy(dataSource, field));
    }
    return fieldEntropyList;
}
export function groupFields(dataSource, fields) {
    let groupedData = deepcopy(dataSource);
    let newFields = [];
    for (let field of fields) {
        let newFieldName = `${field.name}(group)`;
        if (field.type === 'quantitative' && memberCount(dataSource, field.name).length > MIN_QUAN_MEMBER_SIZE * 2) {
            if (!isUniformDistribution(dataSource, field.name)) {
                groupedData = groupContinousField({
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
        else if ((field.type === 'ordinal' || field.type === 'nominal') && memberCount(dataSource, field.name).length > MIN_QUAN_MEMBER_SIZE) {
            if (!isUniformDistribution(dataSource, field.name)) {
                groupedData = groupCategoryField({
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
    return {
        groupedData,
        fields,
        newFields
    };
}
