"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./utils/index");
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
var geomTypes = {
    interval: [0, 10],
    line: [11, Infinity],
    area: [11, Infinity],
    point: [0, 1000],
    path: [0, 100],
    density: [1001, Infinity]
};
function findBestField(type, fieldRankList) {
    for (var i = fieldRankList.length - 1; i >= 0; i--) {
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
    var spec = {};
    var visualElements = getVisualElements();
    var fieldRankList = dimFields.map(function (field) {
        return __assign(__assign({}, field), { choosen: false });
    });
    var priority = [
        ['quantitative', ['position', 'size', 'color', 'highFacets', 'opacity', 'page', 'filter']],
        ['temporal', ['position', 'page', 'filter']],
        ['ordinal', ['position', 'color', 'opacity', 'facets', 'size', 'page', 'filter', 'highFacets']],
        ['nominal', ['position', 'color', 'facets', 'shape', 'page', 'filter', 'hightFacets']],
    ];
    var fieldLeft = fieldRankList.length;
    for (var typeIndex = 0; typeIndex < priority.length && fieldLeft > 0; typeIndex++) {
        var type = priority[typeIndex][0];
        var channelList = priority[typeIndex][1];
        for (var i = 0; i < channelList.length && fieldLeft > 0; i++) {
            var channel = channelList[i];
            var field = void 0;
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
    var rankedFields = dimScores.sort(function (a, b) { return a[1] - b[1]; }).map(function (dim) { return dim[3]; });
    var spec = aestheticMapping(rankedFields);
    // todo: design a better rule for choosing geom type.
    if (spec.position && spec.position.length === 2) {
        if ((dimensions.includes(spec.position[0]) && measures.includes(spec.position[1])) ||
            (dimensions.includes(spec.position[1]) && measures.includes(spec.position[0]))) {
            var dimIndex = dimensions.includes(spec.position[0]) ? 0 : 1;
            var dim = spec.position[dimIndex];
            var mea = spec.position[(dimIndex + 1) % 2];
            spec.position = [dim, mea];
            var dimMembers_1 = (0, index_1.memberCount)(aggData, dim);
            spec.geomType = ['interval', 'line', 'area'].filter(function (geom) {
                return dimMembers_1.length >= geomTypes[geom][0] && dimMembers_1.length <= geomTypes[geom][1];
            });
            var x = dimScores.find(function (dim) { return dim[0] === spec.position[0]; })[3];
            var y = dimScores.find(function (dim) { return dim[0] === spec.position[1]; })[3];
            if (x.type === 'nominal' || y.type === 'nominal') {
                spec.geomType = ['interval'];
            }
        }
        else {
            // ['point', 'path', 'heatmap']
            spec.geomType = ['point', 'density'].filter(function (geom) {
                return aggData.length >= geomTypes[geom][0] && aggData.length <= geomTypes[geom][1];
            });
        }
    }
    return { schema: spec, aggData: aggData };
}
exports.default = specification;
