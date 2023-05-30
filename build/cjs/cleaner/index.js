import { deepcopy } from '../utils/index';
function dropNullColumn(dataSource, fields) {
    let keepFields = fields.map(() => false);
    for (let record of dataSource) {
        for (let i = 0; i < fields.length; i++) {
            let field = fields[i];
            if (typeof record[field] !== 'undefined' && record[field] !== '' && record[field] !== null) {
                keepFields[i] = true;
            }
        }
    }
    let finalFields = fields.filter((field, index) => {
        return keepFields[index];
    });
    return {
        fields: finalFields,
        dataSource: dataSource.map(record => {
            let ans = {};
            for (let field of finalFields) {
                ans[field] = record[field];
            }
            return ans;
        })
    };
}
function dropNull(dataSource, dimensions, measures) {
    let data = [];
    for (let record of dataSource) {
        let keep = true;
        for (let dim of dimensions) {
            if (typeof record[dim] === 'undefined' || record[dim] === '' || record[dim] === null) {
                keep = false;
            }
        }
        for (let mea of measures) {
            if (typeof record[mea] !== 'number') {
                keep = false;
            }
        }
        if (keep) {
            data.push(record);
        }
    }
    return data;
}
function isNullValue(value) {
    return ['', null, undefined].includes(value);
}
/**
 * use mode of one field to replace its null value
 * @param dataSource
 * @param fieldNames name list of fields you want to clean with useMode function.
 * problem: some field may regard the null value as the most common value... sad : (.
 * I am dead.
 */
function useMode(dataSource, fieldNames) {
    /**
     * map to count each member's times of apperance in fields.
     */
    const countMap = new Map();
    /**
     * map to get the mode member of each field.
     */
    const modeMap = new Map();
    for (let fieldName of fieldNames) {
        countMap.set(fieldName, new Map());
        modeMap.set(fieldName, 0);
    }
    for (let record of dataSource) {
        for (let fieldName of fieldNames) {
            let counter = countMap.get(fieldName);
            if (!isNullValue(record[fieldName])) {
                if (!counter.has(record[fieldName])) {
                    counter.set(record[fieldName], 0);
                }
                counter.set(record[fieldName], counter.get(record[fieldName]) + 1);
            }
        }
    }
    for (let key of countMap.keys()) {
        let counter = countMap.get(key);
        let members = [...counter.entries()];
        let max = 0;
        let maxPos = 0;
        for (let i = 0; i < members.length; i++) {
            let member = members[i];
            if (member[1] > max) {
                max = member[1];
                maxPos = i;
            }
        }
        modeMap.set(key, members[maxPos][0]);
    }
    const newDataSource = deepcopy(dataSource);
    for (let record of newDataSource) {
        for (let fieldName of fieldNames) {
            if (isNullValue(record[fieldName])) {
                record[fieldName] = modeMap.get(fieldName);
            }
        }
    }
    return newDataSource;
}
function simpleClean(dataSource, dimensions, measures) {
    const newDataSource = deepcopy(dataSource);
    for (let record of dataSource) {
        for (let dim of dimensions) {
            if (isNullValue(record[dim])) {
                record[dim] = 'null';
            }
        }
        for (let mea of measures) {
            if (isNullValue(record[mea])) {
                record[mea] = 0;
            }
        }
    }
    return newDataSource;
}
export { simpleClean, dropNull, useMode, dropNullColumn };
