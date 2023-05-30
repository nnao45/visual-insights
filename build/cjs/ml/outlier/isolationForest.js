import { uniformSampling } from "../../sampling";
import { EULER } from "../../constant";
export class IsolationForest {
    constructor(dimensions, measures, dataSource, treeNumber = 100, Psi = 256) {
        this.dimensions = dimensions;
        this.measures = measures;
        this.dataSource = dataSource;
        if (dataSource.length < Psi) {
            this.treeNumber = Math.max(1, Math.ceil(Psi / 50));
            this.sampleSize = Math.max(2, Math.floor(dataSource.length / 2));
        }
        else {
            this.treeNumber = treeNumber;
            this.sampleSize = Psi;
        }
        this.limitHeight = Math.ceil(Math.log2(this.sampleSize));
        this.iForest = [];
        this.normalizeDimensions();
    }
    normalizeDimensions() {
        this.normalizedDataSource = [];
        this.valueSets = [];
        this.ranges = [];
        this.dimensions.forEach(() => {
            this.valueSets.push(new Map());
        });
        this.measures.forEach(() => {
            this.ranges.push([Infinity, -Infinity]);
        });
        this.dataSource.forEach(record => {
            this.dimensions.forEach((dim, index) => {
                let value = (record[dim] || 'others').toString();
                if (!this.valueSets[index].has(value)) {
                    this.valueSets[index].set(value, this.valueSets[index].size);
                }
            });
            this.measures.forEach((mea, index) => {
                let value = record[mea];
                if (typeof value === 'number') {
                    this.ranges[index][0] = Math.min(this.ranges[index][0], value);
                    this.ranges[index][1] = Math.max(this.ranges[index][1], value);
                }
            });
        });
        this.dataSource.forEach(record => {
            let normalizedRecord = this.normalizeRecord(record);
            this.normalizedDataSource.push(normalizedRecord);
        });
        return this.normalizedDataSource;
    }
    normalizeRecord(record) {
        let normalizedRecord = {};
        this.measures.forEach(mea => {
            normalizedRecord[mea] = record[mea];
        });
        this.dimensions.forEach((dim, index) => {
            let value = (record[dim] || 'others').toString();
            normalizedRecord[dim] = this.valueSets[index].get(value);
        });
        return normalizedRecord;
    }
    buildIsolationTree(normalizedSampleData, depth) {
        if (depth >= this.limitHeight || normalizedSampleData.length <= 1) {
            return null;
        }
        else {
            let rand = Math.random();
            let randField = this.measures[0] || this.dimensions[0];
            let dimLength = this.dimensions.length;
            let meaLength = this.measures.length;
            let randValue = 0;
            if (rand >= dimLength / (dimLength + meaLength)) {
                let index = Math.floor(Math.random() * meaLength) % meaLength;
                randField = this.measures[index];
                randValue = this.ranges[index][0] + (this.ranges[index][1] - this.ranges[index][0]) * Math.random();
            }
            else {
                let index = Math.floor(Math.random() * dimLength) % dimLength;
                randField = this.dimensions[index];
                randValue = Math.floor(this.valueSets[index].size * Math.random()) % this.valueSets[index].size;
            }
            // random in range not in distribution.
            // let randValue = normalizedSampleData[Math.floor(Math.random() * normalizedSampleData.length) % normalizedSampleData.length][randField];
            let leftSubData = [];
            let rightSubData = [];
            for (let record of normalizedSampleData) {
                if (record[randField] < randValue) {
                    leftSubData.push(record);
                }
                else {
                    rightSubData.push(record);
                }
            }
            let node = {
                field: randField,
                value: randValue,
                size: normalizedSampleData.length
            };
            node.left = this.buildIsolationTree(leftSubData, depth + 1);
            node.right = this.buildIsolationTree(rightSubData, depth + 1);
            return node;
        }
    }
    /**
     * average unsuccessful searches in BST (Preiss, 1999)
     * @param Psi
     */
    AFS(Psi) {
        if (Psi > 2)
            return 2 * (Math.log(Psi - 1) + EULER) - 2 * (Psi - 1) / Psi;
        if (Psi === 2)
            return 1;
        return 0;
    }
    getPathLength(record, iTree, pathLength, nodeSize) {
        if (iTree === null) {
            return pathLength + this.AFS(nodeSize);
        }
        let value = record[iTree.field];
        if (value < iTree.value) {
            return this.getPathLength(record, iTree.left, pathLength + 1, iTree.size);
        }
        else {
            return this.getPathLength(record, iTree.right, pathLength + 1, iTree.size);
        }
    }
    buildIsolationForest() {
        this.iForest = [];
        for (let i = 0; i < this.treeNumber; i++) {
            let samples = uniformSampling(this.normalizedDataSource, this.sampleSize);
            let iTree = this.buildIsolationTree(samples, 0);
            this.iForest.push(iTree);
        }
        return this.iForest;
    }
    // public evaluate (record: Record): number {
    // }
    estimateOutierScore() {
        this.recordScoreList = [];
        this.normalizedDataSource.forEach(record => {
            let recordScore = 0;
            let avgPathLength = 0;
            this.iForest.forEach(iTree => {
                avgPathLength += this.getPathLength(record, iTree, 0, this.sampleSize);
            });
            avgPathLength /= this.iForest.length;
            recordScore = Math.pow(2, -(avgPathLength / this.AFS(this.sampleSize)));
            this.recordScoreList.push(recordScore);
        });
        return this.recordScoreList;
    }
}
