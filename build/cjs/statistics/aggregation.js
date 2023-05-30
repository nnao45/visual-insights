import { min, max, sum, mean } from './aggregators';
import { distMergeBy, sumByCol } from './aggregators';
const SPLITOR = '_@_';
const count = function (x) {
    return x.length;
};
export const SFMapper = {
    sum,
    max,
    mean,
    min,
    count
};
export function getAggregator(op) {
    const func = SFMapper[op] || sum;
    return func;
}
export function groupBy(rows, by) {
    const groups = new Map();
    for (let record of rows) {
        const key = by.map((d) => record[d]).join(SPLITOR);
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(record);
    }
    return groups;
}
export function getValueMapList(rows, by) {
    const valueMapList = [];
    const reverseValueList = [];
    for (let i = 0; i < by.length; i++) {
        const valueMap = new Map();
        const valueIndices = [];
        let size = 0;
        for (let j = 0; j < rows.length; j++) {
            // valueIndices.push()
            if (!valueMap.has(rows[j][by[i]])) {
                valueIndices.push(rows[j][by[i]]);
                valueMap.set(rows[j][by[i]], size);
                size++;
            }
        }
        reverseValueList.push(valueIndices);
        valueMapList.push(valueMap);
    }
    return valueMapList;
}
export function encodeRowsByValueMap(rows, dimensions, valueMapList) {
    return rows.map(r => {
        let nr = Object.assign({}, r);
        dimensions.forEach((d, di) => {
            nr[d] = valueMapList[di].get(r[d]);
        });
        return nr;
    });
}
export function groupByDev(rows, by, valueMapList) {
    const groups = new Map();
    // const valueMapList: Map<any, number>[] = [];
    // const reverseValueList: any[][] = [];
    // for (let i = 0; i < by.length; i++) {
    //     const valueMap: Map<any, number> = new Map();
    //     const valueIndices: any[] = [];
    //     let size = 0;
    //     for (let j = 0; j < rows.length; j++) {
    //         // valueIndices.push()
    //         if (!valueMap.has(rows[j][by[i]])) {
    //             valueIndices.push(rows[j][by[i]])
    //             valueMap.set(rows[j][by[i]], size);
    //             size++;
    //         }
    //     }
    //     reverseValueList.push(valueIndices);
    //     valueMapList.push(valueMap);
    // }
    for (let record of rows) {
        // const key = by.map((d) => record[d]).join(SPLITOR);
        const key = by.map((d, di) => valueMapList[di].get(record[d])).join(SPLITOR);
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(record);
    }
    return groups;
}
export function fastGroupBy(rows, by) {
    const groups = [[...rows]];
    for (const groupKey of by) {
        const ungrouped = groups.splice(0, groups.length);
        const hashMap = new Map();
        for (const prevGrp of ungrouped) {
            // const hashMap = new Map<string | number, number>();
            for (const d of prevGrp) {
                let idx = hashMap.get(d[groupKey]);
                if (idx === undefined) {
                    groups.push([]);
                    idx = groups.length - 1;
                    hashMap.set(d[groupKey], idx);
                }
                groups[idx].push(d);
            }
            hashMap.clear();
        }
    }
    return groups;
}
export function simpleAggregate(props) {
    const { dataSource, dimensions, measures, ops } = props;
    const groups = groupBy(dataSource, dimensions);
    const result = [];
    for (let [key, group] of groups) {
        const aggs = {};
        measures.forEach((mea, meaIndex) => {
            const opFunc = getAggregator(ops[meaIndex]);
            aggs[mea] = opFunc(group.map(r => r[mea]));
        });
        const dimValues = key.split(SPLITOR);
        dimensions.forEach((dim, dimIndex) => {
            aggs[dim] = dimValues[dimIndex];
        });
        result.push(aggs);
    }
    return result;
}
export function stdAggregate(props) {
    const { dataSource, dimensions, measures, ops } = props;
    const groups = groupBy(dataSource, dimensions);
    const result = [];
    for (let [key, group] of groups) {
        // for (let group of groups) {
        const aggs = {
            groupDict: {},
            stat: {}
        };
        measures.forEach((mea, meaIndex) => {
            aggs.stat[mea] = {};
            ops.forEach(op => {
                const opFunc = getAggregator(op);
                aggs.stat[mea][op] = opFunc(group.map((r) => r[mea]));
            });
        });
        const dimValues = key.split(SPLITOR);
        dimensions.forEach((dim, dimIndex) => {
            aggs.groupDict[dim] = dimValues[dimIndex];
        });
        result.push(aggs);
    }
    return result;
}
export function getAggHashKey(values) {
    return values.join(SPLITOR);
}
function cuboidStateGroupBy(state, by) {
    const groups = new Map();
    for (let record of state) {
        const key = by.map((d) => record.groupDict[d]).join(SPLITOR);
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(record);
    }
    return groups;
}
function fastCuboidStateGroupBy(state, by) {
    let t0 = 0, t1 = 0, t2 = 0, t3 = 0;
    t0 = performance.now();
    const groups1 = new Map();
    for (let record of state) {
        const key = by.map((d) => record.groupDict[d]).join(SPLITOR);
        if (!groups1.has(key)) {
            groups1.set(key, []);
        }
        groups1.get(key).push(record);
    }
    t1 = performance.now();
    groups1.clear();
    t2 = performance.now();
    const groups = [[...state]];
    for (const groupKey of by) {
        const ungrouped = groups.splice(0, groups.length);
        for (const prevGrp of ungrouped) {
            const hashMap = new Map();
            for (const d of prevGrp) {
                let idx = hashMap.get(d.groupDict[groupKey]);
                if (idx === undefined) {
                    groups.push([]);
                    idx = groups.length - 1;
                    hashMap.set(d.groupDict[groupKey], idx);
                }
                groups[idx].push(d);
            }
            hashMap.clear();
        }
    }
    t3 = performance.now();
    console.log({
        old: t1 - t0,
        new: t3 - t2
    });
    return groups;
}
export function stdAggregateFromCuboid(props) {
    const { cuboidState, dimensions, measures, ops } = props;
    const groups = cuboidStateGroupBy(cuboidState, dimensions);
    // const groups = fastCuboidStateGroupBy(cuboidState, dimensions)
    const result = [];
    // TODO: need a formal solution for distributive\algebraic\holistic aggregators.
    const generalOpNames = ops.filter(op => !(['sum', 'count', 'mean', 'dist'].includes(op)));
    const generalOps = generalOpNames.map(opName => getAggregator(opName));
    for (let [key, group] of groups) {
        // for (let group of groups) {
        const aggs = {
            groupDict: {},
            stat: {}
        };
        for (let meaIndex = 0; meaIndex < measures.length; meaIndex++) {
            const mea = measures[meaIndex];
            aggs.stat[mea] = {};
            generalOps.forEach((op, opIndex) => {
                const opName = generalOpNames[opIndex];
                aggs.stat[mea][opName] = op(group.map((r) => r.stat[mea][opName]));
            });
            // 讨论：描述的简洁性 vs 性能
            aggs.stat[mea]["sum"] = sumByCol(group, mea, 'sum');
            aggs.stat[mea]["count"] = sumByCol(group, mea, 'count');
            // aggs[mea]["sum"] = getAggregator('sum')(group.map((r) => r[mea]["sum"]));
            // aggs[mea]["count"] = getAggregator('sum')(group.map((r) => r[mea]['count']));
            aggs.stat[mea]["mean"] = aggs.stat[mea]['sum'] / aggs.stat[mea]['count'];
            aggs.stat[mea]['dist'] = distMergeBy(group, mea, 'dist');
        }
        const dimValues = key.split(SPLITOR);
        for (let dimIndex = 0; dimIndex < dimensions.length; dimIndex++) {
            aggs.groupDict[dimensions[dimIndex]] = dimValues[dimIndex];
        }
        result.push(aggs);
    }
    return result;
}
