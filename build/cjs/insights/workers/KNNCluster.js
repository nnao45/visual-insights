var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GroupIntention } from '../intention/groups';
export const KNNClusterWorker = (aggData, dimensions, measures) => __awaiter(void 0, void 0, void 0, function* () {
    if (dimensions.length < 2)
        return null;
    let sig = 0;
    let groupIntention = new GroupIntention({
        dataSource: aggData,
        dimensions,
        measures,
        K: 8,
    });
    sig = groupIntention.getSignificance(measures.concat(dimensions.slice(0, -1)), dimensions.slice(-1));
    return {
        dimensions,
        measures,
        significance: sig,
    };
});
