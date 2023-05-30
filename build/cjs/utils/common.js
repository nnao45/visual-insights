const JOIN_SYMBOL = '_';
const MAGIC_NUMBER = 5;
function deepcopy(data) {
    return JSON.parse(JSON.stringify(data));
}
function copyData(data) {
    return data.map(r => (Object.assign({}, r)));
}
function isFieldCategory(dataSource, fieldName) {
    return dataSource.every(record => {
        return typeof record[fieldName] === 'string'
            || typeof record[fieldName] === 'undefined'
            || record[fieldName] === null;
    });
}
function isFieldContinous(dataSource, fieldName) {
    return dataSource.every(record => {
        return !isNaN(+record[fieldName])
            || typeof record[fieldName] === 'undefined'
            || record[fieldName] === null;
    });
}
function isFieldNumeric(dataSource, fieldName) {
    return dataSource.every(record => {
        return !isNaN(record[fieldName])
            || typeof record[fieldName] === 'undefined'
            || record[fieldName] === null;
    });
}
const TIME_RULES = [
    /^[0-9]{2,4}[-/][0-9]{1,2}([-/][0-9]{1,2})?$/,
    /^[0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4}$/,
    /^[1-2][0-9]{3}[0-9]{2}[0-9]{2}$/,
    /^[0-9]{2,4}[-/][0-9]{1,2}[-/][0-9]{1,2} [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$/ // YYYY-MM-DD HH:mm:ss
];
function isFieldTime(dataSource, fieldName) {
    return dataSource.every(record => {
        // todo: tmp solotion here.
        if (!isNaN(Number(record[fieldName])) && Number(record[fieldName]) >= 1800 && Number(record[fieldName]) <= 2200) {
            return true;
        }
        return (typeof record[fieldName] === 'string'
            // && /^[0-9]{0,4}[-/][0-9]{0,2}([-/][0-9]{0,2}$)?/.test(record[fieldName]))
            && TIME_RULES.some(rule => rule.test(record[fieldName])))
            || typeof record[fieldName] === 'undefined'
            || record[fieldName] === null;
    });
}
function aggregate({ dataSource, fields, bys, method = 'sum' }) {
    let tmp = [];
    for (let by of bys) {
        let map = new Map();
        for (let record of dataSource) {
            let key = JSON.stringify(fields.map(field => record[field]));
            if (!map.has(key)) {
                map.set(key, 0);
            }
            map.set(key, map.get(key) + record[by]);
        }
        for (let [key, value] of map) {
            let row = {
                index: key,
                [by]: value
            };
            let dims = JSON.parse(key);
            for (let i = 0; i < fields.length; i++) {
                row[fields[i]] = dims[i];
            }
            tmp.push(row);
        }
    }
    let ans = new Map();
    for (let record of tmp) {
        if (!ans.has(record.index)) {
            ans.set(record.index, {});
        }
        ans.set(record.index, Object.assign(Object.assign({}, ans.get(record.index)), record));
    }
    return [...ans.values()];
}
function memberCount(dataSource, field) {
    const counter = new Map();
    for (let row of dataSource) {
        let member = row[field];
        if (!counter.has(member)) {
            counter.set(member, 0);
        }
        counter.set(member, counter.get(member) + 1);
    }
    return [...counter.entries()];
}
function groupContinousField({ dataSource, field, newField = `${field}(con-group)`, groupNumber }) {
    // const members = memberCount(dataSource, field);
    // todo: outlier detection
    const values = dataSource.map(item => item[field]);
    const max = Math.max(...values); // Number.EPSILON * ;
    const min = Math.min(...values);
    const segWidth = (max - min) / groupNumber;
    let ranges = [];
    for (let i = 0; i < groupNumber; i++) {
        let left = min + i * segWidth;
        let right = min + (i + 1) * segWidth;
        ranges.push([left, right]);
    }
    ranges[0][0] = -Infinity;
    ranges[ranges.length - 1][1] = Infinity;
    let precision = Math.max(1, Math.log10(Math.abs(min)) - Math.log10(segWidth)) + 1;
    for (let i = 0; i < dataSource.length; i++) {
        let record = dataSource[i];
        let rangeIndex = ranges.findIndex(r => (r[0] <= record[field] && record[field] < r[1]));
        let range = ranges[rangeIndex];
        if (typeof range !== 'undefined') {
            record[newField] = `${rangeIndex + 1}:[${Number(range[0].toPrecision(precision))}, ${Number(range[1].toPrecision(precision))})`;
        }
        else {
            record[newField] = 'null';
        }
    }
    return dataSource;
}
function groupCategoryField({ dataSource, field, newField = `${field}(cat-group)`, groupNumber }) {
    // auto category should obey Power law distrubution.
    let members = memberCount(dataSource, field);
    members.sort((a, b) => b[1] - a[1]);
    let sum = members.map(v => v[1]);
    groupNumber = members.length;
    for (let i = sum.length - 2; i >= 0; i--) {
        sum[i] = sum[i + 1] + sum[i];
    }
    for (let i = 0; i < members.length - 2; i++) {
        // strict mode
        // if (members[i][1] >= sum[i + 1] && members[i + 1][1] < sum[i + 2]) {
        if (members[i][1] * MAGIC_NUMBER >= sum[i + 1] && members[i + 1][1] / MAGIC_NUMBER < sum[i + 2]) {
            groupNumber = i + 2;
            break;
        }
    }
    // groupNumber = Math.max(Math.round(Math.sqrt(members.length)), groupNumber)
    if (groupNumber === members.length) {
        return dataSource.map(record => {
            return Object.assign(Object.assign({}, record), { [newField]: record[field] });
        });
    }
    let set = new Set();
    for (let i = groupNumber - 1; i < members.length; i++) {
        set.add(members[i][0]);
    }
    for (let record of dataSource) {
        if (set.has(record[field])) {
            record[newField] = 'others';
        }
        else {
            record[newField] = record[field];
        }
    }
    return dataSource;
}
/**
 * Kullback–Leibler divergence
 * @param p1List
 * @param p2List
 *
 */
function DKL(p1List, p2List) {
    let sum = 0;
    const len = Math.max(p1List.length, p2List.length);
    for (let i = 0; i < len; i++) {
        let p1 = p1List[i] || 0;
        let p2 = p2List[i] || 0;
        sum += p1 * Math.log2(p1 / p2);
    }
    return sum;
}
function isFieldUnique(dataSource, field) {
    let set = new Set();
    let validCount = 0;
    let len = dataSource.length;
    for (let i = 0; i < len; i++) {
        if (dataSource[i][field] !== undefined && dataSource[i][field] !== null && dataSource[i][field] !== '') {
            validCount++;
            set.add(dataSource[i][field]);
        }
    }
    if (set.size === validCount)
        return true;
    return false;
}
export function subset2theOther(A, B) {
    let smallArr = A.length > B.length ? B : A;
    let largeSet = A.length > B.length ? new Set(A) : new Set(B);
    for (let str of smallArr) {
        if (!largeSet.has(str))
            return false;
    }
    return true;
}
export { deepcopy, copyData, memberCount, groupCategoryField, groupContinousField, aggregate, isFieldCategory, isFieldContinous, isFieldTime, isFieldNumeric, JOIN_SYMBOL, DKL, isFieldUnique };
