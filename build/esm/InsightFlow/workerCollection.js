"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightWorkerCollection = void 0;
var IForestOutlier_1 = require("../insights/workers/IForestOutlier");
// import { KNNClusterWorker } from './workers/KNNCluster';
var LRTrend_1 = require("../insights/workers/LRTrend");
var commonTypes_1 = require("../commonTypes");
var insights_1 = require("../insights");
/**
 * collection of insight workers. it helps to manage all the workers in a centralized way.
 */
var InsightWorkerCollection = /** @class */ (function () {
    function InsightWorkerCollection() {
        this.workers = new Map();
    }
    InsightWorkerCollection.prototype.register = function (name, iWorker) {
        if (this.workers.has(name)) {
            throw new Error("There has been a worker named: ".concat(name, " already."));
        }
        else {
            this.workers.set(name, [true, iWorker]);
        }
    };
    /**
     * set a existed worker's status.
     * @param name insight worker's name used for register.
     * @param status whether the worker should be used.
     */
    InsightWorkerCollection.prototype.enable = function (name, status) {
        if (!this.workers.has(name)) {
            throw new Error("Intention Worker \"".concat(name, "\" does not exist."));
        }
        else {
            var iWorkerWithStatus = this.workers.get(name);
            iWorkerWithStatus[0] = status;
            this.workers.set(name, iWorkerWithStatus);
        }
    };
    /**
     * enumerate all enabled insight workers.
     * @param func (what is going to be done with the given worker)
     */
    InsightWorkerCollection.prototype.each = function (func) {
        var e_1, _a;
        try {
            for (var _b = __values(this.workers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_1 = _d[0], iWorker = _d[1];
                if (iWorker[0]) {
                    func(iWorker[1], name_1);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    InsightWorkerCollection.init = function (props) {
        if (props === void 0) { props = { withDefaultIWorkers: true }; }
        var _a = props.withDefaultIWorkers, withDefaultIWorkers = _a === void 0 ? true : _a;
        if (!InsightWorkerCollection.colletion) {
            InsightWorkerCollection.colletion = new InsightWorkerCollection();
            if (withDefaultIWorkers) {
                InsightWorkerCollection.colletion.register(commonTypes_1.DefaultIWorker.outlier, IForestOutlier_1.IForestOutlierWorker);
                InsightWorkerCollection.colletion.register(commonTypes_1.DefaultIWorker.cluster, insights_1.KNNClusterWorker);
                InsightWorkerCollection.colletion.register(commonTypes_1.DefaultIWorker.trend, LRTrend_1.LRTrendWorker);
            }
        }
        Object.values(commonTypes_1.DefaultIWorker).forEach(function (workerName) {
            InsightWorkerCollection.colletion.enable(workerName, withDefaultIWorkers);
        });
        return InsightWorkerCollection.colletion;
    };
    return InsightWorkerCollection;
}());
exports.InsightWorkerCollection = InsightWorkerCollection;
