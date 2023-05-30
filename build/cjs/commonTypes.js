export var IStorageMode;
(function (IStorageMode) {
    IStorageMode["LocalCache"] = "local_cahce";
    IStorageMode["LocalDisk"] = "local_disk";
})(IStorageMode || (IStorageMode = {}));
export var ICubeStorageManageMode;
(function (ICubeStorageManageMode) {
    ICubeStorageManageMode["LocalCache"] = "local_cache";
    ICubeStorageManageMode["LocalDisk"] = "local_disk";
    ICubeStorageManageMode["LocalMix"] = "local_mix";
})(ICubeStorageManageMode || (ICubeStorageManageMode = {}));
export var DefaultIWorker;
(function (DefaultIWorker) {
    DefaultIWorker["outlier"] = "default_outlier";
    DefaultIWorker["cluster"] = "default_group";
    DefaultIWorker["trend"] = "default_trend";
})(DefaultIWorker || (DefaultIWorker = {}));
