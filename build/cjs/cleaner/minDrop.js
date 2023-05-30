export function emptyCount(dataSource, colKeys) {
    // const counter: Map<string, number> = new Map();
    let counter = colKeys.map(() => 0);
    for (let i = 0; i < dataSource.length; i++) {
        // dataSource[i][col] = 
        for (let j = 0; j < colKeys.length; j++) {
            const col = colKeys[j];
            if (dataSource[i][col] === null || dataSource[i][col] === undefined || dataSource[i][col] === '') {
                counter[j]++;
            }
        }
    }
    return counter;
}
/**
 *
 * @param dataSource
 * @returns indices of sparse column(with lots of null value)
 */
export function detectSparseColumn(dataSource, colKeys, SPARE_THRESHOLD = 0.5) {
    const nullCounts = emptyCount(dataSource, colKeys);
    const sparseColIndices = [];
    for (let i = 0; i < nullCounts.length; i++) {
        if (nullCounts[i] / dataSource.length < SPARE_THRESHOLD) {
            sparseColIndices.push(i);
        }
    }
    return sparseColIndices;
}
/**
 * 1. drop掉&
 */
export function minDrop(dataSource, colKeys) {
    const sparseIndices = detectSparseColumn(dataSource, colKeys);
    const newData = [];
    // TODO: 改成双下表O(n)的写法。
    // 但这里只是非最高次项。理论上非极端场景不用优化。不过优化了会比较低碳，为地球做贡献。
    const newColKeys = colKeys.filter((c, ci) => !sparseIndices.includes(ci));
    for (let i = 0; i < dataSource.length; i++) {
        const row = {};
        for (let j = 0; j < newColKeys.length; j++) {
            row[newColKeys[j]] = dataSource[i][newColKeys[j]];
        }
    }
    return newData;
}
