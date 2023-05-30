const DIM_CARDINALITY = 8;
const DIM_PREFIX = "dim";
const MEA_PREFIX = "mea";
export function mockDataSet(size = 10000, dimNum = 4, meaNum = 6) {
    const data = [];
    const dimensions = [];
    const measures = [];
    for (let j = 0; j < dimNum; j++) {
        const dimKey = `${DIM_PREFIX}_${j}`;
        dimensions.push(dimKey);
    }
    for (let j = 0; j < meaNum; j++) {
        const meaKey = `${MEA_PREFIX}_${j}`;
        measures.push(meaKey);
    }
    for (let i = 0; i < size; i++) {
        let row = {};
        for (let dimKey of dimensions) {
            row[dimKey] = `${dimKey}_${Math.floor(Math.random() * DIM_CARDINALITY)}`;
        }
        for (let meaKey of measures) {
            row[meaKey] = Math.random() * 100;
        }
        data.push(row);
    }
    return {
        dataSource: data,
        dimensions,
        measures,
    };
}
