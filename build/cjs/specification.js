import { 
// isFieldCategory,
// isFieldContinous,
memberCount } from './utils/index';
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
const geomTypes = {
    interval: [0, 10],
    line: [11, Infinity],
    area: [11, Infinity],
    point: [0, 1000],
    path: [0, 100],
    density: [1001, Infinity]
};
function findBestField(type, fieldRankList) {
    for (let i = fieldRankList.length - 1; i >= 0; i--) {
        if (fieldRankList[i].type === type && !fieldRankList[i].choosen) {
            return fieldRankList[i];
        }
    }
    return false;
}
/**
 *
 * @param dimFields ranked dimension by entropy. asc
 * todo: not clear enough implementation for using asc and desc
 */
function aestheticMapping(dimFields) {
    let spec = {};
    let visualElements = getVisualElements();
    let fieldRankList = dimFields.map(field => {
        return Object.assign(Object.assign({}, field), { choosen: false });
    });
    const priority = [
        ['quantitative', ['position', 'size', 'color', 'highFacets', 'opacity', 'page', 'filter']],
        ['temporal', ['position', 'page', 'filter']],
        ['ordinal', ['position', 'color', 'opacity', 'facets', 'size', 'page', 'filter', 'highFacets']],
        ['nominal', ['position', 'color', 'facets', 'shape', 'page', 'filter', 'hightFacets']],
    ];
    let fieldLeft = fieldRankList.length;
    for (let typeIndex = 0; typeIndex < priority.length && fieldLeft > 0; typeIndex++) {
        let type = priority[typeIndex][0];
        let channelList = priority[typeIndex][1];
        for (let i = 0; i < channelList.length && fieldLeft > 0; i++) {
            let channel = channelList[i];
            let field;
            while (visualElements[channel] > 0 && (field = findBestField(type, fieldRankList))) {
                if (typeof spec[channel] === 'undefined') {
                    spec[channel] = [];
                }
                spec[channel].push(field.name);
                visualElements[channel]--;
                fieldLeft--;
                field.choosen = true;
            }
        }
    }
    return spec;
}
// todo (P1):
// don't use dimScores: FieldImpurity.
// it's a structure with redundency design.
function specification(dimScores, aggData, dimensions, measures) {
    let rankedFields = dimScores.sort((a, b) => a[1] - b[1]).map(dim => dim[3]);
    let spec = aestheticMapping(rankedFields);
    // todo: design a better rule for choosing geom type.
    if (spec.position && spec.position.length === 2) {
        if ((dimensions.includes(spec.position[0]) && measures.includes(spec.position[1])) ||
            (dimensions.includes(spec.position[1]) && measures.includes(spec.position[0]))) {
            const dimIndex = dimensions.includes(spec.position[0]) ? 0 : 1;
            const dim = spec.position[dimIndex];
            const mea = spec.position[(dimIndex + 1) % 2];
            spec.position = [dim, mea];
            const dimMembers = memberCount(aggData, dim);
            spec.geomType = ['interval', 'line', 'area'].filter(geom => {
                return dimMembers.length >= geomTypes[geom][0] && dimMembers.length <= geomTypes[geom][1];
            });
            let x = dimScores.find(dim => dim[0] === spec.position[0])[3];
            let y = dimScores.find(dim => dim[0] === spec.position[1])[3];
            if (x.type === 'nominal' || y.type === 'nominal') {
                spec.geomType = ['interval'];
            }
        }
        else {
            // ['point', 'path', 'heatmap']
            spec.geomType = ['point', 'density'].filter(geom => {
                return aggData.length >= geomTypes[geom][0] && aggData.length <= geomTypes[geom][1];
            });
        }
    }
    return { schema: spec, aggData };
}
export default specification;
