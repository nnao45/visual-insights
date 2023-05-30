var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getFieldsSummary } from "./fieldSummary";
import { DataGraph } from "./dataGraph";
import { Cube } from "../cube";
import { getCombination, normalize, mapPositive, entropy } from "../statistics";
import { InsightWorkerCollection } from "./workerCollection";
import { specification } from './specification/encoding';
import { copyData } from "../utils";
import { autoFieldSelect, fieldSelectByPercent } from "./select";
import { DEFAULT_BIN_NUM, DOMMAIN_SIZE_THRESHOLD_MAYBE_DROP, VERSION } from "../constant";
import { viewStrength, entropyAcc } from "./patterns/general";
// import { SQLInterface } from "../../SQLInterface";
const MIN_QUAN_MEMBER_SIZE = 50;
export class VIEngine {
    constructor() {
        this.env = 'browser';
        // public cookedDimensions: string[];
        // public cookedMeasures: string[];
        // public cookedFields: IFieldSummary[];
        // protected cookedFieldDictonary: FieldDictonary;
        // private _fieldKeys: string[];
        this._dimensions = [];
        this._measures = [];
        this.cubeStorageName = '_cuboids';
        this.minDistEvalSampleSize = 80;
        /**
        * number of dimensions appears in a view.
        */
        this.DIMENSION_NUM_IN_VIEW = {
            MAX: 3,
            MIN: 1,
        };
        /**
        * number of measures appears in a view.
        */
        this.MEASURE_NUM_IN_VIEW = {
            MAX: 3,
            MIN: 1,
        };
        this.cube = null;
        this.aggregators = ["max", "min", "sum", "mean", "count", 'dist'];
        this.workerCollection = InsightWorkerCollection.init();
    }
    serialize() {
        const { fields, dataGraph, subSpaces, insightSpaces, dataSource, rawDataSource, cube } = this;
        const storage = {
            version: VERSION,
            fields,
            dataGraph: {
                MClusters: dataGraph.MClusters,
                DClusters: dataGraph.DClusters,
                DG: dataGraph.DG,
                MG: dataGraph.MG
            },
            subSpaces,
            insightSpaces
        };
        const dataStorage = {
            version: VERSION,
            dataSource: {
                raw: rawDataSource,
                view: dataSource
            },
            cuboids: cube.exportCuboids()
        };
        return {
            storage,
            dataStorage
        };
    }
    deSerialize(storage, dataStorage) {
        this.fields = storage.fields;
        // make fields dict
        if (typeof this.fieldDictonary !== 'undefined' && this.fieldDictonary !== null) {
            this.fieldDictonary.clear();
        }
        else {
            this.fieldDictonary = new Map();
        }
        storage.fields.forEach(f => {
            this.fieldDictonary.set(f.key, f);
        });
        const { dimensions, measures } = this;
        this.dataGraph = new DataGraph(dimensions, measures);
        // this.dat
        this.dataGraph.DG = storage.dataGraph.DG;
        this.dataGraph.MG = storage.dataGraph.MG;
        this.dataGraph.DClusters = storage.dataGraph.DClusters;
        this.dataGraph.MClusters = storage.dataGraph.MClusters;
        this.subSpaces = storage.subSpaces;
        this.insightSpaces = storage.insightSpaces;
        if (dataStorage) {
            const { aggregators } = this;
            this.rawDataSource = dataStorage.dataSource.raw;
            this.dataSource = dataStorage.dataSource.view;
            this.cube = new Cube({
                dataSource: dataStorage.dataSource.view,
                dimensions,
                measures,
                ops: aggregators
            });
            Object.keys(dataStorage.cuboids).forEach(cuboidKey => {
                this.cube.loadCuboid(cuboidKey, dataStorage.cuboids[cuboidKey]);
            });
        }
    }
    /**
     * 为了实现简单，这里加一个隐形约束，必须先setData，才能调用setFields
     *
     * @param mutFields
     */
    setFields(mutFields) {
        this._mutFields = mutFields;
        this.dataSource = copyData(this.rawDataSource);
        const fieldKeys = mutFields.map(f => f.key);
        const { fields, dictonary } = getFieldsSummary(fieldKeys, this.dataSource);
        // 用户指定优先，其次取推荐值
        this.rawFields = fields.map((f, i) => {
            const field = Object.assign({}, f);
            if (mutFields[i].dataType !== '?')
                field.dataType = mutFields[i].dataType;
            if (mutFields[i].semanticType !== '?')
                field.semanticType = mutFields[i].semanticType;
            if (mutFields[i].analyticType !== '?')
                field.analyticType = mutFields[i].analyticType;
            return field;
        });
    }
    setData(dataSource) {
        this.rawDataSource = dataSource;
        this.dataSource = copyData(dataSource);
        return this;
    }
    get dimensions() {
        // if (this._dimensions.length > 0) return this._dimensions;
        return this.fields.filter(f => f.analyticType === 'dimension').map(f => f.key);
        // return this._dimensions
    }
    get measures() {
        // if (this._measures.length > 0) return this._measures;
        return this.fields.filter(f => f.analyticType === 'measure').map(f => f.key);
        // return this._measures
    }
    buildfieldsSummary() {
        const fieldKeys = this.fields.map(f => f.key);
        const { fields, dictonary } = getFieldsSummary(fieldKeys, this.dataSource);
        this.fields = fields;
        this.fieldDictonary = dictonary;
        return this;
    }
    univarSelection(selectMode = 'auto', percent = 1) {
        const { rawFields, rawDataSource } = this;
        // 1. trans fields
        // 2. filter fields
        const cookedFieldKeys = [];
        const rawIndices = [];
        // const transedMap: Map<string, string> = new Map();
        for (let i = 0; i < rawFields.length; i++) {
            const field = rawFields[i];
            let transedField = field.key;
            if (field.analyticType === 'dimension') {
                if (field.semanticType === 'quantitative' && field.features.unique > MIN_QUAN_MEMBER_SIZE) {
                    // ISSUES [2022.03.07] https://ewgw6z7tk0.feishu.cn/wiki/wikcnnTJjRv9W0p1kae8gK8uzUf?app_id=11
                    // if (!isUniformDistribution(rawDataSource, field.key)) {
                    //     const newFieldKey = `${field.key}(group)`;
                    //     // const newFieldName = `${field.name}(group)`
                    //     this.dataSource = groupContinousField({
                    //         dataSource: rawDataSource,
                    //         field: field.key,
                    //         newField: newFieldKey,
                    //         groupNumber: DEFAULT_BIN_NUM
                    //     })
                    //     transedField = newFieldKey
                    //     // transedMap.set(newFieldKey, field.key);
                    // } 
                }
                else if (field.semanticType === 'nominal' || field.semanticType === 'ordinal') {
                    if (field.features.unique > DOMMAIN_SIZE_THRESHOLD_MAYBE_DROP && (rawDataSource.length / field.features.unique) < this.minDistEvalSampleSize) {
                        continue;
                    }
                }
            }
            rawIndices.push(i);
            cookedFieldKeys.push(transedField);
        }
        const { fields: cookedFields, dictonary: cookedFieldDictonary } = getFieldsSummary(cookedFieldKeys, this.dataSource);
        cookedFields.forEach((f, i) => {
            const rawIndex = rawIndices[i];
            f.semanticType = rawFields[rawIndex].semanticType;
            f.dataType = rawFields[rawIndex].dataType;
            f.analyticType = rawFields[rawIndex].analyticType;
        });
        this.fields = selectMode === 'auto' ? autoFieldSelect(cookedFields) : fieldSelectByPercent(cookedFields, percent);
        if (this.fields.findIndex(f => f.analyticType === 'dimension') === -1) {
            // 针对维度较差的情况做的补充。
            const dims = cookedFields.filter(f => f.analyticType === 'dimension');
            // if (dims.length === 0) {
            //     throw new Error('提供的数据集中没有维度，暂时不支持这种分析类型。')
            // }
            if (dims.length > 0) {
                dims.sort((a, b) => a.features.entropy - b.features.entropy);
                this.fields.push(dims[0]);
            }
        }
        this.fieldDictonary = cookedFieldDictonary;
    }
    buildGraph() {
        this.dataGraph = new DataGraph(this.dimensions, this.measures);
        this.dataGraph.computeDGraph(this.dataSource);
        this.dataGraph.computeMGraph(this.dataSource);
        return this;
    }
    buildCube(injectCube) {
        return __awaiter(this, void 0, void 0, function* () {
            const { measures, dataSource, dataGraph, dimensions, aggregators } = this;
            let cube = injectCube || new Cube({
                dimensions,
                measures,
                dataSource,
                ops: aggregators,
                // cubeStorageManageMode: ICubeStorageManageMode.LocalCache
            });
            yield cube.buildBaseCuboid();
            yield Promise.all(dataGraph.DClusters.map((group) => cube.buildCuboidOnCluster(group)));
            this.cube = cube;
            return this;
        });
    }
    clusterFields() {
        this.dataGraph.clusterDGraph(this.dataSource);
        this.dataGraph.clusterMGraph(this.dataSource);
        return this;
    }
    static getCombinationFromClusterGroups(groups, limitSize) {
        let fieldSets = [];
        for (let group of groups) {
            let combineFieldSet = getCombination(group, limitSize.MIN, limitSize.MAX);
            fieldSets.push(...combineFieldSet);
        }
        return fieldSets;
    }
    // 以度量为核心，找该度量在哪些维度的拆分研究下最优的问题
    // 1. 有序的拆分（推荐拆分顺序）-> 决策树
    // 2. 无序的拆分，直接求最小拆分粒度的划分效果（先做这个）
    //      + 
    buildSubspaces(DIMENSION_NUM_IN_VIEW = this.DIMENSION_NUM_IN_VIEW, MEASURE_NUM_IN_VIEW = this.MEASURE_NUM_IN_VIEW) {
        // todo: design when to compute clusters.
        const dimensionGroups = this.dataGraph.DClusters;
        const measureGroups = this.dataGraph.MClusters;
        // const dimensionSets = VIEngine.getCombinationFromClusterGroups(
        //     dimensionGroups,
        //     MAX_DIMENSION_NUM_IN_VIEW
        // );
        const measureSets = VIEngine.getCombinationFromClusterGroups(measureGroups, MEASURE_NUM_IN_VIEW);
        // const subspaces = crossGroups(dimensionSets, measureSets);
        const subspaces = [];
        for (let group of dimensionGroups) {
            const dimSets = getCombination(group, DIMENSION_NUM_IN_VIEW.MIN, DIMENSION_NUM_IN_VIEW.MAX);
            for (let dims of dimSets) {
                for (let meas of measureSets) {
                    subspaces.push({
                        dimensions: dims,
                        measures: meas,
                    });
                }
            }
        }
        this.subSpaces = subspaces;
        return this;
    }
    static getSpaceImpurity(dataSource, dimensions, measures) {
        let imp = 0;
        for (let mea of measures) {
            let fL = dataSource.map((r) => r[mea]);
            let pL = normalize(mapPositive(fL));
            let value = entropy(pL);
            imp += value;
        }
        imp /= measures.length;
        return imp;
    }
    exploreViewsPOC(viewSpaces = this.subSpaces) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = this;
            let ansSpace = [];
            for (let space of viewSpaces) {
                const { dimensions, measures } = space;
                const imp = viewStrength(context.dataSource, dimensions, measures);
                ansSpace.push({
                    impurity: imp,
                    significance: 1,
                    dimensions,
                    measures
                });
            }
            ansSpace.sort((a, b) => (b.impurity || 0) - (a.impurity || 0));
            return ansSpace;
        });
    }
    exploreViews(viewSpaces = this.subSpaces) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = this;
            const { measures: globalMeasures, fieldDictonary, dataSource } = context;
            let ansSpace = [];
            const globalCuboid = yield context.cube.getCuboid([]);
            const globalDist = yield globalCuboid.getAggregatedRows(globalMeasures, globalMeasures.map(() => 'dist'));
            for (let space of viewSpaces) {
                const { dimensions, measures } = space;
                const localCuboid = yield context.cube.getCuboid(dimensions);
                yield localCuboid.loadStateInCache();
                // FIXME: 这里相当于2次IO，可以做合并。
                const localDist = yield localCuboid.getAggregatedRows(measures, measures.map(() => 'dist'));
                const freqs = yield localCuboid.getAggregatedRows(measures, measures.map(() => 'count'));
                localCuboid.clearState();
                let totalEntLoss = 0;
                for (let mea of measures) {
                    let ent = 0;
                    if (globalDist.length > 0) {
                        ent = entropyAcc(globalDist[0][mea].filter(d => d > 0));
                    }
                    let conEnt = 0;
                    const totalCount = fieldDictonary.get(mea).features.size;
                    const distList = localDist.map((r, rIndex) => ({
                        // TODO: 讨论是否应当直接使用count
                        // props: 节省计算量
                        // cons: 强依赖于cube必须去计算count
                        // freq: r[mea].reduce((total, value) => total + value, 0),
                        freq: freqs[rIndex][mea],
                        dist: r[mea]
                    }));
                    distList.sort((a, b) => b.freq - a.freq);
                    for (let i = 0; i < distList.length; i++) {
                        if (i >= DEFAULT_BIN_NUM - 1)
                            break;
                        const subEnt1 = entropyAcc(distList[i].dist.filter(d => d > 0));
                        conEnt += (distList[i].freq / totalCount) * subEnt1;
                    }
                    const noiseGroup = new Array(DEFAULT_BIN_NUM).fill(0);
                    let noiseFre = 0;
                    for (let i = DEFAULT_BIN_NUM - 1; i < distList.length; i++) {
                        for (let j = 0; j < noiseGroup.length; j++) {
                            noiseGroup[j] += distList[i].dist[j];
                        }
                        noiseFre += distList[i].freq;
                    }
                    if (noiseFre > 0) {
                        conEnt += (noiseFre / totalCount) * entropyAcc(noiseGroup.filter(d => d > 0));
                    }
                    totalEntLoss += (ent - conEnt) / Math.log2(Math.min(DEFAULT_BIN_NUM, distList.length));
                }
                totalEntLoss /= measures.length;
                ansSpace.push({
                    dimensions,
                    measures,
                    significance: 1,
                    score: totalEntLoss,
                    impurity: totalEntLoss
                });
            }
            ansSpace.sort((a, b) => Number(b.impurity) - Number(a.impurity));
            return ansSpace;
        });
    }
    searchPointInterests(viewSpace) {
    }
    insightExtraction(viewSpaces = this.subSpaces) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = this;
            let ansSpace = [];
            for (let space of viewSpaces) {
                //    const t1 = performance.now();
                const { dimensions, measures } = space;
                let cube = context.cube;
                let cuboid = yield cube.getCuboid(dimensions);
                const aggData = yield cuboid.getAggregatedRows(measures, measures.map(() => 'sum'));
                //    const t2 = performance.now();
                const imp = VIEngine.getSpaceImpurity(aggData, dimensions, measures);
                const jobPool = [];
                this.workerCollection.each((iWorker, name) => {
                    // tslint:disable-next-line: no-shadowed-variable
                    const job = (iWorker, name) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            let iSpace = yield iWorker(aggData, dimensions, measures, context.fieldDictonary, context);
                            if (iSpace !== null) {
                                iSpace.type = name;
                                iSpace.impurity = imp;
                                ansSpace.push(iSpace);
                            }
                        }
                        catch (error) {
                            console.error("worker failed", { dimensions, measures, aggData }, error);
                        }
                    });
                    jobPool.push(job(iWorker, `${name}`));
                });
                yield Promise.all(jobPool);
                //    const t3 = performance.now();
                //    const per = Math.round(((t3 - t2) / (t3 - t1)) * 100);
            }
            context.insightSpaces = ansSpace;
            this.setInsightScores();
            this.insightSpaces.sort((a, b) => (a.score || 0) - (b.score || 0));
            return this.insightSpaces;
        });
    }
    // todo:
    setInsightScores() {
        const insightSpaces = this.insightSpaces;
        insightSpaces.forEach(space => {
            space.score = Number(space.impurity) / space.significance;
        });
        return this;
    }
    getFieldInfoInVis(insightSpace) {
        return __awaiter(this, void 0, void 0, function* () {
            const fieldsInVis = [];
            const cube = this.cube;
            const fieldDictonary = this.fieldDictonary;
            const { dimensions, measures } = insightSpace;
            for (let dim of dimensions) {
                const cuboid = yield cube.getCuboid([dim]);
                const aggData = yield cuboid.getAggregatedRows(measures, measures.map(() => 'sum'));
                let imp = 0;
                measures.forEach((mea) => {
                    let fL = aggData.map((r) => r[mea]);
                    let pL = normalize(mapPositive(fL));
                    let value = entropy(pL);
                    imp += value;
                });
                fieldsInVis.push(Object.assign(Object.assign({}, fieldDictonary.get(dim)), { impurity: imp }));
            }
            const dcuboid = yield cube.getCuboid(dimensions);
            const dAggData = yield dcuboid.getAggregatedRows(measures, measures.map(() => 'sum'));
            measures.forEach((mea) => {
                let fL = dAggData.map((r) => r[mea]);
                let pL = normalize(mapPositive(fL));
                let value = entropy(pL);
                fieldsInVis.push(Object.assign(Object.assign({}, fieldDictonary.get(mea)), { impurity: value }));
            });
            return fieldsInVis;
        });
    }
    getFieldInfoInVisBeta(insightSpace) {
        return __awaiter(this, void 0, void 0, function* () {
            const fieldsInVis = [];
            const cube = this.cube;
            const fieldDictonary = this.fieldDictonary;
            const { dimensions, measures } = insightSpace;
            dimensions.forEach((dim) => {
                const fd = fieldDictonary.get(dim);
                fieldsInVis.push(Object.assign(Object.assign({}, fd), { impurity: fd.features.entropy }));
            });
            const cuboid = yield cube.getCuboid(dimensions);
            const aggs = yield cuboid.getAggregatedRows(measures, measures.map(() => 'dist'));
            const freqs = yield cuboid.getAggregatedRows(measures, measures.map(() => 'count'));
            measures.forEach((mea) => {
                let conEnt = 0;
                const totalCount = fieldDictonary.get(mea).features.size;
                const distList = aggs.map((r, rIndex) => ({
                    // TODO: 讨论是否应当直接使用count
                    // props: 节省计算量
                    // cons: 强依赖于cube必须去计算count
                    // freq: r[mea].reduce((total, value) => total + value, 0),
                    freq: freqs[rIndex][mea],
                    dist: r[mea]
                }));
                distList.sort((a, b) => b.freq - a.freq);
                for (let i = 0; i < distList.length; i++) {
                    if (i >= DEFAULT_BIN_NUM - 1)
                        break;
                    const subEnt1 = entropyAcc(distList[i].dist.filter(d => d > 0));
                    conEnt += (distList[i].freq / totalCount) * subEnt1;
                }
                const noiseGroup = new Array(DEFAULT_BIN_NUM).fill(0);
                let noiseFre = 0;
                for (let i = DEFAULT_BIN_NUM - 1; i < distList.length; i++) {
                    for (let j = 0; j < noiseGroup.length; j++) {
                        noiseGroup[j] += distList[i].dist[j];
                    }
                    noiseFre += distList[i].freq;
                }
                if (noiseFre > 0) {
                    conEnt += (noiseFre / totalCount) * entropyAcc(noiseGroup.filter(d => d > 0));
                }
                const fd = fieldDictonary.get(mea);
                fieldsInVis.push(Object.assign(Object.assign({}, fd), { impurity: conEnt }));
            });
            return fieldsInVis;
        });
    }
    specification(insightSpace) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dimensions, measures } = insightSpace;
            const fieldsInVis = yield this.getFieldInfoInVisBeta(insightSpace);
            const cuboid = yield this.cube.getCuboid(dimensions);
            const dataView = yield cuboid.getAggregatedRows(measures, measures.map(() => 'sum'));
            return specification(fieldsInVis, dataView);
        });
    }
}
