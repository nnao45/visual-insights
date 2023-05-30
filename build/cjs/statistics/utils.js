export function linearMapPositive(arr) {
    let min = Math.min(...arr);
    return arr.map(a => a - min + 1);
}
export function mapPositive(arr) {
    return arr.map(a => Math.abs(a)).filter(a => a !== 0);
}
export function getCombination(elements, start = 1, end = elements.length) {
    let ans = [];
    const combine = (step, set, size) => {
        if (set.length === size) {
            ans.push([...set]);
            return;
        }
        if (step >= elements.length) {
            return;
        }
        combine(step + 1, [...set, elements[step]], size);
        combine(step + 1, set, size);
    };
    for (let i = start; i <= end; i++) {
        combine(0, [], i);
    }
    return ans;
}
export function normalize(frequencyList) {
    let sum = 0;
    for (let f of frequencyList) {
        sum += f;
    }
    return frequencyList.map(f => f / sum);
}
export const entropy = (probabilityList) => {
    let sum = 0;
    for (let p of probabilityList) {
        sum += p * Math.log2(p);
    }
    return -sum;
};
export const gini = (probabilityList) => {
    let sum = 0;
    for (let p of probabilityList) {
        sum += p * (1 - p);
    }
    return sum;
};
export function getRangeBy(dataSource, by) {
    let maxValue = -Infinity;
    let minValue = Infinity;
    for (let row of dataSource) {
        maxValue = Math.max(row[by], maxValue);
        minValue = Math.min(row[by], minValue);
    }
    return [minValue, maxValue];
}
