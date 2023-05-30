import { encoding, geomTypes } from "../../InsightFlow/specification/encoding";
export function pureSpec(fields, viewSize = 10) {
    let rankedFields = fields.sort((a, b) => a.impurity - b.impurity);
    let spec = encoding(rankedFields);
    const dimensions = new Set(fields.filter(f => f.analyticType === 'dimension').map(f => f.key));
    const measures = new Set(fields.filter(f => f.analyticType === 'measure').map(f => f.key));
    // todo: design a better rule for choosing geom type.
    if (spec.position && spec.position.length === 2) {
        if ((dimensions.has(spec.position[0]) && measures.has(spec.position[1])) ||
            (dimensions.has(spec.position[1]) && measures.has(spec.position[0]))) {
            const dimIndex = dimensions.has(spec.position[0]) ? 0 : 1;
            const dim = spec.position[dimIndex];
            const mea = spec.position[(dimIndex + 1) % 2];
            spec.position = [dim, mea];
            const originDimField = fields.find((f) => f.key === dim);
            const dimCardinality = originDimField ? originDimField.features.unique : 0;
            spec.geomType = ["interval", "line", "area"].filter((geom) => {
                return dimCardinality >= geomTypes[geom][0] && dimCardinality <= geomTypes[geom][1];
            });
            if (originDimField.semanticType === 'nominal') {
                spec.geomType = ["interval"];
            }
        }
        else {
            // TODO: 重叠程度检测判断 (viewSize = 10的原因，临时设定)
            // ['point', 'path', 'heatmap']
            spec.geomType = ["point", "density"].filter((geom) => {
                return viewSize >= geomTypes[geom][0] && viewSize <= geomTypes[geom][1];
            });
        }
    }
    return { schema: spec };
}
