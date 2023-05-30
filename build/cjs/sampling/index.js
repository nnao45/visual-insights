/**
 * todo reservoir sampling is better to support stream data
 * Algorithm R:
 * Vitter, Jeffrey S. (1 March 1985). "Random sampling with a reservoir" (PDF). ACM Transactions on Mathematical Software. 11 (1): 37–57. CiteSeerX 10.1.1.138.784. doi:10.1145/3147.3165.
 */
export function reservoirSampling(dataSource, size = 500) {
    if (dataSource.length <= size)
        return dataSource;
    let sampleSpace = dataSource.slice(0, size);
    let len = dataSource.length;
    for (let i = size + 1; i < len; i++) {
        let pos = Math.round(Math.random() * i);
        if (pos < size) {
            sampleSpace[pos] = dataSource[i];
        }
    }
    return sampleSpace;
}
function linearCongruentialGenerator(size, seed) {
    if (size === 0)
        return [];
    const m = 2147483647;
    const a = 1103515245;
    const c = 12345;
    let ans = [seed];
    for (let i = 1; i < size; i++) {
        ans.push(((ans[i - 1] * a + c) % m));
    }
    return ans.map(v => v / m);
}
export function uniformSampling(dataSource, size) {
    let sampleIndexes = linearCongruentialGenerator(size, Math.random() * 2147483647);
    let ans = [];
    for (let i = 0; i < size; i++) {
        let index = Math.floor(sampleIndexes[i] * size) % size;
        ans.push(dataSource[index]);
    }
    return ans;
}
