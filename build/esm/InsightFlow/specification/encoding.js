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
exports.specification = exports.encoding = exports.geomTypes = void 0;
exports.geomTypes = {
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
    for (var i = fieldRankList.length - 1; i >= 0; i--) {
        if (fieldRankList[i].semanticType === type && !fieldRankList[i].choosen) {
            return fieldRankList[i];
        }
    }
    return false;
}
function encoding(fields) {
    var spec = {};
    var visualElements = getVisualElements();
    var fieldRankList = fields.map(function (field) {
        return __assign(__assign({}, field), { choosen: false });
    });
    var priority = [
        ["quantitative", ["x", "y", "size", "color", "opacity", "rows", "columns", "filter"]],
        ["temporal", ["x", "y", "size", "opacity", "filter"]],
        ["ordinal", ["x", "y", "color", "opacity", "rows", "columns", "size", "filter", "highFacets"]],
        ["nominal", ["x", "y", "color", "rows", "columns", "shape", "filter", "hightFacets"]],
    ];
    var fieldLeft = fieldRankList.length;
    for (var typeIndex = 0; typeIndex < priority.length && fieldLeft > 0; typeIndex++) {
        var type = priority[typeIndex][0];
        var channelList = priority[typeIndex][1];
        for (var i = 0; i < channelList.length && fieldLeft > 0; i++) {
            var channel = channelList[i];
            var field = void 0;
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
exports.encoding = encoding;
function specification(fields, dataView) {
    var rankedFields = fields.sort(function (a, b) { return a.impurity - b.impurity; });
    var spec = encoding(rankedFields);
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
                return dimCardinality_1 >= exports.geomTypes[geom][0] && dimCardinality_1 <= exports.geomTypes[geom][1];
            });
            if (originDimField.semanticType === 'nominal') {
                spec.geomType = ["interval"];
            }
        }
        else {
            // ['point', 'path', 'heatmap']
            spec.geomType = ["point", "density"].filter(function (geom) {
                return dataView.length >= exports.geomTypes[geom][0] && dataView.length <= exports.geomTypes[geom][1];
            });
        }
    }
    else {
        spec.geomType = ["point"];
    }
    return { schema: spec, dataView: dataView };
}
exports.specification = specification;
