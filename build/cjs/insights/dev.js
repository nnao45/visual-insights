var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DefaultIWorker } from "../commonTypes";
import { getMeaSetsBasedOnClusterGroups, getDimClusterGroups } from './subspaces';
import { CramersVThreshold, PearsonCorrelation } from './config';
import { Outier } from '../ml/index';
import { getCombination, mapPositive, stdAggregate } from '../statistics/index';
import { CHANNEL } from '../constant';
import { entropy, normalize } from '../statistics/index';
import { oneDLinearRegression } from '../statistics/index';
import { GroupIntention } from "./intention/groups";
const SPLITER = '=;=';
function crossGroups(dimensionGroups, measureGroups) {
    let viewSpaces = [];
    for (let dimensions of dimensionGroups) {
        for (let measures of measureGroups) {
            viewSpaces.push({
                dimensions,
                measures
            });
        }
    }
    return viewSpaces;
}
function getDimSetsFromClusterGroups(groups) {
    let dimSets = [];
    for (let group of groups) {
        let combineDimSet = getCombination(group, 1, CHANNEL.maxDimensionNumber);
        dimSets.push(...combineDimSet);
    }
    return dimSets;
}
function getCombinationFromClusterGroups(groups, limitSize = CHANNEL.maxDimensionNumber) {
    let fieldSets = [];
    for (let group of groups) {
        let combineFieldSet = getCombination(group, 1, limitSize);
        fieldSets.push(...combineFieldSet);
    }
    return fieldSets;
}
export const getGeneralIntentionSpace = function (aggData, dimensions, measures) {
    return __awaiter(this, void 0, void 0, function* () {
        let score = 0;
        let significance = 0;
        for (let mea of measures) {
            let fL = aggData.map(r => r[mea]);
            let pL = normalize(mapPositive(fL));
            let value = entropy(pL);
            score += value;
            significance += value / Math.log2(fL.length);
        }
        score /= measures.length;
        significance /= measures.length;
        significance = 1 - significance;
        return {
            dimensions,
            measures,
            type: 'default_general',
            score,
            impurity: score,
            significance,
            order: 'asc'
        };
    });
};
export const getOutlierIntentionSpace = function getOutlierIntentionSpace(aggData, dimensions, measures) {
    return __awaiter(this, void 0, void 0, function* () {
        let iForest = new Outier.IsolationForest([], measures, aggData);
        iForest.buildIsolationForest();
        let scoreList = iForest.estimateOutierScore();
        let maxIndex = 0;
        let score = 0;
        for (let i = 0; i < scoreList.length; i++) {
            if (scoreList[i] > score) {
                score = scoreList[i];
                maxIndex = i;
            }
        }
        let des = {};
        dimensions.concat(measures).forEach(mea => { des[mea] = aggData[maxIndex][mea]; });
        return {
            dimensions,
            measures,
            score,
            significance: score,
            order: 'desc',
            description: des
        };
    });
};
export const getTrendIntentionSpace = function (aggData, dimensions, measures) {
    return __awaiter(this, void 0, void 0, function* () {
        if (dimensions.length !== 1)
            return null;
        let orderedData = [...aggData];
        orderedData.sort((a, b) => {
            if (a[dimensions[0]] > b[dimensions[0]])
                return 1;
            if (a[dimensions[0]] === b[dimensions[0]])
                return 0;
            if (a[dimensions[0]] < b[dimensions[0]])
                return -1;
        });
        let score = 0;
        for (let mea of measures) {
            let linearModel = new oneDLinearRegression(orderedData, dimensions[0], mea);
            linearModel.normalizeDimensions(dimensions);
            score += linearModel.significance();
        }
        score /= measures.length;
        return {
            dimensions,
            measures,
            score,
            significance: score,
            order: 'desc'
        };
    });
};
export const getGroupIntentionSpace = function (aggData, dimensions, measures) {
    return __awaiter(this, void 0, void 0, function* () {
        if (dimensions.length < 2)
            return null;
        let score = 0;
        let groupIntention = new GroupIntention({
            dataSource: aggData,
            dimensions,
            measures,
            K: 8
        });
        score = groupIntention.getSignificance(measures.concat(dimensions.slice(0, -1)), dimensions.slice(-1));
        return {
            dimensions,
            measures,
            score,
            significance: score,
            order: 'desc'
        };
    });
};
// export const IntentionWorkerCollection: Map<string, IntentionWorker> = new Map();
export class IntentionWorkerCollection {
    constructor() {
        this.workers = new Map();
    }
    register(name, iWorker) {
        if (this.workers.has(name)) {
            throw new Error(`There has been a worker named: ${name} already.`);
        }
        else {
            this.workers.set(name, [true, iWorker]);
        }
    }
    enable(name, status) {
        if (!this.workers.has(name)) {
            throw new Error(`Intention Worker "${name}" does not exist.`);
        }
        else {
            let iWorkerWithStatus = this.workers.get(name);
            iWorkerWithStatus[0] = status;
            this.workers.set(name, iWorkerWithStatus);
        }
    }
    each(func) {
        for (let [name, iWorker] of this.workers) {
            if (iWorker[0]) {
                func(iWorker[1], name);
            }
        }
    }
    static init(props = { withDefaultIWorkers: true }) {
        const { withDefaultIWorkers = true } = props;
        if (!IntentionWorkerCollection.colletion) {
            IntentionWorkerCollection.colletion = new IntentionWorkerCollection();
            if (withDefaultIWorkers) {
                IntentionWorkerCollection.colletion.register(DefaultIWorker.outlier, getOutlierIntentionSpace);
                IntentionWorkerCollection.colletion.register(DefaultIWorker.cluster, getGroupIntentionSpace);
                IntentionWorkerCollection.colletion.register(DefaultIWorker.trend, getTrendIntentionSpace);
            }
        }
        for (let key in DefaultIWorker) {
            IntentionWorkerCollection.colletion.enable(DefaultIWorker[key], withDefaultIWorkers);
        }
        return IntentionWorkerCollection.colletion;
    }
}
export function getIntentionSpaces(cubePool, viewSpaces, Collection) {
    return __awaiter(this, void 0, void 0, function* () {
        let ansSpace = [];
        for (let space of viewSpaces) {
            const { dimensions, measures } = space;
            let key = dimensions.join(SPLITER);
            if (cubePool.has(key)) {
                let aggData = cubePool.get(key);
                let generalSpace = yield getGeneralIntentionSpace(aggData, dimensions, measures);
                Collection.each((iWorker, name) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        let iSpace = yield iWorker(aggData, dimensions, measures);
                        if (iSpace !== null) {
                            iSpace.type = name;
                            iSpace.impurity = generalSpace.impurity;
                            ansSpace.push(iSpace);
                        }
                    }
                    catch (error) {
                        console.error('worker failed', { dimensions, measures, aggData }, error);
                    }
                }));
            }
        }
        return ansSpace;
    });
}
export function getVisSpaces(props) {
    return __awaiter(this, void 0, void 0, function* () {
        const { dataSource, dimensions, measures, collection, dimension_correlation_threshold = CramersVThreshold, measure_correlation_threshold = PearsonCorrelation.strong, max_dimension_num_in_view = 3, max_measure_num_in_view = 3, } = props;
        // 1. get dimension cluster groups.
        // 2. get measure cluster groups.
        // 3. get dimension groups * measure groups = subspaces + aggregate
        // 4. calculate each subspace intention score (entropy, outlier, trend for temporal & oridinal field)
        // 5. filter each intend subspaces with threadshold
        // 6.manage those spaces / order them.
        let visableDimensions = dimensions; //.filter(dim => !isFieldUnique(dataSource, dim));
        let dimensionGroups = getDimClusterGroups(dataSource, visableDimensions, dimension_correlation_threshold);
        // let dimensionSets = getDimSetsFromClusterGroups(dimensionGroups);
        let dimensionSets = getCombinationFromClusterGroups(dimensionGroups, max_dimension_num_in_view);
        let measureGroups = getMeaSetsBasedOnClusterGroups(dataSource, measures, measure_correlation_threshold);
        let measureSets = getCombinationFromClusterGroups(measureGroups, max_measure_num_in_view);
        let viewSpaces = crossGroups(dimensionSets, measureSets);
        let cubePool = new Map();
        // for (let group of dimensionGroups) {
        // todo: similar cuboids computation using cube-core
        let t0 = new Date().getTime();
        for (let group of dimensionSets) {
            let key = group.join(SPLITER);
            let aggData = stdAggregate({
                dimensions: group,
                measures,
                dataSource,
                ops: measures.map(m => 'sum')
            });
            cubePool.set(key, aggData);
        }
        let t1 = new Date().getTime();
        console.log('cube cost', t1 - t0);
        cubePool.set('*', dataSource);
        const usedCollection = collection || IntentionWorkerCollection.init();
        ;
        // usedCollection.enable(DefaultIWorker.cluster, false);
        let ansSpace = yield getIntentionSpaces(cubePool, viewSpaces, usedCollection);
        return ansSpace;
    });
}
