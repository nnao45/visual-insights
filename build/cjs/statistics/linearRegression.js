export class oneDLinearRegression {
    constructor(dataSource, X, Y) {
        this.dataSource = dataSource;
        this.X = X;
        this.Y = Y;
        this.normalizedDataSource = dataSource;
    }
    normalizeDimensions(dimensions) {
        this.normalizedDataSource = [];
        this.valueSets = [];
        dimensions.forEach(() => {
            this.valueSets.push(new Map());
        });
        this.dataSource.forEach(record => {
            dimensions.forEach((dim, index) => {
                let value = (record[dim] || 'others').toString();
                if (!this.valueSets[index].has(value)) {
                    this.valueSets[index].set(value, this.valueSets[index].size);
                }
            });
        });
        this.dataSource.forEach(record => {
            let normalizedRecord = this.normalizeRecord(record, dimensions);
            this.normalizedDataSource.push(normalizedRecord);
        });
        return this.normalizedDataSource;
    }
    normalizeRecord(record, dimensions) {
        let normalizedRecord = {};
        Object.keys(record).forEach(mea => {
            normalizedRecord[mea] = record[mea];
        });
        dimensions.forEach((dim, index) => {
            let value = (record[dim] || 'others').toString();
            normalizedRecord[dim] = this.valueSets[index].get(value);
        });
        return normalizedRecord;
    }
    mean() {
        let meanX = 0;
        let meanY = 0;
        if (this.normalizedDataSource.length === 0)
            return [meanX, meanY];
        this.normalizedDataSource.forEach((record, index) => {
            meanX += record[this.X];
            meanY += record[this.Y];
        });
        meanX /= this.normalizedDataSource.length;
        meanY /= this.normalizedDataSource.length;
        return [meanX, meanY];
    }
    getRegressionEquation() {
        if (this.normalizedDataSource.length === 0)
            return [0, 0];
        const [meanX, meanY] = this.mean();
        let beta = 0;
        let alpha = 0;
        let numerator = 0;
        let denominator = 0;
        this.normalizedDataSource.forEach(record => {
            numerator += (record[this.X] - meanX) * (record[this.Y] - meanY);
            denominator += Math.pow((record[this.X] - meanX), 2);
        });
        beta = numerator / denominator;
        alpha = meanY - meanX * beta;
        return [alpha, beta];
    }
    r_squared() {
        const [, meanY] = this.mean();
        const [alpha, beta] = this.getRegressionEquation();
        let SSR = 0;
        let SST = 0;
        this.normalizedDataSource.forEach(record => {
            let x = record[this.X];
            let y = record[this.Y];
            let yHat = x * beta + alpha;
            SSR += Math.pow((yHat - meanY), 2);
            SST += Math.pow((y - meanY), 2);
        });
        return SSR / SST;
    }
    cumulativeLogisticDistribution(x) {
        const lambda = 2;
        const mu = 0.2;
        return 1 / (1 + Math.pow(Math.E, -(x - mu) / lambda));
    }
    pValue() {
        const [, beta] = this.getRegressionEquation();
        const value = this.cumulativeLogisticDistribution(Math.abs(beta));
        if (value > 0.5) {
            return 2 * (1 - value);
        }
        else {
            return 2 * value;
        }
    }
    significance() {
        let r_squared = this.r_squared();
        let p_value = this.pValue();
        return r_squared * (1 - p_value);
    }
}
