var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { oneDLinearRegression } from '../../statistics/index';
export const LRTrendWorker = (aggData, dimensions, measures) => __awaiter(void 0, void 0, void 0, function* () {
    if (dimensions.length !== 1)
        return null;
    let orderedData = [...aggData];
    orderedData.sort((a, b) => {
        if (a[dimensions[0]] > b[dimensions[0]])
            return 1;
        if (a[dimensions[0]] === b[dimensions[0]])
            return 0;
        else
            return -1;
    });
    let sig = 0;
    for (let mea of measures) {
        let linearModel = new oneDLinearRegression(orderedData, dimensions[0], mea);
        linearModel.normalizeDimensions(dimensions);
        sig += linearModel.significance();
    }
    sig /= measures.length;
    return {
        dimensions,
        measures,
        significance: sig
    };
});
