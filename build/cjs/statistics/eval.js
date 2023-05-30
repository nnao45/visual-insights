import { entropy } from "./utils";
export function firstWDis(p1, p2) {
}
export function l1Dis(p1, p2) {
    // for (let i )
    let ans = 0;
    const safeLen = Math.min(p1.length, p2.length);
    for (let i = 0; i < safeLen; i++) {
        ans += Math.abs(p1[i] - p2[i]);
    }
    return ans / 2;
}
export function l1Dis2(p1, p2) {
    let total = 0;
    for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p1[i].length; j++) {
            total += Math.abs(p1[i][j] - p2[i][j]);
        }
    }
    return total / 2;
}
export function l2Dis2(p1, p2) {
    let total = 0;
    for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p1[i].length; j++) {
            total += Math.pow((p1[i][j] - p2[i][j]), 2);
        }
    }
    return total / 2;
}
export function w2dis() {
}
const BIN_SIZE = 16;
export function bin(nums) {
    let _max = Math.max(...nums);
    let _min = Math.min(...nums);
    let step = (_max - _min) / BIN_SIZE;
    // for (let i = 0; i < nums)
    let dist = new Array(BIN_SIZE + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
        let numIndex = Math.floor((nums[i] - _min) / step);
        dist[numIndex % (BIN_SIZE + 1)]++;
    }
    dist[BIN_SIZE - 1] += dist[BIN_SIZE];
    return dist.slice(0, BIN_SIZE);
}
export function binShareRange(nums, _min, _max) {
    let step = (_max - _min) / BIN_SIZE;
    // for (let i = 0; i < nums)
    let dist = new Array(BIN_SIZE + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
        let numIndex = Math.floor((nums[i] - _min) / step);
        dist[numIndex % (BIN_SIZE + 1)]++;
    }
    dist[BIN_SIZE - 1] += dist[BIN_SIZE];
    return dist.slice(0, BIN_SIZE);
}
export function binMap(nums) {
    let _max = Math.max(...nums);
    let _min = Math.min(...nums);
    let step = (_max - _min) / BIN_SIZE;
    let ans = [];
    for (let i = 0; i < nums.length; i++) {
        let numIndex = Math.floor((nums[i] - _min) / step);
        if (numIndex === BIN_SIZE) {
            numIndex = BIN_SIZE - 1;
        }
        ans.push(numIndex);
    }
    return ans;
}
export function binMapShareRange(nums, _min, _max) {
    let step = (_max - _min) / BIN_SIZE;
    let ans = [];
    for (let i = 0; i < nums.length; i++) {
        let numIndex = Math.floor((nums[i] - _min) / step);
        if (numIndex === BIN_SIZE) {
            numIndex = BIN_SIZE - 1;
        }
        ans.push(numIndex);
    }
    return ans;
}
export function rangeNormilize(fl) {
    let _sum = 0;
    const pl = [];
    for (let i = 0; i < fl.length; i++) {
        _sum += fl[i];
    }
    for (let i = 0; i < fl.length; i++) {
        pl.push(fl[i] / _sum);
    }
    return pl;
}
export function mic(T, X) {
    let condH = 0;
    const _min = Math.min(...X);
    const _max = Math.max(...X);
    let H = entropy(rangeNormilize(binShareRange(X, _min, _max).filter(v => v > 0)));
    for (let i = 0; i < BIN_SIZE; i++) {
        const conditionalX = X.filter((x, ti) => T[ti] === i);
        const bins = binShareRange(conditionalX, _min, _max).filter(v => v > 0);
        const subEnt = entropy(rangeNormilize(bins));
        const px = conditionalX.length / X.length;
        condH += px * subEnt;
    }
    return (H - condH) / Math.log2(BIN_SIZE);
}
export function generalMic(T, X) {
    let condH = 0;
    const _min = Math.min(...X);
    const _max = Math.max(...X);
    let H = entropy(rangeNormilize(binShareRange(X, _min, _max).filter(v => v > 0)));
    const uniqueValueSet = new Set(T);
    const uniqueValues = [...uniqueValueSet];
    const dists = [];
    for (let i = 0; i < uniqueValues.length; i++) {
        const conditionalX = X.filter((x, ti) => T[ti] === uniqueValues[i]);
        const bins = binShareRange(conditionalX, _min, _max);
        dists.push({
            freq: conditionalX.length,
            bins
        });
    }
    dists.sort((a, b) => b.freq - a.freq);
    const noise = {
        freq: 0,
        bins: new Array(BIN_SIZE).fill(0)
    };
    for (let i = 0; i < dists.length; i++) {
        const { bins, freq } = dists[i];
        if (i < BIN_SIZE - 1) {
            const subEnt = entropy(rangeNormilize(bins.filter(v => v > 0)));
            const px = freq / X.length;
            condH += px * subEnt;
        }
        else {
            noise.freq += freq;
            for (let j = 0; j < BIN_SIZE; j++) {
                noise.bins[j] += bins[j];
            }
        }
    }
    if (noise.freq > 0) {
        const { bins, freq } = noise;
        const subEnt = entropy(rangeNormilize(bins.filter(v => v > 0)));
        const px = freq / X.length;
        condH += px * subEnt;
    }
    // for (let i = 0; i < uniqueValues.length; i++) {
    //     const conditionalX = X.filter((x, ti) => T[ti] === uniqueValues[i]);
    //     const bins = binShareRange(conditionalX, _min, _max).filter(v => v > 0);
    //     const subEnt = entropy(rangeNormilize(bins))
    //     const px = conditionalX.length / X.length;
    //     condH += px * subEnt;
    // }
    return (H - condH) / Math.log2(Math.min(BIN_SIZE, uniqueValues.length));
}
export function pureGeneralMic(T, X) {
    let condH = 0;
    const _min = Math.min(...X);
    const _max = Math.max(...X);
    let H = entropy(rangeNormilize(binShareRange(X, _min, _max).filter(v => v > 0)));
    const uniqueValueSet = new Set(T);
    const uniqueValues = [...uniqueValueSet];
    const dists = [];
    for (let i = 0; i < uniqueValues.length; i++) {
        const conditionalX = X.filter((x, ti) => T[ti] === uniqueValues[i]);
        const bins = binShareRange(conditionalX, _min, _max);
        dists.push({
            freq: conditionalX.length,
            bins
        });
    }
    for (let i = 0; i < dists.length; i++) {
        const { bins, freq } = dists[i];
        const subEnt = entropy(rangeNormilize(bins.filter(v => v > 0)));
        const px = freq / X.length;
        condH += px * subEnt;
    }
    // for (let i = 0; i < uniqueValues.length; i++) {
    //     const conditionalX = X.filter((x, ti) => T[ti] === uniqueValues[i]);
    //     const bins = binShareRange(conditionalX, _min, _max).filter(v => v > 0);
    //     const subEnt = entropy(rangeNormilize(bins))
    //     const px = conditionalX.length / X.length;
    //     condH += px * subEnt;
    // }
    return (H - condH);
}
export function pureGeneralConditionH(T, X) {
    let condH = 0;
    const _min = Math.min(...X);
    const _max = Math.max(...X);
    let H = entropy(rangeNormilize(binShareRange(X, _min, _max).filter(v => v > 0)));
    const uniqueValueSet = new Set(T);
    const uniqueValues = [...uniqueValueSet];
    const dists = [];
    for (let i = 0; i < uniqueValues.length; i++) {
        const conditionalX = X.filter((x, ti) => T[ti] === uniqueValues[i]);
        const bins = binShareRange(conditionalX, _min, _max);
        dists.push({
            freq: conditionalX.length,
            bins
        });
    }
    dists.sort((a, b) => b.freq - a.freq);
    const noise = {
        freq: 0,
        bins: new Array(BIN_SIZE).fill(0)
    };
    for (let i = 0; i < dists.length; i++) {
        const { bins, freq } = dists[i];
        if (i < BIN_SIZE - 1) {
            const subEnt = entropy(rangeNormilize(bins.filter(v => v > 0)));
            const px = freq / X.length;
            condH += px * subEnt;
        }
        else {
            noise.freq += freq;
            for (let j = 0; j < BIN_SIZE; j++) {
                noise.bins[j] += bins[j];
            }
        }
    }
    if (noise.freq > 0) {
        const { bins, freq } = noise;
        const subEnt = entropy(rangeNormilize(bins.filter(v => v > 0)));
        const px = freq / X.length;
        condH += px * subEnt;
    }
    return condH;
}
export function normalizeScatter(points) {
    let maxX = -Infinity;
    let maxY = -Infinity;
    let minX = Infinity;
    let minY = Infinity;
    for (let i = 0; i < points.length; i++) {
        maxX = Math.max(points[i][0], maxX);
        maxY = Math.max(points[i][1], maxY);
        minX = Math.min(points[i][0], minX);
        minY = Math.min(points[i][1], minY);
    }
    const stepX = (maxX - minX) / BIN_SIZE;
    const stepY = (maxY - minY) / BIN_SIZE;
    const matrix = new Array(BIN_SIZE + 1).fill(0).map(() => new Array(BIN_SIZE + 1).fill(0));
    for (let i = 0; i < points.length; i++) {
        // matrix[]
        const indexX = Math.floor((points[i][0] - minX) / stepX);
        const indexY = Math.floor((points[i][1] - minY) / stepY);
        matrix[indexX][indexY]++;
    }
    for (let i = 0; i <= BIN_SIZE; i++) {
        matrix[i][BIN_SIZE - 1] += matrix[i][BIN_SIZE];
        matrix[BIN_SIZE - 1][i] += matrix[BIN_SIZE][i];
    }
    let pbMatrix = new Array(BIN_SIZE).fill(0).map(() => new Array(BIN_SIZE).fill(0));
    for (let i = 0; i < BIN_SIZE; i++) {
        for (let j = 0; j < BIN_SIZE; j++) {
            pbMatrix[i][j] = matrix[i][j] / points.length;
        }
    }
    // console.log(pbMatrix)
    return pbMatrix;
}
export function incSim(T, pointsX, pointsY) {
    var _a, _b;
    const S = l2Dis2(normalizeScatter(pointsX), normalizeScatter(pointsY));
    let groups = new Map();
    for (let i = 0; i < T.length; i++) {
        if (!groups.has(T[i])) {
            const pair = {
                X: [],
                Y: []
            };
            groups.set(T[i], pair);
        }
        (_a = groups.get(T[i])) === null || _a === void 0 ? void 0 : _a.X.push(pointsX[i]);
        (_b = groups.get(T[i])) === null || _b === void 0 ? void 0 : _b.Y.push(pointsY[i]);
    }
    let condS = 0;
    for (let [, pair] of groups.entries()) {
        let p = pair.X.length / pointsX.length;
        if (p === 0)
            continue;
        if (pair.X.length < Math.pow(BIN_SIZE, 2)) {
            condS += p;
            continue;
        }
        // let p = 1 / groups.size
        condS += (p * l2Dis2(normalizeScatter(pair.X), normalizeScatter(pair.Y)));
    }
    return S - condS;
}
// type ITensor = Array<ITensor | number>;
// function initTensor (order: number, size = BIN_SIZE): ITensor {
//     if (order === 1) {
//         return new Array(size).fill(0);
//     }
//     const tensor: ITensor = [];
//     for (let i = 0; i < size; i++) {
//         tensor.push(initTensor(order - 1, size));
//     }
//     return tensor;
// }
export function initRanges(vals, order) {
    const ranges = [];
    for (let od = 0; od < order; od++) {
        ranges.push([
            Math.min(...vals.map(v => v[od])),
            Math.max(...vals.map(v => v[od])),
        ]);
    }
    return ranges;
}
// function TensorCellAdd (tensor: ITensor, loc: number[], addVal: number) {
// }
// function highOrderBinShareRange(vals: number[][], ranges: [number, number][]): number[][] {
//     let order = ranges.length;
//     const tensor: ITensor = initTensor(order);
//     const steps = ranges.map(r => (r[1] - r[0]) / BIN_SIZE);
//     for (let i = 0; i < vals.length; i++) {
//         for (let j = 0; j < vals[i].length; j++) {
//             // tensor
//         }
//     }
//     return []
// }
// export function highOrderGeneralMic (T: string[], measures: number[][]) {
//     if (measures.length === 0) return 0;
//     const measureNumber = measures[0].length;
//     const measureBinSize = BIN_SIZE ** measureNumber;
// }
const BIN_SIZE_FOR_MAT = BIN_SIZE / 2;
// const BIN_SIZE_FOR_MAT = BIN_SIZE;
export function matrixBinShareRange(values, ranges) {
    const binMat = new Array(BIN_SIZE_FOR_MAT + 1).fill(0).map(() => new Array(BIN_SIZE_FOR_MAT + 1).fill(0));
    const stepX = (ranges[0][1] - ranges[0][0]) / BIN_SIZE_FOR_MAT;
    const stepY = (ranges[1][1] - ranges[1][0]) / BIN_SIZE_FOR_MAT;
    for (let i = 0; i < values.length; i++) {
        const indX = Math.floor((values[i][0] - ranges[0][0]) / stepX);
        const indY = Math.floor((values[i][1] - ranges[1][0]) / stepY);
        binMat[indY][indX]++;
    }
    for (let i = 0; i < BIN_SIZE_FOR_MAT + 1; i++) {
        binMat[i][BIN_SIZE_FOR_MAT - 1] += binMat[i][BIN_SIZE_FOR_MAT];
    }
    for (let i = 0; i < BIN_SIZE_FOR_MAT; i++) {
        binMat[BIN_SIZE_FOR_MAT - 1][i] += binMat[BIN_SIZE_FOR_MAT][i];
    }
    return binMat.slice(0, BIN_SIZE_FOR_MAT).map(row => row.slice(0, BIN_SIZE_FOR_MAT));
}
export function generalMatMic(T, X) {
    let condH = 0;
    const ranges = initRanges(X, 2);
    let H = entropy(rangeNormilize(matrixBinShareRange(X, ranges).flatMap(v => v).filter(v => v > 0)));
    const uniqueValueSet = new Set(T);
    const uniqueValues = [...uniqueValueSet];
    const dists = [];
    for (let i = 0; i < uniqueValues.length; i++) {
        const conditionalX = X.filter((x, ti) => T[ti] === uniqueValues[i]);
        // const bins = binShareRange(conditionalX, _min, _max)
        const bins = matrixBinShareRange(conditionalX, ranges).flatMap(v => v);
        dists.push({
            freq: conditionalX.length,
            bins
        });
    }
    dists.sort((a, b) => b.freq - a.freq);
    const noise = {
        freq: 0,
        bins: new Array(BIN_SIZE_FOR_MAT * BIN_SIZE_FOR_MAT).fill(0)
    };
    for (let i = 0; i < dists.length; i++) {
        const { bins, freq } = dists[i];
        if (i < BIN_SIZE - 1) {
            const subEnt = entropy(rangeNormilize(bins.filter(v => v > 0)));
            const px = freq / X.length;
            condH += px * subEnt;
        }
        else {
            noise.freq += freq;
            for (let j = 0; j < BIN_SIZE_FOR_MAT * BIN_SIZE_FOR_MAT; j++) {
                noise.bins[j] += bins[j];
            }
        }
    }
    if (noise.freq > 0) {
        const { bins, freq } = noise;
        const subEnt = entropy(rangeNormilize(bins.filter(v => v > 0)));
        const px = freq / X.length;
        condH += px * subEnt;
    }
    return (H - condH) / Math.log2(uniqueValues.length);
}
