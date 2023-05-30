"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pureSpec = void 0;
var encoding_1 = require("../../InsightFlow/specification/encoding");
function pureSpec(fields, viewSize) {
    if (viewSize === void 0) { viewSize = 10; }
    var rankedFields = fields.sort(function (a, b) { return a.impurity - b.impurity; });
    var spec = (0, encoding_1.encoding)(rankedFields);
    var dimensions = new Set(fields.filter(function (f) { return f.analyticType === 'dimension'; }).map(function (f) { return f.key; }));
    var measures = new Set(fields.filter(function (f) { return f.analyticType === 'measure'; }).map(function (f) { return f.key; }));
    // todo: design a better rule for choosing geom type.
    if (spec.position && spec.position.length === 2) {
        if ((dimensions.has(spec.position[0]) && measures.has(spec.position[1])) ||
            (dimensions.has(spec.position[1]) && measures.has(spec.position[0]))) {
            var dimIndex = dimensions.has(spec.position[0]) ? 0 : 1;
            var dim_1 = spec.position[dimIndex];
            var mea = spec.position[(dimIndex + 1) % 2];
            spec.position = [dim_1, mea];
            var originDimField = fields.find(function (f) { return f.key === dim_1; });
            var dimCardinality_1 = originDimField ? originDimField.features.unique : 0;
            spec.geomType = ["interval", "line", "area"].filter(function (geom) {
                return dimCardinality_1 >= encoding_1.geomTypes[geom][0] && dimCardinality_1 <= encoding_1.geomTypes[geom][1];
            });
            if (originDimField.semanticType === 'nominal') {
                spec.geomType = ["interval"];
            }
        }
        else {
            // TODO: 重叠程度检测判断 (viewSize = 10的原因，临时设定)
            // ['point', 'path', 'heatmap']
            spec.geomType = ["point", "density"].filter(function (geom) {
                return viewSize >= encoding_1.geomTypes[geom][0] && viewSize <= encoding_1.geomTypes[geom][1];
            });
        }
    }
    return { schema: spec };
}
exports.pureSpec = pureSpec;
