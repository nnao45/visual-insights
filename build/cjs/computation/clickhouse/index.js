var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { dbDataType2DataType, inferAnalyticTypeFromDataType, inferSemanticTypeFromDataType, parseTable } from "../parser";
import { DEFAULT_BIN_NUM } from "../../constant";
import { CHDataGraph } from "./dataGraph";
import { CHStatistics, getCombinationFromClusterGroups } from "./statistics";
import { getCombination } from "../../statistics";
import { pureSpec } from "./specification";
import { CHUtils } from "./utils";
const BIN_PREFIX = 'bin_';
const MIN_QUAN_MEMBER_SIZE = 50;
function createBins(range, groupNumber) {
    const binRanges = [];
    const binSize = (range[1] - range[0]) / groupNumber;
    for (let i = 0; i < groupNumber; i++) {
        binRanges.push([
            range[0] + i * binSize,
            range[0] + (i + 1) * binSize
        ]);
    }
    return binRanges;
}
export class ClickHouseEngine {
    constructor() {
        this.rawFields = [];
        this.fields = [];
        this.dataViewName = null;
        this.dataGraph = null;
        this.dataViewMetas = [];
        this.insightSpaces = [];
        this.dbMetas = [];
        this.features = { size: 0 };
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
        this.utils = new CHUtils();
        this.statistics = new CHStatistics(this.utils);
    }
    get dimensions() {
        return this.fields.filter(f => f.analyticType === 'dimension').map(f => f.key);
    }
    get measures() {
        return this.fields.filter(f => f.analyticType === 'measure').map(f => f.key);
    }
    setRawFields(fields) {
        this.rawFields = fields;
    }
    query(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.query(sql);
        });
    }
    queryw(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.queryw(sql);
        });
    }
    loadData(viewName) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataStr = yield this.query(`SELECT * from ${viewName};`);
            const metas = yield this.getFieldMetas(viewName);
            this.dbMetas = metas;
            const data = parseTable(dataStr, metas);
            return data;
        });
    }
    getFieldMetas(viewName) {
        return __awaiter(this, void 0, void 0, function* () {
            const metaRaw = yield this.query(`DESC ${viewName}`);
            return metaRaw.substr(0, metaRaw.length - 1).split('\n').map(fr => {
                const infos = fr.split('\t');
                return {
                    fid: infos[0],
                    dataType: infos[1]
                };
            });
        });
    }
    buildFieldsSummary(viewName) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseMetas = yield this.getFieldMetas(viewName);
            this.dbMetas = baseMetas;
            const rawColUniques = yield this.query(`SELECT ${baseMetas.map(m => `uniq(\`${m.fid}\`)`).join(',')} FROM ${viewName};`);
            const colUniques = rawColUniques.split('\t').map(n => parseInt(n));
            const viewSize = parseInt(yield this.query(`SELECT COUNT(*) FROM ${viewName};`));
            this.features.size = viewSize;
            const summary = [];
            for (let i = 0; i < baseMetas.length; i++) {
                let maxEntropy = Math.log2(colUniques[i]);
                let entropy = Infinity;
                if (colUniques[i] === viewSize) {
                    entropy = maxEntropy;
                }
                else {
                    // rawfl: raw frequency list (count of members of a column)
                    const rawEnt = yield this.query(`with frequency_list as (SELECT COUNT(*) as frequency FROM ${viewName} GROUP BY \`${baseMetas[i].fid}\`),
                total as (select sum(frequency) as total from frequency_list),
                pb_list as (select (frequency_list.frequency / total.total) as pb from frequency_list, total) 
                SELECT SUM(-pb * log2(pb)) FROM pb_list`);
                    entropy = Number(rawEnt);
                }
                const dataType = dbDataType2DataType(baseMetas[i].dataType);
                summary.push({
                    key: baseMetas[i].fid,
                    name: baseMetas[i].fid,
                    analyticType: inferAnalyticTypeFromDataType(dataType),
                    semanticType: inferSemanticTypeFromDataType(dataType),
                    dataType,
                    features: {
                        entropy,
                        maxEntropy,
                        unique: colUniques[i],
                        size: viewSize,
                        max: 0,
                        min: 0
                    }
                });
            }
            return summary;
        });
    }
    uvsView(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            const VIEW_NAME = 'test_view';
            if (this.rawFields.length === 0) {
                this.rawFields = yield this.buildFieldsSummary(tableName);
            }
            const viewFields = yield this.featureTransform(tableName, VIEW_NAME);
            const fields = [];
            for (let i = 0; i < this.rawFields.length; i++) {
                const rawField = this.rawFields[i];
                if (rawField.analyticType === 'dimension') {
                    if (rawField.semanticType === 'quantitative' && rawField.features.unique > MIN_QUAN_MEMBER_SIZE) {
                        // fixme 这里对应字段判断做的不好。扩展性差。
                        const relativeViewField = viewFields.find(vf => vf.key === `${BIN_PREFIX}`);
                        if (relativeViewField) {
                            fields.push(Object.assign(Object.assign({}, relativeViewField), { features: Object.assign({}, relativeViewField.features) }));
                        }
                        continue;
                    }
                }
                if (rawField.semanticType === 'quantitative') {
                    const relativeViewField = viewFields.find(vf => vf.key === `${BIN_PREFIX}${rawField.key}`);
                    const mergedField = Object.assign(Object.assign({}, rawField), { features: Object.assign({}, rawField.features) });
                    if (relativeViewField) {
                        mergedField.features.entropy = relativeViewField.features.entropy;
                        mergedField.features.maxEntropy = relativeViewField.features.maxEntropy;
                    }
                    fields.push(mergedField);
                }
                else {
                    fields.push(Object.assign(Object.assign({}, rawField), { features: Object.assign({}, rawField.features) }));
                }
            }
            this.fields = fields;
            return fields;
        });
    }
    getContinuousRanges(viewName) {
        return __awaiter(this, void 0, void 0, function* () {
            const continuousFields = this.rawFields.filter(f => f.semanticType === 'quantitative');
            const rangeQuery = continuousFields.map(f => `min(\`${f.key}\`),max(\`${f.key}\`)`);
            const rawRanges = (yield this.query(`SELECT ${rangeQuery.join(',')} FROM ${viewName};`));
            const ranges = [];
            const statValues = rawRanges.substring(0, rawRanges.length - 1).split('\t').map(v => Number(v));
            for (let i = 0; i < continuousFields.length; i++) {
                ranges.push({
                    fid: continuousFields[i].key,
                    range: [statValues[i * 2], statValues[i * 2 + 1]]
                });
            }
            return ranges;
        });
    }
    binContinuousFields(tableName, groupNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const ranges = yield this.getContinuousRanges(tableName);
            // func getRange
            const binFields = ranges.map(r => {
                const bins = createBins(r.range, groupNumber);
                let binQuery = 'case ';
                binQuery += `when \`${r.fid}\` < ${bins[0][1]} then '(-Infinity, ${bins[0][1]})'\n`;
                for (let bi = 1; bi < bins.length - 1; bi++) {
                    binQuery += `when \`${r.fid}\` >= ${bins[bi][0]} and \`${r.fid}\` < ${bins[bi][1]} then '[${bins[bi][0]}, ${bins[bi][1]})'\n`;
                }
                binQuery += `when \`${r.fid}\` >= ${bins[bins.length - 1][0]} then '[${bins[bins.length - 1][0]}, Infinity)' end\n`;
                binQuery += `as \`${BIN_PREFIX}${r.fid}\``;
                return binQuery;
            });
            return binFields;
        });
    }
    featureTransform(tableName, viewName) {
        return __awaiter(this, void 0, void 0, function* () {
            const binFields = yield this.binContinuousFields(tableName, DEFAULT_BIN_NUM);
            yield this.queryw(`DROP VIEW IF EXISTS ${viewName};`);
            yield this.queryw(`CREATE VIEW IF NOT EXISTS ${viewName} AS SELECT *, ${binFields.join(',')} FROM ${tableName};`);
            // const raw = await this.query(`select * from ${viewName} limit 10;`);
            const viewFields = yield this.buildFieldsSummary(viewName);
            // todo: 调整bin字段的semanticType。
            // 讨论：1. 完善原始字段和转换后字段的查询匹配机制（要具备对不同类型转换的扩展性）
            // 2. 引入mutField中通配符机制，来直接使用指定类型，减少推断的计算量？但是推断好像是必须，无论是否指定，这里应该是个计算图关系，rath里有讨论过。
            this.dataViewName = viewName;
            return viewFields;
        });
    }
    buildDataGraph() {
        return __awaiter(this, void 0, void 0, function* () {
            const { dimensions, measures, dataViewName, statistics } = this;
            this.dataGraph = new CHDataGraph(dataViewName, dimensions, measures);
            yield this.dataGraph.computeDGraph(statistics.cramersV);
            yield this.dataGraph.computeMGraph(statistics.pearsonCC);
        });
    }
    clusterFields() {
        this.dataGraph.clusterDGraph();
        this.dataGraph.clusterMGraph();
        return this;
    }
    buildSubspaces(DIMENSION_NUM_IN_VIEW = this.DIMENSION_NUM_IN_VIEW, MEASURE_NUM_IN_VIEW = this.MEASURE_NUM_IN_VIEW) {
        const dimensionGroups = this.dataGraph.DClusters;
        const measureGroups = this.dataGraph.MClusters;
        const measureSets = getCombinationFromClusterGroups(measureGroups, MEASURE_NUM_IN_VIEW);
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
        this.dataViewMetas = subspaces;
        return this;
    }
    getSpaceImpurity(viewName, dimensions, measures) {
        return __awaiter(this, void 0, void 0, function* () {
            // try count_imp * sum(or other)_imp;
            const res = yield this.query(`with agg_view as (select count(*) as values_count, ${measures.map(m => `sum(\`${m}\`) as \`sum_${m}\``).join(',')} from ${viewName} group by ${dimensions.map(d => `\`${d}\``).join(',')}),
            abs_sum as (select sum(values_count) as abssum_values_count, ${measures.map(m => `sum(abs(\`sum_${m}\`)) as \`abssum_sum_${m}\``).join(',')} from agg_view),
            pb_view as (select agg_view.values_count / abs_sum.abssum_values_count as pb_count,
                ${measures.map(m => `abs(\`sum_${m}\`) / \`abssum_sum_${m}\` as \`pb_${m}\``).join(',')}
                from agg_view, abs_sum),
            safe_value as (select if(pb_count = 0, 0, -pb_count * log2(pb_count)) as safe_count, ${measures.map(m => `if(\`pb_${m}\` = 0, 0, -\`pb_${m}\` * log2(\`pb_${m}\`)) as \`safe_${m}\``).join(',')} from pb_view)
            select sum(safe_count), ${measures.map(m => `sum(\`safe_${m}\`)`).join(',')} from safe_value
        `);
            const imps = res.slice(0, -1).split('\t').map(n => Number(n));
            let score = 0;
            for (let i = 1; i < imps.length; i++) {
                score += imps[i];
            }
            return score;
        });
    }
    fastInsightRecommand(dataViewMetas = this.dataViewMetas) {
        return __awaiter(this, void 0, void 0, function* () {
            let ansSpace = [];
            for (let viewMeta of dataViewMetas) {
                const { dimensions, measures } = viewMeta;
                const imp = yield this.getSpaceImpurity(this.dataViewName, dimensions, measures);
                ansSpace.push({
                    dimensions,
                    measures,
                    impurity: imp,
                    score: imp,
                    significance: 1
                });
            }
            ansSpace.sort((a, b) => a.score - b.score);
            this.insightSpaces = ansSpace;
            return ansSpace;
        });
    }
    getFieldInfoInVis(insightSpace) {
        return __awaiter(this, void 0, void 0, function* () {
            const fieldsInVis = [];
            const { dimensions, measures } = insightSpace;
            for (let dim of dimensions) {
                const imp = yield this.statistics.getSpaceImpurity(this.dataViewName, [dim], measures);
                const originField = this.fields.find(f => f.key === dim);
                if (originField) {
                    fieldsInVis.push(Object.assign(Object.assign({}, originField), { impurity: imp }));
                }
            }
            for (let mea of measures) {
                const imp = yield this.statistics.getSpaceImpurity(this.dataViewName, dimensions, [mea]);
                const originField = this.fields.find(f => f.key === mea);
                if (originField) {
                    fieldsInVis.push(Object.assign(Object.assign({}, originField), { impurity: imp }));
                }
            }
            return fieldsInVis;
        });
    }
    queryAggDataView(dimensions, measures, aggregators, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const fieldsInView = dimensions.concat(measures).map(fk => this.dbMetas.find(f => f.fid === fk)).filter(f => Boolean(f));
            let sql = `select ${dimensions.map(f => `\`${f}\``).join(',')}, ${measures.map((f, fIndex) => `${aggregators[fIndex]}(\`${f}\`) as \`${f}\``).join(',')} from ${this.dataViewName} group by ${dimensions.map(f => `\`${f}\``).join(',')}`;
            if (typeof limit === 'number') {
                sql += ` limit ${limit}`;
            }
            const rawDataView = yield this.query(sql);
            const dataView = parseTable(rawDataView, fieldsInView);
            return dataView;
        });
    }
    queryDataView(dimensions, measures, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const fieldsInView = dimensions.concat(measures).map(fk => this.dbMetas.find(f => f.fid === fk)).filter(f => Boolean(f));
            let sql = `select ${dimensions.concat(measures).map(f => `\`${f}\``).join(',')} from ${this.dataViewName}`;
            if (typeof limit === 'number') {
                sql += ` limit ${limit}`;
            }
            const rawDataView = yield this.query(sql);
            const dataView = parseTable(rawDataView, fieldsInView);
            return dataView;
        });
    }
    specification(insightSpace) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dimensions, measures } = insightSpace;
            const fieldsInVis = yield this.getFieldInfoInVis(insightSpace);
            const aggData = yield this.queryAggDataView(dimensions, measures, measures.map(() => 'sum'));
            const spec = pureSpec(fieldsInVis);
            return Object.assign(Object.assign({}, spec), { detailSize: this.features.size, dataView: aggData });
        });
    }
    destroyView() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.queryw(`drop view if exists ${this.dataViewName}`);
        });
    }
}
