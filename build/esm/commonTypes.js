"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultIWorker = exports.ICubeStorageManageMode = exports.IStorageMode = void 0;
var IStorageMode;
(function (IStorageMode) {
    IStorageMode["LocalCache"] = "local_cahce";
    IStorageMode["LocalDisk"] = "local_disk";
})(IStorageMode = exports.IStorageMode || (exports.IStorageMode = {}));
var ICubeStorageManageMode;
(function (ICubeStorageManageMode) {
    ICubeStorageManageMode["LocalCache"] = "local_cache";
    ICubeStorageManageMode["LocalDisk"] = "local_disk";
    ICubeStorageManageMode["LocalMix"] = "local_mix";
})(ICubeStorageManageMode = exports.ICubeStorageManageMode || (exports.ICubeStorageManageMode = {}));
var DefaultIWorker;
(function (DefaultIWorker) {
    DefaultIWorker["outlier"] = "default_outlier";
    DefaultIWorker["cluster"] = "default_group";
    DefaultIWorker["trend"] = "default_trend";
})(DefaultIWorker = exports.DefaultIWorker || (exports.DefaultIWorker = {}));
