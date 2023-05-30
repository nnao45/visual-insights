var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Outier } from "../../ml";
export const IForestOutlierWorker = (aggData, dimensions, measures) => __awaiter(void 0, void 0, void 0, function* () {
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
    dimensions.concat(measures).forEach((mea) => {
        des[mea] = aggData[maxIndex][mea];
    });
    return {
        dimensions,
        measures,
        significance: score,
        description: des,
    };
});
