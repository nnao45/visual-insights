import { Cluster } from "../ml/index";
import { normalize, entropy, stdAggregate } from "../statistics/index";
import { cramersV, pearsonCC, mapPositive } from '../statistics/index';
import { CramersVThreshold, PearsonCorrelation } from '../insights/config';
export function getEntropyMatrix(dimensionsList, measures, dataSource, operator) {
    let matrix = [];
    for (let i = 0; i < dimensionsList.length; i++) {
        let dimensions = dimensionsList[i];
        matrix.push([]);
        const aggData = stdAggregate({
            dimensions,
            measures,
            dataSource,
            ops: measures.map(m => operator || 'sum')
        });
        for (let mea of measures) {
            let fL = aggData.map(r => r[mea]);
            let pL = normalize(mapPositive(fL));
            let value = entropy(pL);
            matrix[i].push(value);
        }
    }
    return matrix;
}
export function getDashBoardSubspace(dataSource, dimensions, measures, fieldFeatureList) {
    let correlationMatrix = measures.map(i => measures.map(j => 0));
    for (let i = 0; i < measures.length; i++) {
        correlationMatrix[i][i] = 1;
        for (let j = i + 1; j < measures.length; j++) {
            let r = pearsonCC(dataSource, measures[i], measures[j]);
            correlationMatrix[j][i] = correlationMatrix[i][j] = r;
        }
    }
    const measureGroups = Cluster.kruskal({
        matrix: correlationMatrix,
        measures,
        groupMaxSize: Math.round(measures.length / 6),
        threshold: PearsonCorrelation.weak
    });
    const dimCorrelationMatrix = dimensions.map(d => dimensions.map(d => 0));
    for (let i = 0; i < dimensions.length; i++) {
        dimCorrelationMatrix[i][i] = 1;
        for (let j = i + 1; j < dimensions.length; j++) {
            dimCorrelationMatrix[i][j] = dimCorrelationMatrix[j][i] = cramersV(dataSource, dimensions[i], dimensions[j]);
        }
    }
    let dimensionsInDashBoardSet = new Set();
    for (let fieldFeature of fieldFeatureList) {
        for (let dim of fieldFeature[0]) {
            dimensionsInDashBoardSet.add(dim);
        }
    }
    let dimensionsInDashBoard = [...dimensionsInDashBoardSet];
    const dashBoardSpaces = [];
    for (let group of measureGroups) {
        let matrix = group.map(g => group.map(p => 0));
        for (let i = 0; i < group.length; i++) {
            let mea1Index = measures.indexOf(group[i]);
            for (let j = 0; j < group.length; j++) {
                let mea2Index = measures.indexOf(group[j]);
                matrix[i][j] = correlationMatrix[mea1Index][mea2Index];
            }
        }
        let dMatrix = dimensionsInDashBoard.map(d => dimensionsInDashBoard.map(d => 0));
        for (let i = 0; i < dimensionsInDashBoard.length; i++) {
            let dim1Index = dimensions.indexOf(dimensionsInDashBoard[i]);
            for (let j = 0; j < dimensionsInDashBoard.length; j++) {
                let dim2Index = dimensions.indexOf(dimensionsInDashBoard[j]);
                dMatrix[i][j] = dimCorrelationMatrix[dim1Index][dim2Index];
            }
        }
        dashBoardSpaces.push({
            dimensions: dimensionsInDashBoard,
            measures: group,
            correlationMatrix: matrix,
            dimensionCorrelationMatrix: dMatrix,
            entropyMatrix: getEntropyMatrix(dimensionsInDashBoard.map(dim => [dim]), group, dataSource)
        });
    }
    return dashBoardSpaces;
}
/**
 * handle how to combine dim and mea to produce a chart view in dashboard
 * @param dashBoardSpace
 *
 */
export function getDashBoardView(dashBoardSpace, dataSource) {
    const { dimensions, measures, entropyMatrix, dimensionCorrelationMatrix } = dashBoardSpace;
    /**
     * 1. get correlation view
     * 2. get impact view
     */
    const visViewList = [];
    /**
     * correlation view
     */
    const measureGroups = Cluster.kruskal({
        matrix: dashBoardSpace.correlationMatrix,
        measures: measures,
        groupMaxSize: Math.round(measures.length / 3),
        threshold: PearsonCorrelation.strong
    });
    for (let group of measureGroups) {
        const meaIndexList = group.map(mea => measures.indexOf(mea));
        let dimScoreList = dimensions.map((dim, index) => {
            let score = 0;
            for (let meaIndex of meaIndexList) {
                score += entropyMatrix[index][meaIndex];
            }
            return score;
        });
        const dimInView = dimensions[minIndex(dimScoreList)];
        visViewList.push({
            type: 'target',
            dimensions: [dimInView],
            measures: group
        });
    }
    /**
     * impact views
     * todo: protentional repeat view or very similiar view
     */
    const dimensionGroups = Cluster.kruskal({
        matrix: dimensionCorrelationMatrix,
        measures: dimensions,
        groupMaxSize: 2,
        limitSize: true,
        threshold: CramersVThreshold
    });
    const dimGroupEntropyMatrix = getEntropyMatrix(dimensionGroups, measures, dataSource);
    for (let i = 0; i < dimensionGroups.length; i++) {
        const meaInView = measures[minIndex(dimGroupEntropyMatrix[i])];
        visViewList.push({
            type: 'feature',
            dimensions: dimensionGroups[i],
            measures: [meaInView]
        });
    }
    return visViewList;
}
function minIndex(arr) {
    let i = 0;
    let len = arr.length;
    let maxValue = Infinity;
    let pos = -1;
    for (i = 0; i < len; i++) {
        if (arr[i] < maxValue) {
            maxValue = arr[i];
            pos = i;
        }
    }
    return pos;
}
export { cramersV };
