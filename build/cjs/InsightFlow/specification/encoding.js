export const geomTypes = {
    interval: [0, 10],
    line: [11, Infinity],
    area: [11, Infinity],
    point: [0, 1000],
    path: [0, 100],
    density: [1001, Infinity],
};
function getVisualElements() {
    return {
        position: 2,
        color: 1,
        size: 1,
        shape: 1,
        opacity: 1,
        facets: 2,
        page: 1,
        filter: 1,
        highFacets: 1000
    };
}
function findBestField(type, fieldRankList) {
    for (let i = fieldRankList.length - 1; i >= 0; i--) {
        if (fieldRankList[i].semanticType === type && !fieldRankList[i].choosen) {
            return fieldRankList[i];
        }
    }
    return false;
}
export function encoding(fields) {
    let spec = {};
    let visualElements = getVisualElements();
    let fieldRankList = fields.map((field) => {
        return Object.assign(Object.assign({}, field), { choosen: false });
    });
    const priority = [
        ["quantitative", ["x", "y", "size", "color", "opacity", "rows", "columns", "filter"]],
        ["temporal", ["x", "y", "size", "opacity", "filter"]],
        ["ordinal", ["x", "y", "color", "opacity", "rows", "columns", "size", "filter", "highFacets"]],
        ["nominal", ["x", "y", "color", "rows", "columns", "shape", "filter", "hightFacets"]],
    ];
    let fieldLeft = fieldRankList.length;
    for (let typeIndex = 0; typeIndex < priority.length && fieldLeft > 0; typeIndex++) {
        let type = priority[typeIndex][0];
        let channelList = priority[typeIndex][1];
        for (let i = 0; i < channelList.length && fieldLeft > 0; i++) {
            let channel = channelList[i];
            let field;
            while (visualElements[channel] > 0 && (field = findBestField(type, fieldRankList))) {
                if (channel === 'highFacets') {
                    if (typeof spec[channel] === "undefined")
                        spec[channel] = [];
                    spec[channel].push(field.key);
                }
                else {
                    spec[channel] = field.key;
                }
                visualElements[channel]--;
                fieldLeft--;
                field.choosen = true;
            }
        }
    }
    return spec;
}
export function specification(fields, dataView) {
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
            // ['point', 'path', 'heatmap']
            spec.geomType = ["point", "density"].filter((geom) => {
                return dataView.length >= geomTypes[geom][0] && dataView.length <= geomTypes[geom][1];
            });
        }
    }
    else {
        spec.geomType = ["point"];
    }
    return { schema: spec, dataView };
}
