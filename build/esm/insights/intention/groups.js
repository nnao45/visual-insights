"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupIntention = void 0;
var knn_1 = require("../../ml/classification/knn");
var GroupIntention = /** @class */ (function (_super) {
    __extends(GroupIntention, _super);
    function GroupIntention() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupIntention.prototype.getTargetValuePercent = function (targets, targetRecord, neighbors) {
        var ans = [];
        targets.forEach(function (target, index) {
            var sameCount = 0;
            neighbors.forEach(function (nei) {
                if (nei[target] === targetRecord[target]) {
                    sameCount++;
                }
            });
            ans.push(sameCount / neighbors.length);
        });
        return ans;
    };
    GroupIntention.prototype.getSignificance = function (features, targets) {
        var _this = this;
        var ans = 0;
        this.normalizedDataSource.forEach(function (record) {
            var neighbors = _this.getNeighbors(record, features);
            var percents = _this.getTargetValuePercent(targets, record, neighbors);
            var sig = 0;
            percents.forEach(function (per) {
                sig += per;
            });
            sig /= percents.length;
            ans += sig;
        });
        ans /= this.normalizedDataSource.length;
        return ans;
    };
    return GroupIntention;
}(knn_1.KNN));
exports.GroupIntention = GroupIntention;
