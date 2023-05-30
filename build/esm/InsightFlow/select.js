"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldSelectByPercent = exports.autoFieldSelect = void 0;
var FULL_FIELD_USE_THRESHOLD = 25;
var PARTS_FIELD_THRESHOLD = 500;
var fixOmiga = Math.round(Math.pow((100 - FULL_FIELD_USE_THRESHOLD), 2) / PARTS_FIELD_THRESHOLD);
function autoFieldSelect(_fields) {
    var x = _fields.length;
    var fields = __spreadArray([], __read(_fields), false);
    fields.sort(function (fa, fb) { return fa.features.entropy - fb.features.entropy; });
    if (x < FULL_FIELD_USE_THRESHOLD)
        return fields;
    if (x < PARTS_FIELD_THRESHOLD) {
        return fields.slice(0, Math.round(Math.sqrt(fixOmiga * (x - FULL_FIELD_USE_THRESHOLD)) + FULL_FIELD_USE_THRESHOLD));
    }
    else {
        return fields.slice(0, 100);
    }
}
exports.autoFieldSelect = autoFieldSelect;
function fieldSelectByPercent(_fields, percent) {
    var x = _fields.length;
    var fields = __spreadArray([], __read(_fields), false);
    fields.sort(function (fa, fb) { return fa.features.entropy - fb.features.entropy; });
    return fields.slice(0, Math.round(x * percent));
}
exports.fieldSelectByPercent = fieldSelectByPercent;
