import { entropy, normalize, stdAggregate } from '../statistics/index';
import { cramersV, getCombination, pearsonCC, mapPositive } from '../statistics/index';
import { CramersVThreshold } from './config';
import { Cluster } from '../ml/index';
import { CHANNEL } from '../constant';
// insights like outlier and trend both request high impurity of dimension.
function getDimCorrelationMatrix(dataSource, dimensions) {
    let matrix = dimensions.map(d => dimensions.map(d => 0));
    for (let i = 0; i < dimensions.length; i++) {
        matrix[i][i] = 1;
        for (let j = i + 1; j < dimensions.length; j++) {
            matrix[i][j] = matrix[j][i] = cramersV(dataSource, dimensions[i], dimensions[j]);
        }
    }
    return matrix;
}
export function getDimSetsBasedOnClusterGroups(dataSource, dimensions) {
    const maxDimNumberInView = 4;
    let dimSets = [];
    let dimCorrelationMatrix = getDimCorrelationMatrix(dataSource, dimensions);
    // groupMaxSize here means group number.
    let groups = Cluster.kruskal({
        matrix: dimCorrelationMatrix,
        measures: dimensions,
        groupMaxSize: Math.round(dimensions.length / maxDimNumberInView),
        threshold: CramersVThreshold
    });
    // todo: maybe a threhold would be better ?
    for (let group of groups) {
        let combineDimSet = getCombination(group, 1, CHANNEL.maxDimensionNumber);
        dimSets.push(...combineDimSet);
    }
    return dimSets;
}
export function subspaceSearching(dataSource, dimensions, shouldDimensionsCorrelated = true) {
    if (shouldDimensionsCorrelated) {
        return getDimSetsBasedOnClusterGroups(dataSource, dimensions);
    }
    else {
        return getCombination(dimensions);
    }
}
export function insightExtraction(dataSource, dimensions, measures, operator = 'sum') {
    let impurityList = [];
    let dimSet = subspaceSearching(dataSource, dimensions, true);
    for (let dset of dimSet) {
        let impurity = {};
        const aggData = stdAggregate({
            dimensions,
            measures,
            dataSource,
            ops: measures.map(m => operator || 'sum')
        });
        // let fList = aggData.map(r => r)
        for (let mea of measures) {
            // fl = frequency list, pL = probability list
            let fL = aggData.map(r => r[mea]);
            let pL = normalize(mapPositive(fL));
            let value = entropy(pL);
            impurity[mea] = value;
        }
        let correlationMatrix = measures.map(i => measures.map(j => 0));
        for (let i = 0; i < measures.length; i++) {
            correlationMatrix[i][i] = 1;
            for (let j = i + 1; j < measures.length; j++) {
                let r = pearsonCC(aggData, measures[i], measures[j]);
                correlationMatrix[j][i] = correlationMatrix[i][j] = r;
            }
        }
        impurityList.push([dset, impurity, correlationMatrix]);
    }
    return impurityList;
}
// interface InsightSpace {
//   dimensions: string[];
//   type: 'entropy' | 'trend' | 'outlier';
//   order: 'desc' | 'asc';
//   score: {
//     [meaName: string]: number;
//   };
//   correlationMatrix: number[][];
// }
// export function multiInsightExtraction(dataSource: DataSource, dimensions: string[], measures: string[]): InsightSpace[] {
//   let impurityList: FieldsFeature[] = [];
//   let dimSet = subspaceSearching(dataSource, dimensions, true);
//   let correlationMatrix = measures.map(i => measures.map(j => 0));
//   for (let i = 0; i < measures.length; i++) {
//     correlationMatrix[i][i] = 1;
//     for (let j = i + 1; j < measures.length; j++) {
//       let r = pearsonCC(dataSource, measures[i], measures[j]);
//       correlationMatrix[j][i] = correlationMatrix[i][j] = r;
//     }
//   }
//   for (let dset of dimSet) {
//     let impurity = {};
//     let trend = {};
//     let outlier = {};
//     let aggData = aggregate({
//       dataSource,
//       dimensions: dset,
//       measures,
//       asFields: measures,
//       operator: operator || 'sum'//: operator as 
//     });
//     // let fList = aggData.map(r => r)
//     for (let mea of measures) {
//       // fl = frequency list, pL = probability list
//       let fL = aggData.map(r => r[mea]);
//       let pL = normalize(linearMapPositive(fL));
//       let value = entropy(pL);
//       impurity[mea] = value;
//     }
//     for (let mea of measures) {
//     }
//     impurityList.push([dset, impurity, correlationMatrix]);
//   }
//   return impurityList
// }
