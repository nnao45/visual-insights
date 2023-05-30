var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getCombination } from "../../statistics";
export function getCombinationFromClusterGroups(groups, limitSize) {
    let fieldSets = [];
    for (let group of groups) {
        let combineFieldSet = getCombination(group, limitSize.MIN, limitSize.MAX);
        fieldSets.push(...combineFieldSet);
    }
    return fieldSets;
}
export class CHStatistics {
    constructor(chUtils) {
        this.chiSquared = (viewName, col1, col2) => __awaiter(this, void 0, void 0, function* () {
            const chis = yield this.utils.query(`with col1Totals as (select \`${col1}\` as col1, count(*) as values_count from ${viewName} group by \`${col1}\`),
            col2Totals as (select \`${col2}\` as col2, count(*) as values_count from ${viewName} group by \`${col2}\`),
            total as (select count(*) as values_count from ${viewName}),
            colPairs as (select \`${col1}\` as col1, \`${col2}\` as col2, count(*) as values_count from ${viewName} group by \`${col1}\`, \`${col2}\`)
            select sum(value) from (select pow(col1Totals.values_count * (col2Totals.values_count / total.values_count) - colPairs.values_count, 2) / (col1Totals.values_count * (col2Totals.values_count / total.values_count)) as value
            from colPairs, total 
            inner join col1Totals on colPairs.col1 = col1Totals.col1
            inner join col2Totals on colPairs.col2 = col2Totals.col2);
        `);
            return Number(chis);
        });
        this.cramersV = (viewName, col1, col2) => __awaiter(this, void 0, void 0, function* () {
            const chis = yield this.chiSquared(viewName, col1, col2);
            const rawViewInfo = yield this.utils.query(`select count(*), uniq(\`${col1}\`), uniq(\`${col2}\`) from ${viewName}`);
            const viewInfo = rawViewInfo.slice(0, -1).split('\t').map(v => parseInt(v));
            const V = Math.sqrt(chis / (viewInfo[0] * Math.min(viewInfo[1] - 1, viewInfo[2] - 1)));
            return V;
        });
        this.pearsonCC = (viewName, col1, col2) => __awaiter(this, void 0, void 0, function* () {
            const rawValue = yield this.utils.query(`select corr(\`${col1}\`, \`${col2}\`) from ${viewName}`);
            return Number(rawValue);
        });
        this.getSpaceImpurity = (viewName, dimensions, measures) => __awaiter(this, void 0, void 0, function* () {
            // try count_imp * sum(or other)_imp;
            const res = yield this.utils.query(`with agg_view as (select count(*) as values_count, ${measures.map(m => `sum(\`${m}\`) as \`sum_${m}\``).join(',')} from ${viewName} group by ${dimensions.map(d => `\`${d}\``).join(',')}),
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
            // score *= imps[0];
            return score;
        });
        this.utils = chUtils;
    }
    getCombinationFromClusterGroups(groups, limitSize) {
        let fieldSets = [];
        for (let group of groups) {
            let combineFieldSet = getCombination(group, limitSize.MIN, limitSize.MAX);
            fieldSets.push(...combineFieldSet);
        }
        return fieldSets;
    }
}
