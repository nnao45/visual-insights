import { bin, binMap, entropy, mic, pureGeneralMic, rangeNormilize } from "../statistics";
import { deepcopy } from "../utils";
export const geomTypeMap = {
    interval: "boxplot",
    line: "line",
    point: "point",
    // density: 'rect'
    density: "point"
};
const channels = {
    quantitative: ['y', 'x', 'size', 'opacity', 'color'],
    ordinal: ['y', 'x', 'opacity', 'color', 'size', 'shape'],
    nominal: ['y', 'x', 'color', 'row', 'column', 'opacity', 'size', 'shape'],
    temporal: ['y', 'x', 'size', 'color', 'opacity', 'shape']
};
// const channels = {
//     quantitative: ['y' , 'x', 'size', 'color', 'opacity'],
//     ordinal: ['y', 'x', 'color', 'size', 'shape'],
//     nominal: ['y', 'x', 'color', 'row', 'column', 'size', 'shape'],
//     temporal: ['y', 'x', 'color', 'shape']
// } as const;
const highOrderChannels = {
    dimension: ['row', 'column'],
    measure: ['repeat']
};
function humanHabbit(encoding) {
    if (encoding.x && encoding.x.type !== 'temporal') {
        if (encoding.y && encoding.y.type === 'temporal') {
            const t = encoding.x;
            encoding.x = encoding.y;
            encoding.y = t;
        }
    }
}
function encode(props) {
    const { fields, usedChannels = new Set(), statFields = [], statEncodes = [] } = props;
    const orderFields = [...fields];
    let encoding = {};
    let inHighOrderStatus = null;
    let highOrderIndex = 0;
    orderFields.sort((a, b) => b.features.entropy - a.features.entropy);
    statFields.sort((a, b) => b.features.entropy - a.features.entropy);
    const totalFields = [...statFields, ...orderFields].sort((a, b) => b.features.entropy - a.features.entropy);
    // const totalFields = [...statFields, ...orderFields].sort((a, b) => a.features.entropy - b.features.entropy);
    // orderFields.unshift(...statFields);
    for (let i = 0; i < totalFields.length; i++) {
        const chs = channels[totalFields[i].semanticType];
        let encoded = false;
        const statIndex = statFields.findIndex(f => f.fid === totalFields[i].fid);
        const orderIndex = orderFields.findIndex(f => f.fid === totalFields[i].fid);
        const isStatField = statIndex > -1;
        if (isStatField) {
            for (let j = 0; j < chs.length; j++) {
                if (!usedChannels.has(chs[j])) {
                    encoding[chs[j]] = statEncodes[statIndex];
                    usedChannels.add(chs[j]);
                    encoded = true;
                    // if (statFields[statIndex].semanticType === 'quantitative') {
                    //     if (statFields[statIndex].features.entropy / Math.log2(16) > 0.8) {
                    //         encoding[chs[j]].scale = { type: 'sqrt' }
                    //     }
                    // }
                    break;
                }
            }
            // 发生可能很低
            // FIXME 多度量repeat设计
            if (!encoded) {
                inHighOrderStatus = statFields[statIndex].analyticType;
                if (inHighOrderStatus === 'dimension' && highOrderIndex < highOrderChannels[inHighOrderStatus].length) {
                    encoding[highOrderChannels[inHighOrderStatus][highOrderIndex]] = statEncodes[statIndex];
                    highOrderIndex++;
                }
            }
        }
        else {
            for (let j = 0; j < chs.length; j++) {
                if (!usedChannels.has(chs[j])) {
                    encoding[chs[j]] = {
                        field: orderFields[orderIndex].fid,
                        type: orderFields[orderIndex].semanticType,
                        title: orderFields[orderIndex].name || orderFields[orderIndex].fid
                    };
                    if (orderFields[orderIndex].semanticType === 'temporal' && chs[j] === 'color') {
                        encoding[chs[j]].scale = {
                            scheme: 'viridis'
                        };
                    }
                    // if (orderFields[orderIndex].semanticType === 'quantitative') {
                    //     if (orderFields[orderIndex].features.entropy / Math.log2(16) > 0.8) {
                    //         encoding[chs[j]].scale = { type: 'sqrt' }
                    //     }
                    // }
                    usedChannels.add(chs[j]);
                    encoded = true;
                    break;
                }
            }
            if (!encoded) {
                inHighOrderStatus = orderFields[orderIndex].analyticType;
                if (inHighOrderStatus === 'dimension' && highOrderIndex < highOrderChannels[inHighOrderStatus].length) {
                    encoding[highOrderChannels[inHighOrderStatus][highOrderIndex]] = {
                        field: orderFields[orderIndex].fid,
                        type: orderFields[orderIndex].semanticType
                    };
                    highOrderIndex++;
                }
            }
        }
    }
    // for (let i = 0; i < statFields.length; i++) {
    //     const chs = channels[statFields[i].semanticType];
    //     let encoded: boolean = false;
    //     for (let j = 0; j < chs.length; j++) {
    //         if (!usedChannels.has(chs[j])) {
    //             encoding[chs[j]] = statEncodes[i]
    //             usedChannels.add(chs[j])
    //             encoded = true;
    //             break;
    //         }
    //     }
    //     // 发生可能很低
    //     if (!encoded) {
    //         inHighOrderStatus = statFields[i].analyticType;
    //         if (inHighOrderStatus === 'dimension' && highOrderIndex < highOrderChannels[inHighOrderStatus].length) {
    //             encoding[highOrderChannels[inHighOrderStatus][highOrderIndex]] = statEncodes[i]
    //             highOrderIndex++
    //         }
    //     }
    // }
    // for (let i = 0; i < orderFields.length; i++) {
    //     const chs = channels[orderFields[i].semanticType];
    //     let encoded: boolean = false;
    //     for (let j = 0; j < chs.length; j++) {
    //         if (!usedChannels.has(chs[j])) {
    //             encoding[chs[j]] = {
    //                 field: orderFields[i].fid,
    //                 type: orderFields[i].semanticType,
    //                 title: orderFields[i].name || orderFields[i].fid
    //             }
    //             usedChannels.add(chs[j])
    //             encoded = true;
    //             break;
    //         }
    //     }
    //     if (!encoded) {
    //         inHighOrderStatus = orderFields[i].analyticType;
    //         if (inHighOrderStatus === 'dimension' && highOrderIndex < highOrderChannels[inHighOrderStatus].length) {
    //             encoding[highOrderChannels[inHighOrderStatus][highOrderIndex]] = {
    //                 field: orderFields[i].fid,
    //                 type: orderFields[i].semanticType
    //             }
    //             highOrderIndex++
    //         }
    //     }
    // }
    return encoding;
}
function isSetEqual(a1, a2) {
    const s1 = new Set(a1);
    const s2 = new Set(a2);
    if (s1.size !== s2.size)
        return false;
    for (let ele of s1) {
        if (!s2.has(ele))
            return false;
    }
    return true;
}
function autoMark(fields, statFields = [], originFields = [], statEncodes = []) {
    // const orderFields = [...fields];
    // const orderStatFields = [...statFields];
    // orderFields.sort((a, b) => b.features.entropy - a.features.entropy);
    // orderStatFields.sort((a, b) => b.features.entropy - a.features.entropy);
    const semantics = [...statFields, ...originFields].sort((a, b) => b.features.entropy - a.features.entropy).slice(0, 2).map(f => f.semanticType);
    // if (fields.length === 1) {
    //     return 'bar'
    // }
    // FIXME: 时间序列多目标
    // if (statFields.length > 0) {
    //     // 仅对count生效。
    //     return 'bar'
    // }
    if (statEncodes.find(f => f.aggregate === 'count')) {
        return 'bar';
    }
    // if (fields.length === 1) {
    //     return 'bar'
    // }
    const cond_sinleTargets = fields.filter(f => f.analyticType === 'measure').length === 1;
    if (cond_sinleTargets) {
        if (isSetEqual(semantics, ['nominal', 'nominal'])) {
            return 'text';
        }
        else if (isSetEqual(semantics, ['nominal', 'quantitative'])) {
            return 'bar';
        }
        else if (isSetEqual(semantics, ['ordinal', 'quantitative'])) {
            return 'point';
        }
        else if (isSetEqual(semantics, ['nominal', 'ordinal'])) {
            return 'point';
        }
        else if (isSetEqual(semantics, ['nominal', 'temporal'])) {
            return 'point';
        }
        else if (isSetEqual(semantics, ['quantitative', 'quantitative'])) {
            return 'circle';
        }
        else if (isSetEqual(semantics, ['temporal', 'quantitative'])) {
            return 'line';
        }
    }
    else {
        if (isSetEqual(semantics, ['nominal', 'nominal'])) {
            return 'square';
        }
        else if (isSetEqual(semantics, ['nominal', 'quantitative'])) {
            return 'tick';
        }
        else if (isSetEqual(semantics, ['ordinal', 'quantitative'])) {
            return 'point';
        }
        else if (isSetEqual(semantics, ['nominal', 'ordinal'])) {
            return 'tick';
        }
        else if (isSetEqual(semantics, ['quantitative', 'quantitative'])) {
            return 'circle';
        }
        else if (isSetEqual(semantics, ['nominal', 'temporal'])) {
            return 'point';
        }
    }
    return 'point';
}
function markFixEncoding(markType, usedChannels) {
    if (markType === 'bar') {
        usedChannels.add('size');
        usedChannels.add('shape');
    }
}
// FIXME: 统一aggregate逻辑。
function autoStat(fields) {
    const statFields = [];
    const statEncodes = [];
    const cond_singlefield = fields.length === 1;
    const cond_nonquanmeasure = fields.filter(f => f.analyticType === 'measure').filter(f => f.semanticType === 'nominal' || f.semanticType === 'ordinal').length > 0;
    if (cond_singlefield || cond_nonquanmeasure) {
        statFields.push({
            fid: '__tmp_stat_id_unique',
            semanticType: 'quantitative',
            analyticType: 'measure',
            features: {
                entropy: Infinity,
                maxEntropy: Infinity,
                unique: 1000,
                min: 0,
                max: 0
            },
            distribution: []
        });
        statEncodes.push({
            aggregate: 'count'
        });
        fields.filter(f => f.semanticType === 'quantitative').forEach(f => {
            statFields.push(Object.assign({}, f));
            statEncodes.push({
                field: f.fid,
                title: f.name || f.fid,
                semanticType: f.semanticType,
                bin: true
            });
        });
    }
    else {
        const targets = fields.filter(f => f.analyticType === 'measure');
        // 单目标的场景
        if (targets.length === 1) {
            // 连续型 度量做聚合，非连续型度量做分箱；
            targets.forEach(f => {
                statFields.push(Object.assign({}, f));
                statEncodes.push({
                    field: f.fid,
                    semanticType: f.semanticType,
                    title: `mean(${f.name || f.fid})`,
                    aggregate: 'mean'
                });
            });
            fields.filter(f => f.analyticType === 'dimension' && f.semanticType === 'quantitative').forEach(f => {
                statFields.push(Object.assign({}, f));
                statEncodes.push({
                    field: f.fid,
                    title: f.name || f.fid,
                    semanticType: f.semanticType,
                    bin: true
                });
            });
        }
    }
    const distFields = fields.filter(f => !statFields.find(sf => sf.fid === f.fid));
    return { statFields, distFields, statEncodes };
}
export function labDistVis(props) {
    const { pattern, dataSource } = props;
    const fields = deepcopy(pattern.fields);
    const measures = fields.filter(f => f.analyticType === 'measure');
    const dimensions = fields.filter(f => f.analyticType === 'dimension');
    // const TT = dataSource.map(r => dimensions.map(d => `${d.fid}_${r[d.fid]}`).join(','));
    // for (let i = 0; i < measures.length; i++) {
    //     const values = dataSource.map(r => r[measures[i].fid]);
    //     // const ent = pureGeneralConditionH(TT, values);
    //     measures[i].features.entropy = entropy(rangeNormilize(bin(values).filter(v => v > 0)))
    //     // measures[i].features.entropy = measures[i].features.entropy - ent;
    // }
    for (let i = 0; i < measures.length; i++) {
        let score = 0;
        const values1 = dataSource.map(r => r[measures[i].fid]);
        const T = binMap(values1);
        if (measures.length > 1) {
            for (let j = 0; j < measures.length; j++) {
                if (j === i)
                    continue;
                const values2 = dataSource.map(r => r[measures[j].fid]);
                score += mic(T, values2);
                // const X: [number, number][] = values2.map((v, vi) => [v, values1[vi]]);
                // const ranges = initRanges(X, 2);
                // score += entropy(rangeNormilize(matrixBinShareRange(X, ranges).flatMap(v => v).filter(v => v > 0)));
            }
            score /= (measures.length - 1);
        }
        else {
            score = Math.log2(16) - entropy(rangeNormilize(bin(values1).filter(v => v > 0)));
        }
        measures[i].features.entropy = score;
    }
    for (let i = 0; i < dimensions.length; i++) {
        const T = dataSource.map(r => r[dimensions[i].fid]);
        let totalEntLoss = 0;
        // if (measures.length === 1) {
        //     const values = dataSource.map(r => r[measures[0].fid]);
        //     const entLoss = generalMic(T, values) // pureGeneralMic(T, values);
        //     totalEntLoss += entLoss;
        // } else {
        //     const meaIds = measures.map(m => m.fid);
        //     const projections = getCombination(meaIds, 2, 2);
        //     for (let pro of projections) {
        //         const meaProValues: [number, number][] = dataSource.map(row => [row[pro[0]], row[pro[1]]])
        //         const score = generalMatMic(T, meaProValues);
        //         totalEntLoss += score;
        //     }
        //     totalEntLoss /= projections.length
        // }
        for (let j = 0; j < measures.length; j++) {
            const values = dataSource.map(r => r[measures[j].fid]);
            const entLoss = pureGeneralMic(T, values);
            totalEntLoss += entLoss;
        }
        totalEntLoss /= measures.length;
        //@ts-ignore
        dimensions[i].features.originEntropy = dimensions[i].features.entropy;
        dimensions[i].features.entropy = totalEntLoss;
    }
    const usedChannels = new Set();
    const { statFields, distFields, statEncodes } = autoStat(fields);
    let markType = autoMark(fields, statFields, distFields, statEncodes);
    markFixEncoding(markType, usedChannels);
    // if (filters && filters.length > 0) {
    //     usedChannels.add('color')
    // }
    const enc = encode({
        fields: distFields, usedChannels, statFields,
        statEncodes
    });
    // if (filters && filters.length > 0) {
    //     const field = filters[0].field;
    //     enc.color = {
    //         // field: field.fid,
    //         // type: field.semanticType,
    //         condition: {
    //             test: `datum['${field.fid}'] == '${filters[0].values[0]}'`
    //         },
    //         value: '#aaa'
    //         // value: '#000'
    //     }
    // }
    // autoAgg({
    //     encoding: enc, fields, markType,
    //     statFields
    // })
    humanHabbit(enc);
    let basicSpec = {
        // "config": {
        //     "range": {
        //       "category": {
        //         "scheme": "set2"
        //       }
        //     }
        //   },
        data: { name: 'dataSource' },
        // "params": [{
        //     "name": "grid",
        //     "select": "interval",
        //     "bind": "scales"
        //   }],
        mark: {
            type: markType,
            opacity: markType === 'circle' ? 0.56 : 0.88
        },
        encoding: enc
    };
    // if (filters && filters.length > 1) {
    //     basicSpec.transform = filters.slice(1).map(f => ({
    //         filter: `datum.${f.field.fid} == '${f.values[0]}'`
    //     }))
    // }
    // if (filters && filters.length > 0) {
    //     basicSpec.transform = filters.map(f => ({
    //         filter: `datum.${f.field.fid} == '${f.values[0]}'`
    //     }))
    // }
    return basicSpec;
}
