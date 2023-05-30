"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniformSampling = exports.reservoirSampling = void 0;
/**
 * todo reservoir sampling is better to support stream data
 * Algorithm R:
 * Vitter, Jeffrey S. (1 March 1985). "Random sampling with a reservoir" (PDF). ACM Transactions on Mathematical Software. 11 (1): 37–57. CiteSeerX 10.1.1.138.784. doi:10.1145/3147.3165.
 */
function reservoirSampling(dataSource, size) {
    if (size === void 0) { size = 500; }
    if (dataSource.length <= size)
        return dataSource;
    var sampleSpace = dataSource.slice(0, size);
    var len = dataSource.length;
    for (var i = size + 1; i < len; i++) {
        var pos = Math.round(Math.random() * i);
        if (pos < size) {
            sampleSpace[pos] = dataSource[i];
        }
    }
    return sampleSpace;
}
exports.reservoirSampling = reservoirSampling;
function linearCongruentialGenerator(size, seed) {
    if (size === 0)
        return [];
    var m = 2147483647;
    var a = 1103515245;
    var c = 12345;
    var ans = [seed];
    for (var i = 1; i < size; i++) {
        ans.push(((ans[i - 1] * a + c) % m));
    }
    return ans.map(function (v) { return v / m; });
}
function uniformSampling(dataSource, size) {
    var sampleIndexes = linearCongruentialGenerator(size, Math.random() * 2147483647);
    var ans = [];
    for (var i = 0; i < size; i++) {
        var index = Math.floor(sampleIndexes[i] * size) % size;
        ans.push(dataSource[index]);
    }
    return ans;
}
exports.uniformSampling = uniformSampling;
