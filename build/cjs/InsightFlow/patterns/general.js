const BIN_SIZE = 8;
export function entropyAcc(fl) {
    let total = 0;
    for (let i = 0; i < fl.length; i++) {
        total += fl[i];
    }
    let tLog = Math.log2(total);
    let ent = 0;
    for (let i = 0; i < fl.length; i++) {
        ent = ent + fl[i] * (Math.log2(fl[i]) - tLog) / total;
    }
    return -ent;
}
export function meaImp(dataSource, mea, minValue, maxValue) {
    // const _min = typeof minValue !== 'undefined' ? minValue : Math.min(...dataSource.map(d => d[mea]));
    // const _max = typeof maxValue !== 'undefined' ? maxValue : Math.max(...dataSource.map(d => d[mea]));
    const _min = minValue;
    const _max = maxValue;
    const step = (_max - _min) / BIN_SIZE;
    let dist = new Array(BIN_SIZE + 1).fill(0);
    for (let record of dataSource) {
        let vIndex = Math.floor((record[mea] - _min) / step);
        dist[vIndex]++;
    }
    dist[BIN_SIZE - 1] += dist[BIN_SIZE];
    // const pl = normalize(dist.filter(d => d > 0));
    const ent = entropyAcc(dist.slice(0, BIN_SIZE).filter(d => d > 0));
    return ent;
}
export function viewStrength(dataSource, dimensions, measures) {
    var _a;
    const groups = new Map();
    for (let record of dataSource) {
        const _key = dimensions.map(d => record[d]).join('_');
        if (!groups.has(_key)) {
            groups.set(_key, []);
        }
        (_a = groups.get(_key)) === null || _a === void 0 ? void 0 : _a.push(record);
    }
    let totalEntLoss = 0;
    for (let mea of measures) {
        const _min = Math.min(...dataSource.map(d => d[mea]));
        const _max = Math.max(...dataSource.map(d => d[mea]));
        ;
        const ent = meaImp(dataSource, mea, _min, _max);
        // conditional ent
        let condEnt = 0;
        let logs = [];
        const entries = [...groups.entries()];
        entries.sort((a, b) => b[1].length - a[1].length);
        for (let i = 0; i < entries.length; i++) {
            if (i >= BIN_SIZE - 1)
                break;
            const groupRows = entries[i][1];
            let groupProb = groupRows.length / dataSource.length;
            const subEnt = meaImp(groupRows, mea, _min, _max);
            condEnt += groupProb * subEnt;
            logs.push([groupProb, subEnt]);
        }
        let noiseGroup = [];
        for (let i = BIN_SIZE - 1; i < entries.length; i++) {
            noiseGroup.push(...entries[i][1]);
        }
        if (noiseGroup.length > 0) {
            let groupProb = noiseGroup.length / dataSource.length;
            const subEnt = meaImp(noiseGroup, mea, _min, _max);
            condEnt += groupProb * subEnt;
        }
        // for (let [groupKey, groupRows] of groups.entries()) {
        //     let groupProb = groupRows.length / dataSource.length;
        //     const subEnt = meaImp(groupRows, mea, _min, _max);
        //     condEnt += groupProb * subEnt;
        //     logs.push([groupProb, subEnt])
        // }
        // console.log(logs)
        // console.log('H(X), H(X|Y)]]]]]]', ent, condEnt)
        totalEntLoss += noiseGroup.length > 0 ? (ent - condEnt) / Math.log2(BIN_SIZE) : (ent - condEnt) / Math.log2(groups.size);
    }
    // const groupFL: number[] = [];
    // for (let rows of groups.values()) {
    //     groupFL.push(rows.length);
    // }
    // totalEntLoss = totalEntLoss / Math.log2(groups.size)//groups.size;
    // console.log({ dimensions, measures, score: totalEntLoss / measures.length, totalEntLoss })
    return totalEntLoss / measures.length;
}
