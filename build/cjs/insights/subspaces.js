import { cramersV, getCombination, pearsonCC } from '../statistics/index';
import { CramersVThreshold, PearsonCorrelation } from './config';
import { Cluster } from '../ml/index';
import { CHANNEL } from '../constant';
// insights like outlier and trend both request high impurity of dimension.
export function getDimCorrelationMatrix(dataSource, dimensions) {
    let matrix = dimensions.map(d => dimensions.map(d => 0));
    for (let i = 0; i < dimensions.length; i++) {
        matrix[i][i] = 1;
        for (let j = i + 1; j < dimensions.length; j++) {
            matrix[i][j] = matrix[j][i] = cramersV(dataSource, dimensions[i], dimensions[j]);
        }
    }
    return matrix;
}
export function getMeaCorrelationMatrix(dataSource, measures) {
    let matrix = measures.map(i => measures.map(j => 0));
    for (let i = 0; i < measures.length; i++) {
        matrix[i][i] = 1;
        for (let j = i + 1; j < measures.length; j++) {
            let r = pearsonCC(dataSource, measures[i], measures[j]);
            matrix[j][i] = matrix[i][j] = r;
        }
    }
    return matrix;
}
export function getDimClusterGroups(dataSource, dimensions, threshold = CramersVThreshold, max_number_of_group) {
    const maxDimNumberInView = 4;
    let dimCorrelationMatrix = getDimCorrelationMatrix(dataSource, dimensions);
    // groupMaxSize here means group number.
    let groups = Cluster.kruskal({
        matrix: dimCorrelationMatrix,
        measures: dimensions,
        groupMaxSize: max_number_of_group ? max_number_of_group : Math.round(dimensions.length / maxDimNumberInView),
        threshold,
    });
    return groups;
}
export function getDimSetsBasedOnClusterGroups(dataSource, dimensions, correlation_threshold, max_dimensions_in_space) {
    let dimSets = [];
    let groups = getDimClusterGroups(dataSource, dimensions, correlation_threshold);
    for (let group of groups) {
        let combineDimSet = getCombination(group, 1, max_dimensions_in_space ? max_dimensions_in_space : CHANNEL.maxDimensionNumber);
        dimSets.push(...combineDimSet);
    }
    return dimSets;
}
/**
 *
 * @param dataSource
 * @param measures
 * @param correlation_threshold a threshold of correlation used to define min correlation value in a cluster of measure.
 * @param max_measure_in_view
 */
export function getMeaSetsBasedOnClusterGroups(dataSource, measures, correlation_threshold, max_number_of_group = 3) {
    const soft_max_measures_in_view = 3;
    let correlationMatrix = getMeaCorrelationMatrix(dataSource, measures);
    let groups = Cluster.kruskal({
        matrix: correlationMatrix,
        measures: measures,
        groupMaxSize: max_number_of_group ? max_number_of_group : Math.round(measures.length / soft_max_measures_in_view),
        threshold: correlation_threshold ? correlation_threshold : PearsonCorrelation.strong
    });
    return groups;
}
export function subspaceSearching(dataSource, dimensions, should_dimensions_correlated = true) {
    if (should_dimensions_correlated) {
        return getDimSetsBasedOnClusterGroups(dataSource, dimensions);
    }
    else {
        return getCombination(dimensions);
    }
}
export function getRelatedVertices(adjMatrix, vertices, verticesInGraph, topK) {
    let verStatus = vertices.map(v => verticesInGraph.includes(v));
    let edges = [];
    let ans = [];
    for (let i = 0; i < adjMatrix.length; i++) {
        // if vertex in graph, then check all the edges from this vertex
        if (verStatus[i]) {
            for (let j = 0; j < adjMatrix[i].length; j++) {
                if (!verStatus[j]) {
                    edges.push([adjMatrix[i][j], [i, j]]);
                }
            }
        }
    }
    edges.sort((a, b) => {
        return b[0] - a[0];
    });
    for (let i = 0; i < edges.length; i++) {
        let targetVertexIndex = edges[i][1][1];
        if (!verStatus[targetVertexIndex]) {
            verStatus[targetVertexIndex] = true;
            ans.push({
                field: vertices[targetVertexIndex],
                corValue: edges[i][0]
            });
        }
    }
    return ans.slice(0, topK ? topK : ans.length);
}
