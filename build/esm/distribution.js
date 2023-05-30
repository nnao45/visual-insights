"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUniformDistribution = void 0;
var index_1 = require("./utils/index");
function isUniformDistribution(dataSource, field) {
    var members = (0, index_1.memberCount)(dataSource, field);
    return members.every(function (member) { return member[1] === 1; });
}
exports.isUniformDistribution = isUniformDistribution;
