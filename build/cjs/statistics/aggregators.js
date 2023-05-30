import { DEFAULT_BIN_NUM } from '../constant';
/**
 * 只针对 stdAggregateFromCuboid 设计的写法，其他地方不要使用，不具备通用型。
 * @param rows
 * @param colKey
 * @param opKey
 * @returns
 */
export function sumByCol(rows, colKey, opKey) {
    let _sum = 0;
    for (let i = 0; i < rows.length; i++) {
        _sum += rows[i].stat[colKey][opKey];
    }
    return _sum;
}
// for cases when all values are same
function fixRange(originalRange) {
    if (originalRange[0] === originalRange[1]) {
        return [originalRange[0], originalRange[1] + 0.1];
    }
    return originalRange;
}
export const dist = function (values, originalRange) {
    const range = fixRange(originalRange);
    const step = (range[1] - range[0]) / DEFAULT_BIN_NUM;
    const bins = new Array(DEFAULT_BIN_NUM + 1).fill(0);
    for (let value of values) {
        const vIndex = Math.floor((value - range[0]) / step);
        bins[vIndex]++;
    }
    bins[DEFAULT_BIN_NUM - 1] += bins[DEFAULT_BIN_NUM];
    return bins.slice(0, -1);
};
export function distMergeBy(rows, colKey, opKey) {
    const bins = new Array(DEFAULT_BIN_NUM).fill(0);
    for (let i = 0; i < rows.length; i++) {
        const recordBins = rows[i].stat[colKey][opKey];
        for (let j = 0; j < bins.length; j++) {
            bins[j] += recordBins[j];
        }
    }
    return bins;
}
export function sum(nums) {
    let s = 0;
    for (let i = 0; i < nums.length; i++) {
        s += nums[i];
    }
    return s;
}
export function mean(nums) {
    return sum(nums) / nums.length;
}
export function max(nums) {
    let ans = -Infinity;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > ans) {
            ans = nums[i];
        }
    }
    return ans;
}
export function min(nums) {
    let ans = Infinity;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] < ans) {
            ans = nums[i];
        }
    }
    return ans;
}
